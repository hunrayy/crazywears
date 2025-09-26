// import { useState, useEffect } from 'react';
// import { useNavigate } from "react-router-dom";
// import axios from 'axios';
// import { useAuth } from '../../components/AuthContext/AuthContext';
// import "./login.css";
// import Logo from "../../components/Logo/Logo";
// import { Link } from 'react-router-dom';

// const Login = () => {
//   const navigate = useNavigate();
//   const { user, loginUser } = useAuth();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [errors, setErrors] = useState({});
//   const [serverErrorFeedback, setServerErrorFeedback] = useState({
//     status: false,
//     message: ""
//   });

//   useEffect(() => {
//     // Immediately redirect if the user is logged in
//     if (user.is_user_logged) {
//       navigate('/', { replace: true });
//     }
//   }, [user, navigate]);

//   const validateForm = () => {
//     const newErrors = {};

//     // Basic email validation
//     if (!email) {
//       newErrors.email = 'Email is required';
//     } else if (!/\S+@\S+\.\S+/.test(email)) {
//       newErrors.email = 'Invalid email format';
//     }

//     // Basic password validation
//     if (!password) {
//       newErrors.password = 'Password is required';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (validateForm()) {
//       setErrors({});
//       try {
//         const feedback = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/login`, {
//           email: email,
//           password: password
//         });
//         setEmail("");
//         setPassword("");
//         if (feedback.data.code === "error") {
//           setServerErrorFeedback({
//             status: true,
//             message: feedback.data.message
//           });
//         } else if (feedback.data.code === "success") {
//           const user = feedback.data.data;
//           loginUser(user);
//         }
//       } catch (error) {
//         console.error("Login error:", error);
//         setServerErrorFeedback({
//           status: true,
//           message: "An error occurred during login."
//         });
//       }
//     }
//   };

//   // Return null to prevent rendering of the login form if the user is already logged in
//   if (user.is_user_logged) {
//     return null;
//   }

//   return (
//     <div>
//       <div style={{ padding: "20px", fontSize: "20px" }} className="d-md-none">
//         <i className="fa-solid fa-arrow-left" onClick={() => navigate(-1)}></i>
//       </div>
//       <div className="login-page-container">
//         <div className="login-page-wrapper">
//           <Logo />
//           <h5>Welcome to beautybykiara</h5>
//           <span>Continue by logging into your account</span>
//           <form className="mb-1" onSubmit={handleSubmit}>
//             {serverErrorFeedback.status && 
//               <div className="text-danger mt-2">{serverErrorFeedback.message}</div>
//             }
//             <div style={{ padding: "20px 30px" }}>
//               <div className="form-floating">
//                 <input
//                   type="text"
//                   placeholder="Email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   style={{ fontSize: "16px" }}
//                   className={`form-control form-control-lg ${errors.email ? 'is-invalid' : ''}`}
//                 />
//                 <label>Email</label>
//                 {errors.email && <div style={{ display: "flex", justifyContent: "left", padding: "5px 10px 0 0" }} className="invalid-feedback">{errors.email}</div>}
//               </div>

//               <div className="form-floating mt-3">
//                 <input
//                   type="password"
//                   placeholder="Password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   style={{ fontSize: "16px" }}
//                   className={`form-control form-control-lg ${errors.password ? 'is-invalid' : ''}`}
//                 />
//                 <label>Password</label>
//                 {errors.password && <div style={{ display: "flex", justifyContent: "left" }} className="invalid-feedback">{errors.password}</div>}
//               </div>
              
//               <div style={{ display: "flex", justifyContent: "right", padding: "5px 10px 0 0" }}>
//                 <Link style={{ color: "purple", textDecoration: "none" }}>Forgot password?</Link>
//               </div>

//               <div className="d-grid">
//                 <button className="btn btn-lg mt-4" style={{ backgroundColor: "purple", color: "white" }} type="submit">
//                   <b>Login</b>
//                 </button>
//               </div>
//             </div>
//           </form>
//           <small style={{ padding: "0 10px 0 10px" }}>By continuing you agree to beautybykiara’s Terms and Conditions</small>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Login;














































