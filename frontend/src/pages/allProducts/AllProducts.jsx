
import './allProducts.css'
import Navbar from '../../components/navbar/Navbar'
import Footer from '../../components/footer/Footer'
import { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { CurrencyContext } from '../../components/all_context/CurrencyContext'
// import PaginationButton from '../../components/paginationButton/PaginationButton'
import { Link, useLocation } from 'react-router-dom'
import Products from '../../components/products/Products'
const AllProducts = () => {
    const { selectedCurrency, convertCurrency, currencySymbols } = useContext(CurrencyContext);

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const productCategory = searchParams.get("category");


        // Define state for products and pagination
        const [products, setProducts] = useState([]);
        const [totalProducts, setTotalProducts] = useState([]);
        const [currentPage, setCurrentPage] = useState(1);
        const [showPaginationButtons, setShowPaginationButtons] = useState(true)
            // Fetch paginated products
    const fetchProducts = async (page) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/get-all-products`);
            console.log(response)
            if (response.data.code == "success"){
                setProducts(response.data.data.data)
                setTotalProducts(response.data.data); // Set products from paginated result
                console.log(totalProducts)
            }
            // const { data } = response.data;
            // setTotalProducts(data.total); // Total number of products
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };
    const handlePaginate = async (link) => {
        try{
            console.log(totalProducts)
            // console.log(link)
            // Create a URL object
            const urlObject = new URL(link.url);
    
            // Combine the pathname and search properties
            const filteredPath = urlObject.pathname + urlObject.search;
    
            // Strip off '/api' if present
            const strippedPath = filteredPath.replace(/^\/api/, '');
    
            const feedback = await axios.get(`${import.meta.env.VITE_BACKEND_URL}${strippedPath}`, {
                // params: {
                //     page: page,
                //     perPage: perPage
                // }
            });
            console.log(feedback)
            if (feedback.data.code == "success"){
                setProducts(feedback.data.data.data)
                setTotalProducts(feedback.data.data); // Set products from paginated result
            }
        }catch(error){
            return null
        }


    }

    useEffect(()=> {
        fetchProducts()
    }, [productCategory])

        
    return <div>
        <Navbar />
        <div className="all-products-page-container">
            <section>
                        {/* <video 
    muted 
    autoPlay 
    loop 
    playsInline 
    style={{width: "100%"}}
    src="https://images.hergivenhair.com/hghemail/2023/images/adv.mp4">
    Your browser does not support the video tag.
  </video> */}
            <div className="container">
                <header className="" style={{padding: "30px 0"}}>
                    {/* <h1 className=''><b>All Products</b></h1> */}
                    <h1 className=''><b>{productCategory}</b></h1>
                </header>
                <div>
                    {/* <p style={{fontSize: "18px" }} className='float-right'>View all | {totalProducts.total} Products</p> */}
                    {/* <div>
                        <p><Link to='/' style={{fontWeight: "bold", color: "black", textDecoration: "none"}}>Home</Link> &gt; <Link to='/collections/all' style={{fontWeight: "bold", color: "black", textDecoration: "none"}}>all products</Link></p>
                    </div> */}

                </div>
                <div className="row">
                    {/* {
                        products.map((product, index) => {
                            const convertedPrice = Number(convertCurrency(product.productPriceInNaira, 'NGN', selectedCurrency)).toLocaleString();
                            const currencySymbol = currencySymbols[selectedCurrency];

                            return <div key={index} className="col-lg-3 col-md-6 col-sm-6 col-6 single-item-container" style={{textDecoration: "none", color: "black"}}>
                            <div className="my-2">
                       
                                <img src={product.productImage} className="card-img-top rounded-2" style={{aspectRatio: "3 / 4", width: "100%", height: "auto"}} />
                
                            <div className="pl-2 pt-2">
                                <h5 style={{display: "flex", gap: "5px"}}>
                                    <span><b>{currencySymbol}</b></span>
                                    <span><b>{convertedPrice.toLocaleString()}</b></span>
                                </h5>
                                <p className=" mb-0">{product.productName}</p>
                            </div>
                            </div>
                        </div>
                        })
                    } */}
                    <Products productCategory={productCategory} showPaginationButtons={showPaginationButtons} />

                    {/* <PaginationButton totalProducts={totalProducts} setTotalProducts={setTotalProducts} products={products} setProducts={setProducts} /> */}











                </div>
            </div>
        </section> 
        </div>
        <Footer />

    </div>
}
export default AllProducts












































// import './allProducts.css'
// import Navbar from '../../components/navbar/Navbar'
// import Footer from '../../components/footer/Footer'
// const AllProducts = () => {
//     return <div>
//         <Navbar />
//         <div className="all-products-page-container">
//                        {/* <video 
//     muted 
//     autoPlay 
//     loop 
//     playsInline 
//     style={{width: "100%"}}
//     src="https://images.hergivenhair.com/hghemail/2023/images/adv.mp4">
//     Your browser does not support the video tag.
//   </video> */}
//   {/* <div className=''>
//   <video playsInLine="playsinline" autoplay="autoplay" loop="loop" preload="none" class="video-local w-100 h-100 of-cover center-middle p-absolute mih" muted="muted" poster="//www.benaturalgirl.ng/cdn/shop/files/preview_images/f24d2a40ac394c588696b66ed00b9864.thumbnail.0000000000_small.jpg?v=1722418285" src="//www.benaturalgirl.ng/cdn/shop/videos/c/vp/f24d2a40ac394c588696b66ed00b9864/f24d2a40ac394c588696b66ed00b9864.HD-1080p-4.8Mbps-32555254.mp4?v=0">
//   <source data-src="//www.benaturalgirl.ng/cdn/shop/videos/c/vp/f24d2a40ac394c588696b66ed00b9864/f24d2a40ac394c588696b66ed00b9864.HD-1080p-4.8Mbps-32555254.mp4?v=0" type="video/mp4" />
//   <img src="//www.benaturalgirl.ng/cdn/shop/files/preview_images/f24d2a40ac394c588696b66ed00b9864.thumbnail.0000000000_small.jpg?v=1722418285" />
//   </video>
//   <img src="//www.benaturalgirl.ng/cdn/shop/files/Home_Page_A1_first_option_web_version_1_1.jpg?v=1722599806&amp;width=1440" alt="Home_Page_A1_first_option_web_version_1_1.jpg" srcset="//www.benaturalgirl.ng/cdn/shop/files/Home_Page_A1_first_option_web_version_1_1.jpg?v=1722599806&amp;width=320 320w, //www.benaturalgirl.ng/cdn/shop/files/Home_Page_A1_first_option_web_version_1_1.jpg?v=1722599806&amp;width=450 450w, //www.benaturalgirl.ng/cdn/shop/files/Home_Page_A1_first_option_web_version_1_1.jpg?v=1722599806&amp;width=550 550w, //www.benaturalgirl.ng/cdn/shop/files/Home_Page_A1_first_option_web_version_1_1.jpg?v=1722599806&amp;width=750 750w, //www.benaturalgirl.ng/cdn/shop/files/Home_Page_A1_first_option_web_version_1_1.jpg?v=1722599806&amp;width=950 950w, //www.benaturalgirl.ng/cdn/shop/files/Home_Page_A1_first_option_web_version_1_1.jpg?v=1722599806&amp;width=1024 1024w, //www.benaturalgirl.ng/cdn/shop/files/Home_Page_A1_first_option_web_version_1_1.jpg?v=1722599806&amp;width=1200 1200w, //www.benaturalgirl.ng/cdn/shop/files/Home_Page_A1_first_option_web_version_1_1.jpg?v=1722599806&amp;width=1400 1400w" width="1440" height="1346" loading="eager" sizes="100vw" class="js-image-lazy w-100 h-100 of-cover" fetchpriority="high" decoding="async"></img>

//   </div> */}
//             <section>
//             <div className="container">
//                 <header className="" style={{padding: "20px 0"}}>
//                     <h1 className=''><b>Products</b></h1>
//                 </header>
//                 <div>
//                     <p style={{fontSize: "18px" }} className='float-right'>View all | 43 Products</p>

//                 </div>
//                 <div className="row mt-5">
//                     <div className="col-lg-3 col-md-6 col-sm-6 col-6 single-item-container" style={{textDecoration: "none", color: "black"}}>
//                         <div className="my-2">
                   
//                             <img src="https://www.bundlesbynmeri.com/cdn/shop/files/B31AC4D6-AC00-41F2-AB96-0C8F77971296.jpg?v=1710829525&width=600" className="card-img-top rounded-2" style={{aspectRatio: "3 / 4", width: "100%", height: "auto"}} />
            
//                         <div className="pl-2 pt-2">
//                             <h5 style={{display: "flex", gap: "5px"}}>
//                                 <span><b>NGN</b></span>
//                                 <span><b>200,000</b></span>
//                             </h5>
//                             <p className=" mb-0">Kinky straight wig</p>
//                         </div>
//                         </div>
//                     </div>






























//                     <div className="col-lg-3 col-md-6 col-sm-6 col-6 single-item-container" style={{textDecoration: "none", color: "black"}}>
//                         <div className="my-2">
                   
//                             <img src="https://www.bundlesbynmeri.com/cdn/shop/files/B31AC4D6-AC00-41F2-AB96-0C8F77971296.jpg?v=1710829525&width=600" className="card-img-top rounded-2" style={{aspectRatio: "3 / 4", width: "100%", height: "auto"}} />
            
//                         <div className="pl-2 pt-2">
//                             <h5 style={{display: "flex", gap: "5px"}}>
//                                 <span><b>NGN</b></span>
//                                 <span><b>200,000</b></span>
//                             </h5>
//                             <p className=" mb-0">Kinky straight wig</p>
//                         </div>
//                         </div>
//                     </div><div className="col-lg-3 col-md-6 col-sm-6 col-6 single-item-container" style={{textDecoration: "none", color: "black"}}>
//                         <div className="my-2">
                   
//                             <img src="https://www.bundlesbynmeri.com/cdn/shop/files/B31AC4D6-AC00-41F2-AB96-0C8F77971296.jpg?v=1710829525&width=600" className="card-img-top rounded-2" style={{aspectRatio: "3 / 4", width: "100%", height: "auto"}} />
            
//                         <div className="pl-2 pt-2">
//                             <h5 style={{display: "flex", gap: "5px"}}>
//                                 <span><b>NGN</b></span>
//                                 <span><b>200,000</b></span>
//                             </h5>
//                             <p className=" mb-0">Kinky straight wig</p>
//                         </div>
//                         </div>
//                     </div><div className="col-lg-3 col-md-6 col-sm-6 col-6 single-item-container" style={{textDecoration: "none", color: "black"}}>
//                         <div className="my-2">
                   
//                             <img src="https://www.bundlesbynmeri.com/cdn/shop/files/B31AC4D6-AC00-41F2-AB96-0C8F77971296.jpg?v=1710829525&width=600" className="card-img-top rounded-2" style={{aspectRatio: "3 / 4", width: "100%", height: "auto"}} />
            
//                         <div className="pl-2 pt-2">
//                             <h5 style={{display: "flex", gap: "5px"}}>
//                                 <span><b>NGN</b></span>
//                                 <span><b>200,000</b></span>
//                             </h5>
//                             <p className=" mb-0">Kinky straight wig</p>
//                         </div>
//                         </div>
//                     </div><div className="col-lg-3 col-md-6 col-sm-6 col-6 single-item-container" style={{textDecoration: "none", color: "black"}}>
//                         <div className="my-2">
                   
//                             <img src="https://www.bundlesbynmeri.com/cdn/shop/files/B31AC4D6-AC00-41F2-AB96-0C8F77971296.jpg?v=1710829525&width=600" className="card-img-top rounded-2" style={{aspectRatio: "3 / 4", width: "100%", height: "auto"}} />
            
//                         <div className="pl-2 pt-2">
//                             <h5 style={{display: "flex", gap: "5px"}}>
//                                 <span><b>NGN</b></span>
//                                 <span><b>200,000</b></span>
//                             </h5>
//                             <p className=" mb-0">Kinky straight wig</p>
//                         </div>
//                         </div>
//                     </div><div className="col-lg-3 col-md-6 col-sm-6 col-6 single-item-container" style={{textDecoration: "none", color: "black"}}>
//                         <div className="my-2">
                   
//                             <img src="https://www.bundlesbynmeri.com/cdn/shop/files/B31AC4D6-AC00-41F2-AB96-0C8F77971296.jpg?v=1710829525&width=600" className="card-img-top rounded-2" style={{aspectRatio: "3 / 4", width: "100%", height: "auto"}} />
            
//                         <div className="pl-2 pt-2">
//                             <h5 style={{display: "flex", gap: "5px"}}>
//                                 <span><b>NGN</b></span>
//                                 <span><b>200,000</b></span>
//                             </h5>
//                             <p className=" mb-0">Kinky straight wig</p>
//                         </div>
//                         </div>
//                     </div><div className="col-lg-3 col-md-6 col-sm-6 col-6 single-item-container" style={{textDecoration: "none", color: "black"}}>
//                         <div className="my-2">
                   
//                             <img src="https://www.bundlesbynmeri.com/cdn/shop/files/B31AC4D6-AC00-41F2-AB96-0C8F77971296.jpg?v=1710829525&width=600" className="card-img-top rounded-2" style={{aspectRatio: "3 / 4", width: "100%", height: "auto"}} />
            
//                         <div className="pl-2 pt-2">
//                             <h5 style={{display: "flex", gap: "5px"}}>
//                                 <span><b>NGN</b></span>
//                                 <span><b>200,000</b></span>
//                             </h5>
//                             <p className=" mb-0">Kinky straight wig</p>
//                         </div>
//                         </div>
//                     </div><div className="col-lg-3 col-md-6 col-sm-6 col-6 single-item-container" style={{textDecoration: "none", color: "black"}}>
//                         <div className="my-2">
                   
//                             <img src="https://www.bundlesbynmeri.com/cdn/shop/files/B31AC4D6-AC00-41F2-AB96-0C8F77971296.jpg?v=1710829525&width=600" className="card-img-top rounded-2" style={{aspectRatio: "3 / 4", width: "100%", height: "auto"}} />
            
//                         <div className="pl-2 pt-2">
//                             <h5 style={{display: "flex", gap: "5px"}}>
//                                 <span><b>NGN</b></span>
//                                 <span><b>200,000</b></span>
//                             </h5>
//                             <p className=" mb-0">Kinky straight wig</p>
//                         </div>
//                         </div>
//                     </div><div className="col-lg-3 col-md-6 col-sm-6 col-6 single-item-container" style={{textDecoration: "none", color: "black"}}>
//                         <div className="my-2">
                   
//                             <img src="https://www.bundlesbynmeri.com/cdn/shop/files/B31AC4D6-AC00-41F2-AB96-0C8F77971296.jpg?v=1710829525&width=600" className="card-img-top rounded-2" style={{aspectRatio: "3 / 4", width: "100%", height: "auto"}} />
            
//                         <div className="pl-2 pt-2">
//                             <h5 style={{display: "flex", gap: "5px"}}>
//                                 <span><b>NGN</b></span>
//                                 <span><b>200,000</b></span>
//                             </h5>
//                             <p className=" mb-0">Kinky straight wig</p>
//                         </div>
//                         </div>
//                     </div><div className="col-lg-3 col-md-6 col-sm-6 col-6 single-item-container" style={{textDecoration: "none", color: "black"}}>
//                         <div className="my-2">
                   
//                             <img src="https://www.bundlesbynmeri.com/cdn/shop/files/B31AC4D6-AC00-41F2-AB96-0C8F77971296.jpg?v=1710829525&width=600" className="card-img-top rounded-2" style={{aspectRatio: "3 / 4", width: "100%", height: "auto"}} />
            
//                         <div className="pl-2 pt-2">
//                             <h5 style={{display: "flex", gap: "5px"}}>
//                                 <span><b>NGN</b></span>
//                                 <span><b>200,000</b></span>
//                             </h5>
//                             <p className=" mb-0">Kinky straight wig</p>
//                         </div>
//                         </div>
//                     </div><div className="col-lg-3 col-md-6 col-sm-6 col-6 single-item-container" style={{textDecoration: "none", color: "black"}}>
//                         <div className="my-2">
                   
//                             <img src="https://www.bundlesbynmeri.com/cdn/shop/files/B31AC4D6-AC00-41F2-AB96-0C8F77971296.jpg?v=1710829525&width=600" className="card-img-top rounded-2" style={{aspectRatio: "3 / 4", width: "100%", height: "auto"}} />
            
//                         <div className="pl-2 pt-2">
//                             <h5 style={{display: "flex", gap: "5px"}}>
//                                 <span><b>NGN</b></span>
//                                 <span><b>200,000</b></span>
//                             </h5>
//                             <p className=" mb-0">Kinky straight wig</p>
//                         </div>
//                         </div>
//                     </div><div className="col-lg-3 col-md-6 col-sm-6 col-6 single-item-container" style={{textDecoration: "none", color: "black"}}>
//                         <div className="my-2">
                   
//                             <img src="https://www.bundlesbynmeri.com/cdn/shop/files/B31AC4D6-AC00-41F2-AB96-0C8F77971296.jpg?v=1710829525&width=600" className="card-img-top rounded-2" style={{aspectRatio: "3 / 4", width: "100%", height: "auto"}} />
            
//                         <div className="pl-2 pt-2">
//                             <h5 style={{display: "flex", gap: "5px"}}>
//                                 <span><b>NGN</b></span>
//                                 <span><b>200,000</b></span>
//                             </h5>
//                             <p className=" mb-0">Kinky straight wig</p>
//                         </div>
//                         </div>
//                     </div><div className="col-lg-3 col-md-6 col-sm-6 col-6 single-item-container" style={{textDecoration: "none", color: "black"}}>
//                         <div className="my-2">
                   
//                             <img src="https://www.bundlesbynmeri.com/cdn/shop/files/B31AC4D6-AC00-41F2-AB96-0C8F77971296.jpg?v=1710829525&width=600" className="card-img-top rounded-2" style={{aspectRatio: "3 / 4", width: "100%", height: "auto"}} />
            
//                         <div className="pl-2 pt-2">
//                             <h5 style={{display: "flex", gap: "5px"}}>
//                                 <span><b>NGN</b></span>
//                                 <span><b>200,000</b></span>
//                             </h5>
//                             <p className=" mb-0">Kinky straight wig</p>
//                         </div>
//                         </div>
//                     </div><div className="col-lg-3 col-md-6 col-sm-6 col-6 single-item-container" style={{textDecoration: "none", color: "black"}}>
//                         <div className="my-2">
                   
//                             <img src="https://www.bundlesbynmeri.com/cdn/shop/files/B31AC4D6-AC00-41F2-AB96-0C8F77971296.jpg?v=1710829525&width=600" className="card-img-top rounded-2" style={{aspectRatio: "3 / 4", width: "100%", height: "auto"}} />
            
//                         <div className="pl-2 pt-2">
//                             <h5 style={{display: "flex", gap: "5px"}}>
//                                 <span><b>NGN</b></span>
//                                 <span><b>200,000</b></span>
//                             </h5>
//                             <p className=" mb-0">Kinky straight wig</p>
//                         </div>
//                         </div>
//                     </div><div className="col-lg-3 col-md-6 col-sm-6 col-6 single-item-container" style={{textDecoration: "none", color: "black"}}>
//                         <div className="my-2">
                   
//                             <img src="https://www.bundlesbynmeri.com/cdn/shop/files/B31AC4D6-AC00-41F2-AB96-0C8F77971296.jpg?v=1710829525&width=600" className="card-img-top rounded-2" style={{aspectRatio: "3 / 4", width: "100%", height: "auto"}} />
            
//                         <div className="pl-2 pt-2">
//                             <h5 style={{display: "flex", gap: "5px"}}>
//                                 <span><b>NGN</b></span>
//                                 <span><b>200,000</b></span>
//                             </h5>
//                             <p className=" mb-0">Kinky straight wig</p>
//                         </div>
//                         </div>
//                     </div><div className="col-lg-3 col-md-6 col-sm-6 col-6 single-item-container" style={{textDecoration: "none", color: "black"}}>
//                         <div className="my-2">
                   
//                             <img src="https://www.bundlesbynmeri.com/cdn/shop/files/B31AC4D6-AC00-41F2-AB96-0C8F77971296.jpg?v=1710829525&width=600" className="card-img-top rounded-2" style={{aspectRatio: "3 / 4", width: "100%", height: "auto"}} />
            
//                         <div className="pl-2 pt-2">
//                             <h5 style={{display: "flex", gap: "5px"}}>
//                                 <span><b>NGN</b></span>
//                                 <span><b>200,000</b></span>
//                             </h5>
//                             <p className=" mb-0">Kinky straight wig</p>
//                         </div>
//                         </div>
//                     </div><div className="col-lg-3 col-md-6 col-sm-6 col-6 single-item-container" style={{textDecoration: "none", color: "black"}}>
//                         <div className="my-2">
                   
//                             <img src="https://www.bundlesbynmeri.com/cdn/shop/files/B31AC4D6-AC00-41F2-AB96-0C8F77971296.jpg?v=1710829525&width=600" className="card-img-top rounded-2" style={{aspectRatio: "3 / 4", width: "100%", height: "auto"}} />
            
//                         <div className="pl-2 pt-2">
//                             <h5 style={{display: "flex", gap: "5px"}}>
//                                 <span><b>NGN</b></span>
//                                 <span><b>200,000</b></span>
//                             </h5>
//                             <p className=" mb-0">Kinky straight wig</p>
//                         </div>
//                         </div>
//                     </div><div className="col-lg-3 col-md-6 col-sm-6 col-6 single-item-container" style={{textDecoration: "none", color: "black"}}>
//                         <div className="my-2">
                   
//                             <img src="https://www.bundlesbynmeri.com/cdn/shop/files/B31AC4D6-AC00-41F2-AB96-0C8F77971296.jpg?v=1710829525&width=600" className="card-img-top rounded-2" style={{aspectRatio: "3 / 4", width: "100%", height: "auto"}} />
            
//                         <div className="pl-2 pt-2">
//                             <h5 style={{display: "flex", gap: "5px"}}>
//                                 <span><b>NGN</b></span>
//                                 <span><b>200,000</b></span>
//                             </h5>
//                             <p className=" mb-0">Kinky straight wig</p>
//                         </div>
//                         </div>
//                     </div><div className="col-lg-3 col-md-6 col-sm-6 col-6 single-item-container" style={{textDecoration: "none", color: "black"}}>
//                         <div className="my-2">
                   
//                             <img src="https://www.bundlesbynmeri.com/cdn/shop/files/B31AC4D6-AC00-41F2-AB96-0C8F77971296.jpg?v=1710829525&width=600" className="card-img-top rounded-2" style={{aspectRatio: "3 / 4", width: "100%", height: "auto"}} />
            
//                         <div className="pl-2 pt-2">
//                             <h5 style={{display: "flex", gap: "5px"}}>
//                                 <span><b>NGN</b></span>
//                                 <span><b>200,000</b></span>
//                             </h5>
//                             <p className=" mb-0">Kinky straight wig</p>
//                         </div>
//                         </div>
//                     </div><div className="col-lg-3 col-md-6 col-sm-6 col-6 single-item-container" style={{textDecoration: "none", color: "black"}}>
//                         <div className="my-2">
                   
//                             <img src="https://www.bundlesbynmeri.com/cdn/shop/files/B31AC4D6-AC00-41F2-AB96-0C8F77971296.jpg?v=1710829525&width=600" className="card-img-top rounded-2" style={{aspectRatio: "3 / 4", width: "100%", height: "auto"}} />
            
//                         <div className="pl-2 pt-2">
//                             <h5 style={{display: "flex", gap: "5px"}}>
//                                 <span><b>NGN</b></span>
//                                 <span><b>200,000</b></span>
//                             </h5>
//                             <p className=" mb-0">Kinky straight wig</p>
//                         </div>
//                         </div>
//                     </div>

















//                 </div>
//             </div>
//         </section> 
//         </div>
//         <Footer />

//     </div>
// }
// export default AllProducts