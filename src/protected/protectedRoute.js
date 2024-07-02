// import React, { useEffect } from "react";
// import { useHistory, useLocation } from "react-router-dom";
// import { Route, useNavigate, Navigate, Outlet } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux"; //,localAuthCheck
// import CryptoJS from "crypto-js";
// import Cookies from "js-cookie";
// import { setIsStoreActive } from "../Redux/features/NavBar/MenuSlice";

// export default function ProtectedRoute(props) {
//   const dispatch = useDispatch();
//   const location = useLocation();
//   const navigate = useNavigate();
//   let AuthSessionRecord =
//     Cookies.get("token_data") !== undefined ? Cookies.get("token_data") : [];
//   let authdecryptRecord = CryptoJS.AES.decrypt(
//     AuthSessionRecord,
//     "secret key"
//   ).toString(CryptoJS.enc.Utf8);
//   const AdminRocord =
//     authdecryptRecord !== ""
//       ? JSON.parse(authdecryptRecord)
//       : { status: false };
//   const handleClearCoockie = () => {
//     Cookies.remove("loginDetails");
//     Cookies.remove("user_auth_record");
//     Cookies.remove("token_data");
//     localStorage.removeItem("AllStore");
//   };
//   console.log(AdminRocord)

//   if (
//     AdminRocord?.status == true &&
//     AdminRocord?.login_type == "superadmin" &&
//     props.visible == "superadmin"
//     && AdminRocord?.data?.merchant_id==""
//   ) {
//     return <Outlet />;
//   } else if (
//     AdminRocord?.status == true &&
//     (AdminRocord?.login_type == "superadmin" ||
//       AdminRocord?.data?.login_type == "manager" ||
//       AdminRocord?.data?.login_type == "merchant" ||
//       AdminRocord?.data?.login_type == "admin" ||
//       AdminRocord?.login_type == "merchant" ||
//       AdminRocord?.login_type == "manager" ||
//       AdminRocord?.login_type == "admin") &&
//     props.visible == "manager" &&
//     (AdminRocord?.data?.merchant_id !== "" ||
//       AdminRocord?.data?.merchant_id == "no_id") &&
//     AdminRocord?.data?.merchant_id !== undefined
//   ) {
//     dispatch(setIsStoreActive(true))
//     return <Outlet />;
//   } else if(AdminRocord?.login_type=="" || AdminRocord?.login_type==undefined) {
//     handleClearCoockie();
//     return <Navigate to="/login" />;
//   }

// }
import React, { useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Route, useNavigate, Navigate, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux"; //,localAuthCheck
import CryptoJS from "crypto-js";
import Cookies from "js-cookie";
import { setIsStoreActive } from "../Redux/features/NavBar/MenuSlice";

export default function ProtectedRoute(props) {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  let AuthSessionRecord =
    Cookies.get("token_data") !== undefined ? Cookies.get("token_data") : [];
  let authdecryptRecord = CryptoJS.AES.decrypt(
    AuthSessionRecord,
    "secret key"
  ).toString(CryptoJS.enc.Utf8);
  const AdminRocord =
    authdecryptRecord !== ""
      ? JSON.parse(authdecryptRecord)
      : { status: false };
  const handleClearCoockie = () => {
    Cookies.remove("loginDetails");
    Cookies.remove("user_auth_record");
    Cookies.remove("token_data");
    localStorage.removeItem("AllStore");
  };
  console.log(AdminRocord);
  if (
    AdminRocord?.status == true &&
    AdminRocord?.login_type == "superadmin" &&
    props.visible == "superadmin" &&
    AdminRocord?.data?.merchant_id == ""
  ) {
    dispatch(setIsStoreActive(false));
    return <Outlet />;
  } else if (
    AdminRocord?.status == true &&
    AdminRocord?.login_type == "superadmin" &&
    props.visible == "superadmin" &&
    AdminRocord?.data?.merchant_id !== ""
  ) {
    dispatch(setIsStoreActive(true));
    // return <Outlet />;
    return <Navigate to="/" />;
  } else if (
    AdminRocord?.status == true &&
    (AdminRocord?.login_type == "superadmin" ||
      AdminRocord?.data?.login_type == "manager" ||
      AdminRocord?.data?.login_type == "merchant" ||
      AdminRocord?.data?.login_type == "admin" ||
      AdminRocord?.login_type == "merchant" ||
      AdminRocord?.login_type == "manager" ||
      AdminRocord?.login_type == "admin") &&
    props.visible == "manager" &&
    (AdminRocord?.data?.merchant_id !== "" ||
      AdminRocord?.data?.merchant_id == "no_id") &&
    AdminRocord?.data?.merchant_id !== undefined
  ) {
    dispatch(setIsStoreActive(true));
    return <Outlet />;
  } else {
    handleClearCoockie();
    dispatch(setIsStoreActive(false));
    return <Navigate to="/login" />;
  }
}
