import React, { useEffect, useState } from "react";
import { fetchEmployeeListData } from "../../../Redux/features/EmployeeList/EmployeeListSlice";
import { useSelector, useDispatch } from "react-redux";
import "../../../Styles/EmployeeList/employeeList.css";
import { useAuthDetails } from "../../../Common/cookiesHelper";
import { Grid } from "@mui/material";

import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { SortTableItemsHelperFun } from "../../../helperFunctions/SortTableItemsHelperFun";
import sortIcon from "../../../Assests/Category/SortingW.svg";
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

const EmployeelistReport = () => {
  const [employeeData, setAllEmployeeData] = useState([]);
  const { LoginGetDashBoardRecordJson, LoginAllStore, userTypeData } =
    useAuthDetails();

  const AllEmployeeListState = useSelector((state) => state.employeeDataList);
  const dispatch = useDispatch();
  let merchant_id = LoginGetDashBoardRecordJson?.data?.merchant_id;
  useEffect(() => {
    const fetchData = async () => {
      let data = {
        merchant_id,
        ...userTypeData,
      };

      if (data) {
        dispatch(fetchEmployeeListData(data));
      }
    };

    fetchData();
  }, [dispatch]);

  // useEffect(() => {
  //   if (
  //     !AllEmployeeListState.loading &&
  //     AllEmployeeListState.employeeListData
  //   ) {
  //     setAllEmployeeData(AllEmployeeListState.employeeListData);
  //   }
  // }, [AllEmployeeListState.loading, AllEmployeeListState.employeeListData]);

  useEffect(() => {
    if (
      !AllEmployeeListState.loading &&
      AllEmployeeListState.employeeListData
    ) {
      const updatedData = AllEmployeeListState?.employeeListData?.map(
        (data) => {
          const fullName = `${data?.f_name} ${data?.l_name}`;
          return { ...data, fullName: fullName };
        }
      );
      // console.log(AllInventoryAccessState.employeeListData)
      setAllEmployeeData(updatedData);
    }
  }, [AllEmployeeListState.loading,AllEmployeeListState.employeeListData]);

  // console.log(employeeData)
  const [sortOrder, setSortOrder] = useState("asc");
  const sortByItemName = (type, name) => {
    const { sortedItems, newOrder } = SortTableItemsHelperFun(
      employeeData,
      type,
      name,
      sortOrder
    );
    setAllEmployeeData(sortedItems);
    setSortOrder(newOrder);
  };
  return (
    <>
      <Grid container className="box_shadow_div">
        <Grid item xs={12}>
          <Grid container sx={{ padding: 2.5 }}>
            <Grid item xs={12}>
              <div className="q_details_header">Employee List </div>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={12}>
              <TableContainer>
                <StyledTable
                  sx={{ minWidth: 500 }}
                  aria-label="customized table"
                >
                  <TableHead>
                    <StyledTableCell>
                      <button
                        className="flex items-center"
                        onClick={() => sortByItemName("str", "fullName")}
                      >
                        <p>Employee Name</p>
                        <img src={sortIcon} alt="" className="pl-1" />
                      </button>
                    </StyledTableCell>
                    <StyledTableCell>
                    <button
                        className="flex items-center"
                        onClick={() => sortByItemName("num", "pin")}
                      >
                        <p>PIN</p>
                        <img src={sortIcon} alt="" className="pl-1" />
                      </button>
                      </StyledTableCell>
                    <StyledTableCell>Contact</StyledTableCell>
                    <StyledTableCell>
                    <button
                        className="flex items-center"
                        onClick={() => sortByItemName("str", "email")}
                      >
                        <p>Email</p>
                        <img src={sortIcon} alt="" className="pl-1" />
                      </button>
                      </StyledTableCell>
                    <StyledTableCell>
                      Address</StyledTableCell>
                  </TableHead>
                  <TableBody>
                    {employeeData && employeeData?.length >= 1 ? (
                      employeeData?.map((employee, index) => (
                        <StyledTableRow key={index}>
                          <StyledTableCell>
                            <p>{employee?.fullName}</p>
                          </StyledTableCell>
                          <StyledTableCell>
                            <p>{employee?.pin}</p>
                          </StyledTableCell>
                          <StyledTableCell>
                            <p>{employee?.phone}</p>
                          </StyledTableCell>
                          <StyledTableCell>
                            <p>{employee?.email}</p>
                          </StyledTableCell>
                          <StyledTableCell>
                            <p>
                              {" "}
                              {employee
                                ? [
                                    employee.address,
                                    employee.city,
                                    employee.state,
                                    employee.zipcode,
                                  ]
                                    .filter(Boolean)
                                    .join(", ")
                                : ""}
                            </p>
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
        </Grid>
      </Grid>
      {/* <div className="q-attributes-bottom-detail-section">
        <div className="q-attributes-bottom-header-sticky">
          <div className="q-attributes-bottom-header">
            <span>Employee List</span>
          </div>
          <div className="q-daily-report-bottom-report-header">
            <p className="report-sort">Employee Name</p>
            <p className="report-title">Contact</p>
            <p className="report-title">Email</p>
            <p className="report-title">Address</p>
          </div>
          <div className="q-category-bottom-categories-listing">
            {employeeData &&
              employeeData.length >= 1 &&
              employeeData.map((employee, index) => (
                <div
                  className="q-category-bottom-categories-listing"
                  key={index}
                >
                  <div className="q-category-bottom-categories-single-category">
                    <p className="report-sort">
                      {employee.f_name} {employee.l_name}
                    </p>
                    <p className="report-title">{employee.phone}</p>
                    <p className="report-title">{employee.email}</p>
                    <p className="report-title">{employee.address}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div> */}
    </>
  );
};

export default EmployeelistReport;
