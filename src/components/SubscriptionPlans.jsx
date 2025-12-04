import { useState } from 'react';
import { FaHome } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { createSubscription } from '../api/subscriptionApi';
import OpenRzpPopup from './OpenRzpPopup.js';
import { useEffect } from 'react';

const SubscriptionPlans = () => {
  const [plan, setPlan] = useState('monthly');
  const plans = {
    monthly: [
      { id: 'plan_RTzvPDYfL51wb4', name: 'Lite', amount: 199, storage: 2, recommended: true },
      { id: 'plan_RTzwVP4frFM6eC', name: 'Basic', amount: 399, storage: 5 },
      { id: 'plan_RTzxIGdOeSbTXg', name: 'Standard', amount: 599, storage: 10 },
    ],
    annual: [
      { id: 'plan_RTzu1I9F9pAQ52', name: 'Lite', amount: 1999, storage: 2, recommended: true },
      { id: 'plan_RTzsZJCddOmQQc', name: 'Basic', amount: 3999, storage: 5 },
      { id: 'plan_RTzki62AqExECc', name: 'Standard', amount: 5999, storage: 10 },
    ],
  };

  /* Loading Razorpay Popup dynamically */
  useEffect(() => {
    const rzpScript = document.querySelector('#rzp-script');
    if (rzpScript) return;
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.id = 'rzp-script';
    document.body.appendChild(script);
  }, []);

  const handleSubscriptionPlans = (e, id) => {
    const planName = e.target.value;
    if (planName) setPlan(planName);
  };

  const handleSubscription = async (e, id) => {
    e.preventDefault();
    const { subscriptionId } = await createSubscription(id);
    OpenRzpPopup({ subscriptionId });
  };

  return (
    <div className="min-h-screen flex flex-col items-center relative bg-gray-50 py-12 box-border">
      {/* Home Button */}
      <div className="flex flex-row border-gray-300 border rounded-full md:absolute left-0 top-0 md:mx-10 mx-auto my-4 md:my-10 hover:bg-gray-100 transition">
        <Link to="/" className="font-medium text-lg px-5 py-2 flex flex-row gap-2 items-center">
          <FaHome />
          Home
        </Link>
      </div>

      <h2 className="text-center text-lg sm:text-xl md:text-2xl my-4 md:my-10 font-semibold text-gray-800">
        Get more storage with a discounted plan
      </h2>

      {/* Toggle Buttons */}
      <div className="my-6">
        <div className="flex flex-row border-2 rounded-xl border-gray-300 overflow-hidden">
          <button
            onClick={handleSubscriptionPlans}
            value="monthly"
            className={`px-6 sm:px-12 md:px-16 py-2 sm:py-3 text-sm sm:text-base ${
              plan === 'monthly' ? 'bg-blue-200' : 'bg-gray-100 hover:bg-gray-200'
            } rounded-tl-xl rounded-bl-xl transition`}
          >
            Monthly
          </button>
          <span className="w-px bg-gray-400"></span>
          <button
            onClick={handleSubscriptionPlans}
            value="annual"
            className={`px-6 sm:px-12 md:px-16 py-2 sm:py-3 text-sm sm:text-base ${
              plan === 'annual' ? 'bg-blue-200' : 'bg-gray-100 hover:bg-gray-200'
            } rounded-tr-xl rounded-br-xl transition`}
          >
            Annual
          </button>
        </div>
      </div>

      {/* Plan Cards */}
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-8 px-4 mt-10">
        {plans[plan]?.map(({ id, name, amount, storage, recommended }) => (
          <div
            key={id}
            className={`relative group rounded-2xl p-[2px] h-full transition-all duration-300 ${
              recommended
                ? 'bg-gradient-to-tr from-blue-500 via-green-400 to-red-400'
                : 'bg-gray-200 hover:bg-gradient-to-tr hover:from-blue-400 hover:via-green-300 hover:to-red-400'
            }`}
          >
            <div className="flex flex-col justify-between bg-white rounded-2xl h-full shadow-md hover:shadow-lg transition-all duration-300 p-6 text-center">
              <div className="flex flex-col items-center">
                {recommended && <p className="text-blue-600 font-medium mb-2">Recommended</p>}
                <h3 className="mb-2 text-gray-800">
                  {name} ({storage} TB)
                </h3>
                <p className="text-gray-700 mb-2">
                  <strong className="text-2xl text-gray-800">
                    ₹{amount.toLocaleString('en-IN')}
                  </strong>
                  <span className="text-base text-gray-500">
                    /{plan === 'monthly' ? 'mo' : 'yr'}
                  </span>
                </p>
                <ul className="text-gray-700 text-sm mt-3 space-y-2 flex flex-col items-start">
                  <li>
                    <em className="text-green-600">✓ </em> 24/7 Support
                  </li>
                  <li>
                    <em className="text-green-600">✓ </em> Secure Cloud Backup
                  </li>
                  <li>
                    <em className="text-green-600">✓ </em> Priority Updates
                  </li>
                </ul>
              </div>
              <div>
                <button
                  onClick={(e) => handleSubscription(e, id)}
                  className={`cursor-pointer mt-3 w-full px-4 sm:px-6 py-2 text-sm sm:text-base ${recommended ? 'bg-blue-600 text-white ' : 'text-blue-500 border border-gray-300'} rounded-full ${recommended ? 'hover:bg-blue-500' : 'hover:bg-blue-50'} transition font-medium`}
                >
                  Get discount
                </button>
                <hr className="my-5 text-gray-300" />
                <div className="flex flex-row items-start justify-evenly">
                  <span className="text-blue-600 px-4 font-extrabold">✓</span>
                  <div className="flex flex-col items-start">
                    <p className="text-sm text-gray-700">{storage} TB of storage for</p>
                    <p className="text-sm text-gray-700">Photos, Drive and Gmail</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionPlans;
