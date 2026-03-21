
import productStore from "../../components/products/products.json";
import { json, useParams } from "react-router-dom";
import { useState, useEffect, useContext, useRef } from "react";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import PageNotFound from "../pageNotFound/PageNotFound";
import "./singleProduct.css";
import { CurrencyContext } from "../../components/all_context/CurrencyContext";
import { CartContext } from "../cart/CartContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useSingleProduct } from "./useSingleProduct";


const SingleProduct = () => {
 const navigate = useNavigate();
  const { cartProducts, addToCart, updateCartItemLength, isAnyVariantInCart } = useContext(CartContext);
  const { selectedCurrency, convertCurrency, currencySymbols } = useContext(CurrencyContext);
  let { productId } = useParams();

  const { product, productSizes, productPrices, isLoading, error, pageNotFound } = useSingleProduct(productId);
console.log(product)
console.log(productSizes)
console.log(productPrices)


  const [selectedImage, setSelectedImage] = useState(""); // State for the enlarged image

  const [sizeState, setSizeState] = useState({
    sizes: [],
    sizePicked: ""
  });

  useEffect(() => {
    console.log(product)
    if (productSizes.length > 0) {
      setSizeState({
        sizes: productSizes,
        sizePicked: productSizes[0]  // Default to first size
      });
    }
  }, [productPrices]);

  // useEffect(() => {
  //   if (product.pageNotFound) {
  //     navigate("/page-not-found");
  //   }
  // }, [product.pageNotFound, navigate]);


  useEffect(() => {
  if (!isLoading && pageNotFound) {
    navigate("/page-not-found");
  }
}, [pageNotFound, isLoading, navigate]);





//   useEffect(() => {
//   if (!isLoading && product.pageNotFound) {
//     navigate("/page-not-found");
//   }
// }, [product.pageNotFound, isLoading, navigate]);


  // Check localStorage cart to set picked size if present
  useEffect(() => {
    if (!product.id) return;
    const cartItems = JSON.parse(localStorage.getItem("cart_items")) || [];
    const cartItem = cartItems.find(item => item.id === product.id);
    if (cartItem && cartItem.pricePicked) {
      if (productPrices.includes(cartItem.pricePicked)) {
        setSizeState(prev => ({ ...prev, sizePicked: cartItem.sizePicked }));
      } else {
        setSizeState(prev => ({ ...prev, sizePicked: productSizes[0] || "" }));
      }
    }
  }, [product.id, productPrices]);

 const handleAddToCart = () => {
    const variant = { size: sizeState.sizePicked }; // store size under variant
    addToCart(product, variant);
  };

//   const prices = JSON.parse(product.productPrices);

// const smallestPrice = Math.min(
//   ...prices.map(p => Number(p.price))
// );

// console.log(smallestPrice); // 80000
  const handlesizeChange = (size, sizePrice) => {
    setSizeState(prevState => ({ ...prevState, sizePicked: size }));
  };

  const handleImageClick = (img) => {
    setSelectedImage(img);
  };

  const cartItems = JSON.parse(localStorage.getItem("cart_items")) || [];
  const inCart = cartItems.some(
    item => item.id === product.id && item.variant?.size === sizeState.sizePicked
  );

  const currencySymbol = currencySymbols[selectedCurrency] || '';

  const productImages = [
    product.img,
    ...(product.subImage1 ? [product.subImage1] : []),
    ...(product.subImage2 ? [product.subImage2] : []),
    ...(product.subImage3 ? [product.subImage3] : [])
  ];

  const convertedPrice = convertCurrency(
    productPrices[productPrices.indexOf(sizeState.sizePicked)] || 0,
    import.meta.env.VITE_CURRENCY_CODE,
    selectedCurrency
  );

  // if (isLoading) return <p>Loading...</p>;
const preloadImage = (src)=> {
  const img = new Image();
  img.src = src
}
  useEffect(()=> {
    preloadImage(product.img)
  })

if (error) return <div><p>Error retrieving product.</p></div>;
  return (
    <div>
      {product.pageNotFound ? (
        <PageNotFound />
      ) : (
        <div>
          <Navbar />
          <section className="py-5" style={{ backgroundColor: "var(--bodyColor)", marginTop: "var(--marginAboveTop)" }}>

            {/* {cartProducts.productAddedToCartAnimation && (
              <div style={{ width: "100%", height: "50px", backgroundColor: "green", display: "flex", justifyContent: "center", alignItems: "center", color: "white", position: "fixed", top: "0", zIndex: "2" }}>
                {cartProducts.addToCartAnimationMessage} 
              </div>
            )}
            {cartProducts.sizeUpdateMessage && (
              <div style={{ width: "100%", height: "50px", backgroundColor: "green", display: "flex", justifyContent: "center", alignItems: "center", color: "white", position: "fixed", top: "0", zIndex: "2" }}>
                {cartProducts.sizeUpdateMessage}
              </div>
            )} */}
            <div className="container">
              <div className="row gx-">
                <aside className="col-lg-6">
                  {/* <div style={{minHeight: "450px", backgroundColor: "#e3dadd"}}>
                    {
                      isLoading ? <div className="placeholder col-9" style={{width: "100%", height: "500px"}}>
                        </div>
                      : <div className="single-product-image-scroll-container">
                      
                        {productImages.map((image, index) => (
                            <img
                                key={index}
                                src={image}
                                alt={`Product Image ${index + 1}`}
                                className="single-product-scrollable-image"
                            />
                        ))}
                      </div>
                    }
                  </div> */}

                  <div style={{ minHeight: "450px", backgroundColor: "#e3dadd" }}>
  {
    isLoading ? (
      <div
        className="placeholder col-9"
        style={{ width: "100%", height: "500px" }}
      ></div>
    ) : (
        <div className="single-product-image-scroll-container">
        {productImages.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Product Image ${index + 1}`}
              className="single-product-scrollable-image fade-in-image"
              style={{ opacity: 0}}
              onLoad={(e) => { e.target.style.opacity = 1; }}
            />
          ))}
           {/* Navigation Buttons */}
  
        </div> 
      
    )
  }
</div>


                  
                    
                  
                 
                </aside>
                <main className="col-lg-6">
                  <div className="ps-lg-3">
                    <div style={{minHeight: "30px"}}>
                      {
                      isLoading ? <h4 className="placeholder w-100 mt-3" style={{height: "30px"}}></h4> :
                      <h4 className="title mt-3" style={{ fontSize: "30px", color: "black"}}>{product.name}</h4>
                      }
                    </div>
                    
                    
                      
                      <div style={{minHeight: "20px"}}>
                        {
                        isLoading ? <div className="placeholder mt-3 w-50" style={{height: "30px"}}></div> :
                          <div className="d-flex flex-row my-3">
                            <div className="text-warning mb-1 me-2">
                              <i className="fa fa-star"></i>
                              <i className="fa fa-star"></i>
                              <i className="fa fa-star"></i>
                              <i className="fa fa-star"></i>
                              <i className="fa fa-star"></i>
                            </div>
                            <span className="text-success ms-2 ml-3">In stock</span>
                          </div>
                        }
                      </div>
                    
                    


                        {/* <span><b>{convertedPrice.toLocaleString()}</b></span> */}
                    <div className="mb-3 d-flex" style={{minHeight: "30px"}}>
                      {
                        isLoading ? <div className="placeholder mt-3" style={{width: "150px", height: "30px"}}></div> :
                        <div style={{display: "flex"}}>
                          <div className="h5" style={{display: "flex", minWidth: "30px"}}>
                            <strong>
                              <mark>
                            <span>{currencySymbol}</span>
                              
                            {sizeState.sizes.map((size, index) => {
                              if (sizeState.sizePicked === size) {
                                console.log(product)
                                const converted = convertCurrency(productPrices[index], import.meta.env.VITE_CURRENCY_CODE, selectedCurrency);

                                return converted !== null ? converted.toLocaleString() : <span className='placeholder' style={{width: "30px", }}></span> ; // or show fallback
                              }
                              return null;
                            })}
                            </mark>
                            </strong>
           

                          </div>
                          <span className="text-muted">&nbsp;/&nbsp;per item</span>

                        </div>
                      }
                    </div>
                    <div style={{minHeight: "50px"}}>
                      {isLoading ? <div className="placeholder" style={{width: "50%", height: "30px"}}></div> :
                      <div className="text-muted mb-2">Category: {product?.category?.name}</div>}
                      {!isLoading && <div className="text-muted">size: {sizeState.sizePicked}</div> }
                     
                    </div>
                          
                          
                    <div className="row mt-2">
                        <div className="sizes-container">
                          {isLoading? <div className="placeholder mt-3" style={{width: "100%", height: "80px"}}></div>
                          : sizeState.sizes?.map((size, index) => {
                            return <div key={index} className="">
                              <button
                                className="size-button btn"
                                style={sizeState.sizePicked === size ? { backgroundColor: "black", color: "white" } : null }
                                onClick={() => {
                                  const index = sizeState.sizes.findIndex(item => item == size); // Find the index of the selected size
                                  const price = productPrices[index]; // Get the price for the selected size
                                  handlesizeChange(size, price); // Pass the specific price instead of an array
                                }}
                              >
                                {size}
                              </button>
                            </div>
                          })}
                        </div>
                      
                    </div>
                    <hr />
                    {
                      isLoading ? <div className="placeholder w-100" style={{height: "50px"}}></div> : 
                      (product.img && <div className="d-grid">
                        <button
                          className="btn hover-button"
                          // style={inCart || isRecentlyAdded ? { backgroundColor: "black"} : { border: "1px solid black", color: "black" }}
                          // style={inCart || isRecentlyAdded ? { backgroundColor: "black"} : { border: "1px solid black", color: "black" }}
                          style={inCart ? {background: "black", color: "white"} : null}
                          onClick={handleAddToCart}
                        >
                          {inCart ? "Added to cart" : <span>Add to cart <i className="fas fa-shopping-cart m-1 me-md-2"></i></span>}
                        </button>
                      </div>)
                    }
                    
                   
                    
                  </div>
                </main>
              </div>
            </div>
          </section>

               <section className="border-top py-4" style={{backgroundColor: "var(--bodyColor)"}}>
       <div className="container">
         <div className="row gx-3 contain">
           <div className="col-lg-12 mb-4 ">
             <div className="border rounded-2 px-4 py-5 p-md-5 bg-white" style={{color: "black"}}>
               <p>FREQUENTLY ASKED QUESTIONS</p>
               <h1>FAQ</h1>
               <p>  
                 <b><i className="fa-solid fa-truck-fast mr-2">&nbsp;&nbsp;</i>Shipping & processing information</b>
               </p>
               <div className="text-muted">
                 <p>It takes us an average of 3-5 working days to process orders allow a few more for custom orders.</p>
                 {/* <p>Please allow another 1-2 working days for shipping on all orders within the uk.</p> */}
                 <p>Shipping times varies from 5-10 working days for international orders.</p>
               </div>
               <p>
                 <b>Returns, cancellations and refunds</b>
               </p>
               <div className="text-muted">
                 <p>Due to the nature of our products we do not offer casual refunds though you would be entitled to a refund/return in cases where you receive the wrong item or a defective product etc </p>
                 <p>You can cancel your order if you change your mind without any reasons necessary until it starts getting processed (on hold) this is usually under 24 hours.</p>
                 <Link to="/policies/refund-policy" style={{color: "purple"}}>View our full refund policy</Link>
               </div>
             </div>
           </div>
           
        </div>
      </div>
    </section>
          <Footer />
        </div>
      )}
    </div>
  );
};

export default SingleProduct;
















































// import productStore from "../../components/products/products.json";
// import { json, useParams } from "react-router-dom";
// import { useState, useEffect, useContext, useRef } from "react";
// import Navbar from "../../components/navbar/Navbar";
// import Footer from "../../components/footer/Footer";
// import PageNotFound from "../pageNotFound/PageNotFound";
// import "./singleProduct.css";
// import { CurrencyContext } from "../../components/all_context/CurrencyContext";
// import { CartContext } from "../cart/CartContext";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";
// import { Link } from "react-router-dom";
// import { useSingleProduct } from "./useSingleProduct";


// const SingleProduct = () => {
//  const navigate = useNavigate();
//   const { cartProducts, addToCart, updateCartItemLength } = useContext(CartContext);
//   const { selectedCurrency, convertCurrency, currencySymbols } = useContext(CurrencyContext);
//   let { productId } = useParams();

//   const { product, productSizes, productPrices, isLoading, error, pageNotFound } = useSingleProduct(productId);
// console.log(product)
// console.log(productSizes)
// console.log(productPrices)


//   const [selectedImage, setSelectedImage] = useState(""); // State for the enlarged image

//   const [sizeState, setSizeState] = useState({
//     sizes: [],
//     sizePicked: ""
//   });

//   useEffect(() => {
//     console.log(product)
//     if (productSizes.length > 0) {
//       setSizeState({
//         sizes: productSizes,
//         sizePicked: productSizes[0]  // Default to first size
//       });
//     }
//   }, [productPrices]);

//   // useEffect(() => {
//   //   if (product.pageNotFound) {
//   //     navigate("/page-not-found");
//   //   }
//   // }, [product.pageNotFound, navigate]);


//   useEffect(() => {
//   if (!isLoading && pageNotFound) {
//     navigate("/page-not-found");
//   }
// }, [pageNotFound, isLoading, navigate]);





// //   useEffect(() => {
// //   if (!isLoading && product.pageNotFound) {
// //     navigate("/page-not-found");
// //   }
// // }, [product.pageNotFound, isLoading, navigate]);


//   // Check localStorage cart to set picked size if present
//   useEffect(() => {
//     if (!product.id) return;
//     const cartItems = JSON.parse(localStorage.getItem("cart_items")) || [];
//     const cartItem = cartItems.find(item => item.id === product.id);
//     if (cartItem && cartItem.pricePicked) {
//       if (productPrices.includes(cartItem.pricePicked)) {
//         setSizeState(prev => ({ ...prev, sizePicked: cartItem.sizePicked }));
//       } else {
//         setSizeState(prev => ({ ...prev, sizePicked: productSizes[0] || "" }));
//       }
//     }
//   }, [product.id, productPrices]);

//   const handleAddToCart = () => {
//     addToCart(product, sizeState.sizePicked);
//   };

// //   const prices = JSON.parse(product.productPrices);

// // const smallestPrice = Math.min(
// //   ...prices.map(p => Number(p.price))
// // );

// // console.log(smallestPrice); // 80000
//   const handlesizeChange = (size, sizePrice) => {
//     setSizeState(prevState => ({ ...prevState, sizePicked: size }));
//     updateCartItemLength(product.id, size, sizePrice);
//   };

//   const handleImageClick = (img) => {
//     setSelectedImage(img);
//   };

//   const cartItems = JSON.parse(localStorage.getItem("cart_items")) || [];
//   const inCart = cartItems.some(
//     item => item.id === product.id && item.lengthPicked === sizeState.sizePicked
//   );

//   const currencySymbol = currencySymbols[selectedCurrency] || '';

//   const productImages = [
//     product.img,
//     ...(product.subImage1 ? [product.subImage1] : []),
//     ...(product.subImage2 ? [product.subImage2] : []),
//     ...(product.subImage3 ? [product.subImage3] : [])
//   ];

//   const convertedPrice = convertCurrency(
//     productPrices[productPrices.indexOf(sizeState.sizePicked)] || 0,
//     import.meta.env.VITE_CURRENCY_CODE,
//     selectedCurrency
//   );

//   // if (isLoading) return <p>Loading...</p>;
// const preloadImage = (src)=> {
//   const img = new Image();
//   img.src = src
// }
//   useEffect(()=> {
//     preloadImage(product.img)
//   })

// if (error) return <div><p>Error retrieving product.</p></div>;
//   return (
//     <div>
//       {product.pageNotFound ? (
//         <PageNotFound />
//       ) : (
//         <div>
//           <Navbar />
//           <section className="py-5" style={{ backgroundColor: "var(--bodyColor)", marginTop: "var(--marginAboveTop)" }}>

//             {/* {cartProducts.productAddedToCartAnimation && (
//               <div style={{ width: "100%", height: "50px", backgroundColor: "green", display: "flex", justifyContent: "center", alignItems: "center", color: "white", position: "fixed", top: "0", zIndex: "2" }}>
//                 {cartProducts.addToCartAnimationMessage} 
//               </div>
//             )}
//             {cartProducts.sizeUpdateMessage && (
//               <div style={{ width: "100%", height: "50px", backgroundColor: "green", display: "flex", justifyContent: "center", alignItems: "center", color: "white", position: "fixed", top: "0", zIndex: "2" }}>
//                 {cartProducts.sizeUpdateMessage}
//               </div>
//             )} */}
//             <div className="container">
//               <div className="row gx-">
//                 <aside className="col-lg-6">
//                   {/* <div style={{minHeight: "450px", backgroundColor: "#e3dadd"}}>
//                     {
//                       isLoading ? <div className="placeholder col-9" style={{width: "100%", height: "500px"}}>
//                         </div>
//                       : <div className="single-product-image-scroll-container">
                      
//                         {productImages.map((image, index) => (
//                             <img
//                                 key={index}
//                                 src={image}
//                                 alt={`Product Image ${index + 1}`}
//                                 className="single-product-scrollable-image"
//                             />
//                         ))}
//                       </div>
//                     }
//                   </div> */}

//                   <div style={{ minHeight: "450px", backgroundColor: "#e3dadd" }}>
//   {
//     isLoading ? (
//       <div
//         className="placeholder col-9"
//         style={{ width: "100%", height: "500px" }}
//       ></div>
//     ) : (
//         <div className="single-product-image-scroll-container">
//         {productImages.map((image, index) => (
//             <img
//               key={index}
//               src={image}
//               alt={`Product Image ${index + 1}`}
//               className="single-product-scrollable-image fade-in-image"
//               style={{ opacity: 0}}
//               onLoad={(e) => { e.target.style.opacity = 1; }}
//             />
//           ))}
//            {/* Navigation Buttons */}
  
//         </div> 
      
//     )
//   }
// </div>


                  
                    
                  
                 
//                 </aside>
//                 <main className="col-lg-6">
//                   <div className="ps-lg-3">
//                     <div style={{minHeight: "30px"}}>
//                       {
//                       isLoading ? <h4 className="placeholder w-100 mt-3" style={{height: "30px"}}></h4> :
//                       <h4 className="title mt-3" style={{ fontSize: "30px", color: "black"}}>{product.name}</h4>
//                       }
//                     </div>
                    
                    
                      
//                       <div style={{minHeight: "20px"}}>
//                         {
//                         isLoading ? <div className="placeholder mt-3 w-50" style={{height: "30px"}}></div> :
//                           <div className="d-flex flex-row my-3">
//                             <div className="text-warning mb-1 me-2">
//                               <i className="fa fa-star"></i>
//                               <i className="fa fa-star"></i>
//                               <i className="fa fa-star"></i>
//                               <i className="fa fa-star"></i>
//                               <i className="fa fa-star"></i>
//                             </div>
//                             <span className="text-success ms-2 ml-3">In stock</span>
//                           </div>
//                         }
//                       </div>
                    
                    


//                         {/* <span><b>{convertedPrice.toLocaleString()}</b></span> */}
//                     <div className="mb-3 d-flex" style={{minHeight: "30px"}}>
//                       {
//                         isLoading ? <div className="placeholder mt-3" style={{width: "150px", height: "30px"}}></div> :
//                         <div style={{display: "flex"}}>
//                           <div className="h5" style={{display: "flex", minWidth: "30px"}}>
//                             <strong>
//                               <mark>
//                             <span>{currencySymbol}</span>
                              
//                             {sizeState.sizes.map((size, index) => {
//                               if (sizeState.sizePicked === size) {
//                                 console.log(product)
//                                 const converted = convertCurrency(productPrices[index], import.meta.env.VITE_CURRENCY_CODE, selectedCurrency);

//                                 return converted !== null ? converted.toLocaleString() : <span className='placeholder' style={{width: "30px", }}></span> ; // or show fallback
//                               }
//                               return null;
//                             })}
//                             </mark>
//                             </strong>
           

//                           </div>
//                           <span className="text-muted">&nbsp;/&nbsp;per item</span>

//                         </div>
//                       }
//                     </div>
//                     <div style={{minHeight: "50px"}}>
//                       {isLoading ? <div className="placeholder" style={{width: "50%", height: "30px"}}></div> :
//                       <div className="text-muted mb-2">Category: {product?.category?.name}</div>}
//                       {!isLoading && <div className="text-muted">size: {sizeState.sizePicked}</div> }
                     
//                     </div>
                          
                          
//                     <div className="row mt-2">
//                         <div className="sizes-container">
//                           {isLoading? <div className="placeholder mt-3" style={{width: "100%", height: "80px"}}></div>
//                           : sizeState.sizes?.map((size, index) => {
//                             return <div key={index} className="">
//                               <button
//                                 className="size-button btn"
//                                 style={sizeState.sizePicked === size ? { backgroundColor: "black", color: "white" } : null }
//                                 onClick={() => {
//                                   const index = sizeState.sizes.findIndex(item => item == size); // Find the index of the selected size
//                                   const price = productPrices[index]; // Get the price for the selected size
//                                   handlesizeChange(size, price); // Pass the specific price instead of an array
//                                 }}
//                               >
//                                 {size}
//                               </button>
//                             </div>
//                           })}
//                         </div>
                      
//                     </div>
//                     <hr />
//                     {
//                       isLoading ? <div className="placeholder w-100" style={{height: "50px"}}></div> : 
//                       (product.img && <div className="d-grid">
//                         <button
//                           className="btn hover-button"
//                           // style={inCart || isRecentlyAdded ? { backgroundColor: "black"} : { border: "1px solid black", color: "black" }}
//                           // style={inCart || isRecentlyAdded ? { backgroundColor: "black"} : { border: "1px solid black", color: "black" }}
//                           style={inCart ? {background: "black", color: "white"} : null}
//                           onClick={handleAddToCart}
//                         >
//                           {inCart ? "Added to cart" : <span>Add to cart <i className="fas fa-shopping-cart m-1 me-md-2"></i></span>}
//                         </button>
//                       </div>)
//                     }
                    
                   
                    
//                   </div>
//                 </main>
//               </div>
//             </div>
//           </section>

//                <section className="border-top py-4" style={{backgroundColor: "var(--bodyColor)"}}>
//        <div className="container">
//          <div className="row gx-3 contain">
//            <div className="col-lg-12 mb-4 ">
//              <div className="border rounded-2 px-4 py-5 p-md-5 bg-white" style={{color: "black"}}>
//                <p>FREQUENTLY ASKED QUESTIONS</p>
//                <h1>FAQ</h1>
//                <p>  
//                  <b><i className="fa-solid fa-truck-fast mr-2">&nbsp;&nbsp;</i>Shipping & processing information</b>
//                </p>
//                <div className="text-muted">
//                  <p>It takes us an average of 3-5 working days to process orders allow a few more for custom orders.</p>
//                  {/* <p>Please allow another 1-2 working days for shipping on all orders within the uk.</p> */}
//                  <p>Shipping times varies from 5-10 working days for international orders.</p>
//                </div>
//                <p>
//                  <b>Returns, cancellations and refunds</b>
//                </p>
//                <div className="text-muted">
//                  <p>Due to the nature of our products we do not offer casual refunds though you would be entitled to a refund/return in cases where you receive the wrong item or a defective product etc </p>
//                  <p>You can cancel your order if you change your mind without any reasons necessary until it starts getting processed (on hold) this is usually under 24 hours.</p>
//                  <Link to="/policies/refund-policy" style={{color: "purple"}}>View our full refund policy</Link>
//                </div>
//              </div>
//            </div>
           
//         </div>
//       </div>
//     </section>
//           <Footer />
//         </div>
//       )}
//     </div>
//   );
// };

// export default SingleProduct;


