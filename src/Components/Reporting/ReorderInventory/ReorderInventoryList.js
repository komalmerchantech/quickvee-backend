import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchReorderInventoryData } from "../../../Redux/features/Reports/ReorderInventory/ReorderInventorySlice";
import { useAuthDetails } from "../../../Common/cookiesHelper";

import { Button, Grid } from "@mui/material";

import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { priceFormate } from "../../../hooks/priceFormate";
import sortIcon from "../../../Assests/Category/SortingW.svg";
import { SortTableItemsHelperFun } from "../../../helperFunctions/SortTableItemsHelperFun";
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
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    // backgroundColor: "#F5F5F5",
  },
}));

const ReorderInventoryList = (props) => {
  // console.log(props)
  const { LoginGetDashBoardRecordJson, LoginAllStore, userTypeData } =
    useAuthDetails();
  const dispatch = useDispatch();
  const [allReorderInventoryData, setallReorderInventoryData] = useState([]);
  const AllReorderInventoryDataState = useSelector(
    (state) => state.ReorderInventoryList
  );
  let merchant_id = LoginGetDashBoardRecordJson?.data?.merchant_id;
  useEffect(() => {
    let data = {
      merchant_id,
      ...userTypeData,
      // merchant_id: "JOS0948CA",
    };
    if (data) {
      dispatch(fetchReorderInventoryData(data));
    }
  }, []);

  useEffect(() => {
    if (
      !AllReorderInventoryDataState.loading &&
      AllReorderInventoryDataState.ReorderData
    ) {
      console.log(AllReorderInventoryDataState.ReorderData);
      setallReorderInventoryData(AllReorderInventoryDataState.ReorderData);
    } else {
      setallReorderInventoryData([]);
    }
  }, [
    AllReorderInventoryDataState,
    AllReorderInventoryDataState.loading,
    AllReorderInventoryDataState.ReorderData,
  ]);

  const [sortOrder, setSortOrder] = useState("asc"); // "asc" for ascending, "desc" for descending

  const sortByItemName = (type, name) => {
    const { sortedItems, newOrder } = SortTableItemsHelperFun(
      allReorderInventoryData,
      type,
      name,
      sortOrder
    );
    setallReorderInventoryData(sortedItems);
    setSortOrder(newOrder);
  };

  const columns = [
    { type: "str", name: "item_name", label: "Item Name" },
    { type: "num", name: "variant", label: "Variant" },
    { type: "str", name: "category", label: "Category" },
    { type: "num", name: "cost_vendor", label: "Cost Of Vendor" },
    { type: "num", name: "instock", label: "Instock" },
    { type: "num", name: "item_price", label: "Item Price" },
    { type: "num", name: "reorder_level", label: "Reorder Level" },
    { type: "num", name: "reorder_qty", label: "Reorder Quantity" },
  ];
  return (
    <>
      <Grid container className="box_shadow_div">
        <Grid item xs={12}>
          <TableContainer>
            <StyledTable sx={{ minWidth: 500 }} aria-label="customized table">
              <TableHead>
                {columns.map((column) => (
                  <StyledTableCell key={column.name}>
                    <button
                      className="flex items-center"
                      onClick={() => sortByItemName(column.type, column.name)}
                    >
                      <p>{column.label}</p>
                      <img src={sortIcon} alt="" className="pl-1" />
                    </button>
                  </StyledTableCell>
                ))}
              </TableHead>
              <TableBody>
                {allReorderInventoryData &&
                allReorderInventoryData?.length > 0 ? (
                  allReorderInventoryData.map((InvData, index) => (
                    <StyledTableRow>
                      <StyledTableCell>
                        <p>{InvData.item_name}</p>
                      </StyledTableCell>
                      <StyledTableCell>
                        <p>{InvData.variant}</p>
                      </StyledTableCell>
                      <StyledTableCell>
                        <p>{InvData.category}</p>
                      </StyledTableCell>
                      <StyledTableCell>
                        <p>{InvData.cost_vendor}</p>
                      </StyledTableCell>
                      <StyledTableCell>
                        <p>{priceFormate(InvData.instock)}</p>
                      </StyledTableCell>
                      <StyledTableCell>
                        <p>${priceFormate(InvData.item_price)}</p>
                      </StyledTableCell>
                      <StyledTableCell>
                        <p>{priceFormate(InvData.reorder_level)}</p>
                      </StyledTableCell>
                      <StyledTableCell>
                        <p>{priceFormate(InvData.reorder_qty)}</p>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))
                ) : (
                  <Grid container sx={{ padding: 2.5 }}>
                    <Grid item xs={12}>
                      <p>No. Data found.</p>
                    </Grid>
                  </Grid>
                )}
              </TableBody>
            </StyledTable>
          </TableContainer>
        </Grid>
      </Grid>
      {/* <div className="box">
        <div className="q-daily-report-bottom-report-header">
          <p className="report-sort">Item Name</p>
          <p className="report-sort">Variant</p>
          <p className="report-sort">Category</p>
          <p className="report-sort">Cost of Vendor</p>
          <p className="report-sort">Instock</p>
          <p className="report-sort">Item Price</p>
          <p className="report-sort">Reorder Level</p>
          <p className="report-sort">Reorder Quantity</p>
        </div>
      </div>

      {allReorderInventoryData && allReorderInventoryData.length >= 1 ? (
        allReorderInventoryData.map((InvData, index) => (
          <div className="box">
            <div
              key={index}
              className="q-category-bottom-categories-listing"
              style={{ borderRadius: "unset" }}
            >
              <div className="q-category-bottom-categories-single-category">
                <p className="report-title">{InvData.item_name}</p>
                <p className="report-title">{InvData.variant}</p>
                <p className="report-title">{InvData.category}</p>
                <p className="report-title">{InvData.cost_vendor}</p>
                <p className="report-title">{InvData.instock}</p>
                <p className="report-title">{InvData.item_price}</p>
                <p className="report-title">{InvData.reorder_level}</p>
                <p className="report-title">{InvData.reorder_qty}</p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="empty-div">No data available</div>
      )} */}
    </>
  );
};

export default ReorderInventoryList;
