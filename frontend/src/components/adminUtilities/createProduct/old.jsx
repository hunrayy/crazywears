


// =========================================================================================================

// =========================This is the perfectly working version with one video creation===================

// =========================================================================================================

// import { useState, useRef, useEffect } from "react";
// import { Button, Card } from "react-bootstrap";
// import CustomModal from "../../customModal/CustomModal";
// import "./createProduct.css";
// import axios from "axios";
// import Loader from "../../loader/Loader";
// import Cookies from "js-cookie";
// import { toast } from "react-toastify";
// import Select from "react-select";
// import useProductCategory from "../../productCategory/useProductCategory";

// const CreateProduct = () => {
//   const { categories, isLoading: productCategoryLoading } = useProductCategory();
//   const productMediaRef = useRef(null);
//   const token = Cookies.get("authToken");
//   const currencyCode = import.meta.env.VITE_CURRENCY_CODE;

//   const [formData, setFormData] = useState({
//     mainProductMedia: null,
//     mainPreview: null,
//     subMedia: [],
//     productName: "",
//     selectedCategory: null,
//     productPrices: [],
//   });

//   const videoRefs = useRef({});
//   const [isLoading, setIsLoading] = useState(false);
//   const [showModal, setShowModal] = useState(false);

//   const sizeOptions = [
//     { value: "sm", label: "Small" },
//     { value: "md", label: "Medium" },
//     { value: "lg", label: "Large" },
//     { value: "xl", label: "Extra Large" },
//   ];

//   // ---------------------- UTILITIES ----------------------
//   const formatNumberWithCommas = (value) => {
//     if (!value && value !== 0) return "";
//     const [intPart, decPart] = value.toString().split(".");
//     return intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (decPart ? "." + decPart : "");
//   };

//   const removeCommas = (value) => value.replace(/,/g, "");

//   const validateFile = (file) => {
//     const MAX_VIDEO_SIZE = 10 * 1024 * 1024; // 10MB
//     const MAX_IMAGE_SIZE = 2 * 1024 * 1024;  // 2MB
//     const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/ogg"];
//     const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

//     if (!file) return false;

//     const isVideo = file.type.startsWith("video/");
//     const isImage = file.type.startsWith("image/");

//     if (!isVideo && !isImage) {
//       toast.error("Only images and videos are allowed");
//       return false;
//     }

//     if (isImage && !ALLOWED_IMAGE_TYPES.includes(file.type)) {
//       toast.error("Only JPG, PNG, WEBP images allowed");
//       return false;
//     }

//     if (isVideo && !ALLOWED_VIDEO_TYPES.includes(file.type)) {
//       toast.error("Only MP4, WEBM, OGG videos allowed");
//       return false;
//     }

//     if (isVideo && file.size > MAX_VIDEO_SIZE) {
//       toast.error("Video too large (max 10MB)");
//       return false;
//     }

//     if (isImage && file.size > MAX_IMAGE_SIZE) {
//       toast.error("Image too large (max 2MB)");
//       return false;
//     }

//     return true;
//   };

//   const hasExistingVideo = () => {
//     // check main media
//     if (formData.mainProductMedia?.type?.startsWith("video/")) {
//       return true;
//     }

//     // check sub media
//     return formData.subMedia.some((item) =>
//       item.file?.type?.startsWith("video/")
//     );
//   };

//   const validateVideoDuration = (file) => {
//     return new Promise((resolve) => {
//       const video = document.createElement("video");
//       const url = URL.createObjectURL(file);
//       video.preload = "metadata";
//       video.src = url;

//       video.onloadedmetadata = () => {
//         URL.revokeObjectURL(url);
//         resolve(video.duration <= 30);
//       };

//       video.onerror = () => {
//         URL.revokeObjectURL(url);
//         resolve(false);
//       };
//     });
//   };

//   // ---------------------- HANDLERS ----------------------
//   const handleInputChange = async (e) => {
//     const { id, files, value } = e.target;

//     if (id === "mainProductMedia") {
//       if (!files || !files[0]) return;
//       const file = files[0];

//       if (!validateFile(file)) {
//         e.target.value = "";
//         return;
//       }

//       // ✅ NEW RULE: only one video allowed globally
//       if (file.type.startsWith("video/") && hasExistingVideo()) {
//         toast.error("Only one video is allowed (main or sub media).");

