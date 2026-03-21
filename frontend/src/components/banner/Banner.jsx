import { useEffect } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import 'bootstrap/dist/css/bootstrap.min.css';

// Desktop images
import firstPicture from "../../assets/carouselImage1.webp";
import secondPicture from "../../assets/carouselImage2.webp";
import thirdPicture from "../../assets/carouselImage3.webp";
import fourthPicture from "../../assets/carouselImage4.webp";

// Mobile images
import firstMobilePicture from "../../assets/carouselImage1-mobile.webp";
import secondMobilePicture from "../../assets/carouselImage2-mobile.webp";
import thirdMobilePicture from "../../assets/carouselImage3-mobile.webp";
import fourthMobilePicture from "../../assets/carouselImage4-mobile.webp";

import "./banner.css";

const Banner = () => {
  useEffect(() => {
    const buttons = document.querySelectorAll('.carousel-control-prev, .carousel-control-next');
    buttons.forEach(button => {
      button.removeAttribute('href'); // Remove the default href="#"
    });
  }, []);
  
  const detailsObject = [
    {
      imgSrc: firstPicture,
      mobileImgSrc: firstMobilePicture,
      alt: "Silky straight black human hair wig from BeautyByKiara"
    },
    {
      text: "Our hair extensions are designed for effortless beauty. Easy to apply, comfortable to wear, and stunning to look at",
      imgSrc: secondPicture,
      mobileImgSrc: secondMobilePicture,
      alt: "Voluminous curly hair extensions from BeautyByKiara"
    },
    {
      text: "We offer top-quality hair products, excellent customer service, and unbeatable prices. Shop with confidence",
      imgSrc: thirdPicture,
      mobileImgSrc: thirdMobilePicture,
      alt: "Long body wave frontal wig from BeautyByKiara"
    },
    {
      text: "We offer top-quality hair products, excellent customer service, and unbeatable prices. Shop with confidence",
      imgSrc: fourthPicture,
      mobileImgSrc: fourthMobilePicture,
      alt: "Sleek middle-part straight lace closure wig by BeautyByKiara"
    }
  ];

  return (
    <div>
      <div className="new-banner-container">
        <div className="new-banner-carousel-container">
          <Carousel controls={false} fade className="custom-fade-carousel" prevLabel={null} nextLabel={null} style={{ zIndex: "1" }}>
            {detailsObject.map((item, index) => (
              <Carousel.Item key={index}>
                <picture>
                  {/* Mobile image when width <= 767px */}
                  <source media="(max-width: 767px)" srcSet={item.mobileImgSrc} />
                  {/* Default to desktop */}
                  <img src={item.imgSrc} alt={item.alt} />
                </picture>
              </Carousel.Item>
            ))}
          </Carousel>
        </div>
      </div>
    </div>
  );
};

export default Banner;
































// import {useState, useEffect} from 'react';
// import Carousel from 'react-bootstrap/Carousel';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import firstPicture from "../../assets/carouselImage1.webp";
// import firstMobilePicture from "../../assets/carouselImage1.webp";
// import secondPicture from "../../assets/carouselImage2.webp";
// import secondMobilePicture from "../../assets/carouselImage2.webp";
// import thirdPicture from "../../assets/carouselImage3.webp";
// import thirdMobilePicture from "../../assets/carouselImage3.webp";
// import fourthPicture from "../../assets/carouselImage4.webp"
// import fourthMobilePicture from "../../assets/carouselImage4.webp"
// import "./banner.css";

// const Banner = () => {
//   useEffect(() => {
//     const buttons = document.querySelectorAll('.carousel-control-prev, .carousel-control-next');
//     buttons.forEach(button => {
//       button.removeAttribute('href'); // Remove the default href="#"
//     });
//   }, []);
  
  
// const detailsObject = [
//   {
//     imgSrc: firstPicture,
//     alt: "Silky straight black human hair wig from BeautyByKiara"
//   },
//   {
//     text: "Our hair extensions are designed for effortless beauty. Easy to apply, comfortable to wear, and stunning to look at",
//     imgSrc: secondPicture,
//     alt: "Voluminous curly hair extensions from BeautyByKiara"
//   },
//   {
//     text: "We offer top-quality hair products, excellent customer service, and unbeatable prices. Shop with confidence",
//     imgSrc: thirdPicture,
//     alt: "Long body wave frontal wig from BeautyByKiara"
//   },
//   {
//     text: "We offer top-quality hair products, excellent customer service, and unbeatable prices. Shop with confidence",
//     imgSrc: fourthPicture,
//     alt: "Sleek middle-part straight lace closure wig by BeautyByKiara"
//   }
// ];


