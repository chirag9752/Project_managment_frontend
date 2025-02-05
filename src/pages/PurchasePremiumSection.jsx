import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import config from "../components/contants/config.json";
import { jwtDecode } from "jwt-decode";

const PurchasePremiumSection = () => {
  const stripePromise = loadStripe(import.meta.env.VITE_API_KEY);
  const tokenvalue = localStorage.getItem('token');
  const decodedToken = jwtDecode(tokenvalue);
  const userId = parseInt(decodedToken.sub, 10);

  const handlePayment = async () => {
    try {
      const response = await axios.post("http://localhost:3000/checkout/create", {
        data:{
          price: 100000,
          productname: "timesheets",
          userId: userId
        }
      });
      console.log(response);
      if (response.status === 200) {
        const sessionId = response.data.id;
        const stripe = await stripePromise;
        stripe.redirectToCheckout({ sessionId: sessionId })
      } else {
        console.error(config.CheckLoadError);
        alert(config.CheckLoadError);
      }
    } catch (error) {
      console.error("Payment Error:", error);
      alert(config.error);
    }
  };

  return (
    <div className="h-screen w-screen bg-gray-400 pt-[15%]">
        <div className="max-w-sm justify-center mx-auto bg-white shadow-xl rounded-2xl p-6">
      <h2 className="text-lg font-semibold text-gray-800">
        Project Management Pro
      </h2>
      <p className="text-gray-600 mt-2">
        Unlock premium features to better manage your projects.
      </p>
      <p className="text-2xl font-bold text-gray-900 mt-4">$1000.00</p>
      <button
        onClick={handlePayment}
        className="mt-6 hover:scale-110 w-full bg-blue-600 text-white py-2 px-4 rounded-xl shadow-md hover:bg-gray-600 transition"
      >
        Proceed to Payment
      </button>
    </div>
    </div>
  );
};

export default PurchasePremiumSection;
