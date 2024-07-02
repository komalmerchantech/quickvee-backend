import React from "react";
import { formData } from "./data";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Grid } from "@mui/material";

import AddNewCategory from "../../Assests/Dashboard/Left.svg";

const GeneratePUC = ({
  handleVarientTitleBasedItemList,
  handleOnChange,
  formValue,
  handleGenerateUPC,
  handleBlur,
  isMultipleVarient,
  productInfo,
  error,
  inventoryData,
  handleCloseEditModal,
  productData,
  varientData,
  isVarientEdit,
}) => {
  console.log('productData', productData);
  const navigate = useNavigate();
  const location = useLocation();
  const pageUrl =
    window.location.pathname.split("/")[1] +
    "/" +
    window.location.pathname.split("/")[2] +
    "/" +
    window.location.pathname.split("/")[3];

    console.log('pageUrl', pageUrl, inventoryData);

  const findVarientName = productData?.product_name?.split("~");
  console.log('findVarientName', findVarientName);

  const varientTitle = handleVarientTitleBasedItemList();
  const { varientProduct } = useSelector((state) => state?.productsListData);
  const setInputMaxLength = (fieldname) => {
    switch (fieldname) {
      case "costPerItem":
      case "compareAtPrice":
      case "price":
      case "profit":
      case "margin":
        return 9;
      case "reorderQty":
      case "qty":
      case "reorderLevel":
        return 6;
      case "upcCode":
      case "customCode":
        return 20;
      default:
        return 9;
    }
  };
  const disabledFields = ["margin", "profit"];
  const disabledFieldsOnEdit = ["margin", "profit", "qty"];

  const disabledInput = (inp, formDisabledKey) => {
    if (
      pageUrl !== "inventory/products/edit" &&
      disabledFields.includes(inp?.name)
    ) {
      return true;
    } else if (
      pageUrl === "inventory/products/edit"  &&
      inp?.name === "qty" &&
      !formDisabledKey?.notEditable
    ) {
      return false;
    } else if (
      pageUrl === "inventory/products/edit"  &&
      disabledFieldsOnEdit.includes(inp?.name) ||  pageUrl === "inventory/products/varient-edit"  &&
      disabledFieldsOnEdit.includes(inp?.name)
    ) {
      return true;
    } else if (
      pageUrl === "inventory/products/edit"   &&
      +inventoryData?.cost_method === 1 &&
      inp?.name === "costPerItem" &&
      !!formDisabledKey?.notEditable ||
      pageUrl === "inventory/products/varient-edit" &&
      +inventoryData?.cost_method === 1 &&
      inp?.name === "costPerItem" &&
      !!formDisabledKey?.notEditable
    ) {
      return true;
    }
    return false;
  };

  const handleRedirectHistory = (varientIndex, varientTitle) => {
    console.log('varientTitle', varientTitle);
    const varientName = varientTitle ? Object.keys(varientTitle)?.[0] : "";
    let url;  
    if (varientIndex === null) {
      window.open(
        `/inventory/products/saleshistory/${productData?.id}?title=${productInfo?.title}`
      );
    } else if (isVarientEdit) {
      window.open(
        `/inventory/products/saleshistory/${productData?.product_id}/${productData?.id
        }?title=${productData?.product_name?.split("~")?.[0]
        }&varientName=${varientTitle}`
      );
    } else {
      window.open(
        `/inventory/products/saleshistory/${productData?.id}/${varientIndex}?title=${productInfo?.title}&varientName=${varientName}`
      );
    }
  };

  return (
    <>
      <div className="mx-0">
        <div className="q-add-categories-single-input">
          <div className="q-category-bottom-header" style={{ padding: "1px 20px" }}>
            {isVarientEdit ? 
            <span
              onClick={() => {
                navigate("/inventory/products");
              }}
              className="varient-edit-text"
            >
              <img src={AddNewCategory} alt="Add-New-Category" />
              <span className="title">Variants</span>
            </span>:""
            }
            {/* <span className="varient-edit-text"> {isVarientEdit ? "Variants" : ''}</span> */}
          </div>
          {formValue?.length ? (
            <div className="q-category-bottom-header">
              <span>
                {isMultipleVarient
                  ? "Variants"
                  : productInfo?.title
                    ? productInfo?.title
                    : isVarientEdit
                      ? productData?.product_name
                      : "ProductName"}
              </span>
              <span>

              </span>
              {!isVarientEdit ? (
                <p onClick={() => handleGenerateUPC(20)}>
                  Generate UPC
                  {/* <img src={AddIcon} alt="add-icon" />{" "} */}
                </p>
              ) : (
                ""
              )}
            </div>
          ) : (
            ""
          )}
          {varientTitle?.length && isMultipleVarient
            ? varientTitle?.map((title, index) => {
              return (
                <div className="qvrow product-varient-form" key={index}>
                  {isMultipleVarient ? (
                    <div className="mx-4 my-4">
                      {productInfo?.title
                        ? productInfo?.title + "  -  " + varientTitle[index]
                        : varientTitle[index]}
                    </div>
                  ) : (
                    ""
                  )}
                  <Grid container spacing={2}>
                    {formData?.length
                      ? formData?.map((inp, i) => {
                        return (
                          // <div className="col-qv-2" key={i}>
                          <Grid item xs={6} sm={4} md={3} lg={2.4}>
                            <div className="q-add-categories-single-input">
                              <label>{inp?.label}</label>
                              <div className="input_area">
                                <input
                                  class="varient-input-field"
                                  type={inp?.type}
                                  name={inp?.name}
                                  value={
                                    formValue?.[index]?.[title]?.[inp?.name]
                                  }
                                  placeholder={inp?.placeholder}
                                  onChange={(e) =>
                                    handleOnChange(e, index, title)
                                  }
                                  onBlur={(e) =>
                                    handleBlur(e, index, title)
                                  }
                                  maxLength={setInputMaxLength(inp?.name)}
                                  disabled={disabledInput(
                                    inp,
                                    formValue?.[index]?.[title]
                                  )}
                                />
                                {!!formValue?.[index]?.[title]?.[
                                  "comparePriceError"
                                ] && inp?.name === "compareAtPrice" ? (
                                  <span className="error-alert">
                                    {
                                      formValue?.[index]?.[title]?.[
                                      "comparePriceError"
                                      ]
                                    }
                                  </span>
                                ) : (
                                  ""
                                )}
                                {!!formValue?.[index]?.[title]?.[
                                  "upcError"
                                ] && inp?.name === "upcCode" ? (
                                  <span
                                    className="error-alert"
                                    style={{ display: "block" }}
                                  >
                                    {
                                      formValue?.[index]?.[title]?.[
                                      "upcError"
                                      ]
                                    }
                                  </span>
                                ) : (
                                  ""
                                )}
                                {error[
                                  `formValue[${index}].${title}.${inp?.name}`
                                ] ? (
                                  <span className="error-alert">
                                    {
                                      error[
                                      `formValue[${index}].${title}.${inp?.name}`
                                      ]
                                    }
                                  </span>
                                ) : (
                                  ""
                                )}
                              </div>
                            </div>
                            {/* // </div> */}
                          </Grid>
                        );
                      })
                      : ""}
                  </Grid>
                  <div className="flex flex-wrap gap-3 ">
                    <label
                      class="q_resigter_setting_section"
                      style={{ color: "#000", fontSize: "18px" }}
                    >
                      Track Quantity
                      <input
                        type="checkbox"
                        name="trackQuantity"
                        value={formValue?.[index]?.[title]?.["trackQuantity"]}
                        onChange={(e) => handleOnChange(e, index, title)}
                        checked={
                          formValue?.[index]?.[title]?.["trackQuantity"]
                        }
                      />
                      <span class="checkmark"></span>
                    </label>
                    <label
                      class="q_resigter_setting_section"
                      style={{ color: "#000", fontSize: "18px" }}
                    >
                      Continue selling when out of stock
                      <input
                        type="checkbox"
                        name="sellOutOfStock"
                        value={
                          formValue?.[index]?.[title]?.["sellOutOfStock"]
                        }
                        onChange={(e) => handleOnChange(e, index, title)}
                        checked={
                          formValue?.[index]?.[title]?.["sellOutOfStock"]
                            ? true
                            : false
                        }
                      />
                      <span class="checkmark"></span>
                    </label>
                    <label
                      class="q_resigter_setting_section"
                      style={{ color: "#000", fontSize: "18px" }}
                    >
                      Check ID
                      <input
                        type="checkbox"
                        name="checkId"
                        value={formValue?.[index]?.[title]?.["checkId"]}
                        onChange={(e) => handleOnChange(e, index, title)}
                        checked={
                          formValue?.[index]?.[title]?.["checkId"]
                            ? true
                            : false
                        }
                      />
                      <span class="checkmark"></span>
                    </label>
                    <label
                      class="q_resigter_setting_section"
                      style={{ color: "#000", fontSize: "18px" }}
                    >
                      Disable
                      <input
                        type="checkbox"
                        name="disable"
                        value={formValue?.[index]?.[title]?.["disable"]}
                        onChange={(e) => handleOnChange(e, index, title)}
                        checked={
                          formValue?.[index]?.[title]?.["disable"]
                            ? true
                            : false
                        }
                      />
                      <span class="checkmark"></span>
                    </label>
                    <label
                      class="q_resigter_setting_section"
                      style={{ color: "#000", fontSize: "18px" }}
                    >
                      Food Stampable
                      <input
                        type="checkbox"
                        name="isFoodStamble"
                        value={formValue?.[index]?.[title]?.["isFoodStamble"]}
                        onChange={(e) => handleOnChange(e, index, title)}
                        checked={
                          formValue?.[index]?.[title]?.["isFoodStamble"]
                            ? true
                            : false
                        }
                      />
                      <span class="checkmark"></span>
                    </label>
                    {/* <label
                        class="q_resigter_setting_section"
                        style={{ color: "#000", fontSize: "18px" }}
                      >
                        Create this item for all linked locations
                        <input
                          type="checkbox"
                          name="itemForAllLinkedLocation"
                          value={
                            formValue?.[index]?.["itemForAllLinkedLocation"]
                          }
                          onChange={(e) => handleOnChange(e, index)}
                          checked={
                            formValue?.[index]?.["itemForAllLinkedLocation"]
                              ? true
                              : false
                          }
                        />
                        <span class="checkmark"></span>
                      </label> */}
                  </div>

                  {pageUrl === "inventory/products/edit" &&
                    formValue?.[index]?.[title]?.notEditable ? (
                    <div class="edit-profile-btns">
                      <button
                        className="quic-btn quic-btn-save vendor-btn"
                        // onClick={handleSubmitForm}
                        // disabled={isLoading}
                        style={{
                          backgroundColor: "#0A64F9",
                        }}
                        onClick={() =>
                          handleCloseEditModal(
                            "single_vendor",
                            formValue?.[index]?.[title]?.productEditId
                          )
                        }
                      >
                        Vendors
                      </button>
                      <button
                        className="quic-btn quic-btn-save"
                        // onClick={handleSubmitForm}
                        // disabled={isLoading}
                        style={{
                          backgroundColor: "#0A64F9",
                        }}
                        onClick={() =>
                          handleRedirectHistory(
                            formValue?.[index]?.[title]?.productEditId,
                            formValue?.[index]
                          )
                        }
                      >
                        Sales History
                      </button>
                      <button
                        className="quic-btn quic-btn-save edit"
                        // onClick={handleSubmitForm}
                        // disabled={isLoading}
                        style={{
                          backgroundColor: "#0A64F9",
                        }}
                        onClick={() =>
                          handleCloseEditModal(
                            "single_instant",
                            formValue?.[index]?.[title]?.productEditId
                          )
                        }
                      >
                        Instant PO
                      </button>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              );
            })
            : ""}

          {!isMultipleVarient ? (
            <div className="qvrow">
              <div className="mx-4 my-4">{varientTitle?.[0]}</div>

              <Grid container spacing={2}>
                {formData?.length
                  ? formData?.map((inp, i) => {
                    return (
                      // <div className="col-qv-2" key={i}>
                      <Grid item xs={6} sm={4} md={3} lg={2.4}>
                        <div className="q-add-categories-single-input">
                          <label>{inp?.label}</label>
                          <div className="input_area">
                            <input
                              class="varient-input-field"
                              type={inp?.type}
                              name={inp?.name}
                              value={formValue?.[0]?.[inp?.name]}
                              placeholder={inp?.placeholder}
                              onChange={(e) => handleOnChange(e, 0)}
                              onBlur={(e) => handleBlur(e, 0)}
                              maxLength={setInputMaxLength(inp?.name)}
                              disabled={disabledInput(inp, formValue?.[0])}
                            />
                            {!!formValue?.[0]?.["comparePriceError"] &&
                              inp?.name === "compareAtPrice" ? (
                              <span className="error-alert">
                                {formValue?.[0]?.["comparePriceError"]}
                              </span>
                            ) : (
                              ""
                            )}
                            {!!formValue?.[0]?.["upcError"] &&
                              inp?.name === "upcCode" ? (
                              <span
                                className="error-alert"
                                style={{ display: "block" }}
                              >
                                {formValue?.[0]?.["upcError"]}
                              </span>
                            ) : (
                              ""
                            )}
                            {error[`formValue[0].${inp?.name}`] ? (
                              <span className="error-alert">
                                {error[`formValue[0].${inp?.name}`]}
                              </span>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                        {/* // </div> */}
                      </Grid>
                    );
                  })
                  : ""}
              </Grid>
              <div className="flex flex-wrap gap-3 ">
                <label
                  class="q_resigter_setting_section"
                  style={{ color: "#000", fontSize: "18px" }}
                >
                  Track Quantity
                  <input
                    type="checkbox"
                    name="trackQuantity"
                    value={formValue?.[0]?.["trackQuantity"]}
                    onChange={(e) => handleOnChange(e, 0)}
                    checked={formValue?.[0]?.["trackQuantity"]}
                  />
                  <span class="checkmark"></span>
                </label>
                <label
                  class="q_resigter_setting_section"
                  style={{ color: "#000", fontSize: "18px" }}
                >
                  Continue selling when out of stock
                  <input
                    type="checkbox"
                    name="sellOutOfStock"
                    value={formValue?.[0]?.["sellOutOfStock"]}
                    onChange={(e) => handleOnChange(e, 0)}
                    checked={formValue?.[0]?.["sellOutOfStock"] ? true : false}
                  />
                  <span class="checkmark"></span>
                </label>
                <label
                  class="q_resigter_setting_section"
                  style={{ color: "#000", fontSize: "18px" }}
                >
                  Check ID
                  <input
                    type="checkbox"
                    name="checkId"
                    value={formValue?.[0]?.["checkId"]}
                    onChange={(e) => handleOnChange(e, 0)}
                    checked={formValue?.[0]?.["checkId"] ? true : false}
                  />
                  <span class="checkmark"></span>
                </label>
                <label
                  class="q_resigter_setting_section"
                  style={{ color: "#000", fontSize: "18px" }}
                >
                  Disable
                  <input
                    type="checkbox"
                    name="disable"
                    value={formValue?.[0]?.["disable"]}
                    onChange={(e) => handleOnChange(e, 0)}
                    checked={formValue?.[0]?.["disable"] ? true : false}
                  />
                  <span class="checkmark"></span>
                </label>
                <label
                  class="q_resigter_setting_section"
                  style={{ color: "#000", fontSize: "18px" }}
                >
                  Food Stampable
                  <input
                    type="checkbox"
                    name="isFoodStamble"
                    value={formValue?.[0]?.["isFoodStamble"]}
                    onChange={(e) => handleOnChange(e, 0)}
                    checked={formValue?.[0]?.["isFoodStamble"] ? true : false}
                  />
                  <span class="checkmark"></span>
                </label>
                {/* <label
                  class="q_resigter_setting_section"
                  style={{ color: "#000", fontSize: "18px" }}
                >
                  Create this item for all linked locations
                  <input
                    type="checkbox"
                    name="itemForAllLinkedLocation"
                    value={formValue?.[0]?.["itemForAllLinkedLocation"]}
                    onChange={(e) => handleOnChange(e, 0)}
                    checked={
                      formValue?.[0]?.["itemForAllLinkedLocation"]
                        ? true
                        : false
                    }
                  />
                  <span class="checkmark"></span>
                </label> */}
              </div>

              {pageUrl === "inventory/products/edit" || isVarientEdit ? (
                <div class="edit-profile-btns">
                  <button
                    className="quic-btn quic-btn-save vendor-btn"
                    // onClick={handleSubmitForm}
                    // disabled={isLoading}
                    style={{
                      backgroundColor: "#0A64F9",
                    }}
                    onClick={() =>
                      handleCloseEditModal(
                        "single_vendor",
                     formValue?.[0]?.productEditId
                      )
                    }
                  >
                    Vendors
                  </button>
                  <button
                    className="quic-btn quic-btn-save"
                    // onClick={handleSubmitForm}
                    // disabled={isLoading}
                    style={{
                      backgroundColor: "#0A64F9",
                    }}
                    onClick={() =>
                      handleRedirectHistory(
                        !isVarientEdit ? null : formValue?.[0]?.productEditId,
                        findVarientName?.length === 3 ?  findVarientName?.[2]: findVarientName?.[1]
                      )
                    }
                  >
                    Sales History
                  </button>
                  <button
                    className="quic-btn quic-btn-save edit"
                    // onClick={handleSubmitForm}
                    // disabled={isLoading}
                    style={{
                      backgroundColor: "#0A64F9",
                    }}
                    onClick={() =>
                      handleCloseEditModal(
                        "single_instant",
                     formValue?.[0]?.productEditId
                      )
                    }
                  >
                    Instant PO
                  </button>
                </div>
              ) : (
                ""
              )}
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
};

export default GeneratePUC;
