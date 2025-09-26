











import './dashboard.css'
import React, { useState, useEffect, useContext } from 'react';
import { useAuth } from "../../AuthContext/AuthContext";
import axios from 'axios';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import localforage from 'localforage';
const AdminEditProfile = ({ onClose }) => {
      // const use_auth = useAuth();
      const { user, setUser } = useAuth();
      console.log(user)
    
      const adminDetails = user.user || {};
    
      // State to store form data, including OTP
      const [formData, setFormData] = useState({
        firstname: adminDetails.firstname || '',
        lastname: adminDetails.lastname || '',
        email: adminDetails.email || '',
        previousEmail: adminDetails.email || '',
        password: '',
        otp: '' // Add OTP to form data
      });
      // State to track if OTP has been sent
      const [OtpSent, setOtpSent] = useState(false);
      const [otpLoading, setOtpLoading] = useState(false)
    
      // State to handle form validation errors
      const [errors, setErrors] = useState({});
    
      // Function to handle input changes
      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
      };
    
      // Function to validate form inputs
      const validateForm = () => {
        const newErrors = {};
        if (!formData.firstname.trim()) newErrors.firstname = "First name is required";
        if (!formData.lastname.trim()) newErrors.lastname = "Last name is required";
        if (!formData.email.trim()) newErrors.email = "Email is required";
        if (!formData.password.trim()) newErrors.password = "Password is required";
        if (!formData.otp) newErrors.otp = "OTP is required";
        if (!OtpSent) newErrors.otp = "OTP must be sent to verify email";
        return newErrors;
      };
    
      // Function to send OTP
      const sendOTP = async (e) => {
        e.preventDefault();
        setOtpLoading(true)
        const feedback = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/send-email-verification-code`, { email: formData.email, previousEmail: formData.previousEmail })
        console.log(feedback)
        if (feedback.data.code == "success") {
          setOtpLoading(false)
          const verificationCode = feedback.data.verificationCode;
          Cookies.set("_emt", verificationCode, { expires: 5 / 1440 });
          toast.success("OTP sent successfully")
          setOtpSent(true);
        } else if (feedback.data.code == "error" || feedback.data.code == "invalid-jwt") {
          setOtpLoading(false)
          toast.error(feedback.data.message)
        } else {
          setOtpLoading(false)
          toast.error("An error occured while sending OTP")
    
        }
      };
    
      // Function to handle form submission
      const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Validate form before submission
        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
          setErrors(formErrors); // Set validation errors
        } else {
          setErrors({}); // Clear errors if validation passes
    
          // Proceed with form submission
          const codeFromCookies = Cookies.get("_emt")
          const authToken = Cookies.get("authToken")
          console.log('Form data:', formData, "code from cookies: ", codeFromCookies);
          const feedback = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/admin-edit-profile`, { formData }, {
            headers: {
              Authorization: `Bearer ${authToken}`,
              codeFromCookies: codeFromCookies
            }
          })
          console.log(feedback)
          if (feedback.data.code == 'invalid-jwt' || feedback.data.code == 'error' || feedback.data.code == 'server-error') {
            toast.error(`${feedback.data.message}`)
          } else if (feedback.data.code == "success") {
            //update in database was successful, next, update data in localforage
            await localforage.setItem('current_user', JSON.stringify(feedback.data.data))
            setFormData({
              firstname: '',
              lastname: '',
              email: '',
              password: '',
              previousEmail: '',
              otp: ''
            })
            // window.location.reload()
            setUser({
              is_user_logged: true,
              user: feedback.data.data
            })
            toast.success('profile updated successfully')
            onClose();
          } else {
            toast.error("An error occured while updating profile")
          }
    
        }
      };
    return <div className="admin-profile-modal-overlay" onClick={onClose}>
        <div className="admin-profile-modal-wrapper" onClick={(e)=> e.stopPropagation()}>
            <div>
        <h1 className='text-center mb-4'>Profile Settings</h1>

        <form className="settings-form row" onSubmit={handleSubmit}>
          <div className="mb-3 col-12 col-md-6">
            <label>First name</label>
            <input
              type="text"
              name="firstname"
              value={formData.firstname}
              className={`form-control form-control-lg ${errors.firstname ? 'is-invalid' : ''}`}
              placeholder="First name"
              onChange={handleInputChange}
              style={{fontSize: "17px"}}
              required
            />
            {errors.firstname && <div className="invalid-feedback">{errors.firstname}</div>}
          </div>

          <div className="mb-3 col-12 col-md-6">
            <label>Last name</label>
            <input
              type="text"
              name="lastname"
              value={formData.lastname}
              className={`form-control form-control-lg  ${errors.lastname ? 'is-invalid' : ''}`}
              placeholder="Last name"
              onChange={handleInputChange}
              style={{fontSize: "17px"}}
              required
            />
            {errors.lastname && <div className="invalid-feedback">{errors.lastname}</div>}
          </div>

        <div className="form-group mb-4 col-12 col-md-6">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              className={`form-control form-control-lg ${errors.email ? 'is-invalid' : ''}`}
              placeholder="Email"
              onChange={handleInputChange}
              style={{fontSize: "17px"}}
              required
            />
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            
            <div style={{ display: "flex", justifyContent: "right" }}>
              {otpLoading ? "sending..." : (
                OtpSent ? (
                  <span className="badge bg-success">OTP sent</span>
                ) : (
                  <button className="btn btn-sm" style={{ background: "purple", color: "white" }} onClick={sendOTP}>
                    Click to send OTP
                  </button>
                )
              )}

            </div>
            {errors.otp && <div className="text-danger">{errors.otp}</div>}
          </div>

          <div className="mb-3 col-12 col-md-6">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              className={`form-control form-control-lg  ${errors.password ? 'is-invalid' : ''}`}
              onChange={handleInputChange}
              style={{fontSize: "17px"}}
              required
            />
            {errors.email ? <div className="invalid-feedback">{errors.email}</div>
            : <div className="text-muted small">Password won't be updated - This is just to confirm your identity.</div>
            }
          </div>

          <div className="form-group mb-4">
            <label>Enter OTP received</label>
            <input
              type="number"
              name="otp"
              value={formData.otp}
              className={`form-control form-control-lg ${errors.otp ? 'is-invalid' : ''}`}
              placeholder="Enter OTP"
              style={{fontSize: "17px"}}
              onChange={handleInputChange}
              required
            />
            {errors.otp ? <div className="invalid-feedback">{errors.otp}</div>
            :<div className="text-muted small">This is to confirm the email you input is active</div>
            }
          </div>

          <div className="d-grid">
            <button type="submit" className="btn btn-lg" style={{ backgroundColor: "purple", color: "white" }}>Update Profile</button>
          </div>

        </form>
      </div>
        </div>
    </div>
}


export default AdminEditProfile

