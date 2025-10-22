import { RZP_KEY } from '../config';

const OpenRzpPopup = ({ subscriptionId }) => {
  const rzp = new Razorpay({
    // key: RZP_KEY,
    key: 'rzp_test_RGwzGasDB8lbVo',
    amount: 999,
    currency: 'INR',
    name: 'Storage App', // business name
    image: 'http://localhost:5173/drive.jpg',
    notes: {
      // courseId: course.id,
      // courseName: course.name,
    },
    theme: '#528FF0',
    // order_id: orderId,
    subscription_id: subscriptionId,

    handler: async function (res) {
      console.log(res);
      console.log(res.razorpay_payment_id);
      console.log(res.razorpay_order_id);
      console.log(res.razorpay_signature);
    },
    description: `User has been purchased new subscription`,
  });

  rzp.open();

  rzp.on('payment.failed', function (response) {
    console.log(response.error);
  });

  return rzp;
};

export default OpenRzpPopup;
