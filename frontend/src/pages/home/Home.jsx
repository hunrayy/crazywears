import "./home.css";
import Navbar from "../../components/navbar/Navbar";
import Banner from "../../components/banner/Banner";
import Products from "../../components/products/Products";
import Footer from "../../components/footer/Footer";
import FooterVideo from "../../components/footerVideo/FooterVideo";
import ProductCategory from "../../components/productCategory/ProductCategory";
import { useState, useEffect, useContext } from "react";
import { useAuth } from "../../components/AuthContext/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";

const Home = () => {
    const location = useLocation()
    const justLoggedIn = location.state?.justLoggedIn
    const [showPaginationButtons, setShowPaginationButtons] = useState(false)
    const { user } = useAuth();
    const navigate = useNavigate();
    useEffect(()=> {
        // console.log(user)
        // Redirect logic before rendering the component
        if (user && user.is_user_logged && user.user?.is_an_admin && user.user?.user === "admin") {
            navigate(`/beautybykiara/admin/dashboard/eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqb2huc21pdGhAZ21haWwuY29tIjoiam9obnNtaXRoQGdtYWlsLmNvbSIsImpvaG4iOiJqb2hu`);
             // Prevent any content rendering before redirect
        }
       
    })

    
    
    return (
        <div className="home-page-container">   
            {justLoggedIn &&
                <div className="arrow-box">
                    <b>Welcome back {user?.user?.firstname}!</b>
                </div>
            }
            <Navbar />
            <Banner />
            <div className="container">
            <ProductCategory />





            












           

            </div>
            <div className="container mt-5" style={{display: "flex", justifyContent: "space-between"}}>
                <p style={{fontSize: "18px"}}><strong>New Products</strong></p>
                <Link to={'/collections/all/?category=All Products'} style={{color: "purple", textDecoration: "none"}}>View All</Link>
            </div>

            <Products productCategory='All Products' showPaginationButtons={showPaginationButtons} />
            <FooterVideo />
            <Footer />
        </div>
    );

};

export default Home;



























// import "./home.css"
// import Navbar from "../../components/navbar/Navbar"
// import Banner from "../../components/banner/Banner"
// import Products from "../../components/products/Products"
// import Footer from "../../components/footer/Footer"
// import { useState, useEffect } from "react"
// import { useAuth } from "../../components/AuthContext/AuthContext"
// import { useNavigate } from "react-router-dom"
// const Home = () => {
//     const use_auth = useAuth()
//     const navigate = useNavigate()
//     useEffect(()=> {
//         use_auth.user.is_user_logged && 
//         use_auth.user.user.is_an_admin && 
//         use_auth.user.user.user === "admin" &&
//         navigate(`/admin/dashboard/${use_auth.user.user.token}`)
//     }, [use_auth.user])


//     if(use_auth.user.is_user_logged &&
//         use_auth.user.user.is_an_admin && 
//         use_auth.user.user.user === "admin"){

//         return null;
//     }

//     return <div>
//         <div className="home-page-container">
//         <Navbar />
//         <Banner />
//         <Products />
//         <Footer />
//         </div>
//     </div>
// }
// export default Home