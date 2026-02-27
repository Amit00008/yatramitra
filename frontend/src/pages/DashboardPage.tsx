import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { apiRequest } from "@/lib/api";
import { getAuthToken, getAuthUser } from "@/lib/auth";
import { LayoutDashboard, Heart, Building2 } from "lucide-react";

type Property = {
  id: string;
  title: string;
  city: string;
  pricePerNight: number;
  isApproved: boolean;
  likeCount?: number;
  likedByMe?: boolean;
};

const DashboardPage = () => {
  const token = useMemo(() => getAuthToken(), []);
  const user = useMemo(() => getAuthUser(), []);
  const [items, setItems] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      if (!token || !user) return;
      setLoading(true);
      setError("");
      try {
        if (user.role === "vendor" || user.role === "admin") {
          const data = await apiRequest<{ properties: Property[] }>("/api/properties/mine", { token });
          setItems(data.properties);
        } else {
          const data = await apiRequest<{ properties: Property[] }>("/api/properties", { token });
          setItems(data.properties.filter((p) => p.likedByMe));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const headerTitle = useMemo(() => {
    if (!user) return "Dashboard";
    if (user.role === "vendor") return "Vendor Dashboard";
    if (user.role === "admin") return "Admin Dashboard";
    return "Traveler Dashboard";
  }, [user]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 sm:px-6 py-8 flex-1">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <LayoutDashboard className="h-7 w-7 text-primary" />
          {headerTitle}
        </h1>
        <p className="text-muted-foreground mt-1">
          {user?.role === "visitor"
            ? "See properties you liked."
            : "See property applications and approval status."}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
          <div className="rounded-xl border border-border p-4 bg-card">
            <p className="text-sm text-muted-foreground">
              {user?.role === "visitor" ? "Liked Properties" : "Applied Properties"}
            </p>
            <p className="text-2xl font-bold mt-1">{items.length}</p>
          </div>
          <div className="rounded-xl border border-border p-4 bg-card">
            <p className="text-sm text-muted-foreground">Approved</p>
            <p className="text-2xl font-bold mt-1">{items.filter((i) => i.isApproved).length}</p>
          </div>
          <div className="rounded-xl border border-border p-4 bg-card">
            <p className="text-sm text-muted-foreground">Pending</p>
            <p className="text-2xl font-bold mt-1">{items.filter((i) => !i.isApproved).length}</p>
          </div>
        </div>

        {loading && <p className="mt-6 text-muted-foreground">Loading dashboard...</p>}
        {error && <p className="mt-6 text-destructive">{error}</p>}

        {!loading && !error && (
          <div className="mt-6 space-y-3">
            {items.length === 0 && <p className="text-muted-foreground">No items yet.</p>}
            {items.map((item) => (
              <article key={item.id} className="rounded-xl border border-border p-4 bg-card">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-secondary" />
                      {item.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {item.city} | Rs {item.pricePerNight}/night
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {typeof item.likeCount === "number" && (
                      <span className="text-xs rounded-full border border-border px-2 py-1 inline-flex items-center gap-1">
                        <Heart className="h-3 w-3" /> {item.likeCount}
                      </span>
                    )}
                    <span
                      className={`text-xs rounded-full px-2 py-1 ${
                        item.isApproved ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {item.isApproved ? "Approved" : "Pending"}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default DashboardPage;
