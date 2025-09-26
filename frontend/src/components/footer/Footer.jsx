



import Logo from "../Logo/Logo"
import { Link } from "react-router-dom"
import "./footer.css"
import { useState, useEffect } from "react"
const Footer = () => {
  const [year, setYear] = useState(null)
  useEffect(()=> {
    const date = new Date().getFullYear()
    setYear(date)
  }, [])
    return <div>
      <footer className="footer">
  <div className="container">
    <div className="footer-section">
      <Logo />
      <p>beautybykiara</p>
    </div>
    <div className="footer-section">
      <h4>About Us</h4>
      <p>Your go-to store for premium-quality women's hair products, including wigs, extensions, and more.</p>
    </div>

    <div className="footer-section">
      <h4>Quick links</h4>
      <ul>
        <li><Link to='/collections/all/?category=All Products'>Shop all</Link></li>
        <li><Link to='/pages/contact'>Contact</Link></li>
        {/* <li><a href="#">FAQs</a></li> */}
        <li><Link to="/order/tracking">Tracking</Link></li>
      </ul>
    </div>

    <div className="footer-section">
      <h4>Policy</h4>
      <ul>
        <li><Link to='/policies/shipping-policy'>Shipping Policy</Link></li>
        <li><Link to='/policies/delivery-policy'>Delivery policy</Link></li>
        <li><Link to='/policies/refund-policy'>Refund policy</Link></li>
        {/* <li><a href="#">Best Sellers</a></li> */}
      </ul>
    </div>
  </div>

  <div className="footer-social">
    {/* <a href="#" className="social-icon">Facebook</a> */}
    <a href="https://www.instagram.com/beauty_bykiaraa/" target="_blank" className="social-icon"><i className="fa-brands fa-instagram"></i> Instagram</a>
    <a href="https://www.tiktok.com/@beauty_bykiara"  target="_blank" className="social-icon"><i className="fa-brands fa-tiktok"></i> Tiktok</a>
    {/* <a href="#" className="social-icon">YouTube</a> */}
  </div>
  <ul className="list list-payment" role="list" type="none"><li className="list-payment__item">
                  <svg className="icon icon--full-color" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="pi-american_express" viewBox="0 0 38 24" width="38" height="24"><title id="pi-american_express">American Express</title><path fill="#000" d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3Z" opacity=".07"></path><path fill="#006FCF" d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32Z"></path><path fill="#FFF" d="M22.012 19.936v-8.421L37 11.528v2.326l-1.732 1.852L37 17.573v2.375h-2.766l-1.47-1.622-1.46 1.628-9.292-.02Z"></path><path fill="#006FCF" d="M23.013 19.012v-6.57h5.572v1.513h-3.768v1.028h3.678v1.488h-3.678v1.01h3.768v1.531h-5.572Z"></path><path fill="#006FCF" d="m28.557 19.012 3.083-3.289-3.083-3.282h2.386l1.884 2.083 1.89-2.082H37v.051l-3.017 3.23L37 18.92v.093h-2.307l-1.917-2.103-1.898 2.104h-2.321Z"></path><path fill="#FFF" d="M22.71 4.04h3.614l1.269 2.881V4.04h4.46l.77 2.159.771-2.159H37v8.421H19l3.71-8.421Z"></path><path fill="#006FCF" d="m23.395 4.955-2.916 6.566h2l.55-1.315h2.98l.55 1.315h2.05l-2.904-6.566h-2.31Zm.25 3.777.875-2.09.873 2.09h-1.748Z"></path><path fill="#006FCF" d="M28.581 11.52V4.953l2.811.01L32.84 9l1.456-4.046H37v6.565l-1.74.016v-4.51l-1.644 4.494h-1.59L30.35 7.01v4.51h-1.768Z"></path></svg>

                </li><li className="list-payment__item">
                  <svg className="icon icon--full-color" version="1.1" xmlns="http://www.w3.org/2000/svg" role="img" x="0" y="0" width="38" height="24" viewBox="0 0 165.521 105.965" xmlSpace="preserve" aria-labelledby="pi-apple_pay"><title id="pi-apple_pay">Apple Pay</title><path fill="#000" d="M150.698 0H14.823c-.566 0-1.133 0-1.698.003-.477.004-.953.009-1.43.022-1.039.028-2.087.09-3.113.274a10.51 10.51 0 0 0-2.958.975 9.932 9.932 0 0 0-4.35 4.35 10.463 10.463 0 0 0-.975 2.96C.113 9.611.052 10.658.024 11.696a70.22 70.22 0 0 0-.022 1.43C0 13.69 0 14.256 0 14.823v76.318c0 .567 0 1.132.002 1.699.003.476.009.953.022 1.43.028 1.036.09 2.084.275 3.11a10.46 10.46 0 0 0 .974 2.96 9.897 9.897 0 0 0 1.83 2.52 9.874 9.874 0 0 0 2.52 1.83c.947.483 1.917.79 2.96.977 1.025.183 2.073.245 3.112.273.477.011.953.017 1.43.02.565.004 1.132.004 1.698.004h135.875c.565 0 1.132 0 1.697-.004.476-.002.952-.009 1.431-.02 1.037-.028 2.085-.09 3.113-.273a10.478 10.478 0 0 0 2.958-.977 9.955 9.955 0 0 0 4.35-4.35c.483-.947.789-1.917.974-2.96.186-1.026.246-2.074.274-3.11.013-.477.02-.954.022-1.43.004-.567.004-1.132.004-1.699V14.824c0-.567 0-1.133-.004-1.699a63.067 63.067 0 0 0-.022-1.429c-.028-1.038-.088-2.085-.274-3.112a10.4 10.4 0 0 0-.974-2.96 9.94 9.94 0 0 0-4.35-4.35A10.52 10.52 0 0 0 156.939.3c-1.028-.185-2.076-.246-3.113-.274a71.417 71.417 0 0 0-1.431-.022C151.83 0 151.263 0 150.698 0z"></path><path fill="#FFF" d="M150.698 3.532l1.672.003c.452.003.905.008 1.36.02.793.022 1.719.065 2.583.22.75.135 1.38.34 1.984.648a6.392 6.392 0 0 1 2.804 2.807c.306.6.51 1.226.645 1.983.154.854.197 1.783.218 2.58.013.45.019.9.02 1.36.005.557.005 1.113.005 1.671v76.318c0 .558 0 1.114-.004 1.682-.002.45-.008.9-.02 1.35-.022.796-.065 1.725-.221 2.589a6.855 6.855 0 0 1-.645 1.975 6.397 6.397 0 0 1-2.808 2.807c-.6.306-1.228.511-1.971.645-.881.157-1.847.2-2.574.22-.457.01-.912.017-1.379.019-.555.004-1.113.004-1.669.004H14.801c-.55 0-1.1 0-1.66-.004a74.993 74.993 0 0 1-1.35-.018c-.744-.02-1.71-.064-2.584-.22a6.938 6.938 0 0 1-1.986-.65 6.337 6.337 0 0 1-1.622-1.18 6.355 6.355 0 0 1-1.178-1.623 6.935 6.935 0 0 1-.646-1.985c-.156-.863-.2-1.788-.22-2.578a66.088 66.088 0 0 1-.02-1.355l-.003-1.327V14.474l.002-1.325a66.7 66.7 0 0 1 .02-1.357c.022-.792.065-1.717.222-2.587a6.924 6.924 0 0 1 .646-1.981c.304-.598.7-1.144 1.18-1.623a6.386 6.386 0 0 1 1.624-1.18 6.96 6.96 0 0 1 1.98-.646c.865-.155 1.792-.198 2.586-.22.452-.012.905-.017 1.354-.02l1.677-.003h135.875"></path><g><g><path fill="#000" d="M43.508 35.77c1.404-1.755 2.356-4.112 2.105-6.52-2.054.102-4.56 1.355-6.012 3.112-1.303 1.504-2.456 3.959-2.156 6.266 2.306.2 4.61-1.152 6.063-2.858"></path><path fill="#000" d="M45.587 39.079c-3.35-.2-6.196 1.9-7.795 1.9-1.6 0-4.049-1.8-6.698-1.751-3.447.05-6.645 2-8.395 5.1-3.598 6.2-.95 15.4 2.55 20.45 1.699 2.5 3.747 5.25 6.445 5.151 2.55-.1 3.549-1.65 6.647-1.65 3.097 0 3.997 1.65 6.696 1.6 2.798-.05 4.548-2.5 6.247-5 1.95-2.85 2.747-5.6 2.797-5.75-.05-.05-5.396-2.101-5.446-8.251-.05-5.15 4.198-7.6 4.398-7.751-2.399-3.548-6.147-3.948-7.447-4.048"></path></g><g><path fill="#000" d="M78.973 32.11c7.278 0 12.347 5.017 12.347 12.321 0 7.33-5.173 12.373-12.529 12.373h-8.058V69.62h-5.822V32.11h14.062zm-8.24 19.807h6.68c5.07 0 7.954-2.729 7.954-7.46 0-4.73-2.885-7.434-7.928-7.434h-6.706v14.894z"></path><path fill="#000" d="M92.764 61.847c0-4.809 3.665-7.564 10.423-7.98l7.252-.442v-2.08c0-3.04-2.001-4.704-5.562-4.704-2.938 0-5.07 1.507-5.51 3.82h-5.252c.157-4.86 4.731-8.395 10.918-8.395 6.654 0 10.995 3.483 10.995 8.89v18.663h-5.38v-4.497h-.13c-1.534 2.937-4.914 4.782-8.579 4.782-5.406 0-9.175-3.222-9.175-8.057zm17.675-2.417v-2.106l-6.472.416c-3.64.234-5.536 1.585-5.536 3.95 0 2.288 1.975 3.77 5.068 3.77 3.95 0 6.94-2.522 6.94-6.03z"></path><path fill="#000" d="M120.975 79.652v-4.496c.364.051 1.247.103 1.715.103 2.573 0 4.029-1.09 4.913-3.899l.52-1.663-9.852-27.293h6.082l6.863 22.146h.13l6.862-22.146h5.927l-10.216 28.67c-2.34 6.577-5.017 8.735-10.683 8.735-.442 0-1.872-.052-2.261-.157z"></path></g></g></svg>

                </li><li className="list-payment__item">
                  <svg className="icon icon--full-color" viewBox="0 0 38 24" xmlns="http://www.w3.org/2000/svg" role="img" width="38" height="24" aria-labelledby="pi-diners_club"><title id="pi-diners_club">Diners Club</title><path opacity=".07" d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"></path><path fill="#fff" d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"></path><path d="M12 12v3.7c0 .3-.2.3-.5.2-1.9-.8-3-3.3-2.3-5.4.4-1.1 1.2-2 2.3-2.4.4-.2.5-.1.5.2V12zm2 0V8.3c0-.3 0-.3.3-.2 2.1.8 3.2 3.3 2.4 5.4-.4 1.1-1.2 2-2.3 2.4-.4.2-.4.1-.4-.2V12zm7.2-7H13c3.8 0 6.8 3.1 6.8 7s-3 7-6.8 7h8.2c3.8 0 6.8-3.1 6.8-7s-3-7-6.8-7z" fill="#3086C8"></path></svg>
                </li><li className="list-payment__item">
                  <svg className="icon icon--full-color" viewBox="0 0 38 24" width="38" height="24" role="img" aria-labelledby="pi-discover" fill="none" xmlns="http://www.w3.org/2000/svg"><title id="pi-discover">Discover</title><path fill="#000" opacity=".07" d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"></path><path d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32z" fill="#fff"></path><path d="M3.57 7.16H2v5.5h1.57c.83 0 1.43-.2 1.96-.63.63-.52 1-1.3 1-2.11-.01-1.63-1.22-2.76-2.96-2.76zm1.26 4.14c-.34.3-.77.44-1.47.44h-.29V8.1h.29c.69 0 1.11.12 1.47.44.37.33.59.84.59 1.37 0 .53-.22 1.06-.59 1.39zm2.19-4.14h1.07v5.5H7.02v-5.5zm3.69 2.11c-.64-.24-.83-.4-.83-.69 0-.35.34-.61.8-.61.32 0 .59.13.86.45l.56-.73c-.46-.4-1.01-.61-1.62-.61-.97 0-1.72.68-1.72 1.58 0 .76.35 1.15 1.35 1.51.42.15.63.25.74.31.21.14.32.34.32.57 0 .45-.35.78-.83.78-.51 0-.92-.26-1.17-.73l-.69.67c.49.73 1.09 1.05 1.9 1.05 1.11 0 1.9-.74 1.9-1.81.02-.89-.35-1.29-1.57-1.74zm1.92.65c0 1.62 1.27 2.87 2.9 2.87.46 0 .86-.09 1.34-.32v-1.26c-.43.43-.81.6-1.29.6-1.08 0-1.85-.78-1.85-1.9 0-1.06.79-1.89 1.8-1.89.51 0 .9.18 1.34.62V7.38c-.47-.24-.86-.34-1.32-.34-1.61 0-2.92 1.28-2.92 2.88zm12.76.94l-1.47-3.7h-1.17l2.33 5.64h.58l2.37-5.64h-1.16l-1.48 3.7zm3.13 1.8h3.04v-.93h-1.97v-1.48h1.9v-.93h-1.9V8.1h1.97v-.94h-3.04v5.5zm7.29-3.87c0-1.03-.71-1.62-1.95-1.62h-1.59v5.5h1.07v-2.21h.14l1.48 2.21h1.32l-1.73-2.32c.81-.17 1.26-.72 1.26-1.56zm-2.16.91h-.31V8.03h.33c.67 0 1.03.28 1.03.82 0 .55-.36.85-1.05.85z" fill="#231F20"></path><path d="M20.16 12.86a2.931 2.931 0 100-5.862 2.931 2.931 0 000 5.862z" fill="url(#pi-paint0_linear)"></path><path opacity=".65" d="M20.16 12.86a2.931 2.931 0 100-5.862 2.931 2.931 0 000 5.862z" fill="url(#pi-paint1_linear)"></path><path d="M36.57 7.506c0-.1-.07-.15-.18-.15h-.16v.48h.12v-.19l.14.19h.14l-.16-.2c.06-.01.1-.06.1-.13zm-.2.07h-.02v-.13h.02c.06 0 .09.02.09.06 0 .05-.03.07-.09.07z" fill="#231F20"></path><path d="M36.41 7.176c-.23 0-.42.19-.42.42 0 .23.19.42.42.42.23 0 .42-.19.42-.42 0-.23-.19-.42-.42-.42zm0 .77c-.18 0-.34-.15-.34-.35 0-.19.15-.35.34-.35.18 0 .33.16.33.35 0 .19-.15.35-.33.35z" fill="#231F20"></path><path d="M37 12.984S27.09 19.873 8.976 23h26.023a2 2 0 002-1.984l.024-3.02L37 12.985z" fill="#F48120"></path><defs><linearGradient id="pi-paint0_linear" x1="21.657" y1="12.275" x2="19.632" y2="9.104" gradientUnits="userSpaceOnUse"><stop stopColor="#F89F20"></stop><stop offset=".25" stopColor="#F79A20"></stop><stop offset=".533" stopColor="#F68D20"></stop><stop offset=".62" stopColor="#F58720"></stop><stop offset=".723" stopColor="#F48120"></stop><stop offset="1" stopColor="#F37521"></stop></linearGradient><linearGradient id="pi-paint1_linear" x1="21.338" y1="12.232" x2="18.378" y2="6.446" gradientUnits="userSpaceOnUse"><stop stopColor="#F58720"></stop><stop offset=".359" stopColor="#E16F27"></stop><stop offset=".703" stopColor="#D4602C"></stop><stop offset=".982" stopColor="#D05B2E"></stop></linearGradient></defs></svg>
                </li><li className="list-payment__item">
                  <svg className="icon icon--full-color" xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 38 24" width="38" height="24" aria-labelledby="pi-google_pay"><title id="pi-google_pay">Google Pay</title><path d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z" fill="#000" opacity=".07"></path><path d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32" fill="#FFF"></path><path d="M18.093 11.976v3.2h-1.018v-7.9h2.691a2.447 2.447 0 0 1 1.747.692 2.28 2.28 0 0 1 .11 3.224l-.11.116c-.47.447-1.098.69-1.747.674l-1.673-.006zm0-3.732v2.788h1.698c.377.012.741-.135 1.005-.404a1.391 1.391 0 0 0-1.005-2.354l-1.698-.03zm6.484 1.348c.65-.03 1.286.188 1.778.613.445.43.682 1.03.65 1.649v3.334h-.969v-.766h-.049a1.93 1.93 0 0 1-1.673.931 2.17 2.17 0 0 1-1.496-.533 1.667 1.667 0 0 1-.613-1.324 1.606 1.606 0 0 1 .613-1.336 2.746 2.746 0 0 1 1.698-.515c.517-.02 1.03.093 1.49.331v-.208a1.134 1.134 0 0 0-.417-.901 1.416 1.416 0 0 0-.98-.368 1.545 1.545 0 0 0-1.319.717l-.895-.564a2.488 2.488 0 0 1 2.182-1.06zM23.29 13.52a.79.79 0 0 0 .337.662c.223.176.5.269.785.263.429-.001.84-.17 1.146-.472.305-.286.478-.685.478-1.103a2.047 2.047 0 0 0-1.324-.374 1.716 1.716 0 0 0-1.03.294.883.883 0 0 0-.392.73zm9.286-3.75l-3.39 7.79h-1.048l1.281-2.728-2.224-5.062h1.103l1.612 3.885 1.569-3.885h1.097z" fill="#5F6368"></path><path d="M13.986 11.284c0-.308-.024-.616-.073-.92h-4.29v1.747h2.451a2.096 2.096 0 0 1-.9 1.373v1.134h1.464a4.433 4.433 0 0 0 1.348-3.334z" fill="#4285F4"></path><path d="M9.629 15.721a4.352 4.352 0 0 0 3.01-1.097l-1.466-1.14a2.752 2.752 0 0 1-4.094-1.44H5.577v1.17a4.53 4.53 0 0 0 4.052 2.507z" fill="#34A853"></path><path d="M7.079 12.05a2.709 2.709 0 0 1 0-1.735v-1.17H5.577a4.505 4.505 0 0 0 0 4.075l1.502-1.17z" fill="#FBBC04"></path><path d="M9.629 8.44a2.452 2.452 0 0 1 1.74.68l1.3-1.293a4.37 4.37 0 0 0-3.065-1.183 4.53 4.53 0 0 0-4.027 2.5l1.502 1.171a2.715 2.715 0 0 1 2.55-1.875z" fill="#EA4335"></path></svg>

                </li><li className="list-payment__item">
                  <svg className="icon icon--full-color" viewBox="0 0 38 24" xmlns="http://www.w3.org/2000/svg" width="38" height="24" role="img" aria-labelledby="pi-maestro"><title id="pi-maestro">Maestro</title><path opacity=".07" d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"></path><path fill="#fff" d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"></path><circle fill="#EB001B" cx="15" cy="12" r="7"></circle><circle fill="#00A2E5" cx="23" cy="12" r="7"></circle><path fill="#7375CF" d="M22 12c0-2.4-1.2-4.5-3-5.7-1.8 1.3-3 3.4-3 5.7s1.2 4.5 3 5.7c1.8-1.2 3-3.3 3-5.7z"></path></svg>
                </li><li className="list-payment__item">
                  <svg className="icon icon--full-color" viewBox="0 0 38 24" xmlns="http://www.w3.org/2000/svg" role="img" width="38" height="24" aria-labelledby="pi-master"><title id="pi-master">Mastercard</title><path opacity=".07" d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"></path><path fill="#fff" d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"></path><circle fill="#EB001B" cx="15" cy="12" r="7"></circle><circle fill="#F79E1B" cx="23" cy="12" r="7"></circle><path fill="#FF5F00" d="M22 12c0-2.4-1.2-4.5-3-5.7-1.8 1.3-3 3.4-3 5.7s1.2 4.5 3 5.7c1.8-1.2 3-3.3 3-5.7z"></path></svg>
                </li><li className="list-payment__item">
                  <svg className="icon icon--full-color" xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 38 24" width="38" height="24" aria-labelledby="pi-shopify_pay"><title id="pi-shopify_pay">Shop Pay</title><path opacity=".07" d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z" fill="#000"></path><path d="M35.889 0C37.05 0 38 .982 38 2.182v19.636c0 1.2-.95 2.182-2.111 2.182H2.11C.95 24 0 23.018 0 21.818V2.182C0 .982.95 0 2.111 0H35.89z" fill="#5A31F4"></path><path d="M9.35 11.368c-1.017-.223-1.47-.31-1.47-.705 0-.372.306-.558.92-.558.54 0 .934.238 1.225.704a.079.079 0 00.104.03l1.146-.584a.082.082 0 00.032-.114c-.475-.831-1.353-1.286-2.51-1.286-1.52 0-2.464.755-2.464 1.956 0 1.275 1.15 1.597 2.17 1.82 1.02.222 1.474.31 1.474.705 0 .396-.332.582-.993.582-.612 0-1.065-.282-1.34-.83a.08.08 0 00-.107-.035l-1.143.57a.083.083 0 00-.036.111c.454.92 1.384 1.437 2.627 1.437 1.583 0 2.539-.742 2.539-1.98s-1.155-1.598-2.173-1.82v-.003zM15.49 8.855c-.65 0-1.224.232-1.636.646a.04.04 0 01-.069-.03v-2.64a.08.08 0 00-.08-.081H12.27a.08.08 0 00-.08.082v8.194a.08.08 0 00.08.082h1.433a.08.08 0 00.081-.082v-3.594c0-.695.528-1.227 1.239-1.227.71 0 1.226.521 1.226 1.227v3.594a.08.08 0 00.081.082h1.433a.08.08 0 00.081-.082v-3.594c0-1.51-.981-2.577-2.355-2.577zM20.753 8.62c-.778 0-1.507.24-2.03.588a.082.082 0 00-.027.109l.632 1.088a.08.08 0 00.11.03 2.5 2.5 0 011.318-.366c1.25 0 2.17.891 2.17 2.068 0 1.003-.736 1.745-1.669 1.745-.76 0-1.288-.446-1.288-1.077 0-.361.152-.657.548-.866a.08.08 0 00.032-.113l-.596-1.018a.08.08 0 00-.098-.035c-.799.299-1.359 1.018-1.359 1.984 0 1.46 1.152 2.55 2.76 2.55 1.877 0 3.227-1.313 3.227-3.195 0-2.018-1.57-3.492-3.73-3.492zM28.675 8.843c-.724 0-1.373.27-1.845.746-.026.027-.069.007-.069-.029v-.572a.08.08 0 00-.08-.082h-1.397a.08.08 0 00-.08.082v8.182a.08.08 0 00.08.081h1.433a.08.08 0 00.081-.081v-2.683c0-.036.043-.054.069-.03a2.6 2.6 0 001.808.7c1.682 0 2.993-1.373 2.993-3.157s-1.313-3.157-2.993-3.157zm-.271 4.929c-.956 0-1.681-.768-1.681-1.783s.723-1.783 1.681-1.783c.958 0 1.68.755 1.68 1.783 0 1.027-.713 1.783-1.681 1.783h.001z" fill="#fff"></path></svg>

                </li><li className="list-payment__item">
                  <svg className="icon icon--full-color" viewBox="-36 25 38 24" xmlns="http://www.w3.org/2000/svg" width="38" height="24" role="img" aria-labelledby="pi-unionpay"><title id="pi-unionpay">Union Pay</title><path fill="#005B9A" d="M-36 46.8v.7-.7zM-18.3 25v24h-7.2c-1.3 0-2.1-1-1.8-2.3l4.4-19.4c.3-1.3 1.9-2.3 3.2-2.3h1.4zm12.6 0c-1.3 0-2.9 1-3.2 2.3l-4.5 19.4c-.3 1.3.5 2.3 1.8 2.3h-4.9V25h10.8z"></path><path fill="#E9292D" d="M-19.7 25c-1.3 0-2.9 1.1-3.2 2.3l-4.4 19.4c-.3 1.3.5 2.3 1.8 2.3h-8.9c-.8 0-1.5-.6-1.5-1.4v-21c0-.8.7-1.6 1.5-1.6h14.7z"></path><path fill="#0E73B9" d="M-5.7 25c-1.3 0-2.9 1.1-3.2 2.3l-4.4 19.4c-.3 1.3.5 2.3 1.8 2.3H-26h.5c-1.3 0-2.1-1-1.8-2.3l4.4-19.4c.3-1.3 1.9-2.3 3.2-2.3h14z"></path><path fill="#059DA4" d="M2 26.6v21c0 .8-.6 1.4-1.5 1.4h-12.1c-1.3 0-2.1-1.1-1.8-2.3l4.5-19.4C-8.6 26-7 25-5.7 25H.5c.9 0 1.5.7 1.5 1.6z"></path><path fill="#fff" d="M-21.122 38.645h.14c.14 0 .28-.07.28-.14l.42-.63h1.19l-.21.35h1.4l-.21.63h-1.68c-.21.28-.42.42-.7.42h-.84l.21-.63m-.21.91h3.01l-.21.7h-1.19l-.21.7h1.19l-.21.7h-1.19l-.28 1.05c-.07.14 0 .28.28.21h.98l-.21.7h-1.89c-.35 0-.49-.21-.35-.63l.35-1.33h-.77l.21-.7h.77l.21-.7h-.7l.21-.7zm4.83-1.75v.42s.56-.42 1.12-.42h1.96l-.77 2.66c-.07.28-.35.49-.77.49h-2.24l-.49 1.89c0 .07 0 .14.14.14h.42l-.14.56h-1.12c-.42 0-.56-.14-.49-.35l1.47-5.39h.91zm1.68.77h-1.75l-.21.7s.28-.21.77-.21h1.05l.14-.49zm-.63 1.68c.14 0 .21 0 .21-.14l.14-.35h-1.75l-.14.56 1.54-.07zm-1.19.84h.98v.42h.28c.14 0 .21-.07.21-.14l.07-.28h.84l-.14.49c-.07.35-.35.49-.77.56h-.56v.77c0 .14.07.21.35.21h.49l-.14.56h-1.19c-.35 0-.49-.14-.49-.49l.07-2.1zm4.2-2.45l.21-.84h1.19l-.07.28s.56-.28 1.05-.28h1.47l-.21.84h-.21l-1.12 3.85h.21l-.21.77h-.21l-.07.35h-1.19l.07-.35h-2.17l.21-.77h.21l1.12-3.85h-.28m1.26 0l-.28 1.05s.49-.21.91-.28c.07-.35.21-.77.21-.77h-.84zm-.49 1.54l-.28 1.12s.56-.28.98-.28c.14-.42.21-.77.21-.77l-.91-.07zm.21 2.31l.21-.77h-.84l-.21.77h.84zm2.87-4.69h1.12l.07.42c0 .07.07.14.21.14h.21l-.21.7h-.77c-.28 0-.49-.07-.49-.35l-.14-.91zm-.35 1.47h3.57l-.21.77h-1.19l-.21.7h1.12l-.21.77h-1.26l-.28.42h.63l.14.84c0 .07.07.14.21.14h.21l-.21.7h-.7c-.35 0-.56-.07-.56-.35l-.14-.77-.56.84c-.14.21-.35.35-.63.35h-1.05l.21-.7h.35c.14 0 .21-.07.35-.21l.84-1.26h-1.05l.21-.77h1.19l.21-.7h-1.19l.21-.77zm-19.74-5.04c-.14.7-.42 1.19-.91 1.54-.49.35-1.12.56-1.89.56-.7 0-1.26-.21-1.54-.56-.21-.28-.35-.56-.35-.98 0-.14 0-.35.07-.56l.84-3.92h1.19l-.77 3.92v.28c0 .21.07.35.14.49.14.21.35.28.7.28s.7-.07.91-.28c.21-.21.42-.42.49-.77l.77-3.92h1.19l-.84 3.92m1.12-1.54h.84l-.07.49.14-.14c.28-.28.63-.42 1.05-.42.35 0 .63.14.77.35.14.21.21.49.14.91l-.49 2.38h-.91l.42-2.17c.07-.28.07-.49 0-.56-.07-.14-.21-.14-.35-.14-.21 0-.42.07-.56.21-.14.14-.28.35-.28.63l-.42 2.03h-.91l.63-3.57m9.8 0h.84l-.07.49.14-.14c.28-.28.63-.42 1.05-.42.35 0 .63.14.77.35s.21.49.14.91l-.49 2.38h-.91l.42-2.24c.07-.21 0-.42-.07-.49-.07-.14-.21-.14-.35-.14-.21 0-.42.07-.56.21-.14.14-.28.35-.28.63l-.42 2.03h-.91l.7-3.57m-5.81 0h.98l-.77 3.5h-.98l.77-3.5m.35-1.33h.98l-.21.84h-.98l.21-.84zm1.4 4.55c-.21-.21-.35-.56-.35-.98v-.21c0-.07 0-.21.07-.28.14-.56.35-1.05.7-1.33.35-.35.84-.49 1.33-.49.42 0 .77.14 1.05.35.21.21.35.56.35.98v.21c0 .07 0 .21-.07.28-.14.56-.35.98-.7 1.33-.35.35-.84.49-1.33.49-.35 0-.7-.14-1.05-.35m1.89-.7c.14-.21.28-.49.35-.84v-.35c0-.21-.07-.35-.14-.49a.635.635 0 0 0-.49-.21c-.28 0-.49.07-.63.28-.14.21-.28.49-.35.84v.28c0 .21.07.35.14.49.14.14.28.21.49.21.28.07.42 0 .63-.21m6.51-4.69h2.52c.49 0 .84.14 1.12.35.28.21.35.56.35.91v.28c0 .07 0 .21-.07.28-.07.49-.35.98-.7 1.26-.42.35-.84.49-1.4.49h-1.4l-.42 2.03h-1.19l1.19-5.6m.56 2.59h1.12c.28 0 .49-.07.7-.21.14-.14.28-.35.35-.63v-.28c0-.21-.07-.35-.21-.42-.14-.07-.35-.14-.7-.14h-.91l-.35 1.68zm8.68 3.71c-.35.77-.7 1.26-.91 1.47-.21.21-.63.7-1.61.7l.07-.63c.84-.28 1.26-1.4 1.54-1.96l-.28-3.78h1.19l.07 2.38.91-2.31h1.05l-2.03 4.13m-2.94-3.85l-.42.28c-.42-.35-.84-.56-1.54-.21-.98.49-1.89 4.13.91 2.94l.14.21h1.12l.7-3.29-.91.07m-.56 1.82c-.21.56-.56.84-.91.77-.28-.14-.35-.63-.21-1.19.21-.56.56-.84.91-.77.28.14.35.63.21 1.19"></path></svg>
                </li><li className="list-payment__item">
                  <svg className="icon icon--full-color" viewBox="0 0 38 24" xmlns="http://www.w3.org/2000/svg" role="img" width="38" height="24" aria-labelledby="pi-visa"><title id="pi-visa">Visa</title><path opacity=".07" d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"></path><path fill="#fff" d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"></path><path d="M28.3 10.1H28c-.4 1-.7 1.5-1 3h1.9c-.3-1.5-.3-2.2-.6-3zm2.9 5.9h-1.7c-.1 0-.1 0-.2-.1l-.2-.9-.1-.2h-2.4c-.1 0-.2 0-.2.2l-.3.9c0 .1-.1.1-.1.1h-2.1l.2-.5L27 8.7c0-.5.3-.7.8-.7h1.5c.1 0 .2 0 .2.2l1.4 6.5c.1.4.2.7.2 1.1.1.1.1.1.1.2zm-13.4-.3l.4-1.8c.1 0 .2.1.2.1.7.3 1.4.5 2.1.4.2 0 .5-.1.7-.2.5-.2.5-.7.1-1.1-.2-.2-.5-.3-.8-.5-.4-.2-.8-.4-1.1-.7-1.2-1-.8-2.4-.1-3.1.6-.4.9-.8 1.7-.8 1.2 0 2.5 0 3.1.2h.1c-.1.6-.2 1.1-.4 1.7-.5-.2-1-.4-1.5-.4-.3 0-.6 0-.9.1-.2 0-.3.1-.4.2-.2.2-.2.5 0 .7l.5.4c.4.2.8.4 1.1.6.5.3 1 .8 1.1 1.4.2.9-.1 1.7-.9 2.3-.5.4-.7.6-1.4.6-1.4 0-2.5.1-3.4-.2-.1.2-.1.2-.2.1zm-3.5.3c.1-.7.1-.7.2-1 .5-2.2 1-4.5 1.4-6.7.1-.2.1-.3.3-.3H18c-.2 1.2-.4 2.1-.7 3.2-.3 1.5-.6 3-1 4.5 0 .2-.1.2-.3.2M5 8.2c0-.1.2-.2.3-.2h3.4c.5 0 .9.3 1 .8l.9 4.4c0 .1 0 .1.1.2 0-.1.1-.1.1-.1l2.1-5.1c-.1-.1 0-.2.1-.2h2.1c0 .1 0 .1-.1.2l-3.1 7.3c-.1.2-.1.3-.2.4-.1.1-.3 0-.5 0H9.7c-.1 0-.2 0-.2-.2L7.9 9.5c-.2-.2-.5-.5-.9-.6-.6-.3-1.7-.5-1.9-.5L5 8.2z" fill="#142688"></path></svg>
                </li></ul>

  <div className="footer-bottom">
    <p>&copy; {year} beautybykiara. All Rights Reserved.</p>
    <p style={{fontSize: "12px"}}>
      Developed by <a href="https://www.linkedin.com/in/henry-okiyi-0246b6299/" target="_blank">Henry Okiyi</a>
    </p>
  </div>
</footer>
      
      {/* <footer className="text-center text-lg-start text-muted" style={{backgroundColor: "black"}}>

  <section className="p-4" style={{backgroundColor: "rgba(0, 0, 0, 0.05)"}}>
    <div className="container">
      <div className="row d-flex">
       
        <div className="col-md-6 col-sm-12 mb-2 mb-md-0 d-flex justify-content-center justify-content-md-start">
          <div className="">
            <div className="input-group" style={{maxWidth: "400px"}}>
              <input type="email" className="form-control border" placeholder="Email" aria-label="Email" aria-describedby="button-addon2" />
              <button className="btn btn-light border" type="button" id="button-addon2" data-mdb-ripple-color="dark">
                Subscribe
              </button>
            </div>
          </div>
        </div>
       

       
        <div className="col-md-6 col-sm-12 float-center">
          <div className="float-md-end">
            <div className="btn btn-icon btn-light text-secondary border">
            <i className="fab fa-lg fa-cc-paypal"></i>
            </div>
            <div className="btn btn-icon btn-light text-secondary border">
            <i className="fab fa-lg fa-cc-mastercard"></i>
            </div>
            <div className="btn btn-icon btn-light text-secondary border">
            <i className="fab fa-lg fa-cc-amex"></i>
            </div>
            <div className="btn btn-icon btn-light text-secondary border">
              <i className="fab fa-lg fa-cc-visa"></i>
            </div>
            
          </div>
        </div>
        
      </div>
    </div>
  </section>
          
          
 


  <section className="">
    <div className="container text-center text-md-start mt-5 mb-4">
      
      <div className="row mt-3">
      
        <div className="col-12 col-lg-3 col-sm-12">
       
          
            <Logo />
  
          <p className="mt-3">
            beautybykiara

          </p>
        </div>
     

       
        <div className="col-6 col-sm-4 col-lg-2">
          
          <h6 className="text-uppercase text-dark fw-bold mb-2">
            Store
          </h6>
          <ul className="list-unstyled mb-4">
            <li><a className="text-muted" href="#">About us</a></li>
            <li><a className="text-muted" href="#">Find store</a></li>
            <li><a className="text-muted" href="#">Categories</a></li>
            <li><a className="text-muted" href="#">Blogs</a></li>
          </ul>
        </div>
        

        
        <div className="col-6 col-sm-4 col-lg-2">
          
          <h6 className="text-uppercase text-dark fw-bold mb-2">
            Information
          </h6>
          <ul className="list-unstyled mb-4">
            <li><a className="text-muted" href="#">Help center</a></li>
            <li><a className="text-muted" href="#">Money refund</a></li>
            <li><a className="text-muted" href="#">Shipping info</a></li>
            <li><a className="text-muted" href="#">Refunds</a></li>
          </ul>
        </div>
        

        
        <div className="col-6 col-sm-4 col-lg-2">
          
          <h6 className="text-uppercase text-dark fw-bold mb-2">
            Support
          </h6>
          <ul className="list-unstyled mb-4">
            <li><a className="text-muted" href="#">Help center</a></li>
            <li><a className="text-muted" href="#">Documents</a></li>
            <li><a className="text-muted" href="#">Account restore</a></li>
            <li><a className="text-muted" href="#">My orders</a></li>
          </ul>
        </div>
        

       
        <div className="col-12 col-sm-12 col-lg-3">
         
          <h6 className="text-uppercase text-dark fw-bold mb-2">Our apps</h6>
          <div className="d-flex justify-content-center" style={{gap: "10px"}}>
            <a href="https://www.instagram.com/beauty_bykiaraa/" target="_blank" className="mb-2 d-inline-block"> <img width="20px" src="data:image/jpeg;base64,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" alt="" /></a>
            <a href="https://www.tiktok.com/@beauty_bykiara"  target="_blank" className="mb-2 d-inline-block"> <img width="20px" src="data:image/jpeg;base64,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" alt="" /></a>
          </div>
        </div>
       
      </div>
      
    </div>
  </section>
 
  <div className="container">
    <div className="py-4 border-top">
      <div className="d-flex justify-content-between">
        
        <div className="text-dark">
          <i className="fab fa-lg fa-cc-visa"></i>
          <i className="fab fa-lg fa-cc-amex"></i>
          <i className="fab fa-lg fa-cc-mastercard"></i>
          <i className="fab fa-lg fa-cc-paypal"></i>
        </div>

      </div>
    </div>
  </div>
</footer> */}


    </div>
}
export default Footer