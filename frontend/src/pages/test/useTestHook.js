import { useQuery } from "@tanstack/react-query";

export function useTestHook() {
    console.log("HOOK CALLED");

    return useQuery({
        queryKey: ["test-hook"],
        queryFn: async () => {
            console.log("QUERY FN");
            // alert("QUERY FN");
            return "hello";
        },
    });
}