import React, { useEffect, useState } from "react";
import AddIcon from "../../Assests/Category/addIcon.svg";
import DeleteIcon from "../../Assests/Category/deleteIcon.svg";
import EditIcon from "../../Assests/Category/editIcon.svg";
import SortIcon from "../../Assests/Category/Sorting.svg";
import Cookies from "js-cookie";
import CryptoJS from "crypto-js";
import {
  fetchCategoriesData,
  deleteCategory,
  updateCategoryStatus,
} from "../../Redux/features/Categories/categoriesSlice";
import { useSelector, useDispatch } from "react-redux";
import ViewItemsModal from "./ViewItemsModal";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { SortableContainer, SortableElement } from "react-sortable-hoc";

import { Link } from "react-router-dom";
import CheckBoxField from "../../reuseableComponents/CheckBoxField";
import DraggableTable from "../../reuseableComponents/DraggableTable";
import RadioSelect from "./RadioSelect";
import { BASE_URL, SORT_CATOGRY_DATA } from "../../Constants/Config";
import { useAuthDetails } from "./../../Common/cookiesHelper";
import { ToastifyAlert } from "../../CommonComponents/ToastifyAlert";
import DeleteModal from "../../reuseableComponents/DeleteModal";
import PasswordShow from "../../Common/passwordShow";

