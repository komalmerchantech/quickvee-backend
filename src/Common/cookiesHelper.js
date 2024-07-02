
import Cookies from 'js-cookie'; 
import CryptoJS from 'crypto-js'; 
import { useNavigate } from 'react-router-dom';


//  let AuthFinalLogin=Cookies.get('loginDetails') !==undefined ? Cookies.get('loginDetails') :[]
//  let LoginGetDashBoard=Cookies.get('token_data') !==undefined ? Cookies.get('token_data') :[]

export const useAuthDetails=()=>{
    let AuthFinalLogin=Cookies.get('loginDetails') !==undefined ? Cookies.get('loginDetails') :[]
    let LoginGetDashBoard=Cookies.get('token_data') !==undefined ? Cookies.get('token_data') :[]
 
    const AdminRocordNew=CryptoJS.AES.decrypt(AuthFinalLogin, 'secret key').toString(CryptoJS.enc.Utf8)
    let LoginAllStore=AdminRocordNew !==""? JSON.parse(AdminRocordNew):""

    let LoginGetDashBoardRecord=CryptoJS.AES.decrypt(LoginGetDashBoard, 'secret key').toString(CryptoJS.enc.Utf8)
    let LoginGetDashBoardRecordJson=LoginGetDashBoardRecord !==""? JSON.parse(LoginGetDashBoardRecord):""

    const token_id=LoginGetDashBoardRecordJson?.token_id
   const login_type=LoginGetDashBoardRecordJson?.login_type
   const token= LoginGetDashBoardRecordJson?.token
   const user_id=LoginGetDashBoardRecordJson?.data?.id;
   let userTypeData={token_id,login_type,token}
//  ------------  username and password save data-----------------
    let UserLoginDataStringFy=Cookies.get('user_auth_record') !==undefined ? Cookies.get('user_auth_record') :[]
  const getUserLoginAuth = atob(UserLoginDataStringFy);
  const GetSessionLogin=getUserLoginAuth !==""? JSON.parse(getUserLoginAuth):[]
//  --------------------------------------------------------------


// ---------------------------------------------------------------
   
    return {LoginGetDashBoardRecordJson,LoginAllStore,userTypeData,GetSessionLogin,user_id}
}
