import React, { useState } from "react";
import DownIcon from "../../Assests/Dashboard/Down.svg";
import { BASE_URL, EXPORT_ORDER_COUNT_DATA } from "../../Constants/Config";
import axios from "axios";
import SelectDropDown from "../../reuseableComponents/SelectDropDown";
import { CircularProgress, Grid } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import caleIcon from "../../Assests/Filter/Calender.svg";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";

import { useAuthDetails } from "./../../Common/cookiesHelper";
import PasswordShow from "../../Common/passwordShow";
import { ToastifyAlert } from "../../CommonComponents/ToastifyAlert";

const OrderCountList = () => {
  const OrderStatus = [
    {
      title: "Paid",
    },
    {
      title: "Unpaid",
    },
    {
      title: "Both",
    },
  ];

  const orderType = [
    {
      title: "Online Order",
    },
    {
      title: "Store Order",
    },
  ];
  const [selectedOrderStatus, setSelectedOrderStatus] = useState("Paid");
  const [selectedOrderType, setSelectedOrderType] = useState("Online Order");

  const currentDate = dayjs().format("YYYY-MM-DD");
  const [selectedStartDate, setSelectedStartDate] = useState(currentDate);
  const [selectedEndDate, setSelectedEndDate] = useState(currentDate);
  const [error, setError] = useState("");
  const [loader, setLoader] = useState(false);
  const [orderStatusDropdownVisible, setOrderStatusDropdownVisible] =
    useState(false);
  const [orderTypeDropdownVisible, setOrderTypeDropdownVisible] =
    useState(false);

  const handleOptionClick = (option, dropdown) => {
    switch (dropdown) {
      case "OrderStatus":
        setSelectedOrderStatus(option.title);
        setOrderStatusDropdownVisible(false);
        break;
      case "orderType":
        setSelectedOrderType(option.title);
        setOrderTypeDropdownVisible(false);
        break;
      default:
        break;
    }
  };

  const validateDates = (start, end) => {
    console.log(start);
    console.log(end);
    if (start && end && new Date(start) > new Date(end)) {
      setError("Please Enter Vaild Start Date and End Date");
    } else {
      setError("");
    }
  };
  const { userTypeData } = useAuthDetails();
  const { handleCoockieExpire, getUnAutherisedTokenMessage } = PasswordShow();

  const handleSubmitData = async () => {
    console.log("Dzvxc")
    if (
      selectedStartDate &&
      selectedEndDate &&
      new Date(selectedStartDate) > new Date(selectedEndDate)
    ) {
      setError("Please Enter Vaild Start Date and End Date");
    } else {
      setError("");
      const orderType = (type) => {
        if (type === "Online Order") {
          return "Online";
        }
        if (type === "Store Order") {
          return "Offline";
        }
      };
      const data = {
        start_date: selectedStartDate,
        end_date: selectedEndDate,
        order_source: orderType(selectedOrderType),
        order_status: selectedOrderStatus,
        token_id: userTypeData.token_id,
        login_type: userTypeData.login_type,
      };
      console.log(data);
      try {
        setLoader(true);
        const response = await axios.post(
          BASE_URL + EXPORT_ORDER_COUNT_DATA,
          data,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${userTypeData.token}`,
            },
          }
        );

        if (response && response.data) {
          // console.log(response);
          const csvData = response.data;
          // Convert the data to a Blob
          const blob = new Blob([csvData], { type: "text/csv" });

          // Create a URL for the Blob
          const fileUrl = URL.createObjectURL(blob);

          // Create a temporary anchor element and trigger a download
          const a = document.createElement("a");
          a.href = fileUrl;
          a.download = selectedStartDate + "-to-" + selectedEndDate + ".csv"; // Name of the downloaded file
          document.body.appendChild(a);
          a.click();

          // Cleanup: remove the anchor element and revoke the Blob URL
          document.body.removeChild(a);
          URL.revokeObjectURL(fileUrl);

          setTimeout(() => {
            setLoader(false);
            ToastifyAlert("Download Successfully", "success")
          }, 2000);
          // setLoader(false);
        }
      } catch (error) {
        handleCoockieExpire();
        getUnAutherisedTokenMessage();
        setLoader(false);
        ToastifyAlert("Something wents wrong", "error")
      }
    }
  };

  const handleDateChange = (setter) => (newValue) => {
    setter(newValue.format("YYYY-MM-DD"));
    validateDates(selectedStartDate, selectedEndDate);
  };

  return (
    <>
      {/* <div className="box">
            <div className="q-category-bottom-detail-section">
                <div className="">
                    <div className="q-category-bottom-header">
                        <div className="q_details_header ml-2">Order Count</div>
                    </div>
                </div>

                <div className="q-order-page-container ml-8">
                    <div className="q-order-page-filter">
                        <label className="q-details-page-label" htmlFor="OrderStatusFilter">
                            Order Status
                        </label>
                        <div className="custom-dropdown">
                            <div
                                className="custom-dropdown-header"
                                onClick={() => toggleDropdown("OrderStatus")}
                            >
                                <span className="selected-option mt-1">
                                    {selectedOrderStatus}
                                </span>
                                <img src={DownIcon} alt="Down Icon" className="w-8 h-8" />
                            </div>
                            {orderStatusDropdownVisible && (
                                <div className="dropdown-content ">
                                    <div onClick={() => handleOptionClick("Paid", "OrderStatus")}>
                                        Paid
                                    </div>
                                    <div
                                        onClick={() => handleOptionClick("Unpaid", "OrderStatus")}
                                    >
                                        Unpaid
                                    </div>
                                    <div
                                        onClick={() => handleOptionClick("All", "OrderStatus")}
                                    >
                                        All
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="q-order-page-filter">
                        <label className="q-details-page-label" htmlFor="orderTypeFilter">
                            Order Source
                        </label>
                        <div className="custom-dropdown">
                            <div
                                className="custom-dropdown-header"
                                onClick={() => toggleDropdown("orderType")}
                            >
                                <span className="selected-option mt-1">
                                    {selectedOrderType}
                                </span>
                                <img src={DownIcon} alt="Down Icon" className="w-8 h-8" />
                            </div>
                            {orderTypeDropdownVisible && (
                                <div className="dropdown-content">
                                    <div onClick={() => handleOptionClick("Online", "orderType")}>
                                        Online
                                    </div>
                                    <div
                                        onClick={() => handleOptionClick("Offline", "orderType")}
                                    >
                                        Offline
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="q-category-bottom-detail-section mt-5 pb-5">
                <div className="store-setting-flex">
                    <div className="store-setting-flex-child">
                        <label className="q-details-page-label" htmlFor="OrderStatusFilter">
                            Start Date
                        </label>
                        <div className="store-setting-input-div pt-2">
                            <input
                                type="date"
                                className="store-setting-alert-input"
                                value={selectedStartDate}
                                onChange={IsStartDatetoggleInput}
                            />
                            {error && (
                                <p
                                    style={{
                                        fontSize: "14px",
                                        color: "red",
                                        fontFamily: "CircularSTDBook !important",
                                    }}
                                >
                                    {error}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="store-setting-flex-child">
                        <label className="q-details-page-label" htmlFor="OrderStatusFilter">
                            End Date
                        </label>
                        <div className="store-setting-input-div pt-2">
                            <input
                                type="date"
                                className="store-setting-alert-input"
                                value={selectedEndDate}
                                onChange={IsEndDatetoggleInput}
                            />
                            {error && (
                                <p
                                    style={{
                                        fontSize: "14px",
                                        color: "red",
                                        fontFamily: "CircularSTDBook !important",
                                    }}
                                >
                                    {error}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
                <div 
                    style={{
                       paddingLeft:"2rem",
                    }}>
                    <button className="save_btn" onClick={handleSubmitData}>
                        Export
                    </button>
                </div>
            </div>
            </div> */}

      <div className="box_shadow_div_order ">
        <Grid item className="q-category-bottom-header" xs={12}>
          <h1 className="text-xl font-medium">Order Count</h1>
        </Grid>

        <div className="px-6  ">
          <Grid container spacing={4} className="">
            <Grid item xs={6}>
              <label className="lable_OrderCount"> Order Status</label>
              <SelectDropDown
                listItem={OrderStatus}
                title={"title"}
                onClickHandler={handleOptionClick}
                selectedOption={selectedOrderStatus}
                dropdownFor={"OrderStatus"}
              />
            </Grid>
            <Grid item xs={6}>
              <label className="lable_OrderCount"> Order Type</label>
              <SelectDropDown
                listItem={orderType}
                title={"title"}
                onClickHandler={handleOptionClick}
                selectedOption={selectedOrderType}
                dropdownFor={"orderType"}
              />
            </Grid>
          </Grid>
        </div>
      </div>

      <div className="q-category-bottom-detail-section mt-5 pb-5 box_shadow_div_order">
        <div className="store-setting-flex"></div>

        <div className="px-6  ">
          <Grid container spacing={4} className="">
            <Grid item xs={6}>
              {/* <div className="store-setting-input-div pt-2">
                            <input
                                type="date"
                                className="store-setting-alert-input"
                                value={selectedStartDate}
                                onChange={IsStartDatetoggleInput}
                            />
                            {error && (
                                <p
                                    style={{
                                        fontSize: "14px",
                                        color: "red",
                                        fontFamily: "CircularSTDBook !important",
                                    }}
                                >
                                    {error}
                                </p>
                            )}
                        </div> */}
              <label>Start Date</label>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["DatePicker"]}>
                  <DatePicker
                    value={dayjs(selectedStartDate)}
                    onChange={handleDateChange(setSelectedStartDate)}
                    maxDate={dayjs()}
                    style={{ border: "none" }} // Remove border
                    size="small"
                    format={"MMMM DD, YYYY"}
                    views={["year", "month", "day"]}
                    slotProps={{
                      textField: {
                        placeholder: "Start Date",
                        size: "small",
                      },
                    }}
                    components={{
                      OpenPickerIcon: () => (
                        <img
                          src={caleIcon}
                          alt="calendar-icon"
                          style={{ width: 20, height: 20 }}
                        />
                      ),
                    }}
                    className="orderCount_StartDate"
                  />
                </DemoContainer>
              </LocalizationProvider>
            </Grid>
            <Grid item xs={6}>
              {/* <label> End Date</label>
                            <div className="store-setting-input-div pt-2">
                            <input
                                type="date"
                                className="store-setting-alert-input"
                                value={selectedEndDate}
                                onChange={IsEndDatetoggleInput}
                            />
                            {error && (
                                <p
                                    style={{
                                        fontSize: "14px",
                                        color: "red",
                                        fontFamily: "CircularSTDBook !important",
                                    }}
                                >
                                    {error}
                                </p>
                            )}
                        </div> */}
              <label>End Date</label>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["DatePicker"]}>
                  <DatePicker
                    style={{ border: "none" }} // Remove border
                    size="small"
                    value={dayjs(selectedEndDate)}
                    onChange={handleDateChange(setSelectedEndDate)}
                    maxDate={dayjs()}
                    format={"MMMM DD, YYYY"}
                    views={["year", "month", "day"]}
                    slotProps={{
                      textField: {
                        placeholder: "End Date",
                        size: "small",
                      },
                    }}
                    shouldDisableDate={(date) => {
                      const start = selectedStartDate;
                      return date.format("YYYY-MM-DD") < start;
                    }}
                    components={{
                      OpenPickerIcon: () => (
                        <img
                          src={caleIcon}
                          alt="calendar-icon"
                          style={{ width: 20, height: 20 }}
                        />
                      ),
                    }}
                    className="orderCount_StartDate"
                  />
                </DemoContainer>
              </LocalizationProvider>
            </Grid>
          </Grid>
        </div>

        {error && (
          <p
            style={{
              fontSize: "14px",
              color: "red",
              marginLeft: "2rem",
            }}
          >
            {error}
          </p>
        )}

        <div
          style={{
            paddingLeft: "2rem",
            marginTop: "2rem",
          }}
        >
          <button
            className="save_btn attributeUpdateBTN"
            onClick={handleSubmitData}
            disabled={loader}
          >
            {loader ? (
              <>
                <CircularProgress
                  color={"inherit"}
                  className="loaderIcon"
                  width={15}
                  size={15}
                />
                Export
              </>
            ) : (
              "Export"
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default OrderCountList;
