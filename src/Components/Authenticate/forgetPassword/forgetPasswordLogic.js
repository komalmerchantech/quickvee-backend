import React, { useState } from "react";
import Validate from "../validationFile/validate";
import axios from "axios";
import { BASE_URL, EMAIL_VARIFICATION } from "../../../Constants/Config";

export default function ForgetPasswordLogic(setLoading) {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState("");
  const { UsernameValidate } = Validate({ setErrors, errors });
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  let emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    let newErrors = { ...errors }; // Copy errors object to avoid direct state mutation

    // // Validate email field
    if (name === "email") {
      newErrors[name] =
        value === ""
          ? `Email is required`
          : !emailRegex.test(value)
            ? `Please enter a valid ${name}`
            : "";
    }

    setErrors({ ...newErrors });

    setEmail(value.replace(/^\s+/, ""));
  };

  function Currentvalidate(errors) {
    if (errors?.email === "") {
      return true;
    } else {
      return false;
    }
  }
  const isValidate = () => {
    let newErrors = { ...errors };
    let error = false;
    if (email == "") {
      newErrors["email"] = "Email is required";
      error = true;
    } else {
      newErrors["email"] = "";
      error = false;
    }
    setErrors({ ...newErrors });
    if (error == true) {
      return false;
    } else {
      return true;
    }
  };

  const handleHideErrorMessage = () => {
    setMessage("");
  };

  // Update errors state
  // setErrors(newErrors);

  const handleSubmitData = async (e) => {
    try {
      e.preventDefault();
      setLoading(() => true);
      let IsValidate = Currentvalidate(errors);
      let IsCheckValidate = isValidate();
      if (IsCheckValidate) {
        if (IsValidate) {
          try {
            let emailRecord = { email: email.trim() };
            let response = await axios.post(
              BASE_URL + EMAIL_VARIFICATION,
              emailRecord,
              { headers: { "Content-Type": "multipart/form-data" } }
            );
            // console.log(response?.data?.message_code==1);

            if (!!response?.data?.message) {
              setStatus(response?.data?.message_code);
              setMessage(response?.data?.message);
            }
          } catch (error) {
            console.log(error);
          }
        }
      }
    } catch (e) {
      console.log("Error: ", e);
    } finally {
      setLoading(() => false);
    }
  };
  return {
    handleOnChange,
    email,
    handleSubmitData,
    errors,
    message,
    handleHideErrorMessage,
    status,
  };
}
