import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Switch,
  Link,
  useLocation,
} from "react-router-dom";
import "./index.css";
import Layout from "./Components/Layout/Index";

import DashboardMain from "./Components/Dashboard/DashboardMain";
import MainOrder from "./Components/Orders/MainOrder";
import MainCategory from "./Components/Category/MainCategory";
import EditCategory from "./Components/Category/EditCategory";
import MainPurchase from "./Components/PurchaseOrders/MainPurchase";
import MainAttributes from "./Components/Attributes/MainAttributes";
import MainProducts from "./Components/Products/MainProducts";
import MainCoupon from "./Components/Coupons/MainCoupon";
import MainVendors from "./Components/Vendors/MainVendors";
import MainTimesheet from "./Components/Timesheet/MainTimesheet";
import MainImportData from "./Components/ImportData/MainImportData";
import TopTenders from "./Components/Dashboard/TopTenders";
//import ProductTable from "./Components/Products/ProductTable";
import ProductEdit from "./Components/Products/ProductEdit";
import AddCoupon from "./Components/Coupons/AddCoupon";
// import MainStoreSetting from "./Components/StoreSetting/MainStoreSetting";
import MainReport from "./Components/ReportSetting/MainReport";
import MainAddEmployee from "./Components/StoreSetting/AddEmployee/MainAddEmployee";
import Permission from "./Components/StoreSetting/AddEmployee/Permission";
import MainSyastemAccess from "./Components/StoreSetting/SystemAccess/MainSystemAccess";
// import Info from "./Components/StoreSetting/SubSetting/Info";

import MainInventory from "./Components/StoreSetting/Inventory/MainInventory";

import MainTaxes from "./Components/StoreSetting/Taxes/MainTaxes";

// import Info from "./Components/StoreSetting/SubSetting/Info";

// import Info from "./Components/StoreSetting/SubSetting/Info";
import "./Styles/storeSettingInfo.css";

import "./Styles/AttributesPage.css";

import MainStoreOption from "./Components/StoreSetting/StoreOption/MainStoreOption";
import MainStoreAlters from "./Components/StoreSetting/StoreAlters/MainStoreAlters";

import "./Styles/CategoryPage.css";
import "./Styles/AttributesPage.css";
import "./Styles/PurchasePage.css";
import "./Styles/TableOrderPage.css";
import "./Styles/MainInStore.css";
import "./Styles/MainOrderPage.css";
import "./Styles/CouponDiscount.css";
import "./Styles/ImportData.css";
import "./Styles/DailyDaterange.css";
// import "./Styles/EmployeeWorking.css";
import "./Styles/Table.css";
import "./Styles/DefaultsPage.css";
import "react-loading-skeleton/dist/skeleton.css";

import "./Styles/ReceiptMainpage.css";
import "./Styles/MainCatedetails.css";
import MainResigtersetting from "./Components/StoreSetting/ResigterSetting/MainResigtersetting";
import "./Styles/ResigterSettingdata.css";
import ReceiptMainpage from "./Components/StoreSetting/Receipt/ReceiptMainpage";

import InstantActvity from "./Components/Reporting/InstantPo/InstantActvity";
import EmployeeWorking from "./Components/Reporting/EmployeeWorkingHours/EmployeeWorking";
import MainSiftSummary from "./Components/Reporting/SiftSummary/MainSiftSummary";

import CheckIDVerifyMain from "./Components/Reporting/CheckIDVerify/CheckIDVerifyMain";

import PaymentMethodReport from "./Components/Reporting/PaymentMehodDetail/PaymentMethodReport";

import NewItemCreatedBetweenMain from "./Components/Reporting/NewItemCreatedBetween/NewItemCreatedBetweenMain";
import ReorderInventoryMain from "./Components/Reporting/ReorderInventory/ReorderInventoryMain";

