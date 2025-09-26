import './productCategories.css';
import useProductCategory from '../../productCategory/useProductCategory';
const ProductCategories = () => {
  const {
    isSaving,
    categories,
    isLoading,
    isError,
    modalType,
    inputValue,
    setInputValue,
    openModal,
    closeModal,
    handleSave,
    currentCategory,
    categoryNameInput,
    deletePhraseInput,
    setCategoryNameInput,
    setDeletePhraseInput,
    imageFile,
    setImageFile,
    imagePreview, // Get the preview URL
    handleImageChange // Get the function to handle image changes
  } = useProductCategory();

  if (isLoading) return <p>Loading categories...</p>;
  if (isError) return <p>Failed to load categories.</p>;

  return (
    <div className="product-category-main">
      <div className="my-3" style={{ display: "flex", justifyContent: "right" }}>
        <button className="btn btn-primary" onClick={() => openModal("create")}>
          <i className="fa-solid fa-plus"></i> <span className="px-1">New Category</span>
        </button>
      </div>

      {categories && categories.slice().reverse().map((category, index) => {
        const webpImageUrl = category?.image?.replace("/upload/", "/upload/f_auto,q_auto/");
        return (
          <div key={index} className="each-product-category">
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "60px", height: "70px", backgroundColor: "#e0e0e0", borderRadius: "5px", overflow: "hidden" }}>
                <img src={webpImageUrl} alt={category.name} width="60" height="70" loading="eager" style={{ objectFit: "cover", display: "block" }} />
              </div>
              <p>{category.name}</p>
            </div>
            <div style={{ display: "flex", justifyContent: "right", gap: "10px" }}>
            
              <button className="btn btn-dark" onClick={() => openModal("edit", category)}>Edit</button>
              <button className="btn btn-danger" onClick={() => openModal("delete", category)}>Delete</button>
            </div>
          </div>
        );
      })}

      {modalType && (
        <div className="single-order-container-overlay" onClick={isSaving ? (e) => e.stopPropagation() : closeModal}>
          <div className="out-for-delivery-modal-wrapper px-4" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ textAlign: "center" }} className="mb-3">
              {modalType === "create" && "Create New Product Category"}
              {modalType === "edit" && "Edit Product Category"}
              {modalType === "delete" && "Warning: Deleting this Category is Permanent"}
            </h3>

            {modalType === "delete" ? (
              <>
                <p style={{ textAlign: "center" }}>
                  Deleting this category is permanent and cannot be undone. All products with this category will be set to <strong>null</strong>.
                  Type <strong>{currentCategory?.name}</strong> and <strong>delete this category</strong> below to confirm deletion.
                </p>

                <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                  <input
                    type="text"
                    className="form-control"
                    style={{ marginBottom: "10px" }}
                    placeholder="Enter category name"
                    value={categoryNameInput}
                    onChange={(e) => setCategoryNameInput(e.target.value)}
                  />

                  <input
                    type="text"
                    className="form-control"
                    placeholder="Type 'delete this category'"
                    value={deletePhraseInput}
                    onChange={(e) => setDeletePhraseInput(e.target.value)}
                  />

                  <div style={{ display: "flex", justifyContent: "right", width: "100%", marginTop: "10px" }}>
                  {
                    isSaving ? <div className="spinner-border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  :
                    <div>
                      <button className="btn btn-danger" onClick={closeModal} style={{marginRight: "10px"}}>Cancel</button>
                      <button 
                        className="btn btn-dark"
                        disabled={categoryNameInput !== currentCategory?.name || deletePhraseInput !== "delete this category"}
                      >
                        Confirm Deletion
                      </button>
                    </div>
                  }
                    
                  </div>
                </form>

              </>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
                <input
                  type="text"
                  className="form-control mt-2"
                  style={{ width: "100%" }}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Category Name"
                  autoFocus
                />

                <input
                  type="file"
                  className="form-control"
                  style={{ width: "100%" }}
                  accept="image/*"
                  onChange={handleImageChange} // Use the updated handler here
                />

                {imagePreview && (
                  <div style={{ marginTop: "10px", textAlign: "center" }}>
                    <h5>Image Preview</h5>
                    <img
                      src={imagePreview}
                      alt="Image Preview"
                      style={{
                        width: "100%",
                        height: "auto",
                        maxWidth: "200px",
                        maxHeight: "250px",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                  </div>
                )}

                <div style={{ display: "flex", justifyContent: "right", width: "100%" }}>
                  {
                    isSaving ? <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    : <div>
                      <button className="btn btn-danger" onClick={closeModal} style={{marginRight: "10px"}}>Cancel</button>
                      <button className="btn btn-dark" type="submit">{modalType === "create" ? "Create" : "Save Changes"}</button>
                      </div>
                  }
                  
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCategories;





























// import useProductCategories from "../../productCategory/useProductCategory";
// import './productCategories.css';

// const ProductCategories = () => {
//   const {
//     categories,
//     isLoading,
//     isError,
//     modalType,
//     inputValue,
//     setInputValue,
//     openModal,
//     closeModal,
//     handleSave,
//     currentCategory,
//     categoryNameInput,
//     deletePhraseInput,
//     setCategoryNameInput,
//     setDeletePhraseInput
//   } = useProductCategories();

//   if (isLoading) return <p>Loading categories...</p>;
//   if (isError) return <p>Failed to load categories.</p>;

//   return (
//     <div className="product-category-main">
//       <div className="my-3" style={{ display: "flex", justifyContent: "right" }}>
//         <button className="btn btn-primary" onClick={() => openModal("create")}>
//           <i className="fa-solid fa-plus"></i> <span className="px-1">New Category</span>
//         </button>
//       </div>

//       {categories.map((category, index) => {
//         const webpImageUrl = category.image.replace("/upload/", "/upload/f_auto,q_auto/");

//         return( <div key={index} className="each-product-category">
//           <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
//   <div style={{
//     width: "60px",
//     height: "70px",
//     backgroundColor: "#e0e0e0", // light gray
//     // backgroundColor: "red",
//     borderRadius: "5px",
//     overflow: "hidden"
//   }}>
//     <img
//       src={webpImageUrl}
//       alt={category.name}
//       width="60px"
//       height="70px"
//       loading="eager"
//       style={{ objectFit: "cover", display: "block" }}
//     />
//   </div>
//   <p>{category.name}</p>
// </div>

//           <div style={{ display: "flex", gap: "10px", justifyContent: "right" }}>
//             <button className="btn btn-dark" onClick={() => openModal("edit", category)}>Edit</button>
//             <button className="btn btn-danger" onClick={() => openModal("delete", category)}>Delete</button>
//           </div>
//         </div>)
//       })}

//       {modalType && (
//         <div className="single-order-container-overlay" onClick={closeModal}>
//           <div className="out-for-delivery-modal-wrapper px-4" onClick={(e) => e.stopPropagation()}>
//             <h3 style={{ textAlign: "center" }} className="mb-3">
//               {modalType === "create" && "Create New Product Category"}
//               {modalType === "edit" && "Edit Product Category"}
//               {modalType === "delete" && "Warning: Deleting this Category is Permanent"}
//             </h3>

//             {modalType === "delete" ? (
//               <>
//                 <p style={{ textAlign: "center" }}>
//                   Deleting this category is permanent and cannot be undone. Additionally, all products with this category will now have their category set to <strong>null</strong>.
//                   To confirm, type the category name <strong>{currentCategory?.name}</strong> and the phrase <strong>"delete this category"</strong>.
//                 </p>
//                 <form style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }} onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
//                   <input
//                     type="text"
//                     className="form-control"
//                     style={{ width: "80%" }}
//                     value={categoryNameInput}
//                     onChange={(e) => setCategoryNameInput(e.target.value)}
//                     placeholder="Category Name"
//                     autoFocus
//                   />
//                   <input
//                     type="text"
//                     className="form-control"
//                     style={{ width: "80%" }}
//                     value={deletePhraseInput}
//                     onChange={(e) => setDeletePhraseInput(e.target.value)}
//                     placeholder="delete this category"
//                   />
//                 </form>
//               </>
//             ) : (
//               <form
//                 style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}
//                 onSubmit={(e) => { e.preventDefault(); handleSave(); }}
//               >
//                 <input
//                   type="text"
//                   className="form-control mt-2"
//                   style={{ width: "100%" }}
//                   value={inputValue}
//                   onChange={(e) => setInputValue(e.target.value)}
//                   placeholder="Category Name"
//                   autoFocus
//                 />
//               </form>
//             )}

//             <div className="mt-2" style={{ display: "flex", justifyContent: "right", gap: "10px" }}>
//               <button className="btn btn-danger" onClick={closeModal}>Cancel</button>
//               <button className="btn btn-primary" onClick={handleSave}>
//                 {modalType === "delete" ? "Confirm Delete" : "Save"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProductCategories;

































// import { useState, useEffect } from "react";
// import axios from "axios";
// import Cookies from 'js-cookie'
// import './productCategories.css';

// const ProductCategories = () => {
//   const [productCategories, setProductCategories] = useState([]);
//   const [modalType, setModalType] = useState(null); // 'create', 'edit', or 'delete'
//   const [currentCategory, setCurrentCategory] = useState(null);
//   const [inputValue, setInputValue] = useState("");
//   const [categoryNameInput, setCategoryNameInput] = useState(""); // For delete confirmation
//   const [deletePhraseInput, setDeletePhraseInput] = useState(""); // For delete confirmation

//   useEffect(() => {
//     fetchProductCategories();
//   }, []);

//   const fetchProductCategories = async () => {
//     try {
//       const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/fetch-product-categories`);
//       if (data.code === 'success') setProductCategories(data.data);
//     } catch (error) {
//       console.error("Error fetching product categories:", error);
//     }
//   };
//   const token = Cookies.get('authToken');

//   const handleSave = async () => {
//     if (modalType === "create") {
//       if (!inputValue.trim()) return alert("Category name cannot be empty!");
//       try {
//         const feedback = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/admin/create-product-category`, { newCategory: inputValue }, {
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         });
//         if (feedback.data.code === 'success') setProductCategories([...productCategories, feedback.data.data]);
//       } catch (error) {
//         console.error("Error creating product category:", error);
//       }
//     } 
//     else if (modalType === "edit") {
//       try {
//         const feedback = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/admin/edit-product-category`,  {
//           oldCategory: currentCategory.name, // Send old category name
//           newCategory: inputValue // Send new category name
//         }, {
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         });
//         if (feedback.data.code === 'success') {
//           setProductCategories(productCategories.map(cat => cat.id === currentCategory.id ? { ...cat, name: inputValue } : cat));
//         }
//       } catch (error) {
//         console.error("Error updating product category:", error);
//       }
//     } 
//     else if (modalType === "delete") {
//       if (categoryNameInput !== currentCategory.name || deletePhraseInput !== "delete this category") {
//         return alert("Please enter the correct category name and phrase to confirm deletion.");
//       }
//       try {
//         const feedback = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/admin/delete-product-category`, {
//           category: currentCategory.name 
//         }, {
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         });
      
