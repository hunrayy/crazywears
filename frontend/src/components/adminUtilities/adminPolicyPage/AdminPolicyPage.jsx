






















import React from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import BasicLoader from '../../loader/BasicLoader';
import { usePolicies } from '../../../pages/policies/usePolicies';

const AdminPolicyPage = ({ policyPage }) => {
  const {
    policyContent,
    handleSave,
    isLoading,
    isSaving,
    selectedPageKey,
    formatTitle,
  } = usePolicies(policyPage);
  // const [editorContent, setEditorContent] = React.useState(policyContent || '');
  const [editorContent, setEditorContent] = React.useState('');

  React.useEffect(() => {
  if (policyContent) {
    setEditorContent(policyContent);
  }
}, [policyContent]);





const hasChanges = editorContent !== policyContent;

const handleManualSave = () => {
  if (!hasChanges) {
    toast.info('No changes made to the content.');
    return;
  }
  handleSave({ newContent: editorContent });
};



 
  return (
    <div className="admin-policy-editor">
      <div
        className="alert"
        style={{
          background: 'purple',
          color: 'white',
          fontWeight: '500',
        }}
      >
        Use the editor below to update the entire <strong>{formatTitle(selectedPageKey)}</strong> page.
      </div>

      {isLoading ? (
        <BasicLoader />
      ) : (
        <div style={{ marginTop: '20px', padding: '0 3% 10% 3%' }}>
          <div style={{ minHeight: '300px' }}>
            {/* <CKEditor
              editor={ClassicEditor}
              data={
                policyContent ||
                `<h2>${selectedPageKey.replace(/([A-Z])/g, ' $1')}</h2><p>Start writing your content...</p>`
              }
            /> */}
            <CKEditor
  editor={ClassicEditor}
  data={editorContent}
  onChange={(event, editor) => {
    const data = editor.getData();
    setEditorContent(data);
  }}
/>
          </div>

          <div style={{ display: 'flex', justifyContent: 'right' }}>
            <button
              onClick={handleManualSave}
              // onClick={() => handleSave({ newContent: editorContent })}
              disabled={isSaving || !hasChanges}
              style={{
                marginTop: '20px',
                // backgroundColor: isSaving ? 'gray' : 'purple',
                backgroundColor: isSaving || !hasChanges ? '#ccc' : 'purple', // dull gray if disabled
                color: 'white',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '5px',
                cursor: isSaving || !hasChanges ? 'not-allowed' : 'pointer',
              }}
            >
              {isSaving ? 'Saving...' : 'Save Policy'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPolicyPage;


//  const [editorContent, setEditorContent] = React.useState('');

//   React.useEffect(() => {
//     if (policyContent) {
//       setEditorContent(policyContent);
//     }
//   }, [policyContent]);


















// import React from 'react';
// import { CKEditor } from '@ckeditor/ckeditor5-react';
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// import BasicLoader from '../../loader/BasicLoader';
// import { usePolicies } from '../../../pages/policies/usePolicies';
// const AdminPolicyPage = ({ policyPage }) => {
//   const {
//     policyContent,
//     setPolicyContent,
//     handleSave,
//     isLoading,
//     isSaving,
//     selectedPageKey,
//     formatTitle,
//   } = usePolicies(policyPage);
//   // console.log(policyContent)

//   return (
//     <div className="admin-policy-editor">
//       <div
//         className="alert"
//         style={{
//           background: 'purple',
//           color: 'white',
//           fontWeight: '500',
//         }}
//       >
//         Use the editor below to update the entire <strong>{formatTitle(selectedPageKey)}</strong> page.


//       </div>

//       {isLoading ? (
//         <BasicLoader />
//       ) : (
//         <div style={{ marginTop: '20px', padding: '0 3% 10% 3%' }}>
//           <div style={{ minHeight: '300px' }}>
//             <CKEditor
//               editor={ClassicEditor}
//               data={
//                 policyContent ||
//                 `<h2>${selectedPageKey.replace(/([A-Z])/g, ' $1')}</h2><p>Start writing your content...</p>`
//               }
//               onChange={(event, editor) => {
//                 setPolicyContent(editor.getData());
//               }}
//             />
//           </div>

//           <div style={{ display: 'flex', justifyContent: 'right' }}>
//             <button
//               onClick={handleSave}
//               disabled={isSaving}
//               style={{
//                 marginTop: '20px',
//                 backgroundColor: isSaving ? 'gray' : 'purple',
//                 color: 'white',
//                 padding: '10px 20px',
//                 border: 'none',
//                 borderRadius: '5px',
//                 cursor: isSaving ? 'not-allowed' : 'pointer',
//               }}
//             >
//               {isSaving ? 'Saving...' : 'Save Policy'}
//             </button>
//           </div>
//         </div>

//       )}
//     </div>
//   );
// };

// export default AdminPolicyPage;




































// import React, { useState, useEffect } from "react";
// import axios from "axios"; // Import axios for API calls
// import Cookies from "js-cookie";
// import BasicLoader from "../../loader/BasicLoader";
// import { toast } from "react-toastify";

// const AdminShippingPolicy = () => {
//     // State for modal visibility and content to edit
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [selectedText, setSelectedText] = useState("");
//     const [sectionIndex, setSectionIndex] = useState(null); // To track which section is being edited
//     const [isEditingTitle, setIsEditingTitle] = useState(false); // Track if editing the title <p>
//     const [isLoading, setIsLoading] = useState(false)
//     // Initial policy data
//     const [policySections, setPolicySections] = useState([
//         null,
//         null,
//         null
//     ]);

//     const [policyTitle, setPolicyTitle] = useState(null); // Title of the policy

//     // Function to handle section click (for <li> items)
//     const handleSectionClick = (index) => {
//         setSelectedText(policySections[index]);
//         setSectionIndex(index);
//         setIsEditingTitle(false); // Not editing the title
//         setIsModalOpen(true);
//     };

//     // Function to handle title click (for <p> tag)
//     const handleTitleClick = () => {
//         setSelectedText(policyTitle);
//         setIsEditingTitle(true); // Editing the title
//         setIsModalOpen(true);
//     };
//     const token = Cookies.get("authToken")
    
//     // Function to handle form submit and save changes
//     const handleSave = async () => {
//         if (isEditingTitle) {
//             // Optimistically update the title in the UI
//             setPolicyTitle(selectedText);
//         } else {
//             // Optimistically update the section in the UI
//             const updatedSections = [...policySections];
//             updatedSections[sectionIndex] = selectedText;
//             setPolicySections(updatedSections);
//         }
    
//         // Close modal
//         setIsModalOpen(false);
    
//         // Send the updated text to the database via an API call
//         try {
//             const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/admin/edit-page`, {
//                 page: "shippingPolicy",
//                 section: isEditingTitle ? "title" : `section-${sectionIndex}`,
//                 content: selectedText
//             }, {
//                 headers: {
//                     Authorization: `Bearer ${token}`
//                 }
//             });
//             console.log(response);
//             if(response.data.code == "success"){
//                 toast.success('Shipping policy page updated successfully')
//             }else{
//                 toast.error(response.data.message)
//             }
//             // Handle successful response, if needed
//         } catch (error) {
//             console.error("Error updating the shipping policy:", error);
//             // Optionally, you can roll back the UI changes in case of an error
//         }
//     };
    
//     useEffect(()=> {
//         let loaderTimeout;
//         // Set the loader to be shown if data takes more than 200ms
//         loaderTimeout = setTimeout(() => {
//             setIsLoading(true)
//         }, 200);
//         axios.get(`${import.meta.env.VITE_BACKEND_URL}/admin/get-page`, {
//             params: {
//                 page: "shippingPolicy" 
//             },
//             headers: {
//                 Authorization: `Bearer ${token}`
//             }}
//     ).then((feedback) => {
//             console.log(feedback)
//             setIsLoading(false)
//             if(feedback.data.code === "success"){
//                 setPolicyTitle(feedback.data.data.title)
//                 setPolicySections([
//                     feedback.data.data.firstSection,
//                     feedback.data.data.secondSection,
//                     feedback.data.data.thirdSection,

//                 ])
//             }
           
//         }).finally(()=> {
//             clearTimeout(loaderTimeout)
//             setIsLoading(false)
//         })
//     }, [])

//     return (
//         <div>
//             <div className="alert" style={{ background: "purple", color: "white", fontWeight: "500" }}>
//                 Click on any section you wish to edit
//             </div>
//             <div className="shipping-policy-container" style={{ marginTop: "-15px", background: "white" }}>

//                 <div className="shipping-policy-wrapper">
//                     {isLoading &&<BasicLoader />}
//                     {/* Title of the policy */}
//                     <p
//                         onClick={handleTitleClick}
//                         style={{ background: "rgba(128, 128, 128, 0.295)", cursor: "pointer" }}
//                     >
//                         {policyTitle}
//                     </p>

//                     {/* List of policy sections */}
//                     <ul type="none" style={{ display: "flex", flexDirection: "column", gap: "20px", padding: "0" }}>
//                         {policySections.map((section, index) => (
//                             <li
//                                 key={index}
//                                 style={{ background: "rgba(128, 128, 128, 0.295)", cursor: "pointer" }}
//                                 onClick={() => handleSectionClick(index)}
//                             >
//                                 {section}
//                             </li>
//                         ))}
//                     </ul>
//                 </div>
//             </div>

//             {/* Modal */}
//             {isModalOpen && (
//                 <div className="modal-background" style={modalStyles.background}>
//                     <div className="modal-content" style={modalStyles.content}>
//                         <h3>Edit Section</h3>
//                         <textarea
//                             value={selectedText}
//                             onChange={(e) => setSelectedText(e.target.value)}
//                             style={modalStyles.textarea}
//                         />
//                         <button onClick={handleSave} style={modalStyles.saveButton}>Save</button>
//                         <button onClick={() => setIsModalOpen(false)} style={modalStyles.cancelButton}>Cancel</button>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// // Modal styles (You can move these to your CSS file)
// const modalStyles = {
//     background: {
//         position: "fixed",
//         top: 0,
//         left: 0,
//         width: "100%",
//         height: "100%",
//         backgroundColor: "rgba(0, 0, 0, 0.5)",
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center"
//     },
//     content: {
//         backgroundColor: "white",
//         padding: "20px",
//         borderRadius: "8px",
//         width: "400px",
//         display: "flex",
//         flexDirection: "column",
//         gap: "10px"
//     },
//     textarea: {
//         width: "100%",
//         height: "150px",
//         padding: "10px",
//         fontSize: "16px",
//         borderRadius: "5px",
//         border: "1px solid #ccc"
//     },
//     saveButton: {
//         backgroundColor: "purple",
//         color: "white",
//         padding: "10px 20px",
//         border: "none",
//         borderRadius: "5px",
//         cursor: "pointer"
//     },
//     cancelButton: {
//         backgroundColor: "gray",
//         color: "white",
//         padding: "10px 20px",
//         border: "none",
//         borderRadius: "5px",
//         cursor: "pointer"
//     }
// };

// export default AdminShippingPolicy;
