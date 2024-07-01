// import React from "react";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { editEmployee } from "../../../Redux/features/StoreSettings/AddEmployee/AddEmployeeSlice";
import Validation from "../../../Constants/Validation";
// import { useNavigate } from "react-router-dom";
import { BASE_URL, ADDEDIT_EMPLOYEE } from "../../../Constants/Config";
import { useAuthDetails } from "../../../Common/cookiesHelper";
import { ToastifyAlert } from "../../../CommonComponents/ToastifyAlert";

const AddEmployeeFormLogic = ({ employee, employeeList }) => {
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
  // const handleSubmitMessage = () => {
  //   setTimeout(() => {
  //     setsubmitmessage("");
  //   }, 2000);
  // };

  useEffect(() => {
    setValues((prevValues) => ({
      ...prevValues,
      firstname: employee && employee.f_name ? employee.f_name : "",
      lastname: employee && employee.l_name ? employee.l_name : "",
      email: employee && employee.email ? employee.email : "",
      phone: employee && employee.phone ? employee.phone : "",
      pin: employee && employee.pin ? employee.pin : "",
      wages: employee && employee.wages_per_hr ? employee.wages_per_hr : "",
      address_line_1: employee && employee.address ? employee.address : "",
      city: employee && employee.city ? employee.city : "",
      zipcode: employee && employee.zipcode ? employee.zipcode : "",
      state: employee && employee.state ? employee.state : "",
    }));
  }, [employee]);

  const handleEditEmployeeInput = async (event) => {
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

  const handleEditEmployee = async (e) => {
    console.log("222");
    e.preventDefault();
    let { errors } = values;
    await validateFirstName(values.firstname, errors);
    await validateLastName(values.lastname, errors);
    await validateEmail(values.email, errors);
    await validatePhoneNumber(values.phone, errors);
    await validatePinNumber(values.pin, errors);
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
        // "admin_id":"MAL0100CA",
        admin_id: "",
        employee_id: employee.id,
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
          ToastifyAlert(response?.data?.message, "success");
          dispatch(editEmployee(data));
          setShowModal(false);
          // Navigate("/");
          console.log("22311");
        } else {
          console.log("33");
          //   await handleScrollClick()
          console.log(response.data.message);
          setsubmitmessage(response.data.message);
          // handleSubmitMessage();
          setShowModal(true);
        }
      } catch (error) {
        console.log("33");
        return new Error(error);
      }
    }

    setValues((prevState) => ({
      ...prevState,
      errors,
    }));
  };

  return {
    handleEditEmployeeInput,
    handlePhoneInput,
    handlePinInput,
    handleZipInput,
    values,
    handleEditEmployee,
    submitmessage,
    setsubmitmessage,
    showModal,
    setShowModal,
    scrollRef,
  };
};

export default AddEmployeeFormLogic;
