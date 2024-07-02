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
  handlefocus,
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

  return (
    <>
      <div className="box">
        <div className="box_shadow_input">
          <Grid container sx={{px: 3.5,pt:2.5}}>
            <Grid item xs={12}>
              <h1 style={{marginBottom: 0}} className="heading ">
                Products
              </h1>
            </Grid>
          </Grid>
          <div className="q_main_data_range">
            <Grid container>
              <Grid item xs={12} className="px-5">
                <InputTextSearch
                  placeholder="Search orders by order ID, last 4 digits on payment card, or invoice ID"
                  value={searchId}
                  handleChange={setSearchId}
                  handleSearchButton={handleSearch}
                  handlefocus={handlefocus}
                />
              </Grid>
            </Grid>
            <Grid container>
              <Grid item className="mt-5" xs={12}>
                <h1 className="text-xl font-medium">Filter By</h1>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <CategoryListDropDown
                  type="category"
                  onCategoryChange={handleCategoryChange}
                  searchId={searchId}
                  selectedStatus={selectedStatus}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <label>Product Status</label>
                <SelectDropDown
                  // heading={null}
                  title={"title"}
                  listItem={productStatusList}
                  selectedOption={selectedStatusValue}
                  onClickHandler={handleOptionClick}
                  dropdownFor={"status"}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <label>Listing Type {selectedListingType}</label>
                <SelectDropDown
                  heading={"Select listing"}
                  title={"title"}
                  listItem={listingTypeList}
                  selectedOption={selectedListingType}
                  onClickHandler={handleOptionClick}
                  dropdownFor={"listingType"}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <label style={{ whiteSpace: "nowrap" }}>
                  Enable Product for Delivery/Pickup
                </label>
                <SelectDropDown
                  heading={"Select"}
                  title={"title"}
                  listItem={deliveryPickupList}
                  selectedOption={selectedEmployee}
                  onClickHandler={handleOptionClick}
                  dropdownFor={"del_pic"}
                />
              </Grid>
            </Grid>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterProduct;
