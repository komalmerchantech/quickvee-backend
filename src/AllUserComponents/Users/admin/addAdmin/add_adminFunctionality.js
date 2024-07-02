import axios from "axios";
import React, { useState, useEffect } from "react";
import {
  BASE_URL,
  GET_ADD_ADMIN,
  CHECK_ADMIN_EMAIL,
} from "../../../../Constants/Config";
import { useNavigate } from "react-router-dom";
import { useAuthDetails } from "../../../../Common/cookiesHelper";
import { ToastifyAlert } from "../../../../CommonComponents/ToastifyAlert";

export default function Add_adminFunctionality({ setVisible }) {
  const { LoginGetDashBoardRecordJson, LoginAllStore, userTypeData } =
    useAuthDetails();

  const navigate = useNavigate();
  const [addAdminData, setAddAdminData] = useState({
    owner_name: "",
    email: "",
    password: "",
    phone: "",
    errors: {
      owner_name: "",
      email: "",
      password: "",
      phone: "",
    },
  });
  const [loader, setLoader] = useState(false);

  const handleChange = async (e) => {
    const { name, value } = e.target;
    let errors = { ...addAdminData.errors };
    let emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const trimmedValue = value.replace(/^\s+/, "");

    if (name === "owner_name") {
      // errors[name] = value === " " ? `Please fill in the ${name} field` : "";
      errors[name] =
        value.trim() === ""
          ? `Owner Name is required`
          : value[0] === " "
            ? `Owner Name cannot start with a space`
            : "";
    }
    if (name === "email") {
      errors[name] =
        value === ""
          ? `Email is required`
          : !emailRegex.test(value)
            ? `Please enter a valid ${name}`
            : "";
      //  await emailValidate(value)
    }
    if (name === "password") {
      errors[name] = value === "" ? `Password is required` : "";
    }
    if (name === "phone") {
      const numericValue = value.replace(/[^0-9]/g, "");
      if (numericValue == "") {
        errors[name] = `Phone is required`;
      } else if (numericValue.length !== 10) {
        errors[name] = "Phone number must be 10 digits";
      } else {
        errors[name] = "";
      }
    }
    // const trimmedValue = value.replace(/^\s+|\s+$/g, "");

    setAddAdminData((prev) => ({
      ...prev,
      errors: errors,
      [name]: value.replace(/^\s+/, ""),
    }));
  };

  const handleKeyPress = (e) => {
    // Allow only numeric characters (key codes 48 to 57) and backspace (key code 8)
    if ((e.charCode < 48 || e.charCode > 57) && e.charCode !== 8) {
      e.preventDefault();
    }
  };
  const handleBlur = async (name) => {
    if (name === "email") {
      if (addAdminData.errors.email == "") {
        setLoader(true);
        let result = await emailValidate(addAdminData.email);
        if (result == true) {
          setLoader(false);
          setAddAdminData((prev) => ({
            ...prev,
            errors: {
              ...prev.errors,
              email: "Email already exists",
            },
          }));
        } else {
          setLoader(false);
          setAddAdminData((prev) => ({
            ...prev,
            errors: {
              ...prev.errors,
              email: "",
            },
          }));
        }
      }
    }
  };

  function Currentvalidate(errors) {
    // console.log(errors.owner_name)
    if (
      errors.owner_name == "" &&
      errors.email == "" &&
      errors.password == "" &&
      errors.phone == ""
    ) {
      return true;
    } else {
      return false;
    }
  }

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
      console.error("Error validating email:", error);
      throw error;
    }
  };

  const validateForm = async () => {
    let errors = { ...addAdminData.errors };
    let formIsValid = true;

    if (addAdminData.owner_name === "") {
      errors.owner_name = "Owner Name is required";
      formIsValid = false;
    }

    if (addAdminData.email === "") {
      errors.email = "Email is required";
      formIsValid = false;
    } else {
      try {
        if (errors.email == "") {
          setLoader(true);
          const emailValid = await emailValidate(addAdminData.email);

          if (emailValid == true) {
            setLoader(false);
            errors.email = "Email already exists";
            formIsValid = false;
          } else {
            setLoader(false);
            errors.email = "";
            formIsValid = true;
          }
        } else {
          formIsValid = false;
        }
      } catch (error) {
        console.error("Error validating email:", error);
        formIsValid = false;
      }
    }

    if (addAdminData.password === "") {
      errors.password = "Password is required";
      formIsValid = false;
    }
    if (addAdminData.phone === "") {
      errors.phone = "Phone is required";
      formIsValid = false;
    }

    setAddAdminData({
      ...addAdminData,
      errors: errors,
    });
    // console.log(formIsValid)

    if (formIsValid == true) {
      return false;
    } else {
      return true;
    }
  };
  const getTimerAdmin = () => {
    setLoader(true);
    setTimeout(() => {
      navigate("/users/admin");
      setLoader(false);
    }, 4000);
  };
  // ==============
  const keyEnter = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      setAddAdminData((prev) => ({
        ...prev,
        [event.target.name]: event.target.value,
      }));
      if (loader == false) {
        handleSubmit(event);
      }
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", keyEnter);
    return () => {
      document.removeEventListener("keydown", keyEnter);
    };
  }, [addAdminData]);

  // ==============

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formIsValid = await validateForm();
    const CurrentValidate = Currentvalidate(addAdminData.errors);
    const { token, ...newData } = userTypeData;
    if (formIsValid == false) {
      if (CurrentValidate == true) {
        const packet = {
          owner_name: addAdminData.owner_name.trim(),
          email: addAdminData.email.trim(),
          password: addAdminData.password.trim(),
          phone: addAdminData.phone,
          ...newData,
        };
        setLoader(true);
        try {
          await axios
            .post(BASE_URL + GET_ADD_ADMIN, packet, {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
              },
            })
            .then((res) => {
              if (res.data.status == 200) {
                ToastifyAlert("Added Successfully", "success");
                // setVisible("AdminView")
                setAddAdminData({
                  owner_name: "",
                  email: "",
                  password: "",
                  phone: "",
                  errors: {
                    owner_name: "",
                    email: "",
                    password: "",
                    phone: "",
                  },
                });
                navigate("/users/admin");
                // getTimerAdmin();
              } else {
                // getTimerAdmin();
                ToastifyAlert("Admin not Added!", "warn");
              }
              setLoader(false);
            });
        } catch (error) {
          console.log(error);
        }
      }
    }
  };
  return {
    handleChange,
    addAdminData,
    handleSubmit,
    handleBlur,
    handleKeyPress,
    keyEnter,
    loader,
  };
}
