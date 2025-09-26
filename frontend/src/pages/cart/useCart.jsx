// useCart.js
import { useState, useEffect } from 'react';

const useCart = () => {
    const [allCartItems, setAllCartItems] = useState({
        products: [],
        totalPrice: 0
    });

    const calculateTotalPrice = (products) => {
        return products.reduce((acc, item) => acc + parseFloat(item.price), 0);
    };

    const removeFromCart = (product) => {
        setAllCartItems(prevState => {
            const updatedProducts = prevState.products.filter(item => item.id !== product.id);
            const newTotalPrice = calculateTotalPrice(updatedProducts);

            localStorage.setItem("cart_items", JSON.stringify(updatedProducts));

            return {
                products: updatedProducts,
                totalPrice: newTotalPrice
            };
        });
    };

    useEffect(() => {
        const storedItems = JSON.parse(localStorage.getItem("cart_items"));
        if (storedItems) {
            const initialTotalPrice = calculateTotalPrice(storedItems);
            setAllCartItems({
                products: storedItems,
                totalPrice: initialTotalPrice
            });
        }
    }, []);

    const totalItems = allCartItems.products.length;

    return {
        allCartItems,
        removeFromCart,
        totalItems
    };
};

export default useCart;
