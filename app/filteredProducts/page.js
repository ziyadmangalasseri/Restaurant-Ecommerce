"use client";

import { useSearchParams } from "next/navigation";
import ShowFiltredProducts from "../components/ShowFilteredProducts";

export default function FilteredProductsPage(){
    const searchParams = useSearchParams();
    const category = searchParams.get("category");

    return(
        <div className="bg-white mt-[100px]">
            <ShowFiltredProducts category={category}/>
        </div>
    )
}