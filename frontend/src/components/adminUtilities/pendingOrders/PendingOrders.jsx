



import './pendingOrders.css'
import axios from 'axios'
import Cookies from 'js-cookie'
import { useState, useEffect, useContext } from 'react'
import BasicLoader from '../../loader/BasicLoader'
import { toast } from 'react-toastify'
import { CurrencyContext } from '../../all_context/CurrencyContext';
import PaginationButtons from '../../paginationButtons/PaginationButtons'
    const PendingOrders = () => {
    const { selectedCurrency, convertCurrency, currencySymbols } = useContext(CurrencyContext);
    const [pendingOrders, setPendingOrders] = useState([])
    const [pendingOrdersLoading, setPendingOrdersLoading] = useState(true)
    const [singleOrder, setSingleOrder] = useState(null)
    const [outForDeliveryModal, setOutForDeliveryModal] = useState(null)
    const [trackingId, setTrackingId] = useState('');
    const [trackingIdError, setTrackingIdError] = useState('');
    const [verificationText, setVerificationText] = useState('');
    const [verificationTextError, setVerificationTextError] = useState('');
    const [isLoading, setIsLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(20);
    const [totalPendingOrders, setTotalPendingOrders] = useState([]);

    

    const getPendingOrders = async () => {

        const token = Cookies.get("authToken")
        const feedback = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/admin/get-orders`, {
            params: {
                status: 'pending',
                perPage: perPage,
                page: currentPage,
            },
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        console.log(feedback)
        if(feedback.data.code == 'success'){
            setPendingOrdersLoading(false)
            setPendingOrders(feedback.data.data.data)
            setCurrentPage(feedback.data.data.current_page)
            setTotalPendingOrders(feedback.data.data);

        }
    }
    const handleViewMorePendingOrders = (order) => {
        setSingleOrder(order)
    }


    useEffect(()=> {
        getPendingOrders()
    }, [currentPage, perPage])

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString(); // This will format it based on the user's locale
    }

    const handleMarkAsOutForDelivery = (order) => {
        setSingleOrder(null)
        setOutForDeliveryModal(order)
        console.log(order)
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'trackingId') {
            setTrackingId(value);
            setTrackingIdError(''); // Reset error when changing input
        } else if (name === 'verificationText') {
            setVerificationText(value);
            setVerificationTextError(''); // Reset error when changing input
        }
    };

    const validateForm = () => {
        let isValid = true;

        // Validate Tracking ID
        if (trackingId.trim() !== outForDeliveryModal.tracking_id) {
            setTrackingIdError('Tracking ID does not match');
            isValid = false;
        }

        // Validate Verification Text
        if (verificationText.trim().toLocaleLowerCase() !== 'out for delivery') {
            setVerificationTextError('Verification text must be "Out For Delivery"');
            isValid = false;
        }

        return isValid;
    };

    const handleSubmit = async (e) => {
        const token = Cookies.get("authToken")
        e.preventDefault(); // Prevent default form submission
        if (validateForm()) {
            setIsLoading(true)
            // Proceed with the action, e.g., updating the order status
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/admin/change-order-status-to-out-for-delivery`, {trackingId: trackingId}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then((feedback) => {
                console.log(feedback)
                setIsLoading(false)
                if(feedback.data.code == "success"){
                    //filter out the pending order from the list of pending orders
                    setPendingOrders((prev) => prev.filter(order => order.tracking_id !== outForDeliveryModal.tracking_id))
                    setTrackingId('');
                    setVerificationText('');
                    setOutForDeliveryModal(null)
                    setSingleOrder(null)
                    toast.success('Order status successfully updated')

                }else{
                    toast.error(feedback.data.message)
                }

            })
            
            // Reset form fields
            // setOutForDeliveryModal(null); // Close modal after submission
        }
    };
    if(!pendingOrdersLoading && pendingOrders.length < 1){
        return         <div className="no-order-admin-container">
        <div className="no-order-admin-content">
          <h1>No Pending Orders</h1>
          <p>There are currently no pending orders to review. Once a new order is placed, it will appear here.</p>
          <div className="admin-icon">
            <i className="fas fa-box-open"></i> {/* Font Awesome icon */}
          </div>
        </div>
      </div>
    }
    if(pendingOrdersLoading){
        return <div style={{width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
            <BasicLoader />
        </div>
    }

    const showPaginationButtons = true

    
    return <div>
        <div className="pending-orders-container">
            <div className="table-responsiv">
            <table className="table caption-top table-bordered">
            <caption className='px-2'>Pending Orders</caption>
            <thead>
                <tr>
                <th scope="col">#</th>
                <th scope="col">Tracking ID</th>
                {/* <th scope="col">Email</th> */}
                <th scope="col">Initaited at</th>
                <th scope="col">Action</th>
                </tr>
            </thead>
        {
            pendingOrders.map((pendingOrder, index) => {

                return <tbody key={index}>
                    <tr>
                    {/* <th scope="row">{pendingOrders.length - index}</th> */}
                    <th scope="row">{index + 1}</th>
                    <td>{pendingOrder.tracking_id}</td>
                    {/* <td>{pendingOrder.email}</td> */}
                    <td>{formatDate(pendingOrder.created_at)}</td>
                    <td>
                        <button className='btn btn-sm' style={{background: "purple", color: "white"}} onClick={()=> handleViewMorePendingOrders(pendingOrder)}>View more</button>
                    </td>
                    </tr>
                </tbody>
            })
        }
        </table>
            {showPaginationButtons && totalPendingOrders.total > totalPendingOrders.per_page &&  <PaginationButtons currentPage={currentPage} setCurrentPage={setCurrentPage} perPage={perPage} metaData={totalPendingOrders} />}
            </div>
        </div>


        {/* view-more modal */}
        {
            singleOrder && <div className='single-order-container-overlay' onClick={()=> setSingleOrder(null)}>
                {console.log(singleOrder)}
                <div className="single-order-wrapper" onClick={(e)=> {e.stopPropagation()}}>
                <div style={{fontFamily: "Arial, sans-serif", color: "#333"}}>
                    <h4 style={{color: "#333"}} className='mt-2'>Order Details:</h4>
                    <div className="row">
                        <div className='col-md-4 border py-2'>
                            <h5>User Profile</h5>
                            <p>
                                <b>First name:</b> {singleOrder.firstname}<br/>
                                <b>Last name:</b> {singleOrder.lastname}<br/>
                                <b>Email:</b> {singleOrder.email}<br/>
                                <b>Phone number:</b> {singleOrder.phoneNumber}<br/>
                            </p>
                        </div>
                        <div className='col-md-4 border py-2'>
                            <h5>Shipping Information</h5>
                            <p>
                                <b>Country:</b> {singleOrder.country}<br/>
                                <b>State:</b> {singleOrder.state}<br/>
                                <b>City:</b> {singleOrder.city}<br/>
                                <b>Address:</b> {singleOrder.address}<br/>
                                <b>Postal Code:</b> {singleOrder.postalCode ? singleOrder.postalCode : "nil"}<br/>
                                <b>Expected Date Of Delivery:</b> {singleOrder.expectedDateOfDelivery}<br/>
                            </p>
                        </div>
                        <div className='col-md-4 border py-2'>
                            <h5>Order Information</h5>
                            <p>
                                <b>Tracking ID:</b> {singleOrder.tracking_id}<br/>
                                <b>Transaction ID:</b> {singleOrder.transaction_id}<br/>
                                <b>Initiated At:</b> {formatDate(singleOrder.created_at)}<br/>
                                <b>Subtotal:</b>{singleOrder.currency} {parseFloat(singleOrder.subtotal).toLocaleString()}<br/>
                                <b>Shipping fee:</b>{singleOrder.currency} {parseFloat(singleOrder.shippingFee).toLocaleString()}<br/>
                                {/* <b>Shipping Fee:</b> {singleOrder.shippingFee}<br/> */}
                                <b>Total:</b> {singleOrder.currency} {Number(singleOrder.totalPrice).toLocaleString()}<br/>
                            </p>
                        </div>
                    </div>
                    <h4 style={{color: "#333"}} className='mt-2'>Order Summary:</h4>
                    <div style={{display: "flex", flexWrap: "wrap", gap: "10px"}} className='border p-2 justify-content-center justify-content-md-start'>
                        {
                            
                            JSON.parse(singleOrder.products).map((product, index) => {
                                // return<div className="card" key={index} style={{maxWidth: "180px"}}>
                                //     <img src={product.productImage} className="card-img-top" style={{maxHeight: "100px", objectFit: "contain"}} alt={`product image ${index + 1}`} />
                                //     <div className="card-body">
                                //         <div style={{textAlign: "center"}}>
                                //             <p style={{margin: "0"}}><b>{product.productName}</b></p>
                                //             <p style={{margin: "0"}}>Length - {product.lengthPicked}</p>
                                //             <p style={{margin: "0"}}>Quantity * {product.quantity}</p>
                                //             {/* <p style={{margin: "0"}}>Price: {singleOrder.currency} {convertCurrency(product.productPriceInNaira, 'NGN', singleOrder.currency).toLocaleString()}</p> */}
                                //             <p style={{margin: "0"}}>Price: {singleOrder.currency} {product.updatedPrice}</p>
                                //         </div>
                                //     </div>
                                // </div>
                                return <div style={{display: "flex", border: "1px solid #ddd", borderRadius: "10px", padding: "10px", marginBottom: "20px", backgroundColor: "#fafafa", maxWidth: "320px"}}>
                                <img src={product.productImage} alt={`product image ${index + 1}`} style={{width: "100%", height: "auto", maxWidth: "80px", objectFit: "cover", borderRadius: "8px", marginRight: "20px"}} />
                                <div style={{flexGrow: "1"}}>
                                    <h3 style={{margin: "0", color: "#333", fontSize: "18px"}}>{product.productName}</h3>
                                    <p style={{margin: "5px 0", color: "#777", fontSize: "14px"}}>Length: {product.lengthPicked}</p>
                                    <p style={{margin: "5px 0", color: "#777", fontSize: "14px"}}>Quantity: {product.quantity}</p>
                                    <p style={{margin: "5px 0", color: "#777", fontSize: "14px"}}>Price: {singleOrder.currency}{product.updatedPrice}</p>
                                </div>
                                </div>
                            })
                        }
                        
                    </div>
                    <div className='d-flex justify-content-center justify-content-md-end mt-3'>
                        <button style={{background: "purple", color: "white"}} className='btn' onClick={()=>handleMarkAsOutForDelivery(singleOrder)}>Mark as Out for Delivery</button>
                    </div>
                
                </div>
                </div>
                
            </div>
        }

        {/* out for delivery modal */}
        {
            outForDeliveryModal && <div>
                <div className="single-order-container-overlay" onClick={()=> {setOutForDeliveryModal(null), setTrackingId(''), setVerificationText('')}} style={{ pointerEvents: isLoading ? 'none' : 'auto' }}>
                    <div className="out-for-delivery-modal-wrapper" onClick={(e)=>e.stopPropagation()}>
                        <div className='px-3'>
                            <h4 style={{color: "#333"}} className='mt-2'>Out For Delivery</h4>
                            {
                                isLoading && <span className="spinner-border" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </span>
                            }
                            <p>
                                Are you sure you want to change the status of this order to "Out for Delivery"? Once confirmed, 
                                the order status will be updated, and <b>{outForDeliveryModal.firstname}</b> will be notified via email regarding this update. 
                                Please ensure that all the necessary preparations for shipment are complete before proceeding. 
                            </p>
                            <p>
                                This action cannot be undone, and the order will officially enter the "out-for-delivery" phase. 
                            </p>
                        </div>
                        <form style={{background: "#f4f4f4"}} className='p-3' onSubmit={handleSubmit} method='post'>
                            <div className="form-group">
                                <label>Enter the Tracking ID <b>{outForDeliveryModal.tracking_id}</b> to continue:</label>
                                <input type="number" name='trackingId' value={trackingId} onChange={handleInputChange} min='1' required className='form-control' />
                                {trackingIdError && <small className="text-danger">{trackingIdError}</small>}
                            </div>
                            <div className="form-group mt-3">
                                <label>To verify, type <b>out for delivery</b> below:</label>
                                <input type="text" name='verificationText' value={verificationText} onChange={handleInputChange} required className='form-control' />
                                {verificationTextError && <small className="text-danger">{verificationTextError}</small>}
                            </div>
                            <div className='d-flex justify-content-between mt-3'>
                                <button className='btn border' onClick={()=> setOutForDeliveryModal(null)} disabled={isLoading}>Cancel</button>
                                <button className='btn' style={{color: "white", backgroundColor: "black"}} disabled={isLoading}>
                                    <b>Continue</b>
                                </button>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        }
    </div>
}
export default PendingOrders


