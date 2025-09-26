import React, { useState } from 'react';
import './trackingPage.css';
import Navbar from '../../components/navbar/Navbar';
import Footer from '../../components/footer/Footer';
import axios from 'axios'

const TrackingPage = () => {
    const [trackingId, setTrackingId] = useState('')
    const [formError, setFormError] = useState(null)
    const [loading, setLoading] = useState(false)
    const [serverErrorMessage, setServerErrorMessage] = useState('')
    const [serverSuccessMessage, setServerSuccessMessage] = useState('')
    const [trackedOrder, setTrackedOrder] = useState(null)
    const [displayTrackedOrder, setDisplayTrackedOrder] = useState(false)
    const handleSubmit = async (e) => {
        e.preventDefault()
        if(!trackingId){
            setFormError('Tracking ID is required')
        }else{
            setFormError(null)
            setLoading(true)
            setServerErrorMessage('')
            setServerSuccessMessage('')
            
            const feedback = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/track-order`, {
                params: {
                    trackingId: trackingId
                }
            })
            console.log(feedback)
            if(feedback){
                setLoading(false)
                setTrackingId('')
                if(feedback.data.code == "success"){
                    setServerSuccessMessage(<div>{feedback.data.message}...<span style={{color: "purple", cursor: "pointer"}} onClick={()=> setDisplayTrackedOrder(true)}>click to view</span></div>)
                    setTrackedOrder(feedback.data.data)
                }else{
                    setServerErrorMessage(feedback.data.message)
                }

            }
        }
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString(); // This will format it based on the user's locale
    }

    return <div>
        <Navbar />
        <div className="tracking-page-container">
            <div className="tracking-page-wrapper">
                <h2 className='mb-4'>Track Your Order</h2>
                    <div className='text-danger text-center mb-4'>{serverErrorMessage}</div>
                    <div className='text-center mb-4'>{serverSuccessMessage}</div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Enter Tracking ID</label><br />
                        <input type="text" placeholder='Tracking ID' className={`form-control py-2 mt-2 ${formError && 'is-invalid'}`} onChange={(e)=> setTrackingId(e.target.value.trim())} value={trackingId} />
                        {formError && <p className='text-danger'>{formError}</p>}
                    </div>
                    <div className="d-grid mt-4">
                        <button className='btn py-2' style={{background: "purple", color: "white"}} disabled={loading}>
                            {
                                loading ? <div className="spinner-border" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                : "Track Order"
                            }
                        </button>
                    </div>
                </form>

            </div>



            {
            displayTrackedOrder && <div className='single-order-container-overlay' onClick={()=> {setDisplayTrackedOrder(null), setServerSuccessMessage('')}}>
                {console.log(trackedOrder)}
                <div className="single-order-wrapper" onClick={(e)=> {e.stopPropagation()}}>
                <div style={{fontFamily: "Arial, sans-serif", color: "#333"}} className='pb-3'>
                    <h4 style={{color: "#333"}} className='mt-2'>Order Details:</h4>
                    <div className="row">
                        <div className='col-md-4 border py-2'>
                            <h5>User Profile</h5>
                            <p>
                                <b>Firstname:</b> {trackedOrder.firstname}<br/>
                                <b>Lastname:</b> {trackedOrder.lastname}<br/>
                                <b>Email:</b> {trackedOrder.email}<br/>
                                <b>Phone Number:</b> {trackedOrder.phoneNumber}<br/>
                            </p>
                        </div>
                        <div className='col-md-4 border py-2'>
                            <h5>Shipping Information</h5>
                            <p>
                                <b>Country:</b> {trackedOrder.country}<br/>
                                <b>State:</b> {trackedOrder.state}<br/>
                                <b>City:</b> {trackedOrder.city}<br/>
                                <b>Address:</b> {trackedOrder.address}<br/>
                                <b>Postal Code:</b> {trackedOrder.postalCode ? trackedOrder.postalCode : "nil"}<br/>
                                <b>Expected Date Of Delivery:</b> {trackedOrder.expectedDateOfDelivery}<br/>
                                <b>Status: </b> 
                                                {trackedOrder.status.toLowerCase() == "pending" && <span className='badge bg-warning'>Pending</span>}
                                                {trackedOrder.status.toLowerCase() == "outForDelivery" && <span className='badge bg-primary'>Out for delivery</span>}
                                                {trackedOrder.status.toLowerCase() == "delivered" && <span className='badge bg-success'>Delivered</span>}

                                            <br/>
                            </p>
                        </div>
                        <div className='col-md-4 border py-2'>
                            <h5>Order Information</h5>
                            <p>
                                <b>Tracking ID:</b> {trackedOrder.tracking_id}<br/>
                                <b>Transaction ID:</b> {trackedOrder.transaction_id}<br/>
                                <b>Initiated At:</b> {formatDate(trackedOrder.created_at)}<br/>
                                <b>Subtotal:</b>{trackedOrder.currency} {parseFloat(trackedOrder.subtotal).toLocaleString()}<br/>
                                <b>Shipping fee:</b>{trackedOrder.currency} {parseFloat(trackedOrder.shippingFee).toLocaleString()}<br/>
                                {/* <b>Shipping Fee:</b> {trackedOrder.shippingFee}<br/> */}
                                <b>Total:</b> {trackedOrder.currency} {Number(trackedOrder.totalPrice).toLocaleString()}<br/>
                            </p>
                        </div>
                    </div>
                    <h4 style={{color: "#333"}} className='mt-2'>Order Summary:</h4>
                    <div style={{display: "flex", flexWrap: "wrap", gap: "10px"}} className='border p-2 justify-content-center justify-content-md-start'>
                        {
                            
                            JSON.parse(trackedOrder.products).map((product, index) => {
                                return <div key={index} style={{display: "flex", border: "1px solid #ddd", borderRadius: "10px", padding: "10px", marginBottom: "20px", backgroundColor: "#fafafa", maxWidth: "320px"}}>
                                <img src={product.productImage} alt={`product image ${index + 1}`} style={{width: "100%", height: "auto", maxWidth: "80px", objectFit: "cover", borderRadius: "8px", marginRight: "20px"}} />
                                <div style={{flexGrow: "1"}}>
                                    <h3 style={{margin: "0", color: "#333", fontSize: "18px"}}>{product.productName}</h3>
                                    <p style={{margin: "5px 0", color: "#777", fontSize: "14px"}}>Length: {product.lengthPicked}</p>
                                    <p style={{margin: "5px 0", color: "#777", fontSize: "14px"}}>Quantity: {product.quantity}</p>
                                    <p style={{margin: "5px 0", color: "#777", fontSize: "14px"}}>Price: {product.updatedPrice}</p>
                                </div>
                                </div>
                            })
                        }
                        
                    </div>
                   
                
                </div>
                </div>
                
            </div>
        }
            
        </div>
        <Footer />
    </div>
};

export default TrackingPage;

