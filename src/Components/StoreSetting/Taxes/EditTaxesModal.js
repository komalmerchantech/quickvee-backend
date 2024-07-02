import React, { useState, useEffect } from "react";

import { Box, Modal } from "@mui/material";
import EditIcon from "../../../Assests/Category/editIcon.svg";
import CrossIcon from "../../../Assests/Dashboard/cross.svg";
import DownIcon from "../../../Assests/Dashboard/Down.svg";
import { fetchtaxesData } from "../../../Redux/features/Taxes/taxesSlice";
import { useDispatch } from "react-redux";
import axios from "axios";
import { useAuthDetails } from "../../../Common/cookiesHelper";
import {
  BASE_URL,
  UPDATE_TAXES,
  TAXE_CATEGORY_LIST,
  FETCH_DATA_TAXE,
} from "../../../Constants/Config";
import BasicTextFields from "../../../reuseableComponents/TextInputField";
import TextField from "@mui/material/TextField";
import SelectDropDown from "../../../reuseableComponents/SelectDropDown";
import { ToastifyAlert } from "../../../CommonComponents/ToastifyAlert";
import CircularProgress from "@mui/material/CircularProgress";
import PasswordShow from "../../../Common/passwordShow";
const EditTaxesModal = ({ selectedTaxe }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  // const handleClose = () => setOpen(false);
  const handleClose = () => {
    setTaxes({
      title: "",
      percent: "",
    });
    setErrorMessage("")
    setErrorTitleMessage("")
    setErrorPerMessage("")
    setOpen(false);
  }

  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useDispatch();

  const [errorTitleMessage, setErrorTitleMessage] = useState("");
  const [errorPerMessage, setErrorPerMessage] = useState("");
  const [loader, setLoader] = useState(false);
  const {handleCoockieExpire,getUnAutherisedTokenMessage}=PasswordShow()
  const myStyles = {
    width: "58rem",
    position: "absolute",
    top: "47%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  };
  const myDropStyles = {
    width: "55.5rem",
    overflowY: "scroll",
    height: "185px",
  };

  const width = {
    width: "6.5rem",
  };

  const { LoginGetDashBoardRecordJson, LoginAllStore, userTypeData } = useAuthDetails();
  let merchant_id = LoginGetDashBoardRecordJson?.data?.merchant_id;

  async function fetchData() {
    const getdefaultsData = {
      tax_id: selectedTaxe.id,
      merchant_id:merchant_id,
      token_id: userTypeData.token_id,
      login_type: userTypeData.login_type,
    };
    try {
      const response = await axios.post(
        BASE_URL + FETCH_DATA_TAXE,
        getdefaultsData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${userTypeData.token}`,
          },
        }
      );
      if (response.data.status === true) {
        return response.data.tax_data;
      }
    } catch (error) {
      console.error("Error:", error);
      handleCoockieExpire()
      getUnAutherisedTokenMessage()
    }
  }

  useEffect(() => {
    if (open) {
      const fetchDataAndUpdateState = async () => {
        const res = await fetchData();
        if (res) {
          setTaxes({
            collID: res?.id,
            title: res?.title,
            percent: res?.percent,
            merchant_id: res?.merchant_id,
          });
        }
      };
      setApplyToCategory(false)

      fetchDataAndUpdateState();
    }
  }, [open, selectedTaxe]);

  const [taxes, setTaxes] = useState({
    collID: "",
    title: "",
    percent: "",
    merchant_id: "",
  });

  const inputChange = (e) => {
    const { name, value } = e.target;
    const regex = /^[A-Za-z0-9 ]*$/ ;
    if (name === "title"){
      if (regex.test(value)) {
        setTaxes({ ...taxes, title: value });
        setErrorTitleMessage(value ? "" : "Title is required");
        setErrorMessage("")
      }
    }else{
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
        setTaxes({ ...taxes, title: "" });
      } else {
        setTaxes((preValue) => {
          return {
            ...preValue,
            [name]: name === "percent" ? formatPercent(fieldValue) : fieldValue,
          };
        });
        setErrorPerMessage("");
      }
      setErrorPerMessage(value ? "" : "Percent is required");
    }
  };

  const formatPercent = (value) => {
    if (value.match(/^\d{0,2}$/)) {
      return value;
    } else if (value.match(/^\d{3,}$/)) {
      return value.slice(0, 2) + "." + value.slice(2);
    } else if (value.match(/^\d{0,2}\.\d{0,2}$/)) {
      return value;
    }
  };
  const handleKeyPress = (e) => {
    const keyCode = e.keyCode || e.which;
    const keyValue = String.fromCharCode(keyCode);
    const regex = /^[0-9.]+$/;

    if (!regex.test(keyValue)) {
      e.preventDefault();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Assuming you have the selected category ID stored in selectedCategory state
    const categoryId = selectedCategory;


    if (applyToCategory && (!categoryId || categoryId === "--Select Category--")) {
      setStoreToError("Please select a category");
      return; // Prevent form submission
    } else {
      setStoreToError("");
    }

    if (applyToCategory && categoryId) {
      const formData = new FormData();

      // Append your tax data
      formData.append("collID", taxes.collID);
      formData.append("title", taxes.title);
      formData.append("percent", taxes.percent);
      formData.append("merchant_id", taxes.merchant_id);

      // Append additional data for applying tax to a category
      formData.append("applytaxtocat", applyToCategory ? 1 : 0);
      formData.append("taxchoice", updateTax ? 1 : 0); // 1 for updating tax, 0 for additional tax
      formData.append("cate_id", categoryId);
      formData.append("token_id", userTypeData?.token_id);
      formData.append("login_type", userTypeData?.login_type);

      if(taxes.title === "" || taxes.percent === ""){
        setErrorTitleMessage(taxes.title ? "" : "Title is required");
        setErrorPerMessage(taxes.percent ? "" : "Percent is required");
        return;
      }
      setLoader(true);
      try {
        // Make your API request with axios
        const response = await axios.post(BASE_URL + UPDATE_TAXES, formData, {
          headers: { "Content-Type": "multipart/form-data" ,Authorization: `Bearer ${userTypeData?.token}`},
        });

        // Handle the response as needed
        const update_message = response.data.status;
        const msg = response.data.msg;
        console.log(update_message);
        if (update_message == "Success") {
          // alert(msg)
          ToastifyAlert("Updated Successfully", "success");
          let data = {
            merchant_id: merchant_id,
            ...userTypeData
          };
          if (data) {
            dispatch(fetchtaxesData(data));
          }
          setCategory("--Select Category--");
          handleClose();
        } else if (update_message == "Failed" && msg == "Title is required") {
          setErrorMessage(msg);
        } else if (update_message == "Failed" && msg == "Taxes Already Exist") {
          setErrorMessage(msg);
        }

        // Close the modal or perform any other actions
        handleClose();
      } catch (error) {
        console.error("Error submitting data:", error);
        // Handle errors as needed
        handleCoockieExpire()
        getUnAutherisedTokenMessage()
      }
      setLoader(false);
    } else {
      // Handle case when applyToCategory is false or categoryId is not selected
      // setErrorMessage("Please select a category and choose a tax option.");

      const formData = new FormData();

      // Append your tax data
      formData.append("collID", taxes.collID);
      formData.append("title", taxes.title);
      formData.append("percent", taxes.percent);
      formData.append("merchant_id", taxes.merchant_id);
      formData.append("token_id", userTypeData?.token_id);
      formData.append("login_type", userTypeData?.login_type);

      if(taxes.title === "" || taxes.percent === ""){
        setErrorTitleMessage(taxes.title ? "" : "Title is required");
        setErrorPerMessage(taxes.percent ? "" : "Percent is required");
        return;
      }
      setLoader(true);
      try {
        // Make your API request with axios
        const response = await axios.post(BASE_URL + UPDATE_TAXES, formData, {
          headers: { "Content-Type": "multipart/form-data" ,Authorization: `Bearer ${userTypeData?.token}`},
        });
        // Handle the response as needed
        const update_message = response.data.status;
        const msg = response.data.msg;
        console.log(update_message);
        if (update_message == "Success") {
          // alert(msg)
          ToastifyAlert(msg, "success");
          let data = {
            merchant_id: merchant_id,
            ...userTypeData
          };
          if (data) {
            dispatch(fetchtaxesData(data));
          }
          setCategory("--Select Category--");
          handleClose();
        } else if (update_message == "Failed" && msg == "Title is required") {
          setErrorMessage(msg);
        } else if (update_message == "Failed" && msg == "Taxes Already Exist") {
          setErrorMessage(msg);
        }

        // Close the modal or perform any other actions
      } catch (error) {
        console.error("Error submitting data:", error);
        handleCoockieExpire()
        getUnAutherisedTokenMessage()
        // Handle errors as needed
      }
      setLoader(false);
    }
  };

  // for Apply tax to category
  const [applyToCategory, setApplyToCategory] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  const [updateTax, setUpdateTax] = useState(false);

  const [categoryOptions, setCategoryOptions] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const formData = new FormData();
      formData.append("merchant_id", merchant_id);
      formData.append("token_id", userTypeData?.token_id);
      formData.append("login_type", userTypeData?.login_type);
      try {
        const response = await axios.post(
          BASE_URL + TAXE_CATEGORY_LIST, formData,
          { headers: { "Content-Type": "multipart/form-data",Authorization: `Bearer ${userTypeData?.token}` } }
        );

        // Assuming the API response has a data property containing the category list
        const categoryList = response.data.result;
        // Extracting category IDs and view titles
        const mappedOptions = categoryList.map((category) => ({
          id: category.id,
          title: category.title,
        }));

        setCategoryOptions(mappedOptions);
        setLoadingCategories(false);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setLoadingCategories(false);
        handleCoockieExpire()
        getUnAutherisedTokenMessage()
      }
    };

    fetchData();
  }, []); // Fetch categories only once when the component mounts

  // for dropdown start

  const [category, setCategory] = useState("--Select Category--");
  const [categoryDropdownVisible, setCategoryDropdownVisible] = useState(false);
  const [storeToError, setStoreToError] = useState("");

  const toggleDropdown = (dropdown) => {
    switch (dropdown) {
      case "category":
        setCategoryDropdownVisible(!categoryDropdownVisible);
        break;

      default:
        break;
    }
  };

  const handleOptionClick = async (option, dropdown) => {
    switch (dropdown) {
      case "category":
        if (option === "--Select Category--") {
          setCategory("--Select Category--");
          setCategoryDropdownVisible(false);
        } else {
          setCategory(option.title);
          setCategoryDropdownVisible(false);
        }
        if (option == "--Select Category--") {
          setStoreToError("This field is required");
          setSelectedCategory("");
        } else {
          setStoreToError("");
          const selId = option.id;
          setSelectedCategory(selId);
        }
        break;

      default:
        break;
    }
  };

  // for dropdown End

  return (
    <div>
      <div
        className="flex justify-evenly categories-items categories-items-btn"
        onClick={handleOpen}
      >
        <span className="categories-items categories-items-btn">
          <img src={EditIcon} alt="edit-icon" />{" "}
        </span>
      </div>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="view-category-item-modal" style={myStyles}>
          {/* <div className='view-category-item-modal-header'> */}
          <div className="q-add-categories-section-header" style={{justifyContent:"space-between"}}>
          
              <span style={{cursor:"unset"}}>Edit Tax</span>
            
            <div className="float-right">
              <img src={CrossIcon} alt="icon" className="quic-btn-cancle w-6 h-6 cursor-pointer" onClick={() => handleClose()} />
              </div>
          </div>

          {/* </div> */}
          <div className="view-category-item-modal-header">
            <form onSubmit={handleSubmit} enctype="multipart/form-data">
              <div className="q-add-categories-section-middle-form">
                {taxes.title === "DefaultTax" ? (
                  <>
                    <div className="q-add-categories-single-input">
                      <label for="title">Title</label>

                      {/* <input
                        type="text"
                        id="title"
                        name="title"
                        value={taxes.title}
                        disabled
                      /> */}
                    </div>
                    <BasicTextFields
                        value={taxes.title}
                        onChangeFun={inputChange}
                        placeholder="Enter Title"
                        name="title"
                        type="text"
                        // required={true}
                        disable={true}
                      />
                    {errorMessage && (
                      <span className="error-message" >
                        {errorMessage}
                      </span>
                    )}
                    {errorTitleMessage && (
                      <p className="error-message">{errorTitleMessage}</p>
                    )}
                  </>
                ) : (
                  <>
                    <div className="q-add-categories-single-input">
                      <label for="title">Title</label>

                      {/* <input
                        type="text"
                        id="title"
                        onChange={inputChange}
                        name="title"
                        value={taxes.title}
                      /> */}
                    </div>
                    <BasicTextFields
                        value={taxes.title}
                        onChangeFun={inputChange}
                        placeholder="Enter Title"
                        name="title"
                        type="text"
                        // required={true}
                      />
                    {errorMessage && (
                      <span className="error-message" style={{ color: "red" }}>
                        {errorMessage}
                      </span>
                    )}
                    {errorTitleMessage && (
                      <p className="error-message">{errorTitleMessage}</p>
                    )}
                  </>
                )}

                <div className="q-add-categories-single-input mt-4">
                  <label for="Percentage">Percentage</label>

                  {/* <input
                    type="text"
                    id="percent"
                    maxlength="5"
                    min="0.00"
                    max="99.99"
                    name="percent"
                    value={taxes.percent}
                    placeholder="00.00"
                    onChange={inputChange}
                    onKeyPress={handleKeyPress}
                  /> */}
                </div>
                <TextField
                    id="outlined-basic"
                    name="percent"
                    value={taxes.percent}
                    inputProps={{ maxLength: 5, type: "text" }}
                    onChange={inputChange}
                    placeholder="00.00"
                    variant="outlined"
                    size="small"
                    required={true}
                    onKeyPress={handleKeyPress}
                  />
                   {errorPerMessage && (
                    <p className="error-message ">{errorPerMessage}</p>
                  )}

                <div className="category-checkmark-div m-2 mt-4 mb-4">
                  <label className="category-checkmark-label">
                    Apply tax to category
                    <input
                      type="checkbox"
                      id="applytaxtocat"
                      name="applytaxtocat"
                      checked={applyToCategory}
                      onChange={() => setApplyToCategory(!applyToCategory)}
                    />
                    <span className="category-checkmark"></span>
                  </label>
                </div>

                {applyToCategory && (
                  <>
                    <div className="q-add-categories-single-input ">
                      {loadingCategories ? (
                        <p>Loading categories...</p>
                      ) : (
                        <>
                          {/* <div className="custom-dropdown">
                            <div
                              className="custom-dropdown-header"
                              onClick={() => toggleDropdown("category")}
                            >
                              <span className="selected-option mt-1">
                                {category}
                              </span>
                              <img
                                src={DownIcon}
                                alt="Down Icon"
                                className="w-8 h-8"
                              />
                            </div>
                            {categoryDropdownVisible && (
                              <div
                                className="dropdown-content"
                                style={myDropStyles}
                              >
                                <div
                                  onClick={() =>
                                    handleOptionClick(
                                      {
                                        label: "--Select Category--",
                                        id: null,
                                      },
                                      "category"
                                    )
                                  }
                                >
                                  --Select Category--
                                </div>
                                {categoryOptions &&
                                  categoryOptions.map((option) => (
                                    <div
                                      key={option.id}
                                      onClick={() =>
                                        handleOptionClick(
                                          {
                                            label: option.title,
                                            id: option.id,
                                          },
                                          "category"
                                        )
                                      }
                                    >
                                      {option.title}
                                    </div>
                                  ))}
                              </div>
                            )}
                          </div> */}

                          <SelectDropDown
                                listItem={categoryOptions}
                                heading={"--Select Category--"}
                                title={"title"}
                                onClickHandler={handleOptionClick}
                                selectedOption={category}
                                dropdownFor={"category"}
                            />

                          <span className="input-error error-message" >
                            {storeToError && (
                              <span className="input-error ">
                                {storeToError}
                              </span>
                            )}
                          </span>
                        </>
                      )}
                    </div>

                    <div
                      className="q-add-categories-single-input mt-3 d-flex taxesApplyCategory"
                      style={{ width: "fit-content" }}
                    >
                      <label className="q_receipt_page_main ">
                        Apply additional tax to the chosen category?
                        <input
                          type="radio"
                          name="taxchoice"
                          value="0"
                          checked
                        />
                        <span className="checkmark_section"></span>
                      </label>
                      <label className="q_receipt_page_main ml-3">
                        Update the tax for the chosen category?
                        <input type="radio" name="taxchoice" value="1" />
                        <span className="checkmark_section"></span>
                      </label>
                    </div>
                  </>
                )}
              </div>

              <div className="q-add-categories-section-middle-footer">
                <button className="quic-btn quic-btn-save attributeUpdateBTN"  disabled={loader}>
                { loader ? <><CircularProgress color={"inherit"} className="loaderIcon" width={15} size={15}/> Update</> : "Update"}
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

export default EditTaxesModal;
