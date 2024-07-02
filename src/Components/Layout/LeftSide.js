import React from "react";

import DashboardMain from "../Dashboard/DashboardMain";
import MainOrder from "./../Orders/MainOrder";
//import MainProduct from '../Category/MainCategory';
import MainPurchase from "../PurchaseOrders/MainPurchase";
import MainAttributes from "../Attributes/MainAttributes";
import MainCategory from "../Category/MainCategory";
import MainCoupon from "../Coupons/MainCoupon";
import ProductEdit from "../Products/ProductEdit";
import MainVendors from "../Vendors/MainVendors";
import MainTimesheet from "../Timesheet/MainTimesheet";
import MainImportData from "../ImportData/MainImportData";
import MainProducts from "../Products/MainProducts";
// import MainStoreSetting from '../StoreSetting/MainStoreSetting';
import MainStoreOption from "../StoreSetting/StoreOption/MainStoreOption";
import EditCategory from "../Category/EditCategory";
import TopTenders from "../Dashboard/TopTenders";

import Info from "../StoreSetting/Info";
import Setup from "../StoreSetting/MainSetup/Setup";
import MainStoreAlters from "../StoreSetting/StoreAlters/MainStoreAlters";
import MainTaxes from "../StoreSetting/Taxes/MainTaxes";
import MainInventory from "../StoreSetting/Inventory/MainInventory";
import MainResigtersetting from "../StoreSetting/ResigterSetting/MainResigtersetting";
import MainSyastemAccess from "../StoreSetting/SystemAccess/MainSystemAccess";
import DailyTtlReport from "../Reporting/DailyReport/DailyTtlReport";
import MainCatedetails from "../Reporting/CategoryDetails/MainCatedetails";
import MainSalesPerson from "../Reporting/SalesByPerson/MainSalesPerson";

import CheckIDVerifyMain from "../Reporting/CheckIDVerify/CheckIDVerifyMain";
import InstantActvity from "../Reporting/InstantPo/InstantActvity";
import TopSallerReport from "../Reporting/TopSaller/TopSallerReport";
import EmployeeWorking from "../Reporting/EmployeeWorkingHours/EmployeeWorking";
import MainSiftSummary from "../Reporting/SiftSummary/MainSiftSummary";
import PaymentMethodReport from "../Reporting/PaymentMehodDetail/PaymentMethodReport";
import MainItem from "../Reporting/ItemType/MainItem";

import MainTaxesReport from "../Reporting/Taxes/MainTaxesReport";
import CurrentInventoryValue from "../Reporting/CurrentInventoryValue/CurrentInventoryValue";

// import MainTaxesReport from "../Reporting/Taxes/MainTaxesReport";

