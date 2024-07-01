import React, { useEffect, useState } from "react";
import SortIcon from "../../../Assests/Dashboard/sort-arrows-icon.svg";
import DeleteIcon from "../../../Assests/Category/deleteIcon.svg";
import AddTaxesModal from "./AddTaxesModal";
import EditTaxesModal from "./EditTaxesModal";
import { useAuthDetails } from "../../../Common/cookiesHelper";
import {
  fetchtaxesData,
  deleteTax,
} from "../../../Redux/features/Taxes/taxesSlice";
import DraggableTable from "../../../reuseableComponents/DraggableTable";
import { useSelector, useDispatch } from "react-redux";
import { ToastifyAlert } from "../../../CommonComponents/ToastifyAlert";
import DeleteModal from "../../../reuseableComponents/DeleteModal";
import PasswordShow from "../../../Common/passwordShow";

const TaxesDetail = () => {
  const [alltaxes, setalltaxes] = useState([]);
  const { LoginGetDashBoardRecordJson, LoginAllStore, userTypeData } = useAuthDetails();
  const AlltaxesDataState = useSelector((state) => state.taxes);
  const dispatch = useDispatch();
  let AuthDecryptDataDashBoardJSONFormat = LoginGetDashBoardRecordJson;
  const merchant_id = AuthDecryptDataDashBoardJSONFormat?.data?.merchant_id;
  useEffect(() => {
    // let data = {
    //   merchant_id: merchant_id,
    //   ...userTypeData,
    // };
    // if (data) {
    //   dispatch(fetchtaxesData(data));
    // }
    getfetchtaxesDataData()
  }, []);

  const {handleCoockieExpire,getUnAutherisedTokenMessage}=PasswordShow()

  const getfetchtaxesDataData=async()=>{
    try{
      let data = {
        merchant_id: merchant_id,
        ...userTypeData,
      };
      if (data) {
        await dispatch(fetchtaxesData(data)).unwrap();
      }
    }catch(error){
      handleCoockieExpire()
      getUnAutherisedTokenMessage()
    }
  }

  useEffect(() => {
    if (!AlltaxesDataState.loading && AlltaxesDataState.taxesData) {
      setalltaxes(AlltaxesDataState.taxesData);
    }
  }, [
    AlltaxesDataState,
    AlltaxesDataState.loading,
    AlltaxesDataState.taxesData,
  ]);

  // const handleDeleteTax = (id) => {
  //   const data = {
  //     id: id,
  //     merchant_id: merchant_id,
  //     ...userTypeData,
  //   };
  //   const userConfirmed = window.confirm(
  //     "Are you sure you want to delete this tax?"
  //   );
  //   if (userConfirmed) {
  //     if (id) {
  //       dispatch(deleteTax(data));
  //       ToastifyAlert("Taxes Deleted", "success");
  //     }
  //   } else {
  //     console.log("Deletion canceled by user");
  //   }
  // };

  const [deleteTaxeId, setDeleteTaxeId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const handleDeleteTax = (id) => {
    setDeleteTaxeId(id);
    setDeleteModalOpen(true);
  };
  const confirmDeleteCategory = () => {
    if(deleteTaxeId){
      const data = {
        id: deleteTaxeId,
        merchant_id: merchant_id,
        ...userTypeData,
      };
      if (data) {
        dispatch(deleteTax(data));
        ToastifyAlert("Deleted Successfully", "success");
      }
    }
    setDeleteTaxeId(null)
    setDeleteModalOpen(false);
  };


  const mycur = {
    cursor: "pointer",
  };

  return (
    <>
    {/* <div className='box'>
      <div className="q-category-bottom-detail-section mt-6">
        <div className="q-category-bottom-header-sticky ">
          <div className="q-category-bottom-header">
            <span>Taxes</span>
            <AddTaxesModal />
          </div>
        </div>

        <div className="q-category-bottom-header-sticky">
          <div className="q-category-bottom-categories-header">
            <p className="taxes-sort">Sort</p>
            <p className="taxes-title">Title</p>
            <p className="taxes-items">Percentage (%)</p>
            <p className="taxes-enable-disable"></p>
          </div>
        </div>
        <div className="q-category-bottom-categories-listing">
          {alltaxes &&
            alltaxes.length >= 1 &&
            alltaxes.map((taxes, index) => (
              <div
                key={index}
                className="q-category-bottom-categories-single-category"
              >
                <p className="taxes-sort">
                  <img src={SortIcon} alt="sort-icon" className="h-4 w-5" />
                </p>
                <p className="taxes-title">{taxes.title}</p>
                <p className="taxes-title">{taxes.percent}</p>

                {taxes.title === "DefaultTax" ? (
                  // Render only Edit when the title is 'defaulttax'
                  <>
                  
                    <p className="categories_add_delete " style={{ width: '6rem', marginLeft: 'auto',display:"flex" }}>
                      <EditTaxesModal selectedTaxe={taxes}  />
                    </p>
                  </>
                ) : (
                  <>
                    <p className="categories_add_delete " style={{ width: '6rem', marginLeft: 'auto',display:"flex",justifyContent:"space-between" }}>
                      <EditTaxesModal selectedTaxe={taxes} />

                      <img
                        src={DeleteIcon}
                        alt="Delete-icon"
                        style={mycur}
                        className="h-8 w-8"
                        onClick={() => handleDeleteTax(taxes.id)}
                      />
                    </p>
                  </>
                )}
              </div>
            ))}
        </div>
      </div>
      </div> */}

      <div className="box">
        <div className="q-category-bottom-detail-section">
            <div className="">
              <div className="q-category-bottom-header">
                <span>Taxes</span>
                <AddTaxesModal />
              </div>
              <DraggableTable
              tableHead={["Sort", "Title", "Percentage (%)","", ""]}
              tableRow={alltaxes}
              setFunction={setalltaxes}
              editTaxesObj={true}
              deleteTaxButton={{
                deleteTaxButtonEnable: true,
                deletetaxButtonFun: handleDeleteTax,
              }}
              table={"taxes"}
              className="q-category-bottom-categories-single-category"
            />
            </div>
          </div>
          <DeleteModal 
            headerText="Taxe"
            open={deleteModalOpen}
            onClose={() => {setDeleteModalOpen(false)}}
            onConfirm={confirmDeleteCategory}
            />
      </div>
    </>
  );
};

export default TaxesDetail;