//         // 🔥 clear main selection attempt
//         if (formData.mainPreview) {
//           URL.revokeObjectURL(formData.mainPreview);
//         }

//         setFormData((prev) => ({
//           ...prev,
//           mainProductMedia: null,
//           mainPreview: null,
//         }));

//         e.target.value = "";
//         return;
//       }

//       if (formData.mainPreview) URL.revokeObjectURL(formData.mainPreview);
//       const preview = URL.createObjectURL(file);

//       setFormData((prev) => ({
//         ...prev,
//         mainProductMedia: file,
//         mainPreview: preview,
//       }));
//     }
//     else if (id.startsWith("subMedia")) {
//       if (!files || !files[0]) return;
//       const file = files[0];
//       const index = Number(id.split("-")[1]);
//       const updatedSubMedia = [...formData.subMedia];

//       if (!updatedSubMedia[index]) {
//         updatedSubMedia[index] = { id: Date.now(), name: `Sub Media ${index + 1}`, file: null, preview: null };
//       }

//       if (!validateFile(file)) {
//         e.target.value = "";
//         return;
//       }

//       // ✅ NEW RULE: only one video allowed globally
//       if (file.type.startsWith("video/") && hasExistingVideo()) {
//         toast.error("Only one video is allowed (main or sub media).");

//         const updatedSubMedia = [...formData.subMedia];
//         const index = Number(id.split("-")[1]);

//         // 🔥 CLEAR THE SLOT THAT USER TRIED TO REPLACE
//         if (updatedSubMedia[index]) {
//           if (updatedSubMedia[index].preview) {
//             URL.revokeObjectURL(updatedSubMedia[index].preview);
//           }

//           updatedSubMedia[index].file = null;
//           updatedSubMedia[index].preview = null;
//         }

//         setFormData((prev) => ({
//           ...prev,
//           subMedia: updatedSubMedia,
//         }));

//         e.target.value = "";
//         return;
//       }

//       if (file.type.startsWith("video/")) {
//         const isValidDuration = await validateVideoDuration(file);
//         if (!isValidDuration) {
//           toast.error(`${updatedSubMedia[index].name} must not exceed 30 seconds`);
//           if (updatedSubMedia[index].preview) URL.revokeObjectURL(updatedSubMedia[index].preview);
//           updatedSubMedia[index].file = null;
//           updatedSubMedia[index].preview = null;
//           setFormData((prev) => ({ ...prev, subMedia: updatedSubMedia }));
//           e.target.value = "";
//           return;
//         }
//       }

//       if (updatedSubMedia[index].preview) URL.revokeObjectURL(updatedSubMedia[index].preview);
//       updatedSubMedia[index].file = file;
//       updatedSubMedia[index].preview = URL.createObjectURL(file);

//       setFormData((prev) => ({ ...prev, subMedia: updatedSubMedia }));
//     } 
//     else {
//       setFormData((prev) => ({ ...prev, [id]: value }));
//     }
//   };

//   const handleCategoryChange = (selectedOption) => {
//     setFormData((prev) => ({ ...prev, selectedCategory: selectedOption }));
//   };

//   const handleSizeSelect = (option) => {
//     if (isDuplicateSize(option.label)) {
//       return toast.error("Size already added!");
//     }

//     setFormData((prev) => ({
//       ...prev,
//       productPrices: [...prev.productPrices, { size: option.label, price: "" }],
//     }));
//   };

//   const addCustomSize = () => {
//     setFormData((prev) => ({
//       ...prev,
//       productPrices: [...prev.productPrices, { size: "", price: "" }],
//     }));
//   };

//   const addSubMedia = () => {
//     setFormData((prev) => {
//       const updatedSubMedia = [
//         ...prev.subMedia,
//         { id: Date.now() + Math.random(), name: `Sub Media ${prev.subMedia.length + 1}`, file: null, preview: null },
//       ];
//       // Sync videoRefs exactly
//       // do nothing OR optionally clean stale refs safely
//       // Object.keys(videoRefs.current).forEach((key) => {
//       //   if (!formData.subMedia[Number(key)]) {
//       //     delete videoRefs.current[key];
//       //   }
//       // });
//       return { ...prev, subMedia: updatedSubMedia };
//     });
//   };

