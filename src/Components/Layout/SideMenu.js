import React, { useEffect, useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import DashboardIcon from "../../Assests/Dashboard/dashboard.svg";
import ShoppingCartIcon from "../../Assests/Dashboard/orders.svg";
import CategoryIconActive from "../../Assests/Dashboard/category.svg";
import CouponIcon from "../../Assests/Dashboard/coupanb.svg";
import AttributesIcon from "../../Assests/Dashboard/attributesadmin.svg";
import PurchaseIcon from "../../Assests/Dashboard/purchesb.svg";
import ProductIcon from "../../Assests/Dashboard/productb.svg";
import dataIcon from "../../Assests/Dashboard/vender.svg";

import TimesheetsIcon from "../../Assests/Dashboard/timesheetb.svg";

import StoreSettingIcon from "../../Assests/Dashboard/store.svg";
import ReportIcon from "../../Assests/Dashboard/reporting.svg";
import DashIcon from "../../Assests/Dashboard/dashIcon.svg";
import OrderYellow from "../../Assests/Dashboard/ordery.svg";
import CatIcon from "../../Assests/Dashboard/categoryd.svg";
import AtriIcon from "../../Assests/Dashboard/attributesy.svg";
import ProdIcon from "../../Assests/Dashboard/productY.svg";
import VenIcon from "../../Assests/Dashboard/venderb.svg";
import VenIconActive from "../../Assests/Dashboard/vendery.svg";
import DataIconActive from "../../Assests/Dashboard/importy.svg";
import CouIcon from "../../Assests/Dashboard/coupony.svg";
import PurIcon from "../../Assests/Dashboard/purchaseY.svg";
import SettingIcon from "../../Assests/Dashboard/settingY.svg";
import ResportIcons from "../../Assests/Dashboard/reports.svg";
import timesheetblackIcon from "../../Assests/Dashboard/timesheetblackIcon.svg";
import Loyalty from "../../Assests/Taxes/Loyalty Program.svg";
import LoyaltIcon from "../../Assests/Taxes/loyaltyactive.svg";
import { useMediaQuery } from "@mui/material";
import {
  setMenuOpen,
  setIsDropdownOpen,
} from "../../Redux/features/NavBar/MenuSlice";
import { useSelector, useDispatch } from "react-redux";
import CryptoJS from "crypto-js";
import Cookies from "js-cookie";
import { useAuthDetails } from "../../Common/cookiesHelper";

import LabelIcon from "../../Assests/MultipleUserIcon/label.svg";
import LabelActive from "../../Assests/MultipleUserIcon/labelactive.svg";
import UsersICcon from "../../Assests/MultipleUserIcon/user.svg";
import UserActive from "../../Assests/MultipleUserIcon/useractive.svg";
import NewsletterIcon from "../../Assests/MultipleUserIcon/newsletter.svg";
import NewsletterActive from "../../Assests/MultipleUserIcon/newsletteractive.svg";
import StoreIcon from "../../Assests/MultipleUserIcon/store.svg";
import StoreActive from "../../Assests/MultipleUserIcon/storeactive.svg";
import OrderIcon from "../../Assests/MultipleUserIcon/orderCount.svg";
import OrderActive from "../../Assests/MultipleUserIcon/ordercountactive.svg";
import DefaultIcon from "../../Assests/MultipleUserIcon/defaults.svg";
import DefaultActive from "../../Assests/MultipleUserIcon/defaultactive.svg";
import ApkIcon from "../../Assests/MultipleUserIcon/apk.svg";
import ApkActive from "../../Assests/MultipleUserIcon/apkactive.svg";
import DuplicatesIcon from "../../Assests/MultipleUserIcon/duplicates.svg";
import DuplicatesActive from "../../Assests/MultipleUserIcon/duplicatesactive.svg";
import PermissionIcon from "../../Assests/MultipleUserIcon/permission.svg";
import PermissionActive from "../../Assests/MultipleUserIcon/permissionactive.svg";
import InverntoryIcon from "../../Assests/MultipleUserIcon/inventory.svg";
import InvertoryActive from "../../Assests/MultipleUserIcon/inventoryactive.svg";
import storeIcon from "../../Assests/Manager/storeIcon.svg";
import storeIconActive from "../../Assests/Manager/storeIconActive.svg";
import ManagerIcon from "../../Assests/Manager/managerIcon.svg";
import ManagerIconActive from "../../Assests/Manager/managerIconActive.svg";

import MerchantIcon from "../../Assests/MultipleUserIcon/merchant.svg";
import MerchantActive from "../../Assests/MultipleUserIcon/merchantactive.svg";
import NestedDropdownMenu from "./NestedDropdownMenu";
import { BASE_URL } from "../../Constants/Config";
const SideMenu = () => {
  const { LoginGetDashBoardRecordJson, LoginAllStore, userTypeData } =
    useAuthDetails();

  const [menuItemSwitcher, setMenuItemSwitcher] = useState(menuItems);

  const temp = {
    superadmin: menuItemSwitcher,
    admin: merchant,
    manager: ManagerLink,
    merchant: MerchantLink,
  };

  const location = useLocation();
  const currentUrl = location.pathname;
  const isMenuOpenRedux = useSelector((state) => state.NavBarToggle.isMenuOpen);

  const isDropdownOpen = useSelector(
    (state) => state.NavBarToggle.isDropdownOpen
  );
  const isStoreActive = useSelector(
    (state) => state.NavBarToggle.isStoreActive
  );
  const [activeItem, setActiveItem] = useState(currentUrl);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [currentDropDownItem, activeDropDownItem] = useState(null);
  const [activeNestedItem, setActiveNestedItem] = useState();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isTabletNav = useMediaQuery("(max-width:1024px)");
  const handleItemClick = (item) => {
    setActiveItem(item.link);
    navigate(item.link);
    setActiveNestedItem(null);
    // dispatch(setIsDropdownOpen(false))
    activeDropDownItem(null);
  };

  // console.log("active item", activeItem)

  useEffect(() => {
    dispatch(setMenuOpen(!isTabletNav));
  }, [isTabletNav]);

  useEffect(() => {
    setActiveItem(currentUrl);
    // if (currentUrl.split("/")[1] === "users") {
    //   setMenuItemSwitcher(SuperAdminMenuItems);
    //   dispatch(setMenuOpen(true));
    // } else {
    //   setMenuItemSwitcher(menuItems);
    // }
    // console.log("setIsStoreActive setIsStoreActive0,",isStoreActive)
    if (!isStoreActive) {
      setMenuItemSwitcher(SuperAdminMenuItems);
      dispatch(setMenuOpen(true));
    } else {
      const updatedMenuItems = [...menuItems];
      if (LoginGetDashBoardRecordJson?.login_type === "superadmin") {
        const newMenuItem = {
          id: 91,
          icon: (
            <img
              src={dataIcon}
              alt="Export Sold Items"
              className="h-6 w-10 mt-4 mb-4 hoverable-image"
            />
          ),
          activeIcon: (
            <img
              src={DataIconActive}
              alt="Import"
              className="h-6 w-10 mt-4 mb-4"
            />
          ),
          text: "Import Data",
          link: "/import-data",
        };
        updatedMenuItems.splice(updatedMenuItems.length - 1, 0, newMenuItem);
      }
      setMenuItemSwitcher(updatedMenuItems);
    }
  }, [currentUrl, isStoreActive]);

  useEffect(() => {
    if (LoginGetDashBoardRecordJson?.login_type === "superadmin") {
      setMenuItemSwitcher((menuItems) => [...menuItems]);
    }
  }, [LoginGetDashBoardRecordJson?.login_type]);

  function getFirstTwoSegmentsPath(pathname) {
    // console.log("getFirstTwoSegmentsPath",pathname)
    const segments = pathname.split("/").filter(Boolean);
    return "/" + segments.slice(0, 2).join("/");
  }
  function getFirstTwoSegmentsPathIsStoreAvtive(pathname) {
    // console.log("getFirstTwoSegmentsPath",pathname)
    const segments = pathname.split("/").filter(Boolean);
    return isStoreActive
      ? "/" + segments.slice(0, 1).join("/")
      : "/" + segments.slice(0, 2).join("/");
  }

  return (
    <>
      <div
        className="sidebar-menu"
        style={{
          width: isMenuOpenRedux ? "16rem" : "4rem",
          paddingTop: "69px",
        }}
      >
        {/* || LoginAllStore?.final_login==1 */}
        {/* Left Side Menu */}
        <div className="flex-1 bg-[#253338] text-[#9E9E9E]">
          {isMenuOpenRedux
            ? (LoginGetDashBoardRecordJson?.final_login == 1
                ? temp["superadmin"]
                : temp[LoginGetDashBoardRecordJson?.data?.login_type]
              ) // admin
                ?.map((item) => (
                  <div
                    key={item.id}
                    className={`text-[#9E9E9E] active:bg-[#414F54] hover:bg-[#414F54] hover:text-[#FFC400] px-0 ${
                      activeItem === item.link ? "active" : ""
                    }`}
                  >
                    {item.dropdownItems ? (
                      <DropdownMenuItem
                        setHoveredItem={setHoveredItem}
                        item={item}
                        isMenuOpenRedux={isMenuOpenRedux}
                        activeItem={activeItem}
                        setActiveItem={setActiveItem}
                        hoveredItem={hoveredItem}
                        isDropdownOpen={isDropdownOpen}
                        setIsDropdownOpen={setIsDropdownOpen}
                        currentDropDownItem={currentDropDownItem}
                        activeDropDownItem={activeDropDownItem}
                        activeNestedItem={activeNestedItem}
                        setActiveNestedItem={setActiveNestedItem}
                        getFirstTwoSegmentsPath={getFirstTwoSegmentsPath}
                      />
                    ) : (
                      <div
                        onMouseEnter={() => setHoveredItem(item.id)}
                        onMouseLeave={() => setHoveredItem(null)}
                        onClick={() => handleItemClick(item)}
                        style={{ cursor: "pointer" }}
                        className={`flex items-center ${
                          getFirstTwoSegmentsPathIsStoreAvtive(activeItem) ===
                          item.link.trim()
                            ? "bg-[#414F54] text-[#FFC400]"
                            : ""
                              ? "text-[#FFC400] active:bg-[#414F54] hover:bg-[#414F54] px-0"
                              : ""
                        }`}
                      >
                        {getFirstTwoSegmentsPathIsStoreAvtive(activeItem) ===
                          item.link.trim() || hoveredItem === item.id
                          ? item.activeIcon
                          : item.icon}
                        <Link
                          className={`ml-2 menu-item text-[14px] Admin_std ${
                            activeItem === item.link.trim()
                              ? "bg-[#414F54]"
                              : ""
                          }`}
                          to={item.link}
                        >
                          {item.text}
                        </Link>
                      </div>
                    )}
                  </div>
                ))
            : (LoginGetDashBoardRecordJson?.final_login == 1
                ? temp["superadmin"]
                : temp[LoginGetDashBoardRecordJson?.data?.login_type]
              )?.map((item) => (
                <div
                  key={item.id}
                  className={`mb-1 text-base cursor-pointer ${
                    activeItem === item.link ? "active" : ""
                  }`}
                >
                  {item.dropdownItems ? (
                    <DropdownMenuItem
                      setHoveredItem={setHoveredItem}
                      item={item}
                      isMenuOpenRedux={isMenuOpenRedux}
                      activeItem={activeItem}
                      setActiveItem={setActiveItem}
                      hoveredItem={hoveredItem}
                      isDropdownOpen={isDropdownOpen}
                      setIsDropdownOpen={setIsDropdownOpen}
                      currentDropDownItem={currentDropDownItem}
                      activeDropDownItem={activeDropDownItem}
                      activeNestedItem={activeNestedItem}
                      setActiveNestedItem={setActiveNestedItem}
                      getFirstTwoSegmentsPath={getFirstTwoSegmentsPath}
                    />
                  ) : (
                    <div
                      className={`flex flex-col items-center ${
                        activeItem === item.link
                          ? "text-[#FFC400] active"
                          : "text-gray-400 hover-text-yellow hover:bg-[#414F54] px-0"
                      }`}
                      onMouseEnter={() => setHoveredItem(item.id)}
                      onMouseLeave={() => setHoveredItem(null)}
                      onClick={() => {
                        handleItemClick(item);
                      }}
                    >
                      {/* {activeItem === item.id ? item.activeIcon : item.icon} */}
                      {getFirstTwoSegmentsPath(activeItem) ===
                        item.link.trim() || hoveredItem === item.id
                        ? item.activeIcon
                        : item.icon}
                    </div>
                  )}
                </div>
              ))}
        </div>
      </div>
    </>
  );
};

const DropdownMenuItem = ({
  item,
  isMenuOpenRedux,
  activeItem,
  setActiveItem,
  setHoveredItem,
  hoveredItem,
  isDropdownOpen,
  setIsDropdownOpen,
  activeDropDownItem,
  currentDropDownItem,
  activeNestedItem,
  setActiveNestedItem,
  getFirstTwoSegmentsPath,
}) => {
  const dispatch = useDispatch();

  const [dropDownItem, setDropDownItem] = useState(null);

  const isTabletNav = useMediaQuery("(max-width:1024px)");
  useEffect(() => {
    const foundItem = item?.dropdownItems?.find(
      (item) => item?.link === getFirstTwoSegmentsPath(activeItem)
    );

    if (foundItem) {
      setDropDownItem(foundItem?.link);
      activeDropDownItem(item?.id);
    }

    const NesedFoundItem = item?.dropdownItems?.find((nestedItem) => {
      if (nestedItem?.dropDownItems) {
        return (
          nestedItem?.dropDownItems?.find(
            (dropDownItem) => dropDownItem.link === activeItem
          ) && nestedItem
        );
      }
    });
    if (NesedFoundItem) {
      setActiveNestedItem(NesedFoundItem?.id);
      setDropDownItem(activeItem);
      activeDropDownItem(item.id);
    }
    // item.id === currentDropDownItem && dispatch(setIsDropdownOpen(true));
    dispatch(setIsDropdownOpen(!isTabletNav));
  }, [isTabletNav, dropDownItem, isTabletNav, activeItem]);

  const handleToggleDropdownItems = (link, e) => {
    if (isTabletNav) {
      dispatch(setIsDropdownOpen(false));
      dispatch(setMenuOpen(false));
      setHoveredItem(null);
    }
    setActiveItem(link);
    setDropDownItem(link);
    setActiveNestedItem(null);
  };

  const handleToggleSideBar = () => {
    dispatch(setMenuOpen(!isMenuOpenRedux));
    dispatch(setIsDropdownOpen(true));
  };

  const HandleDropdownClick = (id) => {
    activeDropDownItem((prevId) => (prevId === id ? null : id));
  };
  const HandleDropdownIconClick = (id) => {
    activeDropDownItem(id);
  };
  return (
    <>
      <div
        className="relative"
        style={
          isMenuOpenRedux
            ? { width: "16rem" }
            : { width: "6rem", marginLeft: "10px" }
        }
        onMouseEnter={() => setHoveredItem(item.id)}
        onMouseLeave={() => setHoveredItem(null)}
        onClick={(e) => {
          HandleDropdownClick(item.id);
          dispatch(setIsDropdownOpen(true));
        }}
      >
        <div className="flex">
          {isMenuOpenRedux ? (
            <div
              className={`w-full flex items-center cursor-pointer ${
                getFirstTwoSegmentsPath(activeItem) === dropDownItem
                  ? "bg-[#414F54]"
                  : ""
              }`}
            >
              {getFirstTwoSegmentsPath(activeItem) === dropDownItem ||
              hoveredItem === item.id
                ? item.activeIcon
                : item.icon}
              <p
                className={`ml-2 menu-item DropDown-memu text-[14px] flex-auto Admin_std ${
                  getFirstTwoSegmentsPath(activeItem) === dropDownItem
                    ? "activeTab"
                    : ""
                }`}
              >
                {item.text}
              </p>
              {currentDropDownItem === item.id ? (
                <FaChevronUp
                  className={`quickarrow_icon ml-4 me-5 text-${
                    (getFirstTwoSegmentsPath(activeItem) === dropDownItem ||
                      hoveredItem === item.id) &&
                    "[#FFC400]"
                  }`}
                />
              ) : (
                <FaChevronDown
                  className={`quickarrow_icon ml-4 me-5 text-${
                    (getFirstTwoSegmentsPath(activeItem) === dropDownItem ||
                      hoveredItem === item.id) &&
                    "[#FFC400]"
                  }`}
                />
              )}
            </div>
          ) : (
            <>
              <div
                onClick={(e) => {
                  handleToggleSideBar();
                  e.stopPropagation();
                  HandleDropdownIconClick(item.id);
                }}
              >
                {getFirstTwoSegmentsPath(activeItem) === dropDownItem ||
                hoveredItem === item.id
                  ? item.activeIcon
                  : item.icon}
              </div>
            </>
          )}
        </div>
      </div>
      {isDropdownOpen && currentDropDownItem === item.id && (
        <div
          onMouseEnter={(e) => {
            setHoveredItem(item.id);
            e.stopPropagation();
          }}
          onMouseLeave={(e) => {
            setHoveredItem(null);
            e.stopPropagation();
          }}
          className="mt-0 bg-[#334247]  shadow w-full text-center z-10"
        >
          {item?.dropdownItems?.map((nestedDropdownItem) => (
            <React.Fragment key={nestedDropdownItem.id}>
              {nestedDropdownItem?.dropDownItems ? (
                <>
                  <NestedDropdownMenu
                    item={nestedDropdownItem}
                    isMenuOpenRedux={isMenuOpenRedux}
                    activeItem={activeItem}
                    dropDownItem={dropDownItem}
                    hoveredItem={hoveredItem}
                    handleToggleDropdownItems={handleToggleDropdownItems}
                    setHoveredItem={setHoveredItem}
                    activeNestedItem={activeNestedItem}
                    setActiveNestedItem={setActiveNestedItem}
                    setDropDownItem={setDropDownItem}
                    activeDropDownItem={activeDropDownItem}
                    isTabletNav={isTabletNav}
                  />
                </>
              ) : (
                <Link
                  // key={nestedDropdownItem.id}
                  to={nestedDropdownItem.link}
                  className={`flex text-center submenu-item text-gray-400 p-4 text-[14px] ${
                    getFirstTwoSegmentsPath(activeItem) ===
                    getFirstTwoSegmentsPath(nestedDropdownItem.link)
                      ? "active"
                      : ""
                  }`}
                  onClick={(e) => {
                    handleToggleDropdownItems(nestedDropdownItem.link);
                    e.stopPropagation();
                  }}
                >
                  {nestedDropdownItem.text}
                </Link>
              )}
            </React.Fragment>
          ))}
        </div>
      )}
    </>
  );
};

// Define menu items with icons and text
// {LoginAllStore?.data?.login_type!==("admin" &&"manager"&& "merchant")

const menuItems = [
  {
    id: 1,
    icon: (
      <img
        src={DashIcon}
        alt="Dashboard"
        className="h-6 w-10 mt-4 mb-4 hoverable-image"
      />
    ),
    activeIcon: (
      <img src={DashboardIcon} alt="Dashboard" className="h-6 w-10 mt-4 mb-4" />
    ),
    text: "Dashboard",
    link: "/",
  },
  {
    id: 2,
    icon: (
      <img
        src={ShoppingCartIcon}
        alt="Order"
        className="h-6 w-10 mt-4 mb-4 hoverable-image"
      />
    ),
    activeIcon: (
      <img src={OrderYellow} alt="order" className="h-6 w-10 mt-4 mb-4" />
    ),
    text: "Order",
    link: "/order",
  },
  {
    id: 3,
    icon: (
      <img
        src={ReportIcon}
        alt="store"
        className="h-6 w-10 mt-4 mb-4 hoverable-image"
      />
    ),
    activeIcon: (
      <img
        src={ResportIcons}
        alt="active report"
        className="h-6 w-10 mt-4 mb-4"
      />
    ),
    text: "Reporting",
    link: "/reporting",
    className: "flex items-center gap-2",
    dropdownItems: [
      {
        id: 1,
        text: "Sales Report",
        dropDownItems: [
          {
            id: 61,
            text: "Sales Report",
            link: "/store-reporting/sales-report",
          },
          {
            id: 62,
            text: "Daily Total Report",
            link: "/store-reporting/daily-total-report",
          },
          {
            id: 63,
            text: "Detailed Category Sale",
            link: "/store-reporting/Details-category",
          },

          { id: 79, text: " Order Type ", link: "/store-reporting/order-type" },
          {
            id: 64,
            text: "Detailed Sales Person Report",
            link: "/store-reporting/report-sales-person",
          },
          {
            id: 69,
            text: "Top Sellers",
            link: "/store-reporting/overall-top",
          },
          {
            id: 78,
            text: "Payment Method Details",
            link: "/store-reporting/payment-method-details",
          },
          // {
          //   id: 78,
          //   text: "Discount Per Sales Report",
          //   link: "/store-reporting/discount-per-sales-report",
          // },
        ],
      },
      {
        id: 2,
        text: "Inventory Reports",
        dropDownItems: [
          {
            id: 81,
            text: "Current Inventory Value",
            link: "/store-reporting/current-inventory-value",
          },
          {
            id: 73,
            text: "New Item Created Between",
            link: "/store-reporting/item-create-between",
          },
          {
            id: 74,
            text: "Reorder Inventory",
            link: "/store-reporting/recorder-inventory",
          },
          {
            id: 68,
            text: "Instant PO Activity Report",
            link: "/store-reporting/instant-activity",
          },
          {
            id: 65,
            text: "Check ID verification",
            link: "/store-reporting/id-verification",
          },
          {
            id: 93,
            text: "Inventory List",
            link: "/store-reporting/inventory-list",
          },
          {
            id: 94,
            text: "Profit Margin Report",
            link: "/store-reporting/profit-margin-report",
          },
        ],
      },
      {
        id: 3,
        text: "Employee Reports",
        dropDownItems: [
          {
            id: 72,
            text: "Employee List",
            link: "/store-reporting/employee-list",
          },
          {
            id: 75,
            text: " Employee Working Hours",
            link: "/store-reporting/employee-working-hours",
          },
        ],
      },
      { id: 80, text: "Taxes ", link: "/store-reporting/taxes-report" },
      {
        id: 4,
        text: "Refunds",
        dropDownItems: [
          {
            id: 84,
            text: "Item Refund Report",
            link: "/store-settings/refund-report",
          },
          {
            id: 82,
            text: "Order Refund Report",
            link: "/store-settings/order-refund-report",
          },
          // {
          //   id: 85,
          //   text: "Refunded Order ID's",
          //   link: "/store-settings/#",
          // },
        ],
      },
      {
        id: 5,
        text: "Vendors",
        dropDownItems: [
          {
            id: 71,
            text: "Vendors List",
            link: "/store-reporting/vendors-list",
          },
          {
            id: 86,
            text: "Vendors Payout",
            link: "/store-reporting/vendors-sales-reports",
          },
        ],
      },
      // {
      //   id: 66,
      //   text: "Vendor Sales Report",
      //   link: "/store-reporting/vendors-sales-reports",
      // },
      {
        id: 90,
        text: "Item Sales Profit Report",
        link: "/store-reporting/item-sale-profit-report",
      },
      // {
      //   id: 67,
      //   text: "Credit Debit Sales Report",
      //   link: "/store-reporting/credit-debit-sales",
      // },

      // { id: 70, text: "Flash Report", link: "/store-reporting/flash-resigter" },

      // { id: 76, text: "Shift Summary", link: "/store-reporting/shift-summary" },

      // { id: 77, text: " Item Sales ", link: "/store-settings/item-sales" },
      // {
      //   id: 78,
      //   text: " Payment Method Details",
      //   link: "/store-settings/payment-method-detail-report",
      // },

      { id: 77, text: " Item Sales ", link: "/store-reporting/item-sales" },
      { id: 87, text: "Tip Report", link: "/store-reporting/tip-report" },
      { id: 88, text: "Coupon Report", link: "/store-reporting/coupon-report" },
      {
        id: 89,
        text: "Discount Per Sales Person",
        link: "/store-reporting/discount-per-sales-report",
      },
    ],
  },
  {
    id: 4,
    icon: (
      <img
        src={CategoryIconActive}
        alt="Products"
        className="h-6 w-10 mt-4 mb-4 hoverable-image"
      />
    ),
    activeIcon: (
      <img src={CatIcon} alt="Category" className="h-6 w-10 mt-4 mb-4 " />
    ),
    text: "Inventory",
    className: "flex items-center gap-2",
    dropdownItems: [
      {
        id: 1,
        icon: (
          <img
            src={CategoryIconActive}
            alt="Category"
            className="h-6 w-10 mt-4 mb-4 hoverable-image"
          />
        ),
        activeIcon: (
          <img src={CatIcon} alt="Category" className="h-6 w-10 mt-4 mb-4 " />
        ),
        text: "Category",
        link: "/inventory/category",
      },
      {
        id: 2,
        icon: (
          <img
            src={ProductIcon}
            alt="Products"
            className="h-6 w-10 mt-4 mb-4 hoverable-image"
          />
        ),
        activeIcon: (
          <img src={ProdIcon} alt="Products" className="h-6 w-10 mt-4 mb-4 " />
        ),
        text: "Products",
        link: "/inventory/products",
      },
      {
        id: 3,
        icon: (
          <img
            src={AttributesIcon}
            alt="Attributes"
            className="h-6 w-10 mt-4 mb-4 hoverable-image"
          />
        ),
        activeIcon: (
          <img src={AtriIcon} alt="atributes" className="h-6 w-10 mt-4 mb-4" />
        ),
        text: "Attributes",
        link: "/attributes",
      },
    ],
  },

  {
    id: 5,
    icon: (
      <img
        src={PurchaseIcon}
        alt="Purchase Data"
        className="h-6 w-10 mt-4 mb-4 hoverable-image"
      />
    ),
    activeIcon: (
      <img src={PurIcon} alt="Purchase" className="h-6 w-10 mt-4 mb-4" />
    ),
    text: "Purchase Orders",
    link: "/purchase-data",
  },
  {
    id: 12,
    icon: (
      <img
        src={PurchaseIcon}
        alt="Purchase Data"
        className="h-6 w-10 mt-4 mb-4 hoverable-image"
      />
    ),
    activeIcon: (
      <img src={PurIcon} alt="Purchase" className="h-6 w-10 mt-4 mb-4" />
    ),
    text: "Stocktake",
    link: "/stocktake",
  },
  {
    id: 6,
    icon: <img src={VenIcon} alt="Vendors" className="h-6 w-10 mt-4 mb-4" />,
    activeIcon: (
      <img src={VenIconActive} alt="Vendors" className="h-6 w-10 mt-4 mb-4 " />
    ),
    text: "Vendors",
    link: "/vendors",
  },
  {
    id: 7,
    icon: (
      <img
        src={dataIcon}
        alt="Employees"
        className="h-6 w-10 mt-4 mb-4 hoverable-image"
      />
    ),
    activeIcon: (
      <img src={DataIconActive} alt="Import" className="h-6 w-10 mt-4 mb-4 " />
    ),
    text: "Employees",
    dropdownItems: [
      // {
      //   id: 1,
      //   text: "Employees",
      //   link: "/#",
      // },
      {
        id: 2,
        icon: (
          <img
            src={timesheetblackIcon}
            alt="Timesheet"
            className="h-6 w-10 mt-4 mb-4 hoverable-image"
          />
        ),
        activeIcon: (
          <img
            src={TimesheetsIcon}
            alt="Timesheet"
            className="h-6 w-10 mt-4 mb-4 "
          />
        ),
        text: "Timesheet",
        link: "/timesheet",
      },
    ],
  },
  {
    id: 8,
    icon: <img src={CouponIcon} alt="Coupons" className="h-6 w-10 mt-4 mb-4" />,
    activeIcon: (
      <img src={CouIcon} alt="Coupons" className="h-6 w-10 mt-4 mb-4 " />
    ),
    text: "Coupons",
    link: "/coupons",
  },
  {
    id: 9,
    icon: (
      <img
        src={StoreSettingIcon}
        alt="store"
        className="h-6 w-10 mt-4 mb-4 hoverable-image"
      />
    ),
    activeIcon: (
      <img
        src={SettingIcon}
        alt="active store"
        className="h-6 w-10 mt-4 mb-4"
      />
    ),
    text: "Store Settings",
    link: "/store-settings/info",
    className: "flex items-center gap-2",
    dropdownItems: [
      {
        id: 6,
        text: "Store",
        className: "flex items-center gap-2",
        dropDownItems: [
          // { id: 1, text: "Profile", link: "#" },
          { id: 61, text: "Info", link: "/store-settings/info" },
          { id: 62, text: "Setup", link: "/store-settings/setup" },
          {
            id: 63,
            icon: (
              <img
                src={CouponIcon}
                alt="option"
                className="h-6 w-10 mt-4 mb-4"
              />
            ),
            activeIcon: (
              <img src={CouIcon} alt="option" className="h-6 w-10 mt-4 mb-4 " />
            ),
            text: "Option",
            link: "/store-settings/options",
          },
        ],
      },

      {
        id: 64,
        icon: (
          <img src={CouponIcon} alt=" Alerts " className="h-6 w-10 mt-4 mb-4" />
        ),
        activeIcon: (
          <img src={CouIcon} alt=" Alerts " className="h-6 w-10 mt-4 mb-4 " />
        ),
        text: " Alerts ",
        link: "/store-settings/Alters",
      },
      { id: 65, text: "Taxes", link: "/store-settings/taxes" },

      {
        id: 66,
        icon: (
          <img
            src={CouponIcon}
            alt="Add Employee"
            className="h-6 w-10 mt-4 mb-4"
          />
        ),
        activeIcon: (
          <img src={CouIcon} alt="option" className="h-6 w-10 mt-4 mb-4 " />
        ),
        text: "Add Employee",
        link: "/store-settings/addemployee",
      },
      // { id: 67, text: "Receipt", link: "/store-settings/receipt" },
      { id: 68, text: "Inventory", link: "/store-settings/inventory" },
      { id: 69, text: "Register Settings", link: "/store-settings/register" },
      // { id: 70, text: "Quick Add", link: "/store-settings/quick-add" },
      { id: 71, text: "System Access", link: "/store-settings/system-access" },
    ],
  },
  // {
  //   id: 10,
  //   icon: (
  //     <img
  //       src={dataIcon}
  //       alt="Import Data"
  //       className="h-6 w-10 mt-4 mb-4 hoverable-image"
  //     />
  //   ),
  //   activeIcon: (
  //     <img src={DataIconActive} alt="Import" className="h-6 w-10 mt-4 mb-4 " />
  //   ),
  //   text: "Import/Export",
  //   dropdownItems: [
  //     {
  //       id: 1,
  //       icon: (
  //         <img
  //           src={dataIcon}
  //           alt="Import Data"
  //           className="h-6 w-10 mt-4 mb-4 hoverable-image"
  //         />
  //       ),
  //       activeIcon: (
  //         <img
  //           src={DataIconActive}
  //           alt="Import"
  //           className="h-6 w-10 mt-4 mb-4 "
  //         />
  //       ),
  //       text: "Import Inventory",
  //       link: "#",
  //     },
  //     {
  //       id: 2,
  //       icon: (
  //         <img
  //           src={dataIcon}
  //           alt="Export Sold Items"
  //           className="h-6 w-10 mt-4 mb-4 hoverable-image"
  //         />
  //       ),
  //       activeIcon: (
  //         <img
  //           src={DataIconActive}
  //           alt="Import"
  //           className="h-6 w-10 mt-4 mb-4 "
  //         />
  //       ),
  //       text: "Export Sold Items",
  //       link: "/import-data",
  //     },
  //     // { id: 83, text: "Tip Report", link: "/store-reporting/tip-report" },
  //     // { id: 84, text: "Coupon Report", link: "/store-reporting/coupon-report" },
  //   ],
  // },
  // {
  //   id: 12,
  //   icon: (
  //     <img
  //       src={dataIcon}
  //       alt="Import Data"
  //       className="h-6 w-10 mt-4 mb-4 hoverable-image"
  //     />
  //   ),
  //   activeIcon: (
  //     <img src={DataIconActive} alt="Import" className="h-6 w-10 mt-4 mb-4 " />
  //   ),
  //   text: "Import Data",
  //   link: "/import-data",
  // },

  // {
  //   id: 91,
  //   icon: (
  //     <img
  //       src={dataIcon}
  //       alt="Export Sold Items"
  //       className="h-6 w-10 mt-4 mb-4 hoverable-image"
  //     />
  //   ),
  //   activeIcon: (
  //     <img src={DataIconActive} alt="Import" className="h-6 w-10 mt-4 mb-4 " />
  //   ),
  //   text: "Import Data",
  //   link: "/import-data",
  // },
  {
    id: 11,
    icon: (
      <img
        src={Loyalty}
        alt="Loyalty Porogram"
        className="h-6 w-10 mt-4 mb-4 hoverable-image"
      />
    ),
    activeIcon: (
      <img src={LoyaltIcon} alt="Import" className="h-6 w-10 mt-4 mb-4 " />
    ),
    text: "Loyalty Porogram",
    link: "/loyalty-program",
  },
];
const SuperAdminMenuItems = [
  // {
  //   id: 1,
  //   icon: (
  //     <img
  //       src={LabelIcon}
  //       alt="labal"
  //       className="h-6 w-10 mt-4 mb-4 hoverable-image"
  //     />
  //   ),
  //   activeIcon: (
  //     <img src={LabelActive} alt="Label" className="h-6 w-10 mt-4 mb-4" />
  //   ),
  //   text: "Label",
  //   link: "/users/view/unapprove/label",
  // },
  {
    id: 2,
    icon: (
      <img
        src={UsersICcon}
        alt="store"
        className="h-6 w-10 mt-4 mb-4 hoverable-image"
      />
    ),
    activeIcon: (
      <img src={UserActive} alt="active store" className="h-6 w-10 mt-4 mb-4" />
    ),
    text: "Users",
    link: "/users/view/unapprove/users/add",
    className: "flex items-center gap-2",
    dropdownItems: [
      { id: 21, text: "Add", link: "/users/addMerchant" },
      { id: 22, text: "Verified Merchant", link: "/users/approve" },
      {
        id: 23,
        icon: (
          <img src={CouponIcon} alt="option" className="h-6 w-10 mt-4 mb-4" />
        ),
        activeIcon: (
          <img src={CouIcon} alt="option" className="h-6 w-10 mt-4 mb-4 " />
        ),
        text: "Unverified Merchant",
        link: "/users/unapprove",
      },

      { id: 26, text: "Customer", link: "/users/customer" },
      { id: 27, text: "Admin", link: "/users/admin" },
      { id: 28, text: "Manager", link: "/users/manager_view" },
    ],
  },

  // {
  //   id: 3,
  //   icon: (
  //     <img
  //       src={NewsletterIcon}
  //       alt="labal"
  //       className="h-6 w-10 mt-4 mb-4 hoverable-image"
  //     />
  //   ),
  //   activeIcon: (
  //     <img
  //       src={NewsletterActive}
  //       alt="Newsletter"
  //       className="h-6 w-10 mt-4 mb-4"
  //     />
  //   ),
  //   text: "Newsletter",
  //   link: "/users/view/unapprove/newsletter",
  // },
  {
    id: 4,
    icon: (
      <img
        src={StoreIcon}
        alt="Store Order"
        className="h-6 w-10 mt-4 mb-4 hoverable-image"
      />
    ),
    activeIcon: (
      <img
        src={StoreActive}
        alt="Store Order "
        className="h-6 w-10 mt-4 mb-4"
      />
    ),
    text: "Store Order",
    link: "/unapprove/store-order",
  },
  {
    id: 5,
    icon: (
      <img
        src={OrderIcon}
        alt="labal"
        className="h-6 w-10 mt-4 mb-4 hoverable-image"
      />
    ),
    activeIcon: (
      <img src={OrderActive} alt="Order Count" className="h-6 w-10 mt-4 mb-4" />
    ),
    text: "Order Count",
    // link: "/users/view/unapprove/order-count",
    link: "/unapprove/order-count",
  },

  {
    id: 6,
    icon: (
      <img
        src={DefaultIcon}
        alt="labal"
        className="h-6 w-10 mt-4 mb-4 hoverable-image"
      />
    ),
    activeIcon: (
      <img
        src={DefaultActive}
        alt="menu-defaults"
        className="h-6 w-10 mt-4 mb-4"
      />
    ),
    text: "Defaults",
    // link: "/users/view/unapprove/menu/defaults",
    link: "/unapprove/defaults",
  },

  // {
  //   id: 7,
  //   icon: (
  //     <img
  //       src={ApkIcon}
  //       alt="release_apk"
  //       className="h-6 w-10 mt-4 mb-4 hoverable-image"
  //     />
  //   ),
  //   activeIcon: (
  //     <img src={ApkActive} alt="release_apk" className="h-6 w-10 mt-4 mb-4" />
  //   ),
  //   text: "Release APK   ",
  //   link: "/users/view/unapprove/release_apk",
  // },
  {
    id: 8,
    icon: (
      <img
        src={DuplicatesIcon}
        alt="labal"
        className="h-6 w-10 mt-4 mb-4 hoverable-image"
      />
    ),
    activeIcon: (
      <img
        src={DuplicatesActive}
        alt="menu-defaults"
        className="h-6 w-10 mt-4 mb-4"
      />
    ),
    text: "Inventory Duplicate",
    link: "/unapprove/inverntory-duplicate",
  },

  {
    id: 9,
    icon: (
      <img
        src={DuplicatesIcon}
        alt="labal"
        className="h-6 w-10 mt-4 mb-4 hoverable-image"
      />
    ),
    activeIcon: (
      <img
        src={DuplicatesActive}
        alt="menu-defaults"
        className="h-6 w-10 mt-4 mb-4"
      />
    ),
    text: "Category Duplicate",
    link: "/unapprove/category-duplicate",
  },

  {
    id: 10,
    icon: (
      <img
        src={DuplicatesIcon}
        alt="duplicates"
        className="h-6 w-10 mt-4 mb-4 hoverable-image"
      />
    ),
    activeIcon: (
      <img
        src={DuplicatesActive}
        alt="menu-defaults"
        className="h-6 w-10 mt-4 mb-4"
      />
    ),
    text: "Product Duplicate",
    link: "/unapprove/product-duplicate",
  },

  {
    id: 11,
    icon: (
      <img
        src={PermissionIcon}
        alt="labal"
        className="h-6 w-10 mt-4 mb-4 hoverable-image"
      />
    ),
    activeIcon: (
      <img
        src={PermissionActive}
        alt="menu-defaults"
        className="h-6 w-10 mt-4 mb-4"
      />
    ),
    text: "Permission",
    link: "/unapprove/create_permission",
  },

  {
    id: 12,
    icon: (
      <img
        src={InverntoryIcon}
        alt="labal"
        className="h-6 w-10 mt-4 mb-4 hoverable-image"
      />
    ),
    activeIcon: (
      <img
        src={InvertoryActive}
        alt="menu-defaults"
        className="h-6 w-10 mt-4 mb-4"
      />
    ),
    text: "Inventory Export",
    link: "/unapprove/invertory-export",
  },

  {
    id: 13,
    icon: (
      <img
        src={InverntoryIcon}
        alt="labal"
        className="h-6 w-10 mt-4 mb-4 hoverable-image"
      />
    ),
    activeIcon: (
      <img
        src={InvertoryActive}
        alt="menu-defaults"
        className="h-6 w-10 mt-4 mb-4"
      />
    ),
    text: "Support Details",
    link: "/unapprove/support-details",
  },

  // {
  //   id: 13,
  //   icon: (
  //     <img
  //       src={MerchantIcon}
  //       alt="labal"
  //       className="h-6 w-10 mt-4 mb-4 hoverable-image"
  //     />
  //   ),
  //   activeIcon: (
  //     <img
  //       src={MerchantActive}
  //       alt="menu-defaults"
  //       className="h-6 w-10 mt-4 mb-4"
  //     />
  //   ),
  //   text: "Merchant Details ",
  //   link: "/users/view/unapprove/merchant-details",
  // },
  // {
  //   id: 12,
  //   icon: (
  //     <img
  //       src={MerchantIcon}
  //       alt="labal"
  //       className="h-6 w-10 mt-4 mb-4 hoverable-image"
  //     />
  //   ),
  //   activeIcon: (
  //     <img
  //       src={MerchantActive}
  //       alt="menu-defaults"
  //       className="h-6 w-10 mt-4 mb-4"
  //     />
  //   ),
  //   text: "Need Help ",
  //   link: "/users/view/unapprove/need-help",
  // },
];

const merchant = [
  {
    // id: 82,
    text: "Store",
    link: "/store",
    icon: (
      <img
        src={storeIcon}
        alt="labal"
        className="h-6 w-10 mt-4 mb-4 hoverable-image"
      />
    ),
    activeIcon: (
      <img
        src={storeIconActive}
        alt="menu-defaults"
        className="h-6 w-10 mt-4 mb-4"
      />
    ),
  },
  {
    // id: 82,
    text: "Manager ",
    link: "/manager",
    icon: (
      <img
        src={ManagerIcon}
        alt="labal"
        className="h-6 w-10 mt-4 mb-4 hoverable-image"
      />
    ),
    activeIcon: (
      <img
        src={ManagerIconActive}
        alt="menu-defaults"
        className="h-6 w-10 mt-4 mb-4"
      />
    ),
  },
];
const ManagerLink = [
  {
    // id: 82,
    text: "Store",
    link: "/store",
  },
];
const MerchantLink = [
  {
    // id: 82,
    text: "Store",
    link: "/store",
    icon: (
      <img
        src={storeIcon}
        alt="labal"
        className="h-6 w-10 mt-4 mb-4 hoverable-image"
      />
    ),
    activeIcon: (
      <img
        src={storeIconActive}
        alt="menu-defaults"
        className="h-6 w-10 mt-4 mb-4"
      />
    ),
  },
];
// }MerchantLink

export default SideMenu;