import MainItem from "./Components/Reporting/ItemType/MainItem";
import MainItemSales from "./Components/Reporting/ItemSales/MainItemSales";
import MainEmployeelist from "./Components/Reporting/Employelist/MainEmployeelist";
import MainTaxesReport from "./Components/Reporting/Taxes/MainTaxesReport";
import MainSalesPerson from "./Components/Reporting/SalesByPerson/MainSalesPerson";
import Login from "./Components/Authenticate/login";
import ForgetPassword from "./Components/Authenticate/forgetPassword/forgetPassword";
// import StoreList from './Components/StoreRcord/storeList'
// import MainInvDuplicates from "./Components/InventoryDuplicates/MainInvDuplicates";
import Main from "./Main";
import "./Styles/OrderSummaryDetails.css";
import "./Styles/Table.css";
import LeftSide from "./Components/Layout/LeftSide";
import SideMenu from "./Components/Layout/SideMenu";
import { useEffect, useState } from "react";
import { useMediaQuery } from "@mui/material";
// import InventoryExport from "./Components/InventoryExport/MainInventoryExport";
import ProtectedRoute from "./protected/protectedRoute";
import ProtectedOrderSummery from "./protected/protectedOrderSummery";
import ProtectedStoreRoute from "./protected/protectedStoreRoute";
import PaymentCalDetails from "./Components/Reporting/SalesByPerson/MainOrderSumaaryDetails/PaymentCalDetails";
import PageNotFound from "./Components/PageNotFound/PageNotFound";
import PrintPurchaseOrder from "./Components/PurchaseOrders/PrintPurchaseOrder";
import StocktakeReportPrint from "./Components/Stocktake/StocktakeReportPrint";
import MainNeedHelp from "./AllUserComponents/NeedHelp/MainNeedHelp";
import { emptyProduct } from "./Redux/features/Product/ProductSlice";
import { useDispatch } from "react-redux";

