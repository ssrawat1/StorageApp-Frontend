import { RZP_KEY } from '../config';

const OpenRzpPopup = ({ subscriptionId }) => {
  const rzp = new Razorpay({
    key: RZP_KEY,
    amount: 999,
    currency: 'INR',
    name: 'Safemystuff App', // business name
    image: 'https://safemystuff.store/drive.jpg',
    notes: {
      // courseId: course.id,
      // courseName: course.name,
    },
    theme: '#528FF0',
    // order_id: orderId,
    subscription_id: subscriptionId,

    handler: async function (res) {
    },
    description: `User has been purchased new subscription`,
  });

  rzp.open();

  rzp.on('payment.failed', function (response) {
  });

  return rzp;
};

export default OpenRzpPopup;
