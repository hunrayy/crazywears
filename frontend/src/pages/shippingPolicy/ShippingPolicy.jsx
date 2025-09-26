import React, { useState, useEffect } from "react";
import axios from "axios";
import BasicLoader from '../../components/loader/BasicLoader';
import Navbar from '../../components/navbar/Navbar';
import './shippingPolicy.css';
import Footer from '../../components/footer/Footer';
import { toast } from "react-toastify";
import DOMPurify from 'dompurify';

const ShippingPolicy = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [policyContent, setPolicyContent] = useState(""); // updated to hold raw HTML string

    useEffect(() => {
        let loaderTimeout;

        axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/get-page`, {
            params: {
                page: "shippingPolicy"
            }
        }).then((response) => {
            setIsLoading(false);
            if (response.data.code === "success") {
                setPolicyContent(response.data.data); // entire HTML content
            } else {
                toast.error(response.data.message);
            }
        }).catch((err) => {
            toast.error("Failed to load shipping policy.");
        }).finally(() => {
            clearTimeout(loaderTimeout);
            setIsLoading(false);
        });
    }, []);

    return (
        <div>
            <Navbar />
            <div className="shipping-policy-container">
                <div className="shipping-policy-wrapper">
                    {isLoading ? (
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "calc(90vh - var(--marginAboveTop))" }}>
                            <BasicLoader />
                        </div>
                    ) : (
                        // Render raw HTML safely
                        <div
                            dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(policyContent),
                            }}
                        ></div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ShippingPolicy;




















// import "./shippingPolicy.css"
// import Navbar from "../../components/navbar/Navbar"
// import Footer from "../../components/footer/Footer"
// const ShippingPolicy = () => {
//     return <div>
//         <Navbar />
//         <div className="shipping-policy-container">
//             <div className="shipping-policy-wrapper">
//                 <p>Shipping policy</p>
//                 <ul type="none" style={{display: "flex", flexDirection: "column", gap: "20px"}}>
//                     <li>-International customers, please be aware of any custom duties or fees that may apply to your order upon reaching your country. We cannot be held responsible for clearing your order or paying the customs fee if any.</li>

//                     <li>-If you happen to miss your delivery, the courier usually attempts delivery for three consecutive days. If you miss these attempts, please contact us to rearrange shipping. In the event that your tracking info says "returned to sender," there may be an additional shipping fee.</li>

//                     <li>-Shipping itself is always express/next-day service. However, please keep in mind that there is a standard processing duration of 2-3 working days on average for our ready-to-ship items. For custom orders and sale orders, the processing duration is typically 4-7 working days.</li>
//                 </ul>


//             </div>
//         </div>
//         <Footer />
//     </div>
// }

// export default ShippingPolicy