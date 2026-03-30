


import { useQuery } from '@tanstack/react-query';
import { useState, useContext, useEffect } from "react"
import "./products.css"
import { CartContext } from "../../pages/cart/CartContext"
import { CurrencyContext } from "../all_context/CurrencyContext"
import { useNavigate, useLocation } from "react-router-dom"
import axios from "axios"
import useProductCategory from "../productCategory/useProductCategory"

const userUseProductsHook = (productCategory, setProductCategory, isAdmin) => {
    console.log(productCategory)
    const navigate = useNavigate();
    const location = useLocation();
    const { categories } = useProductCategory();
    const { selectedCurrency, convertCurrency, currencySymbols, ratesFetched } = useContext(CurrencyContext);
    const { cartProducts, addToCart, isAnyVariantInCart } = useContext(CartContext);

    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(12);

    const queryKey = ['products', currentPage, perPage, productCategory];

    const isMobile = window.matchMedia("(hover: none)").matches;

    const [showEditProductForm, setShowEditProductForm] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null)
    // const showPage = (page) => {
    //     setPage(page)
    // }

    const fetchProducts = async () => {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/get-all-products`, {
        params: { perPage, page: currentPage, ...(productCategory && { productCategory }) }
        });
        console.log(response)
        return response.data.data;
    };

    const { data: totalProducts, isLoading, isError, error } = useQuery({
        queryKey,
        queryFn: fetchProducts,
        keepPreviousData: true,
        staleTime: 1000 * 60 * 5
    });

    const navigateToProduct = (id) => navigate(`/product/${id}`);

    const startProduct = (currentPage - 1) * perPage + 1;
    const endProduct = Math.min(currentPage * perPage, totalProducts?.total || 0);

    // ----- CATEGORY & SORT BUTTON STATE -----
    const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
    const [sortMenuOpen, setSortMenuOpen] = useState(false);
    const [categoryMenuExiting, setCategoryMenuExiting] = useState(false);
    const [sortMenuExiting, setSortMenuExiting] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(productCategory || "All");
    const [selectedSort, setSelectedSort] = useState("Date, new - old");

    const sortOptions = [
        "Alphabetically, A - Z",
        "Alphabetically, Z - A",
        "Price, low - high",
        "Price, high - low",
        "Date, new - old",
        "Date, old - new"
    ];

    const handleCategorySelect = (cat) => {
        const categoryName = (cat.name || cat).toLowerCase();

        if (isAdmin) {
            // 🔥 THIS triggers React Query refetch
            setProductCategory(categoryName);
        } else {
            navigate(`/collections/${categoryName.trim().replace(/\s+/g, '-')}`);
        }

        setSelectedCategory(categoryName); // UI only
        closeCategoryMenu();
    };

    const handleSortSelect = (sortOption) => {
        setSelectedSort(sortOption);
        closeSortMenu();
    };

    const closeCategoryMenu = () => {
        setCategoryMenuExiting(true);
        setTimeout(() => {
        setCategoryMenuOpen(false);
        setCategoryMenuExiting(false);
        }, 300);
    };

    const closeSortMenu = () => {
        setSortMenuExiting(true);
        setTimeout(() => {
        setSortMenuOpen(false);
        setSortMenuExiting(false);
        }, 300);
    };


    // --- MOBILE OVERLAY TOGGLE WITHOUT REACT STATE ---
    useEffect(() => {
        if (!isMobile) return;

        const handleClickOutside = (e) => {
        const activeOverlays = document.querySelectorAll(".product-hover-overlay.active");
        activeOverlays.forEach(overlay => {
            if (!e.target.closest(".product-card") && !e.target.closest(".product-hover-overlay")) {
            overlay.classList.remove("active");
            }
        });
        };

        window.addEventListener("click", handleClickOutside);
        return () => window.removeEventListener("click", handleClickOutside);
    }, [isMobile]);

    const toggleOverlay = (productId) => {
        // first, close all other overlays
        const allOverlays = document.querySelectorAll(".product-hover-overlay");
        allOverlays.forEach(overlay => {
            if (overlay.id !== `overlay-${productId}`) {
            overlay.classList.remove("active");
            }
        });

        // toggle the clicked overlay
        const overlay = document.getElementById(`overlay-${productId}`);
        if (overlay) overlay.classList.toggle("active");
    };

    return {
        // data
        totalProducts,
        isLoading,
        isError,
        error,

        // state to show all products or 'editProductForm'
        showEditProductForm,
        setShowEditProductForm,
        selectedProduct,
        setSelectedProduct,

        // pagination
        currentPage,
        setCurrentPage,
        perPage,
        startProduct,
        endProduct,

        // navigation
        navigateToProduct,

        // currency
        selectedCurrency,
        convertCurrency,
        currencySymbols,
        ratesFetched,

        // cart
        addToCart,
        isAnyVariantInCart,

        // category + sort
        categories,
        selectedCategory,
        selectedSort,
        sortOptions,
        handleCategorySelect,
        handleSortSelect,

        // menu states
        categoryMenuOpen,
        setCategoryMenuOpen,
        sortMenuOpen,
        setSortMenuOpen,
        categoryMenuExiting,
        sortMenuExiting,
        closeCategoryMenu,
        closeSortMenu,

        // mobile
        isMobile,
        toggleOverlay
    };



}

export default userUseProductsHook