import { useState , useEffect } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useNavigate } from "react-router-dom";
import "./login.css";
import Logo from "../../components/Logo/Logo";
import { Link } from 'react-router-dom';
import axios from 'axios';
import Loader from '../../components/loader/Loader';
// import { AuthProvider } from '../../components/AuthContext/AuthContext';
import { useAuth } from '../../components/AuthContext/AuthContext';
const Login = () => {
  const navigate = useNavigate();
  const use_auth = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false)
  const [serverErrorFeedback, setServerErrorFeedback] = useState({
    status: false,
    message: ""
  })

  useEffect(()=> {
    //navigate to home page if current user is loggedin
    use_auth.user.is_user_logged && navigate('/', {replace: true})

  })

 

  const validateForm = () => {
    const newErrors = {};

    // Basic email validation
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Invalid email format';
    }

    // Basic password validation
    if (!password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    if (validateForm()) {
      // Proceed with form submission or API call
      // console.log(email, password);
      setErrors({})
      setServerErrorFeedback({status: false, message: ""})
      setLoading(true)
      const feedback = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/login`, {
        email: email,
        password: password
      })
      setEmail("")
      setPassword("")
      console.log(feedback)
      if(feedback.data.code === "error"){
        setLoading(false)
        setServerErrorFeedback({
          status: true,
          message: feedback.data.message
        })
      }else if(feedback.data.code === "success"){
        const user = feedback.data.data
        use_auth.loginUser(user)
        
        
      }

    }
  };


    // Conditionally render the login form only if the user is not logged in
    if (use_auth.user.is_user_logged) {
      return null; // Don't render anything if user is logged in, navigate will handle it
    }



  return (
    <div>
      {loading && <Loader />}
      <div style={{ padding: "20px", fontSize: "20px" }} className="d-md-none">
        <i className="fa-solid fa-arrow-left" onClick={() => navigate(-1)}></i>
      </div>
      <div className="login-page-container">
        <div className="login-page-wrapper">
          <Logo />
          <h5>Welcome to beautybykiara</h5>
          <span>Continue by logging into your account</span>
          <form className="mb-1" onSubmit={handleSubmit}>
            {serverErrorFeedback.status && 
              <div className=" text-danger mt-2 ">{serverErrorFeedback.message}</div>
            }
            <div style={{ padding: "20px 30px" }}>
             
              <div className="form-floating">
                <input
                  type="text"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{fontSize: "16px"}}
                  className={`form-control form-control-lg ${errors.email ? 'is-invalid' : ''}`}
                />
                <label>Email</label>
                {errors.email && <div  style={{display: "flex", justifyContent: "left", padding: "5px 10px 0 0"}} className="invalid-feedback">{errors.email}</div>}
              </div>

              <div className="form-floating mt-3">
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{fontSize: "16px"}}
                  className={`form-control form-control-lg ${errors.password ? 'is-invalid' : ''}`}
                />
                <label>Password</label>
                {errors.password && <div style={{display: "flex", justifyContent: "left"}} className="invalid-feedback">{errors.password}</div>}
              </div>
              
              <div style={{display: "flex", justifyContent: "right", padding: "5px 10px 0 0"}}>
                <Link to="/accounts/password/reset" style={{color: "purple", textDecoration: "none"}}>Forgot password?</Link>
              </div>

              <div className="d-grid">
                <button className="btn btn-lg mt-4" style={{backgroundColor: "purple", color: "white"}} type="submit">
                  <b>Login</b>
                </button>
              </div>
            </div>
          </form>
          <div>
            <small>Don't have an account yet? <Link to = "/identification" style={{textDecoration: "none", color: "purple"}}>Register</Link> </small>
          </div>
          <small style={{padding: "0 10px 0 10px"}}>By continuing you agree to beautybykiara’s Terms and Conditions</small>









<div className="d-grid mt-3">
  <button 
    className="btn btn-lg" 
    style={{backgroundColor: "#4285F4", color: "white"}} 
    type="button"
    onClick={() => {
      // redirect to backend Google OAuth route
      window.location.href = `${import.meta.env.VITE_BACKEND_URL}/auth/google`;
    }}
  >
    <i className="fa-brands fa-google me-2"></i> Continue with Google
  </button>
</div>




















        </div>



























      </div>
    </div>
  );
}

export default Login;


















