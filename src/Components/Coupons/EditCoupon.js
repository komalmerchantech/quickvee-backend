import React, { useState, useEffect, useCallback } from "react";
import AddNewCategory from "../../Assests/Dashboard/Left.svg";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import {
  BASE_URL,
  COUPON_DETAILS_ID_CHECK,
  COUPON_TITLE_CHECK,
  EDIT_COUPON,
} from "../../Constants/Config";
import Switch from "@mui/material/Switch";
import Grid from "@mui/material/Grid";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import caleIcon from "../../Assests/Filter/Calender.svg";
import TimeIcon from "../../Assests/Filter/Clock.svg";
import dayjs, { Dayjs } from "dayjs";

import { useNavigate } from "react-router-dom";
import BasicTextFields from "../../reuseableComponents/TextInputField";
import { useAuthDetails } from "../../Common/cookiesHelper";
import SwitchLabel from "../../reuseableComponents/SwitchLabel";
import _ from "lodash";
import CurrencyInputHelperFun from "../../helperFunctions/CurrencyInputHelperFun";
import { FormControl } from "@mui/material";
import { ToastifyAlert } from "../../CommonComponents/ToastifyAlert";
import AlertModal from "../../reuseableComponents/AlertModal";
import PasswordShow from "../../Common/passwordShow";
import CircularProgress from "@mui/material/CircularProgress";

