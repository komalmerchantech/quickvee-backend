import React, { useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import DownIcon from "../../Assests/Dashboard/Down.svg";
import { useRef } from "react";
import Grid from "@mui/system/Unstable_Grid/Grid";
import InputTextSearch from "../../reuseableComponents/InputTextSearch";

import SearchIcon from "../../Assests/Filter/Search.svg";

import CategoryListDropDown from "../../CommonComponents/CategoryListDropDown";
import UpArrow from "../../Assests/Dashboard/Up.svg";
import SelectDropDown from "../../reuseableComponents/SelectDropDown";

const FilterProduct = ({
  handleOptionClick,
  toggleDropdown,
  selectedEmployee,
  del_picDropdownVisible,
  setdel_picDropdownVisible,
  selectedStatus,
  selectedStatusValue,
  transactionDropdownVisible,
  setTransactionDropdownVisible,
  selectedCategory,
  categoryDropdownVisible,
  selectedListingType,
  setSelectedListingType,
  listingTypesDropdownVisible,
  setlistingTypesDropdownVisible,
  handleCategoryChange,
  handleSearch,
  searchId,
  setSearchId,
}) => {
  const productStatusList = [
    {
      id: "all",
      title: "All",
    },
    {
      id: "0",
      title: "Pending",
    },
    {
      id: "1",
      title: "Approved",
    },
    {
      id: "2",
      title: "Rejected",
    },
  ];

  const listingTypeList = [
    {
      id: 0,
      title: "Product listing",
    },
    {
      id: 1,
      title: "Variant listing",
    },
  ];

  const deliveryPickupList = [
    {
      id: "1",
      title: "Enable All",
    },
    {
      id: "2",
      title: "Enable Pickup All",
    },
    {
      id: "5",
      title: "Disable Pickup All",
    },
    {
      id: "3",
      title: "Enable Delivery All",
    },
    {
      id: "6",
      title: "Disable Delivery All",
    },

    {
      id: "4",
      title: "Disable All",
    },
  ];
  const handleFilter = (filterType) => {
    console.log("Selected filter:", filterType);
  };

  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsTablet(window.innerWidth <= 995);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // const dropdownContentClass = Object.values(filteredData.emp_id).length > 2 ? "dropdown-content scrollable" : "dropdown-content";
  // const lengthOfArray = Object.values(filteredData.emp_id).length;

  // const handleSearch = () => {
  //   console.log("Search ID:", searchId);

  // };

  // useEffect(()=> {
  //   console.log('sa');
  // });

  const prodcutstatus = useRef(null);
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        prodcutstatus.current &&
        !prodcutstatus.current.contains(event.target)
      ) {
        setTransactionDropdownVisible(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  // listing
  const listingtype = useRef(null);
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (listingtype.current && !listingtype.current.contains(event.target)) {
        setlistingTypesDropdownVisible(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  //
  const delpicstatus = useRef(null);
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (delpicstatus.current && !listingtype.current.contains(event.target)) {
        setdel_picDropdownVisible(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);
  console.log("selectedStatusValue ", selectedStatusValue);
  return (
    <>
      {/* <div className=" p-4 mb-3  rounded-md">
            <div className="flex border  rounded-md overflow-hidden mt-6 mr-9">
              <input
                type="text"
                placeholder="Search orders by order ID, last 4 digits on payment card, or invoice ID"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="w-full px-4 py-2 border-none focus:outline-none"
              />

              <button
                onClick={handleSearch}
                className="text-black px-4 py-2 focus:outline-none text-2xl"
              >
                <AiOutlineSearch className="h- w-8  text-[#231F20]" />
              </button>
            </div>
          </div> */}

      <div className="box">
        <div className="box_shadow_input">
          <div className="q_main_data_range">
            <Grid container>
              <Grid item xs={12} className="px-5">
                <InputTextSearch
                  placeholder="Search orders by order ID, last 4 digits on payment card, or invoice ID"
                  value={searchId}
                  handleChange={setSearchId}
                  handleSearchButton={handleSearch}
                />
              </Grid>
            </Grid>
            <Grid container>
              <Grid item className="mt-5" xs={12}>
                <h1 className="text-xl font-medium">Filter By</h1>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <CategoryListDropDown
                  type="category"
                  onCategoryChange={handleCategoryChange}
                />
              </Grid>
              <Grid item xs={4}>
                <label>Product Status</label>
                <SelectDropDown
                  heading={null}
                  listItem={productStatusList}
                  selectedOption={selectedStatusValue}
                  onClickHandler={handleOptionClick}
                  dropdownFor={"status"}
                />
              </Grid>
              <Grid item xs={4}>
                <label>Listing Type {selectedListingType}</label>
                <SelectDropDown
                  heading={"Select listing"}
                  listItem={listingTypeList}
                  selectedOption={selectedListingType}
                  onClickHandler={handleOptionClick}
                  dropdownFor={"listingType"}
                
                />
              </Grid>
              <Grid item xs={4}>
                <label style={{whiteSpace:'nowrap'}}>Enable Product for Delivery/Pickup</label>
                <SelectDropDown
                  heading={"Select"}
                  listItem={deliveryPickupList}
                  selectedOption={selectedEmployee}
                  onClickHandler={handleOptionClick}
                  dropdownFor={"del_pic"}
                />
              </Grid>
            </Grid>

            {/* <div className="q_searchBar">
              <div className="flex border  rounded-md overflow-hidden">
                <input
                  type="text"
                  placeholder="Search orders by order ID, last 4 digits on payment card, or invoice ID"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  className="w-full px-4 py-2 border-none focus:outline-none place_text_search"
                />

                <button
                  onClick={handleSearch}
                  className="text-black px-4 py-2 focus:outline-none text-2xl"
                >
                  <AiOutlineSearch className="h- w-8  text-[#231F20]" />
                </button>
              </div>
            </div> */}

            {/* <button
              onClick={handleSearch}
              className="text-black px-4 py-2 focus:outline-none text-2xl"
            >
              <img src={SearchIcon} alt="" className="w-6 h-6" />
            </button> */}
          </div>
        </div>

        {/* <div className="mt_card_header q_dashbaord_netsales"> */}
          {/* <h1 className="">Filter By</h1> */}

          {/* <div className="qvrow"> */}
            {/* <CategoryListDropDown
              type="category"
              onCategoryChange={handleCategoryChange}
            /> */}

            {/* <div
              className={`Card_admin ${isTablet ? "col-qv-12" : "col-qv-4"}`}
            >
              <label
                htmlFor="statusFilter"
                onClick={() =>
                  setTransactionDropdownVisible(!transactionDropdownVisible)
                }
              >
                Product Status
              </label>
              <div className="custom-dropdown input_area" ref={prodcutstatus}>
                <div
                  className="custom-dropdown-header"
                  onClick={() => toggleDropdown("status")}
                >
                  <span className="selected-option mt-1">
                    {selectedStatusValue === "all"
                      ? "All"
                      : selectedStatusValue}
                  </span>
                  <img
                    src={transactionDropdownVisible ? UpArrow : DownIcon}
                    alt="Dropdown Icon"
                    className="w-6 h-6"
                  />
                </div>
                {transactionDropdownVisible && (
                  <div className="dropdown-content ">
                    <div
                      className={
                        selectedStatus === "all"
                          ? "dropdown-item active"
                          : "dropdown-item"
                      }
                      onClick={() => handleOptionClick("all", "status", "All")}
                    >
                      All
                    </div>
                    <div
                      className={
                        selectedStatus === "1"
                          ? "dropdown-item active"
                          : "dropdown-item"
                      }
                      onClick={() =>
                        handleOptionClick("1", "status", "Approved")
                      }
                    >
                      Approved
                    </div>
                    <div
                      className={
                        selectedStatus === "0"
                          ? "dropdown-item active"
                          : "dropdown-item"
                      }
                      onClick={() =>
                        handleOptionClick("0", "status", "Pending")
                      }
                    >
                      Pending
                    </div>
                    <div
                      className={
                        selectedStatus === "2"
                          ? "dropdown-item active"
                          : "dropdown-item"
                      }
                      onClick={() =>
                        handleOptionClick("2", "status", "Rejected")
                      }
                    >
                      Rejected
                    </div>
                  </div>
                )}
              </div>
            </div> */}

            {/* Order Status Dropdown */}
            {/* <div
              className={`Card_admin ${isTablet ? "col-qv-12" : "col-qv-4"}`}
            >
              <label
                htmlFor="ListingFilter"
                onClick={() =>
                  setlistingTypesDropdownVisible(!listingTypesDropdownVisible)
                }
              >
                Listing Type {selectedListingType}
              </label>
              <div className="custom-dropdown input_area" ref={listingtype}>
                <div
                  className="custom-dropdown-header"
                  onClick={() => toggleDropdown("listingType")}
                >
                  <span className="selected-option mt-1">
                    {selectedListingType}
                  </span>
                  <img
                    src={listingTypesDropdownVisible ? UpArrow : DownIcon}
                    alt="Dropdown Icon"
                    className="w-6 h-6"
                  />
                </div>
                {listingTypesDropdownVisible && (
                  <div className="dropdown-content ">
                    <div
                      className={
                        selectedListingType === "Product listing"
                          ? "dropdown-item active"
                          : "dropdown-item"
                      }
                      onClick={() =>
                        handleOptionClick(0, "listingType", "Product listing")
                      }
                    >
                      Product listing
                    </div>
                    <div
                      className={
                        selectedListingType === "Variant listing"
                          ? "dropdown-item active"
                          : "dropdown-item"
                      }
                      onClick={() =>
                        handleOptionClick(1, "listingType", "Variant listing")
                      }
                    >
                      Variant listing
                    </div>
                  </div>
                )}
              </div>
            </div> */}
            {/* Employee Dropdown */}
            {/* <div
              className={`Card_admin ${isTablet ? "col-qv-12" : "col-qv-4"}`}
            >
              <label
                htmlFor="employeeFilter"
                onClick={() =>
                  setdel_picDropdownVisible(!del_picDropdownVisible)
                }
              >
                Enable Product for Delivery/Pickup
              </label>
              <div className="custom-dropdown input_area">
                <div
                  className="custom-dropdown-header"
                  onClick={() => toggleDropdown("del_pic")}
                >
                  <span className="selected-option mt-1">
                    {selectedEmployee}
                  </span>
                  <img
                    src={del_picDropdownVisible ? UpArrow : DownIcon}
                    alt="Dropdown Icon"
                    className="w-6 h-6"
                  />
                </div>
                {del_picDropdownVisible && (
                  <div className="dropdown-content">
                    <div
                      className={
                        selectedEmployee === "1"
                          ? "dropdown-item active"
                          : "dropdown-item"
                      }
                      onClick={() =>
                        handleOptionClick("1", "del_pic", "Enable All")
                      }
                    >
                      Enable All
                    </div>
                    <div
                      className={
                        selectedEmployee === "2"
                          ? "dropdown-item active"
                          : "dropdown-item"
                      }
                      onClick={() =>
                        handleOptionClick("2", "del_pic", "Enable Pickup All")
                      }
                    >
                      Enable Pickup All
                    </div>
                    <div
                      className={
                        selectedEmployee === "5"
                          ? "dropdown-item active"
                          : "dropdown-item"
                      }
                      onClick={() =>
                        handleOptionClick("5", "del_pic", "Disable Pickup All")
                      }
                    >
                      Disable Pickup All
                    </div>
                    <div
                      className={
                        selectedEmployee === "3"
                          ? "dropdown-item active"
                          : "dropdown-item"
                      }
                      onClick={() =>
                        handleOptionClick("3", "del_pic", "Enable Delivery All")
                      }
                    >
                      Enable Delivery All
                    </div>
                    <div
                      className={
                        selectedEmployee === "6"
                          ? "dropdown-item active"
                          : "dropdown-item"
                      }
                      onClick={() =>
                        handleOptionClick(
                          "6",
                          "del_pic",
                          "Disable Delivery All"
                        )
                      }
                    >
                      Disable Delivery All
                    </div>
                    <div
                      className={
                        selectedEmployee === "4"
                          ? "dropdown-item active"
                          : "dropdown-item"
                      }
                      onClick={() =>
                        handleOptionClick("4", "del_pic", "Disable All")
                      }
                    >
                      Disable All
                    </div>
                  </div>
                )}
              </div>
            </div> */}
          {/* </div> */}
        {/* </div> */}
      </div>
    </>
  );
};

export default FilterProduct;
