
import Logo from "../../Logo/Logo";
import "./adminHeader.css";
import { useState, useEffect } from "react";

const AdminHeader = ({ shownav, setShownav }) => {
    const [date, setDate] = useState(null)
    const dateFunction = () => {
        const today = new Date();
        const dd = today.getDate()
        const mm = today.toLocaleString('en-US', { month: 'short' });
        const yyyy = today.getFullYear();
        const date = dd + ' ' + mm + ' ' + yyyy;
        return setDate(date)
    }
    useEffect(()=> {
        dateFunction()
    }, [])
    return (
        <div>
            <div className="admin-header-container">
                <div className="d-flex align-items-center" style={{ gap: "20px" }}>
                    <i className="fa-solid fa-bars admin-menubar" style={{ fontSize: "25px" }} onClick={() => setShownav(true)}></i>
                    <Logo />
                </div>
                
                <div className="admin-logo-container d-none d-md-block">
                    <div className="admin-icon-container" style={{ fontFamily: "Courier New, Courier, monospace" }}> 
                        Today: {date} <i className="fa-regular fa-calendar"></i>
                    </div>
                    {/* <div className="admin-icon-container">
                        <span className="d-none d-md-block">Settings</span> <i className="fa-solid fa-gear"></i>
                    </div>
                    <div className="admin-icon-container">
                        <span className="d-none d-md-block">Notifications</span> <i className="fa-regular fa-bell"></i>
                    </div> */}
                </div>
            </div>
        </div>
    );
}

export default AdminHeader;
































// import Logo from "../../Logo/Logo"
// import "./adminHeader.css"
// import { useState } from "react"
// const AdminHeader = () => {
//     const [shownav, setShownav] = useState(false)
//     return <div>
//         <div className="admin-header-container">
//         <div className="d-flex align-items-center" style={{gap: "20px"}}>
//             <i class="fa-solid fa-bars admin-menubar" style={{fontSize: "25px"}} onClick={()=> setShownav(true)}></i>
//             <Logo  />
//         </div>
        
//         <div className="admin-logo-container">
//             <div className="admin-icon-container d-none d-md-block" style={{fontFamily: "Courier New, Courier, monospace"}}>
//                 Today: mar 23 <i class="fa-regular fa-calendar"></i>
//             </div>
//             <div className="admin-icon-container">
//                 <span className="d-none d-md-block">Settings</span> <i class="fa-solid fa-gear"></i>
//             </div>
//             <div className="admin-icon-container">
//             <span className="d-none d-md-block">Notifications</span> <i class="fa-regular fa-bell"></i>
//             </div>
//         </div>
//         </div>

//     </div>
// }
// export default AdminHeader

