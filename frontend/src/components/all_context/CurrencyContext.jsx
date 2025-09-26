import React, { createContext, useState , useEffect} from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useQuery } from '@tanstack/react-query';

const defaultCurrency = import.meta.env.VITE_CURRENCY_CODE;


export const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  // const [selectedCurrency, setSelectedCurrency] = useState(Cookies.get('selectedCurrency') || defaultCurrency);

  // const [selectedCurrency, setSelectedCurrency] = useState(Cookies.get('selectedCurrency'));
  const [selectedCurrency, setSelectedCurrency] = useState(null);

  
useEffect(() => {
  const storedCurrency = Cookies.get('selectedCurrency');
  console.log("Stored currency from cookies:", storedCurrency);

  if (storedCurrency) {
    setSelectedCurrency(storedCurrency);
  } else {
    console.log("No stored currency, making API call...");
    axios.get('https://ipapi.co/json/')
      .then((res) => {
        console.log("Response received:", res);
        const currency = res.data.currency || defaultCurrency;
        setSelectedCurrency(currency);

        // Set cookie to expire at end of day
        const now = new Date();
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);
        Cookies.set('selectedCurrency', currency, { expires: endOfDay });
      })
      .catch((error) => {
        console.error("Error fetching geolocation:", error);
        setSelectedCurrency(defaultCurrency);
      });
  }
}, []);






  // --- Fetch exchange rates ---
  const {
    data: exchangeData,
    isSuccess: ratesFetched,
    isError: isRateError
  } = useQuery({
    queryKey: ['exchangeRates'],
    queryFn: async () => {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/fetch-exchange-rate`);
      return response.data.rates;
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
    cacheTime: 1000 * 60 * 60, // 1 hour
  });

  // --- Fetch currency metadata (names/symbols) ---
  const {
    data: currencyData,
    isSuccess: currencyFetched,
    isError: isCurrencyError
  } = useQuery({
    queryKey: ['currencyData'],
    queryFn: async () => {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/fetch-currency-data`);
      console.log(response)
      return response.data;
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
    cacheTime: 1000 * 60 * 60, // 1 hour
  });
    console.log(currencyData)


  // --- Process currencyData into symbols, names, codes ---
  const currencySymbols = {};
  const currencyNames = {};
  const currencyCodes = {};

  if (currencyFetched) {
    currencyData.forEach(({ code, symbol, name }) => {
      currencyCodes[code] = { symbol, name };
      currencySymbols[code] = symbol;
      currencyNames[code] = name;
    });
  }

  const convertCurrency = (amount, fromCurrency = defaultCurrency, toCurrency = selectedCurrency) => {
    // console.log({amount, fromCurrency, toCurrency})
    if (!ratesFetched || !exchangeData?.[fromCurrency] || !exchangeData?.[toCurrency]) {
      console.error('Currency not supported or rates not fetched:', fromCurrency, toCurrency);
      return null;
    }
    const convertedAmount = (amount / exchangeData[fromCurrency]) * exchangeData[toCurrency];
    if (isNaN(convertedAmount)) return null;
    console.log(convertedAmount)
    // return parseFloat(convertedAmount.toFixed(2));
      // Round to the nearest whole number
    return Math.round(convertedAmount);
  };

  const handleCurrencyChange = (newCurrency) => {
    setSelectedCurrency(newCurrency);
    Cookies.set('selectedCurrency', newCurrency, { expires: 7 });
  };

  return (
    <CurrencyContext.Provider value={{
      fetchExchangeRates: () => {}, // now handled by React Query
      selectedCurrency,
      convertCurrency,
      handleCurrencyChange,
      currencySymbols,
      currencyCodes,
      currentCurrencyCode: selectedCurrency,
      currencyNames,
      ratesFetched,
      exchangeData
    }}>
      {children}
    </CurrencyContext.Provider>
  );

};










































// import React, { createContext, useState, useEffect } from 'react';
// import axios from 'axios';
// import Cookies from 'js-cookie';

// const defaultCurrency = import.meta.env.VITE_CURRENCY_CODE;
// const exchangeRates = { [import.meta.env.VITE_CURRENCY_CODE]: 1 }; // Default exchange rate with pounds (GBP) as base

