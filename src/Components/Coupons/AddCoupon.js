import React, { useState, useCallback } from "react";
import AddNewCategory from "../../Assests/Dashboard/Left.svg";
import CustomeDateTime from "./CustomeDateTime";
import axios from "axios";
import {
  BASE_URL,
  COUPON_TITLE_CHECK,
  ADD_COUPON,
} from "../../Constants/Config";
import _ from "lodash";
import Switch from "@mui/material/Switch";
import Grid from "@mui/material/Grid";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import caleIcon from "../../Assests/Filter/Calender.svg";
import TimeIcon from "../../Assests/Filter/Clock.svg";
import dayjs, { Dayjs } from "dayjs";
import BasicTextFields from "../../reuseableComponents/TextInputField";
import SwitchLabel from "../../reuseableComponents/SwitchLabel";
import { FormControl } from "@mui/material";
import { useAuthDetails } from "../../Common/cookiesHelper";
import CurrencyInputHelperFun from "../../helperFunctions/CurrencyInputHelperFun";
import { ToastifyAlert } from "../../CommonComponents/ToastifyAlert";
import AlertModal from "../../reuseableComponents/AlertModal";
import PasswordShow from "../../Common/passwordShow";
import CircularProgress from "@mui/material/CircularProgress";
import { Link,useNavigate } from "react-router-dom";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";