function App() {
  const location = useLocation();
  const dispatch = useDispatch();
  const isTabletNav = useMediaQuery("(max-width:1024px)");
  const [isMenuOpen, setIsMenuOpen] = useState(!isTabletNav);
  const currentUrl = location.pathname;
  const [isSideBar, setIsSideBar] = useState(false);
  useEffect(() => {
    setIsMenuOpen(!isTabletNav);
    if (!isTabletNav) {
    }
  }, [isTabletNav]);
  useEffect(() => {
    if (currentUrl.split("/")[2] === "order-summary") {
      setIsSideBar(true);
    } else {
      setIsSideBar(false);
    }
  }, [currentUrl]);

  useEffect(() => {
    if (!location.pathname.includes("products")) {
      dispatch(emptyProduct([]));
    }
  }, [location]);

  return (
    <>
      <Routes>
        {/* <Route exact path="/" element={<Main />} /> */}
        {/* <Route exact path="/" element={<Layout />} /> */}

        {/* <Route
        exact  props.merchant_id
        path="/users/view/unapprove"
        element={<Main visible={"multimerchant"} />}/forgot-password
      /> */}
        <Route exact path="/login" element={<Login visible={"login"} />} />
        <Route
          exact
          path="/forgot-password"
          element={<ForgetPassword visible={"forgot-password"} />}
        />
        <Route
          exact
          // path="/users/view/unapprove/menu/defaults/edit-defaults/:defaultsCode"
          path="/unapprove/defaults/edit-defaults/:defaultsCode"
          element={<Main visible={"edit-defaults"} />}
        />
        <Route
          exact
          // path="/users/view/unapprove/menu/defaults/edit-defaults/:defaultsCode"
          path="/unapprove/defaults/add-defaults"
          element={<Main visible={"add-defaults"} />}
        />
        <Route element={<ProtectedOrderSummery visible="manager" />}>
          <Route
            path="/order/store-reporting/order-summary/:merchant_id/:order_id"
            element={<PaymentCalDetails visible={"order-summary"} />}
          />
        </Route>
        <Route element={<ProtectedStoreRoute visible="manager" />}>
          <Route exact path="/store" element={<Main visible={"store"} />} />
          <Route exact path="/manager" element={<Main visible={"manager"} />} />
        </Route>
        <Route path="/print-purchase-order" element={<PrintPurchaseOrder />} />
        <Route
          path="/stocktake/print-stocktake-report"
          element={<StocktakeReportPrint />}
        />
        <Route
          exact
          path="/users/view/unapprove/need-help"
          element={<MainNeedHelp />}
        />
        {/* <Route exact path="/store" element={<Main visible={"store"} />} /> */}
        <Route element={<ProtectedRoute visible="manager" />}>
          {/* <Route exact path="/manager" element={<Main visible={"manager"} />} /> */}
          <Route index path="/" element={<Main visible={"dashboard"} />} />
          <Route exact path="/order" element={<Main visible={"order"} />} />
          <Route
            exact
            path="/inventory/category"
            element={<Main visible={"category"} />}
          />
          <Route
            exact
            path="/inventory/category/add"
            element={<Main visible={"add-category"} />}
          />
          <Route
            exact
            path="inventory/products"
            element={<Main visible={"products"} />}
          />
          <Route
            exact
            path="inventory/products/saleshistory/:id/:varientId"
            element={<Main visible={"product-sales"} />}
          />
          <Route path="*" element={<PageNotFound />} />

          <Route
            exact
            path="inventory/products/saleshistory/:id"
            element={<Main visible={"product-sales"} />}
          />

          <Route
            exact
            path="inventory/products/varient-edit/:id/:varientName"
            element={<Main visible={"edit-varient"} />}
          />

          <Route
            exact
            path="inventory/products/edit/:id"
            element={<Main visible={"product-edit"} />}
          />

          <Route
            exact
            path="/purchase-data"
            element={<Main visible={"purchase-data"} />}
          />
          <Route
            exact
            path="/purchase-data/add"
            element={<Main visible={"add-purchase-data"} />}
          />
          <Route
            exact
            path="/purchase-data/:id"
            element={<Main visible={"edit-purchase-data"} />}
          />
          <Route
            exact
            path="/purchase-data/edit/:id"
            element={<Main visible={"modify-purchase-order"} />}
          />
          <Route
            exact
            path="/stocktake"
            element={<Main visible={"stocktake"} />}
          />
          <Route
            exact
            path="/stocktake/UpdateStocktake/:id"
            element={<Main visible={"stocktake-updateStocktake"} />}
          />
          <Route
            exact
            path="/stocktake/AddStocktake"
            element={<Main visible={"stocktake-AddStocktake"} />}
          />
          <Route
            exact
            path="/stocktake/void/:id"
            element={<Main visible={"stocktake-void"} />}
          />
          <Route
            exact
            path="/stocktake/completed/:id"
            element={<Main visible={"stocktake-completed"} />}
          />
          <Route
            exact
            path="/attributes"
            element={<Main visible={"attributes"} />}
          />

          <Route
            exact
            path="/loyalty-program"
            element={<Main visible={"loyalty-program"} />}
          />
          <Route exact path="/coupons" element={<Main visible={"coupons"} />} />
          <Route
            exact
            path="/coupons/add"
            element={<Main visible={"add-coupons"} />}
          />
          <Route
            exact
            path="/coupons-add"
            element={<Main visible={"add-coupons"} />}
          />
          <Route
            exact
            path="/coupons/edit-coupons/:couponsCode"
            element={<Main visible={"coupons-edit-cop"} />}
          />
          <Route exact path="/vendors" element={<Main visible={"vendors"} />} />
          <Route
            exact
            path="/vendors/add"
            element={<Main visible={"add-vendors"} />}
          />
          <Route
            exact
            path="/vendors-add"
            element={<Main visible={"add-vendors"} />}
          />
          <Route
            exact
            path="/vendors/edit-vendor/:code"
            element={<Main visible={"edit-vendor"} />}
          />
          <Route
            exact
            path="/vendors/vendor-details/:code"
            element={<Main visible={"vendor-details"} />}
          />
          <Route
            exact
            path="/inventory/category/edit-category/:categoryCode"
            element={<Main visible={"category-edit-cat"} />}
          />

          <Route
            exact
            path="/timesheet"
            element={<Main visible={"timesheet"} />}
          />
          <Route
            exact
            path="/toptraders"
            element={<Main visible={"toptraders"} />}
          />
          <Route
            exact
            path="/productedit"
            element={<Main visible={"productedit"} />}
          />
          <Route
            exact
            path="inventory/products/add"
            element={<Main visible={"product-add"} />}
          />

          <Route exact path="/add-po" element={<Main visible={"add-po"} />} />

          <Route
            exact
            path="/store-settings/info"
            element={<Main visible={"info"} />}
          />
          <Route
            exact
            path="/store-settings/setup"
            element={<Main visible={"setup"} />}
          />

          <Route
            exact
            path="/store-settings/Alters"
            element={<Main visible={"Alters"} />}
          />
          <Route
            exact
            path="/store-settings/options"
            element={<Main visible={"options"} />}
          />

          <Route
            path="/store-settings/permission/:employee_id"
            element={<Main visible={"permission"} />}
          />

          {/* <Route
            path="/store-reporting/order-summary/:order_id"
            element={<Main visible={"order-summary"} />}
          /> */}

          <Route
            exact
            path="/store-settings/taxes"
            element={<Main visible={"taxes"} />}
          />
          <Route
            exact
            path="/store-settings/system-access"
            element={<Main visible={"system-access"} />}
          />

          <Route
            exact
            path="/store-settings/inventory"
            element={<Main visible={"inventory"} />}
          />

          <Route
            exact
            path="/store-settings/vendors-list"
            element={<Main visible={"vendors-list"} />}
          />

          <Route
            exact
            path="/store-reporting/vendors-sales-reports"
            element={<Main visible={"vendors-sales-reports"} />}
          />
          <Route
            exact
            path="/store-settings/refund-report"
            element={<Main visible={"refund-report"} />}
          />

          <Route
            exact
            path="/store-settings/order-refund-report"
            element={<Main visible={"order-refund-report"} />}
          />

          <Route
            exact
            path="/store-settings/register"
            element={<Main visible={"register"} />}
          />
          <Route
            exact
            path="/store-reporting/inventory"
            element={<Main visible={"inventory"} />}
          />
          <Route
            exact
            path="/store-reporting/daily-total-report"
            element={<Main visible={"daily-total-report"} />}
          />
          <Route
            exact
            path="/store-reporting/Details-category"
            element={<Main visible={"Details-category"} />}
          />
          <Route
            exact
            path="/store-reporting/report-sales-person"
            element={<Main visible={"report-sales-person"} />}
          />
          <Route
            exact
            path="/store-reporting/order-summary:Sales"
            element={<Main visible={"order-summary"} />}
          />

          <Route
            exact
            path="/store-reporting/id-verification"
            element={<Main visible={"id-verification"} />}
          />
          <Route
            exact
            path="/store-reporting/inventory-list"
            element={<Main visible={"inventory-list"} />}
          />
          <Route
            exact
            path="/store-reporting/profit-margin-report"
            element={<Main visible={"profit-Margin"} />}
          />

          <Route
            exact
            path="store-reporting/credit-debit-sales"
            element={<Main visible={"credit-debit-sales"} />}
          />
          <Route
            exact
            path="/store-reporting/instant-activity"
            element={<Main visible={"instant-activity"} />}
          />
          <Route
            exact
            path="/store-reporting/overall-top"
            element={<Main visible={"overall-top"} />}
          />
          <Route
            exact
            path="/store-reporting/flash-resigter"
            element={<Main visible={"flash-resigter"} />}
          />
          <Route
            exact
            path="/store-reporting/vendors-list"
            element={<Main visible={"vendors-list"} />}
          />
          <Route
            exact
            path="/store-reporting/employee-list"
            element={<Main visible={"employee-list"} />}
          />
          <Route
            exact
            path="/store-reporting/recorder-inventory"
            element={<Main visible={"recorder-inventory"} />}
          />
          <Route
            exact
            path="/store-reporting/shift-summary"
            element={<Main visible={"shift-summary"} />}
          />
          <Route
            exact
            path="/store-reporting/payment-method-details"
            element={<Main visible={"payment-method-details"} />}
          />
          <Route
            exact
            path="/store-reporting/order-type"
            element={<Main visible={"order-type"} />}
          />
          <Route
            exact
            path="/store-reporting/taxes-report"
            element={<Main visible={"taxes-report"} />}
          />
          <Route
            exact
            path="/store-settings/addemployee"
            element={<Main visible={"addemployee"} />}
          />
          <Route
            exact
            path="/store-settings/receipt"
            element={<Main visible={"receipt"} />}
          />
          <Route
            exact
            path="/store-reporting/employee-working-hours"
            element={<Main visible={"employee-working-hours"} />}
          />
          <Route
            exact
            path="/store-reporting/item-sales"
            element={<Main visible={"item-sales"} />}
          />
          <Route
            exact
            path="/store-reporting/item-create-between"
            element={<Main visible={"item-create-between"} />}
          />

          <Route
            exact
            path="/store-reporting/sales-report"
            element={<Main visible={"sales-report"} />}
          />
          <Route
            exact
            path="/store-reporting/tip-report"
            element={<Main visible={"tip-report"} />}
          />

          <Route
            exact
            path="/store-reporting/coupon-report"
            element={<Main visible={"coupon-report"} />}
          />

          {/* multiple users dashbaord */}

          <Route
            exact
            path="/users/view/unapprove/label"
            element={<Main visible={"label"} />}
          />
          <Route
            exact
            path="/store-reporting/current-inventory-value"
            element={<Main visible={"current-inventory-value"} />}
          />
          <Route
            exact
            path="/store-reporting/discount-per-sales-report"
            element={<Main visible={"discount-per-sales-person"} />}
          />
          <Route
            exact
            path="/store-reporting/item-sale-profit-report"
            element={<Main visible={"item-sales-profit-report"} />}
          />

          <Route exact path="/toptraders" element={<TopTenders />} />
          <Route
            exact
            path="/users/view/unapprove/menu/defaults/edit-defaults/:defaultsCode"
            element={<Main visible={"edit-defaults"} />}
          />
          <Route
            exact
            path="/users/view/unapprove/permission"
            element={<Main visible={"permission"} />}
          />
        </Route>

        {/* ------------------------Superadmin---------------- */}
        <Route element={<ProtectedRoute visible="superadmin" />}>
          <Route
            exact
            path="/users/manager_view"
            element={<Main visible={"manager_view"} />}
          />
          <Route
            exact
            path="/import-data"
            element={<Main visible={"import-data"} />}
          />
          <Route
            exact
            path="/need-help"
            element={<Main visible={"need_help"} />}
          />
          <Route
            exact
            path="/users/unapprove"
            element={<Main visible={"unverified"} />}
          />
          <Route
            exact
            path="/users/customer"
            element={<Main visible={"customer"} />}
          />
          <Route
            exact
            path="/users/admin"
            element={<Main visible={"admin"} />}
          />
          <Route
            exact
            path="/users/approve"
            element={<Main visible={"verified"} />}
          />
          <Route
            exact
            path="/users/editCustomer/:id"
            element={<Main visible={"editCustomer"} />}
          />
          <Route
            exact
            path="/users/admin/addAdmin"
            element={<Main visible={"addAdmin"} />}
          />
          <Route
            exact
            path="/users/unapprove/editMerchant/:id"
            element={<Main visible={"editMerchant"} />}
          />
          <Route
            exact
            path="/users/approve/editMerchant/:id"
            element={<Main visible={"editMerchant"} />}
          />
          <Route
            exact
            path="/users/admin/editAdmin/:id"
            element={<Main visible={"editAdmin"} />}
          />
          <Route
            exact
            path="/users/addMerchant"
            element={<Main visible={"addMerchant"} />}
          />
          <Route
            exact
            path="/users/view/unapprove/newsletter"
            element={<Main visible={"newsletter"} />}
          />
          <Route
            exact
            path="/unapprove/store-order"
            element={<Main visible={"store-order"} />}
          />
          <Route
            exact
            path="/unapprove/order-count"
            element={<Main visible={"order-count"} />}
          />
          <Route
            exact
            // path="/users/view/unapprove/menu/defaults"
            path="/unapprove/defaults"
            element={<Main visible={"defaults"} />}
          />
          <Route
            exact
            path="/users/view/unapprove/release_apk"
            element={<Main visible={"release_apk"} />}
          />
          <Route
            exact
            path="/unapprove/inverntory-duplicate"
            element={<Main visible={"inverntory-duplicate"} />}
          />
          <Route
            exact
            path="unapprove/category-duplicate"
            element={<Main visible={"category-duplicate"} />}
          />
          <Route
            exact
            path="/unapprove/product-duplicate"
            element={<Main visible={"product-duplicate"} />}
          />
          <Route
            exact
            path="/unapprove/create_permission"
            element={<Main visible={"create_permission"} />}
          />
          <Route
            exact
            path="/unapprove/invertory-export"
            element={<Main visible={"invertory-export"} />}
          />
           <Route
            exact
            path="/unapprove/support-details"
            element={<Main visible={"support-details"} />}
          />
          <Route
            exact
            path="/users/view/unapprove/merchant-details"
            element={<Main visible={"merchant-details"} />}
          />
        </Route>

        {/* -----------------=============superadmin===========------------------- */}

        {/* <Route exact path="/" element={<DashboardMain />} /> */}

        {/* <Route path="/report" element={<MainReport />} /> */}
        {/* <Route path="/store-settings/taxes" element={<MainTaxes />} /> */}

        {/* <Route path="/store-settings/info"  element={<MainStoreOption />} /> */}
        {/* <Route path="/store-settings/options" element={<MainStoreOption />} /> */}
        {/* <Route

      <Route exact path="/users/view/unapprove" element={<Main  visible={"multimerchant"} />} />
      <Route exact path="/dashboard" element={<Main  visible={"dashboard"} />} />
      <Route exact path="/order" element={<Main  visible={"order"} />} />
      <Route exact path="/category" element={<Main  visible={"category"} />} />
      <Route exact path="/products" element={<Main  visible={"products"} />} />
      <Route exact path="/purchase-data" element={<Main  visible={"purchase-data"} />} />
      <Route exact path="/attributes" element={<Main  visible={"attributes"} />} />
      <Route exact path="/import-data" element={<Main  visible={"import-data"} />} />
      <Route exact path="/coupons" element={<Main  visible={"coupons"} />} />
      <Route exact path="/vendors" element={<Main  visible={"vendors"} />} />
      <Route exact path="/category/edit-category/:categoryCode" element={<Main  visible={"category-edit-cat"} />} />
      <Route exact path="/timesheet" element={<Main  visible={"timesheet"} />} />
      <Route exact path="/toptraders" element={<Main  visible={"toptraders"} />} />
      <Route exact path="/productedit" element={<Main  visible={"productedit"} />} />
      <Route exact path="/productedit" element={<Main  visible={"productedit"} />} />
      <Route exact path="/store-settings/info" element={<Main  visible={"info"} />} />
      <Route exact path="/store-settings/setup" element ={<Main visible={"setup"} />} />
   
      <Route exact path="/store-settings/Alters" element ={<Main visible={"Alters"} />} />
      <Route exact path="/store-settings/options" element ={<Main visible={"options"} />} />
      <Route exact path="/store-settings/taxes" element ={<Main visible={"taxes"} />} />
      <Route exact path="/store-settings/system-access" element ={<Main visible={"system-access"} />} />
      <Route exact path="/store-settings/inventory" element ={<Main visible={"inventory"} />} />
      <Route exact path="/store-reporting/register" element ={<Main visible={"register"} />} />
      <Route exact path="/store-reporting/inventory" element ={<Main visible={"inventory"} />} />
      <Route exact path="/store-reporting/daily-total-report" element ={<Main visible={"daily-total-report"} />} />
     <Route exact path="/store-reporting/Details-category" element ={<Main visible={"Details-category"} />} />
     <Route exact path="/store-reporting/report-sales-person" element ={<Main visible={"report-sales-person"} />} />
     <Route exact path="/store-reporting/id-verification" element ={<Main visible={"id-verification"} />} />
     
     <Route exact path="store-reporting/credit-debit-sales" element ={<Main visible={"credit-debit-sales"} />} />
     <Route exact path="/store-reporting/instant-activity" element ={<Main visible={"instant-activity"} />} />
     <Route exact path="/store-reporting/overall-top" element ={<Main visible={"overall-top"} />} />
     <Route exact path="/store-reporting/flash-resigter" element ={<Main visible={"flash-resigter"} />} />
     <Route exact path="/store-reporting/vendors-list" element ={<Main visible={"vendors-list"} />} />
     <Route exact path="/store-reporting/employee-list" element ={<Main visible={"employee-list"} />} />
     
     <Route exact path="/store-reporting/recorder-inventory" element ={<Main visible={"recorder-inventory"} />} />
     
     <Route exact path="/store-reporting/shift-summary" element ={<Main visible={"shift-summary"} />} />
     <Route exact path="/store-settings/payment-method-detail-report" element={<Main visible={"payment-method-detail-report"} />} />
     <Route exact path ="/store-reporting/order-type" element={<Main visible={"order-type"} />} />
     <Route exact path="/store-reporting/taxes" element={<Main visible={"taxes"} />} />

   

     {/* multiple users dashbaord */}

        {/* <Route
            exact
            path="/users/view/unapprove/category-duplicate"
            element={<Main visible={"category-duplicate"} />}
          /> */}

        {/* <Route
            exact
            path="/users/view/unapprove/invertory-export"
            element={<Main visible={"invertory-export"} />}
          /> */}

        {/* <Route exact path="/" element={<DashboardMain />} /> */}

        {/* <Route path="/store-settings/info"  element={<MainStoreOption />} /> */}

        {/* /store-settings/inventory */}
        {/* <Route path="/store-reporting/inventory" element={<MainInventory />} /> */}

        {/* <Route
          path="/store-reporting/employee-list"
          element={<MainEmployeelist />}
        /> */}

        {/* <Route
          path="/store-reporting/permission/:employee_id"
          element={<Permission />}
        /> */}

        {/* <Route
          path="/store-reporting/id-verification"
          element={<CheckIDVerifyMain />}
        /> */}
        {/* <Route path="/store-reporting/order-type" element={<MainItem />} />
        <Route path="/store-reporting/item-sales" element={<MainItemSales />} />
        <Route path="/store-reporting/taxes" element={<MainTaxesReport />} /> */}

        {/* <Route
          path="/store-settings/payment-method-detail-report"
          element={<PaymentMethodReport />}
        /> */}

        {/* <Route
          path="/store-settings/item-create-between"
          element={<NewItemCreatedBetweenMain />}
        /> */}
        {/* 
        <Route
          path="/store-settings/recorder-inventory"
          element={<ReorderInventoryMain />}
        /> */}
      </Routes>
    </>
  );
}
export default App;
