import axios from "axios";
import React, { useState, useEffect } from "react";
import {
  BASE_URL,
  GET_EDIT_ADMIN,
  CHECK_ADMIN_EMAIL,
  UPDATE_ADMIN_RECORD,
} from "../../../../Constants/Config";
import { useNavigate } from "react-router-dom";
import { useAuthDetails } from "../../../../Common/cookiesHelper";
import { ToastifyAlert } from "../../../../CommonComponents/ToastifyAlert";
import PasswordShow from "../../../../Common/passwordShow";

const EditAdminFunctionality = (handleClick) => {
  const navigate = useNavigate();
  const { handleCoockieExpire, getUnAutherisedTokenMessage } = PasswordShow();
  const [editData, setEditData] = useState({
    owner_name: "",
    email: "",
    password1: "",
    phone: "",
    password: "",
  });
  const { LoginGetDashBoardRecordJson, LoginAllStore, userTypeData } =
    useAuthDetails();

  const [errors, setErrors] = useState({
    owner_name: "",
    phone: "",
    email: "",
  });
  const [loader, setLoader] = useState(false);
  const [loaderEdit, setLoaderEdit] = useState(false);
  const [ExitEmail, setExitEmail] = useState("");

  const handleEditAdmin = async (data) => {
    const { token, ...newData } = data;
    // console.log(newData)
    // const dataNew={admin_id:data,newData}
    try {
      setLoaderEdit(true);
      await axios
        .post(BASE_URL + GET_EDIT_ADMIN, newData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setLoaderEdit(false);
          if (response.data.status == 200) {
            console.log(response.data.message[0]);
            setEditData({ password1: "", ...response.data.message[0] });
            setExitEmail(response.data.message[0].email);
          }
        });
    } catch (error) {
      getUnAutherisedTokenMessage();
      handleCoockieExpire();
    }
  };
  // ============================================
  const emailValidate = async (data) => {
    const { token, ...newData } = userTypeData;

    const dataNew = { email: data, ...newData };

    try {
      const response = await axios.post(BASE_URL + CHECK_ADMIN_EMAIL, dataNew, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data; // Assuming this data indicates whether email is valid or not
    } catch (error) {
      getUnAutherisedTokenMessage();
      handleCoockieExpire();
      // console.error("Error validating email:", error);
      // throw error;
    }
  };
  const handleBlur = async (name) => {
    if (name === "email") {
      console.log(errors.email);
      if (errors.email == "") {
        try {
          let result = await emailValidate(editData.email);
          if (result == true) {
            // console.log(editData.email);
            // console.log(ExitEmail);
            if (ExitEmail !== editData.email) {
              setErrors((prev) => ({
                ...prev,
                email: "Email already exists",
              }));
            } else {
              setErrors((prev) => ({
                ...prev,
                email: "",
              }));
            }
          } else {
            console.log("nooo");
            setErrors((prev) => ({
              ...prev,
              email: "", // Clear the error if email does not exist
            }));
          }
        } catch (error) {
          getUnAutherisedTokenMessage();
          handleCoockieExpire();
        }
      }
    }
  };
  // ============================================
  const handleChangeAdmin = (e) => {
    const { name, value } = e.target;
    let updatedErrors = { ...errors };
    let emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    console.log(editData);

    if (name === "owner_name") {
      // updatedErrors[name] = value === "" ? `please fill the ${name} field` : "";
      updatedErrors[name] =
        value.trim() === ""
          ? `Owner Name is required`
          : value[0] === " "
            ? `Owner Name cannot start with a space`
            : "";
    }
    if (name == "email") {
      console.log(value);
      updatedErrors[name] =
        value === ""
          ? `Email is required`
          : !emailRegex.test(value)
            ? "Please enter a valid email"
            : "";
    }
    if (name === "phone") {
      const numericValue = value.replace(/[^0-9]/g, "");
      if (numericValue == "") {
        updatedErrors[name] = `Phone is required`;
      } else if (numericValue.length !== 10) {
        updatedErrors[name] = "Phone number must be 10 digits";
      } else {
        updatedErrors[name] = "";
      }
      //   updatedErrors['phone'] = value === "" ? `please fill the ${name} field` : '';
    }

    setErrors(updatedErrors);
    // const trimmedValue = value.replace(/^\s+|\s+$/g, '')
    setEditData((prevCustomerData) => ({
      ...prevCustomerData,
      // [name]: trimmedValue,
      [name]: value,
    }));

    // setEditData({...editData,[name]:value})
  };
  const handleKeyPress = (e) => {
    // Allow only numeric characters (key codes 48 to 57) and backspace (key code 8)
    if ((e.charCode < 48 || e.charCode > 57) && e.charCode !== 8) {
      e.preventDefault();
    }
  };
  const validateForm = async () => {
    let error = false;
    let updatedErrors = { ...errors };
    if (editData.owner_name == "") {
      updatedErrors.owner_name = "Owner Name is required";
      error = true;
    }
    if (editData.email == "") {
      updatedErrors.email = "Email is required";
      error = true;
    } else {
      try {
        if (errors.email == "") {
          setLoader(true);
          const emailValid = await emailValidate(editData.email);
          if (emailValid == true) {
            setLoader(false);
            if (ExitEmail !== editData.email) {
              updatedErrors.email = "Email already exists";
              error = false;
            } else {
              updatedErrors.email = "";
              error = true;
            }
          } else {
            updatedErrors.email = "";
            error = true;
          }
        } else {
          error = false;
        }
      } catch (error) {
        console.error("Error validating email:", error);
        error = false;
      }
    }

    // if (editData.phone == "") {
    //   updatedErrors.phone = "Please fill the phone field";
    //   error = true;
    // }

    // setErrors({ ...errors, updatedErrors });
    setErrors(updatedErrors);
    // console.log(errors);
    if (error == true) {
      return false;
    } else {
      return true;
    }
  };
  // --------------------------------------
  // ==============
  const keyEnter = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      setEditData((prev) => ({
        ...prev,
        [event.target.name]: event.target.value,
      }));
      if (loader == false) {
        handleSubmitAdmin(event);
      }
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", keyEnter);
    return () => {
      document.removeEventListener("keydown", keyEnter);
    };
  }, [editData]);

  // ==============
  // --------------------------------------

  const handleSubmitAdmin = async (e) => {
    e.preventDefault();
    const { token, ...newData } = userTypeData;
    // console.log(newData)
    const data = {
      admin_id: editData.id,
      name: editData.owner_name.trim(),
      owner_name: editData.owner_name.trim(),
      password: editData.password1.trim(),
      phone: editData.phone,
      email: editData.email.trim(),
      ...newData,
    };
    let validate = Object.values(errors).filter((error) => error !== "").length;
    const validateBlank = await validateForm();
    if (!validateBlank) {
      if (validate == 0) {
        setLoader(true);
        try {
          await axios
            .post(BASE_URL + UPDATE_ADMIN_RECORD, data, {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
              },
            })
            .then((result) => {
              setLoader(false);
              setEditData({
                owner_name: "",
                email: "",
                password: "",
                phone: "",
                password: "",
              });
              setExitEmail("");
              ToastifyAlert(result?.data?.message, "success");
              // handleClick();
              navigate("/users/admin");
            });
        } catch (error) {
          getUnAutherisedTokenMessage();
          handleCoockieExpire();
        }
      }
    }
  };
  return {
    handleEditAdmin,
    editData,
    handleChangeAdmin,
    handleSubmitAdmin,
    errors,
    handleKeyPress,
    loader,
    loaderEdit,
    handleBlur,
    keyEnter,
  };
};
export default EditAdminFunctionality;
