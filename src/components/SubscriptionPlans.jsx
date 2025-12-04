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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-4 sm:py-6 lg:py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section - Responsive Layout */}
        <div className="mb-6 sm:mb-8">
          {/* Mobile: Stacked Layout */}
          <div className="block lg:hidden">
            <div className="flex justify-start mb-4">
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 rounded-full shadow-sm hover:shadow transition-all duration-200"
              >
                <FaHome className="text-blue-600" />
                <span>Home</span>
              </Link>
            </div>
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Choose Your Perfect Plan
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                Get more storage with our discounted plans
              </p>
            </div>
          </div>

          {/* Desktop: Single Row Layout */}
          <div className="hidden lg:flex items-center justify-between">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 rounded-full shadow-sm hover:shadow transition-all duration-200"
            >
              <FaHome className="text-blue-600" />
              <span>Home</span>
            </Link>
            
            <div className="text-center flex-1 px-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Choose Your Perfect Plan
              </h1>
              <p className="text-base text-gray-600">
                Get more storage with our discounted plans
              </p>
            </div>
            
            <div className="w-[100px]"></div>
          </div>
        </div>

        {/* Toggle Buttons */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="inline-flex bg-white rounded-full shadow p-1 border border-gray-200">
            <button
              onClick={handleSubscriptionPlans}
              value="monthly"
              className={`px-6 sm:px-10 lg:px-12 py-2 sm:py-2.5 text-sm sm:text-base font-semibold rounded-full transition-all duration-300 ${
                plan === 'monthly' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={handleSubscriptionPlans}
              value="annual"
              className={`px-6 sm:px-10 lg:px-12 py-2 sm:py-2.5 text-sm sm:text-base font-semibold rounded-full transition-all duration-300 relative ${
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

        {/* Plan Cards - Fully Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 mb-8 sm:mb-10 lg:mb-12">
          {plans[plan]?.map(({ id, name, amount, storage, recommended, badge, badgeColor }) => (
            <div
              key={id}
              className={`relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden ${
                recommended ? 'border-2 border-blue-400' : 'border border-gray-200'
              }`}
            >
              {/* Badge at top */}
              <div className={`${badgeColor} text-white text-center py-1.5 sm:py-2 text-xs sm:text-sm font-bold`}>
                {badge}
              </div>

              <div className="p-4 sm:p-5 lg:p-6">
                {/* Plan Name */}
                <div className="mb-3 sm:mb-4">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{name}</h3>
                </div>

                {/* Price */}
                <div className="mb-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                      ₹{amount.toLocaleString('en-IN')}
                    </span>
                    <span className="text-sm text-gray-600">
                      /{plan === 'monthly' ? 'mo' : 'yr'}
                    </span>
                  </div>
                </div>

                {/* Storage Info with Badge */}
                <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <FaDatabase className="text-blue-600 text-base sm:text-lg" />
                    <p className="text-lg sm:text-xl font-bold text-blue-700">{storage} TB</p>
                  </div>
                  <p className="text-xs text-center text-gray-700">
                    Storage for Photos, Files & Videos
                  </p>
                </div>

                {/* What's Included Header */}
                <h4 className="text-xs font-bold text-gray-500 uppercase mb-2 sm:mb-3">
                  Included Features
                </h4>

                {/* Features */}
                <ul className="space-y-2 mb-4 sm:mb-5">
                  {[
                    'High-speed uploads & downloads',
                    'Secure, long-term file durability',
                    'Optimized file transfer',
                    'Email & chat support',
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-xs sm:text-sm text-gray-700">
                      <FaCheck className="text-green-600 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  onClick={(e) => handleSubscription(e, id)}
                  className={`w-full py-2.5 sm:py-3 px-4 rounded-lg font-semibold text-sm sm:text-base transition-all duration-300 shadow-sm hover:shadow-md ${
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
          ))}
        </div>

        {/* Trust Indicators - Marquee at Bottom */}
        <div className="bg-white rounded-xl shadow-md py-3 sm:py-4 border border-gray-200 overflow-hidden">
          <marquee
            behavior="scroll"
            direction="left"
            scrollamount="5"
            className="flex items-center"
          >
            <div className="inline-flex items-center gap-8 sm:gap-12 text-gray-700">
              <div className="flex items-center gap-2 mx-6 sm:mx-8">
                <FaShieldAlt className="text-blue-600 text-lg sm:text-xl flex-shrink-0" />
                <span className="font-semibold whitespace-nowrap text-sm sm:text-base">
                  Secure & Encrypted Storage
                </span>
              </div>
              <div className="flex items-center gap-2 mx-6 sm:mx-8">
                <FaThumbsUp className="text-green-600 text-lg sm:text-xl flex-shrink-0" />
                <span className="font-semibold whitespace-nowrap text-sm sm:text-base">
                  Easy to Use Interface
                </span>
              </div>
              <div className="flex items-center gap-2 mx-6 sm:mx-8">
                <FaClock className="text-purple-600 text-lg sm:text-xl flex-shrink-0" />
                <span className="font-semibold whitespace-nowrap text-sm sm:text-base">
                  24/7 Email & Chat Support
                </span>
              </div>
              <div className="flex items-center gap-2 mx-6 sm:mx-8">
                <FaShieldAlt className="text-blue-600 text-lg sm:text-xl flex-shrink-0" />
                <span className="font-semibold whitespace-nowrap text-sm sm:text-base">
                  Secure & Encrypted Storage
                </span>
              </div>
              <div className="flex items-center gap-2 mx-6 sm:mx-8">
                <FaThumbsUp className="text-green-600 text-lg sm:text-xl flex-shrink-0" />
                <span className="font-semibold whitespace-nowrap text-sm sm:text-base">
                  Easy to Use Interface
                </span>
              </div>
              <div className="flex items-center gap-2 mx-6 sm:mx-8">
                <FaClock className="text-purple-600 text-lg sm:text-xl flex-shrink-0" />
                <span className="font-semibold whitespace-nowrap text-sm sm:text-base">
                  24/7 Email & Chat Support
                </span>
              </div>
            </div>
          </marquee>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;