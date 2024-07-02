import React, { useState } from "react";
import Layout from "./Components/Layout/Index";
import IndexAllUsers from "./AllUserComponents/MainAllUserMenu/IndexAllUsers";
import SideMenu from "./Components/Layout/SideMenu";
import { useMediaQuery } from "@mui/material";

const Main = ({ visible }) => {
  const isTabletNav = useMediaQuery("(max-width:1024px)");
  const [isMenuOpen, setIsMenuOpen] = useState(!isTabletNav);
  return (
    <>
      {/* Sidebar */}
      <SideMenu
        setIsMenuOpen={setIsMenuOpen}
        isTabletNav={isTabletNav}
        isMenuOpen={isMenuOpen}
      />

      {/* signle user layout */}
      {visible === "dashboard" && <Layout visible={visible} />}
      {visible === "order" && <Layout visible={visible} />}
      {visible === "category" && <Layout visible={visible} />}
      {visible === "add-category" && <Layout visible={visible} />}
      {visible === "products" && <Layout visible={visible} />}
      {visible === "purchase-data" && <Layout visible={visible} />}
      {visible === "stocktake" && <Layout visible={visible} />}
      {visible === "stocktake-updateStocktake" && <Layout visible={visible} />}
      {visible === "stocktake-AddStocktake" && <Layout visible={visible} />}
      {visible === "stocktake-void" && <Layout visible={visible} />}
      {visible === "stocktake-completed" && <Layout visible={visible} />}
      {visible === "add-purchase-data" && <Layout visible={visible} />}
      {visible === "edit-purchase-data" && <Layout visible={visible} />}
      {visible === "modify-purchase-order" && <Layout visible={visible} />}

      {visible === "attributes" && <Layout visible={visible} />}
      {visible === "import-data" && <Layout visible={visible} />}
      {visible === "loyalty-program" && <Layout visible={visible} />}
      {visible === "coupons" && <Layout visible={visible} />}
      {visible === "add-coupons" && <Layout visible={visible} />}
      {visible === "coupons-edit-cop" && <Layout visible={visible} />}
      {visible === "vendors" && <Layout visible={visible} />}
      {visible === "add-vendors" && <Layout visible={visible} />}
      {visible === "timesheet" && <Layout visible={visible} />}
      {visible === "category-edit-cat" && <Layout visible={visible} />}
      {/* {visible === "product-edit-cat" && <Layout visible={visible} />} */}
      {visible === "toptraders" && <Layout visible={visible} />}
      {visible === "product-edit" && <Layout visible={visible} />}
      {visible === "product-sales" && <Layout visible={visible} />}
      {visible === "product-add" && <Layout visible={visible} />}
      {visible === "edit-varient" && <Layout visible={visible} />}
      {visible === "add-po" && <Layout visible={visible} />}
      {visible === "store" && <Layout visible={visible} />}
      {visible === "manager" && <Layout visible={visible} />}

      {visible === "info" && <Layout visible={visible} />}
      {visible === "setup" && <Layout visible={visible} />}
      {visible === "Alters" && <Layout visible={visible} />}
      {visible === "options" && <Layout visible={visible} />}
      {visible === "taxes" && <Layout visible={visible} />}
      {visible === "taxes-report" && <Layout visible={visible} />}
      {visible === "system-access" && <Layout visible={visible} />}
      {visible === "inventory" && <Layout visible={visible} />}
      {visible === "register" && <Layout visible={visible} />}

      {visible === "daily-total-report" && <Layout visible={visible} />}
      {visible === "Details-category" && <Layout visible={visible} />}
      {visible === "report-sales-person" && <Layout visible={visible} />}
      {visible === "id-verification" && <Layout visible={visible} />}
      {visible === "inventory-list" && <Layout visible={visible} />}
      {visible === "profit-Margin" && <Layout visible={visible} />}
      {visible === "vendors-sales-reports" && <Layout visible={visible} />}
      {visible === "credit-debit-sales" && <Layout visible={visible} />}
      {visible === "instant-activity" && <Layout visible={visible} />}
      {visible === "overall-top" && <Layout visible={visible} />}
      {visible === "flash-resigter" && <Layout visible={visible} />}
      {visible === "employee-list" && <Layout visible={visible} />}
      {visible === "item-create-between" && <Layout visible={visible} />}
      {visible === "recorder-inventory" && <Layout visible={visible} />}
      {visible === "employee-working-hours" && <Layout visible={visible} />}
      {visible === "shift-summary" && <Layout visible={visible} />}
      {visible === "payment-method-details" && <Layout visible={visible} />}
      {visible === "order-type" && <Layout visible={visible} />}
      {visible === "current-inventory-value" && <Layout visible={visible} />}
      {visible === "discount-per-sales-person" && <Layout visible={visible} />}
      {visible === "item-sales-profit-report" && <Layout visible={visible} />}

      {visible === "addemployee" && <Layout visible={visible} />}
      {visible === "receipt" && <Layout visible={visible} />}
      {visible === "item-sales" && <Layout visible={visible} />}
      {visible === "permission" && <Layout visible={visible} />}
      {visible === "order-summary" && <Layout visible={visible} />}
      {visible === "vendors-list" && <Layout visible={visible} />}
      {visible === "order-refund-report" && <Layout visible={visible} />}
      {visible === "refund-report" && <Layout visible={visible} />}
      {visible === "edit-vendor" && <Layout visible={visible} />}
      {visible === "vendor-details" && <Layout visible={visible} />}
      {visible === "sales-report" && <Layout visible={visible} />}
      {visible === "tip-report" && <Layout visible={visible} />}
      {visible === "coupon-report" && <Layout visible={visible} />}

      {/* multip user layout */}
      {visible === "multimerchant" && <IndexAllUsers />}
      {visible === "label" && <IndexAllUsers visible={visible} />}
      {visible === "newsletter" && <IndexAllUsers visible={visible} />}
      {visible === "store-order" && <IndexAllUsers visible={visible} />}
      {visible === "order-count" && <IndexAllUsers visible={visible} />}
      {visible === "need_help" && <IndexAllUsers visible={visible} />}
      {visible === "defaults" && <IndexAllUsers visible={visible} />}
      {visible === "release_apk" && <IndexAllUsers visible={visible} />}
      {visible === "inverntory-duplicate" && (
        <IndexAllUsers visible={visible} />
      )}
      {visible === "product-duplicate" && <IndexAllUsers visible={visible} />}
      {visible === "category-duplicate" && <IndexAllUsers visible={visible} />}

      {visible === "create_permission" && <IndexAllUsers visible={visible} />}
      {visible === "invertory-export" && <IndexAllUsers visible={visible} />}
      {visible === "support-details" && <IndexAllUsers visible={visible} />}
      {visible === "merchant-details" && <IndexAllUsers visible={visible} />}

      {visible === "edit-defaults" && <IndexAllUsers visible={visible} />}
      {visible === "add-defaults" && <IndexAllUsers visible={visible} />}
      {visible === "manager_view" && <IndexAllUsers visible={visible} />}
      {visible === "unverified" && <IndexAllUsers visible={visible} />}
      {visible === "customer" && <IndexAllUsers visible={visible} />}
      {visible === "admin" && <IndexAllUsers visible={visible} />}
      {visible === "verified" && <IndexAllUsers visible={visible} />}
      {visible === "editCustomer" && <IndexAllUsers visible={visible} />}
      {visible === "editAdmin" && <IndexAllUsers visible={visible} />}
      {visible === "addMerchant" && <IndexAllUsers visible={visible} />}
      {visible === "editMerchant" && <IndexAllUsers visible={visible} />}
      {visible === "addAdmin" && <IndexAllUsers visible={visible} />}
    </>
  );
};

export default Main;
