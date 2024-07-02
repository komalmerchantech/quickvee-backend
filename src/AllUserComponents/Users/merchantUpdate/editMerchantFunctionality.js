import React, { useState, useEffect } from "react";
import {
  BASE_URL,
  GET_EDIT_CUSTOMER,
  GET_UPDATE_MERCHANT,
  ADMIN_CHECK_USER,
  CHECK_EXIST_STORENAME,
} from "../../../Constants/Config";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuthDetails } from "../../../Common/cookiesHelper";
import { ToastifyAlert } from "../../../CommonComponents/ToastifyAlert";
import PasswordShow from "../../../Common/passwordShow";

export default function EditMerchantFunctionality() {
  const navigate = useNavigate();
  const { LoginGetDashBoardRecordJson, LoginAllStore, userTypeData } =
    useAuthDetails();
  const { handleCoockieExpire, getUnAutherisedTokenMessage } = PasswordShow();

  const [getEditMerchant, setEditMerchant] = useState({
    id: "",
    username: "",
    name: "",
    merchant_id: "",
    newPassword: "",
    live_account: "",
    owner_name: "",
    otp: "",
    a_address_line_1: "",
    a_address_line_2: "",
    a_phone: "",
    a_city: "",
    a_zip: "",
    a_state: "",
    merchant_token: "",
    usa_pin: "",
    user_type: "",
    id: "",
    states: [],
  });
  // console.log("getEditMerchant: ", getEditMerchant);
  const [errors, setErrors] = useState({
    usa_pin: "",
    merchant_token: "",
    name_error: "",
    owner_name: "",
    a_address_line_1: "",
    a_phone: "",
    a_city: "",
    a_state: "",
    a_zip: "",
    password: "",
  });
  const [checkExistStore, setCheckExistStore] = useState("");
  // console.log("getEditMerchant:", getEditMerchant)
  const [paymentModeOnline, setPaymentModeOnline] = useState(false);
  const [paymentModeOffline, setPaymentModeOffline] = useState(false);
  const [paymentCredits, setPaymentCredits] = useState(false);
  const [paymentModeRecord, setPaymentModeRecord] = useState("");
  const [message, setMessage] = useState("");
  const [successMessagehandle, setSuccessMessageHandle] = useState(false);
  const [inventory, setInventory] = useState(false);
  const [loader, setLoader] = useState(false);
  const [loadDataId, setLoadDataId] = useState("");

  const handleSuccessMessage = () => {
    setTimeout(() => {
      setSuccessMessageHandle(false);
    }, 3000);
  };
  const inventoryApprove = (e) => {
    // console.log(e.target)
    setInventory(!inventory);
  };
  // ================================
  const passwordValidate = async (email, password) => {
    const { token, ...newData } = userTypeData;
    const dataNew = { email: email, password: password, ...newData };

    try {
      const response = await axios.post(BASE_URL + ADMIN_CHECK_USER, dataNew, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error validating email:", error);
      // console.log("hellooo", error?.message);
      // dispatch(getAuthInvalidMessage(error?.message));
      handleCoockieExpire();
      throw error;
    }
  };
  // ------------------------------------------------------
  const StorenameValidate = async (email, store) => {
    const { token, ...newData } = userTypeData;
    const dataNew = { email: email, name: store, ...newData };
    try {
      const response = await axios.post(
        BASE_URL + CHECK_EXIST_STORENAME,
        dataNew,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error validating email:");
    }
  };

  const handleBlurStoreFound = async () => {
    if (
      errors.name_error == "" &&
      getEditMerchant.name !== "" &&
      getEditMerchant.username !== ""
    ) {
      let result = await StorenameValidate(
        getEditMerchant.username,
        getEditMerchant.name
      );
      if (result.status == true) {
        if (checkExistStore !== getEditMerchant.name) {
          setErrors((prev) => ({
            ...prev,
            name_error: "Store already exists",
          }));
        }
      } else {
        setErrors((prev) => ({
          ...prev,
          name_error: "",
        }));
      }
    } else {
      console.log("nooo");
    }
  };

  // ------------------------------------------------------

  const handleBlur = async (name) => {
    if (name === "password" || name === "email") {
      if (getEditMerchant.newPassword !== "") {
        if (
          getEditMerchant.username !== "" &&
          getEditMerchant.newPassword !== ""
        ) {
          let result = await passwordValidate(
            getEditMerchant.username,
            getEditMerchant.newPassword
          );
          if (result == true) {
            setErrors((prev) => ({
              ...prev,
              password: "Password already exists",
            }));
          } else {
            setErrors((prev) => ({
              ...prev,
              password: "",
            }));
          }
        } else {
          setErrors((prev) => ({
            ...prev,
            password: "",
          }));
        }
      } else {
        setErrors((prev) => ({
          ...prev,
          password: "",
        }));
      }
    }
  };

  const getEditMerchantData = async (data) => {
    const { token, ...dataNew } = data;
    try {
      await axios
        .post(BASE_URL + GET_EDIT_CUSTOMER, dataNew, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`, // Use data?.token directly
          },
        })
        .then((response) => {
          // console.log(response);
          if (response.data.status == 200) {
            const inventory =
              response.data.message.inventory !== null &&
              response.data.message.inventory !== ""
                ? response.data.message.inventory
                : "0";
            if (inventory == 0) {
              setInventory(false);
            } else {
              setInventory(true);
            }
            console.log(response);
            const a_zipCode =
              response.data.message?.row?.a_zip !== null
                ? response.data.message.row?.a_zip
                : "";
            const account_Type =
              response.data.message?.row?.flag !== null &&
              response.data.message?.row?.flag !== ""
                ? response.data.message?.row?.flag
                : "0";
            const Ownername =
              response.data.message?.row?.owner_name !== null
                ? response.data.message?.row?.owner_name
                : "";
            const City =
              response.data.message?.row?.a_city !== null
                ? response.data.message?.row?.a_city
                : "";
            const username =
              response?.data?.message?.row?.email !== null
                ? response?.data?.message?.row?.email
                : "";
            const name =
              response?.data?.message?.row?.name !== null
                ? response?.data?.message?.row?.name
                : "";
            setCheckExistStore(name);
            const State =
              response.data.message.row.a_state !== null
                ? response.data.message.row.a_state
                : "";
            const Merchant_token =
              response.data?.message?.row?.merchant_token !== null
                ? response.data.message.row.merchant_token
                : "";
            const Phone =
              response.data.message.row.a_phone !== null
                ? response.data?.message?.row?.a_phone
                : response.data?.message?.row?.phone;
            const usa_pin =
              response.data.message?.row?.usa_pin !== null
                ? response.data.message?.row?.usa_pin
                : "";
            const merchant_id =
              response.data.message.row.merchant_id !== null
                ? response.data.message.row.merchant_id
                : "no_id";
            const otp =
              response.data.message.row.ver_code !== null
                ? response.data.message.row.ver_code
                : "";
            const a_address_line_1 =
              response.data.message.row.a_address_line_1 !== null
                ? response.data.message.row.a_address_line_1
                : "";
            const a_address_line_2 =
              response.data.message.row.a_address_line_2 !== null
                ? response.data.message.row.a_address_line_2
                : "";

            setEditMerchant({
              id: data,
              live_account: account_Type,
              newPassword: "",
              username: username,
              name: name,
              merchant_id: merchant_id,
              owner_name: Ownername,
              otp: otp,
              a_address_line_1: a_address_line_1,
              a_address_line_2: a_address_line_2,
              a_phone: Phone,
              a_city: City,
              a_zip: a_zipCode,
              a_state: State,
              merchant_token: Merchant_token,
              usa_pin: usa_pin,
              user_type: response.data.message.row.user_type,
              states: response.data.message.states,
            });
            // console.log(response.data.message.Paymentmode.cc_payment)
            if (response.data.message.Paymentmode == null) {
              setPaymentModeRecord("0");
              setPaymentModeOffline(true);
              setPaymentModeOnline(false);
              setPaymentCredits(false);
            } else if (
              response.data.message.Paymentmode.cc_payment !== null &&
              parseInt(response.data.message.Paymentmode.cc_payment) === 0
            ) {
              setPaymentModeRecord(
                response.data.message.Paymentmode.cc_payment
              );
              setPaymentModeOffline(true);
              setPaymentModeOnline(false);
              setPaymentCredits(false);
            } else if (
              response.data.message.Paymentmode.cc_payment !== null &&
              parseInt(response.data.message.Paymentmode.cc_payment) === 2
            ) {
              // console.log(response.data.message.Paymentmode.cc_payment);
              setPaymentModeRecord(
                response.data.message.Paymentmode.cc_payment
              );
              setPaymentModeOnline(true);
              setPaymentModeOffline(false);
              setPaymentCredits(false);
            } else if (
              response.data.message.Paymentmode.cc_payment !== null &&
              parseInt(response.data.message.Paymentmode.cc_payment) === 1
            ) {
              setPaymentModeRecord(
                response.data.message.Paymentmode.cc_payment
              );
              setPaymentCredits(true);
              setPaymentModeOnline(false);
              setPaymentModeOffline(false);
            }
          }
        });
    } catch (error) {
      // console.log("hehehehheh");
      getUnAutherisedTokenMessage();
      handleCoockieExpire();
    }
  };

  const handleKeyPress = (e) => {
    // Allow only numeric characters (key codes 48 to 57) and backspace (key code 8)
    if ((e.charCode < 48 || e.charCode > 57) && e.charCode !== 8) {
      e.preventDefault();
    }
  };
  // const handleChangeMerchant = (e) => {
  //   if (e?.target?.name) {
  //     const { name, value } = e.target;
  //     // const trimmedValue = value.replace(/^\s+|\s+$/g, "");
  //     const trimmedValue = value.replace(/^\s+/, "");

  //     // setEditMerchant((prev) => ({
  //     //   ...prev,
  //     //   [name]: trimmedValue,
  //     // }));

  //     setEditMerchant((prev) => ({
  //       ...prev,
  //       [name]: trimmedValue,
  //     }));
  //   } else {
  //     console.log("value of object:", e);
  //     setEditMerchant((prev) => ({
  //       ...prev,
  //       [e.name]: e.value,
  //     }));
  //   }
  // };
  const handleChangeMerchant = (e) => {
    let name, value;

    if (e?.target?.name) {
      // Extract name and value from event target
      ({ name, value } = e.target);
    } else {
      // Handle non-event objects
      ({ name, value } = e);
    }

    // Clone errors to avoid mutation
    let updatedErrors = { ...errors };
    let trimmedValue = value.replace(/^\s+/, "");
    // const containsNumbers = /\d/.test(trimmedValue);

    // Update errors based on the field name
    if (name === "name") {
      updatedErrors.name_error =
        trimmedValue === "" ? "Store Name is required" : "";
    }
    if (name === "owner_name") {
      updatedErrors.owner_name =
        trimmedValue === "" ? "Owner Name is required" : "";
    }
    if (name == "usa_pin") {
      updatedErrors.usa_pin = trimmedValue === "" ? "USA Pin is required" : "";
    }

    if (name == "merchant_token") {
      updatedErrors.merchant_token =
        trimmedValue === "" ? "Merchant Token is required" : "";
    }
    if (name == "a_address_line_1") {
      updatedErrors.a_address_line_1 =
        trimmedValue === "" ? "Address Line 1 is required" : "";
    }
    if (name == "a_phone") {
      updatedErrors.a_phone =
        trimmedValue === ""
          ? "Phone is required"
          : trimmedValue.length !== 10
            ? "Invalid Phone"
            : "";
    }
    if (name == "a_city") {
      updatedErrors.a_city = trimmedValue === "" ? "City is required" : "";
    }
    if (name == "a_zip") {
      updatedErrors.a_zip =
        trimmedValue === ""
          ? "Zip Code is required"
          : trimmedValue.length !== 4 && trimmedValue.length !== 5
            ? "Invalid Zip Code"
            : "";
    }
    if (name == "a_state") {
      updatedErrors.a_state = trimmedValue === "" ? "State is required" : "";
    }

    // Update state
    setErrors(updatedErrors);
    setEditMerchant((prev) => ({
      ...prev,
      [name]: trimmedValue.replace(/^\s+/, ""),
    }));
  };

  const handleChangePaymentMode = (e) => {
    // console.log(e.target.value)
    setPaymentModeRecord(e.target.value);
    if (e.target.value == 1) {
      setPaymentCredits(true);
      setPaymentModeOnline(false);
      setPaymentModeOffline(false);
      setErrors({ ...errors, usa_pin: "", merchant_token: "" });
    } else if (e.target.value == 0) {
      setPaymentModeOffline(true);
      setPaymentModeOnline(false);
      setPaymentCredits(false);
      setEditMerchant({ ...getEditMerchant, usa_pin: "", merchant_token: "" });
      setErrors({ ...errors, usa_pin: "", merchant_token: "" });
    } else if (e.target.value == 2) {
      setPaymentModeOnline(true);
      setPaymentModeOffline(false);
      setPaymentCredits(false);
      setErrors({ ...errors, usa_pin: "", merchant_token: "" });
      // setErrors({...errors});
    }
  };
  // -------------------------------validation-----------------
  const validateForm = async () => {
    let error = false;
    let updatedErrors = { ...errors };

    // Synchronous validations
    if ((paymentCredits || paymentModeOnline) && !getEditMerchant.usa_pin) {
      updatedErrors.usa_pin = "USA Pin is required";
      error = true;
    }

    if (
      (paymentCredits || paymentModeOnline) &&
      !getEditMerchant.merchant_token
    ) {
      updatedErrors.merchant_token = "Merchant Token is required";
      error = true;
    }

    if (!getEditMerchant.name) {
      updatedErrors.name_error = "Store Name is required";
      error = true;
    } else {
      try {
        setLoader(true);
        const response = await StorenameValidate(
          getEditMerchant.username,
          getEditMerchant.name
        );
        setLoader(false);
        if (response.status) {
          if (checkExistStore == getEditMerchant.name) {
            updatedErrors.name_error = "";
          } else {
            updatedErrors.name_error = "Store already exists";
            error = true;
          }
        } else {
          updatedErrors.name_error = "";
        }
      } catch (validationError) {
        setLoader(false);
        console.error("Error validating store name:", validationError);
        updatedErrors.name_error = "Error validating store name";
        error = true;
      }
    }

    if (!getEditMerchant.owner_name) {
      updatedErrors.owner_name = "Owner Name is required";
      error = true;
    }

    if (getEditMerchant.newPassword) {
      try {
        setLoader(true);
        const response = await passwordValidate(
          getEditMerchant.username,
          getEditMerchant.newPassword
        );
        setLoader(false);
        if (response) {
          updatedErrors.password = "Password already exists";
          error = true;
        } else {
          updatedErrors.password = "";
        }
      } catch (validationError) {
        setLoader(false);
        console.error("Error validating password:", validationError);
        updatedErrors.password = "Error validating password";
        error = true;
      }
    } else {
      updatedErrors.password = ""; // No error if password is not required
    }

    if (!getEditMerchant.a_address_line_1) {
      updatedErrors.a_address_line_1 = "Address Line 1 is required";
      error = true;
    }

    if (!getEditMerchant.a_phone) {
      updatedErrors.a_phone = "Phone is required";
      error = true;
    }

    if (!getEditMerchant.a_city) {
      updatedErrors.a_city = "City is required";
      error = true;
    }

    if (!getEditMerchant.a_zip) {
      updatedErrors.a_zip = "Zip Code is required";
      error = true;
    }

    if (!getEditMerchant.a_state) {
      updatedErrors.a_state = "State is required";
      error = true;
    }

    setErrors(updatedErrors);
    return !error;
  };

  // const validateForm = async () => {
  //   let error = false;
  //   let updatedErrors = { ...errors };

  //   if (
  //     (paymentCredits || paymentModeOnline) &&
  //     getEditMerchant.usa_pin == ""
  //   ) {
  //     updatedErrors.usa_pin = "USA Pin is required";
  //     error = true;
  //   }
  //   if (
  //     (paymentCredits || paymentModeOnline) &&
  //     getEditMerchant.merchant_token == ""
  //   ) {
  //     updatedErrors.merchant_token = "Merchant Token is required";
  //     error = true;
  //   }
  //   if (getEditMerchant.name == "") {
  //     updatedErrors.name_error = "Store Name is required";
  //     error = true;
  //   } else {
  //     setLoader(true);
  //     let response = await StorenameValidate(
  //       getEditMerchant.username,
  //       getEditMerchant.name
  //     );
  //     if (response.status == true) {
  //       setLoader(false);
  //       updatedErrors.name_error = "Store already exists";
  //       error = true;
  //     } else {
  //       setLoader(false);
  //       updatedErrors.name_error = "";
  //       error = false;
  //     }
  //   }
  //   if (getEditMerchant.owner_name == "") {
  //     updatedErrors.owner_name = "Owner Name is required";
  //     error = true;
  //   }
  //   if (getEditMerchant.newPassword == "") {
  //     updatedErrors.password = "";
  //     error = false;
  //   } else {
  //     setLoader(true);
  //     let response = await passwordValidate(
  //       getEditMerchant.username,
  //       getEditMerchant.newPassword
  //     );
  //     if (response) {
  //       setLoader(false);
  //       updatedErrors.password = "Password already exists";
  //       error = true;
  //     } else {
  //       setLoader(false);
  //       updatedErrors.password = "";
  //       error = false;
  //     }
  //   }
  //   if (getEditMerchant.a_address_line_1 == "") {
  //     updatedErrors.a_address_line_1 = "Address Line 1 is required";
  //     error = true;
  //   }
  //   if (getEditMerchant.a_phone == "") {
  //     updatedErrors.a_phone = "Phone is required";
  //     error = true;
  //   }
  //   if (getEditMerchant.a_city == "") {
  //     updatedErrors.a_city = "City is required";
  //     error = true;
  //   }
  //   if (getEditMerchant.a_zip == "") {
  //     updatedErrors.a_zip = "Zip Code is required";
  //     error = true;
  //   }
  //   if (getEditMerchant.a_state == "") {
  //     updatedErrors.a_state = "State is required";
  //     error = true;
  //   }
  //   setErrors(updatedErrors);
  //   if (error == true) {
  //     return false;
  //   } else {
  //     return true;
  //   }
  // };
  // // -----------------------validation-------------------
  function Currentvalidate(errors) {
    console.log(errors);
    return Object.values(errors).every((error) => error === "");
  }
  // ==================================

  const keyEnter = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      setEditMerchant((prev) => ({
        ...prev,
        [event.target.name]: event.target.value,
      }));
      if (loader == false) {
        handleUpdateMerchant(event);
      }
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", keyEnter);
    return () => {
      document.removeEventListener("keydown", keyEnter);
    };
  }, [getEditMerchant]);

  // ==============
  const handleUpdateMerchant = async (e) => {
    e.preventDefault();
    let inventoryNew = 0;
    if (inventory == true) {
      inventoryNew = 1;
    }
    const { token, ...dataNew } = userTypeData;
    const validateBlank = await validateForm();
    const isValidateField = Currentvalidate(errors);
    if (validateBlank) {
      if (isValidateField == true) {
        const packet = {
          id: getEditMerchant?.id.id,
          username: getEditMerchant?.username.trim(),
          ...dataNew,
          inventory: inventoryNew,
          mer_id: getEditMerchant?.id.id,
          name: getEditMerchant.name,
          merchant_id: getEditMerchant.merchant_id,
          ownername: getEditMerchant.owner_name.trim(),
          password: getEditMerchant.newPassword.trim(),
          address: {
            address1: getEditMerchant.a_address_line_1.trim(),
            address2: getEditMerchant.a_address_line_2.trim(),
            phoneNumber: getEditMerchant.a_phone,
            city: getEditMerchant.a_city.trim(),
            a_zip: getEditMerchant.a_zip,
            state: getEditMerchant.a_state,
          },
          cc_payment: paymentModeRecord,
          account_type: getEditMerchant.live_account,
          merchant_token: getEditMerchant.merchant_token,
          usa_pin: getEditMerchant.usa_pin,
          update_status: "update",
        };
        setLoader(true);
        setLoadDataId("");
        console.log(packet);
        console.log(userTypeData?.token);
        try {
          let response = await axios.post(
            BASE_URL + GET_UPDATE_MERCHANT,
            packet,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`, // Use data?.token directly
              },
            }
          );
          if (response.data.status == 200) {
            setLoader(false);
            ToastifyAlert("Updated Successfully!", "success");
            // setMessage(response?.data?.message);
            setSuccessMessageHandle(true);
            setLoadDataId(response?.data);
            handleSuccessMessage();
            // navigate(`/users/editMerchant/${response?.data?.id}`);
            // navigate(`/users/editMerchant/${getEditMerchant.id}`)
          } else {
            setLoader(false);
            ToastifyAlert("Merchant not Updated!", "warn");
          }
        } catch (e) {
          console.log("Exception", e);
          navigate("/");
        }
      }
    }
  };
  return {
    getEditMerchantData,
    getEditMerchant,
    handleChangePaymentMode,
    paymentModeOnline,
    paymentModeOffline,
    paymentModeOnline,
    paymentModeOffline,
    handleUpdateMerchant,
    handleChangeMerchant,
    paymentCredits,
    setEditMerchant,
    message,
    successMessagehandle,
    handleKeyPress,
    inventory,
    inventoryApprove,
    errors,
    loader,
    handleBlur,
    keyEnter,
    handleBlurStoreFound,
    loadDataId,
  };
}
