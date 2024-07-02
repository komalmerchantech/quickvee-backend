import React, { useEffect, useState } from "react";
import { fetchPaymentMethodReportData } from "../../../Redux/features/PaymentMethodReport/PaymentMethodSlice";

import { useSelector, useDispatch } from "react-redux";

import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Grid } from "@mui/material";
import { priceFormate } from "../../../hooks/priceFormate";
import PasswordShow from "../../../Common/passwordShow";
import { getAuthInvalidMessage } from "../../../Redux/features/Authentication/loginSlice";
const StyledTable = styled(Table)(({ theme }) => ({
  padding: 2, // Adjust padding as needed
}));
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#253338",
    color: theme.palette.common.white,
    fontFamily: "CircularSTDBook !important",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    fontFamily: "CircularSTDMedium",
  },
  [`&.${tableCellClasses.table}`]: {
    fontSize: 14,
    fontFamily: "CircularSTDMedium",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    // backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    backgroundColor: "#F5F5F5",
  },
}));

const PaymentMethodList = ({ data }) => {
  console.log("PaymentMethodList", data);
  const dispatch = useDispatch();
  const { handleCoockieExpire, getUnAutherisedTokenMessage } = PasswordShow();

  const [paymentReport, setpaymentReport] = useState([]);

  const paymentReportDataState = useSelector(
    (state) => state.paymentDetailReport
  );

  useEffect(() => {
    // Dispatch the action to fetch data when the component mounts
    // fetchPaymentReportData();
    dispatch(fetchPaymentMethodReportData(data));
  }, [data]);

  const fetchPaymentReportData = async () => {
    try {
      await dispatch(fetchPaymentMethodReportData(data)).unwrap();
    } catch (error) {
      getUnAutherisedTokenMessage();
      handleCoockieExpire();
    }
  };

  useEffect(() => {
    if (
      !paymentReportDataState.loading &&
      paymentReportDataState.paymentMethodData
    ) {
      setpaymentReport(paymentReportDataState.paymentMethodData);
    }
  }, [
    paymentReportDataState,
    paymentReportDataState.loading,
    paymentReportDataState.paymentMethodData,
  ]);

  if (!data || data.length === 0) {
    return (
      <>
        <Grid container sx={{ padding: 2.5 }} className="box_shadow_div">
          <Grid item xs={12}>
            <p>No. Data found.</p>
          </Grid>
        </Grid>
      </>
    );
  }

  const myArray = Object.keys(paymentReport).map((key) => ({
    card_type: key,
    amt: paymentReport[key],
  }));

  // const renderDataTable = () => {

  //   if (
  //       paymentReport.status === "Failed" &&
  //       paymentReport.msg === "No Data found."
  //   ) {
  //       //  debugger;
  //     return <div className="empty-div">No data available</div>;
  //   } else if (myArray && myArray.length >= 1) {

  //     return (
  //       <>
  //         <div className="q-daily-report-bottom-report-header">
  //           <p className="report-sort">Card type</p>
  //           <p className="report-title">Total</p>
  //         </div>
  //         {myArray.map((paymentData, index) => (
  //           <div className="q-category-bottom-categories-listing" key={index}>
  //             <div className="q-category-bottom-categories-single-category">

  //               <p className="report-title">{paymentData.card_type}</p>
  //               <p className="report-title">  {typeof paymentData.amt === 'number' ? `$${Number(paymentData.amt).toFixed(2)}` : 'N/A'}</p>
  //               {/* <p className="report-title">${paymentData.amt.toFixed(2)}</p> */}
  //             </div>
  //           </div>
  //         ))}

  //       </>
  //     );
  //   }
  // };

  const renderDataTable = () => {
    let hasValidData = false;

    if (
      paymentReport.status === "Failed" &&
      paymentReport.msg === "No Data found."
    ) {
      return (
        <>
          <Grid container sx={{ padding: 2.5 }} className="box_shadow_div">
            <Grid item xs={12}>
              <p>No. Data found.</p>
            </Grid>
          </Grid>
        </>
      );
    } else if (myArray && myArray.length >= 1) {
      return (
        <>
          <Grid container className="box_shadow_div">
            <Grid item xs={12}>
              <TableContainer>
                <StyledTable
                  sx={{ minWidth: 500 }}
                  aria-label="customized table"
                >
                  <TableHead>
                    <StyledTableCell>Card type</StyledTableCell>
                    <StyledTableCell>Total</StyledTableCell>
                  </TableHead>
                  <TableBody>
                    {myArray.map((paymentData, index) => {
                      if (paymentData.amt > 0) {
                        hasValidData = true;
                        return (
                          <StyledTableRow key={index}>
                            <StyledTableCell>
                              <p className="report-title">
                                {paymentData.card_type}
                              </p>
                            </StyledTableCell>
                            <StyledTableCell>
                              <p className="report-title">
                                {typeof paymentData.amt != ""
                                  ? `$${priceFormate(
                                      Number(paymentData.amt).toFixed(2)
                                    )}`
                                  : "N/A"}
                              </p>
                            </StyledTableCell>
                          </StyledTableRow>
                        );
                      } else {
                        return null;
                      }
                    })}
                  </TableBody>
                </StyledTable>
              </TableContainer>
            </Grid>
          </Grid>
          {/* <div className="box">
            <div className="q-daily-report-bottom-report-header">
              <p className="report-sort">Card type</p>
              <p className="report-title">Total</p>
            </div>
          </div>
          {myArray.map((paymentData, index) => {
            if (paymentData.amt > 0) {
              hasValidData = true;
              return (
                <div className="box">
                  <div
                    className="q-category-bottom-categories-listing"
                    key={index}
                  >
                    <div className="q-category-bottom-categories-single-category">
                      <p className="report-title">{paymentData.card_type}</p>
                      <p className="report-title">
                        {typeof paymentData.amt != ""
                          ? `$${Number(paymentData.amt).toFixed(2)}`
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              );
            } else {
              return null;
            }
          })} */}
          {!hasValidData && (
            <>
              <Grid container sx={{ padding: 2.5 }} className="box_shadow_div">
                <Grid item xs={12}>
                  <p>No. Data found.</p>
                </Grid>
              </Grid>
            </>
          )}
        </>
      );
    }
  };

  return <>{renderDataTable()}</>;
};

export default PaymentMethodList;
