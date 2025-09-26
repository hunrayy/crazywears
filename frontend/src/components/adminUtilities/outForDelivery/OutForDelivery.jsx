







import axios from 'axios'
import Cookies from 'js-cookie'
import { useState, useEffect, useContext } from 'react'
import { toast } from 'react-toastify'
import { CurrencyContext } from '../../all_context/CurrencyContext';
import BasicLoader from '../../loader/BasicLoader';
import PaginationButtons from '../../paginationButtons/PaginationButtons';


const OutForDelivery = () => {
    const { selectedCurrency, convertCurrency, currencySymbols } = useContext(CurrencyContext);


    const [outForDeliveryOrders, setOutForDeliveryOrders] = useState([])
    const [outForDeliveryOrdersLoading, setOutForDeliveryOrdersLoading] = useState(true)


    const [singleOrder, setSingleOrder] = useState(null)
    const [deliveredModal, setDeliveredModal] = useState(null)
    const [trackingId, setTrackingId] = useState('');
    const [trackingIdError, setTrackingIdError] = useState('');
    const [verificationText, setVerificationText] = useState('');
    const [verificationTextError, setVerificationTextError] = useState('');
    const [isLoading, setIsLoading] = useState(false)
    const [noOutForDelivery, setNoOutForDelivery] = useState(false)
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(20);
    const [totalOutForDeliveryOrders, setTotalOutForDeliveryOrders] = useState([]);

    const getOutForDeliveryOrders = async () => {
        const token = Cookies.get("authToken")
        const feedback = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/admin/get-orders`, {
            params: {
                status: 'outForDelivery',
                perPage: perPage,
                page: currentPage,
            },
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        console.log(feedback)
        setOutForDeliveryOrdersLoading(false)
        if(feedback.data.code == 'success'){
            if(feedback.data.data.length < 1){
                setNoOutForDelivery(true)
            }
            setOutForDeliveryOrders(feedback.data.data.data)
            setCurrentPage(feedback.data.data.current_page)
            setTotalOutForDeliveryOrders(feedback.data.data);
        }
    }
    const handleViewMoreOutForDeliveryOrders = (order) => {
        setSingleOrder(order)
    }


    useEffect(()=> {
        getOutForDeliveryOrders()
    }, [])

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString(); // This will format it based on the user's locale
    }

    const handleMarkAsDelivered = (order) => {
        setSingleOrder(null)
        setDeliveredModal(order)
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
        if (trackingId.trim() !== deliveredModal.tracking_id) {
            setTrackingIdError('Tracking ID does not match');
            isValid = false;
        }

        // Validate Verification Text
        if (verificationText.trim().toLocaleLowerCase() !== 'delivered') {
            setVerificationTextError('Verification text must be "delivered"');
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
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/admin/change-order-status-to-delivered`, {trackingId: trackingId}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then((feedback) => {
                console.log(feedback)
                setIsLoading(false)
                if(feedback.data.code == "success"){
                    //filter out the pending order from the list of pending orders
                    setOutForDeliveryOrders((prev) => prev.filter(order => order.tracking_id !== deliveredModal.tracking_id))
                    setTrackingId('');
                    setVerificationText('');
                    setDeliveredModal(null)
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
    if(noOutForDelivery){
        return         <div className="no-order-admin-container">
        <div className="no-order-admin-content">
          <h1>No Orders Out for Delivery</h1>
          <p>There are currently no orders marked as out for delivery. Check back later for updates.</p>
          <div className="admin-icon">
          <i className="fas fa-truck"></i> {/* Font Awesome icon */}
          </div>
        </div>
      </div>
    }
    if(outForDeliveryOrdersLoading){
        return <div style={{width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
            <BasicLoader />
        </div>
    }

    const showPaginationButtons = true
    
    return <div>
        <div className="pending-orders-container p-2">

            {/* <div className="table-responsiv">
            <table className="table caption-top table-bordered">
        <caption>Out-For-Delivery Orders</caption>
            <thead>
                <tr>
                <th scope="col">#</th>
                <th scope="col">Tracking ID</th>
                <th scope="col">Email</th>
                <th scope="col">Initaited at</th>
                <th scope="col">Updated at</th>
                <th scope="col">Action</th>
                </tr>
            </thead>
        {
            outForDeliveryOrders.map((each_item, index) => {

                return <tbody key={index}>
                    <tr>
                    <th scope="row">{outForDeliveryOrders.length - index}</th>
                    <td>{each_item.tracking_id}</td>
                    <td>{each_item.email}</td>
                    <td>{formatDate(each_item.created_at)}</td>
                    <td>{formatDate(each_item.updated_at)}</td>
                    <td>
                        <button className='btn btn-sm' style={{background: "purple", color: "white"}} onClick={()=> handleViewMoreOutForDeliveryOrders(each_item)}>View more</button>
                    </td>
                    </tr>
                </tbody>
            })
        }
        </table>
            </div> */}
        <p style={{fontWeight: "bold"}}  className='px-1'>Out-For-Delivery Orders</p>

        <div>
        {
            outForDeliveryOrders.map((each_item, index) => {

                return <div key={index} className='mb-2'>
                    <div style={{display: "flex", alignItems: "center", gap: "10px"}}>
                        <div style={{display: "flex", alignItems: "center"}}>
                            <div><b>{index + 1}</b></div><img width="50px" style={{borderRadius: "50%"}} src="data:image/jpeg;base64,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" alt="" />

                        </div>
                        <div style={{display: "flex", justifyContent: "space-between", width: "100%", flexWrap: "wrap", alignItems: "center"}}>
                                <div>Tracking ID: {each_item.tracking_id}</div>
                                <div>Initiated at: {formatDate(each_item.created_at)}</div>
                                <div>Updated at: {formatDate(each_item.updated_at)}</div>
                        
                                <button className='btn btn-sm' style={{background: "purple", color: "white"}} onClick={()=> handleViewMoreOutForDeliveryOrders(each_item)}>View more</button>
                        </div>
                    </div>
                </div>
            })
        }
        {showPaginationButtons && totalOutForDeliveryOrders.total > totalOutForDeliveryOrders.per_page &&  <PaginationButtons currentPage={currentPage} setCurrentPage={setCurrentPage} perPage={perPage} metaData={totalOutForDeliveryOrders} />}
        </div>
        </div>



        {/* view-more modal */}
        {
            singleOrder && <div className='single-order-container-overlay' onClick={()=> setSingleOrder(null)}>
                {console.log(singleOrder)}
                <div className="single-order-wrapper" onClick={(e)=> {e.stopPropagation()}}>
                <div style={{fontFamily: "Arial, sans-serif", color: "#333", lineHeight: "1.6"}}>
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
                                <b>Updated At:</b> {formatDate(singleOrder.updated_at)}<br/>
                                <b>Subtotal:</b> {singleOrder.currency} {parseInt(singleOrder.subtotal).toLocaleString()}<br/>
                                <b>Shipping Fee:</b> {singleOrder.currency} {parseInt(singleOrder.shippingFee).toLocaleString()}<br/>
                                <b>Total:</b> {singleOrder.currency} {Number(singleOrder.totalPrice).toLocaleString()}<br/>
                            </p>
                        </div>
                    </div>
                    <h4 style={{color: "#333"}} className='mt-2'>Order Summary:</h4>
                    <div style={{display: "flex", flexWrap: "wrap", gap: "10px"}} className='border p-2 justify-content-center justify-content-md-start'>
                        {
                            
                            JSON.parse(singleOrder.products).map((product, index) => {
                                return <div key={index} style={{display: "flex", border: "1px solid #ddd", borderRadius: "10px", padding: "10px", marginBottom: "20px", backgroundColor: "#fafafa", maxWidth: "320px"}}>
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
                        <button style={{background: "purple", color: "white"}} className='btn' onClick={()=>handleMarkAsDelivered(singleOrder)}>Mark as Delivered</button>
                    </div>
                
                </div>
                </div>
                
            </div>
        }

        {/* out for delivery modal */}
        {
            deliveredModal && <div>
                <div className="single-order-container-overlay" onClick={()=> {setDeliveredModal(null), setTrackingId(''), setVerificationText('')}} style={{ pointerEvents: isLoading ? 'none' : 'auto' }}>
                    <div className="out-for-delivery-modal-wrapper" onClick={(e)=>e.stopPropagation()}>
                        <div className='px-3'>
                            <h4 style={{color: "#333"}} className='mt-2'>Delivered</h4>
                            {
                                isLoading && <span className="spinner-border" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </span>
                            }
                            <p>
                                Are you sure you want to change the status of this order to "Delivered"? Once confirmed, 
                                the order status will be updated, and <b>{deliveredModal.firstname}</b> will be notified via email regarding this update. 
                                Please ensure that all necessary preparations for the delivery have been completed. 
                            </p>
                            <p>
                                This action cannot be undone, and the order will officially enter the "delivered" phase. 
                            </p>
                        </div>
                        <form style={{background: "#f4f4f4"}} className='p-3' onSubmit={handleSubmit} method='post'>
                            <div className="form-group">
                                <label>Enter the Tracking ID <b>{deliveredModal.tracking_id}</b> to continue:</label>
                                <input type="number" name='trackingId' value={trackingId} onChange={handleInputChange} min='1' required className='form-control' />
                                {trackingIdError && <small className="text-danger">{trackingIdError}</small>}
                            </div>
                            <div className="form-group mt-3">
                                <label>To verify, type <b>delivered</b> below:</label>
                                <input type="text" name='verificationText' value={verificationText} onChange={handleInputChange} required className='form-control' />
                                {verificationTextError && <small className="text-danger">{verificationTextError}</small>}
                            </div>
                            <div className='d-flex justify-content-between mt-3'>
                                <button className='btn border' onClick={()=> setDeliveredModal(null)}>Cancel</button>
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
export default OutForDelivery


