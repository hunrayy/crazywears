






















import "./cart.css";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import { Link } from "react-router-dom";
import React, { useState, useEffect, useContext, useMemo } from "react";
import { CartContext } from "./CartContext";
import { CurrencyContext } from "../../components/all_context/CurrencyContext";
import CartTotal, { calculateTotal } from "./CartTotal";
import EmptyCart from '../../components/emptyCart/EmptyCart'
import { useAuth } from "../../components/AuthContext/AuthContext";
import { useNavigate } from "react-router-dom";
const Cart = () => {
  const use_auth = useAuth()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const { selectedCurrency, convertCurrency, currencySymbols } = useContext(CurrencyContext);
  const { loading, cartProducts, addToCart, updateCartItemQuantity } = useContext(CartContext);
  const [allCartItems, setAllCartItems] = useState({ products: [] });
  const [removeItemFromCartModal, setRemoveItemFromCartModal] = useState({
    show: false,
    eachItem: null
  })

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
  
  // const initializeCartProducts = async() => {
  //   // console.log(await cartProducts)
  //   // setAllCartItems({products: cartProducts.products})
  //   console.log(cartProducts)
  // }

  useEffect(() => {
    console.log(cartProducts)
    // const storedItems = JSON.parse(localStorage.getItem("cart_items")) || [];
    // const storedItems = cartProducts.then((feedback)=> {
    // setAllCartItems({ products: feedback.products });

    // });
    // console.log(cartProducts)

    setAllCartItems({ products: cartProducts.products });
    // initializeCartProducts()
  }, [cartProducts.products]);
  useEffect(() => {
    console.log(cartProducts)
    if (use_auth.user.is_user_logged && use_auth.user.user.is_an_admin && use_auth.user.user.user === "admin") {
        navigate(`/beautybykiara/admin/dashboard/eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqb2huc21pdGhAZ21haWwuY29tIjoiam9obnNtaXRoQGdtYWlsLmNvbSIsImpvaG4iOiJqb2hu`);
        setIsLoading(false)
    } else {
        setIsLoading(false); // Allow page to render for non-admin users
    }
  }, [use_auth.user, navigate]);
  // const handleRemoveFromCart = (product) => {
  //   addToCart(product);
  // };

  const updateItemQuantity = (each_item, quantity) => {
    const updatedProducts = allCartItems.products.map((item) => item.id === each_item.id ? { ...item, quantity: item.quantity + quantity } : item);
    setAllCartItems({ products: updatedProducts });
    localStorage.setItem("cart_items", JSON.stringify(updatedProducts));
  };

  // const showRemoveFromCartModal = (each_item) => {
  //   setRemoveItemFromCartModal({show: true, eachItem: each_item})
  // }

  const increaseButton = (each_item) => updateCartItemQuantity(each_item.id, each_item.quantity + 1);
  const decreaseButton = (each_item) => {
    if (each_item.quantity > 1) {
      updateCartItemQuantity(each_item.id, each_item.quantity - 1);
    }
  };

  const currencySymbol = currencySymbols[selectedCurrency];
  if (isLoading) {
    
    // return null; // Optionally, you can return a loader here
  }else{ return <div className="cart-page-container">
      <Navbar />
      {/* remove item from cart waring modal start */}
      {removeItemFromCartModal.show && removeItemFromCartModal.eachItem &&
        <div className="remove-item-from-cart-overlay" onClick={()=> setRemoveItemFromCartModal({show: false, eachItem: null})}>
          <div className="remove-item-from-cart-wrapper" onClick={(e) => e.stopPropagation()}>
            <div style={{display: "flex", justifyContent: "space-between"}}>
              <h5>Remove From Cart</h5> <span onClick={()=> setRemoveItemFromCartModal(false)} style={{cursor: "pointer"}}><i className="fa-solid fa-xmark"></i></span>
            </div>
            <p>Do you really want to remove this item from cart?</p>
            <div style={{display: "flex", gap: "20px"}}>
              <button onClick={()=> setRemoveItemFromCartModal({show: false, eachItem: null})} className="btn" style={{border: "1px solid purple", width: "100%", padding: "10px"}}>Cancel</button>
              <button onClick={()=> {addToCart(removeItemFromCartModal.eachItem), setRemoveItemFromCartModal({show: false, eachItem: null})}} className="btn" style={{background: "purple", color: "white", width: "100%", display: "flex", gap: "10px", justifyContent: "center", alignItems: "center"}}>
                <i className="fa-solid fa-trash"></i>
                <span>Remove</span>
              </button>
            </div>
          </div>
        </div>
      }
      {/* remove item from cart waring modal end */}

      <div className="breadcrumb-container">
        <div className="container py-4">
          <nav className="d-flex">
            <h6 className="mb-0">
              <Link to="/" className="text-white-50">Home</Link>
              <span className="text-white-50 mx-2"> | </span>
              <Link className="text-white"><u>Shopping cart</u></Link>
            </h6>
          </nav>
        </div>
      </div>
        {/* {cartProducts?.products?.length == 0 && <EmptyCart />} */}
        {cartProducts?.cartEmpty && !loading || cartProducts.products?.length < 1 && !loading ? <EmptyCart /> : null}
        {loading && <div style={{width: "100%", height: "calc(100vh - var(--marginAboveTop))"}}></div>}

      <section className="my-5" style={cartProducts?.products?.length == 0 ? {display: "none"} : null}>
        <div className="container">
          <div className="row">
            <div className="col-lg-9">
              <div className="card border shadow-0">
                <div className="m-4">
                  <h4 className="card-title mb-4">Your shopping cart</h4>
                  {cartProducts.products?.slice().reverse().map((each_item) => {
                    console.log(each_item)
                    let convertedPrice = convertCurrency(each_item.productPrice, import.meta.VITE_CURRENCY_CODE, selectedCurrency);
                    convertedPrice = Number(convertedPrice);
                    const generateCacheBustString = () => `?cb=${new Date().getTime()}`; // Generates a unique cache-busting string
                    const productPrices = [each_item.productPrice12Inches, each_item.productPrice14Inches, 
                      each_item.productPrice16Inches, each_item.productPrice18Inches, each_item.productPrice20Inches, 
                      each_item.productPrice22Inches, each_item.productPrice24Inches, 
                      each_item.productPrice26Inches, each_item.productPrice28Inches
                    ]
                    return (
                      <div key={each_item.id}>
                      <div className="cart-products-wrapper mb-3">
                        <div className="col-lg-5">
                          <div className="d-flex">
                            <img src={each_item.productImage} className="border rounded me-3" style={{ width: "100px", height: "130px", cursor: "pointer" }} onClick={()=> navigate(`/product/${each_item.id}`, {replace: true})} />
                            <div>
                              <p className="nav-link">{each_item.productName}</p>
                              <p className="text-muted ">{each_item.description}</p>
                              {/* <p> */}
                                <small><b>Length:</b> &nbsp;
                                {each_item.lengthPicked}
                                </small>

                              {/* </p> */}
                            </div>
                          </div>
                        </div>
                        {/* col-lg-4 d-flex flex-row flex-lg-column text-nowrap */}
                        {/* <div style={{display: "flex", justifyContent: "space-between", width: "100%"}}> */}
                        {/* <div style={{display: "flex"}}> */}
                          <div className="cart-text-wrapper">
                            <div className="d-flex align-items-center" style={{ gap: "10px" }}>
                              <button className="cart-increase-decrease-btn" onClick={() => decreaseButton(each_item)} style={{cursor: each_item.quantity == 1 && "not-allowed"}}><i className="fa-solid fa-minus"></i></button>
                              <span>{each_item.quantity}</span>
                              <button className="cart-increase-decrease-btn" onClick={() => increaseButton(each_item)}><i className="fa-solid fa-plus"></i></button>
                            </div>
                              {/* {lengthsOfHair.map((length, index) =>
                              
                                each_item.lengthPicked === length &&
                                convertCurrency(productPrices[index], import.meta.VITE_CURRENCY_CODE, selectedCurrency).toLocaleString()
                                * each_item.quantity
                              )} */}
<div className="">
  {lengthsOfHair.map((length, index) => {
    const normalizeLength = (str) =>
      str.replace(/[\s,]+/g, '').replace(/["']/g, '');

    console.log(
      "Comparing normalized:",
      normalizeLength(each_item.lengthPicked),
      "===",
      normalizeLength(length)
    );

    if (normalizeLength(each_item.lengthPicked) === normalizeLength(length)) {
      console.log("✅ Matched length:", length);

      const rawPrice = productPrices[index];
      console.log("Product price:", rawPrice);

      const unitPrice = convertCurrency(
        rawPrice,
        import.meta.VITE_CURRENCY_CODE,
        selectedCurrency
      );
      console.log("Converted unit price:", unitPrice);

      if (unitPrice === null || unitPrice === undefined) return null;

      const total = unitPrice * each_item.quantity;
      console.log("Final total:", total);

      return (
        <React.Fragment key={index}>
          {currencySymbol}{total.toLocaleString()}
        </React.Fragment>
      );
    }

    return null;
  })}
</div>



                            <button className="btn btn-light border text-danger" onClick={() => setRemoveItemFromCartModal({show: true, eachItem: each_item})}> Remove <i className="fa-solid fa-trash"></i></button>
                        {/* <div style={{}}>
                        </div> */}
                          {/* </div> */}
                        {/* </div> */}
                        </div>
                      </div>
                    </div>
                    );
                  })}
                </div>
                <div className="border-top pt-4 mx-4 mb-4">
                  <p><i className="fas fa-truck text-muted fa-lg"></i> Delivery charges apply based on your location</p>
                  <p className="text-muted">
                    Delivery charges will apply based on your location and the weight of your order. Please refer to our <Link to="/policies/delivery-policy" style={{color: "purple"}}>delivery policy</Link> for detailed information on shipping rates and estimated delivery times. We appreciate your understanding and thank you for shopping with us!
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-3">
              {/* <div className="card mb-3 border shadow-0">
                <div className="card-body">
                  <form>
                    <label>Have coupon?</label>
                    <div style={{ display: "flex", gap: "5px", marginTop: "10px" }}>
                      <input type="text" placeholder="Coupon code" style={{ width: "160px" }} className="form-control" />
                      <button className="btn" style={{ backgroundColor: "#f8f9fa", width: "70px" }} type="button">Apply</button>
                    </div>
                  </form>
                </div>
              </div> */}
              <div className="card shadow-0 border">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <p className="mb-2">Total price:</p>
                    <p className="mb-2">{<CartTotal />}</p>
                  </div>
                  <div className="d-flex justify-content-between">
                    <p className="mb-2">Discount:</p>
                    <p className="mb-2 text-success">$00.00</p>
                  </div>
                  <div className="d-flex justify-content-between">
                    <p className="mb-2">TAX:</p>
                    <p className="mb-2">$00.00</p>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between">
                    <p className="mb-2">Total price:</p>
                    <p className="mb-2 fw-bold">{<CartTotal />}</p>
                  </div>
                  <small><Link style={{color: "purple"}} to="/policies/shipping-policy">Shipping</Link> calculated at checkout.</small>
                  <div className="mt-3">
                    <button onClick={()=> {use_auth.user.is_user_logged == false ? navigate("/login", {replace: true}) : navigate("/products/checkout", {replace: true})}} className="btn w-100 shadow-0 mb-2" style={{ backgroundColor: "purple", color: "white" }}>{use_auth.user.is_user_logged == false ? "Login to check out" : "Proceed to checkout"}</button>
                    <Link to="/" className="btn btn-light w-100 border mt-2">Back to home</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  }
}

export default Cart;















































// import "./cart.css";
// import Navbar from "../../components/navbar/Navbar";
// import Footer from "../../components/footer/Footer";
// import { Link } from "react-router-dom";
// import { useState, useEffect, useContext, useMemo } from "react";
// import { CartContext } from "./CartContext";
// import { CurrencyContext } from "../../components/all_context/CurrencyContext";
// import CartTotal, { calculateTotal } from "./CartTotal";
// import EmptyCart from '../../components/emptyCart/EmptyCart';
// import { useAuth } from "../../components/AuthContext/AuthContext";
// import { useNavigate } from "react-router-dom";
// const Cart = () => {
//   const use_auth = useAuth()
//   const navigate = useNavigate()
//   const [isLoading, setIsLoading] = useState(true)
//   const { selectedCurrency, convertCurrency, currencySymbols } = useContext(CurrencyContext);
//   const { cartProducts, addToCart, updateCartItemQuantity } = useContext(CartContext);
//   const [allCartItems, setAllCartItems] = useState({ products: [] });
//   const [removeItemFromCartModal, setRemoveItemFromCartModal] = useState({
//     show: false,
//     eachItem: null
//   })
  
//   // const initializeCartProducts = async() => {
//   //   // console.log(await cartProducts)
//   //   // setAllCartItems({products: cartProducts.products})
//   //   console.log(cartProducts)
//   // }

//   useEffect(() => {
//     console.log(cartProducts)
//     // const storedItems = JSON.parse(localStorage.getItem("cart_items")) || [];
//     // const storedItems = cartProducts.then((feedback)=> {
//     // setAllCartItems({ products: feedback.products });

//     // });
//     // console.log(cartProducts)

//     setAllCartItems({ products: cartProducts.products });
//     // initializeCartProducts()
//   }, [cartProducts.products]);
//   useEffect(() => {
//     if (use_auth.user.is_user_logged && use_auth.user.user.is_an_admin && use_auth.user.user.user === "admin") {
//         navigate(`/admin/dashboard/${use_auth.user.user.token}`);
//         setIsLoading(false)
//     } else {
//         setIsLoading(false); // Allow page to render for non-admin users
//     }
//   }, [use_auth.user, navigate]);
//   // const handleRemoveFromCart = (product) => {
//   //   addToCart(product);
//   // };

//   const updateItemQuantity = (each_item, quantity) => {
//     const updatedProducts = allCartItems.products.map((item) => item.id === each_item.id ? { ...item, quantity: item.quantity + quantity } : item);
//     setAllCartItems({ products: updatedProducts });
//     localStorage.setItem("cart_items", JSON.stringify(updatedProducts));
//   };

//   // const showRemoveFromCartModal = (each_item) => {
//   //   setRemoveItemFromCartModal({show: true, eachItem: each_item})
//   // }

//   const increaseButton = (each_item) => updateCartItemQuantity(each_item.id, each_item.quantity + 1);
//   const decreaseButton = (each_item) => {
//     if (each_item.quantity > 1) {
//       updateCartItemQuantity(each_item.id, each_item.quantity - 1);
//     }
//   };

//   const currencySymbol = currencySymbols[selectedCurrency];
//   if (isLoading) {
//     return null; // Optionally, you can return a loader here
//   }else{ return <div className="cart-page-container">
//       <Navbar />
//       {/* remove item from cart waring modal start */}
//       {removeItemFromCartModal.show && removeItemFromCartModal.eachItem &&
//         <div className="remove-item-from-cart-overlay" onClick={()=> setRemoveItemFromCartModal({show: false, eachItem: null})}>
//           <div className="remove-item-from-cart-wrapper" onClick={(e) => e.stopPropagation()}>
//             <div style={{display: "flex", justifyContent: "space-between"}}>
//               <h5>Remove From Cart</h5> <span onClick={()=> setRemoveItemFromCartModal(false)} style={{cursor: "pointer"}}><i class="fa-solid fa-xmark"></i></span>
//             </div>
//             <p>Do you really want to remove this item from cart?</p>
//             <div style={{display: "flex", gap: "20px"}}>
//               <button onClick={()=> setRemoveItemFromCartModal({show: false, eachItem: null})} className="btn" style={{border: "1px solid purple", width: "100%", padding: "10px"}}>Cancel</button>
//               <button onClick={()=> {addToCart(removeItemFromCartModal.eachItem), setRemoveItemFromCartModal({show: false, eachItem: null})}} className="btn" style={{background: "purple", color: "white", width: "100%", display: "flex", gap: "10px", justifyContent: "center", alignItems: "center"}}>
//                 <i className="fa-solid fa-trash"></i>
//                 <span>Remove</span>
//               </button>
//             </div>
//           </div>
//         </div>
//       }
//       {/* remove item from cart waring modal end */}

//       <div className="breadcrumb-container">
//         <div className="container py-4">
//           <nav className="d-flex">
//             <h6 className="mb-0">
//               <Link to="/" className="text-white-50">Home</Link>
//               <span className="text-white-50 mx-2"> | </span>
//               <Link className="text-white"><u>Shopping cart</u></Link>
//             </h6>
//           </nav>
//         </div>
//       </div>
//         {/* {cartProducts?.products?.length == 0 && <EmptyCart />} */}
//         {cartProducts?.cartEmpty && <EmptyCart />}

//       <section className="my-5" style={cartProducts?.products?.length == 0 ? {display: "none"} : null}>
//         <div className="container">
//           <div className="row">
//             <div className="col-lg-9">
//               <div className="card border shadow-0">
//                 <div className="m-4">
//                   <h4 className="card-title mb-4">Your shopping cart</h4>
//                   {cartProducts.products?.slice().reverse().map((each_item) => {
//                     console.log(each_item)
//                     let convertedPrice = convertCurrency(each_item.productPrice, import.meta.VITE_CURRENCY_CODE, selectedCurrency);
//                     convertedPrice = Number(convertedPrice);
//                     const generateCacheBustString = () => `?cb=${new Date().getTime()}`; // Generates a unique cache-busting string
//                     return (
//                       <div key={each_item.id}>
//                       <div className="cart-products-wrapper mb-3">
//                         <div className="col-lg-5">
//                           <div className="d-flex">
//                             <img src={each_item.productImage} className="border rounded me-3" style={{ width: "100px", height: "130px", cursor: "pointer" }} onClick={()=> navigate(`/product/${each_item.id}`, {replace: true})} onError={(e)=> {e.target.onError = null, e.target.src = 'data:image/png;base64,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'}} />
//                             {/* <img 
//   src={`${each_item.img}?${new Date().getTime()}`} // Appends a timestamp as a query string
//   className="border rounded me-3" 
//   style={{ width: "100px", height: "130px", cursor: "pointer" }} 
//   onClick={() => navigate(`/product/${each_item.id}`, { replace: true })} 
// /> */}

// {/* <img 
// loading="lazy"
//   src={`${each_item.img}${generateCacheBustString()}`} // Append the cache-busting string dynamically
//   className="border rounded me-3" 
//   style={{ width: "100px", height: "130px", cursor: "pointer" }} 
//   onClick={() => navigate(`/product/${each_item.id}`, { replace: true })} 
//   onError={(e)=> {e.target.onError = null, e.target.src = 'data:image/png;base64,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'}}
// /> */}


//                             <div>
//                               <a href="#" className="nav-link">{each_item.productName}</a>
//                               <p className="text-muted ">{each_item.description}</p>
//                               {/* <p> */}
//                                 <small><b>Length:</b> &nbsp;
//                                 {each_item.lengthPicked}
//                                 </small>

//                               {/* </p> */}
//                             </div>
//                           </div>
//                         </div>
//                         {/* col-lg-4 d-flex flex-row flex-lg-column text-nowrap */}
//                         <div style={{display: "flex", justifyContent: "space-between", width: "100%"}}>
//                         <div style={{display: "flex"}}>
//                           <div className="cart-text-wrapper" >
//                             <div className="d-flex align-items-center mx-lg-5" style={{ gap: "10px" }}>
//                               <button className="cart-increase-decrease-btn" onClick={() => decreaseButton(each_item)}><i className="fa-solid fa-minus"></i></button>
//                               <span>{each_item.quantity}</span>
//                               <button className="cart-increase-decrease-btn" onClick={() => increaseButton(each_item)}><i className="fa-solid fa-plus"></i></button>
//                             </div>
//                             <div className="">
//                               <span className="h6 pl-4 pr-2">{currencySymbol}</span>
//                               <span className="h6">{convertedPrice.toLocaleString()}</span>
//                             </div>
//                           </div>
//                         </div>
//                         <div style={{}}>
//                           <button className="btn btn-light border text-danger" onClick={() => setRemoveItemFromCartModal({show: true, eachItem: each_item})}> Remove <i className="fa-solid fa-trash"></i></button>
//                         </div>
//                         </div>
//                       </div>
//                     </div>
//                     );
//                   })}
//                 </div>
//                 <div className="border-top pt-4 mx-4 mb-4">
//                   <p><i className="fas fa-truck text-muted fa-lg"></i> Delivery charges apply based on your location</p>
//                   <p className="text-muted">
//                     Delivery charges will apply based on your location and the weight of your order. Please refer to our <Link to="/policies/delivery-policy">delivery policy</Link> for detailed information on shipping rates and estimated delivery times. We appreciate your understanding and thank you for shopping with us!
//                   </p>
//                 </div>
//               </div>
//             </div>
//             <div className="col-lg-3">
//               {/* <div className="card mb-3 border shadow-0">
//                 <div className="card-body">
//                   <form>
//                     <label>Have coupon?</label>
//                     <div style={{ display: "flex", gap: "5px", marginTop: "10px" }}>
//                       <input type="text" placeholder="Coupon code" style={{ width: "160px" }} className="form-control" />
//                       <button className="btn" style={{ backgroundColor: "#f8f9fa", width: "70px" }} type="button">Apply</button>
//                     </div>
//                   </form>
//                 </div>
//               </div> */}
//               <div className="card shadow-0 border">
//                 <div className="card-body">
//                   <div className="d-flex justify-content-between">
//                     <p className="mb-2">Total price:</p>
//                     <p className="mb-2">{<CartTotal />}</p>
//                   </div>
//                   <div className="d-flex justify-content-between">
//                     <p className="mb-2">Discount:</p>
//                     <p className="mb-2 text-success">$00.00</p>
//                   </div>
//                   <div className="d-flex justify-content-between">
//                     <p className="mb-2">TAX:</p>
//                     <p className="mb-2">$00.00</p>
//                   </div>
//                   <hr />
//                   <div className="d-flex justify-content-between">
//                     <p className="mb-2">Total price:</p>
//                     <p className="mb-2 fw-bold">{<CartTotal />}</p>
//                   </div>
//                   <div className="mt-3">
//                     <button onClick={()=> {use_auth.user.is_user_logged == false ? navigate("/login", {replace: true}) : navigate("/products/checkout", {replace: true})}} className="btn w-100 shadow-0 mb-2" style={{ backgroundColor: "purple", color: "white" }}>{use_auth.user.is_user_logged == false ? "Login to check out" : "Proceed to checkout"}</button>
//                     <Link to="/" className="btn btn-light w-100 border mt-2">Back to home</Link>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       <Footer />
//     </div>
//   }
// }

// export default Cart;































// import "./cart.css"
// import Navbar from "../../components/navbar/Navbar"
// import Footer from "../../components/footer/Footer"
// import { Link } from "react-router-dom"
// import { useState, useEffect, useContext } from "react"
// import { CartContext } from "./CartContext"
// import { CurrencyContext } from "../../components/all_context/CurrencyContext";
// import CartTotal from "./CartTotal"
// import EmptyCart from '../../components/emptyCart/EmptyCart'


// const Cart = () => {
//   const { selectedCurrency, convertCurrency, currencySymbols } = useContext(CurrencyContext);
//     const { cartProducts, addToCart, updateCartItemQuantity } = useContext(CartContext);
//     const [isCartEmpty, setIsCartEmpty] = useState(null)
//     const [allCartItems, setAllCartItems] = useState({
//         products: [],
//     });

//     useEffect(() => {
//         const storedItems = JSON.parse(localStorage.getItem("cart_items"));
//         if (storedItems) {
//             setAllCartItems((prevState) => ({
//                 ...prevState,
//                 products: storedItems
//             }));
//         }

//         storedItems.length == 0 ? setIsCartEmpty(true) : setIsCartEmpty(false)
    
//     }, [cartProducts.products]); // Add cartProducts.products as a dependency to re-render when it changes
//     const handleRemoveFromCart = (product) => {
//         addToCart(product); // Use addToCart to remove the product
//         window.scrollTo(0, 0);
//     };
    
    

//     const updateItemQuantity = (each_item, quantity) => {
//         const updatedProducts = allCartItems.products.map((item) => {
//             if (item.id === each_item.id) {
//                 return { ...item, quantity: item.quantity + quantity };
//             }
//             return item;
//         });
//         const updatedCartItems = { ...allCartItems, products: updatedProducts };
//         setAllCartItems(updatedCartItems);
//         localStorage.setItem("cart_items", JSON.stringify(updatedCartItems.products));
//     };
//     const increaseButton = (each_item) => {
//         updateCartItemQuantity(each_item.id, each_item.quantity + 1);
//     };
//     const decreaseButton = (each_item) => {
//         if (each_item.quantity > 1) {
//             updateCartItemQuantity(each_item.id, each_item.quantity - 1);
//         }
//     };



//     const currencySymbol = currencySymbols[selectedCurrency];
//     if(isCartEmpty){
//         return (
//             <div className="cart-page-container">
//                 <Navbar />
//                 {/* bread crumbs */}
//                 <div className="" style={{marginTop: "var(--marginAboveTop)", backgroundColor: "black"}}>
//                     <div className="container py-4">
//                         <nav className="d-flex">
//                             <h6 className="mb-0">
//                                 <Link to="/" className="text-white-50">Home</Link>
//                                 <span className="text-white-50 mx-2"> | </span>
//                                 <Link className="text-white"><u>Shopping cart</u></Link>
//                             </h6>
//                         </nav>
//                     </div>
//                 </div>
//                 {/* bread crumbs */}
//                 <div>
//                     <EmptyCart />
//                 </div>
//                 <Footer />
//             </div>
//         )
//     }


//     return (
//         <div className="cart-page-container">
//             <Navbar />
//             {/* bread crumbs */}
//             <div className="" style={{marginTop: "var(--marginAboveTop)", backgroundColor: "black"}}>
//                 <div className="container py-4">
//                     <nav className="d-flex">
//                         <h6 className="mb-0">
//                             <Link to="/" className="text-white-50">Home</Link>
//                             <span className="text-white-50 mx-2"> | </span>
//                             <Link className="text-white"><u>Shopping cart</u></Link>
//                         </h6>
//                     </nav>
//                 </div>
//             </div>
//             {/* bread crumbs */}

//             <section className="my-5">
//                 <div className="container">
//                     <div className="row">
//                         {/* <!-- cart --> */}
//                         <div className="col-lg-9">
//                             <div className="card border shadow-0">
//                                 <div className="m-4">
//                                     <h4 className="card-title mb-4">Your shopping cart</h4>
//                                     {allCartItems.products.slice().reverse()?.map((each_item) => {
//                                         let convertedPrice = convertCurrency(each_item.price, import.meta.VITE_CURRENCY_CODE, selectedCurrency);
//                                         convertedPrice = Number(convertedPrice)
//                                         return <div key={each_item.id}>
//                                             <div className="row gy-3 mb-4" style={{display: "flex", justifyContent: "space-between"}}>
//                                                 <div className="col-lg-5">
//                                                     <div className="me-lg-5">
//                                                         <div className="d-flex">
//                                                             <img src={each_item.img} className="border rounded me-3" style={{width: "100px", height: "130px"}} />
//                                                             <div className="">
//                                                                 <a href="#" className="nav-link">{each_item.name}</a>
//                                                                 <p className="text-muted px-3">{each_item.description}</p>
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                                 <div className="col-lg-4 col-sm-6 col-6 d-flex flex-row flex-lg-column flex-xl-row text-nowrap">
//                                                     <div className="d-flex align-items-center" style={{ gap: "10px" }}>
//                                                         <button className="cart-increase-decrease-btn" onClick={()=> decreaseButton(each_item)}><i className="fa-solid fa-minus"></i></button>
//                                                         <span>{each_item.quantity}</span>
//                                                         <button className="cart-increase-decrease-btn" onClick={()=> increaseButton(each_item)}><i className="fa-solid fa-plus"></i></button>
//                                                     </div>
//                                                     <div className="d-flex align-items-center col-lg-6">
//                                                         <span className="h6 pl-4 pr-2">{currencySymbol}</span>
//                                                         <span className="h6">{convertedPrice.toLocaleString()}</span>
//                                                     </div>
//                                                 </div>


//                                                 <div className="pr-2 d-flex justify-content-sm-center justify-content-md-start justify-content-lg-center justify-content-xl-end mb-2 align-items-center">
//                                                     <div className="float-md-end">
//                                                         {/* <a href="#!" className="btn btn-light border px-2 icon-hover-primary"><i className="fas fa-heart fa-lg px-1 text-secondary"></i></a> */}
//                                                         <button className="btn btn-light border text-danger icon-hover-danger" onClick={() => handleRemoveFromCart(each_item)}> Remove <i class="fa-solid fa-trash"></i></button>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     })}
//                                 </div>

//                                 <div className="border-top pt-4 mx-4 mb-4">
//                                     <p><i className="fas fa-truck text-muted fa-lg"></i> Delivery charges apply based on your location</p>
//                                     <p className="text-muted">
//                                     Delivery charges will apply based on your location and the weight of your order. Please refer to our <Link to="/policies/delivery-policy">delivery policy</Link> for detailed information on shipping rates and estimated delivery times. We appreciate your understanding and thank you for shopping with us!
//                                     </p>
//                                 </div>
//                             </div>
//                         </div>
//                         {/* <!-- cart --> */}
//                         {/* <!-- summary --> */}
//                         <div className="col-lg-3">
//                             <div className="card mb-3 border shadow-0">
//                                 <div className="card-body">
//                                     <form>
//                                         <div className="form-group" >
//                                             {/* <label className="form-label">Have coupon?</label>
//                                             <div className="input-group">
//                                                 <input type="text" className="form-control border" name="" placeholder="Coupon code" />
//                                                 <button className="btn btn-light border">Apply</button>
//                                             </div> */}
//                                             <label>Have coupon?</label>
//                                             <form style={{display: "flex", gap: "5px", marginTop: "10px"}}>
//                                                 <input type="text" placeholder="Coupon code" style={{width: "160px"}} className="form-control" />
//                                                 <button className="btn" style={{backgroundColor: "#f8f9fa", width:"70px"}} type="button">Apply</button>
//                                             </form>
//                                         </div>
//                                     </form>
//                                 </div>
//                             </div>
//                             <div className="card shadow-0 border">
//                                 <div className="card-body">
//                                     <div className="d-flex justify-content-between">
//                                         <p className="mb-2">Total price:</p>
//                                         <p className="mb-2">{<CartTotal />}</p>
//                                         {/* <p className="mb-2">{currencySymbol}{cartProducts.totalPrice}</p> */}
//                                     </div>
//                                     <div className="d-flex justify-content-between">
//                                         <p className="mb-2">Discount:</p>
//                                         <p className="mb-2 text-success">$00.00</p>
//                                     </div>
//                                     <div className="d-flex justify-content-between">
//                                         <p className="mb-2">TAX:</p>
//                                         <p className="mb-2">$00.00</p>
//                                     </div>
//                                     <hr />
//                                     <div className="d-flex justify-content-between">
//                                         <p className="mb-2">Total price:</p>
//                                         <p className="mb-2 fw-bold">{<CartTotal />}</p>
//                                     </div>

//                                     <div className="mt-3">
//                                         <div className="btn w-100 shadow-0 mb-2" style={{backgroundColor: "purple", color: "white"}}> Proced to checkout </div>
//                                         <Link to="/" className="btn btn-light w-100 border mt-2"> Back to home </Link>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                         {/* <!-- summary --> */}
//                     </div>
//                 </div>
//             </section>

//             <Footer />
//         </div>
//     );
// }

// export default Cart;
























// import "./cart.css"
// import Navbar from "../../components/navbar/Navbar"
// import Footer from "../../components/footer/Footer"
// import { useState, useEffect, useContext } from "react"
// import { CartContext } from "./CartContext"
// const Cart = () => {
//     const { addToCart } = useContext(CartContext)
//     const [allCartItems, setAllCartItems] = useState({
//         products: [],
//         totalPrice: 0
//     })


    
//     // const calculateTotalPrice = (products) => {
//     //     return products.reduce((acc, item) => acc + parseFloat(item.price), 0);
//     // };

//     // const removeFromCart = (product) => {
//     //     const updatedProducts = allCartItems.products.filter(item => item.id !== product.id);
//     //     const newTotalPrice = calculateTotalPrice(updatedProducts);
    
//     //     // Store updated list to localStorage
//     //     localStorage.setItem("cart_items", JSON.stringify(updatedProducts));
        
//     //     // Update state with the new list of products and total price
//     //     setAllCartItems((prevState) => ({
//     //         ...prevState,
//     //         products: updatedProducts,
//     //         totalPrice: newTotalPrice
//     //     }));
//     // };
    
//     useEffect(()=> {
//         //retrieve items from localStorage on page load
//         const storedItems = JSON.parse(localStorage.getItem("cart_items"))
//         if(storedItems){
//             //there are items in the storage
//             // const initialTotalPrice = calculateTotalPrice(storedItems);
//             setAllCartItems((prevState) => ({
//                 ...prevState,
//                 products: storedItems,
//                 totalPrice: 0
//             }))

            

            
            
//         }else{
//             //there is no item in the storage
//         }
//     }, [])
//     const totalItems = allCartItems.products?.length || 0;

//     return <div className="cart-page-container">
//         <Navbar />
//         {/* bread crumbs */}
//         <div className="" style={{marginTop: "var(--marginAboveTop)", backgroundColor: "black"}}>
//             <div className="container py-4">
            
//                 <nav className="d-flex">
//                     <h6 className="mb-0">
//                     <a href="" className="text-white-50">Home</a>
//                     <span className="text-white-50 mx-2"> | </span>
//                     <a href="" className="text-white"><u>Shopping cart</u></a>
//                     </h6>
//                 </nav>

//             </div>
//         </div>
//         {/* bread crumbs */}

//         <section className="my-5">
//             <div className="container">
//                 <div className="row">
//                 {/* <!-- cart --> */}
//                 <div className="col-lg-9">
//                     <div className="card border shadow-0">
//                     <div className="m-4">
//                         <h4 className="card-title mb-4">Your shopping cart</h4>
//                         {allCartItems.products?.map((each_item) => {
                            
//                             return <div>
//                             <div className="row gy-3 mb-4">
//                                 <div className="col-lg-5">
//                                     <div className="me-lg-5">
//                                     <div className="d-flex">
//                                         <img src={each_item.img} className="border rounded me-3" style={{width: "100px", height: "130px"}} />
//                                         <div className="">
//                                         <a href="#" className="nav-link">{each_item.name}</a>
//                                         <p className="text-muted px-3">{each_item.description}</p>
//                                         </div>
//                                     </div>
//                                     </div>
//                                 </div>
//                                 <div className="col-lg-2 col-sm-6 col-6 d-flex flex-row flex-lg-column flex-xl-row text-nowrap">
//                                     <div className="">
//                                     <select style={{width: "100px"}} className="form-select me-4">
//                                         <option>1</option>
//                                         <option>2</option>
//                                         <option>3</option>
//                                         <option>4</option>
//                                     </select>
//                                     </div>
//                                     <div className="">
//                                     <span className="h6 px-3">{each_item.price}</span> <br />
//                                     {/* <small className="text-muted text-nowrap"> $460.00 / per item </small> */}
//                                     </div>
//                                 </div>
//                                 <div className="col-lg col-sm-6 d-flex justify-content-sm-center justify-content-md-start justify-content-lg-center justify-content-xl-end mb-2">
//                                     <div className="float-md-end">
//                                     <a href="#!" className="btn btn-light border px-2 icon-hover-primary"><i className="fas fa-heart fa-lg px-1 text-secondary"></i></a>
//                                     <a href="#" className="btn btn-light border text-danger icon-hover-danger" onClick={()=>addToCart(each_item)}> Remove</a>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                         })}
//                     </div>

//                     <div className="border-top pt-4 mx-4 mb-4">
//                         <p><i className="fas fa-truck text-muted fa-lg"></i> Free Delivery within 1-2 weeks</p>
//                         <p className="text-muted">
//                         Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
//                         aliquip
//                         </p>
//                     </div>
//                     </div>
//                 </div>
//                 {/* <!-- cart --> */}
//                 {/* <!-- summary --> */}
//                 <div className="col-lg-3">
//                     <div className="card mb-3 border shadow-0">
//                     <div className="card-body">
//                         <form>
//                         <div className="form-group">
//                             <label className="form-label">Have coupon?</label>
//                             <div className="input-group">
//                             <input type="text" className="form-control border" name="" placeholder="Coupon code" />
//                             <button className="btn btn-light border">Apply</button>
//                             </div>
//                         </div>
//                         </form>
//                     </div>
//                     </div>
//                     <div className="card shadow-0 border">
//                     <div className="card-body">
//                         <div className="d-flex justify-content-between">
//                         <p className="mb-2">Total price:</p>
//                         <p className="mb-2">${allCartItems.totalPrice}</p>
//                         </div>
//                         <div className="d-flex justify-content-between">
//                         <p className="mb-2">Discount:</p>
//                         <p className="mb-2 text-success">$00.00</p>
//                         {/* <p className="mb-2 text-success">-$60.00</p> */}
//                         </div>
//                         <div className="d-flex justify-content-between">
//                         <p className="mb-2">TAX:</p>
//                         <p className="mb-2">$00.00</p>
//                         {/* <p className="mb-2">$14.00</p> */}
//                         </div>
//                         <hr />
//                         <div className="d-flex justify-content-between">
//                         <p className="mb-2">Total price:</p>
//                         <p className="mb-2 fw-bold">${allCartItems.totalPrice}</p>
//                         </div>

//                         <div className="mt-3">
//                         <a href="#" className="btn w-100 shadow-0 mb-2" style={{backgroundColor: "purple", color: "white"}}> Clear Cart </a>
//                         <a href="#" className="btn btn-light w-100 border mt-2"> Back to shop </a>
//                         </div>
//                     </div>
//                     </div>
//                 </div>
//                 {/* <!-- summary --> */}
//                 </div>
//             </div>
//         </section>

//         <Footer />



//     </div>
// }
// export default Cart