// export const CurrencyContext = createContext();

// export const CurrencyProvider = ({ children }) => {
//   const [selectedCurrency, setSelectedCurrency] = useState(Cookies.get('selectedCurrency') || defaultCurrency);
//   const [rates, setRates] = useState(exchangeRates);
//   const [currencySymbols, setCurrencySymbols] = useState({});
//   const [currencyNames, setCurrencyNames] = useState({});
//   const [currencyCodes, setCurrencyCodes] = useState({});
//   const [currentCurrencyCode, setCurrentCurrencyCode] = useState(
//     Cookies.get('selectedCurrency') || defaultCurrency
//   );; // Initialize with the code for the default currency
//   const [isRatesFetched, setIsRatesFetched] = useState(false); // New state to track rates fetching

//   useEffect(() => {
//     fetchExchangeRates();
//     fetchCurrencyData();
//   }, []);

//   const fetchExchangeRates = async () => {
//     try {
//       const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/fetch-exchange-rate`);
//       console.log(response)
//       setRates(response.data.rates);
//       setIsRatesFetched(true);
//     } catch (error) {
//       console.log('Error fetching exchange rates:', error);
//     }
//   };



//   const fetchCurrencyData = async (retryCount = 3) => {
//     try {
//       const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/fetch-currency-data`);

//       const currencyArray = response.data;

//       const currencyData = {};
//       const symbols = {};
//       const names = {};

//       currencyArray.forEach(({ code, symbol, name }) => {
//         currencyData[code] = { symbol, name };
//         symbols[code] = symbol;
//         names[code] = name;
//       });

//       setCurrencyCodes(currencyData); // map of code -> { symbol, name }
//       setCurrencySymbols(symbols);    // map of code -> symbol
//       setCurrencyNames(names);        // map of code -> name

//     } catch (error) {
//       if (retryCount > 0) {
//         console.warn(`Retrying... Attempts left: ${retryCount - 1}`);
//         await new Promise(resolve => setTimeout(resolve, 1000));
//         return fetchCurrencyData(retryCount - 1);
//       } else {
//         console.error('Error fetching currency data:', error);
//         alert('Failed to fetch currency data. Please check your internet connection and try again.');
//       }
//     }
//   };
  
  

//   const convertCurrency = (amount, fromCurrency = import.meta.env.VITE_CURRENCY_CODE, toCurrency = selectedCurrency) => {
//     console.log(`from ${fromCurrency} to ${toCurrency}`)
//     if (!isRatesFetched || !rates[fromCurrency] || !rates[toCurrency]) {
//       console.error('Currency not supported or rates not fetched:', fromCurrency, toCurrency);
//       return null;
//     }
//     const convertedAmount = (amount / rates[fromCurrency]) * rates[toCurrency];
//     // console.log(typeof(convertedAmount))
//     // return isNaN(convertedAmount) ? NaN : convertedAmount.toFixed(2).toLocaleString();
//     // return isNaN(convertedAmount) ? NaN : convertedAmount.toFixed(2);
//     if (isNaN(convertedAmount)) {
//       console.warn(`Conversion failed: ${fromCurrency} → ${toCurrency}`);
//       return null; // or undefined
//     }
//     return parseFloat(convertedAmount.toFixed(2));



//   };

//   const handleCurrencyChange = (newCurrency) => {
//     setSelectedCurrency(newCurrency);
//     Cookies.set('selectedCurrency', newCurrency, { expires: 7 });
//     // Get the currency code from currencyCodes object
//     // const currentCurrencyCode = Object.keys(currencyCodes).find(code => currencyCodes[code].name === newCurrency) || newCurrency;
//     setCurrentCurrencyCode(newCurrency); // Store the currency code directlyCurrent Currency Code:', currentCurrencyCode);
//   };

//   return (
//     <CurrencyContext.Provider value={{ fetchExchangeRates, selectedCurrency, convertCurrency, handleCurrencyChange, currencySymbols, currencyCodes, currentCurrencyCode, currencyNames }}>
//       {children}
//     </CurrencyContext.Provider>
//   );
// };

