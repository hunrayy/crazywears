


// Nav.jsx
import { useState } from "react";
import { navItems } from "./navItems";
import "./Nav.css";
import { Link, useNavigate } from "react-router-dom";

export default function Nav() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  // Split items dynamically
  const topNavItems = navItems.filter(item =>
    ["SEARCH"].includes(item.name)
  );

  const desktopLeftItems = navItems.filter(item =>
    ["HOME", "SHOP", "CONTACT US", "POLICY", "TRACKING"].includes(item.name)
  );

  const desktopRightItems = navItems.filter(item =>
    ["SEARCH", "CART", "ACCOUNT"].includes(item.name)
  );

  const bottomNavItems = navItems.filter(item =>
    ["HOME", "SHOP", "CART", "ACCOUNT"].includes(item.name)
  );

  return (
    <>
      {/* Desktop Nav (always mounted, hidden on mobile via CSS) */}
      <nav className="desktop-nav">
        <div className="logo">BrandLogo</div>
        <ul className="nav-links">
          {desktopLeftItems.map(item => (
            <li key={item.name}>
              <Link to={item.link} className="desktop-nav-link">
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
        <div className="nav-actions">
          {desktopRightItems.map(item => (
            <button key={item.name}>{item.icon || item.name}</button>
          ))}
        </div>
      </nav>

      {/* Mobile Top Nav */}
      <header className="top-nav">
        <div
          style={{ fontSize: "20px" }}
          className="hamburgermenubar"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <i className="fa-solid fa-bars" style={{ cursor: "pointer" }}></i>
        </div>

        <div className="logo">BrandLogo</div>
        {topNavItems.map(item => (
          <div key={item.name}>{item.icon}</div>
        ))}
      </header>

      {/* Mobile Hamburger Menu */}
      <nav className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        <ul>
          {desktopLeftItems.map(item => (
            <li key={item.name}>
              <Link to={item.link} className="mobile-menu-link">
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile Bottom Nav */}
      <footer className="bottom-nav">
        {bottomNavItems.map(item => (
          <Link
            key={item.name}
            to={item.link}
            className="bottom-link"
          >
            <span>{item.icon}</span>
            <p>{item.name}</p>
          </Link>
        ))}
      </footer>
    </>
  );
}































// import { useState, useEffect } from "react";
// import { navItems } from "./navItems";
// import "./Nav.css";
// import { Link , useNavigate} from "react-router-dom";

// export default function Nav() {
//   const navigate = useNavigate()
//   const [isMobile, setIsMobile] = useState(false);
//   const [menuOpen, setMenuOpen] = useState(false);

//   // Detect screen size
//   useEffect(() => {
//     const handleResize = () => setIsMobile(window.innerWidth < 768);
//     handleResize(); // initial
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   // Split items dynamically
//   const topNavItems = navItems.filter(item =>
//     ["SEARCH"].includes(item.name)
//   );

//   const desktopLeftItems = navItems.filter(item =>
//     ["HOME", "SHOP", "CONTACT US", "POLICY", "TRACKING"].includes(item.name)
//   );

//   const desktopRightItems = navItems.filter(item =>
//     ["SEARCH", "CART", "ACCOUNT"].includes(item.name)
//   );

//   const bottomNavItems = navItems.filter(item =>
//     ["HOME", "SHOP", "CART", "ACCOUNT"].includes(item.name)
//   );

//   return (
//     <>
//       {/* Desktop Nav */}
//       {!isMobile && (
//         <nav className="desktop-nav">
//           <div className="logo">BrandLogo</div>
//           <ul className="nav-links">
//             {desktopLeftItems.map(item => (
//               <li key={item.name}><Link to={item.link} className="desktop-nav-link">{item.name}</Link></li>
//             ))}
//           </ul>
//           <div className="nav-actions">
//             {desktopRightItems.map(item => (
//               <button key={item.name}>{item.icon || item.name}</button>
//             ))}
//           </div>
//         </nav>
//       )}

//       {/* Mobile Top Nav */}
//       {isMobile && (
//         <header className="top-nav">
//             <div style={{ fontSize: "20px" }} className="hamburgermenubar" onClick={() => setMenuOpen(!menuOpen)}>
//                    <i style={{ cursor: "pointer" }} className="fa-solid fa-bars" onClick={() => setShownav(true)}></i>
//                  </div>


//           <div className="logo">BrandLogo</div>
//           {topNavItems.map(item => (
//             item.icon
//             // <button key={item.name}>{item.icon}</button>
//           ))}
//         </header>
//       )}

//       {/* Mobile Hamburger Menu */}
//       {isMobile && menuOpen && (
//         <nav className="mobile-menu">
//           <ul>
//             {desktopLeftItems.map(item => (
//               <li key={item.name}><Link to={item.link} className="mobile-menu-link">{item.name}</Link></li>
//             ))}
//           </ul>
//         </nav>
//       )}

//       {/* Mobile Bottom Nav */}
//       {isMobile && (
//         <footer className="bottom-nav">
//           {bottomNavItems.map(item => (
//             <button key={item.name} onClick={()=> navigate(item.link)} to={item.link} className="bottom-link">
//               <span>{item.icon}</span>
//               <p>{item.name}</p>
//             </button>
//           ))}
//         </footer>
//       )}
//     </>
//   );
// }





























// import "./navbar.css";
// import Logo from "../Logo/Logo";
// import { Link, useNavigate } from "react-router-dom";
// import { CartContext } from "../../pages/cart/CartContext";
// import { useState, useContext, useRef, useEffect } from "react";
// import { CurrencyContext } from "../all_context/CurrencyContext";
// import Select from "react-select";
// import { useAuth } from "../AuthContext/AuthContext";
// import axios from "axios";
// import useProductCategory from "../productCategory/useProductCategory";

// const Navbar = () => {
//   const navigate = useNavigate()
//   const {
//       categories,
//       isLoading,
//       isError,
//     } = useProductCategory();
  
//     // if (isLoading) return <p>Loading categories...</p>;
//   const [shownav, setShownav] = useState(false);
//   const [dropdown, setDropdown] = useState(false);
//   const [searchState, setSearchState] = useState({isSearching: false, searchLoading: false, searchData: null, wordNotFound: null})
//   const [searchQuery, setSearchQuery] = useState("");
//   const [debounceTimeout, setDebounceTimeout] = useState(null);
//   const [productCategoryDropdown, setProductCategoryDropdown] = useState(false)

//   const dropdownRef = useRef(null); // Ref for the dropdown menu
//   const use_auth = useAuth()

//   // const { calculateTotalLength } = useContext(CartContext);
//   // const totalItems = calculateTotalLength();
//   const { cartCount, loading } = useContext(CartContext);
//   // const { cartProducts, loading } = useContext(CartContext);
//   // const cartCount = cartProducts?.products?.length

// // const totalItems = calculateTotalLength();

//   const { selectedCurrency, handleCurrencyChange, currencySymbols, currencyNames } = useContext(CurrencyContext);
//   const handleCurrencySelect = (selectedOption) => {
//     if (selectedOption) {
//       handleCurrencyChange(selectedOption.value); // Update the currency based on user selection
//     }
//   };

//   const sortedCurrencyOptions = Object.keys(currencySymbols).sort().map(currency => ({
//     value: currency,
//     label: `${currencySymbols[currency]} ${currencyNames[currency]} (${currency})`
//   }));

//   // Handle search input change with debounce
//   const handleSearchChange = (e) => {
//     const value = e.target.value;
//     setSearchQuery(value);

//     // Show the loader immediately when the user starts typing
//     setSearchState((prev) => ({
//         ...prev,
//         searchLoading: value.length > 0,
//         wordNotFound: null
//     }));

//     // Clear the previous timeout
//     if (debounceTimeout) clearTimeout(debounceTimeout);

//     // Set a new timeout to perform search after a delay
//     const newTimeout = setTimeout(() => {
//       if (value.trim()) {
//           performSearch(value);
//       } else {
//           // Clear the search results if query is empty
//           setSearchState((prev) => ({
//               ...prev,
//               searchData: [],
//               wordNotFound: null
//           }));
//       }
//     }, 2000); // 2 seconds debounce delay

//     setDebounceTimeout(newTimeout);
// };

//   // Debounced API call function
//   const performSearch = async (query) => {
//     setSearchState((prev) => ({ ...prev, wordNotFound: null }));
  
//     try {
//         const feedback = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/search-products`, {
//             params: { query }, // Pass search query as a parameter
//         });
//         console.log(feedback)

//         setSearchState((prev) => ({
//             ...prev,
//             searchLoading: false,
//             searchData: feedback.data.code === "success" ? feedback.data.data : [],
//             wordNotFound: feedback.data.code === "success" && feedback.data.data.length === 0 ? query : null
//         }));
//     } catch (error) {
//       console.log(error)
//         setSearchState((prev) => ({
//             ...prev,
//             searchLoading: false,
//             searchData: [],
//             wordNotFound: query
//         }));
//     }
// };
//   // Effect to handle clicks outside the dropdown
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setDropdown(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   useEffect(() => {
//   console.log("Navbar cartCount updated:", cartCount);
// }, [cartCount]);


//   return (
//     <div>
//       <header className="navbar-component-container">
//         <div className="">
//           <div className="">
//             <div className="wrapper">
//               <div style={{ display: "flex", alignItems: "center", gap: "30px" }}>
//                 <div style={{ fontSize: "30px" }} className="hamburgermenubar">
//                   <i style={{ cursor: "pointer" }} className="fa-solid fa-bars" onClick={() => setShownav(true)}></i>
//                 </div>
//                 <div className="">
//                   <Link to="/" className="" style={{ textDecoration: "none" }}>
//                     <Logo />
//                   </Link>
//                 </div>
//                 <div className={shownav ? "links-container-show" : "links-container"} onClick={() => setShownav(false)}>
//                   <div className={shownav ? "links-wrapper-show" : "links-wrapper"} onClick={(e) => e.stopPropagation()}>
//                     <div style={{ fontSize: "30px" }} className="cancelmenubar">
//                       <i style={{ cursor: "pointer" }} className="fa-solid fa-xmark" onClick={() => setShownav(false)}></i>
//                     </div>
//                     <div>
//                       <Link to="/" className="home-page-nav-item">Home</Link>
//                     </div>
//                     {/* <div>
//                       <Link to='/collections/all' style={{ fontWeight: "bold", color: "white", textDecoration: "none" }}>Shop all</Link>
//                     </div> */}
//                     <div style={{color: ""}}>
//                         <div className="home-page-nav-item" onClick={() => setProductCategoryDropdown(!productCategoryDropdown)} style={{cursor: "pointer", width: "fit-content"}}>
//                             <span>Shop all</span> {productCategoryDropdown ? <i className="fa-solid fa-caret-up"></i> : <i className="fa-solid fa-caret-down"></i>}
//                         </div>
//                         <div className={`admin-sidebar-dropdown-wrapper ${productCategoryDropdown ? 'open' : ''}`} style={{fontSize: "17px"}}>
//                           <div className="home-page-nav-item mt-2" style={{fontWeight: "normal"}} onClick={()=> {navigate('/collections/all/?category=All Products'), setShownav(false)}}>All products</div>
//                                   {/* {categories && categories.map((category, index) => {
//                                       return <div key={index} onClick={() => {navigate(`/collections/all/?category=${category.label}`), setShownav(false)}}>{category.label}</div>
//                                   })} */}
//                                   {categories !== null ? categories.map((category, index) => {
//                                     // console.log(category)
//                                     return <div key={index} className="home-page-nav-item" style={{fontWeight: "normal"}} onClick={() => {navigate(`/collections/all/?category=${category.name}`), setShownav(false)}}>{category.name}</div>
//                                     }) 
//                                   : "Loading..."}
//                                   {isError && <div className="ml-2">Failed to fetch categories</div>}                                  
//                           </div>
//                         </div>
//                     {/* <div>
//                       <label htmlFor="currency" style={{ fontWeight: "bold", color: "white"}}>Currency: </label>
//                       <Select
//                         options={sortedCurrencyOptions}
//                         onChange={handleCurrencySelect}
//                         value={sortedCurrencyOptions.find(option => option.value === selectedCurrency)}
//                       />
//                     </div> */}
//                     <div>
//                       <Link to='/pages/contact' className="home-page-nav-item">contact</Link>
//                     </div>
//                     <div>
//                       <Link to="/policies/refund-policy" onClick={() => setShownav(false)} className="home-page-nav-item">Refund policy</Link>
//                     </div>
//                     <div>
//                       <Link to="/policies/shipping-policy" onClick={() => setShownav(false)} className="home-page-nav-item">Shipping policy</Link>
//                     </div>
//                     <div>
//                       <Link to="/policies/delivery-policy" onClick={() => setShownav(false)} className="home-page-nav-item">Delivery policy</Link>
//                     </div>
//                     <div>
//                       <Link to="/order/tracking" className="home-page-nav-item">Tracking</Link>
//                     </div>
//                     <div style={{display: "flex", gap: "15px"}}>
//                       <a className="home-page-nav-item" href="https://www.instagram.com/beauty_bykiaraa/" target="_blank">
//                         <i className="fa-brands fa-instagram"></i>
//                       </a>
//                       <a className="home-page-nav-item" href="https://www.tiktok.com/@beauty_bykiara" target="_blank">
//                         <i className="fa-brands fa-tiktok"></i>
//                       </a>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <div className="">
//               {/* d-flex float-end  */}
//                 <div className="text-light" style={{display: "flex", gap: "15px"}}>
//                 {/* <Link to="/cart" style={{ fontWeight: "bold" }} className="border rounded py-1 px-3 nav-link d-flex align-items-center mx-1">
//                   <i className="fa-solid fa-magnifying-glass m-1 me-md-2"></i>
//                   <p className="d-none d-md-block mb-0">Search</p>
//                 </Link> */}
                
//                   <div className="dropdown" ref={dropdownRef}>
//                     <button onClick={() => setDropdown(prev => !prev)} style={{ fontWeight: "bold" }} className="account-details-dropdown dropdown-toggle me-1 nav-link d-flex align-items-center">
//                       <i className="fas fa-user-alt m-1 me-md-2"></i>
//                       <p className="d-none d-md-block mb-0">{use_auth.user?.is_user_logged ? `Hi, ${use_auth.user?.user?.firstname}` : "Account"}</p>
//                     </button>
//                     {dropdown && (
//                       <div className="account-details-dropdown-list-black">
//                         <ul className="account-details-dropdown-list" type="none">
//                         {
//                             use_auth.user?.is_user_logged && use_auth.user?.user?.firstname &&  <div style={{backgroundColor: "purple", color: "white", margin: "10px", borderRadius: "5px", padding: "10px"}} className="d-block d-md-none">Hi, {use_auth.user.user.firstname}</div>
                              
                            
//                           }
                          
//                           {
//                             !use_auth.user.is_user_logged && <span>
//                               <li>
//                             <Link to="/identification" className="me-1 nav-link d-flex align-items-center">Create account</Link>
//                           </li>
//                           <li>
//                             <Link to="/login" className="me-1 nav-link d-flex align-items-center">Login</Link>
//                           </li>
//                             </span>
                            
//                           }
//                           <li>
//                             <Link to={use_auth.user.is_user_logged ? "/user-account" : "/login"} className="me-1 nav-link d-flex align-items-center" style={{gap: "12px"}}> <i className="fa-regular fa-user " style={{fontSize: "20px"}}></i>My Account</Link>
//                           </li>
//                           {/* <li>
//                             <Link className="me-1 nav-link d-flex align-items-center" style={{gap: "12px"}}> <i className="fa-regular fa-heart" style={{fontSize: "20px"}}></i>Wishlist</Link>
//                           </li> */}
//                           {/* <li>
//                             <Link className="me-1 nav-link d-flex align-items-center" style={{gap: "12px"}}> <i className="fa-regular fa-message"style={{fontSize: "20px"}}></i> Live chat</Link>
//                           </li> */}
//                           {use_auth.user.is_user_logged && <span>
//                             <hr />
//                             <li style={{paddingTop: "0", display: "flex", justifyContent: "center"}}>
//                               <button className="me-1 nav-link text-danger" onClick={()=> use_auth.logoutUser()}>Logout</button>
//                             </li>
                              
//                             </span>
                            
//                           }
                          
//                         </ul>
//                       </div>
//                     )}
//                   </div>
//                   <div style={{ fontWeight: "bold", cursor: "pointer" }} className="nav-link d-flex align-items-center mx-1" onClick={() => setSearchState((prev) => ({...prev, isSearching: true}))}>
//                     <i className="fa-solid fa-magnifying-glass m-1 me-md-2"></i>
//                     <p className="d-none d-md-block mb-0">Search</p>
//                   </div >
//                   <Link to="/cart" className="nav-link d-flex align-items-center" style={{ fontWeight: "bold" }}>
//                     <i className="fas fa-shopping-cart m-1 me-md-2"></i>
//                     <p className="d-none d-md-block mb-0">My cart</p>&nbsp;
//                     {/* {loading || cartCount === null ? '...' : cartCount} */}
//                     <span style={{ opacity: loading ? 0.5 : 1, transition: 'opacity 0.3s ease' }}>
//                       {loading || cartCount === null ? '...' : cartCount}
//                     </span>

//                   </Link>

//                   {/* <Link to="/cart" style={{ fontWeight: "bold" }} className="nav-link d-flex align-items-center">
//                     <i className="fas fa-shopping-cart m-1 me-md-2"></i>
//                     <p className="d-none d-md-block mb-0">My cart</p>&nbsp;{totalItems}
//                   </Link> */}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* search modal */}
//       {searchState.isSearching && (
//         <div className="custom-modal-overlay-form" onClick={() => setSearchState((prev) => ({...prev, isSearching: false}))}>
//           <div
//             className="card  custom-modal-card"
//             style={{
//                 width: "600px",
//                 padding: "20px",
//                 minHeight: "250px",
//                 marginTop: "70px"
//             }}
//             onClick={(e) => e.stopPropagation()}
//           >
//               <div class="search-container" onClick={() => setSearchState((prev) => ({...prev, isSearching: true}))}>
//                   <input type="text" placeholder="Search..." autoFocus value={searchQuery} onChange={handleSearchChange}/>
//                   <i className="fa-solid fa-magnifying-glass"></i>
//               </div>
//               <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px"}}>
//                   <small className="text-muted">Products</small>
//                   {searchState.searchLoading && <div className="admin-form-loader-wrapper"></div>}
//               </div>
//               <hr />
//                   <div style={{maxHeight: "400px", overflow: "auto"}}>
//                   {searchState.searchData && (
//                       searchState.searchData.map((product, index) => {
//                           // console.log(product)
//                           // return <div key={index} className="admin-search-result-container" onClick={()=> {setSearchState((prev) => ({...prev, isSearching: false, searchLoading: false, wordNotFound: null})), setSelectedProduct(product)}}>
//                           return <div key={index} className="admin-search-result-container" onClick={()=> {setSearchState({isSearching: false, searchLoading: false, searchData: null, wordNotFound: null}), navigate(`/product/${product.id}`)}}>
//                               <img src={product.productImage} alt="" width="50px"  />
//                               <p><b>{product.productName}</b></p>
//                           </div>
//                       })
//                   )}
//                   {searchState.wordNotFound != null && <div>Could not look up "{searchState.wordNotFound}"</div>}
//               </div>
              
//           </div>
//       </div>
//       )}
//     </div>
//   );
// }

// export default Navbar;
