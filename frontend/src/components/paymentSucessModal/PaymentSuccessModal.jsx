import React, { useRef } from 'react';
import confetti from 'canvas-confetti';
import './paymentSuccessModal.css';
import { useNavigate } from 'react-router-dom';

const PaymentSuccessModal = ({ isOpen}) => {
    const navigate = useNavigate()
  const modalRef = useRef();

  const runConfetti = () => {
    const duration = 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 7,
        angle: 60,
        spread: 100,
        origin: { x: 0 },
        zIndex: 10000
      });
      confetti({
        particleCount: 7,
        angle: 120,
        spread: 100,
        origin: { x: 1 },
        zIndex: 10000
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };

//   const handleBackdropClick = (e) => {
//     if (e.target === modalRef.current) {
//       onClose();
//     }
//   };

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      runConfetti();
    }else{
      document.body.style.overflow = '';
    }

      // Clean up just in case
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="payment-modal-backdrop active" ref={modalRef}>
      <div className="payment-modal">
        <div className="success-icon">
          <svg viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
            <path d="M7 13l3 3 7-7" />
          </svg>
        </div>
        <h2>Payment Successful!</h2>
        <p>Your receipt has been sent to your email. Head to your dashboard to view your order details.</p>
        <button className="payment-btn" onClick={()=> navigate('/user-account')}>Dashboard</button>
      </div>
    </div>
  );
};

export default PaymentSuccessModal;