const EditCoupon = ({couponId,seVisible}) => {
  const { LoginGetDashBoardRecordJson, LoginAllStore, userTypeData } =
    useAuthDetails();
  const {handleCoockieExpire,getUnAutherisedTokenMessage}=PasswordShow()
  const myStyles = {
    display: "flex",
  };
  const [switchdisable, setSwitchdisable] = useState(false);

  const handleCheckboxChange = (couponName) => (e) => {
    setCouponStates({
      ...couponStates,
      [couponName]: e.target.checked ? 1 : 0,
    });
  };
  let merchant_id = LoginGetDashBoardRecordJson?.data?.merchant_id;
  const [activeTab, setActiveTab] = useState("");
  const [loader, setLoader] = useState(false);

  const params = useParams();
  async function fetchData() {
    const getcouponData = {
      merchant_id,
      coupon_id:params?.couponsCode,
      ...userTypeData,
    };

    try {
      const { token, ...dataNew } = getcouponData;
      const response = await axios.post(
        BASE_URL + COUPON_DETAILS_ID_CHECK,
        dataNew,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === true) {
        // console.log(response.data.result)
        return response?.data?.result;
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
  useEffect(() => {
    // Fetch data when the component mounts
    const fetchDataAndUpdateState = async () => {
      const res = await fetchData();

      if (res) {
        setCoupon({
          id: res[0]?.id,
          m_id: res[0]?.m_id,
          name: res[0]?.name,
          description: res[0]?.description,
          merchant_id: res[0]?.m_id,
          min_amount: res[0]?.min_amount,
          discount: res[0]?.discount,
          maximum_discount: res[0]?.maximum_discount,
          date_valid: res[0]?.date_valid,
          date_expire: res[0]?.date_expire,
          // time_valid: res[0]?.time_valid,
          // time_expire: res[0]?.time_expire,
          count_limit: res[0]?.count_limit,
          flag: res[0]?.flag,
        });

        setCouponStates({
          ...couponStates,
          online: res[0]?.show_online === "1" ? true : false,
          enablelimit: res[0]?.enable_limit === "1" ? true : false,
          list_online: res[0]?.list_online === "1" ? true : false,
        });

        if (res[0]?.flag === "1") {
          setActiveTab("amount");
          if(res[0]?.discount === "0.00"){
            setDiscountError("Discount Amount is required");
          }
          setSwitchdisable(false)
        } else {
          setActiveTab("percentage");
          if(res[0]?.discount === "100.00"){
            setCouponStates({
              ...couponStates,
              online: false,
              list_online: false,
            })
            setSwitchdisable(true)
          }
        }

        // setActiveTab(res[0].flag === 1 ? "percentage" : "amount");
      }
    };

    fetchDataAndUpdateState();
  }, [params.couponsCode]);

  const [inputValue, setInputValue] = useState("");
  const [isUnique, setIsUnique] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [alertModalHeaderText, setAlertModalHeaderText] = useState("");

  const showModal = (headerText) => {
    setAlertModalHeaderText(headerText);
    setAlertModalOpen(true);
  };

  // Function to check uniqueness in the database
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
    }
  };

  // Debounce the checkUniqueness function
  const debouncedCheck = useCallback(_.debounce(checkUniqueness, 300), []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    const regex = /^[A-Za-z0-9 ]*$/;

    if (regex.test(value) || value === "") {
      setInputValue(value);
      setIsUnique(true);
      setErrorMessage("");
      if (value) {
        debouncedCheck(value);
      }
    } else {
      setErrorMessage("Special characters are not allowed");
    }
  };

  const [coupon, setCoupon] = useState({
    id: "",
    m_id: "",
    name: "",
    description: "",
    merchant_id: "",
    min_amount: "0.00",
    discount: "0.00",
    maximum_discount: "",
    date_valid: "",
    date_expire: "",
    time_valid: "",
    time_expire: "",
    count_limit: "",
    flag: "",
  });

  const [couponStates, setCouponStates] = useState({
    online: coupon.show_online,
    enablelimit: coupon.enable_limit,
    list_online: coupon.list_online,
  });

  const handleShowOnlineChange = (e) => {
    const status = e.target.checked;
    if(switchdisable ){
      setCouponStates({
        ...couponStates,
        online: false,
      })
    }else{
      setCouponStates({
        ...couponStates,
        online: status,
      });
    }
  };

  const handleEnableLimitChange = (e) => {
    const status = e.target.checked;
    setCouponStates({
      ...couponStates,
      enablelimit: status,
    });
    setCoupon({
      ...coupon,
      count_limit:"1"
    })
  };
  const handleListOnlineChange = (e) => {
      const status = e.target.checked;
      if(switchdisable ){
        setCouponStates({
          ...couponStates,
          list_online:false, 
        })
      }else{
        setCouponStates({
          ...couponStates,
          list_online: status,
        });
      }
    };

  const navigate = useNavigate();

  const [minOrderAmountError, setMinOrderAmountError] = useState("");
  const [discountError, setDiscountError] = useState("");
  const [dateStartError, setDateStartError] = useState("");
  const [dateEndError, setDateEndError] = useState("");
  const [dateMaxDisAMTError, setDateMaxDisAMTError] = useState("");
  const [countLimitError, setCountLimitError] = useState("");

  const handleSave = async (e) => {
    e.preventDefault();
    // Create a new FormData object
    if (activeTab === "percentage") {
      // if (!coupon.maximum_discount) {
      //   setDateMaxDisAMTError("Maximum Discount Amount is required");
      //   return; // Stop further execution
      // } else if (coupon.maximum_discount === "") {
      //   setDateMaxDisAMTError("Maximum Discount Amount is required");
      //   // return;
      // } else {
      //   setDateMaxDisAMTError("");
      // }
      if(+coupon.discount > 100){
        console.log("coupon.discount",coupon.discount)
        setDiscountError("Discount Percentage is cannot exceed 100.00%");
        return
      }
      if (!coupon.discount == null || coupon.discount === "" || coupon.discount === "0.00") {
        setDiscountError("Discount Amount Percentage is required");
        return
      } else {
        setDiscountError("");
      }
    }
    if (activeTab === "amount") {
      if (parseFloat(coupon.min_amount) <= parseFloat(coupon.discount)) {
        showModal("Minimum order amount must be greater than the discount amount.");
        setCoupon({ ...coupon, discount: "0.00" });
        setDiscountError("Discount Amount is required");
        return; // Stop further execution
      }
      if(coupon.discount === "0.00"){
        setDiscountError("Discount Amount is required");
        return;
      }
    }
    // console.log("coupon.count_limit",coupon.count_limit)
    if (couponStates.enablelimit > 0) {
      if (!coupon.count_limit === "0") {
        setCountLimitError("Please enter a value greater than or equal to 1.");
        return; // Stop further execution
      }
      if (!coupon.count_limit  || coupon.count_limit === "0" || coupon.count_limit === "00" || coupon.count_limit === "000") {
        setCountLimitError("Please enter a value greater than or equal to 1.");
        return; // Stop further execution
      }
    }
    if (!coupon.date_valid || !coupon.date_expire) {
      showModal("Start date and end date are required");
      return; // Stop further execution
    }
    if (!coupon.min_amount) {
      setMinOrderAmountError("Minimum Order Amount is required");
      return; // Stop further execution
    } else if (coupon.min_amount === "" || coupon.min_amount === "0.00") {
      setMinOrderAmountError("Minimum Order Amount is required");
      return;
    } else {
      setMinOrderAmountError("");
    }

    if (!coupon.discount) {
      setDiscountError("Discount Amount is required");
      return; // Stop further execution
    } else if (coupon.discount === "") {
      return;
    } else {
      setDiscountError("");
    }

    // if (!coupon.maximum_discount) {
    //   setDateMaxDisAMTError("Maximum Discount Amount is required");
    //   return; // Stop further execution
    // } else if (coupon.maximum_discount === "") {
    //   setDateMaxDisAMTError("Maximum Discount Amount is required");
    //   return;
    // } else {
    //   setDateMaxDisAMTError("");
    // }

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


    const formData = new FormData();

    // Append data to the formData object
    formData.append("coupon_id", coupon.id);
    formData.append("merchant_id", coupon.m_id);
    formData.append("coupon_code", inputValue || coupon.name);
    formData.append("description", coupon.description);
    formData.append("min_order_amount", coupon.min_amount);
    formData.append("discount", coupon.discount);
    formData.append("max_discount_amount", coupon.maximum_discount);
    formData.append("start_date", coupon.date_valid);
    formData.append("end_date", coupon.date_expire);
    formData.append("start_time", coupon.time_valid);
    formData.append("end_time", coupon.time_expire);
    formData.append("end_time", coupon.time_expire);
    formData.append("is_online", couponStates.online ? "1" : "0");
    formData.append("list_online", couponStates.list_online ? "1" : "0");
    formData.append("flag", activeTab === "percentage" ? "0" : "1");
    formData.append("token_id", userTypeData?.token_id);
    formData.append("login_type", userTypeData?.login_type);

    // Append count_limit only if enable_limit > 0
    if (couponStates.enablelimit === true) {
      formData.append(
        "enable_redemption_limit",
        couponStates.enablelimit ? "1" : "0"
      );
      if (coupon.count_limit === null || coupon.count_limit === "0") {
        coupon.count_limit = "1";
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

    // Do something with formData, like sending it to an API endpoint

    if (
      dateStartError === "Invalid date. Please select a valid date." ||
      dateEndError === "Invalid date. Please select a valid date." ||
      discountError === "Discount Percentage is required" ||
      dateStartError === "Start Date cannot be before the current date" ||
      dateEndError === "End Date cannot be before the current date" ||
      discountError === "Discount Percentage is cannot exceed 100.00%"
    ) {
      return;
    }
    for (const [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }
    // return
    setLoader(true);

    try {
      const res = await axios.post(BASE_URL + EDIT_COUPON, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${userTypeData?.token}`,
        },
      });

      const data = await res.data.status;
      const update_message = await res.data.message;
      if (data === true) {
        ToastifyAlert("Updated Successfully", "success");
        // seVisible("CouponDiscount")
        // alert(update_message);
        let data = {
          merchant_id,
        };
        navigate("/coupons");
      } else if (
        data == false &&
        update_message == "Coupon not updated, please try again."
      ) {
        setErrorMessage(update_message);
      }
    } catch (error) {
      console.error("API Error:", error);
      handleCoockieExpire()
      getUnAutherisedTokenMessage()
    }
    setLoader(false);
  };

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
  //   const today = new Date().toISOString().split("T")[0];
  //   if (formattedStartDate === coupon.date_expire) {
  //     // showModal("Start date cannot be the same as the end date");
  //     setCoupon({
  //       ...coupon,
  //       date_valid: formattedStartDate,
  //     });
  //     setDateStartError("");
  //     // setDateStartError("Start Date is required");
  //   } else if (dayjs(formattedStartDate).isAfter(dayjs(coupon.date_expire))) {
  //     showModal("Start date cannot be greater than the end date");
  //     setCoupon({
  //       ...coupon,
  //       date_valid: "",
  //     });
  //     setDateStartError("Start Date is required");
  //   } else {
  //     setCoupon({
  //       ...coupon,
  //       date_valid: formattedStartDate,
  //     });
  //     setDateStartError("");
  //   }
  //   if(formattedStartDate < today){
  //     setCoupon({
  //       ...coupon,
  //       date_valid: null,
  //     });
  //     setDateStartError("Start Date cannot be before the current date");
  //   }
  // };

  // const handleEndDateChange = (newDate) => {
  //   const formattedEndDate = newDate.format("YYYY-MM-DD");
  //   const today = new Date().toISOString().split("T")[0];
  //   if (formattedEndDate === coupon.date_valid) {
  //     // showModal("End date cannot be the same as the start date");
  //     setCoupon({
  //       ...coupon,
  //       date_expire: formattedEndDate,
  //     });
  //     // setDateEndError("End Date is required");
  //     setDateEndError("");
  //     return; // Do not update the state
  //   } else if (dayjs(formattedEndDate).isBefore(dayjs(coupon.date_valid))) {
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
  //   if(formattedEndDate < today){
  //     setCoupon({
  //       ...coupon,
  //       date_expire: null,
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
    if (!isNaN(e.target.value)) {
      const { value } = e.target;
      const formattedValue = CurrencyInputHelperFun(value);
      const inputValue = e.target.value;
      if (formattedValue === "0.00") {
        // setDateMaxDisAMTError("Maximum Discount Amount is required");
      } else {
        setDateMaxDisAMTError("");
      }
      setCoupon({ ...coupon, maximum_discount: formattedValue });
    }
  };

  const handleTabChange = (tab) => {
    if(coupon.discount === "0.00" || coupon.discount === ""){
      setActiveTab(tab);
      setCoupon({ ...coupon, discount: "" })
      setDateMaxDisAMTError("");
      setDiscountError("");
      setSwitchdisable(false)
    }else{
      return
    }
  };

  const preventKeyPress = (event) => {
    event.preventDefault();
  };

  return (
    <>
      {/* <Grid container className="box_shadow_div">
        <Grid item xs={12}>
          <Grid container>
            <Grid item xs={12}>
              <div
                style={{
                  padding: 0,
                  paddingTop: "20px",
                  paddingBottom: "20px",
                  paddingLeft: "10px",
                }}
                className="q-add-categories-section-header"
              >
                <span onClick={()=>{seVisible("CouponDiscount")}} className="add_coupon_span">
                  <img
                    src={AddNewCategory}
                    alt="Add-New-Category"
                    className="h-9 w-9"
                  />
                  <span>Edit Coupon</span>
                </span>
              </div>
            </Grid>
          </Grid>
          <Grid
            container
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ p: 2.5 }}
          >
            <Grid item>
              <div className="q_coupon_Add_status_btn">
                <p>Show Online</p>
              </div>
            </Grid>
            <Grid item>
              <Switch
                name="online"
                id="online"
                checked={couponStates.online === true}
                onChange={handleShowOnlineChange}
                sx={{
                  "& .MuiSwitch-switchBase.Mui-checked": {
                    color: "#0A64F9",
                  },
                  "& .MuiSwitch-track": {
                    backgroundColor: "#0A64F9",
                  },
                }}
              />
            </Grid>
          </Grid>
          <Grid container sx={{ px: 2.5, pb: 2.5 }}>
            <Grid item xs={12}>
              <label htmlFor="coupon_name">Coupon Code</label>
              <BasicTextFields
                type={"text"}
                value={inputValue || coupon.name}
                maxLength={11}
                onChangeFun={handleInputChange}
                readOnly={true}
                sx={{ pt: 0.5 }}
              />
              {errorMessage && <p className="error-message">{errorMessage}</p>}
            </Grid>
          </Grid>
          <Grid container sx={{ px: 2.5, pb: 2.5 }}>
            <Grid item xs={12}>
              <div className="q-add-coupon-single-input">
                <label htmlFor="description">Description</label>
                <textarea
                  className="mt-1 w-full"
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
            </Grid>
          </Grid>
          <Grid container sx={{ px: 2.5, pb: 2.5 }} spacing={2}>
            <Grid item md={6} xs={12}>
              <label for="minorder_amt">Minimum Order Amount</label>
              <BasicTextFields
                type={"number"}
                name={"minorder_amt"}
                value={coupon.min_amount}
                required
                placeholder="Enter Minimum Order Amount"
                onChangeFun={handleMinAmountChange}
                sx={{ mt: 0.5 }}
              />
              {!minOrderAmountError && (
                <p className="error-message">{minOrderAmountError}</p>
              )}
            </Grid>
            <Grid item md={6} xs={12}>
              <div className="q_coupon_minium  dicount_per_amo">
                <Grid container>
                  <Grid item xs={6}>
                    {activeTab === "amount" && (
                      <div className="q_coupon_minium input_area">
                        <label for="discount_amt">Discount Amount</label>
                        <BasicTextFields
                          type="number"
                          name="discount"
                          placeholder="Enter Discount Amount"
                          value={coupon.discount}
                          onChangeFun={handleDiscountAmountChange}
                        />

                        {discountError && (
                          <p className="error-message">{discountError}</p>
                        )}
                      </div>
                    )}
                    {activeTab === "percentage" && (
                      <div className="q_coupon_minium input_area">
                        <label for="discount_per">Discount Percentage</label>
                        <BasicTextFields
                          type="number"
                          id="discount_per"
                          name="discount"
                          placeholder="Enter Discount Percentage"
                          value={coupon.discount}
                          onChangeFun={handleDiscountPercentChange}
                        />

                        {discountError && (
                          <p className="error-message">{discountError}</p>
                        )}
                      </div>
                    )}
                  </Grid>
                  <Grid item xs={6}>
                    <div className="AMT_PER_button">
                      <Grid container>
                        <Grid item xs={6}>
                          <div
                            className={`cursor-pointer amt_btn text-center   ${
                              activeTab === "amount"
                                ? "bg-[#0A64F9] text-white radius-4"
                                : ""
                            }`}
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

          <Grid container sx={{ px: 2.5, pb: 2.5 }}>
            <Grid item xs={12}>
              {activeTab === "percentage" && (
                <div className="q_coupon_minium input_area">
                  <label htmlFor="maximum_discount">
                    Maximum Discount Amount
                  </label>
                  <BasicTextFields
                    type="number"
                    id="maximum_discount"
                    name="maximum_discount"
                    placeholder="Enter Maximum Discount Amount"
                    value={coupon.maximum_discount}
                    onChangeFun={handleMaxDiscountChange}
                  />

                  {dateMaxDisAMTError && (
                    <p className="error-message">{dateMaxDisAMTError}</p>
                  )}
                </div>
              )}
            </Grid>
          </Grid>
          <Grid container sx={{ px: 2.5, pb: 2.5 }} spacing={2}>
            <Grid item xs={12} sm={12} md={6}>
              <Grid container className="border rounded">
                <Grid item xs={5.7}>
                  <FormControl fullWidth>
                    <LocalizationProvider
                      dateAdapter={AdapterDayjs}
                      className="date-provider"
                    >
                      <DatePicker
                        className="DatePicker-coupon"
                        slotProps={{
                          textField: { placeholder: "Start Date" },
                        }}
                        minDate={dayjs(new Date())}
                        value={dayjs(new Date(Date.parse(coupon.date_valid)))}
                        onChange={(newDate) => handleStartDateChange(newDate)}
                        shouldDisableDate={(date) =>
                          date.format("YYYY-MM-DD") === coupon.date_valid
                        }
                        format={"MMMM DD, YYYY"}
                        disablePast
                        views={["year", "month", "day"]}
                        renderInput={() => (
                          <input
                            name="start_date"
                            id="start_date"
                            placeholder="Start Date"
                          />
                        )}
                        components={{
                          OpenPickerIcon: () => (
                            <img src={caleIcon} alt="calendar-icon" />
                          ),
                        }}
                      />
                    </LocalizationProvider>
                    {dateStartError && (
                      <p className="error-message date_error">
                        {dateStartError}
                      </p>
                    )}
                  </FormControl>
                </Grid>
                <Grid
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
                        slotProps={{
                          textField: { placeholder: "Start Time" },
                        }}
                        className="input_label_section"
                        name="start_tym"
                        id="start_tym"
                        value={dayjs(coupon.time_valid, "HH:mm:ss")}
                        onChange={(newTime) => handleStartTimeChange(newTime)}
                        components={{
                          OpenPickerIcon: () => (
                            <img src={TimeIcon} alt="time-icon" />
                          ),
                        }}
                      />
                    </LocalizationProvider>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <Grid container className="border rounded">
                <Grid item xs={5.7}>
                  <FormControl fullWidth>
                    <LocalizationProvider
                      dateAdapter={AdapterDayjs}
                      className="date-provider"
                    >
                      <DatePicker
                        className="DatePicker-coupon"
                        slotProps={{
                          textField: { placeholder: "End Date" },
                        }}
                        minDate={dayjs(new Date())}
                        value={dayjs(new Date(Date.parse(coupon.date_expire)))}
                        onChange={(newDate) => handleEndDateChange(newDate)}
                        shouldDisableDate={(date) =>
                          date.format("YYYY-MM-DD") === coupon.date_expire
                        }
                        format={"MMMM DD, YYYY"}
                        disablePast
                        views={["year", "month", "day"]}
                        renderInput={() => (
                          <input
                            name="end_date"
                            id="end_date"
                            className="date-picker-input"
                          />
                        )}
                        components={{
                          OpenPickerIcon: () => (
                            <img src={caleIcon} alt="calendar-icon" />
                          ),
                        }}
                      />
                    </LocalizationProvider>
                  </FormControl>
                </Grid>
                <Grid
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
                        slotProps={{
                          textField: { placeholder: "End Time" },
                        }}
                        className="input_label_section"
                        name="end_tym"
                        id="end_tym"
                        value={dayjs(coupon.time_expire, "HH:mm:ss")}
                        onChange={(newTime) => handleEndTimeChange(newTime)}
                        components={{
                          OpenPickerIcon: () => (
                            <img src={TimeIcon} alt="time-icon" />
                          ),
                        }}
                      />
                    </LocalizationProvider>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid
            container
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ px: 2.5, pb: 2.5 }}
          >
            <Grid item>
              <div
                style={{ padding: 0, margin: 0 }}
                className="q_coupon_Add_status_btn"
              >
                <p>Enable Redemption Limit?</p>
              </div>
            </Grid>
            <Grid item>
              <Switch
                name="enable_limit"
                id="enable_limit"
                checked={couponStates.enablelimit === true}
                onChange={handleEnableLimitChange}
                sx={{
                  "& .MuiSwitch-switchBase.Mui-checked": {
                    color: "#0A64F9", // Change color when switch is checked
                  },
                  "& .MuiSwitch-track": {
                    backgroundColor: "#0A64F9", // Change background color of the track
                  },
                }}
              />
            </Grid>
          </Grid>
            <Grid container sx={{ px: 2.5, pb: 2.5 }}>
              <Grid item xs={12}>
                {couponStates.enablelimit > 0 && (
                  <div className="q-add-coupon-single-input">
                    <label htmlFor="count_limit">Redemption Limit</label>
                    <input
                      className="w-full"
                      type="number"
                      id="count_limit"
                      name="count_limit"
                      min="1"
                      max="999"
                      value={
                        coupon.count_limit === null ||
                        coupon.count_limit === "0"
                          ? 1
                          : Math.min(coupon.count_limit, 999)
                      }
                      onChange={(e) =>
                        setCoupon({
                          ...coupon,
                          count_limit: Math.min(parseInt(e.target.value), 999),
                        })
                      }
                    />
                  </div>
                )}
              </Grid>
            </Grid>
          <Grid
            container
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
            sx={{ px: 2.5, pb: 2.5 }}
          >
            <Grid item sx={{px:2}}>
              <button className="quic-btn quic-btn-save" onClick={handleSave}>
                Save
              </button>
            </Grid>
            <Grid item>
              <spam onClick={()=>{seVisible("CouponDiscount")}}>
                <button className="quic-btn quic-btn-cancle">Cancel</button>
              </spam>
            </Grid>
          </Grid>
        </Grid>
      </Grid> */}
      <div className="q-category-main-page">
        <div className="box ">
          <div className="box_shadow_div">
            <div className="q-add-categories-section">
              <div className="q-add-categories-section-header" >
                <Link to={`/coupons`} >
                <div  className="cursor-pointer">
                  <span style={myStyles}>
                  <img
                  src={AddNewCategory}
                  alt="Add-New-Category"
                  className="h-9 w-9"
                />
                    <span className="textIMG">Edit Coupon</span>
                  </span>
                </div>
                </Link>
              </div>
              <div className="q-add-categories-section-middle-form">
                <div className="q_coupon_Add_status_btn">
                  <p>Show Online</p>
                  <Switch
                    name="online"
                    id="online"
                    checked={couponStates.online === true}
                    onChange={handleShowOnlineChange}
                    sx={{
                      "& .MuiSwitch-switchBase.Mui-checked": {
                        color: "#0A64F9",
                      },
                      "& .MuiSwitch-track": {
                        backgroundColor: "#0A64F9",
                      },
                    }}
                  />
                </div>
                <div className="q_coupon_Add_status_btn">
                  <p>List Online</p>
                  <Switch
                    name="online"
                    id="online"
                    checked={couponStates.list_online === true}
                    onChange={handleListOnlineChange}
                    sx={{
                      "& .MuiSwitch-switchBase.Mui-checked": {
                        color: "#0A64F9",
                      },
                      "& .MuiSwitch-track": {
                        backgroundColor: "#0A64F9",
                      },
                    }}
                  />
                </div>
                <div className="q-add-coupon-single-input  mb-2">
                  <label htmlFor="coupon_name">Coupon Code</label>

                  <BasicTextFields
                    type={"text"}
                    value={inputValue || coupon.name}
                    maxLength={11}
                    onChangeFun={handleInputChange}
                    readOnly={true}
                  />
                  {errorMessage && (
                    <p className="error-message">{errorMessage}</p>
                  )}
                </div>

                <div className="q-add-coupon-single-input">
                  <label htmlFor="description">Description</label>
                  <textarea
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

                <Grid container spacing={2} >
                  <Grid item md={6} xs={12}>
                    <div className="q_coupon_minium input_area mt-2">
                      <label for="minorder_amt">Minimum Order Amount</label>
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
                    <div className="q_coupon_minium  dicount_per_amo mt-2">
                      <Grid container>
                        <Grid item xs={6}>
                          {activeTab === "amount" && (
                            <div className="q_coupon_minium input_area">
                              <label for="discount_amt">Discount Amount</label>
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
                              <label for="discount_per">
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
                        <Grid item xs={6}>
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
                  <div className="q_coupon_minium input_area">
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
                  </div>
                )}

                {/* <div className="q_coupon_minium my-4">
                  <label htmlFor="coupon">Date & Time</label>
                  <div className="flex flex-row gap-5">
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <div className="">
                          <div
                            style={{
                              display: "flex",
                              // gap: "1rem",
                              border: "1px solid #E3E3E3",
                              borderRadius: "4px",
                              height: "45px",
                            }}
                            className="date_selected"
                          >
                            <LocalizationProvider
                              dateAdapter={AdapterDayjs}
                              className="date-provider"
                            >
                              <DatePicker
                                slotProps={{
                                  textField: { placeholder: "Start Date" },
                                }}
                                minDate={dayjs(new Date())}
                                value={dayjs(
                                  new Date(Date.parse(coupon.date_valid))
                                )}
                                onChange={(newDate) =>
                                  handleStartDateChange(newDate)
                                }
                                shouldDisableDate={(date) =>
                                  date.format("YYYY-MM-DD") ===
                                  coupon.date_valid
                                }
                                format={"DD-MM-YYYY"}
                                disablePast
                                views={["year", "month", "day"]}
                                renderInput={() => (
                                  <input
                                    name="start_date"
                                    id="start_date"
                                    placeholder="Start Date"
                                  />
                                )}
                                components={{
                                  OpenPickerIcon: () => (
                                    <img src={caleIcon} alt="calendar-icon" />
                                  ),
                                }}
                              />
                            </LocalizationProvider>
                            {dateStartError && (
                              <p className="error-message date_error">
                                {dateStartError}
                              </p>
                            )}
                            <div className="dividersss" />
                            <div className="q_time_display">
                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <TimePicker
                                  slotProps={{
                                    textField: { placeholder: "Start Time" },
                                  }}
                                  className="input_label_section"
                                  name="start_tym"
                                  id="start_tym"
                                  value={dayjs(coupon.time_valid, "HH:mm:ss")}
                                  onChange={(newTime) =>
                                    handleStartTimeChange(newTime)
                                  }
                                  components={{
                                    OpenPickerIcon: () => (
                                      <img src={TimeIcon} alt="time-icon" />
                                    ),
                                  }}
                                />
                              </LocalizationProvider>
                            </div>
                          </div>
                        </div>
                      </Grid>
                      <Grid item xs={6}>
                        <div className="">
                          <div
                            style={{
                              display: "flex",
                              // gap: "1rem",
                              margin: "0px",
                              border: "1px solid #E3E3E3",
                              borderRadius: "4px",
                              height: "45px",
                            }}
                            className="date_selected"
                          >
                            <LocalizationProvider
                              dateAdapter={AdapterDayjs}
                              className="date-provider"
                            >
                              <DatePicker
                                slotProps={{
                                  textField: { placeholder: "End Date" },
                                }}
                                minDate={dayjs(new Date())}
                                value={dayjs(
                                  new Date(Date.parse(coupon.date_expire))
                                )}
                                onChange={(newDate) =>
                                  handleEndDateChange(newDate)
                                }
                                shouldDisableDate={(date) =>
                                  date.format("YYYY-MM-DD") ===
                                  coupon.date_expire
                                }
                                format={"DD-MM-YYYY"}
                                disablePast
                                views={["year", "month", "day"]}
                                renderInput={() => (
                                  <input
                                    name="end_date"
                                    id="end_date"
                                    className="date-picker-input"
                                  />
                                )}
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
                            <div className="dividersss" />
                            <div className="q_time_display">
                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <TimePicker
                                  slotProps={{
                                    textField: { placeholder: "End Time" },
                                  }}
                                  className="input_label_section"
                                  name="end_tym"
                                  id="end_tym"
                                  value={dayjs(coupon.time_expire, "HH:mm:ss")}
                                  onChange={(newTime) =>
                                    handleEndTimeChange(newTime)
                                  }
                                  components={{
                                    OpenPickerIcon: () => (
                                      <img src={TimeIcon} alt="time-icon" />
                                    ),
                                  }}
                                />
                              </LocalizationProvider>
                            </div>
                          </div>
                        </div>
                      </Grid>
                    </Grid>
                  </div>
                </div> */}

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
                              shouldDisableDate={(date) =>
                                date.format("YYYY-MM-DD") === coupon.date_valid
                              }
                              value={dayjs(
                                new Date(Date.parse(coupon.date_valid))
                              )}
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
                              value={dayjs(
                                new Date(Date.parse(coupon.date_expire))
                              )}
                              format={"MMMM DD, YYYY"}
                              disablePast
                              views={["year", "month", "day"]}
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
                  sx={{ marginTop: 2 }}
                  className="q-add-coupon-single-input"
                >
                <div className="q-add-coupon-single-input">
                  <div className="q_coupon_Add_status_btn">
                    <p>Enable Redemption Limit?</p>
                    <Switch
                      name="enable_limit"
                      id="enable_limit"
                      checked={couponStates.enablelimit === true}
                      onChange={handleEnableLimitChange}
                      sx={{
                        "& .MuiSwitch-switchBase.Mui-checked": {
                          color: "#0A64F9", // Change color when switch is checked
                        },
                        "& .MuiSwitch-track": {
                          backgroundColor: "#0A64F9", // Change background color of the track
                        },
                      }}
                    />
                  </div>
                </div>
                </Grid>

                {couponStates.enablelimit > 0 && (
                  <div className="q-add-coupon-single-input mb-4">
                    <label htmlFor="count_limit">Redemption Limit</label>
                    <input
                      type="number"
                      id="count_limit"
                      name="count_limit"
                      min="1"
                      max="999"
                      value={
                        coupon.count_limit === null ||
                        coupon.count_limit === "0"
                          ? 1
                          : Math.min(coupon.count_limit, 999)
                      }
                      onChange={(e) =>
                        setCoupon({
                          ...coupon,
                          count_limit: Math.min(parseInt(e.target.value), 999),
                        })
                      }
                    />
                     {countLimitError && (
                      <p className="error-message">{countLimitError}</p>
                    )}
                  </div>
                )}

                 <Grid
                  container
                  direction="row"
                  justifyContent="flex-end"
                  alignItems="center"
                  sx={{  pb: 2.5 }}
                >
                  <Grid item sx={{px:2}}>
                    <button className="quic-btn quic-btn-save attributeUpdateBTN" onClick={handleSave} disabled={loader}>
                      {loader ? <><CircularProgress color={"inherit"} width={15} size={15} /> Save</> : "Save"}
                    </button>
                  </Grid>
                  <Grid item>
                  <Link to={`/coupons`} >
                    {/* <spam onClick={()=>{seVisible("CouponDiscount")}}> */}
                      <button className="quic-btn quic-btn-cancle">Cancel</button>
                    {/* </spam> */}
                  </Link>
                  </Grid>
                </Grid>
              </div>
            </div>
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

export default EditCoupon;