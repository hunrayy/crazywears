



import { Link } from 'react-router-dom'
import './emptyCart.css'
import emptyShoppingCart from '../../assets/emptyShoppingCart/emptyShoppingCart.png'
const EmptyCart = () => {
    return <div>
        <div className='empty-cart-container'>
            <div className='empty-cart-wrapper'>
                <img className='empty-cart-image' src={emptyShoppingCart} alt="" />
                <div style={{display: "flex", flexDirection: "column", textAlign: "center"}}>
                    <h3><b>Your shopping cart is empty</b></h3>
                    <small>Browse through to discover our best deals</small>
                    <Link to='/' className='btn mt-3' style={{backgroundColor: "purple", color: "white", fontWeight: "bold", textDecoration: "none"}}>
                        Start shopping
                    </Link>
                </div>

            </div>

        </div>


    </div>
}
export default EmptyCart