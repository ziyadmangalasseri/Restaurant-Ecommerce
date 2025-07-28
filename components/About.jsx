import Image from "next/image";
import cheff from "@/public/image/user/cheff.png";

const About = () => {
  return (
    <div id="about" className="bg-[#1a2649]">
      <div className="max-w-6xl mx-auto px-4 py-20">
        {/* Header */}
        <h2 className="text-4xl text-white mb-12">
          About <span className="font-light">EASYEATS</span>
        </h2>

        {/* Content Grid */}
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Image */}
          <div className="rounded-lg overflow-hidden">
            <Image
              src={cheff}
              alt="Chef preparing food for EasyEats"
              className="w-full h-auto object-cover rounded-lg"
              width={600}
              height={400}
              layout="responsive"
            />
          </div>

          {/* Text Content */}
          <div className="text-white space-y-6">
            <p className="text-lg">
              EasyEats is an online food ordering platform designed to make dining simple and
              convenient for everyone. At EasyEats, customers can explore a wide
              range of cuisines—from delicious appetizers and main courses to sweet
              desserts—all from the comfort of their homes. With a
              user-friendly website and secure payment options, EasyEats ensures
              a smooth ordering experience. Fast delivery, reliable customer
              support, and high-quality meals are what make EasyEats a trusted
              choice for food lovers. Whether you’re craving something
              savory or something sweet, EasyEats has it all in one place.
            </p>

            <p className="text-lg">
              EasyEats is your go-to online platform for delicious and affordable
              meals. We offer a smooth ordering experience with fast delivery
              and secure payments. From gourmet dishes to everyday comfort food, everything
              is just a click away. Eat smart, eat easy — only at EasyEats!
            </p>

            <button className="mt-6 px-6 py-2 border border-white text-white hover:bg-white hover:text-[#1a2649] transition-colors duration-300 inline-flex items-center group">
              Learn more
              <svg
                className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Features Section - Full Width White Background */}
      <div className="w-full bg-white">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-3 gap-8">
            <div className="text-center text-[#1a2649]">
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
            </div>
            <div className="text-center text-[#1a2649]">
              <h3 className="text-xl font-semibold mb-2">Affordable Price</h3>
            </div>
            <div className="text-center text-[#1a2649]">
              <h3 className="text-xl font-semibold mb-2">Quality Guaranteed</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;