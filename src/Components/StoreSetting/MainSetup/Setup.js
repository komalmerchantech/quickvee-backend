import React, { useState, useEffect, useRef } from "react";
import OnlineOrderingPage from "./OnlineOrderingPage";
import StoreWorkingHrs from "./StoreWorkingHrs";
import PickupDeliveryDetails from "./PickupDeliveryDetails";
import FlatDelivery from "./FlatDelivery";
import DelveryPickupDetails from "./DelveryPickupDetails";
import { useDispatch } from "react-redux";
import { fetchStoreSettingSetupData } from "../../../Redux/features/SettingSetup/SettingSetupSlice";
import { Grid } from "@mui/material";
import axios from "axios";
import {
  BASE_URL,
  UPDATE_RECEIPT_INFO_DATA,
  UPDATE_STORE_SETUP,
} from "../../../Constants/Config";
import { fetchSettingReceiptData } from "../../../Redux/features/StoreSettings/SettingsReceipt/SettingsReceiptSlice";
import { useAuthDetails } from "../../../Common/cookiesHelper";
import { ToastifyAlert } from "../../../CommonComponents/ToastifyAlert";
import AlertModal from "../../../reuseableComponents/AlertModal";
import PasswordShow from "../../../Common/passwordShow";
const Setup = () => {
  // const [updateDetails, setUpdateDetails] = useState(true);
  const { handleCoockieExpire, getUnAutherisedTokenMessage } = PasswordShow();
  const [OnlineOrderStatus, setOnlineOrderStatus] = useState("");
  const [EnableOrderNumber, setEnableOrderNumber] = useState("");
  const [MinPickData, setMinPickData] = useState("");
  const [MaxPickData, setMaxPickData] = useState("");
  const [convData, setconvData] = useState("");
  const [DelEnbale, setDelEnbale] = useState("");
  const [MinAmtdel, setMinAmtdel] = useState("");
  const [rateDel, setrateDel] = useState("");
  const [MinDelData, setMinDelData] = useState("");
  const [MaxDelData, setMaxDelData] = useState("");
  const [conepikData, setconepikData] = useState("");
  const [FeeData, setFeeData] = useState("");
  const [delChange, setdelChange] = useState("");
  const [delRates, setdelRates] = useState("");
  const [delpickData, setdelpickData] = useState("");
  const [pickDefTip, setpickDefTip] = useState("");
  const [delDefTip, setdelDefTip] = useState("");
  const [days, setDays] = useState([]);
  const [lastCloseTimeState, setLastCloseTimeState] = useState(true);
  const dispatch = useDispatch();
  const { LoginGetDashBoardRecordJson, userTypeData,user_id } = useAuthDetails();
  let AuthDecryptDataDashBoardJSONFormat = LoginGetDashBoardRecordJson;
  const merchant_id = AuthDecryptDataDashBoardJSONFormat?.data?.merchant_id;
  const data = {
    merchant_id: merchant_id,
  };

  const pickupDeliveryDetailsRef = useRef();

  const [errors, setErrors] = useState({
    minDeliveryTimeError: "",
    maxDeliveryTimeError: "",
    minPickupTimeError: "",
    maxPickupTimeError: "",
  });

  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [alertModalHeaderText, setAlertModalHeaderText] = useState("");

  const showModal = (headerText) => {
    setAlertModalHeaderText(headerText);
    setAlertModalOpen(true);
  };

  useEffect(() => {
    dispatch(fetchStoreSettingSetupData(data));
  }, []);

  const handleonlineorderstatus = (onlinestatus) => {
    setOnlineOrderStatus(onlinestatus);
  };
  const handlepickupdeliverydata = (
    OdrNumData,
    MinPickData,
    MaxPickData,
    convData,
    DelEnbale,
    MinAmtdel,
    rateDel,
    MinDelData,
    MaxDelData,
    conepikData
  ) => {
    setEnableOrderNumber(OdrNumData);
    setMinPickData(MinPickData);
    setMaxPickData(MaxPickData);
    setconvData(convData);
    setDelEnbale(DelEnbale);
    setMinAmtdel(MinAmtdel);
    setrateDel(rateDel);
    setMinDelData(MinDelData);
    setMaxDelData(MaxDelData);
    setconepikData(conepikData);
  };

  const handleDeliveryFeeData = (FeeData, delChange, delRates) => {
    setFeeData(FeeData);
    setdelChange(delChange);
    setdelRates(delRates);
  };

  const handleDeliveryPickupData = (delpickData, pickDefTip, delDefTip) => {
    setdelpickData(delpickData);
    setpickDefTip(pickDefTip);
    setdelDefTip(delDefTip);
  };

  const handleUpdateClick = async (e) => {
    if (lastCloseTimeState === false) {
      showModal("End time cannot be empty");
      return;
    }

    const {
      minDeliveryTimeError,
      maxDeliveryTimeError,
      minPickupTimeError,
      maxPickupTimeError,
    } = errors;

    const errorFree = [
      minDeliveryTimeError,
      maxDeliveryTimeError,
      minPickupTimeError,
      maxPickupTimeError,
    ].every((error) => error === "");

    // console.log("pickupDeliveryDetailsRef: ", pickupDeliveryDetailsRef);

    if (!errorFree) {
      pickupDeliveryDetailsRef.current.scrollIntoView({
        behavior: "smooth",
      });
      return;
    }

    e.preventDefault();

    const FormData = {
      merchant_id: merchant_id, //
      user_id: user_id, //
      enable_online_order: OnlineOrderStatus,
      is_pickup: EnableOrderNumber, //
      is_deliver: DelEnbale, //
      pickup_min_time: MinPickData, //
      pickup_max_time: MaxPickData, //
      deliver_min_time: MinDelData, //
      deliver_max_time: MaxDelData, //
      min_delivery_amt: MinAmtdel, //
      max_delivery_radius: rateDel, //
      cf_pik_price: convData, //
      cf_del_price: conepikData, //
      float_fee: FeeData, //
      delivery_fee: delChange, //
      rate_per_miles: delRates, //
      enable_tip: delpickData, //
      default_tip_pickup: pickDefTip, //
      default_tip_delivery: delDefTip, //
      day_data: JSON.stringify(days),
    };
    try {
      const { token, ...otherUserData } = userTypeData;
      const response = await axios.post(
        BASE_URL + UPDATE_STORE_SETUP,
        { ...FormData, ...otherUserData },
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      if (response.data.status === true) {
        ToastifyAlert(response.data.msg, "success");

        let merchantdata = {
          merchant_id: merchant_id,
        };
        if (merchantdata) {
          dispatch(fetchSettingReceiptData(merchantdata));
        }
      } else {
        ToastifyAlert(response.data.msg, "unsuccess");
      }
    } catch (error) {
      getUnAutherisedTokenMessage();
      handleCoockieExpire();
    }
  };

  return (
    <>
      <OnlineOrderingPage onlineorderstatus={handleonlineorderstatus} />

      <StoreWorkingHrs
        days={days}
        setDays={setDays}
        setLastCloseTimeState={setLastCloseTimeState}
      />

      <PickupDeliveryDetails
        pickupdeliverydata={handlepickupdeliverydata}
        errors={errors}
        setErrors={setErrors}
        pickupDeliveryDetailsRef={pickupDeliveryDetailsRef}
      />

      <FlatDelivery DeliveryFeeData={handleDeliveryFeeData} />

      <DelveryPickupDetails DeliveryPickupData={handleDeliveryPickupData} />

      <Grid
        container
        direction="row"
        justifyContent="flex-end"
        alignItems="center"
        sx={{ pb: 2.5 }}
      >
        <Grid item>
          <button class="quic-btn quic-btn-save" onClick={handleUpdateClick}>
            Update
          </button>
        </Grid>
      </Grid>
      {/* <div className="">
        <div class="q-add-categories-section-middle-footer">
          <div class="q-category-bottom-header" style={{ marginRight: "67px" }}>
            <button class="quic-btn quic-btn-save" onClick={handleUpdateClick}>
              Update
            </button>

            <button class="quic-btn quic-btn-cancle">Cancel</button>
          </div>
        </div>
      </div> */}
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

export default Setup;
