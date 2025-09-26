// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import axios from 'axios';
// import Cookies from 'js-cookie';
// import { toast } from 'react-toastify';
// import { useState, useEffect } from 'react';

// const fetchPolicyPage = async (pageKey) => {
//   const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/get-page`, {
//     params: { page: pageKey },
//   });
//   console.log(data)

//   if (data.code !== 'success') {
//     throw new Error(data.message || 'Unknown error');
//   }

//   return data.data;
// };

// const savePolicyPage = async ({ pageKey, content }) => {
//   const token = Cookies.get('authToken');
//   const { data } = await axios.post(
//     `${import.meta.env.VITE_BACKEND_URL}/admin/edit-page`,
//     {
//       page: pageKey,
//       section: 'fullContent',
//       content,
//     },
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     }
//   );

//   if (data.code !== 'success') {
//     throw new Error(data.message || 'Failed to save content');
//   }

//   return data;
// };

// export const usePolicies = (policyPage) => {
//   const queryClient = useQueryClient();
//   const selectedPageKey = policyPage;

//   const [policyContent, setPolicyContent] = useState('');

//   const { data, isLoading, isFetching, isSuccess } = useQuery({
//     queryKey: ['policyPage', selectedPageKey],
//     queryFn: () => fetchPolicyPage(selectedPageKey),
//     enabled: !!selectedPageKey,
//     staleTime: 1000 * 60 * 60, 
//     cacheTime: 1000 * 60 * 60 * 6,
//     onError: (err) => {
//       toast.error(err.message || 'Failed to load policy page');
//     },
//     onSuccess: (fetchedData) => {
//       // Only set data if not empty
//       if (fetchedData) {
//         setPolicyContent(fetchedData);
//       }
//     },
//   });

//   const { mutate: handleSave, isLoading: isSaving } = useMutation({
//     mutationFn: () => savePolicyPage({ pageKey: selectedPageKey, content: policyContent }),
//     onSuccess: () => {
//       toast.success(`${formatTitle(selectedPageKey)} updated successfully`);
//       queryClient.invalidateQueries(['policyPage', selectedPageKey]);
//       queryClient.refetchQueries(['policyPage', selectedPageKey]);
//     },
//     onError: (err) => {
//       toast.error(err.message || 'Failed to save content');
//     },
//   });

//   const formatTitle = (key) =>
//     key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());

//   return {
//     policyContent,
//     setPolicyContent,
//     handleSave,
//     isLoading: isLoading || isFetching,
//     isSaving,
//     selectedPageKey,
//     formatTitle,
//   };
// };






















import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

