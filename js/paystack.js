// js/paystack.js
function payWithPaystack(totalAmountCedi, email, name, phone, onSuccess) {
  if (!window.PaystackPop) {
    alert("Paystack not loaded");
    return;
  }

  const handler = PaystackPop.setup({
    key: 'pk_test_9f6508eafc072436aa80fcebd4819d03e0782bd1', 
    email: email,
    amount: Math.round(totalAmountCedi * 100), 
    currency: 'GHS',
    ref: 'EMIL_' + Math.floor(Math.random() * 1000000000) + Date.now(),
    metadata: {
      custom_fields: [
        { display_name: 'Customer Name', value: name },
        { display_name: 'Phone Number', value: phone }
      ]
    },
    callback: function(response) {
      onSuccess(true);
    },
    onClose: function() {
      showToast('Payment closed', 'info');
      onSuccess(false);
    }
  });

  handler.openIframe();
}