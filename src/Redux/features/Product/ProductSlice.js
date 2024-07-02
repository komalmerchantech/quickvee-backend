import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {
  ALL_PRODUCTS_LIST_WITH_VARIANTS,
  BASE_URL,
  PRODUCTS_LIST,
  UPDATE_TYPE,
} from "../../../Constants/Config";

const initialState = {
  loading: false,
  productsData: [],
  allProductsData: [],
  page: 0,
  offset: 0,
  limit: 10,
  hasMore: true,
  successMessage: "",
  error: "",
  formData: [],

  // for add product varient
  isLoading: false,
  isError: false,
  // for edit product
  isEditError: false,
  // for fetchDataBy Id
  isFetchLoading: false,

  // showType initial state
  showType: 3,

  varientProduct:[],
};
// Generate pening , fulfilled and rejected action type
export const fetchAllProducts = createAsyncThunk(
  "products/fetchAllProducts",
  async (data) => {
    try {
      const { token, ...dataNew } = data;
      const response = await axios.post(
        BASE_URL + ALL_PRODUCTS_LIST_WITH_VARIANTS,
        dataNew,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        return response.data.result;
      }
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

// Generate pening , fulfilled and rejected action type
export const fetchProductsData = createAsyncThunk(
  "products/fetchProductsData",
  async (data) => {
    try {
      const { token, ...dataNew } = data;
      const response = await axios.post(BASE_URL + PRODUCTS_LIST, dataNew, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log(response)
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

export const updateProductsType = createAsyncThunk(
  "products/updateProductsType",
  async (data) => {
    try {
      const response = await axios.post(BASE_URL + UPDATE_TYPE, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // console.log(response)
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);
export const getInventorySetting = createAsyncThunk(
  "products/getInventorySetting",
  async (payload) => {
    const token = payload.get('token'); // Extract the token from FormData
    payload.delete('token');
    try {
      const response = await axios.post(
        BASE_URL + "Profile_setup/inventory_register_setting",
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response?.data?.result?.cost_per;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

export const getInventorySettingOnVarient = createAsyncThunk(
  "products/getInventorySettingOnVarient",
  async (payload) => {
    const token = payload.get('token'); // Extract the token from FormData
    payload.delete('token');
    try {
      const response = await axios.post(
        BASE_URL + "Profile_setup/inventory_register_setting",
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response?.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

export const editProductData = createAsyncThunk(
  "products/editProduct",
  async (payload) => {
    const token = payload.get('token'); // Extract the token from FormData
    payload.delete('token');
    try {
      const response = await axios.post(
        BASE_URL + "Product_api_react/edit_produt",
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

export const addProduct = createAsyncThunk(
  "products/addProduct",
  async (payload) => {
    const token = payload.get('token'); // Extract the token from FormData
    payload.delete('token');
    try {
      const response = await axios.post(
        BASE_URL + "Product_api_react/add_product",
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

// dropdown content
export const fetchVarientList = createAsyncThunk(
  "products/fetchVarientList",
  async (payload) => {
    const {token, ...newData} = payload;
    try {
      const response = await axios.post(
        BASE_URL + "Varient_react_api/varients_list",
        newData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response?.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

export const fetchCategoryList = createAsyncThunk(
  "products/fetchCategoryList",
  async (payload) => {
    try {
      const response = await axios.post(
        BASE_URL + "Categoryapi/category_list",
        payload
      );
      return response?.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

export const fetchTaxList = createAsyncThunk(
  "products/fetchTaxList",
  async (payload) => {
    try {
      const response = await axios.post(
        BASE_URL + "Settingapi/tax_list",
        payload
      );
      return response?.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

export const fetchProductList = createAsyncThunk(
  "products/fetchProductList",
  async (payload) => {
    try {
      const response = await axios.post(
        BASE_URL + "Productapi/products_list",
        payload
      );
      return response?.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

export const fetchProductsDataById = createAsyncThunk(
  "products/fetchProductData",
  async (payload) => {
    const token = payload.get('token'); // Extract the token from FormData
    payload.delete('token');
    
    try {
      const response = await axios.post(
        BASE_URL + "Product_api_react/get_productdata_ById",
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response?.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

export const checkProductTitle = createAsyncThunk(
  "products/checkProductTitle",
  async (payload) => {
    const token = payload.get('token'); // Extract the token from FormData
    payload.delete('token');
    try {
      const response = await axios.post(
        BASE_URL + "Product_api_react/check_productTitle",
        payload,{
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response?.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

export const fetchVendorList = createAsyncThunk(
  "products/fetchVendorList",
  async (payload) => {
    const token = payload.get('token'); // Extract the token from FormData
    payload.delete('token');
    try {
      const response = await axios.post(
        BASE_URL + "Product_api_react/product_vendors_list",
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response?.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

export const filterVendorAPI = createAsyncThunk(
  "products/filterVendorAPI",
  async (payload) => {
    try {
      const response = await axios.post(
        BASE_URL + "Vendor_api/vendor_list",
        payload
      );
      return response?.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

export const assignProductVendor = createAsyncThunk(
  "products/assignProductVendor",
  async (payload) => {
    const token = payload.get('token'); // Extract the token from FormData
    payload.delete('token');
    
    try {
      const response = await axios.post(
        BASE_URL + "Product_api_react/assign_product_vendors",
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response?.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

export const fetchSalesHistory = createAsyncThunk(
  "products/fetchSalesHistory",
  async (payload) => {
    const token = payload.get('token'); // Extract the token from FormData
    payload.delete('token');
    try {
      const response = await axios.post(
        BASE_URL + "Product_api_react/saleshistory",
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response?.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

export const assignPrefferedVendor = createAsyncThunk(
  "products/assignPrefferedVendor",
  async (payload) => {
    try {
      const response = await axios.post(
        BASE_URL + "Productapi/assign_preferred_vendor",
        payload
      );
      return response?.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

export const deleteProductVendor = createAsyncThunk(
  "products/deleteProductVendor",
  async (payload) => {
    try {
      const response = await axios.post(
        BASE_URL + "Productapi/delete_product_vendor",
        payload
      );
      return response?.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

export const saveVendorList = createAsyncThunk(
  "products/saveVendorList",
  async (payload) => {

 const token = payload.get('token'); // Extract the token from FormData
 payload.delete('token');
 
    try {
      const response = await axios.post(
        BASE_URL + "Productapi/save_vendor_list",
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response?.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

export const getAlreadyAssignVendor = createAsyncThunk(
  "products/getAlreadyAssignVendor",
  async (payload) => {
    const token = payload.get('token'); // Extract the token from FormData
    payload.delete('token');
    
    try {
      const response = await axios.post(
        BASE_URL + "Product_api_react/assign_product_vendors_list",
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response?.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

export const bulkVendorAssign = createAsyncThunk(
  "products/bulkVendorAssign",
  async (payload) => {
    const token = payload.get('token'); // Extract the token from FormData
    payload.delete('token');
    try {
      const response = await axios.post(
        BASE_URL + "Product_api_react/bulk_assign_vendors",
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response?.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

export const saveSingleVarientPO = createAsyncThunk(
  "products/saveSingleVarientPO",
  async (payload) => {
    const token = payload.get('token'); // Extract the token from FormData
    payload.delete('token');
    
    try {
      const response = await axios.post(
        BASE_URL + "Product_api_react/save_instant_po",
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response?.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

export const saveBulkInstantPo = createAsyncThunk(
  "products/saveBulkInstantPo",
  async (payload) => {
    const token = payload.get('token'); // Extract the token from FormData
    payload.delete('token');
    
    try {
      const response = await axios.post(
        BASE_URL + "Product_api_react/bulk_instant_po",
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response?.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

export const changeOnlineOrderMethod = createAsyncThunk(
  "products/changeOnlineOrderMethod",
  async (payload) => {
    const {token, ...payloadNew} = payload;
    try {
      const response = await axios.post(
        BASE_URL + "Product_api_react/product_show_status_update",
        payloadNew,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response?.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

export const deleteProductAPI = createAsyncThunk(
  "products/deleteProductAPI",
  async (payload) => {
    const token = payload.get('token'); // Extract the token from FormData
    payload.delete('token');
    try {
      const response = await axios.post(
        BASE_URL + "Product_api_react/delete_product",
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response?.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

export const checkUpcCodeMultiple = createAsyncThunk(
  "products/checkUpcCodeMultiple",
  async (payload) => {
    // const token = payload.get('token'); // Extract the token from FormData
    // payload.delete('token');
    try {
      const response = await axios.post(
        BASE_URL + "Product_api_react/check_upc",
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          },
        }
      );
      return response?.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

export const checkUpcCodeSingle = createAsyncThunk(
  "products/checkUpcCodeSingle",
  async (payload) => {
    // const token = payload.get('token'); // Extract the token from FormData
    // payload.delete('token');
    try {
      const response = await axios.post(
        BASE_URL + "Product_api_react/check_upc_form",
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          },
        }
      );
      return response?.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);


export const checkUpcOnVarientEdit = createAsyncThunk(
  "products/checkUpcOnVarientEdit",
  async (payload) => {
    // const token = payload.get('token'); // Extract the token from FormData
    // payload.delete('token');
    const {token, ...newData} = payload;
    try {
      const response = await axios.post(
        BASE_URL + "Product_api_react/check_upc_new",
        newData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response?.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);


export const updateEditVarient = createAsyncThunk(
  "products/updateEditVarient",
  async (payload) => {
    // const token = payload.get('token'); // Extract the token from FormData
    // payload.delete('token');
    console.log('update var', payload);
    const {token, ...newData} = payload;
    try {
      const response = await axios.post(
        BASE_URL + "Product_api_react/update_variant",
        newData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response?.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);



export const fetchVarietDataById = createAsyncThunk(
  "products/fetchVarietDataById",
  async (payload) => {
    const token = payload.get('token'); // Extract the token from FormData
    payload.delete('token');
    
    try {
      const response = await axios.post(
        BASE_URL + "Product_api_react/get_variantdata_ById",
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response?.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);
const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    emptyProduct: (state, action) => {
      state.productsData = action.payload;
      state.offset = 0;
      state.limit = 10;
      state.hasMore = true;
      state.page = 0;
    },
    editProduct: (state, action) => {
      state.productsData = state.productsData.map((product) => {
        if (product.id === action.payload.id) {
          return {
            ...product, // Spread syntax to copy existing properties
            title: action.payload.title, // Update the title
            old_title: action.payload.title,
          };
        } else {
          // This isn't the one we're looking for - leave it as is
          return product;
        }
      });
    },
    updateFormValue: (state, action) => {
      state.formData = action?.payload;
    },
    changeShowType: (state, action)=>{
      const { id, updateValue } = action.payload;
      const obj = state.productsData?.find(obj => obj.id === id);
      if (obj) {
          obj.show_type = updateValue;
      }
    },
    setVarientList: (state, action)=>{
      state.varientProduct = action.payload;
    }
    
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllProducts.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchAllProducts.fulfilled, (state, action) => {
      state.allProductsData = action.payload;
    });
    builder.addCase(fetchAllProducts.rejected, (state, action) => {
      state.allProductsData = [];
    });

    builder.addCase(fetchProductsData.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchProductsData.fulfilled, (state, action) => {
      state.loading = false;
      // state.productsData = action.payload;
      // state.productsData = [...state.productsData, ...action.payload];
      // Ensure productsData is always treated as an array
      if (!Array.isArray(state.productsData)) {
        state.productsData = [];
      }
      // Append new items to the productsData array
      // console.log(state);
      const productIds = new Set(state.productsData.map(product => product.title));
  
      // Append new items to the productsData array if they are not already present
      action.payload.forEach(product => {
        if (!productIds.has(product.title)) {
          state.productsData.push(product);
          productIds.add(product.title);
        }
      });
      state.offset += 10;
      state.hasMore = action.payload.length > 0;
      state.error = "";
    });
    builder.addCase(fetchProductsData.rejected, (state, action) => {
      state.loading = false;
      state.productsData = [];
      state.error = action.error.message;
    });
    builder.addCase(updateProductsType.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateProductsType.fulfilled, (state, action) => {
      state.loading = false;
    });
    builder.addCase(updateProductsType.rejected, (state, action) => {
      state.loading = false;
      state.productsData = {};
      state.error = action.error.message;
    });

    // add product varient
    builder.addCase(addProduct.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
    });
    builder.addCase(addProduct.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
    });
    builder.addCase(addProduct.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
    });

    // edit product
    builder.addCase(editProductData.pending, (state) => {
      state.isLoading = true;
      state.isEditError = false;
    });
    builder.addCase(editProductData.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isEditError = false;
    });
    builder.addCase(editProductData.rejected, (state, action) => {
      state.isLoading = false;
      state.isEditError = true;
    });

    // fetchingDataById
    builder.addCase(fetchProductsDataById.pending, (state) => {
      state.isFetchLoading = true;
      // state.isEditError = false;
    });
    builder.addCase(fetchProductsDataById.fulfilled, (state, action) => {
      state.isFetchLoading = false;
      // state.isEditError = false;
    });
    builder.addCase(fetchProductsDataById.rejected, (state, action) => {
      state.isFetchLoading = false;
      // state.isEditError = true;
    });
  },
});

export const { editProduct, emptyProduct, updateFormValue, changeShowType, setVarientList } =
  productsSlice.actions;
export default productsSlice.reducer;