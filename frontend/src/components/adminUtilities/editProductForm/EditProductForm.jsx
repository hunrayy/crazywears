
import Loader from "../../loader/Loader";
import "./editProduct.css";
import Select from "react-select";
import useEditProductForm from "./useEditProductForm";


const EditProductForm = ({ product, onClose}) => {
    const {
        MAX_SUB_IMAGES,
        formData,
        setFormData,
        imagePreviews,
        setImagePreviews,
        isLoading,
        showModal,
        categories,
        productCategoryLoading,
        isFormValid,
        handleInputChange,
        handleSubMediaChange,
        addSubImage,
        removeSubImage,
        handleCategoryChange,
        handleSubmit,
        handlePostProduct,
        formatNumberWithCommas,
        removeCommas,
        setShowModal,
    } = useEditProductForm(product, onClose);

    return (
        <div>
            {isLoading && <Loader />}
            <div className="admin-editPage-container">
                <div className="bread-crumb">
                    <div style={{ fontSize: "20px", fontWeight: "semi bold" }}>Admin Dashboard</div>
                    <div>Home / Edit Product</div>
                </div>
                <div style={{ padding: "20px 0 0 20px", fontSize: "20px" }} className="d-lg-none">
                    <i className="fa-solid fa-arrow-left" onClick={onClose}></i>
                </div>
                <div className="admin-editPage-form" style={{ padding: "0px 20px 35px 20px" }}>

                    <h2>Edit Product</h2>
                    <form onSubmit={handleSubmit} className="row">
                        <div className="mb-3">
                            <label htmlFor="productImage" className="form-label">Main Product Image</label>
                            <div style={{display: "flex", justifyContent: "center", alignItems: "center", gap: "10px"}}>
                                <input type="file" className="form-control" id="productImage" onChange={handleInputChange} />
                                {formData && (
                                    <div>
                                        <img src={product.mainProductMedia} alt="Product" style={{ width: '30px', height: 'auto', maxHeight: "40px", objectFit: "cover", opacity: imagePreviews.productImage ? 0.4 : 1 }} />
                                    </div>
                                )}

                                {imagePreviews.productImage && (
                                    <>
                                        <i className="fa-solid fa-arrow-right"></i>
                                        <div>
                                            <img src={imagePreviews.productImage} alt="Product" style={{ width: '30px', height: 'auto', maxHeight: "40px", objectFit: "cover", }} />
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Sub Images</label>

                            {formData.subImages.map((img, index) => (
                                <div
                                    key={index}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "10px",
                                        marginBottom: "10px"
                                    }}
                                >
                                    <input
                                        type="file"
                                        className="form-control"
                                        accept="image/*"
                                        onChange={(e) => handleSubMediaChange(e, index)}
                                    />

                                    {/* OLD IMAGE */}
                                    {img.url && (
                                        <img
                                            src={img.url}
                                            alt="old"
                                            style={{
                                                width: "40px",
                                                height: "40px",
                                                objectFit: "cover",
                                                opacity: img.isNew ? 0.3 : 1
                                            }}
                                        />
                                    )}

                                    {/* ARROW ONLY IF old image exists AND new file selected */}
                                    {img.url && img.previewUrl && img.file && (
                                        <i className="fa-solid fa-arrow-right text-muted"></i>
                                    )}

                                    {/* NEW PREVIEW (always show if selected) */}
                                    {img.isNew && img.previewUrl && (
                                        <>
                                            <img
                                                src={img.previewUrl}
                                                alt="new"
                                                style={{
                                                    width: "40px",
                                                    height: "40px",
                                                    objectFit: "cover"
                                                }}
                                            />
                                        </>
                                    )}

                                    <button
                                        type="button"
                                        className="btn btn-sm btn-danger"
                                        onClick={() => removeSubImage(index)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="mb-3">
                            {formData.subImages.length < MAX_SUB_IMAGES && (
                                <button
                                    type="button"
                                    className="btn btn-outline-dark mt-2"
                                    onClick={addSubImage}
                                >
                                    Add Sub Image ({MAX_SUB_IMAGES - formData.subImages.length} left)
                                </button>
                            )}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="productName" className="form-label">Product Name</label>
                            <input type="text" className="form-control" id="productName" value={formData.productName} onChange={(e) => setFormData({ ...formData, productName: e.target.value })} />
                        </div>
                        
                        <div className="mb-3">
                            <label className="mb-2">Product Category</label><br />
                            <label className="mb-2">( Current Product Category: {product?.category?.name} )</label> 
                            <Select
                                options={ categories && categories.map((cat) => ({
                                    id: cat.id,
                                    label: cat.name,
                                    }))
                                }
                            value={formData.selectedCategory}
                            onChange={handleCategoryChange}
                            isLoading={productCategoryLoading}
                            />
                        
                        </div>
                        {/* {console.log(parseFloat(product.productPrice12Inches).toLocaleString())} */}
                        <div className="mb-3">
                            <label className="form-label">Sizes & Prices</label>

                            {formData.productPrices.map((item, index) => (
                                <div key={index} className="d-flex align-items-center mb-2 gap-2">
                                <input
                                    type="text"
                                    placeholder="Size"
                                    className="form-control"
                                    value={item.size}
                                    onChange={(e) => {
                                    const updatedPrices = [...formData.productPrices];
                                    updatedPrices[index].size = e.target.value;
                                    setFormData({ ...formData, productPrices: updatedPrices });
                                    }}
                                />
                                <input
                                    type="text"
                                    placeholder={`Price (${import.meta.env.VITE_BASE_CURRENCY})`}
                                    className="form-control"
                                    value={formatNumberWithCommas(item.price)}
                                    onChange={(e) => {
                                    const updatedPrices = [...formData.productPrices];
                                    updatedPrices[index].price = removeCommas(e.target.value);
                                    setFormData({ ...formData, productPrices: updatedPrices });
                                    }}
                                />
                                <button
                                    type="button"
                                    className="btn btn-sm btn-danger"
                                    onClick={() => {
                                    const updatedPrices = [...formData.productPrices];
                                    updatedPrices.splice(index, 1);
                                    setFormData({ ...formData, productPrices: updatedPrices });
                                    }}
                                >
                                    Remove
                                </button>
                                </div>
                            ))}

                            <button
                                type="button"
                                className="btn btn-dark mt-2"
                                onClick={() =>
                                setFormData({
                                    ...formData,
                                    productPrices: [...formData.productPrices, { size: "", price: "" }],
                                })
                                }
                            >
                                Add Size
                            </button>
                            </div>
                        
                       
                        <button type="submit" className="btn" style={{background: "purple", color: "white"}} disabled={!isFormValid}>Update</button>
                    </form>
                </div>
            </div>

            {/* Custom modal */}
            {showModal && (
                <div className="custom-modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="custom-modal-card card p-5 mx-3" onClick={(e) => e.stopPropagation()}>
                            {/* <button className="close-btn" onClick={() => setShowModal(false)}>
                                &times;
                            </button> */}
                        <div className="custom-modal-header">
                            <h5>Confirm Changes</h5>
                        </div>
                        <div className="custom-modal-body">
                            <p>Are you sure you want to save these changes?</p>
                        </div>
                        <div style={{display: "flex", justifyContent: "right", gap: "10px"}}>
                            <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                Cancel
                            </button>
                            <button className="btn" style={{backgroundColor: "purple", color: "white"}} onClick={handlePostProduct}>
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditProductForm;
















































// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import Cookies from "js-cookie";
// import Loader from "../../loader/Loader";
// import "./editProduct.css";
// import { useNavigate } from "react-router-dom";
// import { Card } from "react-bootstrap";
// import { toast } from "react-toastify";
// import useProductCategory from "../../productCategory/useProductCategory";
// import Select from "react-select";

// const EditProductForm = ({ product, onClose}) => {
//     const { categories, isLoading: productCategoryLoading } = useProductCategory()
//     console.log(product)
//     console.log(categories)
//     const navigate = useNavigate();
//     const [formData, setFormData] = useState({
//         productImage: null,
//         subImage1: null,
//         subImage2: null,
//         subImage3: null,
//         productName: "",
//         selectedCategory: null, 
//         productPrice12Inches: "",
//         productPrice14Inches: "",
//         productPrice16Inches: "",
//         productPrice18Inches: "",
//         productPrice20Inches: "",
//         productPrice22Inches: "",
//         productPrice24Inches: "",
//         productPrice26Inches: "",
//         productPrice28Inches: "",
//     });
//     const [imagePreviews, setImagePreviews] = useState({
//         productImage: null,
//         subImage1: null,
//         subImage2: null,
//         subImage3: null,
//     });
//     const [isLoading, setIsLoading] = useState(false);
//     const [serverSuccessState, setServerSuccessState] = useState(false);
//     const [serverErrorMessage, setServerErrorMessage] = useState({
//         status: false,
//         message: "",
//     });
//     const [showModal, setShowModal] = useState(false);

//     useEffect(() => {
//         console.log(product)
//         if (product) {
//             setFormData({
//                 productId: product._id,
//                 productImage: product.productImage || null,
//                 subImage1: product.subImage1 || null,
//                 subImage2: product.subImage2 || null,
//                 subImage3: product.subImage3 || null,
//                 productName: product.productName,
//                 selectedCategory: {
//                     value: product.category.id, 
//                     label: product.category.name
//                 },
//                 productPrice12Inches: Number(product.productPrice12Inches).toLocaleString(),
//                 productPrice14Inches: Number(product.productPrice14Inches).toLocaleString(),
//                 productPrice16Inches: Number(product.productPrice16Inches).toLocaleString(),
//                 productPrice18Inches: Number(product.productPrice18Inches).toLocaleString(),
//                 productPrice20Inches: Number(product.productPrice20Inches).toLocaleString(),
//                 productPrice22Inches: Number(product.productPrice22Inches).toLocaleString(),
//                 productPrice24Inches: Number(product.productPrice24Inches).toLocaleString(),
//                 productPrice26Inches: Number(product.productPrice26Inches).toLocaleString(),
//                 productPrice28Inches: Number(product.productPrice28Inches).toLocaleString(),
                
//             });
//             // Set image previews
//             setImagePreviews({
//                 productImage: product.productImage ? URL.createObjectURL(new Blob([product.productImage])) : null,
//                 subImage1: product.subImage1 ? URL.createObjectURL(new Blob([product.subImage1])) : null,
//                 subImage2: product.subImage2 ? URL.createObjectURL(new Blob([product.subImage2])) : null,
//                 subImage3: product.subImage3 ? URL.createObjectURL(new Blob([product.subImage3])) : null,
//             });
//         }
//     }, [product]);
//     const handleCategoryChange = (selectedOption) => {
//         setFormData((prev) => ({
//             ...prev,
//             selectedCategory: selectedOption
//         }));
//     };

//     const handleInputChange = (e) => {
//         const { id, files } = e.target;
//         const file = files ? files[0] : null;

//         // Update formData
//         setFormData((prevState) => ({
//             ...prevState,
//             [id]: file,
//         }));

//         // Update image previews
//         if (file) {
//             const objectURL = URL.createObjectURL(file);
//             setImagePreviews((prevState) => ({
//                 ...prevState,
//                 [id]: objectURL,
//             }));
//         } else {
//             setImagePreviews((prevState) => ({
//                 ...prevState,
//                 [id]: null,
//             }));
//         }
//     };

//     const formatNumberWithCommas = (value) => {
//         if (!value) return "";
//         return value.replace(/\D/g, "") // Remove non-numeric characters
//             .replace(/\B(?=(\d{3})+(?!\d))/g, ","); // Add commas
//     };

//     const removeCommas = (value) => {
//         return value.replace(/,/g, "");
//     };

//     const isFormValid = formData.productName && formData.selectedCategory && formData.productPrice12Inches &&
//     formData.productPrice14Inches && formData.productPrice16Inches &&
//     formData.productPrice18Inches && formData.productPrice20Inches && 
//     formData.productPrice22Inches && formData.productPrice24Inches &&
//     formData.productPrice26Inches && formData.productPrice28Inches;

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         if (isFormValid) {
//             setShowModal(true);
//         }
//     };

//     const handlePostProduct = async () => {
//         setShowModal(false);
//         setIsLoading(true);
//         setServerErrorMessage({ status: false, message: "" });

//         const uploadData = new FormData();
//         if (formData.productImage) uploadData.append("productImage", formData.productImage);
//         if (formData.subImage1) uploadData.append("subImage1", formData.subImage1);
//         if (formData.subImage2) uploadData.append("subImage2", formData.subImage2);
//         if (formData.subImage3) uploadData.append("subImage3", formData.subImage3);
//         uploadData.append("productName", formData.productName);
//         uploadData.append("productCategory", formData.selectedCategory.label);
//         uploadData.append("productPrice12Inches", Number(formData.productPrice12Inches.replace(/,/g, "")));
//         uploadData.append("productPrice14Inches", Number(formData.productPrice14Inches.replace(/,/g, "")));
//         uploadData.append("productPrice16Inches", Number(formData.productPrice16Inches.replace(/,/g, "")));
//         uploadData.append("productPrice18Inches", Number(formData.productPrice18Inches.replace(/,/g, "")));
//         uploadData.append("productPrice20Inches", Number(formData.productPrice20Inches.replace(/,/g, "")));
//         uploadData.append("productPrice22Inches", Number(formData.productPrice22Inches.replace(/,/g, "")));
//         uploadData.append("productPrice24Inches", Number(formData.productPrice24Inches.replace(/,/g, "")));
//         uploadData.append("productPrice26Inches", Number(formData.productPrice26Inches.replace(/,/g, "")));
//         uploadData.append("productPrice28Inches", Number(formData.productPrice28Inches.replace(/,/g, "")));


//         try {
//             const token = Cookies.get("authToken");
//             const feedback = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/admin/update-product`,
//                 uploadData,
//                 {
//                     params: {
//                         productId: product.id
//                     },
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                         "Content-Type": "multipart/form-data",
//                     }
//                 }
//             );
//             console.log(feedback)
//             if (feedback) {
//                 setIsLoading(false);
//                 if (feedback.data.code === "success") {
//                     setServerSuccessState(true);
//                     setTimeout(() => {
//                         setServerSuccessState(false);
//                     }, 5000);
//                      setFormData({
//                         productId: null,
//                         productImage: null,
//                         subImage1: null,
//                         subImage2: null,
//                         subImage3: null,
//                         productName: "",
//                         selectedCategory: null,
//                         productPrice12Inches: "",
//                         productPrice14Inches: "",
//                         productPrice16Inches: "",
//                         productPrice18Inches: "",
//                         productPrice20Inches: "",
//                         productPrice22Inches: "",
//                         productPrice24Inches: "",
//                         productPrice26Inches: "",
//                         productPrice28Inches: "",

//                     });
//                     setImagePreviews({
//                         productImage: null,
//                         subImage1: null,
//                         subImage2: null,
//                         subImage3: null,
//                     });
                    
                   
//                 } else {
//                     toast.error(feedback.data.message)
//                     setServerErrorMessage({
//                         status: true,
//                         message: `An error occurred while updating product: ${feedback.data.message}`,
//                     });
//                 }
//             }
//         } catch (error) {
//             toast.error(error.message)
//             setIsLoading(false);
//         }
//     };

//     return (
//         <div>
//             {isLoading && <Loader />}
//             <div className="admin-editPage-container">
//                 <div className="bread-crumb">
//                     <div style={{ fontSize: "20px", fontWeight: "semi bold" }}>Admin Dashboard</div>
//                     <div>Home / Edit Product</div>
//                 </div>
//                 <div style={{ padding: "20px 0 0 20px", fontSize: "20px" }} className="d-lg-none">
//                     <i className="fa-solid fa-arrow-left" onClick={onClose}></i>
//                 </div>
//                 <div className="admin-editPage-form" style={{ padding: "0px 20px 35px 20px" }}>
//                     {serverErrorMessage.status && (
//                         <div className="alert alert-danger mt-1">{serverErrorMessage.message}</div>
//                     )}
//                     {serverSuccessState && <div className="arrow-box">Product successfully updated!</div>}

//                     <h2>Edit Product</h2>
//                     <form onSubmit={handleSubmit} className="row">
//                         <div className="mb-3">
//                             <label htmlFor="productImage" className="form-label">Main Product Image</label>
//                             <div style={{display: "flex"}}>
//                                  <input type="file" className="form-control" id="productImage" onChange={handleInputChange} />
//                                  {formData && (
//                                     <div>
//                                         <img src={product.productImage} alt="Product" style={{ width: '30px', height: 'auto' }} />
//                                     </div>
//                                 )}
//                             </div>
//                         </div>
//                         <div className="mb-3">
//                             <label htmlFor="subImage1" className="form-label">Sub Image 1 (optional)</label>
//                             <div style={{display: "flex"}}>
//                                 <input type="file" className="form-control" id="subImage1" onChange={handleInputChange} />
//                                 {(product.subImage1 && product.subImage1 !== "null") && (
//                                     <div>
//                                         <img src={product.subImage1} alt="Sub Image 1" style={{ width: '30px', height: 'auto' }} />
//                                     </div>
//                                 )}
//                             </div>
//                         </div>
//                         <div className="mb-3">
//                             <label htmlFor="subImage2" className="form-label">Sub Image 2 (optional)</label>
//                             <div style={{display: "flex"}}>
//                                 <input type="file" className="form-control" id="subImage2" onChange={handleInputChange} />
//                                 {(product.subImage2 && product.subImage2 !== "null") && (
//                                     <div>
//                                         <img src={product.subImage2} alt="Sub Image 2" style={{ width: '30px', height: 'auto' }} />
//                                     </div>
//                                 )}
//                             </div>
//                         </div>
//                         <div className="mb-3">
//                             <label htmlFor="subImage3" className="form-label">Sub Image 3 (optional)</label>
//                             <div style={{display: "flex"}}>
//                                 <input type="file" className="form-control" id="subImage3" onChange={handleInputChange} />
//                                 {(product.subImage3 && product.subImage3 !== "null") && (
//                                     <div>
//                                         <img src={product.subImage3} alt="Sub Image 3" style={{ width: '30px', height: 'auto' }} />
//                                     </div>
//                                 )}
//                             </div>
//                         </div>
//                         <div className="mb-3">
//                             <label htmlFor="productName" className="form-label">Product Name</label>
//                             <input type="text" className="form-control" id="productName" value={formData.productName} onChange={(e) => setFormData({ ...formData, productName: e.target.value })} />
//                         </div>
//                         {/* <div className="mb-3">
//                             <label htmlFor="productPrice" className="form-label">Product Price</label>
//                             <input type="text" className="form-control" id="productPrice" value={formatNumberWithCommas(formData.productPrice)} onChange={(e) => setFormData({ ...formData, productPrice: removeCommas(e.target.value) })} />
//                         </div> */}
//                         <div>
//                             <label className="mb-2">Product Category</label>
//                             <label>( Current Product Category: {product.category.name} )</label>
//                             <Select
//                                 options={ categories && categories.map((cat) => ({
//                                     value: cat._id,
//                                     label: cat.name,
//                                     }))
//                                 }
//                             value={formData.selectedCategory}
//                             onChange={handleCategoryChange}
//                             isLoading={productCategoryLoading}
//                             />
                        
//                         </div>
//                         {console.log(parseFloat(product.productPrice12Inches).toLocaleString())}
//                         <div className="mb-3 col-6">
//                             {console.log(formData)}
//                             <label htmlFor="productPrice" className="form-label">Product Price In {import.meta.env.VITE_BASE_CURRENCY}(12 inches)</label>
//                             <input type="text" className="form-control" id="productPrice" value={formatNumberWithCommas(formData.productPrice12Inches)} onChange={(e) => setFormData({ ...formData, productPrice12Inches: removeCommas(e.target.value) })} />
//                         </div>
//                         <div className="mb-3 col-6">
//                             <label htmlFor="productPrice" className="form-label">Product Price In {import.meta.env.VITE_BASE_CURRENCY}(14 inches)</label>
//                             <input type="text" className="form-control" id="productPrice" value={formatNumberWithCommas(formData.productPrice14Inches)} onChange={(e) => setFormData({ ...formData, productPrice14Inches: removeCommas(e.target.value) })} />
//                         </div>
//                         <div className="mb-3 col-6">
//                             <label htmlFor="productPrice" className="form-label">Product Price In {import.meta.env.VITE_BASE_CURRENCY}(16 inches)</label>
//                             <input type="text" className="form-control" id="productPrice" value={formatNumberWithCommas(formData.productPrice16Inches)} onChange={(e) => setFormData({ ...formData, productPrice16Inches: removeCommas(e.target.value) })} />
//                         </div><div className="mb-3 col-6">
//                             <label htmlFor="productPrice" className="form-label">Product Price In {import.meta.env.VITE_BASE_CURRENCY}(18 inches)</label>
//                             <input type="text" className="form-control" id="productPrice" value={formatNumberWithCommas(formData.productPrice18Inches)} onChange={(e) => setFormData({ ...formData, productPrice18Inches: removeCommas(e.target.value) })} />
//                         </div><div className="mb-3 col-6">
//                             <label htmlFor="productPrice" className="form-label">Product Price In {import.meta.env.VITE_BASE_CURRENCY}(20 inches)</label>
//                             <input type="text" className="form-control" id="productPrice" value={formatNumberWithCommas(formData.productPrice20Inches)} onChange={(e) => setFormData({ ...formData, productPrice20Inches: removeCommas(e.target.value) })} />
//                         </div><div className="mb-3 col-6">
//                             <label htmlFor="productPrice" className="form-label">Product Price In {import.meta.env.VITE_BASE_CURRENCY}(22 inches)</label>
//                             <input type="text" className="form-control" id="productPrice" value={formatNumberWithCommas(formData.productPrice22Inches)} onChange={(e) => setFormData({ ...formData, productPrice22Inches: removeCommas(e.target.value) })} />
//                         </div><div className="mb-3 col-6">
//                             <label htmlFor="productPrice" className="form-label">Product Price In {import.meta.env.VITE_BASE_CURRENCY}(24 inches)</label>
//                             <input type="text" className="form-control" id="productPrice" value={formatNumberWithCommas(formData.productPrice24Inches)} onChange={(e) => setFormData({ ...formData, productPrice24Inches: removeCommas(e.target.value) })} />
//                         </div><div className="mb-3 col-6">
//                             <label htmlFor="productPrice" className="form-label">Product Price In {import.meta.env.VITE_BASE_CURRENCY}(26 inches)</label>
//                             <input type="text" className="form-control" id="productPrice" value={formatNumberWithCommas(formData.productPrice26Inches)} onChange={(e) => setFormData({ ...formData, productPrice26Inches: removeCommas(e.target.value) })} />
//                         </div><div className="mb-3 col-6">
//                             <label htmlFor="productPrice" className="form-label">Product Price In {import.meta.env.VITE_BASE_CURRENCY}(28 inches)</label>
//                             <input type="text" className="form-control" id="productPrice" value={formatNumberWithCommas(formData.productPrice28Inches)} onChange={(e) => setFormData({ ...formData, productPrice28Inches: removeCommas(e.target.value) })} />
//                         </div>
                       
//                         <button type="submit" className="btn" style={{background: "purple", color: "white"}} disabled={!isFormValid}>Update</button>
//                     </form>
//                 </div>
//             </div>

//             {/* Custom modal */}
//             {showModal && (
//                 <div className="custom-modal-overlay" onClick={() => setShowModal(false)}>
//                     <div className="custom-modal-card card p-5" onClick={(e) => e.stopPropagation()}>
//                             {/* <button className="close-btn" onClick={() => setShowModal(false)}>
//                                 &times;
//                             </button> */}
//                         <div className="custom-modal-header">
//                             <h5>Confirm Changes</h5>
//                         </div>
//                         <div className="custom-modal-body">
//                             <p>Are you sure you want to save these changes?</p>
//                         </div>
//                         <div style={{display: "flex", justifyContent: "right", gap: "10px"}}>
//                             <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
//                                 Cancel
//                             </button>
//                             <button className="btn" style={{backgroundColor: "purple", color: "white"}} onClick={handlePostProduct}>
//                                 Save Changes
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default EditProductForm;
