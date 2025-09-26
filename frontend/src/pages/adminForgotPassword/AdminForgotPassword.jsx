









import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import axios from "axios"
import Cookies from 'js-cookie'
import { useAuth } from "../../components/AuthContext/AuthContext";
import { useNavigate } from "react-router-dom";
import localforage from "localforage";


const AdminForgotPassword = () => {
    const use_auth = useAuth()
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [pageLoading, setPageLoading] = useState(true)
    const [serverError, setServerError] = useState({
        status: true,
        message: ""
    })
    const [serverSuccess, setServerSuccess] = useState('')
    const handleSubmit = async(e) => {
        setLoading(true)
        setServerError({status: false, message: ""})
        e.preventDefault()
        const feedback = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/admin-send-password-reset-link`, {
            email: email
        })
        if(feedback){
            console.log(feedback)
            setEmail('')
            setServerSuccess('')
            setLoading(false)
            if(feedback.data.code == "not-exist"){
                setServerSuccess(feedback.data.message) //setting serverSuccess is intentional although the account does not exist. the message that comes from the server would be "If Account exists, an email to reset your password has ben sent"

            }else if(feedback.data.code == "error"){
                setServerError({
                    status: true,
                    message: feedback.data.message
                })
            }else if(feedback.data.code == "success"){
                setEmail('')
                setServerSuccess(feedback.data.message)
            }
        }
    }
    useEffect(()=> {
      localforage.getItem('current_user').then((feedback) =>{
        const user = JSON.parse(feedback)
        if(user){ 
          navigate('/', {replace: true})
        }else{
          setPageLoading(false)
        }
      })
      
  
  
    }, [])
    if(pageLoading){
      return null;
    }else{
      return <div>
        <div style={{ padding: "20px", fontSize: "20px", backgroundColor: "#f4f4f4" }} className="d-md-none">
        <i className="fa-solid fa-arrow-left" onClick={() => navigate(-1)}></i>
      </div>
              <div className="forgot-password-container">
        <div className="forgot-password-card">
          <h2 style={{color: "#333", marginBottom: "10px"}}>Forgot Password?</h2>
          <p style={{color: "#666", marginBottom: "20px"}}>Enter your email address and we'll send you a link to reset your password.</p>
          {serverError.status && 
              <p className="text-danger">{serverError.message}</p>
          }
          {serverSuccess && <p className="text-success">{serverSuccess}</p>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <div style={{textAlign: "left", paddingLeft: "5px", fontSize: "14px", color: "#555"}}>
                  <label>Email Address</label>
              </div>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                required
                className="form-control mb-3 p-2"
                onChange={(e)=> setEmail(e.target.value)}
                value={email}
              />
            </div>
            <div className="d-grid">
              <button className="btn p-2" style={{background: "purple", color: "white"}} disabled={loading}>
                  {loading ? <span className="spinner-border" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </span>
                      :
                      "Send Reset Link"
                  }
              </button>
            </div>
          </form>

        </div>
      </div>
      
      </div>

    }
}
export default AdminForgotPassword