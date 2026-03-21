import { useQuery } from '@tanstack/react-query';
import { useState, useContext, useEffect } from "react"
import "./products.css"
import { CartContext } from "../../pages/cart/CartContext"
import { CurrencyContext } from "../all_context/CurrencyContext"
import { useNavigate, useLocation } from "react-router-dom"
import axios from "axios"
import HomePageLoader from "../homePageLoader/HomePageLoader"
import PaginationButtons from "../paginationButtons/PaginationButtons"
import useProductCategory from "../productCategory/useProductCategory"

const Products = ({ productCategory, showPaginationButtons }) => {
  console.log(productCategory)
  const navigate = useNavigate();
  const location = useLocation();
  const { categories } = useProductCategory();
  const { selectedCurrency, convertCurrency, currencySymbols, ratesFetched } = useContext(CurrencyContext);
  const { cartProducts, addToCart, isAnyVariantInCart } = useContext(CartContext);

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(12);

  const queryKey = ['products', currentPage, perPage, productCategory];

  const isMobile = window.matchMedia("(hover: none)").matches;

  const fetchProducts = async () => {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/get-all-products`, {
      params: { perPage, page: currentPage, ...(productCategory && { productCategory }) }
    });
    console.log(response)
    return response.data.data;
  };

  const { data: totalProducts, isLoading, isError, error } = useQuery({
    queryKey,
    queryFn: fetchProducts,
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5
  });

  const navigateToProduct = (id) => navigate(`/product/${id}`);

  const startProduct = (currentPage - 1) * perPage + 1;
  const endProduct = Math.min(currentPage * perPage, totalProducts?.total || 0);

  // ----- CATEGORY & SORT BUTTON STATE -----
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [categoryMenuExiting, setCategoryMenuExiting] = useState(false);
  const [sortMenuExiting, setSortMenuExiting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(productCategory || "All");
  const [selectedSort, setSelectedSort] = useState("Date, new - old");

  const sortOptions = [
    "Alphabetically, A - Z",
    "Alphabetically, Z - A",
    "Price, low - high",
    "Price, high - low",
    "Date, new - old",
    "Date, old - new"
  ];

  const handleCategorySelect = (cat) => {
    console.log(cat)
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("category", cat.name || cat);
    setSelectedCategory(cat.name || cat);
    navigate(`/collections/${(cat.name || cat).toLowerCase().trim().replace(/\s+/g, '-')}`);
    closeCategoryMenu();
  };

  const handleSortSelect = (sortOption) => {
    setSelectedSort(sortOption);
    closeSortMenu();
  };

  const closeCategoryMenu = () => {
    setCategoryMenuExiting(true);
    setTimeout(() => {
      setCategoryMenuOpen(false);
      setCategoryMenuExiting(false);
    }, 300);
  };

  const closeSortMenu = () => {
    setSortMenuExiting(true);
    setTimeout(() => {
      setSortMenuOpen(false);
      setSortMenuExiting(false);
    }, 300);
  };

  // const isAnyVariantInCart = (productId) => {
  //   return cartProducts.products.some(item => item.id === productId);
  // };

  // --- MOBILE OVERLAY TOGGLE WITHOUT REACT STATE ---
  useEffect(() => {
    if (!isMobile) return;

    const handleClickOutside = (e) => {
      const activeOverlays = document.querySelectorAll(".product-hover-overlay.active");
      activeOverlays.forEach(overlay => {
        if (!e.target.closest(".product-card") && !e.target.closest(".product-hover-overlay")) {
          overlay.classList.remove("active");
        }
      });
    };

    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, [isMobile]);

  // const toggleOverlay = (productId) => {
  //   const overlay = document.getElementById(`overlay-${productId}`);
  //   if (overlay) overlay.classList.toggle("active");
  // };

  const toggleOverlay = (productId) => {
  // first, close all other overlays
  const allOverlays = document.querySelectorAll(".product-hover-overlay");
  allOverlays.forEach(overlay => {
    if (overlay.id !== `overlay-${productId}`) {
      overlay.classList.remove("active");
    }
  });

  // toggle the clicked overlay
  const overlay = document.getElementById(`overlay-${productId}`);
  if (overlay) overlay.classList.toggle("active");
};


  return (
    <div>
      <section>
        <div className="product-menu-buttons">
          <button className="menu-btn" onClick={() => setCategoryMenuOpen(true)}>
            CATEGORY <i className="fa-solid fa-caret-down"></i> <br />{selectedCategory}
          </button>

          <button className="menu-btn" onClick={() => setSortMenuOpen(true)}>
            SORT BY <i className="fa-solid fa-caret-down"></i> <br />{selectedSort}
          </button>
        </div>

        {categoryMenuOpen && (
          <div className={`menu-overlay ${categoryMenuExiting ? "fade-out" : "fade-in"}`} onClick={closeCategoryMenu}>
            <div className={`text-muted menu-panel ${categoryMenuExiting ? "slide-out" : "slide-in"}`} onClick={(e) => e.stopPropagation()}>
              <h6 className="my-4">CATEGORIES</h6>
              <div
                key={'0'}
                className={` menu-item ${'all' === selectedCategory ? "active" : ""}`}
                onClick={() => handleCategorySelect('all')}
              >
                All
              </div>
              {categories.map((cat, idx) => (
                <div
                  key={idx + 1}
                  className={` menu-item ${cat.name === selectedCategory ? "active" : ""}`}
                  onClick={() => handleCategorySelect(cat)}
                >
                  {cat.name}
                </div>
              ))}
            </div>
          </div>
        )}

        {sortMenuOpen && (
          <div className={`menu-overlay ${sortMenuExiting ? "fade-out" : "fade-in"}`} onClick={closeSortMenu}>
            <div className={`text-muted menu-panel ${sortMenuExiting ? "slide-out" : "slide-in"}`} onClick={(e) => e.stopPropagation()}>
              <h6 className="my-4">SORT BY</h6>
              {sortOptions.map((option, idx) => (
                <div
                  key={idx}
                  className={`menu-item ${option === selectedSort ? "active" : ""}`}
                  onClick={() => handleSortSelect(option)}
                >
                  {option}
                </div>
              ))}
            </div>
          </div>
        )}

        {showPaginationButtons && (
          <div className="text-muted" style={{ display: "flex", justifyContent: "space-between", margin: "1rem 0" }}>
            <p>Showing {startProduct} - {endProduct} products</p>
          </div>
        )}

        <div className="container my-4 product-page-container">
          {isLoading && <HomePageLoader />}
          <div className="row">
            {isError && <p className="text-danger">Error loading products: {error.message}</p>}

            {totalProducts?.data?.map((product, index) => {
              const prices = JSON.parse(product.productPrices);

              const smallestPrice = Math.min(
                ...prices.map(p => Number(p.price))
              );

              console.log(smallestPrice); // 80000
              const converted = convertCurrency(smallestPrice, import.meta.env.VITE_CURRENCY_CODE, selectedCurrency);
              const convertedPrice = Number(converted ?? smallestPrice);
              const currencySymbol = currencySymbols[selectedCurrency];
              const productImagesArray = [product.productImage, product.subImage1, product.subImage2, product.subImage3];

              return (
                <div key={index} className="col-lg-3 col-md-6 col-sm-6 col-6 single-item-container">
                  <div className="my-2 product-card"
                    onClick={() => isMobile ? toggleOverlay(product.id) : navigateToProduct(product.id)}
                  >
                    <div className="product-image-cover position-relative">
                      <img
                        src={product.productImage}
                        className="card-img-top rounded-2 fade-in-image"
                        style={{ aspectRatio: "3 / 4", width: "100%", height: "auto", opacity: 0, filter: "grayscale(100%)" }}
                        alt={product.productName}
                        loading="lazy"
                        onLoad={(e) => { e.target.style.opacity = 1; e.target.style.filter = "grayscale(0%)"; }}
                      />

                      <div
                        id={`overlay-${product.id}`}
                        className="product-hover-overlay d-flex flex-column justify-content-center align-items-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button className="hover-btn view-btn mb-2" onClick={() => navigateToProduct(product.id)}>View Product</button>
                        {/* <button className="hover-btn add-cart-btn" onClick={() => addToCart(product)}>Add to Cart</button> */}
                        <button
                          className="hover-btn add-cart-btn"
                          onClick={() => {
                            if (isAnyVariantInCart(product.id)) {
                              navigate("/cart");
                            } else {
                              // --- Find the smallest priced variant ---
                              const prices = JSON.parse(product.productPrices);
                              const smallestVariant = prices.reduce((prev, curr) =>
                                Number(curr.price) < Number(prev.price) ? curr : prev
                              , prices[0]);

                              // Remove price before adding to cart
                              const variantWithoutPrice = { ...smallestVariant };
                              delete variantWithoutPrice.price;

                              // Add product with variant (without price) to cart
                              addToCart(product, variantWithoutPrice);
                            }
                          }}
                        >
                          {isAnyVariantInCart(product.id) ? "View in cart" : "Add to Cart"}
                        </button>
                      </div>

                      {productImagesArray.length > 1 && (
                        <div className="product-image-carousel-cover">
                          {productImagesArray.slice(1, 4).filter(img => img).map((img, idx) => (
                            <img key={idx} src={img} alt={`Thumb ${idx}`} className="carousel-thumb fade-carousel" style={{ animationDelay: `${idx * 6}s` }} />
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="pl-2 pt-2">
                      {ratesFetched ? (
                        <p className="fw-semibold fs-5 text-black">{currencySymbols[selectedCurrency]} {convertedPrice.toLocaleString()}</p>
                      ) : (
                        <span className="placeholder" style={{ width: "50px" }}></span>
                      )}
                      <p className="mb-0">{product.productName}</p>
                    </div>
                  </div>
                </div>
              );
            })}

            {showPaginationButtons && totalProducts?.total > totalProducts?.per_page &&
              <PaginationButtons currentPage={currentPage} setCurrentPage={setCurrentPage} perPage={perPage} metaData={totalProducts} />
            }
          </div>
        </div>
      </section>
    </div>
  );
};

export default Products;















































// import { useQuery } from '@tanstack/react-query';
// import { useState, useContext, useEffect } from "react"
// import "./products.css"
// import { CartContext } from "../../pages/cart/CartContext"
// import { CurrencyContext } from "../all_context/CurrencyContext"
// import { useNavigate, useLocation } from "react-router-dom"
// import axios from "axios"
// import HomePageLoader from "../homePageLoader/HomePageLoader"
// import PaginationButtons from "../paginationButtons/PaginationButtons"
// import useProductCategory from "../productCategory/useProductCategory"
// const Products = ({ productCategory, showPaginationButtons }) => {
//   console.log(productCategory)
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { categories } = useProductCategory();
//   const { selectedCurrency, convertCurrency, currencySymbols, ratesFetched } = useContext(CurrencyContext);
//   const { cartProducts, addToCart } = useContext(CartContext);

//   const [currentPage, setCurrentPage] = useState(1);
//   const [perPage, setPerPage] = useState(12);

//   const queryKey = ['products', currentPage, perPage, productCategory];



//   const isMobile = window.matchMedia("(hover: none)").matches;
//   const [activeProduct, setActiveProduct] = useState(null);


//   const fetchProducts = async () => {
//     const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/get-all-products`, {
//       params: {
//         perPage,
//         page: currentPage,
//         ...(productCategory && { productCategory }),
//       }
//     });
//     console.log(response)
//     return response.data.data;
//   };

//   const { data: totalProducts, isLoading, isError, error } = useQuery({
//     queryKey,
//     queryFn: fetchProducts,
//     keepPreviousData: true,
//     staleTime: 1000 * 60 * 5
//   });

//   const navigateToProduct = (id) => navigate(`/product/${id}`);

//   const startProduct = (currentPage - 1) * perPage + 1;
//   const endProduct = Math.min(currentPage * perPage, totalProducts?.total || 0);

//   // ----- CATEGORY & SORT BUTTON STATE -----
//   const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
//   const [sortMenuOpen, setSortMenuOpen] = useState(false);
//   const [categoryMenuExiting, setCategoryMenuExiting] = useState(false);
//   const [sortMenuExiting, setSortMenuExiting] = useState(false);
//   const [selectedCategory, setSelectedCategory] = useState(productCategory || "All");
//   const [selectedSort, setSelectedSort] = useState("Date, new - old");

//   // const categories = ["All", "Shoes", "Shirts", "Hoodies", "Accessories"];

//   const sortOptions = [
//     "Alphabetically, A - Z",
//     "Alphabetically, Z - A",
//     "Price, low - high",
//     "Price, high - low",
//     "Date, new - old",
//     "Date, old - new"
//   ];

//   // const handleCategorySelect = (cat) => {
//   //   productCategory = cat.name
//   //   setSelectedCategory(cat.name);
//   //   closeCategoryMenu();
//   // };
//   const handleCategorySelect = (cat) => {
//     console.log(cat)
//     // update URL query param so parent sees it
//     const searchParams = new URLSearchParams(location.search);
//     searchParams.set("category", cat.name || cat);
//     setSelectedCategory(cat.name || cat);
//     console.log(location.pathname)
//     // navigate(`${location.pathname}?${searchParams.toString()}`);
//     // navigate(`/collections/${cat.name || cat}`);
//     // const readableCategory = category.replace(/-/g, ' ');
//     navigate(`/collections/${(cat.name || cat).toLowerCase().trim().replace(/\s+/g, '-')}`);

    
//     closeCategoryMenu();
//   };

//   const handleSortSelect = (sortOption) => {
//     setSelectedSort(sortOption);
//     closeSortMenu();
//   };

//   const closeCategoryMenu = () => {
//     setCategoryMenuExiting(true);
//     setTimeout(() => {
//       setCategoryMenuOpen(false);
//       setCategoryMenuExiting(false);
//     }, 300); // match animation duration
//   };

//   const closeSortMenu = () => {
//     setSortMenuExiting(true);
//     setTimeout(() => {
//       setSortMenuOpen(false);
//       setSortMenuExiting(false);
//     }, 300);
//   };


// // for closing each product modal overlay
// //   useEffect(() => {
// //   if (!isMobile) return;

// //   const close = () => setActiveProduct(null);
// //   window.addEventListener("scroll", close);

// //   return () => window.removeEventListener("scroll", close);
// // }, []);



// useEffect(() => {
//   if (!isMobile) return;

//   const handleClickOutside = (e) => {
//     // if click is NOT inside overlay AND NOT inside product card, close overlay
//     if (
//       !e.target.closest(".product-hover-overlay") &&
//       !e.target.closest(".product-card")
//     ) {
//       setActiveProduct(null);
//     }
//   };

//   window.addEventListener("click", handleClickOutside);

//   return () => window.removeEventListener("click", handleClickOutside);
// }, [isMobile]);


//   return (
//     <div >
//       <section>

//         {/* ===== CATEGORY & SORT BUTTONS ===== */}
//         <div className="product-menu-buttons">
//           <button className="menu-btn" onClick={() => setCategoryMenuOpen(true)}>
//             CATEGORY <i className="fa-solid fa-caret-down"></i> <br />{selectedCategory}
//           </button>

//           <button className="menu-btn" onClick={() => setSortMenuOpen(true)}>
//             SORT BY <i className="fa-solid fa-caret-down"></i> <br />{selectedSort}
//           </button>
//         </div>

//         {/* Overlay for Category */}
//         {categoryMenuOpen && (
//           <div className={`menu-overlay ${categoryMenuExiting ? "fade-out" : "fade-in"}`} onClick={closeCategoryMenu}>
//             <div className={`text-muted menu-panel ${categoryMenuExiting ? "slide-out" : "slide-in"}`} onClick={(e) => e.stopPropagation()}>
//               <h6 className="my-4">CATEGORIES</h6>
//               <div
//                   key={'0'}
//                   className={` menu-item ${'all' === selectedCategory ? "active" : ""}`}
//                   onClick={() => handleCategorySelect('all')}
//                 >
//                   All 
//               </div>
//               {categories.map((cat, idx) => (
                
//                 <div
//                   key={idx + 1}
//                   className={` menu-item ${cat.name === selectedCategory ? "active" : ""}`}
//                   onClick={() => handleCategorySelect(cat)}
//                 >
//                   {cat.name}
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Overlay for Sort */}
//         {sortMenuOpen && (
//           <div className={`menu-overlay ${sortMenuExiting ? "fade-out" : "fade-in"}`} onClick={closeSortMenu}>
//             <div className={`text-muted menu-panel ${sortMenuExiting ? "slide-out" : "slide-in"}`} onClick={(e) => e.stopPropagation()}>
//               <h6 className="my-4">SORT BY</h6>
//               {sortOptions.map((option, idx) => (
//                 <div
//                   key={idx}
//                   className={`menu-item ${option === selectedSort ? "active" : ""}`}
//                   onClick={() => handleSortSelect(option)}
//                 >
//                   {option}
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {showPaginationButtons && (
//           <div className="text-muted" style={{display: "flex", justifyContent: "space-between", margin: "1rem 0"}}>
//             <p>Showing {startProduct} - {endProduct} products</p>
//           </div>
//         )}

//         <div className="container my-4 product-page-container">
//           {isLoading && <HomePageLoader />}
//           <div className="row">
//             {isError && <p className="text-danger">Error loading products: {error.message}</p>}

//             {totalProducts?.data?.map((product, index) => {
//               const sizes = Object.keys(product).filter(key => key.startsWith("productPrice"));
//               const firstAvailablePrice = sizes.map(size => product[size]).find(price => price > 0) || 0;

//               const converted = convertCurrency(firstAvailablePrice, import.meta.env.VITE_CURRENCY_CODE, selectedCurrency);
//               const convertedPrice = Number(converted ?? firstAvailablePrice);
//               const currencySymbol = currencySymbols[selectedCurrency];

//               const productImagesArray = [product.productImage, product.subImage1, product.subImage2, product.subImage3];

//               return (
//                 // <div key={index} className="col-lg-3 col-md-6 col-sm-6 col-6 single-item-container" onClick={() => navigateToProduct(product.id)}>
//                 <div
//   key={index}
//   className="col-lg-3 col-md-6 col-sm-6 col-6 single-item-container"
// >
//   <div
//     className="my-2 product-card"
//     // onClick={() => {
//     //   if (isMobile) {
//     //     // toggle overlay for mobile
//     //     setActiveProduct(activeProduct === product.id ? null : product.id);
//     //   } else {
//     //     navigateToProduct(product.id);
//     //   }
//     // }}

//     onClick={() => {
//   if (isMobile) {
//     setActiveProduct(prev => (prev === product.id ? null : product.id));
//   } else {
//     navigateToProduct(product.id);
//   }
// }}


//   >
//     <div className="product-image-cover position-relative">
//       <img
//         src={product.productImage}
//         className="card-img-top rounded-2 fade-in-image"
//         style={{
//           aspectRatio: "3 / 4",
//           width: "100%",
//           height: "auto",
//           opacity: 0,
//           filter: "grayscale(100%)",
//         }}
//         alt={product.productName}
//         loading="lazy"
//         onLoad={(e) => {
//           e.target.style.opacity = 1;
//           e.target.style.filter = "grayscale(0%)";
//         }}
//       />

//       {/* Hover Overlay */}
//       <div
//         className={`product-hover-overlay d-flex flex-column justify-content-center align-items-center 
//           ${activeProduct === product.id ? "active" : ""}`}
//         onClick={(e) => e.stopPropagation()} // prevent card click
//       >
//         <button
//           className="hover-btn view-btn mb-2"
//           onClick={() => navigateToProduct(product.id)}
//         >
//           View Product
//         </button>

//         <button
//           className="hover-btn add-cart-btn"
//           onClick={() => addToCart(product)}
//         >
//           Add to Cart
//         </button>
//       </div>

//       {productImagesArray.length > 1 && (
//         <div className="product-image-carousel-cover">
//           {productImagesArray
//             .slice(1, 4)
//             .filter((img) => img)
//             .map((img, idx) => (
//               <img
//                 key={idx}
//                 src={img}
//                 alt={`Thumb ${idx}`}
//                 className="carousel-thumb fade-carousel"
//                 style={{ animationDelay: `${idx * 6}s` }}
//               />
//             ))}
//         </div>
//       )}
//     </div>

//     <div className="pl-2 pt-2">
//       {ratesFetched ? (
//         <p className="fw-semibold fs-5 text-black">
//           {currencySymbols[selectedCurrency]}{" "}
//           {convertedPrice.toLocaleString()}
//         </p>
//       ) : (
//         <span className="placeholder" style={{ width: "50px" }}></span>
//       )}
//       <p className="mb-0">{product.productName}</p>
//     </div>
//   </div>
// </div>

//               );
//             })}

//             {showPaginationButtons && totalProducts?.total > totalProducts?.per_page &&
//               <PaginationButtons currentPage={currentPage} setCurrentPage={setCurrentPage} perPage={perPage} metaData={totalProducts} />
//             }
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default Products;




































































// import { useQuery } from '@tanstack/react-query';
// import { useState, useContext } from "react"
// import "./products.css"
// import { CartContext } from "../../pages/cart/CartContext"
// import { CurrencyContext } from "../all_context/CurrencyContext"
// import { useNavigate, useLocation } from "react-router-dom"
// import axios from "axios"
// import HomePageLoader from "../homePageLoader/HomePageLoader"
// import PaginationButtons from "../paginationButtons/PaginationButtons"
// import useProductCategory from "../productCategory/useProductCategory"
// const Products = ({ productCategory, showPaginationButtons }) => {
//   console.log(productCategory)
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { categories } = useProductCategory();
//   const { selectedCurrency, convertCurrency, currencySymbols, ratesFetched } = useContext(CurrencyContext);
//   const { cartProducts, addToCart } = useContext(CartContext);

//   const [currentPage, setCurrentPage] = useState(1);
//   const [perPage, setPerPage] = useState(12);

//   const queryKey = ['products', currentPage, perPage, productCategory];

//   const fetchProducts = async () => {
//     const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/get-all-products`, {
//       params: {
//         perPage,
//         page: currentPage,
//         ...(productCategory && { productCategory }),
//       }
//     });
//     console.log(response)
//     return response.data.data;
//   };

//   const { data: totalProducts, isLoading, isError, error } = useQuery({
//     queryKey,
//     queryFn: fetchProducts,
//     keepPreviousData: true,
//     staleTime: 1000 * 60 * 5
//   });

//   const navigateToProduct = (id) => navigate(`/product/${id}`);

//   const startProduct = (currentPage - 1) * perPage + 1;
//   const endProduct = Math.min(currentPage * perPage, totalProducts?.total || 0);

//   // ----- CATEGORY & SORT BUTTON STATE -----
//   const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
//   const [sortMenuOpen, setSortMenuOpen] = useState(false);
//   const [categoryMenuExiting, setCategoryMenuExiting] = useState(false);
//   const [sortMenuExiting, setSortMenuExiting] = useState(false);
//   const [selectedCategory, setSelectedCategory] = useState(productCategory || "All");
//   const [selectedSort, setSelectedSort] = useState("Date, new - old");

//   // const categories = ["All", "Shoes", "Shirts", "Hoodies", "Accessories"];

//   const sortOptions = [
//     "Alphabetically, A - Z",
//     "Alphabetically, Z - A",
//     "Price, low - high",
//     "Price, high - low",
//     "Date, new - old",
//     "Date, old - new"
//   ];

//   // const handleCategorySelect = (cat) => {
//   //   productCategory = cat.name
//   //   setSelectedCategory(cat.name);
//   //   closeCategoryMenu();
//   // };
//   const handleCategorySelect = (cat) => {
//     console.log(cat)
//     // update URL query param so parent sees it
//     const searchParams = new URLSearchParams(location.search);
//     searchParams.set("category", cat.name || cat);
//     setSelectedCategory(cat.name || cat);
//     console.log(location.pathname)
//     // navigate(`${location.pathname}?${searchParams.toString()}`);
//     // navigate(`/collections/${cat.name || cat}`);
//     // const readableCategory = category.replace(/-/g, ' ');
//     navigate(`/collections/${(cat.name || cat).toLowerCase().trim().replace(/\s+/g, '-')}`);

    
//     closeCategoryMenu();
//   };

//   const handleSortSelect = (sortOption) => {
//     setSelectedSort(sortOption);
//     closeSortMenu();
//   };

//   const closeCategoryMenu = () => {
//     setCategoryMenuExiting(true);
//     setTimeout(() => {
//       setCategoryMenuOpen(false);
//       setCategoryMenuExiting(false);
//     }, 300); // match animation duration
//   };

//   const closeSortMenu = () => {
//     setSortMenuExiting(true);
//     setTimeout(() => {
//       setSortMenuOpen(false);
//       setSortMenuExiting(false);
//     }, 300);
//   };

//   return (
//     <div >
//       <section>

//         {/* ===== CATEGORY & SORT BUTTONS ===== */}
//         <div className="product-menu-buttons">
//           <button className="menu-btn" onClick={() => setCategoryMenuOpen(true)}>
//             CATEGORY <i className="fa-solid fa-caret-down"></i> <br />{selectedCategory}
//           </button>

//           <button className="menu-btn" onClick={() => setSortMenuOpen(true)}>
//             SORT BY <i className="fa-solid fa-caret-down"></i> <br />{selectedSort}
//           </button>
//         </div>

//         {/* Overlay for Category */}
//         {categoryMenuOpen && (
//           <div className={`menu-overlay ${categoryMenuExiting ? "fade-out" : "fade-in"}`} onClick={closeCategoryMenu}>
//             <div className={`text-muted menu-panel ${categoryMenuExiting ? "slide-out" : "slide-in"}`} onClick={(e) => e.stopPropagation()}>
//               <h6 className="my-4">CATEGORIES</h6>
//               <div
//                   key={'0'}
//                   className={` menu-item ${'all' === selectedCategory ? "active" : ""}`}
//                   onClick={() => handleCategorySelect('all')}
//                 >
//                   All 
//               </div>
//               {categories.map((cat, idx) => (
                
//                 <div
//                   key={idx + 1}
//                   className={` menu-item ${cat.name === selectedCategory ? "active" : ""}`}
//                   onClick={() => handleCategorySelect(cat)}
//                 >
//                   {cat.name}
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Overlay for Sort */}
//         {sortMenuOpen && (
//           <div className={`menu-overlay ${sortMenuExiting ? "fade-out" : "fade-in"}`} onClick={closeSortMenu}>
//             <div className={`text-muted menu-panel ${sortMenuExiting ? "slide-out" : "slide-in"}`} onClick={(e) => e.stopPropagation()}>
//               <h6 className="my-4">SORT BY</h6>
//               {sortOptions.map((option, idx) => (
//                 <div
//                   key={idx}
//                   className={`menu-item ${option === selectedSort ? "active" : ""}`}
//                   onClick={() => handleSortSelect(option)}
//                 >
//                   {option}
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {showPaginationButtons && (
//           <div className="text-muted" style={{display: "flex", justifyContent: "space-between", margin: "1rem 0"}}>
//             <p>Showing {startProduct} - {endProduct} products</p>
//           </div>
//         )}

//         <div className="container my-4 product-page-container">
//           {isLoading && <HomePageLoader />}
//           <div className="row">
//             {isError && <p className="text-danger">Error loading products: {error.message}</p>}

//             {totalProducts?.data?.map((product, index) => {
//               const sizes = Object.keys(product).filter(key => key.startsWith("productPrice"));
//               const firstAvailablePrice = sizes.map(size => product[size]).find(price => price > 0) || 0;

//               const converted = convertCurrency(firstAvailablePrice, import.meta.env.VITE_CURRENCY_CODE, selectedCurrency);
//               const convertedPrice = Number(converted ?? firstAvailablePrice);
//               const currencySymbol = currencySymbols[selectedCurrency];

//               const productImagesArray = [product.productImage, product.subImage1, product.subImage2, product.subImage3];

//               return (
//                 <div key={index} className="col-lg-3 col-md-6 col-sm-6 col-6 single-item-container" onClick={() => navigateToProduct(product.id)}>
//                   <div className="my-2">
//                     <div className="product-image-cover ">
//                       <img
//                         src={product.productImage}
//                           className="card-img-top rounded-2 fade-in-image"
//                         style={{ aspectRatio: "3 / 4", width: "100%", height: "auto", opacity: 0, filter: "grayscale(100%)"}}
//                         alt={product.productName}
//                         loading="lazy"
//                         onLoad={(e) => { e.target.style.opacity = 1; e.target.style.filter = "grayscale(0%)"; }}
//                       />
//                       {productImagesArray.length > 1 && (
//                         <div className="product-image-carousel-cover">
//                           {productImagesArray.slice(1,4).filter(img => img).map((img, idx) => (
//                             <img key={idx} src={img} alt={`Thumb ${idx}`} className="carousel-thumb fade-carousel" style={{ animationDelay: `${idx * 6}s` }} />
//                           ))}
//                         </div>
//                       )}
//                     </div>

//                     <div className="pl-2 pt-2">
//                       {ratesFetched ? (
//                         <p className="fw-semibold fs-5 text-black">{currencySymbol} {convertedPrice.toLocaleString()}</p>
//                       ) : (
//                         <span className="placeholder" style={{width: "50px"}}></span>
//                       )}
//                       <p className="mb-0">{product.productName}</p>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}

//             {showPaginationButtons && totalProducts?.total > totalProducts?.per_page &&
//               <PaginationButtons currentPage={currentPage} setCurrentPage={setCurrentPage} perPage={perPage} metaData={totalProducts} />
//             }
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default Products;











































