import React, { useState } from "react";
import { FaAngleLeft } from "react-icons/fa";
import DefaultDrop from "./DefaultDrop";
import ProductImagesField from "./ProductImagesField";

const ProductEdit = () => {
  const [productData, setProductData] = useState({
    title: "",
    description: "",
    category: "",
  });

  const [appendedData, setAppendedData] = useState([]);

  const handleChange = (field, value) => {
    setProductData({ ...productData, [field]: value });
  };

  const handleCategoryClick = (category) => {
    setAppendedData([...appendedData, category]);
  };

  const handleUpdate = (e) => {
    e.preventDefault(); // Prevent form submission

    // Add your logic to update the product data
  };

  const categories = [
    "Vapes",
    "510 Thread Vape Batteries",
    "Torches",
    "Coils and Pods",
    "Butane",
    "Nectar Collectors",
    "Vapes",
    "510 Thread Vape Batteries",
    "Torches",
    "Coils and Pods",
    "Butane",
    "Nectar Collectors",
    // Add more categories as needed
  ];

  const navigateToCategoryPage = () => {
    window.location.href = "/inventory/category"; // Replace "/category" with the actual path of your category page
  };

  const handleCancel = () => {
    navigateToCategoryPage();
  };

  const [selectedOptions, setSelectedOptions] = useState([]);

  const updateSelectedOptions = (newSelectedOptions) => {
    setSelectedOptions(newSelectedOptions);
    // Perform any additional logic or data updating here
  };
  return (
    <>
      <div className="mx-2 my-2">
        <div
          className="box-content h-auto w-70 p-2 border-4 border-white bg-white rounded-xl opacity-100 mt-9 mx-8"
          style={{ boxShadow: "0px 3px 6px #0000001F" }}
        >
          <div>
            <div className="flex items-center gap-2 py-4 cursor-pointer">
              <div className="flex items-center gap-2">
                <FaAngleLeft color="black" size={18} />
                <div className="py-2 mx-2 text-[18px] admin_medium">
                  Edit Product
                </div>
              </div>
            </div>
            <div className="mt-1 bg-[#000] border-b-2 w-full mb-2"></div>
          </div>

          <form onSubmit={handleUpdate}>
            {/* Title input */}
            <div className="flex flex-col mb-4">
              <label className="text-sm mb-1" htmlFor="title">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={productData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                className="border p-2 rounded-md"
              />
            </div>

            {/* Description input */}
            <div className="flex flex-col mb-4">
              <label className="text-sm mb-1" htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                value={productData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                className="border p-2 rounded-md"
              />
            </div>

            <div className="border border-[#E1E1E1] py-6 px-5 mb-5 ">
              <div className="flex flex-col mb-4">
                <label className="text-sm mb-1" htmlFor="category">
                  Category
                </label>
                <input
                  type="text"
                  id="category"
                  value={`${productData.category} ${appendedData.join(", ")}`}
                  onChange={(e) => handleChange("category", e.target.value)}
                  className="border p-2 rounded-m"
                />
              </div>

              {/* Category buttons */}
              <div className="flex space-x-4 mb-4">
                {categories.map((category, index) => (
                  <button
                    key={index}
                    className="px-4 py-2 bg-white border text-[16px] text-black opacity-100 Admin_bold leading-0 rounded-md mx-4 my-2"
                    onClick={() => handleCategoryClick(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            {/* <div className="flex flex-col mb-4">
              <label className="text-sm mb-1" htmlFor="searchKeyword">
                Search by Keyword
              </label>
              <input
                type="text"
                id="searchKeyword"
                value={searchKeyword}
                onChange={handleSearch}
                className="border p-2 rounded-md"
              />
            </div> */}

            {/* Update and Cancel buttons */}
          </form>
          <div>
            <DefaultDrop
              options={["Option 1", "Option 2", "Option 3"]}
              selectedOptions={selectedOptions}
              updateSelectedOptions={updateSelectedOptions}
            />
          </div>

          <ProductImagesField />
          <div className="flex justify-end space-x-4">
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded-md"
              onSubmit={{ updateSelectedOptions }}
            >
              Update
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-red-500 text-white rounded-md"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductEdit;
