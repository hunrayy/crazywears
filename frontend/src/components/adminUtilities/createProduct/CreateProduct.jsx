import { useState, useEffect, useRef } from "react";
import { Button, Card } from "react-bootstrap";
import CustomModal from "../../customModal/CustomModal";
import "./createProduct.css";
import axios from "axios";
import Loader from "../../loader/Loader";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import Select from "react-select";
import useProductCategory from "../../productCategory/useProductCategory";

const CreateProduct = () => {
    const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB
    const MAX_SUB_IMAGES = 5
    const { categories, isLoading: productCategoryLoading } = useProductCategory();
    const productImageRef = useRef(null);

    const token = Cookies.get("authToken");
    const currencyCode = import.meta.env.VITE_CURRENCY_CODE;

    const [formData, setFormData] = useState({
        productImage: null,
        subImages: [],
        productName: "",
        selectedCategory: null,
        productPrices: [],
    });

    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const sizeOptions = [
        { value: "sm", label: "Small" },
        { value: "md", label: "Medium" },
        { value: "lg", label: "Large" },
        { value: "xl", label: "Extra Large" },
    ];

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

    const removeCommas = (value) => value.replace(/,/g, "");

    const createPreview = (file, oldUrl = null) => {
        if (oldUrl) URL.revokeObjectURL(oldUrl);
        return URL.createObjectURL(file);
    };

    const handleInputChange = (e) => {
        const { id, files, value } = e.target;

        if (id === "productImage") {
            const file = files[0];

            if (!file || !file.type.startsWith("image/")) {
                toast.error("Only image files are allowed");
                e.target.value = "";
                return;
            }

            if (file.size > MAX_FILE_SIZE) {
                toast.error("Main image must not exceed 1MB/1024KB");
                e.target.value = "";
                return;
            }

            const previewUrl = createPreview(file, formData.productImage?.previewUrl);

            setFormData((prev) => ({
                ...prev,
                productImage: {
                    file,
                    previewUrl,
                },
            }));
        } else if (id.startsWith("subImage")) {
            const index = parseInt(id.split("-")[1]);
            if (formData.subImages.length >= MAX_SUB_IMAGES) {
                toast.error(`Maximum ${MAX_SUB_IMAGES} sub images allowed`);
                e.target.value = "";
                return;
            }
            const file = files[0];

            // 🔥 reject anything not image
            if (!file || !file.type.startsWith("image/")) {
                toast.error("Only image files are allowed");
                e.target.value = ""; // clear input immediately
                return;
            }

            if (file.size > MAX_FILE_SIZE) {
                toast.error("Sub image must not exceed 1MB/1024KB");
                e.target.value = "";
                return;
            }

            const updatedSubImages = [...formData.subImages];

            if (!updatedSubImages[index]) return;

            // updatedSubImages[index].file = file;
            
            // setFormData((prev) => ({
                //     ...prev,
                //     subImages: updatedSubImages,
            // }));

            const previewUrl = URL.createObjectURL(file);

            updatedSubImages[index] = {
                ...updatedSubImages[index],
                file,
                previewUrl,
            };
            setFormData((prev) => ({
                ...prev,
                subImages: updatedSubImages,
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [id]: value,
            }));
        }
    };

    const handleCategoryChange = (selectedOption) => {
        setFormData((prev) => ({
            ...prev,
            selectedCategory: selectedOption,
        }));
    };

    const handleSizeSelect = (option) => {
        const exists = formData.productPrices.some(
            (p) => p.size === option.label
        );

        if (exists) {
            toast.error("Size already added");
            return;
        }

        setFormData((prev) => ({
            ...prev,
            productPrices: [
                ...prev.productPrices,
                { size: option.label, price: "" },
            ],
        }));
    };

    const addCustomSize = () => {
        const existsEmpty = formData.productPrices.some(
            (p) => p.size === ""
        );

        if (existsEmpty) {
            toast.error("Fill the existing custom size first");
            return;
        }

        setFormData((prev) => ({
            ...prev,
            productPrices: [
                ...prev.productPrices,
                { size: "", price: "" },
            ],
        }));
    };

    const addSubImage = () => {
        if (formData.subImages.length >= MAX_SUB_IMAGES) {
            toast.error(`You can only upload up to ${MAX_SUB_IMAGES} sub images`);
            return;
        }

        setFormData((prev) => ({
            ...prev,
            subImages: [
                ...prev.subImages,
                {
                    name: `Sub Image ${prev.subImages.length + 1}`,
                    file: null,
                },
            ],
        }));
    };

    // const removeSubImage = (index) => {
    //     const updated = [...formData.subImages];
    //     updated.splice(index, 1);

    //     updated.forEach((item, i) => {
    //         item.name = `Sub Image ${i + 1}`;
    //     });

    //     setFormData((prev) => ({
    //         ...prev,
    //         subImages: updated,
    //     }));
    // };

    const removeSubImage = (index) => {
        const updated = [...formData.subImages];

        if (updated[index]?.previewUrl) {
            URL.revokeObjectURL(updated[index].previewUrl);
        }

        updated.splice(index, 1);

        setFormData((prev) => ({
            ...prev,
            subImages: updated,
        }));
    };

    const isFormValid =
        formData.productImage &&
        formData.selectedCategory &&
        formData.productName &&
        formData.productPrices.length > 0;
    
    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!isFormValid) {
            toast.error(
                "Fill in required fields and add at least one size with a corresponding price!"
            );
            return;
        }

        const sanitizedPrices = formData.productPrices.map((p) => ({
            ...p,
            size: (p.size || "").trim(),
            price: (p.price || "").toString().trim(),
        }));

        const invalidEntry = sanitizedPrices.some(
            (item) =>
                (item.size && !item.price) || (!item.size && item.price)
        );

        if (invalidEntry) {
            toast.error("Each size must have a corresponding price!");
            return;
        }

        const emptySubIndex = formData.subImages.findIndex(
            (img) => !img.file
        );

        if (emptySubIndex !== -1) {
            toast.error(`Sub Image ${emptySubIndex + 1} is empty`);
            return;
        }

        const sizes = sanitizedPrices.map((p) =>
            (p.size || "").toLowerCase()
        );

        if (sizes.some((s) => s === "")) {
            toast.error("Some sizes are empty");
            return;
        }

        if (new Set(sizes).size !== sizes.length) {
            toast.error("Duplicate sizes are not allowed");
            return;
        }


        setShowModal(true);
    };
    const clearBlobUrls = () => {
        if (formData.productImage?.previewUrl) {
            URL.revokeObjectURL(formData.productImage.previewUrl);
        }

        formData.subImages.forEach((img) => {
            if (img.previewUrl) {
                URL.revokeObjectURL(img.previewUrl);
            }
        });
    };
    const handlePostProduct = async () => {
        setShowModal(false);
        setIsLoading(true);

        const uploadData = new FormData();

        if (formData.productImage) {
            uploadData.append("productImage", formData.productImage?.file);
        }

        formData.subImages.forEach((item, i) => {
            if (item.file) {
                uploadData.append(`subImage${i + 1}`, item.file);
            }
        });

        uploadData.append("productName", formData.productName);
        uploadData.append(
            "productCategoryId",
            // formData.selectedCategory?.label
            formData.selectedCategory?.id
        );
        const cleanedPrices = formData.productPrices.map((p) => ({
            ...p,
            size: (p.size || "").trim(),
            price: (p.price || "").toString().trim(),
        }));

        uploadData.append(
            "productPrices",
            JSON.stringify(cleanedPrices)
        );

        try {
            const feedback = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/admin/create-product`,
                uploadData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            console.log(feedback)

            if (feedback.data.code === "success") {
                toast.success(feedback.data.message);

                clearBlobUrls();

                setFormData({
                    productImage: null,
                    subImages: [],
                    productName: "",
                    selectedCategory: null,
                    productPrices: [],
                });

                if (productImageRef.current) {
                    productImageRef.current.value = "";
                }
            } else {
                toast.error(feedback.data.message);
            }
        } catch (error) {
            toast.error("An error occurred");
        }

        setIsLoading(false);
    };

    // const formDataRef = useRef(formData);

    // useEffect(() => {
    //     formDataRef.current = formData;
    // }, [formData]);
    // useEffect(() => {
    //     return () => {
    //         console.log("yes")
    //         const data = formDataRef.current;

    //         if (data.productImage?.previewUrl) {
    //             URL.revokeObjectURL(data.productImage.previewUrl);
    //         }

    //         data.subImages.forEach((img) => {
    //             if (img.previewUrl) {
    //                 URL.revokeObjectURL(img.previewUrl);
    //             }
    //         });
    //     };
    // }, []);

    return (
        <div className="container">
            {isLoading && <Loader />}

            <div className="admin-createPage-container">
                <div className="admin-createPage-form">
                    <h2>Create Product</h2>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="mb-2">
                                Main Product Image *
                            </label>
                            <input
                                type="file"
                                accept="image/*" 
                                id="productImage"
                                className="form-control"
                                ref={productImageRef}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="mb-4">
                            {(!formData.subImages || formData.subImages.length < 1) && (
                                <>
                                    <label>Sub Image</label>
                                    <br />
                                </>
                            )}

                            {formData.subImages.map((imageObj, index) => (
                                <div key={index} className="mb-3">
                                    <label className="mb-1" style={{ minWidth: "90px" }}>
                                        {imageObj.name}
                                    </label>

                                    <div className="mb-2 d-flex gap-2 align-items-center">
                                        <input
                                            type="file"
                                            accept="image/*" 
                                            id={`subImage-${index}`}
                                            className="form-control"
                                            onChange={handleInputChange}
                                        />

                                        <button
                                            type="button"
                                            className="btn btn-danger"
                                            onClick={() => removeSubImage(index)}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {formData.subImages.length < MAX_SUB_IMAGES &&
                                <button
                                    type="button"
                                    className="btn btn-outline-dark mt-2"
                                    onClick={addSubImage}
                                    disabled={formData.subImages.length >= MAX_SUB_IMAGES}
                                >
                                    Add Sub Image ({formData.subImages.length < 1 ? 'Max 5' : (`${MAX_SUB_IMAGES - formData.subImages.length} left`)})

                                </button>
                            }
                        </div>

                        <div className="mb-3">
                            <label>Product Name *</label>
                            <input
                                type="text"
                                id="productName"
                                className="form-control"
                                value={formData.productName}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="mb-3">
                            <label>Product Category *</label>
                            <Select
                                options={
                                    categories &&
                                    categories.map((cat) => ({
                                        id: cat.id,
                                        label: cat.name,
                                    }))
                                }
                                value={formData.selectedCategory}
                                onChange={handleCategoryChange}
                                isLoading={productCategoryLoading}
                            />
                        </div>

                        <div className="mb-3">
                            <label>Select Size *</label>
                            <Select
                                options={sizeOptions}
                                onChange={handleSizeSelect}
                                placeholder="Select size"
                            />
                        </div>

                        <div>
                            {formData.productPrices.map((item, index) => (
                                <div key={index} className="d-flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        placeholder="Size"
                                        className="form-control"
                                        value={item.size}
                                        onChange={(e) => {
                                            const updated = [...formData.productPrices];
                                            const value = e.target.value;
                                            updated[index].size = value;
                                            setFormData({
                                                ...formData,
                                                productPrices: updated,
                                            });
                                        }}
                                    />

                                    <input
                                        type="text"
                                        placeholder={`Price (${currencyCode})`}
                                        className="form-control"
                                        value={formatNumberWithCommas(item.price)}
                                        onChange={(e) => {
                                            const updated = [...formData.productPrices];
                                            updated[index].price = removeCommas(
                                                e.target.value
                                            );
                                            setFormData({
                                                ...formData,
                                                productPrices: updated,
                                            });
                                        }}
                                    />

                                    <button
                                        type="button"
                                        className="btn btn-danger"
                                        onClick={() => {
                                            const updated = [...formData.productPrices];
                                            updated.splice(index, 1);
                                            setFormData({
                                                ...formData,
                                                productPrices: updated,
                                            });
                                        }}
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div>
                            <button
                                type="button"
                                className="btn btn-outline-dark mt-2"
                                onClick={addCustomSize}
                            >
                                Add Custom Size
                            </button>
                        </div>

                        <button type="submit" className="btn btn-dark mt-3">
                            Show Preview
                        </button>
                    </form>
                </div>
            </div>

            <CustomModal show={showModal} onClose={() => setShowModal(false)}>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <h5>Product Preview</h5>
                    <button
                        className="btn-close"
                        onClick={() => setShowModal(false)}
                    />
                </div>

                <Card className="mt-3">
                    <div className="image-scroll-container">
                        {[
                            formData.productImage,
                            ...formData.subImages
                        ]
                            .filter(Boolean)
                            .map((item, i) => (
                                <img
                                    key={i}
                                    src={item.previewUrl}
                                    className="scrollable-image"
                                    alt={`preview image ${i + 1}`}
                                />
                            ))
                        }
                    </div>

                    <Card.Body>
                        <Card.Title>{formData.productName}</Card.Title>

                        <Card.Text>
                            <span>Category:</span>{" "}
                            {formData.selectedCategory?.label}
                            <br />
                            <br />

                            {formData.productPrices
                                .filter((p) => p.size || p.price) // 👈 only show filled rows
                                .map((p, i) => (
                                <div key={i}>
                                    {p.size} : {currencyCode}{" "}
                                    {formatNumberWithCommas(p.price)}
                                </div>
                            ))}
                        </Card.Text>
                    </Card.Body>
                </Card>

                <div
                    style={{
                        display: "flex",
                        gap: "10px",
                        marginTop: "15px",
                    }}
                >
                    <Button
                        variant="secondary"
                        onClick={() => setShowModal(false)}
                    >
                        Close
                    </Button>

                    <Button variant="dark" onClick={handlePostProduct}>
                        Create Product
                    </Button>
                </div>
            </CustomModal>
        </div>
    );
};

export default CreateProduct;