import MainTaxReporting from "../Reporting/Taxes/MainTaxReporting";
import MainAddEmployee from "../StoreSetting/AddEmployee/MainAddEmployee";
import ReceiptMainpage from "../StoreSetting/Receipt/ReceiptMainpage";
import MainItemSales from "../Reporting/ItemSales/MainItemSales";
import NewItemCreatedBetweenList from "../Reporting/NewItemCreatedBetween/NewItemCreatedBetweenList";
import NewItemCreatedBetweenMain from "../Reporting/NewItemCreatedBetween/NewItemCreatedBetweenMain";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import Permission from "../StoreSetting/AddEmployee/Permission";
import OrderSummaryDetails from "../Reporting/SalesByPerson/MainOrderSumaaryDetails/OrderSummaryDetails";
import VendorListMain from "../Reporting/VendorList/VendorListMain";
import VendorSalesReportMain from "../Reporting/VendorSalesReport/VendorSalesReportMain";
import OrderRefundReportMain from "../Reporting/OrderRefundReport/OrderRefundReportMain";
import ReorderInventoryMain from "../Reporting/ReorderInventory/ReorderInventoryMain";
import EditVendors from "../Vendors/EditVendors";
import SingleVendorsDetail from "../Vendors/SingleVendorsDetail";
import AddProducts from "../Products/AddProducts";
import MainLoayalty from "../LoyaltyProgram/MainLoayalty";
import MainEmployeelist from "../Reporting/Employelist/MainEmployeelist";
import AddPo from "../PurchaseOrders/AddPo";
//  import OrderSummeryPage from "../Reporting/orderSummeryPage/orderSummery";
// import MainEmployee from "../Reporting/EmployeeWorkingHours/MainEmployee";
// import MainInvDuplicates from '../InventoryDuplicates/MainInvDuplicates';
import EditCoupon from "../Coupons/EditCoupon";
import StorePage from "../Store/MerchantStore";
import ManagerStore from "../Store/ManagerStore";
import ProductSalesReport from "../Products/ProductSalesReport";
import TipReportMain from "../Reporting/TipReport/TipReportMain";
import CouponReportMain from "../Reporting/CouponReport/CouponReportMain";
import SalesReportMain from "../Reporting/SalesReport/SalesReportMain";
import Discount_Per_Sales from "../Reporting/Discount_Per_Sales/discount_per_sales";
import Items_sales_profit_record from "../Reporting/itemSalesProfitRecord/items_sales_profit_record";
import RefundSummary from "../Reporting/RefundSummary/RefundSummary";
import ReceivePurchaseOrderItems from "../PurchaseOrders/ReceivePurchaseOrderItems";
import ModifyPurchaseOrder from "../PurchaseOrders/ModifyPurchaseOrder";
import InventoryList from "../Reporting/inventoryList/inventoryList";
import ProfitMarginReport from "../Reporting/ProfitMarginReport/profitMarginReport";
import MainStocktake from "../Stocktake/MainStocktake";
import StocktakeReportPrint from "../Stocktake/StocktakeReportPrint";
import AddNewStocktake from "../Stocktake/AddNewStocktake";
import StocktakeList from "../Stocktake/StocktakeList";
import StocktakeReport from "../Stocktake/StocktakeReport";
import AddCategory from "../Category/AddCategory";
import AddCoupon from "../Coupons/AddCoupon";
import AddVendors from "../Vendors/AddVendors";
import NeedHelp from "../NeedHelp/NeedHelp";
const LeftSide = ({ visible }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  });

  return (
    <>
      <div className="w-full">
        <div className="">
          {visible === "dashboard" && <DashboardMain />}
          {visible === "order" && <MainOrder />}
          {visible === "category" && <MainCategory />}
          {visible === "add-category" && <AddCategory />}
          {visible === "purchase-data" && <MainPurchase />}
          {visible === "stocktake" && <StocktakeList />}
          {visible === "stocktake-updateStocktake" && <AddNewStocktake />}
          {visible === "stocktake-AddStocktake" && <AddNewStocktake />}
          {visible === "stocktake-void" && <StocktakeReport />}
          {visible === "stocktake-completed" && <StocktakeReport />}
          {visible === "add-purchase-data" && <AddPo />}
          {visible === "edit-purchase-data" && <ReceivePurchaseOrderItems />}
          {visible === "modify-purchase-order" && <ModifyPurchaseOrder />}
          {visible === "attributes" && <MainAttributes />}
          {visible === "products" && <MainProducts />}
          {visible === "store" && <StorePage />}
          {visible === "manager" && <ManagerStore />}
          {visible === "coupons" && <MainCoupon />}
          {visible === "add-coupons" && <AddCoupon />}
          {visible === "coupons-edit-cop" && <EditCoupon />}
          {visible === "vendors" && <MainVendors />}
          {visible === "add-vendors" && <AddVendors />}
          {visible === "timesheet" && <MainTimesheet />}
          {visible === "import-data" && <MainImportData />}
          {visible === "store-setting" && <MainStoreOption />}
          {visible === "store-setting" && <MainStoreOption />}
          {visible === "category-edit-cat" && <EditCategory />}
          {/* {visible === "product-edit-cat" && <ProductEdit />} */}

          {visible === "toptraders" && <TopTenders />}
          {visible === "productedit" && <ProductEdit />}
          {visible === "product-add" && <AddProducts />}
          {visible === "product-edit" && <AddProducts />}
          {visible === "product-sales" && <ProductSalesReport />}
          {visible === "edit-varient" && <AddProducts />}


          {visible === "info" && <Info />}
          {visible === "need_help" && <NeedHelp />}
          {visible === "setup" && <Setup />}
          {visible === "Alters" && <MainStoreAlters />}
          {visible === "options" && <MainStoreOption />}
          {visible === "taxes" && <MainTaxes />}
          {visible === "inventory" && <MainInventory />}
          {visible === "register" && <MainResigtersetting />}
          {visible === "system-access" && <MainSyastemAccess />}
          {visible === "daily-total-report" && <DailyTtlReport />}
          {visible === "Details-category" && <MainCatedetails />}
          {visible === "report-sales-person" && <MainSalesPerson />}
          {visible === "id-verification" && <CheckIDVerifyMain />}
          {/* {visible === "credit-debit-sales" && < />} */}
          {visible === "inventory-list" && <InventoryList />}
          {visible === "profit-Margin" && <ProfitMarginReport />}
          {visible === "instant-activity" && <InstantActvity />}
          {visible === "overall-top" && <TopSallerReport />}
          {visible === "employee-working-hours" && <EmployeeWorking />}
          {visible === "shift-summary" && <MainSiftSummary />}
          {visible === "payment-method-details" && <PaymentMethodReport />}
          {visible === "order-type" && <MainItem />}

          {visible === "taxes-report" && <MainTaxesReport />}
          {visible === "current-inventory-value" && <CurrentInventoryValue />}
          {visible === "discount-per-sales-person" && <Discount_Per_Sales />}
          {visible === "item-sales-profit-report" && (
            <Items_sales_profit_record />
          )}

          {visible === "addemployee" && <MainAddEmployee />}
          {visible === "employee-list" && <MainEmployeelist />}
          {visible === "receipt" && <ReceiptMainpage />}
          {visible === "item-sales" && <MainItemSales />}
          {visible === "item-create-between" && <NewItemCreatedBetweenMain />}
          {visible === "permission" && <Permission />}
          {visible === "order-summary" && <OrderSummaryDetails />}
          {visible === "vendors-list" && <VendorListMain />}
          {visible === "edit-vendor" && <EditVendors />}
          {visible === "vendor-details" && <SingleVendorsDetail />}
          {visible === "loyalty-program" && <MainLoayalty />}

          {/* {visible === "order-summary" && <OrderSummeryPage />} */}

          {visible === "recorder-inventory" && <ReorderInventoryMain />}

          {visible === "vendors-sales-reports" && <VendorSalesReportMain />}
          {visible === "order-refund-report" && <OrderRefundReportMain />}
          {visible === "refund-report" && <RefundSummary />}
          {visible === "tip-report" && <TipReportMain />}
          {visible === "coupon-report" && <CouponReportMain />}
          {visible === "sales-report" && <SalesReportMain />}
        </div>
      </div>
    </>
  );
};

export default LeftSide;
