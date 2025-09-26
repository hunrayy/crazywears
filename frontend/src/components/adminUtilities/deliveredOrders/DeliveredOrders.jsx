













import axios from 'axios'
import Cookies from 'js-cookie'
import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import BasicLoader from '../../loader/BasicLoader'
import PaginationButtons from '../../paginationButtons/PaginationButtons'
const DeliveredOrders = () => {

    const [deliveredOrders, setDeliveredOrders] = useState([])
    const [deliveredOrdersLoading, setDeliveredOrdersLoading] = useState(true)

    const [singleOrder, setSingleOrder] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(20);
    const [totalDeliveredOrders, setTotalDeliveredOrders] = useState([]);


    const getDeliveredOrders = async () => {
        const token = Cookies.get("authToken")
        const feedback = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/admin/get-orders`, {
            params: {
                status: 'delivered',
                perPage: perPage,
                page: currentPage,
            },
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        console.log(feedback)
        if(feedback.data.code == 'success'){
            setDeliveredOrdersLoading(false)
            setDeliveredOrders(feedback.data.data.data)
            setCurrentPage(feedback.data.data.current_page)
            setTotalDeliveredOrders(feedback.data.data);
        }else{
            toast.error(feedback.data.message)
        }
    }
    const handleViewMoreDeliveredOrders = (order) => {
        setSingleOrder(order)
    }


    useEffect(()=> {
        getDeliveredOrders()
    }, [currentPage, perPage])

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString(); // This will format it based on the user's locale
    }


    if(deliveredOrdersLoading){
        return <div style={{width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
            <BasicLoader />
        </div>
    }

    const showPaginationButtons = true
    return <div>
        <div className="pending-orders-container">
            <div className="table-responsiv p-2">
        <p style={{fontWeight: "bold"}} className='px-1'>Delivered Orders</p>

            {/* <table className="table caption-top table-bordered"> */}
        {/* <caption>Delivered Orders</caption>
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
            deliveredOrders.map((each_item, index) => {

                return <tbody key={index}>
                    <tr>
                    <th scope="row">{deliveredOrders.length - index}</th>
                    <td>{each_item.tracking_id}</td>
                    <td>{each_item.email}</td>
                    <td>{formatDate(each_item.created_at)}</td>
                    <td>{formatDate(each_item.updated_at)}</td>
                    <td>
                        <button className='btn btn-sm' style={{background: "purple", color: "white"}} onClick={()=> handleViewMoreDeliveredOrders(each_item)}>View more</button>
                    </td>
                    </tr>
                </tbody>
            })
        } */}


{
            deliveredOrders.map((each_item, index) => {

                return <div key={index} className='mb-2'>
                    <div style={{display: "flex", alignItems: "center", gap: "10px"}}>
                        <div style={{display: "flex", alignItems: "center"}}>
                            <div><b>{index + 1}</b></div><img width="50px" style={{borderRadius: "50%"}} src="data:image/jpeg;base64,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" />

                        </div>
                        <div style={{display: "flex", justifyContent: "space-between", width: "100%", flexWrap: "wrap"}}>
                            <div>Tracking ID: {each_item.tracking_id}</div>
                            {/* <div>Email: {each_item.email}</div> */}
                            <div>Initiated at: {formatDate(each_item.created_at)}</div>
                            <div>Updated at: {formatDate(each_item.updated_at)}</div>
                            <div>
                                <button className='btn btn-sm' style={{background: "purple", color: "white"}} onClick={()=> handleViewMoreDeliveredOrders(each_item)}>View more</button>
                            </div>
                        </div>
                    </div>
                </div>
            })
        }
        {/* </table> */}
            {showPaginationButtons && totalDeliveredOrders.total > totalDeliveredOrders.per_page && <PaginationButtons currentPage={currentPage} setCurrentPage={setCurrentPage} perPage={perPage} metaData={totalDeliveredOrders} />}
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
                                <b>Subtotal:</b>{singleOrder.currency} {parseFloat(singleOrder.subtotal).toLocaleString()}<br/>
                                <b>Shipping fee:</b>{singleOrder.currency} {parseFloat(singleOrder.shippingFee).toLocaleString()}<br/>
                                <b>Total:</b> {singleOrder.currency} {Number(singleOrder.totalPrice).toLocaleString()}<br/>
                            </p>
                        </div>
                    </div>
                    <h4 style={{color: "#333"}} className='mt-2'>Order Summary:</h4>
                    <div style={{display: "flex", flexWrap: "wrap", gap: "10px"}} className='border p-2 justify-content-center justify-content-md-start'>
                        {
                            
                            JSON.parse(singleOrder.products).map((product, index) => {
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
                
                </div>
                </div>
                
            </div>
        }
    </div>
}
export default DeliveredOrders
