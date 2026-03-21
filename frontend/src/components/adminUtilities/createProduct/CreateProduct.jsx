import { useState, useEffect, useRef } from "react";
import { Modal, Button, Card } from "react-bootstrap";
import "./createProduct.css";
import axios from "axios";
import Loader from "../../loader/Loader";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Select from "react-select";

const CreateProduct = () => {

const navigate = useNavigate();

const productImageRef = useRef(null);
const subImageRefs = useRef([]);

const token = Cookies.get("authToken");

const currencyCode = import.meta.env.VITE_CURRENCY_CODE;

const [formData, setFormData] = useState({
    productImage:null,
    subImage1:null,
    subImage2:null,
    subImage3:null,
    productName:"",
    productPrices:[] // <----- NEW
});

const [categories,setCategories] = useState({
    loading:true,
    options:[]
});

const [selectedCategory,setSelectedCategory] = useState(null);

const [sizeModal,setSizeModal] = useState(false);
const [currentSize,setCurrentSize] = useState("");
const [currentPrice,setCurrentPrice] = useState("");
const [customSize,setCustomSize] = useState("");

const [isLoading,setIsLoading] = useState(false);
const [serverSuccessState,setServerSuccessState] = useState(false);
const [serverErrorMessage,setServerErrorMessage] = useState({
    status:false,
    message:""
});

const [showModal,setShowModal] = useState(false);

const sizeOptions = [
    {value:"sm",label:"Small"},
    {value:"md",label:"Medium"},
    {value:"lg",label:"Large"},
    {value:"xl",label:"Extra Large"}
];

const formatNumberWithCommas = (value)=>{
    if(!value) return "";
    return value.replace(/\D/g,'').replace(/\B(?=(\d{3})+(?!\d))/g,',');
};

const removeCommas = (value)=>{
    return value.replace(/,/g,'');
};

const handleInputChange = (e)=>{
    const {id,files,value} = e.target;

    setFormData(prev=>({
        ...prev,
        [id]: files ? files[0] : value
    }));
};

const handleCategoryChange = (selectedOption)=>{
    setSelectedCategory(selectedOption);
};

const handleSizeSelect = (option)=>{
    setCurrentSize(option.label);
    setCurrentPrice("");
    setSizeModal(true);
};

const savePrice = ()=>{

    if(!currentPrice){
        toast.error("Enter price");
        return;
    }

    setFormData(prev=>({
        ...prev,
        productPrices:[
            ...prev.productPrices,
            {
                size:currentSize,
                price:removeCommas(currentPrice)
            }
        ]
    }));

    setCurrentPrice("");
    setSizeModal(false);
};

const addCustomSize = ()=>{

    if(!customSize || !currentPrice){
        toast.error("Enter size and price");
        return;
    }

    setFormData(prev=>({
        ...prev,
        productPrices:[
            ...prev.productPrices,
            {
                size:customSize,
                price:removeCommas(currentPrice)
            }
        ]
    }));

    setCustomSize("");
    setCurrentPrice("");
    setSizeModal(false);
};

const isFormValid =
    formData.productImage &&
    selectedCategory &&
    formData.productName &&
    formData.productPrices.length > 0;

const handleSubmit=(e)=>{
    e.preventDefault();

    if(isFormValid){
        setShowModal(true);
    }else{
        toast.error("Please complete required fields and add at least one size price.");
    }
};

const renderImagePreview=(imageFile)=>{
    return imageFile ? URL.createObjectURL(imageFile) : null;
};

const allImages=[
    formData.productImage,
    formData.subImage1,
    formData.subImage2,
    formData.subImage3
].filter(Boolean);

const handlePostProduct = async ()=>{

setShowModal(false);
setIsLoading(true);

const uploadData = new FormData();

uploadData.append("productImage",formData.productImage);
uploadData.append("subImage1",formData.subImage1);
uploadData.append("subImage2",formData.subImage2);
uploadData.append("subImage3",formData.subImage3);
uploadData.append("productName",formData.productName);
uploadData.append("productCategory",selectedCategory.label);

uploadData.append(
    "productPrices",
    JSON.stringify(formData.productPrices)
);

try{

    const feedback = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/admin/create-product`,
        uploadData,
        {
        headers:{
        Authorization:`Bearer ${token}`,
        "Content-Type":"multipart/form-data"
        }
        }
    );
    console.log(feedback)

    if(feedback.data.code==="success"){

        setFormData({
        productImage:null,
        subImage1:null,
        subImage2:null,
        subImage3:null,
        productName:"",
        productPrices:[]
        });

        setSelectedCategory(null);

        if(productImageRef.current) productImageRef.current.value="";
        subImageRefs.current.forEach(ref=>{
        if(ref) ref.value="";
        });

        toast.success(feedback.data.message);
        setServerSuccessState(true);
        setTimeout(()=>setServerSuccessState(false),5000);

    }else{
        toast.error(feedback.data.message);
    }

}catch(error){
    toast.error("An error occurred");
}

setIsLoading(false);
};

useEffect(()=>{

axios.get(
`${import.meta.env.VITE_BACKEND_URL}/fetch-product-categories`,
{
headers:{Authorization:`Bearer ${token}`}
}
).then((feedback)=>{

if(feedback.data.code==="success"){

const options = feedback.data.data.map(cat=>({
value:cat.id,
label:cat.name
}));

setCategories({
loading:false,
options
});

}else{

setCategories({
loading:false,
options:[]
});

toast.error("Failed to load categories");
}

});

},[]);

return(

    <div className="container">

    {isLoading && <Loader/>}

    <div className="admin-createPage-container">
        <div className="admin-createPage-form">
            <h2>Create Product</h2>

            <form onSubmit={handleSubmit}>

            <div className="mb-3">
            <label>Main Product Image *</label>
            <input
            type="file"
            id="productImage"
            className="form-control"
            ref={productImageRef}
            onChange={handleInputChange}
            />
            </div>

            {Array.from({length:3}).map((_,index)=>(
            <div key={index} className="mb-3">
            <label>Sub Image {index+1}</label>
            <input
            type="file"
            className="form-control"
            id={`subImage${index+1}`}
            onChange={handleInputChange}
            ref={el=>subImageRefs.current[index]=el}
            />
            </div>
            ))}

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
            options={categories.options}
            value={selectedCategory}
            onChange={handleCategoryChange}
            isLoading={categories.loading}
            />

            </div>

            <div className="mb-3">

            <label>Select Size</label>

            <Select
            options={sizeOptions}
            onChange={handleSizeSelect}
            placeholder="Select size"
            />

            <button
            type="button"
            className="btn btn-outline-primary mt-2"
            onClick={()=>{
            setCurrentSize("Custom");
            setSizeModal(true);
            }}
            >
            Add Custom Size
            </button>

            </div>

            <div>

            {formData.productPrices.map((item,index)=>(
            <div key={index}>
            <strong>{item.size}</strong> : {currencyCode} {formatNumberWithCommas(item.price)}
            </div>
            ))}

            </div>

            <button
            type="submit"
            className="btn mt-3"
            style={{background:"purple",color:"white"}}
            >
            Show Preview
            </button>

            </form>

            
        </div>

    </div>

    <Modal show={sizeModal} onHide={()=>setSizeModal(false)} centered size="sm">

    <Modal.Header closeButton>
    <Modal.Title>{currentSize} Price</Modal.Title>
    </Modal.Header>

    <Modal.Body>

    {currentSize==="Custom" && (
    <input
    type="text"
    className="form-control mb-2"
    placeholder="Enter size"
    value={customSize}
    onChange={(e)=>setCustomSize(e.target.value)}
    />
    )}

    <input
    type="text"
    className="form-control"
    placeholder="Enter price"
    value={formatNumberWithCommas(currentPrice)}
    onChange={(e)=>setCurrentPrice(e.target.value)}
    />

    </Modal.Body>

    <Modal.Footer>

    <Button variant="secondary" onClick={()=>setSizeModal(false)}>
    Cancel
    </Button>

    <Button
    variant="primary"
    onClick={currentSize==="Custom" ? addCustomSize : savePrice}
    >
    Save
    </Button>

    </Modal.Footer>

    </Modal>

    <Modal show={showModal} onHide={()=>setShowModal(false)} centered>

    <Modal.Header closeButton>
    <Modal.Title>Product Preview</Modal.Title>
    </Modal.Header>

    <Modal.Body>

    <Card>

    <div className="image-scroll-container">

    {allImages.map((img,i)=>(
    <img
    key={i}
    src={renderImagePreview(img)}
    className="scrollable-image"
    />
    ))}

    </div>

    <Card.Body>

    <Card.Title>{formData.productName}</Card.Title>

    <Card.Text>

    <strong>Category:</strong> {selectedCategory?.label}

    <br/><br/>

    {formData.productPrices.map((p,i)=>(
    <div key={i}>
    {p.size} : {currencyCode} {formatNumberWithCommas(p.price)}
    </div>
    ))}

    </Card.Text>

    </Card.Body>

    </Card>

    </Modal.Body>

    <Modal.Footer>

    <Button variant="secondary" onClick={()=>setShowModal(false)}>
    Close
    </Button>

    <Button variant="primary" onClick={handlePostProduct}>
    Create Product
    </Button>

    </Modal.Footer>

    </Modal>

    </div>

);
};

export default CreateProduct;



























// import { useState, useEffect, useRef } from "react";
// import { Modal, Button, Card } from "react-bootstrap";
// import "./createProduct.css";
// import axios from "axios";
// import Loader from "../../loader/Loader";
// import Cookies from "js-cookie";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import Select from 'react-select';

// const CreateProduct = () => {
//     const navigate = useNavigate();

//     const productImageRef = useRef(null);
//     const subImageRefs = useRef([]); //keeps track of sub image inputs
//     // const [formData, setFormData] = useState({
//     //     productImage: null,
//     //     subImage1: null,
//     //     subImage2: null,
//     //     subImage3: null,
//     //     productName: "",
//     //     productPrice12Inches: "",
//     //     productPrice14Inches: "",
//     //     productPrice16Inches: "",
//     //     productPrice18Inches: "",
//     //     productPrice20Inches: "",
//     //     productPrice22Inches: "",
//     //     productPrice24Inches: "",
//     //     productPrice26Inches: "",
//     //     productPrice28Inches: "",
//     // });
//     const [formData, setFormData] = useState({
//         productImage: null,
//         subImage1: null,
//         subImage2: null,
//         subImage3: null,
//         productName: "",
//         productPrices: []
//     });
//     const [categories, setCategories] = useState({
//         loading: true,
//         options: []
//     });
//     const [selectedCategory, setSelectedCategory] = useState(null);
//     const handleCategoryChange = (selectedOption) => {
//         setSelectedCategory(selectedOption);
//     };
//     const currencyCode = import.meta.env.VITE_CURRENCY_CODE
    
    
//     const [sizeModal,setSizeModal] = useState(false);
//     const [currentSize,setCurrentSize] = useState("");
//     const [currentPrice,setCurrentPrice] = useState("");
//     const [customSize,setCustomSize] = useState("");

//     const handleSizeSelect = (option)=>{
//         setCurrentSize(option.label);
//         setCurrentPrice("");
//         setSizeModal(true);
//     };
//     const savePrice = ()=>{

//         if(!currentPrice){
//             toast.error("Enter price");
//             return;
//         }

//         setFormData(prev=>({
//             ...prev,
//             productPrices:[
//                 ...prev.productPrices,
//                 {
//                     size:currentSize,
//                     price:removeCommas(currentPrice)
//                 }
//             ]
//         }));

//         setCurrentPrice("");
//         setSizeModal(false);
//     };

//     const addCustomSize = ()=>{

//         if(!customSize || !currentPrice){
//             toast.error("Enter size and price");
//             return;
//         }

//         setFormData(prev=>({
//             ...prev,
//             productPrices:[
//                 ...prev.productPrices,
//                 {
//                     size:customSize,
//                     price:removeCommas(currentPrice)
//                 }
//             ]
//         }));

//         setCustomSize("");
//         setCurrentPrice("");
//         setSizeModal(false);
//     };

    
//     const [isLoading, setIsLoading] = useState(false);
//     const [serverSuccessState, setServerSuccessState] = useState(false);
//     const [serverErrorMessage, setServerErrorMessage] = useState({
//         status: false,
//         message: ""
//     });
//     const [showModal, setShowModal] = useState(false);

//     const sizeOptions = [
//         {value:"sm",label:"Small"},
//         {value:"md",label:"Medium"},
//         {value:"lg",label:"Large"},
//         {value:"xl",label:"Extra Large"}
//     ];

//     // const formatNumberWithCommas = (value) => {
//     //     if (!value) return "";
//     //     return value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
//     // };
//     const formatNumberWithCommas = (value) => {
//         if (!value) return "";
//         return Number(value).toLocaleString();
//     };

//     const removeCommas = (value) => {
//         return value.replace(/,/g, '');
//     };

//     const handleInputChange = (e) => {
//         const { id, files, value } = e.target;
//         setFormData(prevState => ({
//             ...prevState,
//             [id]: files ? files[0] : removeCommas(value),
//         }));
//     };

//     // const isFormValid = formData.productImage && formData.productName && Object.values(formData).some(value => value !== "");
//     const isFormValid = formData.productImage &&
//                     selectedCategory &&
//                     formData.productName &&
//                     formData.productPrices.length > 0;

//     // const isFormValid = formData.productImage &&
//     //                 selectedCategory &&
//     //                 formData.productName &&
//     //                 formData.productPrice12Inches &&
//     //                 formData.productPrice14Inches &&
//     //                 formData.productPrice16Inches &&
//     //                 formData.productPrice18Inches &&
//     //                 formData.productPrice20Inches &&
//     //                 formData.productPrice22Inches &&
//     //                 formData.productPrice24Inches &&
//     //                 formData.productPrice26Inches &&
//     //                 formData.productPrice28Inches;


//     const handleSubmit = (e) => {
//         e.preventDefault();
//         if (isFormValid) {
//             setShowModal(true);
//         }else{
//             // toast.error('Fields marked with asterisk are important.')
//             toast.error('Please provide at least one product price and fill required fields.');

//         }
//     };

//     const renderImagePreview = (imageFile) => {
//         return imageFile ? URL.createObjectURL(imageFile) : null;
//     };

//     const allImages = [
//         formData.productImage,
//         formData.subImage1,
//         formData.subImage2,
//         formData.subImage3,
//     ].filter(Boolean);

//     const token = Cookies.get("authToken");
//     const handlePostProduct = async () => {
//         setShowModal(false);
//         setIsLoading(true);
//         setServerErrorMessage({ status: false, message: "" });
    
//         const uploadData = new FormData();
//         uploadData.append('productImage', formData.productImage || null);
//         uploadData.append('subImage1', formData.subImage1 || null);
//         uploadData.append('subImage2', formData.subImage2 || null);
//         uploadData.append('subImage3', formData.subImage3 || null);
//         uploadData.append('productName', formData.productName);
//         uploadData.append('productCategory', selectedCategory.label);
//         uploadData.append(
//             "productPrices",
//             JSON.stringify(formData.productPrices)
//         );

//         // Append each product size price
//         // Object.keys(formData).forEach((key) => {
//         //     if (key.startsWith("productPrice")) {
//         //         uploadData.append(key, formData[key]);
//         //     }
//         // });

//         try {
//             const feedback = await axios.post(
//                 // console.log(uploadData)
//                 `${import.meta.env.VITE_BACKEND_URL}/admin/create-product`, 
//                 uploadData,
//                 {
//                     headers: {
//                         'Authorization': `Bearer ${token}`,
//                         'Content-Type': 'multipart/form-data'
//                     }
//                 }
//             );
//             console.log(feedback)
//             if (feedback) {
//                 setSelectedCategory(null)
//                 setFormData({
//                     productImage: null,
//                     subImage1: null,
//                     subImage2: null,
//                     subImage3: null,
//                     productName: "",
//                     productPrice12Inches: "",
//                     productPrice14Inches: "",
//                     productPrice16Inches: "",
//                     productPrice18Inches: "",
//                     productPrice20Inches: "",
//                     productPrice22Inches: "",
//                     productPrice24Inches: "",
//                     productPrice26Inches: "",
//                     productPrice28Inches: "",
//                 });
//                 setIsLoading(false);
//                 if (feedback.data.code === "success") {
//                     // Reset file input fields
//                     if (productImageRef.current) productImageRef.current.value = "";
//                     subImageRefs.current.forEach((ref) => {
//                         if (ref) ref.value = "";
//                     });
//                     setServerSuccessState(true);
//                     setTimeout(() => setServerSuccessState(false), 5000);
//                 } else {
//                     toast.error(feedback.data.message)
//                     setServerErrorMessage({
//                         status: true,
//                         message: `An error occurred while creating product: ${feedback.data.message}`
//                     });
//                 }
//             }
//         } catch (error) {
//             toast.error(`An error occurred while creating product: ${error}`);
//             setIsLoading(false);
//             setServerErrorMessage({ status: true, message: 'An error occurred. Please try again.' });
//         }
//     };
//     useEffect(()=> {
//         axios.get(`${import.meta.env.VITE_BACKEND_URL}/fetch-product-categories`, {
//             headers: {
//                 Authorization: `Bearer ${token}`
//             }
//         }).then((feedback) => {
//             console.log(feedback)
//             if(feedback.data.code == 'error'){
//                 setCategories({
//                     loading: false,
//                     options: []
//                 })
//                 toast.error(`An error occured while fetching product categories: ${feedback.data.message}`)
//             }else if(feedback.data.code == 'success'){
//                 // console.log(feedback)
//                 const categoryOptions = feedback.data.data.map(category => ({
//                     value: category.id,  // Use the id as the value
//                     label: category.name  // Use the name as the label
//                 }));
//                 setCategories({
//                     loading: false,
//                     options: categoryOptions
//                 })
//             }else{
//                 setCategories({
//                     loading: false,
//                     options: []
//                 })
//                 toast.error('An error occured while retrieving product categories')
//             }
//         })
//     }, [])



//     return (
//         <div>
//             {isLoading && <Loader />}
//             <div className="admin-createPage-container">
//                 <div className="bread-crumb">
//                     <div style={{ fontSize: "20px", fontWeight: "semi bold" }}>Admin Dashboard</div>
//                     <div>Home / Create Product</div>
//                 </div>
//                 <div className="admin-createPage-form">
//                     {serverErrorMessage.status && <div className="alert alert-danger">{serverErrorMessage.message}</div>}
//                     {serverSuccessState && <div className="arrow-box">Product successfully created!</div>}
                    
//                     <h2>Create Product</h2>
//                     <form onSubmit={handleSubmit}>
//                         <div className="mb-3">
//                             <label htmlFor="productImage" className="form-label">Main Product Image <sup>*</sup></label>
//                             <input type="file" className="form-control" id="productImage" onChange={handleInputChange} ref={productImageRef} />
//                         </div>
//                         {Array.from({ length: 3 }).map((_, index) => (
//                             <div key={index} className="mb-3">
//                                 <label htmlFor={`subImage${index + 1}`} className="form-label">Sub Image {index + 1} (optional)</label>
//                                 <input type="file" className="form-control" id={`subImage${index + 1}`} onChange={handleInputChange} ref={(el) => (subImageRefs.current[index] = el)}  />
//                             </div>
//                         ))}
//                         <div className="mb-3">
//                             <label htmlFor="productName" className="form-label">Product Name <sup>*</sup></label>
//                             <input type="text" className="form-control" id="productName" placeholder="Enter product name" value={formData.productName} onChange={handleInputChange} />
//                         </div>
//                         <div className="mb-3">
//                             <label htmlFor="productName" className="form-label">Product Category<sup>*</sup></label>
//                             <Select
//                                 placeholder="select category"
//                                 value={!categories.loading && (selectedCategory)}
//                                 onChange={handleCategoryChange}
//                                 options={categories.options}
//                                 isLoading={categories.loading}
//                                 getOptionLabel={(e) => e.label} // Shows the name
//                                 noOptionsMessage={() => (categories.loading ? "Fetching product categories..." : "No categories available")} // Display custom message when no options
//                             />

//                         </div>
//                         <div className="mb-3">

//                             <label>Select Size</label>

//                             <Select
//                             options={sizeOptions}
//                             onChange={handleSizeSelect}
//                             placeholder="Select size"
//                             />

//                             <button
//                             type="button"
//                             className="btn btn-outline-primary mt-2"
//                             onClick={()=>{
//                             setCurrentSize("Custom");
//                             setSizeModal(true);
//                             }}
//                             >
//                             Add Custom Size
//                             </button>

//                         </div>
//                         <div>

//                             {formData.productPrices.map((item,index)=>(
//                             <div key={index}>
//                             <strong>{item.size}</strong> : {currencyCode} {formatNumberWithCommas(item.price)}
//                             </div>
//                             ))}

//                         </div>
//                         {/* <div className="row">
//                             {Array.from({ length: 9 }).map((_, i) => {
//                                 const size = (i + 6) * 2;
//                                 return (
//                                     <div key={size} className="mb-3 col-6">
//                                         <label htmlFor={`productPrice${size}Inches`} className="form-label">
//                                             Product Price In {import.meta.env.VITE_BASE_CURRENCY} ({size}" inches)
//                                         </label>
//                                         <input
//                                             type="text"
//                                             className="form-control"
//                                             id={`productPrice${size}Inches`}
//                                             placeholder="Enter product price"
//                                             value={formatNumberWithCommas(formData[`productPrice${size}Inches`])}
//                                             onChange={handleInputChange}
//                                         />
//                                     </div>
//                                 );
//                             })}
//                         </div> */}
//                         {/* <button type="submit" className="btn" style={{ background: "purple", borderColor: "purple", color: "white" }} disabled={!isFormValid}>
//                             Show preview
//                         </button> */}
//                          <button type="submit" className="btn" style={{ background: "purple", borderColor: "purple", color: "white" }}>
//                             Show preview
//                         </button>
//                     </form>
//                 </div>
//             </div>

//             <Modal show={showModal} onHide={() => setShowModal(false)} centered>
//                 <Modal.Header closeButton>
//                     <Modal.Title>Product Preview</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body className="text-left">
//                     <Card style={{ width: '100%', margin: '0 auto' }}>
//                         <div className="image-scroll-container">
//                             {allImages.map((image, index) => (
//                                 <img
//                                     key={index}
//                                     src={renderImagePreview(image)}
//                                     alt={`Product Image ${index + 1}`}
//                                     className="scrollable-image"
//                                 />
//                             ))}
//                         </div>
//                         <Card.Body>
//                             <Card.Title><strong>Name: </strong>{formData.productName}</Card.Title>
//                             <Card.Title><strong>Category: </strong>{selectedCategory ? selectedCategory.label : 'null'}</Card.Title>
//                             <Card.Text>
//                                 {Object.keys(formData).map((key) => (
//                                     key.startsWith("productPrice") && (
//                                         <div key={key}>
//                                             <strong>{key.replace("productPrice", "Size")}:</strong> {currencyCode} {formatNumberWithCommas(formData[key])}
//                                         </div>
//                                     )
//                                 ))}
//                             </Card.Text>
//                         </Card.Body>
//                     </Card>
//                 </Modal.Body>
//                 <Modal.Footer>
//                     <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
//                     <Button variant="primary" onClick={handlePostProduct}>Create Product</Button>
//                 </Modal.Footer>
//             </Modal>
//         </div>
//     );
// };

// export default CreateProduct;






















































// import { useState, useEffect } from "react";
// import { Modal, Button, Card } from "react-bootstrap";
// import "./createProduct.css";
// import axios from "axios";
// import Loader from "../../loader/Loader";
// import Cookies from "js-cookie";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";

// const CreateProduct = () => {
//     const navigate = useNavigate();
//     const [formData, setFormData] = useState({
//         productImage: null,
//         subImage1: null,
//         subImage2: null,
//         subImage3: null,
//         productName: "",
//         // productPrice: "",
//         ProductPrice12Inches: "",
//         ProductPrice14Inches: "",
//         ProductPrice16Inches: "",
//         ProductPrice18Inches: "",
//         ProductPrice20Inches: "",
//         ProductPrice22Inches: "",
//         ProductPrice24Inches: "",
//         ProductPrice26Inches: "",
//         ProductPrice28Inches: "",

//     });
//     const [isLoading, setIsLoading] = useState(false);
//     const [serverSuccessState, setServerSuccessState] = useState(false);
//     const [serverErrorMessage, setServerErrorMessage] = useState({
//         status: false,
//         message: ""
//     });
//     const [showModal, setShowModal] = useState(false);

//     // Format number with commas for display
//     const formatNumberWithCommas = (value) => {
//         if (!value) return "";
//         return value.replace(/\D/g, '') // Remove non-numeric characters
//                     .replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Add commas
//     };

//     // Remove commas to get raw number
//     const removeCommas = (value) => {
//         return value.replace(/,/g, '');
//     };

//     // Handler to update form data
//     const handleInputChange = (e) => {
//         const { id, files, value } = e.target;
//         setFormData(prevState => ({
//             ...prevState,
//             // [id]: files ? files[0] : id === 'productPrice' ? removeCommas(value) : value,
//             [id]: files ? files[0] : id === 'productPrice' ? removeCommas(value) : value,
//         }));
//     };

//     // Check if all required fields are filled
//     const isFormValid = formData.productImage && formData.productName && formData.productPrice;

//     // Show modal for preview on form submission
//     const handleSubmit = (e) => {
//         e.preventDefault();
//         if (isFormValid) {
//             setShowModal(true);
//         }
//     };

//     // Render image preview for the modal
//     const renderImagePreview = (imageFile) => {
//         return imageFile ? URL.createObjectURL(imageFile) : null;
//     };

//     // Create an array of all images (main + sub images)
//     const allImages = [
//         formData.productImage,
//         formData.subImage1,
//         formData.subImage2,
//         formData.subImage3,
//     ].filter(Boolean); // Filter out null values

//     const token = Cookies.get("authToken");
//     const handlePostProduct = async () => {
//         setShowModal(false);
//         setIsLoading(true);
//         setServerErrorMessage({ status: false, message: "" });
    
//         // Create a FormData object
//         const uploadData = new FormData();
//         // Append main product image
//         uploadData.append('productImage', formData.productImage || null);
//         // Append sub images, even if they're null
//         uploadData.append('subImage1', formData.subImage1 || null);
//         uploadData.append('subImage2', formData.subImage2 || null);
//         uploadData.append('subImage3', formData.subImage3 || null);
//         // Append other form fields
//         uploadData.append('productName', formData.productName);
//         uploadData.append('productPrice', formData.productPrice); // Raw price without commas
    
//         // Perform the upload
//         try {
//             const feedback = await axios.post(
//                 `${import.meta.env.VITE_BACKEND_URL}/admin/create-product`, 
//                 uploadData,
//                 {
//                     headers: {
//                         'Authorization': `Bearer ${token}`,
//                         'Content-Type': 'multipart/form-data'
//                     }
//                 }
//             );
//             console.log(feedback);
//             if (feedback) {
//                 // Reset form data
//                 setFormData({
//                     productImage: null,
//                     subImage1: null,
//                     subImage2: null,
//                     subImage3: null,
//                     productName: "",
//                     productPrice: ""
//                 });
//                 setIsLoading(false);
//                 if (feedback.data.code === "success") {
//                     setServerSuccessState(true);
//                     setTimeout(() => setServerSuccessState(false), 5000);
//                 } else {
//                     setServerErrorMessage({
//                         status: true,
//                         message: feedback.data.message
//                     });
//                 }
//             }
//         } catch (error) {
//             // console.log('Error uploading product:', error.message);
//             toast.error('An error occured while creating product')
//             setIsLoading(false);
//             setServerErrorMessage({ status: true, message: 'An error occurred. Please try again.' });
//         }
//     };

    

//     return (
//         <div>
//             {isLoading && <Loader />}
//             <div className="admin-createPage-container">
//                 <div className="bread-crumb">
//                     <div style={{ fontSize: "20px", fontWeight: "semi bold" }}>Admin Dashboard</div>
//                     <div>Home / Create Product</div>
//                 </div>
//                 <div className="admin-createPage-form">
//                     {serverErrorMessage.status &&
//                         <div className="alert alert-danger">{serverErrorMessage.message}</div>
//                     }
//                     {serverSuccessState &&
//                         <div className="arrow-box">
//                             Product successfully created!
//                         </div>
//                     }
//                     <h2>Create Product</h2>
//                     <form onSubmit={handleSubmit}>
//                         <div className="mb-3">
//                             <label htmlFor="productImage" className="form-label">Main Product Image</label>
//                             <input type="file" className="form-control" id="productImage" onChange={handleInputChange} />
//                         </div>
//                         <div className="mb-3">
//                             <label htmlFor="subImage1" className="form-label">Sub Image 1 (optional)</label>
//                             <input type="file" className="form-control" id="subImage1" onChange={handleInputChange} />
//                         </div>
//                         <div className="mb-3">
//                             <label htmlFor="subImage2" className="form-label">Sub Image 2 (optional)</label>
//                             <input type="file" className="form-control" id="subImage2" onChange={handleInputChange} />
//                         </div>
//                         <div className="mb-3">
//                             <label htmlFor="subImage3" className="form-label">Sub Image 3 (optional)</label>
//                             <input type="file" className="form-control" id="subImage3" onChange={handleInputChange} />
//                         </div>
//                         <div className="mb-3">
//                             <label htmlFor="productName" className="form-label">Product Name</label>
//                             <input type="text" className="form-control" id="productName" placeholder="Enter product name" value={formData.productName} onChange={handleInputChange} />
//                         </div>
//                         {/* <div className="mb-3">
//                             <label htmlFor="productPrice" className="form-label">Product Price In Naira</label>
//                             <input
//                                 type="text"
//                                 className="form-control"
//                                 id="productPrice"
//                                 placeholder="Enter product price"
//                                 value={formatNumberWithCommas(formData.productPrice)}
//                                 onChange={handleInputChange}
//                             />
//                         </div> */}
//                         <div className="row">
//                             <div className="mb-3 col-6">
//                                 <label htmlFor="productPrice" className="form-label">Product Price In Naira(12" inches)</label>
//                                 <input
//                                     type="text"
//                                     className="form-control"
//                                     id="productPrice"
//                                     placeholder="Enter product price"
//                                     value={formatNumberWithCommas(formData.productPrice)}
//                                     onChange={handleInputChange}
//                                 />
//                             </div>
//                             <div className="mb-3 col-6">
//                                 <label htmlFor="productPrice" className="form-label">Product Price In Naira(14" inches)</label>
//                                 <input
//                                     type="text"
//                                     className="form-control"
//                                     id="productPrice"
//                                     placeholder="Enter product price"
//                                     value={formatNumberWithCommas(formData.productPrice)}
//                                     onChange={handleInputChange}
//                                 />
//                             </div>
//                             <div className="mb-3 col-6">
//                                 <label htmlFor="productPrice" className="form-label">Product Price In Naira(16" inches)</label>
//                                 <input
//                                     type="text"
//                                     className="form-control"
//                                     id="productPrice"
//                                     placeholder="Enter product price"
//                                     value={formatNumberWithCommas(formData.productPrice)}
//                                     onChange={handleInputChange}
//                                 />
//                             </div>
//                             <div className="mb-3 col-6">
//                                 <label htmlFor="productPrice" className="form-label">Product Price In Naira(18" inches)</label>
//                                 <input
//                                     type="text"
//                                     className="form-control"
//                                     id="productPrice"
//                                     placeholder="Enter product price"
//                                     value={formatNumberWithCommas(formData.productPrice)}
//                                     onChange={handleInputChange}
//                                 />
//                             </div>
//                             <div className="mb-3 col-6">
//                                 <label htmlFor="productPrice" className="form-label">Product Price In Naira(20" inches)</label>
//                                 <input
//                                     type="text"
//                                     className="form-control"
//                                     id="productPrice"
//                                     placeholder="Enter product price"
//                                     value={formatNumberWithCommas(formData.productPrice)}
//                                     onChange={handleInputChange}
//                                 />
//                             </div>
//                             <div className="mb-3 col-6">
//                                 <label htmlFor="productPrice" className="form-label">Product Price In Naira(22" inches)</label>
//                                 <input
//                                     type="text"
//                                     className="form-control"
//                                     id="productPrice"
//                                     placeholder="Enter product price"
//                                     value={formatNumberWithCommas(formData.productPrice)}
//                                     onChange={handleInputChange}
//                                 />
//                             </div><div className="mb-3 col-6">
//                                 <label htmlFor="productPrice" className="form-label">Product Price In Naira(24" inches)</label>
//                                 <input
//                                     type="text"
//                                     className="form-control"
//                                     id="productPrice"
//                                     placeholder="Enter product price"
//                                     value={formatNumberWithCommas(formData.productPrice)}
//                                     onChange={handleInputChange}
//                                 />
//                             </div><div className="mb-3 col-6">
//                                 <label htmlFor="productPrice" className="form-label">Product Price In Naira(26" inches)</label>
//                                 <input
//                                     type="text"
//                                     className="form-control"
//                                     id="productPrice"
//                                     placeholder="Enter product price"
//                                     value={formatNumberWithCommas(formData.productPrice)}
//                                     onChange={handleInputChange}
//                                 />
//                             </div><div className="mb-3 col-6">
//                                 <label htmlFor="productPrice" className="form-label">Product Price In Naira(28" inches)</label>
//                                 <input
//                                     type="text"
//                                     className="form-control"
//                                     id="productPrice"
//                                     placeholder="Enter product price"
//                                     value={formatNumberWithCommas(formData.productPrice)}
//                                     onChange={handleInputChange}
//                                 />
//                             </div>
//                         </div>
//                         <button type="submit" className="btn" style={{ background: "purple", borderColor: "purple", color: "white" }} disabled={!isFormValid}>
//                             Show preview
//                         </button>
//                     </form>
//                 </div>
//             </div>

//             {/* Modal for Product Preview */}
//             <Modal show={showModal} onHide={() => setShowModal(false)} centered>
//                 <Modal.Header closeButton>
//                     <Modal.Title>Preview Product</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body className="text-left">
//                     <Card style={{ width: '100%', margin: '0 auto' }}>
//                         {/* Horizontally scrollable image container */}
//                         <div className="image-scroll-container">
//                             {allImages.map((image, index) => (
//                                 <img
//                                     key={index}
//                                     src={renderImagePreview(image)}
//                                     alt={`Product Image ${index + 1}`}
//                                     className="scrollable-image"
//                                 />
//                             ))}
//                         </div>
//                         <Card.Body>
//                             <Card.Title>{formData.productName}</Card.Title>
//                             <Card.Text>
//                                 <strong>Price in naira:</strong> {formatNumberWithCommas(formData.productPrice)}
//                             </Card.Text>
//                         </Card.Body>
//                     </Card>
//                 </Modal.Body>
//                 <Modal.Footer>
//                     <Button variant="secondary" onClick={() => setShowModal(false)}>
//                         Close
//                     </Button>
//                     <Button style={{background: "purple"}} onClick={handlePostProduct}>
//                         Upload Product
//                     </Button>
//                 </Modal.Footer>
//             </Modal>
//         </div>
//     );
// };

// export default CreateProduct;

