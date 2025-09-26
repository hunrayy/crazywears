import React, { useState, useEffect, useContext } from 'react';
import './userAccount.css';
import Navbar from "../../components/navbar/Navbar"
import Footer from "../../components/footer/Footer"
import { useAuth } from '../../components/AuthContext/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import { CurrencyContext } from '../../components/all_context/CurrencyContext';
import PaginationButtons from '../../components/paginationButtons/PaginationButtons';

const UserAccount = () => {
  const { selectedCurrency, convertCurrency, currencySymbols } = useContext(CurrencyContext);
  const use_auth = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  // const [user, setUser] = useState({
  //   firstname: use_auth.user,
  //   email: '',
  //   phone: '+123 456 7890',
  // });
  // test code 
  const user = use_auth.user.user
  const [noOrderYet, setNoOrderYet] = useState(false)
  const [orderList, setOrderList] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalOrders, setTotalOrders] = useState([]);
  const showPaginationButtons = true
  
  
  
  const getUserDetails = async() => {
    const token = Cookies.get("authToken")
    const feedback = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/get-user-orders`, {
      params: {
        perPage: perPage,
        page: currentPage,
      },
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    console.log(feedback)
    if(feedback.data.code == "success"){
      if(feedback.data.data.length < 1){
        setNoOrderYet(true)
        setLoading(false)
      }else{
        setLoading(false)
        setOrderList(feedback.data.data.data)
        setCurrentPage(feedback.data.data.current_page)
        setTotalOrders(feedback.data.data);
      }
    }
  }


  useEffect(()=> {
    !use_auth?.user?.is_user_logged && !use_auth.loading && navigate("/", {replace: true})
    getUserDetails()
  }, [use_auth.loading, currentPage, perPage])

  if(use_auth.loading){
    return null
  }


  return (
    <div className='user-account-page-container'>
      <div className="container">
        <Navbar />
        <div className="row mt-5">
          {/* User Profile Section */}
          <div className="col-md-4 mt-5">
            <div className="card shadow-lg border-0 py-3" style={{ borderRadius: '15px' }}>
              <div className="card-body text-center" style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
              
              {
                loading ? <div style={{width: "150px", height: "150px", borderRadius: "50%", margin: "auto"}} className='placeholder mb-3'></div> :
                 
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTo0WeqO2Wp-Q5SdztFjtST0SdW9lkAGJafdQ&s"
                  className="rounded-circle mb-3 img-fluid"
                  alt="User Profile"
                  style={{ border: '3px solid #6A0DAD' }}
                  width="150px"
                />
              }
              {
                loading ? <div className="placeholder mb-1" style={{width: "100%", maxWidth: "130px"}}></div> :
                <p className='mb-1'><strong>First name: </strong>{user?.firstname}</p>

              }

              {
                loading ? <div className="placeholder mt-2" style={{width: "100%", maxWidth: "220px"}}></div> : 
                <p><strong>Email: </strong>{user?.email}</p>
              }
                
                
                
                {/* <button className="btn btn-outline-purple btn-sm">Update Information</button> */}
              </div>
            </div>
          </div>

          {/* Account Overview */}
          <div className="col-md-8 my-5">
            <div className="card shadow-lg border-0" style={{ borderRadius: '15px' }}>
              <div className="card-body py-5">
                {
                  loading ? <p className="placeholder" style={{width: "100%", maxWidth: "150px"}}></p> :
                  <h4 style={{ color: '#6A0DAD' }}>Order History</h4>
                }
                
                <hr />

                {/* Personal Information */}
                

                {/* Order History Section */}
                {
                  loading ? <div className="mb-4">
                              <div className="card p-3" style={{display: "flex", justifyContent: "center", alignItems: "center", height: "200px"}}>
                                <div className="spinner-border" role="status" style={{borderTopColor: "#909294", borderLeftColor: "#909294", borderBottomColor: "#909294", borderWidth: "2px"}}>
                                </div>
                                
                              </div>
                            </div>
                            :
                            (
                              noOrderYet ? 
                                <div style={{textAlign: "center"}}>
                                  <div className="mt-4">
                                    <img src="data:image/png;base64,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" width="100px" alt="" />
                                    <h2 className='text-dark mt-'>You have placed no orders yet!</h2>
                                    <p>All your orders will be saved here for you to access their state anytime.</p>
                                    <Link to="/"className='btn' style={{background: "#6A0DAD", color: "white"}}>Continue Shopping</Link>
                                  </div>
                                </div>
                              :
                              (
                                orderList && orderList.length > 0 && orderList.map((each_item) => {
                                  return <div className="mb-4">
                                    <div className="card p-3">
                                      <div className="row">
                                        <div className="d-flex align-items-center">
                                          <div style={{width: "100%"}}><b>Tracking ID:</b> <span className="text-muted">{each_item.tracking_id}</span><br />
                                            <b>Transaction ID:</b><span className='text-muted'>{each_item.transaction_id}</span> <br />
                                            <b>Date Ordered:</b> <span className="text-muted">{new Date(each_item.created_at).toDateString()}</span>
                                            {each_item.status == 'delivered' && 
                                              <p><b>Date Delivered:</b> <span className="text-muted">{new Date(each_item.updated_at).toDateString()}</span></p>
                                            }
                                          </div>
                                          {each_item.status == "Pending" && <p className="badge bg-warning">Pending...</p>}
                                          {each_item.status == "outForDelivery" && <p className="badge bg-info">Out for delivery</p>}
                                          {each_item.status == "delivered" && <p className="badge bg-success">Delivered</p>}
                                        </div>
                                        <hr />
                                        <div className="col-md-4">
                                          <p>
                                            <b>Contact</b> <br />
                                            <b>Full name:</b> <span className="text-muted">{each_item.firstname} {each_item.lastname}</span> <br />
                                            <b>Email: </b><span className="text-muted">{each_item.email}</span> <br />
                                            <b>Phone:</b> <span className="text-muted">{each_item.phoneNumber}</span> 
              
                                          </p>
                                        </div>
                                        <div className="col-md-4">
                                          <p>
                                            <b>Shipping address</b> <br />
                                            <span className="text-muted">{each_item.address}, {each_item.city}, {each_item.state}, {each_item.country}</span> <br />
                                            {each_item.postalCode && <span><b>Postal code:</b> {each_item.postalCode}</span>}
                                          </p>
                                        </div>
                                        <div className="col-md-4">
                                          <p>
                                            <b>Payment</b> <br />
                                            {/* <b>Shipping fee:</b> <span className="text-muted">{each_item.currency} {each_item.shippingFee}</span> <br /> */}
                                            <b>Total paid:</b> <span className="text-muted">{each_item.currency} {Number(each_item.totalPrice).toLocaleString()}</span>
                                          </p>
                                        </div>
                                        <hr />
                                        <div className="d-flex justify-content-end">
                                          {/* <button className='btn btn-outline-purple btn-sm'>View product</button> */}
                                        </div>
                                        {
                                          console.log((each_item.products))
                                          // JSON.parse(each_item.products).map((product) => {
                                          //   return <div className="col-lg-3 col-md-6 col-sm-6 col-6 ">
                                          //     <div className="text-muted">
                                          //       <img style={{width: "100%", height: "auto", maxWidth: "70px", maxHeight: "100px", objectFit: "contain"}} src="https://www.bundlesbynmeri.com/cdn/shop/files/069EC622-D344-40A0-9DE4-237406C3FCF4.jpg?v=1700781640&width=360" alt="" />
                                          //     <div>
                                          //       <small>Silky double drawn burmese hair 2-3 donors</small> <br />
                                          //     <small>16"16"16</small><br />
                                          //     <small>USD 7252</small> * 3
                                          //     </div>
                                          //     </div>
                                          //   </div>
                                          // })
                                          
                                          
                                        }
                                        {
              (() => {
                  // If products are already an array, there's no need to parse it again
                  const products = typeof each_item.products === 'string'
                    ? JSON.parse(each_item.products)
                    : each_item.products;
            
                  // Check if products is an array before mapping
                  if (Array.isArray(products)) {
                    // const convertedPrice = Number(convertCurrency(product.productPriceInNaira, 'NGN', selectedCurrency)).toLocaleString();
                    return products.map((product, index) => (
                      <div style={{display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "20px"}}>
                        <div style={{display: "flex", border: "1px solid #ddd", borderRadius: "10px", padding: "10px", marginBottom: "20px", alignItems: "center", backgroundColor: "#fafafa", width: "100%", maxWidth: "300px"}}>
                          <img src={product.productImage} alt={product.productName} style={{width: "100%", height: "auto", maxWidth: "80px", objectFit: "cover", borderRadius: "8px", marginRight: "20px"}} />
                          <div style={{flexGrow: "1"}}>
                              <h3 style={{margin: "0", color: "#333", fontSize: "18px"}}>{product.productName}</h3>
                              <p style={{margin: "5px 0", color: "#777", fontSize: "14px"}}>Length: {product.lengthPicked}</p>
                              <p style={{margin: "5px 0", color: "#777", fontSize: "14px"}}>Quantity: {product.quantity}</p>
                              <p style={{margin: "5px 0", color: "#777", fontSize: "14px"}}>Price: {each_item.currency} {convertCurrency(product.productPrice, import.meta.env.VITE_CURRENCY_CODE, each_item.currency).toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
            
            
            
            
            
            
            
            
            
            
            
            
            
            
                      // <div key={index} className="col-lg-3 col-md-5 col-sm-6 col-6">
                      //   <div className="text-muted border" style={{maxWidth: "120px", textAlign: "center"}}>
                      //     <img
                      //     className='card-img-top'
                      //       style={{
                      //         // width: "100%",
                      //         // height: "auto",
                      //         // maxWidth: "70px",
                      //         maxHeight: "70px",
                      //         objectFit: "contain",
                      //       }}
                      //       src={product.productImage} // Use the correct property for the image
                      //       alt={product.productName} // Use the product name for alt text
                      //     />
                      //     <div>
                      //       <small>{product.productName}</small>
                      //       <br />
                      //       <small>{product.lengthPicked}</small> {/* Display length or any other relevant detail */}
                      //       <br />
                      //       <small>quantity * {product.quantity}</small> {/* Display length or any other relevant detail */}
                      //       <br />
                      //       {/* <small>{each_item.currency} {Number(product.price).toLocaleString()}</small>  */}
                      //       <small>{selectedCurrency} {Number(convertCurrency(product.productPriceInNaira, 'NGN', selectedCurrency)).toLocaleString()}</small> 
                      //     </div>
                      //   </div>
                      // </div>
                    ));
                  } else {
                    return null
                  }
               
              })()
            }
            
                                        
                                      </div>
                                    </div>
                                    {showPaginationButtons && totalOrders.total > totalOrders.per_page &&  <PaginationButtons currentPage={currentPage} setCurrentPage={setCurrentPage} perPage={perPage} metaData={totalOrders} />}
                                  </div>
                                })
                              )
                              
                            )
                          }
                
                


                

               
              </div>
            </div>
          </div>
        </div>
      </div>
        <Footer />

    </div>

  );
};

export default UserAccount;







































// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Link } from 'react-router-dom';
// import Cookies from 'js-cookie';
// import "./userAccount.css"
// import Navbar from '../../components/navbar/Navbar'

// const UserAccount = () => {
// //   const [user, setUser] = useState(null);
// //   const [orders, setOrders] = useState([]);
// //   const [isLoading, setIsLoading] = useState(false);
// //   const [error, setError] = useState(null);
// //   const token = Cookies.get('authToken');

// //   // Fetch user data and order history on mount
// //   useEffect(() => {
// //     setIsLoading(true);

// //     axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/account`, {
// //       headers: {
// //         Authorization: `Bearer ${token}`
// //       }
// //     })
// //       .then(response => {
// //         setUser(response.data.user);
// //         setOrders(response.data.orders);
// //         setIsLoading(false);
// //       })
// //       .catch(err => {
// //         setError('Error loading account information');
// //         setIsLoading(false);
// //       });
// //   }, [token]);

// //   if (isLoading) {
// //     return <div>Loading...</div>;
// //   }

// //   if (error) {
// //     return <div>{error}</div>;
// //   }

//   return <div>
//     <Navbar />
//     <div className="user-account-page-container">
//       <div className="account-page">
//         <h2>My Account</h2>
//         {/* {user && ( */}
//           <div className="account-details">
//             <section className="personal-info">
//               <h3>Personal Information</h3>
//               <p><strong>Name:</strong> john Doe</p>
//               <p><strong>Email:</strong> johndoe@gmail.com</p>
//               <p><strong>Phone:</strong> +54567899976677</p>
//               <Link to="/edit-profile">Edit Profile</Link>
//             </section>

//             <section className="order-history">
//               <h3>Order History</h3>
//               {/* {orders.length > 0 ? (
//                 <ul className="order-list">
//                   {orders.map((order) => (
//                     <li key={order.id}>
//                       <Link to={`/order/${order.id}`}>
//                         <div>Order #{order.orderNumber}</div>
//                         <div>{order.date}</div>
//                         <div>Total: {order.total} {order.currency}</div>
//                       </Link>
//                     </li>
//                   ))}
//                 </ul>
//               ) : (
//                 <p>No orders found.</p>
//               )} */}
//                 <ul className="order-list">
//                 <li>
//                       <Link>
//                         <div>Order #7678787788</div>
//                         <div>24th of may 2024</div>
//                         <div>Total: 4000000 naira</div>
//                       </Link>
//                     </li>
//                 </ul>

//             </section>

//             <section className="address-book">
//               <h3>Address Book</h3>
//               {/* <p>{user.address ? `${user.address.street}, ${user.address.city}, ${user.address.zip}` : 'No address on file'}</p> */}
//               <p>user address</p>
//               <Link to="/manage-address">Manage Addresses</Link>
//             </section>
//           </div>
//         {/* )} */}
//       </div>
      
//     </div>
    
//   </div>
// };

// export default UserAccount;
