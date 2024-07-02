import "../../../Styles/TableOrderPage.css";
import React, { useEffect, useState } from "react";
import CrossIcon from "../../../Assests/Dashboard/cross.svg";
// import Pagination from "react-js-pagination";
// import DefaultPagination from "../onlineStoreOrder/DefaultPagination";

import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Grid } from "@mui/material";
import sortIcon from "../../../Assests/Category/SortingW.svg";
import {
  fetchOnlieStoreOrderData,
  fetchOrderChangeStatusData,
  getOrderListCount,
} from "../../../Redux/features/Orders/onlineStoreOrderSlice";
import { useSelector, useDispatch } from "react-redux";
// import DownIcon from "../../../Assests/Dashboard/Down.svg";
import axios from "axios";
import { BASE_URL, CLOSE_ORDER_COLLECT_CASH } from "../../../Constants/Config";
import DownIcon from "../../../Assests/Dashboard/Down.svg";

import UpArrow from "../../../Assests/Dashboard/Up.svg";

import $ from "jquery";
import "datatables.net-dt/css/jquery.dataTables.min.css";
import { SkeletonTable } from "../../../reuseableComponents/SkeletonTable";
import Pagination from "../../../AllUserComponents/Users/UnverifeDetails/Pagination";
import SelectDropDown from "../../../reuseableComponents/SelectDropDown";
import { useNavigate } from "react-router-dom";
import EditCashModel from "./EditCashModel";
import { CurrencyInputHelperFun } from "../../../Constants/utils";
import useDebounce from "../../../hooks/useDebouncs";
import AskConform from "../../../reuseableComponents/AskConform";
import { ToastifyAlert } from "../../../CommonComponents/ToastifyAlert";
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
const OnlineTableViewData = (props) => {
  const navigate = useNavigate();
  // console.log(props)
  const [allOnlineStoreOrder, setAllOnlineStoreOrders] = useState([]);
  console.log("allOnlineStoreOrder", allOnlineStoreOrder);
  const AllInStoreDataState = useSelector((state) => state.onlineStoreOrder);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const debouncedValue = useDebounce(props?.OnlSearchIdData);
  // console.log("debouncedValue", debouncedValue);
  const dispatch = useDispatch();
  // const debouncedValue = useDebounce(searchId);
  useEffect(() => {
    const transactionType = (type) => {
      if (type === "Cash Payment") {
        return "Cash";
      }
      if (type === "Card Payment") {
        return "Online";
      } else {
        return type;
      }
    };
    const fetchData = async () => {
      if (props?.selectedDateRange?.start_date) {
        let data = {
          merchant_id: props.merchant_id,
          order_type: props.OrderTypeData,
          trans_type: transactionType(props.OrderSourceData),
          start_date: props.selectedDateRange?.start_date,
          end_date: props.selectedDateRange?.end_date,
          customer_id: "0",
          search_by:
            props?.OnlSearchIdData !== "" ? props?.OnlSearchIdData : null,
          perpage: rowsPerPage,
          page: debouncedValue === "" ? currentPage : "1",
          // search_by: Boolean(debouncedValue.trim()) ? debouncedValue : null,
          ...props.userTypeData,
        };

        if (data) {
          dispatch(fetchOnlieStoreOrderData(data));
        }
      }
    };
    fetchData();
  }, [
    dispatch,
    //  props,
    props.selectedDateRange, //
    debouncedValue, //
    currentPage, //
    rowsPerPage, //
    // AllInStoreDataState.OrderListCount,
  ]);

  useEffect(() => {
    setCurrentPage(1);
    const transactionType = (type) => {
      if (type === "Cash Payment") {
        return "Cash";
      }
      if (type === "Card Payment") {
        return "Online";
      } else {
        return type;
      }
    };
    dispatch(
      getOrderListCount({
        merchant_id: props.merchant_id, //
        order_type: props.OrderTypeData,
        search_by:
          props?.OnlSearchIdData !== "" ? props?.OnlSearchIdData : null,
        trans_type: transactionType(props.OrderSourceData), //
        start_date: props.selectedDateRange?.start_date, //
        end_date: props.selectedDateRange?.end_date, //
        ...props.userTypeData, //
      })
    );
  }, [
    props.selectedDateRange?.start_date,
    props.selectedDateRange?.end_date,
    debouncedValue,
    // props.OrderTypeData,
    // props.OrderSourceData,
    // AllInStoreDataState.OrderListCount,
    // AllInStoreDataState.onlineStoreOrderData,
  ]);

  useEffect(() => {
    setTotalCount(AllInStoreDataState.OrderListCount);
  }, [AllInStoreDataState.OrderListCount]);

  useEffect(() => {
    if (
      !AllInStoreDataState.loading &&
      AllInStoreDataState.onlineStoreOrderData
    ) {
      setAllOnlineStoreOrders(AllInStoreDataState.onlineStoreOrderData);
    }
  }, [AllInStoreDataState.loading, AllInStoreDataState.onlineStoreOrderData]);
  // console.log("AllInStoreDataState.stocktakeListCount",AllInStoreDataState)
  // for New order dropdown start.
  // useEffect(() => {
  //   const handleSelectChange = (event) => {
  //     const target = event.target;
  //     if (target.classList.contains("custom-selecttable")) {
  //       const orderId = target.getAttribute("data-order-id");
  //       const selectedOption = target.value;
  //       // console.log(`Order ID: ${orderId}, Selected Option: ${selectedOption}`);
  //       var success = window.confirm("Are you sure you want to change status");
  //       if (success == true) {
  //         const FormData = {
  //           merchant_id: props.merchant_id,
  //           order_id: orderId,
  //           m_status: selectedOption,
  //           ...props.userTypeData,
  //         };
  //         if (FormData) {
  //           // console.log("API call hogai");
  //           dispatch(fetchOrderChangeStatusData(FormData));
  //         }
  //       }
  //     }
  //   };
  //   const onlineStoreTable = document.getElementById("OnlineStoreTable");
  //   onlineStoreTable.addEventListener("change", handleSelectChange);

  //   return () => {
  //     onlineStoreTable.removeEventListener("change", handleSelectChange);
  //   };
  // }, []);
  // for New order dropdown end.

  const [showPriceModal, setShowPricModal] = useState(false);
  const [newReceivingAmount, setNewReceivingAmount] = useState("");
  const [newOrderId, setNewOrderId] = useState("");
  const [newOrderAmount, setNewOrderAmount] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // const openPricModal = () => {
  //   setShowPricModal(true);
  // };

  const closePricModal = () => {
    setErrorMessage("");
    setNewReceivingAmount("");
    setShowPricModal(false);
  };

  // for closed order edit button start.
  // useEffect(() => {
  //   const handleSelectclick = (event) => {
  //     const target = event.target;
  //     if (target.classList.contains("edit_center")) {
  //       const NeworderId = target.getAttribute("order-id");
  //       const Neworderamt = target.getAttribute("order-amt");
  //       setShowPricModal(true);
  //       setNewOrderId(NeworderId);
  //       setNewOrderAmount(Neworderamt);
  //     }
  //   };
  //   const onlineStoreTable = document.getElementById("OnlineStoreTable");
  //   onlineStoreTable.addEventListener("click", handleSelectclick);

  //   return () => {
  //     onlineStoreTable.removeEventListener("click", handleSelectclick);
  //   };
  // }, []);
  // for closed order edit button end.

  const changeReceivingAmount = (event) => {
    const inputValue = CurrencyInputHelperFun(event.target.value);
    setNewReceivingAmount(inputValue);
  };

  const handleAddReceivingAmount = async () => {
    const { token, ...otherUserData } = props.userTypeData;
    const newItem = {
      merchant_id: props.merchant_id,
      order_id: newOrderId,
      cash_collected: newReceivingAmount,
      order_amt: newOrderAmount,
    };
    const data = newItem;
    // console.log(data);
    const response = await axios.post(
      BASE_URL + CLOSE_ORDER_COLLECT_CASH,
      { ...data, ...otherUserData },
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    // console.log(response);

    if (response?.data?.status == false) {
      setErrorMessage(response.data.message);
    } else {
      setErrorMessage("");
      setShowPricModal(false);
    }
  };

  $.DataTable = require("datatables.net");
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  // console.log(allOnlineStoreOrder);
  // useEffect(() => {
  //   const modifiedData = Object.entries(allOnlineStoreOrder).map(
  //     ([key, data], i) => {
  //       let status = "";
  //       if (props?.OrderTypeData == "Failed") {
  //         if (data.is_tried == "0") {
  //           status = "Incomplete order";
  //         } else {
  //           status = "Failed payment";
  //         }
  //       } else {
  //         if (data.payment_id === "Cash") {
  //           if (data.m_status === "4") {
  //             status = "Cash-Paid";
  //           } else {
  //             status = "Cash-Pending";
  //           }
  //         } else {
  //           status = "Online-Paid";
  //         }
  //       }

  //       let PayStatus = "";
  //       let OrderStatus = "";

  //       if (data.m_status == 5) {
  //         OrderStatus = "Cancelled";
  //       } else if (data.payment_id == "Cash") {
  //         OrderStatus = "Cash";
  //       } else {
  //         OrderStatus = "Online-Paid";
  //       }

  //       if (props?.OrderTypeData == "Closed") {
  //         if (
  //           OrderStatus == "Cash" &&
  //           parseFloat(data?.cash_collected)?.toFixed(2) !=
  //             parseFloat(data?.amt)?.toFixed(2)
  //         ) {
  //           PayStatus = `<a href="#">
  //           <img class="edit_center" order-id="${data.order_id}" order-amt="${data.amt}" src="/static/media/editIcon.4dccb72a9324ddcac62b9a41d0a042db.svg" alt="Edit">
  //           </a>`;
  //         } else if (OrderStatus == "Cancelled") {
  //           PayStatus = "Cancelled";
  //         } else {
  //           PayStatus = "Paid";
  //         }
  //       } else if (props?.OrderTypeData == "New") {
  //         let cancelOption = "";
  //         if (data.payment_id === "Cash") {
  //           cancelOption = `<option value="5" ${
  //             data.m_status == "5" ? `selected` : ""
  //           }>Cancel</option>`;
  //         }
  //         if (data.order_method == "pickup") {
  //           PayStatus = `<select class="custom-selecttable w-52 cursor-pointer" data-order-id="${
  //             data.order_id
  //           }">
  //             <option value="1" ${
  //               data.m_status == "1" ? `selected` : ""
  //             }>Accepted</option>
  //             <option value="2" ${
  //               data.m_status == "2" ? `selected` : ""
  //             }>Packing</option>
  //             <option value="3" ${
  //               data.m_status == "3" ? `selected` : ""
  //             }>Ready</option>
  //             <option value="4" ${
  //               data.m_status == "4" ? `selected` : ""
  //             }>Completed</option>
  //             ${cancelOption}
  //           </select>`;
  //         } else {
  //           PayStatus = `<select class="custom-selecttable w-52 cursor-pointer" data-order-id="${
  //             data.order_id
  //           }">
  //             <option value="1" ${
  //               data.m_status == "1" ? `selected` : ""
  //             }>Accepted</option>
  //             <option value="2" ${
  //               data.m_status == "2" ? `selected` : ""
  //             }>Packing</option>
  //             <option value="6" ${
  //               data.m_status == "6" ? `selected` : ""
  //             }>Ready</option>
  //             <option value="3" ${
  //               data.m_status == "3" ? `selected` : ""
  //             }>Out for Delivery</option>
  //             <option value="4" ${
  //               data.m_status == "4" ? `selected` : ""
  //             }>Delivered</option>
  //             ${cancelOption}
  //           </select>`;
  //         }
  //       }

  //       return {
  //         Customer: `<span class="text-[#000000] order_method">${
  //           data.deliver_name || ""
  //         }</span><br>${data.delivery_phn || ""}`,
  //         Order: `<span class="text-[#000000] order_method">${
  //           data.order_id || ""
  //         }</span><br><span class="text-[#818181]">${
  //           data.merchant_time || ""
  //         }</span><br><span class="text-[#818181] order_method">${
  //           data.order_method || ""
  //         }</span>`,
  //         Amount: `${
  //           "$" + data.amt || ""
  //         }<br><span class="text-[#1EC26B]">${capitalizeFirstLetter(
  //           data.order_status || ""
  //         )}</span>`,
  //         Status: status,
  //         OrderStatus: PayStatus,
  //         View: `<ahref="/store-reporting/order-summary/${data.order_id}" class="view_details_order">View Details</ahref=>`,
  //       };
  //     }
  //   );

  //   const table = $("#OnlineStoreTable").DataTable({
  //     data: modifiedData,
  //     columns: [
  //       { title: "Customer", data: "Customer", orderable: false },
  //       { title: "Order", data: "Order", orderable: false },
  //       { title: "Amount", data: "Amount", orderable: false },
  //       { title: "Status", data: "Status", orderable: false },
  //       { title: "Order Status", data: "OrderStatus", orderable: false },
  //       { title: " ", data: "View", orderable: false },
  //     ],
  //     destroy: true,
  //     searching: true,
  //     dom: "<'row 'l<'col-sm-12'b>><'row'<'col-sm-7 mt-2'p><'col-sm-5'>>",
  //     lengthMenu: [10, 20, 50],
  //     lengthChange: true,
  //     ordering: false,
  //     language: {
  //       paginate: {
  //         previous: "<",
  //         next: ">",
  //       },
  //     },
  //   });

  //   $("#searchInput").on("input", function () {
  //     table.search(this.value).draw();
  //   });

  //   return () => {
  //     table.destroy();
  //   };
  // }, [allOnlineStoreOrder, props]);

  const [deleteCategoryId, setDeleteCategoryId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const tableRow = ["Customer", "Order", "Amount", "Order Status", ""];
  const pickupStatusList = [
    {
      title: "Accepted",
      value: "1",
    },
    {
      title: "Packing",
      value: "2",
    },
    {
      title: "Ready",
      value: "3",
    },
    {
      title: "Completed",
      value: "4",
    },
  ];
  const deliveryStatusList = [
    {
      title: "Accepted",
      value: "1",
    },
    {
      title: "Packing",
      value: "2",
    },
    {
      title: "Ready",
      value: "6",
    },
    {
      title: "Out for Delivery",
      value: "3",
    },
    {
      title: "Delivered",
      value: "4",
    },
  ];
  const handleDropDownChange = async (option) => {
    setDeleteCategoryId(option);
    setDeleteModalOpen(true);
    console.log("handleDropDownChange", option);

    // Confirming with the user before proceeding
    // var success = window.confirm("Are you sure you want to change status");

    // // Proceed if the user confirms
    // if (success === true) {
    //   // Constructing form data to send to the server

    // }
  };

  const confirmChangeStatus = async () => {
    const FormData = {
      merchant_id: props.merchant_id,
      order_id: deleteCategoryId.orderId,
      m_status: deleteCategoryId.value,
      ...props.userTypeData,
    };

    console.log("confirmDeleteCategory", FormData);

    // Dispatching an action to change the order status
    if (FormData) {
      try {
        const res = await dispatch(fetchOrderChangeStatusData(FormData));
        console.log("setAllOnlineStoreOrders", res);
        // Checking if the API call was successful
        if (res.meta.requestStatus === "fulfilled") {
          // Update the local state with the updated order data
          setAllOnlineStoreOrders((prevState) => {
            // Find the index of the order to update
            const updatedStatusListItem = prevState.find(
              (order) => order.order_id === deleteCategoryId.orderId
            );
            console.log("updateOrder", deleteCategoryId.value);
            if (updatedStatusListItem) {
              let updatedOrders;
              if (
                deleteCategoryId.value === "4" ||
                deleteCategoryId.value === "5"
              ) {
                updatedOrders = prevState.filter(
                  (order) => order.order_id !== deleteCategoryId.orderId
                );
              } else {
                const updatedOrder = {
                  ...updatedStatusListItem,
                  m_status: deleteCategoryId.value,
                };
                updatedOrders = prevState.map((order) =>
                  order.order_id === deleteCategoryId.orderId
                    ? updatedOrder
                    : order
                );
              }
              ToastifyAlert(res.payload, "success");
              return updatedOrders;
            } else {
              ToastifyAlert(res.payload, "error");
              // Order not found, return previous state unchanged
              return prevState;
            }
            // const index = prevState.findIndex(
            //   (order) => order.order_id === deleteCategoryId.orderId
            // );
            // // console.log("setAllOnlineStoreOrders",index)

            // if (index !== -1) {
            //   // Create a copy of the order object
            //   const updatedOrder = { ...prevState[index] };

            //   // Update the m_status field with the new value
            //   updatedOrder.m_status = deleteCategoryId.value;

            //   // Create a new array with updated order object
            //   const updatedOrders = [...prevState];
            //   updatedOrders[index] = updatedOrder;
            //   ToastifyAlert(res.payload, "success");

            //   return updatedOrders;
            // } else {
            //   ToastifyAlert(res.payload, "error");
            //   // Order not found, return previous state unchanged
            //   return prevState;
            // }
          });
        } else {
          // Handle other status codes or errors if needed
          console.error("Failed to update order status:", res.statusText);
          // Optionally show an error message or handle the error state
        }
      } catch (error) {
        console.error("Error while updating order status:", error.message);
        // Handle any network or other errors that may occur during the API call
      }
    }

    setDeleteCategoryId(null);
    setDeleteModalOpen(false);
  };

  const orderStatus = (data) => {
    if (props?.OrderTypeData === "New") {
      const currentList =
        data && data.order_method === "pickup"
          ? pickupStatusList
          : deliveryStatusList;
      const cancelOption = {
        title: "Cancel",
        value: "5",
      };
      const withCanceledOption =
        data.payment_id === "Cash"
          ? [...currentList, cancelOption]
          : currentList;
      const selectedItem = currentList.find(
        (item) => item.value === data.m_status
      ) || { title: "" };
      return (
        <SelectDropDown
          listItem={withCanceledOption.map((item) => ({
            ...item,
            orderId: data.order_id,
          }))}
          title={"title"}
          selectedOption={selectedItem.title}
          onClickHandler={handleDropDownChange}
        />
      );
    }

    let PayStatus = "";
    let OrderStatus = "";

    if (data.m_status == 5) {
      OrderStatus = "Cancelled";
    } else if (data.payment_id === "Cash") {
      OrderStatus = "Cash";
    } else {
      OrderStatus = "Online-Paid";
    }

    if (props?.OrderTypeData === "Closed") {
      if (
        OrderStatus === "Cash" &&
        parseFloat(data?.cash_collected)?.toFixed(2) !=
          parseFloat(data?.amt)?.toFixed(2)
      ) {
        return (
          <>
            <EditCashModel
              changeReceivingAmount={changeReceivingAmount}
              newReceivingAmount={newReceivingAmount}
              handleAddReceivingAmount={handleAddReceivingAmount}
              data={data}
              setNewOrderId={setNewOrderId}
              setNewOrderAmount={setNewOrderAmount}
            />
          </>
        );
      } else if (OrderStatus == "Cancelled") {
        return "Cancelled";
      } else {
        return "Paid";
      }
    }
    if (props?.OrderTypeData === "Failed") {
      console.log("props?.OrderTypeData ");
      if (data.is_tried === "0") {
        return "Incomplete order";
      } else {
        return "Failed payment";
      }
    }
  };
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const [sortOrder, setSortOrder] = useState("asc"); // "asc" for ascending, "desc" for descending

  const sortByItemName = (type, name) => {
    const { sortedItems, newOrder } = SortTableItemsHelperFun(
      allOnlineStoreOrder,
      type,
      name,
      sortOrder
    );
    setAllOnlineStoreOrders(sortedItems);
    setSortOrder(newOrder);
  };

  return (
    <>
      <Grid container className="box_shadow_div">
        <Grid item xs={12}>
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
            <Grid item xs={12}>
              {AllInStoreDataState.loading ? (
                <>
                  <SkeletonTable columns={tableRow} />
                </>
              ) : (
                <>
                  <TableContainer>
                    <StyledTable
                      sx={{ minWidth: 500 }}
                      aria-label="customized table"
                    >
                      <TableHead>
                        {/* {tableRow.map((item, index) => (
                          <StyledTableCell key={item}>{item}</StyledTableCell>
                        ))} */}
                      </TableHead>
                      <TableHead>
                        <StyledTableCell>
                          <button
                            className="flex items-center"
                            onClick={() =>
                              sortByItemName("str", "deliver_name")
                            }
                          >
                            <p className="whitespace-nowrap">Customer</p>
                            <img src={sortIcon} alt="" className="pl-1" />
                          </button>
                        </StyledTableCell>
                        <StyledTableCell>
                          <button
                            className="flex items-center"
                            onClick={() => sortByItemName("id", "order_id")}
                          >
                            <p>Order</p>
                            <img src={sortIcon} alt="" className="pl-1" />
                          </button>
                        </StyledTableCell>
                        <StyledTableCell>
                          <button
                            className="flex items-center"
                            onClick={() => sortByItemName("num", "amt")}
                          >
                            <p>Amount</p>
                            <img src={sortIcon} alt="" className="pl-1" />
                          </button>
                        </StyledTableCell>
                        <StyledTableCell>
                          {/* <button
                            className="flex items-center"
                            onClick={() =>
                              sortByItemName("srt", "m_status")
                            }
                          > */}
                          <p>Order Status</p>
                          {/* <img src={sortIcon} alt="" className="pl-1" /> */}
                          {/* </button> */}
                        </StyledTableCell>
                        <StyledTableCell></StyledTableCell>
                      </TableHead>
                      <TableBody>
                        {allOnlineStoreOrder &&
                        Object.entries(allOnlineStoreOrder).length > 0 ? (
                          Object.entries(allOnlineStoreOrder)?.map(
                            ([key, data], index) => {
                              ////////////////////Showing Status///////////////////////////
                              let status = "";
                              if (props?.OrderTypeData == "Failed") {
                                if (data.is_tried == "0") {
                                  status = "Incomplete order";
                                } else {
                                  status = "Failed payment";
                                }
                              } else {
                                if (data.payment_id === "Cash") {
                                  if (data.m_status === "4") {
                                    status = "Cash-Paid";
                                  } else {
                                    status = "Cash-Pending";
                                  }
                                } else {
                                  status = "Online-Paid";
                                }
                              }
                              /////////////////////end of Showing Stat////////////////////////////////

                              ////////////////////////pickup and delovery dropdown//////////////////////////////////////////

                              /////////////////////end pickup and delovery dropdown//////////////////////////////////////////

                              return (
                                <>
                                  <StyledTableRow key={index}>
                                    <StyledTableCell>
                                      <p className="text-[#000000] order_method">
                                        {data.deliver_name || ""}
                                        {data?.customer_type ? (
                                          <span className="existignCustomerData">
                                            ({data?.customer_type})
                                          </span>
                                        ) : (
                                          ""
                                        )}
                                      </p>
                                      <p className="text-[#818181]">
                                        {data.users_email || ""}
                                      </p>
                                      <p className="text-[#818181]">
                                        {data.delivery_phn || ""}
                                      </p>
                                    </StyledTableCell>
                                    <StyledTableCell>
                                      <p className="text-[#000000] order_method">
                                        {data.order_id || ""}
                                      </p>
                                      <p className="text-[#818181]">
                                        {data.merchant_time || ""}
                                      </p>
                                      <p className="text-[#818181] order_method">
                                        {data.order_method || ""}
                                      </p>
                                    </StyledTableCell>
                                    <StyledTableCell>
                                      <p>{"$" + data.amt || ""}</p>
                                      <p className="text-[#1EC26B]">
                                        {capitalizeFirstLetter(
                                          data.order_status || ""
                                        )}
                                      </p>
                                    </StyledTableCell>
                                    <StyledTableCell>
                                      {orderStatus(data)}
                                    </StyledTableCell>
                                    <StyledTableCell>
                                      <span
                                        className="view_details_order"
                                        onClick={() =>
                                          navigate(
                                            `/order/store-reporting/order-summary/${"MAL0100CA"}/${data.order_id}`
                                          )
                                        }
                                      >
                                        View Details
                                      </span>
                                    </StyledTableCell>
                                  </StyledTableRow>
                                </>
                              );
                            }
                          )
                        ) : (
                          <>
                            <p className="px-5 py-4">No Data Found</p>
                          </>
                        )}
                      </TableBody>
                    </StyledTable>
                  </TableContainer>
                </>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      {/* <div className="q-attributes-bottom-detail-section">
        <div className="q-attributes-bottom-header-sticky">
          <table className="" id="OnlineStoreTable"></table>
        </div>
      </div> */}

      {showPriceModal && (
        <div className="q-custom-modal-container" id="addtributes_">
          {/* Your modal JSX */}
          <div className="q-custom-modal-content">
            {/* Your modal content */}
            <div className="">
              <p className="q-custom-modal-header ">
                Cash Recieving
                <img
                  src={CrossIcon}
                  alt="icon"
                  className="ml-auto mb-4"
                  onClick={closePricModal}
                />
              </p>
            </div>
            {/* ... other modal content ... */}
            <input
              type="number"
              placeholder="Enter Amount"
              className="q-custom-input-field"
              value={newReceivingAmount}
              onChange={changeReceivingAmount}
            />
            <span className="input-error text-[#cc0000] text-[14px]">
              {errorMessage !== "" ? errorMessage : ""}
            </span>
            <div className="q-add-categories-section-middle-footer">
              <button
                onClick={handleAddReceivingAmount}
                className="quic-btn quic-btn-save"
              >
                Save
              </button>
              <button
                onClick={closePricModal}
                className="quic-btn quic-btn-cancle"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <AskConform
        headerText="change status"
        open={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
        }}
        onConfirm={confirmChangeStatus}
      />
    </>
  );
};

export default OnlineTableViewData;
