



import "./dashboard.css"
import { useAuth } from "../../AuthContext/AuthContext"
import { useState, useEffect } from "react"
import axios from "axios"
import Cookies from "js-cookie"
import AdminChart from "../adminChart/AdminChart"
import AdminEditProfile from "./AdminEditProfile"
import { useUserManagement } from "../viewUsers/useUserManagement"
const Dashboard = () => {
    const { 
        allUsers,
        singleUser,
        setSingleUser
    } = useUserManagement('admins');

    const use_auth = useAuth()
    const adminDetails = use_auth.user.user || {};

    const [profileForm, setShowProfileForm] = useState(false)
    const [products, setProducts] = useState({
        productsLength: null,
        products_loading: true
    })
    const [users, setUsers] = useState({
        allUsersLength: null,
        allUsersLoading: true
    })
    const [pendingOrders, setPendingOrders] = useState({
        pendingOrdersLength: null,
        pendingOrders_loading: true
    })

    const getAllProducts = async() =>{
        const feedback = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/get-all-products`, {
            params: {
                productCategory: 'all products'  // Conditionally adding the category if it exists
            }
        })
        console.log(feedback)
        if(feedback.data.code == "success"){
            setProducts({
                productsLength: feedback.data.data.total,
                products_loading: false
            })
        }
    }
    const getUsers = async() => {
        const token = Cookies.get('authToken')
        const feedback = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/admin/get-all-users`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        console.log(feedback)
        if((feedback).data.code == "success"){
            setUsers({
                allUsersLength: feedback.data.data.length,
                allUsersLoading: false
            })
        }
    }
    const getPendingOrders = async() =>{
        const token = Cookies.get("authToken")
        const feedback = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/admin/get-orders`, {
            params: {
                status: 'pending'
            },
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        console.log(feedback)
        if(feedback.data.code == "success"){
            setPendingOrders({
                pendingOrdersLength: feedback.data.data.data.length,
                pendingOrders_loading: false
            })
        }
    }

    const testPusher = async() => {
        const feedback = await axios.post(`${import .meta.env.VITE_BACKEND_URL}/pusher-test-route`)
        console.log(feedback)
    }

    useEffect(()=> {
        getAllProducts()
        getPendingOrders()
        getUsers()

    }, [])
    useEffect(() => {
      if (allUsers.length > 0 && adminDetails?.email) {
        const matchingAdmin = allUsers.find(user => user.email === adminDetails.email);
        if (matchingAdmin) {
          setSingleUser(matchingAdmin);
        }
        console.log(matchingAdmin)
      }
    }, [allUsers, adminDetails?.email]);
    return <div>
        <div className="dashboard-container">
            <div className="bread-crumb">
                <div style={{fontSize: "20px", fontWeight: "semi bold"}}>Admin Dashboard </div>
                <div>Home / Dashboard</div>
            </div>
            <div className="content-after-bread-crumb">
                <div style={{display: "flex", flexDirection: "column", gap: "20px"}}>
                    <p style={{ fontSize: "1.2rem", fontWeight: "600"}}>
                        Welcome back, {use_auth.user.user?.firstname} <span style={{ marginLeft: "0.3rem" }}>👋</span>
                    </p>

                    <div className="site-statistics-container">

                        <div className="site-statistics-wrapper">
                            <span className="text-muted"><b>All products</b></span>
                            {
                                // products.products_loading ? <div className="spinner-border" role="status" style={{width: "15px", height: "15px", borderWidth: "1px"}}>
                                //                                 <span className="visually-hidden">Loading...</span>
                                //                             </div>
                                // : <span style={{fontWeight: "bold"}}>{products.productsLength}</span>
                                products.products_loading ? "0"
                                : <span style={{fontWeight: "bold"}}>{products.productsLength}</span>

                            }
                        </div>
                        <div className="site-statistics-wrapper">
                            <span className="text-muted"><b>Pending orders</b></span>
                            {/* {pendingOrders.pendingOrders_loading ? <div className="spinner-border" role="status" style={{width: "15px", height: "15px", borderWidth: "1px"}}>
                                                                <span className="visually-hidden">Loading...</span>
                                                            </div>
                                : <span style={{fontWeight: "bold"}}>{pendingOrders.pendingOrdersLength}</span>
                             } */}
                             {pendingOrders.pendingOrders_loading ? "0"
                                : <span style={{fontWeight: "bold"}}>{pendingOrders.pendingOrdersLength}</span>
                             }
                        </div>
                        <div className="site-statistics-wrapper">
                            <span className="text-muted"><b>Users</b></span>
                            {/* {allUsers.allUsersLoading ? <div className="spinner-border" role="status" style={{width: "15px", height: "15px", borderWidth: "1px"}}>
                                                                <span className="visually-hidden">Loading...</span>
                                                            </div>
                                : <span style={{fontWeight: "bold"}}>{allUsers.allUsersLength}</span>
                             } */}
                             {users.allUsersLoading ? "0"
                                : <span style={{fontWeight: "bold"}}>{users.allUsersLength}</span>
                             }
                        </div>
                
                        
                    </div>



                    <AdminChart />

                   
                    
                
                </div>
                
                <div className="admin-dashboard-profile-status">
                    <img style={{width: "150px", height: "150px", borderRadius: "50%"}} src="data:image/png;base64,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" alt="" />
                    <p>{use_auth.user.user?.firstname} {use_auth.user.user?.lastname}</p>
                    <p>{use_auth.user.user?.email}</p>
                    {/* <div style={{display: "flex", alignItems: "center", gap: "2px"}}><b>Status: &nbsp;</b> Online <div style={{width: "5px", height: "5px", borderRadius: "50%", background: "green"}}></div></div> */}
                    <div style={{display: "flex", justifyContent: "left", flexDirection: "column"}}>
                        <span><b>Roles:</b></span>
                        {
                            adminDetails.is_super_admin == 1 ?
                            <div style={{
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
                            :
                            <ul>
                                {singleUser?.admin?.role_names?.map((role, index) => {
                                    return <li key={index}>{role}</li>
                                })}
                            </ul>
                        }
                    </div>
                    <div><button className="btn btn-sm mt-3" style={{background: "purple", color: "white"}} onClick={() => setShowProfileForm(true)}>Edit profile</button></div>
                </div>
                
            </div>
            
        </div>

        {profileForm && (
            <AdminEditProfile onClose={() => setShowProfileForm(false)}  />
        )}
        
    </div>
}
export default Dashboard















// Register necessary components for the chart
// ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

// const chartData = {
//   labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'],
//   datasets: [
//     {
//       // Bar dataset (e.g., volume)
//       label: 'Volume',
//       data: [65, 59, 80, 81, 56, 89, 25],
//     //   backgroundColor: 'rgba(75, 192, 192, 0.5)',
//       backgroundColor: '#f9eef1',
//          backgroundColor: 'rgba(124, 90, 179, 0.5)',

//     //   borderColor: 'rgba(75, 192, 192, 1)',
//     borderColor: 'purple',
//       borderWidth: 1,
//       type: 'bar', // Bar chart for volume
//     },
//     {
//       // Line dataset that oscillates around the top of the bars
//       label: 'Requests/Day',
//       data: [65, 59, 80, 81, 56, 89, 25], // Set the line data to match bar heights (top of bars)
//       fill: false, // Don't fill the area under the line
//       borderColor: 'rgba(153, 102, 255, 1)', // Line color
//       tension: 0.1, // Line smoothness
//       type: 'line', // Line chart for movement
//       pointBackgroundColor: 'rgba(255, 99, 132, 1)', // Color of the line points (optional)
//       pointRadius: 5, // Size of the points on the line
//     },
//   ],
// };

// const options = {
//   responsive: true,
//   maintainAspectRatio: false,
//   plugins: {
//     legend: {
//       position: 'top',
//     },
//     tooltip: {
//       mode: 'index',
//       intersect: false,
//     },
//   },
//   scales: {
//     x: {
//       stacked: false, // Stacking for bars (set to false so bars and lines don't overlap)
//     },
//     y: {
//       stacked: false, // Same for y scale
//       beginAtZero: true, // Start the y-axis from zero
//     },
//   },
// };