











import Loader from '../../components/loader/Loader';
import { useState , useEffect} from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import Logo from "../../components/Logo/Logo";
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const { token } = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const [serverSuccessFeedback, setServerSuccessFeedback] = useState(false)
  const [serverErrorFeedback, setServerErrorFeedback] = useState({
    status: false,
    message: ""
  })
  const [isTokenValid, setIsTokenValid] = useState(null)
  const location = useLocation();
  const defaultEmail = location.state?.defaultEmail;
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: defaultEmail,
    password: '',
    confirmPassword: '',
    formErrors: {}
  });


  const validateForm = () => {
    const errors = {};

    // Validate firstname
    if (!formData.firstname) {
      errors.firstname = 'Firstname is required';
    }
    if (!formData.lastname) {
      errors.lastname = 'Lastname is required';
    }

    // Validate password
    if (!formData.password) {
      errors.password = 'Password is required';
    }
    if (formData.password.length < 6) {
        errors.password = 'Password must be more than 6 characters';
      }
    // Validate confirm password
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Password confirmation is required';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setFormData(prevState => ({
      ...prevState,
      formErrors: errors
    }));

    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    if (validateForm()) {
      // Proceed with form submission or API call
      setIsLoading(true)
      setFormData((prev) => ({
        ...prev,
        formErrors: {},
    }))
      
    try{
        const feedback = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/createAccount`, { firstname: formData.firstname, lastname: formData.lastname, email: formData.email, password: formData.password},
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
      );
      console.log(feedback)
     if(feedback){
        setFormData((prev) => ({
            ...prev,
            firstname: "",
            lastname: "",
            password: "",
            confirmPassword: ""
        }))
        if(feedback.data.code === "invalid-jwt"){
          //invalid token...navigate to page not found
            navigate("/page-not-found", {replace: true})
        }else if(feedback.data.code === "success"){
            setServerSuccessFeedback(true)
        }else{
            setServerErrorFeedback({
                status: true,
                message: feedback.data.message
              })
            }
          }
        }catch(error){
          console.log(error)
          setServerErrorFeedback({
                status: true,
                message: error.response.data.message
              })
            
        }finally{
        setIsLoading(false)

      }
    }
  };

   // Validate token on component mount
   useEffect(() => {
    const checkToken = async () => {
      try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/is-token-active`, { data: null }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        // console.log(response)

        if (response.data.code === "invalid-jwt") {
          navigate("/page-not-found", { replace: true });
        } else {
          setIsTokenValid(true);
        }
      } catch (error) {
        navigate("/page-not-found", { replace: true });
      }
    };

    checkToken();
  }, [navigate, token]);

  // If token validation is in progress, render nothing
  if (isTokenValid === null) {
    return null;
  }

  return (
    <div>
        {isLoading && <Loader />}
      <div style={{ padding: "20px", fontSize: "20px" }} className="d-md-none">
        <i className="fa-solid fa-arrow-left" onClick={() => navigate(-1)}></i>
      </div>
      <div className="login-page-container">
        <div className="login-page-wrapper" style={{marginTop: "10px"}}>
          <Logo />
          <h5>Welcome to beautybykiara</h5>
          <span>Create a new account to get started</span>
            { serverSuccessFeedback && <div className='mt-2 px-4'>
                <b>Account successfully created, you can now <Link to = "/login" style={{color: "purple", textDecoration: "none"}}>login</Link></b>
            </div>}
            {serverErrorFeedback.status && 
                <div className='text-danger mt-2 px-4'><b>Account could not be created, {serverErrorFeedback.message}</b></div>
            }

          
          <form className="mb-1" onSubmit={handleSubmit}>
            <div style={{ padding: "30px" }}>
             
              <div className="form-floating">
                <input
                  type="text"
                  placeholder="Firstname"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleChange}
                  style={{fontSize: "16px"}}
                  className={`form-control form-control-lg ${formData.formErrors.firstname ? 'is-invalid' : ''}`}
                />
                <label>First name</label>
                {formData.formErrors.firstname && (
                  <div style={{display: "flex", justifyContent: "left", padding: "5px 10px 0 0"}} className="invalid-feedback">
                    {formData.formErrors.firstname}
                  </div>
                )}
              </div>

              <div className="form-floating mt-3">
              <input
                type="text"
                placeholder="Lastname"
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
                style={{ fontSize: "16px" }}
                className={`form-control form-control-lg ${formData.formErrors.lastname ? 'is-invalid' : ''}`}
              />
              <label>Last name</label>
              {formData.formErrors.lastname && (
                <div className="invalid-feedback" style={{ display: "flex", justifyContent: "left" }}>
                  {formData.formErrors.lastname}
                </div>
              )}
            </div>


              <div className="form-floating mt-3">
                <input
                  type="text"
                  placeholder="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  style={{fontSize: "16px"}}
                  className={`form-control form-control-lg`}
                  disabled={true}

                />
                <label>Email</label>
              </div>

              <div className="form-floating mt-3">
                <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  style={{fontSize: "16px"}}
                  className={`form-control form-control-lg ${formData.formErrors.password ? 'is-invalid' : ''}`}
                />
                <label>Password</label>
                {formData.formErrors.password && (
                  <div style={{display: "flex", justifyContent: "left"}} className="invalid-feedback">
                    {formData.formErrors.password}
                  </div>
                )}
              </div>

              <div className="form-floating mt-3">
                <input
                  type="password"
                  placeholder="Confirm password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  style={{fontSize: "16px"}}
                  className={`form-control form-control-lg ${formData.formErrors.confirmPassword ? 'is-invalid' : ''}`}
                />
                <label>Confirm password</label>
                {formData.formErrors.confirmPassword && (
                  <div style={{display: "flex", justifyContent: "left"}} className="invalid-feedback">
                    {formData.formErrors.confirmPassword}
                  </div>
                )}
              </div>

              <div className="d-grid">
                <button className="btn btn-lg mt-4" style={{backgroundColor: "purple", color: "white"}} type="submit">
                  <b>Register</b>
                </button>
              </div>
            </div>
          </form>
          <small style={{padding: "0 10px 0 10px"}}>By continuing you agree to beautybykiara’s Terms and Conditions</small>
        </div>
      </div>
    </div>
  );
}