const fetchPolicyPage = async (pageKey) => {
  const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/get-page`, {
    params: { page: pageKey },
  });
  console.log(data)

  if (data.code !== 'success') {
    throw new Error(data.message || 'Unknown error');
  }

  return data.data;
};

const savePolicyPage = async ({ pageKey, content }) => {
    const token = Cookies.get('authToken');
    const { data } = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/admin/edit-page`,
      {
        page: pageKey,
        section: 'fullContent',
        content,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(data)
  
    if (data.code !== 'success') {
      throw new Error(data.message || 'Failed to save content');
    }
  
    return data; // Ensure this is returning a promise
};


export const usePolicies = (policyPage) => {
  const queryClient = useQueryClient();
  const selectedPageKey = policyPage;

  const { data, isLoading, isSuccess, isFetching } = useQuery({
    queryKey: ['policyPage', selectedPageKey],
    queryFn: () => fetchPolicyPage(selectedPageKey),
    enabled: !!selectedPageKey,
    staleTime: 1000 * 60 * 60, // 1hr
    cacheTime: 1000 * 60 * 60 * 6,
    onError: (err) => {
      toast.error(err.message || 'Failed to load policy page');
    },
  });

  const { mutate: handleSave, isLoading: isSaving } = useMutation({
    // mutationFn: () => savePolicyPage({ pageKey: selectedPageKey, content: data }),
    mutationFn: ({ newContent }) => savePolicyPage({ pageKey: selectedPageKey, content: newContent }),
    onSuccess: () => {
      toast.success(`${formatTitle(selectedPageKey)} updated successfully`);
      queryClient.invalidateQueries(['policyPage', selectedPageKey]); // Invalidate the query
      queryClient.refetchQueries(['policyPage', selectedPageKey]); // Refetch the query to get the latest data
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to save content');
    },
  });

    const formatTitle = (key) =>
    key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    

  return {
    policyContent: data || '', // Directly use the data from useQuery
    handleSave,
    isLoading: isLoading || isFetching,
    isSaving,
    selectedPageKey,
    formatTitle,
  };
};


































// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import axios from 'axios';
// import Cookies from 'js-cookie';
// import { toast } from 'react-toastify';

// const fetchPolicyPage = async (pageKey) => {
//   const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/get-page`, {
//     params: { page: pageKey },
//   });
//   console.log(data)

//   if (data.code !== 'success') {
//     throw new Error(data.message || 'Unknown error');
//   }

//   return data.data;
// };

// const savePolicyPage = async ({ pageKey, content }) => {
//     const token = Cookies.get('authToken');
//     const { data } = await axios.post(
//       `${import.meta.env.VITE_BACKEND_URL}/admin/edit-page`,
//       {
//         page: pageKey,
//         section: 'fullContent',
//         content,
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );
//     console.log(data)
  
//     if (data.code !== 'success') {
//       throw new Error(data.message || 'Failed to save content');
//     }
  
//     return data; // Ensure this is returning a promise (which it does)
//   };
//   const formatTitle = (key) =>
//     key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    

// export const usePolicies = (policyPage) => {
//   const queryClient = useQueryClient();

//   const selectedPageKey = policyPage;

//   const { data, isLoading, isSuccess, isFetching } = useQuery({
//     queryKey: ['policyPage', selectedPageKey],
//     queryFn: () => fetchPolicyPage(selectedPageKey),
//     enabled: !!selectedPageKey,
//     staleTime: 1000 * 60 * 60, // 1hr
//     cacheTime: 1000 * 60 * 60 * 6,
//     onError: (err) => {
//       toast.error(err.message || 'Failed to load policy page');
//     },
//   });

// const { mutate: handleSave, isLoading: isSaving } = useMutation({
//     mutationFn: () => savePolicyPage({ pageKey: selectedPageKey, content: data }),
//     onSuccess: () => {
//       toast.success(`${formatTitle(selectedPageKey)} updated successfully`);
//       queryClient.invalidateQueries(['policyPage', selectedPageKey]);
//     },
//     onError: (err) => {
//       toast.error(err.message || 'Failed to save content');
//     },
//   });
  

//   return {
//     policyContent: data || '', // Directly use the data from useQuery
//     setPolicyContent: (newContent) => {
//       // Only needed if you want to directly manipulate the policy content
//       // It won't be necessary unless you're implementing some editor logic
//     },
//     handleSave,
//     isLoading: isLoading || isFetching,
//     isSaving,
//     selectedPageKey,
//     formatTitle,
//   };
// };













































// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import axios from 'axios';
// import Cookies from 'js-cookie';
// import { toast } from 'react-toastify';

// const fetchPolicyPage = async (pageKey) => {
//   const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/get-page`, {
//     params: { page: pageKey },
//   });
//   console.log(data)

//   if (data.code !== 'success') {
//     throw new Error(data.message || 'Unknown error');
//   }

//   return data.data;
// };

// // const savePolicyPage = async ({ pageKey, content }) => {
// //   const token = Cookies.get('authToken');

// //   const { data } = await axios.post(
// //     `${import.meta.env.VITE_BACKEND_URL}/admin/edit-page`,
// //     {
// //       page: pageKey,
// //       section: 'fullContent',
// //       content,
// //     },
// //     {
// //       headers: {
// //         Authorization: `Bearer ${token}`,
// //       },
// //     }
// //   );

