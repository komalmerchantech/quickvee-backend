import React, { useEffect, useState } from "react";
import DeleteIcon from "../../Assests/Category/deleteIcon.svg";

import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import makeAnimated from "react-select/animated";
import Validation from "../../Constants/Validation";
import { components } from "react-select";
import SearchIcon from "@mui/icons-material/Search"; // Import MUI icon


const VariantAttributes = ({
  filterOptionList,
  handleFilterDropdownOption,
  varientDropdownList,
  varientError,
  toggleVarientSection,
  isMultipleVarient,
  handleOnBlurAttributes,
  varientLength,
  handleSetVarientLength,
  addMoreVarientItems,
  handleClearFormData,
}) => {
  const styles = {
    multiValueRemove: (base, state) => {
      return state.data.isFixed ? { ...base, display: "none" } : base;
    },
    clearIndicator: (provided) => ({
      ...provided,
      display: "none",
    }),
    indicatorSeparator: (provided, state) => ({
      ...provided,
      display: "none",
    }),
    dropdownIndicator: (provided, state) => ({
      ...provided,
      padding: 4,
      position: "absolute",
      top: "50%",
      right: 0,
      transform: "translate(0px, -50%)",
    }),
    multiValue: (provided, state) => ({
      ...provided,
      backgroundColor: "#F2F2F2", // Background color for selected items
      borderRadius: "2px", // Border radius for selected items
      padding: "2px 0px",
    }),
    multiValueLabel: (provided, state) => ({
      ...provided,
      color: "#000", // Text color for selected items
      padding: "0 10px", // Padding for label within the selected item
      fontSize: "13px",
      textAlign: "center",
      padding: "3px 6px 3px 10px !important",
    }),
  };

  const dropDownStyle = {
    clearIndicator: (provided) => ({
      ...provided,
      display: "none",
    }),
    indicatorSeparator: (provided, state) => ({
      ...provided,
      display: "none",
    }),
  };
  const pageUrl =
    window.location.pathname.split("/")[1] +
    "/" +
    window.location.pathname.split("/")[2] +
    "/" +
    window.location.pathname.split("/")[3];
  const [showAttributes, setShowAttributes] = useState(false);

  const animatedComponents = makeAnimated();

  const handleDeleteClick = (category, id) => {
    // when varientList item is deleted through delete icon click then catgeory is null
    // if someone deleted all items of varient item then category is apply.
    const deleteSelected = varientLength?.filter((item) => {
      return item?.id !== id;
    });

    // change varientItem id => if id is 1 keep 1 or change deleteSelected[0]?.id - 1
    const updatedData = deleteSelected.map((item) => ({
      ...item,
      id: category ? (item?.id === 1 ? 1 : item?.id - 1) : item?.id,
    }));

    handleSetVarientLength(updatedData);
  };

  const filterVarientListIfAllItemsDelete = (index, value) => {
    if (index === 0) {
      if (
        varientLength?.length > 1 &&
        value < varientLength[0]?.varientAttributeList?.length
      ) {
        handleDeleteClick("conditionally-delete", varientLength[0]?.id);
        return true;
      }
    } else if (index === 1) {
      if (
        varientLength?.length > 2 &&
        value < varientLength[1]?.varientAttributeList?.length
      ) {
        handleDeleteClick("conditionally-delete", varientLength[1]?.id);
        return true;
      }
    }
    return false;
  };

  const handlechange = (value, index, name, actionMeta) => {
    // validation for add varient item => only ' is allowed and " is not allowed in varient item text
    let filterValue;
    // if value comes from createble varient
    if (Array.isArray(value)) {
      filterValue = value?.filter((item) => {
        let checkApostrophe = !(
          item?.label?.split("").filter((p) => p === "'")?.length > 1
        );

        let checkDoubleQuotes = !item?.label?.includes(`"`);
        if (!checkApostrophe) {
          alert("Only one apostrophe is allowed in selected values.");
        } else if (!checkDoubleQuotes) {
          alert("No Double quotes allowed in selected values.");
        } 
        
        return (
          !(item?.label?.split("").filter((p) => p === "'")?.length > 1) &&
          !item?.label?.includes(`"`) &&
          !item?.label?.includes(`,`) &&
          !item?.label?.includes(`~`) &&
          !item?.label?.includes(`-`) &&
          !item?.label?.includes(`<`) &&
          !item?.label?.includes(`>`) &&
          !item?.label?.includes(`/`) && 
          !item?.label?.includes(`\\`) &&
          !item?.label?.includes(`;`)
        );
      });
    } else {
      filterValue = value;
    }

    // clear the all input fields value when add new varient first item
    // here using varientLength length and value is less that current varientLength
    if (index > 0) {
      if (
        filterValue?.length === 1 &&
        filterValue > varientLength[index]?.varientAttributeList
      ) {
        handleClearFormData(true);
      } else {
        handleClearFormData(false);
      }
    }

    if (filterVarientListIfAllItemsDelete(index, filterValue)) {
      return;
    }

    switch (actionMeta?.action) {
      case "remove-value":
      case "pop-value":
        if (actionMeta?.removedValue?.isFixed) {
          return;
        }
        break;
      case "clear":
        filterValue = value.filter((v) => v.isFixed);
        break;
    }

    let updateVarientLength = [...varientLength];
    if (name == "varientName") {
      updateVarientLength[index] = {
        ...updateVarientLength[index],
        varientName: filterValue,
      };
    } else if (name == "varientAttributeList") {
      updateVarientLength[index] = {
        ...updateVarientLength[index],
        varientAttributeList: filterValue,
      };
    }
    handleSetVarientLength(updateVarientLength);
  };

  useEffect(() => {
    const filterItems = varientDropdownList?.filter(
      (opt) =>
        !varientLength
          ?.map((item) => item?.varientName?.value)
          .includes(opt?.title)
    );
    handleFilterDropdownOption(filterItems);
  }, [varientLength, varientDropdownList]);

  // if varientName is empty set defaultValue dropdown first item. only for the first dropwdown for fill the value.
  useEffect(() => {
    if (varientLength?.length && varientDropdownList?.length) {
      const setDefaultValue = varientLength?.map((sec, index) => {
        return {
          ...sec,
          varientName: !!sec?.varientName
            ? sec?.varientName
            : {
                value: varientDropdownList[0]?.title,
                label: varientDropdownList[0]?.title,
              },
        };
      });
      handleSetVarientLength(setDefaultValue);
    }
  }, [varientDropdownList]);

  const filterDefaultvalue = () => {
    if (filterOptionList?.length > 0) {
      return filterOptionList?.map((option) => ({
        value: option?.title,
        label: option?.title,
      }));
    }
  };

  const SearchIndicator = (props) => {
    return (
      <components.DropdownIndicator {...props}>
        <SearchIcon />
      </components.DropdownIndicator>
    );
  };

  return (
    <>
      <div
        className="mx-0"
        style={{ display: showAttributes ? "block" : "none" }}
      >
        <div className="q-add-categories-single-input">
          <div className="q_dashbaord_netsales">
            <h1>Variant Attributes</h1>
          </div>
        </div>
      </div>

      <div class="varient-block">
        {pageUrl !== "inventory/products/edit" ? (
          <div class="multiple-items">
            <span>Multiple Items?*</span>
            <div class="checkbox-area">
              <input
                type="checkbox"
                name="isMultiple"
                checked={isMultipleVarient}
                onChange={toggleVarientSection}
                className="checkbox-input"
              />
              <label for="isMultiple" className="check-text">
                Create Attributes and Options
              </label>
            </div>
          </div>
        ) : (
          ""
        )}
        {
          pageUrl === "inventory/products/edit" && isMultipleVarient ? 
          <div className="product-note-section">
          <p class="product-note">Note : After making any change, please update the page.</p>
          <p class="product-note">Note : You cannot remove existing variants.</p>
          </div>
          :""
        }
        {isMultipleVarient ? (
          <div className="varient-select-section">
            <div className="">
              <div className="flex">
                <h2 className="text-[18px] text-black opacity-100 Admin_std mb-4">
                  Variant Attributes
                </h2>
              </div>

              {varientLength.length > 0
                ? varientLength?.map((varient, index) => {
                  console.log('varient =>>> ', varient);
                    return (
                      <div class="qvrow varientAddSection" key={index + 1}>
                        <div class="col-qv-5">
                          <div class="input_area">
                            {/* <input
                    className=""
                    type="text"
                    name="owner_name"
                    value={newAttribute}
                    onChange={(e) => setNewAttribute(e.target.value)}
                  /> */}

                            <Select
                              closeMenuOnSelect={true}
                              components={{ ...animatedComponents }}
                              value={varient?.varientName}
                              onChange={(e) =>
                                handlechange(e, index, "varientName")
                              }
                              options={filterDefaultvalue()}
                              isSearchable
                              isClearable
                              styles={dropDownStyle}
                              // defaultValue={{
                              //   value: varientDropdownList[0]?.title,
                              //   label: varientDropdownList[0]?.title,
                              // }}
                              isDisabled={
                                index + 1 < varientLength?.length ||
                                pageUrl === "inventory/products/edit"
                              }
                              
                            />
                          </div>
                        </div>
                        <div class="col-qv-5">
                          <div class="input_area">
                            <CreatableSelect
                              closeMenuOnSelect={true}
                              // isValidNewOption={isValidNewOption}
                              components={{
                                ...animatedComponents,
                                DropdownIndicator: SearchIndicator, // Replace DropdownIndicator with SearchIndicator
                              }}
                              styles={styles}
                              value={varient?.varientAttributeList}
                              options={varient?.varientAttributeList}
                              onChange={(e, actionMeta) => {
                                handlechange(
                                  e,
                                  index,
                                  "varientAttributeList",
                                  actionMeta
                                );
                              }}
                              placeholder="Select Varient..."
                              onKeyDown={handleOnBlurAttributes}
                              isMulti
                              isClearable={varient?.varientAttributeList?.some(
                                (v) => !v.isFixed
                              )}
                            />
                          </div>
                          {!!varientError?.error &&
                          +varientError?.errorIndex === index ? (
                            <span className="error-alert error-alert-varient">
                              {varientError?.error}
                            </span>
                          ) : (
                            ""
                          )}
                        </div>
                        {pageUrl !== "inventory/products/edit" ? (
                          <div className="col-qv-2">
                            {varientLength[varientLength?.length - 1]?.id ===
                              varient?.id && varient?.id !== 1 ? (
                              <button
                                onClick={() =>
                                  handleDeleteClick(null, varient?.id)
                                }
                                className="ml-auto"
                              >
                                <img
                                  src={DeleteIcon}
                                  alt=""
                                  className=" m-auto d-grid place-content-center"
                                  width="32px"
                                />
                              </button>
                            ) : (
                              ""
                            )}
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    );
                  })
                : ""}

              {+varientLength?.length < 3 &&
              pageUrl === "inventory/products/add" &&
              pageUrl !== "inventory/products/edit" ? (
                <div className="flex">
                  <button
                    className="px-4 py-2 bg-[#0A64F9] text-white rounded-md"
                    // onClick={handleAddAttribute}
                    onClick={addMoreVarientItems}
                  >
                    Add Variant Attributes +
                  </button>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default VariantAttributes;
