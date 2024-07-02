import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import dayjs, { Dayjs } from "dayjs";
import AddIcon from "../../Assests/Category/addIcon.svg";
import AddNewCategory from "../../Assests/Taxes/Left.svg";
import CrossIcon from "../../Assests/Dashboard/cross.svg";
import caleIcon from "../../Assests/Filter/Calender.svg";
import TimeIcon from "../../Assests/Filter/Clock.svg";
import DeleteIcon from "../../Assests/Category/deleteIcon.svg";
import BasicTextFields from "../../reuseableComponents/TextInputField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import Grid from "@mui/material/Grid";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import CircularProgress from "@mui/material/CircularProgress";
import { Box, Modal } from "@mui/material";
import {
  fetchtimeSheetData,
  deleteTimesheet,
  deleteBreak,
} from "../../Redux/features/Timesheet/timesheetSlice";
import axios from "axios";
import {
  BASE_URL,
  EMPLOYEE_LIST,
  ADD_TIME_SHEET,
  TIME_SHEET_GETBREAKS,
  ADD_TIME_BREAK,
} from "../../Constants/Config";
import { useAuthDetails } from "./../../Common/cookiesHelper";
import { priceFormate } from "../../hooks/priceFormate";
import DeleteModal from "../../reuseableComponents/DeleteModal";
import { ToastifyAlert } from "../../CommonComponents/ToastifyAlert";
import PasswordShow from "../../Common/passwordShow";

