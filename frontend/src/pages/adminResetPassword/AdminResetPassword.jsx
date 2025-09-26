import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import localforage from "localforage";



const AdminResetPassword = () => {
    const { token } = useParams()
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        email: "",
        newPassword: "",
        confirmPassword: "",
        passwordError: "",
        loading: false
    })
    const [serverError, setServerError] = useState({
        status: false,
        message: ''
    })
    const [serverSuccess, setServerSuccess] = useState('')

  const handlePasswordChange = (e) => {
    setFormData((prev) => ({
        ...prev,
        newPassword: e.target.value
    }))
  };

  const handleConfirmPasswordChange = (e) => {
    setFormData((prev) => ({
        ...prev,
        confirmPassword: e.target.value
    }))
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError({
        status: false,
        message: ''
    })
    // Regular expression for password validation
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;


    if(formData.newPassword.length < 6){
        setFormData((prev) => ({
            ...prev,
            passwordError: 'Length of password must be greater than 6'
        }))
    }else if (!passwordPattern.test(formData.newPassword)) {
        setFormData((prev) => ({
            ...prev,
            passwordError: 'Password must contain at least 8 characters, including uppercase, lowercase, a number, and a special character.'
        }))
    }else if (formData.newPassword !== formData.confirmPassword) {
        setFormData((prev) => ({
            ...prev,
            passwordError: 'Passwords do not match'
        }))
    } else {
        setFormData((prev) => ({
            ...prev,
            newPassword: "",
            confirmPassword: "",
            passwordError: "",
            loading: true
            
        }))
      // Handle password reset submission logic here
      const feedback = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/admin-reset-password`, {email: formData.email, newPassword: formData.newPassword}, {
        headers: {
            Authorization: `Bearer ${token}`
        }
      })
      console.log(feedback)
      if(feedback.data.code == 'error'){
        setFormData((prev) => ({
            ...prev,
            loading: false
            
        }))
        setServerError({
            status: true,
            message: feedback.data.message
        })
      }else if(feedback.data.code == "success"){
        setFormData((prev) => ({
            ...prev,
            loading: false
            
        }))
        setServerSuccess(<p>Password reset successful, you can now <Link style={{color: "purple", textDecoration: "none"}} to='/beautybykiara/admin/dashboard/eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqb2huc21pdGhAZ21haWwuY29tIjoiam9obnNtaXRoQGdtYWlsLmNvbSIsImpvaG4iOiJqb2hu'>Login</Link></p>);
      }else{
        setServerError({
            status: true,
            message: feedback.data.message
        })
      }

    }
  };

    useEffect(()=> {
        localforage.getItem('current_user').then((feedback) => {
            const user = JSON.parse(feedback)
            if(user){
                navigate('/', {replace: true})
            }
        })
        axios.post(`${import.meta.env.VITE_BACKEND_URL}/is-token-active`, {formData}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((feedback) => {
            console.log(feedback)
            if(feedback.data.code == 'success'){
                setFormData((prev) => ({
                    ...prev,
                    email: feedback.data.data.email
                }))
            }else{
                navigate('/page-not-found', {replace: "true"})
            }
        })

    }, [])

  return (
    <div className="reset-password-container">
      <div className="reset-password-card">
        <h2 style={{color: "#333", textAlign: "center"}}>Reset Your Password</h2>
        <p style={{textAlign: "center"}}>Please enter a new password to reset your account.</p>
        <p style={{textAlign: "center"}}>New password must contain at least one uppercase letter, one number and one special character($@!).</p>
        <form onSubmit={handleSubmit}>
            {serverSuccess}
            {formData.passwordError && <p className="text-danger">{formData.passwordError}</p>}
            {serverError.status && <p className="text-danger">{serverError.message}</p>}

            


            <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={formData.email}
              disabled
              placeholder="Enter new password"
              required
              className="form-control py-2 mt-1"
            />
          </div>
          <div className="form-group mt-3">
            <label htmlFor="new-password">New Password</label>
            <input
              type="password"
              id="new-password"
              value={formData.newPassword}
              onChange={handlePasswordChange}
              placeholder="Enter new password"
              required
              className="form-control py-2 mt-1"
            />
          </div>
          <div className="form-group mt-3">
            <label htmlFor="confirm-password">Confirm Password</label>
            <input
              type="password"
              id="confirm-password"
              value={formData.confirmPassword}
              onChange={handleConfirmPasswordChange}
              placeholder="Confirm new password"
              required
              className="form-control py-2 mt-1"
            />
          </div>

          <div className="d-grid">
            <button className="btn p-2 mt-4" style={{background: "purple", color: "white"}} disabled={formData.loading}>
                {
                    formData.loading ? 
                      <span className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </span>
                    : <b>Reset Password</b>
                }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminResetPassword;
