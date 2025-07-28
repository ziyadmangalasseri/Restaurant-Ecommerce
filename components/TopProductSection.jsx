import ShowFiltredProducts from "../components/ShowFilteredProducts";

export default function TopProductSection() {
  return (
    <ShowFiltredProducts
     productType={"TopProduct"}
      limit={10}
      showViewAll={true}
      viewAllLink="/products"
      layoutType="grid"
    />
  );
}