import axios from 'axios'
import React,{useState,useEffect}  from 'react'
import{BASE_URL,GET_EDIT_CUSTOMER,GET_UPDATE_CUSTOMER}from '../../../../Constants/Config'
import { useNavigate } from 'react-router-dom';


const EditCustomerFunction=()=>{
    const navigate = useNavigate();
    const [customerData, setCustomerData] = useState({
        name: '',
        email: '',
        reSet: '',
        phone: '',
        id: '',
        user_type: '',
        password:'',
        });

    const[errors,setErrors]=useState({
        name:'',
        phone:'',
    })
      
    const[customerRadio,setCustomerRadio]=useState(false)
    const[AdminRadio,setAdminRadio]=useState(false)
    const[merchantRadio,setMerchantRadio]=useState(false)
    const[storeRadio,setStoreRadio]=useState('')
    const[successMessage,setSuccessMessage]=useState('')

    const handleEditData=async(data)=>
    {
        const dataNew={id:data}
            await axios.post(BASE_URL+GET_EDIT_CUSTOMER,dataNew,{headers:{
                "Content-Type":'multipart/form-data'
            }}).then(response=>{
              
                if(response.data.status==200)
                {
                    setCustomerData(response.data.message.row)
                    // console.log(response.data.message.row.user_type)

                    if(response.data.message.row.user_type.toLowerCase()=="customer")
                    {
                        setStoreRadio(response.data.message.row.user_type)
                        setCustomerRadio(true)

                    }else if(response.data.message.row.user_type.toLowerCase()=="admin")
                    {
                        setStoreRadio(response.data.message.row.user_type)
                        setAdminRadio(true)

                    }
                    // else if(response.data.message.user_type.toLowerCase()=="merchant"){
                    //     setStoreRadio(response.data.message.row.user_type)
                    //     setMerchantRadio(true)

                    // }
                    
                }
              
            })
    }
    const handleChange = (e) => {
        const { name, value } = e.target;
      
        let updatedErrors = { ...errors };
      
        if (name === "name") {
          updatedErrors['name'] = value === "" ? `please fill the ${name} field` : '';
        }
        if (name === 'phone') {
            const numericValue = value.replace(/[^0-9]/g, '');
    
            if (numericValue.length !== 10) {
              updatedErrors[name] = 'Phone number must be 10 digits';
            } else {
              updatedErrors[name] = '';
            }
        //   updatedErrors['phone'] = value === "" ? `please fill the ${name} field` : '';
        }
      
        setErrors(updatedErrors);
      
        setCustomerData((prevCustomerData) => ({
          ...prevCustomerData,
          [name]: value,
        }));
      };
      
    const handleKeyPress = (e) => {
        // Allow only numeric characters (key codes 48 to 57) and backspace (key code 8)
        if ((e.charCode < 48 || e.charCode > 57) && e.charCode !== 8) {
          e.preventDefault();
        }
      };


    const handleChangeRadio=(e)=>{
        console.log(e.target.value)
        if(e.target.value=='merchant')
        {
            setMerchantRadio(true)
            setAdminRadio(false)
            setCustomerRadio(false)

        }else if(e.target.value=='admin'){
            setAdminRadio(true)
            setMerchantRadio(false)
            setCustomerRadio(false)

        }else if(e.target.value=="customer"){
            setCustomerRadio(true)
            setMerchantRadio(false)
            setAdminRadio(false)
        }
        setStoreRadio(e.target.value)
    }
    const handleSubmitCustomerRecord=async(e)=>{
        e.preventDefault();
        const data={id:customerData.id,user_type:storeRadio,name:customerData.name,phone:customerData.phone,password:''}
        let validate=Object.values(errors).filter(error => error !== '').length;
        
        if(validate == 0)
        {
              await axios.post(BASE_URL+GET_UPDATE_CUSTOMER,data,{headers:{
            "Content-Type":'multipart/form-data'
        }}).then(response=>{
            console.log(response.data)
            if(response.data.status==200)
            {
                setSuccessMessage(response.data.message)
                if(response.data.record.user_type=='customer')
                {
                    console.log('1')
                    setCustomerRadio(true)
                    setMerchantRadio(false)
                    setAdminRadio(false)

                }else if(response.data.record.user_type=="admin")
                {
                    console.log('2')
                    setAdminRadio(true)
                    setMerchantRadio(false)
                    setCustomerRadio(false)

                }else if(response.data.record.user_type=="merchant")
                {
                    console.log('3')
                    console.log(customerData.id)
                    navigate(`/users/editMerchant/${customerData.id}`)
                    // setAdminRadio(false)
                    // setMerchantRadio(true)
                    // setCustomerRadio(false)
                   
                }

            }
        })
        }

      
       

    }
    return {handleEditData,customerData,handleChange,customerRadio,AdminRadio,merchantRadio,
        handleChangeRadio,handleSubmitCustomerRecord,successMessage,handleKeyPress,errors}

}
export default EditCustomerFunction