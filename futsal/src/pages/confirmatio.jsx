import React, { useEffect } from 'react';
import './PaymentSuccess.css'; // Import your CSS file (if needed)

function PaymentSuccess() {
  useEffect(() => {
    setTimeout(() => {
      window.location.href = '/booking'; // Replace with your desired route
    }, 3000);
  }, []);

  return (
    <div className="masc" style={{marginTop:"3rem"}}>
        <div className="container">
      <div className="tick">✔</div>
      <h1>Payment Successful!</h1>
      <p>Your payment has been processed successfully.<br /> Thank you for your purchase.</p>
      <div id="progress-bar"><div></div></div>
    </div>
    </div>
  );
}

export default PaymentSuccess;
