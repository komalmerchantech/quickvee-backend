import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchSalePersonData } from "../../../Redux/features/SalesByPerson/SalesByPersonSlice";
import { Link, useNavigate } from "react-router-dom";
import OrderSummaryDetails from "./MainOrderSumaaryDetails/OrderSummaryDetails";
import { useAuthDetails } from "../../../Common/cookiesHelper";

import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Grid } from "@mui/material";
import { priceFormate } from "../../../hooks/priceFormate";
import SortIconW from "../../../Assests/Category/SortingW.svg";
import { SortTableItemsHelperFun } from "../../../helperFunctions/SortTableItemsHelperFun";
// ==================== TABLE STYLE ADDED ===================================================
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
    ontFamily: "CircularSTDMedium",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  // "&:last-child td, &:last-child th": {
  //   backgroundColor:"#F5F5F5"
  // },
}));
// ==================== END TABLE STYLE ADDED ===================================================
const orderType = (type)=>{
  if(type === "Online Order"){
    return "Online"
  }
  if(type === "Store Order"){
    return "Offline"
  }
  else{
    return type
  }
}
const SalesPersonReport = (props) => {
  const {
    LoginGetDashBoardRecordJson,
    LoginAllStore,
    userTypeData,
    GetSessionLogin,
  } = useAuthDetails();
  const [sortOrder, setSortOrder] = useState("asc"); // "asc" for ascending, "desc" for descending
  // console.log(props);
  const dispatch = useDispatch();
  const [allSalesByPersonData, setallSalesByPersonData] = useState("");
  const AllSalesByPersonDataState = useSelector(
    (state) => state.SalesByPersonList
  );
  let merchant_id = LoginGetDashBoardRecordJson?.data?.merchant_id;
  const [totalRecord, setTotalRecord] = React.useState("");
  const navigate = useNavigate()
  useEffect(() => {
  
    if (props && props.selectedDateRange) {
      let data = {
        merchant_id,
        start_date: props.selectedDateRange.start_date,
        end_date: props.selectedDateRange.end_date,
        order_typ: props.OrderTypeData,
        order_env: orderType(props.OrderSourceData),
        employee_id: props.SelectEmpListData,
        ...userTypeData,
      };
      if (data) {
        dispatch(fetchSalePersonData(data));
      }
    }
  }, [props]);

  useEffect(() => {
    if (
      !AllSalesByPersonDataState.loading &&
      AllSalesByPersonDataState.SalePersonData
    ) {
      // console.log(AllSalesByPersonDataState.SalePersonData)
      setallSalesByPersonData(AllSalesByPersonDataState.SalePersonData);
    } else {
      setallSalesByPersonData("");
    }
  }, [
    AllSalesByPersonDataState,
    AllSalesByPersonDataState.loading,
    AllSalesByPersonDataState.ItemSalesData,
  ]);

  useEffect(() => {
    console.log(allSalesByPersonData);
  }, [allSalesByPersonData]);

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const dateOptions = { year: "numeric", month: "short", day: "numeric" };
    const timeOptions = { hour: "numeric", minute: "numeric", hour12: true };
    const formattedDate = date.toLocaleDateString("en-US", dateOptions);
    const formattedTime = date.toLocaleTimeString("en-US", timeOptions);
    return `${formattedDate} ${formattedTime}`;
  };

  if (!allSalesByPersonData || Object.keys(allSalesByPersonData).length === 0) {
    return (
      <>
        <Grid container sx={{ padding: 2.5 }} className="box_shadow_div ">
          <Grid item xs={12}>
            No data Found.
          </Grid>
        </Grid>
      </>
    );
  }
  let grandTotal = 0;
  Object.keys(allSalesByPersonData).map((EmpData, index) => {
    const totalAmount = allSalesByPersonData[EmpData]?.reduce(
      (total, SalesData) => {
        return total + (parseFloat(SalesData?.amt) || 0);
      },
      0
    );
    grandTotal += totalAmount;
  });

  const sortByItemName = (type, name) => {
    const newOrder = sortOrder === "asc" ? "desc" : "asc";

    const updatedCategorySale = Object.fromEntries(
      Object.entries(allSalesByPersonData).map(([EmpData, items]) => {
        const { sortedItems } = SortTableItemsHelperFun(
          items,
          type,
          name,
          sortOrder
        );
        return [EmpData, sortedItems];
      })
    );

    setallSalesByPersonData(updatedCategorySale);
    setSortOrder(newOrder);
  };
  return (
    <>
      {allSalesByPersonData &&
        Object.entries(allSalesByPersonData).map(([EmpData, items]) => (
          <>
            <Grid container className="box_shadow_div">
              <Grid item xs={12}>
                <div className="q-category-bottom-header">
                  <div className="q_details_header ml-2">
                    Employee Name: {EmpData}
                  </div>
                </div>
                <TableContainer>
                  <StyledTable
                    sx={{ minWidth: 500 }}
                    aria-label="customized table"
                  >
                    <TableHead>
                      <StyledTableCell>
                        <button
                          className="flex items-center"
                          onClick={() => sortByItemName("id", "order_id")}
                        >
                          <p>Order ID</p>
                          <img src={SortIconW} alt="" className="pl-1" />
                        </button>
                      </StyledTableCell>
                      <StyledTableCell>
                        <button
                          className="flex items-center"
                          onClick={() =>
                            sortByItemName("date", "merchant_time")
                          }
                        >
                          <p>Date</p>
                          <img src={SortIconW} alt="" className="pl-1" />
                        </button>
                      </StyledTableCell>
                      <StyledTableCell  align="center">
                        <button
                          className=""
                          onClick={() => sortByItemName("num", "amt")}
                        >
                          <div className="flex items-center"> <p>Total</p>
                          <img src={SortIconW} alt="" className="pl-1" /></div>
                          
                        </button>
                      </StyledTableCell>
                    </TableHead>
                    <TableBody>
                      {items?.map((SalesData, index) => (
                        <StyledTableRow key={index}>
                          <StyledTableCell sx={{ width: "33%" }}>
                            {/* <Link
                              to={`/order/store-reporting/order-summary/${merchant_id}/${SalesData.order_id}`}
                              target="_blank"
                            > */}
                              <span className="cursor-pointer text-[#0A64F9]" onClick={()=>navigate(`/order/store-reporting/order-summary/${merchant_id}/${SalesData.order_id}`)}>{SalesData.order_id}</span>
                            {/* </Link> */}
                          </StyledTableCell>
                          <StyledTableCell
                            sx={{
                              borderRight: "1px solid #E3E3E3",
                              width: "33%",
                            }}
                          >
                            <p>{formatDateTime(SalesData.merchant_time)}</p>
                          </StyledTableCell>
                          <StyledTableCell align="center" sx={{ width: "33%" }}>
                            <p> ${priceFormate(SalesData.amt)}</p>
                          </StyledTableCell>
                        </StyledTableRow>
                      ))}
                      <StyledTableRow>
                        <StyledTableCell></StyledTableCell>
                        <StyledTableCell align="center">
                          <div className="q-category-bottom-report-listing">
                            <div>Total </div>
                          </div>
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          <div className="q-category-bottom-report-listing">
                            <div>
                              {`$${priceFormate(
                                allSalesByPersonData[EmpData].reduce(
                                  (total, SalesData) => {
                                    return (
                                      total + (parseFloat(SalesData?.amt) || 0)
                                    );
                                  },
                                  0
                                ).toFixed(2)
                              )}`}
                            </div>
                          </div>
                        </StyledTableCell>
                      </StyledTableRow>
                    </TableBody>
                  </StyledTable>
                </TableContainer>
              </Grid>
            </Grid>
          </>
        ))}

      <StyledTable
        sx={{ minWidth: 500 }}
        aria-label="customized table"
        style={{ marginBottom: "1rem", transform: "translate(0rem, -1rem)" }}
      >
        <StyledTableRow>
          <StyledTableCell sx={{ width: "33%" }}></StyledTableCell>
          <StyledTableCell align="center" sx={{ width: "33%" }}>
            <div className="q-category-bottom-report-listing">
              <div>
                <p className="">Grand Total</p>
              </div>
            </div>
          </StyledTableCell>
          <StyledTableCell align="center">
            <div className="q-category-bottom-report-listing">
              <div>
                <p className="">${priceFormate(grandTotal.toFixed(2))}</p>
              </div>
            </div>
          </StyledTableCell>
        </StyledTableRow>
      </StyledTable>
    </>
  );
};

export default SalesPersonReport;
