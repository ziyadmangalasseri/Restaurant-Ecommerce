import React from "react";
import dbConnect from "@/lib/mongodb";
import productModel from "@/lib/models/Product";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ShoppingBag, Heart, Star } from "lucide-react";
import Link from "next/link";

export async function generateMetadata({ params }) {
  await dbConnect();
  const product = await productModel.findOne({ slug: params.slug });

  return {
    title: product ? product.name : "Product Not Found",
    description: product ? product.description : "Product not found",
  };
}

export default async function ProductPage({ params }) {
  await dbConnect();
  const product = await productModel.findOne({ slug: params.slug });

  if (!product) return notFound();

  return (
    <section className="w-full mx-auto px-4 py-20 bg-white">
      <div className=" max-w-7xl  flex justify- gap-10 py-10 items-center ">
        <div className="flex flex-col items-center justify-center">
        <div className="relative w-full h-56 md:h-96 aspect-square rounded-lg overflow-hidden">
          <Image
            src={product.image || "/image/product.jpeg"}
            alt={product.name}
            fill
            className="object-contain"
          />
        </div>
        <div className="flex gap-4 mt-6">
            <button className="flex items-center px-4 py-2 bg-[#1a2649] text-white rounded-lg hover:bg-[#0f1a33] transition">
              <ShoppingBag className="w-5 h-5 mr-2" /> Add to Cart
            </button>
            <button className="flex items-center px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100 transition">
              <Heart className="w-5 h-5 mr-2" /> Add to Wishlist
            </button>
          </div>
        </div>
       

        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-[#1a2649]">{product.name}</h1>
          <p className="text-gray-600 text-sm">{product.description}</p>

          <div className="flex items-center text-sm text-gray-700">
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500 mr-2" />
            {product.rating || 4.5} / 5 stars
          </div>

          <div className="flex items-baseline gap-4">
            <span className="text-2xl font-bold text-[#1a2649]">
              ${product.price}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-base line-through text-gray-500">
                ${product.originalPrice}
              </span>
            )}
          </div>

          <div className="mt-6 text-sm text-gray-500">
            <p><strong>Brand:</strong> {product.brand}</p>
            <p><strong>Color:</strong> {product.color}</p>
            <p><strong>Stock:</strong> {product.stock > 0 ? `${product.stock} available` : 'Out of Stock'}</p>
          </div>

          <div className="mt-5 text-sm text-gray-500">
            <p><strong>Description:</strong>{product.description}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
