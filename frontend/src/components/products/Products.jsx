import { useQuery } from '@tanstack/react-query';
import { useState, useEffect, useContext } from "react"
import productsStore from "./products.json"
import "./products.css"
import { CartContext } from "../../pages/cart/CartContext"
import { CurrencyContext } from "../all_context/CurrencyContext"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import axios from "axios"
import HomePageLoader from "../homePageLoader/HomePageLoader"
import jsonProducts from "./products.json"
import PaginationButtons from "../paginationButtons/PaginationButtons"


const Products = ({ productCategory, showPaginationButtons }) => {
  const navigate = useNavigate();
  const { selectedCurrency, convertCurrency, currencySymbols, ratesFetched } = useContext(CurrencyContext);
  const { cartProducts, addToCart } = useContext(CartContext);

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(12);

  // Query key must be unique to every fetch
  const queryKey = ['products', currentPage, perPage, productCategory];

  const fetchProducts = async () => {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/get-all-products`, {
      params: {
        perPage,
        page: currentPage,
        ...(productCategory && { productCategory }),
      }
    });
    return response.data.data;
  };

  const {
    data: totalProducts,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey,
    queryFn: fetchProducts,
    keepPreviousData: true, // optional: keeps previous data while loading new
    staleTime: 1000 * 60 * 5 // optional: cache for 5 mins
  });

  const navigateToProduct = (id) => navigate(`/product/${id}`);

  const startProduct = (currentPage - 1) * perPage + 1;
  const endProduct = Math.min(currentPage * perPage, totalProducts?.total || 0);

  return (
    <div>
      {cartProducts.productAddedToCartAnimation && (
        <div style={{width: "100%", height: "50px", backgroundColor: "green", display: "flex", justifyContent: "center", alignItems: "center", color: "white", position: "fixed", top: "0", zIndex: "1"}}>
          {cartProducts.addToCartAnimationMessage}
        </div>
      )}

      <section>
        {showPaginationButtons && (
          <div style={{display: "flex", justifyContent: "space-between"}}>
            <p>Showing {startProduct} - {endProduct} products</p>
          </div>
        )}

        <div className="container my-4 product-page-container">
          {isLoading && <HomePageLoader />}
          <div className="row">
            {isError && <p className="text-danger">Error loading products: {error.message}</p>}

            {totalProducts?.data?.map((product, index) => {
              console.log(product)
              const sizes = Object.keys(product).filter(key => key.startsWith("productPrice"));
              const firstAvailablePrice = sizes.map(size => product[size]).find(price => price > 0) || 0;

              const converted = convertCurrency(
                firstAvailablePrice,
                import.meta.env.VITE_CURRENCY_CODE,
                selectedCurrency
              );
              const convertedPrice = Number(converted ?? firstAvailablePrice);
              const currencySymbol = currencySymbols[selectedCurrency];

              const productImagesArray = [product.productImage, product.subImage1, product.subImage2, product.subImage3]
              return (
                <div
                  key={index}
                  className="col-lg-3 col-md-6 col-sm-6 col-6 single-item-container"
                  onClick={() => navigateToProduct(product.id)}
                >
                  <div className="my-2">
                    <div className="product-image-cover">
                      <img
                        src={product.productImage}
                        className="card-img-top rounded-2 fade-in-image"
                        style={{ aspectRatio: "3 / 4", width: "100%", height: "auto", opacity: 0, filter: "grayscale(100%)"}}
                        alt={product.productName}
                        loading="lazy"
                        onLoad={(e) => { e.target.style.opacity = 1; e.target.style.filter = "grayscale(0%)"; }}
                      />
                      {/* Carousel logic */}
  {productImagesArray.length > 1 && (
    <div className="product-image-carousel-cover">
      {productImagesArray
  .slice(1, 4)
  .filter(img => img) // ✅ This filters out null/undefined/empty
  .map((img, idx) => (
    <img
      key={idx}
      src={img}
      alt={`Thumb ${idx}`}
      className="carousel-thumb fade-carousel"
      style={{ animationDelay: `${idx * 6}s` }}
    />
))}

    </div>
  )}

                      
                    </div>

                    <div className="pl-2 pt-2">
                      {ratesFetched ? (
                        <p className="fw-semibold fs-5 text-black">
                          {currencySymbol} {convertedPrice.toLocaleString()}
                        </p>
                      ) : (
                        <span className="placeholder" style={{width: "50px"}}></span>
                      )}
                      <p className="mb-0">{product.productName}</p>
                    </div>
                  </div>
                </div>
              );
            })}

            {
              showPaginationButtons &&
              totalProducts?.total > totalProducts?.per_page &&
              <PaginationButtons
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                perPage={perPage}
                metaData={totalProducts}
              />
            }
          </div>
        </div>
      </section>
    </div>
  );
};
export default Products






























// import { useState, useEffect, useContext } from "react"
// import productsStore from "./products.json"
// import "./products.css"
// import { CartContext } from "../../pages/cart/CartContext"
// import { CurrencyContext } from "../all_context/CurrencyContext"
// import { useNavigate } from "react-router-dom"
// import { Link } from "react-router-dom"
// import axios from "axios"
// import HomePageLoader from "../homePageLoader/HomePageLoader"
// import jsonProducts from "./products.json"
// import PaginationButtons from "../paginationButtons/PaginationButtons"




// const Products = ({ productCategory, showPaginationButtons }) => {
//     const navigate = useNavigate()
//     const { selectedCurrency, convertCurrency, currencySymbols, ratesFetched } = useContext(CurrencyContext);
//     const { cartProducts, addToCart} = useContext(CartContext);
//     const [allProducts, setAllProducts] =  useState({
//         products: [],
//         products_loading: true
//     })
//     const [totalProducts, setTotalProducts] = useState([]);
//     const [currentPage, setCurrentPage] = useState(1);
//     const [perPage, setPerPage] = useState(12);


//     const fetchProducts = async (page) => {
//         // console.log(currentPage, perPage)
//         console.log(productCategory)
//         try {
//             const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/get-all-products`, {
//                 params: {
//                     perPage: perPage,
//                     page: currentPage,
//                     ...(productCategory && { productCategory: productCategory })  // Conditionally adding the category if it exists
//                 }
//             });
//             console.log(response)
//             if (response.data.code == "success"){
//                 setCurrentPage(response.data.data.current_page)
//                 setAllProducts((prev) => ({
//                     ...prev,
//                     products_loading: false,
//                     products: response.data.data.data
//                 }))
//                 console.log(totalProducts)
//                 setTotalProducts(response.data.data); // Set products from paginated result
//                 console.log(totalProducts)
//             }
//             // const { data } = response.data;
//             // setTotalProducts(data.total); // Total number of products
//         } catch (error) {
//             // console.error('Error fetching products:', error);
//             setAllProducts((prev) => ({
//                 ...prev,
//                 products_loading: false
//             }))
//         }finally{
//             // Clear the loader timeout and stop the loader when the request completes
//             setAllProducts(prev => ({
//                 ...prev,
//                 products_loading: false // Ensure loader is hidden after request is done
//             }));
//         }
//     };

//     useEffect(()=> {
//         fetchProducts()
        
//     }, [currentPage, perPage, productCategory])

//     const navigateToProduct = (id) => {
//         navigate(`/product/${id}`)
//     }

//     const startProduct = (currentPage - 1) * perPage + 1;
//     const endProduct = Math.min(currentPage * perPage, totalProducts.total || 0);


//     return <div>
//         {cartProducts.productAddedToCartAnimation ? 
//             <div style={{width: "100%", height: "50px", backgroundColor: "green", display: "flex", justifyContent: "center", alignItems: "center", color: "white", position: "fixed", top: "0", zIndex: "1"}}>{cartProducts.addToCartAnimationMessage}</div>
//             : null
//         }
// {/* <div>
//   <video loop  autoplay muted playsInline name="media" style={{width: "100%", height: "auto"}}>
//     <source src="https://images.hergivenhair.com/hghemail/2023/images/adv.mp4" type="video/mp4" />
//     Your browser does not support the video tag.
//   </video>
// </div> */}
 



//         <section>
//                     {showPaginationButtons && <div style={{display: "flex", justifyContent: "space-between"}}>
//                         {/* <p><Link to='/' style={{fontWeight: "bold", color: "black", textDecoration: "none"}}>Home</Link> &gt; <Link to='/collections/all?category=All products' style={{fontWeight: "bold", color: "black", textDecoration: "none"}}>all products</Link></p> */}
//                         {/* <p>View all | {allProducts.products.length} products</p> */}
//                         {/* <p>Showing {startProduct} - {endProduct} of {totalProducts.total || 0} products</p> */}
//                         <p>Showing {startProduct} - {endProduct} products</p>
//                     </div>}
//             <div className="container my-4 product-page-container">
               
//                 {allProducts.products_loading && <HomePageLoader />}
//                 <div className="row">
//                     {console.log(allProducts)}
//                     {allProducts.products?.map((product, index) =>{
//                         // console.log(product)
//                         const sizes = [];
//                         // Iterate through all keys of the 'product' object
//                         Object.keys(product).forEach(key => {
//                             // Check if the key starts with 'productPriceIn'
//                             if (key.startsWith("productPrice")) {
//                                 sizes.push(key);
//                             }
//                         });
//                     const firstAvailablePrice = sizes.map(size => product[size]).find(price => price > 0) || 0;

// const converted = convertCurrency(
//   firstAvailablePrice,
//   import.meta.VITE_CURRENCY_CODE,
//   selectedCurrency
// );
// console.log({ converted, selectedCurrency, from: import.meta.env.VITE_CURRENCY_CODE });

// // Fallback to original price if conversion is not ready
// const convertedPrice = Number(converted ?? firstAvailablePrice);
// const currencySymbol = currencySymbols[selectedCurrency];

// return (
//   <div
//     key={index}
//     className="col-lg-3 col-md-6 col-sm-6 col-6 single-item-container"
//     onClick={() => navigateToProduct(product.id)}
//   >
//     <div className="my-2">
//     <div className="product-image-cover">
//         <img
//             src={product.productImage}
//             className="card-img-top rounded-2 fade-in-image"
//             style={{ aspectRatio: "3 / 4", width: "100%", height: "auto", opacity: 0, filter: "grayscale(100%)"}}
            
//             alt={product.productName}
//             onLoad={(e) => { e.target.style.opacity = 1; e.target.style.filter = "grayscale(0%)"; }}
//         />

//         {product.subImage1 && (product.subImage2 || product.subImage3) && (
//             <div
//             id={`productCarousel-${product.id}`}
//             className="product-image-carousel-cover carousel slide carousel-fade product-image-carousel-cover"
//             data-bs-ride="carousel"
//             data-bs-interval="4000"
        
//             >
//                 {[product.subImage1, product.subImage2, product.subImage3].filter(Boolean).length > 0 && (
//                     <div className="carousel-inner h-100 w-100">
//                         {[product.subImage1, product.subImage2, product.subImage3]
//                         .filter(Boolean)
//                         .map((img, index) => (
//                             <div
//                             className={`carousel-item ${index === 0 ? "active" : ""}`}
//                             key={index}
//                             style={{ height: "100%", width: "100%" }} // ensure .carousel-item fills space
//                             >
//                             <img
//                                 src={img}
//                                 className="d-block fade-in-image"
//                                 style={{
//                                 width: "100%",
//                                 height: "100%",
//                                 objectFit: "cover",
//                                 borderRadius: "50%",
//                                 opacity: 0,
                            
//                                 }}
//                                 alt={`sub-img-${index}`}
//                                 onLoad={(e) => { e.target.style.opacity = 1;}}
//                             />
//                             </div>
//                         ))}
//                     </div>
//                 )}
//             </div>
//         )}

//     </div>



//       <div className="pl-2 pt-2">
//         {ratesFetched ? (
//           <p className="fw-semibold fs-5 text-black">
//             {currencySymbol} {convertedPrice.toLocaleString()}
//           </p>
//         ) : (
//           <span className="placeholder" style={{width: "50px"}}></span>
//         )}

//         <p className="mb-0">{product.productName}</p>
//       </div>
//     </div>
//   </div>
// );
//                     })}
//                     {
//                         showPaginationButtons && totalProducts.total > totalProducts.per_page &&  <PaginationButtons currentPage={currentPage} setCurrentPage={setCurrentPage} perPage={perPage} metaData={totalProducts} />
//                     }

//                 </div>
//             </div>
//         </section> 
        



//     </div>
// }
// export default Products




















































// import { useState, useEffect, useContext } from "react"
// import productsStore from "./products.json"
// import "./products.css"
// import { CartContext } from "../../pages/cart/CartContext"
// import { CurrencyContext } from "../all_context/CurrencyContext"
// import { useNavigate } from "react-router-dom"
// import { Link } from "react-router-dom"
// import axios from "axios"
// import HomePageLoader from "../homePageLoader/HomePageLoader"
// import jsonProducts from "./products.json"




// const Products = () => {
//     const navigate = useNavigate()
//     const { selectedCurrency, convertCurrency, currencySymbols } = useContext(CurrencyContext);
//     const { cartProducts, addToCart} = useContext(CartContext);
//     const [allProducts, setAllProducts] =  useState({
//         products: [],
//         products_loading: false
//     })
//     const [cartItems, setCartItems] = useState([]);

//     const fetchProducts = async (page) => {
//         try {
//             const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/get-all-products`);
//             console.log(response)
//             if (response.data.code == "success"){
//                 setProducts(response.data.data.data)
//                 setTotalProducts(response.data.data); // Set products from paginated result
//                 console.log(totalProducts)
//             }
//             // const { data } = response.data;
//             // setTotalProducts(data.total); // Total number of products
//         } catch (error) {
//             console.error('Error fetching products:', error);
//         }
//     };

//     useEffect(()=> {
//         // setAllProducts({
//         //     products: [],
//         //     products_loading: true
//         // })

//         let loaderTimeout;

//         // Initially set products to an empty array and loading to false
//         setAllProducts({
//             products: [],
//             products_loading: false
//         });
    
//         // Set a timeout to show the loader after 500ms
//         loaderTimeout = setTimeout(() => {
//             setAllProducts(prevState => ({
//                 ...prevState,
//                 products_loading: true // Only show loader if data is taking long
//             }));
//         }, 300); // You can adjust this time (500ms) to control the delay for showing the loader
    

    
//         axios.get(`${import.meta.env.VITE_BACKEND_URL}/get-all-products`).then((feedback) => {
//             console.log(feedback)
//             console.log(Array.isArray(feedback.data.data))
//             setAllProducts({
//                 products:  Array.isArray(feedback.data.data) ? feedback.data.data : JSON.parse(feedback.data.data),
//                 products_loading: false
//             })
//         }).finally(() => {
//             // Clear the loader timeout and stop the loader when the request completes
//             clearTimeout(loaderTimeout);
//             setAllProducts(prev => ({
//                 ...prev,
//                 products_loading: false // Ensure loader is hidden after request is done
//             }));
//         });

//         // console.log(jsonProducts)
//         // setAllProducts({
//         //     products: jsonProducts,
//         //     products_loading: false
//         // })
//         // get cart items
//         const getCartItems = JSON.parse(localStorage.getItem("cart_items"))
//         setCartItems(getCartItems);


//     }, [])

//     const handleAddToCart = (product) => {
//         addToCart(product);
//     };
//     const navigateToProduct = (id) => {
//         navigate(`/product/${id}`, {
//             replace: true
//         })
//     }


//     return <div>
//         {cartProducts.productAddedToCartAnimation ? 
//             <div style={{width: "100%", height: "50px", backgroundColor: "green", display: "flex", justifyContent: "center", alignItems: "center", color: "white", position: "fixed", top: "0", zIndex: "1"}}>{cartProducts.addToCartAnimationMessage}</div>
//             : null
//         }
// {/* <div>
//   <video loop  autoplay muted playsInline name="media" style={{width: "100%", height: "auto"}}>
//     <source src="https://images.hergivenhair.com/hghemail/2023/images/adv.mp4" type="video/mp4" />
//     Your browser does not support the video tag.
//   </video>
// </div> */}
 



//         <section>
//             <div className="container my-5 product-page-container">
//                 <header className="mb-4">
//                 <h3>New products</h3>
//                 </header>
//                 {allProducts.products_loading && <HomePageLoader />}
//                 <div className="row">
//                     {allProducts.products?.slice().reverse().map((product, index) =>{
//                         // console.log(product)
//                         const inCart = cartItems?.some(item => item.id === product.id)
//                         const isRecentlyAdded = cartProducts.recentlyAddedProducts.includes(product.id);
//                         const convertedPrice = Number(convertCurrency(product.productPriceInNaira, 'NGN', selectedCurrency)).toLocaleString();
//                         const currencySymbol = currencySymbols[selectedCurrency];
//                         return (<div key={index} className="col-lg-3 col-md-6 col-sm-6 col-6 single-item-container" style={{textDecoration: "none", color: "black"}} onClick={()=>navigateToProduct(product.id)}>
//                         <div className="my-2">
                   
//                             <img src={product.productImage} className="card-img-top rounded-2" style={{aspectRatio: "3 / 4", width: "100%", height: "auto"}} />
            
//                         <div className="pl-2 pt-2">
//                             <h5 style={{display: "flex", gap: "5px"}}>
//                                 <span><b>{currencySymbol}</b></span>
//                                 <span><b>{convertedPrice.toLocaleString()}</b></span>
//                             </h5>
//                             <p className=" mb-0">{product.productName}</p>
//                             {/* <p className="text-muted">{product.description}</p> */}
//                         </div>
//                         </div>
//                     </div>)
//                     })}
//                 </div>
//             </div>
//         </section> 
        



//     </div>
// }
// export default Products








































    // // add to cart function
    // const addToCart = (product) => {
    //     const getItems = JSON.parse(localStorage.getItem("cart_items")) || []
    //     if(!getItems){
    //         const cartArray = []
    //         cartArray.push(product)
    //         // save to localStorage
    //         const setItem = localStorage.setItem("cart_items", JSON.stringify(cartArray))
    //     }else{
    //         setCartItems(getItems)
    //         // check if product being added to cart has already being added
    //         const productExists = getItems.some(item => item.id === product.id)
    
    //         if(productExists){
    //             // product is already in cart
    //             // filter through the getItems and remove the current product
                
    //             const removeProductFromCart = getItems.filter(item => item.id !== product.id);
    //             console.log(removeProductFromCart)

    //         }else{
    //             // product isn't in cart
    //             getItems.push(product)
    //             // save to localStorage
    //             localStorage.setItem("cart_items", JSON.stringify(getItems))
    //             setAllProducts((prevState) => ({
    //                 ...prevState,
    //                 wasProductAddedToCart: true,
    //                 productAddedToCartAnimation: true
    //             }))
    //             setTimeout(() => {
    //                 setAllProducts((prevState) => ({
    //                     ...prevState,
    //                     productAddedToCartAnimation: false
    //                 }))
    //             }, 3000)

    //         }
    //     }
    // }


        // add to cart function
        // const addToCart = (product) => {
        //     let getItems = JSON.parse(localStorage.getItem("cart_items")) || [];
        //     const productExists = getItems.some(item => item.id === product.id);
    
        //     if (productExists) {
        //         // filter through the getItems and remove the current product
        //         getItems = getItems.filter(item => item.id !== product.id);
        //         console.log("removed from cart");
        //         if(!allProducts.productAddedToCartAnimation){
        //             setAllProducts((prevState) => ({
        //                 ...prevState,
        //                 productAddedToCartAnimation: true,
        //                 addToCartAnimationMessage: "Product successfully removed"
        //             }));
        //             setTimeout(() => {
        //                 setAllProducts((prevState) => ({
        //                     ...prevState,
        //                     productAddedToCartAnimation: false,
        //                 }));
        //             }, 3000);
        //         }else{
        //             return null
        //         }
        //     } else {
        //         // product isn't in cart, add it
        //         getItems.push(product);
        //         console.log("added to cart");
        //         if(!allProducts.productAddedToCartAnimation){
        //             setAllProducts((prevState) => ({
        //                 ...prevState,
        //                 productAddedToCartAnimation: true,
        //                 addToCartAnimationMessage: <span>Product added successfully <i class="fa-sharp fa-solid fa-circle-check px-2"></i></span>
        //             }));
        //             setTimeout(() => {
        //                 setAllProducts((prevState) => ({
        //                     ...prevState,
        //                     productAddedToCartAnimation: false
        //                 }));
        //             }, 3000);
        //         }else{
        //             return null
        //         }
        //     }
    
        //     // save updated cart to localStorage
        //     localStorage.setItem("cart_items", JSON.stringify(getItems));
        //     setCartItems(getItems); // update state to trigger re-render
        // };