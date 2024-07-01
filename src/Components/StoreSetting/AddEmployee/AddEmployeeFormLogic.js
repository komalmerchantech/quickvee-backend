// import React from "react";
import { useState, useRef } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addToEmployeeList } from "../../../Redux/features/StoreSettings/AddEmployee/AddEmployeeSlice";
import Validation from "../../../Constants/Validation";
// import { useNavigate } from "react-router-dom";
import {
  BASE_URL,
  ADDEDIT_EMPLOYEE,
  CHECK_EXISTING_PIN,
} from "../../../Constants/Config";
import { useAuthDetails } from "../../../Common/cookiesHelper";
import { ToastifyAlert } from "../../../CommonComponents/ToastifyAlert";

const AddEmployeeFormLogic = ({ employeeList }) => {
  const dispatch = useDispatch();
  const {
    validateFirstName,
    validateLastName,
    validateEmail,
    validatePhoneNumber,
    validatePinNumber,
    validateWages,
    Address_line_1,
    validateCity,
    validateState,
    validateZipCode,
  } = Validation();
  const [submitmessage, setsubmitmessage] = useState("");
  // const Navigate = useNavigate();
  const scrollRef = useRef(null);
  const [showModal, setShowModal] = useState(false);

  const { LoginGetDashBoardRecordJson, LoginAllStore, userTypeData } =
    useAuthDetails();
  let AuthDecryptDataDashBoardJSONFormat = LoginGetDashBoardRecordJson;
  const merchant_id = AuthDecryptDataDashBoardJSONFormat?.data?.merchant_id;

  const [values, setValues] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    pin: "",
    wages: "",
    address_line_1: "",
    address_line_2: "",
    city: "",
    zipcode: "",
    state: "",
    errors: {
      firstname: "",
      lastname: "",
      email: "",
      phone: "",
      pin: "",
      wages: "",
      address_line_1: "",
      address_line_2: "",
      city: "",
      zipcode: "",
      state: "",
    },
  });
  const handleKeyPress = (e) => {
    // Allow only numeric characters (key codes 48 to 57) and backspace (key code 8)
    if ((e.charCode < 48 || e.charCode > 57) && e.charCode !== 8) {
      e.preventDefault();
    }
  };
  // ===================== PIN CHECK
  const checkValidPin = async (data) => {
    const { token, ...newData } = userTypeData;
    const dataNew = { ...data, ...newData };
    try {
      const response = await axios.post(
        BASE_URL + CHECK_EXISTING_PIN,
        dataNew,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data; // Assuming this data indicates whether email is valid or not
    } catch (error) {
      console.error("Error validating email:", error);
      throw error;
    }
  };
  // ================== PIN CHECK

  // const handleBlur = async (name) => {
  //   if (name == "pin") {
  //     if (merchant_id !== "" && !!merchant_id && values.pin !== "") {
  //       try {
  //         let data = { merchant_id: merchant_id, pin: values.pin };
  //         let response = await checkValidPin(data);
  //         if (response.status == true) {
  //           setValues((prevValues) => ({
  //             ...prevValues,
  //             errors: {
  //               ...prevValues.errors,
  //               pin: "",
  //             },
  //           }));
  //         } else {
  //           setValues((prevValues) => ({
  //             ...prevValues,
  //             errors: {
  //               ...prevValues.errors,
  //               pin: "Pin is Exists",
  //             },
  //           }));
  //         }
  //       } catch (error) {}
  //     }
  //   }
  // };

  const handleAddEmployeeInput = async (event) => {
    let { errors } = values;
    const fieldName = event.target.name;
    const fieldValue = event.target.value;

    switch (fieldName) {
      case "firstname":
        await validateFirstName(fieldValue, errors);
        break;
      case "lastname":
        await validateLastName(fieldValue, errors);
        break;
      case "email":
        await validateEmail(fieldValue, errors);
        break;
      case "phone":
        await validatePhoneNumber(fieldValue, errors);
        break;
      case "pin":
        await validatePinNumber(fieldValue, errors, employeeList);
        break;
      case "wages":
        await validateWages(fieldValue, errors);
        break;
      case "address_line_1":
        await Address_line_1(fieldValue, errors);
        break;
      case "city":
        await validateCity(fieldValue, errors);
        break;
      case "zipcode":
        await validateZipCode(fieldValue, errors);
        break;
      case "state":
        await validateState(fieldValue, errors);
        break;
      default:
        break;
    }

    setValues((prevValues) => ({
      errors,
      ...prevValues,
      [fieldName]: fieldValue,
    }));
  };

  const handlePhoneInput = (event) => {
    const value = event.target.value.replace(/\D/g, ""); // Remove non-numeric characters
    setValues((prevValues) => ({
      ...prevValues,
      phone: value,
    }));
  };
  const handlePinInput = (event) => {
    const value = event.target.value.replace(/\D/g, ""); // Remove non-numeric characters
    setValues((prevValues) => ({
      ...prevValues,
      pin: value,
    }));
  };
  const handleZipInput = (event) => {
    const value = event.target.value.replace(/\D/g, ""); // Remove non-numeric characters
    setValues((prevValues) => ({
      ...prevValues,
      zipcode: value,
    }));
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    let { errors } = values;
    await validateFirstName(values.firstname, errors);
    await validateLastName(values.lastname, errors);
    await validateEmail(values.email, errors);
    await validatePhoneNumber(values.phone, errors);
    await validatePinNumber(values.pin, errors, employeeList);
    await validateWages(values.wages, errors);
    await Address_line_1(values.address_line_1, errors);
    await validateCity(values.city, errors);
    await validateZipCode(values.zipcode, errors);
    await validateState(values.state, errors);

    if (
      errors.firstname === "" &&
      errors.lastname === "" &&
      errors.email === "" &&
      errors.phone === "" &&
      errors.pin === "" &&
      errors.wages === "" &&
      errors.address_line_1 === "" &&
      errors.city === "" &&
      errors.zipcode === "" &&
      errors.state === ""
    ) {
      const data = {
        merchant_id: merchant_id,
        // admin_id: "MAL0100CA",
        admin_id: "",
        f_name: values.firstname,
        l_name: values.lastname,
        email: values.email.toLowerCase(),
        phone: values.phone,
        pin: values.pin,
        wages: values.wages,
        address_line_1: values.address_line_1,
        city: values.city,
        zip: values.zipcode,
        state: values.state,
        token_id: userTypeData?.token_id,
        login_type: userTypeData?.login_type,
      };

      try {
        const response = await axios.post(BASE_URL + ADDEDIT_EMPLOYEE, data, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${userTypeData?.token}`,
          },
        });
        console.log(response.data);
        if (response.data.status === true) {
          ToastifyAlert("Added Successfully", "success");
          const latest_employee = response.data.inserted_data;
          dispatch(addToEmployeeList(latest_employee));
          setShowModal(false);
          values.firstname = "";
          values.lastname = "";
          values.email = "";
          values.phone = "";
          values.pin = "";
          values.wages = "";
          values.address_line_1 = "";
          values.city = "";
          values.zipcode = "";
          values.state = "";

          values.errors.firstname = "";
          values.errors.lastname = "";
          values.errors.email = "";
          values.errors.phone = "";
          values.errors.pin = "";
          values.errors.wages = "";
          values.errors.address_line_1 = "";
          values.errors.city = "";
          values.errors.zipcode = "";
          values.errors.state = "";
          // Navigate("/");
        } else {
          setsubmitmessage(response.data.message);
          setShowModal(true);
        }
      } catch (error) {
        return new Error(error);
      }
    }

    setValues((prevState) => ({
      ...prevState,
      errors,
    }));
  };

  return {
    handleAddEmployeeInput,
    handlePhoneInput,
    handlePinInput,
    handleZipInput,
    values,
    handleAddEmployee,
    submitmessage,
    setsubmitmessage,
    showModal,
    setShowModal,
    scrollRef,
    handleKeyPress,
    // handleBlur,
  };
};

export default AddEmployeeFormLogic;
