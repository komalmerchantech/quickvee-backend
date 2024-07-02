import React, { useState, useEffect, useRef } from "react";
import AddNewCategory from "../../Assests/Taxes/Left.svg";
import axios from "axios";

import Upload from "../../Assests/Category/upload.svg";

import {
  BASE_URL,
  EDIT_CATOGRY_DATA,
  UPDATE_CATOGRY,
} from "../../Constants/Config";

import { Link, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { deleteCategorybanner } from "../../Redux/features/Categories/categoriesSlice";
import DeleteIcon from "../../Assests/Category/deleteIcon.svg";
import { ToastifyAlert } from "../../CommonComponents/ToastifyAlert";
import { useNavigate } from "react-router-dom";
import { useAuthDetails } from "../../Common/cookiesHelper";
import DeleteModal from "../../reuseableComponents/DeleteModal";
import AlertModal from "../../reuseableComponents/AlertModal";
import CircularProgress from "@mui/material/CircularProgress";
import PasswordShow from "../../Common/passwordShow";
const EditCategory = ({ productId,seVisible }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    LoginGetDashBoardRecordJson,
    LoginAllStore,
    userTypeData,
    GetSessionLogin,
  } = useAuthDetails();
  const [loader, setLoader] = useState(false);
  const {handleCoockieExpire,getUnAutherisedTokenMessage}=PasswordShow()
  const [category, setCategory] = useState({
    collID: "",
    title: "",
    description: "",
    merchant_id: "",
    show_online: "",
    use_point: "",
    earn_point: "",
    image: "",
  });
  let merchant_id = LoginGetDashBoardRecordJson?.data?.merchant_id;
  const params = useParams();
  async function fetchData() {
    const getcategoryData = {
      merchant_id: merchant_id,
      id: params?.categoryCode,
      ...userTypeData,
    };

    try {
      const { token, ...dataNew } = getcategoryData;
      const response = await axios.post(BASE_URL + EDIT_CATOGRY_DATA, dataNew, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status === true) {
        // console.log(response.data.result)
        return response.data.result;
      }
    } catch (error) {
      console.error("Error:", error);
      handleCoockieExpire()
      getUnAutherisedTokenMessage()
    }
  }

  useEffect(() => {
    // Fetch data when the component mounts
    const fetchDataAndUpdateState = async () => {
      const res = await fetchData();

      if (res) {
        // Update the state with the fetched data
        setCategory({
          collID: res[0].id,
          title: res[0].title,
          description: res[0].description,
          merchant_id: res[0].merchant_id,
          show_online: res[0].show_online === "1" ? 1 : 0,
          use_point:
            res[0].use_point === "1" ? 1 : res[0].use_point === "0" ? 0 : 0,
          earn_point:
            res[0].earn_point === "1" ? 1 : res[0].earn_point === "0" ? 0 : 0,
          image: res[0].categoryBanner, // Assuming you don't want to pre-fill the image field
        });
      }
    };

    fetchDataAndUpdateState();
  }, [params.categoryCode]); // Make sure to include params.categoryCode in the dependency array

  const inputChange = (e) => {
    const { name, value } = e.target;
    const regex = /^[A-Za-z0-9 ]*$/ ;
    if (name === "title"){
      if (regex.test(value)) {
        setCategory({ ...category, title: value });
      }
    }else{
      setCategory((preValue) => {
        return {
          ...preValue,
          [name]: value,
        };
      });
    }
  };

  const [selectedImage, setSelectedImage] = useState(null);
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [alertModalHeaderText, setAlertModalHeaderText] = useState("");

  const showModal = (headerText) => {
    setAlertModalHeaderText(headerText);
    setAlertModalOpen(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;
      if (!allowedExtensions.exec(file.name)) {
        // alert(
        //   file.name +
        //     " is not an image. Only jpeg, png, jpg files can be uploaded."
        // );
        // showModal(
        //   file.name +
        //     " is not an image. Only jpeg, png, jpg files can be uploaded."
        // );
        showModal("Only jpeg, png, jpg files can be uploaded")
      } else {
        const reader = new FileReader();
        reader.onloadend = () => {
          setSelectedImage(reader.result);
          setCategory((prevValue) => ({
            ...prevValue,
            image: {
              file: file,
              base64: reader.result,
            },
          }));
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("collID", category.collID);
    formData.append("title", category.title);
    formData.append("description", category.description);
    formData.append("merchant_id", category.merchant_id);
    formData.append("show_online", category.show_online);
    formData.append("use_point", category.use_point);
    formData.append("earn_point", category.earn_point);
    formData.append("token_id", userTypeData?.token_id);
    formData.append("login_type", userTypeData?.login_type);

    if (category.image && category.image.base64) {
      formData.append("image", category.image.base64);
      formData.append("filename", category.image.file.name);
    } else {
      formData.append("image", "");
      formData.append("filename", "");
    }
    setLoader(true);
    try {
      const res = await axios.post(BASE_URL + UPDATE_CATOGRY, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${userTypeData?.token}`,
        },
      });

      const data = await res.data.status;
      const update_message = await res.data.update_message;
      if (data == "Success") {
        // alert(update_message);
        ToastifyAlert("Updated Successfully", "success");
        setErrorMessage(" ");
        let data = {
          merchant_id: merchant_id,
        };
        setSelectedImage(null);
        navigate("/inventory/category");
      } else if (data == "Failed" && update_message == "*Please enter title") {
        setErrorMessage(update_message);
      } else if (
        data == "Failed" &&
        update_message == "Category Title Already Exist!"
      ) {
        setErrorMessage(update_message);
      } else if (
        data == "Failed" &&
        update_message == "Category ID Not Found"
      ) {
        setErrorMessage(update_message);
      } else if (data == "Failed" && update_message == "Category Not Found") {
        setErrorMessage(update_message);
      }
    } catch (error) {
      console.error("API Error:", error);
      handleCoockieExpire()
      getUnAutherisedTokenMessage()
    }
    setLoader(false);
  };

  const [errorMessage, setErrorMessage] = useState("");
  const myStyles = {
    display: "flex",
  };

  const renderRemoveBannerButton = () => {
    if (selectedImage || (category && category.image)) {
      return (
        <>
          <div className="add-category-checkmark-div">
            <label className="add-category-checkmark-label mt-2">
              Show Online ?
              <input
                type="checkbox"
                defaultChecked={category.show_online === 1}
                onChange={(e) =>
                  setCategory((prevValue) => ({
                    ...prevValue,
                    show_online: e.target.checked ? 1 : 0,
                  }))
                }
              />
              <span className="add-category-checkmark"></span>
            </label>
          </div>
        </>
      );
    }
    return null;
  };

  // const handleRemoveBanner = (event, id, removeitem) => {
  //   event.stopPropagation();
  //   const data = {
  //     id: id,
  //     merchant_id,
  //     removeitem: removeitem,
  //     ...userTypeData,
  //   };
  //   const userConfirmed = window.confirm(
  //     "Are you sure you want to delete this Category Image ?"
  //   );
  //   if (userConfirmed) {
  //     if (id) {
  //       dispatch(deleteCategorybanner(data));
  //       ToastifyAlert("Category Image Deleted", "success");
  //       setSelectedImage(null);
  //       setCategory((prevValue) => ({
  //         ...prevValue,
  //         image: "",
  //       }));
  //     }
  //   } else {
  //     event.preventDefault();
  //     setCategory((prevValue) => ({
  //       ...prevValue,
  //       image: category.image,
  //     }));
  //     console.log("Deletion canceled by user");
  //   }
  // };

  const [deleteCategoryId, setDeleteCategoryId] = useState(null);
  const [deleteCategoryIMG, setDeleteCategoryIMG] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const handleRemoveBanner = (event, id, removeitem) => {
    event.stopPropagation();
    setDeleteCategoryId(id);
    setDeleteCategoryIMG(removeitem);
    setDeleteModalOpen(true);
  };
  const confirmDeleteCategory = async (event) => {
    if (deleteCategoryId) {
      const data = {
        id: deleteCategoryId,
        merchant_id,
        removeitem: deleteCategoryIMG,
        ...userTypeData,
      };
      if (data) {
        try {
         await dispatch(deleteCategorybanner(data)).unwrap();
        } catch (error) {
          handleCoockieExpire()
          getUnAutherisedTokenMessage()
        }
        ToastifyAlert("Category Image Deleted", "success");
        setSelectedImage(null);
        setCategory((prevValue) => ({
          ...prevValue,
          image: "",
        }));
      } else {
        event.preventDefault();
        setCategory((prevValue) => ({
          ...prevValue,
          image: category.image,
        }));
        console.log("Deletion canceled by user");
      }
    }
    setDeleteCategoryId(null);
    setDeleteCategoryIMG(null);
    setDeleteModalOpen(false);
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
        setSelectedImage(reader.result);
        setCategory((prevValue) => ({
          ...prevValue,
          image: {
            file: file,
            base64: reader.result,
          },
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImage = (e) => {
    const fileInput = document.getElementById("filesBanner");
    if (fileInput) {
        fileInput.value = "";
    }
    e.stopPropagation();
    setCategory((prevValue) => ({
      ...prevValue,
      image: {
        file: null,
        base64: null,
      },
    }));
  };
  const back = () => {
    navigate("/inventory/category");
  }

  return (
    <div className="q-category-main-page">
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

        <div className="q-add-categories-section">
          <form>
            <div className="q-add-categories-section-header">
              <span   onClick={back}>
                <span style={myStyles}>
                  <img src={AddNewCategory} alt="Add-New-Category" />
                  <span >Edit Category</span>
                </span>
              </span>
            </div>
            <div className="q-add-categories-section-middle-form">
              <div className="q-add-categories-single-input">
                <label for="title">Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={category.title}
                  onChange={inputChange}
                />
              </div>
              {errorMessage && (
                <span className="error-message" style={{ color: "red" }}>
                  {errorMessage}
                </span>
              )}

              <div className="q-add-categories-single-input">
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
                className={`h-1/2  h-[100px] flex items-center justify-center border-2 border-dashed border-[#BFBFBF] bg-white rounded-lg mt-2 defaultDrag_div`}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={openFileInput}
                style={{
                  cursor: "pointer",
                  position: "relative",
                  height: "auto",
                  padding: "10px",
                  height: "260px",
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
                        height: "320px",
                        objectFit: "contain",
                        width: "100%",
                      }}
                    />
                  </>
                ) : (
                  <>
                    {category.image && category.image.length > 0 ? (
                      <div className="flex-column">
                        <img
                          src={`${BASE_URL}/upload/banner/category_banners/${category.merchant_id}/${category.image}`}
                          alt="Default"
                          className="default-img"
                          style={{
                            height: "320px",
                            objectFit: "contain",
                            width: "100%",
                          }}
                        />
                        <span
                          className="delete-image-icon img-DeleteIcon"
                          // onClick={handleDeleteImage}
                          onClick={(event) =>
                            handleRemoveBanner(
                              event,
                              category.collID,
                              category.image
                            )
                          }
                          style={{
                            position: "absolute",
                            top: "7px",
                            right: "7px",
                          }}
                        >
                          <img src={DeleteIcon} alt="delete-icon" />
                        </span>
                      </div>
                    ) : (
                      <div className="flex-column">
                        <img
                          src={Upload}
                          style={{ transform: "translate(2.5rem, 0px)" }}
                          alt="Default"
                        />
                        <span>Category Image</span>
                      </div>
                    )}
                  </>
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
                {renderRemoveBannerButton()}
                <div className="add-category-checkmark-div">
                  <label className="add-category-checkmark-label mt-2">
                    Use Loyalty Point ?
                    <input
                      type="checkbox"
                      checked={category.use_point === 1}
                      onChange={(e) =>
                        setCategory((prevValue) => ({
                          ...prevValue,
                          use_point: e.target.checked ? 1 : 0,
                        }))
                      }
                    />
                    <span className="add-category-checkmark"></span>
                  </label>
                </div>
                <div className="add-category-checkmark-div">
                  <label className="add-category-checkmark-label mt-2">
                    Earn Loyalty Point ?
                    <input
                      type="checkbox"
                      checked={category.earn_point === 1}
                      onChange={(e) =>
                        setCategory((prevValue) => ({
                          ...prevValue,
                          earn_point: e.target.checked ? 1 : 0,
                        }))
                      }
                    />
                    <span className="add-category-checkmark"></span>
                  </label>
                </div>
              </div>
            </div>

            <div className="q-add-categories-section-middle-footer">
              <button className="quic-btn quic-btn-save attributeUpdateBTN" onClick={handleSubmit} disabled={loader}>
                 { loader ? <><CircularProgress color={"inherit"} className="loaderIcon" width={15} size={15}/> Save</> : "Save"}
              </button>

                <button className="quic-btn quic-btn-cancle"  onClick={back}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
      <DeleteModal
        headerText="Category"
        open={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
        }}
        onConfirm={confirmDeleteCategory}
      />
      <AlertModal
        headerText={alertModalHeaderText}
        open={alertModalOpen}
        onClose={() => {
          setAlertModalOpen(false);
        }}
      />
    </div>
  );
};

export default EditCategory;
