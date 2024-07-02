import React, { useEffect, useState ,useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Box, Collapse, Alert, IconButton, Grid } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Select from "react-select";
import DownIcon from "../../Assests/Dashboard/Down.svg";
import CrossIcons from "../../Assests/MultipleUserIcon/crossIcons.svg";
import axios from "axios";
import { fetchMerchantsList } from "../../Redux/features/ExportInventory/ExportInventorySlice";
import {
  BASE_URL,
  LIST_ALL_PRODUCTS,
  PRODUCT_INVENTORY_DUPLICATE,
} from "../../Constants/Config";
import { useAuthDetails } from "../../Common/cookiesHelper";
import SelectDropDown from "../../reuseableComponents/SelectDropDown";
import { ToastifyAlert } from "../../CommonComponents/ToastifyAlert";
import AlertModal from "../../reuseableComponents/AlertModal";
import { LuRefreshCw } from "react-icons/lu";
import BasicTextFields from "../../reuseableComponents/TextInputField";
import PasswordShow from "./../../Common/passwordShow";
const ProductDuplicateStore = () => {
  const [storeFromError, setStoreFromError] = useState("");
  const [storeToError, setStoreToError] = useState("");

  const [selectedStorefrom, setSelectedStorefrom] =
    useState("-- Select Store --");
  const [selectedStoreto, setSelectedStoreto] = useState("-- Select Store --");
  const [selectedProducts, setselectedProducts] = useState([]);
  const [categoryFocus, setCategoryFocus] = useState(false);
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [alertModalHeaderText, setAlertModalHeaderText] = useState("");
  const [userInput, setUserInput] = useState(''); 
  const [captchaText, setCaptchaText] = useState(''); 

  const handlFocusCategory = () => {
    setCategoryFocus(true);
  };

  const showModal = (headerText) => {
    setAlertModalHeaderText(headerText);
    setAlertModalOpen(true);
  };
  
  const { userTypeData } = useAuthDetails();
  const { token, ...userTypeDataNew } = userTypeData;
  const {handleCoockieExpire,getUnAutherisedTokenMessage}=PasswordShow()
  const [storeFromDropdownVisible, setStoreFromDropdownVisible] =
    useState(false);
  const [storeToDropdownVisible, setStoreToDropdownVisible] = useState(false);

  const toggleDropdown = (dropdown) => {
    switch (dropdown) {
      case "storefrom":
        setStoreFromDropdownVisible(!storeFromDropdownVisible);
        break;
      case "storeto":
        setStoreToDropdownVisible(!storeToDropdownVisible);
        break;
      default:
        break;
    }
  };

  const [storefrom, setStorefrom] = useState();
  const [storeto, setStoreto] = useState();

  const handleOptionClick = async (value, dropdown) => {
    switch (dropdown) {
      case "storefrom":
        setSelectedStorefrom(value?.title ? value?.title : value);
        setStoreFromDropdownVisible(false);

        // Fetch additional data based on the selected merchant's ID
        if (value !== "-- Select Store --") {
          const data = {
            merchant_id: value?.id,
            ...userTypeDataNew,
          };
          try {
            const response = await axios.post(
              BASE_URL + LIST_ALL_PRODUCTS,
              data,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            if (response.data.status === "Success") {
              const newProductOptions = response?.data?.result?.map(
                (product) => ({
                  value: product.id,
                  label: product.title,
                })
              );
              setStorefrom(value?.id);
              setProductOptions(newProductOptions);
              setselectedProducts([]);
            } else if (
              response.data.status === "Failed" &&
              response.data.msg === "No Products found"
            ) {
              setProductOptions([
                { value: "No Products found", label: "No Products found" },
              ]);
              setselectedProducts([]);
            }
          } catch (error) {
            console.error("API Error:", error);
          }
        }
        if (value == "-- Select Store --") {
          setStoreFromError("This field is required");
        } else {
          setStoreFromError("");
        }
        break;
      case "storeto":
        // setSelectedStoreto(value?.title);
        setSelectedStoreto(value?.title ? value?.title : value);
        setStoreToDropdownVisible(false);
        if (value?.id !== "-- Select Store --") {
          setStoreto(value?.id);
        }
        if (value?.title == "-- Select Store --") {
          setStoreToError("This field is required");
        } else {
          setStoreToError("");
        }
        break;
      default:
        break;
    }
  };

  const handleProductChange = (selectedOptions) => {
    const MAX_OPTIONS = 5;
    if (selectedOptions.length <= MAX_OPTIONS) {
      setselectedProducts(selectedOptions);
    } else {
      // alert("You can select up to 5 options.");
      showModal("You can select up to 5 options.")
    }
    // setselectedProducts(selectedOptions);
  };

  const [productOptions, setProductOptions] = useState([
    { value: "Select Product", label: "Select Product" },
  ]);

  const [isSelectClicked, setIsSelectClicked] = useState(false);

  const handleSelectClick = () => {
    setIsSelectClicked(true);
  };

  const handleSelectBlur = () => {
    setIsSelectClicked(false);
  };

  // const handleCancelClick = () => {
  //   setselectedProducts([]);
  // };
  const handleCancelClick = (removedValue) => {
    const newSelectedProducts = selectedProducts.filter(
      (product) => product.value !== removedValue
    );
    setselectedProducts(newSelectedProducts);
  };

  // for fetch mearcahnt list start
  const [MerchantList, setMerchantList] = useState();
  const MerchantListData = useSelector((state) => state.ExportInventoryData);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!MerchantListData.loading && MerchantListData.MerchantListData) {
      setMerchantList(MerchantListData.MerchantListData);
    }
  }, [MerchantListData, MerchantListData.loading]);

  useEffect(() => {
    // dispatch(fetchMerchantsList(userTypeData));
    getFetchMerchantsList()
  }, []);
  const getFetchMerchantsList=async()=>{
    try{
      const data = {
        ...userTypeData
      };
      if (data) {
        await dispatch(fetchMerchantsList(data)).unwrap();
      }
    }catch(error){
      handleCoockieExpire()
      getUnAutherisedTokenMessage()
    }
  }

  const myStyles = {
    height: "300px",
    overflow: "auto",
  };

  const [openAlert, setOpenAlert] = useState(true);
  const [submitmessage, setsubmitmessage] = useState();
  const [excludedproducts, setexcludedproducts] = useState();
  const goToTop = () => {
    setsubmitmessage();
    setexcludedproducts();
  };

  const dupplicateProductInventory = async (e) => {
    e.preventDefault();

    if (selectedStorefrom === "-- Select Store --") {
      // alert("Please select Store From");
      showModal("Select where you want to move product from");
    } else if (selectedStoreto === "-- Select Store --") {
      // alert("Please select Store To");
      showModal("Please select Store To");
    } else if (selectedStorefrom === selectedStoreto) {
      // alert("Both the selected store are same.");
      showModal("Both the stores cannot be same.")

    } else {
      const upcCheckbox = document.getElementById("upc_check");

      // Check if the checkbox is present and get its value
      const isUpcChecked = upcCheckbox ? upcCheckbox.checked : false;
      const productValues = selectedProducts.map((product) => product.value);
      if (productValues.length === 0) {
        // alert("Please select at least one Product");
        showModal("Please select at least on product")
        return;
      } else if (productValues.includes("No Products found")) {
        // alert("No Products found is not a Product");
        showModal("No Products found is not a Product")
        return;
      }

      if (userInput === captchaText) { 

      const data = {
        store_name_from: storefrom,
        store_name_to: storeto,
        product_id: productValues,
        upc_check: isUpcChecked,
        ...userTypeDataNew,
      };

      try {
        const response = await axios.post(
          BASE_URL + PRODUCT_INVENTORY_DUPLICATE,
          data,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.status == true) {
          const temp_excludedproducts = response.data.existing_products;
          const commaSeparatedString = temp_excludedproducts.join(", ");
          setexcludedproducts(commaSeparatedString);
          setsubmitmessage("Products Copied successfully ");
          setUserInput("")
          setSelectedStorefrom("-- Select Store --");
          setSelectedStoreto("-- Select Store --");
          // ToastifyAlert("Duplicate Inventory Success!", "success");
          ToastifyAlert("Added Successfully", "success");
          setStorefrom(null);
          setStoreto(null);
          setProductOptions([
            { value: "Select Product", label: "Select Product" },
          ]);
          setselectedProducts([]);
          setIsSelectClicked(false);
        } else if (response.data.status === "Failed") {
          ToastifyAlert("Duplicate Inventory Failed!", "error");
          setsubmitmessage("Something Went Wrong");
        }
      } catch (error) {
        // console.log('33 catch err');
        handleCoockieExpire()
        getUnAutherisedTokenMessage()
        ToastifyAlert("Error!", "error");
        return new Error(error);
      }
      }else{
        showModal("Please Fill Captcha Correctly!")
        const canvas = canvasRef.current; 
        const ctx = canvas.getContext('2d'); 
        initializeCaptcha(ctx); 
      }
    }
  };



  // for captcha start
  const canvasRef = useRef(null); 
  useEffect(() => { 
      const canvas = canvasRef.current; 
      const ctx = canvas.getContext('2d'); 
      initializeCaptcha(ctx); 
  }, []); 

  const generateRandomChar = (min, max) => 
      String.fromCharCode(Math.floor 
          (Math.random() * (max - min + 1) + min)); 
  const generateCaptchaText = () => { 
      let captcha = ''; 
      for (let i = 0; i < 3; i++) { 
          captcha += generateRandomChar(65, 90); 
          // captcha += generateRandomChar(97, 122); 
          captcha += generateRandomChar(48, 57); 
      } 
      return captcha.split('').sort( 
          () => Math.random() - 0.5).join(''); 
  }; 
  const drawCaptchaOnCanvas = (ctx, captcha) => { 
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); 
      const textColors = ['rgb(0,0,0)', 'rgb(130,130,130)']; 
      const letterSpace = 150 / captcha.length; 
      for (let i = 0; i < captcha.length; i++) { 
          const xInitialSpace = 25; 
          ctx.font = '20px Roboto Mono'; 
          ctx.fillStyle = textColors[Math.floor( 
              Math.random() * 2)]; 
          ctx.fillText( 
              captcha[i], 
              xInitialSpace + i * letterSpace, 
              // Randomize Y position slightly 
              Math.floor(Math.random() * 16 + 25), 
              100 
          ); 
      } 
  }; 
  const initializeCaptcha = (ctx) => { 
      setUserInput(''); 
      const newCaptcha = generateCaptchaText(); 
      setCaptchaText(newCaptcha); 
      drawCaptchaOnCanvas(ctx, newCaptcha); 
  }; 

  const handleUserInputChange = (e) => { 
      setUserInput(e.target.value); 
  }; 

