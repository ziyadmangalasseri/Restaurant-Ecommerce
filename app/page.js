import SlideHero from "../components/SlideHero";

import ProductCategories from "../components/Category";
import Testimonial from "../components/Testimonial";
import About from "../components/About";
import NewArrivalsSection from "@/components/NewArrivalsSection";
import TopProductSection from "@/components/TopProductSection";

export default function Home() {
  return (
    <div className="bg-white">
      <SlideHero />
      <ProductCategories />
      <TopProductSection/>
     <NewArrivalsSection/>
      
      <About />x
      <Testimonial />
  
    </div>
  );
}
