import * as React from "react";
import { useState } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import SortIcon from "../Assests/Category/Sorting.svg";
import EditIcon from "../Assests/Category/editIcon.svg";
import DeleteIcon from "../Assests/Category/deleteIcon.svg";
import ViewItemsModal from "../Components/Category/ViewItemsModal";
import RadioSelect from "../Components/Category/RadioSelect";
import { Link } from "react-router-dom";
import EditDeliveryAddress from "../Components/Attributes/EditAttribute";
import axios from "axios";
import { BASE_URL, SORT_CATOGRY_DATA } from "../Constants/Config";
import { useDispatch } from "react-redux";
import { fetchCategoriesData } from "../Redux/features/Categories/categoriesSlice";
import { fetchAttributesData } from "../Redux/features/Attributes/attributesSlice";
import { useAuthDetails } from "../Common/cookiesHelper";
import EditTaxesModal from "../Components/StoreSetting/Taxes/EditTaxesModal";
import EditEmployeeModal from "../Components/StoreSetting/AddEmployee/EditEmployeeModal";
import Permission from "../Assests/Employee/Permission.svg";
import AlertModal from "./AlertModal";
import SortModal from "./SortModal";
import { useNavigate } from "react-router-dom";
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#253338",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
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

const DraggableTable = ({
  tableHead,
  tableRow,
  setFunction,
  viewSelectedOption = false,
  viewSelectedOptionFun,
  editBtnCategory = false,
  deleteButton = false,
  editAttributeObj = false,
  editTaxesObj = false,
  deleteTaxButton = false,
  table,
  employeeTable = false,
  editBtnEmployee = false,
  states,
  setVisible,
  setEmployeeId,
  setProductId,
  seVisible,
}) => {
  console.log('tableRow', tableRow);
  const dispatch = useDispatch();
  const { LoginGetDashBoardRecordJson, LoginAllStore, userTypeData } =
    useAuthDetails();
  const { viewSelectedOptionEnable, fun1, fun2 } = viewSelectedOption;
  const { deleteButtonEnable, deleteButtonFun } = deleteButton;
  const { deleteTaxButtonEnable, deletetaxButtonFun } = deleteTaxButton;
  const { editButtonEnable, editButtonurl } = editBtnCategory;
  const { editButtonEnableEmployee, editButtonurlEmployee } = editBtnEmployee;

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [alertModalHeaderText, setAlertModalHeaderText] = useState("");
  const showModal = (headerText) => {
    setAlertModalHeaderText(headerText);
    setAlertModalOpen(true);
  };

  const [dragresult, setDragresult] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const onDragEnd = async (result) => {
    // Check if the drag ended outside of the droppable area
    if (!result.destination) {
      // alert("You can't drop outside the list!");
      showModal("You can't drop outside the list!");
      return;
    }

    // Check if the item was dropped at the same position
    if (result.destination.index === result.source.index) {
      // alert("You haven't moved the item!");
      showModal("You haven't moved the item!");
      return;
    }

    // const reorderedItems = reorder(
    //   tableRow,
    //   result.source.index,
    //   result.destination.index
    // );
    setDragresult(result);
    const sourceIndex = result.source.index;
    const targetIndex = result.destination.index;

    const reorderedItems = reorder(tableRow, sourceIndex, targetIndex);

    const draggedAlternateName = reorderedItems[sourceIndex].alternateName;
    const destinationAlternateName = reorderedItems[targetIndex].alternateName;
    let merchant_id = LoginGetDashBoardRecordJson?.data?.merchant_id;

    // Create a new array with updated alternateName values
    const updatedItems = reorderedItems.map((item, index) => {
      /* if (index === sourceIndex) {
        return { ...item, alternateName: destinationAlternateName };
      }
      if (index === targetIndex) {
        return { ...item, alternateName: draggedAlternateName };
      } */

      return item;
    });
    console.log("update Row of Category", updatedItems);

    const alternameList = {};
    updatedItems.forEach((category, index) => {
      alternameList[`values[${category.id}]`] = tableRow[index].alternateName;
    });
    setDeleteModalOpen(true);

    // let data = {
    //   table: table,
    //   merchant_id: merchant_id,
    //   token_id: userTypeData?.token_id,
    //   login_type: userTypeData?.login_type,
    // };
    // const userConfirmed = window.confirm(
    //   "Are you sure you want to sort items?"
    // );
    // if (userConfirmed) {
    //   setFunction(updatedItems);
    //   try {
    //     const response = await axios.post(
    //       BASE_URL + SORT_CATOGRY_DATA,
    //       { ...data, ...alternameList },
    //       {
    //         headers: {
    //           "Content-Type": "multipart/form-data",
    //           Authorization: `Bearer ${userTypeData?.token}`,
    //         },
    //       }
    //     );
    //     let data_merchant_id = {
    //       merchant_id: merchant_id,
    //       ...userTypeData,
    //     };
    //     if (table === "collection") {
    //       if (data_merchant_id) {
    //         dispatch(fetchCategoriesData(data_merchant_id));
    //       }
    //     }
    //     if (table === "varients") {
    //       if (data_merchant_id) {
    //         dispatch(fetchAttributesData(data_merchant_id));
    //       }
    //     }
    //     console.log("API response:", response.data);
    //   } catch (error) {
    //     console.error("API call failed:", error);
    //   }
    // } else {
    //   console.log("Sorting canceled by user");
    // }
  };
  const handleEditEmployeePermission = (id) => {
    setVisible("EmployeePermission");
    setEmployeeId(id);
  };
  const navigate = useNavigate();
  const handleEditCategory = (id) => {
    seVisible("EditCategory");
    setProductId(id);
  };

  const confirmDeleteCategory = async () => {
    console.log('run this drag');
    const sourceIndex = dragresult.source.index;
    const targetIndex = dragresult.destination.index;
    const reorderedItems = reorder(tableRow, sourceIndex, targetIndex);
    let merchant_id = LoginGetDashBoardRecordJson?.data?.merchant_id;

    let data = {
      table: table,
      merchant_id: merchant_id,
      token_id: userTypeData?.token_id,
      login_type: userTypeData?.login_type,
    };
    const updatedItems = reorderedItems.map((item, index) => {
      return item;
    });
    const alternameList = {};
    updatedItems.forEach((category, index) => {
      alternameList[`values[${category.id}]`] = tableRow[index].alternateName;
    });
    // console.log("altername",alternameList)
    // return

    if (dragresult) {
      setFunction(updatedItems);
      try {
        const response = await axios.post(
          BASE_URL + SORT_CATOGRY_DATA,
          { ...data, ...alternameList },
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${userTypeData?.token}`,
            },
          }
        );
        let data_merchant_id = {
          merchant_id: merchant_id,
          ...userTypeData,
        };
        if (table === "collection") {
          if (data_merchant_id) {
            dispatch(fetchCategoriesData(data_merchant_id));
          }
        }
        if (table === "varients") {
          if (data_merchant_id) {
            dispatch(fetchAttributesData(data_merchant_id));
          }
        }
        console.log("API response:", response.data);
      } catch (error) {
        console.error("API call failed:", error);
      }
    }
    setDragresult(null);
    setDeleteModalOpen(false);
  };
  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 500 }}>
          <TableHead>
            <TableRow>
              {tableHead &&
                tableHead.map((item, index) => (
                  <StyledTableCell key={item}>{item}</StyledTableCell>
                ))}
            </TableRow>
          </TableHead>

          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
              {(provided) => (
                <TableBody ref={provided.innerRef} {...provided.droppableProps}>
                  {tableRow &&
                    tableRow.length >= 1 &&
                    tableRow.map((item, index) => {
                      return (
                        <Draggable
                          key={item.id}
                          draggableId={item.id}
                          index={index}
                        >
                          {(provided) => (
                            <StyledTableRow
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <StyledTableCell>
                                <img src={SortIcon} alt="add-icon" />
                              </StyledTableCell>
                              {employeeTable ? (
                                <StyledTableCell>
                                  {item.f_name} {item.l_name}
                                </StyledTableCell>
                              ) : (
                                ""
                              )}
                              {employeeTable ? (
                                <StyledTableCell>{item.phone}</StyledTableCell>
                              ) : (
                                ""
                              )}
                              {employeeTable ? (
                                <StyledTableCell>{item.email}</StyledTableCell>
                              ) : (
                                ""
                              )}
                              {employeeTable ? (
                                <StyledTableCell>{item.pin}</StyledTableCell>
                              ) : (
                                ""
                              )}
                              {employeeTable ? (
                                <StyledTableCell>{item.role}</StyledTableCell>
                              ) : (
                                ""
                              )}

                              {employeeTable ? (
                                ""
                              ) : (
                                <StyledTableCell>{item.title}</StyledTableCell>
                              )}
                              {item.percent ? (
                                <StyledTableCell>
                                  {item.percent}
                                </StyledTableCell>
                              ) : (
                                ""
                              )}
                              {viewSelectedOption && (
                                <StyledTableCell>
                                  <ViewItemsModal
                                    selectedView={item}
                                    onViewClick={viewSelectedOptionFun}
                                  />
                                </StyledTableCell>
                              )}
                              {viewSelectedOptionEnable && (
                                <StyledTableCell>
                                  <RadioSelect
                                    item={item}
                                    handleOnlineChange={fun1}
                                    handleRegisterChange={fun2}
                                  />
                                </StyledTableCell>
                              )}
                              {editButtonEnable && (
                                <StyledTableCell>
                                  {/* <Link to={`inventory/category/edit-category/${item.id}`}> */}
                                  <div className="permissionEditBTN">
                                  <span
                                    // to={`${editButtonurl}${item.id}`}
                                    onClick={() => {
                                      navigate(`${editButtonurl}${item.id}`)
                                      handleEditCategory(item.id);
                                    }}
                                    className="cursor-pointer"
                                  >
                                    <img
                                      // className="edit_center w-8 h-8"
                                      selectedCategory={item}
                                      src={EditIcon}
                                      alt="Edit"
                                    />
                                  </span>
                                  </div>
                                  {/* </Link> */}
                                </StyledTableCell>
                              )}
                              {item.title === "DefaultTax" ? (
                                <>
                                  {editTaxesObj && (
                                    <>
                                      <StyledTableCell
                                        align="right"
                                        className="categories_add_delete "
                                      >
                                        <EditTaxesModal selectedTaxe={item} />
                                      </StyledTableCell>
                                      <StyledTableCell></StyledTableCell>
                                    </>
                                  )}
                                </>
                              ) : (
                                <>
                                  {editTaxesObj && (
                                    <>
                                      <StyledTableCell align="right">
                                        <EditTaxesModal selectedTaxe={item} />
                                      </StyledTableCell>
                                    </>
                                  )}
                                  {deleteTaxButton && (
                                    <StyledTableCell>
                                      <img
                                        className="cursor-pointer"
                                        src={DeleteIcon}
                                        alt="delete-icon"
                                        onClick={() =>
                                          deletetaxButtonFun(item.id)
                                        }
                                      />
                                    </StyledTableCell>
                                  )}
                                </>
                              )}

                              {editButtonEnableEmployee && (
                                <>
                                  <StyledTableCell>
                                    <span
                                      onClick={() => {
                                        handleEditEmployeePermission(item.id);
                                      }}
                                      className="cursor-pointer"
                                    >
                                      <img
                                        // className="edit_center w-8 h-8"
                                        src={Permission}
                                        alt="Permission-icon"
                                      />
                                    </span>
                                  </StyledTableCell>
                                </>
                              )}

                              {employeeTable && (
                                <>
                                  <StyledTableCell align="right">
                                    <EditEmployeeModal
                                      selectedTaxe={item}
                                      employee={item}
                                      states={states}
                                    />
                                  </StyledTableCell>
                                </>
                              )}

                              {deleteButton && (
                                <StyledTableCell>
                                  <img
                                    className="cursor-pointer"
                                    src={DeleteIcon}
                                    alt="delete-icon"
                                    onClick={() => deleteButtonFun(item.id)}
                                  />
                                </StyledTableCell>
                              )}
                              {editAttributeObj && (
                                <StyledTableCell align="right">
                                  <EditDeliveryAddress
                                    attribute={item}
                                    allattributes={tableRow}
                                  />
                                </StyledTableCell>
                              )}
                            </StyledTableRow>
                          )}
                        </Draggable>
                      );
                    })}
                  {provided.placeholder}
                </TableBody>
              )}
            </Droppable>
          </DragDropContext>
        </Table>
      </TableContainer>
      <AlertModal
        headerText={alertModalHeaderText}
        open={alertModalOpen}
        onClose={() => {
          setAlertModalOpen(false);
        }}
      />
      <SortModal
        headerText="sort items"
        open={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
        }}
        onConfirm={confirmDeleteCategory}
      />
    </>
  );
};

export default DraggableTable;
