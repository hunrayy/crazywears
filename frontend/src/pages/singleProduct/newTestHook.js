
import { useEffect, useMemo } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";



export const newTestHook = (productId) => {
    const fetchProduct = async (productId) => {
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/get-single-product?productId=${productId}`);
      console.log(data)
      return data;
    };

    console.log(productId)


    const test = "just testing"



    const result = useQuery({
        queryKey: ["test"],
        queryFn: () => {
            // debugger;
            // alert("queryFn ran");
            console.log("🔥🔥🔥 queryFn executed");
            return Promise.resolve("hello");
        },
    });

    console.log({
        status: result.status,
        fetchStatus: result.fetchStatus,
        isPending: result.isPending,
        isLoading: result.isLoading,
        data: result.data,
        error: result.error,
    });

    // const { data, isLoading, error } = useQuery({
    //     queryKey: ["singleProduct", productId],
    //     queryFn: () => {
    //         console.log("queryFn executed");
    //         return fetchProduct(productId);
    //     },
    //     gcTime: 30 * 60 * 1000,
    //     placeholderData: keepPreviousData,
    //     refetchOnMount: false,
    //     refetchOnWindowFocus: false,
    //     keepPreviousData: true,
    // });
    // console.log(data)


    return {
        test: test
    }
}