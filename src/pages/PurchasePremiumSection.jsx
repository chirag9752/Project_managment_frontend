import axios from "axios";

const PurchasePremiumSection = () => {

  const handlePayment = async () => {
    try {
      const response = await axios.post("http://localhost:3000/create-checkout-session", {
        
      });

      const data = response.json();

      if (response.ok && data?.url) {
        window.location.href = data.url;
      } else {
        console.error("Error creating checkout session", data.message);
        alert("Failed to initiate payment.");
      }
    } catch (error) {
      console.error("Payment Error:", error);
      alert("An error occurred. Please try again.");
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
      <p className="text-2xl font-bold text-gray-900 mt-4">$1000.00/year</p>
      <button
        onClick={handlePayment}
        className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-xl shadow-md hover:bg-blue-700 transition"
      >
        Proceed to Payment
      </button>
    </div>
    </div>
  );
};

export default PurchasePremiumSection;
