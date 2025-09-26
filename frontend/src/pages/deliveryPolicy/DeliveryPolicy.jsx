
import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios for API calls
import Cookies from "js-cookie";
import BasicLoader from "../../components/loader/BasicLoader";
import { toast } from "react-toastify";
import Navbar from '../../components/navbar/Navbar'
import Footer from '../../components/footer/Footer'

const DeliveryPolicy = () => {
    const [isLoading, setIsLoading] = useState(true)
    
    // Initial policy data
    const [policySections, setPolicySections] = useState([null, null, null]);
    const [policyTitle, setPolicyTitle] = useState(null); // Title of the policy

   

    useEffect(() => {
        let loaderTimeout;
        // Set the loader to be shown if data takes more than 200ms
        loaderTimeout = setTimeout(() => {
            setIsLoading(true);
        }, 200);

        axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/get-page`, {
            params: { page: "deliveryPolicy" },
        }).then((feedback) => {
            setIsLoading(false);
            console.group(feedback)
            if (feedback.data.code === "success") {
                setPolicyTitle(feedback.data.data.title);
                setPolicySections([
                    feedback.data.data.firstSection,
                    feedback.data.data.secondSection,
                    feedback.data.data.thirdSection,
                    feedback.data.data.fourthSection,
                    feedback.data.data.fifthSection,
                    feedback.data.data.sixthSection,
                    feedback.data.data.seventhSection,
                    feedback.data.data.eighthSection,
                    feedback.data.data.ninthSection,
                    feedback.data.data.tenthSection,
                    feedback.data.data.eleventhSection,
                    feedback.data.data.twelfthSection,

                ]);
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
                            <p key={index}> {section} </p>
                        ))}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};


export default DeliveryPolicy;






















// import Navbar from "../../components/navbar/Navbar"
// import Footer from "../../components/footer/Footer"

// const DeliveryPolicy = () => {
//     return (
//         <div>
//             <Navbar />
//             <div className="shipping-policy-container">
//                 <div className="shipping-policy-wrapper">
//                     <p>Delivery Policy</p>
//                     <ul type="none" style={{display: "flex", flexDirection: "column", gap: "20px"}}>
//                         <li>Our delivery charges vary based on your location and the total weight of your order. The exact delivery cost will be calculated at checkout.</li>

//                         <li>We aim to process and dispatch all orders within 2-3 working days. During peak times or sales, processing may take longer.</li>

//                         <div>Delivery times depend on your location:
//                             <ul type="circle" style={{padding: "10px 15px"}}>
//                                 <li>Local deliveries (within the city): 1-3 working days</li>
//                                 <li>National deliveries: 3-7 working days</li>
//                                 <li>International deliveries: 7-21 working days</li>
//                             </ul>
//                         </div>

//                         <li>Once your order has been dispatched, you will receive a shipping confirmation email with a tracking number. You can use this to track the status of your delivery.</li>

//                         <li>We do not offer free delivery. All delivery charges will be clearly stated at checkout before you complete your purchase.</li>

//                         <li>Please ensure that the delivery address provided is accurate and complete. We are not responsible for any delays or misdeliveries due to incorrect or incomplete addresses.</li>

//                         <li>If you need to change your delivery address after placing an order, please contact us as soon as possible. Changes to the delivery address cannot be made once the order has been dispatched.</li>

//                         <li>In case of any delays or issues with delivery, please contact our customer service team for assistance. We will do our best to resolve any problems as quickly as possible.</li>

//                         <li>By placing an order with us, you agree to our delivery policy and understand the delivery times and charges applicable to your order.</li>
//                     </ul>
//                 </div>
//             </div>
//             <Footer />
//         </div>
//     );
// }

// export default DeliveryPolicy;
