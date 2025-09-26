import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useContext } from "react";
import { CurrencyContext } from "../../all_context/CurrencyContext";
import "./allProducts.css";
import BasicLoader from "../../loader/BasicLoader";
import EditProductForm from "../editProductForm/EditProductForm";
import Loader from "../../loader/Loader";

const AllProducts = ({ productCategory }) => {
    console.log(productCategory)
    const [page, setPage] = useState("allProducts");
    const { selectedCurrency, convertCurrency, currencySymbols } = useContext(CurrencyContext);

    const token = Cookies.get("authToken");
    const [allProducts, setAllProducts] = useState({
        products: [],
        products_loading: true,
    });
    const [totalProducts, setTotalProducts] = useState([])
    const [selectedProduct, setSelectedProduct] = useState(null); // Track selected product for modal
    const [productToDelete, setProductToDelete] = useState(null); // Track product to delete
    const [productDeleting, setProductDeleting] = useState(false)
    const [productDeleted, setProductDeleted] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false); // Show or hide delete confirmation modal
    const [searchState, setSearchState] = useState({isSearching: false, searchLoading: false, searchData: null, wordNotFound: null})
    const [searchQuery, setSearchQuery] = useState("");
    const [debounceTimeout, setDebounceTimeout] = useState(null);
    const [currentPage, setCurrentPage] = useState(1)
    const [perPage, setPerPage] = useState(12);



    const handleCloseModal = () => {
        setPage("allProducts")
        setSelectedProduct(null);
    };

    const handleDeleteClick = (product) => {
        setSelectedProduct(null); // Close the product modal
        setProductToDelete(product); // Set the product to be deleted
        setShowDeleteModal(true); // Show the delete confirmation modal
    };

    const handleDeleteConfirm = () => {
        console.log(productToDelete)
        setProductDeleting(true)
        setShowDeleteModal(false); // Close the confirmation modal after deleting
        
        axios
            .post(`${import.meta.env.VITE_BACKEND_URL}/admin/delete-product`, {productToDelete: productToDelete},{
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            .then((response) => {
                console.log(response)
                if (response.data.code === "success") {
                    setAllProducts((prevState) => ({
                        ...prevState,
                        products: prevState.products.filter(
                            (product) => product.id !== productToDelete.id  // Filters out the deleted product
                        ),
                    }));
                    setProductDeleted(true)
                    fetchProducts()
                    setTimeout(()=> {
                        setProductDeleted(false)
                    }, 5000)
                    // window.location.reload()
                }
            })
            .finally(() => {
                setProductDeleting(false)
             

            });
    };

    // Handler for next page
    const handleNextPage = () => {
        if (currentPage < Math.ceil(totalProducts.total / perPage)) {
            console.log()
            setCurrentPage((prevPage) => {
                const newPage = prevPage + 1;
                // console.log(newPage); // This will now log the correct new page
                return newPage;
            });
        }
    };

    // Handler for previous page
    const handlePreviousPage = () => {

        if (currentPage > 1) {
            setCurrentPage((prevPage) => {
                const newPage = prevPage - 1;
                return newPage;
            });
        }
    };

    const handlePaginate = (index) => {
        setCurrentPage((prevPage) => {
            return index;
        });
    }

    const fetchProducts = () => {
       try{
            axios
            .get(`${import.meta.env.VITE_BACKEND_URL}/get-all-products`, {
                params: {
                    perPage: perPage,
                    page: currentPage,
                    ...(productCategory && { productCategory: productCategory })  // Conditionally adding the category if it exists
                },headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            .then((feedback) => {
                console.log(feedback)
                if (feedback.data.code === "success") {
                    setTotalProducts(feedback.data.data)
                    setCurrentPage(feedback.data.data.current_page)
                    setAllProducts((prev) => ({
                        ...prev,
                        products_loading: false,
                        products: feedback.data.data.data
                    }))
                }
            })
       }catch(error){
        console.log(error)
       }
        // .finally(() => {
        //     clearTimeout(loaderTimeout);
        //     setAllProducts((prev) => ({
        //         ...prev,
        //         products_loading: false,
        //     }));
        // });
    }

    useEffect(() => {
        if (!productCategory) {
            productCategory = 'all productsy'; // or default category
        }
        fetchProducts()
        // let loaderTimeout;
        // loaderTimeout = setTimeout(() => {
        //     setAllProducts((prevState) => ({
        //         ...prevState,
        //         products_loading: true,
        //     }));
        // }, 200);
        
        // return () => clearTimeout(loaderTimeout);
    }, [currentPage, perPage, productCategory]);

        // Handle search input change with debounce
        const handleSearchChange = (e) => {
            const value = e.target.value;
            setSearchQuery(value);
        
            // Show the loader immediately when the user starts typing
            setSearchState((prev) => ({
                ...prev,
                searchLoading: value.length > 0,
                wordNotFound: null
            }));
        
            // Clear the previous timeout
            if (debounceTimeout) clearTimeout(debounceTimeout);
        
            // Set a new timeout to perform search after a delay
            const newTimeout = setTimeout(() => {
                if (value.trim()) {
                    performSearch(value);
                } else {
                    // Clear the search results if query is empty
                    setSearchState((prev) => ({
                        ...prev,
                        searchData: [],
                        wordNotFound: null
                    }));
                }
            }, 2000); // 2 seconds debounce delay
        
            setDebounceTimeout(newTimeout);
        };
        
        // Debounced API call function
        const performSearch = async (query) => {
            setSearchState((prev) => ({ ...prev, wordNotFound: null }));
            try {
                const feedback = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/search-products`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    params: { query }, // Pass search query as a parameter
                });
                console.log(feedback)
        
                setSearchState((prev) => ({
                    ...prev,
                    searchLoading: false,
                    searchData: feedback.data.code === "success" ? feedback.data.data : [],
                    wordNotFound: feedback.data.code === "success" && feedback.data.data.length === 0 ? query : null
                }));
            } catch (error) {
                setSearchState((prev) => ({
                    ...prev,
                    searchLoading: false,
                    searchData: [],
                    wordNotFound: query
                }));
            }
        };

        const firstAvailablePrice = (selectedProduct) => {
            console.log(selectedProduct)
            const sizes = [];
            // Iterate through all keys of the 'product' object
            Object.keys(selectedProduct).forEach(key => {
                // Check if the key starts with 'productPriceIn'
                if (key.startsWith("productPrice")) {
                    sizes.push(key);
                }
            });
            
            const firstAvailablePrice = sizes.map(size => selectedProduct[size]).find(price => price > 0) || 0;
            const productPrice = parseFloat(firstAvailablePrice);
            return productPrice;
        }
        


    if (page === "editProductForm" && selectedProduct) {
        return (
            <EditProductForm
                product={selectedProduct}
                onClose={handleCloseModal}
            />
        );
    }

    return (
        <div>
            <section>
                {/* <div className="bread-crumb">
                    <div style={{ fontSize: "20px", fontWeight: "semi bold" }}>Admin Dashboard</div>
                    <div>Home / all products</div>
                    </div> */}
                    {productDeleting && <Loader />}
                     <div class="search-container search-container-fixed" style={{padding: "10px", display: "flex", alignItems: "center", gap: "20px", cursor: "pointer"}} onClick={() => setSearchState((prev) => ({...prev, isSearching: true}))}>
                        <i className="fa-solid fa-magnifying-glass"></i>
                        <span className="text-muted">Search...</span>
                    </div>
                    {productDeleted &&
                        <div className="arrow-box">
                            Product successfully deleted!
                        </div>
                    }

                <div className="container my-5 product-page-container">
                    <header className="mb-4">
                        <h3>{productCategory ? productCategory : 'All products'}</h3>
                    </header>
                    <div>
                        <p style={{fontSize: "18px" }} className='float-right'>View all | {totalProducts.total} Products</p>
                    </div>
                    <div className="row">
                        {allProducts.products_loading && <BasicLoader />}
                        {allProducts.products?.map((product) => {
                            // console.log(product)
                            const sizes = [];
                            // Iterate through all keys of the 'product' object
                            Object.keys(product).forEach(key => {
                                // Check if the key starts with 'productPrice'
                                if (key.startsWith("productPrice")) {
                                    sizes.push(key);
                                }
                            });
                            
                            const firstAvailablePrice = sizes.map(size => product[size]).find(price => price > 0) || 0;
                            const productPrice = parseFloat(firstAvailablePrice);
                            console.log(import.meta.env.VITE_CURRENCY_CODE)
                            const convertedPrice = convertCurrency(productPrice, import.meta.env.VITE_CURRENCY_CODE, selectedCurrency);
                            console.log(convertedPrice)
                            const currencySymbol = currencySymbols[selectedCurrency];
                            const firstImage = product.productImage;
     
                            return (
                                <div
                                    className="col-lg-3 col-md-6 col-sm-6 col-6 single-item-container"
                                    style={{ textDecoration: "none", color: "black" }}
                                    key={product.id}
                                    onClick={() => setSelectedProduct(product)} // Set product for the modal
                                >
                                    <div className="my-2">
                                        {/* <img
                                            src={firstImage}
                                            className="card-img-top rounded-2"
                                            style={{ aspectRatio: "3 / 4", width: "100%", height: "auto" }}
                                        /> */}

<img
  src={firstImage}
  className="card-img-top rounded-2"
  loading="lazy"
  style={{ aspectRatio: "3 / 4", width: "100%", height: "auto" }}
  alt={product.productName}
/>



                                     
                                        
                                        <div className="pl-2 pt-2">
                                            <h5 style={{ display: "flex", gap: "5px" }}>
                                                <span>{currencySymbol}</span>
                                                <span>{convertedPrice.toLocaleString()}</span>
                                            </h5>
                                            <p className="mb-0">{product.productName}</p>
                                            {/* <p className="text-muted">{product.productDescription}</p> */}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        {/* pagination button */}
                        {
                            allProducts.products.length > 0 && allProducts.products.length > perPage && <div style={{display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column"}}>
                                <p><span>Page {currentPage} of {Math.ceil(totalProducts.total / perPage)}</span></p>
                                <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                                    <button className='btn btn-dark' onClick={handlePreviousPage} disabled={currentPage < 2}>&laquo;</button>
                                    {
                                        (()=>{
                                            
                                            return Array.from({ length: Math.ceil(totalProducts.total / perPage) }, (_, index) => (
                                                <button className={`btn btn-light ${currentPage == index + 1 && 'btn-dark'}`}  key={index} onClick={()=> handlePaginate(index + 1)}>{index + 1}</button>
                                            ));
                                        })()
                                    }
                                    <button className='btn btn-dark'  onClick={handleNextPage} disabled={currentPage == Math.ceil(totalProducts.total / perPage)}>&raquo;</button>

                                </div>
                            </div>
                        }
                    </div>
                </div>
            </section>


            {/* search modal */}
            {searchState.isSearching && (
             <div className="custom-modal-overlay-form" onClick={() => setSearchState((prev) => ({...prev, isSearching: false}))}>
                <div
                    className="card custom-modal-card"
                    style={{
                        width: "600px",
                        padding: "20px",
                        minHeight: "250px",
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div class="search-container" onClick={() => setSearchState((prev) => ({...prev, isSearching: true}))}>
                        <input type="text" placeholder="Search..." autoFocus value={searchQuery} onChange={handleSearchChange}/>
                        <i className="fa-solid fa-magnifying-glass"></i>
                    </div>
                    <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px"}}>
                        <small className="text-muted">Products</small>
                        {searchState.searchLoading && <div className="admin-form-loader-wrapper"></div>}
                    </div>
                    <hr />
                        <div style={{maxHeight: "400px", overflow: "auto"}}>
                        {searchState.searchData && (
                            searchState.searchData.map((product, index) => {
                                // console.log(product)
                                return <div key={index} className="admin-search-result-container" onClick={()=> {setSearchState((prev) => ({...prev, isSearching: false, searchLoading: false, wordNotFound: null})), setSelectedProduct(product)}}>
                                    <img src={product.productImage} alt="" width="50px"  />
                                    <p><b>{product.productName}</b></p>
                                </div>
                            })
                        )}
                        {searchState.wordNotFound != null && <div>Could not look up "{searchState.wordNotFound}"</div>}
                    </div>
                    
                </div>
            </div>
            )}

            {/* Custom Modal */}
            {selectedProduct && (
                
            <div className="custom-modal-overlay" onClick={() => setSelectedProduct(null)}>
                <div onClick={(e) => e.stopPropagation()} className="card custom-modal-card" style={{ width: "400px", maxHeight: "600px", overflowY: "auto", paddingTop: "20px" }}>
                    <div className="image-scroll-container">
                        {[
                            selectedProduct.productImage,
                            selectedProduct.subImage1,
                            selectedProduct.subImage2,
                            selectedProduct.subImage3
                        ].filter(image => image && image !== "null").map((image, index) => (
                            <img key={index} src={image} alt={`Product Image ${index + 1}`} className="modal-image" loading="lazy" />
                        ))}
                    </div>
                    <div className="card-body">
                        <div className="card-title">
                            <h5>
                                Price: {currencySymbols[selectedCurrency]}
                                {/* {convertCurrency(parseFloat(selectedProduct.productPriceInNaira12Inches), "NGN", selectedCurrency).toLocaleString()} */}
                                {convertCurrency(parseFloat(firstAvailablePrice(selectedProduct)), import.meta.env.VITE_CURRENCY_CODE, selectedCurrency).toLocaleString()}
                                {console.log(firstAvailablePrice(selectedProduct))}

                            </h5>
                        </div>
                        <p className="card-text">{selectedProduct.productName}</p>
                        <div style={{ display: "flex", justifyContent: "right", gap: "10px" }}>
                            <button onClick={() => { setPage("editProductForm") }} className="btn" style={{ backgroundColor: "purple", color: "white", width: "100%", maxWidth: "100px" }}>
                                Edit
                            </button>
                            <button
                                className="btn"
                                style={{
                                    backgroundColor: "black",
                                    color: "white",
                                    width: "100%",
                                    maxWidth: "100px",
                                }}
                                onClick={() => handleDeleteClick(selectedProduct)}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}



            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                
                <div className="custom-modal-overlay" onClick={() => setShowDeleteModal(false)}>
                    <div
                        className="card custom-modal-card"
                        style={{
                            width: "400px",
                            padding: "20px",
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div style={{display: "flex", gap: "10px", alignItems: "center"}}>
                            <img src={productToDelete.productImage} alt="" width="50px" />
                            <p>{productToDelete.productName}</p>
                        </div>
                        <h5 className="mt-2">Delete this item?</h5>
                        <p>This action is irreversible as it can not be undone</p>
                        <div style={{ display: "flex", justifyContent: "right", gap: "10px", marginTop: "20px" }}>
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="btn"
                                style={{
                                    backgroundColor: "gray",
                                    color: "white",
                                    width: "100px",
                                }}
                            >
                                No
                            </button>
                            <button
                                onClick={handleDeleteConfirm}
                                className="btn"
                                style={{
                                    backgroundColor: "red",
                                    color: "white",
                                    width: "100px",
                                }}
                            >
                                Yes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AllProducts;















