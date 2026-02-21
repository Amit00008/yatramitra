import { Map, Hotel, Car, Coins } from "lucide-react";
import AnimateOnScroll from "./AnimateOnScroll";

const features = [
  {
    icon: Map,
    title: "Smart Search",
    description: "AI-powered destination discovery with real-time location tracking.",
  },
  {
    icon: Hotel,
    title: "Hotels",
    description: "Verified stays at best prices with automatic location detection.",
  },
  {
    icon: Car,
    title: "Ride Sharing",
    description: "Integrated Uber-style transport with live mapping.",
  },
  {
    icon: Coins,
    title: "Rewards",
    description: "Earn, level-up, withdraw real money for every booking.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <AnimateOnScroll className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Everything You Need
          </h2>
          <p className="text-muted-foreground">
            Tourism, transport, rewards — unified & secure
          </p>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {features.map((feature, i) => (
            <AnimateOnScroll key={feature.title} delay={i * 120} animation="animate-scale-in">
              <div className="group rounded-xl border border-border bg-card p-8 text-center transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 hover:border-primary/30">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-5 transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-110">
                  <feature.icon className="h-8 w-8 text-primary transition-transform duration-300 group-hover:scale-110" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
