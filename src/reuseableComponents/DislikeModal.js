import React, { useState, forwardRef } from "react";
import { Box, Modal } from "@mui/material";
import DeleteIcon from "../Assests/Category/deleteIcon.svg";
import Slide from "@mui/material/Slide";
import Dislike from "../Assests/ModalImages/dislike.svg"
import Like from "../Assests/ModalImages/like.svg"

const DislikeModal = ({ headerText, otherMSG, open, onClose, onConfirm }) => {
  const myStyles = {
    width: "45vh",
    position: "absolute",
    top: "40%",
    left: "40%",
    transform: "translate(-50%, -50%)",
    fontFamily: "'CircularSTDMedium', sans-serif !important",
  };

  const imageDisplay = (headerText) => {
    switch (headerText) {
      case "Are you sure you want to approve this store":
        return Like;
      case "Are you sure you want to Disapprove this store":
        return Dislike;
      default:
        return DeleteIcon;
    }
  };
  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        aria-describedby="alert-dialog-slide-description"
        className="delete-modal-outer-div"
        closeAfterTransition
      >
        <Slide direction="down" in={open} mountOnEnter unmountOnExit>
          <Box className="delete-Box-modal" style={myStyles}>
            <div className="delete-modal">
              <div className="delete-modal-content">
                <img src={imageDisplay(headerText)} alt={`Delete-icon`} loading="lazy"  />
                <span>
                  {headerText ? headerText : ""} ? {otherMSG ? <><br/>{otherMSG}</> :""}
                </span>
              </div>
              <div className="delete-modal-button">
                <button onClick={onClose}>Cancel</button>
                <button
                  onClick={onConfirm}
                  style={{ background: " #FF4040", color: "#fff" }}
                >
                  Ok
                </button>
              </div>
            </div>
          </Box>
        </Slide>
      </Modal>
    </>
  );
};

export default DislikeModal;