//   const removeSubMedia = (id) => {
//     setFormData((prev) => {
//       const updatedSubMedia = prev.subMedia.filter((item) => item.id !== id);
//         updatedSubMedia.forEach((item, i) => (item.name = `Sub Media ${i + 1}`));
//       // do nothing OR optionally clean stale refs safely
//       // Object.keys(videoRefs.current).forEach((key) => {
//       //   if (!formData.subMedia[Number(key)]) {
//       //     delete videoRefs.current[key];
//       //   }
//       // });
//       delete videoRefs.current[id];
//       return { ...prev, subMedia: updatedSubMedia };
//     });
//   };

//   const validateAllMedia = async () => {
//     if (formData.mainProductMedia?.type.startsWith("video/")) {
//       const valid = await validateVideoDuration(formData.mainProductMedia);
//       if (!valid) {
//         toast.error("Main product media must not exceed 30 seconds");
//         return false;
//       }
//     }

//     for (let i = 0; i < formData.subMedia.length; i++) {
//       const media = formData.subMedia[i].file;
//       if (!media) {
//         toast.error(`${formData.subMedia[i].name} is empty or invalid`);
//         return false;
//       }
//       if (media.type.startsWith("video/")) {
//         const valid = await validateVideoDuration(media);
//         if (!valid) {
//           toast.error(`${formData.subMedia[i].name} must not exceed 30 seconds`);
//           return false;
//         }
//       }
//     }
//     return true;
//   };

//   // const isFormValid =
//   //   formData.mainProductMedia &&
//   //   formData.selectedCategory &&
//   //   formData.productName &&
//   //   formData.productPrices.length > 0 &&
//   //   formData.productPrices.some(p => p.size && p.price);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const allMediaValid = await validateAllMedia();
//     if (!allMediaValid) return;

//     // Ensure main fields exist
//     if (!formData.mainProductMedia || !formData.selectedCategory || !formData.productName) {
//       return toast.error("Please fill in all required fields and add at least one size with price!");
//     }

//     const cleanedProductName = formData.productName.trim();
//     if (!cleanedProductName) {
//       return toast.error("Product name is required");
//     }

//     // 1️⃣ Check for partially filled size/price pairs
//     const invalidEntry = formData.productPrices.some(
//       (item) => (item.size && !item.price) || (!item.size && item.price)
//     );

//     if (invalidEntry) {
//       return toast.error("Each size must have a corresponding price!");
//     }

//     // 2️⃣ Check if at least one full size + price pair exists
//     const hasValidSize = formData.productPrices.some(
//       (item) => item.size && item.price
//     );

//     if (!hasValidSize) {
//       return toast.error("Please fill in all required fields and add at least one size with price!");
//     }

//     // ✅ All validations passed
//     setShowModal(true);
//   };

//   const isDuplicateSize = (size) => {
//     return formData.productPrices.some(
//       (item) =>
//         item.size &&
//         item.size.trim().toLowerCase() === size.trim().toLowerCase()
//     );
//   };

//   const handleCloseModal = () => {
//     Object.values(videoRefs.current).forEach((video) => {
//       if (!video) return;
//       video.pause?.();
//     });
//     setShowModal(false);
//   };


//   const sanitizeFormData = (data) => {
//     return {
//       ...data,
//       productName: data.productName.trim(),
//       productPrices: data.productPrices.map((p) => ({
//         size: p.size.trim(),
//         price: p.price, // already cleaned
//       })),
//     };
//   };
//   const handlePostProduct = async () => {
//     if (isLoading) return;
//     handleCloseModal();
//     setIsLoading(true);
//     const cleaned = sanitizeFormData(formData)
//     const uploadData = new FormData();

//     if (formData.mainProductMedia) uploadData.append("mainProductMedia", formData.mainProductMedia);
//     formData.subMedia.forEach((item) => item.file && uploadData.append("subMedia[]", item.file));
//     uploadData.append("productName", cleaned.productName);
//     uploadData.append("productCategory", formData.selectedCategory.id);
//     uploadData.append("productPrices", JSON.stringify(cleaned.productPrices));

//     try {
//       const feedback = await axios.post(
//         `${import.meta.env.VITE_BACKEND_URL}/admin/create-product`,
//         uploadData,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       console.log(feedback)

