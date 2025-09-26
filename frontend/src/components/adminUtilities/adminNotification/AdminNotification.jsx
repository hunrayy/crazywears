// AdminNotifications.js
import React, { useState, useEffect } from 'react';
import { useNotification } from '../../all_context/NotificationContext';
import './adminNotification.css'; // Optional: Add your CSS file
import axios from 'axios';
import Cookies from 'js-cookie';
import BasicLoader from "../../loader/BasicLoader"

const AdminNotification = () => {
  const [loading, setLoading] = useState(false)
  const { badgeCount, setBadgeCount, clearNotifications } = useNotification();
  const [notifications, setNotifications] = useState([])
  const [noNotification, setNoNotification] = useState(false)

  const getAllNotifications = async () => {
    const authToken = Cookies.get("authToken");

    // Set up a timeout to show loader only after a delay
    const loadingTimeout = setTimeout(() => {
      setLoading(true);
    }, 500); // 500ms delay

    try {
      const feedback = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/get-all-admin-notifications`, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      console.log(feedback)

      // Clear the timeout as the response was received in time
      clearTimeout(loadingTimeout);

      // Handle the notifications response
      if (feedback.data.data.length > 0) {
        setNotifications(feedback.data.data);
      } else {
        setNoNotification(true);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      // Ensure the loader doesn't appear if the response was quick
      setLoading(false);
    }
  };
  useEffect(()=> {
    setBadgeCount(0)
    getAllNotifications()
  }, [])

  return (
    <div className="admin-notification-page-container">
       <div class="box-title border-bottom p-3 mb-3">
       <h6 class="m-0">All notifications </h6>
      </div>
      {loading && <div><BasicLoader /></div>}
      
      {notifications?.length > 0 && notifications.map((notification) => {
        console.log(notification)
        return <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px"}}>
          <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px"}}>
            <div><img style={{borderRadius: "50%", width: "50px", height: "50px"}} src="data:image/jpeg;base64,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" alt="user profile picture" /></div>
            <div className='d-block gap-2 d-md-flex justify-center align-items-center'>
              <div style={{display: "flex", justifyContent: "space-betwee", alignItems: "center", flexWrap: "wrap", gap: "10px"}}>
              <div>{notification.notification.message}</div>
                <div>{notification.notification.time} | {notification.notification.date}</div>
              </div>
            </div>
          </div>
          <div style={{display: "flex", justifyContent: "right"}}><button className='btn btn-sm bg-danger'>Delete</button></div>
        </div>
      })}
      {noNotification && <div className="no-notification-container">
      <div className="no-notification-icon">
      <i class="fa-regular fa-bell-slash"></i>
      </div>
      <h2>No Notifications Yet</h2>
      <p>You're all caught up! Check back later for updates.</p>
  </div>}
    </div>
  );
};

export default AdminNotification;










































// import "./adminNotification.css"
// const AdminNotification = () => {
//     return <div>
//         <div class="admin-notifiction-page-container">
//     <div class="">
//         <div class="">
//             <div class="box shadow-sm rounded bg-white mb-3">
//                 <div class="box-title border-bottom p-3">
//                     <h6 class="m-0">Recent</h6>
//                 </div>
//                 <div class="box-body p-0">
//                     <div class="p-3 d-flex align-items-center bg-light border-bottom osahan-post-header">
//                         <div class="dropdown-list-image mr-3">
//                             <img class="rounded-circle" src="https://bootdey.com/img/Content/avatar/avatar3.png" alt="" />
//                         </div>
//                         <div class="font-weight-bold mr-3">
//                             <div class="text-truncate">DAILY RUNDOWN: WEDNESDAY</div>
//                             <div class="small">Income tax sops on the cards, The bias in VC funding, and other top news for you</div>
//                         </div>
//                         <span class="ml-auto mb-auto">
//                             <div class="btn-group">
//                                 <button type="button" class="btn btn-light btn-sm rounded" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
//                                     <i class="mdi mdi-dots-vertical"></i>
//                                 </button>
//                                 <div class="dropdown-menu dropdown-menu-right">
//                                     <button class="dropdown-item" type="button"><i class="mdi mdi-delete"></i> Delete</button>
//                                     <button class="dropdown-item" type="button"><i class="mdi mdi-close"></i> Turn Off</button>
//                                 </div>
//                             </div>
//                             <br />
//                             <div class="text-right text-muted pt-1">3d</div>
//                         </span>
//                     </div>
//                     <div class="p-3 d-flex align-items-center osahan-post-header">
//                         <div class="dropdown-list-image mr-3">
//                             <img class="rounded-circle" src="https://bootdey.com/img/Content/avatar/avatar1.png" alt="" />
//                         </div>
//                         <div class="font-weight-bold mr-3">
//                             <div class="mb-2">We found a job at askbootstrap Ltd that you may be interested in Vivamus imperdiet venenatis est...</div>
//                             <button type="button" class="btn btn-outline-success btn-sm">View Jobs</button>
//                         </div>
//                         <span class="ml-auto mb-auto">
//                             <div class="btn-group">
//                                 <button type="button" class="btn btn-light btn-sm rounded" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
//                                     <i class="mdi mdi-dots-vertical"></i>
//                                 </button>
//                                 <div class="dropdown-menu dropdown-menu-right">
//                                     <button class="dropdown-item" type="button"><i class="mdi mdi-delete"></i> Delete</button>
//                                     <button class="dropdown-item" type="button"><i class="mdi mdi-close"></i> Turn Off</button>
//                                 </div>
//                             </div>
//                             <br />
//                             <div class="text-right text-muted pt-1">4d</div>
//                         </span>
//                     </div>
//                 </div>
//             </div>
//             <div class="box shadow-sm rounded bg-white mb-3">
//                 <div class="box-title border-bottom p-3">
//                     <h6 class="m-0">Earlier</h6>
//                 </div>
//                 <div class="box-body p-0">
//                     <div class="p-3 d-flex align-items-center border-bottom osahan-post-header">
//                         <div class="dropdown-list-image mr-3 d-flex align-items-center bg-danger justify-content-center rounded-circle text-white">DRM</div>
//                         <div class="font-weight-bold mr-3">
//                             <div class="text-truncate">DAILY RUNDOWN: MONDAY</div>
//                             <div class="small">Nunc purus metus, aliquam vitae venenatis sit amet, porta non est.</div>
//                         </div>
//                         <span class="ml-auto mb-auto">
//                             <div class="btn-group">
//                                 <button type="button" class="btn btn-light btn-sm rounded" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
//                                     <i class="mdi mdi-dots-vertical"></i>
//                                 </button>
//                                 <div class="dropdown-menu dropdown-menu-right">
//                                     <button class="dropdown-item" type="button"><i class="mdi mdi-delete"></i> Delete</button>
//                                     <button class="dropdown-item" type="button"><i class="mdi mdi-close"></i> Turn Off</button>
//                                 </div>
//                             </div>
//                             <br />
//                             <div class="text-right text-muted pt-1">3d</div>
//                         </span>
//                     </div>
//                     <div class="p-3 d-flex align-items-center border-bottom osahan-post-header">
//                         <div class="dropdown-list-image mr-3"><img class="rounded-circle" src="https://bootdey.com/img/Content/avatar/avatar3.png" alt="" /></div>
//                         <div class="font-weight-bold mr-3">
//                             <div class="text-truncate">DAILY RUNDOWN: SATURDAY</div>
//                             <div class="small">Pellentesque semper ex diam, at tristique ipsum varius sed. Pellentesque non metus ullamcorper</div>
//                         </div>
//                         <span class="ml-auto mb-auto">
//                             <div class="btn-group">
//                                 <button type="button" class="btn btn-light btn-sm rounded" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
//                                     <i class="mdi mdi-dots-vertical"></i>
//                                 </button>
//                                 <div class="dropdown-menu dropdown-menu-right">
//                                     <button class="dropdown-item" type="button"><i class="mdi mdi-delete"></i> Delete</button>
//                                     <button class="dropdown-item" type="button"><i class="mdi mdi-close"></i> Turn Off</button>
//                                 </div>
//                             </div>
//                             <br />
//                             <div class="text-right text-muted pt-1">3d</div>
//                         </span>
//                     </div>
//                     <div class="p-3 d-flex align-items-center border-bottom osahan-post-header">
//                         <div class="dropdown-list-image mr-3">
//                             <img class="rounded-circle" src="https://bootdey.com/img/Content/avatar/avatar2.png" alt="" />
//                         </div>
//                         <div class="font-weight-bold mr-3">
//                             <div class="mb-2"><span class="font-weight-normal">Congratulate Gurdeep Singh Osahan (iamgurdeeposahan)</span> for 5 years at Askbootsrap Pvt.</div>
//                             <button type="button" class="btn btn-outline-success btn-sm">Say congrats</button>
//                         </div>
//                         <span class="ml-auto mb-auto">
//                             <div class="btn-group">
//                                 <button type="button" class="btn btn-light btn-sm rounded" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
//                                     <i class="mdi mdi-dots-vertical"></i>
//                                 </button>
//                                 <div class="dropdown-menu dropdown-menu-right">
//                                     <button class="dropdown-item" type="button"><i class="mdi mdi-delete"></i> Delete</button>
//                                     <button class="dropdown-item" type="button"><i class="mdi mdi-close"></i> Turn Off</button>
//                                 </div>
//                             </div>
//                             <br />
//                             <div class="text-right text-muted pt-1">4d</div>
//                         </span>
//                     </div>
//                     <div class="p-3 d-flex align-items-center border-bottom osahan-post-header">
//                         <div class="dropdown-list-image mr-3">
//                             <img class="rounded-circle" src="https://bootdey.com/img/Content/avatar/avatar4.png" alt="" />
//                         </div>
//                         <div class="font-weight-bold mr-3">
//                             <div>
//                                 <span class="font-weight-normal">Congratulate Mnadeep singh (iamgurdeeposahan)</span> for 4 years at Askbootsrap Pvt.
//                                 <div class="small text-success"><i class="fa fa-check-circle"></i> You sent Mandeep a message</div>
//                             </div>
//                         </div>
//                         <span class="ml-auto mb-auto">
//                             <div class="btn-group">
//                                 <button type="button" class="btn btn-light btn-sm rounded" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
//                                     <i class="mdi mdi-dots-vertical"></i>
//                                 </button>
//                                 <div class="dropdown-menu dropdown-menu-right">
//                                     <button class="dropdown-item" type="button"><i class="mdi mdi-delete"></i> Delete</button>
//                                     <button class="dropdown-item" type="button"><i class="mdi mdi-close"></i> Turn Off</button>
//                                 </div>
//                             </div>
//                             <br />
//                             <div class="text-right text-muted pt-1">4d</div>
//                         </span>
//                     </div>
//                     <div class="p-3 d-flex align-items-center border-bottom osahan-post-header">
//                         <div class="dropdown-list-image mr-3 d-flex align-items-center bg-success justify-content-center rounded-circle text-white">M</div>
//                         <div class="font-weight-bold mr-3">
//                             <div class="text-truncate">DAILY RUNDOWN: MONDAY</div>
//                             <div class="small">Nunc purus metus, aliquam vitae venenatis sit amet, porta non est.</div>
//                         </div>
//                         <span class="ml-auto mb-auto">
//                             <div class="btn-group">
//                                 <button type="button" class="btn btn-light btn-sm rounded" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
//                                     <i class="mdi mdi-dots-vertical"></i>
//                                 </button>
//                                 <div class="dropdown-menu dropdown-menu-right">
//                                     <button class="dropdown-item" type="button"><i class="mdi mdi-delete"></i> Delete</button>
//                                     <button class="dropdown-item" type="button"><i class="mdi mdi-close"></i> Turn Off</button>
//                                 </div>
//                             </div>
//                             <br />
//                             <div class="text-right text-muted pt-1">3d</div>
//                         </span>
//                     </div>
//                     <div class="p-3 d-flex align-items-center border-bottom osahan-post-header">
//                         <div class="dropdown-list-image mr-3"><img class="rounded-circle" src="https://bootdey.com/img/Content/avatar/avatar3.png" alt="" /></div>
//                         <div class="font-weight-bold mr-3">
//                             <div class="text-truncate">DAILY RUNDOWN: SATURDAY</div>
//                             <div class="small">Pellentesque semper ex diam, at tristique ipsum varius sed. Pellentesque non metus ullamcorper</div>
//                         </div>
//                         <span class="ml-auto mb-auto">
//                             <div class="btn-group">
//                                 <button type="button" class="btn btn-light btn-sm rounded" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
//                                     <i class="mdi mdi-dots-vertical"></i>
//                                 </button>
//                                 <div class="dropdown-menu dropdown-menu-right">
//                                     <button class="dropdown-item" type="button"><i class="mdi mdi-delete"></i> Delete</button>
//                                     <button class="dropdown-item" type="button"><i class="mdi mdi-close"></i> Turn Off</button>
//                                 </div>
//                             </div>
//                             <br />
//                             <div class="text-right text-muted pt-1">3d</div>
//                         </span>
//                     </div>
//                     <div class="p-3 d-flex align-items-center border-bottom osahan-post-header">
//                         <div class="dropdown-list-image mr-3">
//                             <img class="rounded-circle" src="https://bootdey.com/img/Content/avatar/avatar1.png" alt="" />
//                         </div>
//                         <div class="font-weight-bold mr-3">
//                             <div class="mb-2"><span class="font-weight-normal">Congratulate Gurdeep Singh Osahan (iamgurdeeposahan)</span> for 5 years at Askbootsrap Pvt.</div>
//                             <button type="button" class="btn btn-outline-success btn-sm">Say congrats</button>
//                         </div>
//                         <span class="ml-auto mb-auto">
//                             <div class="btn-group">
//                                 <button type="button" class="btn btn-light btn-sm rounded" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
//                                     <i class="mdi mdi-dots-vertical"></i>
//                                 </button>
//                                 <div class="dropdown-menu dropdown-menu-right">
//                                     <button class="dropdown-item" type="button"><i class="mdi mdi-delete"></i> Delete</button>
//                                     <button class="dropdown-item" type="button"><i class="mdi mdi-close"></i> Turn Off</button>
//                                 </div>
//                             </div>
//                             <br />
//                             <div class="text-right text-muted pt-1">4d</div>
//                         </span>
//                     </div>
//                     <div class="p-3 d-flex align-items-center osahan-post-header">
//                         <div class="dropdown-list-image mr-3">
//                             <img class="rounded-circle" src="https://bootdey.com/img/Content/avatar/avatar2.png" alt="" />
//                         </div>
//                         <div class="font-weight-bold mr-3">
//                             <div>
//                                 <span class="font-weight-normal">Congratulate Mnadeep singh (iamgurdeeposahan)</span> for 4 years at Askbootsrap Pvt.
//                                 <div class="small text-success"><i class="fa fa-check-circle"></i> You sent Mandeep a message</div>
//                             </div>
//                         </div>
//                         <span class="ml-auto mb-auto">
//                             <div class="btn-group">
//                                 <button type="button" class="btn btn-light btn-sm rounded" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
//                                     <i class="mdi mdi-dots-vertical"></i>
//                                 </button>
//                                 <div class="dropdown-menu dropdown-menu-right">
//                                     <button class="dropdown-item" type="button"><i class="mdi mdi-delete"></i> Delete</button>
//                                     <button class="dropdown-item" type="button"><i class="mdi mdi-close"></i> Turn Off</button>
//                                 </div>
//                             </div>
//                             <br />
//                             <div class="text-right text-muted pt-1">4d</div>
//                         </span>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     </div>
// </div>

//     </div>
// }
// export default AdminNotification