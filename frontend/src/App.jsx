import { useState, useEffect } from "react"
import localforage from "localforage"
import axios from "axios"
import Home from "./pages/home/Home"
import Cart from "./pages/cart/Cart"
import Login from "./pages/login/Login"
import Identification from "./pages/identification/Identification"
import Register from "./pages/register/Register"
import SingleProduct from "./pages/singleProduct/singleProduct"
import { Route, Routes } from "react-router-dom"
import CartProvider from "./pages/cart/CartContext"
import PageNotFound from "./pages/pageNotFound/PageNotFound"
import AdminDashboard from "./pages/adminDashboard/AdminDashboard"
import PaymentSuccess from "./pages/paymentSuccess/PaymentSuccess"
import AdminLogin from "./pages/adminLogin/AdminLogin"
import VerifyEmailCode from "./pages/verifyEmailCode/VerifyEmailCode"
import ForgotPassword from "./pages/forgotPassword/ForgotPassword"
import ResetPassword from "./pages/resetPassword/ResetPassword"
import ContactUs from "./pages/contactUs/ContactUs"
import { AuthProvider } from "./components/AuthContext/AuthContext"
import CheckOut from "./pages/checkOut/CheckOut"
import { ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'
import UserAccount from "./pages/userAccount/UserAccount"
import AllProducts from "./pages/allProducts/AllProducts"
import AdminForgotPassword from "./pages/adminForgotPassword/AdminForgotPassword"
import AdminResetPassword from "./pages/adminResetPassword/AdminResetPassword"
import TrackingPage from "./pages/trackingPage/trackingPage"
import Policies from "./pages/policies/Policies"

function App() {
  
  const [loading, setLoading] = useState(true);
  const [hasVisited, setHasVisited] = useState(false);

  const maxRetries = 3;
  const retryDelay = 2000; // 2 seconds

  // Get end of today timestamp
  const getTodayExpiry = () => {
    const now = new Date();
    const expiry = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    return expiry.getTime();
  };

  useEffect(() => {
    localforage.getItem("hasVisited").then((stored) => {
      if (stored) {
        const { value, expiresAt } = stored;
        const now = Date.now();

        if (expiresAt && expiresAt > now && value === true) {
          setHasVisited(true);
          setLoading(false);
          return;
        } else {
          localforage.removeItem("hasVisited").then(() => {
            setHasVisited(false);
            setLoading(false);
          });
          return;
        }
      } else {
        setHasVisited(false);
        setLoading(false);
      }
    });
  }, []);

  useEffect(() => {
    if (loading) return;
    if (hasVisited) return;

    let retries = 0;

    const sendRequest = () => {
      axios.post(`${import.meta.env.VITE_BACKEND_URL}/update-chart-data`)
        .then((response) => {
          if (response.data.code === "success" || response.data.code === "exists") {
            const expiresAt = getTodayExpiry();
            localforage.setItem("hasVisited", { value: true, expiresAt }).then(() => {
              setHasVisited(true);
            });
          }
        })
        .catch((error) => {
          if (retries < maxRetries) {
            retries++;
            setTimeout(() => {
              sendRequest();
            }, retryDelay);
          } else {
            console.error("Failed to update chart data after retries:", error);
          }
        });
    };

    sendRequest();
  }, [loading, hasVisited]);













  // useEffect(() => {
  //   // Generate a random IP address
  //   const generateRandomIP = () => {
  //     return Array(4)
  //       .fill(0)
  //       .map(() => Math.floor(Math.random() * 256))
  //       .join('.');
  //   };
  
  //   // Send one random IP to the server
  //   const sendRandomIP = () => {
  //     const randomIP = generateRandomIP();
  //     console.log("Sending random IP:", randomIP);
  
  //     axios.post(`${import.meta.env.VITE_BACKEND_URL}/update-chart-data`, { ip: randomIP })
  //       .then(response => {
  //         console.log(response);
  //       })
  //       .catch(error => {
  //         console.error("Error sending random IP:", error);
  //       });
  //   };
  
  //   // Send immediately once
  //   sendRandomIP();
  
  //   // Then send every 3 seconds
  //   const intervalId = setInterval(sendRandomIP, 120000);
  
  //   return () => clearInterval(intervalId);
  // }, []);
  


  return (
    <>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/collections/all" element={<AllProducts />} />
            <Route path="/product/:productId" element={<SingleProduct />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/products/checkout" element={<CheckOut />} />
            <Route path="/payment-status" element={<PaymentSuccess />} />
            <Route path="/identification/" element={<Identification />} />
            <Route path="/email-verification/:token" element={<VerifyEmailCode />} />
            <Route path="/login" element={<Login />} />
            <Route path="/accounts/password/reset" element={<ForgotPassword />} />
            <Route path='/accounts/password/reset/reset-password/:token' element={<ResetPassword />} />
            <Route path="/user-account" element={<UserAccount />} />
            <Route path="/register/:token" element={<Register />} />
            <Route path="/order/tracking" element={<TrackingPage />} />
            <Route path="/pages/contact" element={<ContactUs />} />
            <Route path="/policies/:policy" element={<Policies />} />
            <Route path="/beautybykiara/admin/dashboard/eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqb2huc21pdGhAZ21haWwuY29tIjoiam9obnNtaXRoQGdtYWlsLmNvbSIsImpvaG4iOiJqb2hu" element={<AdminDashboard />} />
            <Route path="/beautybykiara/waterfall/admin/login" element={<AdminLogin />} />
            <Route path="/accounts/password/reset/admin/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaXJzdG5hbWUiOiJIZW5yeSIsImxhc3RuY" element={<AdminForgotPassword />} />
            <Route path="/admin/accounts/password/reset/reset-password/:token" element={<AdminResetPassword />} />
            <Route path="/page-not-found" element={<PageNotFound />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
          <ToastContainer />
        </CartProvider>
      </AuthProvider>
    </>
  )
}

export default App
