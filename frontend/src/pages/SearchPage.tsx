import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { Plane, Train, Search, LogOut } from "lucide-react";
import { apiRequest } from "@/lib/api";
import { clearAuthSession, getAuthToken, getAuthUser } from "@/lib/auth";
import { useNavigate } from "react-router-dom";

type FlightResult = {
  airline: string;
  flightNumber: string;
  departureAirport: string;
  arrivalAirport: string;
  departureTime: string | null;
  arrivalTime: string | null;
  status: string;
};

type TrainResult = {
  from: string;
  to: string;
  departure: string | null;
  arrival: string | null;
  duration: string;
  transfers: number;
  service: string;
};

const tabs = [
  { id: "flights", label: "Flights", icon: Plane },
  { id: "trains", label: "Trains", icon: Train },
];

const inputClass =
  "w-full rounded-lg border border-border bg-muted px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all";

const formatDateTime = (value: string | null) => {
  if (!value) return "N/A";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
};

const SearchPage = () => {
  const navigate = useNavigate();
  const authUser = getAuthUser();
  const token = getAuthToken();

  const [activeTab, setActiveTab] = useState("flights");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [provider, setProvider] = useState("");
  const [providerNote, setProviderNote] = useState("");
  const [flightResults, setFlightResults] = useState<FlightResult[]>([]);
  const [trainResults, setTrainResults] = useState<TrainResult[]>([]);

  const [flightForm, setFlightForm] = useState({
    from: "DEL",
    to: "BOM",
    date: "2026-03-01",
  });
  const [trainForm, setTrainForm] = useState({
    from: "Zurich",
    to: "Bern",
    date: "2026-03-01",
    time: "10:00",
  });

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [navigate, token]);

  const handleSearch = async () => {
    setError("");
    setLoading(true);

    try {
      if (activeTab === "flights") {
        const params = new URLSearchParams(flightForm).toString();
        const data = await apiRequest<{ provider: string; note?: string; results: FlightResult[] }>(
          `/api/search/flights?${params}`,
          { token },
        );
        setProvider(data.provider);
        setProviderNote(data.note || "");
        setFlightResults(data.results);
      } else {
        const params = new URLSearchParams(trainForm).toString();
        const data = await apiRequest<{ provider: string; results: TrainResult[] }>(
          `/api/search/trains?${params}`,
          { token },
        );
        setProvider(data.provider);
        setProviderNote("");
        setTrainResults(data.results);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearAuthSession();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <div className="bg-nav py-6 sm:py-10 px-4 sm:px-6">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-nav-foreground mb-1 sm:mb-2">
              Travel Search Dashboard
            </h1>
            <p className="text-sm sm:text-base text-nav-foreground/70">
              Search flights and train services through live APIs
            </p>
          </div>
          <div className="flex items-center gap-3">
            <p className="text-sm text-nav-foreground/80">
              {authUser ? `${authUser.firstName} ${authUser.lastName}` : "Guest"}
            </p>
            <button
              onClick={handleLogout}
              className="rounded-lg border border-nav-foreground/40 px-3 py-2 text-sm text-nav-foreground hover:bg-nav-foreground/10 flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-3 sm:px-6 -mt-4 flex-1">
        <div className="bg-card rounded-xl border border-border shadow-lg p-4 sm:p-6">
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

          {activeTab === "flights" ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="From airport IATA (e.g. DEL)"
                  value={flightForm.from}
                  onChange={(e) => setFlightForm((prev) => ({ ...prev, from: e.target.value.toUpperCase() }))}
                  className={inputClass}
                />
                <input
                  type="text"
                  placeholder="To airport IATA (e.g. BOM)"
                  value={flightForm.to}
                  onChange={(e) => setFlightForm((prev) => ({ ...prev, to: e.target.value.toUpperCase() }))}
                  className={inputClass}
                />
                <input
                  type="date"
                  value={flightForm.date}
                  onChange={(e) => setFlightForm((prev) => ({ ...prev, date: e.target.value }))}
                  className={inputClass}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="From station/city"
                  value={trainForm.from}
                  onChange={(e) => setTrainForm((prev) => ({ ...prev, from: e.target.value }))}
                  className={inputClass}
                />
                <input
                  type="text"
                  placeholder="To station/city"
                  value={trainForm.to}
                  onChange={(e) => setTrainForm((prev) => ({ ...prev, to: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="date"
                  value={trainForm.date}
                  onChange={(e) => setTrainForm((prev) => ({ ...prev, date: e.target.value }))}
                  className={inputClass}
                />
                <input
                  type="time"
                  value={trainForm.time}
                  onChange={(e) => setTrainForm((prev) => ({ ...prev, time: e.target.value }))}
                  className={inputClass}
                />
              </div>
            </div>
          )}

          <button
            onClick={handleSearch}
            disabled={loading}
            className="w-full mt-4 rounded-lg bg-secondary py-3.5 text-base font-semibold text-secondary-foreground transition-colors duration-200 hover:bg-secondary/90 active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-70"
          >
            <Search className="h-5 w-5" />
            {loading ? "Searching..." : `Search ${activeTab === "flights" ? "Flights" : "Trains"}`}
          </button>

          {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
          {provider && <p className="mt-4 text-xs text-muted-foreground">Provider: {provider}</p>}
          {providerNote && <p className="mt-1 text-xs text-muted-foreground">{providerNote}</p>}

          {activeTab === "flights" && flightResults.length > 0 && (
            <div className="mt-5 space-y-3">
              {flightResults.map((item, index) => (
                <div key={`${item.flightNumber}-${index}`} className="rounded-lg border border-border p-4">
                  <p className="font-semibold">{item.airline} ({item.flightNumber})</p>
                  <p className="text-sm text-muted-foreground">
                    {item.departureAirport} to {item.arrivalAirport}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Departure: {formatDateTime(item.departureTime)} | Arrival: {formatDateTime(item.arrivalTime)}
                  </p>
                  <p className="text-sm">Status: {item.status}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === "trains" && trainResults.length > 0 && (
            <div className="mt-5 space-y-3">
              {trainResults.map((item, index) => (
                <div key={`${item.from}-${item.to}-${index}`} className="rounded-lg border border-border p-4">
                  <p className="font-semibold">{item.service}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.from} to {item.to}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Departure: {formatDateTime(item.departure)} | Arrival: {formatDateTime(item.arrival)}
                  </p>
                  <p className="text-sm">Duration: {item.duration} | Transfers: {item.transfers}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="h-12" />
      <Footer />
    </div>
  );
};

export default SearchPage;
