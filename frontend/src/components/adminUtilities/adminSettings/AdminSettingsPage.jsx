import React, { useState, useEffect, useContext } from 'react';
import './adminSettingsPage.css'; // Import custom CSS
import { useAuth } from "../../AuthContext/AuthContext";
import axios from 'axios';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import localforage from 'localforage';
import { useUserManagement } from '../viewUsers/useUserManagement';

const AdminSettingsPage = () => {
  const { 
    allUsers,
    singleUser,
    setSingleUser
  } = useUserManagement('admins');
  // const use_auth = useAuth();
  const { user, setUser } = useAuth();
  console.log(user)
  
  const adminDetails = user.user || {};
  


  // State to store form data, including OTP
  const [formData, setFormData] = useState({
    countryOfWarehouseLocation: adminDetails.countryOfWarehouseLocation || '',
    internationalShippingFee: adminDetails.internationalShippingFee || '',
    domesticShippingFee: adminDetails.domesticShippingFee || '',
    numberOfDaysForDomesticDelivery: adminDetails.numberOfDaysForDomesticDelivery || '',
    numberOfDaysForInternationalDelivery: adminDetails.numberOfDaysForInternationalDelivery || '',
  });
 
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
    if (!formData.countryOfWarehouseLocation.trim()) newErrors.countryOfWarehouseLocation = "Country is required";
    if (!formData.domesticShippingFee) newErrors.domesticShippingFee = "Domestic shipping fee is required";
    if (!formData.internationalShippingFee) newErrors.internationalShippingFee = "International shipping fee is required";
    if (!formData.numberOfDaysForDomesticDelivery) newErrors.numberOfDaysForDomesticDelivery = "Number of days for domestic delivery is required";
    if (!formData.numberOfDaysForInternationalDelivery) newErrors.numberOfDaysForInternationalDelivery = "Number of days for international delivery is required";
    return newErrors;
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
      const authToken = Cookies.get("authToken")
      console.log('Form data:', formData);
      const feedback = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/admin/shipping-settings`, { formData }, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        }
      })
      console.log(feedback)
      if (feedback.data.code == 'invalid-jwt' || feedback.data.code == 'error') {
        toast.error(`${feedback.data.message}`)
      } else if (feedback.data.code == "success") {
        //update in database was successful, next, update data in localforage
        // await localforage.setItem('shipping', JSON.stringify(feedback.data.data))
        setFormData({
          countryOfWarehouseLocation: '',
          internationalShippingFee: '',
          domesticShippingFee: '',
          numberOfDaysForDomesticDelivery: '',
          numberOfDaysForInternationalDelivery: '',
        })
        toast.success('Shipping details updated successfully')
      } else {
        toast.error("An error occured while updating shipping details")
      }

    }
  };

  // State to store countries fetched from the API
  const [countries, setCountries] = useState([]);

// Fetch list of countries from API on component mount
  // useEffect(()=> {
  //   console.log(adminDetails)
  //   axios.get("https://restcountries.com/v3.1/all")
  //     .then(response => {
  //       const countryData = response.data.map(country => ({
  //         name: country.name.common,
  //         code: country.cca2
  //       }));
  //       setCountries(countryData);
  //     })
  //     .catch(error => {
  //       console.error("Error fetching countries:", error);
  //       toast.error("Failed to fetch countries. Please try again later.");
  //     });
  // }, [])

    useEffect(()=> {
      console.log(adminDetails)
      axios.get(`${import.meta.env.VITE_BACKEND_URL}/get-all-countries-and-states`)
        .then(response => {
          console.log(response)
          const countryData = response.data.data.data.map(country => ({
            name: country.name,
            code: country.iso3
          }));
          setCountries(countryData);
        })
        .catch(error => {
          console.error("Error fetching countries:", error);
          toast.error("Failed to fetch countries. Please try again later.");
        });
    }, [])
    
    const token = Cookies.get("authToken");
    useEffect(()=> {
      console.log(allUsers)
      axios.get(`${import.meta.env.VITE_BACKEND_URL}/get-number-of-days-of-delivery`,{
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then((feedback) => {
        console.log(feedback)
        if(feedback.data.code == "success"){
          setFormData((prev)=> ({
            ...prev,
            countryOfWarehouseLocation: feedback.data.data.countryOfWarehouseLocation,
            internationalShippingFee: feedback.data.data.internationalShippingFee,
            domesticShippingFee: feedback.data.data.domesticShippingFee,
            numberOfDaysForDomesticDelivery: feedback.data.data.numberOfDaysForDomesticDelivery,
            numberOfDaysForInternationalDelivery: feedback.data.data.numberOfDaysForInternationalDelivery,

          }))
        }
      })
    }, [])


useEffect(() => {
  if (allUsers.length > 0 && adminDetails?.email) {
    const matchingAdmin = allUsers.find(user => user.email === adminDetails.email);
    if (matchingAdmin) {
      setSingleUser(matchingAdmin);
    }
    console.log(matchingAdmin)
  }
}, [allUsers, adminDetails?.email]);


const canEditShipping = singleUser?.admin?.role_names?.includes('can-edit-shipping-settings') || adminDetails.is_super_admin == 1;

  return (
    <div>
      <div className="bread-crumb">
                <div style={{fontSize: "20px", fontWeight: "semi bold"}}>Admin Dashboard </div>
                <div>Home / Shipping settings</div>
            </div>

      <div className="admin-settings-container">
        <h1 className='text-center mb-4'>Shipping Settings</h1>

        <form className="settings-form row" onSubmit={handleSubmit}>
          <div className="form-group mb-4 col-12 col-md-6">
            <label>Country of Warehouse location</label>
            <select
              name="countryOfWarehouseLocation"
              value={formData.countryOfWarehouseLocation}
              onChange={handleInputChange}
              className={`form-control ${errors.countryOfWarehouseLocation ? 'is-invalid' : ''}`}
              required
              disabled={!canEditShipping}
            >
              <option value="">Select Country</option>
              {countries.map(country => (
                <option key={country.code} value={country.name}>
                  {country.name}
                </option>
              ))}
            </select>
            {errors.countryOfWarehouseLocation && <div className="invalid-feedback">{errors.countryOfWarehouseLocation}</div>}
          </div>

          <div className="form-group mb-4 col-12 col-md-6">
            <label>Flat rate shipping fee for domestic delivery (in {import.meta.env.VITE_BASE_CURRENCY}):</label>
            <input
              type="number"
              name="domesticShippingFee"
              value={formData.domesticShippingFee}
              className={`form-control form-control-lg ${errors.domesticShippingFee ? 'is-invalid' : ''}`}
              style={{fontSize: "17px"}}
              onChange={handleInputChange}
              required
              disabled={!canEditShipping}
            />
            {errors.domesticShippingFee && <div className="invalid-feedback">{errors.domesticShippingFee}</div>}
          </div>

          <div className="form-group mb-4 col-12 col-md-6">
            <label>Flat rate shipping fee for international delivery (in {import.meta.env.VITE_BASE_CURRENCY}):</label>
            <input
              type="number"
              name="internationalShippingFee"
              value={formData.internationalShippingFee}
              className={`form-control form-control-lg ${errors.internationalShippingFee ? 'is-invalid' : ''}`}
              style={{fontSize: "17px"}}
              onChange={handleInputChange}
              required
              disabled={!canEditShipping}
            />
            {errors.internationalShippingFee && <div className="invalid-feedback">{errors.internationalShippingFee}</div>}
          </div>

          <div className="form-group col-12 col-md-6">
            <label>Local delivery time (days)</label>
            <input
              type="number"
              name="numberOfDaysForDomesticDelivery"
              value={formData.numberOfDaysForDomesticDelivery}
              className="form-control form-control-lg"
              style={{fontSize: "17px"}}
              onChange={handleInputChange}
              min="1"
              disabled={!canEditShipping}
            />
            <small id="deliveryHelp" className="form-text text-muted">
              Number of days for domestic delivery.
            </small>
          </div>

          <div className="form-group col-12 col-md-6">
            <label>International delivery time (days)</label>
            <input
              type="number"
              name="numberOfDaysForInternationalDelivery"
              value={formData.numberOfDaysForInternationalDelivery}
              className="form-control form-control-lg"
              style={{fontSize: "17px"}}
              onChange={handleInputChange}
              min="1"
              disabled={!canEditShipping}
            />
            <small id="deliveryHelp" className="form-text text-muted">
              Number of days for international delivery.
            </small>
          </div>

          {/* <div className="d-grid mt-4">
            <button type="submit" className="btn btn-lg" style={{ backgroundColor: "purple", color: "white" }}>Save Changes</button>
          </div> */}

          {canEditShipping && (
            <div className="d-grid mt-4">
              <button
                type="submit"
                className="btn btn-lg"
                style={{ backgroundColor: "purple", color: "white" }}
              >
                Save Changes
              </button>
            </div>
          )}

          

        </form>
      </div>
    </div>
  );
};

export default AdminSettingsPage;



























// import React, { useState, useEffect } from 'react';
// import './adminSettingsPage.css'; // Import custom CSS
// import { useAuth } from "../../AuthContext/AuthContext"
// import axios from 'axios';

// const AdminSettingsPage = () => {
//   const use_auth = useAuth()
//   const adminDetails = use_auth?.user?.user
//   const [formData, setFormData] = useState({
//     firstname: adminDetails.firstname,
//     lastname: adminDetails.lastname,
//     email: adminDetails.email,
//     countryOfWarehouseLocation: adminDetails.countryOfWarehouseLocation,
//     internationalShippingFee: adminDetails.internationalShippingFee,
//     domesticShippingFee: adminDetails.domesticShippingFee 
//   })
//   const [OtpSent, setOtpSent] = useState(false)
//   const sendOTP = () => {
//     setOtpSent(true)
//   }
//   return (
//     <div>
//                   <div className="bread-crumb">
//                 {/* <div style={{fontSize: "20px", fontWeight: "semi bold"}}>Admin Dashboard </div> */}
//                 <div>Before proceeding, an otp will be sent to the email you input below</div>
//             </div>
//       <div className="admin-settings-container">
//         <h1 className='text-center mb-4'>Admin Settings</h1>
//         <form className="settings-form">
//         <div className="form-floating mb-3">
//           <input type="text" value={formData.firstname} className="form-control" placeholder="First name" required />
//           <label>First name</label>
//         </div>

//         <div className="form-floating mb-3">
//           <input type="text" value={formData.lastname} className="form-control" placeholder="Last name" required />
//           <label>Last name</label>
//         </div>

//           <div className="form-group form-floating mb-4">
//             <input type="email" value={formData.email} className='form-control' placeholder='email' required />
//             <label>Email</label>
//             <div style={{display: "flex", justifyContent: "right"}}>
//               {OtpSent ? <span className='badge bg-success'>OTP sent</span> : <button className='btn btn-sm' style={{background: "purple", color: "white"}} onClick={sendOTP}>click to send otp</button>}
//             </div>
//           </div>


//           <div className="form-group form-floating mb-4">
//             <input type="text" value={formData.countryOfWarehouseLocation} placeholder="country" className='form-control' />
//             <label>Country of Warehouse location</label>
//           </div>

//           <div className="form-group mb-4">
//             <label>Flat rate shipping fee for domestic delivery (in naira):</label>
//             <input type="number" value={formData.domesticShippingFee} className='form-control form-control-lg' />
//           </div>

//           <div className="form-group mb-4">
//             <label>Flat rate shipping fee for international delivery (in naira)</label>
//             <input type="number" value={formData.internationalShippingFee} className='form-control form-control-lg' />
//           </div>

//           <div className="form-group mb-4">
//             <label>Enter OTP sent</label>
//             <input type="number" className='form-control form-control-lg' />
//           </div>

//           <div className="d-grid">
//             <button type="submit" className="btn btn-primary btn-lg">Save Changes</button>
//           </div>

//         </form>
//       </div>
//     </div>
//   );
// };

// export default AdminSettingsPage;





















