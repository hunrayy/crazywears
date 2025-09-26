import React from 'react';
import CustomDropdown from '../../customDropdown/CustomDropdown'
import { useUserManagement } from './useUserManagement';
import PaginationButtons from '../../paginationButtons/PaginationButtons';
const ViewUsers = ({ type }) => {
    const { 
        allUsers,
        use_auth,
        paginationMeta,
        currentPage,
        perPage,
        setCurrentPage,
        setPerPage,
        upgradeUserToAdmin,
        setUpgradeUserToAdmin,
        setSingleUser,
        singleUser,
        adminRoles,
        handleRoleSelect,
        isAssigningRole,
        turnAdminToUserModal,
        setTurnAdminToUserModal,
        demotingAdmin,
        confirmTurnToUser,
        firstName,
        setFirstName,
        email,
        setEmail,
        confirmationText,
        setConfirmationText,
        upgradingUser,
        handleUpgrade,
        formattedDate,
    } = useUserManagement(type);
    const showPaginationButtons = true
    return (
        <div>
            <div className="bread-crumb">
                {/* <div>Showing 1 - {allUsers.length} of {allUsers.length} {type === 'admins' ? 'Admins' : 'Users'}</div> */}
                <div>
                    Showing {(paginationMeta.current_page - 1) * paginationMeta.per_page + 1}
                    <span> – </span>
                    {Math.min(paginationMeta.current_page * paginationMeta.per_page, paginationMeta.total)} of {paginationMeta.total} {type === 'admins' ? 'Admins' : 'Users'}
                    </div>

            </div>

            {allUsers && allUsers.map((each_user, index) => (
                <div key={index} className="admin-view-all-users-container m-3" style={{ display: "flex", alignItems: "center", background: "#f4f4f4", gap: "10px", padding: "10px", borderRadius: "10px", position: "relative" }}>
                    {type === 'admins' ? (
                        <div style={{ padding: "15px" }}>
                            {each_user.admin.is_super_admin === 1 &&
                                <i className="fa-solid fa-crown" title="Super Admin" style={{ fontSize: "20px", position: "absolute", top: "0", right: "20px", background: "linear-gradient(135deg, #8e2de2, #4a00e0)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", display: "inline-block" }}></i>
                            }
                            <i className="fa-solid fa-user-shield" style={{ fontSize: "30px", background: "linear-gradient(135deg, #8e2de2, #4a00e0)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", display: "inline-block" }}></i>
                        </div>
                    ) : (
                        <div style={{ backgroundColor: "white", borderRadius: "50%", padding: "15px" }}>
                            <i className="fa-regular fa-user" style={{ fontSize: "30px" }}></i>
                        </div>
                    )}

                    <div style={{ display: "flex", flexWrap: "wrap", flexDirection: "column", gap: "5%", width: "100%" }} className="flex-md-row align-items-lg-center align-items-start">
                        <strong style={{ fontSize: "1.3em" }}>{each_user.firstname} {each_user.lastname}</strong>
                        <div><small>{each_user.email}</small></div>
                        <div>
                            {type === "admins" && each_user.admin.is_super_admin !== 1 &&
                                <small>
                                    <strong>{type === 'admins' ? 'Made an admin at: ' : 'Registered at: '}</strong>
                                    {formattedDate(type === 'admins' ? each_user.admin.updated_at : each_user.created_at)}
                                </small>
                            }
                        </div>
                    </div>

                    {type !== 'admins' &&
                        <button className="btn btn-dark btn-sm" style={{ fontSize: "0.65rem", fontWeight: "bold" }} onClick={() => setUpgradeUserToAdmin(each_user)}>
                            Turn to Admin
                        </button>
                    }

                    {type === 'admins' && use_auth.user.user.is_super_admin === 1 &&
                        <button className="btn btn-sm" style={{ background: "linear-gradient(135deg, #8e2de2, #4a00e0)", color: "white" }} onClick={() => setSingleUser(each_user)}>
                            <strong>Priviledges</strong>
                        </button>
                    }
                </div>
            ))}
            {showPaginationButtons && paginationMeta.total > paginationMeta.per_page &&  <PaginationButtons currentPage={currentPage} setCurrentPage={setCurrentPage} perPage={perPage} metaData={paginationMeta} />}
            {/* <PaginationButtons currentPage={currentPage} setCurrentPage={setCurrentPage} perPage={perPage} metaData={paginationMeta} /> */}


{singleUser && (
            <div className="modal" style={{ display: "block", position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center" }} onClick={()=> setSingleUser(null)}>
                <div className="modal-content" style={{ padding: "20px", backgroundColor: "white", borderRadius: "8px", width: "500px", position: "relative", margin: "15px" }} onClick={(e)=> e.stopPropagation()}>
                    <div style={{display: "flex", alignItems: "center", background: "#f4f4f4", gap: "10px", padding: "10px", borderRadius: "10px"}}>
                        <span className="close" onClick={()=> setSingleUser(null)} style={{ position: "absolute", top: "5px", right: "20px", fontSize: "30px", cursor: "pointer", fontWeight: "bold"}}>&times;</span>
                        <div style={{padding: "15px"}}>
                            <i className="fa-solid fa-user-shield" style={{fontSize: "30px", background: "linear-gradient(135deg, #8e2de2, #4a00e0)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", display: "inline-block"}}></i>
                        </div>
                        <div style={{display: "flex", flexWrap: "wrap", flexDirection: "column", gap: "5%", width: "100%"}} >
                            <strong style={{fontSize: "1.3em"}}>{singleUser.firstname} {singleUser.lastname}</strong> 
                            <small>{singleUser.email}</small>
                        </div>
                    </div>
                    <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", margin: "10px 0 10px 0"}}>
                        <strong className="">Roles</strong>
                        {!singleUser.admin.is_super_admin && singleUser.admin.is_super_admin !== 1 &&
                            (isAssigningRole ? 
                                <div className="spinner-border" role="status" style={{width: "20px", height: "20px", borderWidth: "2px"}}></div>
                                :
                                <CustomDropdown
                                    title="Add Roles"
                                    // options={adminRoles.map((role)=> (role.name.replace(/-/g, ' ')))}
                                    options={adminRoles && adminRoles.map((role) => ({
                                        id: role.id,
                                        label: role.name.replace(/-/g, ' ')
                                      }))}
                                    onRoleSelect={handleRoleSelect}
                                />

                            )

                        }    
                    </div>
                    {singleUser && singleUser.admin && singleUser.admin.is_super_admin === 1 ? 
                    (<div style={{
                        background: "#d1ecf1",
                        color: "#0c5460",
                        padding: "20px",
                        borderRadius: "10px",
                        border: "1px solid #bee5eb",
                        display: "flex",
                        // alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "bold",
                        fontSize: "1.1rem",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                        gap: "10px",
                        marginTop: "15px"
                    }}>
                        <div>

                        <i className="fa-solid fa-shield-halved" style={{ color: "#0c5460", fontSize: "1.5rem" }}></i>
                        </div>

                        <p >
                            This admin is a <strong>Super Admin</strong> and can perform all roles.
                        </p>
                    </div>
                    ) :


                    (singleUser && singleUser.admin.role_names &&singleUser.admin.role_names.length > 0 ? singleUser.admin.role_names.slice().reverse().map((role, index) => {
                            return <div key={index} style={{background: "#f4f4f4", padding: "10px", borderRadius: "10px"}} className="my-1">{index + 1}. {role.replace(/-/g, ' ').toLowerCase()}</div>
                        })
                    :
                    <div style={{
                        background: "#fff3cd",
                        color: "#856404",
                        padding: "20px",
                        borderRadius: "10px",
                        border: "1px solid #ffeeba",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "bold",
                        fontSize: "1.1rem",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                        gap: "10px",
                        marginTop: "15px"
                    }}>
                        <i className="fa-solid fa-circle-info" style={{ color: "#856404", fontSize: "1.5rem" }}></i>
                        This admin currently has no roles assigned.
                    </div>
                    )}

                    {!singleUser.admin.is_super_admin && singleUser.admin.is_super_admin !== 1 &&
                        <div style={{display: "flex", justifyContent: "right", marginTop: "20px"}}>
                            <button className="btn btn-dark" onClick={()=> {setTurnAdminToUserModal(singleUser), setSingleUser(null)}}>Turn to user</button>
                        </div>
                    }
                </div>
            </div>
        )}

        {upgradeUserToAdmin && (
            <div className="modal" style={{
                    display: "block", position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center"
                }}  
                onClick={(e) => {
                    if (upgradingUser) {
                        e.stopPropagation();
                    } else {
                        setUpgradeUserToAdmin(null);
                        setFirstName('');
                        setEmail('');
                        setConfirmationText('');
                    }
                }}
            >
                <div className="modal-content" style={{
                    padding: "30px", backgroundColor: "white", borderRadius: "8px", width: "500px", position: "relative", margin: "15px"
                }} onClick={(e) => e.stopPropagation()}>
                    <span className="close" onClick={() => setUpgradeUserToAdmin(null)} style={{
                        position: "absolute", top: "5px", right: "20px", fontSize: "30px", cursor: "pointer", fontWeight: "bold"
                    }}>&times;</span>
                    <h3>Confirm User Upgrade to Admin</h3>
                    <p>
                        {/* Are you sure you want to upgrade <b>{upgradeUserToAdmin.firstname} {upgradeUserToAdmin.lastname}</b> to an admin? Once confirmed, <b>{upgradeUserToAdmin.firstname}</b> will be notified via email regarding this upgrade. */}
                        Are you sure you want to upgrade <b>{upgradeUserToAdmin.firstname} {upgradeUserToAdmin.lastname}</b> to an admin?
                    </p>
                    <div className="form-group"> 
                        <label>Enter the name <b>{upgradeUserToAdmin.firstname}</b> to continue:</label>
                        <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="form-control" required />
                     </div>
                    <div className="form-group mt-3">
                        <label>Enter the email <b>{upgradeUserToAdmin.email}</b>:</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" required />
                     </div>
                    <div className="form-group mt-3">
                        <label>Type <b>"turn to admin"</b> to confirm:</label> 
                        <input type="text" value={confirmationText} onChange={(e) => setConfirmationText(e.target.value)} className="form-control" required /> 
                    </div>
                    {upgradingUser ? <div style={{margin: "auto", marginTop: "20px"}}>
                            <div className="spinner-border" role="status"></div>
                        </div>
                        :
                        <button className="btn btn-dark " onClick={handleUpgrade} style={{width: "100%", marginTop: "20px"}} > Upgrade User </button>
                    }
                    
                </div> 
            </div>
        )} 

        {turnAdminToUserModal && <div className="modal" style={{
                display: "block", position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center"
            }}  
            onClick={(e) => {
                setTurnAdminToUserModal(null);

            }}
        >
            <div className="modal-content" style={{
                    padding: "30px", backgroundColor: "white", borderRadius: "8px", width: "500px", position: "relative", margin: "15px"
                }} onClick={(e) => e.stopPropagation()}>
                    <span className="close" onClick={() => setTurnAdminToUserModal(null)} style={{
                        position: "absolute", top: "5px", right: "20px", fontSize: "30px", cursor: "pointer", fontWeight: "bold"
                    }}>&times;</span>
                    <h4 style={{ marginBottom: "15px", color: "#333"}}>
                        Confirm Admin Demotion
                    </h4>
                    <p style={{ marginBottom: "25px", color: "#555" }}>
                        Are you sure you want to remove this user's admin privileges? This action will turn <b>{turnAdminToUserModal.firstname} {turnAdminToUserModal.lastname}</b> into a regular user and revoke all admin access.
                    </p>
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                    {demotingAdmin ? <div style={{margin: "auto", marginTop: "20px"}}>
                            <div className="spinner-border" role="status"></div>
                        </div>
                        :
                        <div>
                            <button className="btn btn-danger" onClick={() => setTurnAdminToUserModal(null)}>
                                Cancel
                            </button>
                            <button className="btn btn-dark" onClick={() => confirmTurnToUser(turnAdminToUserModal.id)} style={{marginLeft: "10px"}}>
                                Yes, Turn to User
                            </button>
                        </div>
                    }

                        </div>
                        
                    </div>

            </div>}

        </div>
    );
};

export default ViewUsers;

















// import { useUserManagement } from './useUserManagement'
// import BasicLoader from "../../loader/BasicLoader"
// import { useAuth } from "../../AuthContext/AuthContext"
// import CustomDropdown from "../../customDropdown/CustomDropdown"

// const ViewUsers = ({ type }) => {
//     const use_auth = useAuth()
//     const {
//         allUsers,
//         adminRoles,
//         allUsersLoading,
//         serverError,
//         upgradeUserToAdmin,
//         setUpgradeUserToAdmin,
//         handleUpgrade,
//         upgradingUser,
//         firstName,
//         setFirstName,
//         email,
//         setEmail,
//         confirmationText,
//         setConfirmationText,
//         turnAdminToUserModal,
//         setTurnAdminToUserModal,
//         confirmTurnToUser,
//         demotingAdmin,
//         handleRoleSelect,
//         singleUser,
//         setSingleUser,
//         selectedRoleId,
//         setSelectedRoleId,
//         isAssigningRole,
//     } = useUserManagement(type)

//     if (allUsersLoading) {
//         return (
//             <div style={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
//                 <BasicLoader />
//             </div>
//         )
//     }

//     if (serverError) {
//         return <div className="alert alert-danger">Failed to fetch users. Try again later.</div>
//     }

//     return (
//         <div>
//             <div className="bread-crumb">
//                 <div>Showing 1 - {allUsers.length} of {allUsers.length} {type === "admins" ? "Admins" : "Users"}</div>
//             </div>

//             {allUsers.map((each_user, index) => (
//                 <div key={index} className="admin-view-all-users-container m-3"
//                     style={{
//                         display: "flex",
//                         alignItems: "center",
//                         background: "#f4f4f4",
//                         gap: "10px",
//                         padding: "10px",
//                         borderRadius: "10px",
//                         position: "relative"
//                     }}>
//                     {type === "admins" && each_user.admin.is_super_admin === 1 && (
//                         <i className="fa-solid fa-star text-warning"></i>
//                     )}
//                     <div>{each_user.firstname} - {each_user.email}</div>
//                     {/* Add buttons to open modals, call setUpgradeUserToAdmin, setSingleUser, etc */}
//                 </div>
//             ))}
//         </div>
//     )
// }

// export default ViewUsers




























// import { useState, useEffect } from "react"
// import axios from "axios"
// import Cookies from "js-cookie"
// import BasicLoader from "../../loader/BasicLoader"
// import { each } from "jquery"
// import { toast } from "react-toastify" // Ensure you have react-toastify installed
// import localforage from "localforage"
// import { useAuth } from "../../AuthContext/AuthContext"
// import CustomDropdown from "../../customDropdown/CustomDropdown"

// const ViewUsers = ({type}) => {
//     const use_auth = useAuth()
//     const [allUsers, setAllUsers] = useState([])
//     const [allUsersLoading, setAllUsersLoading] = useState(true)
//     const [singleUser, setSingleUser] = useState(null)
//     const [serverError, setServerError] = useState({
//         status: false,
//         message: ""
//     })
//     const [upgradeUserToAdmin, setUpgradeUserToAdmin] = useState(null)

//     const [firstName, setFirstName] = useState("")
//     const [email, setEmail] = useState("")
//     const [confirmationText, setConfirmationText] = useState("")
//     const [upgradingUser, setUpgradingUser] = useState(false)
//     const [turnAdminToUserModal, setTurnAdminToUserModal] = useState(null)
//     const [demotingAdmin, setDemotingAdmin] = useState(false)
//     const [adminRoles, setAdminRoles] = useState(null)
//     const [selectedRoleId, setSelectedRoleId] = useState(null);
//     const [isAssigningRole, setIsAssigningRole] = useState(false)
//     const getUsers = async() => {
//         const token = Cookies.get('authToken')
//         const feedback = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/admin/get-all-users`, {
//             headers: {
//                 Authorization: `Bearer ${token}`
//             },
//             params: { type }
//         })
//         console.log(feedback)
//         setAllUsersLoading(false)
//         if((feedback).data.code == "success"){
//             feedback.data.adminRoles && setAdminRoles(feedback.data.adminRoles)
//             setAllUsers(feedback.data.data)
//         }else{
//             setServerError({
//                 status: true,
//                 message: feedback.data.message
//             })
//         }
//     }

//     const validateForm = () => {
//         if (firstName.trim() !== upgradeUserToAdmin.firstname) {
//             toast.error(`First name must be "${upgradeUserToAdmin.firstname}"`)
//             return false
//         }
//         if (email.trim() !== upgradeUserToAdmin.email) {
//             toast.error(`Email must be "${upgradeUserToAdmin.email}"`)
//             return false
//         }
//         if (confirmationText.trim() !== "turn to admin") {
//             toast.error('Please type "turn to admin" to confirm')
//             return false
//         }
//         return true
//     }

//     const handleUpgrade = async () => {
//         if (!validateForm()) return // stop the process if validation fails

//         const token = Cookies.get('authToken')
//         setUpgradingUser(true)
//         try {
//             const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/admin/turn-user-to-admin`, {
//                 userId: upgradeUserToAdmin.id // Assuming you have user ID or other necessary data
//             }, {
//                 headers: {
//                     Authorization: `Bearer ${token}`
//                 }
//             })

//             console.log(response)

//             if (response.data.code === "success") {
//                 // ✅ Remove the upgraded user from the allUsers state
//                 setAllUsers(prevUsers =>
//                     prevUsers.filter(user => user.id !== upgradeUserToAdmin.id)
//                 );
//                 setUpgradeUserToAdmin(null) // Close modal on success
//                 toast.success('User successfully upgraded to admin')
//             } else {
//                 toast.error(response.data.message)
//             }
//         } catch (error) {
//             toast.error('An error occurred, please try again later')
//         } finally{
//             setUpgradingUser(false)
//         }
//     }
//     const confirmTurnToUser = async(id) => {
//         const token = Cookies.get('authToken')
//         setDemotingAdmin(true)
//         try{
//             const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/admin/turn-admin-to-user`, {
//                 adminId: id
//             }, {
//                 headers: {
//                     Authorization: `Bearer ${token}`
//                 }
//             })
//             console.log(response)
//             if (response.data.code === "success") {
//                 // ✅ Remove the upgraded user from the allUsers state
//                 setAllUsers(prevUsers =>
//                     prevUsers.filter(user => user.id !== id)
//                 );
//                 setUpgradeUserToAdmin(null) // Close modal on success
//                 setTurnAdminToUserModal(null)
//                 toast.success('User successfully upgraded to admin')
//             } else {
//                 toast.error(response.data.message)
//             }
//         }catch(error){
//             toast.error(`An error occurred: ${error.message}`)
//         }finally{
//             setDemotingAdmin(false)
//         }
//     }

//     // Callback function to handle the selected role's id
//     const handleRoleSelect = async (id) => {
//         setSelectedRoleId(id);
//         console.log(`Selected Role ID: ${id}, Admin ID: ${singleUser.id}`);
    
//         const token = Cookies.get('authToken');

//         setIsAssigningRole(true)
//         try {
//             const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/admin/assign-role`, {
//                 adminId: singleUser.id,
//                 roleId: id
//             }, {
//                 headers: {
//                     Authorization: `Bearer ${token}`
//                 }
//             });
    
//             // console.log('Role assignment response:', response.data);
//             console.log(response)
//             if (response.data.code === "success") {
//                 toast.success('Role assigned successfully');
//                 // Optional: perform additional actions like refreshing user roles or closing modal

//                 // ✅ Update the specific user's role_id in allUsers
//                 setAllUsers(prevUsers =>
//                     prevUsers.map(user => {
//                         if (user.id === singleUser.id) {
//                             // Lookup role name from allRoles using the provided id
//                             const foundRole = adminRoles.find(role => role.id === id);
//                             const newRoleName = foundRole ? foundRole.name : null;
                
//                             return {
//                                 ...user,
//                                 admin: {
//                                     ...user.admin,
//                                     role_id: [...(user.admin?.role_id || []), id],
//                                     role_names: [...(user.admin?.role_names || []), ...(newRoleName ? [newRoleName] : [])]
//                                 }
//                             };
//                         }
//                         return user;
//                     })
//                 );                
//                 console.log(allUsers)

//                 // Optional: Reset selection or close modal
//                 setSelectedRoleId(null)
//                 setSingleUser(null)
//             } else {
//                 toast.error(response.data.message);
//             }
//         } catch (error) {
//             toast.error(`An error occurred: ${error.message}`);
//         }finally{
//             setIsAssigningRole(false)
//         }
//     };

//     const formattedDate = (dateString) => {
//         const date = new Date(dateString);
//         return date.toLocaleString();
//     }

//     useEffect(()=> {
//         console.log(type)
//         getUsers()
//         console.log(use_auth.user.user.is_super_admin)
        
//     }, [type])

//     if(allUsersLoading){
//         return <div style={{width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
//             <BasicLoader />
//         </div>
    
//     }
//     if(serverError.status){
//         return <div className="alert alert-danger">{serverError.message}</div>
//     }


    // return (
    //     <div>
    //         <div className="bread-crumb">
    //             <div>Showing 1 - {allUsers.length} of {allUsers.length} {type == 'admins' ? 'Admins' : 'Users'}</div>
    //         </div>
    //         {
    //             allUsers && allUsers.map((each_user, index) => {
    //                 return (
    //                     <div key={index} className="admin-view-all-users-container m-3" style={{display: "flex", alignItems: "center", background: "#f4f4f4", gap: "10px", padding: "10px", borderRadius: "10px", position: "relative"}}>
    //                         {type === 'admins' ? 
    //                             <div style={{padding: "15px"}}>
    //                                 {each_user.admin.is_super_admin === 1 && 
    //                                     <i className="fa-solid fa-crown" title="Super Admin" style={{fontSize: "20px", position: "absolute", top: "0", right: "20px", background: "linear-gradient(135deg, #8e2de2, #4a00e0)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", display: "inline-block"}}></i>
    //                                 }
    //                                 <i className="fa-solid fa-user-shield" style={{fontSize: "30px", background: "linear-gradient(135deg, #8e2de2, #4a00e0)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", display: "inline-block"}}></i>
    //                             </div>
    //                             :
    //                             <div style={{backgroundColor: "white", borderRadius: "50%", padding: "15px"}}><i className="fa-regular fa-user" style={{fontSize:"30px"}}></i></div>
    //                         }
    //                         <div style={{display: "flex", flexWrap: "wrap", flexDirection: "column", gap: "5%", width: "100%"}}  className="flex-md-row align-items-lg-center align-items-start">
    //                             <strong style={{fontSize: "1.3em"}}>{each_user.firstname} {each_user.lastname}</strong> 
    //                             <div><small>{each_user.email}</small></div>
    //                             <div>
    //                                 { type === "admins" && each_user.admin.is_super_admin !==  1 && <small>
    //                                     <strong>{type == 'admins' ? 'Made an admin at: ' : 'Registered at: '}</strong>
    //                                     {formattedDate((type == 'admins') ? each_user.admin.updated_at : each_user.created_at)}
    //                                 </small>}
    //                             </div>
    //                         </div>

    //                         {type !== 'admins' &&
    //                             <button className="btn btn-dark btn-sm" style={{fontSize: "0.65rem", fontWeight: "bold"}} onClick={()=> setUpgradeUserToAdmin(each_user)}>
    //                                 Turn to Admin
    //                             </button>
    //                         }

    //                         {type == 'admins' && use_auth.user.user.is_super_admin && use_auth.user.user.is_super_admin === 1 &&<button className="btn btn-sm" style={{background: "linear-gradient(135deg, #8e2de2, #4a00e0)", color: "white"}} onClick={()=> setSingleUser(each_user)}><strong>Priviledges</strong></button>}

    //                     </div>
    //                 )
    //             })
    //         }

        // {singleUser && (
        //     <div className="modal" style={{ display: "block", position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center" }} onClick={()=> setSingleUser(null)}>
        //         <div className="modal-content" style={{ padding: "20px", backgroundColor: "white", borderRadius: "8px", width: "500px", position: "relative", margin: "15px" }} onClick={(e)=> e.stopPropagation()}>
        //             <div style={{display: "flex", alignItems: "center", background: "#f4f4f4", gap: "10px", padding: "10px", borderRadius: "10px"}}>
        //                 <span className="close" onClick={()=> setSingleUser(null)} style={{ position: "absolute", top: "5px", right: "20px", fontSize: "30px", cursor: "pointer", fontWeight: "bold"}}>&times;</span>
        //                 <div style={{padding: "15px"}}>
        //                     <i className="fa-solid fa-user-shield" style={{fontSize: "30px", background: "linear-gradient(135deg, #8e2de2, #4a00e0)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", display: "inline-block"}}></i>
        //                 </div>
        //                 <div style={{display: "flex", flexWrap: "wrap", flexDirection: "column", gap: "5%", width: "100%"}} >
        //                     <strong style={{fontSize: "1.3em"}}>{singleUser.firstname} {singleUser.lastname}</strong> 
        //                     <small>{singleUser.email}</small>
        //                 </div>
        //             </div>
        //             <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", margin: "10px 0 10px 0"}}>
        //                 <strong className="">Roles</strong>
        //                 {!singleUser.admin.is_super_admin && singleUser.admin.is_super_admin !== 1 &&
        //                     (isAssigningRole ? 
        //                         <div className="spinner-border" role="status" style={{width: "20px", height: "20px", borderWidth: "2px"}}></div>
        //                         :
        //                         <CustomDropdown
        //                             title="Add Roles"
        //                             // options={adminRoles.map((role)=> (role.name.replace(/-/g, ' ')))}
        //                             options={adminRoles && adminRoles.map((role) => ({
        //                                 id: role.id,
        //                                 label: role.name.replace(/-/g, ' ')
        //                               }))}
        //                             onRoleSelect={handleRoleSelect}
        //                         />

        //                     )

        //                 }    
        //             </div>
        //             {singleUser && singleUser.admin && singleUser.admin.is_super_admin === 1 ? 
        //             (<div style={{
        //                 background: "#d1ecf1",
        //                 color: "#0c5460",
        //                 padding: "20px",
        //                 borderRadius: "10px",
        //                 border: "1px solid #bee5eb",
        //                 display: "flex",
        //                 // alignItems: "center",
        //                 justifyContent: "center",
        //                 fontWeight: "bold",
        //                 fontSize: "1.1rem",
        //                 boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
        //                 gap: "10px",
        //                 marginTop: "15px"
        //             }}>
        //                 <div>

        //                 <i className="fa-solid fa-shield-halved" style={{ color: "#0c5460", fontSize: "1.5rem" }}></i>
        //                 </div>

        //                 <p >
        //                     This admin is a <strong>Super Admin</strong> and can perform all roles.
        //                 </p>
        //             </div>
        //             ) :


        //             (singleUser && singleUser.admin.role_names &&singleUser.admin.role_names.length > 0 ? singleUser.admin.role_names.slice().reverse().map((role, index) => {
        //                     return <div key={index} style={{background: "#f4f4f4", padding: "10px", borderRadius: "10px"}} className="my-1">{index + 1}. {role.replace(/-/g, ' ').toLowerCase()}</div>
        //                 })
        //             :
        //             <div style={{
        //                 background: "#fff3cd",
        //                 color: "#856404",
        //                 padding: "20px",
        //                 borderRadius: "10px",
        //                 border: "1px solid #ffeeba",
        //                 display: "flex",
        //                 alignItems: "center",
        //                 justifyContent: "center",
        //                 fontWeight: "bold",
        //                 fontSize: "1.1rem",
        //                 boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
        //                 gap: "10px",
        //                 marginTop: "15px"
        //             }}>
        //                 <i className="fa-solid fa-circle-info" style={{ color: "#856404", fontSize: "1.5rem" }}></i>
        //                 This admin currently has no roles assigned.
        //             </div>
        //             )}

        //             {!singleUser.admin.is_super_admin && singleUser.admin.is_super_admin !== 1 &&
        //                 <div style={{display: "flex", justifyContent: "right", marginTop: "20px"}}>
        //                     <button className="btn btn-dark" onClick={()=> {setTurnAdminToUserModal(singleUser), setSingleUser(null)}}>Turn to user</button>
        //                 </div>
        //             }
        //         </div>
        //     </div>
        // )}

        // {upgradeUserToAdmin && (
        //     <div className="modal" style={{
        //             display: "block", position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center"
        //         }}  
        //         onClick={(e) => {
        //             if (upgradingUser) {
        //                 e.stopPropagation();
        //             } else {
        //                 setUpgradeUserToAdmin(null);
        //                 setFirstName('');
        //                 setEmail('');
        //                 setConfirmationText('');
        //             }
        //         }}
        //     >
        //         <div className="modal-content" style={{
        //             padding: "30px", backgroundColor: "white", borderRadius: "8px", width: "500px", position: "relative", margin: "15px"
        //         }} onClick={(e) => e.stopPropagation()}>
        //             <span className="close" onClick={() => setUpgradeUserToAdmin(null)} style={{
        //                 position: "absolute", top: "5px", right: "20px", fontSize: "30px", cursor: "pointer", fontWeight: "bold"
        //             }}>&times;</span>
        //             <h3>Confirm User Upgrade to Admin</h3>
        //             <p>
        //                 Are you sure you want to upgrade <b>{upgradeUserToAdmin.firstname} {upgradeUserToAdmin.lastname}</b> to an admin? Once confirmed, <b>{upgradeUserToAdmin.firstname}</b> will be notified via email regarding this upgrade.
        //             </p>
        //             <div className="form-group"> 
        //                 <label>Enter the name <b>{upgradeUserToAdmin.firstname}</b> to continue:</label>
        //                 <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="form-control" required />
        //              </div>
        //             <div className="form-group mt-3">
        //                 <label>Enter the email <b>{upgradeUserToAdmin.email}</b>:</label>
        //                 <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" required />
        //              </div>
        //             <div className="form-group mt-3">
        //                 <label>Type <b>"turn to admin"</b> to confirm:</label> 
        //                 <input type="text" value={confirmationText} onChange={(e) => setConfirmationText(e.target.value)} className="form-control" required /> 
        //             </div>
        //             {upgradingUser ? <div style={{margin: "auto", marginTop: "20px"}}>
        //                     <div className="spinner-border" role="status"></div>
        //                 </div>
        //                 :
        //                 <button className="btn btn-dark " onClick={handleUpgrade} style={{width: "100%", marginTop: "20px"}} > Upgrade User </button>
        //             }
                    
        //         </div> 
        //     </div>
        // )} 

        // {turnAdminToUserModal && <div className="modal" style={{
        //         display: "block", position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center"
        //     }}  
        //     onClick={(e) => {
        //         setTurnAdminToUserModal(null);

        //     }}
        // >
        //     <div className="modal-content" style={{
        //             padding: "30px", backgroundColor: "white", borderRadius: "8px", width: "500px", position: "relative", margin: "15px"
        //         }} onClick={(e) => e.stopPropagation()}>
        //             <span className="close" onClick={() => setTurnAdminToUserModal(null)} style={{
        //                 position: "absolute", top: "5px", right: "20px", fontSize: "30px", cursor: "pointer", fontWeight: "bold"
        //             }}>&times;</span>
        //             <h4 style={{ marginBottom: "15px", color: "#333"}}>
        //                 Confirm Admin Demotion
        //             </h4>
        //             <p style={{ marginBottom: "25px", color: "#555" }}>
        //                 Are you sure you want to remove this user's admin privileges? This action will turn <b>{turnAdminToUserModal.firstname} {turnAdminToUserModal.lastname}</b> into a regular user and revoke all admin access.
        //             </p>
        //             <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
        //             {demotingAdmin ? <div style={{margin: "auto", marginTop: "20px"}}>
        //                     <div className="spinner-border" role="status"></div>
        //                 </div>
        //                 :
        //                 <div>
        //                     <button className="btn btn-danger" onClick={() => setTurnAdminToUserModal(null)}>
        //                         Cancel
        //                     </button>
        //                     <button className="btn btn-dark" onClick={() => confirmTurnToUser(turnAdminToUserModal.id)} style={{marginLeft: "10px"}}>
        //                         Yes, Turn to User
        //                     </button>
        //                 </div>
        //             }

        //                 </div>
                        
        //             </div>

        //     </div>}
    //     </div> 
    // ) 
// }

// export default ViewUsers



//             <p>
//                 Are you sure you want to upgrade <b>{upgradeUserToAdmin.firstname} {upgradeUserToAdmin.lastname}</b> to an admin? Once confirmed, <b>{upgradeUserToAdmin.firstname}</b> will be notified via email regarding this upgrade.
//             </p>
//             <div>
//               <label>Enter the name <b>{upgradeUserToAdmin.firstname}</b> to continue:</label>

//               <input
//                 type="text"
//                 onChange={(e) => setFirstName(e.target.value)}
//                 className="form-control"
//               />
//             </div>
//             <div className="mt-3">
//                 <label>Enter the email <b>{upgradeUserToAdmin.email}</b>:</label>
//               <input
//                 type="email"
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="form-control"
//               />
//             </div>
//             <div className="mt-3">
//                 <label>To verify, type <b>turn to admin</b> below:</label>
//                 <input
//                     type="text"
//                     // value={confirmationText}
//                     onChange={(e) => setConfirmationText(e.target.value)}
//                     className="form-control"
//                 />
//             </div>
//             <button className="btn btn-dark mt-3">
//               Confirm Upgrade
//             </button>
//           </div>
