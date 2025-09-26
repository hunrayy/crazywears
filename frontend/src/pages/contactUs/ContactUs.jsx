import { useState, useEffect } from "react";
import "./contactUs.css";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import axios from "axios";
import { useAuth } from "../../components/AuthContext/AuthContext";
import { useNavigate } from "react-router-dom";


const ContactUs = () => {
  const use_auth = useAuth()
  const navigate = useNavigate()

    const [formData, setFormData] = useState({
        firstname: "",
        email: "",
        comment: "",
        phone: "",
        otp: "", // Added for OTP
    });
    const [error, setError] = useState("");
    const [otpSent, setOtpSent] = useState(false); // State to track if OTP has been sent
    const [otpLoading, setOtpLoading] = useState(false)
    const [pageLoading, setPageLoading] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const [serverSuccess, setServerSuccess] = useState(false)


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSendOtp = async (e) => {
        e.preventDefault();
        // Check if all fields are filled before sending OTP
        const { firstname, email, phone } = formData;

        if (!firstname || !email || !phone) {
            toast.error("Please correct the errors in the form.");
            setError("All fields must be filled to send OTP");
            return;
        }
        setOtpLoading(true)
        setError(""); // Clear any previous error
        //make api call to send otp
        const feedback = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/send-email-verification-code`, { email: formData.email })
        console.log(feedback)
        if (feedback.data.code == "success") {
        setOtpLoading(false)
        const verificationCode = feedback.data.verificationCode;
        Cookies.set("_emt", verificationCode, { expires: 5 / 1440 });
        toast.success("OTP sent successfully")
        setOtpSent(true);
        } else if (feedback.data.code == "error") {
        setOtpLoading(false)
        toast.error(`${feedback.data.message}`)
        } else {
        setOtpLoading(false)
        toast.error("An error occured while sending OTP")

        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { firstname, email, comment, otp } = formData;

        // Validate that OTP has been sent
        if (!otpSent) {
            setError("Click the 'Send OTP' button to proceed");
            toast.error("OTP must be sent before proceeding");
            return;
        }

        // Validate all fields
        if (!firstname || !email || !comment || !otp) {
            setError("All fields are required");
            toast.error("Please correct the errors in the form.");
            return;
        }

        setIsLoading(true)
        setError(""); // Clear error if validation passes

        // Process form data (e.g., send to server or display success)
        console.log("Form submitted:", formData);
         // Proceed with form submission
        const codeFromCookies = Cookies.get("_emt")
        const authToken = Cookies.get("authToken")
        console.log('Form data:', formData, "code from cookies: ", codeFromCookies);
        const feedback = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/send-feedback`, { formData }, {
            headers: {
            Authorization: `Bearer ${authToken}`,
            codeFromCookies: codeFromCookies
            }
        })
        console.log(feedback)
        if(feedback.data.code == "invalid-jwt"){
            setIsLoading(false)
            toast.error(feedback.data.message)
        }else if(feedback.data.code == "success"){
            setIsLoading(false)
            toast.success(feedback.data.message)
            setServerSuccess(true)
        }else{
            setIsLoading(false)
            toast.error('An error occured while sending feedback')
        }
    };

    useEffect(() => {
        if (use_auth.user.is_user_logged && use_auth.user.user.is_an_admin && use_auth.user.user.user === "admin") {
            navigate(`/beautybykiara/admin/dashboard/eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqb2huc21pdGhAZ21haWwuY29tIjoiam9obnNtaXRoQGdtYWlsLmNvbSIsImpvaG4iOiJqb2hu`);
            setPageLoading(false)
        } else {
            setPageLoading(false); // Allow page to render for non-admin users
        }
      }, [use_auth.user, navigate]);

      if(pageLoading){
        return null
      }

    

    return (
        <div>
            {
                !pageLoading && <div>
                    <Navbar />
                    <div className="contact-us-container">
                        <div className="contact-us-wrapper">
                            <h1 style={{color: "black"}}><b>Contact Us</b></h1>
                            {error && <div className="text-danger ">{error}</div>}
                            {serverSuccess && 
                                <div className="d-flex">
                                    <p><i className="fa-sharp fa-solid fa-circle-check px-2 text-success"></i></p>
                                    <p><b>Thanks for contacting us. We'll get back to you as soon as possible</b></p>
                                </div>
                            }
                            <form onSubmit={handleSubmit} className="contact-form row">
                                <div className="form-group col-md-6 mt-2">
                                    <label htmlFor="firstname">First Name:</label><br />
                                    <input
                                        type="text"
                                        name="firstname"
                                        id="firstname"
                                        value={formData.firstname}
                                        onChange={handleChange}
                                        placeholder="Enter your first name"
                                        className="contact-us-form-input"
                                    />
                                </div>
                                <div className="form-group col-md-6 mt-2">
                                    <label htmlFor="email">Email:</label><br />
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Enter your email"
                                        className="contact-us-form-input"
                                    />
                                <div style={{textAlign: "right"}}>
                                    {!otpSent && !otpLoading && <button 
                                        onClick={handleSendOtp} // Handle OTP send
                                        className="btn btn-sm" 
                                        style={{ background: "black", color: "white" }}
                                    >
                                        Send OTP
                                    </button>}
                                    {otpLoading && "Sending..."}
                                    {otpSent && <span className="badge bg-success">OTP sent</span>}
                                </div>
                                </div>
                                <div className="form-group mt-3">
                                    <label htmlFor="phone">Phone number:</label><br />
                                    <input
                                        type="text" // Change type to text for phone
                                        name="phone"
                                        id="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="Enter your phone number"
                                        className="contact-us-form-input"
                                    />
                                </div>
                                <div className="form-group mt-3">
                                    <label htmlFor="comment">Comment:</label><br />
                                    <textarea
                                        name="comment"
                                        id="comment"
                                        value={formData.comment}
                                        onChange={handleChange}
                                        placeholder="Enter your comment"
                                        className="contact-us-form-input"
                                        style={{ minHeight: "90px" }}
                                    />
                                </div>
                                <div className="form-group mt-3">
                                    <label>OTP:</label><br />
                                    <input
                                        type="number"
                                        name="otp"
                                        min='1'
                                        value={formData.otp}
                                        onChange={handleChange}
                                        placeholder="Enter OTP received"
                                        className="contact-us-form-input"
                                    />
                                </div>
                                <div className="mt-3">
                                    <button type="submit" className="btn px-5 py-3" style={{ color: "white", background: "black" }} disabled={isLoading}>
                                        {isLoading ? <div className="spinner-border" role="status">
                                            <span class="visually-hidden">Loading...</span>
                                            </div>
                                        : "Submit"
                                        }
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                    <Footer />
                </div>
            }
            
        </div>
    );
};

