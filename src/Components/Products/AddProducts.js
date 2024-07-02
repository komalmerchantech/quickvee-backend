import React, { useEffect, useRef, useState } from "react";
import AddNewCategory from "../../Assests/Dashboard/Left.svg";
import VariantAttributes from "./VariantAttributes";
import UploadIMG from "../../Assests/Filter/imgupload.svg";
import GeneratePUC from "./GeneratePUC";
import { useDispatch, useSelector } from "react-redux";
import {
  addProduct,
  checkProductTitle,
  checkUpcCode,
  checkUpcCodeMultiple,
  checkUpcCodeSingle,
  checkUpcOnVarientEdit,
  editProductData,
  emptyProduct,
  fetchCategoryList,
  fetchProductList,
  fetchProductsData,
  fetchProductsDataById,
  fetchTaxList,
  fetchVarientList,
  fetchVarietDataById,
  getInventorySetting,
  getInventorySettingOnVarient,
  setVarientList,
  updateEditVarient,
  updateFormValue,
} from "../../Redux/features/Product/ProductSlice";
import Validation from "../../Constants/Validation";
import SearchableDropdown from "../../CommonComponents/SearchableDropdown";
import "../../Styles/ProductPage.css";
import CloseIcon from "../../Assests/Dashboard/cross.svg";
import CircularProgress from "@mui/material/CircularProgress";
import { Box } from "@mui/material";
import * as yup from "yup";
import AlertModal from "../../CommonComponents/AlertModal";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "../../Constants/Config";
import EditPage from "./EditPage";
import Loader from "../../CommonComponents/Loader";

import { toast } from "react-toastify";
import { ToastifyAlert } from "../../CommonComponents/ToastifyAlert";
import CkEditorInput from "../../CommonComponents/CkEditorInput";
import { useAuthDetails } from "../../Common/cookiesHelper";
import PasswordShow from "../../Common/passwordShow";

