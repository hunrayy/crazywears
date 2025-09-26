import React, { useState, useEffect } from "react";
import Logo from "../../components/Logo/Logo";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../../components/loader/Loader";
import { useAuth } from "../../components/AuthContext/AuthContext";
import axios from "axios";

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    errors: {},
    loading: false,
  });
  const [serverErrorFeedback, setServerErrorFeedback] = useState({
    status: false,
    message: ""
  })
  const navigate = useNavigate();
  const use_auth = useAuth()

  useEffect(()=> {
    //navigate to home page if current user is loggedin
    use_auth.user.is_user_logged && navigate('/', {replace: true})

  })

  const validateForm = () => {
    const errors = {};
    // const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email) {
      errors.email = "Email is required.";
    } 
    // else if (!emailPattern.test(formData.email)) {
    //   errors.email = "Invalid email format.";
    // }

    if (!formData.password) {
      errors.password = "Password is required.";
    } 

    return errors;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
      errors: { ...formData.errors, [e.target.name]: "" }, // Clear error on change
    });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    const errors = validateForm();

    if (Object.keys(errors).length === 0) {
      // clear the form data and submit the form
      setFormData({
        email: "",
        password: "",
        errors: {},
        loading: true
      })
      setServerErrorFeedback({status: false, message: ""})
      const feedback = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/admin/login`, {email: formData.email, password: formData.password})
      console.log(feedback)
      if(feedback){
        setFormData((prev) => ({
          ...prev,
          loading: false
        }))
        if(feedback.data.code === "error"){
          setServerErrorFeedback({status: true, message: feedback.data.message})
        }else if(feedback.data.code === "success"){
          const adminDetails = feedback.data.data
          use_auth.loginUser(adminDetails)
        }
      }
    } else {
      setFormData({ ...formData, errors });
    }
  };
  // Conditionally render the login form only if the user is not logged in
  if (use_auth.user.is_user_logged) {
    return null; // Don't render anything if user is logged in, navigate will handle it
  }

  return (
    <div>
        { formData.loading && <Loader /> }
      <div style={{ padding: "20px", fontSize: "20px" }} className="d-md-none">
        <i className="fa-solid fa-arrow-left" onClick={() => navigate(-1)}></i>
      </div>
      <div className="login-page-container">
        <div className="login-page-wrapper">
          <Logo />
          <h3>Welcome Back!</h3>
          <form className="mb-1" onSubmit={handleSubmit}>
            <div style={{ padding: "30px" }}>
            {serverErrorFeedback.status && <div className="alert alert-danger">{serverErrorFeedback.message}</div>}
              <div className="form-floating">
                <input
                  type="text    "
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

              <div className="form-floating mt-3">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  className={`form-control form-control-lg ${
                    formData.errors.password ? "is-invalid" : ""
                  }`}
                  value={formData.password}
                  onChange={handleChange}
                />
                <label>Password</label>
                {formData.errors.password && (
                  <div className="invalid-feedback" style={{textAlign: "left"}}>
                    {formData.errors.password}
                  </div>
                )}
              </div>
              <div style={{textAlign: "right", marginTop: "20px"}} >
                <small><Link  to="/accounts/password/reset/admin/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaXJzdG5hbWUiOiJIZW5yeSIsImxhc3RuY" style={{textDecoration: "none", color: "purple"}}>Forgot Password?</Link></small>
                
              </div>

              <div className="d-grid">
                <button className="btn btn-lg mt-4" type="submit" style={{background: "purple", color: "white"}}>
                  <b>Login</b>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