export default ContactUs;






































// import { useState } from "react";
// import "./contactUs.css";
// import Navbar from "../../components/navbar/Navbar";
// import Footer from "../../components/footer/Footer";

// const ContactUs = () => {
//     const [formData, setFormData] = useState({
//         firstname: "",
//         email: "",
//         comment: "",
//     });
//     const [error, setError] = useState("");

//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         const { firstname, email, comment } = formData;

//         // Simple form validation
//         if (!firstname || !email || !comment) {
//             setError("All fields are required");
//             return;
//         }

//         // Email validation (simple pattern)
//         const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         if (!emailPattern.test(email)) {
//             setError("Please enter a valid email address");
//             return;
//         }

//         setError(""); // Clear error if validation passes

//         // Process form data (e.g., send to server or display success)
//         console.log("Form submitted:", formData);
//     };

//     return (
//         <div>
//             <Navbar />
//             <div className="contact-us-container">
//                 <div className="contact-us-wrapper">
//                     <h1><b>Contact Us</b></h1>
//                     {error && <div className="error-message">{error}</div>}
//                     <form onSubmit={handleSubmit} className="contact-form row">
//                         <div className="form-group col-md-6 mt-2">
//                             <label htmlFor="firstname">First Name:</label> <br />
//                             <input
//                                 type="text"
//                                 name="firstname"
//                                 id="firstname"
//                                 value={formData.firstname}
//                                 onChange={handleChange}
//                                 placeholder="Enter your first name"
//                                 className="contact-us-form-input"
//                             />
//                         </div>
//                         <div className="form-group col-md-6 mt-2">
//                             <label htmlFor="email">Email:</label><br />
//                             <input
//                                 type="email"
//                                 name="email"
//                                 id="email"
//                                 value={formData.email}
//                                 onChange={handleChange}
//                                 placeholder="Enter your email"
//                                 className="contact-us-form-input"
//                             />
//                             <div style={{textAlign: "right"}}>
//                                 <button className="btn btn-sm" style={{background: "black", color: "white"}}>Send OTP</button>

//                             </div>
//                         </div>
//                         <div className="form-group mt-3">
//                             <label htmlFor="email">Phone number:</label><br />
//                             <input
//                                 type="email"
//                                 name="email"
//                                 id="email"
//                                 value={formData.email}
//                                 onChange={handleChange}
//                                 placeholder="Enter your phone number"
//                                 className="contact-us-form-input"
//                             />
//                         </div>
//                         <div className="form-group mt-3">
//                             <label htmlFor="comment">Comment:</label><br />
//                             <textarea
//                                 name="comment"
//                                 id="comment"
//                                 value={formData.comment}
//                                 onChange={handleChange}
//                                 placeholder="Enter your comment"
//                                 className="contact-us-form-input"
//                                 style={{minHeight: "90px"}}
//                             />
//                         </div>
//                         <div className="form-group mt-3">
//                             <label>OTP:</label><br />
//                             <input
//                                 type="number"
//                                 value={formData.email}
//                                 onChange={handleChange}
//                                 placeholder="Enter OTP received"
//                                 className="contact-us-form-input"
//                             />
//                         </div>
//                         <div className="mt-3">
//                         <button type="submit" className="btn px-5 py-3" style={{color: "white", background: "black"}}>Submit</button>

//                         </div>
//                     </form>
//                 </div>
//             </div>
//             <Footer />

//         </div>
//     );
// };

// export default ContactUs;
