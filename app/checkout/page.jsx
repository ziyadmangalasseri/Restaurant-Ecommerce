"use client";

import { useSelector } from "react-redux";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
// import CartSummary from "../components/CartSummary"; // Optional: reuse the summary component
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CheckoutPage() {
  const cartItems = useSelector((state) => state.cart.items);
  const { data: session } = useSession();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    address: "",
    city: "",
    pincode: "",
    phone: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    if (!session?.user) {
      alert("Please login to place an order");
      return;
    }

    setIsPlacingOrder(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: session.user,
          cartItems,
          shippingAddress: form,
          paymentMethod,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push(`/checkout/success?orderId=${data.orderId}`);
      } else {
        alert("Order failed: " + data.message);
      }
    } catch (err) {
      console.error("Order failed", err);
      alert("Something went wrong. Try again.");
    }

    setIsPlacingOrder(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 pt-[200px]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/cart">
              <button className="p-2 hover:bg-white rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Checkout
            </h1>
          </div>
          <p className="text-gray-600">
            Review your information before placing the order
          </p>
        </div>

        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Left Side - Shipping & Payment */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Shipping Address</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  className="w-full p-3 border border-gray-300 rounded"
                />
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Street Address"
                  className="w-full p-3 border border-gray-300 rounded"
                />
                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="City"
                  className="w-full p-3 border border-gray-300 rounded"
                />
                <input
                  type="text"
                  name="pincode"
                  value={form.pincode}
                  onChange={handleChange}
                  placeholder="Pincode"
                  className="w-full p-3 border border-gray-300 rounded"
                />
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  className="w-full p-3 border border-gray-300 rounded"
                />
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                  />
                  Cash on Delivery
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="payment"
                    value="razorpay"
                    checked={paymentMethod === "razorpay"}
                    onChange={() => setPaymentMethod("razorpay")}
                  />
                  Pay with Razorpay
                </label>
              </div>
            </div>
          </div>

          {/* Right Side - Summary */}
          <div className="mt-8 lg:mt-0">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Order Summary
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Subtotal ({cartItems.length} items)
                  </span>
                  <span className="font-medium text-black">
                    $
                    {cartItems
                      .reduce(
                        (sum, item) => sum + item.price * item.quantity,
                        0
                      )
                      .toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium text-black">
                    $
                    {cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0) >
                    50
                      ? "0.00"
                      : "5.99"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium text-black">
                    $
                    {(
                      cartItems.reduce(
                        (sum, item) => sum + item.price * item.quantity,
                        0
                      ) * 0.1
                    ).toFixed(2)}
                  </span>
                </div>
                <hr className="border-gray-200" />
                <div className="flex justify-between text-lg font-semibold">
                  <span className="text-gray-900">Total</span>
                  <span className="text-[#1a2649]">
                    $
                    {(
                      cartItems.reduce(
                        (sum, item) => sum + item.price * item.quantity,
                        0
                      ) *
                        1.1 +
                      (cartItems.reduce(
                        (sum, item) => sum + item.price * item.quantity,
                        0
                      ) > 50
                        ? 0
                        : 5.99)
                    ).toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder}
                className="w-full mt-6 bg-[#1a2649] text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-900 transition-colors"
              >
                {isPlacingOrder ? "Placing Order..." : "Place Order"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
