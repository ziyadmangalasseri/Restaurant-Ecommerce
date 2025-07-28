import ShowFiltredProducts from "../components/ShowFilteredProducts";

export default function NewArrivalsSection() {
  return (
    <ShowFiltredProducts
      productType="NewArrival"
      subtitle="Discover the latest additions to our collection."
      limit={10}
      showViewAll={true}
      viewAllLink="/products"
      layoutType="slider"
    />
  );
}