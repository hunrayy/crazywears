import React, { useState, useEffect, useRef } from 'react';

const CustomDropdown = ({ title, options, onRoleSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null); // Reference to the dropdown element

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setIsOpen((prevState) => !prevState);
  };

  // Close dropdown when clicking outside
  const handleOutsideClick = (event) => {
    // Check if the click is outside the dropdown (including button and dropdown content)
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

   // Handle role selection and send the id back to the parent
   const handleSelect = (id) => {
    onRoleSelect(id); // Call the parent function with the selected role id
    setIsOpen(false); // Close the dropdown after selection
  };

  // Event listener to close dropdown on click outside
  useEffect(() => {
    // console.log(options.id)
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
  
    // Use mousedown instead of click
    document.addEventListener('mousedown', handleOutsideClick);
  
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);
  

  return (
    <div
      className="custom-dropdown"
      style={{ position: 'relative', display: 'inline-block' }}
      ref={dropdownRef} // Attach the ref to the root of the dropdown
    >
      <button
        onClick={toggleDropdown}
        style={{
        backgroundColor: "white",
          color: 'purple',
          fontWeight: "bold",
          padding: '10px 20px',
          border: 'none',
          cursor: 'pointer',
          fontSize: '16px',
          borderRadius: '5px',
        }}
      >
        {title}
        <span style={{ fontSize: '14px' }}>{isOpen ? '▲' : '▼'}</span>

      </button>

      {/* Show dropdown menu only if isOpen is true */}
      {isOpen && (
        <div
          className="dropdown-menu"
          style={{
            right: "10px",
            position: 'absolute',
            backgroundColor: 'white',  // Adjusted for visibility
            // minWidth: '160px',
            boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.2)',
            zIndex: 5,  // Ensuring it's on top of other elements
            borderRadius: '5px',
            marginTop: '5px',
            display: isOpen ? 'block' : 'none', // Ensuring it's displayed only when open
          }}
        >
          {options && options.map((option, index) => (
            <a
              href={`#action-${index + 1}`}
              key={option.id || index}
              className="dropdown-item"
              style={{
                padding: '12px 16px',
                textDecoration: 'none',
                display: 'block',
                color: 'black',
              }}
              onClick={() => handleSelect(option.id)}
            >
              {option.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;


















// import React, { useState } from 'react';

// const CustomDropdown = ({ title, options }) => {
//   const [isOpen, setIsOpen] = useState(false);

//   // Toggle dropdown
//   const toggleDropdown = () => setIsOpen(!isOpen);

//   // Close dropdown when clicking outside
//   const handleOutsideClick = (event) => {
//     if (event.target.closest('.custom-dropdown') === null) {
//       setIsOpen(false);
//     }
//   };

//   // Event listener to close dropdown on click outside
//   React.useEffect(() => {
//     document.addEventListener('click', handleOutsideClick);
//     return () => document.removeEventListener('click', handleOutsideClick);
//   }, []);

//   return (
//     <div className="custom-dropdown">
//       <button className="dropdown-toggle" onClick={toggleDropdown}>
//         {title}
//       </button>

//       {isOpen && (
//         <div className="dropdown-menu">
//           {options.map((option, index) => (
//             <a href={`#action-${index + 1}`} key={index} className="dropdown-item">
//               {option}
//             </a>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default CustomDropdown;
