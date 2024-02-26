import React, { useState } from "react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import axios from "axios";
import "./app.css";
import { URL_ELEPHANT } from "../../utils/url";

const CARD_OPTIONS = {
  iconStyle: "solid",
  style: {
    base: {
      iconColor: "#c4f0ff",
      color: "#fff",
      fontWeight: 500,
      fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
      fontSize: "16px",
      fontSmoothing: "antialiased",
      ":-webkit-autofill": { color: "#fce883" },
      "::placeholder": { color: "#87bbfd" },
    },
    invalid: {
      iconColor: "#ffc7ee",
      color: "#ffc7ee",
    },
  },
};
function PaymentForm({ totalPrice, products, setSuccess }) {
  const [successLocal, setSuccessLocal] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
    });

    if (!error) {
      try {
        const { id } = paymentMethod;
        console.log(id);
        const response = await axios.post(`${URL_ELEPHANT}/payment`, {
          amount: totalPrice * 100, // Stripe amount is in cents
          id,
          products, // pass the products array
        });

        if (response.data.success) {
          console.log("Successful payment");
          setSuccessLocal(true);
          setSuccess(true);
        }
      } catch (error) {
        console.log("Error", error);
      }
    } else {
      console.log(error.message);
    }
  };

  return (
    <>
      {!successLocal ? (
        <form onSubmit={handleSubmit}>
          <fieldset className="FormGroup">
            <div className="FormRow">
              <CardElement options={CARD_OPTIONS} />
            </div>
          </fieldset>
          <button className="btn-stripe">Pay</button>
          <div className="fakeDetails">
            <p className="fakeTestDrive"> Test drive:</p>
            <div className="firstFake">
              <p>
                Card Number:{" "}
                <span className="fakeDetailssss">4242 4242 4242 4242</span>
              </p>
              <p>
                {" "}
                MM/YY: <span className="fakeDetailssss">04/26</span>
              </p>
            </div>{" "}
            <div className="secondFake">
              {" "}
              <p>
                CVC: <span className="fakeDetailssss">424</span>
              </p>
              <p>
                ZIP: <span className="fakeDetailssss"> 42424</span>
              </p>
            </div>
          </div>
        </form>
      ) : (
        <div>
          <h3>Confirmation of payment...</h3>
        </div>
      )}
    </>
  );
}

export default PaymentForm;
