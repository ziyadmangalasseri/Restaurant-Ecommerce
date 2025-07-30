import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import dbConnect from "@/lib/mongodb";
import Cart from "@/lib/models/Cart";

export async function POST(req) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    if (!session)
      return Response.json({ error: "Unauthorized" }, { status: 401 });

    const userId = session.user.id;
    const { guestCart } = await req.json();
    if (!Array.isArray(guestCart))
      return Response.json({ error: "Invalid cart" }, { status: 400 });

    let dbCart = await Cart.findOne({ userId });
    if (!dbCart) {
      dbCart = new Cart({ userId, items: [] });
    }

    for (let guestItem of guestCart) {
      if (!guestItem.productId) continue;

      const existingIndex = dbCart.items.findIndex(
        (item) => item.productId?.toString() === guestItem.productId?.toString()
      );

      if (existingIndex !== -1) {
        dbCart.items[existingIndex].quantity += guestItem.quantity;
      } else {
        dbCart.items.push({
          productId: guestItem.productId,
          name: guestItem.name,
          price: guestItem.price,
          image: guestItem.image,
          quantity: guestItem.quantity,
        });
      }
    }

    await dbCart.save();

    return Response.json({ message: "Cart merged", mergedCart: dbCart.items });
  } catch (err) {
    console.error("Merge Cart Error:", err);
    return Response.json({ error: "Merge failed" }, { status: 500 });
  }
}