// for captcha End

  return (
    <>
      <div className="q-order-main-page">
        {/* <div className="q-add-categories-section"> */}
        <div class="q-category-top-detail-section">
          <li>
            The existing Attributes of the selected Store 2 Must be same as
            selected Store 1 Variants.
          </li>
        </div>
        <div className=" box_shadow_div_order">
          {/* <div className="alert">
            {submitmessage && (
              <Box
                sx={{
                  width: "100%",
                  position: "relative",
                  top: "2rem",
                  marginLeft: "auto",
                }}
                className={submitmessage ? "form-submit-info-message" : ""}
              >
                <Collapse in={openAlert}>
                  <Alert
                    severity="info"
                    action={
                      <IconButton
                        className="info-close-icon"
                        aria-label="close"
                        color="info"
                        size="small"
                        onClick={goToTop}
                      >
                        <CloseIcon />
                      </IconButton>
                    }
                    sx={{ mb: 2 }}
                  >
                    {submitmessage}
                  </Alert>
                </Collapse>
              </Box>
            )}
          </div> */}

          {/* <div className="alert">
            {excludedproducts && (
              <Box
                sx={{
                  width: "100%",
                  position: "relative",
                  top: "2rem",
                  marginLeft: "auto",
                }}
                className={excludedproducts ? "form-submit-info-message" : ""}
              >
                <Collapse in={openAlert}>
                  <Alert
                    severity="info"
                    action={
                      <IconButton
                        className="info-close-icon"
                        aria-label="close"
                        color="info"
                        size="small"
                        onClick={goToTop}
                      >
                        <CloseIcon />
                      </IconButton>
                    }
                    sx={{ mb: 2 }}
                  >
                    Excluded products : {excludedproducts}
                  </Alert>
                </Collapse>
              </Box>
            )}
          </div> */}

          <div className="q-add-categories-section-header">
            <span>
              <span>Product Duplicate</span>
            </span>
          </div>

          <div className="q-order-page-container mx-6 mt-6 md:flex-col d-flex">
            <Grid container spacing={4} className="">
              {/* StoreFrom Dropdown */}
              <Grid item xs={6} sm={12} md={6}>
                <label
                  className="q-details-page-label"
                  htmlFor="storefromFilter"
                >
                  Copy from this store
                </label>
                <SelectDropDown
                  listItem={
                    MerchantList?.length &&
                    MerchantList?.map((item) => ({
                      title: item?.name,
                      id: item?.merchant_id,
                    }))
                  }
                  heading={"-- Select Store --"}
                  title={"title"}
                  selectedOption={selectedStorefrom}
                  onClickHandler={handleOptionClick}
                  dropdownFor={"storefrom"}
                  name="permission"
                />
              </Grid>
              {/* Multiple Select Categories */}
              <Grid item xs={6} sm={12} md={6}>
                <div
                  className={`py-0 ${
                    isSelectClicked
                      ? "select-clicked select-cat-unique"
                      : "select-cat-unique"
                  }`}
                >
                  <label
                    className="q-details-page-label mt-2"
                    htmlFor="categoryFilter"
                  >
                    Select Products
                  </label>

                  <Select
                    className={categoryFocus ? "category-select" : ""}
                    isMulti
                    value={selectedProducts}
                    onChange={handleProductChange}
                    options={productOptions}
                    isCreatable={true}
                    onClick={handleSelectClick}
                    onBlur={handleSelectBlur}
                    onFocus={handlFocusCategory}
                    components={{
                      MultiValue: ({ data, innerProps }) => (
                        <div
                          className="css-wsp0cs-MultiValueGeneric"
                          {...innerProps}
                        >
                          {data.label}
                          <button
                            type="button"
                            className="cancel-button "
                            onClick={() => handleCancelClick(data.value)}
                          >
                            <img
                              src={CrossIcons}
                              alt=""
                              className="w-4 h-4 ml-6 pt-1"
                            />
                          </button>
                        </div>
                      ),
                      IndicatorsContainer: ({ children }) => (
                        <div className="css-1xc3v61-indicatorContainer">
                          {children}
                        </div>
                      ),
                      Control: ({ children, innerProps }) => (
                        <div
                          className={`css-13cymwt-control ${
                            isSelectClicked ? "select-clicked" : ""
                          }`}
                          {...innerProps}
                        >
                          {children}
                        </div>
                      ),
                    }}
                  />
                </div>
              </Grid>
              <Grid item xs={6} sm={12} md={6}>
                <label
                  className="q-details-page-label"
                  htmlFor="storefromFilter"
                >
                  Paste to this store
                </label>
                <SelectDropDown
                  listItem={
                    MerchantList?.length &&
                    MerchantList?.map((item) => ({
                      title: item?.name,
                      id: item?.merchant_id,
                    }))
                  }
                  heading={"-- Select Store --"}
                  title={"title"}
                  selectedOption={selectedStoreto}
                  onClickHandler={handleOptionClick}
                  dropdownFor={"storeto"}
                  name="permission"
                />
              </Grid>
            </Grid>
          </div>


          <div className="q-add-inventory-section-header mx-2">
            <div className="qv_checkbox">
              <label className="qv_checkbox_add_checkmark_label">
                Want to Replicate UPC's for inventory
                <input type="checkbox" id="upc_check" name="upc_check" />
                <span className="qv_add_checkmark"></span>
              </label>
            </div>
          </div>

          {/* for captcha start  */}

          <div className="captcha_wrapper ">
                  <div className="captue_Img_Reload"> 
                    <canvas ref={canvasRef} width="200" height="50" onClick={  () => initializeCaptcha(canvasRef.current.getContext('2d'))}> 
                    </canvas> 
                    <button id="reload-button" onClick={   () => initializeCaptcha(canvasRef.current.getContext('2d'))}> 
                        <LuRefreshCw /> 
                    </button> 
                  </div>
              </div>
              <div className="q-order-page-container mx-6 mb-6 md:flex-col d-flex">
                <Grid container spacing={4} >
                  <Grid item xs={6} sm={12} md={6}>
                    <BasicTextFields
                    type="text"
                    id="user-input"
                    name="actual_amt"
                    onChangeFun={handleUserInputChange}
                    value={userInput} 
                    placeholder={"Enter the text in the image"}
                    /> 
                  </Grid>
                </Grid>
                </div>
          {/* for captcha End */}

          <div
            className="q-add-categories-section-middle-footer "
            style={{ justifyContent: "start" }}
          >
            <button
              className="quic-btn quic-btn-save"
              onClick={dupplicateProductInventory}
            >
              Duplicate Inventory
            </button>
          </div>
        </div>
      </div>

      {/* </div> */}
      <AlertModal
      headerText={alertModalHeaderText}
      open={alertModalOpen}
      onClose={() => {setAlertModalOpen(false)}}
       />
    </>
  );
};

export default ProductDuplicateStore;
