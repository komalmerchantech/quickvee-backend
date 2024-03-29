import React,{useState} from 'react'
import{BASE_URL,GET_EDIT_CUSTOMER,GET_UPDATE_MERCHANT} from '../../../Constants/Config'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
export default function EditMerchantFunctionality() {
    const navigate = useNavigate();

    const[getEditMerchant,setEditMerchant]=useState({id:'',username:'',name:'',merchant_id:'',password:'',live_account:'',owner_name:'',otp:'',a_address_line_1:'',a_address_line_2:'',a_phone:'',a_city:'',a_zip:'',a_state:'',merchant_token:'',usa_pin:'',
    user_type:'',id:'',states:[]})

    const[paymentModeOnline,setPaymentModeOnline]=useState(false)
    const[paymentModeOffline,setPaymentModeOffline]=useState(false)
    const[paymentCredits,setPaymentCredits]=useState(false)
    const[paymentModeRecord,setPaymentModeRecord]=useState('')
    const[message,setMessage]=useState('')
    const[successMessagehandle,setSuccessMessageHandle]=useState(false)
    const[inventory,setInventory]=useState(false)
    const handleSuccessMessage=()=>{
        setTimeout(()=> {
            setSuccessMessageHandle(false)
         }, 3000)
    }
   const inventoryApprove=(e)=>{
    // console.log(e.target)
    setInventory(!inventory)

   }
    const getEditMerchantData=async(data)=>{
        const dataNew={id:data}
            await axios.post(BASE_URL+GET_EDIT_CUSTOMER,dataNew,{headers:{
                "Content-Type":'multipart/form-data'
            }}).then(response=>{
                console.log(response.data)
                console.log(response.data.message.row.flag)
                if(response.data.status==200)
                {
                    const inventory=response.data.message.inventory !==null && response.data.message.inventory!==''? response.data.message.inventory:'0'
                    if(inventory==0)
                    {
                        setInventory(false)
                    }else{
                        setInventory(true)
                    }
                    // console.log(inventory)
                    const a_zipCode = response.data.message.row.a_zip !== null ? response.data.message.row.a_zip : '';
                    const account_Type=response.data.message.row.flag !==null && response.data.message.row.flag!==""?response.data.message.row.flag:'0'
                    const Ownername = response.data.message.row.owner_name !== null ? response.data.message.row.owner_name : '';
                    const City = response.data.message.row.a_city !== null ? response.data.message.row.a_city: '';
                    const username =response.data.message.row.email !== null ? response.data.message.row.email: '';
                    const name =response.data.message.row.name !== null ? response.data.message.row.name: '';
                    const State =response.data.message.row.a_state !== null ? response.data.message.row.a_state: '';
                    const Merchant_token=response.data.message.row.merchant_token !==null ?response.data.message.row.merchant_token:'';
                    const Phone=response.data.message.row.phone !==null ?response.data.message.row.phone:''
                    const usa_pin=response.data.message.row.usa_pin !==null ? response.data.message.row.usa_pin:''
                    const merchant_id=response.data.message.row.merchant_id !==null ? response.data.message.row.merchant_id:'no_id'
                    const otp=response.data.message.row.ver_code !==null ?response.data.message.row.ver_code:''
                    const a_address_line_1=response.data.message.row.a_address_line_1 !==null ?response.data.message.row.a_address_line_1:''
                    const a_address_line_2=response.data.message.row.a_address_line_2 !==null ? response.data.message.row.a_address_line_2:''
                    
                    setEditMerchant({
                        id:data,
                        live_account:account_Type,
                        password:'',
                        username:username,
                        name:name,
                        merchant_id:merchant_id,
                        owner_name:Ownername,
                        otp:otp,
                        a_address_line_1:a_address_line_1,
                        a_address_line_2:a_address_line_2,
                        a_phone:Phone,
                        a_city:City,
                        a_zip:a_zipCode,
                        a_state:State,
                        merchant_token:Merchant_token,
                        usa_pin:usa_pin,
                        user_type:response.data.message.row.user_type,
                        states:response.data.message.states,
                    })
                    // console.log(response.data.message.Paymentmode.cc_payment)
                    if(response.data.message.Paymentmode==null)
                    {
                        setPaymentModeRecord('0')
                        setPaymentModeOffline(true)
                        setPaymentModeOnline(false)
                        setPaymentCredits(false)

                    }else if((response.data.message.Paymentmode.cc_payment ==null) || (response.data.message.Paymentmode.cc_payment==0  )){
                        setPaymentModeRecord(response.data.message.Paymentmode.cc_payment)
                        setPaymentModeOffline(true)
                        setPaymentModeOnline(false)
                        setPaymentCredits(false)

                    }else if((response.data.message.Paymentmode.cc_payment !==null)|| (response.data.message.Paymentmode.cc_payment==2))
                    {
                        setPaymentModeRecord(response.data.message.Paymentmode.cc_payment)
                        setPaymentModeOnline(true)
                        setPaymentModeOffline(false)
                        setPaymentCredits(false)

                    }else if((response.data.message.Paymentmode.cc_payment !==null)|| (response.data.message.   Paymentmode.cc_payment==1))
                    {
                        setPaymentModeRecord(response.data.message.Paymentmode.cc_payment)
                        setPaymentCredits(true)
                        setPaymentModeOnline(false)
                        setPaymentModeOffline(false)

                    }
                    
                }
            })
        
    }

    const handleKeyPress = (e) => {
        // Allow only numeric characters (key codes 48 to 57) and backspace (key code 8)
        if ((e.charCode < 48 || e.charCode > 57) && e.charCode !== 8) {
          e.preventDefault();
        }
      };
    const handleChangeMerchant=(e)=>{
        const {name,value}=e.target
        const trimmedValue = value.replace(/^\s+|\s+$/g, '')
        setEditMerchant((prev)=>({
            ...prev,
            [name]:trimmedValue

        })
        );
    }
    

    const handleChangePaymentMode=(e)=>{
        // console.log(e.target.value)
        setPaymentModeRecord(e.target.value)
        if(e.target.value==1)
        {
            setPaymentCredits(true)
            setPaymentModeOnline(false)
            setPaymentModeOffline(false)
        }else if(e.target.value==0){
            setPaymentModeOffline(true)
            setPaymentModeOnline(false)
            setPaymentCredits(false)

        }
        else if(e.target.value==2)
        {
            setPaymentModeOnline(true)
            setPaymentModeOffline(false)
            setPaymentCredits(false)

        }

    }

    const handleUpdateMerchant=async(e)=>{
        e.preventDefault();
        let inventoryNew=0;
        if(inventory==true)
        {
            inventoryNew=1

        }
        const packet={
            id:getEditMerchant.id,
            username:getEditMerchant.username,
            user_type:getEditMerchant.user_type,
            inventory:inventoryNew,
            mer_id:getEditMerchant.id,
            name:getEditMerchant.name,
            merchant_id:getEditMerchant.merchant_id,
            ownername:getEditMerchant.owner_name,
            password:getEditMerchant.password,address:{address1:getEditMerchant.a_address_line_1,address2:getEditMerchant.a_address_line_2,
                phoneNumber:getEditMerchant.a_phone,
                city:getEditMerchant.a_city,
                a_zip:getEditMerchant.a_zip,
                state:getEditMerchant.a_state},
                cc_payment:paymentModeRecord,
                account_type:getEditMerchant.live_account,
                merchant_token: getEditMerchant.merchant_token,
                usa_pin:getEditMerchant.usa_pin,
            } 
            console.log(packet)      
        try {
            let response=await axios.post(BASE_URL+GET_UPDATE_MERCHANT,packet,{headers:{
                "Content-Type":'multipart/form-data'
            }})
           
            if(response.data.status==200)
            {
                // console.log(response.data)
                setMessage(response.data.message)
                setSuccessMessageHandle(true)
                handleSuccessMessage()
                navigate(`/users/editMerchant/${getEditMerchant.id}`)
            }
            
        } catch (e) {
           console.log('Exception',e)
        }

    }
    return {getEditMerchantData,getEditMerchant,handleChangePaymentMode,paymentModeOnline,paymentModeOffline
    ,paymentModeOnline,paymentModeOffline,handleUpdateMerchant,handleChangeMerchant,paymentCredits,setEditMerchant,message,successMessagehandle,handleKeyPress,inventory,inventoryApprove}
}
