import SlideHero from "./components/SlideHero";
import ShowFilteredProducts from "./components/ShowFilteredProducts";
import ProductCategories from "./components/Category";
import Testimonial from "./components/Testimonial";
import About from "./components/About";

export default function Home() {
  return (
    <div className="bg-white">
      <SlideHero />
      <ProductCategories />
      <ShowFilteredProducts productType={"NewArrival"} />
      <ShowFilteredProducts productType={"TopProduct"} />
      <About />
      <Testimonial />
  
    </div>
  );
}
