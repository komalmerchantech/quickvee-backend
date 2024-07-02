import React, { useEffect, useState } from "react";
import { fetchdetailCategorySaleData } from "../../../Redux/features/DetailCategorySale/detailCategorySaleSlice";

import { useSelector, useDispatch } from "react-redux";
import SortIcon from "../../../Assests/Category/Sorting.svg";
import SortIconW from "../../../Assests/Category/SortingW.svg";
import { useAuthDetails } from "../../../Common/cookiesHelper";
import { Grid } from "@mui/material";

import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { priceFormate } from "../../../hooks/priceFormate";
import PasswordShow from "../../../Common/passwordShow";
import { getAuthInvalidMessage } from "../../../Redux/features/Authentication/loginSlice";
import { SortTableItemsHelperFun } from "../../../helperFunctions/SortTableItemsHelperFun";

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
    // backgroundColor: "#F5F5F5",
  },
}));

const DetailsSaleReport = ({ data }) => {
  const dispatch = useDispatch();

  const { handleCoockieExpire, getUnAutherisedTokenMessage } = PasswordShow();
  const {
    LoginGetDashBoardRecordJson,
    LoginAllStore,
    userTypeData,
    GetSessionLogin,
  } = useAuthDetails();

  const [detailCategorySale, setdetailCategorySale] = useState([]);
  const [order, setOrder] = useState("DESC");
  const [sorting_type, setSorting_type] = useState("categoryTotal");
  const [sortOrder, setSortOrder] = useState("asc"); // "asc" for ascending, "desc" for descending
  const detailCategorySaleDataState = useSelector(
    (state) => state.detailCategorySale
  );
  let merchant_id = LoginGetDashBoardRecordJson?.data?.merchant_id;
  useEffect(() => {
    getDetailedCategorySalesData();
  }, [dispatch, data, order, sorting_type]);
  const getDetailedCategorySalesData = async () => {
    try {
      if (!merchant_id) {
        console.log("empty");
      } else {
        let NewData = {
          ...data,
          merchant_id,
          // merchant_id: LoginGetDashBoardRecordJson?.data?.merchant_id,
          order,
          sorting_type,
          ...userTypeData,
        };
        // console.log(data);
        // console.log(NewData);

        await dispatch(fetchdetailCategorySaleData(NewData)).unwrap();
      }
    } catch (error) {
      getUnAutherisedTokenMessage();
      handleCoockieExpire();
    }
  };

  useEffect(() => {
    if (
      !detailCategorySaleDataState.loading &&
      detailCategorySaleDataState.detailCategorySaleData
    ) {
      setdetailCategorySale(detailCategorySaleDataState.detailCategorySaleData);
    }
  }, [detailCategorySaleDataState]);

  if (!detailCategorySale || Object.keys(detailCategorySale).length === 0) {
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

  const grandTotal = detailCategorySale
    ? Object.values(detailCategorySale).reduce((acc, category) => {
        return (
          acc +
          category.reduce((accCat, item) => {
            const productTotal = parseFloat(item.product_total) || 0;
            return accCat + productTotal;
          }, 0)
        );
      }, 0)
    : 0;

  const handleCategoryClick = () => {
    // Toggle between ASC and DESC orders
    const newSort = "categoryTotal";
    const newOrder = order === "ASC" ? "DESC" : "ASC";
    setOrder(newOrder);
    setSorting_type(newSort);
  };

  const handleQuantityClick = () => {
    const newSort = "productQuantity";
    const newOrder = order === "ASC" ? "DESC" : "ASC";
    setSorting_type(newSort);
    setOrder(newOrder);
  };

  const sortByItemName = (type, name) => {
    const newOrder = sortOrder === "asc" ? "desc" : "asc";

    const updatedCategorySale = Object.fromEntries(
      Object.entries(detailCategorySale).map(([category, items]) => {
        const { sortedItems } = SortTableItemsHelperFun(
          items,
          type,
          name,
          sortOrder
        );
        return [category, sortedItems];
      })
    );

    setdetailCategorySale(updatedCategorySale);
    setSortOrder(newOrder);
  };

  return (
    <>
      {Object.entries(detailCategorySale).map(([category, items]) => (
        <>
          <Grid container className="box_shadow_div">
            <Grid item xs={12}>
              <div
                className="q-attributes-bottom-header bg-[#ffffff] cursor-pointer"
                onClick={handleCategoryClick}
              >
                <span>{category}</span>
                <img src={SortIcon} alt="" className="" />
              </div>
              <TableContainer>
                <StyledTable
                  sx={{ minWidth: 500 }}
                  aria-label="customized table"
                >
                  <TableHead>
                    <StyledTableCell sx={{ width: "55%" }}>
                      <button
                        className="flex items-center"
                        onClick={() => sortByItemName("str", "name")}
                      >
                        <p>Item Name</p>
                        <img src={SortIconW} alt="" className="pl-1" />
                      </button>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {/* <p
                        className="q-catereport-quantity "
                        onClick={handleQuantityClick}
                      >
                        Quantity <img src={SortIconW} alt="" className="pl-1" />
                      </p> */}
                      <button
                        className="flex items-center"
                        onClick={() => sortByItemName("num", "pro_qty")}
                      >
                        <p>Quantity</p>
                        <img src={SortIconW} alt="" className="pl-1" />
                      </button>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {/* <p
                        className="attriButes-title"
                        onClick={handleQuantityClick}
                      >
                        Amount <img src={SortIconW} alt="" className="pl-1" />
                      </p> */}
                      <button
                        className="flex items-center"
                        onClick={() => sortByItemName("num", "product_total")}
                      >
                        <p>Amount</p>
                        <img src={SortIconW} alt="" className="pl-1" />
                      </button>
                    </StyledTableCell>
                  </TableHead>
                  <TableBody>
                    {items?.map((item, index) => (
                      <StyledTableRow key={index}>
                        <StyledTableCell>
                          <p className="q-catereport-item">{item.name}</p>
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          <p className="">{item.pro_qty}</p>
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          $
                          {item.product_total
                            ? priceFormate(
                                parseFloat(item.product_total).toFixed(2)
                              )
                            : "0.00"}
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                    <StyledTableRow>
                      <StyledTableCell>
                        <p>Total</p>
                      </StyledTableCell>
                      <StyledTableCell></StyledTableCell>
                      <StyledTableCell align="left">
                        $
                        {priceFormate(
                          items
                            .reduce(
                              (acc, item) =>
                                acc + parseFloat(item.product_total),
                              0
                            )
                            .toFixed(2)
                        )}
                      </StyledTableCell>
                    </StyledTableRow>
                  </TableBody>
                </StyledTable>
              </TableContainer>
            </Grid>
          </Grid>
          {/* <div className="box" key={category}>
            <div className="q-attributes-bottom-detail-section ">
              <div className="mt-6 ">
                <div
                  className="q-attributes-bottom-header bg-[#ffffff] cursor-pointer"
                  onClick={handleCategoryClick}
                >
                  <span>{category}</span>
                  <img src={SortIcon} alt="" className="" />
                </div>
                <style>
                  {`.q-catereport-quantity,.attriButes-title{
                    display: flex !important;
                    cursor:pointer;
                  }
                  .q-catereport-quantity span, .attriButes-title span{
                    padding-left: 0.75rem;
                  }
                  
                  `}
                </style>
                <div className="q-attributes-bottom-attriButes-header">
                  <p className="q-catereport-item">Item Name</p>
                  <p
                    className="q-catereport-quantity "
                    onClick={handleQuantityClick}
                  >
                    Quantity{" "}
                    <span>
                      <img src={SortIconW} alt="" className="" />
                    </span>{" "}
                  </p>
                  <p className="attriButes-title" onClick={handleQuantityClick}>
                    Amount{" "}
                    <span>
                      <img src={SortIconW} alt="" className="" />
                    </span>
                  </p>
                </div>
                {items.map((item, index) => (
                  <div
                    className="q-attributes-bottom-attriButes-listing"
                    key={index}
                  >
                    <div className="q-attributes-bottom-attriButes-single-attributes">
                      <p className="q-catereport-item">{item.name}</p>
                      <p className="q-catereport-quantity ">{item.pro_qty}</p>
                      <p className="q-catereport-amount">
                        $
                        {item.product_total
                          ? parseFloat(item.product_total).toFixed(2)
                          : "0.00"}
                      </p>
                    </div>
                  </div>
                ))}
                <div className="q-order-bottom-oder-details-listing">
                  <div className="q-order-bottom-order-details-single-attributes">
                    <p className="q-catereport-item">Total</p>
                    <p className="q-catereport-quantity"></p>
                    <p className="q-catereport-amount">
                      $
                      {items
                        .reduce(
                          (acc, item) => acc + parseFloat(item.product_total),
                          0
                        )
                        .toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
        </>
      ))}
      <Grid container sx={{ marginY: 2.5 }} className="box_shadow_div">
        <Grid item xs={12}>
          <TableContainer>
            <StyledTable>
              <TableBody>
                <StyledTableRow>
                  <StyledTableCell sx={{ width: "50%" }}>
                    <div className="q-category-bottom-report-listing">
                      <div>
                        <p className="">Grand Total</p>
                      </div>
                    </div>
                  </StyledTableCell>
                  <StyledTableCell></StyledTableCell>

                  <StyledTableCell align="center">
                    <div className="q-category-bottom-report-listing">
                      <div>${priceFormate(grandTotal.toFixed(2))}</div>
                    </div>
                  </StyledTableCell>
                </StyledTableRow>
              </TableBody>
            </StyledTable>
          </TableContainer>
        </Grid>
      </Grid>
    </>
  );
};

export default DetailsSaleReport;