const AddCoupon = ({ seVisible }) => {
  const { LoginGetDashBoardRecordJson, LoginAllStore, userTypeData } =
    useAuthDetails();
    const {handleCoockieExpire,getUnAutherisedTokenMessage}=PasswordShow()
  const [activeTab, setActiveTab] = useState("amount");
  const [switchdisable, setSwitchdisable] = useState(false);

  const [couponStates, setCouponStates] = useState({
    online: false,
    enable_limit: false,
    list_online:false,
  });

  const handleCheckboxChange = (couponName) => (e) => {
    if(switchdisable && (couponName === "online" || couponName === "list_online" )){
      setCouponStates({
        ...couponStates,
        online: false,
        list_online:false, 
      })
    }else{
      setCouponStates({
        ...couponStates,
        [couponName]: e.target.checked ? 1 : 0,
      });

    }
  };

  const [inputValue, setInputValue] = useState("");
  const [isUnique, setIsUnique] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [alertModalHeaderText, setAlertModalHeaderText] = useState("");
  const [loader, setLoader] = useState(false);

  const showModal = (headerText) => {
    setAlertModalHeaderText(headerText);
    setAlertModalOpen(true);
  };

  // Function to check uniqueness in the database
  let merchant_id = LoginGetDashBoardRecordJson?.data?.merchant_id;
  const checkUniqueness = async (value) => {
    const data = {
      merchant_id,
      name: value,
      ...userTypeData,
    };
    try {
      const { token, ...dataNew } = data;

      const response = await axios.post(
        BASE_URL + COUPON_TITLE_CHECK,
        dataNew,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data && response.data.status !== undefined) {
        setIsUnique(response.data.status); // Assuming the API returns { isUnique: boolean }
        setErrorMessage(
          response.data.status ? "" : "Coupon name already exists"
        );
      }
    } catch (error) {
      console.error("Error checking name uniqueness", error);
      handleCoockieExpire()
      getUnAutherisedTokenMessage()
    }
  };

  // Debounce the checkUniqueness function
  const debouncedCheck = useCallback(_.debounce(checkUniqueness, 300), []);

  const handleInputChange = (e) => {
    let value = e.target.value;
    const regex = /^[A-Za-z0-9 ]*$/;

    if (regex.test(value) || value === "") {
      if (value.includes(" ")) {
        setErrorMessage("Spaces between letters are not allowed");
      } else {
        value = value.toUpperCase();
        setInputValue(value);
        setIsUnique(true);
        setErrorMessage("");
        if (value) {
          debouncedCheck(value);
        }
      }
    } else {
      setErrorMessage("Special characters are not allowed");
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCoupon({ ...coupon, discount: "" })
    setDateMaxDisAMTError("");
    setDiscountError("");
    setSwitchdisable(false)
  };

  const minutes = Math.round(dayjs().minute() / 15) * 15;
  const roundedTime = dayjs().minute(minutes).second(0);
  // console.log(roundedTime);

  const [coupon, setCoupon] = useState({
    merchant_id,
    coupon_type: 0,
    is_online: "",
    coupon_code: "",
    description: "",
    min_amount: "0.00",
    discount: "0.00",
    flag: "",
    maximum_discount: "",
    date_valid: "",
    date_expire: "",
    count_limit:"",
    time_valid: dayjs().format("HH:mm:ss"),
    time_expire: dayjs().format("HH:mm:ss"),

    // time_valid: roundedTime.format("HH:mm:ss"),
    // time_expire: roundedTime.format("HH:mm:ss"),
  });
  // console.log("coupon", coupon);

  const handleStartTimeChange = (newTime) => {
    setCoupon({
      ...coupon,
      time_valid: newTime.format("HH:mm:ss"),
    });
  };
  const handleEndTimeChange = (newTime) => {
    setCoupon({
      ...coupon,
      time_expire: newTime.format("HH:mm:ss"),
    });
  };

  // const handleStartDateChange = (newDate) => {
  //   const formattedStartDate = newDate.format("YYYY-MM-DD");
  //   const dayjsDate = dayjs(newDate);
  //   const today = new Date().toISOString().split("T")[0];
  //   if (dayjsDate === coupon.date_expire) {
  //     // showModal("Start date cannot be the same as the end date");
  //     setCoupon({
  //       ...coupon,
  //       date_valid: formattedStartDate,
  //     });
  //     setDateStartError("");
  //     // setDateStartError("Start Date is required");
  //   } else if (dayjs(dayjsDate).isAfter(dayjs(coupon.date_expire))) {
  //     // showModal("Start date cannot be greater than the end date");
  //     setCoupon({
  //       ...coupon,
  //       date_valid: formattedStartDate,
  //       date_expire: "",
  //     });
  //     setDateStartError("Start Date is required");
  //   } else {
  //     setCoupon({
  //       ...coupon,
  //       date_valid: formattedStartDate,
  //     });
  //     setDateStartError("");
  //   }
  //   if(dayjsDate < today){
  //     setCoupon({
  //       ...coupon,
  //       date_valid: "",
  //     });
  //     setDateStartError("Start Date cannot be before the current date");
  //   }
  // };

  // const handleEndDateChange = (newDate) => {
  //   const formattedEndDate = newDate.format("YYYY-MM-DD");
  //   const dayjsDate = dayjs(newDate);
  //   const today = new Date().toISOString().split("T")[0];
  //   if (dayjsDate === coupon.date_valid) {
  //     // showModal("End date cannot be the same as the start date");
  //     setCoupon({
  //       ...coupon,
  //       date_expire: formattedEndDate,
  //     });
  //     // setDateEndError("End Date is required");
  //     setDateEndError("")
  //     // return; // Do not update the state
  //   } else if (dayjs(dayjsDate).isBefore(dayjs(coupon.date_valid))) {
  //     showModal("End date cannot be less than the start date");
  //     setCoupon({
  //       ...coupon,
  //       date_expire: "",
  //     });
  //     setDateEndError("End Date is required");
  //   } else {
  //     setCoupon({
  //       ...coupon,
  //       date_expire: formattedEndDate,
  //     });
  //     setDateEndError("");
  //   }
  //   if(dayjsDate < today){
  //     setCoupon({
  //       ...coupon,
  //       date_expire: "",
  //     });
  //     setDateEndError("End Date cannot be before the current date");
  //   }
  // };


  const handleStartDateChange = (newDate) => {

    if (!newDate || !newDate.isValid()) {
      // showModal("Buss");
      setDateStartError("Invalid date. Please select a valid date.");
      setCoupon({
        ...coupon,
        date_valid: null,
      });
      return;
    }
    const formattedStartDate = newDate.format("YYYY-MM-DD");
    const dayjsDate = dayjs(formattedStartDate);
    const today = dayjs().format("YYYY-MM-DD");
    const endDate = coupon.date_expire;
  
    // Check if the start date is before today's date
    if (formattedStartDate < today) {
      setCoupon({
        ...coupon,
        date_valid: "",
      });
      setDateStartError("Start Date cannot be before the current date");
    }else if (endDate && dayjsDate.isAfter(dayjs(endDate))) {
      // showModal("Start date cannot be greater than the end date");
      setCoupon({
        ...coupon,
        date_valid: formattedStartDate,
        date_expire: "",
      });
      setDateStartError("");
      setDateEndError("End Date is required");
    }else {
      setCoupon({
        ...coupon,
        date_valid: formattedStartDate,
      });
      setDateStartError("");
      setDateEndError("");
    }
    // console.log("coupon StartDate", coupon.date_valid);
  };
  

  const handleEndDateChange = (newDate) => {
    if (!newDate || !newDate.isValid()) {
      // showModal("Buss");
      setDateEndError("Invalid date. Please select a valid date.");
      setCoupon({
        ...coupon,
        date_expire: null,
      });
      return;
    }
    const formattedEndDate = newDate.format("YYYY-MM-DD");
    const dayjsEndDate = dayjs(formattedEndDate);
    const today = dayjs().format("YYYY-MM-DD");
    const startDate = coupon.date_valid;
  
    // Check if the end date is before today's date
    if (formattedEndDate < today) {
      setCoupon({
        ...coupon,
        date_expire: "",
      });
      setDateEndError("End Date cannot be before the current date");
    } 
    // Check if the end date is less than the start date
    else if (startDate && dayjsEndDate.isBefore(dayjs(startDate))) {
      // showModal("End date cannot be less than the start date");
      setCoupon({
        ...coupon,
        date_expire: "",
      });
      // setDateEndError("End Date is required");
      setDateEndError("End Date cannot be less than the start date");
    } 
    // If the end date is valid
    else {
      setCoupon({
        ...coupon,
        date_expire: formattedEndDate,
      });
      setDateEndError("");
    }
    // console.log("coupon EndDate", coupon.date_expire);
  };

  const [minOrderAmountError, setMinOrderAmountError] = useState("");
  const [discountError, setDiscountError] = useState("");
  const [dateStartError, setDateStartError] = useState("");
  const [dateEndError, setDateEndError] = useState("");
  const [dateMaxDisAMTError, setDateMaxDisAMTError] = useState("");
  const [countLimitError, setCountLimitError] = useState("");

  const navigate = useNavigate()
  const handleAddButtonClick = async (e) => {
    e.preventDefault();
    const today = new Date().toISOString().split("T")[0];
    if (errorMessage === "Coupon name already exists") {
      // return;
    } else if (inputValue === "") {
      setErrorMessage("Coupon name is required");
      // return;
    } else {
      setErrorMessage("");
    }

 
    if (!coupon.min_amount) {
      setMinOrderAmountError("Minimum Order Amount is required");
      // return; // Stop further execution
    } else if (coupon.min_amount === "0.00") {
      setMinOrderAmountError("Minimum Order Amount is required");
      // return;
    } else {
      setMinOrderAmountError("");
    }
    if (activeTab === "amount") {
      if (!coupon.discount) {
        setDiscountError("Discount Amount is required");
        return; // Stop further execution
      } else if (coupon.discount === "0.00") {
        setDiscountError("Discount Amount is required");
        return;
      } else {
        setDiscountError("");
      }
      if (parseFloat(coupon.min_amount) <= parseFloat(coupon.discount)) {
        showModal("Minimum order amount must be greater than the discount amount.");
        setDiscountError("Discount Amount is required");
        setCoupon({ ...coupon, discount: "0.00" });
        return; // Stop further execution
      }
    }

    // if (activeTab === "percentage") {
    //   if (!coupon.maximum_discount) {
    //     setDateMaxDisAMTError("Maximum Discount Amount is required");

    //     // return; // Stop further execution
    //   } else if (coupon.maximum_discount === "") {
    //     setDateMaxDisAMTError("Maximum Discount Amount is required");
    //     // return;
    //   } else {
    //     setDateMaxDisAMTError("");
    //   }
    // }

    if (!coupon.date_valid) {
      //  alert("Start Date are required.");
      setDateStartError("Start Date is required");
      // return; // Stop further execution
    }
    if (!coupon.date_expire) {
      // alert("End Date are required.");
      setDateEndError("End Date is required");
      // return; // Stop further execution
    }
    if (activeTab === "percentage") {
      if(+coupon.discount > 100){
        setDiscountError("Discount Percentage is cannot exceed 100.00%");
        return
      }
      if (!coupon.discount == null || coupon.discount === "" || coupon.discount === "0.00") {
        setDiscountError("Discount Amount Percentage is required");
        return
      }else {
        setDiscountError("");
      }
    }

    const formData = new FormData();
    formData.append("merchant_id", coupon.merchant_id);
    formData.append("coupon_type", coupon.coupon_type);
    formData.append("coupon_code", inputValue);
    formData.append("description", coupon.description);
    formData.append("min_order_amount", coupon.min_amount);
    formData.append("discount", coupon.discount);
    formData.append("start_date", coupon.date_valid);
    formData.append("end_date", coupon.date_expire);
    formData.append("is_online", couponStates.online ? "1" : "0");
    formData.append("list_online", couponStates.list_online ? "1" : "0");
    formData.append("flag", activeTab === "percentage" ? "0" : "1");
    if (activeTab === "percentage") {
      formData.append("max_discount_amount", coupon.maximum_discount);
    } else {
      formData.append("max_discount_amount", "0.00");
    }
    formData.append(
      "enable_redemption_limit",
      couponStates.enable_limit ? "1" : "0"
    );
    if (couponStates.enable_limit > 0) {
      if (!coupon.count_limit === "0" || !coupon.count_limit === "00" || !coupon.count_limit === "000") {
        setCountLimitError("Please enter a value greater than or equal to 1.");
        return; // Stop further execution
      }
      formData.append(
        "enable_redemption_limit",
        couponStates.enable_limit ? "1" : "0"
      );

      if (!coupon.count_limit) {
        setCountLimitError("Redemption Limit is required");
        return; // Stop further execution
      } else {
        setCountLimitError("");
      }

      if (coupon.count_limit === null || coupon.count_limit === "0" || coupon.count_limit === "00" || coupon.count_limit === "000") {
        setCountLimitError("Please enter a value greater than or equal to 1.");
        return; // Stop further execution
      }

      formData.append("redemption_limit", coupon.count_limit);
    }

    // formData.append(
    //   "start_time",
    //   dayjs(coupon.time_valid, "HH:mm:ss").format("hh:mm A")
    // );

    // formData.append(
    //   "end_time",
    //   dayjs(coupon.time_expire, "HH:mm:ss").format("hh:mm A")
    // );
    formData.append("token_id", userTypeData?.token_id);
    formData.append("login_type", userTypeData?.login_type);

    if (
      dateStartError === "Invalid date. Please select a valid date." ||
      dateEndError === "Invalid date. Please select a valid date." ||
      errorMessage === "Coupon name already exists" ||
      inputValue === "" ||
      minOrderAmountError === "Minimum Order Amount is required" ||
      discountError === "Discount Amount is required" ||
      discountError === "Discount Amount Percentage is required" ||
      dateStartError === "Start Date is required" ||
      dateEndError === "End Date is required" ||
      // dateMaxDisAMTError === "Maximum Discount Amount is required" ||
      dateStartError === "Start Date cannot be before the current date" ||
      dateEndError === "End Date cannot be before the Start date" || 
      dateEndError === "End Date cannot be less than the start date"  ||
      discountError === "Discount Percentage is cannot exceed 100.00%"  
    ) {
      return;
    }

    if (!coupon.date_valid) {
      setDateStartError("Start Date is required");
      return;
    } else {
      setDateStartError("");
    }

    if (!coupon.date_expire) {
      setDateEndError("End Date is required");
      return;
    } else {
      setDateEndError("");
    }

    for (const [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }
    // return
    setLoader(true);

    try {
      const res = await axios.post(BASE_URL + ADD_COUPON, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${userTypeData?.token}`,
        },
      });

      const data = await res.data.status;
      const update_message = await res.data.message;
      if (data === true) {
        ToastifyAlert("Added Successfully", "success");
        let data = {
          merchant_id,
        };
        // seVisible("CouponDiscount");
        navigate("/coupons");
      } else if (
        data == false &&
        update_message === "Coupon not added, please try again."
        
      ) {
        setErrorMessage(update_message);
        ToastifyAlert(update_message, "error");
      }
    } catch (error) {
      console.error("API Error:", error);
      handleCoockieExpire()
      getUnAutherisedTokenMessage()
    }
    setLoader(false);
  };

  const handleMinAmountChange = (e) => {
    if (!isNaN(e.target.value)) {
      const { value } = e.target;
      const formattedValue = CurrencyInputHelperFun(value);
      if (formattedValue === "0.00") {
        setMinOrderAmountError("Minimum Order Amount is required");
      } else {
        setMinOrderAmountError("");
      }
      setCoupon({ ...coupon, min_amount: formattedValue });
    }
  };

  const handleDiscountAmountChange = (e) => {
    if (!isNaN(e.target.value)) {
    const { value } = e.target;
    const formattedValue = CurrencyInputHelperFun(value);
    if (formattedValue === "0.00") {
      setDiscountError("Discount Amount is required");
    } else {
      setDiscountError("");
    }
    setCoupon({ ...coupon, discount: formattedValue });
    }
    setSwitchdisable(false)
  };

  const handleDiscountPercentChange = (e) => {
    if (!isNaN(e.target.value)) {
    const { value } = e.target;
    const formattedValue = CurrencyInputHelperFun(value);
    if (formattedValue === "0.00") {
      setDiscountError("Discount Percentage is required");
    } else {
      setDiscountError("");
    }
    if(+formattedValue > 100){
      setDiscountError("Discount Percentage is cannot exceed 100.00%");
    }
    if(+formattedValue === 100 || +formattedValue > 100){  
      setCouponStates({
        ...couponStates,
        online: false,
        list_online:false,
      })
      setSwitchdisable(true)
    }else{
      setSwitchdisable(false)
    }
    setCoupon({ ...coupon, discount: formattedValue });
    }
  };

  const handleMaxDiscountChange = (e) => {
    // const inputValue = e.target.value;
    if (!isNaN(e.target.value)) {
      const { name, value } = e.target;
      let fieldValue;
      fieldValue = value
        // Remove extra dots and ensure only one dot exists at most
        .replace(/[^\d.]/g, "") // Allow digits and dots only
        .replace(/^(\d*\.)(.*)\./, "$1$2") // Remove extra dots
        .replace(/^(\d*\.\d*)(.*)\./, "$1$2"); // Remove extra dots after the decimal point
      let inputStr = fieldValue.replace(/\D/g, "");
      inputStr = inputStr.replace(/^0+/, "");

      if (inputStr.length == "") {
        fieldValue = "0.00";
      } else if (inputStr.length === 1) {
        fieldValue = "0.0" + inputStr;
      } else if (inputStr.length === 2) {
        fieldValue = "0." + inputStr;
      } else {
        fieldValue =
          inputStr.slice(0, inputStr.length - 2) + "." + inputStr.slice(-2);
      }
      if (fieldValue.trim() === "") {
          // setDateMaxDisAMTError("Maximum Discount Amount is required");
          setCoupon({ ...coupon, maximum_discount: "" });
      } else {
        setCoupon({ ...coupon, maximum_discount: fieldValue });
        setDateMaxDisAMTError("");
      }
    }
  };

  const preventKeyPress = (event) => {
    event.preventDefault();
    const forbiddenKeys = [
      "ArrowUp",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
    ];
    if (forbiddenKeys.includes(event.key)) {
      event.preventDefault();
    }
  };

  return (
    <>
      <div className="box">
        <div className="box_shadow_div">
          <div className="q-add-categories-section">
            <div className="q-add-categories-section-header">
            <Link to={`/coupons`}>
              {/* <span
                onClick={() => seVisible("CouponDiscount")}
                className="add_coupon_span"
              > */}
                <img
                  src={AddNewCategory}
                  alt="Add-New-Category"
                  className="h-9 w-9"
                />
                <span className="textIMG">Add Coupon</span>
              {/* </span> */}
              </Link>
            </div>
            <form onSubmit={handleAddButtonClick}>
              <div className="q-add-categories-section-middle-form">
                <div className="q_coupon_Add_status_btn">
                  <p>Show Online</p>
                  <SwitchLabel
                    checked={couponStates.online}
                    onChangeFun={handleCheckboxChange("online")}
                  />
                </div>
                <div className="q_coupon_Add_status_btn">
                  <p>List Online</p>
                  <SwitchLabel
                    checked={couponStates.list_online}
                    onChangeFun={handleCheckboxChange("list_online")}
                  />
                </div>

                <div className="q-add-coupon-single-input mb-2">
                  <label htmlFor="coupon_name">Coupon Code</label>
                  <div className="input_area input">
                    <BasicTextFields
                      type={"text"}
                      value={inputValue}
                      maxLength={11}
                      onChangeFun={handleInputChange}
                      sx={{ mt: 0.5 }}
                    />
                  </div>
                  {errorMessage && (
                    <p className="error-message">{errorMessage}</p>
                  )}
                </div>

                <div className="q-add-coupon-single-input mb-6">
                  <label htmlFor="description">Description</label>
                  <textarea
                    className="mt-1"
                    id="description"
                    name="description"
                    rows="4"
                    cols="50"
                    value={coupon.description}
                    onChange={(e) =>
                      setCoupon({ ...coupon, description: e.target.value })
                    }
                  ></textarea>
                </div>

                <Grid container spacing={2}>
                  <Grid item md={6} xs={12}>
                    <div className="q_coupon_minium input_area">
                      <label htmlFor="minorder_amt">Minimum Order Amount</label>
                      <BasicTextFields
                        type={"number"}
                        value={coupon.min_amount}
                        onChangeFun={handleMinAmountChange}
                        placeholder="Enter Minimum Order Amount"
                      />
                      {minOrderAmountError && (
                        <p className="error-message">{minOrderAmountError}</p>
                      )}
                    </div>
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <div className="q_coupon_minium  dicount_per_amo">
                      <Grid container>
                        <Grid item xs={5}>
                          {activeTab === "amount" && (
                            <div className="q_coupon_minium input_area">
                              <label htmlFor="discount_amt">
                                Discount Amount
                              </label>
                              <BasicTextFields
                                type={"number"}
                                value={coupon.discount}
                                placeholder="Enter Discount Amount"
                                onChangeFun={handleDiscountAmountChange}
                              />

                              {discountError && (
                                <p className="error-message">{discountError}</p>
                              )}
                            </div>
                          )}
                          {activeTab === "percentage" && (
                            <div className="q_coupon_minium input_area">
                              <label htmlFor="discount_per">
                                Discount Percentage
                              </label>
                              <BasicTextFields
                                type={"text"}
                                value={coupon.discount}
                                // maxLength={5}
                                placeholder="Enter Discount Percentage"
                                onChangeFun={handleDiscountPercentChange}
                              />

                              {discountError && (
                                <p className="error-message">{discountError}</p>
                              )}
                            </div>
                          )}
                        </Grid>
                        <Grid item xs={7}>
                          <div className="AMT_PER_button">
                            <Grid container>
                              <Grid item xs={6}>
                                <div
                                  className={`cursor-pointer amt_btn text-center   ${
                                    activeTab === "amount"
                                      ? "bg-[#0A64F9] text-white radius-4"
                                      : ""
                                  }`}
                                  onClick={() => handleTabChange("amount")}
                                >
                                  Amount ($)
                                </div>
                              </Grid>
                              <Grid item xs={6}>
                                <div
                                  className={`cursor-pointer amt_btn text-center  ${
                                    activeTab === "percentage"
                                      ? "bg-[#0A64F9] text-white radius-4"
                                      : ""
                                  }`}
                                  style={{ whiteSpace: "nowrap" }}
                                  onClick={() => handleTabChange("percentage")}
                                >
                                  Percentage (%)
                                </div>
                              </Grid>
                            </Grid>
                          </div>
                        </Grid>
                      </Grid>
                    </div>
                  </Grid>
                </Grid>
                {activeTab === "percentage" && (
                  <Grid
                    container
                    sx={{ marginTop: 2, marginBottom: 2 }}
                    className="q_coupon_minium input_area"
                  >
                    <Grid item xs={12}>
                      <label htmlFor="maximum_discount">
                        Maximum Discount Amount
                      </label>
                      <BasicTextFields
                        type={"text"}
                        maxLength={7}
                        value={coupon.maximum_discount}
                        placeholder="Enter Maximum Discount Amount"
                        onChangeFun={handleMaxDiscountChange}
                        sx={{ mt: 0.5 }}
                      />
                      {dateMaxDisAMTError && (
                        <p className="error-message">{dateMaxDisAMTError}</p>
                      )}
                    </Grid>
                  </Grid>
                )}
                <Grid container sx={{ marginTop: 0.5, marginBottom: 0.5 }}>
                  <Grid item xs={6}>
                    {/* <label htmlFor="coupon">Start Date & Time</label> */}
                    <label htmlFor="coupon" className="mb-2">Start Date</label>
                  </Grid>
                  <Grid item xs={6}>
                  <label htmlFor="coupon" className="pl-2 mb-2">Expire Date</label>
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={12} md={6}>
                    <Grid container className="border rounded">
                      <Grid item xs={12}>
                        <FormControl fullWidth>
                          <LocalizationProvider
                            dateAdapter={AdapterDayjs}
                            className="date-provider"
                          >
                            <DatePicker
                              onChange={(newDate) =>
                                handleStartDateChange(newDate)
                              }
                              style={{ border: "none" }} // Remove border
                              size="small"
                              format={"MMMM DD, YYYY"}
                              disablePast
                              views={["year", "month", "day"]}
                              slotProps={{
                                textField: {
                                  placeholder: "Start Date",
                                  size: "small",
                                  onKeyPress: preventKeyPress, 
                                },
                              }}
                              components={{
                                OpenPickerIcon: () => (
                                  <img src={caleIcon} alt="calendar-icon" />
                                ),
                              }}
                              className="custom-datepicker-remove-border"
                            />
                          </LocalizationProvider>
                          {dateStartError && (
                            <p className="error-message date_error">
                              {dateStartError}
                            </p>
                          )}
                        </FormControl>
                      </Grid>

                      {/* <Grid
                        item
                        xs={0.5}
                        className="flex justify-center items-center"
                      >
                        <div className="dividersss" />
                      </Grid>

                      <Grid item xs={5.6}>
                        <FormControl fullWidth>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <TimePicker
                              className="custom-datepicker-remove-border"
                              name="start_tym"
                              id="start_tym"
                              value={dayjs(coupon.time_valid, "HH:mm:ss")}
                              onChange={(newTime) =>
                                handleStartTimeChange(newTime)
                              }
                              slotProps={{
                                textField: {
                                  placeholder: "Start Time",
                                  size: "small",
                                },
                              }}
                              components={{
                                OpenPickerIcon: () => (
                                  <img src={TimeIcon} alt="time-icon" />
                                ),
                              }}
                            />
                          </LocalizationProvider>
                        </FormControl>
                      </Grid> */}
                    </Grid>
                  </Grid>
                  <Grid item xs={12} sm={12} md={6}>
                    <Grid container className="border rounded">
                      <Grid item xs={12}>
                        <FormControl fullWidth>
                          <LocalizationProvider
                            dateAdapter={AdapterDayjs}
                            className="date-provider"
                          >
                            <DatePicker
                              className="custom-datepicker-remove-border"
                              onChange={(newDate) =>
                                handleEndDateChange(newDate)
                              }
                              shouldDisableDate={(date) => {
                                const start = coupon.date_valid;
                                return date.format("YYYY-MM-DD") < start ;
                              }}
                              // value={coupon.date_expire}
                              format={"MMMM DD, YYYY"}
                              disablePast
                              // views={["year", "month", "day"]}
                              slotProps={{
                                textField: {
                                  placeholder: "End Date",
                                  size: "small",
                                  onKeyPress: preventKeyPress, 
                                },
                              }}
                              components={{
                                OpenPickerIcon: () => (
                                  <img src={caleIcon} alt="calendar-icon" />
                                ),
                              }}
                            />
                            {dateEndError && (
                              <p className="error-message date_error">
                                {dateEndError}
                              </p>
                            )}
                          </LocalizationProvider>
                        </FormControl>
                      </Grid>
                      {/* <Grid
                        item
                        xs={0.5}
                        className="flex justify-center items-center"
                      >
                        <div className="dividersss" />
                      </Grid>
                      <Grid item xs={5.6}>
                        <FormControl fullWidth>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <TimePicker
                              className="custom-datepicker-remove-border"
                              name="end_tym"
                              id="end_tym"
                              value={dayjs(coupon.time_expire, "HH:mm:ss")}
                              onChange={(newTime) =>
                                handleEndTimeChange(newTime)
                              }
                              slotProps={{
                                textField: {
                                  placeholder: "End Time",
                                  size: "small",
                                },
                              }}
                              components={{
                                OpenPickerIcon: () => (
                                  <img src={TimeIcon} alt="time-icon" />
                                ),
                              }}
                            />
                          </LocalizationProvider>
                        </FormControl>
                      </Grid> */}
                    </Grid>
                  </Grid>
                </Grid>
                

                <Grid
                  container
                  sx={{ marginTop: 4 }}
                  className="q-add-coupon-single-input"
                >
                  <Grid item xs={12} className="q_coupon_Add_status_btn">
                    <p>Enable Redemption Limit?</p>
                    <SwitchLabel
                      checked={couponStates.enable_limit}
                      onChangeFun={handleCheckboxChange("enable_limit")}
                    />
                   
                  </Grid>
                </Grid>

                {couponStates.enable_limit > 0 && (
                  <div className="q-add-coupon-single-input">
                    <label htmlFor="count_limit">Redemption Limit</label>
                    <input
                      type="text"
                      id="count_limit"
                      name="count_limit"
                      // min="1"
                      max="999"
                      maxLength={3}
                      value={coupon.count_limit}
                      // onChange={(e) =>
                      //   setCoupon({
                      //     ...coupon,
                      //     count_limit: e.target.value,
                      //   })
                      // }
                      onChange={(e) => {
                        const value = e.target.value;
                        // Only allow numbers
                        if (/^\d*$/.test(value)) {
                          setCoupon({
                            ...coupon,
                            count_limit: value,
                          });
                        }
                      }}
                    />

                    {countLimitError && (
                      <p className="error-message">{countLimitError}</p>
                    )}
                  </div>
                )}
              </div>

              <div className="q-add-categories-section-middle-footer">
                <button className="quic-btn quic-btn-save" disabled={loader}> {loader ? <><CircularProgress color={"inherit"} width={15} size={15}/>Add</> : "Add"}</button>
                <Link to={`/coupons`}>
                <button
                  // onClick={() => seVisible("CouponDiscount")}
                  className="quic-btn quic-btn-cancle"
                >
                  Cancel
                </button>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
      <AlertModal
      headerText={alertModalHeaderText}
      open={alertModalOpen}
      onClose={() => {setAlertModalOpen(false)}}
       />
    </>
  );
};

export default AddCoupon;
