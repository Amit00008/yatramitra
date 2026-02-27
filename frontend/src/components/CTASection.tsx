import AnimateOnScroll from "./AnimateOnScroll";
import { useNavigate } from "react-router-dom";

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative bg-nav py-20 text-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/40 via-nav to-nav" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />

      <AnimateOnScroll className="relative z-10 container mx-auto px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-nav-foreground mb-3">
          Ready to Explore?
        </h2>
        <p className="text-nav-foreground/75 mb-8 max-w-lg mx-auto">
          Use our advanced search to find exactly what you need with vendor locations and availability.
        </p>
        <button
          onClick={() => navigate("/search")}
          className="inline-flex items-center gap-2 rounded-full bg-secondary px-8 py-3.5 text-base font-semibold text-secondary-foreground transition-colors duration-200 hover:bg-secondary/90 active:scale-95"
        >
          Launch Advanced Search
        </button>
      </AnimateOnScroll>
    </section>
  );
};

export default CTASection;
