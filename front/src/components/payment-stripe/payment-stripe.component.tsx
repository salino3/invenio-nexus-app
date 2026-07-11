import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import "./checkout-form.styles.scss";

export const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [processing, setProcessing] = useState(false);
  const [cardError, setCardError] = useState<string | null>(null);
  const [isCardComplete, setIsCardComplete] = useState(false);

  const [currency] = useState("eur");

  const handleChange = (event: any) => {
    setCardError(event.error ? event.error.message : "");
    setIsCardComplete(event.complete);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_URL_BACK}${import.meta.env.VITE_APP_API_URL_PAYMENT}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: 1000,
            currency: currency,
          }),
        },
      );

      const { clientSecret } = await response.json();
      const cardElement = elements.getElement(CardElement);

      if (!cardElement) return;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: name,
            email: email,
          },
        },
      });

      if (result.error) {
        alert(`Error: ${result.error.message}`);
      } else {
        if (result.paymentIntent.status === "succeeded") {
          alert("Payment successful! Money received in test mode.");
        }
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to the server.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} id="formCheckoutForm">
      <h2 className="text-xl font-bold mb-4 text-gray-800">
        Complete Purchase
      </h2>

      <div className="inputGroup">
        <label htmlFor="name">Full Name</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="John Doe"
          required
        />
      </div>

      <div className="inputGroup">
        <label htmlFor="email">Email Address</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="john@example.com"
          required
        />
      </div>

      <div className="boxCardData">
        <label>Card data</label>
        <div className="stylesCardElement">
          <CardElement
            onChange={handleChange}
            options={{
              hidePostalCode: false,
              style: {
                base: {
                  fontSize: "16px",
                  color: "#424770",
                  "::placeholder": { color: "#aab7c4" },
                },
                invalid: { color: "#9e2146" },
              },
            }}
          />
        </div>

        <div className="errorContainer">
          {cardError && <span className="errorMessage">{cardError}</span>}
        </div>
      </div>

      <button disabled={!stripe || processing || !isCardComplete}>
        {processing ? "Processing..." : `Pay 10.00 ${currency.toUpperCase()}`}
      </button>
    </form>
  );
};
