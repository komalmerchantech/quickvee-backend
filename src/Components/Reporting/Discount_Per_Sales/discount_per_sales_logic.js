import React, { useEffect, useState } from "react";
import {
  BASE_URL,
  EMPLOYEE_LIST,
  DISCOUNT_PER_PERSON,
} from "../../../Constants/Config";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { useAuthDetails } from "./../../../Common/cookiesHelper";
import PasswordShow from "../../../Common/passwordShow";
import { getAuthInvalidMessage } from "../../../Redux/features/Authentication/loginSlice";

export default function Discount_per_sales_logic() {
  const dispatch = useDispatch();
  const { handleCoockieExpire, getUnAutherisedTokenMessage } = PasswordShow();
  const [allEmployee, setAllEmployee] = React.useState([]);
  const [selectedEmployee, setSelectedEmployee] = React.useState("");
  const [EmployeeFilterData, setEmployeeFilterData] = React.useState([]);
  const [selectedoption, setSelectedOption] = React.useState("All");
  const [loader, setLoader] = useState(false);
  const {
    LoginGetDashBoardRecordJson,
    LoginAllStore,
    userTypeData,
    GetSessionLogin,
  } = useAuthDetails();
  let merchant_new_id = LoginGetDashBoardRecordJson?.data?.merchant_id;
  let merchant_id = {
    merchant_id: LoginGetDashBoardRecordJson?.data?.merchant_id,
    token_id: userTypeData?.token_id,
    login_type: userTypeData?.login_type,
  };
  const getAllEmployeeData = () => {
    try {
      let response = axios
        .post(BASE_URL + EMPLOYEE_LIST, merchant_id, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${userTypeData?.token}`,
          },
        })
        .then((res) => {
          setAllEmployee(res?.data?.result);
          // Array.isArray(res?.data?.result)
        });
    } catch (error) {
      getUnAutherisedTokenMessage();
      handleCoockieExpire();
      console.error("Error fetching Employee List:", error);
    }
  };
  useEffect(() => {
    getAllEmployeeData();
    // console.log(LoginGetDashBoardRecordJson?.data?.merchant_id);
  }, []);

  const handleOptionClick = (option, dropdown) => {
    if (option == "All") {
      setSelectedEmployee("all");
      setSelectedOption("All");
    } else if (option?.title !== "") {
      setSelectedEmployee(option?.id);
      setSelectedOption(option?.f_name);
    }
  };
  const onDateRangeChange = (data) => {
    const { token, ...newData } = userTypeData;
    const { start_date, end_date } = data;

    let pakect = {
      start_date,
      end_date,
      ...newData,
      employee_id: selectedEmployee == "" ? "all" : selectedEmployee,
      ...merchant_id,
    };
    setLoader(true);
    try {
      axios
        .post(BASE_URL + DISCOUNT_PER_PERSON, pakect, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`, // Use data?.token directly
          },
        })
        .then((res) => {
          setLoader(false);
          if (res?.data?.status == true) {
            setEmployeeFilterData(res?.data);
          }
        });
    } catch (error) {
      console.error("Error fetching Employee List:", error);
      getUnAutherisedTokenMessage();
      handleCoockieExpire();
    }

    // console.log(newData);
  };
  return {
    onDateRangeChange,
    allEmployee,
    handleOptionClick,
    selectedoption,
    EmployeeFilterData,
    loader,
    merchant_new_id,
  };
}
