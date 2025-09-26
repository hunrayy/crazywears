

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../components/Logo/Logo";
import axios from "axios";
import Cookies from "js-cookie";
import { useAuth } from "../../components/AuthContext/AuthContext";
import { Link } from "react-router-dom";
const Identification = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    errors: {},
    is_loading: false,
    serverFeedback: ""
  });
  const use_auth = useAuth()
  useEffect(()=> {
    //navigate to home page if current user is logged in
    use_auth.user.is_user_logged && navigate('/', {replace: true})

  })

  const validateForm = () => {
    const errors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email) {
      errors.email = "Email is required.";
    }
    //  else if (!emailPattern.test(formData.email)) {
    //   errors.email = "Invalid email format.";
    // }

    return errors;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
      errors: { ...formData.errors, [e.target.name]: "" }, // Clear error on change
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();

    if (Object.keys(errors).length === 0) {
      setFormData((prev) => ({
        ...prev,
        is_loading: true
      }));
      try {
        const feedback = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/send-email-verification-code`, { email: formData.email });
        console.log(feedback)
        if (feedback.data.code === "success") {
          const verificationCode = feedback.data.verificationCode;
          Cookies.set("_emt", verificationCode, { expires: 5 / 1440 });
          // Pass email via state and token through URL
          // navigate(`/email-verification/${feedback.data.generatedToken}`, { state: { email: formData.email } });
          navigate(`/email-verification/${feedback.data.verificationCode}`, { state: { email: formData.email } });

        } else {
          setFormData((prev) => ({
            ...prev,
            is_loading: false,
            serverFeedback: feedback.data.message
          }));
        }
      } catch (error) {
        console.error("Error sending verification code:", error);
        setFormData((prev) => ({
          ...prev,
          is_loading: false,
          serverFeedback: "An error occurred. Please try again."
        }));
      }
    } else {
      setFormData({ ...formData, errors });
    }
  };
  if(use_auth.user.is_user_logged){
    return null;
  }

  return (
    <div>
      <div style={{ padding: "20px", fontSize: "20px" }} className="d-md-none">
        <i className="fa-solid fa-arrow-left" onClick={() => navigate(-1)}></i>
      </div>
      <div className="login-page-container">
        <div className="login-page-wrapper">
          <Logo />
          <h5>Welcome to beautybykiara</h5>
          <span>Enter email to continue</span>
          <form className="mb-1" onSubmit={handleSubmit}>
            <div style={{ padding: "30px" }}>
              {formData.serverFeedback && 
                <div className={`alert alert-danger ${formData.serverFeedback && "is-invalid"}`}>
                  <small>{formData.serverFeedback}</small>
                </div>
              }
              <div className="form-floating">
                <input
                  type="text"
                  name="email"
                  placeholder="Email"
                  style={{fontSize: "16px"}}
                  className={`form-control form-control-lg ${
                    formData.errors.email ? "is-invalid" : ""
                  }`}
                  value={formData.email}
                  onChange={handleChange}
                />
                <label>Email</label>
                {formData.errors.email && (
                  <div className="invalid-feedback" style={{textAlign: "left"}}>
                    {formData.errors.email}
                  </div>
                )}
              </div>
              <div className="d-grid">
                <button className="btn btn-lg mt-4" style={{backgroundColor: "purple", color: "white"}} type="submit" disabled={formData.is_loading}>
                  {
                    formData.is_loading ? 
                      <span className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </span>
                    : <b>Continue</b>
                  }
                </button>
              </div>
            </div>
          </form>
          <div>
            <small>Already have an account? <Link to = "/login" style={{textDecoration: "none", color: "purple"}}>Login</Link></small>
          </div>
          <small style={{padding: "0 10px 0 10px"}}>By continuing you agree to beautybykiara’s Terms and Conditions</small>
        </div>
      </div>
    </div>
  );
};

export default Identification;























































// import { Link } from "react-router-dom";
// import { useState } from "react";
// import Logo from "../../components/Logo/Logo";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import Cookies from "js-cookie";

// const Identification = () => {
//   const navigate = useNavigate()
//   const [formData, setFormData] = useState({
//     email: "",
//     errors: {},
//     is_loading: false,
//     serverFeedback: ""
//   });

//   const validateForm = () => {
//     const errors = {};
//     const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).+$/;

//     if (!formData.email) {
//       errors.email = "Email is required.";
//     } else if (!emailPattern.test(formData.email)) {
//       errors.email = "Invalid email format.";
//     }

//     return errors;
//   };

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//       errors: { ...formData.errors, [e.target.name]: "" }, // Clear error on change
//     });
//   };

//   const handleSubmit = async(e) => {
//     e.preventDefault();
//     const errors = validateForm();

//     if (Object.keys(errors).length === 0) {
//       // Submit the form
//       // setFormData((prev) => ({
//       //   ...prev,
//       //   email: "",
//       //   password: "",
//       //   errors: {},
//       // }))
//       setFormData((prev) => ({
//         ...prev,
//         is_loading: true
//       }))
//       const feedback = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/send-email-verification-code`, {email: formData.email})
//       console.log(feedback)
//       if(feedback.data.code == "success"){
//         //verification code sent successfully, save the code as cookies and navigate to verify the code sent
//         const verificationCode = feedback.data.verificationCode
//         Cookies.set("_emt", verificationCode, { expires: 5 / 1440 })
//         navigate(`/email-verification/${feedback.data.email}/${feedback.data.genratedToken}`)
//       }else{
//         setFormData((prev) => ({
//           ...prev,
//           is_loading: false,
//           serverFeedback: feedback.data.message
//         }))
//       }
//     } else {
//       setFormData({ ...formData, errors });
//     }
//   };

//   return (
//     <div>
//       <div style={{ padding: "20px", fontSize: "20px" }} className="d-md-none">
//         <i className="fa-solid fa-arrow-left" onClick={() => navigate(-1)}></i>
//       </div>
//       <div className="login-page-container">
//         <div className="login-page-wrapper">
//           <Logo />
//           <h5>Welcome to beautybykiara</h5>
//           <span>Enter email to continue</span>
//           <form className="mb-1" onSubmit={handleSubmit}>
//             <div style={{ padding: "30px" }}>
//               {formData.serverFeedback && 
//                 <div className={`alert alert-danger ${formData.serverFeedback && "is-invalid"}`}><small>{formData.serverFeedback}</small></div>
//               }
//               <div className="form-floating">
//                 <input
//                   type="text    "
//                   name="email"
//                   placeholder="Email"
//                   style={{fontSize: "16px"}}
//                   className={`form-control form-control-lg ${
//                     formData.errors.email ? "is-invalid" : ""
//                   }`}
//                   value={formData.email}
//                   onChange={handleChange} 
//                 />
//                 <label>Email</label>
//                 {formData.errors.email && (
//                   <div className="invalid-feedback" style={{textAlign: "left"}}>
//                     {formData.errors.email}
//                   </div>
//                 )}
//               </div>

              

//               <div className="d-grid">
//                 <button className="btn btn-lg mt-4" style={{backgroundColor: "purple", color: "white"}} type="submit" disabled={formData.is_loading}>
//                   {
//                     formData.is_loading ? 
//                       <span class="spinner-border" role="status">
//                         <span class="visually-hidden">Loading...</span>
//                       </span>
//                     : <b>Continue</b>
//                   }
//                 </button>
//               </div>
//             </div>
//           </form>
//           <small style={{padding: "0 10px 0 10px"}}>By continuing you agree to beautybykiara’s Terms and Conditions</small>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Identification;






















// import Logo from "../../components/Logo/Logo"
// import { Link } from "react-router-dom"
// const Register = () => {
//     return <div>
// <section class="vh-100 gradient-custom-3">
//   <div class="container py-5 h-100">
//     <div class="d-flex justify-content-center align-items-center h-100">
//       <div class="col col-xl-10">
//         <div class="card" style={{borderRadius: "1rem", border: "none"}}>
//           <div class="row g-0">
//             <div class="col-md-6 col-lg-5 d-none d-md-block">
//               <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/img1.webp"
//                 alt="login form" class="img-fluid" style={{borderRadius: "1rem 0 0 1rem"}} />
//             </div>
//             <div class="col-md-6 col-lg-7 d-flex align-items-center">
//               <div class="card-body  text-black">

//                 <form>

//                   <div class="d-flex align-items-center mb-3 pb-1 ">
//                   <Link to="/" style={{textDecoration: "none"}}><Logo /></Link>
                    
//                   </div>

//                   <h3 class="fw-normal pb-3" style={{letterSpacing: "1px"}}>Register</h3>

//                   <div data-mdb-input-init class="form-outline mb-2">
//                     <label class="form-label" for="form2Example17">Email address</label>
//                     <input type="email" id="form2Example17" class="form-control form-control" />
//                   </div>
 

//                   <div class="pt-1 mb-">
//                     <button style={{backgroundColor: "purple", color: "white"}} data-mdb-button-init data-mdb-ripple-init class="btn btn-lg btn-block " type="button">continue</button>
//                   </div>
//                 </form>

//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>
// </section>


//     </div>
// }
// export default Register





















// <div data-mdb-input-init class="form-outline mb-2">
// <label class="form-label" for="form2Example17">Password</label>
// <input type="password" id="form2Example17" class="form-control form-control" />
// </div>

// <div data-mdb-input-init class="form-outline mb-2">
// <label class="form-label" for="form2Example27">Password confirm</label>
// <input type="password" id="form2Example27" class="form-control form-control" />
// </div>