import React, { useState } from 'react'
import { GoBell } from 'react-icons/go'
import { FiSearch } from 'react-icons/fi'
import './Header.css'

const Headers = () => {
    const [notification, setNotification] = useState(3)
    return (
        <>
            <div className='' style={{ backgroundColor: "#202125", paddingLeft: "16px" }}>
                <div className='d-flex'>
                    <div className='col-8 col-sm-8 col-md-4 col-lg-4 mt-2'>
                        <p className='recipent mt-1'>Load Receipt</p>
                        <p className='Load_id'>LOAD ID: 4821</p>
                    </div>
                    <div className='col-md-4 col-lg-4 d-none d-lg-block d-md-block'>
                    </div>
                    <div className='col-4 col-sm-4 col-md-4 col-lg-4'>
                        <div className='d-flex justify-content-end mx-3 mt-3 '>
                            <div className='position-relative'>
                                <GoBell color='#575962' size={22} style={{ marginRight: "18px" }} />
                                {
                                    notification > 0 ?
                                        <div className='icon-circle'>
                                            {notification}
                                        </div>
                                        :
                                        null
                                }
                            </div>
                            <FiSearch color='#575962' size={22} />
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}

export default Headers