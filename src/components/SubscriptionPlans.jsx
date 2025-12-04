import { useState, useEffect } from 'react';
import { FaHome, FaCheck, FaShieldAlt, FaThumbsUp, FaClock, FaDatabase } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { createSubscription } from '../api/subscriptionApi';
import OpenRzpPopup from './OpenRzpPopup.js';

const SubscriptionPlans = () => {
  const [plan, setPlan] = useState('monthly');
  const plans = {
    monthly: [
      {
        id: 'plan_RTzvPDYfL51wb4',
        name: 'Lite',
        amount: 199,
        storage: 2,
        recommended: true,
        badge: '⭐ MOST POPULAR',
        badgeColor: 'bg-gradient-to-r from-blue-600 to-purple-600',
      },
      {
        id: 'plan_RTzwVP4frFM6eC',
        name: 'Basic',
        amount: 399,
        storage: 5,
        badge: '💎 BEST VALUE',
        badgeColor: 'bg-gradient-to-r from-green-600 to-emerald-600',
      },
      {
        id: 'plan_RTzxIGdOeSbTXg',
        name: 'Standard',
        amount: 599,
        storage: 10,
        badge: '👑 PREMIUM',
        badgeColor: 'bg-gradient-to-r from-purple-600 to-pink-600',
      },
    ],
    annual: [
      {
        id: 'plan_RTzu1I9F9pAQ52',
        name: 'Lite',
        amount: 1999,
        storage: 2,
        recommended: true,
        badge: '⭐ MOST POPULAR',
        badgeColor: 'bg-gradient-to-r from-blue-600 to-purple-600',
      },
      {
        id: 'plan_RTzsZJCddOmQQc',
        name: 'Basic',
        amount: 3999,
        storage: 5,
        badge: '💎 BEST VALUE',
        badgeColor: 'bg-gradient-to-r from-green-600 to-emerald-600',
      },
      {
        id: 'plan_RTzki62AqExECc',
        name: 'Standard',
        amount: 5999,
        storage: 10,
        badge: '👑 PREMIUM',
        badgeColor: 'bg-gradient-to-r from-purple-600 to-pink-600',
      },
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-6 sm:py-8 px-4">
      <div className="max-w-6xl mx-auto my-5">
        {/* Home Button */}
        <div className="flex items-center justify-between mb-6">
          {/* Home Button */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 rounded-full shadow-sm hover:shadow transition-all duration-200"
          >
            <FaHome className="text-blue-600" />
            <span>Home</span>
          </Link>

          {/* Header */}
          <div className="text-center flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Choose Your Perfect Plan
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Get more storage with our discounted plans. Flexible options for every need.
            </p>
          </div>

          {/* Right side empty to balance layout */}
          <div className="w-[80px] sm:w-[100px]"></div>
        </div>

        {/* Toggle Buttons */}
        <div className="flex justify-center mb-4 sm:mb-8">
          <div className="inline-flex bg-white rounded-full shadow p-1 border border-gray-200">
            <button
              onClick={handleSubscriptionPlans}
              value="monthly"
              className={`px-6 sm:px-10 py-2 text-sm sm:text-base font-semibold rounded-full transition-all duration-300 ${
                plan === 'monthly' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={handleSubscriptionPlans}
              value="annual"
              className={`px-6 sm:px-10 py-2 text-sm sm:text-base font-semibold rounded-full transition-all duration-300 relative ${
                plan === 'annual' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Annual
              <span className="absolute -top-1 -right-1 px-1.5 py-0.5 text-xs bg-green-500 text-white rounded-full">
                -17%
              </span>
            </button>
          </div>
        </div>

        {/* Plan Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {plans[plan]?.map(
            ({
              id,
              name,
              amount,
              storage,
              recommended,
              subtitle,
              description,
              badge,
              badgeColor,
            }) => (
              <div
                key={id}
                className={`relative bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden w-full max-w-sm mx-auto ${
                  recommended ? 'border-2 border-blue-400' : 'border border-gray-200'
                }`}
              >
                {/* Badge at top */}
                <div className={`${badgeColor} text-white text-center py-1.5 text-xs font-bold`}>
                  {badge}
                </div>

                <div className="p-5 sm:p-6">
                  {/* Plan Name */}
                  <div className="mb-3">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{name}</h3>
                    <p className="text-sm text-blue-600 font-semibold">{subtitle}</p>
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-gray-600 mb-4">{description}</p>

                  {/* Price */}
                  <div className="mb-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold text-gray-900">
                        ₹{amount.toLocaleString('en-IN')}
                      </span>
                      <span className="text-sm text-gray-600">
                        /{plan === 'monthly' ? 'month' : 'year'}
                      </span>
                    </div>
                  </div>
                  {/* Storage Info with Badge */}
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <FaDatabase className="text-blue-600 text-lg" />
                      <p className="text-xl font-bold text-blue-700">{storage} TB</p>
                    </div>
                    <p className="text-xs text-center text-gray-700">
                      Storage for Photos, files & Videos
                    </p>
                  </div>

                  {/* What's Included Header */}
                  <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">
                    Included Features
                  </h4>

                  {/* Storage Info */}
                  <div className="flex items-center gap-2 mb-3 text-sm text-gray-700">
                    <FaCheck className="text-green-600 flex-shrink-0" />
                    <span>
                      <strong>{storage} TB</strong> secure storage
                    </span>
                  </div>

                  {/* Features */}
                  <ul className="space-y-2 mb-5">
                    {[
                      'High-speed uploads & downloads',
                      'Secure, long-term file durability',
                      'Optimized file transfer performance',
                      'Email & chat support',
                    ].map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-[12px] text-gray-700">
                        <FaCheck className="text-green-600 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <button
                    onClick={(e) => handleSubscription(e, id)}
                    className={`w-full py-2.5 px-4 rounded-lg font-semibold text-sm transition-all duration-300 ${
                      name === 'Lite'
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : name === 'Basic'
                          ? 'bg-green-600 hover:bg-green-700 text-white'
                          : name === 'Standard'
                            ? 'bg-purple-600 hover:bg-purple-700 text-white'
                            : 'bg-gray-600 text-white'
                    }`}
                  >
                    Choose Plan
                  </button>
                </div>
              </div>
            )
          )}
        </div>
        {/* Trust Indicators - Marquee at Bottom */}
        <div className="bg-white rounded-xl shadow-md py-2 mt-10 border border-gray-200 overflow-hidden">
          <marquee
            behavior="scroll"
            direction="left"
            scrollamount="5"
            className="flex items-center w-full whitespace-nowrap overflow-hidden gap-8 py-2 text-sm sm:text-base"
          >
            <div className="inline-flex items-center gap-12 text-gray-700 text-sm">
              <div className="flex items-center gap-2 mx-8">
                <FaShieldAlt className="text-blue-600 text-md" />
                <span className="font-semibold whitespace-nowrap">Secure & Encrypted Storage</span>
              </div>
              <div className="flex items-center gap-2 mx-8">
                <FaThumbsUp className="text-green-600 text-md" />
                <span className="font-semibold whitespace-nowrap">Easy to Use Interface</span>
              </div>
              <div className="flex items-center gap-2 mx-8">
                <FaClock className="text-purple-600 text-md" />
                <span className="font-semibold whitespace-nowrap">24/7 Email & Support</span>
              </div>
              <div className="flex items-center gap-2 mx-8">
                <FaShieldAlt className="text-blue-600 text-md" />
                <span className="font-semibold whitespace-nowrap">Secure & Encrypted Storage</span>
              </div>
              <div className="flex items-center gap-2 mx-8">
                <FaThumbsUp className="text-green-600 text-md" />
                <span className="font-semibold whitespace-nowrap">Easy to Use Interface</span>
              </div>
              <div className="flex items-center gap-2 mx-8">
                <FaClock className="text-purple-600 text-md" />
                <span className="font-semibold whitespace-nowrap">24/7 Email & Chat</span>
              </div>
            </div>
          </marquee>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;
