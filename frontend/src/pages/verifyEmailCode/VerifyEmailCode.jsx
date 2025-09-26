import React, { useRef, useState, useEffect } from "react";
import Logo from "../../components/Logo/Logo";
import "./verifyEmailCode.css";
import { Link, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const VerifyEmailCode = () => {
  const inputsRef = useRef([]);
  const [error, setError] = useState(false);
  const [seconds, setSeconds] = useState(60);
  const [resendAvailable, setResendAvailable] = useState(false);
  const [serverErrorFeedback, setServerErrorFeedback] = useState("")
  const [emailVerified, setEmailVerified] = useState(false)
  const [serverSuccessFeedback, setServerSuccessFeedback] = useState({
    success: false,
    registerToken: ""
  })
  const [isLoading, setIsLoading] = useState(false)


  const navigate = useNavigate()
  const location = useLocation()
  const email = location.state?.email; //getting the email passed from "Identity" component through location state
  const { token  } = useParams()

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => {
        if (prev > 0) {
          return prev - 1;
        } else {
          clearInterval(timer);
          setResendAvailable(true);
          return 0;
        }
      });
    }, 1000);

    return () => clearInterval(timer); // Cleanup timer on component unmount

  }, []);
  useEffect(()=> {
    //function to check if the token is valid on page load

    axios.post(`${import.meta.env.VITE_BACKEND_URL}/is-token-active`, {email: email} ,{
      headers: {
        Authorization: `Bearer ${token}`,

      }
    }).then((isTokenActive) => {
      console.log(isTokenActive)
      if(isTokenActive.data.code == "invalid-jwt"){
        navigate('/page-not-found', {replace: true})
      }else{
        return null
      }
    }).catch((err) => {
        console.log("Token validation error:", err);
        navigate('/page-not-found', { replace: true });
      })
  }, [])
  const handleChange = (e, index) => {
    const code = inputsRef.current.map(input => input.value).join("");

    if (code.length === 6) {
      // Automatically submit the form when all 6 fields are filled
      handleSubmit(e);
    } else {
      if (e.target.value.length === 1 && index < inputsRef.current.length - 1) {
        inputsRef.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !e.target.value) {
      if (index > 0) {
        inputsRef.current[index - 1].focus();
      }
    }
  };

  const handleSubmit = async(e) => {
    e.preventDefault();

    // Check if all 6 fields are filled
    const code = inputsRef.current.map(input => input.value).join("");

    // Clear input field upon submission
    inputsRef.current.forEach((input) => {
      if (input) input.value = "";
    });

    if (code.length < 6) {
      setError(true);
    } else {
      setError(false);
      setServerErrorFeedback("")
      setServerSuccessFeedback({success: false, registerToken: ""})
      // Trigger form submission when the code is valid
      // document.getElementById("verificationForm").submit();
      // console.log(token) 
      const verificationCode = Cookies.get("_emt")
      setIsLoading(true)
      const feedback = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/verify-email-verification-code`, {verificationCode: code}, {
        headers: {
          Authorization: `Bearer ${token}`,
          verificationCode: verificationCode
        }
      })
      console.log(feedback)
      if(feedback.data.code == "success"){
        setIsLoading(false)
        setServerSuccessFeedback((prev) => ({
          ...prev,
          success: true,
          registerToken: feedback.data.createAccountToken
        }))
        setEmailVerified(true)
      }else if(feedback.data.code == "error"){
        setIsLoading(false)
        setServerErrorFeedback(feedback.data.message)
      }else if(feedback.data.code == "invalid-jwt"){
        //an error occured while sending verification code
        navigate(`/page-not-found`, {replace: true})
      }
    }
  };

  const handleResendClick = async () => {
    // Logic to resend the verification code
    // alert("Verification code resent!");
    // const feedback = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/send-email-verification-code`, { email: email });
    navigate("/identification", {replace: true})

  };

  return (
    <div>
      <div className="verify-email-code-container">
        <div style={{ padding: "20px", fontSize: "20px" }} className="d-md-none">
          <i className="fa-solid fa-arrow-left" onClick={() => navigate(-1)}></i>
        </div>
        <div className="verify-email-page-container">
          <div className="verify-email-page-wrapper">
            <Logo />
            <h5>Verify your email address</h5>
            <span>We have sent a verification code to {email}</span>
            {emailVerified ? <div  style={{ padding: "10px" }}>
                    <div class="success-icon">
                    <svg viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M7 13l3 3 7-7" />
                    </svg>
                  </div>
              {serverSuccessFeedback.success && <div className="mb-3">Email verification successful!. you can now <span  onClick={()=> navigate(`/register/${serverSuccessFeedback.registerToken}`, { state: { defaultEmail: email } })} style={{color: "purple", fontWeight: "500", cursor: "pointer"}}>register</span></div>}
            </div>
            :
            <form id="verificationForm" onSubmit={handleSubmit}>
              <div style={{ padding: "10px" }}>
                {serverErrorFeedback && <div className="alert alert-danger">{serverErrorFeedback}</div>}

                  
                <div className="code-input-wrapper">
                  {[...Array(6)].map((_, index) => (
                    <input
                      key={index}
                      type="number"
                      min='1'
                      maxLength="1"
                      className={`code-input ${error ? "error-input" : ""}`}
                      ref={(el) => (inputsRef.current[index] = el)}
                      onChange={(e) => handleChange(e, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                    />
                  ))}
                </div>
                {error && (
                  <small className="error-message text-danger">
                    This verification code is not valid
                  </small>
                )}
              </div>
              <div className="d-grid gap-1">
                <button
                  className="btn btn-lg"
                  style={{ backgroundColor: "purple", color: "white" }}
                  disabled={isLoading}
                >
                  {isLoading ? <div className="spinner-border" role="status">
  <span className="visually-hidden">Loading...</span>
</div> : "Submit"}
               
                </button>
              </div>
            </form>
}
            {!emailVerified && (resendAvailable ? (
              <div className="mt-5">
                <a href="#" onClick={handleResendClick} style={{color: "purple", textDecoration: "none"}}>
                  <b>Resend verification code</b>
                </a>
              </div>
            ) : (
              <div className="mt-5">
                <div>
                  didn't get a code sent to your mail? it's fine, it could take
                  a little while
                </div>
                <small>
                  You can request a new code in{" "}
                  <span style={{ color: "purple" }}>{seconds} seconds</span>
                </small>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailCode;
