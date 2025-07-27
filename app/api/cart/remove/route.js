// app/api/cart/remove/route.js
import dbConnect from "@/lib/mongodb";
import Cart from "@/lib/models/Cart";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(req) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { productId } = await req.json();

    // Validate input
    if (!productId) {
      return Response.json({ error: "Product ID is required" }, { status: 400 });
    }

    // Find user's cart
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return Response.json({ error: "Cart not found" }, { status: 404 });
    }

    // Check if item exists in cart
    const itemExists = cart.items.some(
      (item) => item.productId.toString() === productId.toString()
    );

    if (!itemExists) {
      return Response.json({ error: "Item not found in cart" }, { status: 404 });
    }

    // Remove item from cart
    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId.toString()
    );

    await cart.save();

    return Response.json({ 
      message: "Item removed from cart successfully",
      cartItemsCount: cart.items.length
    });

  } catch (err) {
    console.error("Remove Cart Item Error:", err);
    return Response.json({ error: "Failed to remove item from cart" }, { status: 500 });
  }
}
