import React, { useEffect, useState } from "react";
// import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { fetchCheckIDVerifyData } from "../../../Redux/features/Reports/CheckIDVerify/CheckIDVerifySlice";
import { useAuthDetails } from "../../../Common/cookiesHelper";
const orderEnv = (type)=>{
  if(type === "Online Order"){
    return "Online";
  }
  if(type === "Store Order"){
    return "Offline";
  }
  else{
    return type;
  }
}
const CheckIDVerifyList = (props) => {
  const dispatch = useDispatch();
  const {
    LoginGetDashBoardRecordJson,
    LoginAllStore,
    userTypeData,
    GetSessionLogin,
  } = useAuthDetails();
  const [allCheckIDVerifyData, setallCheckIDVerifyData] = useState("");
  const AllCheckIDVerifyDataState = useSelector(
    (state) => state.CheckIDVerifyList
  );
  let merchant_id = LoginGetDashBoardRecordJson?.data?.merchant_id;

  useEffect(() => {
    if (props && props.selectedDateRange) {
      let data = {
        merchant_id,
        start_date: props.selectedDateRange.start_date,
        end_date: props.selectedDateRange.end_date,
        order_typ: props.OrderTypeData,
        order_env:orderEnv(props.OrderSourceData),
        ...userTypeData,
      };
      if (data) {
        dispatch(fetchCheckIDVerifyData(data));
      }
    }
  }, [props]);

  useEffect(() => {
    if (
      !AllCheckIDVerifyDataState.loading &&
      AllCheckIDVerifyDataState.CheckIDVerifyData
    ) {
      console.log(AllCheckIDVerifyDataState.CheckIDVerifyData);
      setallCheckIDVerifyData(AllCheckIDVerifyDataState.CheckIDVerifyData);
    } else {
      setallCheckIDVerifyData("");
    }
  }, [
    AllCheckIDVerifyDataState,
    AllCheckIDVerifyDataState.loading,
    AllCheckIDVerifyDataState.CheckIDVerifyData,
  ]);

  const formatDate = (dateString) => {
    const [month, day, year] = dateString.split('-');
    const date = new Date(year, month - 1, day);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };
  const formatTime = (timeString) => {
    const [hours, minutes, seconds] = timeString.split(':');
    const date = new Date();
    date.setHours(hours, minutes, seconds);
    const options = { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true };
    return date.toLocaleTimeString('en-US', options);
  };
  

  return (
    <>
      <div className="box">
        <div className="q-daily-report-bottom-report-header">
          <p className="report-sort">Date</p>
          <p className="report-sort">Time</p>
          <p className="report-sort">Employee</p>
          <p className="report-sort">Order ID</p>
          <p className="report-sort">Item Name</p>
        </div>
      </div>

      {allCheckIDVerifyData &&
        allCheckIDVerifyData.length >= 1 ? (
          allCheckIDVerifyData.map((CheckData, index) => (
            <div className="box">
              <div
                key={index}
                className="q-category-bottom-categories-listing"
                style={{ borderRadius: "unset" }}
              >
                <div className="q-category-bottom-categories-single-category">
                  <p className="report-title">{formatDate(CheckData.merchant_date)}</p>
                  <p className="report-title">{formatTime(CheckData.merchant_time)}</p>
                  <p className="report-title">{CheckData.full_name}</p>
                  <p className="report-title">{CheckData.order_id}</p>
                  <p className="report-title">{CheckData.name}</p>
                </div>
              </div>
            </div>
          ))
        ) :(<>
        <div style={{margin:0}} className="box_shadow_div">
        <p className="px-5 py-4">No Data Found</p>
        </div>
       </>)
        }
    </>
  );
};

export default CheckIDVerifyList;
