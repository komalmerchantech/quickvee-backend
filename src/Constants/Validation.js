const Validation = () => {
  const EmailReg = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
  const PassNum = /\d/i;
  const PassUppercase = /^(?=.*[A-Z])/;
  const PassLowercase = /^(?=.*[a-z])/;
  const PassSpecCha = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/i;
  const emoji =
    /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{1FAB0}-\u{1FABF}\u{1FAC0}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2300}-\u{23FF}\u{2B50}]/gu;

  const PassLeng = /^.{6,}$/i;
  const Space = /^[^\s]+$/i;
  // const PhoneNo = /^(\+?91|0)?[6789]\d{9}$/i;
  const Nameval = /^[a-zA-Z]+$/;
  const NameSpace = /^[a-zA-Z\s]+$/;
  const Numberval = /^\d*$/;
  const Characterval = /^[A-Za-z\s]+$/;

  const validateEmail = (email, updatedErrors) => {
    if (email === "") {
      updatedErrors.email = "Email Address is required";
    } else if (emoji.test(email)) {
      updatedErrors.email = "Emoji not allowed";
    } else if (!EmailReg.test(email)) {
      updatedErrors.email = "Enter valid email address";
    } else {
      updatedErrors.email = "";
    }
    return updatedErrors;
  };
  const validatePassword = (password, updatedErrors) => {
    if (password === "") {
      updatedErrors.password = "Please enter password field";
    } else if (emoji.test(password)) {
      updatedErrors.password = "Emoji not allowed";
    } else if (!PassUppercase.test(password)) {
      updatedErrors.password = "Password should contain Uppercase letter";
    } else if (!PassLowercase.test(password)) {
      updatedErrors.password = "Password should contain Lowercase letter";
    } else if (!PassNum.test(password)) {
      updatedErrors.password = "Password should contain number";
    } else if (!PassSpecCha.test(password)) {
      updatedErrors.password = "Password should contain Special Character";
    } else if (!PassLeng.test(password)) {
      updatedErrors.password = "Length should be greater or equal to 6";
    } else if (!Space.test(password)) {
      updatedErrors.password = "Space is not allow";
    } else {
      updatedErrors.password = "";
    }
  };
  const validateOldPassword = (password, updatedErrors) => {
    if (password === "") {
      updatedErrors.oldpassword = "Please enter old password field";
    } else if (emoji.test(password)) {
      updatedErrors.oldpassword = "Emoji not allowed";
    } else {
      updatedErrors.oldpassword = "";
    }
  };
  const validatePhoneNumber = (phone, updatedErrors) => {
    if (phone === "") {
      updatedErrors.phone = "Phone Number is required";
    } else if (emoji.test(phone)) {
      updatedErrors.phone = "Emoji not allowed";
    } else if (phone.length !== 10) {
      updatedErrors.phone = "Phone Number not valid";
    } else {
      updatedErrors.phone = "";
    }
  };
  const validateConfrimPassword = (
    confrimpassword,
    password,
    myconfString,
    updatedErrors
  ) => {
    if (confrimpassword === "") {
      updatedErrors.confirmpassword = `Please enter ${myconfString} field`;
    } else if (emoji.test(confrimpassword)) {
      updatedErrors.confirmpassword = "Emoji not allowed";
    } else if (confrimpassword !== password) {
      updatedErrors.confirmpassword = "Not matching with password";
    } else {
      updatedErrors.confirmpassword = "";
    }
  };
  const validateFirstName = (fname, updatedErrors) => {
    if (fname === "") {
      updatedErrors.firstname = "First Name is required";
    } else if (emoji.test(fname)) {
      updatedErrors.firstname = "Emoji not allowed";
    } else if (!Space.test(fname)) {
      updatedErrors.firstname = "Space is not allowed";
    } else if (!Nameval.test(fname)) {
      updatedErrors.firstname = "First Name can only contain alphabet";
    } else {
      updatedErrors.firstname = "";
    }
  };
  const validateLastName = (lname, updatedErrors) => {
    if (lname === "") {
      updatedErrors.lastname = "";
    } else if (emoji.test(lname)) {
      updatedErrors.lastname = "Emoji not allowed";
    } else if (!Space.test(lname)) {
      updatedErrors.lastname = "Space is not allowed";
    } else if (!Nameval.test(lname)) {
      updatedErrors.lastname = "Last Name can only contain alphabet";
    } else {
      updatedErrors.lastname = "";
    }
  };

  const validateStreetAddress = (street, updatedErrors) => {
    if (street === "") {
      updatedErrors.streetaddress = "Please enter street address field ";
    } else if (emoji.test(street)) {
      updatedErrors.streetaddress = "Emoji not allowed";
    } else {
      updatedErrors.streetaddress = "";
    }
  };

  const Address_line_1 = (street, updatedErrors) => {
    // if (street === "") {
    //   updatedErrors.address_line_1 = "Please enter Address ";
    // } else
    if (emoji.test(street)) {
      updatedErrors.address_line_1 = "Emoji not allowed";
    } else {
      updatedErrors.address_line_1 = "";
    }
  };

  const validateState = (state, updatedErrors) => {
    if (state === "") {
      updatedErrors.state = "";
    } else if (emoji.test(state)) {
      updatedErrors.state = "Emoji not allowed";
    } else {
      updatedErrors.state = "";
    }
  };
  const validateApartment = (apartment, updatedErrors) => {
    if (apartment === "") {
      updatedErrors.apartmentnumber =
        "Please enter Suite/Apartment Number field ";
    } else if (emoji.test(apartment)) {
      updatedErrors.apartmentnumber = "Emoji not allowed";
    } else {
      updatedErrors.apartmentnumber = "";
    }
  };

  const validateCity = (city, updatedErrors) => {
    if (city === "") {
      updatedErrors.city = "";
    } else if (emoji.test(city)) {
      updatedErrors.city = "Emoji not allowed";
    } else if (!Characterval.test(city)) {
      updatedErrors.city = "City can only contain character";
    } else {
      updatedErrors.city = "";
    }
  };

  const validateZipCode = (zipcode, updatedErrors) => {
    if (zipcode === "") {
      updatedErrors.zipcode = "";
    } else if (emoji.test(zipcode)) {
      updatedErrors.zipcode = "Emoji not allowed";
    } else if (zipcode.length !== 5) {
      updatedErrors.zipcode = "Max 5 number should be entered";
    } else if (!Numberval.test(zipcode)) {
      updatedErrors.zipcode = "Zipcode can only contain number ";
    } else {
      updatedErrors.zipcode = "";
    }
  };

  const checkPin = (pin, employeeList) => {
    // const foundItem = employeeList.some(
    //   (item) => item.pin === pin
    // );
    const foundItem =
      employeeList &&
      employeeList.find((item) => {
        return item.pin === pin;
      });
    return foundItem;
  };

  const validatePinNumber = (pin, updatedErrors, employeeList) => {
    if (pin === "") {
      updatedErrors.pin = "Pin is required";
    } else if (emoji.test(pin)) {
      updatedErrors.pin = "Emoji not allowed";
    } else if (pin.length !== 4 && pin.length !== 5) {
      updatedErrors.pin = "Invalid Pin";
    } else if (checkPin(pin, employeeList)) {
      updatedErrors.pin = "Pin is already registered ";
    } else {
      updatedErrors.pin = "";
    }
  };

  const validateWages = (wages, updatedErrors) => {
    if (wages === "") {
      updatedErrors.wages = "";
    } else if (emoji.test(wages)) {
      updatedErrors.wages = "Emoji not allowed";
    } else if (wages.length > 8) {
      updatedErrors.wages = "Max 8 number should be enter";
    } else if (!/^\d+(\.\d+)?$/.test(wages)) {
      // // Updated regular expression to allow decimals
      updatedErrors.wages = "Wages should only contain numbers";
    } else {
      updatedErrors.wages = "";
    }
  };
  // else if (!Numberval.test(wages)) {
  // updatedErrors.wages = 'Wages only contain number ';
  // }

  const validateIDproof = (idproof, updatedErrors) => {
    if (idproof === "") {
      updatedErrors.idproof = "Please enter ID  field ";
    } else {
      updatedErrors.idproof = "";
    }
  };
  const validateDOB = (DOB, updatedErrors) => {
    if (DOB === "") {
      updatedErrors.DOB = "Please enter Date of Birth  field ";
    } else {
      updatedErrors.DOB = "";
    }
  };
  const validateExpiredate = (expiredate, updatedErrors) => {
    if (expiredate === "") {
      updatedErrors.expiredate = "Expiration Date is required";
    } else {
      updatedErrors.expiredate = "";
    }
  };
  const validateImageProof = (myfile, updatedErrors) => {
    if (myfile === "") {
      updatedErrors.myfile = "Image is required";
    } else {
      updatedErrors.myfile = "";
    }
  };
  const convertToIndianTime = (usTime) => {
    if (usTime) {
      // Split the input time into hours and minutes
      const [hours, minutes] = usTime.split(":");

      // Create a Date object with the current date and the input hours and minutes
      const usDate = new Date();
      usDate.setHours(parseInt(hours, 10));
      usDate.setMinutes(parseInt(minutes, 10));

      // Convert the Date object to Indian time
      const options = {
        timeZone: "Asia/Kolkata", // Indian Standard Time (IST) timezone
        hour12: true, // Use 12-hour format (true) or 24-hour format (false)
        hour: "numeric", // Display hours
        minute: "numeric", // Display minutes
      };

      const indianTime = usDate.toLocaleTimeString("en-IN", options);
      return indianTime;
    }
  };

  const formatDate = (inputDate) => {
    const date = new Date(inputDate);

    const year = date.getFullYear().toString().slice(2); // Extract the last two digits of the year
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-indexed
    const day = date.getDate().toString().padStart(2, "0");

    return `${day}/${month}/${year}`;
  };

  const percentOffItem = (price, compare_price) => {
    const percent = 100 - (parseFloat(price) / parseFloat(compare_price)) * 100;
    if (percent > 0) return parseInt(percent);
    else return 0;
  };
  const AddtoCart = (product, merchantId) => {
    const cartKey = `cart_${merchantId}`;
    let cartData = JSON.parse(localStorage.getItem(cartKey)) || [];
    cartData.push(product);

    localStorage.setItem(cartKey, JSON.stringify(cartData));
  };

  const checkInCart = (product, merchantId) => {
    const cartKey = `cart_${merchantId}`;
    let cartData = JSON.parse(localStorage.getItem(cartKey)) || [];

    const productExists = cartData.some((item) => {
      const sameProductId = item.productId === product.productId;
      const sameCategoryId = item.categoryId === product.categoryId;

      // Check if all variants match
      if (product.varients) {
        const sameVariants = product.varients.every((pVariant) => {
          // Find a matching variant in the cart item
          const matchingVariant = item.varients.find((variant) => {
            return (
              pVariant.varientName === variant.varientName &&
              pVariant.varientVl === variant.varientVl
            );
          });
          // If a matching variant is found for each pVariant, it means all variants match
          return !!matchingVariant;
        });

        return sameProductId && sameCategoryId && sameVariants;
      } else {
        return sameProductId && sameCategoryId;
      }
    });

    return productExists;
  };

  const UpdateQuantity = (productId, merchantId, categoryId, qty) => {
    const cartKey = `cart_${merchantId}`;
    let cartData = JSON.parse(localStorage.getItem(cartKey)) || [];

    const updatedCartData = cartData.map((item) => {
      if (item.productId === productId && item.categoryId === categoryId) {
        // Update the quantity of the matching item
        return { ...item, quantity: qty };
      }
      return item; // Keep other items unchanged
    });

    localStorage.setItem(cartKey, JSON.stringify(updatedCartData));
  };

  const getProductQuantity = (cartData, productId, merchantId, categoryId) => {
    // const cartKey = `cart_${merchantId}`;
    // const cartData = JSON.parse(localStorage.getItem(cartKey));

    const foundItem =
      cartData &&
      cartData.find((item) => {
        return item.productId === productId && item.categoryId === categoryId;
      });
    // console.log(foundItem)
    return foundItem ? parseInt(foundItem.quantity) : 1;
  };

  const isDecodedData = (str) => {
    try {
      return atob(str);
    } catch (error) {
      return false;
    }
  };
  const isValidJSON = (str) => {
    try {
      return JSON.parse(str);
    } catch (error) {
      return false;
    }
  };
  const filterProductData = (productInfo, productData) => {
    let productWithInfo = [];
    for (let index = 0; index < productInfo.length; index++) {
      const element = productInfo[index];
      let categoryArray = productData[element.categoryId];
      if (categoryArray && categoryArray.length) {
        let product = categoryArray.find(
          (e) => e.id === element.productId && e.show_type === element.show_type
        );
        if (product) {
          productWithInfo.push({
            productId: element.productId,
            categoryId: element.categoryId,
            product,
          });
        }
      }
    }
    // console.log(productWithInfo);
    return productWithInfo;
  };

  const filterCartData = (cartData, productData, varientData) => {
    // console.log(cartData)
    // console.log(productData)
    // console.log(varientData);
    let productWithVarient = [];
    for (let index = 0; index < cartData.length; index++) {
      const element = cartData[index];
      let categoryArray = productData[element.categoryId];
      if (categoryArray && categoryArray.length) {
        let product = categoryArray.find((e) => e.id === element.productId);
        if (product) {
          if (element.varients.length >= 1) {
            function processVariants(variants) {
              let result = "";

              for (let i = 0; i < variants.length; i++) {
                if (i > 0) {
                  result += "/";
                }
                result += variants[i].varientVl;
              }

              return result || "else";
            }
            let seletectedvar =
              Array.isArray(varientData) &&
              varientData.find(
                (e) =>
                  e !== null &&
                  e.product_id === element.productId &&
                  e.variant === processVariants(element.varients)
              );
            // console.log(seletectedvar)

            seletectedvar !== undefined &&
              productWithVarient.push({
                cartProductId: element.cartProductId,
                productId: element.productId,
                categoryId: element.categoryId,
                varients: element.varients,
                selectedQuantity: element.quantity,
                maxQuantity: seletectedvar.quantity,
                price: (element.quantity * seletectedvar.price).toFixed(2),
                comparePrice: (
                  element.quantity * seletectedvar.compare_price
                ).toFixed(2),
                //    price:seletectedvar.variant,
                product,
              });
          } else {
            productWithVarient.push({
              cartProductId: element.cartProductId,
              productId: element.productId,
              categoryId: element.categoryId,
              varients: element.varients,
              selectedQuantity: element.quantity,
              maxQuantity: product.quantity,
              price: (element.quantity * product.price).toFixed(2),
              comparePrice: (element.quantity * product.compare_price).toFixed(
                2
              ),
              product,
            });
          }
        }
      }
    }
    //    console.log(productWithVarient);
    return productWithVarient;
  };

  const removeProductFromCart = (cartItem, cartKey) => {
    const cartDataInLocalStorage = JSON.parse(localStorage.getItem(cartKey));
    const updatedCartData = cartDataInLocalStorage.filter(
      (item) => item.cartProductId !== cartItem.cartProductId
    );
    localStorage.setItem(cartKey, JSON.stringify(updatedCartData));
  };
  // update product price from cart in localstore
  const updateProductFromCart = (cartItem, cartKey, qty) => {
    const cartDataInLocalStorage = JSON.parse(localStorage.getItem(cartKey));
    const updatedCartData = cartDataInLocalStorage.map((item) => {
      if (
        item.cartProductId === cartItem.cartProductId &&
        item.productId === cartItem.productId &&
        item.categoryId === cartItem.categoryId
      ) {
        // Update the quantity of the matching item
        return { ...item, quantity: qty };
      }
      return item; // Keep other items unchanged
    });

    localStorage.setItem(cartKey, JSON.stringify(updatedCartData));
  };

  // to get the varient price and quantity we need to run api for all products who have varients and by varients we can get the price and quantity
  const filterVarientDataFromCart = (cartData, merchant) => {
    // console.log(cartData)
    const outputData = [];

    cartData &&
      cartData.length >= 1 &&
      cartData.forEach((item) => {
        if (item.varients.length > 0) {
          const product_id = parseInt(item.productId);
          const merchantId = merchant;
          let v1, v2, v3;
          if (item.varients.length >= 1) {
            // Assuming there are at most 3 varients
            v1 = item.varients[0]?.varientVl || "";
            v2 = item.varients[1]?.varientVl || "";
            v3 = item.varients[2]?.varientVl || "";
          }

          outputData.push({
            product_id,
            merchantId,
            v1,
            v2,
            v3,
          });
        }
      });

    const outputJson = JSON.stringify(outputData, null, 2);
    // console.log(outputJson)
    return outputJson;
  };

  // varient transformer for single product page
  const varientTransformer = (originalObject) => {
    const transformedArray = [];

    for (let i = 1; i <= 3; i++) {
      const optKey = `options${i}`;
      const optValKey = `optionsvl${i}`;

      const obj = {
        [optKey]: originalObject && originalObject[optKey],
        [optValKey]:
          originalObject && originalObject[optValKey]
            ? originalObject[optValKey].split(",")
            : [],
      };

      transformedArray.push(obj);
    }
    return transformedArray;
  };
  // calculate total price for cart checkout price
  const calculateTotalPrice = (cartData) => {
    const total = cartData.reduce((acc, product) => {
      return parseFloat(acc) + parseFloat(product.price);
    }, 0);
    return total.toFixed(2);
  };

  const handleGetVariData = (selectedVarient, VarientData) => {
    // console.log(selectedVarient)
    // console.log(VarientData)
    const foundItem =
      VarientData &&
      VarientData.find((item) => {
        return item.variant === selectedVarient;
      });
    // console.log(foundItem)
    return foundItem;
  };

  const isNumber = (fieldValue, fieldName, updatedErrors) => {
    if (fieldValue === "") {
      updatedErrors[fieldName] = "This field is required";
    } else if (emoji.test(fieldValue)) {
      updatedErrors[fieldName] = "Emoji not allowed";
    } else if (!Space.test(fieldValue)) {
      updatedErrors[fieldName] = "Space is not allow";
    } else if (!Numberval.test(fieldValue)) {
      updatedErrors[fieldName] = "Only Numbers Allowed";
    } else {
      updatedErrors[fieldName] = "";
    }
    return updatedErrors;
  };

  const isText = (fieldValue, fieldName, updatedErrors) => {
    if (fieldValue === "") {
      updatedErrors[fieldName] = "Please enter" + fieldName + " field ";
    } else if (emoji.test(fieldValue)) {
      updatedErrors[fieldName] = "Emoji not allowed";
    } else if (!Space.test(fieldValue)) {
      updatedErrors[fieldName] = "Space is not allow";
    } else if (!Nameval.test(fieldValue)) {
      updatedErrors[fieldName] = "Only contain alphabet";
    } else {
      updatedErrors[fieldName] = "";
    }
  };

  const validateRadioBtn = (value, updatedErrors) => {
    if (value === "") {
      updatedErrors.role = "Please Select one option";
    } else {
      updatedErrors.role = "";
    }
    return updatedErrors;
  };

  const validateDropdown = (fieldValue, fieldName, updatedErrors) => {
    if (fieldValue === "") {
      updatedErrors[fieldName] = "This field is required";
    } else {
      updatedErrors[fieldName] = "";
    }
    return updatedErrors;
  };

  // product page add varient form validation

  const validatTitle = (value, updateError) => {
    if (value === "") {
      updateError.title = "This Field is Required";
    } else if (emoji.test(value)) {
      updateError.title = "Emoji not allowed";
    } else {
      updateError.title = "";
    }
    return updateError;
  };

  const validatDescription = (value, updateError) => {
    console.log(value?.length);
    if (value === "") {
      updateError.description = "This Field is Required";
    } else if (emoji.test(value)) {
      updateError.description = "Emoji not allowed";
    }
    //  else if (+value?.length <= 20) {
    //   updateError.description =
    //     "description must contain more than 20 character";
    // }
    else {
      updateError.description = "";
    }
    return updateError;
  };

  const checkLength = (fieldname, value, updateError) => {
    if (!value?.length) {
      updateError[fieldname] = "select option";
    } else if (value?.length > 0) {
      updateError[fieldname] = "";
    }
    return updateError;
  };

  const addVarientFormValidation = (fieldName, value, index, updateError) => {
    const updatedFormValue = [...updateError.formValue];
    if (value === "") {
      updateError["formValue"][index][fieldName] = "This Field is Required";
    } else {
      updateError["formValue"][index][fieldName] = "";
    }
    console.log("updatedFormValue", updatedFormValue, updateError);
    return {
      ...updateError,
      formValue: updatedFormValue,
    };
  };

  return {
    handleGetVariData,
    filterVarientDataFromCart,
    calculateTotalPrice,
    formatDate,
    updateProductFromCart,
    removeProductFromCart,
    filterCartData,
    varientTransformer,
    filterProductData,
    isValidJSON,
    isDecodedData,
    getProductQuantity,
    UpdateQuantity,
    checkInCart,
    AddtoCart,
    validateEmail,
    validatePassword,
    validateOldPassword,
    validatePhoneNumber,
    validateConfrimPassword,
    validateFirstName,
    validateLastName,
    validateStreetAddress,
    validateZipCode,
    validateCity,
    validateState,
    validateApartment,
    validateIDproof,
    validateExpiredate,
    validateDOB,
    validateImageProof,
    convertToIndianTime,
    percentOffItem,
    validatePinNumber,
    validateWages,
    Address_line_1,
    isNumber,
    isText,
    validateRadioBtn,
    validateDropdown,
    validatTitle,
    validatDescription,
    checkLength,
    addVarientFormValidation,
  };
};

export default Validation;
