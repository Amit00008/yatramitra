import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";
import { Hotel, Car, MapPin, Search } from "lucide-react";

const tabs = [
  { id: "hotels", label: "Hotels", icon: Hotel },
  { id: "rides", label: "Ride Sharing", icon: Car },
  { id: "cars", label: "Car Rentals", icon: Car },
  { id: "destinations", label: "Destinations", icon: MapPin },
];

const inputClass =
  "w-full rounded-lg border border-border bg-muted px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all";

const HotelsForm = () => (
  <div className="space-y-4">
    <input type="text" placeholder="Enter city, area, or address" className={inputClass} />
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <input type="date" defaultValue="2026-02-21" className={inputClass} />
      <input type="date" defaultValue="2026-02-22" className={inputClass} />
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <select className={inputClass} defaultValue="2">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <option key={n} value={n}>{n} {n === 1 ? "Guest" : "Guests"}</option>
        ))}
      </select>
      <select className={inputClass} defaultValue="1">
        {[1, 2, 3, 4, 5].map((n) => (
          <option key={n} value={n}>{n} {n === 1 ? "Room" : "Rooms"}</option>
        ))}
      </select>
    </div>
  </div>
);

const RidesForm = () => (
  <div className="space-y-4">
    <input type="text" placeholder="Pickup location" className={inputClass} />
    <input type="text" placeholder="Drop-off location" className={inputClass} />
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <input type="date" defaultValue="2026-02-21" className={inputClass} />
      <input type="time" defaultValue="10:00" className={inputClass} />
    </div>
    <select className={inputClass} defaultValue="car">
      <option value="car">Car</option>
      <option value="bike">Bike</option>
      <option value="taxi">Taxi</option>
      <option value="auto">Auto Rickshaw</option>
    </select>
    <select className={inputClass} defaultValue="1">
      {[1, 2, 3, 4].map((n) => (
        <option key={n} value={n}>{n} {n === 1 ? "Passenger" : "Passengers"}</option>
      ))}
    </select>
  </div>
);

const CarsForm = () => (
  <div className="space-y-4">
    <input type="text" placeholder="Pickup location" className={inputClass} />
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label className="text-xs text-muted-foreground mb-1 block">Pickup Date</label>
        <input type="date" defaultValue="2026-02-21" className={inputClass} />
      </div>
      <div>
        <label className="text-xs text-muted-foreground mb-1 block">Return Date</label>
        <input type="date" defaultValue="2026-02-23" className={inputClass} />
      </div>
    </div>
    <select className={inputClass} defaultValue="sedan">
      <option value="sedan">Sedan</option>
      <option value="suv">SUV</option>
      <option value="hatchback">Hatchback</option>
      <option value="luxury">Luxury</option>
      <option value="minivan">Minivan</option>
    </select>
  </div>
);

const DestinationsForm = () => (
  <div className="space-y-4">
    <input type="text" placeholder="Search destinations, attractions, or activities" className={inputClass} />
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <select className={inputClass} defaultValue="all">
        <option value="all">All Categories</option>
        <option value="beaches">Beaches</option>
        <option value="mountains">Mountains</option>
        <option value="heritage">Heritage Sites</option>
        <option value="wildlife">Wildlife</option>
        <option value="adventure">Adventure</option>
      </select>
      <select className={inputClass} defaultValue="popular">
        <option value="popular">Most Popular</option>
        <option value="rating">Highest Rated</option>
        <option value="nearest">Nearest First</option>
        <option value="budget">Budget Friendly</option>
      </select>
    </div>
  </div>
);

const formComponents: Record<string, React.FC> = {
  hotels: HotelsForm,
  rides: RidesForm,
  cars: CarsForm,
  destinations: DestinationsForm,
};

const SearchPage = () => {
  const [activeTab, setActiveTab] = useState("hotels");
  const ActiveForm = formComponents[activeTab];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* Hero header */}
      <div className="bg-nav py-6 sm:py-10 px-4 sm:px-6">
        <div className="container mx-auto">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-nav-foreground mb-1 sm:mb-2">
            Search All Services in One Place
          </h1>
          <p className="text-sm sm:text-base text-nav-foreground/70">
            Find hotels, rides, cars, and destinations with real-time availability
          </p>
        </div>
      </div>

      {/* Search Card */}
      <div className="container mx-auto px-3 sm:px-6 -mt-4 flex-1">
        <div className="bg-card rounded-xl border border-border shadow-lg p-4 sm:p-6">
          {/* Tabs */}
          <div className="flex border-b border-border mb-4 sm:mb-6 overflow-x-auto -mx-4 sm:-mx-0 px-4 sm:px-0 scrollbar-none">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-medium transition-colors duration-200 border-b-2 -mb-px whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <tab.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Dynamic Form */}
          <ActiveForm />

          {/* Map */}
          <div className="rounded-xl overflow-hidden border border-border h-[200px] sm:h-[300px] mt-4">
            <iframe
              title="Map"
              src="https://www.openstreetmap.org/export/embed.html?bbox=72.7,18.85,73.1,19.3&layer=mapnik"
              className="h-full w-full border-0"
              loading="lazy"
            />
          </div>

          {/* Search Button */}
          <button className="w-full mt-4 rounded-lg bg-secondary py-3.5 text-base font-semibold text-secondary-foreground transition-colors duration-200 hover:bg-secondary/90 active:scale-[0.99] flex items-center justify-center gap-2">
            <Search className="h-5 w-5" />
            Search Available Services
          </button>
        </div>
      </div>

      <div className="h-12" />
      <Footer />
    </div>
  );
};

export default SearchPage;
