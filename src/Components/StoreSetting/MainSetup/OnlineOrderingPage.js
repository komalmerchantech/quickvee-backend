import { useState, useEffect } from "react";
import React from "react";
import Switch from "@mui/material/Switch";
import { useDispatch, useSelector } from "react-redux";
import { CircularProgress, Grid } from "@mui/material";

const OnlineOrderingPage = ({ onlineorderstatus,loader }) => {
  const [isEnableOrderNumber, setisEnableOrderNumber] = useState("");
  const [isChecked, setisChecked] = useState("");

  const dispatch = useDispatch();

  const handleCheckedSwitch = (e) => {
    setisChecked(e.target.checked ? "0" : "1");
    setisEnableOrderNumber(e.target.checked ? "1" : "0");
  };

  const setupDataState = useSelector(
    (state) => state?.StoreSetupList?.storesetupData
  );
  console.log("isChecked", isChecked);
  useEffect(() => {
    if (setupDataState?.offline) {
      setisChecked(setupDataState?.offline);
      setisEnableOrderNumber(setupDataState?.offline ==="0" ? "1" : "0");
    }
  }, [setupDataState]);
  useEffect(() => {
    // console.log(setupDataState?.clover_customer_id)
    onlineorderstatus(isEnableOrderNumber);
  }, [setupDataState, isEnableOrderNumber]);

  return (
    <>
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ p: 2.5 }}
        className="box_shadow_div"
      >
        <Grid item>
          <Grid container>
            <Grid item xs={12}>
              <h5 style={{ marginBottom: 0 }} className="box_shadow_heading">
                Online Ordering
              </h5>
            </Grid>
          </Grid>
          {/* <Grid container>
            <Grid item xs={12}>
              <label className="text-[12px]">
                Select Default Image if in case some color image is not
                available.
              </label>
            </Grid>
          </Grid> */}
        </Grid>
        <Grid item>
          <div className="fr">
            {loader ? (
              <CircularProgress width={20} size={20} />
            ) : (
              <Switch
                // {...label}
                name="cost_method"
                checked={isChecked === "0"}
                onChange={handleCheckedSwitch}
              />
            )}
          </div>
        </Grid>
      </Grid>
    </>
  );
};

export default OnlineOrderingPage;
