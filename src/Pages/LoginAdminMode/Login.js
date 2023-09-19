import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Input, Alert, Form } from "antd";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  FacebookAuthProvider,
  TwitterAuthProvider,
  sendEmailVerification,
  signInWithPhoneNumber,
  RecaptchaVerifier,
} from "firebase/auth";
import firebaseConfig from "../../Firebase/Firebase";
import "./Login.css";
import { getFriendlyErrorMessage } from "../../Components/Utilities/Utilities";

const Login = () => {
  const [hideshowemail, setHideshowEmail] = useState(true);
  const [hideshowphone, setHideshowPhone] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationText, setNotificationText] = useState("Norification");
  const [isLoading, setIsLoading] = useState(false);
  const [notificationType, setNotificationType] = useState("error");
  const [email, setEmail] = useState("");
  const [pincode, setPincode] = useState("")
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(true);
  const [OTP, setOTP] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState();
  const [verificationId, setVerificationId] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [form] = Form.useForm();

  // New States
  const [rolesselected, setRolesselected] = useState("HAWKERS")

  function otpfield() {
    setOTP(!OTP);
  }

  const app = initializeApp(firebaseConfig);

  const auth = getAuth(app);

  useEffect(() => {
    if (showNotification) {
      setTimeout(() => {
        setShowNotification(false);
        setNotificationText("");

        if (
          notificationText === "Please verify your email before signing in."
        ) {
          window.location.href = "/resend_verification_email";
        }
      }, 2000);
    }
    return () => { };
  }, [showNotification]);

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      localStorage.setItem("access_token", token);
      const user = result.user;
      window.location.href = "/";
    } catch (error) {
      handleNotification(getFriendlyErrorMessage(error));
    }
  };

  const handleFacebookSignIn = async () => {
    const provider = new FacebookAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const token = result.user.accessToken;
      const user = result.user;
      localStorage.setItem("access_token", token);
      window.location.href = "/";
    } catch (error) {
      handleNotification(getFriendlyErrorMessage(error));
    }
  };

  const handleTwitterSignIn = async () => {
    const provider = new TwitterAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const token = result.user.accessToken;
      const user = result.user;
      localStorage.setItem("access_token", token);
      window.location.href = "/";
    } catch (error) {
      handleNotification(getFriendlyErrorMessage(error));
    }
  };
  const handleSignIn = () => {
    form
      .validateFields()
      .then(() => {
        let newEmail = OTP ? `${phoneNumber}@c2p.com` : email;
        setIsLoading(true);
        signInWithEmailAndPassword(auth, newEmail, password)
          .then((userCredential) => {
            const user = userCredential.user;
            if (OTP) {
              localStorage.setItem("access_token", user.accessToken);
              window.location.href = "/";
            }
            else {
              if (user.emailVerified) {
                localStorage.setItem("access_token", user.accessToken);
                window.location.href = "/";
              } else {
                handleNotification("Please verify your email before signing in.");
              }
            }
          })
          .catch((error) => {
            handleNotification(getFriendlyErrorMessage(error));
          });
      })
      .catch(() => { });
  };

  const handleSignUp = () => {
    form
      .validateFields()
      .then(() => {
        setIsLoading(true);
        createUserWithEmailAndPassword(auth, email, password)
          .then((credential) => {
            const user = credential.user;
            sendEmailVerification(user)
              .then(() => {
                handleNotification(
                  "Please check your email to verify your account.",
                  "success"
                );
                const userApi = {
                  firebase_relay: `${credential._tokenResponse.localId}`,
                  email: credential.user.email,
                  c2p_user_role: 1,
                  password: password,
                };
                // handleSubmit(userApi);
                setIsSignup(true);
              })
              .catch((error) => {
                handleNotification(getFriendlyErrorMessage(error));
              });
          })
          .catch((error) => {
            handleNotification(getFriendlyErrorMessage(error));
          });
      })
      .catch(() => { });
  };

  function handleClick() {
    setHideshowEmail(!hideshowemail);
  }
  function handleOtherClick() {
    setHideshowPhone(!hideshowphone);
  }

  const onChange = (checked) => {
    form.resetFields();
    setEmail("");
    setPassword("");
    setPhoneNumber(null);
  };

  function handleSubmit(userApi) {
    fetch("https://console.collect2play.com/api/auth/create_user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userApi),
    })
      .then((response) => {
        if (!response.ok) {
          handleNotification(response);
        }
        return response.json();
      })
      .then((data) => {
        if (data.type == "error")
          handleNotification(
            "Phone number has already been taken",
            "error"
          );
        else {
          handleNotification(
            "Successfully Signed Up, Please use credentials to login",
            "success"
          );
          setIsSignup(true);
        }
      })
      .catch((error) => {
        handleNotification(error);
      });
  }
  useEffect(() => {
    form.resetFields();
    setEmail("");
    setPassword("");
    setPhoneNumber(null);
  }, [isSignup]);

  function handleNotification(message, type = "error") {
    setNotificationText(message);
    setNotificationType(type);
    setShowNotification(true);
    setIsLoading(false);
  }

  function onCaptchVerify() {
    window.recaptchaVerifier = new RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "invisible",
        callback: (response) => {
          sendVerificationCode();
        },
        "expired-callback": () => { },
      },
      auth
    );
  }

  function sendVerificationCode() {
    onCaptchVerify();
    const appVerifier = window.recaptchaVerifier;
    const phoneTemp = "+" + phoneNumber;
    signInWithPhoneNumber(auth, phoneTemp, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        setVerificationId(confirmationResult);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async function registerUserWithPhoneNumber(verificationCode, password) {
    try {
      await form.validateFields() // Validate form fields

      const credential = await verificationId.confirm(verificationCode);
      const userApi = {
        firebase_relay: `${credential._tokenResponse.localId}`,
        phone_no: credential.user.phoneNumber,
        c2p_user_role: 1,
        password: password,
      };
      handleNotification(
        "You have successfully registered, Please use your credentials for login",
        "success"
      );
      setIsSignup(true);

      // handleSubmit(userApi);
    } catch (error) {
      if (!password || !phoneNumber || !verificationCode) {
        handleNotification("Please enter all the required values")
      }
      else {
        handleNotification(getFriendlyErrorMessage(error));

      }
    }
  }


  return (
    <>
      <div id="recaptcha-container"></div>
      <div className="login_Background">
        <div className="container">
          <div className="row Wrapper align-items-center justify-content-center">
            <div className="col-md-6 px-3">
              <h1 className="mb-4">CHOOSE ROLE</h1>
              <div className="justify-content-center mb-4 ms-5">
                <button onClick={() => setRolesselected("HAWKERS")} className={`ms-3 btn btn-${rolesselected === "HAWKERS" ? "primary position-relative" : "light"}`}>HAWKER 
                  {(rolesselected === "HAWKERS") && <p className="position-absolute top-50 start-50 translate-middle" style={{height: "0rem", fontSize: "0.8rem"}}>(Active)</p>}
                </button>
                <button onClick={() => setRolesselected("SUPERVISOR")} className={`ms-2 btn btn-${rolesselected === "SUPERVISOR" ? "primary position-relative" : "light"}`}>SUPERVISOR 
                  {(rolesselected === "SUPERVISOR") && <p className="position-absolute top-50 start-50 translate-middle" style={{height: "0rem", fontSize: "0.8rem"}}>(Active)</p>}
                </button>
                <button onClick={() => setRolesselected("MANAGER")} className={`ms-2 btn btn-${rolesselected === "MANAGER" ? "primary position-relative" : "light"}`}>MANAGER 
                  {(rolesselected === "MANAGER") && <p className="position-absolute top-50 start-50 translate-middle" style={{height: "0rem", fontSize: "0.8rem"}}>(Active)</p>}
                </button>
                <button onClick={() => setRolesselected("ADMIN")} className={`ms-2 btn btn-${rolesselected === "ADMIN" ? "primary position-relative" : "light"}`}>ADMIN 
                {(rolesselected === "ADMIN") && <p className="position-absolute top-50 start-50 translate-middle" style={{height: "0rem", fontSize: "0.8rem"}}>(Active)</p>}
                </button>
              </div>

              <p className="text-center text-white">{rolesselected} PIN</p>
                <form>
                  <input className="form-control mb-5" type="password" value={pincode} onChange={(e) => setPincode(e.target.value)}></input>
                </form>
                {/* <Link to="/home"> */}
                <div className="row justify-content-center mb-5">
                  <div className="col-sm-2 col-md-2 col-lg-2 col-xl-2 position-relative ms-4">
                      <button className="btn btn-primary position-absolute top-50 start-50 translate-middle px-4">CONTINUE</button>
                  </div>
                  <div className="col-sm-2 col-md-2 col-lg-2 col-xl-2 position-relative ms-3">
                      <button className="ms-3 btn btn-primary position-absolute top-50 start-50 translate-middle px-4">CANCEL</button>
                  </div>
                  
              </div>
              {/* </Link> */}
              <div className="">
                <div className="row justify-content-center mt-2">
                  <div className="col-2">
                    <button className="btn btn-light px-5 py-1">1</button>
                  </div>
                  <div className="col-2 ms-3 me-3">
                    <button className="btn btn-light px-5 py-1">2</button>
                  </div>
                  <div className="col-2">
                    <button className="btn btn-light px-5 py-1">3</button>
                  </div>
                </div>

                <div className="row justify-content-center mt-2">
                  <div className="col-2">
                    <button className="btn btn-light px-5 py-1">4</button>
                  </div>
                  <div className="col-2 ms-3 me-3">
                    <button className="btn btn-light px-5 py-1">5</button>
                  </div>
                  <div className="col-2">
                    <button className="btn btn-light px-5 py-1">6</button>
                  </div>
                </div>

                <div className="row justify-content-center mt-2">
                  <div className="col-2">
                    <button className="btn btn-light px-5 py-1">7</button>
                  </div>
                  <div className="col-2 ms-3 me-3">
                    <button className="btn btn-light px-5 py-1">8</button>
                  </div>
                  <div className="col-2">
                    <button className="btn btn-light px-5 py-1">9</button>
                  </div>
                </div>

                <div className="row justify-content-center mt-2">
                  <div className="col-2">
                    <button className="btn btn-light px-5 py-1">#</button>
                  </div>
                  <div className="col-2 ms-3 me-3">
                    <button className="btn btn-light px-5 py-1">0</button>
                  </div>
                  <div className="col-2">
                    <button className="btn btn-light px-5 py-1">*</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