//       if (feedback.data.code === "success") {
//         toast.success(feedback.data.message);
//         // Cleanup previews
//         if (formData.mainPreview) URL.revokeObjectURL(formData.mainPreview);
//         formData.subMedia.forEach((item) => item.preview && URL.revokeObjectURL(item.preview));

//         setFormData({
//           mainProductMedia: null,
//           mainPreview: null,
//           subMedia: [],
//           productName: "",
//           selectedCategory: null,
//           productPrices: [],
//         });

//         if (productMediaRef.current) productMediaRef.current.value = "";
//       } else {
//         toast.error(feedback.data.message);
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || "An error occurred. Retry!");
//     }
//     setIsLoading(false);
//   };

//   // ---------------------- EFFECTS ----------------------
//   useEffect(() => {
//     const handleVisibilityChange = () => {
//       Object.values(videoRefs.current).forEach((video) => {
//         if (!video) return;

//         if (document.hidden) {
//           video.pause();
//         } else {
//           video.play().catch(() => {});
//         }
//       });
//     };

//     document.addEventListener("visibilitychange", handleVisibilityChange);
//     return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
//   }, []);

//   const formDataRef = useRef(formData);
//   useEffect(() => { formDataRef.current = formData; }, [formData]);

//   // useEffect(() => {
//   //   return () => {
//   //     const currentData = formDataRef.current;
//   //     console.log(currentData.mainPreview)
//   //     if (currentData.mainPreview) URL.revokeObjectURL(currentData.mainPreview);
//   //     currentData.subMedia.forEach((item) => item.preview && URL.revokeObjectURL(item.preview));
//   //   };
//   // }, []);

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((entry) => {
//           const video = entry.target;
//           entry.isIntersecting ? video.play().catch(() => {}) : video.pause();
//         });
//       },
//       { threshold: 0.6 }
//     );
//     Object.values(videoRefs.current).forEach((video) => {
//       if (video) observer.observe(video);
//     });

//     return () => {
//       Object.values(videoRefs.current).forEach((video) => {
//         if (video) observer.unobserve(video);
//       });
//       observer.disconnect();
//     };
//   }, [showModal]);

//   // ---------------------- RENDER ----------------------
//   return (
//     <div className="container">
//       {isLoading && <Loader />}
//       <div className="admin-createPage-container">
//         <div className="admin-createPage-form">
//           <h2>Create Product</h2>
//           <form onSubmit={handleSubmit}>
//             {/* Main Media */}
//             <div className="mb-3">
//               <label className="mb-2">Main Product Media (image/video) *</label>
//               <input
//                 type="file"
//                 accept="image/*,video/*"
//                 id="mainProductMedia"
//                 className="form-control"
//                 ref={productMediaRef}
//                 onChange={handleInputChange}
//               />
//             </div>

//             {/* Sub Media */}
//             <div className="mb-3">
//               {formData.subMedia.length < 1 && <><label>Sub Media</label> <br /></>}
//               {formData.subMedia.map((mediaObj, index) => (
//                 <div key={mediaObj.id} className="mb-3">
//                   <label style={{ minWidth: "90px" }} className="mb-1">{mediaObj.name}</label>
//                   <div className="mb-2 d-flex gap-2 align-items-center">
//                     <input
//                       type="file"
//                       accept="image/*,video/*"
//                       id={`subMedia-${index}`}
//                       className="form-control"
//                       onChange={handleInputChange}
//                     />
//                     <button
//                       type="button"
//                       className="btn btn-danger btn-sm"
//                       onClick={() => removeSubMedia(mediaObj.id)}
//                     >
//                       Remove
//                     </button>
//                   </div>
//                 </div>
//               ))}
//               <button type="button" className="btn btn-outline-dark mt-2" onClick={addSubMedia}>
//                 Add Sub Media
//               </button>
//             </div>

//             {/* Product Name */}
//             <div className="mb-3">
//               <label>Product Name *</label>
//               <input
//                 type="text"
//                 id="productName"
//                 className="form-control"
//                 value={formData.productName}
//                 onChange={handleInputChange}
//               />
//             </div>

//             {/* Category */}
//             <div className="mb-3">
//               <label>Product Category *</label>
//               <Select
//                 options={categories?.map((cat) => ({ id: cat.id, label: cat.name }))}
//                 value={formData.selectedCategory}
//                 onChange={handleCategoryChange}
//                 isLoading={productCategoryLoading}
//               />
//             </div>

//             {/* Size Selection */}
//             <div className="mb-3">
//               <label>Select Size *</label>
//               <Select options={sizeOptions} onChange={handleSizeSelect} placeholder="Select size" />
//             </div>

//             {/* Price Table */}
//             {formData.productPrices.map((item, index) => (
//               <div key={index} className="d-flex gap-2 mb-2">
//                 <input
//                   type="text"
//                   placeholder="Size"
//                   className="form-control"
//                   value={item.size}
//                   onChange={(e) => {
//                     const value = e.target.value;

//                     const updated = [...formData.productPrices];

//                     // 🔥 prevent duplicates
//                     if (isDuplicateSize(value)) {
//                       toast.error("Size already exists!");
//                       return;
//                     }

//                     updated[index].size = value.replace(/\s+/g, " ");

//                     setFormData({ ...formData, productPrices: updated });
//                   }}
//                 />
//                 <input
//                   type="text"
//                   inputMode="numeric"
//                   placeholder={`Price (${currencyCode})`}
//                   className="form-control"
//                   value={formatNumberWithCommas(item.price)}
//                   onBeforeInput={(e) => {
//                     if (e.data && /\D/.test(e.data)) {
//                       e.preventDefault();
//                     }
//                   }}
//                   onChange={(e) => {
//                     const updated = [...formData.productPrices];
//                     updated[index].price = removeCommas(e.target.value.trim());
//                     setFormData({ ...formData, productPrices: updated });
//                   }}
//                 />
//                 <button
//                   type="button"
//                   className="btn btn-danger btn-sm"
//                   onClick={() => {
//                     const updated = [...formData.productPrices];
//                     updated.splice(index, 1);
//                     setFormData({ ...formData, productPrices: updated });
//                   }}
//                 >
//                   Remove
//                 </button>
//               </div>
//             ))}
//             <div>
//               <button type="button" className="btn btn-outline-dark mt-2" onClick={addCustomSize}>
//                 Add Custom Size
//               </button>
//             </div>

//             <button type="submit" className="btn btn-dark mt-3">
//               Show Preview
//             </button>
//           </form>
//         </div>
//       </div>

//       {/* Preview Modal */}
//       <CustomModal show={showModal} onClose={handleCloseModal}>
//         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//           <h5>Product Preview</h5>
//           <button className="btn-close" onClick={handleCloseModal} />
//         </div>

//         <Card className="mt-3">
//           <div className="image-scroll-container">
//             {[{ id: "main-media", file: formData.mainProductMedia, preview: formData.mainPreview }, ...formData.subMedia]
//               .filter((m) => m.file)
//               .map((mediaObj, i) => {
//                 if (mediaObj.file?.type?.startsWith("video/")) {
//                   return (
//                     <video
//                       ref={(el) => {
//                         if (el && mediaObj.id) {
//                           videoRefs.current[mediaObj.id] = el;
//                         }
//                       }}
                     
//                       key={mediaObj.id}
//                       src={mediaObj.preview}
//                       className="scrollable-image"
//                       muted
//                       loop
//                       playsInline
//                     />
//                   );
//                 }
//                 return <img key={mediaObj.id} src={mediaObj.preview} className="scrollable-image" />;
//               })}
//           </div>

//           <Card.Body>
//             <Card.Title>{formData.productName}</Card.Title>
//             <Card.Text>
//               <span>Category:</span> {formData.selectedCategory?.label}
//               <br />
//               <br />
//               {formData.productPrices.map((p, i) => p.size && p.price && (
//                 <div key={i}>
//                   {p.size} : {currencyCode} {formatNumberWithCommas(p.price)}
//                 </div>
//               ))}
//             </Card.Text>
//           </Card.Body>
//         </Card>

//         <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
//           <Button variant="secondary" onClick={handleCloseModal}>
//             Close
//           </Button>
//           <Button variant="dark" onClick={handlePostProduct}>
//             Post Product
//           </Button>
//         </div>
//       </CustomModal>
//     </div>
//   );
// };

// export default CreateProduct;

