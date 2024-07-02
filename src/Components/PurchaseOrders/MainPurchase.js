import React, { useState } from "react";

import PurchaseTable from "./PurchaseTable";

const MainPurchase = () => {
  const [visible, seVisible] = useState("PurchaseTable");

  return (
    <>
      <div className="q-category-main-page">
        <div className="box">
          {visible === "PurchaseTable" && (
            <PurchaseTable seVisible={seVisible} />
          )}
        </div>
      </div>
    </>
  );
};

export default MainPurchase;
