import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { apiRequest } from "@/lib/api";
import { getAuthToken, getAuthUser } from "@/lib/auth";
import { Heart, MapPin, Building2 } from "lucide-react";

type Property = {
  id: string;
  title: string;
  propertyType: string;
  description: string;
  city: string;
  address?: string;
  amenities: string[];
  roomCount: number;
  availableRooms: number;
  checkInTime: string;
  checkOutTime: string;
  contactPhone?: string;
  contactEmail?: string;
  pricePerNight: number;
  imageUrl?: string;
  isApproved: boolean;
  likeCount: number;
  likedByMe: boolean;
  vendor: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
};

const PropertiesPage = () => {
  const token = getAuthToken();
  const user = getAuthUser();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProperties = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await apiRequest<{ properties: Property[] }>("/api/properties", { token });
      setProperties(data.properties);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load properties");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadProperties();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleLike = async (property: Property) => {
    if (!token) return;

    if (property.likedByMe) {
      await apiRequest(`/api/properties/${property.id}/like`, {
        method: "DELETE",
        token,
      });
    } else {
      await apiRequest(`/api/properties/${property.id}/like`, {
        method: "POST",
        token,
      });
    }

    setProperties((prev) =>
      prev.map((item) =>
        item.id === property.id
          ? {
              ...item,
              likedByMe: !item.likedByMe,
              likeCount: item.likedByMe ? item.likeCount - 1 : item.likeCount + 1,
            }
          : item,
      ),
    );
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 sm:px-6 py-8 flex-1">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Building2 className="h-7 w-7 text-primary" />
            Curated Stays
          </h1>
          <p className="text-muted-foreground mt-1">Discover approved properties posted by local vendors.</p>
        </div>

        {loading && <p className="text-muted-foreground">Loading properties...</p>}
        {error && <p className="text-destructive">{error}</p>}

        {!loading && !error && properties.length === 0 && (
          <p className="text-muted-foreground">No approved properties yet. Check back soon.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {properties.map((property) => (
            <article key={property.id} className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
              <div className="h-44 bg-muted">
                {property.imageUrl ? (
                  <img src={property.imageUrl} alt={property.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-muted-foreground text-sm">
                    No image
                  </div>
                )}
              </div>
              <div className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-lg font-semibold text-foreground">{property.title}</h2>
                  <button
                    onClick={() => toggleLike(property)}
                    disabled={!token || user?.role === "vendor"}
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs border transition-colors ${
                      property.likedByMe
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:text-foreground"
                    } disabled:opacity-60`}
                  >
                    <Heart className={`h-3.5 w-3.5 ${property.likedByMe ? "fill-current" : ""}`} />
                    {property.likeCount}
                  </button>
                </div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">{property.propertyType}</p>
                <p className="text-sm text-muted-foreground line-clamp-2">{property.description}</p>
                <p className="text-sm text-foreground flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-secondary" />
                  {property.city}
                  {property.address ? `, ${property.address}` : ""}
                </p>
                <p className="text-xs text-muted-foreground">
                  Rooms: {property.availableRooms}/{property.roomCount} | Check-in {property.checkInTime} | Check-out{" "}
                  {property.checkOutTime}
                </p>
                {property.amenities?.length > 0 && (
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    Amenities: {property.amenities.join(", ")}
                  </p>
                )}
                <p className="text-sm font-semibold text-foreground">Rs {property.pricePerNight}/night</p>
              </div>
            </article>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PropertiesPage;
