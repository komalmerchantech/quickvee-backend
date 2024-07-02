import React, { useEffect, useRef, useState } from "react";
import SearchableDropdown from "../../CommonComponents/SearchableDropdown";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import DeleteIcon from "../../Assests/Category/deleteIcon.svg";
import {
  assignPrefferedVendor,
  assignProductVendor,
  bulkVendorAssign,
  deleteProductVendor,
  fetchProductsDataById,
  fetchVendorList,
  filterVendorAPI,
  getAlreadyAssignVendor,
  saveVendorList,
} from "../../Redux/features/Product/ProductSlice";
import { useDispatch } from "react-redux";
import Switch from "@mui/material/Switch";
import CircularProgress from "@mui/material/CircularProgress";
import { Box } from "@mui/material";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import Loader from "../../CommonComponents/Loader";
import { ToastifyAlert } from "../../CommonComponents/ToastifyAlert";
import { useAuthDetails } from "../../Common/cookiesHelper";
import PasswordShow from "../../Common/passwordShow";

const BulkVendorEdit = ({
  productData,
  varientIndex,
  modalType,
  handleCloseEditModal,
  isVarientEdit
}) => {
  const dispatch = useDispatch();
  const { userTypeData, LoginGetDashBoardRecordJson } = useAuthDetails();
  const {getUnAutherisedTokenMessage} = PasswordShow();
  const [selectedVendor, setSelectedVendor] = useState([]);
  const [fetchDataLoadingVendor, setFetchDataLoadingVendor] = useState(false);
  const [vendor, setVendor] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const productId = useParams();

  const handleSelectProductOptions = (value, name) => {
    setSelectedVendor((prev) => [...prev, value]);
  };

  const handleDeleteSelectedOption = (id, name) => {
    const filterOptionItems = selectedVendor.filter((item) => item?.id !== id);
    setSelectedVendor(filterOptionItems);
  };

  const [vendorItems, setVendorItems] = useState([]);

  // onchange of costperItem and
  const handleVendorCostPerItem = (e, index, vendorId) => {
    const { name, value, type, checked } = e.target;

    let updateVandorItems;
    // when type is checkbox run block of code
    if (type === "checkbox" && modalType === "single_vendor") {
      updateVandorItems = vendorItems.map((item, i) => ({
        ...item,
        isPreferred: i === index ? checked : false,
      }));
      const formData = new FormData();
      formData.append(
        "single_product",
        isVarientEdit ? 0:
        !Boolean(+productData?.isvarient) && !isVarientEdit ? 1 : 0
      );
      formData.append(
        "varient_id",
        !Boolean(+productData?.isvarient)
          ? productData?.id
          : modalType === "bulk-edit"
            ? productData?.id
            : varientIndex
      );
      formData.append("vendor_id", vendorId);

      dispatch(assignPrefferedVendor(formData))
        .then((res) => {
          if (res?.payload?.status) {
            ToastifyAlert("Updated Successfully", "success");
          }
        })
        .catch((err) => {
          ToastifyAlert("Error!", "error");
          getUnAutherisedTokenMessage();
        });
    } else if (type === "checkbox" && modalType === "bulk-edit") {
      updateVandorItems = vendorItems.map((item, i) => ({
        ...item,
        isPreferred: i === index ? checked : false,
      }));
    }
    // when type is input run block of code
    else {
      /// allowed costPerItem value in 0.00
      let fieldValue;
      fieldValue = value
        // Remove extra dots and ensure only one dot exists at most
        .replace(/[^\d.]/g, "") // Allow digits and dots only
        .replace(/^(\d*\.)(.*)\./, "$1$2") // Remove extra dots
        .replace(/^(\d*\.\d*)(.*)\./, "$1$2"); // Remove extra dots after the decimal point

      let inputStr = fieldValue.replace(/\D/g, "");
      inputStr = inputStr.replace(/^0+/, "");

      if (inputStr.length == "") {
        fieldValue = "";
      } else if (inputStr.length === 1) {
        fieldValue = "0.0" + inputStr;
      } else if (inputStr.length === 2) {
        fieldValue = "0." + inputStr;
      } else {
        fieldValue =
          inputStr.slice(0, inputStr.length - 2) + "." + inputStr.slice(-2);
      }

      updateVandorItems = [...vendorItems];
      updateVandorItems[index]["costPerItem"] = fieldValue;
    }

    setVendorItems(updateVandorItems);
  };

  // fetch data when modal open
  const fetchBulkVendorData = () => {
    /// called vendor api for get already assign vendor
    setFetchDataLoadingVendor(true);
    let isVarient = Boolean(+productData?.isvarient);
    const formData = new FormData();
    formData.append(
      "varient_id",
      !isVarient
        ? productData?.id
        : modalType === "bulk-edit" && Boolean(+productData?.isvarient)
          ? productData?.id
          : varientIndex
    );
    formData.append(
      "merchant_id",
      LoginGetDashBoardRecordJson?.data?.merchant_id
    );
    formData.append("single_product", isVarientEdit ? 0 :  isVarient && !isVarientEdit ? 0 : 1);
    formData.append("login_type", userTypeData?.login_type);
    formData.append("token_id", userTypeData?.token_id);
    formData.append("token", userTypeData?.token);

    dispatch(getAlreadyAssignVendor(formData))
      .then((res) => {
        if (res?.payload?.status) {
          const assign_vendor_data = res?.payload?.result?.map((item) => ({
            ...item,
            costPerItem: item?.cost_per_item,
            isPreferred: Boolean(+item?.pref_vendor),
          }));
          setVendorItems(assign_vendor_data);
        }
      })
      .catch((err) => console.log(err))
      .finally(() => setFetchDataLoadingVendor(false));
  };

  // fetch vendor data here...
  useEffect(() => {
    // initially fetch data from vendor API and fill the dropdown list data
    let isVarient = Boolean(+productData?.isvarient);
    const formData = new FormData();
    formData.append(
      "varient_id",
      !isVarient 
        ? productData?.id
        : modalType === "bulk-edit" && Boolean(+productData?.isvarient)
          ? productData?.id
          : varientIndex
    );
    formData.append(
      "merchant_id",
      LoginGetDashBoardRecordJson?.data?.merchant_id
    );
    formData.append("single_product", isVarientEdit ? 0 : isVarient && !isVarientEdit ? 0 : 1);
    formData.append("login_type", userTypeData?.login_type);
    formData.append("token_id", userTypeData?.token_id);
    formData.append("token", userTypeData?.token);

    // called vendor api for dropdown vendor data
    dispatch(fetchVendorList(formData)).then((res) => {
      if (res?.payload?.status) {
        setVendor(res?.payload?.result);
      }
    });

    // called function for get already assign vendor data
    fetchBulkVendorData();
  }, []);

  // when add vendor button is click
  const handleAddVendor = () => {
    setLoading(true);
    if (modalType !== "bulk-edit") {
      const formData = new FormData();

      formData.append(
        "single_product",
        isVarientEdit ? 0: !Boolean(+productData?.isvarient) && !isVarientEdit ? 1 : 0
      );
      formData.append(
        "varient_id",
        !Boolean(+productData?.isvarient)
          ? productData?.id
          : modalType === "bulk-edit"
            ? productData?.id
            : varientIndex
      );
      formData.append(
        "vendor_id",
        selectedVendor?.map((item) => item?.id)?.toString()
      );
            
            formData.append("login_type", userTypeData?.login_type);
      formData.append("token_id", userTypeData?.token_id);
      formData.append("token", userTypeData?.token);
      
      

      dispatch(assignProductVendor(formData))
        .then((res) => {
          if (res?.payload?.status) {
            setVendorItems((prev) => [
              ...prev,
              ...selectedVendor.map((vendor) => ({
                ...vendor,
                costPerItem: "",
                isPreferred: false,
              })),
            ]);
            const formData = new FormData();
            formData.append(
              "merchant_id",
              LoginGetDashBoardRecordJson?.data?.merchant_id
            );
            formData.append("id", productId?.id);

            ToastifyAlert("Added Successfully", "success");

            setSelectedVendor([]);
          }
        })
        .catch((err) => {
          getUnAutherisedTokenMessage();
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setVendorItems((prev) => [...prev, ...selectedVendor]);
      setSelectedVendor([]);
      setLoading(false);
    }
  };

  // when click on delete icon // delete vendor by Id
  const handleDeleteVendor = (vendorId) => {
    /// show prompt before delete the item
    const userConfirmed = window.confirm(
      "Are you sure you want to delete this vendor?"
    );

    if (!userConfirmed) {
      return; // If the user clicks "No", exit the function
    }

    // formData
    if (modalType !== "bulk-edit") {
      const formData = new FormData();
      formData.append(
        "single_product",
        isVarientEdit ? 0: !Boolean(+productData?.isvarient) && !isVarientEdit ? 1 : 0
      );
      formData.append(
        "varient_id",
        !Boolean(+productData?.isvarient)
          ? productData?.id
          : modalType === "bulk-edit"
            ? productData?.id
            : varientIndex
      );
      formData.append("vendor_id", vendorId);
      dispatch(deleteProductVendor(formData))
        .then((res) => {
          if (res?.payload?.status) {
            const filtervendorList = vendorItems?.filter(
              (item) => +item?.id !== +vendorId
            );
            setVendorItems(filtervendorList);

            ToastifyAlert("Deleted Successfully", "success");
          }
        })
        .catch((err) => {
          ToastifyAlert("Error!", "error");
          getUnAutherisedTokenMessage();
        });
    } else {
      const filtervendorList = vendorItems?.filter(
        (item) => +item?.id !== +vendorId
      );
      setVendorItems(filtervendorList);
    }
  };

  // when click on save vendor
  // save all the selected vendor
  const handleSaveVendorList = () => {
    const formData = new FormData();
    const bulkFormData = new FormData();
    setSubmitLoading(true);

    /// send formData payload when single varient
    formData.append(
      "single_product",
      isVarientEdit ? 0: !Boolean(+productData?.isvarient) && !isVarientEdit ? 1 : 0
    );
    formData.append(
      "variant_id",
      !Boolean(+productData?.isvarient)
        ? productData?.id
        : modalType === "bulk-edit"
          ? productData?.id
          : varientIndex
    );
    formData.append(
      "costperItem",
      vendorItems?.map((i) => i?.costPerItem).toString()
    );
    formData.append("vendor_id", vendorItems?.map((i) => i?.id).toString());
    formData.append("login_type", userTypeData?.login_type);
    formData.append("token_id", userTypeData?.token_id);
    formData.append("token", userTypeData?.token);
    

    /// send bulkFormData when multiple varient and bulkModal is open
    bulkFormData.append("product_id", productId?.id);
    bulkFormData.append(
      "vendor_id",
      vendorItems?.map((i) => i?.id)?.toString()
    );
    bulkFormData.append(
      "costperItem",
      vendorItems?.map((i) => i?.costPerItem)?.toString()
    );
    bulkFormData.append(
      "merchant_id",
      LoginGetDashBoardRecordJson?.data?.merchant_id
    );
    bulkFormData.append(
      "prefferd_vendor",
      vendorItems?.filter((i) => Boolean(+i?.isPreferred))[0]?.id ?? ""
    );
    bulkFormData.append("login_type", userTypeData?.login_type);
    bulkFormData.append("token_id", userTypeData?.token_id);
    bulkFormData.append("token", userTypeData?.token);

    if (modalType === "bulk-edit") {
      formData.append("vendor_id", vendorItems?.map((i) => i?.id).toString());

      dispatch(bulkVendorAssign(bulkFormData))
        .then((res) => {
          if (res?.payload?.status) {
            ToastifyAlert("Updated successfully!", "success");
            handleCloseEditModal();
          }
        })
        .catch(() => {
          ToastifyAlert("Error!", "error");
          getUnAutherisedTokenMessage();
        })
        .finally(() => {
          setSubmitLoading(false);
        });
    } else {
      dispatch(saveVendorList(formData))
        .then((res) => {
          if (res?.payload?.status) {
            ToastifyAlert("Updated successfully!", "success");
            handleCloseEditModal();
          }
        })
        .catch(() => {
          ToastifyAlert("Error!", "error");
          getUnAutherisedTokenMessage();
        })
        .finally(() => {
          setSubmitLoading(false);
        });
    }
  };

  return (
    <div class="bulk-vendor-edit">
      <div class="add-vendor-area">
        <div className="q-add-categories-single-input">
          <div class="vendor-add-input">
            <SearchableDropdown
              keyName="stores"
              optionList={vendor}
              handleSelectProductOptions={handleSelectProductOptions}
              handleDeleteSelectedOption={handleDeleteSelectedOption}
              selectedOption={selectedVendor}
              // error,
              // handleUpdateError,
              hideSelectedValue={true}
              hideSelectedList={vendorItems}
              name="name"
              placeholder="Enter vendor Name"
            />
            <button
              className="quic-btn quic-bulk-vendor-edit"
              onClick={handleAddVendor}
              style={{
                backgroundColor: "#0A64F9",
              }}
              disabled={!selectedVendor?.length}
            >
              {loading ? (
                <Box className="vendor-add-loading">
                  <CircularProgress />
                </Box>
              ) : (
                "Add"
              )}
            </button>
          </div>
        </div>

        {fetchDataLoadingVendor ? (
          <div>
            <Loader />
          </div>
        ) : (
          <>
            <TableContainer
              component={Paper}
              className="bulkvendor-table-container"
            >
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Vendors</TableCell>
                    <TableCell align="center">Cost Per Item</TableCell>
                    <TableCell align="center">Preferred Vendor</TableCell>
                    <TableCell align="center">Delete</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {vendorItems?.length ? (
                    vendorItems.map((row, index) => (
                      <TableRow
                        key={row.id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {row.name}
                        </TableCell>
                        <TableCell align="center">
                          <input
                            type="text"
                            className="vendor-cost-input"
                            placeholder="$ 0.00"
                            name="costPerItem"
                            onChange={(e) =>
                              handleVendorCostPerItem(e, index, row?.id)
                            }
                            value={vendorItems[index]["costPerItem"]}
                            maxLength={9}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Switch
                            name="online"
                            id="online"
                            checked={vendorItems[index]["isPreferred"] || false}
                            onChange={(e) =>
                              handleVendorCostPerItem(e, index, row?.id)
                            }
                            sx={{
                              "& .MuiSwitch-switchBase.Mui-checked": {
                                color: "#0A64F9",
                              },
                              "& .MuiSwitch-track": {
                                backgroundColor: "#0A64F9",
                              },
                            }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          {" "}
                          <img
                            src={DeleteIcon}
                            alt=""
                            className=" m-auto d-grid place-content-center"
                            width="30px"
                            style={{ cursor: "pointer" }}
                            onClick={() => handleDeleteVendor(row?.id)}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <p className="no-vendor-text">No Vendor Selected</p>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <div className="box">
              <div className="variant-attributes-container">
                {/* Your existing JSX for variant attributes */}
                <div className="q-add-categories-section-middle-footer  ">
                  {!!!varientIndex ? (
                    <p className="bulk-edit-note">
                      <span className="note">Note:</span>
                      By clicking on update, it will assign selected vendor as
                      Preferred vendor to all Variants
                    </p>
                  ) : (
                    ""
                  )}
                  <div className="q-category-bottom-header">
                    <button
                      className="quic-btn quic-btn-update"
                      style={{
                        backgroundColor: "#0A64F9",
                      }}
                      onClick={handleSaveVendorList}
                      disabled={!vendorItems?.length || submitLoading}
                    >
                      {submitLoading ? (
                        <Box className="loader-box">
                          <CircularProgress />
                        </Box>
                      ) : (
                        "Update"
                      )}
                    </button>
                    <button
                      className="quic-btn quic-btn-cancle"
                      onClick={handleCloseEditModal}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BulkVendorEdit;
