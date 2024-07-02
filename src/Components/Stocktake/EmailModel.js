import { Box } from "@mui/system";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "@mui/material/Modal";
import CrossIcon from "../../Assests/Dashboard/cross.svg";
import { CircularProgress, Grid } from "@mui/material";
import BasicTextFields from "../../reuseableComponents/TextInputField";
import { useAuthDetails } from "../../Common/cookiesHelper";
import axios from "axios";
import { BASE_URL } from "../../Constants/Config";
import { ToastifyAlert } from "../../CommonComponents/ToastifyAlert";
const myStyles = {
  width: "60%",
  position: "absolute",
  top: "47%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  fontFamily: "'CircularSTDMedium', sans-serif !important",
};

const EmailModel = ({singleStocktakeState}) => {
  const { LoginGetDashBoardRecordJson, userTypeData } = useAuthDetails();
  let AuthDecryptDataDashBoardJSONFormat = LoginGetDashBoardRecordJson;
  const merchant_id = AuthDecryptDataDashBoardJSONFormat?.data?.merchant_id;
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [email, setEmail] = useState("");
  const [loader, setLoader] = useState(false);
  const [emailError, setEmailError] = useState("");
  const handleClick = () => {
    handleOpen(true);
  };
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };
  const handleEmailOnChange = (e) => {
    const { value } = e.target;
    setEmail(value);

    // Validate email and set error message if invalid
    if (value && !validateEmail(value)) {
      setEmailError("Please enter a valid email address.");
    } else {
      setEmailError(""); // Clear error message if email is valid
    }
  };
  const handleSendEmail = async () => {
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    const data = {
      email,
      stocktake_id:singleStocktakeState.id,
      merchant_id,
    };
    try {
      setLoader(true)
      const { token, ...otherUserData } = userTypeData;
      const response = await axios.post(
        BASE_URL + "Stocktake_react_api/email_stocktake",
        { ...data, ...otherUserData },
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status===200) {
        ToastifyAlert("Email send successfully", "success");
        setLoader(false)
      } else {
        ToastifyAlert(response.data.message, "error");
        setLoader(false)
      }
    } catch (error) {
      console.error("Error creating stocktake:", error);
      ToastifyAlert(error.message, "error");
      setLoader(false)
    }
    // Handle send email action here
    console.log("Email sent to:", email);
    setEmail()
    handleClose();
  };
  return (
    <>
      <div>
        <span
          className="categories-items categories-items-btn "
          onClick={handleClick}
        >
          <button
            onClick={() => {
              // handleCreateStocktake("1");
            }}
            className="quic-btn quic-btn-save w-32"
          >
            Email
          </button>
        </span>
        <Modal
          open={open}
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
              <p className="">Send Email</p>
              <div>
                <div
                  className="flex justify-between gap-4"
                  style={{ cursor: "pointer" }}
                >
                  <img
                    src={CrossIcon}
                    alt="icon"
                    className="  quic-btn-cancle w-6 h-6"
                    onClick={() => handleClose()}
                  />
                </div>
              </div>
            </div>
            <Grid container>
              <Grid item sx={{ p: 2.5 }} xs={12}>
                Enter Email
                <BasicTextFields
                  value={email}
                  onChangeFun={handleEmailOnChange}
                  type={"email"}
                  sx={{ pt: 0.5 }}
                />
                {emailError && <p className="error">{emailError}</p>}
              </Grid>
            </Grid>
            <Grid container>
              <Grid xs={12}>
                <Grid
                  container
                  direction="row"
                  justifyContent="flex-end"
                  alignItems="center"
                  sx={{ px: 2.5, pb: 2.5 }}
                >
                  <Grid item sx={{ px: 2.5 }}>
                    <button
                      onClick={handleClose}
                      className="quic-btn quic-btn-cancle"
                    >
                      Cancel
                    </button>
                  </Grid>
                  <Grid item>
                    <button
                      onClick={handleSendEmail}
                      className="quic-btn quic-btn-save w-44"
                      disabled={loader}
                    >
                      {loader  ? (
                    <CircularProgress
                      color={"inherit"}
                      className=""
                      width={15}
                      size={15}
                    />
                  ) : (
                    "Send Email"
                  )}
                      
                    </button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Modal>
      </div>
    </>
  );
};

export default EmailModel;
