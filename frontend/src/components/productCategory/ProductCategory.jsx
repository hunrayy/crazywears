
import useProductCategory from "./useProductCategory";
import "./productCategory.css";
import { useNavigate } from "react-router-dom";

const ProductCategory = () => {
  const navigate = useNavigate()
  const { categories, isLoading, isError } = useProductCategory();
  console.log(categories)
  if (isLoading) return ( 
    <div className="product-category-container">
      {Array.from({length: 4}).map(()=>(
          <div className="product-category-container">
            <div className="product-category-skeleton-loader">
              <p className="product-category-skeleton-loader-text">Beautybykiara</p>
            </div>
          </div>
      ))}
    </div>
  )
  if (isError) return <p className="status-text error">Error loading categories.</p>;

  return (
    <div className="product-category-container">
      {categories && categories.slice().reverse().map((category, index) => {
        const webpImageUrl = category?.image?.replace("/upload/", "/upload/f_auto,q_auto/");
        console.log(category)
        return (
          <div key={index} className="card product-category-wrapper" onClick={() => {navigate(`/collections/all/?category=${category.name}`)}}>
            <img
              src={webpImageUrl}
              className="product-category-wrapper-image"
              alt={category.name}
              loading="lazy"
            />
            <div className="product-category-wrapper-text">{category.name}</div>
          </div>
        );
      })}
    </div>
  );
};

export default ProductCategory;
















// import { useState, useEffect } from "react"
// import './productCategory.css'
// import axios from "axios";
// import { toast } from "react-toastify"
// const ProductCategory = () => {

//     const [categories, setCategories] = useState({
//         loading: true,
//         options: []
//     });
  
//     useEffect(()=> {
//     axios.get(`${import.meta.env.VITE_BACKEND_URL}/fetch-product-categories`).then((feedback) => {
//         console.log(feedback)
//         if(feedback.data.code == 'error'){
//             setCategories({
//                 loading: false,
//                 options: []
//             })
//             toast.error(`An error occured while fetching product categories: ${feedback.data.message}`)
//         }else if(feedback.data.code == 'success'){
//             // console.log(feedback)
//             const categoryOptions = feedback.data.data.map(category => ({
//                 value: category.id,  
//                 label: category.name,
//                 image: category.image
//             }));
//             setCategories({
//                 loading: false,
//                 options: categoryOptions
//             })
//         }else{
//             setCategories({
//                 loading: false,
//                 options: []
//             })
//             toast.error('An error occured while retrieving product categories')
//         }
//     })
//     }, [])
//     return <div className="product-category-container">
//     {categories.options &&
//       categories.options.map((category, index) => {
//         return (
//           <div key={index} className="card product-category-wrapper">
//             <img src={category.image} className="product-category-wrapper-image" alt=""/>
//             <div className="product-category-wrapper-text">
//               {category.label}
//             </div>
//           </div>
//         );
//       })}
//     </div>

// }


// export default ProductCategory




// {/* <header className="home-page-header-tag">
//    <p className="each-category-item" style={{color: "#f672a7"}}>New products</p>
   
//                    {categories.options && categories.options.map((category, index) => {
//                      console.log(categories)
//                                      // return <p key={index} className="each-category-item" onClick={() => {navigate(`/collections/all/?category=${category.label}`), setShownav(false)}}>{category.label}</p>
//                                      return <div key={index}>
//                                        <p>{category.label}</p>
//                                        <img width="200px" src={category.image} alt="" style={{aspectRatio: "3 / 4", objectFit: "cover"}} />
//                                      </div>
//                                  })}
//                                  <p className="each-category-item"  onClick={() => {navigate(`/collections/all/?category=All Products`)}}>All products</p>
// </header> */}