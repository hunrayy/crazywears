// CartTotal.jsx
import React, { useContext } from 'react';
import { CartContext } from './CartContext';
import { CurrencyContext } from '../../components/all_context/CurrencyContext';

// export const calculateTotal = (cartProducts, convertCurrency, selectedCurrency) => {
//   console.log(cartProducts?.products)
//   if (!cartProducts || !Array.isArray(cartProducts.products)) {
//     return 0; // Return 0 if no products
//   }
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

//   const total = cartProducts?.products?.reduce((acc, item) => acc + item.productPrice12Inches * item.quantity, 0);
//   return convertCurrency(total, import.meta.env.VITE_CURRENCY_CODE, selectedCurrency);
// };


export const calculateTotal = (cartProducts, convertCurrency, selectedCurrency) => {
  if (!cartProducts || !Array.isArray(cartProducts.products)) {
    return 0; // Return 0 if no products
  }

  const lengthPriceMap = {
    '12", 12", 12"': 'productPrice12Inches',
    '14", 14", 14"': 'productPrice14Inches',
    '16", 16", 16"': 'productPrice16Inches',
    '18", 18", 18"': 'productPrice18Inches',
    '20", 20", 20"': 'productPrice20Inches',
    '22", 22", 22"': 'productPrice22Inches',
    '24", 24", 24"': 'productPrice24Inches',
    '26", 26", 26"': 'productPrice26Inches',
    '28", 28", 28"': 'productPrice28Inches',
  };

  const total = cartProducts.products.reduce((acc, item) => {
    const priceField = lengthPriceMap[item.lengthPicked];
    console.log(`Item length: ${item.length}, Price field: ${priceField}`);
    
    const price = item[priceField];
    if (price === undefined) {
      console.warn(`Price not found for length ${item.length}`);
    }
    
    return acc + (price || 0) * item.quantity;
  }, 0);

  console.log(`Total before conversion: ${total}`);
  return convertCurrency(total, import.meta.env.VITE_CURRENCY_CODE, selectedCurrency);
};



const CartTotal = () => {
  const { cartProducts } = useContext(CartContext);
  const { selectedCurrency, convertCurrency, currencySymbols } = useContext(CurrencyContext);

  const total = calculateTotal(cartProducts, convertCurrency, selectedCurrency); // Pass context values

  const currencySymbol = currencySymbols[selectedCurrency];
  const formattedTotal = Number(total).toLocaleString();

  return (
    <span className="mb-2">{currencySymbol} {formattedTotal}</span>
  );
};

export default CartTotal;


























// // CartTotal.jsx
// import React, { useContext } from 'react';
// import { CartContext } from './CartContext';
// import { CurrencyContext } from '../../components/all_context/CurrencyContext';

// const CartTotal = () => {
//   const { cartProducts } = useContext(CartContext);
//   const { selectedCurrency, convertCurrency, currencySymbols } = useContext(CurrencyContext);

//   if (!cartProducts || !Array.isArray(cartProducts.products)) {
//     return null; // Or display a loading state or a message
//   }

//   const total = cartProducts.products.reduce((acc, item) => acc + item.price * item.quantity, 0);
//   const convertedTotal = convertCurrency(total, import.meta.env.VITE_CURRENCY_CODE, selectedCurrency);
//   const currencySymbol = currencySymbols[selectedCurrency];
//   const formattedTotal = Number(convertedTotal).toLocaleString();
//   // console.log(typeof(formattedTotal))


//   return (
//       <span className="mb-2 fw-bold">{currencySymbol}{formattedTotal}</span>
//   );
// };

// export default CartTotal;