const TimesheetListing = ({ data }) => {
  const dispatch = useDispatch();
  const [timesheet, settimesheet] = useState([]);
  const [employeeList, setemployeeList] = useState([]);
  const [EmployeeName, setEmployeeName] = useState("");
  const timeSheetDataState = useSelector((state) => state.timeSheet);
  const { LoginGetDashBoardRecordJson, LoginAllStore, userTypeData } =
    useAuthDetails();
  let AuthDecryptDataDashBoardJSONFormat = LoginGetDashBoardRecordJson;
  const merchant_id = AuthDecryptDataDashBoardJSONFormat?.data?.merchant_id;
  const { handleCoockieExpire, getUnAutherisedTokenMessage } = PasswordShow();
  useEffect(() => {
    // if (!data.merchant_id) {
    //   console.log("empty");
    // } else {
    //   dispatch(fetchtimeSheetData(data));
    // }
    getfetchtimeSheetData();
  }, [dispatch, data]);
  const [loader, setLoader] = useState(false);
  const getfetchtimeSheetData = async () => {
    try {
      if (!data.merchant_id) {
        console.log("empty");
      } else {
        await dispatch(fetchtimeSheetData(data)).unwrap();
      }
    } catch (error) {
      handleCoockieExpire();
      getUnAutherisedTokenMessage();
    }
  };

  // console.log("timesheet",timesheet)

  useEffect(() => {
    if (!timeSheetDataState.loading && timeSheetDataState.timeSheetData) {
      settimesheet(timeSheetDataState.timeSheetData);
    }
  }, [
    timeSheetDataState,
    timeSheetDataState.loading,
    timeSheetDataState.timeSheetData,
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          BASE_URL + EMPLOYEE_LIST,
          {
            merchant_id: merchant_id,
            token_id: userTypeData?.token_id,
            login_type: userTypeData?.login_type,
          },
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${userTypeData?.token}`,
            },
          }
        );

        const EmpList = response.data.result;

        const mappedOptions = EmpList.map((empdata) => ({
          id: empdata.id,
          // title: empdata.f_name + " " + empdata.l_name,
          // title: (empdata.f_name ? empdata.f_name : "") + " " + (empdata.l_name ? empdata.l_name : ""),
          title: empdata.l_name
            ? `${empdata.f_name} ${empdata.l_name}`
            : empdata.f_name,
          // title: empdata.l_name && empdata.l_name !== "" ? `${empdata.f_name} ${empdata.l_name}` : empdata.f_name
        }));
        setemployeeList(mappedOptions);
      } catch (error) {
        handleCoockieExpire();
        getUnAutherisedTokenMessage();
        console.error("Error fetching Employee List:", error);
      }
    };
    fetchData();
  }, []);

  const [showModal, setShowModal] = useState(false);
  const handleOpen = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const myStyles = {
    width: "60%",
    position: "absolute",
    top: "47%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    fontFamily: "'CircularSTDMedium', sans-serif !important",
  };

  const [dateStartError, setDateStartError] = useState("");
  const [dateEndError, setDateEndError] = useState("");
  const [dateStartTimeError, setDateStartTimeError] = useState("");
  const [dateEndTimeError, setDateEndTimeError] = useState("");
  const [modalAddTimesheetID, setModalAddTimesheetID] = useState("");
  const [addTimesheetMsg, setaddTimesheetMsg] = useState("");

  const [addtimebreak, setTimeBreak] = useState({
    add_in_date: null,
    add_out_date: null,
    add_clocked_in: "",
    add_clocked_out: "",
    // add_clocked_in: dayjs().format("HH:mm:ss"),
    // add_clocked_out: dayjs().format("HH:mm:ss"),

    // time_valid: roundedTime.format("HH:mm:ss"),
    // time_expire: roundedTime.format("HH:mm:ss"),
  });

  // const [timeBreakErrors, set]

  const openModal = (title, id) => {
    setEmployeeName(title);
    setModalAddTimesheetID(id);
    setaddTimesheetMsg("");
    setTimeBreak({
      add_in_date: "",
      add_out_date: "",
      add_clocked_in: "",
      add_clocked_out: "",
    });
    setDateStartError("");
    setDateStartTimeError("");
    setDateEndError("");
    setDateEndTimeError("");
    setShowModal(true);
  };

  const closeModal = () => {
    setTimeBreak({
      add_in_date: "",
      add_out_date: "",
      add_clocked_in: "",
      add_clocked_out: "",
    });
    setShowModal(false);
  };

  const minutes = Math.round(dayjs().minute() / 15) * 15;
  const roundedTime = dayjs().minute(minutes).second(0);
  // console.log(roundedTime);

  const handleStartTimeChange = (newTime) => {
    if (!addtimebreak.add_clocked_out) {
      setTimeBreak({
        ...addtimebreak,
        add_clocked_in: newTime.format("HH:mm:ss"),
      });
    } else {
      if (newTime.format("HH:mm:ss") < addtimebreak.add_clocked_out) {
        setTimeBreak({
          ...addtimebreak,
          add_clocked_in: newTime.format("HH:mm:ss"),
        });
        setDateEndTimeError("");
      } else {
        setDateEndTimeError(
          "Out Date and Time should be greater than In Date and Time."
        );
      }
    }
  };

  const handleEndTimeChange = (newTime) => {
    if (!addtimebreak.add_clocked_in) {
      setTimeBreak({
        ...addtimebreak,
        add_clocked_out: newTime.format("HH:mm:ss"),
      });
    }
    if (addtimebreak.add_in_date == addtimebreak.add_out_date) {
      if (addtimebreak.add_clocked_in < newTime.format("HH:mm:ss")) {
        setTimeBreak({
          ...addtimebreak,
          add_clocked_out: newTime.format("HH:mm:ss"),
        });
        setDateEndTimeError("");
      } else if (addtimebreak.add_clocked_in == newTime.format("HH:mm:ss")) {
        setDateEndTimeError(
          "Out Date and Time should be greater than In Date and Time."
        );
        // setTimeBreak({
        //   ...addtimebreak,
        //   add_clocked_out: null,
        // });
        setTimeBreak((prev) => ({
          ...prev,
          add_clocked_out: null,
        }));
      }
    } else {
      setTimeBreak({
        ...addtimebreak,
        add_clocked_out: newTime.format("HH:mm:ss"),
      });
      setDateEndTimeError("");
    }
  };

  const handleStartDateChange = (newDate) => {
    // const formattedStartDate = newDate.format("YYYY-MM-DD");
    if (!newDate || !newDate.isValid()) {
      setDateStartError("Invalid date. Please select a valid date.");
      setTimeBreak({
        ...addtimebreak,
        add_in_date: null,
      });
      return;
    }
    const dayjsDate = dayjs(newDate); // Convert to dayjs object
    const formattedStartDate = dayjsDate.format("YYYY-MM-DD");
    // const formattedStartDate = dayjs(newDate).format("YYYY-MM-DD");

    if (!addtimebreak.add_out_date) {
      setTimeBreak({
        ...addtimebreak,
        add_in_date: formattedStartDate,
      });
      setDateStartError("");
    } else if (
      dayjs(formattedStartDate).isAfter(dayjs(addtimebreak.add_out_date))
    ) {
      setTimeBreak({
        ...addtimebreak,
        add_in_date: formattedStartDate,
        add_out_date: formattedStartDate,
      });
    } else if (
      dayjs(formattedStartDate).isSame(dayjs(addtimebreak.add_out_date))
    ) {
      setTimeBreak({
        ...addtimebreak,
        add_in_date: formattedStartDate,
        add_out_date: formattedStartDate,
      });
    } else {
      setTimeBreak({
        ...addtimebreak,
        add_in_date: formattedStartDate,
        add_out_date: null,
      });
    }
  };

  const handleEndDateChange = (newDate) => {
    if (!newDate || !newDate.isValid()) {
      // showModal("Buss");
      setDateEndTimeError("Invalid date. Please select a valid date.");
      setTimeBreak({
        ...addtimebreak,
        add_out_date: null,
      });
      return;
    }
    const formattedEndDate = newDate.format("YYYY-MM-DD");
    setTimeBreak({
      ...addtimebreak,
      add_out_date: formattedEndDate,
      add_clocked_out: null,
    });
    setDateEndError("");
    if (addtimebreak.add_clocked_out) {
      setDateEndTimeError("Clock In Time is required");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    let valid = true;
    if (!addtimebreak.add_in_date) {
      setDateStartError("Select In Date is required");
      valid = false;
    } else {
      setDateStartError("");
    }
    if (!addtimebreak.add_clocked_in) {
      setDateStartTimeError("Clock In Time is required");
      valid = false;
    } else {
      setDateStartTimeError("");
    }

    if (!addtimebreak.add_out_date) {
      setDateEndError("Select Out Date is required");
      valid = false;
    } else {
      setDateEndError("");
    }

    if (
      addtimebreak.add_in_date === addtimebreak.add_out_date &&
      addtimebreak.add_clocked_out === null
    ) {
      if (addtimebreak.add_clocked_out === null) {
        setDateEndTimeError(
          "Out Date and Time should be greater than In Date and Time."
        );
        valid = false;
        return;
      }
    } else {
      setDateEndTimeError("");
    }
    if (
      !addtimebreak.add_clocked_out &&
      addtimebreak.add_clocked_out === null
    ) {
      setDateEndTimeError("Clock Out Time is required");
      valid = false;
      return;
    } else {
      setDateEndTimeError("");
    }
    if (!addtimebreak.add_clocked_out) {
      setDateEndTimeError("Clock Out Time is required");
      valid = false;
    } else {
      setDateEndTimeError("");
    }

    if (
      dateStartError === "Invalid date. Please select a valid date." ||
      dateEndError === "Invalid date. Please select a valid date."
    ) {
      return;
    }

    if (!valid) return;
    const formData = new FormData();
    formData.append("merchant_id", merchant_id);
    formData.append("employee_id", modalAddTimesheetID);
    formData.append("in_date", addtimebreak.add_in_date);
    formData.append("out_date", addtimebreak.add_out_date);
    formData.append("clocked_in", addtimebreak.add_clocked_in);
    formData.append("clocked_out", addtimebreak.add_clocked_out);
    formData.append("token_id", userTypeData.token_id);
    formData.append("login_type", userTypeData.login_type);

    // for (const [key, value] of formData.entries()) {
    //   console.log(`${key}: ${value}`);
    // }

    // return
    setLoader(true);
    try {
      const response = await axios.post(
        `${BASE_URL}${ADD_TIME_SHEET}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${userTypeData.token}`,
          },
        }
      );
      if (
        response.data.status === true &&
        response.data.msg === "Inserted successfully."
      ) {
        ToastifyAlert("Added Successfully", "success");
        dispatch(fetchtimeSheetData(data));
        setShowModal(false);
      } else if (
        response.data.status === false &&
        response.data.msg === "Invalid time entered."
      ) {
        setaddTimesheetMsg(response.data.msg);
        setShowModal(true);
      } else if (
        response.data.status === false &&
        response.data.msg === "Already checked in, please check out first."
      ) {
        setaddTimesheetMsg(response.data.msg);
        setShowModal(true);
      } else {
        setShowModal(true);
      }
    } catch (error) {
      handleCoockieExpire();
      getUnAutherisedTokenMessage();
      console.error("API Error:", error);
    }
    setLoader(false);
  };

  // const updateTimesheet = (value,type) => {
  //   setTimeBreak(prev => ({
  //     ...prev,
  //     [type]: type === "add_clocked_in" || type === "add_clocked_out" ? value.format("HH:mm:ss") : value.format("YYYY-MM-DD")
  //   }))
  // }

  useEffect(() => {
    // const clockInDateTime = dayjs(`${addtimebreak.add_in_date} ${addtimebreak.add_clocked_in}`);
    // const clockOutDateTime = dayjs(`${addtimebreak.add_out_date} ${newTime.format("HH:mm:ss")}`);
    console.log("addtimebreak: ", addtimebreak);
  }, [addtimebreak]);

  // for Break Modal start
  const [showModalBreak, setShowModalBreak] = useState(false);
  const handleOpenBreak = () => setShowModalBreak(true);
  const handleCloseBreak = () => setShowModalBreak(false);
  const [modalDate, setModalDate] = useState("");
  const [modalDateOUT, setModalDateOUT] = useState("");
  const [modalAddBreakID, setModalAddBreakID] = useState("");
  const [BreakInTimeError, setBreakInTimeError] = useState("");
  const [BreakOutTimeError, setBreakOutTimeError] = useState("");
  const [addBreakMsg, setaddBreakMsg] = useState("");

  const [addbreak, setaddbreak] = useState({
    modalDate: modalDate,
    addbreakIn: "",
    addbreakOut: "",
  });

  const openModalBreak = (title, id, date, out_date) => {
    setEmployeeName(title);
    setModalAddBreakID(id);
    setModalDate(formatDate(date));
    setModalDateOUT(out_date);
    setBreakInTimeError("");
    setBreakOutTimeError("");
    setaddBreakMsg("");
    setaddbreak({
      addbreakIn: "",
      addbreakOut: "",
    });
    setShowModalBreak(true);
  };

  const closeModalBreak = () => {
    setBreakInTimeError("");
    setBreakOutTimeError("");
    setaddbreak({
      addbreakIn: "",
      addbreakOut: "",
    });
    setShowModalBreak(false);
  };

  const handleBreakStartTimeChange = (newTime) => {
    if (!addbreak.addbreakOut) {
      setaddbreak({
        ...addbreak,
        addbreakIn: newTime.format("HH:mm:ss"),
      });
    } else {
      if (newTime.format("HH:mm:ss") < addbreak.addbreakOut) {
        setaddbreak({
          ...addbreak,
          addbreakIn: newTime.format("HH:mm:ss"),
        });
        setBreakInTimeError("");
      } else {
        setaddbreak({
          ...addbreak,
          addbreakIn: null,
        });
        setBreakInTimeError(
          "Break-In Time should be smaller than Break-In Time."
        );
      }
    }
  };
  const handleBreakEndTimeChange = (newTime) => {
    if (!addbreak.addbreakIn) {
      setaddbreak({
        ...addbreak,
        addbreakOut: newTime.format("HH:mm:ss"),
      });
    } else {
      if (addbreak.addbreakIn < newTime.format("HH:mm:ss")) {
        setaddbreak({
          ...addbreak,
          addbreakOut: newTime.format("HH:mm:ss"),
        });
        setBreakOutTimeError("");
      } else {
        setaddbreak({
          ...addbreak,
          addbreakOut: null,
        });
        setBreakOutTimeError(
          "Break-Out Time should be greater than Break-In Time."
        );
      }
    }
  };

  const handleBreakSave = async (e) => {
    e.preventDefault();
    let valid = true;
    if (!addbreak.addbreakIn) {
      setBreakInTimeError("Break In Time is required.");
      valid = false;
    } else {
      setBreakInTimeError("");
    }
    if (!addbreak.addbreakOut) {
      setBreakOutTimeError("Break Out Time is required.");
      valid = false;
    } else {
      setBreakOutTimeError("");
    }
    if (!valid) return;
    const formData = new FormData();
    formData.append("merchant_id", merchant_id);
    formData.append("employee_id", modalAddBreakID);
    formData.append("break_in_date", formatDatePayload(modalDate));
    formData.append("break_out_date", modalDateOUT);
    formData.append("break_in_time", addbreak.addbreakIn);
    formData.append("break_out_time", addbreak.addbreakOut);
    formData.append("token_id", userTypeData.token_id);
    formData.append("login_type", userTypeData.login_type);

    for (const [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }
    setLoader(true)
    try {
      const response = await axios.post(
        `${BASE_URL}${ADD_TIME_BREAK}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${userTypeData.token}`,
          },
        }
      );
      if (
        response.data.status === true &&
        response.data.msg === "Break Added."
      ) {
        setShowModalBreak(false);
        ToastifyAlert("Added Successfully", "success");
      } else if (
        response.data.status === false &&
        response.data.msg === "Invalid time entered."
      ) {
        setaddBreakMsg(response.data.msg);
        setShowModalBreak(true);
      } else if (
        response.data.status === false &&
        response.data.msg ===
          "Already reached maximum allowed breaks for a day."
      ) {
        setaddBreakMsg(response.data.msg);
        setShowModalBreak(true);
      } else {
        setShowModalBreak(true);
      }
    } catch (error) {
      handleCoockieExpire();
      getUnAutherisedTokenMessage();
      console.error("API Error:", error);
    }
    setLoader(false)
  };
  // for Break Modal End

  // for All View Break IN/Out Start
  const [showModalViewBreak, setShowModalViewBreak] = useState(false);
  const handleOpenViewBreak = () => setShowModalViewBreak(true);
  const handleCloseViewBreak = () => setShowModalViewBreak(false);
  const [breakDetails, setBreakDetails] = useState([]);
  const [EmployeeWorkDate, setEmployeeWorkDate] = useState("");
  const [EmployeeWorkDateOUT, setEmployeeWorkDateOUT] = useState("");
  const [EmployeeTimeIn, setEmployeeTimeIn] = useState("");
  const [EmployeeTimeOut, setEmployeeTimeOut] = useState("");
  const [AllbreakDelete, setAllbreakDelete] = useState("");

  const openModalViewBreak = (title, data) => {
    setEmployeeName(title);
    fetchBreakDetails(data);
    setEmployeeWorkDate(data?.attendance_date);
    setEmployeeWorkDateOUT(data?.out_date);
    // setEmployeeTimeIn(formatTime(data.check_in_time));
    if (data?.check_in_time) {
      setEmployeeTimeIn(formatTime(data?.check_in_time));
    } else if (data.time_entered) {
      setEmployeeTimeIn(formatTime(data?.time_entered));
    }
    setEmployeeTimeOut(formatTime(data?.check_out_time));
    setAllbreakDelete(data);
    setShowModalViewBreak(true);
  };

  const closeModalViewBreak = () => {
    setShowModalViewBreak(false);
  };

  const fetchBreakDetails = async (data) => {
    try {
      const response = await axios.post(
        `${BASE_URL}${TIME_SHEET_GETBREAKS}`,
        {
          merchant_id: merchant_id,
          attendance_id: data.attendance_id,
          check_in_time: formatTime(data.check_in_time),
          check_out_time: formatTime(data.check_out_time),
          indate: formatDatePayload(data.attendance_date),
          outdate: data.out_date,
          token_id: userTypeData.token_id,
          login_type: userTypeData.login_type,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${userTypeData.token}`,
          },
        }
      );
      if (response.data.status === true) {
        setBreakDetails(response.data.breaks_list);
      } else {
        setBreakDetails([]);
      }
    } catch (error) {
      handleCoockieExpire();
      getUnAutherisedTokenMessage();
      console.error("API Error:", error);
    }
  };

  const [deleteBreakId, setDeleteBreakId] = useState(null);
  const [modalheadText, setModalheadText] = useState(null);
  const [deleteBreakTime, setDeleteBreakTime] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const deleteBreakTimesheet = (dataBreak) => {
    // const datas = {
    //   break_id: dataBreak,
    //   ...userTypeData,
    // };
    // const userConfirmed = window.confirm(
    //   "Are you sure want to delete this break timeing ?"
    // );
    // if (userConfirmed) {
    //   if (dataBreak) {
    //     dispatch(deleteBreak(datas)).then(() => {
    //       dispatch(fetchtimeSheetData(data));
    //     });
    //   }
    //   closeModalViewBreak();
    // } else {
    //   console.log("Deletion canceled by Break ");
    // }
    setDeleteBreakTime(dataBreak);
    setModalheadText("Break Timeing");
    setDeleteModalOpen(true);
    setDeleteBreakId("");
  };

  // fo all Break Delete
  const deleteAllBreakTimesheet = (dataTimesheet) => {
    // const datas = {
    //   inid: dataTimesheet.check_in_id,
    //   outid: dataTimesheet.check_out_id,
    //   attendanceid: dataTimesheet.attendance_id,
    //   checkintime: formatTime(dataTimesheet.check_in_time),
    //   checkouttime: formatTime(dataTimesheet.check_out_time),
    //   indate: dataTimesheet.attendance_date,
    //   outdate: dataTimesheet.out_date,
    //   merchant_id: merchant_id,
    //   ...userTypeData,
    // };
    // const userConfirmed = window.confirm(
    //   "Are sure want to delete this timeclock?"
    // );
    // if (userConfirmed) {
    //   if (dataTimesheet) {
    //     dispatch(deleteTimesheet(datas)).then(() => {
    //       dispatch(fetchtimeSheetData(data));
    //     });
    //   }
    //   closeModalViewBreak();
    // } else {
    //   console.log("Deletion canceled by timeclock");
    // }
    setDeleteBreakId(dataTimesheet);
    setModalheadText("Timeclock");
    setDeleteModalOpen(true);
    setDeleteBreakTime("")
  };

  const confirmDeleteCategory = async () => {
    // console.log("deleteBreakId",deleteBreakId)
    // console.log("deleteBreakTime",deleteBreakTime)
    // return
    if (deleteBreakId) {
      const datas = {
        inid: deleteBreakId.check_in_id,
        outid: deleteBreakId.check_out_id,
        attendanceid: deleteBreakId.attendance_id,
        checkintime: formatTime(deleteBreakId.check_in_time),
        checkouttime: formatTime(deleteBreakId.check_out_time),
        indate: deleteBreakId.attendance_date,
        outdate: deleteBreakId.out_date,
        merchant_id: merchant_id,
        ...userTypeData,
      };
      if (deleteBreakId) {
        // dispatch(deleteTimesheet(datas)).then(() => {
        //   dispatch(fetchtimeSheetData(data));
        // });
        try {
          await dispatch(deleteTimesheet(datas))
            .unwrap()
            .then(() => {
              dispatch(fetchtimeSheetData(data));
            });
        } catch (error) {
          console.log(error);
          getUnAutherisedTokenMessage();
          handleCoockieExpire();
        }
      }
      ToastifyAlert("Deleted Successfully", "success");
      closeModalViewBreak();
    } else if (deleteBreakTime) {
      const datasBreakDelete = {
        break_id: deleteBreakTime,
        ...userTypeData,
      };
      if (deleteBreakTime) {
        // dispatch(deleteBreak(datasBreakDelete)).then(() => {
        //   dispatch(fetchtimeSheetData(data));
        // });
        try {
          await dispatch(deleteBreak(datasBreakDelete))
            .unwrap()
            .then(() => {
              dispatch(fetchtimeSheetData(data));
            });
        } catch (error) {
          console.log(error);
          getUnAutherisedTokenMessage();
          handleCoockieExpire();
        }
      }
      ToastifyAlert("Deleted Successfully", "success");
      closeModalViewBreak();
    }

    setModalheadText("");
    setDeleteBreakId(null);
    setDeleteBreakTime(null);
    setDeleteModalOpen(false);
  };

  // for Delete Break End

  // const formatDate = (dateString) => {
  //   const date = new Date(dateString);
  //   const month = (date.getMonth() + 1).toString().padStart(2, "0");
  //   const day = date.getDate().toString().padStart(2, "0");
  //   const year = date.getFullYear();
  //   return `${month}/${day}/${year}`;
  // };

  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "short", year: "numeric" };
    const formattedDate = new Date(dateString).toLocaleDateString(
      "en-US",
      options
    );
    return formattedDate;
  };
  const formDateOUtDate = (dateString) => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const [day, month, year] = dateString.split("-");
    const date = new Date(year, month - 1, day);
    const formattedDate = `${months[date.getMonth()]} ${String(
      date.getDate()
    ).padStart(2, "0")}, ${date.getFullYear()}`;
    return formattedDate;
  };

  const [currentDate, setCurrentDate] = useState(getDate());
  function getDate() {
    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    const date = today.getDate();
    return `${month}/${date}/${year}`;
  }

  // Function to format time from HH:MM:SS to hh:mm AM/PM
  const formatTime = (timeString) => {
    if (!timeString) {
      return ""; // Return an empty string or a placeholder if timeString is undefined
    }
    let [hours, minutes, seconds] = timeString.split(":");
    hours = parseInt(hours, 10);
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // Convert 0 to 12 for 12 AM
    return `${hours.toString().padStart(2, "0")}:${minutes} ${ampm}`;
  };

  const formatDatePayload = (dateString) => {
    const date = new Date(dateString);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const formatDateBrake = (dateString) => {
    const [day, month, year] = dateString.split("-");
    return `${month}/${day}/${year}`;
  };

  const renderDataTable = () => {
    if (timesheet && timesheet.status === false) {
      return <div className="empty-div box"></div>;
    }

    const renderEmployeeData = (employee, timesheetEntries) => {
      return (
        <div className="box" key={employee.id}>
          <div className="q-attributes-bottom-detail-section">
            <div className="mt-6">
              <div className="q-attributes-bottom-header bg-[#ffffff]">
                <span>{employee.title}</span>
                <p onClick={() => openModal(employee.title, employee.id)}>
                  {" "}
                  Add Clock-in/Clock-out
                  <img src={AddIcon} alt="add-icon" />{" "}
                </p>
              </div>
              <div className="q-attributes-bottom-attriButes-header">
                <p className="q-catereport-item">Date Worked</p>
                <p className="q-catereport-item">Wage Rate</p>
                <p className="q-catereport-item">Clock In</p>
                <p className="q-catereport-item">Clock Out</p>
                <p className="q-catereport-item"></p>
              </div>
              {timesheetEntries.length > 0 ? (
                timesheetEntries.map((entry, index) => (
                  <div
                    className="q-attributes-bottom-attriButes-single-attributes TimesheetRow cursor-pointer"
                    key={index}
                    onClick={() => openModalViewBreak(employee.title, entry)}
                  >
                    <p className="q-catereport-item">
                      {formatDate(entry.attendance_date)}
                    </p>
                    <p className="q-catereport-item">
                      {entry.wages_per_hr && entry.wages_per_hr > 0
                        ? `$${priceFormate(entry.wages_per_hr)}/hr`
                        : "-"}{" "}
                    </p>
                    {/* <p className="q-catereport-item">{formatTime(entry.check_in_time)}</p> */}
                    {/* <p className="q-catereport-item">{formatTime(entry.check_out_time)}</p> */}
                    {entry.incomplete === true ? (
                      <>
                        <p className="q-catereport-item">
                          {formatTime(entry.time_entered)}
                        </p>
                        <p className="q-catereport-item">pending</p>
                      </>
                    ) : (
                      <>
                        <p className="q-catereport-item">
                          {formatTime(entry.check_in_time)}
                        </p>
                        <p className="q-catereport-item">
                          {formatTime(entry.check_out_time)}
                          {entry.date_diff > 0 &&
                            new Date(entry.attendance_date).toDateString() !==
                              new Date(entry.out_date).toDateString() &&
                            ` (+${entry.date_diff})`}
                        </p>
                      </>
                    )}
                    <p className="q-catereport-item">
                      <div
                        className="q-attributes-bottom-header viewTimesheet-AddBreak timesheet bg-[#ffffff]"
                        onClick={(e) => {
                          openModalBreak(
                            employee.title,
                            employee.id,
                            entry.attendance_date,
                            entry.out_date
                          );
                          e.stopPropagation();
                        }}
                      >
                        <p>
                          Add Break
                          <img src={AddIcon} alt="add-icon" />{" "}
                        </p>
                      </div>
                    </p>
                  </div>
                ))
              ) : (
                <div className="q-attributes-bottom-attriButes-single-attributes TimesheetRow ">
                  <p className="q-catereport-item">-</p>
                  <p className="q-catereport-item">-</p>
                  <p className="q-catereport-item">-</p>
                  <p className="q-catereport-item">-</p>
                  <p className="q-catereport-item"></p>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    };

    // if ( data.employee_id === "all") {
    //   const matchingEntries = employeeList.map(employee => {
    //     const ALLkey = `${employee.title}_${employee.id}`;
    //     return {
    //       employee,
    //       entries: timesheet[ALLkey] || []
    //     };
    //   });
    //   return matchingEntries.map(({ employee, entries }) => renderEmployeeData(employee, entries));

    // }

    if (data.employee_id === "all") {
      const timesheetKeys = Object.keys(timesheet).filter(
        (key) => key !== "status"
      );
      const prioritizedEmployees = timesheetKeys
        .map((key) => {
          const [title, id] = key.split("_");
          return employeeList.find(
            (employee) =>
              employee.id.toString() === id && employee.title === title
          );
        })
        .filter(Boolean);

      const otherEmployees = employeeList.filter(
        (employee) => !prioritizedEmployees.includes(employee)
      );
      const allEmployees = [...prioritizedEmployees, ...otherEmployees];

      return allEmployees.map((employee) => {
        const key = `${employee.title}_${employee.id}`;
        const timesheetEntries = timesheet[key] || [];
        return renderEmployeeData(employee, timesheetEntries);
      });
    }

    const selectedEmployee = employeeList.find(
      (employee) => employee.id === data.employee_id
    );
    // console.log("jxdzbv",selectedEmployee?.title+'_'+selectedEmployee?.id)
    if (selectedEmployee) {
      const key = `${selectedEmployee.title}_${data.employee_id}`;
      const matchingEntries = timesheet[key] || [];
      return renderEmployeeData(selectedEmployee, matchingEntries);
    }
  };

  const preventKeyPress = (event) => {
    event.preventDefault();
  };
  return (
    <>
      {renderDataTable()}

      {/* Modal for Add Clock-in/ClocK-out start  */}
      <Modal
        open={showModal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="view-category-item-modal" style={myStyles}>
          <div
            className="q-add-categories-section-header text-[18px]"
            style={{
              justifyContent: "space-between",
              fontFamily: "CircularSTDBook",
            }}
          >
            <span onClick={() => handleClose()}>
              <img src={AddNewCategory} alt="Timesheet" className="w-6 h-6" />
              <span>{EmployeeName}</span>
            </span>
            <p className="viewTextBark">Clock-in/Clock-out</p>
          </div>

          <div className="view-category-item-modal-header">
            <div
              className="title_attributes_section "
              style={{ margin: "1rem 1rem" }}
            >
              <Grid container spacing={3}>
                <Grid item md={6} xs={6}>
                  <LocalizationProvider
                    dateAdapter={AdapterDayjs}
                    className="date-provider"
                  >
                    <label htmlFor=" " className="pb-1">
                      Select In Date*
                    </label>
                    <DatePicker
                      onChange={(newDate) => handleStartDateChange(newDate)}
                      name="add_in_date"
                      // onChange={(newDate) => updateTimesheet(newDate, "add_in_date")}
                      // value={addtimebreak.add_in_date}
                      value={
                        addtimebreak.add_in_date
                          ? dayjs(addtimebreak.add_in_date)
                          : null
                      }
                      size="medium"
                      format={"MMMM DD, YYYY"}
                      views={["year", "month", "day"]}
                      slotProps={{
                        textField: {
                          placeholder: "Select Date",
                          onKeyPress: preventKeyPress,
                        },
                      }}
                      disableFuture
                      components={{
                        OpenPickerIcon: () => (
                          <img src={caleIcon} alt="calendar-icon" />
                        ),
                      }}
                      sx={{ width: "100%" }}
                    />
                  </LocalizationProvider>
                  {dateStartError && (
                    <p className="error-message ">{dateStartError}</p>
                  )}
                </Grid>

                <Grid item md={6} xs={6}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <label htmlFor=" " className="pb-1">
                      Clock In Time*
                    </label>
                    <TimePicker
                      id="clock_in"
                      slotProps={{
                        textField: { placeholder: "Select Time" },
                      }}
                      value={
                        addtimebreak.add_clocked_in
                          ? dayjs(addtimebreak.add_clocked_in, "HH:mm")
                          : null
                      }
                      name="add_clocked_in"
                      onChange={(newTime) => handleStartTimeChange(newTime)}
                      // onChange={(newTime) => updateTimesheet(newTime, "add_clocked_in")}
                      // onChange={handleStartTimeChange}
                      components={{
                        OpenPickerIcon: () => (
                          <img src={TimeIcon} alt="time-icon" />
                        ),
                      }}
                      sx={{ width: "100%" }}
                    />
                  </LocalizationProvider>

                  {dateStartTimeError && (
                    <p className="error-message ">{dateStartTimeError}</p>
                  )}
                </Grid>
              </Grid>

              <Grid container spacing={3}>
                <Grid item md={6} xs={6}>
                  <LocalizationProvider
                    dateAdapter={AdapterDayjs}
                    className="date-provider"
                  >
                    <label htmlFor=" " className="pb-1">
                      Select Out Date*
                    </label>
                    <DatePicker
                      onChange={(newDate) => handleEndDateChange(newDate)}
                      // onChange={(newDate) => updateTimesheet(newDate, "add_out_date")}
                      value={
                        addtimebreak.add_out_date
                          ? dayjs(addtimebreak.add_out_date)
                          : null
                      }
                      // shouldDisableDate={(date) => {
                      //   const start = addtimebreak.add_in_date;
                      //   return date.format("YYYY-MM-DD") < start ;
                      // }}
                      shouldDisableDate={(date) => {
                        const start = addtimebreak.add_in_date
                          ? dayjs(addtimebreak.add_in_date)
                          : null;
                        return start && date.isBefore(start, "day");
                      }}
                      disableFuture
                      name="add_out_date"
                      size="medium"
                      format={"MMMM DD, YYYY"}
                      views={["year", "month", "day"]}
                      slotProps={{
                        textField: {
                          placeholder: "Select Date",
                          onKeyPress: preventKeyPress,
                        },
                      }}
                      components={{
                        OpenPickerIcon: () => (
                          <img src={caleIcon} alt="calendar-icon" />
                        ),
                      }}
                      sx={{ width: "100%" }}
                    />
                  </LocalizationProvider>
                  {dateEndError && (
                    <p className="error-message ">{dateEndError}</p>
                  )}
                </Grid>

                <Grid item md={6} xs={6}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <label htmlFor=" " className="pb-1">
                      Clock Out Time*
                    </label>
                    <TimePicker
                      name="add_clocked_out"
                      id="break_in"
                      slotProps={{
                        textField: { placeholder: "Select Time" },
                      }}
                      onChange={(newTime) => handleEndTimeChange(newTime)}
                      // onChange={(newTime) => updateTimesheet(newTime, "add_clocked_out")}
                      // value={addtimebreak.add_clocked_out}
                      value={
                        addtimebreak.add_clocked_out
                          ? dayjs(addtimebreak.add_clocked_out, "HH:mm")
                          : null
                      }
                      components={{
                        OpenPickerIcon: () => (
                          <img src={TimeIcon} alt="time-icon" />
                        ),
                      }}
                      sx={{ width: "100%" }}
                    />
                  </LocalizationProvider>
                  {dateEndTimeError && (
                    <p className="error-message ">{dateEndTimeError}</p>
                  )}
                </Grid>
              </Grid>
              <Grid container spacing={3}>
                <Grid
                  item
                  md={12}
                  xs={12}
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  {addTimesheetMsg && (
                    <p className="error-message " style={{ margin: "14px" }}>
                      {addTimesheetMsg}
                    </p>
                  )}
                </Grid>
              </Grid>
            </div>
          </div>

          <div className="q-add-categories-section-middle-footer">
            <button className="quic-btn quic-btn-save attributeUpdateBTN" onClick={handleSave} disabled={loader}>
              { loader ? <><CircularProgress color={"inherit"} className="loaderIcon" width={15} size={15}/> Add</> : "Add"}
            </button>
            <button onClick={closeModal} className="quic-btn quic-btn-cancle">
              Cancel
            </button>
          </div>
        </Box>
      </Modal>
      {/* Modal for Add Clock-in/ClocK-out End  */}

      {/* Modal for Break In /Out Start  */}
      <Modal
        open={showModalBreak}
        onClose={handleCloseBreak}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="view-category-item-modal" style={myStyles}>
          <div
            className="q-add-categories-section-header text-[18px]"
            style={{
              justifyContent: "space-between",
              fontFamily: "CircularSTDBook",
            }}
          >
            <span onClick={() => handleCloseBreak()}>
              <img src={AddNewCategory} alt="Timesheet" className="w-6 h-6" />
              <span>{EmployeeName}</span>
            </span>
            <div className="viewTextBark">
              <span className="borderRight ">
                {modalDate} - {modalDateOUT ? formatDate(modalDateOUT) : "-"}
              </span>{" "}
              <span className="pl-1"> Break-in/Break-out</span>
            </div>
          </div>

          <div className="view-category-item-modal-header">
            <div
              className="title_attributes_section "
              style={{ margin: "1rem 1.5rem" }}
            >
              <Grid container spacing={3}>
                <Grid item md={6} xs={6}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <label className="pb-1">Break In Time*</label>
                    <TimePicker
                      name="break_in"
                      id="break_in"
                      slotProps={{
                        textField: { placeholder: "Select Time" },
                      }}
                      onChange={(newTime) =>
                        handleBreakStartTimeChange(newTime)
                      }
                      components={{
                        OpenPickerIcon: () => (
                          <img src={TimeIcon} alt="time-icon" />
                        ),
                      }}
                      sx={{ width: "100%" }}
                    />
                  </LocalizationProvider>
                  {BreakInTimeError && (
                    <p className="error-message ">{BreakInTimeError}</p>
                  )}
                </Grid>

                <Grid item md={6} xs={6}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <label className="pb-1">Break Out Time*</label>
                    <TimePicker
                      name="break_out"
                      id="break_out"
                      slotProps={{
                        textField: { placeholder: "Select Time" },
                      }}
                      onChange={(newTime) => handleBreakEndTimeChange(newTime)}
                      components={{
                        OpenPickerIcon: () => (
                          <img src={TimeIcon} alt="time-icon" />
                        ),
                      }}
                      sx={{ width: "100%" }}
                    />
                  </LocalizationProvider>
                  {BreakOutTimeError && (
                    <p className="error-message ">{BreakOutTimeError}</p>
                  )}
                </Grid>

                <Grid container spacing={3}>
                  <Grid
                    item
                    md={12}
                    xs={12}
                    style={{ display: "flex", justifyContent: "center" }}
                  >
                    {addBreakMsg && (
                      <p className="error-message " style={{ margin: "14px" }}>
                        {addBreakMsg}
                      </p>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </div>
          </div>

          <div className="q-add-categories-section-middle-footer">
            <button
              className="quic-btn quic-btn-save attributeUpdateBTN"
              onClick={handleBreakSave}
              disabled={loader}
            >
              { loader ? <><CircularProgress color={"inherit"} className="loaderIcon" width={15} size={15}/> Add</> : "Add"}
            </button>
            <button
              onClick={closeModalBreak}
              className="quic-btn quic-btn-cancle"
            >
              Cancel
            </button>
          </div>
        </Box>
      </Modal>

      {/* Modal for Break In /Out End */}

      {/* Modal for All View Break IN/Out Start  */}
      <Modal
        open={showModalViewBreak}
        onClose={closeModalViewBreak}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="view-category-item-modal" style={myStyles}>
          <div
            className="q-add-categories-section-header text-[18px]"
            style={{
              justifyContent: "space-between",
              fontFamily: "CircularSTDBook",
              padding: "1rem 1.90rem",
            }}
          >
            <span onClick={() => closeModalViewBreak()}>
              <img src={AddNewCategory} alt="Timesheet" className="w-6 h-6" />
              <span>{EmployeeName}</span>
            </span>
            <p
              className="pr-1"
              onClick={() => deleteAllBreakTimesheet(AllbreakDelete)}
            >
              <img
                src={DeleteIcon}
                alt="delete-icon"
                className="cursor-pointer"
              />
            </p>
          </div>

          <div className="view-category-item-modal-header">
            <div
              className="title_attributes_section viewbreak"
              style={{ margin: "1rem 1.5rem" }}
            >
              <span className="borderRight">
                Working Date:{" "}
                <span className="viewTextBark">
                  {formatDate(EmployeeWorkDate)} -{" "}
                  {EmployeeWorkDateOUT
                    ? formDateOUtDate(EmployeeWorkDateOUT)
                    : "-"}
                </span>{" "}
              </span>
              <span className="borderRight">
                Clock In: <span className="viewTextBark">{EmployeeTimeIn}</span>{" "}
              </span>
              <span className="pl-2">
                Clock Out:{" "}
                <span className="viewTextBark">{EmployeeTimeOut}</span>{" "}
              </span>
            </div>

            <div className="viewTaleBreak table__header">
              <p>Break</p>
              <p>Breaked In</p>
              <p>Breaked Out</p>
              <p></p>
            </div>
            {breakDetails.length > 0 ? (
              breakDetails.map((breakDetail, index) => {
                const breakTimeIn = breakDetail.formatted_time.split(" to ")[0];
                const breakTimeOut =
                  breakDetail.formatted_time.split(" to ")[1];
                const isLastRow = index === breakDetails.length - 1;
                return (
                  <div
                    className={`viewTaleBreak ${
                      !isLastRow ? "viewTableRow" : ""
                    }`}
                    key={index}
                  >
                    <p>Break {index + 1}</p>
                    <p>{breakTimeIn}</p>
                    <p>{breakTimeOut}</p>
                    <p
                      onClick={(e) => {
                        deleteBreakTimesheet(breakDetail.id);
                        e.stopPropagation();
                      }}
                    >
                      <img
                        src={DeleteIcon}
                        alt="delete-icon"
                        className="cursor-pointer"
                      />
                    </p>
                  </div>
                );
              })
            ) : (
              <div className="viewTaleBreak ">
                <p>No break details available.</p>
              </div>
            )}
          </div>

          <div className="q-add-categories-section-middle-footer">
            <button
              className="quic-btn quic-btn-save mr-4"
              onClick={closeModalViewBreak}
            >
              OK
            </button>
          </div>
        </Box>
      </Modal>
      {/* Modal for All View Break IN/Out End */}

      <DeleteModal
        headerText={modalheadText ? modalheadText : ""}
        open={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
        }}
        onConfirm={confirmDeleteCategory}
      />
    </>
  );
};

export default TimesheetListing;
