import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import React from "react";
import PaymentForm from "./PaymentForm";

const PUBLIC_KEY =
  "pk_test_51OC6VFFV3Wv9D2rIaJGTtMXkQ9UV8oDen0vGLLxGbcDrp4YDEt8O9EWyeMv5D9jxt7xwHTqVvwsJN6Wx6fy2UIiX00ssrTlGdg";

const stripeTestPromise = loadStripe(PUBLIC_KEY);

const StripeContainer = ({ totalPrice, products, setSuccess }) => {
  return (
    <Elements stripe={stripeTestPromise}>
      <PaymentForm
        totalPrice={totalPrice}
        products={products}
        setSuccess={setSuccess} // Pass setSuccess to PaymentForm
      />
    </Elements>
  );
};

export default StripeContainer;
