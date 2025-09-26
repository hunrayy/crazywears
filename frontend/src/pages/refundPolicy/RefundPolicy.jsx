import React, { useState, useEffect } from "react";
import BasicLoader from "../../components/loader/BasicLoader";
import axios from "axios";
import { toast } from "react-toastify";
import Navbar from '../../components/navbar/Navbar'
import Footer from '../../components/footer/Footer'

const RefundPolicy = () => {
    // State for modal visibility and content to edit
    const [isLoading, setIsLoading] = useState(true)
    
    // Initial policy data
    const [policySections, setPolicySections] = useState([null, null, null]);
    const [policyTitle, setPolicyTitle] = useState(null); // Title of the policy

    useEffect(() => {
        let loaderTimeout;
        // Set the loader to be shown if data takes more than 200ms
        // loaderTimeout = setTimeout(() => {
        //     setIsLoading(true);
        // }, 200);

        axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/get-page`, {
            params: { page: "refundPolicy" },
        }).then((feedback) => {
            // setIsLoading(false);
            console.log(feedback)
            if (feedback.data.code === "success") {
                setIsLoading(false)
                setPolicyTitle(feedback.data.data.title);
                setPolicySections([
                    feedback.data.data.firstSection,
                    feedback.data.data.secondSection,
                    feedback.data.data.thirdSection,
                    feedback.data.data.fourthSection,
                    feedback.data.data.fifthSection,
                    feedback.data.data.sixthSection,
                    feedback.data.data.seventhSection,
                    feedback.data.data.eighthSection
                ]);
            }else{
                toast.error(feedback.data.message)
            }
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
                
                    {/* {isLoading && <BasicLoader />} */}
                    {isLoading && <div style={{display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "calc(90vh - var(--marginAboveTop))"}}>
                        <BasicLoader />
                    </div>}
                    
                    {/* Title of the policy */}
                    <p>{policyTitle}</p>

                    {/* List of policy sections */}
                    <div>
                        {policySections.map((section, index) => (
                            <p
                                key={index}
                            >
                                {section}
                            </p>
                        ))}
                    </div>
                    
                </div>
            </div>
            <Footer />
        </div>
    );
};



export default RefundPolicy;





































// import Navbar from "../../components/navbar/Navbar"
// import Footer from "../../components/footer/Footer"
// import "./refundPolicy.css"
// const RefundPolicy = () => {
//     return <div>
//         <Navbar />
//         <div className="shipping-policy-container">
//             <div className="shipping-policy-wrapper">
//                 <p>Refund policy</p>
//                 <ul type="none" style={{display: "flex", flexDirection: "column", gap: "20px"}}>
//                     <li>All sales are final, and we don't offer refunds or returns as our products bespoke items and are made to order.</li>

//                     <li>However, you are entitled to a refund or exchange   - if you receive the wrong item.</li>

//                     <li>- If your order was shipped to a different address   and not what you filled out. Please contact if you’d like to change your address.</li>

//                     <li>-In case your order is delayed beyond the 10 working days processing duration during peak times, you can request a refund.</li>

//                     <li>- Please note that we cannot provide a refund if the delay is due to the courier service, as we have limited control over that situation.</li>

//                     <li>- Please note that we cannot provide a refund if the delay is due to the courier service, as we have limited control over that situation.</li>

//                     <li>- Returns and refunds are only accepted under rare circumstances, but please be aware that if you return an order that has been installed, used, lace cut, or passed 7 days since declared delivered, you will not be entitled to a refund.</li>

//                     <li>Refunds could take up to 10 working days to reflect </li>

//                     <li>
//                         <b>- By placing an order you have agreed to these terms and understand the circumstances in which you would be entitled to a refund.</b>
//                     </li>
//                 </ul>


//             </div>
//         </div>
//         <Footer />
//     </div>

// }
// export default RefundPolicy