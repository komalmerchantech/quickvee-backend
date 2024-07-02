import React, { useState } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import { useDispatch } from "react-redux";
import { editAttribute } from "../../Redux/features/Attributes/attributesSlice";
import CrossIcon from "../../Assests/Dashboard/cross.svg";
import { BASE_URL, ADD_ATTRIBUTE } from "../../Constants/Config";
import EditIcon from "../../Assests/Category/editIcon.svg";
import BasicTextFields from "../../reuseableComponents/TextInputField";
import { Box, Modal } from "@mui/material";
import { useAuthDetails } from "../../Common/cookiesHelper";
import { ToastifyAlert } from "../../CommonComponents/ToastifyAlert";
import CircularProgress from "@mui/material/CircularProgress";

const EditDeliveryAddress = ({ attribute, allattributes }) => {
  const [nameExists, setNameExists] = useState("");
  const [old_title, setold_title] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [newAttribute, setNewAttribute] = useState("");
  const [submitmessage, setsubmitmessage] = useState("");

  const { LoginGetDashBoardRecordJson, LoginAllStore, userTypeData } =
    useAuthDetails();
  let AuthDecryptDataDashBoardJSONFormat = LoginGetDashBoardRecordJson;
  const merchant_id = AuthDecryptDataDashBoardJSONFormat?.data?.merchant_id;
  const openModal = () => {
    setShowModal(true);
    setNewAttribute(attribute.title);
    setold_title(attribute.title);
    setErrorMessage("");
  };

  const closeModal = () => {
    setShowModal(false);
  };
  const [loader, setLoader] = useState(false);

  const dispatch = useDispatch();
  const changeTittleHandler = (event) => {
    const inputValue = event.target.value;
    const regex = /^[A-Za-z0-9 ]*$/;
    const space = /^(?!\s).*/;
    if(space.test(inputValue)){
      if (regex.test(inputValue) || inputValue === "" ) {
        setNewAttribute(inputValue);
        const nameExists = allattributes.some((item) => item.title === inputValue && item.id !== attribute.id);
        if (nameExists) {
          setErrorMessage("Attribute name already exists");
          setNameExists(true);
        } else {
          setErrorMessage("");
          setNameExists(false);
        }
      }else{
        setErrorMessage("Special characters are not allowed");
      }
    }
  };
  const handleEditAttribute = async () => {
    if (nameExists) {
      return false;
    }
    if (!newAttribute.trim()) {
      setErrorMessage("Title is required");
      return;
    }
    const editItem = {
      merchant_id: merchant_id,
      varient_id: attribute.id,
      title: newAttribute,
      old_title: attribute.title,
      token_id: userTypeData?.token_id,
      login_type: userTypeData?.login_type,
    };
    const data = editItem;
    console.log(data);
    setLoader(true);
    const response = await axios.post(BASE_URL + ADD_ATTRIBUTE, editItem, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${userTypeData?.token}`,
      },
    });
    if (response) {
      dispatch(editAttribute({ id: attribute.id, title: newAttribute }));
      ToastifyAlert("Updated Successfully", "success");
      setShowModal(false);
    } else {
      setsubmitmessage(response.data.message);
    }
    setLoader(false);
  };

  setTimeout(() => {
    setsubmitmessage("");
  }, 4000);

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

  return (
    <>
      <div>
        <Button
          className="modal-main-button edit-delivery-address-button attributeEdit_BTN"
          onClick={openModal}
        >
          {/* <img src={Edit}  alt="edit" /> */}
          <img src={EditIcon} alt="" className="" />
        </Button>
        {/* {showModal && (
          <Modal
          open={showModal}
          onClose={closeModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
      >
          <div className="q-custom-modal-container" id="addtributes_">
            <div className="q-custom-modal-content" style={{height:"max-content",top:"unset"}}>
              <div className="q-custom-modal-header">
                  <div className="mt_card_header q_dashbaord_netsales">
                    <h1 className="">Update Attribute</h1>
                  </div>
                  <img src={CrossIcon} alt="icon" className="ml-auto mb-4 cursor-pointer" onClick={closeModal} />
              </div>
                <div className="my-2">
                  <div className="border-b border-[#ccc]"></div>
                </div>
              <div className="title_attributes_section">
              <label className="mb-2">Title</label>
              <BasicTextFields
                    value={newAttribute}
                    onChangeFun={changeTittleHandler}
                    placeholder="Enter attribute title"
                  />
              <span className="input-error">
                {errorMessage !== "" ? errorMessage : ""}
              </span>
              </div>
              <div className='q-add-categories-section-middle-footer'>
                <button onClick={(handleEditAttribute)} className='quic-btn quic-btn-save'>
                  Update
                </button>
                <button onClick={(closeModal)} className='quic-btn quic-btn-cancle'>
                  Cancel
                </button>
              </div>
            </div>
          </div>
          </Modal>
        )} */}

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
              <span style={{ cursor: "unset" }}>Update Attribute</span>

              <div>
                <img
                  src={CrossIcon}
                  alt="icon"
                  className="  quic-btn-cancle w-6 h-6 cursor-pointer"
                  onClick={() => handleClose()}
                />
              </div>
            </div>

            <div className="view-category-item-modal-header">
              <div
                className="title_attributes_section"
                style={{ margin: "1rem 1rem" }}
              >
                <label className="mb-2">Title</label>
                <BasicTextFields
                  value={newAttribute}
                  onChangeFun={changeTittleHandler}
                  placeholder="Enter attribute title"
                  maxLength={35}
                />
                <span className="input-error">
                  {errorMessage !== "" ? errorMessage : ""}
                </span>
              </div>
            </div>

            <div className="q-add-categories-section-middle-footer">
              <button
                onClick={handleEditAttribute}
                className="quic-btn quic-btn-save attributeUpdateBTN"
                disabled={loader}
              >
                { loader ? <><CircularProgress color={"inherit"} className="loaderIcon" width={15} size={15}/> Update</> : "Update"}
                {/* Update */}
              </button>
              <button onClick={closeModal} className="quic-btn quic-btn-cancle">
                Cancel
              </button>
            </div>
          </Box>
        </Modal>
      </div>
    </>
  );
};
export default EditDeliveryAddress;