// //   if (data.code !== 'success') {
// //     throw new Error(data.message || 'Failed to save content');
// //   }

// //   return data;
// // };
// const savePolicyPage = async ({ pageKey, content }) => {
//     const token = Cookies.get('authToken');
//     const { data } = await axios.post(
//       `${import.meta.env.VITE_BACKEND_URL}/admin/edit-page`,
//       {
//         page: pageKey,
//         section: 'fullContent',
//         content,
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );
  
//     if (data.code !== 'success') {
//       throw new Error(data.message || 'Failed to save content');
//     }
  
//     return data; // Ensure this is returning a promise (which it does)
//   };
//   const formatTitle = (key) =>
//     key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    

// export const usePolicies = (policyPage) => {
//   const queryClient = useQueryClient();
//   const pageKeyMap = {
//     refund_policy: 'refundPolicy',
//     shipping_policy: 'shippingPolicy',
//     delivery_policy: 'deliveryPolicy',
//   };

//   const selectedPageKey = pageKeyMap[policyPage] || 'shippingPolicy';

//   const { data, isLoading, isSuccess, isFetching } = useQuery({
//     queryKey: ['policyPage', selectedPageKey],
//     queryFn: () => fetchPolicyPage(selectedPageKey),
//     enabled: !!selectedPageKey,
//     staleTime: 1000 * 60 * 60, // 1hr
//     cacheTime: 1000 * 60 * 60 * 6,
//     onError: (err) => {
//       toast.error(err.message || 'Failed to load policy page');
//     },
//   });

// //   const { mutate: handleSave, isLoading: isSaving } = useMutation({
// //     mutationFn: () => savePolicyPage({ pageKey: selectedPageKey, content: data }),
// //     onSuccess: () => {
// //       toast.success(`${selectedPageKey} updated successfully`);
// //       queryClient.invalidateQueries(['policyPage', selectedPageKey]);
// //     },
// //     onError: (err) => {
// //       toast.error(err.message || 'Failed to save content');
// //     },
// //   });
// const { mutate: handleSave, isLoading: isSaving } = useMutation({
//     mutationFn: () => savePolicyPage({ pageKey: selectedPageKey, content: data }),
//     onSuccess: () => {
//       toast.success(`${formatTitle(selectedPageKey)} updated successfully`);
//       queryClient.invalidateQueries(['policyPage', selectedPageKey]);
//     },
//     onError: (err) => {
//       toast.error(err.message || 'Failed to save content');
//     },
//   });
  

//   return {
//     policyContent: data || '', // Directly use the data from useQuery
//     setPolicyContent: (newContent) => {
//       // Only needed if you want to directly manipulate the policy content
//       // It won't be necessary unless you're implementing some editor logic
//     },
//     handleSave,
//     isLoading: isLoading || isFetching,
//     isSaving,
//     selectedPageKey,
//     formatTitle,
//   };
// };






























// import { useQuery } from '@tanstack/react-query'
// import axios from 'axios'
// import { toast } from 'react-toastify'

// const fetchPolicyPage = async (pageKey) => {
//     const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/get-page`, {
//         params: { page: pageKey }
//     });

//     if (data.code !== "success") {
//         throw new Error(data.message || "Unknown error");
//     }

//     return data.data; // The HTML content
// };

// export const usePolicies = (pageKey) => {
//     return useQuery({
//         queryKey: ['policyPage', pageKey],
//         queryFn: () => fetchPolicyPage(pageKey),
//         enabled: !!pageKey,
//         onError: (err) => {
//             toast.error(err.message || "Failed to load policy page");
//         },
//         staleTime: 1000 * 60 * 60,  // 1 hour
//         cacheTime: 1000 * 60 * 60 * 6,  // 6 hours

//     });
// };
