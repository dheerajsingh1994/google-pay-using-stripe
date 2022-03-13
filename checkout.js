(async () => {
    const response = await fetch('/get-intent');
    const {client_secret: clientSecret} = await response.json();
    // Render the Payment Element using the clientSecret
})();


// Set your publishable key: remember to change this to your live publishable key in production
// See your keys here: https://dashboard.stripe.com/apikeys
const stripe = Stripe('pk_test_51KG6MrCOATZUk3VuKUO2TWgobELv4rBTiTqHVyj3eSwV8umyi8z3ZMyfsBritUWpyBtUqtNFK76iQ2jkGrSsiEWy00asPyTFuU');

const options = {
    clientSecret: '{{CLIENT_SECRET}}',
    // Fully customizable with appearance API.
    appearance: {/*...*/},
};

// Set up Stripe.js and Elements to use in checkout form, passing the client secret obtained in step 2
const elements = stripe.elements(options);

// Create and mount the Payment Element
const paymentElement = elements.create('payment');
paymentElement.mount('#payment-element');


const form = document.getElementById('payment-form');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const {error} = await stripe.confirmPayment({
    //`Elements` instance that was used to create the Payment Element
    elements,
    confirmParams: {
      return_url: 'https://example.com/order/123/complete',
    },
  });

  if (error) {
    // This point will only be reached if there is an immediate error when
    // confirming the payment. Show error to your customer (for example, payment
    // details incomplete)
    const messageContainer = document.querySelector('#error-message');
    messageContainer.textContent = error.message;
  } else {
    // Your customer will be redirected to your `return_url`. For some payment
    // methods like iDEAL, your customer will be redirected to an intermediate
    // site first to authorize the payment, then redirected to the `return_url`.
  }
});