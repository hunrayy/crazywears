import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';
import { CurrencyContext } from '../../components/all_context/CurrencyContext';
import { toast } from "react-toastify";
import axios from 'axios';

export const CartContext = createContext();

const CartProvider = ({ children }) => {
  const { selectedCurrency, convertCurrency } = useContext(CurrencyContext);

  const [cartProducts, setCartProducts] = useState({
    products: [],
    totalPrice: 0,
  });
  const [loading, setLoading] = useState(true);

  const lengthsOfHair = [
    `12", 12", 12"`, `14", 14", 14"`, `16", 16", 16"`, `18", 18", 18"`,
    `20", 20", 20"`, `22", 22", 22"`, `24", 24", 24"`, `26", 26", 26"`, `28", 28", 28"`,
  ];

  const calculateTotalPrice = (products) => {
    let total = 0;
    products?.forEach(product => {
      const convertedPrice = convertCurrency(product.productPrice, import.meta.env.VITE_CURRENCY_CODE, selectedCurrency);
      if (!isNaN(convertedPrice)) {
        total += parseFloat(convertedPrice) * (product.quantity || 1);
      }
    });
    return total.toFixed(2);
  };

  const initializeCartProducts = async () => {
    const storedItems = JSON.parse(localStorage.getItem('cart_items')) || [];
    if (!storedItems || storedItems.length === 0) {
      setLoading(false);
      return { products: [], totalPrice: 0, cartEmpty: true };
    }

    const arrayOfIds = storedItems.map(item => item.id);

    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/get-product-details`, {
        params: { ids: arrayOfIds }
      });

      if (response.data.code === 'success') {
        const validIds = response.data.data.map(productDetail => productDetail.id);
        const validStoredItems = storedItems.filter(item => validIds.includes(item.id));

        if (validStoredItems.length !== storedItems.length) {
          localStorage.setItem('cart_items', JSON.stringify(validStoredItems));
        }

        const mergedProducts = validStoredItems.map(storedItem => {
          const productDetail = response.data.data.find(p => p.id === storedItem.id);
          if (!productDetail) return null;

          // compute price dynamically from the variant
          const variantPrice = productDetail.productPrices
            ? JSON.parse(productDetail.productPrices).find(v => JSON.stringify(v) === JSON.stringify(storedItem.variant))?.price
            : productDetail.defaultPrice;

          const convertedPrice = Number(
            convertCurrency(variantPrice, import.meta.env.VITE_CURRENCY_CODE, selectedCurrency)
          );

          return {
            ...productDetail,
            quantity: storedItem.quantity || 1,
            variant: storedItem.variant,
            productPrice: variantPrice, // dynamic, not from localStorage
            updatedPrice: !isNaN(convertedPrice) ? convertedPrice.toLocaleString() : '0'
          };
        }).filter(Boolean);

        const totalPrice = calculateTotalPrice(mergedProducts);
        setLoading(false);

        return {
          products: mergedProducts,
          totalPrice,
          cartEmpty: mergedProducts.length === 0
        };
      } else {
        setLoading(false);
        return { products: [], totalPrice: 0, cartEmpty: true };
      }
    } catch (error) {
      setLoading(false);
      return { products: [], totalPrice: 0, cartEmpty: true };
    }
  };

  useEffect(() => {
    const fetchCartProducts = async () => {
      const result = await initializeCartProducts();
      setCartProducts(result);
    };
    fetchCartProducts();
  }, [selectedCurrency]); // If currency changes, we want to refetch the price

  const addToCart = async (product, variant) => {
    let getItems = JSON.parse(localStorage.getItem('cart_items')) || [];

    const existingIndex = getItems.findIndex(
      item => item.id === product.id && JSON.stringify(item.variant) === JSON.stringify(variant)
    );

    if (existingIndex !== -1) {
      getItems.splice(existingIndex, 1);
      toast.success("Product removed from cart");
    } else {
      // store only id, variant, quantity
      getItems.push({
        id: product.id,
        variant, // no price here!
        quantity: 1
      });
      toast.success("Product added successfully");
    }

    localStorage.setItem('cart_items', JSON.stringify(getItems));

    const result = await initializeCartProducts(); // fetch price dynamically
    setCartProducts(result);
  };

  const updateCartItemLength = (productId, newLength, lengthPrice) => {
    const storedItems = JSON.parse(localStorage.getItem("cart_items")) || [];
    const storedItem = storedItems.find(item => item.id === productId);
    if (!storedItem) return;

    storedItem.lengthPicked = newLength;

    const updatedItems = cartProducts.products.map(item =>
      item.id === productId
        ? { ...item, lengthPicked: newLength, productPrice: lengthPrice }
        : item
    );

    localStorage.setItem("cart_items", JSON.stringify(storedItems));
    setCartProducts(prev => ({ ...prev, products: updatedItems }));
    toast.success('Length of product updated in cart');
  };

  const updateCartItemQuantity = (productId, newQuantity) => {
    const storedItems = JSON.parse(localStorage.getItem("cart_items")) || [];
    const storedItem = storedItems.find(item => item.id === productId);
    if (!storedItem) return;

    storedItem.quantity = newQuantity;

    const updatedItems = cartProducts.products.map(item =>
      item.id === productId ? { ...item, quantity: newQuantity } : item
    );

    localStorage.setItem("cart_items", JSON.stringify(
      updatedItems.map(item => ({
        id: item.id,
        quantity: item.quantity,
        lengthPicked: item.lengthPicked
      }))
    ));

    setCartProducts(prev => ({
      ...prev,
      products: updatedItems,
      totalPrice: calculateTotalPrice(updatedItems)
    }));
  };

  const isAnyVariantInCart = (productId) => {
    return cartProducts.products.some(item => item.id === productId);
  };

  const calculateTotalLength = () => cartProducts?.products?.length || 0;

  // ✅ useMemo to derive cartCount and context value
  const cartCount = useMemo(() => {
    return loading ? 0 : cartProducts.products.length;
  }, [loading, cartProducts.products]);

  const cartContextValue = useMemo(() => ({
    loading,
    cartProducts,
    cartCount,
    isAnyVariantInCart,
    setCartProducts,
    addToCart,
    calculateTotalPrice,
    calculateTotalLength,
    updateCartItemLength,
    updateCartItemQuantity
  }), [
    loading,
    cartProducts,
    cartCount,
    selectedCurrency // because prices are converted
  ]);

  return (
    <CartContext.Provider value={cartContextValue}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;

































// import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';
// import { CurrencyContext } from '../../components/all_context/CurrencyContext';
// import { toast } from "react-toastify";
// import axios from 'axios';

// export const CartContext = createContext();

// const CartProvider = ({ children }) => {
//   const { selectedCurrency, convertCurrency } = useContext(CurrencyContext);

//   const [cartProducts, setCartProducts] = useState({
//     products: [],
//     totalPrice: 0,
//   });
//   const [loading, setLoading] = useState(true);

//   const lengthsOfHair = [
//     `12", 12", 12"`, `14", 14", 14"`, `16", 16", 16"`, `18", 18", 18"`,
//     `20", 20", 20"`, `22", 22", 22"`, `24", 24", 24"`, `26", 26", 26"`, `28", 28", 28"`,
//   ];

//   const calculateTotalPrice = (products) => {
//     let total = 0;
//     products?.forEach(product => {
//       const convertedPrice = convertCurrency(product.productPrice, import.meta.env.VITE_CURRENCY_CODE, selectedCurrency);
//       if (!isNaN(convertedPrice)) {
//         total += parseFloat(convertedPrice) * (product.quantity || 1);
//       }
//     });
//     return total.toFixed(2);
//   };

//   const initializeCartProducts = async () => {
//     const storedItems = JSON.parse(localStorage.getItem('cart_items')) || [];
//     if (!storedItems || storedItems.length === 0) {
//       setLoading(false);
//       return { products: [], totalPrice: 0, cartEmpty: true };
//     }

//     const arrayOfIds = storedItems.map(item => item.id);

//     try {
//       const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/get-product-details`, {
//         params: { ids: arrayOfIds }
//       });

//       if (response.data.code === 'success') {
//         const validIds = response.data.data.map(productDetail => productDetail.id);
//         const validStoredItems = storedItems.filter(item => validIds.includes(item.id));

//         if (validStoredItems.length !== storedItems.length) {
//           localStorage.setItem('cart_items', JSON.stringify(validStoredItems));
//         }

//         const mergedProducts = response.data.data.map(productDetail => {
//           const lengthPrices = [
//             productDetail.productPrice12Inches,
//             productDetail.productPrice14Inches,
//             productDetail.productPrice16Inches,
//             productDetail.productPrice18Inches,
//             productDetail.productPrice20Inches,
//             productDetail.productPrice22Inches,
//             productDetail.productPrice24Inches,
//             productDetail.productPrice26Inches,
//             productDetail.productPrice28Inches
//           ];

//           const storedItem = validStoredItems.find(item => item.id === productDetail.id);
//           const selectedLengthIndex = lengthsOfHair.indexOf(storedItem?.lengthPicked);
//           const productPrice = lengthPrices[selectedLengthIndex];

//           const convertedPrice = Number(
//             convertCurrency(productPrice, import.meta.env.VITE_CURRENCY_CODE, selectedCurrency)
//           );

//           return {
//             ...productDetail,
//             updatedPrice: !isNaN(convertedPrice) ? convertedPrice.toLocaleString() : '0',
//             quantity: storedItem?.quantity || 1,
//             lengthPicked: storedItem?.lengthPicked || '',
//             productPrice
//           };
//         });

//         const totalPrice = calculateTotalPrice(mergedProducts);
//         setLoading(false);

//         return {
//           products: mergedProducts,
//           totalPrice,
//           cartEmpty: mergedProducts.length === 0
//         };
//       } else {
//         setLoading(false);
//         return { products: [], totalPrice: 0, cartEmpty: true };
//       }
//     } catch (error) {
//       setLoading(false);
//       return { products: [], totalPrice: 0, cartEmpty: true };
//     }
//   };

//   useEffect(() => {
//     const fetchCartProducts = async () => {
//       const result = await initializeCartProducts();
//       setCartProducts(result);
//     };
//     fetchCartProducts();
//   }, [selectedCurrency]); // If currency changes, we want to refetch the price

//   const addToCart = async (product, lengthPicked) => {
//     let getItems = JSON.parse(localStorage.getItem('cart_items')) || [];
//     const productExists = getItems.some(item => item.id === product.id);

//     if (productExists) {
//       getItems = getItems.filter(item => item.id !== product.id);
//       toast.success("Product successfully removed");
//     } else {
//       getItems.push({ id: product.id, lengthPicked, quantity: 1 });
//       toast.success("Product added successfully");
//     }

//     localStorage.setItem('cart_items', JSON.stringify(getItems));
//     const result = await initializeCartProducts();
//     setCartProducts(result);
//   };

//   const updateCartItemLength = (productId, newLength, lengthPrice) => {
//     const storedItems = JSON.parse(localStorage.getItem("cart_items")) || [];
//     const storedItem = storedItems.find(item => item.id === productId);
//     if (!storedItem) return;

//     storedItem.lengthPicked = newLength;

//     const updatedItems = cartProducts.products.map(item =>
//       item.id === productId
//         ? { ...item, lengthPicked: newLength, productPrice: lengthPrice }
//         : item
//     );

//     localStorage.setItem("cart_items", JSON.stringify(storedItems));
//     setCartProducts(prev => ({ ...prev, products: updatedItems }));
//     toast.success('Length of product updated in cart');
//   };

//   const updateCartItemQuantity = (productId, newQuantity) => {
//     const storedItems = JSON.parse(localStorage.getItem("cart_items")) || [];
//     const storedItem = storedItems.find(item => item.id === productId);
//     if (!storedItem) return;

//     storedItem.quantity = newQuantity;

//     const updatedItems = cartProducts.products.map(item =>
//       item.id === productId ? { ...item, quantity: newQuantity } : item
//     );

//     localStorage.setItem("cart_items", JSON.stringify(
//       updatedItems.map(item => ({
//         id: item.id,
//         quantity: item.quantity,
//         lengthPicked: item.lengthPicked
//       }))
//     ));

//     setCartProducts(prev => ({
//       ...prev,
//       products: updatedItems,
//       totalPrice: calculateTotalPrice(updatedItems)
//     }));
//   };

//   const calculateTotalLength = () => cartProducts?.products?.length || 0;

//   // ✅ useMemo to derive cartCount and context value
//   const cartCount = useMemo(() => {
//     return loading ? 0 : cartProducts.products.length;
//   }, [loading, cartProducts.products]);

//   const cartContextValue = useMemo(() => ({
//     loading,
//     cartProducts,
//     cartCount,
//     setCartProducts,
//     addToCart,
//     calculateTotalPrice,
//     calculateTotalLength,
//     updateCartItemLength,
//     updateCartItemQuantity
//   }), [
//     loading,
//     cartProducts,
//     cartCount,
//     selectedCurrency // because prices are converted
//   ]);

//   return (
//     <CartContext.Provider value={cartContextValue}>
//       {children}
//     </CartContext.Provider>
//   );
// };

// export default CartProvider;



























// import React, { createContext, useState, useEffect, useContext } from 'react';
// import { CurrencyContext } from '../../components/all_context/CurrencyContext';
// import { toast } from "react-toastify";
// import axios from 'axios';

// export const CartContext = createContext();

// const CartProvider = ({ children }) => {
//   const { selectedCurrency, convertCurrency } = useContext(CurrencyContext);

//   const [cartProducts, setCartProducts] = useState({
//     products: [],
//     totalPrice: 0,
//   });
//   // const [cartCount, setCartCount] = useState(0);
//   const [loading, setLoading] = useState(true);

//   const lengthsOfHair = [
//     `12", 12", 12"`, `14", 14", 14"`, `16", 16", 16"`, `18", 18", 18"`,
//     `20", 20", 20"`, `22", 22", 22"`, `24", 24", 24"`, `26", 26", 26"`, `28", 28", 28"`,
//   ];

//   const calculateTotalPrice = (products) => {
//     let total = 0;
//     products?.forEach(product => {
//       const convertedPrice = convertCurrency(product.productPrice, import.meta.env.VITE_CURRENCY_CODE, selectedCurrency);
//       if (!isNaN(convertedPrice)) {
//         total += parseFloat(convertedPrice) * (product.quantity || 1);
//       }
//     });
//     return total.toFixed(2);
//   };

//   const initializeCartProducts = async () => {
//     const storedItems = JSON.parse(localStorage.getItem('cart_items')) || [];
//     if (!storedItems || storedItems.length === 0) {
//       setLoading(false);
//       return { products: [], totalPrice: 0, cartEmpty: true };
//     }

//     const arrayOfIds = storedItems.map(item => item.id);

//     try {
//       const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/get-product-details`, {
//         params: { ids: arrayOfIds }
//       });

//       if (response.data.code === 'success') {
//         const validIds = response.data.data.map(productDetail => productDetail.id);
//         const validStoredItems = storedItems.filter(item => validIds.includes(item.id));

//         if (validStoredItems.length !== storedItems.length) {
//           localStorage.setItem('cart_items', JSON.stringify(validStoredItems));
//         }

//         const mergedProducts = response.data.data.map(productDetail => {
//           const lengthPrices = [
//             productDetail.productPrice12Inches,
//             productDetail.productPrice14Inches,
//             productDetail.productPrice16Inches,
//             productDetail.productPrice18Inches,
//             productDetail.productPrice20Inches,
//             productDetail.productPrice22Inches,
//             productDetail.productPrice24Inches,
//             productDetail.productPrice26Inches,
//             productDetail.productPrice28Inches
//           ];

//           const storedItem = validStoredItems.find(item => item.id === productDetail.id);
//           const selectedLengthIndex = lengthsOfHair.indexOf(storedItem?.lengthPicked);
//           const productPrice = lengthPrices[selectedLengthIndex];

//           const convertedPrice = Number(
//             convertCurrency(productPrice, import.meta.env.VITE_CURRENCY_CODE, selectedCurrency)
//           );

//           return {
//             ...productDetail,
//             updatedPrice: !isNaN(convertedPrice) ? convertedPrice.toLocaleString() : '0',
//             quantity: storedItem?.quantity || 1,
//             lengthPicked: storedItem?.lengthPicked || '',
//             productPrice
//           };
//         });

//         const totalPrice = calculateTotalPrice(mergedProducts);
//         setLoading(false);

//         return {
//           products: mergedProducts,
//           totalPrice,
//           cartEmpty: mergedProducts.length === 0
//         };
//       } else {
//         setLoading(false);
//         return { products: [], totalPrice: 0, cartEmpty: true };
//       }
//     } catch (error) {
//       setLoading(false);
//       return { products: [], totalPrice: 0, cartEmpty: true };
//     }
//   };

//   // Fetch cart products on mount
//   useEffect(() => {
//     const fetchCartProducts = async () => {
//       const result = await initializeCartProducts();
//       setCartProducts(result);
//     };
//     fetchCartProducts();
//   }, []);

//   // Recalculate total price when currency or product list changes
//   useEffect(() => {
//     const totalPrice = calculateTotalPrice(cartProducts.products);
//     setCartProducts(prev => ({ ...prev, totalPrice }));
//   }, [cartProducts.products, selectedCurrency]);
//   const addToCart = async (product, lengthPicked) => {
//     let getItems = JSON.parse(localStorage.getItem('cart_items')) || [];
//     const productExists = getItems.some(item => item.id === product.id);

//     if (productExists) {
//       getItems = getItems.filter(item => item.id !== product.id);
//       toast.success("Product successfully removed");
//     } else {
//       getItems.push({ id: product.id, lengthPicked, quantity: 1 });
//       toast.success("Product added successfully");
//     }

//     localStorage.setItem('cart_items', JSON.stringify(getItems));
//     const result = await initializeCartProducts();
//     setCartProducts(result);
//   };

//   const updateCartItemLength = (productId, newLength, lengthPrice) => {
//     const storedItems = JSON.parse(localStorage.getItem("cart_items")) || [];
//     const storedItem = storedItems.find(item => item.id === productId);
//     if (!storedItem) return;

//     storedItem.lengthPicked = newLength;

//     const updatedItems = cartProducts.products.map(item =>
//       item.id === productId
//         ? { ...item, lengthPicked: newLength, productPrice: lengthPrice }
//         : item
//     );

//     localStorage.setItem("cart_items", JSON.stringify(storedItems));
//     setCartProducts(prev => ({ ...prev, products: updatedItems }));
//     toast.success('Length of product updated in cart');
//   };

//   const updateCartItemQuantity = (productId, newQuantity) => {
//     const storedItems = JSON.parse(localStorage.getItem("cart_items")) || [];
//     const storedItem = storedItems.find(item => item.id === productId);
//     if (!storedItem) return;

//     storedItem.quantity = newQuantity;

//     const updatedItems = cartProducts.products.map(item =>
//       item.id === productId ? { ...item, quantity: newQuantity } : item
//     );

//     localStorage.setItem("cart_items", JSON.stringify(
//       updatedItems.map(item => ({
//         id: item.id,
//         quantity: item.quantity,
//         lengthPicked: item.lengthPicked
//       }))
//     ));

//     setCartProducts(prev => ({
//       ...prev,
//       products: updatedItems,
//       totalPrice: calculateTotalPrice(updatedItems)
//     }));
//   };

//   const calculateTotalLength = () => {
//     return cartProducts?.products?.length || 0;
//   };

//   return (
//     <CartContext.Provider
//       value={{
//         loading,
//         cartProducts,
//         cartCount: loading ? null : cartProducts.products.length,
//         setCartProducts,
//         addToCart,
//         calculateTotalPrice,
//         calculateTotalLength,
//         updateCartItemLength,
//         updateCartItemQuantity
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// };

// export default CartProvider;






















// import React, { createContext, useState, useEffect, useContext } from 'react';
// import { CurrencyContext } from '../../components/all_context/CurrencyContext';
// import { toast } from "react-toastify";
// import axios from 'axios';

// export const CartContext = createContext();

// const CartProvider = ({ children }) => {
//   const { fetchExchangeRates, selectedCurrency, convertCurrency } = useContext(CurrencyContext);

//   const [cartProducts, setCartProducts] = useState({
//     products: [],
//     totalPrice: 0,
//   });
//   const [loading, setLoading] = useState(true); // Add loading state

//   const lengthsOfHair = [
//     `12", 12", 12"`,
//     `14", 14", 14"`,
//     `16", 16", 16"`,
//     `18", 18", 18"`,
//     `20", 20", 20"`,
//     `22", 22", 22"`,
//     `24", 24", 24"`,
//     `26", 26", 26"`,
//     `28", 28", 28"`,
//   ];

//   const calculateTotalPrice = (products) => {
//     let total = 0;
//     products?.forEach(product => {
//       const convertedPrice = convertCurrency(product.price, import.meta.env.VITE_CURRENCY_CODE, selectedCurrency);
//       if (!isNaN(convertedPrice)) {
//         total += parseFloat(convertedPrice);
//       }
//     });
//     return total.toFixed(2);
//   };

//   const initializeCartProducts = async () => {
//     const storedItems = JSON.parse(localStorage.getItem('cart_items')) || [];
//     const arrayOfIds = storedItems.map(item => item.id);

//     if (arrayOfIds.length === 0 || !storedItems) {
//       setLoading(false); // Stop loading if no items
//       return {
//         products: [],
//         totalPrice: 0,
//         cartEmpty: true
//       };
//     }

//     try {
//       const feedback = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/get-product-details`, {
//         params: { ids: arrayOfIds }
//       });

//       if (feedback.data.code === 'success') {
//         const validIds = feedback.data.data.map(productDetail => productDetail.id);
//         const validStoredItems = storedItems.filter(item => validIds.includes(item.id));

//         if (validStoredItems.length !== storedItems.length) {
//           localStorage.setItem('cart_items', JSON.stringify(validStoredItems));
//         }

//         const mergedProducts = feedback.data.data.map(productDetail => {
//           console.log(productDetail)
//           const lengthPrices = [productDetail.productPrice12Inches, productDetail.productPrice14Inches, productDetail.productPrice16Inches,
//             productDetail.productPrice18Inches, productDetail.productPrice20Inches, productDetail.productPrice22Inches,
//             productDetail.productPrice24Inches, productDetail.productPrice26Inches, productDetail.productPrice28Inches
//           ]
//           // console.log(lengthPrices)
          
//           const storedItem = storedItems.find(item => item.id === productDetail.id);
//           const selectedLengthIndex = lengthsOfHair.indexOf(storedItem?.lengthPicked);
//           // console.log(selectedLengthIndex)

//           const productPrice = lengthPrices[selectedLengthIndex]
//           let convertedPrice = convertCurrency(productDetail.productPrice, import.meta.env.VITE_CURRENCY_CODE, selectedCurrency);
//           convertedPrice = Number(convertedPrice);
//           return {
//             ...productDetail,
//             updatedPrice: convertedPrice.toLocaleString(),
//             quantity: storedItem?.quantity || 1,
//             lengthPicked: storedItem?.lengthPicked || '',
//             productPrice: productPrice
//           };
//         });

//         const totalPrice = calculateTotalPrice(mergedProducts);
//         setLoading(false); // Set loading to false once data is ready
//         return {
//           products: mergedProducts,
//           totalPrice: totalPrice,
//           cartEmpty: false
//         };
//       } else {
//         setLoading(false); // Set loading to false even if there's an error
//         return {
//           products: [],
//           totalPrice: 0,
//           cartEmpty: true
//         };
//       }
//     } catch (error) {
//       setLoading(false);
//       return {
//         products: [],
//         totalPrice: 0,
//         cartEmpty: true
//       };
//     }
//   };

//   useEffect(() => {
//     const fetchCartProducts = async () => {
//       const products = await initializeCartProducts();
//       setCartProducts(products);
//     };
//     fetchCartProducts();
//   }, []);

//   useEffect(() => {
//     const totalPrice = calculateTotalPrice(cartProducts.products);
//     setCartProducts((prev) => ({
//       ...prev,
//       totalPrice
//     }));
//   }, [cartProducts.products, selectedCurrency]);

//   const addToCart = async (product, lengthPicked) => {
//     let getItems = JSON.parse(localStorage.getItem('cart_items')) || [];
//     const productExists = getItems.some(item => item.id === product.id);

//     if (productExists) {
//       getItems = getItems.filter(item => item.id !== product.id);
//       const products = await initializeCartProducts();
//       setCartProducts(products);
//       toast.success("Product successfully removed");
//     } else {
//       getItems.push({
//         id: product.id,
//         lengthPicked: lengthPicked,
//         quantity: 1
//       });
//       const products = await initializeCartProducts();
//       setCartProducts(products);
//       toast.success("Product added successfully");
//     }

//     localStorage.setItem('cart_items', JSON.stringify(getItems));
//     const products = await initializeCartProducts();
//     setCartProducts(products);
//   };

//   const updateCartItemLength = (productId, newLength, lengthPrice) => {
//     const storedItems = JSON.parse(localStorage.getItem("cart_items")) || [];
//     const storedItem = storedItems.find(item => item.id === productId);

//     if (!storedItem) return;

//     storedItem.lengthPicked = newLength;

//     const updatedItems = cartProducts.products.map((item) =>
//       item.id === productId ? { ...item, lengthPicked: newLength, productPrice: lengthPrice} : item
//     );

//     toast.success('Length of product updated in cart');
//     setCartProducts((prevProducts) => ({
//       ...prevProducts,
//       products: updatedItems
//     }));

//     localStorage.setItem("cart_items", JSON.stringify(updatedItems));
//   };

//     const updateCartItemQuantity = (productId, newQuantity) => {
//     const storedItems = JSON.parse(localStorage.getItem("cart_items")) || [];
//     const storedItem = storedItems.find(item => item.id === productId);

//     if (!storedItem) return;

//     storedItem.quantity = newQuantity;

//     const updatedItems = cartProducts?.products?.map((item) =>
//       item.id === productId ? { ...item, quantity: newQuantity } : item
//     );
//     setCartProducts((prevProducts) => ({
//       ...prevProducts,
//       products: updatedItems,
//       totalPrice: calculateTotalPrice(updatedItems, selectedCurrency) // Update totalPrice here
//     }));
//     const filteredItems = updatedItems.map(item => ({
//       id: item.id,
//       quantity: item.quantity,
//       lengthPicked: item.lengthPicked
//     }));
//     localStorage.setItem("cart_items", JSON.stringify(filteredItems));
//   };

//     const calculateTotalLength = () => {
//     return cartProducts?.products?.length || 0;
//   }; 

//   return (
//     <CartContext.Provider value={{ loading, cartProducts, setCartProducts, addToCart, calculateTotalPrice, calculateTotalLength, updateCartItemLength, updateCartItemQuantity }}>
//       {children}
//     </CartContext.Provider>
//   );
// };

// export default CartProvider;























// import React, { createContext, useState, useEffect, useContext } from 'react';
// import { CurrencyContext } from '../../components/all_context/CurrencyContext';
// import {toast} from "react-toastify"
// import axios from 'axios';


// export const CartContext = createContext();

// const CartProvider = ({ children }) => {
  
//   const { fetchExchangeRates, selectedCurrency, convertCurrency } = useContext(CurrencyContext);

//   // Function to calculate total price
//   const calculateTotalPrice = (products) => {
//     console.log(products)
//     let total = 0;
  
//     products?.forEach(product => {
//       const convertedPrice = convertCurrency(product.price, import.meta.env.VITE_CURRENCY_CODE, selectedCurrency);
//       console.log(`Item ID: ${product.id}, Original Price: ${product.price}, Converted Price: ${convertedPrice}`);
//       if (isNaN(convertedPrice)) {
//         console.error(`Conversion error for item ID: ${product.id}, Converted Price: ${convertedPrice}`);
//         // Handle error or skip item
//       } else {
//         total += parseFloat(convertedPrice);
//       }
//     });
  
//     // console.log(`Total Price in ${selectedCurrency}: ${total.toFixed(2)}`);
//     return total.toFixed(2);
//   };

//   // Initialize the cartProducts state
//   const initializeCartProducts = async () => {
//     // Retrieve stored cart items (only id, lengthPicked, quantity)
//     const storedItems = JSON.parse(localStorage.getItem('cart_items')) || [];
//     const arrayOfIds = storedItems.map(item => item.id); // Extract the array of product ids

//     if (arrayOfIds.length === 0 || !storedItems) {
//       return {
//         products: [],
//         recentlyAddedProducts: [],
//         productAddedToCartAnimation: false,
//         addToCartAnimationMessage: '',
//         totalPrice: 0,
//         lengthUpdateMessage: "",
//         cartEmpty: true
//       };
//     }

//     try {
//       // Make an API call to fetch product details using the array of IDs
//       const feedback = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/get-product-details`, {
//         params: {
//           ids: arrayOfIds
//         }
//       });
//       console.log(feedback)

//       if (feedback.data.code === 'success') {
//         // Get the valid IDs from the response
//         const validIds = feedback.data.data.map(productDetail => productDetail.id);

//         // Filter out invalid items from storedItems
//         const validStoredItems = storedItems.filter(item => validIds.includes(item.id));

//         // If there are any invalid items, update localStorage
//         if (validStoredItems.length !== storedItems.length) {
//           localStorage.setItem('cart_items', JSON.stringify(validStoredItems));
//         }


//         // Merge the storedItems (which has lengthPicked and quantity) with feedback.data.data (which has the product details)
//         const mergedProducts = feedback.data.data.map(productDetail => {
//           const storedItem = storedItems.find(item => item.id === productDetail.id);
//           // const convertedPrice = convertCurrency(productDetail.productPrice, import.meta.env.VITE_CURRENCY_CODE, selectedCurrency);
//           let convertedPrice = convertCurrency(productDetail.productPrice, import.meta.env.VITE_CURRENCY_CODE, selectedCurrency);
//           convertedPrice = Number(convertedPrice);

//             return {
//               ...productDetail,
//               updatedPrice: convertedPrice.toLocaleString(),
//               quantity: storedItem?.quantity || 1, // Add the stored quantity, default to 1 if not found
//               lengthPicked: storedItem?.lengthPicked || '' // Add the stored lengthPicked
//             };
      
         
//         });

//         // Calculate the total price
//         const totalPrice = calculateTotalPrice(mergedProducts, selectedCurrency);
//         console.log('Initializing cart products with total price:', totalPrice);

//         return {
//           products: mergedProducts, // Set the merged products
//           recentlyAddedProducts: [],
//           productAddedToCartAnimation: false,
//           addToCartAnimationMessage: '',
//           totalPrice: totalPrice, // Set initial total price
//           lengthUpdateMessage: "",
//           cartEmpty: false
//         };
//       } else {
//         return {
//           products: [],
//           recentlyAddedProducts: [],
//           productAddedToCartAnimation: false,
//           addToCartAnimationMessage: '',
//           totalPrice: 0,
//           lengthUpdateMessage: "",
//           cartEmpty: false
//         };
//       }
//     } 
//     catch (error) {
//       // console.error('Error fetching product details:', error.message);
//       return {
//         products: [],
//         recentlyAddedProducts: [],
//         productAddedToCartAnimation: false,
//         addToCartAnimationMessage: '',
//         totalPrice: 0,
//         lengthUpdateMessage: "",
//         cartEmpty: false
//       };
//     }
// };

//   // State to store cart products
//   const [cartProducts, setCartProducts] = useState({
//     products: [],
//     totalPrice: 0,
//   });
//   // Fetch and set cart products on mount
//   useEffect(() => {
//     const fetchCartProducts = async () => {
//       const products = await initializeCartProducts();
//       setCartProducts(products);
//     };

//     fetchCartProducts();
//   }, []);


//   useEffect(() => {
//     // Update the total price whenever the cart products or selected currency change
//     const totalPrice = calculateTotalPrice(cartProducts.products, selectedCurrency);
//     console.log('Updating total price to:', totalPrice);
//     setCartProducts((prev) => ({
//       ...prev,
//       totalPrice
//     }));
//   }, [cartProducts.products, selectedCurrency]);

//   const addToCart = async (product, lengthPicked) => {
//     let getItems = JSON.parse(localStorage.getItem('cart_items')) || [];
//     const productExists = getItems.some(item => item.id === product.id);

//     if (productExists) {
//       getItems = getItems.filter(item => item.id !== product.id);
//       const products = await initializeCartProducts();
//       setCartProducts(products);
     
//       toast.success("Product successfully removed")
//     } else {
//       getItems.push({
//         // ...product,
//         id: product.id,
//         lengthPicked: lengthPicked,
//         quantity: 1
//       });
//       const products = await initializeCartProducts();
//       setCartProducts(products);
//       toast.success("Product added successfully")

//     }

//     localStorage.setItem('cart_items', JSON.stringify(getItems));
//     const products = await initializeCartProducts();
//     setCartProducts(products);
//     // setCartProducts((prev) => ({
//     //   ...prev,
//     //   products: getItems,
//     //   totalPrice: calculateTotalPrice(getItems, selectedCurrency) // Update totalPrice here
//     // }));
//   };

//   const updateCartItemLength = (productId, newLength, lengthPrice) => {
//     console.log(lengthPrice)
//     const storedItems = JSON.parse(localStorage.getItem("cart_items")) || [];
//     const storedItem = storedItems.find(item => item.id === productId);

//     if (!storedItem) return;

//     storedItem.lengthPicked = newLength;

//     const updatedItems = cartProducts.products.map((item) =>
//       item.id === productId ? { ...item, lengthPicked: newLength, productPrice: lengthPrice} : item
//     );

//     toast.success('Length of product updated in cart')

//     setCartProducts((prevProducts) => ({
//       ...prevProducts,
//       products: updatedItems,
//       lengthUpdateMessage: "Length of product updated in cart",
//     }));

//     setTimeout(() => {
//       setCartProducts((prevProducts) => ({
//         ...prevProducts,
//         lengthUpdateMessage: "",
//       }));
//     }, 3000);

//     localStorage.setItem("cart_items", JSON.stringify(updatedItems));
//   };

//   const updateCartItemQuantity = (productId, newQuantity) => {
//     const storedItems = JSON.parse(localStorage.getItem("cart_items")) || [];
//     const storedItem = storedItems.find(item => item.id === productId);

//     if (!storedItem) return;

//     storedItem.quantity = newQuantity;

//     const updatedItems = cartProducts?.products?.map((item) =>
//       item.id === productId ? { ...item, quantity: newQuantity } : item
//     );
//     setCartProducts((prevProducts) => ({
//       ...prevProducts,
//       products: updatedItems,
//       totalPrice: calculateTotalPrice(updatedItems, selectedCurrency) // Update totalPrice here
//     }));
//     const filteredItems = updatedItems.map(item => ({
//       id: item.id,
//       quantity: item.quantity,
//       lengthPicked: item.lengthPicked
//     }));
//     localStorage.setItem("cart_items", JSON.stringify(filteredItems));
//   };

//   const calculateTotalLength = () => {
//     return cartProducts?.products?.length || 0;
//   }; 

//   return (
//     <CartContext.Provider value={{ cartProducts, setCartProducts, addToCart, calculateTotalPrice, calculateTotalLength, updateCartItemLength, updateCartItemQuantity }}>
//       {children}
//     </CartContext.Provider>
//   );
// };

// export default CartProvider;











// import React, { createContext, useState, useEffect, useContext } from 'react';
// import { CurrencyContext } from '../../components/all_context/CurrencyContext';

// export const CartContext = createContext();

// const CartProvider = ({ children }) => {
//   const { selectedCurrency, convertCurrency } = useContext(CurrencyContext);

//   const [cartProducts, setCartProducts] = useState({
//     products: JSON.parse(localStorage.getItem('cart_items')) || [],
//     recentlyAddedProducts: [],
//     productAddedToCartAnimation: false,
//     addToCartAnimationMessage: '',
//     totalPrice: "0.00",  // Initialize as a string
//     lengthUpdateMessage: ""
//   });

//   useEffect(() => {
//     // Update the total price whenever the cart products or selected currency change
//     const totalPrice = calculateTotalPrice(cartProducts.products, selectedCurrency);
//     setCartProducts((prev) => ({
//       ...prev,
//       totalPrice
//     }));
//   }, [cartProducts.products, selectedCurrency]);

//   const addToCart = (product, lengthPicked) => {
//     let getItems = JSON.parse(localStorage.getItem('cart_items')) || [];
//     const productExists = getItems.some(item => item.id === product.id);

//     if (productExists) {
//       getItems = getItems.filter(item => item.id !== product.id);
//       setCartProducts((prevState) => ({
//         ...prevState,
//         recentlyAddedProducts: prevState.recentlyAddedProducts.filter(id => id !== product.id),
//         productAddedToCartAnimation: true,
//         addToCartAnimationMessage: "Product successfully removed"
//       }));
//     } else {
//       getItems.push({
//         ...product,
//         lengthPicked: lengthPicked,
//         quantity: 1
//       });
//       setCartProducts((prevState) => ({
//         ...prevState,
//         recentlyAddedProducts: [product.id, ...prevState.recentlyAddedProducts],
//         productAddedToCartAnimation: true,
//         addToCartAnimationMessage: <span>Product added successfully <i className="fa-sharp fa-solid fa-circle-check px-2"></i></span>
//       }));
//     }

//     setTimeout(() => {
//       setCartProducts((prevState) => ({
//         ...prevState,
//         productAddedToCartAnimation: false,
//       }));
//     }, 3000);

//     localStorage.setItem('cart_items', JSON.stringify(getItems));
//     setCartProducts((prev) => ({
//       ...prev,
//       products: getItems,
//       totalPrice: calculateTotalPrice(getItems, selectedCurrency) // Update totalPrice here
//     }));
//   };

//   const updateCartItemLength = (productId, newLength) => {
//     const storedItems = JSON.parse(localStorage.getItem("cart_items")) || [];
//     const storedItem = storedItems.find(item => item.id === productId);

//     if (!storedItem) return;

//     storedItem.lengthPicked = newLength;

//     const updatedItems = cartProducts.products.map((item) =>
//       item.id === productId ? { ...item, lengthPicked: newLength } : item
//     );

//     setCartProducts((prevProducts) => ({
//       ...prevProducts,
//       products: updatedItems,
//       lengthUpdateMessage: "Length of product updated in cart",
//     }));

//     setTimeout(() => {
//       setCartProducts((prevProducts) => ({
//         ...prevProducts,
//         lengthUpdateMessage: "",
//       }));
//     }, 3000);

//     localStorage.setItem("cart_items", JSON.stringify(updatedItems));
//   };

//   const updateCartItemQuantity = (productId, newQuantity) => {
//     const storedItems = JSON.parse(localStorage.getItem("cart_items")) || [];
//     const storedItem = storedItems.find(item => item.id === productId);

//     if (!storedItem) return;

//     storedItem.quantity = newQuantity;

//     const updatedItems = cartProducts.products.map((item) =>
//       item.id === productId ? { ...item, quantity: newQuantity } : item
//     );

//     setCartProducts((prevProducts) => ({
//       ...prevProducts,
//       products: updatedItems,
//       totalPrice: calculateTotalPrice(updatedItems, selectedCurrency) // Update totalPrice here
//     }));

//     localStorage.setItem("cart_items", JSON.stringify(updatedItems));
//   };

//   const calculateTotalPrice = (products, currency) => {
//     return products.reduce((acc, item) => {
//       const itemPrice = parseFloat(item.price);
//       if (isNaN(itemPrice)) {
//         console.error(`Invalid price for item ID: ${item.id}, Price: ${item.price}`);
//         return acc;
//       }
//       const convertedPrice = parseFloat(convertCurrency(itemPrice, import.meta.env.VITE_CURRENCY_CODE, currency));
//       if (isNaN(convertedPrice)) {
//         console.error(`Conversion error for item ID: ${item.id}, Original Price: ${item.price}, Converted Price: ${convertedPrice}`);
//         return acc;
//       }
//       console.log(`Item ID: ${item.id}, Original Price: ${item.price}, Converted Price: ${convertedPrice}, Quantity: ${item.quantity}`);
//       return acc + (convertedPrice * item.quantity);
//     }, 0).toFixed(2);
//   };

//   const calculateTotalLength = () => {
//     return cartProducts.products.length || 0;
//   };

//   return (
//     <CartContext.Provider value={{ cartProducts, addToCart, calculateTotalPrice, calculateTotalLength, updateCartItemLength, updateCartItemQuantity }}>
//       {children}
//     </CartContext.Provider>
//   );
// };

// export default CartProvider;

















// import React, { createContext, useState, useEffect, useContext } from 'react';
// import { CurrencyContext } from '../../components/all_context/CurrencyContext';

// export const CartContext = createContext();

// const CartProvider = ({ children }) => {
//   const { selectedCurrency, convertCurrency } = useContext(CurrencyContext);

//   const [cartProducts, setCartProducts] = useState({
//     products: JSON.parse(localStorage.getItem('cart_items')) || [],
//     recentlyAddedProducts: [],
//     productAddedToCartAnimation: false,
//     addToCartAnimationMessage: '',
//     totalPrice: "0.00",  // Initialize as a string
//     lengthUpdateMessage: ""
//   });

//   useEffect(() => {
//     // Update the total price whenever the cart products or selected currency change
//     const totalPrice = calculateTotalPrice(cartProducts.products, selectedCurrency);
//     setCartProducts((prev) => ({
//       ...prev,
//       totalPrice
//     }));
//   }, [cartProducts.products, selectedCurrency]);

//   const addToCart = (product, lengthPicked) => {
//     let getItems = JSON.parse(localStorage.getItem('cart_items')) || [];
//     const productExists = getItems.some(item => item.id === product.id);

//     if (productExists) {
//       getItems = getItems.filter(item => item.id !== product.id);
//       setCartProducts((prevState) => ({
//         ...prevState,
//         recentlyAddedProducts: prevState.recentlyAddedProducts.filter(id => id !== product.id),
//         productAddedToCartAnimation: true,
//         addToCartAnimationMessage: "Product successfully removed"
//       }));
//     } else {
//       getItems.push({
//         ...product,
//         lengthPicked: lengthPicked,
//         quantity: 1
//       });
//       setCartProducts((prevState) => ({
//         ...prevState,
//         recentlyAddedProducts: [product.id, ...prevState.recentlyAddedProducts],
//         productAddedToCartAnimation: true,
//         addToCartAnimationMessage: <span>Product added successfully <i className="fa-sharp fa-solid fa-circle-check px-2"></i></span>
//       }));
//     }

//     setTimeout(() => {
//       setCartProducts((prevState) => ({
//         ...prevState,
//         productAddedToCartAnimation: false,
//       }));
//     }, 3000);

//     localStorage.setItem('cart_items', JSON.stringify(getItems));
//     setCartProducts((prev) => ({
//       ...prev,
//       products: getItems,
//       totalPrice: calculateTotalPrice(getItems, selectedCurrency) // Update totalPrice here
//     }));
//   };

//   const updateCartItemLength = (productId, newLength) => {
//     const storedItems = JSON.parse(localStorage.getItem("cart_items")) || [];
//     const storedItem = storedItems.find(item => item.id === productId);

//     if (!storedItem) return;

//     storedItem.lengthPicked = newLength;

//     const updatedItems = cartProducts.products.map((item) =>
//       item.id === productId ? { ...item, lengthPicked: newLength } : item
//     );

//     setCartProducts((prevProducts) => ({
//       ...prevProducts,
//       products: updatedItems,
//       lengthUpdateMessage: "Length of product updated in cart",
//     }));

//     setTimeout(() => {
//       setCartProducts((prevProducts) => ({
//         ...prevProducts,
//         lengthUpdateMessage: "",
//       }));
//     }, 3000);

//     localStorage.setItem("cart_items", JSON.stringify(updatedItems));
//   };

//   const updateCartItemQuantity = (productId, newQuantity) => {
//     const storedItems = JSON.parse(localStorage.getItem("cart_items")) || [];
//     const storedItem = storedItems.find(item => item.id === productId);

//     if (!storedItem) return;

//     storedItem.quantity = newQuantity;

//     const updatedItems = cartProducts.products.map((item) =>
//       item.id === productId ? { ...item, quantity: newQuantity } : item
//     );

//     setCartProducts((prevProducts) => ({
//       ...prevProducts,
//       products: updatedItems,
//       totalPrice: calculateTotalPrice(updatedItems, selectedCurrency) // Update totalPrice here
//     }));

//     localStorage.setItem("cart_items", JSON.stringify(updatedItems));
//   };

//   const calculateTotalPrice = (products, currency) => {
//     return products.reduce((acc, item) => {
//       const convertedPrice = convertCurrency(item.price, currency);
//       return acc + (parseFloat(convertedPrice) * item.quantity);
//     }, 0).toFixed(2);
//   };

//   const calculateTotalLength = () => {
//     return cartProducts.products.length || 0;
//   };

//   return (
//     <CartContext.Provider value={{ cartProducts, addToCart, calculateTotalPrice, calculateTotalLength, updateCartItemLength, updateCartItemQuantity }}>
//       {children}
//     </CartContext.Provider>
//   );
// };

// export default CartProvider;










// import React, { createContext, useState, useEffect } from 'react';

// export const CartContext = createContext();

// const CartProvider = ({ children }) => {
//   const [cartProducts, setCartProducts] = useState({
//     products: JSON.parse(localStorage.getItem('cart_items')) || [],
//     recentlyAddedProducts: [],
//     productAddedToCartAnimation: false,
//     addToCartAnimationMessage: '',
//     totalPrice: "0.00",  // Initialize as a string
//     lengthUpdateMessage: ""
//   });

//   useEffect(() => {
//     // Update the total price whenever the cart products change
//     const totalPrice = calculateTotalPrice(cartProducts.products);
//     setCartProducts((prev) => ({
//       ...prev,
//       totalPrice
//     }));
//   }, [cartProducts.products]);

//     const addToCart = (product, lengthPicked) => {
//         let getItems = JSON.parse(localStorage.getItem('cart_items')) || [];
//         const productExists = getItems.some(item => item.id === product.id);

//         if (productExists) {
//             getItems = getItems.filter(item => item.id !== product.id);
//             setCartProducts((prevState) => ({
//                 ...prevState,
//                 recentlyAddedProducts: prevState.recentlyAddedProducts.filter(id => id !== product.id),
//                 productAddedToCartAnimation: true,
//                 addToCartAnimationMessage: "Product successfully removed"
//             }));
//         } else {
//             getItems.push({
//                 ...product,
//                 lengthPicked: lengthPicked,
//                 quantity: 1
//             });
//             setCartProducts((prevState) => ({
//                 ...prevState,
//                 recentlyAddedProducts: [product.id, ...prevState.recentlyAddedProducts],
//                 productAddedToCartAnimation: true,
//                 addToCartAnimationMessage: <span>Product added successfully <i className="fa-sharp fa-solid fa-circle-check px-2"></i></span>
//             }));
//         }

//         setTimeout(() => {
//         setCartProducts((prevState) => ({
//             ...prevState,
//             productAddedToCartAnimation: false,
//         }));
//         }, 3000);

//         localStorage.setItem('cart_items', JSON.stringify(getItems));
//         setCartProducts((prev) => ({
//         ...prev,
//         products: getItems,
//         totalPrice: calculateTotalPrice(getItems) // Update totalPrice here
//         }));
//     };
//     const updateCartItemLength = (productId, newLength) => {
//         // Retrieve cart items from local storage
//         const storedItems = JSON.parse(localStorage.getItem("cart_items")) || [];
        
//         // Find the item in local storage
//         const storedItem = storedItems.find(item => item.id === productId);
      
//         if (!storedItem) {
//           // If item doesn't exist in local storage, do nothing
//           return;
//         }
      
//         // Update length in stored item
//         storedItem.lengthPicked = newLength;
      
//         // Update products state with updated items
//         const updatedItems = cartProducts.products.map((item) =>
//           item.id === productId ? { ...item, lengthPicked: newLength } : item
//         );
      
//         setCartProducts((prevProducts) => ({
//           ...prevProducts,
//           products: updatedItems,
//           lengthUpdateMessage: "Length of product updated in cart", // Notification message
//         }));
      
//         // Clear notification message after 3 seconds
//         setTimeout(() => {
//           setCartProducts((prevProducts) => ({
//             ...prevProducts,
//             lengthUpdateMessage: "",
//           }));
//         }, 3000);
      
//         // Save updated items to local storage
//         localStorage.setItem("cart_items", JSON.stringify(updatedItems));
//       };




//       const updateCartItemQuantity = (productId, newQuantity) => {
//         const storedItems = JSON.parse(localStorage.getItem("cart_items")) || [];
        
//         const storedItem = storedItems.find(item => item.id === productId);
      
//         if (!storedItem) {
//           return;
//         }
        
//         storedItem.quantity = newQuantity;
        
//         const updatedItems = cartProducts.products.map((item) =>
//           item.id === productId ? { ...item, quantity: newQuantity } : item
//         );
      
//         setCartProducts((prevProducts) => ({
//           ...prevProducts,
//           products: updatedItems,
//           totalPrice: calculateTotalPrice(updatedItems) // Update totalPrice here
//         }));
      
//         localStorage.setItem("cart_items", JSON.stringify(updatedItems));
//       };
      

//   const calculateTotalPrice = (products) => {
//     return products.reduce((acc, item) => acc + (parseFloat(item.price) * item.quantity), 0).toFixed(2);
//   };
//     const calculateTotalLength = (products) => {
//     return cartProducts.products.length || 0;
// };

//   return (
//     <CartContext.Provider value={{ cartProducts, addToCart, calculateTotalPrice, calculateTotalLength, updateCartItemLength, updateCartItemQuantity }}>
//       {children}
//     </CartContext.Provider>
//   );
// };

// export default CartProvider;
































// import React, { createContext, useState, useEffect } from 'react';

// // Create context
// export const CartContext = createContext();

// // CartProvider component to provide cart state and functions
// export const CartProvider = ({ children }) => {
//     const [cartProducts, setCartProducts] = useState({
//         products: [],
//         products_loading: false,
//         recentlyAddedProducts: [], // Maintain a list of recently added product IDs
//         productAddedToCartAnimation: false,
//         addToCartAnimationMessage: ""
//     });

//     // add to cart function
//     const addToCart = (product) => {
//         let getItems = JSON.parse(localStorage.getItem("cart_items")) || [];
//         const productExists = getItems.some(item => item.id === product.id);
      
//         if (productExists) {
//           // Remove product from cart
//           getItems = getItems.filter(item => item.id !== product.id);
//           setCartProducts((prevState) => ({
//             ...prevState,
//             recentlyAddedProducts: prevState.recentlyAddedProducts.filter(id => id !== product.id),
//             productAddedToCartAnimation: true,
//             addToCartAnimationMessage: "Product successfully removed"
//           }));
//         } else {
//           // Add product to cart
//           getItems.push(product);
//           setCartProducts((prevState) => ({
//             ...prevState,
//             recentlyAddedProducts: [product.id, ...prevState.recentlyAddedProducts],
//             productAddedToCartAnimation: true,
//             addToCartAnimationMessage: <span>Product added successfully <i class="fa-sharp fa-solid fa-circle-check px-2"></i></span>
//           }));
//         }
      
//         setTimeout(() => {
//           setCartProducts((prevState) => ({
//             ...prevState,
//             productAddedToCartAnimation: false,
//           }));
//         }, 3000);
      
//         // Save updated cart to localStorage
//         localStorage.setItem("cart_items", JSON.stringify(getItems));
//         setCartProducts((prev) => ({
//           ...prev,
//           products: getItems
//         })); // Update state to trigger re-render
//       };

//     const calculateTotalPrice = (products) => {
//         return cartProducts.products.reduce((acc, item) => acc + parseFloat(item.price), 0);
//     };
//     const calculateTotalLength = (products) => {
//         return cartProducts.products.length || 0;
//     };

//     useEffect(() => {
//         //get cart items
//         const storedItems = JSON.parse(localStorage.getItem('cart_items'));
//         if (storedItems) {
//             setCartProducts((prevState) => ({
//                 ...prevState,
//                 products: storedItems
//             }));
//         } else {
//             // there is nothing in the cart
//         }
//     }, []);

//     return (
//         <CartContext.Provider value={{ cartProducts, addToCart, calculateTotalPrice, calculateTotalLength }}>
//             {children}
//         </CartContext.Provider>
//     );
// };
