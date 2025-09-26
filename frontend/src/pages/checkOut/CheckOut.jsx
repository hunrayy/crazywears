import CheckoutHeader from "../../components/checkoutHeader/CheckoutHeader"
import "./checkout.css"
import axios from "axios"
import { useState, useEffect, useContext, useRef } from "react"
import Form from 'react-bootstrap/Form';
import { CartContext } from "../cart/CartContext";
import { CurrencyContext } from "../../components/all_context/CurrencyContext";
import { useAuth } from "../../components/AuthContext/AuthContext";
import { toast } from "react-toastify"; 
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Loader from "../../components/loader/Loader";
import { calculateTotal } from "../cart/CartTotal";
import CartTotal from "../cart/CartTotal";
import { useFlutterwave, FlutterWaveButton, closePaymentModal } from 'flutterwave-react-v3';
import logo from '../../../public/beautybykiara_logo.png'
import PaymentSuccessModal from "../../components/paymentSucessModal/PaymentSuccessModal";
const CheckOut = () => {
  const use_auth = useAuth()
  const navigate = useNavigate()
  const { cartProducts, setCartProducts, addToCart, updateCartItemQuantity } = useContext(CartContext);
  const { selectedCurrency, convertCurrency, currencySymbols, currentCurrencyCode } = useContext(CurrencyContext);


  const [countries, setCountries] = useState([])
  const [countryOfWarehouseLocation, setCountryOfWarehouseLocation] = useState(null)
  const [numberOfDaysForDelivery, setNumberOfDaysForDelivery] = useState({
    numberOfDaysForDomesticDelivery: null,
    numberOfDaysForInternationalDelivery: null
  })
  const [shippingFee, setShippingFee] = useState({
    domesticShippingFee: null,
    internationalShippingFee: null
  })
  const [checkoutTotal, setCheckoutTotal] = useState()
  const [selectedCountry, setSelectedCountry] = useState('')
  const [states, setStates] = useState([])
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    email: use_auth.user.user?.email,
    firstname: use_auth.user.user?.firstname,
    lastname: "",
    address: "",
    city: "",
    postalCode: "",
    phoneNumber: "",
    country: "", //initially empty, no default country
    state: "",
    totalPrice: "",
    currency: currentCurrencyCode,
    expectedDateOfDelivery: "",
    checkoutTotal: "",
    cartProducts: cartProducts.products
  })

  // Form errors state
  const [errors, setErrors] = useState({});

    // Handle country selection and dynamically load states
    const handleCountryChange = (e) => {
      const selectedCountry = e.target.value;
      setFormData((prevData) => ({ ...prevData, country: selectedCountry, state: "" })); // Clear the state when the country changes
  
      // Find the selected country's states and update the state dropdown
      const countryData = countries.find((country) => country.name === selectedCountry);
      if (countryData) {
        setStates(countryData.states); // Update the states based on the selected country
      } else {
        setStates([]); // Clear states if no country found (just in case)
      }
    };
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({...prevData, [name]: value}))
    }

    //validate the form
    const validateForm = () => {
      const newErrors = {}
      if (!formData.lastname) newErrors.lastname = "Last name is required"
      if (!formData.address) newErrors.address = "Address is required";
      if (!formData.city) newErrors.city = "City is required";
      if (!formData.phoneNumber) newErrors.phoneNumber = "Phone number is required";
      else if (!/^[^a-zA-Z]*$/.test(formData.phoneNumber)) newErrors.phoneNumber = "Invalid phone number";

        // Country validation
      if (!formData.country) newErrors.country = "Country is required";
      
      // State validation based on available states
      if (states.length > 0 && !formData.state) {
        newErrors.state = "State/Region is required";
      } else if (states.length === 0 && !formData.state) {
        setFormData((prevData) => ({ ...prevData, state: formData.country })); // Automatically set state to country name
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    }

      // Handle form submission
    const token = Cookies.get("authToken")
      const [paymentSuccessModalOpen, setPaymentSuccessModalOpen] = useState(false);


      const paymentHandledRef = useRef(false);

    const handleSubmit = (e) => {
      e.preventDefault();
    
      if (!validateForm()) {
        toast.error("Please correct the errors in the form.");
        return;
      }
    
      setLoading(true);
    
      axios.post(`${import.meta.env.VITE_BACKEND_URL}/flutterwave/generate-token-for-payment`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((feedback) => {
        console.log(feedback)
        if (feedback.data.code === 'success') {
          const detailsToken = feedback.data.data;
    
          // Create a new config that includes the token in meta
          const updatedConfig = {
            public_key: import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY,
            tx_ref: Date.now().toString(),
            amount: formData.checkoutTotal,
            currency: formData.currency,
            payment_options: "card,ussd,banktransfer",
            customer: {
              email: formData.email,
              phonenumber: formData.phoneNumber,
              name: `${formData.firstname} ${formData.lastname}`,
            },
            customizations: {
              title: "Beautybykiara",
              description: "Payment for order items from Beauty By kiara",
              logo: logo,
            },
            meta: {
              detailsToken: detailsToken, // <- pass the token here
            },
          };

          paymentHandledRef.current = false;
          const handleFlutterPayment = useFlutterwave(updatedConfig);
    
          handleFlutterPayment({
            callback: (response) => {
              // return console.log("Payment response:", response);
              
    
              if (response.status === "successful" || response.status === "completed") {
                axios.get(`${import.meta.env.VITE_BACKEND_URL}/flutterwave/validate-payment`, {
                  params: {
                    tx_ref: updatedConfig.tx_ref,
                },headers: {
                    Authorization: `Bearer ${token}`,
                  },
                })
                .then((res) => {
                  console.log(res)
                  if (res.data.code === "success" || res.data.code === "already-made") {
                    paymentHandledRef.current = true;
                    setPaymentSuccessModalOpen(true)
                    localStorage.removeItem('cart_items'); //clear cart items in local storage
                    setCartProducts((prev) => ({
                        ...prev,
                        products: []
                    }))
                  } else {
                    toast.error(`Payment verification failed: ${res.data.message}`);
                  }
                  setLoading(false);
                })
                .catch((error) => {
                  toast.error(`An error occurred during payment verification: ${error.message}`);
                  setLoading(false);
                });
              } else {
                toast.error("Payment was not successful.");
                setLoading(false);
              }
    
              closePaymentModal();
            },
            onClose: () => {
              if (!paymentHandledRef.current) {
                toast.info("Payment process was closed.");
              }
              setLoading(false);
            },
          
          });
    
        } else if (feedback.data.code === 'error') {
          toast.error(feedback.data.message);
          setLoading(false);
        } else {
          
          toast.error("An error occurred while initiating payment, please try again.");
          setLoading(false);
        }
      })
      .catch((error) => {
        toast.error("Something went wrong while contacting the server.");
        console.log(error)
        setLoading(false);
      });
    };
    


  useEffect(() => {
    console.log('User Auth State:', use_auth.user.is_user_logged);
    if(!use_auth?.user?.is_user_logged){
      navigate("/", {replace: true})
    }
  
    const total = calculateTotal(cartProducts, convertCurrency, selectedCurrency); // Pass context values
    setFormData((prevData) => ({
      ...prevData,
      totalPrice: total.toString(), // Convert total to string
      currency: selectedCurrency
    }));

    // axios.get("https://countriesnow.space/api/v0.1/countries/states", { timeout: 10000 }) // timeout set to 10 seconds
    // .then((feedback) => {
    //   console.log(feedback)
    //   setCountries(feedback.data.data)
    // }).catch((error) => {
    //   // console.error("Error fetching countries and states:", error)
    //   toast.error("Failed to fetch countries and states. Please try again later.");
    // })

    axios.get(`${import.meta.env.VITE_BACKEND_URL}/get-all-countries-and-states`, { timeout: 10000 }) // timeout set to 10 seconds
    .then((feedback) => {
      console.log(feedback)
      setCountries(feedback.data.data.data)
    }).catch((error) => {
      // console.error("Error fetching countries and states:", error)
      toast.error("Failed to fetch countries and states. Please try again later.");
    })


    axios.get(`${import.meta.env.VITE_BACKEND_URL}/get-number-of-days-of-delivery`,{
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((feedback) => {
      console.log(feedback)
      if(feedback.data.code == "success"){
        setCountryOfWarehouseLocation(feedback.data.data.countryOfWarehouseLocation)
        setNumberOfDaysForDelivery({
          numberOfDaysForDomesticDelivery: feedback.data.data.numberOfDaysForDomesticDelivery,
          numberOfDaysForInternationalDelivery: feedback.data.data.numberOfDaysForInternationalDelivery
        })
        setShippingFee({
          domesticShippingFee: feedback.data.data.domesticShippingFee,
          internationalShippingFee: feedback.data.data.internationalShippingFee
        })
    
      }
    })
  }, [cartProducts, selectedCurrency, convertCurrency])
   // Set user's current country using IP geolocation
  useEffect(() => {
    if (countries.length === 0) return; // wait until countries are loaded

    axios
      .get("https://ipwho.is/")
      .then((res) => {
        const userCountry = res.data.country;
        console.log("User's country:", userCountry);

        const matchedCountry = countries.find(
          (country) => country.name.toLowerCase() === userCountry.toLowerCase()
        );

        if (matchedCountry) {
          setFormData((prevData) => ({
            ...prevData,
            country: matchedCountry.name,
            state: "",
          }));
          setStates(matchedCountry.states || []);
        }
      })
      .catch((err) => {
        console.error("Geolocation failed:", err);
      });
  }, [countries]);

function calculateExpectedDateOfDelivery(selectedCountry) {
  if(!selectedCountry){
    return "..."
  }
  const numberOfDaysForDomesticDelivery = numberOfDaysForDelivery.numberOfDaysForDomesticDelivery; // Example number of days for domestic delivery
  const numberOfDaysForInternationalDelivery = numberOfDaysForDelivery.numberOfDaysForInternationalDelivery; // Example number of days for international delivery

  const currentDate = new Date();

  let expectedDateOfDelivery;

  if (countryOfWarehouseLocation == selectedCountry) {
      // Calculate expected date for domestic delivery
      expectedDateOfDelivery = new Date(currentDate.setDate(currentDate.getDate() + numberOfDaysForDomesticDelivery));
  } else {
      // Calculate expected date for international delivery
      expectedDateOfDelivery = new Date(currentDate.setDate(currentDate.getDate() + numberOfDaysForInternationalDelivery));
  }

  return expectedDateOfDelivery.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
}

  function calculateShippingFee(selectedCountry){
    if(!selectedCountry){
      return "..."
    }
    if (countryOfWarehouseLocation == selectedCountry) {
      let convertedPrice = convertCurrency(shippingFee.domesticShippingFee, import.meta.env.VITE_CURRENCY_CODE, selectedCurrency);
        // Calculate shipping fee for local delivery

        // return `${currentCurrencyCode} ${convertedPrice.toLocaleString()}`
        return convertedPrice.toLocaleString()
      
    } else {
        // Calculate shipping fee for international delivery
        let convertedPrice = convertCurrency(shippingFee.internationalShippingFee, import.meta.env.VITE_CURRENCY_CODE, selectedCurrency);
        // Calculate shipping fee for local delivery

        // return `${currentCurrencyCode} ${convertedPrice.toLocaleString()}`
        return convertedPrice.toLocaleString()
      }

  }

  useEffect(() => {
    if (formData.country) {
      // Calculate shipping fee and cart total
      const shippingFee =   parseFloat(calculateShippingFee(formData.country).replace(/,/g, ''))   ; // Get numeric shipping fee
      const cartTotal = (calculateTotal(cartProducts, convertCurrency, selectedCurrency)); // Get numeric cart total
      const totalWithShipping = cartTotal + shippingFee; // Perform sum operation

      // Format the total
      const currencySymbol = currencySymbols[selectedCurrency];
      const formattedTotal = totalWithShipping.toLocaleString();
      const formattedTotalWithoutCommas = parseFloat(formattedTotal.replace(/,/g, '')).toFixed(2);


      // Update state with the new total
      setCheckoutTotal(formattedTotal);
      setFormData((prev) => ({
        ...prev,
        checkoutTotal: formattedTotalWithoutCommas
      }))
      

      //calculate expected date of delivery
      const expectedDate = calculateExpectedDateOfDelivery(formData.country)
      setFormData((prev) => ({
        ...prev,
        expectedDateOfDelivery: expectedDate
      }))
    }
  }, [formData.country, cartProducts, convertCurrency, selectedCurrency, currencySymbols]);

  const lengthsOfHair = [
    `12", 12", 12"`,
    `14", 14", 14"`,
    `16", 16", 16"`,
    `18", 18", 18"`,
    `20", 20", 20"`,
    `22", 22", 22"`,
    `24", 24", 24"`,
    `26", 26", 26"`,
    `28", 28", 28"`,
  ];

  return <div>
    <CheckoutHeader />
    {loading && <Loader />}
    <PaymentSuccessModal isOpen={paymentSuccessModalOpen} />
    <section className=" checkout-container">
      <div className="container">
        <div className="row">
          <div className="col-xl-8 col-lg-8 mb-4">
            {/* <!-- Checkout --> */}
            <div className="card shadow-0 border">
              <div className="p-4">
                <div className="row">
                  <h5 className="card-title mb-3">Contact</h5>
                  <div className="mb-3 form-floating">
                    <input type="email" placeholder="Email" value={formData.email} disabled className="form-control" />
                    <label className="mx-3">Email</label>
                  </div>
                  <h5 className="card-title mb-3">Delivery</h5>

                  <div className="col-12 mb-3 form-floating">
                    <Form.Select className={`form-select ${errors.country && 'is-invalid'}`} name="country" value={formData.country} onChange={handleCountryChange}>
                    <option value="">Select Country</option>
                          {countries.map((country) => (
                            <option key={country.iso3} value={country.name}>
                              {country.name}
                            </option>
                          ))}
                    </Form.Select>
                    <label className="mx-3">Country</label>
                    {errors.country && <small className="text-danger">{errors.country}</small>}

                  </div>
    
                  <div className="col-12 col-lg-6 mb-3 form-floating">
                    <input type="text" id="typeText" placeholder="First name" value={formData.firstname} disabled className="form-control" />
                    <label className="mx-3">First name</label>
                  </div>

                  <div className="col-12 col-lg-6 form-floating mb-3">
                    <input type="text" id="typeText" placeholder="Last name" className={`form-control ${errors.address && 'is-invalid'}`} name="lastname" value={formData.lastname} onChange={handleInputChange} />
                    <label className="mx-3">Last name</label>
                    {errors.lastname && <small className="text-danger">{errors.lastname}</small>}
                  </div>

                  <div className="col-12 form-floating mb-3">
                    <input type="text" id="typeText" placeholder="address" className={`form-control ${errors.address && 'is-invalid'}`} name="address" value={formData.address} onChange={handleInputChange} />
                    <label className="mx-3">Address</label>
                    {errors.address && <small className="text-danger">{errors.address}</small>}
                  </div>

                  <div className="col-12 col-lg-4 mb-3 form-floating">
                    <Form.Select
                      className={` ${errors.state && 'is-invalid'}`}
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                    >
                      <option value="">Select State/Region</option>
                      {states.map((state, index) => (
                        <option key={index} value={state.name}>
                          {state.name}
                        </option>
                      ))}
                    </Form.Select>
                    <label className="mx-3">State/Region</label>
                    {errors.state && <small className="text-danger">{errors.state}</small>}
                  </div>

                  <div className="col-12 col-lg-4 form-floating mb-3">
                    <input type="text" id="typeText" placeholder="City" className={`form-control ${errors.city && 'is-invalid'}`} name="city" value={formData.city} onChange={handleInputChange} />
                    <label className="mx-3">City</label>
                    {errors.city && <small className="text-danger">{errors.city}</small>}

                  </div>

                  <div className="col-12 col-lg-4 form-floating mb-3">
                    <input type="text" id="typeText" placeholder="Postal code" className="form-control" name="postalCode" value={formData.postalCode} onChange={handleInputChange} />
                    <label className="mx-3">Postal Code(optional)</label>
                  </div>

                  {/* <div className="mb-5 form-floating">
                    <input type="text" placeholder="Phone number" className={`form-control form-control-lg ${errors.phoneNumber && 'is-invalid'}`} name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} style={{fontSize: "14px"}} />
                    <label className="mx-4">Phone number</label>
                    {errors.phoneNumber && <small className="text-danger">{errors.phoneNumber}</small>}
                  </div> */}



                  <div className="mb-5 form-floating">

                    <input
                      type="text"
                      placeholder="Phone number"
                      className={`form-control ${errors.phoneNumber && 'is-invalid'}`}
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={(e) => {
                        const cleanedValue = e.target.value.replace(/[^0-9+]/g, ""); // remove all except numbers and +
                        handleInputChange({
                          target: {
                            name: "phoneNumber",
                            value: cleanedValue,
                          },
                        });
                      }}
                    />
                    <label className="mx-4">Phone number </label>
                    {!errors.phoneNumber && <small className="text-muted">Must be a valid phone number preceeded by a valid country code</small>}
                    {errors.phoneNumber && <small className="text-danger">{errors.phoneNumber}</small>}
                                    
                  </div> 





                </div>

                {/* <hr className="my-4" /> */}

                <h5 className="card-title">Payment</h5>
                <small className="mb-3">All transactions are secure and encrypted.</small><br />
                <small><b>Before making payment, kindly ensure  that your desired payment currency is supported by Flutterwave</b></small>

                <div className="row mb-3 mt-2 ">
                  <div className="col-lg-12 mb-3 ">
                    {/* <!-- Default checked radio --> */}
                    <div className="form-check h-100 border rounded-3" style={{minHeight: "250px"}}>
                      <div className="p-3">
                        <input className="form-check-input" type="radio" readOnly checked />
                        <h5 className="col-3" style={{fontFamily: "Outfit", width: "100%"}}>Flutterwave</h5>
                        <small>After clicking pay now, you will be required to make payment</small>
                      </div>
                        <div>
                          {/* <img style={{width: "100%", height: "auto", maxWidth: "250px"}} src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTr2wrfKVK1n5mjpmuHbIKlNb3PbTLBdwFEAw&s" alt="paypal logo" /> */}
                          <img style={{width: "100%", height: "auto", maxWidth: "250px"}} src="data:image/png;base64,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" alt="Flutterwave image" />

                        </div>
                    </div>
                  </div>
                </div>



                <div className="d-none d-lg-grid">
                  <button disabled={loading} className="btn btn-lg shadow-0 border " onClick={handleSubmit} style={{backgroundColor: "black", color: "white", fontWeight: "900"}}>
                    {loading ? "Processing..." : "Pay now"}
                  </button>
                </div>
              </div>
          <div className=" checkout-item-summary">
            <div className=" justify-content-lg-end">
              <div className="">
                <h6 className="mb-3">Summary</h6>

                
                {cartProducts.products.slice().reverse().map((product, index) => {
                  console.log(product)
                  const currencySymbol = currencySymbols[selectedCurrency];
                  let convertedPrice = convertCurrency(product.productPrice, import.meta.env.VITE_CURRENCY_CODE, selectedCurrency);
                    convertedPrice = Number(convertedPrice);
                    const productPrices = [product.productPrice12Inches, product.productPrice14Inches, 
                      product.productPrice16Inches, product.productPrice18Inches, product.productPrice20Inches, 
                      product.productPrice22Inches, product.productPrice24Inches, 
                      product.productPrice26Inches, product.productPrice28Inches
                    ]
                  return <div className="d-flex align-items-center mb-4" key={index}>
                    <div className="me-3 position-relative">
                      {product.quantity > 1 && <div className=" bg-dark position-absolute top-0 start-100 translate-middle  rounded-pill" style={{width: "15px", height: "15px", borderRadius: "50%", color: "white", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "10px"}}>
                        {product.quantity}
                      </div>}
                      <img src={product.productImage} style={{ height: "auto", width: "100%", maxWidth: "60px"}} className="img-sm rounded border" />
                    </div>
                    <div>
                      {product.productName}
                      <div className=" text-muted">{product.lengthPicked}
                        {/* <div className=" text-muted">{currencySymbol}{convertedPrice.toLocaleString()}  {product.quantity > 1 && <span>&nbsp; * &nbsp; {product.quantity}</span>}
                        
                        </div> */}
                        <div>
                        {lengthsOfHair.map((length, index) =>
                                product.lengthPicked === length &&
                                <div>{currencySymbols[selectedCurrency]} {convertCurrency(productPrices[index], import.meta.env.VITE_CURRENCY_CODE, selectedCurrency).toLocaleString()} {product.quantity > 1 && <span>&nbsp; * &nbsp; {product.quantity}</span>}</div>
                              )}
                        </div>
                      </div>
                    </div>
                  </div>
                })}
                <hr />
                 <div className="d-flex justify-content-between">
                  <p className="mb-2">Subtotal:</p>
                  <p className="mb-2"><CartTotal /></p>
                </div>

                <div className="d-flex" style={{justifyContent: "space-between"}}>
                  <p className="mb-2" style={{flex: "2"}}>Expected date of delivery:</p>
                  <div style={{textAlign: "right", flex: "1"}}>
                    <p className="mb-2">
                    {(() => {
                        if(!formData.country){
                          // return <span style={{fontSize: "12px"}}>...<i class="fa fa-question-circle" title="Expected date of delivery can only be present after selecting a country" aria-hidden="true"></i></span>
                        return <span className="placeholder" style={{width: "80px"}}></span>

                        }else{
                          return `${formData.expectedDateOfDelivery}`; // Combine currency symbol with formatted total
                        }
                      })()}
                    </p>
                  </div>
                </div>
                <div className="d-flex justify-content-between">
                  <p className="mb-2">Shipping fee:</p>
                  <p className="mb-2">
                  {(() => {
                      if(!formData.country){
                        // return <span style={{fontSize: "12px"}}>...<i class="fa fa-question-circle" title="Shipping fee can only be present after selecting a country" aria-hidden="true"></i></span>
                        return <span className="placeholder" style={{width: "80px"}}></span>

                      }else{
                        return `${currencySymbols[selectedCurrency]} ${calculateShippingFee(formData.country)}`; // Combine currency symbol with formatted total
                      }
                    })()}
                  </p>
                </div>

                <div className="d-flex justify-content-between">
                  <p className="mb-2 fw-bold">Total price:</p>
                  <div className="mb-2 fw-bold"> {(() => {
                      if(!formData.country){
                        // return <span style={{fontSize: "12px"}}>...<i class="fa fa-question-circle" title="Total price can only be calcuated after selecting a country" aria-hidden="true"></i></span>
                        return <span className="placeholder" style={{width: "80px"}}></span>

                      }else{
                        return `${currencySymbols[selectedCurrency]}`; // Combine currency symbol with formatted total
                      }
                    })()} {checkoutTotal}</div>
                  
                </div>

                <div className="d-grid d-lg-none">
                    <button disabled={loading} className="btn btn-lg shadow-0 border" onClick={handleSubmit} style={{backgroundColor: "black", color: "white", fontWeight: "900", width: "100%"}}>
                    {loading ? "Processing..." : "Pay now"}
                    </button>
                  </div>
              </div>
            </div>
            </div>
            {/* <!-- Checkout --> */}
          </div>

          </div>
        </div>
      </div>
    </section>

  </div>
}
export default CheckOut