export default Register;

// import Logo from "../../components/Logo/Logo"
// import { Link } from "react-router-dom"
// const Register = () => {
//     return <div>
//         {/* <section class="vh-100 gradient-custom">
//   <div class="container py-5 h-100">
//     <div class="row d-flex justify-content-center align-items-center h-100">
//       <div class="col-12 col-md-8 col-lg-6 col-xl-5">
//         <div class="card" style={{borderRadius: "1rem"}}>
//           <div class="card-body py-5">

//             <div class="">

//               <h4 class="fw-bold mb-4">Register</h4>
//               <p class="alert alert-danger mb-">Please enter your login and password!</p>

//               <div data-mdb-input-init class="form-outline form-white mb-4">
//                 <label class="form-label" for="typeEmailX">Email</label>
//                 <input type="email" id="typeEmailX" class="form-control form-control-lg" />
//               </div>

//               <div data-mdb-input-init class="form-outline form-white mb-4">
//                 <label  for="typePasswordX">Password</label>
//                 <input type="password" id="typePasswordX" class="form-control form-control-lg" />
//               </div>

              

//               <button class="btn btn-block btn-primary mb-5" type="submit">Login</button>

//             </div>

//             <div>
//               <p class="mb-0">Have an account already? <a href="#!" class="fw-bold">Sign Up</a>
//               </p>
//             </div>

//           </div>
//         </div>
//       </div>
//     </div>
//   </div>
// </section> */}


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
//                   <div data-mdb-input-init class="form-outline mb-2">
//                     <label class="form-label" for="form2Example17">Password</label>
//                     <input type="password" id="form2Example17" class="form-control form-control" />
//                   </div>

//                   <div data-mdb-input-init class="form-outline mb-2">
//                     <label class="form-label" for="form2Example27">Password confirm</label>
//                     <input type="password" id="form2Example27" class="form-control form-control" />
//                   </div>

//                   <div class="pt-1 mb-">
//                     <button style={{backgroundColor: "purple", color: "white"}} data-mdb-button-init data-mdb-ripple-init class="btn btn-lg btn-block" type="button">Register</button>
//                   </div>

//                   <a class="small text-muted" href="#!">Forgot password?</a>
//                   <p class="" style={{color: "#393f81"}}>Already have an account? <Link to="/login"
//                       style={{color: "#393f81"}}>Login</Link></p>
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