//   return (
//     <div>
// {/* video-local w-100 h-100 of-cover center-middle p-absolute mih */}
// <div className="new-banner-container">
//   <div className="new-banner-carousel-container">
//     <Carousel controls={false} fade className="custom-fade-carousel" prevLabel={null} nextLabel={null} style={{ zIndex: "1" }}>
//       {detailsObject.map((item, index) => (
//         <Carousel.Item key={index}>
//           <img
//             src={item.imgSrc}
//             // alt={`Slide ${index + 1}`}
//             alt={item.alt}
//           />
//         </Carousel.Item>
//       ))}
//     </Carousel>
//   </div>
// </div>
//     </div>
//   );
// };

// export default Banner;










































// import {useState, useEffect} from 'react';
// import Carousel from 'react-bootstrap/Carousel';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import firstPicture from "../../assets/daniellaHairImage.jpg";
// import secondPicture from "../../assets/cocojonesHairImage.jpg";
// import thirdPicture from "../../assets/aaishaHairImage.jpg";
// import fourthPicture from "../../assets/myleeHairImage.jpg"


// import hair_video from "../../assets/hair_video.mp4";
// import hair_image from "../../assets/hair_image.webp";
// import hair_image2 from "../../assets/hair_image2.png";
// import "./banner.css";

// const Banner = () => {
//   useEffect(() => {
//     const buttons = document.querySelectorAll('.carousel-control-prev, .carousel-control-next');
//     buttons.forEach(button => {
//       button.removeAttribute('href'); // Remove the default href="#"
//     });
//   }, []);
  
  
// const detailsObject = [
//   {
//     text: "Achieve silky smooth hair with our top-grade products. Easy to maintain and style for everyday glamour",
//     imgSrc: firstPicture,
//     alt: "Silky straight black human hair wig from BeautyByKiara"
//   },
//   {
//     text: "Our hair extensions are designed for effortless beauty. Easy to apply, comfortable to wear, and stunning to look at",
//     imgSrc: secondPicture,
//     alt: "Voluminous curly hair extensions from BeautyByKiara"
//   },
//   {
//     text: "We offer top-quality hair products, excellent customer service, and unbeatable prices. Shop with confidence",
//     imgSrc: thirdPicture,
//     alt: "Long body wave frontal wig from BeautyByKiara"
//   },
//   {
//     text: "We offer top-quality hair products, excellent customer service, and unbeatable prices. Shop with confidence",
//     imgSrc: fourthPicture,
//     alt: "Sleek middle-part straight lace closure wig by BeautyByKiara"
//   }
// ];


//   return (
//     <div>
// {/* video-local w-100 h-100 of-cover center-middle p-absolute mih */}
// <div className="new-banner-container">
//   <div className="new-banner-carousel-container">
//     <Carousel controls={false} fade className="custom-fade-carousel" prevLabel={null} nextLabel={null} style={{ zIndex: "1" }}>
//       {detailsObject.map((item, index) => (
//         <Carousel.Item key={index}>
//           <img
//             src={item.imgSrc}
//             // alt={`Slide ${index + 1}`}
//             alt={item.alt}
//           />
//         </Carousel.Item>
//       ))}
//     </Carousel>
//   </div>


//   <video
//     className='new-banner-video'
//     playsInline
//     autoPlay
//     loop
//     preload="none"
//     muted
//     poster={hair_image2}
//     src="https://cdn.shopify.com/videos/c/o/v/cb150da802b8435e95e4a424536675a7.mp4"
//   />


// </div>
 
    
  
//     </div>
//   );
// };

// export default Banner;

