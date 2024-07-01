import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import "../../Styles/EmployeeList/employeeList.css";
import AddIcon from "../../Assests/Category/addIcon.svg";
import AddPermissionModal from "./AddPermissionModal";
import EditPermissionModal from "./EditPermissionModal";
import DeleteIcon from "../../Assests/Category/deleteIcon.svg";
import EditIcon from "../../Assests/Category/editIcon.svg";
import View from "../../Assests/VerifiedMerchant/View.svg";
import Edit from "../../Assests/VerifiedMerchant/Edit.svg";
import Delete from "../../Assests/Category/deleteIcon.svg";
import DisLike from "../../Assests/VerifiedMerchant/DisLike.svg";
import DeleteModal from "../../reuseableComponents/DeleteModal";
import PasswordShow from "./../../Common/passwordShow";

import {
  fetchPermissionData,
  deletePermission,
} from "../../Redux/features/Permission/PermissionSlice";
import { useAuthDetails } from "../../Common/cookiesHelper";
import {
  Grid,
  Pagination,
  TableContainer,
  TableHead,
  tableCellClasses,
  TableCell,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import InputTextSearch from "../../reuseableComponents/InputTextSearch";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import PasswordShow from "./../../Common/passwordShow";

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

const PermissionList = () => {

  const {handleCoockieExpire,getUnAutherisedTokenMessage}=PasswordShow()
  const navigate = useNavigate();
  const [allpermission, setAllPermission] = useState([]);

  const [filteredMerchants, setFilteredMerchants] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [searchRecord, setSearchRecord] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [VerifiedMerchantListState, setVerifiedMerchantListState] = useState(
    []
  );

  const AllPermissionDataState = useSelector((state) => state.permissionRed);
  const { userTypeData } = useAuthDetails();
  const dispatch = useDispatch();

  useEffect(  () => {
   
    getpermissionData()
  }, []);
  const getpermissionData = async() =>{
    try {
      let data = {
        ...userTypeData,
      };
      if(data){
        await dispatch(fetchPermissionData(userTypeData)).unwrap();
      }
    } catch (error) {
      handleCoockieExpire()
      getUnAutherisedTokenMessage()
    }
  }

  useEffect(() => {
    if (
      !AllPermissionDataState.loading &&
      AllPermissionDataState.permissionData
    ) {
      setAllPermission(AllPermissionDataState.permissionData);
    }
  }, [AllPermissionDataState.loading, AllPermissionDataState.permissionData]);

  /*const handleDeletePermission = (id) => {
    const data = {
      id: id,
      ...userTypeData,
    };
    const userConfirmed = window.confirm(
      "Are you sure you want to delete this ?"
    );
    if (userConfirmed) {
      if (id) {
        dispatch(deletePermission(data));
      }
    } else {
      console.log("Deletion canceled by user");
    }
  };*/

  const [deletePermissionId, setDeletePermissionId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const handleDeletePermission = (id) => {
    setDeletePermissionId(id);
    setDeleteModalOpen(true);
  };
  const confirmDeleteCategory = async () => {
   
    try {
      if (deletePermissionId) {
        const data = {
          id: deletePermissionId,
          ...userTypeData,
        };
        if (data) {
         await dispatch(deletePermission(data)).unwrap();
        }
      }
      setDeletePermissionId(null);
      setDeleteModalOpen(false);
    } catch (error) {
      handleCoockieExpire()
      getUnAutherisedTokenMessage()
    }
  };

  // const handleSearchInputChange = (value) => {
  //   console.log(value);
  //   setSearchRecord(value);

  //   const filteredAdminRecord =
  //     filteredMerchants && Array.isArray(filteredMerchants)
  //       ? filteredMerchants.filter(
  //           (result) =>
  //             (result.owner_name &&
  //               result.permission
  //                 .toLowerCase()
  //                 .includes(searchRecord.toLowerCase())) ||
  //             (result.name &&
  //               result.sub_permission
  //                 .toLowerCase()
  //                 .includes(searchRecord.toLowerCase())) ||
  //             (result.email &&
  //               result.email.toLowerCase().includes(searchRecord.toLowerCase()))
  //         )
  //       : [];

  //   console.log("filteredAdminRecord", filteredAdminRecord);
  //   setVerifiedMerchantListState(filteredAdminRecord);
  // };

  const handleSearchInputChange = (value) => {
    setSearchRecord(value);

    if (value === "") {
      // If search input is empty, display the entire dataset
      setAllPermission(AllPermissionDataState?.permissionData);
    } else {
      // Filter managerList.ManagerRecord based on search term
      const filteredRecords = AllPermissionDataState?.permissionData?.filter(
        (record) => {
          // Convert search term to lowercase for case-insensitive search
          const searchTerm = value.toLowerCase();
          // Check if any of the fields contain the search term
          return (
            record?.purmission?.toLowerCase().includes(searchTerm) ||
            record?.sub_permission?.toLowerCase().includes(searchTerm)
          );
        }
      );

      // Update the managerTable state with filtered records
      setAllPermission(filteredRecords);
    }
  };

  return (
    <>
      <div className="q-attributes-bottom-detail-section">
        <Grid container className="box_shadow_div">
          <Grid item xs={12}>
            <div className="q-attributes-bottom-header">
              <span>Permission</span>
              {/* <p className="" >
              Add New Sub Permission <img src={AddIcon} alt="add-icon" /> 
            </p> */}
              <AddPermissionModal />
            </div>
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
            {/* <Grid container sx={{ padding: 2.5 }}>
              <Grid item xs={12}>
                <Pagination
                  currentPage={currentPage}
                  totalItems={totalCount}
                  itemsPerPage={rowsPerPage}
                  onPageChange={paginate}
                  rowsPerPage={rowsPerPage}
                  setRowsPerPage={setRowsPerPage}
                />
              </Grid>
            </Grid> */}
            <Grid container>
              <TableContainer>
                <StyledTable
                  sx={{ minWidth: 500 }}
                  aria-label="customized table"
                >
                  <TableHead>
                    {/* {TableRow.map((row) => (
                    <StyledTableCell>{row}</StyledTableCell>
                  ))} */}
                    <StyledTableCell>Sub Permission</StyledTableCell>
                    <StyledTableCell>Permission</StyledTableCell>
                    <StyledTableCell></StyledTableCell>
                    <StyledTableCell></StyledTableCell>
                  </TableHead>
                  <TableBody>
                    {allpermission?.length
                      ? allpermission?.map((data, index) => {
                          return (
                            <StyledTableRow>
                              {/* <StyledTableCell>
                              <div class="flex">
                                <div class="text-[#000000] order_method capitalize">
                                  {data?.sub_permission}
                                </div>
                                <div class="mx-2 ">(State: {data.a_state})</div>
                              </div>
                              <div class="text-[#818181] lowercase">
                                {data?.permission?.length < 18
                                  ? data?.permission
                                  : data?.permission?.slice(0, 18) + `...` ||
                                    ""}
                              </div>
                            </StyledTableCell> */}
                              <StyledTableCell>
                                <div class="text-[#000000] order_method ">
                                  {data?.sub_permission}
                                </div>
                              </StyledTableCell>
                              <StyledTableCell>
                                <div class="text-[#000000] order_method capitalize">
                                  {data?.permission?.length < 18
                                    ? data?.permission
                                    : data?.permission?.slice(0, 18) + `...` ||
                                      ""}
                                </div>
                              </StyledTableCell>
                              <StyledTableCell>
                                  <EditPermissionModal selected={data} />
                              </StyledTableCell>
                              <StyledTableCell>
                                <img class="delete cursor-pointer" data-id="${[data.id,data.merchant_id,]}"
                                  onClick={() => handleDeletePermission(data?.id)} 
                                  src={Delete} alt="Delete" />
                              </StyledTableCell>
                            </StyledTableRow>
                          );
                        })
                      : ""}
                  </TableBody>
                </StyledTable>
              </TableContainer>
            </Grid>
          </Grid>
        </Grid>
        <DeleteModal
          headerText="Permission"
          open={deleteModalOpen}
          onClose={() => {
            setDeleteModalOpen(false);
          }}
          onConfirm={confirmDeleteCategory}
        />

        {/* <div className="q-attributes-bottom-header-sticky">
          <div className="q-attributes-bottom-header">
            <span>Permission</span>

            <AddPermissionModal />
          </div>
          <div className="q-daily-report-bottom-report-header">
            <p className="report-sort">Sr.No</p>
            <p className="report-title">Sub Permission</p>
            <p className="report-title">Permission</p>
            <p className="report-title"></p>
            <p className="report-title"></p>
          </div>
          <div className="q-category-bottom-categories-listing">
            {allpermission &&
              allpermission.length >= 1 &&
              allpermission.map((permission, index) => (
                <div
                  className="q-category-bottom-categories-listing"
                  key={index}
                >
                  <div className="q-category-bottom-categories-single-category">
                    <p className="report-sort">{index + 1}</p>
                    <p className="report-title">{permission.sub_permission}</p>
                    <p className="report-title">{permission.permission}</p>
                    <p className="report-title">
                      <EditPermissionModal selected={permission} />
                    </p>
                    <p className="report-title">
                      {" "}
                      <img
                        src={DeleteIcon}
                        alt="Delete-icon"
                        className="h-8 w-8"
                        onClick={() => handleDeletePermission(permission.id)}
                      />
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div> */}
      </div>
    </>
  );
};

export default PermissionList;
