"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCart } from "../store/cartSlice";
import { useSession } from "next-auth/react";
import Cart from "../../components/Cart";

export default function CartPage() {
  const dispatch = useDispatch();
  const { data: session, status } = useSession();
  const guestCart = useSelector((state) => state.cart.items);

  useEffect(() => {
    if (status !== "authenticated") return;

    async function mergeCart() {
      try {
        const res = await fetch("/api/cart/merge", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ guestCart }),
        });
        const { mergedCart } = await res.json();
        dispatch(setCart(mergedCart || []));
      } catch (err) {
        console.error("Cart merge failed", err);
      }
    }

    mergeCart();
  }, [status]); // Trigger only on login

  return (
    <div>
      <Cart />
    </div>
  );
}
