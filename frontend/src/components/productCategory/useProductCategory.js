import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const token = Cookies.get("authToken");
const backend = import.meta.env.VITE_BACKEND_URL;

const useProductCategory = () => {
  const queryClient = useQueryClient();

  const [modalType, setModalType] = useState(null);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null); // Image preview state
  const [categoryNameInput, setCategoryNameInput] = useState("");
  const [deletePhraseInput, setDeletePhraseInput] = useState("");

  const openModal = (type, category = null) => {
    setModalType(type);
    setCurrentCategory(category);
    setInputValue(type === "edit" ? category?.name : "");
    setImageFile(null);
    setImagePreview(null); // Reset preview when opening modal
    setCategoryNameInput("");
    setDeletePhraseInput("");
  };

  const closeModal = () => {
    setModalType(null);
    setCurrentCategory(null);
    setInputValue("");
    setImageFile(null);
    setImagePreview(null); // Reset preview when closing modal
    setCategoryNameInput("");
    setDeletePhraseInput("");
  };

  const { data: categories = [], isLoading, isError } = useQuery({
    queryKey: ["productCategories"],
    queryFn: async () => {
      const { data } = await axios.get(`${backend}/fetch-product-categories`);
      console.log(data)
      if (data.code === "success") return data.data;
      throw new Error(data.message || "Failed to fetch categories");
    },
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
  });

  const createMutation = useMutation({
    mutationFn: async (formData) => {
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }
      const res = await axios.post(`${backend}/admin/create-product-category`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });
      console.log(res)
      if (res.data.code !== "success") throw new Error(res.data.message);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["productCategories"]);
      toast.success("Category created!");
      closeModal();
    },
    onError: (err) => toast.error(err.message),
  });

  const editMutation = useMutation({
    mutationFn: async (formData) => {
      const res = await axios.post(`${backend}/admin/edit-product-category`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });
      console.log(res)
      if (res.data.code !== "success") throw new Error(res.data.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["productCategories"]);
      toast.success("Category updated!");
      closeModal();
    },
    onError: (err) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (categoryName) => {
      const res = await axios.post(`${backend}/admin/delete-product-category`, { category: categoryName }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(res)
      if (res.data.code !== "success") throw new Error(res.data.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["productCategories"]);
      toast.success("Category deleted!");
      closeModal();
    },
    onError: (err) => toast.error(err.message),
  });

  const validateImage = (file) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (!allowedTypes.includes(file.type)) {
      toast.error("Invalid file type. Only JPEG, JPG, PNG, and WEBP are allowed.");
      return false;
    }
    if (file.size > maxSize) {
      toast.error("File too large. Max 2MB allowed.");
      return false;
    }
    return true;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && validateImage(file)) {
      setImageFile(file);

      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); // Set the preview URL to the state
      };
      reader.readAsDataURL(file); // Read the file as a data URL
    }
  };

  const handleSave = () => {
    if (modalType === "create") {
      if (!inputValue.trim()) return toast.error("Category name is required.");
      if (!imageFile) return toast.error("Image is required.");
      if (!validateImage(imageFile)) return;

      const formData = new FormData();
      formData.append("newCategory", inputValue);
      formData.append("image", imageFile);
      createMutation.mutate(formData);

    } else if (modalType === "edit") {
      if (!inputValue.trim()) return toast.error("Category name is required.");
      const formData = new FormData();
      formData.append("oldCategory", currentCategory.name);
      formData.append("newCategory", inputValue);
      if (imageFile) {
        if (!validateImage(imageFile)) return;
        formData.append("image", imageFile);
      }
      editMutation.mutate(formData);

    } else if (modalType === "delete") {
      if (categoryNameInput !== currentCategory?.name || deletePhraseInput !== "delete this category") {
        return toast.error("Confirmation inputs are incorrect.");
      }
      deleteMutation.mutate(currentCategory.name);
    }
  };

  return {
    isSaving: createMutation.isPending || editMutation.isPending || deleteMutation.isPending,
    categories,
    isLoading,
    isError,
    modalType,
    inputValue,
    setInputValue,
    openModal,
    closeModal,
    handleSave,
    currentCategory,
    categoryNameInput,
    deletePhraseInput,
    setCategoryNameInput,
    setDeletePhraseInput,
    imageFile,
    setImageFile,
    imagePreview, // Add imagePreview to the return
    handleImageChange // Add the handleImageChange function to the return
  };
};

export default useProductCategory;
















// // src/hooks/useProductCategories.js
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { useState } from "react";
// import axios from "axios";
// import Cookies from "js-cookie";
// import { toast } from "react-toastify";

// const token = Cookies.get("authToken");
// const backend = import.meta.env.VITE_BACKEND_URL;

