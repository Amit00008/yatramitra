import heroBg from "@/assets/hero-bg.jpg";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative flex items-center justify-center py-28 md:py-36 overflow-hidden">
      <img
        src={heroBg}
        alt="Scenic green landscape"
        className="absolute inset-0 h-full w-full object-cover scale-105 will-change-transform"
        style={{ animation: "slowZoom 25s ease-in-out infinite alternate" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--hero-overlay)/0.75)] via-[hsl(var(--hero-overlay)/0.55)] to-[hsl(var(--hero-overlay)/0.80)]" />

      <div className="relative z-10 text-center px-6 animate-fade-in-up">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-5 leading-tight drop-shadow-lg">
          Discover Amazing Places & Earn Rewards
        </h1>
        <p className="text-lg md:text-xl text-primary-foreground/85 mb-10 max-w-2xl mx-auto drop-shadow-md">
          Plan trips, book hotels, rides, earn points and withdraw cash — all in one platform.
        </p>
        <button
          onClick={() => navigate("/search")}
          className="inline-flex items-center gap-2 rounded-full bg-secondary px-8 py-3.5 text-base font-semibold text-secondary-foreground transition-colors duration-200 hover:bg-secondary/90 active:scale-95"
        >
          Start Advanced Search
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