//         if (feedback.data.code === 'success') {
//           setProductCategories(productCategories.filter(cat => cat.name !== currentCategory.name));
//         }
//       } catch (error) {
//         console.error("Error deleting product category:", error);
//       }
      
//     }
//     closeModal();
//   };

//   const openModal = (type, category = null) => {
//     setModalType(type);
//     setCurrentCategory(category);
//     setInputValue(type === "edit" ? category.name : "");
//     setCategoryNameInput(""); // Reset delete confirmation inputs
//     setDeletePhraseInput("");
//   };

//   const closeModal = () => {
//     setModalType(null);
//     setInputValue("");
//     setCategoryNameInput("");
//     setDeletePhraseInput("");
//     setCurrentCategory(null);
//   };

//   return (
//     <div className="product-category-main">
//       <div className="my-3" style={{ display: "flex", justifyContent: "right" }}>
//         <button className="btn btn-primary" onClick={() => openModal("create")}>
//           <i className="fa-solid fa-plus"></i> <span className="px-1">New Category</span>
//         </button>
//       </div>

//       {productCategories.map((category) => (
//         <div key={category.id} className="each-product-category">
//           <div style={{display: "flex", alignItems: "center",  gap: "10px"}}>
//             <img src={category.image} alt={category.name} width="50px" />
//             <p>{category.name}</p>
//           </div>
//           <div style={{ display: "flex", gap: "10px", justifyContent: "right"}}>
//             <button className="btn btn-dark" onClick={() => openModal("edit", category)}>Edit</button>
//             <button className="btn btn-danger" onClick={() => openModal("delete", category)}>Delete</button>
//           </div>
//         </div>
//       ))}