// const useProductCategories = () => {
//   const queryClient = useQueryClient();

//   const [modalType, setModalType] = useState(null); // 'create' | 'edit' | 'delete'
//   const [currentCategory, setCurrentCategory] = useState(null);
//   const [inputValue, setInputValue] = useState("");
//   const [categoryNameInput, setCategoryNameInput] = useState("");
//   const [deletePhraseInput, setDeletePhraseInput] = useState("");

//   const openModal = (type, category = null) => {
//     setModalType(type);
//     setCurrentCategory(category);
//     setInputValue(type === "edit" ? category?.name : "");
//     setCategoryNameInput("");
//     setDeletePhraseInput("");
//   };

//   const closeModal = () => {
//     setModalType(null);
//     setCurrentCategory(null);
//     setInputValue("");
//     setCategoryNameInput("");
//     setDeletePhraseInput("");
//   };

//   const { data: categories = [], isLoading, isError } = useQuery({
//     queryKey: ["productCategories"],
//     queryFn: async () => {
//       const { data } = await axios.get(`${backend}/fetch-product-categories`);
//       if (data.code === "success") return data.data;
//       throw new Error(data.message || "Failed to fetch categories");
//     },
//     staleTime: 1000 * 60 * 10, // 10 minutes
//     cacheTime: 1000 * 60 * 30, // 30 minutes    
//     refetchOnWindowFocus: false,
//   });

//   const createMutation = useMutation({
//     mutationFn: async (newCategory) => {
//       const res = await axios.post(`${backend}/admin/create-product-category`, { newCategory }, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       if (res.data.code !== "success") throw new Error(res.data.message);
//       return res.data.data;
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries(["productCategories"]);
//       toast.success("Category created!");
//       closeModal();
//     },
//     onError: (err) => toast.error(err.message),
//   });

//   const editMutation = useMutation({
//     mutationFn: async ({ oldCategory, newCategory }) => {
//       const res = await axios.post(`${backend}/admin/edit-product-category`, { oldCategory, newCategory }, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       if (res.data.code !== "success") throw new Error(res.data.message);
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries(["productCategories"]);
//       toast.success("Category updated!");
//       closeModal();
//     },
//     onError: (err) => toast.error(err.message),
//   });

//   const deleteMutation = useMutation({
//     mutationFn: async (categoryName) => {
//       const res = await axios.post(`${backend}/admin/delete-product-category`, { category: categoryName }, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       if (res.data.code !== "success") throw new Error(res.data.message);
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries(["productCategories"]);
//       toast.success("Category deleted!");
//       closeModal();
//     },
//     onError: (err) => toast.error(err.message),
//   });

//   const handleSave = () => {
//     if (modalType === "create") {
//       if (!inputValue.trim()) return toast.error("Category name cannot be empty!");
//       createMutation.mutate(inputValue);
//     } else if (modalType === "edit") {
//       editMutation.mutate({ oldCategory: currentCategory.name, newCategory: inputValue });
//     } else if (modalType === "delete") {
//       if (categoryNameInput !== currentCategory?.name || deletePhraseInput !== "delete this category") {
//         return toast.error("Confirmation inputs are incorrect.");
//       }
//       deleteMutation.mutate(currentCategory.name);
//     }
//   };

//   return {
//     categories,
//     isLoading,
//     isError,
//     modalType,
//     inputValue,
//     setInputValue,
//     openModal,
//     closeModal,
//     handleSave,
//     currentCategory,
//     categoryNameInput,
//     deletePhraseInput,
//     setCategoryNameInput,
//     setDeletePhraseInput,
//   };
// };

// export default useProductCategories;























// // src/hooks/useProductCategories.js
// import { useQuery } from "@tanstack/react-query";
// import axios from "axios";
// import { toast } from "react-toastify";

// const fetchCategories = async () => {
//   try {
//     const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/fetch-product-categories`);

//     if (data.code === "error") {
//       toast.error(`Error fetching categories: ${data.message}`);
//       throw new Error(data.message);
//     }

//     if (data.code === "success") {
//       return data.data.map(({ id, name, image }) => ({
//         value: id,
//         label: name,
//         image,
//       }));
//     }

//     throw new Error("Unexpected response format");
//   } catch (error) {
//     toast.error(`Failed to load categories: ${error.message}`);
//     throw error;
//   }
// };

// const useProductCategories = () => {
//   return useQuery({
//     queryKey: ["productCategories"],
//     queryFn: fetchCategories,
//     staleTime: 1000 * 60 * 5, // 5 mins
//     cacheTime: 1000 * 60 * 10, // 10 mins
//     refetchOnWindowFocus: false,
//     retry: 1, // Retry once on failure
//   });
// };

// export default useProductCategories;



