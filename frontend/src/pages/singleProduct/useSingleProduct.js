import { useMemo } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const fetchProduct = async (productId) => {
  const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/get-single-product?productId=${productId}`);
  return data;
};

export const useSingleProduct = (productId) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["singleProduct", productId],
    queryFn: () => fetchProduct(productId),
    staleTime: 5 * 60 * 1000,
    enabled: !!productId,
    cacheTime: 30 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });

  const { product, lengthsOfHair, productPrices, pageNotFound } = useMemo(() => {
    if (!data || data.code !== "success") {
      return {
        product: {},
        lengthsOfHair: [],
        productPrices: [],
        pageNotFound: true,
      };
    }

    const productData = typeof data.data === "string" ? JSON.parse(data.data) : data.data;

    const lengths = [
      { label: '12", 12", 12"', price: productData.productPrice12Inches },
      { label: '14", 14", 14"', price: productData.productPrice14Inches },
      { label: '16", 16", 16"', price: productData.productPrice16Inches },
      { label: '18", 18", 18",', price: productData.productPrice18Inches },
      { label: '20", 20", 20"', price: productData.productPrice20Inches },
      { label: '22", 22", 22"', price: productData.productPrice22Inches },
      { label: '24", 24", 24"', price: productData.productPrice24Inches },
      { label: '26", 26", 26"', price: productData.productPrice26Inches },
      { label: '28", 28", 28"', price: productData.productPrice28Inches },
    ].filter(item => parseFloat(item.price) > 0);

    return {
      product: {
        id: productData.id,
        img: productData.productImage,
        subImage1: productData.subImage1 !== "null" ? productData.subImage1 : "",
        subImage2: productData.subImage2 !== "null" ? productData.subImage2 : "",
        subImage3: productData.subImage3 !== "null" ? productData.subImage3 : "",
        name: productData.productName,
        category: productData.category,
        pageNotFound: false,
      },
      lengthsOfHair: lengths.map(item => item.label),
      productPrices: lengths.map(item => item.price),
      pageNotFound: false,
    };
  }, [data]);

  return { product, lengthsOfHair, productPrices, isLoading, error, pageNotFound };
};


















// import { useState, useEffect } from "react";
// import axios from "axios";
// import { useQuery } from "@tanstack/react-query";

// const fetchProduct = async (productId) => {
//   const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/get-single-product?productId=${productId}`);
//   return data;
// };

// export const useSingleProduct = (productId) => {
//   const [lengthsOfHair, setLengthsOfHair] = useState([]);
//   const [product, setProduct] = useState({
//     id: "",
//     img: "",
//     subImage1: "",
//     subImage2: "",
//     subImage3: "",
//     name: "",
//     description: "",
//     category: "",
//     pageNotFound: false,
//   });
//   const [productPrices, setProductPrices] = useState([]);

//    const { data, isLoading, error } = useQuery({
//     queryKey: ["singleProduct", productId],
//     queryFn: () => fetchProduct(productId),
//     staleTime: 5 * 60 * 1000,
//     enabled: !!productId,
//     staleTime: 1000 * 60 * 5,
//     cacheTime: 1000 * 60 * 30,
//     refetchOnMount: false,
//     refetchOnWindowFocus: false,
//     keepPreviousData: true,
//   });
//   useEffect(() => {
//     if (!data) return;

//     if (data.code === "success") {
//       const productData = typeof data.data === "string" ? JSON.parse(data.data) : data.data;

//       const lengthsArr = [
//         parseFloat(productData.productPrice12Inches) > 0 ? '12", 12", 12"' : null,
//         parseFloat(productData.productPrice14Inches) > 0 ? '14", 14", 14"' : null,
//         parseFloat(productData.productPrice16Inches) > 0 ? '16", 16", 16"' : null,
//         parseFloat(productData.productPrice18Inches) > 0 ? '18", 18", 18"' : null,
//         parseFloat(productData.productPrice20Inches) > 0 ? '20", 20", 20"' : null,
//         parseFloat(productData.productPrice22Inches) > 0 ? '22", 22", 22"' : null,
//         parseFloat(productData.productPrice24Inches) > 0 ? '24", 24", 24"' : null,
//         parseFloat(productData.productPrice26Inches) > 0 ? '26", 26", 26"' : null,
//         parseFloat(productData.productPrice28Inches) > 0 ? '28", 28", 28"' : null,
//       ].filter(Boolean);

//       setLengthsOfHair(lengthsArr);

//       setProduct({
//         id: productData.id,
//         img: productData.productImage,
//         subImage1: productData.subImage1 !== "null" ? productData.subImage1 : "",
//         subImage2: productData.subImage2 !== "null" ? productData.subImage2 : "",
//         subImage3: productData.subImage3 !== "null" ? productData.subImage3 : "",
//         name: productData.productName,
//         category: productData.category,
//         pageNotFound: false,
//       });

