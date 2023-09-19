import React, { useState } from 'react'
import Headers from '../../Components/HeaderLoad/Headers'
import './Load_Receipt.css'

const Load_Receipt = () => {
  const [data, setData] = useState([
    { id: 0, quantity: 7, available: 7,sold:false }, { id: 1, quantity: 0, available: 5,sold:false }, { id: 2, quantity: 0, available: 0,sold:true }, { id: 3, quantity: 0, available: 5,sold:false }
  ])
  const IncrementItem = (id) => {
    const newCart = [...data];
    newCart.find(item => item.id === id).quantity += 1; 
    setData(newCart)
  }

  const DecreaseItem = (id) => {
    const newCart = [...data];
    newCart.find(item => item.id === id).quantity -= 1; 
    setData(newCart)
  }
  const RemoveItem = (id) => {
    const newarr = data.filter(item => {
      return item.id != id;
    });
    setData(newarr)
  }
  return (
    <div style={{ backgroundColor: "#191a1e", height: "100%", width: "100%",paddingBottom:21}}>
      <Headers />
      {/* Main Data */}
      <div style={{overflowY:"scroll",height:421,paddingBottom:10}}>
      { 
        data.length>0?
        data.map((item) => {
          return (
            <div key={item.id} className='d-flex ms-3 mt-3'>
              <div className='col-9 col-sm-8 col-md-10 col-lg-11 ' >
                <div className='d-flex'>
                  <div style={{ width: "100px", height: "100px", position: "relative" }} >
                    <span style={{ position: "absolute", top: "32px", left: "-12px", width: "25px", height: "25px", border: "3px solid #007FFF", borderRadius: "50%", backgroundColor: "#ffffff" }} />
                    <img src='/images/Mask.png' style={{ width: "100px", height: "100px", objectFit: "fill", border: "3px solid #007FFF", borderRadius: 10, }} />
                  </div>
                  <div className='Product-info'>
                    <span className='Main-Label'>Product Name here</span><br />
                    <div className='' style={{ height: "2px", width: "60px", backgroundColor: "#007FFF", marginTop: "1px", marginBottom: "6px" }}></div>
                    <span className='decription'>If product have more options here can go picked option</span>
                    <br />
                    <span className='Availibility'>Available: {item.available}</span>{item.sold?<span style={{color:"#ffff",marginLeft:10,fontWeight:"bold"}}>SOLD OUT</span>:null}
                  </div>
                </div>
                <div style={{ height: "3px", width: "100%", backgroundColor: "#007FFF", marginTop: "20px", }} />
              </div>
              <div className='text-center pt-2 mx-3'>
                <p className='quantity_heading'>QTY</p>
                <div className='quantity_controler' style={{ marginTop: 15 }}>
                  <span style={{fontSize:30,cursor:"pointer"}} onClick={()=>{
                    if(item.quantity>0){
                    DecreaseItem(item.id)
                    }
                  }}>-</span>
                  <span className='mx-3'>{item.quantity}</span>
                  <span style={{fontSize:30,cursor:"pointer"}} onClick={()=>{
                     if(item.quantity<item.available){
                    IncrementItem(item.id)
                     }
                  }}>+</span>
                </div>
                {item.quantity>0?<p className='quantity_heading mt-2' style={{cursor:"pointer"}} onClick={()=>RemoveItem(item.id)}>Remove</p>:null}
                <p className='quantity_heading' style={{ marginTop: item.quantity>0?10:30 }}><span style={{ fontSize: 20, fontWeight: "bold", }}>$2</span>.99</p>
              </div>
            </div>
          )
        })
        :
        <div style={{flex:1,display:"flex",height:"100%",justifyContent:"center",alignItems:"center"}}>
          <span style={{ fontSize: 30, fontWeight: "bold",color:"#ffffff" }}>No Data Found</span>
        </div>
      }
    

      </div>
         <div className='col-12 col-lg-12 col-md-11 col-sm-10' >
      <div className='d-flex justify-content-between mx-3 mt-3'>
        <div className='text-white fs-5'>
          0 items Added
        </div>
        <div className='text-white'>
          <span style={{ fontSize: 30, fontWeight: "bold" }}>$0</span>.00
        </div>
      </div>
      <div className='d-flex justify-content-around mt-4 mb-4'>
        <button className='Loadbtn' >Load History</button>
        <button className='Loadbtn'>Begin Service</button>
      </div>
      </div>
    </div>
  )
}

export default Load_Receipt