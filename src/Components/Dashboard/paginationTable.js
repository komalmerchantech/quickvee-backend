import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { priceFormate } from "../../hooks/priceFormate";
import sortIcon from "../../Assests/Category/SortingW.svg";
import Summery from "../../Assests/Category/Summery.svg";
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    fontFamily: "CircularSTDBook !important",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    paddingTop:"12px",
    paddingLeft:"12px",
    paddingRight:"1px",
    fontFamily: "CircularSTDMedium",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    // border: 0,
  },
}));

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
];

const formatDateTime = (dateTimeString) => {
  const date = new Date(dateTimeString);
  const dateOptions = { year: "numeric", month: "short", day: "numeric" };
  const timeOptions = { hour: "numeric", minute: "numeric", hour12: true };
  const formattedDate = date.toLocaleDateString("en-US", dateOptions);
  const formattedTime = date.toLocaleTimeString("en-US", timeOptions);
  return `${formattedDate} ${formattedTime}`;
};

export default function DashboardTables(props) {
  const navigate = useNavigate();
  // const handleSummeryPage = (order_id) => {
  //   navigate("/store-reporting/order-summary", {
  //     state: { merchantId: props.merchant_id, order_id: order_id },
  //   });
  // };

  const getCustomerName = (deliverName, billingName) => {
    if (deliverName && deliverName !== "") {
      return deliverName;
    } else if (billingName && billingName !== "") {
      return billingName;
    } else {
      return "N/A";
    }
  };

  const getStatus = (orderMethod, mStatus) => {
    if (orderMethod === "pickup") {
      switch (mStatus) {
        case "1":
          return "Accepted";
        case "2":
          return "Packing";
        case "3":
          return "Ready";
        case "4":
          return "Completed";
        case "5":
          return "Cancel";
        case "7":
          return "Refunded";
        default:
          return "Accepted";
      }
    } else {
      switch (mStatus) {
        case "1":
          return "Accepted";
        case "2":
          return "Packing";
        case "3":
          return "Out for Delivery";
        case "4":
          return "Delivered";
        case "5":
          return "Cancel";
        case "6":
          return "Ready";
        case "7":
          return "Refunded";
        default:
          return "Accepted";
      }
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell >
              <button
                className="flex items-center"
                onClick={() => props.sortByItemName("str", "billing_name")}
              >
                <p className="whitespace-nowrap">Customer Name</p>
                <img src={sortIcon} alt="" className="pl-1" />
              </button>
            </StyledTableCell>
            <StyledTableCell className="whitespace-nowrap" >
              Customer No.
            </StyledTableCell>
            <StyledTableCell >
              <button
                className="flex items-center"
                onClick={() => props.sortByItemName("date", "date_time")}
              >
                <p>Order Date & Time</p>
                <img src={sortIcon} alt="" className="pl-1" />
              </button>
            </StyledTableCell>
            <StyledTableCell >
              <button
                className="flex items-center"
                onClick={() => props.sortByItemName("id", "order_id")}
              >
                <p> Order Id</p>
                <img src={sortIcon} alt="" className="pl-1" />
              </button>
            </StyledTableCell>
            <StyledTableCell >
              <button
                className="flex items-center"
                onClick={() => props.sortByItemName("str", "order_method")}
              >
                <p className="whitespace-nowrap"> Order Type</p>
                <img src={sortIcon} alt="" className="pl-1" />
              </button>
            </StyledTableCell>
            <StyledTableCell >
              <button
                className="flex items-center"
                onClick={() => props.sortByItemName("str", "m_status")}
              >
                <p>Status</p>
                <img src={sortIcon} alt="" className="pl-1" />
              </button>
            </StyledTableCell>
            <StyledTableCell >
              <button
                className="flex items-center"
                onClick={() => props.sortByItemName("num", "amt")}
              >
                <p> Amount</p>
                <img src={sortIcon} alt="" className="pl-1" />
              </button>
            </StyledTableCell>
            <StyledTableCell >Order Details</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.dashboardRecord &&
          Array.isArray(props.dashboardRecord) &&
          props.dashboardRecord.length > 0 ? (
            props.dashboardRecord.map((row) => (
              <StyledTableRow key={row.id}>
                <StyledTableCell >
                  {getCustomerName(row.deliver_name, row.billing_name)}
                </StyledTableCell>
                <StyledTableCell >
                  {row.delivery_phn}
                </StyledTableCell>
                <StyledTableCell >
                  <p className="whitespace-nowrap">
                    {formatDateTime(row.date_time)}
                  </p>
                </StyledTableCell>
                <StyledTableCell>{row.order_id}</StyledTableCell>
                <StyledTableCell >
                  {row.order_method}
                </StyledTableCell>
                <StyledTableCell>
                  {getStatus(row.order_method, row.m_status)}
                </StyledTableCell>
                <StyledTableCell >{`$${priceFormate(
                  row.amt
                )}`}</StyledTableCell>
                <StyledTableCell >
                  <Link
                    className="whitespace-nowrap text-[#0A64F9]"
                    to={`/order/store-reporting/order-summary/${props.merchant_id}/${row.order_id}`}
                    // onClick={() => handleSummeryPage(row.order_id)}
                    target="_blank"
                  >
                    {/* Order Summery */}
                    <img src={Summery} alt="" className="pl-1" />
                  </Link>
                </StyledTableCell>
              </StyledTableRow>
            ))
          ) : (
            <p className="p-2">No record found</p>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
