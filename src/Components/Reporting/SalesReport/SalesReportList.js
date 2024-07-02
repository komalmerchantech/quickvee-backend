import React, { useEffect, useState } from "react";
import { BiCaretUp } from "react-icons/bi";
// import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { fetchSalesReportData } from "../../../Redux/features/Reports/SalesReport/SalesReportSlice";

import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Grid } from "@mui/material";
import { useAuthDetails } from "../../../Common/cookiesHelper";
import PasswordShow from "../../../Common/passwordShow";
import { getAuthInvalidMessage } from "../../../Redux/features/Authentication/loginSlice";
import { priceFormate } from "../../../hooks/priceFormate";

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
    backgroundColor: "#F8F8F8",
  },
  // hide last border
}));

const SalesReportList = (props) => {
  const dispatch = useDispatch();
  const { handleCoockieExpire, getUnAutherisedTokenMessage } = PasswordShow();
  const {
    LoginGetDashBoardRecordJson,
    LoginAllStore,
    userTypeData,
    GetSessionLogin,
  } = useAuthDetails();
  const merchant_id = LoginGetDashBoardRecordJson?.data?.merchant_id;
  const [SalesReportData, setSalesReportData] = useState({});
  const SalesReportDataState = useSelector((state) => state.SalesReportList);
  // console.log(props)
  useEffect(() => {
    getAllRecord();
  }, [props, dispatch]);

  const getAllRecord = async () => {
    if (props && props.selectedDateRange) {
      const StartDateData = props.selectedDateRange.start_date;
      const EndDateData = props.selectedDateRange.end_date;

      let data = {
        merchant_id: merchant_id,
        start_date: StartDateData,
        end_date: EndDateData,
        order_env: 9,
        order_typ: "both",
      };
      // console.log(data)
      if (data) {
        try {
          await dispatch(fetchSalesReportData(data)).unwrap();
        } catch (error) {
          getUnAutherisedTokenMessage();
          handleCoockieExpire();
        }
      }
    }
  };

  useEffect(() => {
    if (!SalesReportDataState.loading && SalesReportDataState.SalesReportData) {
      // console.log(SalesReportDataState.SalesReportData)
      setSalesReportData(SalesReportDataState.SalesReportData);
    } else {
      setSalesReportData({});
    }
  }, [SalesReportDataState.loading, SalesReportDataState.SalesReportData]);

  const { data } = SalesReportData;

  const gross_sale = parseFloat(SalesReportData.subtotal);

  const discount = parseFloat(SalesReportData.discount);
  const total_gift_card_amount = parseFloat(
    SalesReportData.total_gift_card_amount
  );
  const total_loyalty_point_spent = parseFloat(
    SalesReportData.total_loyalty_point_spent
  );

  const discount1 =
    parseFloat(discount) -
    (parseFloat(total_gift_card_amount) +
      parseFloat(total_loyalty_point_spent));

  const loyaltyPoint =
    parseFloat(SalesReportData.total_loyalty_point_spent) -
    parseFloat(SalesReportData.loyality_amt_refunded);
  const refunds =
    parseFloat(SalesReportData.net_refund) +
    parseFloat(SalesReportData.net_refund1);
  const netSales =
    parseFloat(gross_sale) -
    (parseFloat(discount1) + parseFloat(refunds)) -
    parseFloat(SalesReportData.giftcard_amt_collected) -
    parseFloat(SalesReportData.loyality_amt_collected);
  const taxesAndFees =
    parseFloat(SalesReportData.remain_default_tax) +
    parseFloat(SalesReportData.remain_other_tax);
  const tip = parseFloat(SalesReportData.tip);
  const serviceCharges =
    parseFloat(SalesReportData.con_fee) + parseFloat(SalesReportData.del_fee);
  const cashDiscounting = parseFloat(SalesReportData.cash_discounting);
  const amountCollected =
    parseFloat(SalesReportData.card_collected) +
    parseFloat(SalesReportData.cash_collected) +
    parseFloat(SalesReportData.cash_ebt_collected) +
    parseFloat(SalesReportData.food_ebt_collected);

  // console.log(discount1)
  // console.log(SalesReportData)
  const SalesSummeryList = [
    {
      name: "Gross Sale",
      amount: gross_sale,
    },
    {
      name: "Loyalty Point Redeemed",
      amount: loyaltyPoint,
    },
    {
      name: "Gift Card Amount Redeemed",
      amount: SalesReportData.giftcard_amt_collected,
    },
    {
      name: "Discount",
      amount: discount1,
    },
    {
      name: "Refunds",
      amount: refunds,
    },
    {
      name: "Net Sales",
      amount: netSales,
    },
    {
      name: "Taxes",
      amount: taxesAndFees,
    },
    {
      name: "Tips",
      amount: tip,
    },
    {
      name: "Services Charges",
      amount: serviceCharges,
    },
    {
      name: "Non Cash Adjustment Fees",
      amount: cashDiscounting,
    },
  ];

  const SalesByTenderAndCardTypeList = [
    {
      name: "Credit Cards + Debit Cards",
      amount: SalesReportData.card_collected,
    },
    {
      name: "Cash",
      amount: SalesReportData.cash_collected,
    },
    {
      name: "Food EBT Card Collected",
      amount: SalesReportData.food_ebt_collected,
    },
    {
      name: "Cash EBT Card Collected",
      amount: SalesReportData.cash_ebt_collected,
    },
    {
      name: "Amount Collected",
      amount: amountCollected,
    },
  ];

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });
  return (
    <>
      {SalesReportData && SalesReportData.subtotal > 0 ? (
        <>
          <Grid container sx={{ padding: 0 }} spacing={2}>
            <Grid item xs={4}>
              <div className="box_shadow_div mt_card_header">
                <div className="text-[#707070] font-normal lg:text-[18px]  sm:text-[14px] tracking-normal opacity-100 Admin_std">
                  <b>Gross Sale</b>
                </div>
                <div className="text-black lg:text-[40px] sm:text-[24px] font-normal Admin_std mt-1 mb-1">
                  ${priceFormate(parseFloat(gross_sale).toFixed(2))}
                  {/* ${formatter.format(gross_sale)} */}
                  {/* {format("2000000.00")} */}
                </div>
                {/* <div className="flex items-center text-green-500">
                    <BiCaretUp className="mr-1" />
                    <span className="text-green-500 Admin_std">+21.00%</span>
                    </div> */}
              </div>
            </Grid>
            <Grid item xs={4}>
              <div className="box_shadow_div mt_card_header">
                <div className="text-[#707070] font-normal  lg:text-[18px]  sm:text-[14px] tracking-normal opacity-100 Admin_std">
                  <b>Net Sale</b>
                </div>
                <div className="text-black lg:text-[40px] sm:text-[24px] font-normal Admin_std mt-1 mb-1">
                  ${priceFormate(parseFloat(netSales).toFixed(2))}
                </div>
                {/* <div className="flex items-center text-green-500">
                    <BiCaretUp className="mr-1" />
                    <span className="text-green-500 Admin_std">+21.00%</span>
                    </div> */}
              </div>
            </Grid>
            <Grid item xs={4}>
              <div className="box_shadow_div mt_card_header">
                <div className="text-[#707070] font-normal  lg:text-[18px]  sm:text-[14px] tracking-normal opacity-100 Admin_std">
                  <b>Amount Collected</b>
                </div>
                <div className="text-black lg:text-[40px] sm:text-[24px] font-normal Admin_std mt-1 mb-1">
                  ${priceFormate(parseFloat(amountCollected).toFixed(2))}
                </div>
                {/* <div className="flex items-center text-green-500">
                        <BiCaretUp className="mr-1" />
                        <span className="text-green-500 Admin_std">+21.00%</span>
                        </div> */}
              </div>
            </Grid>
          </Grid>
          <Grid container className="box_shadow_div">
            <Grid item xs={12}>
              <TableContainer>
                <StyledTable
                  sx={{ minWidth: 500 }}
                  aria-label="customized table"
                >
                  <TableHead>
                    <StyledTableCell>Sales Summary</StyledTableCell>
                    <StyledTableCell align="right"></StyledTableCell>
                  </TableHead>
                  <TableBody>
                    {SalesSummeryList?.map((item, index) => (
                      <StyledTableRow key={index}>
                        <StyledTableCell
                          sx={{
                            fontWeight:
                              item.name === "Gross Sale" ||
                              item.name === "Net Sales"
                                ? "bold"
                                : "normal",
                            borderRight: "1px solid #E3E3E3",
                            width: 400,
                            color:
                              item.name === "Gross Sale" ||
                              item.name === "Net Sales"
                                ? "#0A64F9"
                                : "",
                          }}
                        >
                          <div className="q_sales_trading_data p-0">
                            <p>{item.name}</p>
                          </div>
                        </StyledTableCell>
                        <StyledTableCell
                          align="left"
                          sx={{
                            fontWeight:
                              item.name === "Gross Sale" ||
                              item.name === "Net Sales"
                                ? "bold"
                                : "normal",
                            color:
                              item.name === "Gross Sale" ||
                              item.name === "Net Sales"
                                ? "#0A64F9"
                                : "",
                          }}
                        >
                          <p>
                            ${priceFormate(parseFloat(item.amount).toFixed(2))}
                          </p>
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </StyledTable>
              </TableContainer>
            </Grid>
          </Grid>
          <Grid container className="box_shadow_div">
            <Grid item xs={12}>
              <TableContainer>
                <StyledTable
                  sx={{ minWidth: 500 }}
                  aria-label="customized table"
                >
                  <TableHead>
                    <StyledTableCell>
                      Sales by Tender and Card Type
                    </StyledTableCell>
                    <StyledTableCell align="right"></StyledTableCell>
                  </TableHead>
                  <TableBody>
                    {SalesByTenderAndCardTypeList?.map((item, index) => (
                      <StyledTableRow key={index}>
                        <StyledTableCell
                          sx={{
                            fontWeight:
                              item.name === "Amount Collected"
                                ? "bold"
                                : "normal",
                            borderRight: "1px solid #E3E3E3",
                            width: 400,
                            color:
                              item.name === "Amount Collected" ? "#0A64F9" : "",
                          }}
                        >
                          <div className="q_sales_trading_data p-0">
                            <p>{item.name}</p>
                          </div>
                        </StyledTableCell>
                        <StyledTableCell
                          align="left"
                          sx={{
                            fontWeight:
                              item.name === "Amount Collected"
                                ? "bold"
                                : "normal",
                            color:
                              item.name === "Amount Collected" ? "#0A64F9" : "",
                          }}
                        >
                          <p>
                            ${priceFormate(parseFloat(item.amount).toFixed(2))}
                          </p>
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </StyledTable>
              </TableContainer>
            </Grid>
          </Grid>
          {/* <div className="box">
            <div className="qvrow">
              <div className="col-span-4 col-qv-4 lg:col-span-1">
                <div className="box_shadow_div mt_card_header">
                  <div className="text-[#707070] font-normal lg:text-[18px]  sm:text-[14px] tracking-normal opacity-100 Admin_std">
                    <b>Gross Sale</b>
                  </div>
                  <div className="text-black lg:text-[40px] sm:text-[24px] font-normal Admin_std mt-1 mb-1">
                    ${parseFloat(gross_sale).toFixed(2)}
                  </div>
                
                </div>
              </div>

              <div className="col-span-4 col-qv-4 lg:col-span-1">
                <div className="box_shadow_div mt_card_header">
                  <div className="text-[#707070] font-normal  lg:text-[18px]  sm:text-[14px] tracking-normal opacity-100 Admin_std">
                    <b>Net Sale</b>
                  </div>
                  <div className="text-black lg:text-[40px] sm:text-[24px] font-normal Admin_std mt-1 mb-1">
                    ${parseFloat(netSales).toFixed(2)}
                  </div>
                </div>
              </div>

              <div className="col-span-4 col-qv-4 lg:col-span-1">
                <div className="box_shadow_div mt_card_header ">
                  <div className="text-[#707070] font-normal  lg:text-[18px]  sm:text-[14px] tracking-normal opacity-100 Admin_std">
                    <b>Amount Collected</b>
                  </div>
                  <div className="text-black lg:text-[40px] sm:text-[24px] font-normal Admin_std mt-1 mb-1">
                    ${parseFloat(amountCollected).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>

            <div className="qvrow">
              <div className="col-qv-12">
                <div className="box_shadow_div">
                  <div className="q_saleitem_header">
                    <h1>
                      <b>Sales Summary</b>
                    </h1>
                  </div>
                  <div className="q_background_status">
                    <div className="q_sales_trading_data">
                      <p>
                        <b>Gross Sale</b>
                      </p>
                      <p>
                        <b>${parseFloat(gross_sale).toFixed(2)}</b>
                      </p>
                    </div>
                    <div className="q_sales_trading_data">
                      <p>Loyalty Point Redeemed</p>
                      <p>${parseFloat(loyaltyPoint).toFixed(2)}</p>
                    </div>
                    <div className="q_sales_trading_data">
                      <p>Gift Card Amount Redeemed</p>
                      <p>
                        $
                        {parseFloat(
                          SalesReportData.giftcard_amt_collected
                        ).toFixed(2)}
                      </p>
                    </div>
                    <div className="q_sales_trading_data">
                      <p>Discount</p>
                      <p>${parseFloat(discount1).toFixed(2)}</p>
                    </div>
                    <div className="q_sales_trading_data">
                      <p>Refunds</p>
                      <p>${parseFloat(refunds).toFixed(2)}</p>
                    </div>
                    <div className="q_sales_trading_data">
                      <p>
                        <b>Net Sales</b>
                      </p>
                      <p>
                        <b>${parseFloat(netSales).toFixed(2)}</b>
                      </p>
                    </div>
                    <div className="q_sales_trading_data">
                      <p>Taxes</p>
                      <p>${parseFloat(taxesAndFees).toFixed(2)}</p>
                    </div>
                    <div className="q_sales_trading_data">
                      <p>Tips</p>
                      <p>${parseFloat(tip).toFixed(2)}</p>
                    </div>
                    <div className="q_sales_trading_data">
                      <p>Services Charges</p>
                      <p>${parseFloat(serviceCharges).toFixed(2)}</p>
                    </div>
                    <div className="q_sales_trading_data">
                      <p>Non Cash Adjustment Fees</p>
                      <p>${parseFloat(cashDiscounting).toFixed(2)}</p>
                    </div>

                    <div className="box_shadow_div">
                      <div className="q_saleitem_header">
                        <h1>
                          <b>Sales by Tender and Card Type</b>
                        </h1>
                      </div>
                      <div className="q_background_status">
                        <div className="q_sales_trading_data">
                          <p>Credit Cards + Debit Cards</p>
                          <p>
                            $
                            {parseFloat(SalesReportData.card_collected).toFixed(
                              2
                            )}
                          </p>
                        </div>
                        <div className="q_sales_trading_data">
                          <p>Cash</p>
                          <p>
                            $
                            {parseFloat(SalesReportData.cash_collected).toFixed(
                              2
                            )}
                          </p>
                        </div>
                        <div className="q_sales_trading_data">
                          <p>Food EBT Card Collected</p>
                          <p>
                            $
                            {parseFloat(
                              SalesReportData.food_ebt_collected
                            ).toFixed(2)}
                          </p>
                        </div>
                        <div className="q_sales_trading_data">
                          <p>Cash EBT Card Collected</p>
                          <p>
                            $
                            {parseFloat(
                              SalesReportData.cash_ebt_collected
                            ).toFixed(2)}
                          </p>
                        </div>
                        <div className="q_sales_trading_data">
                          <p>
                            <b>Amount Collected</b>
                          </p>
                          <p>
                            <b>${parseFloat(amountCollected).toFixed(2)}</b>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
        </>
      ) : (
        <Grid sx={{ padding: 2.5, margin: 0 }} className="box_shadow_div">
          <Grid item xs={12}>
            <p>No record found.</p>
          </Grid>
        </Grid>
        // <div>
        //   <table className="table table-bordered my_new_table">
        //     <tbody>
        //       <tr>
        //         <td>No record found.</td>
        //       </tr>
        //     </tbody>
        //   </table>
        // </div>
      )}
    </>
  );
};

export default SalesReportList;
