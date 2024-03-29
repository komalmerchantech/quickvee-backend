import React from 'react'
import Add_adminFunctionality from './add_adminFunctionality'

export default function Add_Admin() {
    const {handleChange,addAdminData,handleSubmit,handleBlur,handleKeyPress}=Add_adminFunctionality()
  return (
    <div className='q-order-min-page'>
    <div className='box'>
        <div className='box_shadow_div'>
            <div className='pd_20'>
                <div className='qvrow'>
                    <div className='col-qv-6'>
                        <div className='input_area'>
                            <label>Owner Name</label>
                            <input 
                                className=''
                                type='text'
                                name="owner_name"
                                value={addAdminData.owner_name}
                                onChange={handleChange}
                            />
                            {addAdminData.errors.owner_name && <span className='error'>{addAdminData.errors.owner_name}</span>}
                        </div>
                        
                    </div>
                    
                    <div className='col-qv-6'>
                        <div className='input_area'>
                            <label>Email</label>
                            <input 
                                className=''
                                type='text'
                                name="email"
                                value={addAdminData.email}
                                onChange={handleChange}
                                onBlur={() => handleBlur('email')}   
                            />
                            {addAdminData.errors.email && <span className='error'>{addAdminData.errors.email}</span>}
                        </div>
                    </div>
                </div>
                <div className='qvrow'>
                    <div className='col-qv-6'>
                        <div className='input_area'>
                            <label>Password</label>
                            <input 
                                className=''
                                type='password'
                                name="password"
                                value={addAdminData.password}
                                onChange={handleChange}
                                
                            />
                            {addAdminData.errors.password && <span className='error'>{addAdminData.errors.password}</span>}
                        </div>
                    </div>
                    <div className='col-qv-6'>
                        <div className='input_area'>
                            <label>Phone</label>
                            <input 
                                className=''
                                type='text'
                                name="phone"
                                onChange={handleChange}
                                value={addAdminData.phone}
                                maxLength={10}
                                onKeyPress={handleKeyPress}
                            
                            />
                            <label className='error'>{addAdminData.errors.phone}</label>
                        </div>
                    </div>
                </div>  
                <input 
                    type='button'
                    className="blue_btn"
                    value="Submit"
                    onClick={handleSubmit}
                /> 
            </div>
        </div>
      
    </div>
    </div>
  )
}
