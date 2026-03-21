import { useEffect, useRef } from "react";
import useProductCategory from "./useProductCategory";
import "./productCategory.css";
import { useNavigate } from "react-router-dom";

const ProductCategory = () => {
  const navigate = useNavigate();
  const { categories, isLoading, isError } = useProductCategory();
  const scrollRef = useRef(null);

  useEffect(() => {
  const el = scrollRef.current;
  if (!el) return;
  if (!categories || categories.length === 0) return;

  const middle = el.scrollWidth / 3; // middle copy start
  el.scrollLeft = middle; // start at middle

  let animationId;
  const speed = 0.5; // px per frame
  let isVisible = true; // track if carousel is visible

  const autoScroll = () => {
    if (el && isVisible) {
      el.scrollLeft += speed;

      // Seamless reset logic
      if (el.scrollLeft >= el.scrollWidth * (2 / 3)) {
        el.scrollLeft = el.scrollWidth / 3;
      }
      if (el.scrollLeft <= el.scrollWidth / 3 - el.clientWidth) {
        el.scrollLeft = el.scrollWidth / 3;
      }
    }
    animationId = requestAnimationFrame(autoScroll);
  };

  animationId = requestAnimationFrame(autoScroll);

  // Pause/resume on hover or touch
  const stop = () => cancelAnimationFrame(animationId);
  const start = () => (animationId = requestAnimationFrame(autoScroll));

  el.addEventListener("mouseenter", stop);
  el.addEventListener("mouseleave", start);
  el.addEventListener("touchstart", stop);
  el.addEventListener("touchend", start);

  // Reset position if user scrolls manually
  const handleScroll = () => {
    if (el.scrollLeft >= el.scrollWidth * (2 / 3)) {
      el.scrollLeft = el.scrollWidth / 3;
    } else if (el.scrollLeft <= el.scrollWidth / 3 - el.clientWidth) {
      el.scrollLeft = el.scrollWidth / 3;
    }
  };
  el.addEventListener("scroll", handleScroll);

  // IntersectionObserver: pause if carousel not on screen
  const observer = new IntersectionObserver(
    ([entry]) => {
      isVisible = entry.isIntersecting;
    },
    { threshold: 0.1 }
  );
  observer.observe(el);

  // Page visibility API: pause if tab not active
  const handleVisibility = () => {
    isVisible = document.visibilityState === "visible";
  };
  document.addEventListener("visibilitychange", handleVisibility);

  return () => {
    cancelAnimationFrame(animationId);
    el.removeEventListener("mouseenter", stop);
    el.removeEventListener("mouseleave", start);
    el.removeEventListener("touchstart", stop);
    el.removeEventListener("touchend", start);
    el.removeEventListener("scroll", handleScroll);
    observer.disconnect();
    document.removeEventListener("visibilitychange", handleVisibility);
  };
}, [categories]);


  // useEffect(() => {
  //   const el = scrollRef.current;
  //   if (!el) return;
  //   if (!categories || categories.length === 0) return;

  //   const middle = el.scrollWidth / 3; // middle copy start
  //   el.scrollLeft = middle; // start at middle

  //   let animationId;
  //   const speed = 0.5; // px per frame

  //   const autoScroll = () => {
  //     if (el) {
  //       el.scrollLeft += speed;

  //       // Seamless reset logic
  //       if (el.scrollLeft >= el.scrollWidth * (2 / 3)) {
  //         el.scrollLeft = el.scrollWidth / 3; // reset to middle
  //       }
  //       if (el.scrollLeft <= el.scrollWidth / 3 - el.clientWidth) {
  //         el.scrollLeft = el.scrollWidth / 3; // reset if too far left
  //       }
  //     }
  //     animationId = requestAnimationFrame(autoScroll);
  //   };

  //   animationId = requestAnimationFrame(autoScroll);

  //   // Pause animation on user interaction
  //   const stop = () => cancelAnimationFrame(animationId);
  //   const start = () => (animationId = requestAnimationFrame(autoScroll));

  //   el.addEventListener("mouseenter", stop);
  //   el.addEventListener("mouseleave", start);
  //   el.addEventListener("touchstart", stop);
  //   el.addEventListener("touchend", start);

  //   // Reset position if user scrolls too far manually
  //   const handleScroll = () => {
  //     if (el.scrollLeft >= el.scrollWidth * (2 / 3)) {
  //       el.scrollLeft = el.scrollWidth / 3;
  //     } else if (el.scrollLeft <= el.scrollWidth / 3 - el.clientWidth) {
  //       el.scrollLeft = el.scrollWidth / 3;
  //     }
  //   };

  //   el.addEventListener("scroll", handleScroll);

  //   return () => {
  //     cancelAnimationFrame(animationId);
  //     el.removeEventListener("mouseenter", stop);
  //     el.removeEventListener("mouseleave", start);
  //     el.removeEventListener("touchstart", stop);
  //     el.removeEventListener("touchend", start);
  //     el.removeEventListener("scroll", handleScroll);
  //   };
  // }, [categories]);

  if (isLoading)
    return (
      <div className="product-category-container">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="product-category-skeleton-loader">
            <p className="product-category-skeleton-loader-text">
              Loading...
            </p>
          </div>
        ))}
      </div>
    );

  if (isError)
    return <p className="status-text error">Error loading categories.</p>;

  // Triplicate categories for seamless infinite effect
  const repeatedCategories = [...categories, ...categories, ...categories];

  return (
    <div className="product-category-carousel" ref={scrollRef}>
      {repeatedCategories.map((category, index) => {
        const webpImageUrl = category?.image?.replace(
          "/upload/",
          "/upload/f_auto,q_auto/"
        );
        return (
          <div
            key={category.id || index}
            className="card product-category-wrapper"
            onClick={() =>
              navigate(`/collections/all/?category=${category.name}`)
            }
          >
            <img
              src={webpImageUrl}
              className="product-category-wrapper-image"
              alt={category.name}
              loading="lazy"
            />
            <div className="product-category-wrapper-text">
              {category.name}
            </div>
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