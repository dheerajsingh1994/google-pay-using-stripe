document.addEventListener('DOMContentLoaded', async() => {
    // Set your publishable key: remember to change this to your live publishable key in production
    // See your keys here: https://dashboard.stripe.com/apikeys
    const stripe = Stripe('pk_test_51KG6MrCOATZUk3VuKUO2TWgobELv4rBTiTqHVyj3eSwV8umyi8z3ZMyfsBritUWpyBtUqtNFK76iQ2jkGrSsiEWy00asPyTFuU');

    // console.log(stripe); return false;

    const paymentRequest = stripe.paymentRequest({
        currency: 'inr',
        country: 'IN',
        requestPayerName: true,
        requestPayerEmail: true,
        total: {
            label: 'Total',
            amount:1000
        }
    });

    const elements = stripe.elements();
    const prButton = elements.create('paymentRequestButton', {
        paymentRequest: paymentRequest,
    });

    paymentRequest.canMakePayment()
    .then(result => {
        if(result) {
            prButton.mount('#payment-element');
        } else {
            document.getElementById('payment-element').style.display = 'none';
            console.log('ffff');
        }
    });

    paymentRequest.on('paymentMethod', async(e) => {
        console.log('here', e);
        // create a payment intent
        const {clientSecret} = await fetch('/get-intent', {
            method:'POST',
            headers:{
                'content-type':'application/json',
            },
            body: JSON.stringify({
                paymentMethodType: 'card',
                currency: 'INR',
            })
        })
        .then(result => {
            console.log('here', result);
            console.log('in-gere', result.json());
            result.json();
        });
        console.log('client secret returned');
        // confirmCardPayment returns a promise
        const {error, paymentIntent} = await stripe.confirmCardPayment(clientSecret, {
            payment_method: e.paymentMethod.id
        }, {handleActions: false});
        
        if(error) {
            console.log("error: fail");
            e.complete('fail');
        }

        e.complete('success');
        console.log(`Success: ${paymentIntent.id}`);
        if(paymentIntent.status == "requires_action") {
            stripe.confirmCardPayment(clientSecret);
        }
    })
});