const CategoryDetail = ({ seVisible,setProductId }) => {
  const { LoginGetDashBoardRecordJson, LoginAllStore, userTypeData } =
    useAuthDetails();
  const {handleCoockieExpire,getUnAutherisedTokenMessage}=PasswordShow()
  const [allcategories, setallcategories] = useState([]);
  const [reorderedItems, setreorderedItems] = useState([]);

  const AllCategoriesDataState = useSelector((state) => state.categories);
  const dispatch = useDispatch();

  let AuthDecryptDataDashBoardJSONFormat = LoginGetDashBoardRecordJson;

  const merchant_id = AuthDecryptDataDashBoardJSONFormat?.data?.merchant_id;

  let data = {
    merchant_id: merchant_id,
    ...userTypeData,
  };
  // console.log(data)

  // console.log(tokenData)
  useEffect(() => {
    // if (data) {
    //   // console.log(data)
    //   dispatch(fetchCategoriesData(data));
    // }
    getfetchCategorieData()
  }, []);
  const getfetchCategorieData=async()=>{
    try{
      let data = {
        merchant_id: merchant_id,
        ...userTypeData,
      };
      if (data) {
        await dispatch(fetchCategoriesData(data)).unwrap();
      }
    }catch(error){
      handleCoockieExpire()
      getUnAutherisedTokenMessage()
    }
  }

  useEffect(() => {
    if (
      !AllCategoriesDataState.loading &&
      AllCategoriesDataState.categoriesData
    ) {
      setallcategories(AllCategoriesDataState.categoriesData);
    }
  }, [
    AllCategoriesDataState,
    AllCategoriesDataState.loading,
    AllCategoriesDataState.categoriesData,
  ]);

  // const handleDeleteCategory = (id) => {
  //   const data = {
  //     id: id,
  //     ...userTypeData,
  //   };

  //   const userConfirmed = window.confirm(
  //     "Are you sure you want to delete this Category?"
  //   );
  //   if (userConfirmed) {
  //     if (id) {
  //       // dispatch(deleteCategory(data));
  //       // ToastifyAlert("Category Deleted", "success");
  //     }
  //   } else {
  //     console.log("Deletion canceled by user");
  //   }
  // };

  const [deleteCategoryId, setDeleteCategoryId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const handleDeleteCategory = (id) => {
    setDeleteCategoryId(id);
    setDeleteModalOpen(true);
  };
  const confirmDeleteCategory = () => {
    try {
      if(deleteCategoryId){
        const data = {
          id: deleteCategoryId,
          ...userTypeData,
        };
        if (data) {
          dispatch(deleteCategory(data));
          ToastifyAlert("Deleted Successfully", "success");
        }
      }
      setDeleteCategoryId(null)
      setDeleteModalOpen(false);
    } catch (error) {
      handleCoockieExpire()
      getUnAutherisedTokenMessage()
    }
  };

  // for  Category Status update
  const handleToggleStatus = async (id, status) => {
    console.log("category id and status: " + id, status);
    const data = {
      id: id,
      status: status,
      merchant_id,
      ...userTypeData,
    };

    const rep = await dispatch(updateCategoryStatus(data));
    if (rep.payload === "Success") {
      // alert("Status Success Updated");
      ToastifyAlert("Updated Successfully", "success");
      let datas = {
        merchant_id,
      };
      if (datas) {
        dispatch(fetchCategoriesData(data));
      }
    }
  };

  const handleOnlineChange = (category) => {
    let status =
      category.cat_show_status === "0" || category.cat_show_status === "1"
        ? "1"
        : "0";
    const isOnlineChecked =
      category.cat_show_status === "0" || category.cat_show_status === "1";
    const isRegisterChecked =
      category.cat_show_status === "0" || category.cat_show_status === "2";

      console.log('alls', category, isOnlineChecked, isRegisterChecked)

    if (!isOnlineChecked && !isRegisterChecked) {
      // console.log(isOnlineChecked);
      status = 1;
    } else if (isOnlineChecked && !isRegisterChecked) {
      status = 3;
    } else if (!isOnlineChecked && isRegisterChecked) {
      status = 0;
    } else if (isOnlineChecked && isRegisterChecked) {
      status = 2;
    }
    handleToggleStatus(category.id, status, category);
  };

  const handleRegisterChange = (id, status, category) => {
    const isOnlineChecked =
      category.cat_show_status === "0" || category.cat_show_status === "1";
    const isRegisterChecked =
      category.cat_show_status === "0" || category.cat_show_status === "2";

    if (!isOnlineChecked && !isRegisterChecked) {
      status = 2;
    } else if (!isOnlineChecked && isRegisterChecked) {
      status = 3;
    } else if (isOnlineChecked && isRegisterChecked) {
      status = 1;
    } else if (isOnlineChecked && !isRegisterChecked) {
      status = 0;
    }
    handleToggleStatus(id, status, category);
  };

  // for viewmodal
  const handleViewItemsClick = (selectedView) => {};

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const onDragEnd = (result) => {
    // Check if the drag ended outside of the droppable area
    if (!result.destination) {
      alert("You can't drop outside the list!");
      return;
    }

    // Check if the item was dropped at the same position
    if (result.destination.index === result.source.index) {
      alert("You haven't moved the item!");
      return;
    }

    const reorderedItems = reorder(
      allcategories,
      result.source.index,
      result.destination.index
    );

    setallcategories(reorderedItems);

    alert("Are you sure you want to sort item!");
    //console.log(result);
  };

  return (
    <>
      <div className="box">
        <div className="q-category-bottom-detail-section">
          <div className="categoryTable">
            <div className="q-category-bottom-header">
              <span>Category</span>
              <Link to={`/inventory/category/add`}>
              <p>
                Add Category <img src={AddIcon} alt="add-icon" />{" "}
              </p>
              </Link>
            </div>
            <DraggableTable
              tableHead={["Sort", "Title", "Items", "Enable/Disable", "", ""]}
              tableRow={allcategories}
              setFunction={setallcategories}
              viewSelectedOption={{
                viewSelectedOptionEnable: true,
                fun1: handleOnlineChange,
                fun2: handleRegisterChange,
              }}
              viewSelectedOptionFun={handleViewItemsClick}
              radioButtonComponent={true}
              editBtnCategory={{
                editButtonEnable: true,
                editButtonurl: "/inventory/category/edit-category/",
              }}
              deleteButton={{
                deleteButtonEnable: true,
                deleteButtonFun: handleDeleteCategory,
              }}
              table={"collection"}
              className="q-category-bottom-categories-single-category"
              seVisible={seVisible}
              setProductId={setProductId}
            />
            {/* <div className="q-category-bottom-categories-header">
              <p className="categories-data-sort">Sort</p>
              <p className="categories-data-title">Title</p>
              <p className="categories-data-items">Items</p>
              <p className="categories-enable-disable">Enable/Disable</p>
            </div> */}
          </div>
          {/* <div className="q-category-bottom-categories-listing">
            
            {allcategories &&
              allcategories.length >= 1 &&
              allcategories.map((category, index) => (
                <div
                  key={index}
                  className="q-category-bottom-categories-single-category"
                >
                  <p className="categories-data-sort">
                    <img src={SortIcon} alt="add-icon" />
                  </p>
                  <p className="categories-data-title">{category.title}</p>
                  <p className="categories-data-items">
                    <ViewItemsModal
                      selectedView={category}
                      onViewClick={handleViewItemsClick}
                    />
                  </p>
                  <p className="categories-enable-disable">
                    <div className="category-checkmark-div">
                      <label className="category-checkmark-label">
                        Online
                        <input
                          type="checkbox"
                          checked={
                            category.cat_show_status === "0" ||
                            category.cat_show_status === "1"
                              ? true
                              : false
                          }
                          onChange={() =>
                            handleOnlineChange(
                              category.id,
                              category.cat_show_status === "0" ||
                                category.cat_show_status === "1"
                                ? "1"
                                : "0",
                              category
                            )
                          }
                        />
                        <span className="category-checkmark"></span>
                      </label>
                      <label className="category-checkmark-label">
                        Register
                        <input
                          type="checkbox"
                          checked={
                            category.cat_show_status === "0" ||
                            category.cat_show_status === "2"
                              ? true
                              : false
                          }
                          onChange={() =>
                            handleRegisterChange(
                              category.id,
                              category.cat_show_status === "0" ||
                                category.cat_show_status === "2"
                                ? "2"
                                : "0",
                              category
                            )
                          }
                        />
                        <span className="category-checkmark"></span>
                      </label>
                    </div>
                  </p>
                  <div className="q_cat_del_edit_img">
                    <Link to={`/category/edit-category/${category.id}`}>
                      <img
                        className="edit_center w-8 h-8"
                        selectedCategory={category}
                        src={EditIcon}
                        alt="Edit"
                      />
                    </Link>

                    <img
                      className="edit_center w-8 h-8"
                      src={DeleteIcon}
                      alt="delete-icon"
                      onClick={() => handleDeleteCategory(category.id)}
                    />
                  </div>
                </div>
              ))}
          </div> */}

          {/* <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
              {(provided) => (
                <div
                  className="q-category-bottom-categories-listing"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {allcategories &&
                    allcategories.length >= 1 &&
                    allcategories.map((category, index) => (
                      <Draggable
                        key={category.id}
                        draggableId={category.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            className="q-category-bottom-categories-single-category"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <p className="categories-data-sort">
                              <img src={SortIcon} alt="add-icon" />
                            </p>
                            <p className="categories-data-title">
                              {category.title}
                            </p>
                            <p className="categories-data-items">
                              <ViewItemsModal
                                selectedView={category}
                                onViewClick={handleViewItemsClick}
                              />
                            </p>
                            <p className="categories-enable-disable">
                              <div className="category-checkmark-div">
                                <label className="category-checkmark-label">
                                  Online
                                  <input
                                    type="checkbox"
                                    checked={
                                      category.cat_show_status === "0" ||
                                      category.cat_show_status === "1"
                                    }
                                    onChange={() =>
                                      handleOnlineChange(
                                        // category.id,
                                        // category.cat_show_status === "0" ||
                                        //   category.cat_show_status === "1"
                                        //   ? "1"
                                        //   : "0",
                                        category
                                      )
                                    }
                                  />
                                  <span className="category-checkmark"></span>
                                </label>
                                <label className="category-checkmark-label">
                                  Register
                                  <input
                                    type="checkbox"
                                    checked={
                                      category.cat_show_status === "0" ||
                                      category.cat_show_status === "2"
                                    }
                                    onChange={() =>
                                      handleRegisterChange(
                                        category.id,
                                        category.cat_show_status === "0" ||
                                          category.cat_show_status === "2"
                                          ? "2"
                                          : "0",
                                        category
                                      )
                                    }
                                  />
                                  <span className="category-checkmark"></span>
                                </label>
                              </div>
                            </p>
                            <div className="q_cat_del_edit_img">
                              <Link
                                to={`/category/edit-category/${category.id}`}
                              >
                                <img
                                  className="edit_center w-8 h-8"
                                  selectedCategory={category}
                                  src={EditIcon}
                                  alt="Edit"
                                />
                              </Link>

                              <img
                                className="edit_center w-8 h-8"
                                src={DeleteIcon}
                                alt="delete-icon"
                                onClick={() =>
                                  handleDeleteCategory(category.id)
                                }
                              />
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext> */}
          <DeleteModal
            headerText="Category"
            open={deleteModalOpen}
            onClose={() => {setDeleteModalOpen(false)}}
            onConfirm={confirmDeleteCategory}
          />
        </div>
      </div>
    </>
  );
};

export default CategoryDetail;
