import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

import { Box, Button, Grid, Modal } from "@mui/material";
import AddIcon from "../../Assests/Category/addIcon.svg";
import CrossIcon from "../../Assests/Dashboard/cross.svg";
import { BASE_URL, ADD_UPDATE_PERMISSION } from "../../Constants/Config";
import EditIcon from "../../Assests/Category/editIcon.svg";
import LeftIcon from "../../Assests/Taxes/Left.svg";
import { fetchPermissionData } from "../../Redux/features/Permission/PermissionSlice";
import axios from "axios";
import BasicTextFields from "../../reuseableComponents/TextInputField";
import SelectDropDown from "../../reuseableComponents/SelectDropDown";
import { useAuthDetails } from "../../Common/cookiesHelper";
import { toast } from "react-toastify";
import { ToastifyAlert } from "../../CommonComponents/ToastifyAlert";
import CircularProgress from "@mui/material/CircularProgress";
import PasswordShow from "./../../Common/passwordShow";
const AddPermissionModal = () => {
  const [open, setOpen] = useState(false);
  // const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({
    permission: "",
    sub_permission: "",
  });

  const handleOpen = () => {
    setPermission({
      permission: "Select",
      sub_permission: "",
    });
    setErrors({
      permission: "",
      sub_permission: "",
    });
    setOpen(true);
  };
  const [loader, setLoader] = useState(false);
  const { userTypeData } = useAuthDetails();

  const {handleCoockieExpire,getUnAutherisedTokenMessage}=PasswordShow()

  const { token, ...userTypeDataAlter } = userTypeData;
  const [states, setStates] = useState([
    "Select",
    "Register",
    "Store Stats",
    "Users",
    "Inventory",
    "Customers",
    "Coupons",
    "Setup",
    "Dispatch Center",
    "Attendance",
    "Home Screen",
    "Gift Card",
  ]);

  const myStyles = {
    width: "60%",
    position: "absolute",
    top: "47%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  };
  const mycur = {
    cursor: "pointer",
    width: "fit-content",
  };
  const width = {
    width: "30rem",
  };

  const [permission, setPermission] = useState({
    permission: "",
    sub_permission: "",
  });

  //Handle Select Permission's
  const handlePermissionChange = (e) => {
    const selectedPermission = e.title;
    if (selectedPermission === "Select") {
      setPermission((prevState) => ({
        ...prevState,
        permission: selectedPermission,
      }));
      setErrors((prevState) => ({
        ...prevState,
        permission: "Permission is required",
      }));
    } else {
      setPermission((prevState) => ({
        ...prevState,
        permission: selectedPermission,
      }));
      setErrors((prevState) => ({
        ...prevState,
        permission: "",
      }));
    }
  };

  //Handle Sub Permission's
  const handleSubPermissionChange = (e) => {
    const { name, value } = e?.target;
    if(value){
      setPermission((prevState) => ({
        ...prevState,
        [name]: value,
      }));
      setErrors((prevState) => ({
        ...prevState,
        sub_permission: "",
      }));
    }else{
      setErrors((prevState) => ({
        ...prevState,
        sub_permission: "Sub Permission is required",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("permission.permission",permission.permission)

    let hasError = false;

    if (permission.permission === "") {
      setErrors((prevState) => ({
        ...prevState,
        permission: "Permission is required",
      }));
      hasError = true;
    }else if(permission.permission === "Select"){
      setErrors((prevState) => ({
        ...prevState,
        permission: "Please Select Permission is required",
      }));
      hasError = true;
    }
   

    if (permission.sub_permission === "") {
      setErrors((prevState) => ({
        ...prevState,
        sub_permission: "Sub Permission is required",
      }));
      hasError = true;
    }

   if (hasError) return;

   
  //  return
  setLoader(true);
      try {
        const res = await axios.post(
          BASE_URL + ADD_UPDATE_PERMISSION,
          { ...permission, ...userTypeDataAlter },
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.data.status;
        const msg = await res.data.message;

        if (data == "success") {
          ToastifyAlert("Added Successfully", "success");

          dispatch(fetchPermissionData(userTypeData));

          setPermission({
            permission: "",
            sub_permission: "",
          });

          handleClose();
        } else if (
          data == "failed" &&
          msg == "Permission and Sub-Permission cannot be empty."
        ) {
          ToastifyAlert(msg, "warn");
        }
      } catch (error) {
        ToastifyAlert("Error!", "error");
        handleCoockieExpire()
        getUnAutherisedTokenMessage()
      }
      setLoader(false);
  };

  return (
    <div>
      <div
        className="flex justify-evenly categories-items categories-items-btn"
        onClick={handleOpen}
      >
        <p>
          Add Sub Permission
          <img
            src="/static/media/addIcon.554c6e38782178cf6d445d3838e59ad3.svg"
            alt="add-icon"
          />
        </p>
      </div>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="view-category-item-modal" style={myStyles}>
          <div
            class="q-add-categories-section-header text-[18px]"
            style={{
              justifyContent: "space-between",
              fontFamily: "CircularSTDBook",
            }}
          >
            <span>
              <span>Add New Sub Permission</span>
            </span>
            <div>
              <img
                src="/static/media/cross.02a286778a0b1b3162ac5e3858cdc5f1.svg"
                alt="icon"
                class="  quic-btn-cancle w-6 h-6"
                style={{ cursor: "pointer" }}
                onClick={() => handleClose()}
              />
            </div>
          </div>

          {/* </div> */}
          <div className="view-category-item-modal-header">
            <form onSubmit={handleSubmit} enctype="multipart/form-data">
              <div className="q-add-categories-section-middle-form">
                <div className="qvrow">
                  {/* <div className="col-qv-6"> */}
                  <Grid item xs={12} sm={6} md={6}>
                    <div className=" qvrowmain my-1">
                      <label htmlFor="email">Sub Permission</label>
                    </div>
                    <BasicTextFields
                      type="text"
                      name="sub_permission"
                      placeholder="Sub Permission"
                      onChangeFun={handleSubPermissionChange}
                      value={permission?.sub_permission}
                    />
                     
                    {errors.sub_permission && (
                      <p className="error-message">{errors.sub_permission}</p>
                    )}
                  </Grid>
                  {/* </div> */}

                  {/* <div className="col-qv-6"> */}
                  <Grid item xs={12} sm={6} md={6}>
                    <div className="my-1 qvrowmain">
                      <label htmlFor="State">Permission</label>
                    </div>
                    <SelectDropDown
                      listItem={states.map((item) => ({ title: item }))}
                      title={"title"}
                      // heading={"Select"}
                      selectedOption={permission?.permission}
                      onClickHandler={handlePermissionChange}
                      name="permission"
                    />
                     {errors.permission && (
                      <p className="error-message">{errors.permission}</p>
                    )}
                  </Grid>
                  {/* </div> */}
                </div>
              </div>

              <div className="q-add-categories-section-middle-footer">
                <button className="quic-btn quic-btn-save attributeUpdateBTN"  disabled={loader}>
                { loader ? <><CircularProgress color={"inherit"} className="loaderIcon" width={15} size={15}/> Add</> : "Add"}
                </button>

                <button
                  onClick={() => handleClose()}
                  className="quic-btn quic-btn-cancle"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default AddPermissionModal;