const AddProducts = () => {
  const fileUploadRef = useRef();
  const dispatch = useDispatch();
  const { isLoading, isError, isEditError, isFetchLoading } = useSelector(
    (state) => state?.productsListData
  );
  const { userTypeData, LoginGetDashBoardRecordJson } = useAuthDetails();
  const { getUnAutherisedTokenMessage } = PasswordShow();
  const navigate = useNavigate();

  const [fetchDataLoading, setFetchDataLoading] = useState(false);
  const location = useLocation();

  // find add or edit url
  const pageUrl =
    window.location.pathname.split("/")[1] +
    "/" +
    window.location.pathname.split("/")[2] +
    "/" +
    window.location.pathname.split("/")[3];

  // find productId from Url
  const productId = useParams();
  const { validatTitle, validatDescription, addVarientFormValidation } =
    Validation();
  const [formValue, setFormValue] = useState({});
  const [filterOptionList, setFilterOptionList] = useState([]);
  const [productInfo, setProductInfo] = useState({
    title: "",
    description: "",
    category: [],
    taxes: [],
    relatedProduct: [],
    frequentlyBought: [],
    files: [],
  });

  const [bulkEditPo, setBulkEditPo] = useState([
    {
      quantity: "",
      Cost: "",
    },
  ]);

  const [isUpcvalid, setIsUpcvalid] = useState("");

  //fetch data states
  const [productData, setProductData] = useState({});
  const [inventoryData, setInventoryData] = useState({});
  const [options, setOptions] = useState({});
  const [varientData, setVarientData] = useState([]);
  const [varientLoading, setVarientLoading] = useState(false);

  const orderOptions = (values) => {
    return values
      .filter((v) => v?.isFixed)
      .concat(values.filter((v) => !v?.isFixed));
  };

  const [varientLength, setVarientLength] = useState(
    orderOptions([{ id: 1, varientName: "", varientAttributeList: [] }])
  );

  /// varientTitle combination list
  let varientTitle = [];
  let titleTimeoutId;
  const [error, setError] = useState({
    title: "",
    description: "",
    category: "",
    taxes: "",
    relatedProduct: "",
    frequentlyBought: "",
    files: "",
    formValue: [],
  });

  const [isMultipleVarient, setIsMultipleVaient] = useState(true);

  const [clearInput, setClearInput] = useState(false);
  const [openAlertModal, setOpenAlertModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [varientIndex, setVarientIndex] = useState(null);
  const [varientId, setVarientId] = useState("");
  const [isVarientEdit, setIsVarientEdit] = useState(false);

  // close alert
  const handleCloseAlertModal = () => {
    setOpenAlertModal((prev) => !prev);
  };

  const handleCloseEditModal = (modalType, varientId) => {
    console.log('varientId', varientId);
    setOpenEditModal((prev) => !prev);
    setModalType(modalType);
    setVarientIndex(varientId);
  };

  // useEffect(()=>{
  //   const findVarientIndex = varientData?.find((item)=> item?.id === varientIndex);
  //   setVarientId(findVarientIndex?.productEditId);
  // }, [handleCloseEditModal, varientData, varientIndex])
  // clear all form input value
  const handleClearFormData = (value) => {
    setClearInput(value);
  };

  // formValue Schema

  const formValueInnerSchema = yup.object().shape({
    price: yup.string().required("Price is required"),
    qty: yup.string().required("Quantity is required"),
    upcCode: yup.string().required("UPC Code is required"),
  });

  const formInnerSchemaOnSingle = yup.array().of(
    yup.object({
      price: yup.string().required("Price is required"),
      qty: yup.string().required("Quantity is required"),
      upcCode: yup.string().required("UPC Code is required"),
    })
  );

  // Define the schema for the dynamic formValue array
  const formValueSchema = yup.array().of(
    yup.lazy((value) => {
      const key = Object.keys(value)[0];
      return yup.object().shape({
        [key]: formValueInnerSchema,
      });
    })
  );

  const formSingleVarientChange = yup.object().shape({
    formValue: !isMultipleVarient ? formInnerSchemaOnSingle : formValueSchema,
  });

  // formschema for validation
  const formSchema = yup.object().shape({
    title: yup.string().required("Title is required"),
    category: yup.array().min(1, "Select Category").required("Select Category"),
    formValue: !isMultipleVarient ? formInnerSchemaOnSingle : formValueSchema,
  });

  // add varient form validation fetch previous and add new updated object
  // useEffect(() => {
  //   setError((prevState) => ({
  //     ...prevState,
  //     formValue: formValue.map((_, index) => {
  //       const previousData = prevState?.formValue[index] || {};
  //       return {
  //         costPerItem: previousData.costPerItem || "",
  //         compareAtPrice: previousData.compareAtPrice || "",
  //         price: previousData.price || "",
  //         margin: previousData.margin || "",
  //         profit: previousData.profit || "",
  //         qty: previousData.qty || "",
  //         upcCode: previousData.upcCode || "",
  //         customCode: previousData.customCode || "",
  //         reorderQty: previousData.reorderQty || "",
  //         reorderLevel: previousData.reorderLevel || "",
  //         trackQuantity: previousData.trackQuantity || true,
  //         sellOutOfStock: previousData.sellOutOfStock || true,
  //         checkId: previousData.checkId || false,
  //         disable: previousData.disable || false,
  //         itemForAllLinkedLocation:
  //           previousData.itemForAllLinkedLocation || false,
  //       };
  //     }),
  //   }));
  // }, [formValue]);

  const [costPer, setCostPer] = useState(null);
  // const [varientTitle, setVarientTitle] = useState([]);

  const [uploadImage, setUploadImage] = useState([]);

  const [varientError, setVarientError] = useState({
    error: "",
    errorIndex: null,
  });

  const [productTitleError, SetProductTitleError] = useState(false);
  const [dropdownData, setDropdowndata] = useState({
    varientList: [],
    taxList: [],
    categoryList: [],
    relatedProducttList: [],
    frequentlyBroughtList: [],
  });

  // toggle multiple or single varient attribute option
  const toggleVarientSection = () => {
    if (!isMultipleVarient) {
      setIsMultipleVaient((prev) => {
        return !prev;
      });
      setError({
        title: "",
        description: "",
        category: "",
        taxes: "",
        relatedProduct: "",
        frequentlyBought: "",
        files: "",
        varientLength: "",
        formValue: [],
      });
      if (pageUrl !== "inventory/product/edit") {
        setVarientLength([
          {
            id: 1,
            varientName: dropdownData?.varientList?.length
              ? {
                  value: dropdownData?.varientList[0]?.title,
                  label: dropdownData?.varientList[0]?.title,
                }
              : "",
            varientAttributeList: [],
          },
        ]);
        setFormValue({});
        // setProductInfo({
        //   title: "",
        //   description: "",
        //   category: [],
        //   taxes: [],
        //   relatedProduct: [],
        //   frequentlyBought: [],
        //   files: [],
        // });
      }
    } else {
      setIsMultipleVaient((prev) => {
        return !prev;
      });
      setError({
        title: "",
        description: "",
        category: "",
        taxes: "",
        relatedProduct: "",
        frequentlyBought: "",
        files: "",
        varientLength: "",
        formValue: [],
      });
      if (pageUrl !== "inventory/products/edit") {
        setFormValue([
          {
            costPerItem: "",
            compareAtPrice: "",
            price: "",
            margin: "",
            profit: "",
            qty: "",
            upcCode: "",
            customCode: "",
            reorderQty: "",
            reorderLevel: "",
            trackQuantity: true,
            sellOutOfStock: true,
            checkId: false,
            disable: false,
            isFoodStamble: false,
            // itemForAllLinkedLocation: false,
          },
        ]);
        // setProductInfo({
        //   title: "",
        //   description: "",
        //   category: [],
        //   taxes: [],
        //   relatedProduct: [],
        //   frequentlyBought: [],
        //   files: [],
        // });
      }
    }
  };

  const handleOnBlurAttributes = (e) => {
    if (e.key === "Enter" || e.key === "Tab") {
      handleVarientTitleBasedItemList();
    }
  };

  const handleSelectProductOptions = (value, name) => {
    setProductInfo((prev) => ({
      ...prev,
      [name]: [...prev[name], value],
    }));
  };

  const handleDeleteSelectedOption = (id, name) => {
    const filterOptionItems = productInfo[name].filter(
      (item) => item?.id !== id
    );
    setProductInfo((prev) => ({
      ...prev,
      [name]: filterOptionItems,
    }));
  };

  const handleProductInfo = async (e, ckEditorData) => {
    let name, value;
    if (e?.target?.name === "title") {
      name = e?.target?.name;
      value = e?.target?.value;
    }

    if (name === "title") {
      const formData = new FormData();
      formData.append("title", value);
      formData.append("id", productData?.id);
      formData.append(
        "merchant_id",
        LoginGetDashBoardRecordJson?.data?.merchant_id
      );
      formData.append("login_type", userTypeData?.login_type);
      formData.append("token_id", userTypeData?.token_id);
      formData.append("token", userTypeData?.token);

      // Clear previous timeout if exists
      clearTimeout(titleTimeoutId);

      // Call the API after one second
      titleTimeoutId = setTimeout(async () => {
        try {
          const res = await dispatch(checkProductTitle(formData));
          if (res?.payload?.status) {
            SetProductTitleError(false);
          } else {
            SetProductTitleError(true);
          }
        } catch (error) {
          // Handle any errors from the API call
          console.error("Error:", error);
        }
      }, 500);
    }
    // update only when CkEditor value change
    else if (e?.name === "change:data") {
      setProductInfo((prev) => ({
        ...prev,
        ["description"]: ckEditorData,
      }));
    }

    // update when type in any input
    setProductInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
    switch (name) {
      case "title":
        await validatTitle(value, error);
        break;
      // case "description":
      //   await validatDescription(value, error);
      //   break;
      default:
        break;
    }
    handleUpdateError(error);
  };

  const handleSetVarientLength = (updatedVarient) => {
    setVarientLength(orderOptions(updatedVarient));
  };
  const addMoreVarientItems = () => {
    const checkEmpty = varientLength?.map((item, i) => {
      if (!item?.varientAttributeList?.length || !item?.varientName) {
        setVarientError({
          error: "Please enter the Varients",
          errorIndex: i,
        });
        return false;
      } else {
        setVarientError({
          error: "",
          errorIndex: null,
        });
        return true;
      }
    });
    if (checkEmpty.every((i) => Boolean(i))) {
      setVarientLength((prev) => [
        ...prev,
        {
          id: prev?.length + 1,
          varientName: filterOptionList?.length
            ? {
                value: filterOptionList[0]?.title,
                label: filterOptionList[0]?.title,
              }
            : "",
          varientAttributeList: [],
        },
      ]);
    }
  };

  const handleDeleteSelectedImage = (type, imageToDelete) => {
    let deleteImage;
    if (type === "string") {
      deleteImage = productInfo?.files?.filter((img) => {
        return img !== imageToDelete;
      });
    } else {
      deleteImage = productInfo?.files?.filter((img) => {
        return img?.file?.name !== imageToDelete?.file?.name;
      });
    }
    setProductInfo((prev) => ({
      ...prev,
      ["files"]: deleteImage,
    }));
  };
  const nameArray = ["costPerItem", "upcCode", "customCode"];

  const notAllowDecimalValue = [
    "qty",
    "upcCode",
    "customCode",
    "reorderQty",
    "reorderLevel",
  ];

  const openFileInput = () => {
    fileUploadRef.current.click();
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  // Function to handle image drop
  const handleDrop = (event) => {
    event.preventDefault();
    let files = [];
    files = [...event?.dataTransfer?.files];
    if (files?.length) {
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
      files?.forEach((img) => {
        if (allowedTypes.includes(img?.type)) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setProductInfo((prevValue) => ({
              ...prevValue,
              ["files"]: [
                ...prevValue["files"],
                { file: img, base64: reader.result },
              ],
            }));
          };
          reader.readAsDataURL(img);
        } else {
          alert(`Only jpeg, png, jpg files can be uploaded`);
          event.target.value = null;
        }
      });
    }
  };

  // copy Bulk varient value from modal
  const handleCopyAllVarientValue = (values) => {
    setFormValue((prev) => {
      // Create a deep copy of the previous state
      let newFormValue = JSON.parse(JSON.stringify(prev));

      // Loop through each item in the newFormValue array
      newFormValue.forEach((item) => {
        // Get the nested object (e.g., "small/red", "large/green")
        let nestedKey = Object.keys(item)[0];
        let nestedObject = item[nestedKey];

        // Update the properties based on the input values
        for (let key in values) {
          if (values.hasOwnProperty(key) && values[key] !== "") {
            nestedObject[key] = values[key];
          }
        }
      });

      // Return the updated state
      return newFormValue;
    });
  };

  useEffect(() => {
    // called API
    const formData = new FormData();
    formData.append(
      "merchant_id",
      LoginGetDashBoardRecordJson?.data?.merchant_id
    );
    formData.append("login_type", userTypeData?.login_type);
    formData.append("token_id", userTypeData?.token_id);
    formData.append("token", userTypeData?.token);

    dispatch(getInventorySetting(formData)).then((res) => {
      if (!!+res?.payload) {
        setCostPer(+res?.payload);
      }
    });

    const inventoryData = new FormData();
    inventoryData.append(
      "merchant_id",
      LoginGetDashBoardRecordJson?.data?.merchant_id
    );

    const inventoryList = {
      merchant_id: LoginGetDashBoardRecordJson?.data?.merchant_id,
      ...userTypeData,
    };

    dispatch(fetchVarientList(inventoryList)).then((res) => {
      setDropdowndata((prev) => ({
        ...prev,
        ["varientList"]: res?.payload?.result,
      }));
    });
    dispatch(fetchCategoryList(inventoryData)).then((res) => {
      setDropdowndata((prev) => ({
        ...prev,
        ["categoryList"]: res?.payload?.result,
      }));
    });
    dispatch(fetchTaxList(inventoryData)).then((res) => {
      setDropdowndata((prev) => ({
        ...prev,
        ["taxList"]: res?.payload?.result,
      }));
    });
    dispatch(fetchProductList(inventoryData)).then((res) => {
      setDropdowndata((prev) => ({
        ...prev,
        ["relatedProducttList"]: res?.payload?.result,
        ["frequentlyBroughtList"]: res?.payload?.result,
      }));
    });

    return () => dispatch(emptyProduct([]));
  }, []);

  const handleFilterDropdownOption = (updatedDropdownList) => {
    setFilterOptionList(updatedDropdownList);
  };

  const handleImageChange = (e) => {
    setUploadImage(e.target.files);
    let files = [];
    files = [...e?.target?.files];
    if (files?.length) {
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
      files?.forEach((img) => {
        if (allowedTypes.includes(img?.type)) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setProductInfo((prevValue) => ({
              ...prevValue,
              ["files"]: [
                ...prevValue["files"],
                { file: img, base64: reader.result },
              ],
            }));
          };
          reader.readAsDataURL(img);
        } else {
          alert(`Only jpeg, png, jpg files can be uploaded`);
          e.target.value = null;
        }
      });
    }
  };

  const handleBlur = async (e, i, title) => {
    const checkUpcValueforSingle = async (value, name) => {
      if (value && name === "upcCode") {
        let isAllowed = false;

        if (!isVarientEdit) {
          const data = {
            merchant_id: LoginGetDashBoardRecordJson?.data?.merchant_id,
            upc: value,
            id: pageUrl === "inventory/products/edit" ? productId?.id : "",
          };

          const response = isMultipleVarient
            ? await dispatch(checkUpcCodeMultiple(data))
            : await dispatch(checkUpcCodeSingle(data));
          if (response?.payload === true) {
            isAllowed = true;
          }
        } else {
          const data = {
            merchant_id: LoginGetDashBoardRecordJson?.data?.merchant_id,
            upc: value,
            variant_id: formValue[0]?.productEditId,
            ...userTypeData,
          };

          const response = await dispatch(checkUpcOnVarientEdit(data));

          if (response?.payload?.status === "true") {
            isAllowed = true;
          }
        }
        return isAllowed;
      }
      return true; // Allow empty value
    };

    const checkLocalDuplicateForSingle = (upcCode, currentIndex) => {
      return formValue.some((item, index) => {
        return index !== currentIndex && item?.upcCode === upcCode;
      });
    };

    const checkUpcValue = async (value, name) => {
      if (value && name === "upcCode") {
        let isAllowed = true;
        const data = {
          merchant_id: LoginGetDashBoardRecordJson?.data?.merchant_id,
          upc: value,
          product_id:
            pageUrl === "inventory/products/edit" ? productId?.id : "",
        };

        const response = isMultipleVarient
          ? await dispatch(checkUpcCodeMultiple(data))
          : await dispatch(checkUpcCodeSingle(data));

        if (response?.payload?.status === "true") {
          isAllowed = true;
        } else if (response?.payload?.status === "false") {
          isAllowed = false;
        }
        return isAllowed;
      }
    };

    const checkLocalDuplicate = (upcCode, currentIndex) => {
      if (!!upcCode) {
        return formValue.some((item, index) => {
          if (index !== currentIndex) {
            const currentTitle = Object.keys(item)[0];
            return item[currentTitle]?.upcCode === upcCode;
          }
          return false;
        });
      }
    };

    const { name, value, type, checked } = e.target;

    /// convert input value format 0.00
    let fieldValue;
    if (!notAllowDecimalValue.includes(name)) {
      fieldValue = value
        // Remove extra dots and ensure only one dot exists at most
        .replace(/[^\d.]/g, "") // Allow digits and dots only
        .replace(/^(\d*\.)(.*)\./, "$1$2") // Remove extra dots
        .replace(/^(\d*\.\d*)(.*)\./, "$1$2"); // Remove extra dots after the decimal point

      let inputStr = fieldValue.replace(/\D/g, "");
      inputStr = inputStr.replace(/^0+/, "");

      if (inputStr.length == "") {
        fieldValue = "";
      } else if (inputStr.length === 1) {
        fieldValue = "0.0" + inputStr;
      } else if (inputStr.length === 2) {
        fieldValue = "0." + inputStr;
      } else {
        fieldValue =
          inputStr.slice(0, inputStr.length - 2) + "." + inputStr.slice(-2);
      }
    }
    // allowed alphanumeric value in upcCode field but not allowed decimal value
    else if (name === "upcCode") {
      fieldValue = fieldValue = value
        // Remove extra dots and ensure only one dot exists at most
        .replace(/[^\w.]/g, "") // Allow alphanumeric characters, digits, and dots only
        .replace(/^(\d*\.)(.*)\./, "$1$2") // Remove extra dots
        .replace(/^(\d*\.\d*)(.*)\./, "$1$2"); // Remove extra dots after the decimal point

      let inputStr = fieldValue.replace(/[^\w]/g, "");
      if (inputStr == "0") {
        fieldValue = "0";
      } else {
        fieldValue = inputStr.toUpperCase();
      }

      // here check UPCCode Value

      // Skip API validation if the field is empty
      if (isMultipleVarient) {
        // multiple varient
        if (!fieldValue) {
          const updatedValues = formValue.map((item, index) => {
            if (index === i) {
              const currentTitle = Object.keys(item)[0];
              return {
                ...item,
                [currentTitle]: {
                  ...item[currentTitle],
                  [name]: fieldValue,
                  upcCode: "",
                  upcError: "",
                },
              };
            }
            return item;
          });

          setFormValue(updatedValues);
          return;
        } else {
          const isUpcValid = await checkUpcValue(fieldValue, name);
          const isLocalDuplicate = checkLocalDuplicate(fieldValue, i);
          const updatedValues = formValue.map((item, index) => {
            if (index === i) {
              const currentTitle = Object.keys(item)[0];
              return {
                ...item,
                [currentTitle]: {
                  ...item[currentTitle],
                  [name]: fieldValue,
                  upcCode: isUpcValid && !isLocalDuplicate ? fieldValue : "",
                  upcError: !isUpcValid
                    ? "UPC Code must be unique"
                    : isLocalDuplicate
                      ? "UPC Code must be unique"
                      : "",
                },
              };
            }
            return item;
          });

          setFormValue(updatedValues);
          return;
        }
      } else {
        if (!fieldValue) {
          const updatedValues = formValue.map((item, index) => {
            if (index === i) {
              return {
                ...item,
                [name]: fieldValue,
                upcCode: "",
                upcError: "",
              };
            }
            return item;
          });

          setFormValue(updatedValues);
          return;
        } else {
          const isUpcValid = await checkUpcValueforSingle(fieldValue, name);
          const isLocalDuplicate = checkLocalDuplicateForSingle(fieldValue, i);

          const updatedValues = formValue.map((item, index) => {
            if (index === i) {
              return {
                ...item,
                [name]: fieldValue,
                upcCode: isUpcValid && !isLocalDuplicate ? fieldValue : "",
                upcError: !isUpcValid
                  ? "UPC code must be unique (API check)."
                  : isLocalDuplicate
                    ? "UPC code must be unique (local check)."
                    : "",
              };
            }
            return item;
          });

          setFormValue(updatedValues);
          return;
        }
      }
    }
    // normal input value format
    else {
      fieldValue = value
        // Remove extra dots and ensure only one dot exists at most
        .replace(/[^\d.]/g, "") // Allow digits and dots only
        .replace(/^(\d*\.)(.*)\./, "$1$2") // Remove extra dots
        .replace(/^(\d*\.\d*)(.*)\./, "$1$2"); // Remove extra dots after the decimal point

      let inputStr = fieldValue.replace(/\D/g, "");
      // inputStr = inputStr.replace(/^+/, "");
      if (inputStr == "0") {
        fieldValue = "0";
      } else {
        fieldValue = inputStr;
      }
    }

    // margin and profit calculation
    let totalPriceValue;
    let marginValue;
    let profitValue;
    let price_total_value;

    // if price value is change manually the recalculate margin and profit value
    const costPerValue = isMultipleVarient
      ? formValue?.[i]?.[title]?.["costPerItem"]
      : formValue?.[0]?.["costPerItem"];
    if (name === "price") {
      if (+costPerValue > 0 && value > 0) {
        let marginvl = (costPerValue * 100) / fieldValue;
        let showmargin = 100 - marginvl;
        marginValue = parseFloat(showmargin).toFixed(2);
        profitValue = parseFloat(fieldValue - costPerValue).toFixed(2);
      } else if (!costPerValue && value > 0) {
        marginValue = "";
        profitValue = "";
      }
    }

    const isValue = (input) => {
      const number = parseFloat(input);
      return !isNaN(number);
    };

    const oldMargin = (data) => {
      return (name === "price" || name === "costPerItem") && !fieldValue
        ? ""
        : data.every((item) => isValue(item));
    };

    const calculateProfit = (name, item, value) => {
      let profitAmount = 0;
      if (name === "costPerItem" && parseFloat(item?.price) > 0) {
        profitAmount = parseFloat(item?.price - value).toFixed(2);
      } else if (name === "price" && parseFloat(item?.costPerItem) > 0) {
        profitAmount = parseFloat(value - item?.costPerItem).toFixed(2);
      } else {
        profitAmount = "";
      }
      return profitAmount;
    };

    const calculatemargin = (name, item, value) => {
      let marginAmount = 0;
      if (name === "costPerItem" && parseFloat(item?.price) > 0) {
        let marginvl = (value * 100) / parseFloat(item?.price);
        let showmargin = 100 - marginvl;
        marginAmount = parseFloat(showmargin).toFixed(2);
      } else if (name === "price" && parseFloat(item?.costPerItem) > 0) {
        let marginvl =
          (parseFloat(item?.costPerItem) * 100) / parseFloat(value);
        let showmargin = 100 - marginvl;
        marginAmount = parseFloat(showmargin).toFixed(2);
      } else {
        marginAmount = "";
      }
      return marginAmount;
    };

    if (isMultipleVarient) {
      const updatedValues = formValue.map((item, index) => {
        const currentTitle = Object.keys(item)[0];



     
        let compareAtPriceValue = parseFloat(
          name === "compareAtPrice" ? fieldValue : item[currentTitle]?.compareAtPrice
        );
        
        let priceValue = parseFloat(
          name === "price"
            ? fieldValue
            : name === "costPerItem"
            ? price_total_value
            :  item[currentTitle]?.price
        );
        
        let showError = false;
        
        if (name === "price") {
          if (compareAtPriceValue === 0) {
            showError = false;
          } else if (compareAtPriceValue > 0) {
            showError = priceValue >= compareAtPriceValue;
          }
        } else if (name === "compareAtPrice") {
          showError = priceValue >= compareAtPriceValue;
        }











        const costPerItemAndPriceAmountExists = () => {
          const bool =
            (name === "costPerItem" &&
              fieldValue &&
              parseFloat(item[currentTitle]?.price) > 0) ||
            (name === "price" &&
              fieldValue &&
              parseFloat(item[currentTitle]?.costPerItem) > 0);
          return bool;
        };

        if (i > 0) {
          return !["upcCode", "customCode"].includes(name) && item[title]
            ? {
                ...item,
                [currentTitle]: {
                  ...item[currentTitle],
                  [name]: fieldValue,
                  price:
                    name === "price"
                      ? fieldValue
                      : item[currentTitle]?.price
                        ? item[currentTitle]?.price
                        : "",
                  margin: costPerItemAndPriceAmountExists()
                    ? calculatemargin(name, item[currentTitle], fieldValue)
                    : oldMargin([
                          item[currentTitle]?.costPerItem,
                          item[currentTitle]?.margin,
                          item[currentTitle]?.price,
                        ])
                      ? item[currentTitle]?.margin
                      : "",
                  profit: costPerItemAndPriceAmountExists()
                    ? calculateProfit(name, item[currentTitle], fieldValue)
                    : oldMargin([
                          item[currentTitle]?.costPerItem,
                          item[currentTitle]?.margin,
                          item[currentTitle]?.price,
                        ])
                      ? item[currentTitle]?.profit
                      : "",
                  comparePriceError:
                    ["price", "compareAtPrice", "costPerItem"]?.includes(
                      name
                    ) && showError
                      ? "Compare Price must be greater than price."
                      : [
                            "qty",
                            "upcCode",
                            "customCode",
                            "reorderLevel",
                            "reorderQty",
                            "checkId",
                            "disable",
                            "isFoodStamble",
                            "sellOutOfStock",
                            "trackQuantity",
                            "costPerItem",
                          ]?.includes(name) &&
                          item[currentTitle]?.comparePriceError
                        ? item[currentTitle]?.comparePriceError
                        : "",
                },
              }
            : item;
        } else if (i === 0) {
          return !["upcCode", "customCode"].includes(name) &&
            !item[currentTitle][name] &&
            pageUrl === "inventory/products/add"
            ? {
                ...item,
                [currentTitle]: {
                  ...item[currentTitle],
                  [name]: fieldValue,
                  price:
                    name === "price"
                      ? fieldValue
                      : item[currentTitle]?.price
                        ? item[currentTitle]?.price
                        : "",
                  margin: costPerItemAndPriceAmountExists()
                    ? calculatemargin(name, item[currentTitle], fieldValue)
                    : oldMargin([
                          item[currentTitle]?.costPerItem,
                          item[currentTitle]?.margin,
                          item[currentTitle]?.price,
                        ])
                      ? item[currentTitle]?.margin
                      : "",
                  profit: costPerItemAndPriceAmountExists()
                    ? calculateProfit(name, item[currentTitle], fieldValue)
                    : oldMargin([
                          item[currentTitle]?.costPerItem,
                          item[currentTitle]?.margin,
                          item[currentTitle]?.price,
                        ])
                      ? item[currentTitle]?.profit
                      : "",

                  comparePriceError:
                    ["price", "compareAtPrice", "costPerItem"]?.includes(
                      name
                    ) && showError
                      ? "Compare Price must be greater than price."
                      : [
                            "qty",
                            "upcCode",
                            "customCode",
                            "reorderLevel",
                            "reorderQty",
                            "checkId",
                            "disable",
                            "isFoodStamble",
                            "sellOutOfStock",
                            "trackQuantity",
                            "costPerItem",
                          ]?.includes(name) &&
                          item[currentTitle]?.comparePriceError
                        ? item[currentTitle]?.comparePriceError
                        : "",
                },
              }
            : item;
        }
        //   else {
        //   return !["upcCode", "customCode"].includes(name) ? {
        //     ...item,
        //     [title]: {
        //       ...title[title],
        //       [name]: fieldValue,
        //       price: !isNaN(parseFloat(price_total_value))
        //         ? parseFloat(price_total_value).toFixed(2)
        //         : name === "price"
        //           ? fieldValue
        //           : item[currentTitle]?.price && (name === "costPerItem" && !fieldValue)
        //             ? ""
        //             : item[currentTitle]?.price,
        //         margin: !isNaN(parseFloat(marginValue)) ? marginValue : oldMargin([item[currentTitle]?.costPerItem, item[currentTitle]?.margin, item[currentTitle]?.price]) ? item[currentTitle]?.margin : "",
        //         profit: !isNaN(parseFloat(profitValue)) ? profitValue : oldMargin([item[currentTitle]?.costPerItem, item[currentTitle]?.margin, item[currentTitle]?.price]) ? item[currentTitle]?.profit : "",
        //         comparePriceError:
        //         ((["price", "compareAtPrice", "costPerItem"]?.includes(name)) && showError)
        //             ? "Compare Price must be greater than price."
        //             : (["qty", "upcCode", "customCode", "reorderLevel", "reorderQty"]?.includes(name)) && item[currentTitle]?.comparePriceError ? item[currentTitle]?.comparePriceError : ""
        //     }
        //   }: item
        // }
      });

      setFormValue(updatedValues);
    }
  };

  const handleOnChange = (e, i, title) => {
    const { name, value, type, checked } = e.target;

    const updatedFormValue = [...formValue];

    /// convert input value format 0.00
    let fieldValue;
    if (!notAllowDecimalValue.includes(name)) {
      fieldValue = value
        // Remove extra dots and ensure only one dot exists at most
        .replace(/[^\d.]/g, "") // Allow digits and dots only
        .replace(/^(\d*\.)(.*)\./, "$1$2") // Remove extra dots
        .replace(/^(\d*\.\d*)(.*)\./, "$1$2"); // Remove extra dots after the decimal point

      let inputStr = fieldValue.replace(/\D/g, "");
      inputStr = inputStr.replace(/^0+/, "");

      if (inputStr.length == "") {
        fieldValue = "";
      } else if (inputStr.length === 1) {
        fieldValue = "0.0" + inputStr;
      } else if (inputStr.length === 2) {
        fieldValue = "0." + inputStr;
      } else {
        fieldValue =
          inputStr.slice(0, inputStr.length - 2) + "." + inputStr.slice(-2);
      }
    }
    // allowed alphanumeric value in upcCode field but not allowed decimal value
    else if (name === "upcCode") {
      fieldValue = fieldValue = value
        // Remove extra dots and ensure only one dot exists at most
        .replace(/[^\w.]/g, "") // Allow alphanumeric characters, digits, and dots only
        .replace(/^(\d*\.)(.*)\./, "$1$2") // Remove extra dots
        .replace(/^(\d*\.\d*)(.*)\./, "$1$2"); // Remove extra dots after the decimal point

      let inputStr = fieldValue.replace(/[^\w]/g, "");
      if (inputStr == "0") {
        fieldValue = "0";
      } else {
        fieldValue = inputStr.toUpperCase();
      }
    }
    // normal input value format
    else {
      fieldValue = value
        // Remove extra dots and ensure only one dot exists at most
        .replace(/[^\d.]/g, "") // Allow digits and dots only
        .replace(/^(\d*\.)(.*)\./, "$1$2") // Remove extra dots
        .replace(/^(\d*\.\d*)(.*)\./, "$1$2"); // Remove extra dots after the decimal point

      let inputStr = fieldValue.replace(/\D/g, "");
      // inputStr = inputStr.replace(/^+/, "");
      if (inputStr == "0") {
        fieldValue = "0";
      } else {
        fieldValue = inputStr;
      }
    }

    // margin and profit calculation
    let totalPriceValue;
    let marginValue;
    let profitValue;
    let price_total_value;

    // if price value is change manually the recalculate margin and profit value
    const costPerValue = isMultipleVarient
      ? formValue?.[i]?.[title]?.["costPerItem"]
      : formValue?.[0]?.["costPerItem"];
    if (name === "price") {
      if (+costPerValue > 0 && value > 0) {
        let marginvl = (costPerValue * 100) / fieldValue;
        let showmargin = 100 - marginvl;
        marginValue = parseFloat(showmargin).toFixed(2);
        profitValue = parseFloat(fieldValue - costPerValue).toFixed(2);
      } else if (!costPerValue && value > 0) {
        marginValue = "";
        profitValue = "";
      }
    }

    const isValue = (input) => {
      const number = parseFloat(input);
      return !isNaN(number);
    };

    const oldMargin = (data) => {
      return (name === "price" || name === "costPerItem") && !fieldValue
        ? ""
        : data.every((item) => isValue(item));
    };

    const calculateProfit = (name, item, value) => {
      let profitAmount = 0;
      if (name === "costPerItem" && parseFloat(item?.price) > 0) {
        profitAmount = parseFloat(item?.price - value).toFixed(2);
      } else if (name === "price" && parseFloat(item?.costPerItem) > 0) {
        profitAmount = parseFloat(value - item?.costPerItem).toFixed(2);
      } else {
        profitAmount = "";
      }
      return profitAmount;
    };

    const calculatemargin = (name, item, value) => {
      let marginAmount = 0;
      if (name === "costPerItem" && parseFloat(item?.price) > 0) {
        let marginvl = (value * 100) / parseFloat(item?.price);
        let showmargin = 100 - marginvl;
        marginAmount = parseFloat(showmargin).toFixed(2);
      } else if (name === "price" && parseFloat(item?.costPerItem) > 0) {
        let marginvl =
          (parseFloat(item?.costPerItem) * 100) / parseFloat(value);
        let showmargin = 100 - marginvl;
        marginAmount = parseFloat(showmargin).toFixed(2);
      } else {
        marginAmount = "";
      }
      return marginAmount;
    };

    let showError;
    let updatedValues;
    // manually onchange
    if (isMultipleVarient) {
      updatedValues = formValue.map((item, index) => {

          let compareAtPriceValue = parseFloat(
            name === "compareAtPrice" ? fieldValue : item[title]?.compareAtPrice
          );
          
          let priceValue = parseFloat(
            name === "price"
              ? fieldValue
              : name === "costPerItem"
              ? price_total_value
              : item[title]?.price
          );
          
          let showError = false;
          
          if (name === "price") {
            if (compareAtPriceValue === 0) {
              showError = false;
            } else if (compareAtPriceValue > 0) {
              showError = priceValue >= compareAtPriceValue;
            }
          } else if (name === "compareAtPrice") {
            showError = priceValue >= compareAtPriceValue;
          }
                    
                   
        






        const costPerItemAndPriceAmountExists = () => {
          const bool =
            (name === "costPerItem" &&
              fieldValue &&
              parseFloat(item[title]?.price) > 0) ||
            (name === "price" &&
              fieldValue &&
              parseFloat(item[title]?.costPerItem) > 0);
          return bool;
        };

        return Object.keys(item).includes(title)
          ? {
              ...item,
              [title]: {
                ...item[title],
                [name]: type === "checkbox" ? checked : fieldValue,
                price:
                  name === "price"
                    ? fieldValue
                    : item[title].price
                      ? item[title].price
                      : "",

                margin: costPerItemAndPriceAmountExists()
                  ? calculatemargin(name, item[title], fieldValue)
                  : oldMargin([
                        item[title].costPerItem,
                        item[title].margin,
                        item[title].price,
                      ])
                    ? item[title].margin
                    : "",

                profit: costPerItemAndPriceAmountExists()
                  ? calculateProfit(name, item[title], fieldValue)
                  : oldMargin([
                        item[title].costPerItem,
                        item[title].margin,
                        item[title].price,
                      ])
                    ? item[title].profit
                    : "",
                // comparePriceError:
                //     ((["price", "compareAtPrice", "costPerItem"].includes(name)) && showError)
                //         ? "Compare Price must be greater than price."
                //         : ""
                comparePriceError:
                  ["price", "compareAtPrice", "costPerItem"]?.includes(name) &&
                  showError
                    ? "Compare Price must be greater than price."
                    : [
                          "qty",
                          "upcCode",
                          "customCode",
                          "reorderLevel",
                          "reorderQty",
                          "checkId",
                          "disable",
                          "isFoodStamble",
                          "sellOutOfStock",
                          "trackQuantity",
                          "costPerItem",
                        ]?.includes(name) && item[title]?.comparePriceError
                      ? item[title]?.comparePriceError
                      : "",
              },
            }
          : item;
      });
    } else {
      updatedValues = formValue.map((item, index) => {
        console.log(fieldValue, item?.price)



        let compareAtPriceValue = parseFloat(
          name === "compareAtPrice" ? fieldValue : item?.compareAtPrice
        );
        
        let priceValue = parseFloat(
          name === "price"
            ? fieldValue
            : name === "costPerItem"
            ? price_total_value
            : item?.price
        );
        
        let showError = false;
        
        if (name === "price") {
          if (compareAtPriceValue === 0) {
            showError = false;
          } else if (compareAtPriceValue > 0) {
            showError = priceValue >= compareAtPriceValue;
          }
        } else if (name === "compareAtPrice") {
          showError = priceValue >= compareAtPriceValue;
        }



        const costPerItemAndPriceAmountExistsInSingleVarient = () => {
          const bool =
            (name === "costPerItem" &&
              fieldValue &&
              parseFloat(item?.price) > 0) ||
            (name === "price" &&
              fieldValue &&
              parseFloat(item?.costPerItem) > 0);
          return bool;
        };

        return {
          ...item,
          [name]: type === "checkbox" ? checked : fieldValue,
          price: name === "price" ? fieldValue : item.price ? item.price : "",
          margin: costPerItemAndPriceAmountExistsInSingleVarient()
            ? calculatemargin(name, item, fieldValue)
            : oldMargin([item.costPerItem, item.margin, item.price])
              ? item.margin
              : "",
          profit: costPerItemAndPriceAmountExistsInSingleVarient()
            ? calculateProfit(name, item, fieldValue)
            : oldMargin([item.costPerItem, item.margin, item.price])
              ? item.profit
              : "",
          comparePriceError:
            ["price", "compareAtPrice", "costPerItem"]?.includes(name) &&
            showError
              ? "Compare Price must be greater than price."
              : [
                    "qty",
                    "upcCode",
                    "customCode",
                    "reorderLevel",
                    "reorderQty",
                    "checkId",
                    "disable",
                    "isFoodStamble",
                    "sellOutOfStock",
                    "trackQuantity",
                    "costPerItem",
                  ]?.includes(name) && item?.comparePriceError
                ? item?.comparePriceError
                : "",
        };
      });
    }

    setFormValue(updatedValues);
  };

  console.log("formvalue", formValue);

  const handleVarientTitleBasedItemList = () => {
    if (varientLength.length) {
      if (
        (varientLength?.length === 1 &&
          varientLength[0]?.varientAttributeList?.length) ||
        (varientLength?.length === 2 &&
          !varientLength[1]?.varientAttributeList?.length)
      ) {
        for (let i of varientLength[0]?.varientAttributeList) {
          varientTitle.push(i.label);
        }
      } else if (
        (varientLength?.length === 2 &&
          varientLength[0]?.varientAttributeList?.length &&
          varientLength[1]?.varientAttributeList?.length) ||
        (varientLength?.length === 3 &&
          !varientLength[2]?.varientAttributeList?.length)
      ) {
        for (let i of varientLength[0]?.varientAttributeList) {
          for (let j of varientLength[1]?.varientAttributeList) {
            varientTitle.push(i.label + "/" + j.label);
          }
        }
      } else if (
        varientLength?.length === 3 &&
        varientLength[0]?.varientAttributeList?.length &&
        varientLength[1]?.varientAttributeList?.length &&
        varientLength[2]?.varientAttributeList?.length
      ) {
        for (let i of varientLength[0]?.varientAttributeList) {
          for (let j of varientLength[1]?.varientAttributeList) {
            for (let k of varientLength[2]?.varientAttributeList) {
              varientTitle.push(i.label + "/" + j.label + "/" + k.label);
            }
          }
        }
      }
      return [...new Set(varientTitle)];
      // setVarientTitle(newVarientTitle);
    }
  };

  useEffect(() => {
    if (varientLength?.length > 0 && isMultipleVarient) {
      handleVarientTitleBasedItemList();
      // when adding new varient in in form keep previous fill form data in fields and add new
      // when adding new varient and add first item in varient then clear all the form input value
      if (clearInput) {
        setFormValue((_) => {
          const newFormValue = [...new Set(varientTitle)].map(
            (title, index) => {
              return {
                [title]: {
                  costPerItem: "",
                  compareAtPrice: "",
                  price: "",
                  margin: "",
                  profit: "",
                  qty: "",
                  upcCode: "",
                  customCode: "",
                  reorderQty: "",
                  reorderLevel: "",
                  trackQuantity: true,
                  sellOutOfStock: true,
                  checkId: false,
                  disable: false,
                  // itemForAllLinkedLocation: false,
                  isFoodStamble: false,
                },
              };
              // }
            }
          );
          return newFormValue;
        });
      } else {
        setFormValue((prevFormValue) => {
          const newFormValue = [...new Set(varientTitle)].map(
            (title, index) => {
              const previousData =
                prevFormValue.find((item) => title in item) || {};
              const result = previousData[title];

              return {
                [title]: {
                  notEditable: result?.notEditable || "",
                  productEditId: result?.productEditId || "",
                  comparePriceError: result?.comparePriceError || "",
                  upcError: result?.upcError || "",
                  costPerItem: result?.costPerItem || "",
                  compareAtPrice: result?.compareAtPrice || "",
                  price: result?.price || "",
                  margin: result?.margin || "",
                  profit: result?.profit || "",
                  qty: result?.qty || "",
                  upcCode: result?.upcCode || "",
                  customCode: result?.customCode || "",
                  reorderQty: result?.reorderQty || "",
                  reorderLevel: result?.reorderLevel || "",
                  // here when fetching prodcut data and track and sellout was false but still showing true and check that's why using this condition
                  trackQuantity:
                    result?.trackQuantity ||
                    pageUrl !== "inventory/products/edit"
                      ? true
                      : false || !result?.notEditable
                        ? true
                        : false,
                  sellOutOfStock:
                    result?.sellOutOfStock ||
                    pageUrl !== "inventory/products/edit"
                      ? true
                      : false || !result?.notEditable
                        ? true
                        : false,
                  checkId: result?.checkId || false,
                  disable: result?.disable || false,
                  // itemForAllLinkedLocation:
                  //   previousData.itemForAllLinkedLocation || false,
                  isFoodStamble: result?.isFoodStamble || false,
                },
              };
            }
          );

          return newFormValue;
        });
      }
    } else if (!isMultipleVarient) {
      setFormValue([
        {
          costPerItem: "",
          compareAtPrice: "",
          price: "",
          margin: "",
          profit: "",
          qty: "",
          upcCode: "",
          customCode: "",
          reorderQty: "",
          reorderLevel: "",
          trackQuantity: true,
          sellOutOfStock: true,
          checkId: false,
          disable: false,
          isFoodStamble: false,
          // itemForAllLinkedLocation: false,
        },
      ]);
    }
  }, [varientLength]);

  const fetchProductDataById = () => {
    setFetchDataLoading(true);
    const formData = new FormData();
    formData.append(
      "merchant_id",
      LoginGetDashBoardRecordJson?.data?.merchant_id
    );
    formData.append("id", productId?.id);
    formData.append("login_type", userTypeData?.login_type);
    formData.append("token_id", userTypeData?.token_id);
    formData.append("token", userTypeData?.token);
    if (!!productId?.id) {
      dispatch(fetchProductsDataById(formData))
        .then((res) => {
          if (res?.payload?.message === "Success") {
            setProductData(res?.payload?.data?.productdata);
            setInventoryData(res?.payload?.data?.inventory_setting_data);
            setOptions(res?.payload?.data?.options);
            setVarientData(res?.payload?.data?.product_variants);
            setIsMultipleVaient(
              Boolean(+res?.payload?.data?.productdata?.isvarient)
            );
          }
        })
        .catch((err) => {
          ToastifyAlert("Error while fetch product data!", "error");
          getUnAutherisedTokenMessage();
        })
        .finally(() => {
          setFetchDataLoading(false);
        });
    } else {
      navigate("/inventory/products");
    }
  };

  const fetchSingleVarientData = () => {
    const data = location?.state;
    const formData = new FormData();

    formData.append("id", data?.var_id);
    formData.append("single_product", 0);
    formData.append("product_name", data?.title);
    formData.append("login_type", userTypeData?.login_type);
    formData.append("token_id", userTypeData?.token_id);
    formData.append("token", userTypeData?.token);


    const formDataNew = new FormData();
    formDataNew.append(
      "merchant_id",
      LoginGetDashBoardRecordJson?.data?.merchant_id
    );
    formDataNew.append("login_type", userTypeData?.login_type);
    formDataNew.append("token_id", userTypeData?.token_id);
    formDataNew.append("token", userTypeData?.token);

    dispatch(getInventorySettingOnVarient(formDataNew)).then((res) => {
      if (res?.payload?.status) {
        setInventoryData(res?.payload?.result);
      }
    });

    dispatch(fetchVarietDataById(formData))
      .then((res) => {
        console.log("res", res);
        if (res?.payload?.status) {
          const payloadData = res?.payload?.var_data;
          setProductData(payloadData);
          setIsMultipleVaient(false);
          setIsVarientEdit(true);
          setFormValue([
            {
              notEditable: true,
              costPerItem: payloadData?.costperItem || "",
              compareAtPrice: payloadData?.compare_price || "",
              price: payloadData?.price || "",
              margin: payloadData?.margin || "",
              // notEditable: payloadData?.notEditable || "",
              productEditId: payloadData?.id || "",
              // productEditVarientId: payloadData?.id || "",
              comparePriceError: payloadData?.comparePriceError || "",
              upcError: payloadData?.upcError || "",
              profit: payloadData?.profit || "",
              qty: payloadData?.quantity || "",
              upcCode: payloadData?.upc || "",
              customCode: payloadData?.custom_code || "",
              reorderQty: payloadData?.reorder_qty || "",
              reorderLevel: payloadData?.reorder_level || "",
              trackQuantity: Boolean(+payloadData?.trackqnty) || false,
              sellOutOfStock: Boolean(+payloadData?.isstockcontinue) || false,
              checkId: Boolean(+payloadData?.is_tobacco) || false,
              disable: Boolean(+payloadData?.disable) || false,
              // itemForAllLinkedLocation: payloadData?.,
              isFoodStamble: Boolean(+payloadData?.food_stampable) || false,
            },
          ]);
        }
      })
      .catch((err) => {
        ToastifyAlert("Error while fetch product data!", "error");
        getUnAutherisedTokenMessage();
      })
      .finally(() => {
        setFetchDataLoading(false);
      });
  };

  useEffect(() => {
    // called fetchproduct data api based on id
    if (pageUrl === "inventory/products/edit") {
      fetchProductDataById();
    } else if (pageUrl === "inventory/products/varient-edit") {
      fetchSingleVarientData();
    }
  }, [pageUrl, location]);

  const selectedItemsFromdata = (items, filterListName) => {
    const arr = items?.map((i) => {
      return dropdownData?.[filterListName]?.filter((o) => +o?.id === +i);
    });

    return arr?.[0]?.length ? arr : [];
  };

  useEffect(() => {
    if (pageUrl === "inventory/products/edit") {
      // fill data fields after fetcing data
      setProductInfo({
        title: productData?.title,
        description: productData?.description,
        category: selectedItemsFromdata(
          productData?.cotegory?.split(","),
          "categoryList"
        )?.map((i) => i[0]),
        taxes: selectedItemsFromdata(
          productData?.other_taxes?.split(","),
          "taxList"
        )?.map((i) => i[0]),
        relatedProduct: selectedItemsFromdata(
          productData?.featured_product?.split(","),
          "relatedProducttList"
        )?.map((i) => i[0]),
        frequentlyBought: selectedItemsFromdata(
          productData?.buy_with_product?.split(","),
          "frequentlyBroughtList"
        )?.map((i) => i[0]),
        files: !!productData?.media
          ? productData?.media?.split(",")?.map((img) => img)
          : [],
      });

      // fill the varient options data
      // varientData structure below
      // const [varientLength, setVarientLength] = useState([
      //   { id: 1, varientName: "", varientAttributeList: [] },
      // ]);

      const varientOptions = [];
      // if first varient values only exist

      if (isMultipleVarient) {
        if (!!options?.options3 && !!options?.optionsvl3) {
          for (let i = 1; i < 4; i++) {
            const varientName = "options" + [i];
            const varientAttribute = "optionsvl" + [i];
            if (options[varientName]) {
              varientOptions.push({
                id: i,
                varientName: {
                  value: options[varientName],
                  label: options[varientName],
                },
                varientAttributeList: options[varientAttribute]
                  ?.split(",")
                  ?.map((i) => ({
                    label: i,
                    value: i,
                    isFixed: true,
                  })),
              });
            }
          }
        }
        // if second varient values only exist
        else if (!!options?.options2 && !!options?.optionsvl2) {
          for (let i = 1; i < 3; i++) {
            const varientName = "options" + [i];
            const varientAttribute = "optionsvl" + [i];
            if (options[varientName]) {
              varientOptions.push({
                id: i,
                varientName: {
                  value: options[varientName],
                  label: options[varientName],
                },
                varientAttributeList: options[varientAttribute]
                  ?.split(",")
                  ?.map((i) => ({
                    label: i,
                    value: i,
                    isFixed: true,
                  })),
              });
            }
          }
        }
        // if third varient values only exist
        else if (!!options?.options1 && !!options?.optionsvl1) {
          for (let i = 1; i < 2; i++) {
            const varientName = "options" + [i];
            const varientAttribute = "optionsvl" + [i];
            if (options[varientName]) {
              varientOptions.push({
                id: i,
                varientName: {
                  value: options[varientName],
                  label: options[varientName],
                },
                varientAttributeList: options[varientAttribute]
                  ?.split(",")
                  ?.map((i) => ({
                    label: i,
                    value: i,
                    isFixed: true,
                  })),
              });
            }
          }
        }

        setVarientLength([...new Set(varientOptions)]);
        setFormValue((_) => {
          const newFormValue = varientData?.map((val, index) => {
            return {
              [val?.variant]: {
                notEditable: true,
                productEditId: val?.id,
                costPerItem: val?.costperItem || "",
                compareAtPrice: val?.compare_price || "",
                price: val?.price || "",
                margin: val?.margin || "",
                profit: val?.profit || "",
                qty: val?.quantity || "",
                upcCode: val?.upc || "",
                customCode: val?.custom_code || "",
                reorderQty: val?.reorder_qty || "",
                reorderLevel: val?.reorder_level || "",
                trackQuantity: Boolean(+val?.trackqnty) || false,
                sellOutOfStock: Boolean(+val?.isstockcontinue) || false,
                checkId: Boolean(+val?.is_tobacco) || false,
                disable: Boolean(+val?.disable) || false,
                // itemForAllLinkedLocation: val?.,
                isFoodStamble: Boolean(+val?.food_stampable) || false,
              },
            };
            // }
          });
          return newFormValue;
        });
      } else {
        setFormValue(() => {
          const formValue = [
            {
              notEditable: true,
              productEditId: productData?.id || "",
              costPerItem: productData?.costperItem || "",
              compareAtPrice: productData?.compare_price || "",
              price: productData?.price || "",
              margin: productData?.margin || "",
              profit: productData?.profit || "",
              qty: productData?.quantity || "",
              upcCode: productData?.upc || "",
              customCode: productData?.custom_code || "",
              reorderQty: productData?.reorder_qty || "",
              reorderLevel: productData?.reorder_level || "",
              trackQuantity: Boolean(+productData?.trackqnty) || false,
              sellOutOfStock: Boolean(+productData?.isstockcontinue) || false,
              checkId: Boolean(+productData?.is_tobacco) || false,
              disable: Boolean(+productData?.disable) || false,
              isFoodStamble: Boolean(+productData?.food_stampable) || false,
            },
            // You can add more keys dynamically if needed
          ];
          return formValue;
        });
      }
    }
  }, [productData, dropdownData, options, isMultipleVarient]);

  const characters = "0123456789";
  function generateString(length) {
    let result = " ";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  const handleGenerateUPC = () => {
    let updatedUpcData;
    if (!isMultipleVarient) {
      updatedUpcData = formValue?.map((item) => {
        return {
          ...item,
          ["upcCode"]: item?.upcCode ? item?.upcCode : generateString(20),
        };
      });
    } else {
      updatedUpcData = formValue?.map((item, index) => {
        const title = Object.keys(item)[0];
        return {
          ...item,
          [title]: {
            ...item[title],
            upcCode: item[title]?.upcCode
              ? item[title]?.upcCode
              : generateString(20),
          },
        };
      });
    }
    setFormValue(updatedUpcData);
  };

  const checkFormErrorExist = () => {
    let isValidation;
    if (!isMultipleVarient) {
      isValidation =
        formValue?.length &&
        formValue?.map((item, index) => {
          if (!!item.comparePriceError) {
            return false;
          } else {
            return true;
          }
        });
    } else {
      isValidation =
        formValue?.length &&
        formValue?.map((item, index) => {
          const title = Object.keys(item)[0];
          if (!!item[title]?.comparePriceError) {
            return false;
          } else {
            return true;
          }
        });
    }
    if (isValidation?.every((i) => Boolean(i))) {
      return true;
    } else {
      return false;
    }
  };

  const varientCategory = (name, boolean, defaultValue) => {
    let result = [];
    formValue?.map((item) => {
      const title = Object.keys(item)[0];
      result.push(
        !!boolean
          ? +item[title]?.[name]
          : item[title]?.[name]
            ? item[title]?.[name]
            : defaultValue
      );
    });
    return result;
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    const data = {
      /// single varient payload
      merchant_id: LoginGetDashBoardRecordJson?.data?.merchant_id,
      token_id: userTypeData?.token_id,
      login_type: userTypeData?.login_type,
      token: userTypeData?.token,
      title: productInfo?.title,
      description: productInfo?.description,
      price: !isMultipleVarient ? formValue[0]?.price : "",
      compare_price: !isMultipleVarient
        ? formValue[0]?.compareAtPrice
          ? formValue[0]?.compareAtPrice
          : "0.00"
        : "",
      costperItem: !isMultipleVarient
        ? formValue[0]?.costPerItem
          ? formValue[0]?.costPerItem
          : "0.00"
        : "",
      margin: !isMultipleVarient
        ? formValue[0]?.margin
          ? formValue[0]?.margin
          : "0.00"
        : "",
      profit: !isMultipleVarient
        ? formValue[0]?.profit
          ? formValue[0]?.profit
          : "0.00"
        : "",
      ischargeTax: 0,
      //sku:
      //barcode:
      trackqnty: !isMultipleVarient ? +formValue[0]?.trackQuantity : "",
      isstockcontinue: !isMultipleVarient ? +formValue[0]?.sellOutOfStock : "",
      disable: !isMultipleVarient ? +formValue[0]?.disable : "",
      is_tobacco: !isMultipleVarient ? +formValue[0]?.checkId : "",
      food_stampable: !isMultipleVarient ? +formValue[0]?.isFoodStamble : "",
      quantity: !isMultipleVarient
        ? formValue[0]?.qty
          ? formValue[0]?.qty
          : "0"
        : "",
      reorder_level: !isMultipleVarient
        ? formValue[0]?.reorderLevel
          ? formValue[0]?.reorderLevel
          : "0"
        : "",
      upc: !isMultipleVarient ? formValue[0]?.upcCode : "",
      custom_code: !isMultipleVarient ? formValue[0]?.customCode : "",
      reorder_qty: !isMultipleVarient
        ? formValue[0]?.reorderQty
          ? formValue[0]?.reorderQty
          : "0"
        : "",
      // reorder_cost: !isMultipleVarient ? formValue[0]?.reorderQty : "",
      //ispysical_product:
      //country_region:
      collection: productInfo?.category?.map((item) => item?.id).toString(),
      other_taxes: productInfo?.taxes?.map((item) => item?.id).toString(),
      featured_product: productInfo?.relatedProduct
        ?.map((item) => item?.id)
        .toString(),
      bought_product: productInfo?.frequentlyBought
        ?.map((item) => item?.id)
        .toString(),
      files: productInfo?.files
        ?.map((file) => file)
        .filter((i) => typeof i === "object")
        ?.map((i) => i?.file),
      previous_media: productInfo?.files
        ?.map((file) => file)
        .filter((i) => typeof i === "string")
        .toString(),
      // files: productInfo?.files?.map((file) => file?.base64),
      //HS_code:
      isvarient: +isMultipleVarient,

      /// multiple varient payload start from here...
      //featured_product:1,2
      //multiplefiles[]:product2.png
      //img_color_lbl:
      //created_on:
      //productid:111
      optionarray: isMultipleVarient
        ? varientLength[0]?.varientName?.value ?? ""
        : "",
      optionarray1: isMultipleVarient
        ? varientLength[1]?.varientName?.value ?? ""
        : "",
      optionarray2: isMultipleVarient
        ? varientLength[2]?.varientName?.value ?? ""
        : "",
      optionvalue: isMultipleVarient
        ? varientLength[0]?.varientAttributeList
            ?.map((item) => item)
            ?.map((i) => i?.value)
            ?.toString() ?? ""
        : "",
      optionvalue1: isMultipleVarient
        ? varientLength[1]?.varientAttributeList
            ?.map((item) => item)
            ?.map((i) => i?.value)
            ?.toString() ?? ""
        : "",
      optionvalue2: isMultipleVarient
        ? varientLength[2]?.varientAttributeList
            ?.map((item) => item)
            ?.map((i) => i?.value)
            ?.toString() ?? ""
        : "",
      varvarient: isMultipleVarient
        ? varientTitle.filter(Boolean)?.toString()
        : "",

      /// new changes start from here

      varprice: isMultipleVarient
        ? varientCategory("price").join(",").trim()
        : "",

      varquantity: isMultipleVarient
        ? varientCategory("qty", "", "0").join(",").trim()
        : "",
      // varsku: formValue?.map((i) => i),
      //varbarcode[]:123321,5456464
      //optionarray2:Material
      //optionvalue2:glass
      //upc:abcupc

      varupc: isMultipleVarient
        ? varientCategory("upcCode").join(",").trim()
        : "",

      varcustomcode: isMultipleVarient
        ? varientCategory("customCode").join(",").trim()
        : "",

      varcostperitem: isMultipleVarient
        ? varientCategory("costPerItem", "", "0.00").join(",").trim()
        : "",

      vartrackqnty: isMultipleVarient
        ? varientCategory("trackQuantity", "boolean").toString()
        : "",

      varcontinue_selling: isMultipleVarient
        ? varientCategory("sellOutOfStock", "boolean").toString()
        : "",

      varcheckid: isMultipleVarient
        ? varientCategory("checkId", "boolean").toString()
        : "",

      vardisable: isMultipleVarient
        ? varientCategory("disable", "boolean").toString()
        : "",

      varfood_stampable: isMultipleVarient
        ? varientCategory("isFoodStamble", "boolean").toString()
        : "",

      varmargin: isMultipleVarient
        ? varientCategory("margin", "", "0.00").join(",").trim()
        : "",

      varprofit: isMultipleVarient
        ? varientCategory("profit", "", "0.00").join(",").trim()
        : "",

      varreorder_qty: isMultipleVarient
        ? varientCategory("reorderQty", "", "0").join(",").trim()
        : "",

      varreorder_level: isMultipleVarient
        ? varientCategory("reorderLevel", "", "0").join(",").trim()
        : "",

      varcompareprice: isMultipleVarient
        ? varientCategory("compareAtPrice", "", "0.00").join(",").trim()
        : "",
      // reorder_cost: [10, 10, 10, 10],
    };

    if (pageUrl === "inventory/products/edit") {
      data["productid"] = productData?.id ? productData?.id : "";
      data["var_id"] = isMultipleVarient
        ? varientCategory("productEditId", "", "").join(",").trim()
        : "";
      data["optionid"] = options?.id ? options?.id : "";
    }

    let checkEmpty;
    if (isMultipleVarient) {
      checkEmpty = varientLength?.map((item, i) => {
        if (!item?.varientAttributeList?.length || !item?.varientName) {
          setVarientError({
            error: "Please enter the Varients",
            errorIndex: i,
          });
          return false;
        } else {
          setVarientError({
            error: "",
            errorIndex: null,
          });
          return true;
        }
      });
    } else {
      checkEmpty = [true];
    }
    try {
      const response = await formSchema.validate(
        { ...productInfo, formValue },
        {
          abortEarly: false,
        }
      );
      setError({});
      // check any error exist in error state and if response success and any productTitleError is exist
      if (
        checkEmpty.every((i) => Boolean(i)) &&
        !!response &&
        !productTitleError &&
        checkFormErrorExist()
      ) {
        const formdata = new FormData();
        for (let i in data) {
          if (i !== "files") {
            formdata.append(i, data[i]);
          }
        }
        for (let i = 0; i < uploadImage.length; i++) {
          formdata.append("files[]", uploadImage[i]);
        }
        pageUrl === "inventory/products/edit"
          ? dispatch(editProductData(formdata))
              .then((res) => {
                if (res?.payload?.data?.status) {
                  ToastifyAlert("Updated Successfully", "success");
                  let timerId;
                  clearTimeout(timerId);
                  timerId = setTimeout(() => {
                    window.location.reload();
                  }, 400);
                }
              })
              .catch((err) => {
                if (err) {
                  ToastifyAlert("Error!", "error");
                }
                getUnAutherisedTokenMessage();
              })
          : dispatch(addProduct(formdata))
              .then((res) => {
                if (res?.payload?.data?.status) {
                  ToastifyAlert("Added Successfully", "success");
                  navigate("/inventory/products");
                }
              })
              .catch((err) => {
                if (err) {
                  ToastifyAlert("Error!", "error");
                }
                getUnAutherisedTokenMessage();
              });
      }
    } catch (err) {
      let errorsList = {};
      setError({});
      if (err && err.inner) {
        err?.inner?.forEach((error) => {
          if (error?.path) {
            errorsList[error.path] = error.message;
          }
        });
      }
      setError(errorsList);
    }
  };

  const handleUpdateVarient = async () => {
    const data = {
      merchant_id: LoginGetDashBoardRecordJson?.data?.merchant_id,
      // token_id: userTypeData?.token_id,
      // login_type: userTypeData?.login_type,
      // token: userTypeData?.token,
      variant_id: formValue[0]?.productEditId,
      price: formValue[0]?.price,
      compare_price: formValue[0]?.compareAtPrice,
      costperItem: formValue[0]?.costPerItem,
      ogvarmargin: formValue[0]?.margin,
      ogvarprofit: formValue[0]?.profit,
      //sku:
      //barcode:
      // trackqnty: +formValue[0]?.trackQuantity,
      // isstockcontinue: +formValue[0]?.sellOutOfStock,
      // disable: +formValue[0]?.disable,
      // is_tobacco: +formValue[0]?.checkId,
      // food_stampable: +formValue[0]?.isFoodStamble,
      quantity: formValue[0]?.qty,
      reorder_level: formValue[0]?.reorderLevel,
      upc: formValue[0]?.upcCode,
      custom_code: formValue[0]?.customCode,
      reorder_qty: formValue[0]?.reorderQty,
      // reorder_cost: formValue[0]?.reordr,
      Track_Quantity: +formValue[0]?.trackQuantity,
      Continue_selling: +formValue[0]?.sellOutOfStock,
      Checkid: +formValue[0]?.checkId,
      Disable: +formValue[0]?.disable,
      Food_stampable: +formValue[0]?.isFoodStamble,
      ...userTypeData,
    };

    try {
      const response = await formSingleVarientChange.validate(
        { formValue },
        {
          abortEarly: false,
        }
      );
      setError({});
      // check any error exist in error state and if response success and any productTitleError is exist
      if (!!response && checkFormErrorExist()) {
        setVarientLoading(true);
        dispatch(updateEditVarient(data))
          .then((res) => {
            if (res?.payload?.status) {
              ToastifyAlert("update Successfully", "success");
              fetchSingleVarientData();
            }
          })
          .catch((err) => {
            if (err) {
              ToastifyAlert("Error!", "error");
            }
            getUnAutherisedTokenMessage();
          })
          .finally(() => {
            setVarientLoading(false);
          });
      }
    } catch (err) {
      let errorsList = {};
      setError({});
      if (err && err.inner) {
        err?.inner?.forEach((error) => {
          if (error?.path) {
            errorsList[error.path] = error.message;
          }
        });
      }
      setError(errorsList);
    }
  };

  const handleUpdateError = (updatedErrorValue) => {
    setError((prev) => ({
      ...prev,
      ...updatedErrorValue,
    }));
  };

  // varient form onchange validation function

  // const handleFormDuplicateFormValidation = async (name, value, index) => {
  //   await addVarientFormValidation(name, value, index, error);
  //   handleUpdateError(error);
  // };
  return (
    <div className="box ">
      {/* edit modal */}
      {fetchDataLoading ? (
        <div class="loading-box">
          <Loader />
        </div>
      ) : pageUrl !== "inventory/products/varient-edit" ? (
        <>
          <EditPage
            openEditModal={openEditModal}
            handleCloseEditModal={handleCloseEditModal}
            productData={productData}
            modalType={modalType}
            varientData={varientData}
            varientIndex={varientIndex}
            formData={formValue}
            handleCopyAllVarientValue={handleCopyAllVarientValue}
            inventoryData={inventoryData}
            fetchProductDataById={fetchProductDataById}
          />
          {/* alert modal */}
          <AlertModal
            openAlertModal={openAlertModal}
            handleCloseAlertModal={handleCloseAlertModal}
            text="Compare Price must be greater than price."
          />

          <div
            className="q-attributes-main-page box_shadow_div"
            style={{ overflow: "unset" }}
          >
            <div className="q-add-categories-section">
              <div className="q-add-categories-section-header">
                <span
                  onClick={() => {
                    navigate("/inventory/products");
                  }}
                >
                  <img src={AddNewCategory} alt="Add-New-Category" />

                  <span style={{ width: "153px" }}>
                    {pageUrl === "inventory/products/edit" ? "Edit" : "Add"}{" "}
                    Product
                  </span>
                </span>
              </div>
              <div className="q-add-categories-section-middle-form">
                <div className="q-add-categories-single-input">
                  <label htmlFor="title" className="product-input-title">
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={productInfo?.title}
                    onChange={handleProductInfo}
                  />
                  {error?.title ? (
                    <span className="error-alert mb-2">{error?.title}</span>
                  ) : (
                    ""
                  )}
                  {productTitleError ? (
                    <span className="error-alert">
                      *The name is already exist
                    </span>
                  ) : (
                    ""
                  )}
                </div>

                <div className="q-add-categories-single-input">
                  <label htmlFor="description" className="product-input-title">
                    Description
                  </label>
                  <CkEditorInput
                    value={productInfo?.description}
                    onChange={handleProductInfo}
                  />
                </div>
                {/* <div className="q-add-categories-single-input">
                    <textarea
                    id="description"
                    name="description"
                      rows="4"
                      cols="50"
                      value={productInfo?.description}
                      onChange={handleProductInfo}
                    ></textarea>
                    {error?.description ? (
                      <span className="error-alert">{error?.description}</span>
                    ) : (
                      ""
                    )}
                  </div> */}
                <div className="">
                  <div className="q-add-categories-single-input">
                    <SearchableDropdown
                      title="Category"
                      keyName="category"
                      name="title"
                      optionList={dropdownData?.categoryList}
                      handleSelectProductOptions={handleSelectProductOptions}
                      handleDeleteSelectedOption={handleDeleteSelectedOption}
                      selectedOption={productInfo?.category}
                      error={error}
                      handleUpdateError={handleUpdateError}
                      placeholder="Search Category"
                    />
                  </div>
                </div>

                <div className="q-add-categories-single-input">
                  <SearchableDropdown
                    title="Taxes"
                    keyName="taxes"
                    name="title"
                    optionList={dropdownData?.taxList}
                    handleSelectProductOptions={handleSelectProductOptions}
                    handleDeleteSelectedOption={handleDeleteSelectedOption}
                    selectedOption={productInfo?.taxes}
                    error={error}
                    // handleUpdateError={handleUpdateError}
                    placeholder="Search Taxes"
                    pageUrl={pageUrl}
                  />
                </div>

                <div className="q-add-categories-single-input">
                  <SearchableDropdown
                    title="Related Products"
                    keyName="relatedProduct"
                    name="title"
                    optionList={dropdownData?.relatedProducttList}
                    handleSelectProductOptions={handleSelectProductOptions}
                    handleDeleteSelectedOption={handleDeleteSelectedOption}
                    selectedOption={productInfo?.relatedProduct}
                    error={error}
                    // handleUpdateError={handleUpdateError}
                    placeholder="Search Related Products"
                    productTitle={productInfo?.title}
                    pageUrl={pageUrl}
                  />
                </div>

                <div className="q-add-categories-single-input">
                  <SearchableDropdown
                    title="Frequently Bought Together"
                    keyName="frequentlyBought"
                    name="title"
                    optionList={dropdownData?.frequentlyBroughtList}
                    handleSelectProductOptions={handleSelectProductOptions}
                    handleDeleteSelectedOption={handleDeleteSelectedOption}
                    selectedOption={productInfo?.frequentlyBought}
                    error={error}
                    // handleUpdateError={handleUpdateError}
                    placeholder="Search Products"
                    productTitle={productInfo?.title}
                    pageUrl={pageUrl}
                  />
                </div>

                <div className="q-add-categories-single-input image-list">
                  <div className="q_dashbaord_netsales ">
                    <h1>Product Images</h1>
                  </div>

                  <label className="image-title-show">
                    Select Default Image if in case some color image is not
                    available.
                  </label>
                  <div className="q_border_product image-upload-gallery">
                    <div
                      className="py-10"
                      style={{
                        border: "2px solid #0A64F9",
                        width: "180px",
                        height: "180px",
                        cursor: "pointer",
                        display: "grid",
                        placeContent: "center",
                      }}
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      onClick={openFileInput}
                    >
                      <div
                        className=""
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          width: "200px",
                        }}
                      >
                        <img
                          src={UploadIMG}
                          alt="Default"
                          className="w-6 h-6 text-center"
                        />
                        <span style={{ color: "#0A64F9", fontSize: "12px" }}>
                          Choose Files
                        </span>
                      </div>
                      <div className="q-add-categories-single-input">
                        <input
                          type="file"
                          id="image"
                          name="files"
                          accept="image/*"
                          ref={fileUploadRef}
                          multiple
                          className="default-img-inputfield"
                          onChange={handleImageChange}
                        />
                      </div>
                    </div>

                    <div class="image-list">
                      {productInfo?.files?.length
                        ? productInfo?.files?.map((img, index) => {
                            // if img type is string
                            if (typeof img === "string") {
                              return (
                                <div
                                  className="py-10 image-display"
                                  style={{
                                    border: "2px solid #0A64F9",
                                    // width: "20%",
                                    cursor: "pointer",
                                  }}
                                  key={index}
                                >
                                  <>
                                    <span
                                      className="delete-image-icon img-DeleteIcon"
                                      // onClick={handleDeleteImage}
                                      style={{
                                        position: "absolute",
                                        top: "7px",
                                        right: "7px",
                                      }}
                                    >
                                      <img
                                        src={CloseIcon}
                                        className="delete-image"
                                        onClick={() =>
                                          handleDeleteSelectedImage(
                                            "string",
                                            img
                                          )
                                        }
                                      />
                                    </span>
                                    <img
                                      src={
                                        BASE_URL +
                                        `/upload/products/${LoginGetDashBoardRecordJson?.data?.merchant_id}/` +
                                        img
                                      }
                                      alt="Preview"
                                      className="default-img"
                                    />
                                  </>
                                </div>
                              );
                            }
                            // if img type is object
                            return (
                              <div
                                className="py-10 image-display"
                                style={{
                                  border: "2px solid #0A64F9",
                                  // width: "20%",
                                  cursor: "pointer",
                                }}
                                key={index}
                              >
                                <>
                                  <span
                                    className="delete-image-icon img-DeleteIcon"
                                    // onClick={handleDeleteImage}
                                    style={{
                                      position: "absolute",
                                      top: "7px",
                                      right: "7px",
                                    }}
                                  >
                                    <img
                                      src={CloseIcon}
                                      className="delete-image"
                                      onClick={() =>
                                        handleDeleteSelectedImage("object", img)
                                      }
                                    />
                                  </span>
                                  <img
                                    src={img?.base64}
                                    alt="Preview"
                                    className="default-img"
                                  />
                                </>
                              </div>
                            );
                          })
                        : ""}
                    </div>
                  </div>
                  {error["files"] ? (
                    <span className="error-alert">{error["files"]}</span>
                  ) : (
                    ""
                  )}
                  {}
                </div>

                <div className="mt_card_header">
                  <VariantAttributes
                    varientDropdownList={dropdownData?.varientList}
                    varientError={varientError}
                    filterOptionList={filterOptionList}
                    toggleVarientSection={toggleVarientSection}
                    isMultipleVarient={isMultipleVarient}
                    handleOnBlurAttributes={handleOnBlurAttributes}
                    handleFilterDropdownOption={handleFilterDropdownOption}
                    varientLength={varientLength}
                    handleSetVarientLength={handleSetVarientLength}
                    addMoreVarientItems={addMoreVarientItems}
                    handleClearFormData={handleClearFormData}
                  />
                </div>

                <div className="mt_card_header">
                  <GeneratePUC
                    handleVarientTitleBasedItemList={
                      handleVarientTitleBasedItemList
                    }
                    error={error}
                    handleGenerateUPC={handleGenerateUPC}
                    handleOnChange={handleOnChange}
                    formValue={formValue}
                    handleBlur={handleBlur}
                    isMultipleVarient={isMultipleVarient}
                    productInfo={productInfo}
                    inventoryData={inventoryData}
                    handleCloseEditModal={handleCloseEditModal}
                    productData={productData}
                    varientData={varientData}
                    isVarientEdit={isVarientEdit}
                  />
                </div>

                <div className="box">
                  <div className="variant-attributes-container">
                    {/* Your existing JSX for variant attributes */}

                    <div className="q-add-categories-section-middle-footer  ">
                      {pageUrl === "inventory/products/edit" &&
                      productData?.isvarient === "1" ? (
                        <div
                          className="q-category-bottom-header"
                          style={{ marginRight: "67px" }}
                        >
                          <button
                            className="quic-btn quic-btn-bulk-edit"
                            onClick={() => handleCloseEditModal("bulk-edit")}
                          >
                            Bulk Edit
                          </button>
                        </div>
                      ) : (
                        ""
                      )}
                      <div
                        className="q-category-bottom-header"
                        style={{ marginRight: "67px" }}
                      >
                        {pageUrl !== "inventory/products/edit" ? (
                          <button
                            className="quic-btn quic-btn-save"
                            onClick={handleSubmitForm}
                            disabled={isLoading}
                            style={{
                              backgroundColor: isLoading
                                ? "#878787"
                                : "#0A64F9",
                            }}
                          >
                            {isLoading ? (
                              <Box className="loader-box">
                                <CircularProgress />
                              </Box>
                            ) : (
                              "Insert"
                            )}
                          </button>
                        ) : (
                          <button
                            className="quic-btn quic-btn-update"
                            onClick={handleSubmitForm}
                            disabled={isLoading}
                            style={{
                              backgroundColor: isLoading
                                ? "#878787"
                                : "#0A64F9",
                            }}
                          >
                            {isLoading ? (
                              <Box className="loader-box">
                                <CircularProgress />
                              </Box>
                            ) : (
                              "Update"
                            )}
                          </button>
                        )}
                        <button
                          className="quic-btn quic-btn-cancle"
                          onClick={() => {
                            navigate("/inventory/products");
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div class="q-attributes-main-page box_shadow_div">
          <div class="q-add-categories-section">
            <div class="q-add-categories-section-middle-form">
              <div className="mt_card_header">
                <EditPage
                  openEditModal={openEditModal}
                  handleCloseEditModal={handleCloseEditModal}
                  productData={productData}
                  modalType={modalType}
                  varientData={varientData}
                  varientIndex={varientIndex}
                  formData={formValue}
                  handleCopyAllVarientValue={handleCopyAllVarientValue}
                  inventoryData={inventoryData}
                  fetchProductDataById={fetchProductDataById}
                  isVarientEdit={isVarientEdit}
                  fetchSingleVarientData={fetchSingleVarientData}
                />
                <GeneratePUC
                  handleVarientTitleBasedItemList={
                    handleVarientTitleBasedItemList
                  }
                  error={error}
                  handleGenerateUPC={handleGenerateUPC}
                  handleOnChange={handleOnChange}
                  formValue={formValue}
                  handleBlur={handleBlur}
                  isMultipleVarient={isMultipleVarient}
                  productInfo={productInfo}
                  inventoryData={inventoryData}
                  handleCloseEditModal={handleCloseEditModal}
                  productData={productData}
                  // varientData={varientData}
                  isVarientEdit={isVarientEdit}
                />
              </div>
              <div  className="q-category-bottom-header varient-box" style={{ marginRight: "0px" }}>
                <button
                  className="quic-btn quic-btn-save"
                  onClick={handleUpdateVarient}
                  disabled={varientLoading}
                  style={{
                    backgroundColor: varientLoading ? "#878787" : "#0A64F9",
                  }}
                >
                  {varientLoading ? (
                    <Box className="loader-box">
                      <CircularProgress />
                    </Box>
                  ) : (
                    "Update"
                  )}
                </button>
                <button
                  className="quic-btn quic-btn-cancle"
                  onClick={() => {
                    navigate("/inventory/products");
                  }}
                  style={{ marginLeft: "20px" }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddProducts;
