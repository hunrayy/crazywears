import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useProductCategory from "../../productCategory/useProductCategory";
import { useQuery } from '@tanstack/react-query';
import { useQueryClient } from "@tanstack/react-query";



const useEditProductForm = (product, onClose) => {
    const queryClient = useQueryClient();
    const { categories, isLoading: productCategoryLoading } = useProductCategory()
    console.log(product)
    console.log(categories)
    const navigate = useNavigate();
    const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB
    const MAX_SUB_IMAGES = 5;
    const [formData, setFormData] = useState({
        productImage: null,
        subImages: [],
        productName: "",
        selectedCategory: null,
        productPrices: []
    });
    const [imagePreviews, setImagePreviews] = useState({
        productImage: null,
        subMedia: []
    });
    const [isLoading, setIsLoading] = useState(false);

    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        console.log(product)
        if (!product) return;
        setFormData({
            productId: product.id,
            productImage: product.mainProductMedia || null,
            subImages: (product.subMedia || []).map((url) => ({
                url,
                file: null,
                previewUrl: url,
                isNew: false
            })),
            productName: product.productName,
            selectedCategory: {
                id: product?.category?.id,
                label: product?.category?.name
            },
            productPrices: product.productPrices || []
        });
    }, [product]);


    const handleCategoryChange = (selectedOption) => {
        setFormData((prev) => ({
            ...prev,
            selectedCategory: selectedOption
        }));
    };

    // const handleInputChange = (e) => {
    //     const { id, files } = e.target;
    //     const file = files ? files[0] : null;

    //     // Update formData
    //     setFormData((prevState) => ({
    //         ...prevState,
    //         [id]: file,
    //     }));

    //     // Update image previews
    //     if (file) {
    //         const objectURL = URL.createObjectURL(file);
    //         setImagePreviews((prevState) => ({
    //             ...prevState,
    //             [id]: objectURL,
    //         }));
    //     } else {
    //         setImagePreviews((prevState) => ({
    //             ...prevState,
    //             [id]: null,
    //         }));
    //     }
    // };

    const handleInputChange = (e) => {
        const { id, files } = e.target;
        const file = files ? files[0] : null;

        if (!file) return;

        // ✅ validate image type
        if (!file.type.startsWith("image/")) {
            toast.error("Only image files are allowed");
            e.target.value = "";
            return;
        }

        // ✅ validate size (THIS WAS MISSING)
        if (file.size > MAX_FILE_SIZE) {
            toast.error("Image must not exceed 1MB");
            e.target.value = "";
            return;
        }

        // update formData
        setFormData((prevState) => ({
            ...prevState,
            [id]: file,
        }));

        // update preview
        const objectURL = URL.createObjectURL(file);

        setImagePreviews((prevState) => ({
            ...prevState,
            [id]: objectURL,
        }));
    };

    const handleSubMediaChange = (e, index) => {
        const file = e.target.files[0];

        if (!file) return;

        // validate image
        if (!file.type.startsWith("image/")) {
            toast.error("Only image files are allowed");

            e.target.value = "";

            resetSubImage(index);
            return;
        }

        // validate size
        if (file.size > MAX_FILE_SIZE) {
            toast.error("Image must not exceed 1MB");

            e.target.value = "";

            resetSubImage(index);
            return;
        }

        const previewUrl = URL.createObjectURL(file);

        setFormData((prev) => {
            const updated = [...prev.subImages];

            updated[index] = {
                ...updated[index],
                file,
                previewUrl,
                isNew: true,
            };

            return { ...prev, subImages: updated };
        });
    };

    const resetSubImage = (index) => {
        setFormData((prev) => {
            const updated = [...prev.subImages];

            updated[index] = {
                ...updated[index],
                file: null,
                previewUrl: updated[index]?.url || "",
                isNew: false,
            };

            return { ...prev, subImages: updated };
        });
    };

    const addSubImage = () => {
        if (formData.subImages.length >= MAX_SUB_IMAGES) {
            toast.error(`Max ${MAX_SUB_IMAGES} sub images allowed`);
            return;
        }

        setFormData((prev) => ({
            ...prev,
            subImages: [
                ...prev.subImages,
                {
                    url: "",
                    file: null,
                    previewUrl: "",
                    isNew: true
                }
            ]
        }));
    };

    const removeSubImage = (index) => {
        setFormData((prev) => {
            const updated = [...prev.subImages];

            if (updated[index]?.previewUrl?.startsWith("blob:")) {
                URL.revokeObjectURL(updated[index].previewUrl);
            }

            updated.splice(index, 1);

            return {
                ...prev,
                subImages: updated
            };
        });
    };

    const formatNumberWithCommas = (value) => {
        if (value === null || value === undefined) return "";

        let [intPart, decimalPart] = String(value).split(".");

        intPart = intPart.replace(/\D/g, "");
        intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        if (decimalPart !== undefined) {
            decimalPart = decimalPart.replace(/\D/g, "").slice(0, 2);
            return `${intPart}.${decimalPart}`;
        }

        return intPart;
    };

    const removeCommas = (value) => {
        return value.replace(/,/g, "");
    };

    const isFormValid = formData.productName && formData.selectedCategory && formData.productPrices.length > 0

    const handleSubmit = (e) => {
        e.preventDefault();

        const sanitizedPrices = formData.productPrices.map((p) => ({
            size: (p.size || "").trim(),
            price: (p.price || "").toString().trim(),
        }));

        // 1. CHECK EMPTY SIZE OR PRICE
        const hasEmptyPair = sanitizedPrices.some(
            (item) => !item.size || !item.price
        );

        if (hasEmptyPair) {
            toast.error("Some sizes are empty");
            return;
        }

        // 2. CHECK DUPLICATE SIZES
        const sizes = sanitizedPrices.map((p) =>
            p.size.toLowerCase()
        );

        const hasDuplicates = new Set(sizes).size !== sizes.length;

        if (hasDuplicates) {
            toast.error("Duplicate sizes are not allowed");
            return;
        }

        // Check for empty size or price
        const invalidEntry = formData.productPrices.some(
            (item) => (item.size && !item.price) || (!item.size && item.price)
        );

        if (invalidEntry) {
            toast.error("Each size must have a corresponding price!");
            return; // stop form submission
        }

        // Check if main form is valid
        if (!formData.productName || !formData.selectedCategory || formData.productPrices.length === 0) {
            toast.error("Fill out all required fields!");
            return;
        }

        // All good, show confirm modal
        setShowModal(true);
    };

    const handlePostProduct = async () => {
        setShowModal(false);
        setIsLoading(true);
        const uploadData = new FormData();
        if (formData.productImage) uploadData.append("productImage", formData.productImage);
        // if (formData.productImage instanceof File) {
        //     uploadData.append("productImage", formData.productImage);
        // }
        formData.subImages.forEach((item, i) => {
            if (item.file) {
                uploadData.append(`subImage${i + 1}`, item.file);
            }

            if (item.url) {
                uploadData.append(`subImage${i + 1}_oldUrl`, item.url);
            }
        });
        uploadData.append("productName", formData.productName);
        uploadData.append("category_id", formData.selectedCategory.id);
        uploadData.append("productPrices", JSON.stringify(formData.productPrices))
        try {
            const token = Cookies.get("authToken");
            const feedback = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/admin/update-product`,
                uploadData,
                {
                    params: {
                        productId: product.id
                    },
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    }
                }
            );
            console.log(feedback)
            if (feedback) {
                setIsLoading(false);
                if (feedback.data.code === "success") {
                    onClose()

                    queryClient.invalidateQueries({
                        queryKey: ['products']
                    });
                    toast.success('Product successfully updated!')
                    setFormData({
                        productId: null,
                        productImage: null,
                        subImages: [],
                        productName: "",
                        selectedCategory: null,
                        productPrices: []
                    });

                    setImagePreviews({
                        productImage: null,
                        subMedia: []
                    });



                } else {
                    toast.error(feedback.data.message)
                }
            }
        } catch (error) {
            toast.error(error.message)
            setIsLoading(false);
        }
    };

    return {
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
    };
}

export default useEditProductForm












































// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import Cookies from "js-cookie";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import useProductCategory from "../../productCategory/useProductCategory";

// const useEditProductForm = (product, onClose) => {
//     const { categories, isLoading: productCategoryLoading } = useProductCategory()
//     console.log(product)
//     console.log(categories)
//     const navigate = useNavigate();
//     const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB
//     const MAX_SUB_IMAGES = 5;
//     const [formData, setFormData] = useState({
//         productImage: null,
//         subImages: [],
//         productName: "",
//         selectedCategory: null,
//         productPrices: []
//     });
//     const [imagePreviews, setImagePreviews] = useState({
//         productImage: null,
//         subMedia: []
//     });
//     const [isLoading, setIsLoading] = useState(false);

//     const [showModal, setShowModal] = useState(false);

//     useEffect(() => {
//         console.log(product)
//         if (!product) return;

//         // const parsed = product.subMedia
//         //     ? JSON.parse(product.subMedia)
//         //     : [];

//         let parsed = [];

//         try {
//             parsed =
//                 typeof product.subMedia === "string"
//                     ? JSON.parse(product.subMedia)
//                     : product.subMedia || [];
//         } catch (e) {
//             // fallback: treat it as a single URL
//             parsed = product.subMedia ? [product.subMedia] : [];
//         }

//         // let parsed = [];

//         // try {
//         //     parsed = typeof product.subMedia === "string"
//         //         ? JSON.parse(product.subMedia)
//         //         : product.subMedia || [];
//         // } catch (e) {
//         //     parsed = [];
//         // }

//         setFormData({
//             productId: product.id,
//             productImage: product.mainProductMedia || null,
//             subImages: parsed.map((url) => ({
//                 url,
//                 file: null,
//                 previewUrl: url,
//                 isNew: false
//             })),
//             productName: product.productName,
//             selectedCategory: {
//                 id: product?.category?.id,
//                 label: product?.category?.name
//             },
//             // productPrices: JSON.parse(product.productPrices) || []
//             productPrices: (() => {
//                 try {
//                     return typeof product.productPrices === "string"
//                         ? JSON.parse(product.productPrices)
//                         : product.productPrices || [];
//                 } catch {
//                     return [];
//                 }
//             })()
//             // productPrices: (() => {
//             //     try {
//             //         return typeof product.productPrices === "string"
//             //             ? JSON.parse(product.productPrices)
//             //             : product.productPrices || [];
//             //     } catch {
//             //         return [];
//             //     }
//             // })()
//         });
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

//     const handleSubMediaChange = (e, index) => {
//         const file = e.target.files[0];

//         if (!file) return;

//         // validate image
//         if (!file.type.startsWith("image/")) {
//             toast.error("Only image files are allowed");

//             e.target.value = "";

//             resetSubImage(index);
//             return;
//         }

//         // validate size
//         if (file.size > MAX_FILE_SIZE) {
//             toast.error("Image must not exceed 1MB");

//             e.target.value = "";

//             resetSubImage(index);
//             return;
//         }

//         const previewUrl = URL.createObjectURL(file);

//         setFormData((prev) => {
//             const updated = [...prev.subImages];

//             updated[index] = {
//                 ...updated[index],
//                 file,
//                 previewUrl,
//                 isNew: true,
//             };

//             return { ...prev, subImages: updated };
//         });
//     };

//     const resetSubImage = (index) => {
//         setFormData((prev) => {
//             const updated = [...prev.subImages];

//             updated[index] = {
//                 ...updated[index],
//                 file: null,
//                 previewUrl: updated[index]?.url || "",
//                 isNew: false,
//             };

//             return { ...prev, subImages: updated };
//         });
//     };

//     const addSubImage = () => {
//         if (formData.subImages.length >= MAX_SUB_IMAGES) {
//             toast.error(`Max ${MAX_SUB_IMAGES} sub images allowed`);
//             return;
//         }

//         setFormData((prev) => ({
//             ...prev,
//             subImages: [
//                 ...prev.subImages,
//                 {
//                     url: "",
//                     file: null,
//                     previewUrl: "",
//                     isNew: true
//                 }
//             ]
//         }));
//     };

//     const removeSubImage = (index) => {
//         setFormData((prev) => {
//             const updated = [...prev.subImages];

//             if (updated[index]?.previewUrl?.startsWith("blob:")) {
//                 URL.revokeObjectURL(updated[index].previewUrl);
//             }

//             updated.splice(index, 1);

//             return {
//                 ...prev,
//                 subImages: updated
//             };
//         });
//     };

//     const formatNumberWithCommas = (value) => {
//         if (value === null || value === undefined) return "";

//         let [intPart, decimalPart] = String(value).split(".");

//         intPart = intPart.replace(/\D/g, "");
//         intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

//         if (decimalPart !== undefined) {
//             decimalPart = decimalPart.replace(/\D/g, "").slice(0, 2);
//             return `${intPart}.${decimalPart}`;
//         }

//         return intPart;
//     };

//     const removeCommas = (value) => {
//         return value.replace(/,/g, "");
//     };

//     const isFormValid = formData.productName && formData.selectedCategory && formData.productPrices.length > 0

//     const handleSubmit = (e) => {
//         e.preventDefault();

//         const sanitizedPrices = formData.productPrices.map((p) => ({
//             size: (p.size || "").trim(),
//             price: (p.price || "").toString().trim(),
//         }));

//         // 1. CHECK EMPTY SIZE OR PRICE
//         const hasEmptyPair = sanitizedPrices.some(
//             (item) => !item.size || !item.price
//         );

//         if (hasEmptyPair) {
//             toast.error("Some sizes are empty");
//             return;
//         }

//         // 2. CHECK DUPLICATE SIZES
//         const sizes = sanitizedPrices.map((p) =>
//             p.size.toLowerCase()
//         );

//         const hasDuplicates = new Set(sizes).size !== sizes.length;

//         if (hasDuplicates) {
//             toast.error("Duplicate sizes are not allowed");
//             return;
//         }

//         // Check for empty size or price
//         const invalidEntry = formData.productPrices.some(
//             (item) => (item.size && !item.price) || (!item.size && item.price)
//         );

//         if (invalidEntry) {
//             toast.error("Each size must have a corresponding price!");
//             return; // stop form submission
//         }

//         // Check if main form is valid
//         if (!formData.productName || !formData.selectedCategory || formData.productPrices.length === 0) {
//             toast.error("Fill out all required fields!");
//             return;
//         }

//         // All good, show confirm modal
//         setShowModal(true);
//     };

//     const handlePostProduct = async () => {
//         setShowModal(false);
//         setIsLoading(true);
//         const uploadData = new FormData();
//         if (formData.productImage) uploadData.append("productImage", formData.productImage);
//         formData.subImages.forEach((item, i) => {
//             if (item.file) {
//                 uploadData.append(`subImage${i + 1}`, item.file);
//             }

//             if (item.url) {
//                 uploadData.append(`subImage${i + 1}_oldUrl`, item.url);
//             }
//         });
//         uploadData.append("productName", formData.productName);
//         uploadData.append("category_id", formData.selectedCategory.id);
//         uploadData.append("productPrices", JSON.stringify(formData.productPrices))
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
//                     onClose()
//                     toast.success('Product successfully updated!')
//                     setFormData({
//                         productId: null,
//                         productImage: null,
//                         subImages: [],
//                         productName: "",
//                         selectedCategory: null,
//                         productPrices: []
//                     });

//                     setImagePreviews({
//                         productImage: null,
//                         subMedia: []
//                     });



//                 } else {
//                     toast.error(feedback.data.message)
//                 }
//             }
//         } catch (error) {
//             toast.error(error.message)
//             setIsLoading(false);
//         }
//     };

//     return {
//         MAX_SUB_IMAGES,
//         formData,
//         setFormData,
//         imagePreviews,
//         setImagePreviews,
//         isLoading,
//         showModal,
//         categories,
//         productCategoryLoading,
//         isFormValid,
//         handleInputChange,
//         handleSubMediaChange,
//         addSubImage,
//         removeSubImage,
//         handleCategoryChange,
//         handleSubmit,
//         handlePostProduct,
//         formatNumberWithCommas,
//         removeCommas,
//         setShowModal,
//     };
// }

// export default useEditProductForm

