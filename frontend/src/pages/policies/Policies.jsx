import Navbar from "../../components/navbar/Navbar"
import Footer from "../../components/footer/Footer"
import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import BasicLoader from "../../components/loader/BasicLoader"
import { usePolicies } from "../policies/usePolicies"
import DOMPurify from 'dompurify';
import './policies.css'

const Policies = () => {
    const { policy } = useParams();
    const navigate = useNavigate();
    // const [pageKey, setPageKey] = useState("");

    // useEffect(() => {
    //     console.log(policy)
    //     const mapping = {
    //         "shipping-policy": "shippingPolicy",
    //         "delivery-policy": "deliveryPolicy",
    //         "refund-policy": "refundPolicy",
    //     };
    //     if (mapping[policy]) {
    //         setPageKey(mapping[policy]);
    //     } else {
    //         navigate('/error/page-not-found');
    //     }
    //     console.log(pageKey)
    // }, [policy]);

    // // Initialize hook even before the pageKey is set, but avoid rendering until it's ready
    // const mapping = {
    //     "shipping-policy": "shippingPolicy",
    //     "delivery-policy": "deliveryPolicy",
    //     "refund-policy": "refundPolicy",
    // };
    // const { policyContent, isLoading } = usePolicies(mapping[policy]);

    // if (!pageKey) return <div>Loading...</div>; // Return loading message until pageKey is set

    


     // Map the policy parameter to the corresponding page key
     const mapping = {
        "shipping-policy": "shippingPolicy",
        "delivery-policy": "deliveryPolicy",
        "refund-policy": "refundPolicy",
    };

    const pageKey = mapping[policy];

    // Redirect to error page if policy is not valid
    useEffect(() => {
        if (!pageKey) {
            navigate('/error/page-not-found');
        }
    }, [pageKey, navigate]);

    // Pass `pageKey` directly to the usePolicies hook
    const { policyContent, isLoading, isFetching } = usePolicies(pageKey);

    if (!pageKey) return <div>Loading...</div>; // Return loading until pageKey is set


    return (
        <div>
            <Navbar />
            <div className="policy-container">
                <div className="policy-wrapper">
                    {isLoading ? (
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "calc(90vh - var(--marginAboveTop))" }}>
                            <BasicLoader />
                        </div>
                    ) : (
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

export default Policies;
























// import Navbar from "../../components/navbar/Navbar"
// import Footer from "../../components/footer/Footer"
// import { useParams, useNavigate } from "react-router-dom"
// import { useState, useEffect } from "react"
// import BasicLoader from "../../components/loader/BasicLoader"
// import axios from "axios"
// import { toast } from "react-toastify"
// import DOMPurify from 'dompurify';
// import './policies.css'

// const Policies = () => {
//     const { policy } = useParams()
//     const navigate = useNavigate()
//     console.log(policy)
//     const [isLoading, setIsLoading] = useState(true);
//     const [policyContent, setPolicyContent] = useState(""); // updated to hold raw HTML string
    
//     const [updatedPolicy, setUpdatedPolicy] = useState("");
//     useEffect(() => {
//         if (policy === 'shipping-policy') {
//             setUpdatedPolicy("shippingPolicy");
//         } else if (policy === 'delivery-policy') {
//             setUpdatedPolicy("deliveryPolicy");
//         } else if (policy === 'refund-policy') {
//             setUpdatedPolicy("refundPolicy");
//         } else {
//             navigate('/error/page-not-found');
//         }
//     }, [policy]);

//     useEffect(() => {
//         if (!updatedPolicy) return; // Prevent empty calls

//         let loaderTimeout;
        

//         axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/get-page`, {
//             params: {
//                 page: updatedPolicy
//             }
//         }).then((response) => {
//             setIsLoading(false);
//             console.log(response)
//             if (response.data.code === "success") {
//                 setPolicyContent(response.data.data); // entire HTML content
//             } else {
//                 toast.error(response.data.message);
//             }
//         }).catch((err) => {
//             toast.error("Failed to load policy page.");
//         }).finally(() => {
//             clearTimeout(loaderTimeout);
//             setIsLoading(false);
//         });
//     }, [updatedPolicy]);

//     return (
//         <div>
//             <Navbar />
//             <div className="policy-container">
//                 <div className="policy-wrapper">
//                     {isLoading ? (
//                         <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "calc(90vh - var(--marginAboveTop))" }}>
//                             <BasicLoader />
//                         </div>
//                     ) : (
//                         // Render raw HTML safely
//                         <div
//                             dangerouslySetInnerHTML={{
//                                 __html: DOMPurify.sanitize(policyContent),
//                             }}
//                         ></div>
//                     )}
//                 </div>
//             </div>
//             <Footer />
//         </div>
//     );
// }
// export default Policies