//       setProductPrices(
//         [
//           parseFloat(productData.productPrice12Inches) > 0 && productData.productPrice12Inches,
//           parseFloat(productData.productPrice14Inches) > 0 && productData.productPrice14Inches,
//           parseFloat(productData.productPrice16Inches) > 0 && productData.productPrice16Inches,
//           parseFloat(productData.productPrice18Inches) > 0 && productData.productPrice18Inches,
//           parseFloat(productData.productPrice20Inches) > 0 && productData.productPrice20Inches,
//           parseFloat(productData.productPrice22Inches) > 0 && productData.productPrice22Inches,
//           parseFloat(productData.productPrice24Inches) > 0 && productData.productPrice24Inches,
//           parseFloat(productData.productPrice26Inches) > 0 && productData.productPrice26Inches,
//           parseFloat(productData.productPrice28Inches) > 0 && productData.productPrice28Inches,
//         ].filter(Boolean)
//       );
//     } else {
//       setProduct(prev => ({ ...prev, pageNotFound: true }));
//     }
//   }, [data]);

//   return { product, lengthsOfHair, productPrices, isLoading, error };
// };





























// // src/hooks/useSingleProduct.js
// import { useQuery } from '@tanstack/react-query';
// import axios from 'axios';
// import { useState, useContext } from 'react';
// import { CartContext } from '../cart/CartContext';


// const fetchSingleProduct = async (productId) => {
//   const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/get-single-product?productId=${productId}`);
//   if (response.data.code !== 'success') {
//     throw new Error('Product not found');
//   }

//   const data = typeof response.data.data === 'string'
//     ? JSON.parse(response.data.data)
//     : response.data.data;

//   const product = {
//     id: data.id,
//     img: data.productImage,
//     subImage1: data.subImage1 !== "null" && data.subImage1,
//     subImage2: data.subImage2 !== "null" && data.subImage2,
//     subImage3: data.subImage3 !== "null" && data.subImage3,
//     name: data.productName,
//     category: data.category,
//   };

//   const lengthsOfHair = [
//     parseFloat(data.productPrice12Inches) > 0 ? `12", 12", 12"` : "",
//     parseFloat(data.productPrice14Inches) > 0 ? `14", 14", 14"` : "",
//     parseFloat(data.productPrice16Inches) > 0 ? `16", 16", 16"` : "",
//     parseFloat(data.productPrice18Inches) > 0 ? `18", 18", 18"` : "",
//     parseFloat(data.productPrice20Inches) > 0 ? `20", 20", 20"` : "",
//     parseFloat(data.productPrice22Inches) > 0 ? `22", 22", 22"` : "",
//     parseFloat(data.productPrice24Inches) > 0 ? `24", 24", 24"` : "",
//     parseFloat(data.productPrice26Inches) > 0 ? `26", 26", 26"` : "",
//     parseFloat(data.productPrice28Inches) > 0 ? `28", 28", 28"` : "",
//   ].filter(Boolean);

//   const prices = [
//     parseFloat(data.productPrice12Inches) > 0 && data.productPrice12Inches,
//     parseFloat(data.productPrice14Inches) > 0 && data.productPrice14Inches,
//     parseFloat(data.productPrice16Inches) > 0 && data.productPrice16Inches,
//     parseFloat(data.productPrice18Inches) > 0 && data.productPrice18Inches,
//     parseFloat(data.productPrice20Inches) > 0 && data.productPrice20Inches,
//     parseFloat(data.productPrice22Inches) > 0 && data.productPrice22Inches,
//     parseFloat(data.productPrice24Inches) > 0 && data.productPrice24Inches,
//     parseFloat(data.productPrice26Inches) > 0 && data.productPrice26Inches,
//     parseFloat(data.productPrice28Inches) > 0 && data.productPrice28Inches,
//   ].filter(Boolean);

//   return { product, lengthsOfHair, prices };
// };

// export const useSingleProduct = (productId) => {
// const cartItems = JSON.parse(localStorage.getItem('cart_items')) || [];
// // const cartItem = cartItems.find((item) => item.id == product.id);
//   const [productPrices, setProductPrices] = useState([])

//   const query = useQuery({
//     queryKey: ['single-product', productId],
//     queryFn: () => fetchSingleProduct(productId),
//     enabled: !!productId,
//     staleTime: 1000 * 60 * 5
//   });

//   const inCart = query.data?.product
//     ? cartItems.some(item => item.id === query.data.product.id)
//     : false;

//   return {
//     ...query, // includes isLoading, error, data, etc.
//     inCart,
//     productPrices
//   };
// };


