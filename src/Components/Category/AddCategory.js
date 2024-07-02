import React, { useState, useEffect, useRef } from "react";
import AddNewCategory from "../../Assests/Taxes/Left.svg";
import axios from "axios";
import {
  BASE_URL,
  ADD_CATOGRY,
  LIST_ALL_Defaults,
} from "../../Constants/Config";
import Upload from "../../Assests/Category/upload.svg";

import DeleteIcon from "../../Assests/Category/deleteIcon.svg";

import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import CheckBoxField from "../../reuseableComponents/CheckBoxField";
import { useAuthDetails } from "../../Common/cookiesHelper";
import { ToastifyAlert } from "../../CommonComponents/ToastifyAlert";
import AlertModal from "../../reuseableComponents/AlertModal";
import { Link, useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import PasswordShow from "../../Common/passwordShow";
const AddCategory = ({ seVisible }) => {
  const {
    LoginGetDashBoardRecordJson,
    LoginAllStore,
    userTypeData,
    GetSessionLogin,
  } = useAuthDetails();
  const [errorMessage, setErrorMessage] = useState("");
  const [value, setValue] = useState(null);
  let merchant_id = LoginGetDashBoardRecordJson?.data?.merchant_id;
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [alertModalHeaderText, setAlertModalHeaderText] = useState("");
  const [loader, setLoader] = useState(false);
  const {handleCoockieExpire,getUnAutherisedTokenMessage}=PasswordShow()
  const [category, setCategory] = useState({
    title: "",
    description: "",
    merchant_id: LoginGetDashBoardRecordJson?.data?.merchant_id,
    online: 0,
    use_point: 0,
    earn_point: 0,
    image: "",
  });

  const myStyles = {
    display: "flex",
  };

  const showModal = (headerText) => {
    setAlertModalHeaderText(headerText);
    setAlertModalOpen(true);
  };
  // console.log(category);
  const handleKeyPress = (event) => {
    const allowedChars = /^[a-zA-Z0-9\s]$/;
    if (!allowedChars.test(event.key)) {
      event.preventDefault();
    }
  };
  const inputChange = (e) => {
    const { name, value } = e.target;
    // let val = value.replace(/[^\w\d]/g, "");
    let val = value;
    // let val = value.replace(/[^a-zA-Z0-9\s]/g, "");
    if (name === "title") {
      if (val) {
        setCategory({ ...category, title: val });
      }
      // if (regex.test(value)) {
      //   const filteredValue = value.replace(/[^\w\s]*$/gi, '');
      //   const formattedValue = filteredValue.replace(/\b\w/g, (char) => char.toUpperCase())
      //   setCategory({ ...category, title: formattedValue });
      // }
    } else {
      setCategory((preValue) => {
        return {
          ...preValue,
          [name]: val,
        };
      });
    }
    setErrorMessage("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (allowedTypes.includes(file.type)) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setCategory((prevValue) => ({
            ...prevValue,
            image: {
              file: file,
              base64: reader.result,
            },
          }));
        };
        reader.readAsDataURL(file);
      } else {
        // alert(
        //   `${file.name} is not an image.\nOnly jpeg, png, jpg files can be uploaded`
        // );
        showModal("Only jpeg, png, jpg files can be uploaded");
        e.target.value = null;
      }
    }
  };
  const navigate = useNavigate();

  const validate = () => {
    console.log(category.title);
    let error = false;
    const allowedCharacters = /^[a-zA-Z0-9\s]*$/;
    if (category.title == "") {
      setErrorMessage("Title is required");
      error = true;
    } else if (!allowedCharacters.test(category.title)) {
      setErrorMessage("Special Character not allowed");
      error = true;
    } else {
      setErrorMessage("");
      error = false;
    }
    if (error) {
      return false;
    } else {
      return true;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let isValidate = validate();
    if (isValidate) {
      const formData = new FormData();

      // Append your tax data
      formData.append("title", category.title);
      formData.append("description", category.description);
      formData.append("merchant_id", category.merchant_id);
      formData.append("use_point", category.use_point);
      formData.append("earn_point", category.earn_point);
      formData.append("token_id", userTypeData?.token_id);
      formData.append("login_type", userTypeData?.login_type);

      if (category.image && category.image.base64) {
        formData.append("online", category.online);
        formData.append("image", category.image.base64);
        formData.append("filename", category.image.file.name);
      } else {
        formData.append("image", "");
        formData.append("filename", "");
      }
      setLoader(true);
      try {
        const res = await axios.post(BASE_URL + ADD_CATOGRY, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${userTypeData?.token}`,
          },
        });

        const data = await res.data.status;
        const update_message = await res.data.msg;
        if (data == "Success") {
          ToastifyAlert("Added Successfully", "success");
          // seVisible("CategoryDetail");
          navigate("/inventory/category");
        } else if (
          data == "Failed" &&
          update_message == "The name is Already exist"
        ) {
          setErrorMessage(update_message);
        } else if (
          data == "Failed" &&
          update_message == "*Please enter title"
        ) {
          setErrorMessage(update_message);
        } else {
          // alert(update_message);
          showModal(update_message);
          // seVisible("CategoryDetail");
          navigate("/inventory/category");
        }
      } catch (error) {
        console.error("API Error:", error);
        handleCoockieExpire()
        getUnAutherisedTokenMessage()
      }
      setLoader(false);
    }
  };

  // Function to prevent default behavior for drag over
  const inputRef = useRef(null);

  const openFileInput = () => {
    inputRef.current.click();
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  // Function to handle image drop
  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCategory((prevValue) => ({
          ...prevValue,
          image: value,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImage = (e) => {
    e.stopPropagation();
    const fileInput = document.getElementById("filesBanner");
    if (fileInput) {
      fileInput.value = "";
    }

    setCategory((prevValue) => ({
      ...prevValue,
      image: {
        file: null,
        base64: null,
      },
    }));
  };

  // for Default Category list start merchant_id,userTypeData
  const [defaultList, setDefaultList] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        let data = {
          merchant_id: merchant_id,
          token_id: userTypeData?.token_id,
          login_type: userTypeData?.login_type,
        };
        const response = await axios.post(BASE_URL + LIST_ALL_Defaults, data, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${userTypeData?.token}`,
          },
        });

        if (response.data.status === "Success") {
          setDefaultList(response.data.result);
        } else if (
          response.data.status === "Failed" &&
          response.data.msg === "No. Data found."
        ) {
          setDefaultList([]);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  // for Default Category list End

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent default Enter key behavior if necessary
      // Additional logic to handle the Enter key press
    }
  };
  const back = () => {
    navigate(-1);
  };

  return (
    <>
      <div className="box">
        <div className="q-category-top-detail-section">
          <li>In order to use the Quickvee app one Category is required.</li>
          <li>
            If you make changes to the Category, the Category status will be
            pending until the admin approves it.
          </li>
          <li>
            After you've made changes to your menu, select the option "Click
            Here To Send For Approval To Admin" to get admin approval to update
            your website.
          </li>
        </div>
        <div className="q-add-categories-section mb-5">
          {/* <form enctype="multipart/form-data"> */}
          <div className="q-add-categories-section-header">
            <span onClick={back}>
              <img
                src={AddNewCategory}
                alt="Add-New-Category"
                className="w-6 h-6"
              />
              <span>Add New Category</span>
            </span>
          </div>
          <div className="q-add-categories-section-middle-form">
            <div
              className="q-add-categories-single-input mb-2"
              style={{ position: "relative" }}
            >
              <label for="title">Title</label>
            </div>

            <Autocomplete
              id="size-small-standard"
              size="small"
              options={defaultList}
              freeSolo
              // getOptionLabel={(option) => option.name}
              getOptionLabel={(option) => {
                // console.log(option);
                // Check if the option is an object with a name property
                if (typeof option === "object" && option.name) {
                  return option.name;
                }
                // Handle other types of options, e.g., strings
                return typeof option === "string" ? option : "";
              }}
              value={value}
              onChange={(event, newValue) => {
                // let val = newValue.replace(/[^a-zA-Z0-9\s]/g, "");
                // if (regex.test(event.target.value)) {
                setCategory((previousValue) => ({
                  ...previousValue,
                  title: newValue?.name || newValue || "",
                }));
                // }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  className="suggestlist_input MuiAutocomplete-option"
                  name="title"
                  value={category.title}
                  onChange={inputChange}
                  onKeyDown={handleKeyDown}
                  style={{}}
                  onKeyPress={handleKeyPress}
                />
              )}
            />
            {errorMessage && (
              <span className="error-message" style={{ color: "red" }}>
                {errorMessage}
              </span>
            )}

            <div className="q-add-categories-single-input mt-2">
              <label for="description">Description</label>
              <textarea
                id="description"
                name="description"
                rows="4"
                cols="50"
                value={category.description}
                onChange={inputChange}
              ></textarea>
            </div>

            <div
              className={`h-[100px] flex items-center justify-center border-2 border-dashed border-[#BFBFBF] bg-white rounded-lg mt-2  defaultDrag_div`}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={openFileInput}
              style={{
                cursor: "pointer",
                position: "relative",
                height: "260px",
                padding: "10px",
                backgroundColor: "#f9f9f9",
                overflow: "hidden",
              }}
            >
              {category.image && category.image.base64 ? (
                <>
                  <span
                    className="delete-image-icon img-DeleteIcon"
                    onClick={handleDeleteImage}
                    style={{
                      position: "absolute",
                      top: "7px",
                      right: "7px",
                    }}
                  >
                    <img src={DeleteIcon} alt="delete-icon" />
                  </span>
                  <img
                    src={category.image.base64}
                    alt="Preview"
                    className="default-img"
                    style={{
                      height: "auto",
                      objectFit: "contain",
                      width: "100%",
                    }}
                  />
                </>
              ) : (
                <div className="flex-column">
                  <img
                    src={Upload}
                    style={{ transform: "translate(2.5rem, 0px)" }}
                    alt="Default"
                  />
                  <span style={{ color: "#6A6A6A" }}>Category Image</span>
                </div>
              )}
              <div className="q-add-categories-single-input">
                <input
                  type="file"
                  id="filesBanner"
                  name="image"
                  accept="image/*"
                  ref={inputRef}
                  className="default-img-inputfield"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                />
              </div>
            </div>

            <div className="row py-3" style={myStyles}>
              <div className="add-category-checkmark-div">
                <label className="add-category-checkmark-label mt-2">
                  Show Online ?
                  <CheckBoxField
                    checked={category.online === 1}
                    onChangeFun={setCategory}
                    categoryType={"online"}
                  />
                </label>
              </div>
              <div className="add-category-checkmark-div">
                <label className="add-category-checkmark-label mt-2">
                  Use Loyalty Point ?
                  <CheckBoxField
                    checked={category.use_point === 1}
                    onChangeFun={setCategory}
                    categoryType={"use_point"}
                  />
                </label>
              </div>
              <div className="add-category-checkmark-div">
                <label className="add-category-checkmark-label mt-2">
                  Earn Loyalty Point ?
                  <CheckBoxField
                    checked={category.earn_point === 1}
                    onChangeFun={setCategory}
                    categoryType={"earn_point"}
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="q-add-categories-section-middle-footer">
            <button
              className="quic-btn quic-btn-save attributeUpdateBTN"
              onClick={handleSubmit}
              disabled={loader}
            >
              {loader ? (
                <>
                  <CircularProgress
                    color={"inherit"}
                    className="loaderIcon"
                    width={15}
                    size={15}
                  />{" "}
                  Add
                </>
              ) : (
                "Add"
              )}
            </button>
            {/* <Link to={`/category`}> */}
            <button
              // onClick={() => seVisible("CategoryDetail")}
              onClick={back}
              className="quic-btn quic-btn-cancle"
            >
              Cancel
            </button>
            {/* </Link> */}
          </div>
          {/* </form> */}
        </div>
      </div>
      <AlertModal
        headerText={alertModalHeaderText}
        open={alertModalOpen}
        onClose={() => {
          setAlertModalOpen(false);
        }}
      />
    </>
  );
};

export default AddCategory;
