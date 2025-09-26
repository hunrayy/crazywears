// hooks/useUserManagement.js
import { useState } from "react"
import axios from "axios"
import Cookies from "js-cookie"
import { toast } from "react-toastify"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useAuth } from "../../AuthContext/AuthContext"


const getToken = () => Cookies.get("authToken")

export const useUserManagement = (type) => {
    const use_auth = useAuth()
    const [upgradeUserToAdmin, setUpgradeUserToAdmin] = useState(null)
    const [firstName, setFirstName] = useState("")
    const [email, setEmail] = useState("")
    const [confirmationText, setConfirmationText] = useState("")
    const [turnAdminToUserModal, setTurnAdminToUserModal] = useState(null)
    const [singleUser, setSingleUser] = useState(null)
    const [selectedRoleId, setSelectedRoleId] = useState(null)
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(20);
    const [paginationMeta, setPaginationMeta] = useState({
        total: 0,
        current_page: 1,
        per_page: perPage
    });


    const queryClient = useQueryClient()

    // const fetchUsers = async () => {
    //     const token = getToken()
    //     const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/admin/get-all-users`, {
    //         headers: { Authorization: `Bearer ${token}` },
    //         params: { 
    //             type,
    //             perPage: perPage,
    //             page: currentPage,
    //         }
    //     })
    //     console.log(response)
    //     return response.data
    // }

    // const {
    //     data,
    //     isLoading: allUsersLoading,
    //     error,
    // } = useQuery({
    // queryKey: ["users", type],
    // queryFn: fetchUsers,
    // })



    const {
        data,
        isLoading: allUsersLoading,
        error,
        } = useQuery({
        queryKey: ["users", type, currentPage, perPage], // include page + perPage
        queryFn: async () => {
            const token = getToken();
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/admin/get-all-users`, {
            headers: { Authorization: `Bearer ${token}` },
            params: {
                type,
                perPage,
                page: currentPage,
            }
            });
            console.log(response)
            const serverMeta = response.data?.data || {};

            setPaginationMeta({
            total: serverMeta.total || 0,
            current_page: serverMeta.current_page || 1,
            per_page: serverMeta.per_page || 20
            });

            return response.data;
        },
    });

      

    const upgradeMutation = useMutation({
        mutationFn: async () => {
            const token = getToken()
            return await axios.post(`${import.meta.env.VITE_BACKEND_URL}/admin/turn-user-to-admin`, {
                userId: upgradeUserToAdmin.id
            }, {
                headers: { Authorization: `Bearer ${token}` }
            })
        },
        onSuccess: () => {
            toast.success("User successfully upgraded to admin")
            queryClient.invalidateQueries(["users", type])
            setUpgradeUserToAdmin(null)
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Error upgrading user")
        },
    })

    const demoteMutation = useMutation({
        mutationFn: async (adminId) => {
            const token = getToken()
            return await axios.post(`${import.meta.env.VITE_BACKEND_URL}/admin/turn-admin-to-user`, {
                adminId
            }, {
                headers: { Authorization: `Bearer ${token}` }
            })
        },
        onSuccess: () => {
            toast.success("Admin successfully downgraded to user")
            queryClient.invalidateQueries(["users", type])
            setTurnAdminToUserModal(null)
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Error downgrading admin")
        }
    })

    const assignRoleMutation = useMutation({
        mutationFn: async ({ adminId, roleId }) => {
            const token = getToken()
            return await axios.post(`${import.meta.env.VITE_BACKEND_URL}/admin/assign-role`, {
                adminId,
                roleId
            }, {
                headers: { Authorization: `Bearer ${token}` }
            })
        },
        onSuccess: () => {
            toast.success("Role assigned successfully")
            queryClient.invalidateQueries(["users", type])
            setSingleUser(null)
            setSelectedRoleId(null)
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Error assigning role")
        }
    })

    const validateForm = () => {
        if (firstName.trim() !== upgradeUserToAdmin.firstname) {
            toast.error(`First name must be "${upgradeUserToAdmin.firstname}"`)
            return false
        }
        if (email.trim() !== upgradeUserToAdmin.email) {
            toast.error(`Email must be "${upgradeUserToAdmin.email}"`)
            return false
        }
        if (confirmationText.trim() !== "turn to admin") {
            toast.error('Please type "turn to admin" to confirm')
            return false
        }
        return true
    }
    const formattedDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString();
    }

    return {
        allUsers: data?.data?.data || [],
        adminRoles: data?.adminRoles || [],
        paginationMeta,
        currentPage,
        setCurrentPage,
        perPage,
        setPerPage,
        allUsersLoading,
        serverError: error,
        upgradeUserToAdmin,
        setUpgradeUserToAdmin,
        handleUpgrade: () => {
            if (validateForm()) {
                upgradeMutation.mutate()
            }
        },
        upgradingUser: upgradeMutation.isLoading,
        firstName,
        setFirstName,
        email,
        setEmail,
        confirmationText,
        setConfirmationText,
        turnAdminToUserModal,
        setTurnAdminToUserModal,
        confirmTurnToUser: (id) => demoteMutation.mutate(id),
        demotingAdmin: demoteMutation.isLoading,
        handleRoleSelect: (roleId) => {
            if (singleUser) {
                assignRoleMutation.mutate({ adminId: singleUser.id, roleId })
            }
        },
        singleUser,
        setSingleUser,
        formattedDate,
        selectedRoleId,
        setSelectedRoleId,
        isAssigningRole: assignRoleMutation.isLoading,
        use_auth,
    }
}
