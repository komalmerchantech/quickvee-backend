import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchStoreOrderData,
  getStoreOrderCount,
} from "../../Redux/features/StoreOrder/StoreOrderSlice";
import "../../Styles/StoreOrder.css";
import { useAuthDetails } from "./../../Common/cookiesHelper";
import { Grid } from "@mui/material";
import InputTextSearch from "../../reuseableComponents/InputTextSearch";
import Left from "../../Assests/Taxes/Left.svg";
import Right from "../../Assests/Taxes/Right.svg";

import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Pagination from "../Users/UnverifeDetails/Pagination";
import useDebounce from "../../hooks/useDebouncs";
import { SkeletonTable } from "../../reuseableComponents/SkeletonTable";
import PasswordShow from "./../../Common/passwordShow";
import { Link } from "react-router-dom";

const StyledTable = styled(Table)(({ theme }) => ({
  padding: 2, // Adjust padding as needed
}));
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#253338",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
  [`&.${tableCellClasses.table}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));
const orderType =(type)=>{
  if(type === "Online Order"){
    return "Online";
  }if(type === "Store Order"){
    return "Offline"
  }else{
    return type
  }
}
const StoreOrderList = (props) => {
  const dispatch = useDispatch();

  const AllStoreOrderDataState = useSelector((state) => state.StoreOrderList);
  console.log("AllStoreOrderDataState: ",AllStoreOrderDataState)
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [searchRecord, setSearchRecord] = useState("");

  const debouncedValue = useDebounce(searchRecord);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const { userTypeData } = useAuthDetails();
  const {handleCoockieExpire,getUnAutherisedTokenMessage}=PasswordShow()

  useEffect(() => {
    // if (props && props.OrderStatusData && props.OrderTypeData) {
    //   let data = {
    //     pay_status: props.OrderStatusData,
    //     order_env: props.OrderTypeData,
    //     page: currentPage,
    //     perpage: rowsPerPage,
    //     search_by: Boolean(debouncedValue.trim()) ? debouncedValue : null,
    //     ...userTypeData,
    //   };
    //   // console.log("data: ", data);
    //   if (data) {
    //     dispatch(fetchStoreOrderData(data));
    //   }
    // }
    getfetchStoreOrderData()
  }, [
    props.OrderStatusData,
    props.OrderTypeData,
    currentPage,
    debouncedValue,
    rowsPerPage,
  ]);

  const getfetchStoreOrderData=async()=>{
   
    try{
      if(props && props.OrderStatusData && props.OrderTypeData){
        let data = {
          pay_status: props.OrderStatusData,
          order_env:  orderType(props.OrderTypeData),
          page: currentPage,
          perpage: rowsPerPage,
          search_by: Boolean(debouncedValue.trim()) ? debouncedValue : null,
          ...userTypeData,
        };
        if (data) {
          await dispatch(fetchStoreOrderData(data)).unwrap();
        }
      }
  }catch(error){
    handleCoockieExpire()
    getUnAutherisedTokenMessage()
  }
}

  // only when user searches
  useEffect(() => {
    // const data = {
    //   pay_status: props.OrderStatusData,
    //   order_env: props.OrderTypeData,
    //   search_by: Boolean(debouncedValue.trim()) ? debouncedValue : null,
    //   ...userTypeData,
    // };

    // dispatch(getStoreOrderCount(data));
    getStoreOrderCountFun();
  }, [debouncedValue,props.OrderTypeData]);

  const getStoreOrderCountFun=async()=>{
    try{
      if(props && props.OrderStatusData && props.OrderTypeData){
        const data = {
          pay_status: props.OrderStatusData,
          order_env: orderType(props.OrderTypeData),
          search_by: Boolean(debouncedValue.trim()) ? debouncedValue : null,
          ...userTypeData,
        };
        if (data) {
          await dispatch(getStoreOrderCount(data)).unwrap();
        }
      }
  }catch(error){
    handleCoockieExpire()
    getUnAutherisedTokenMessage()
  }
}

  // on load setting count of Verified Merchant list & on every change...
  useEffect(() => {
    setTotalCount(AllStoreOrderDataState.storeOrderCount);
  }, [AllStoreOrderDataState.storeOrderCount]);

  const handleSearchInputChange = (value) => {
    setSearchRecord(value);
    setCurrentPage(1);
  };

  const columns = [
    "Store Order Info",
    "Date",
    "Order ID",
    "Order Status",
    "Order Status",
    "Merchant",
  ];

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const dateOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    const timeOptions = { hour: 'numeric', minute: 'numeric', hour12: true };
    const formattedDate = date.toLocaleDateString('en-US', dateOptions);
    const formattedTime = date.toLocaleTimeString('en-US', timeOptions);
    return `${formattedDate} ${formattedTime}`;
  };

  return (
    <>
      <Grid container className="box_shadow_div">
        <Grid item xs={12}>
          <Grid container sx={{ padding: 2.5 }}>
            <Grid item xs={12}>
              <InputTextSearch
                className=""
                type="text"
                value={searchRecord}
                handleChange={handleSearchInputChange}
                placeholder="Search..."
                autoComplete="off"
              />
            </Grid>
          </Grid>

          <Grid container sx={{ padding: 2.5 }}>
            <Grid item xs={12}>
              <Pagination
                currentPage={currentPage}
                totalItems={totalCount}
                itemsPerPage={rowsPerPage}
                onPageChange={paginate}
                rowsPerPage={rowsPerPage}
                setRowsPerPage={setRowsPerPage}
                setCurrentPage={setCurrentPage}
              />
            </Grid>
          </Grid>

          <Grid container>
            {AllStoreOrderDataState.loading ? (
              <>
                <SkeletonTable columns={columns} />
              </>
            ) : (
              <>
                {AllStoreOrderDataState.StoreOrderData &&
                AllStoreOrderDataState.StoreOrderData.length >= 1 &&
                Array.isArray(AllStoreOrderDataState.StoreOrderData) ? (
                  <TableContainer>
                    <StyledTable
                      sx={{ minWidth: 500 }}
                      aria-label="customized table"
                    >
                      <TableHead>
                        <StyledTableCell>Store Order Info</StyledTableCell>
                        <StyledTableCell>Date</StyledTableCell>
                        <StyledTableCell>Order ID</StyledTableCell>
                        <StyledTableCell>Order Status</StyledTableCell>
                        <StyledTableCell>Fail Result</StyledTableCell>
                        <StyledTableCell>Merchant</StyledTableCell>
                      </TableHead>
                      <TableBody>
                        {console.log(
                          "AllStoreOrderDataState.StoreOrderData: ",
                          AllStoreOrderDataState?.StoreOrderData
                        )}
                        {AllStoreOrderDataState?.StoreOrderData.map(
                          (StoreData, index) => (
                            <StyledTableRow key={StoreData.id}>
                              {
                                StoreData.cname || StoreData.email || StoreData.delivery_phn ? 
                                <StyledTableCell>
                                   <div className="flex">
                                      <div className="text-[#000000] order_method capitalize">
                                        {StoreData.cname.length < 18
                                          ? StoreData.cname
                                          : StoreData.cname.slice(0, 18) + `...` ||
                                            ""}
                                      </div>
                                    </div>
                                    <div className="text-[#818181] lowercase">
                                      {StoreData.email || ""}
                                    </div>
                                    <div className="text-[#818181]">
                                      {StoreData.delivery_phn || ""}
                                    </div>
                                </StyledTableCell>: <StyledTableCell>-</StyledTableCell>
                              }
                              {/* <StyledTableCell>
                                <div className="flex">
                                  <div className="text-[#000000] order_method capitalize">
                                    {StoreData.cname.length < 18
                                      ? StoreData.cname
                                      : StoreData.cname.slice(0, 18) + `...` ||
                                        ""}
                                  </div>
                                </div>
                                <div className="text-[#818181] lowercase">
                                  {StoreData.email || ""}
                                </div>
                                <div className="text-[#818181]">
                                  {StoreData.delivery_phn || ""}
                                </div>
                              </StyledTableCell> */}
                              <StyledTableCell>
                                <div className="text-[#000000] order_method capitalize">
                                  {formatDateTime(StoreData.date_time)}
                                </div>
                              </StyledTableCell>
                              <StyledTableCell>
                              {/* <Link  to={`/store-reporting/order-summary/${StoreData.merchant_id}/${StoreData.order_id}`} target="_blank" > */}
                                <div className="text-[#000000] capitalize">
                                  {StoreData.order_id}
                                </div>
                                {/* </Link> */}
                              </StyledTableCell>
                              <StyledTableCell>
                                <div className="text-[#000000] order_method capitalize">
                                  {StoreData.order_status}
                                </div>
                              </StyledTableCell>
                              <StyledTableCell>
                                <div className="text-[#000000] order_method capitalize">
                                  {StoreData.failResult}
                                </div>
                              </StyledTableCell>
                              <StyledTableCell>
                                <div className="text-[#000000] order_method capitalize">
                                  {StoreData.merchant_name}
                                </div>
                              </StyledTableCell>
                            </StyledTableRow>
                          )
                        )}
                      </TableBody>
                    </StyledTable>
                  </TableContainer>
                ) : (
                  <p className="px-5 py-4">No Data Found</p>
                )}
              </>
            )}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default StoreOrderList;