//       {/* Single Modal */}
//       {modalType && (
//         <div className="single-order-container-overlay" onClick={closeModal}>
//           <div className="out-for-delivery-modal-wrapper px-4" onClick={(e) => e.stopPropagation()}>
//             <h3 style={{ textAlign: "center" }}>
//               {modalType === "create" && "Create New Product Category"}
//               {modalType === "edit" && "Edit Product Category"}
//               {modalType === "delete" && "Warning: Deleting this Category is Permanent"}
//             </h3>

//             {modalType === "delete" ? (
//               <>
//                 <p style={{ textAlign: "center" }}>
//                   Deleting this category is permanent and cannot be undone. Additionally, all products with this category will now have their category set to <strong>null</strong>.
//                   To confirm, type the category name <strong>{currentCategory?.name}</strong> and the phrase <strong>"delete this category"</strong>.
//                 </p>
//                 <form style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }} onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
//                   <input
//                     type="text"
//                     className="form-control"
//                     style={{ width: "80%" }}
//                     value={categoryNameInput}
//                     onChange={(e) => setCategoryNameInput(e.target.value)}
//                     placeholder="Category Name"
//                     autoFocus
//                   />
//                   <input
//                     type="text"
//                     className="form-control"
//                     style={{ width: "80%" }}
//                     value={deletePhraseInput}
//                     onChange={(e) => setDeletePhraseInput(e.target.value)}
//                     placeholder="delete this category"
//                   />
//                 </form>
//               </>
//             ) : (
//               <form 
//                 style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }} 
//                 onSubmit={(e) => { e.preventDefault(); handleSave(); }}
//               >
//                 <input
//                   type="text"
//                   className="form-control"
//                   style={{ width: "80%" }}
//                   value={inputValue}
//                   onChange={(e) => setInputValue(e.target.value)}
//                   placeholder="Category Name"
//                   autoFocus
//                 />
//               </form>
//             )}

//             <div className="mt-2" style={{ display: "flex", justifyContent: "right", gap: "10px" }}>
//               <button className="btn btn-danger" onClick={closeModal}>Cancel</button>
//               <button className="btn btn-primary" onClick={handleSave}>
//                 {modalType === "delete" ? "Confirm Delete" : "Save"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProductCategories;
