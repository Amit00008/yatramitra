import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { apiRequest } from "@/lib/api";
import { getAuthToken } from "@/lib/auth";
import { Building2, Send } from "lucide-react";

type VendorProperty = {
  id: string;
  title: string;
  propertyType: "hotel" | "homestay" | "hostel" | "resort";
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
  createdAt: string;
};

const emptyForm = {
  title: "",
  propertyType: "hotel",
  description: "",
  city: "",
  address: "",
  amenities: "",
  roomCount: "1",
  availableRooms: "1",
  checkInTime: "12:00",
  checkOutTime: "11:00",
  contactPhone: "",
  contactEmail: "",
  pricePerNight: "",
  imageUrl: "",
};

const VendorPanelPage = () => {
  const token = getAuthToken();
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [properties, setProperties] = useState<VendorProperty[]>([]);

  const loadMine = async () => {
    if (!token) return;
    try {
      const data = await apiRequest<{ properties: VendorProperty[] }>("/api/properties/mine", { token });
      setProperties(data.properties);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load properties");
    }
  };

  useEffect(() => {
    void loadMine();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!token) return;

    setLoading(true);
    setError("");
    setMessage("");

    try {
      await apiRequest("/api/properties", {
        method: "POST",
        token,
        body: {
          ...form,
          amenities: form.amenities
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
          roomCount: Number(form.roomCount),
          availableRooms: Number(form.availableRooms),
          pricePerNight: Number(form.pricePerNight),
          imageUrl: form.imageUrl || undefined,
          address: form.address || undefined,
          contactPhone: form.contactPhone || undefined,
          contactEmail: form.contactEmail || undefined,
        },
      });

      setMessage("Property submitted. It will be visible after admin approval.");
      setForm(emptyForm);
      await loadMine();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit property");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 sm:px-6 py-8 flex-1">
        <h1 className="text-3xl font-bold text-foreground mb-1">Vendor Panel</h1>
        <p className="text-muted-foreground mb-6">Post hotel properties and monitor approval status.</p>

        <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_1fr] gap-6">
          <form onSubmit={onSubmit} className="rounded-2xl border border-border bg-card p-5 space-y-4">
            <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <Send className="h-5 w-5 text-primary" />
              Post Property
            </h2>

            <input
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm"
              placeholder="Hotel / Property name"
            />
            <select
              value={form.propertyType}
              onChange={(e) => setForm((prev) => ({ ...prev, propertyType: e.target.value as typeof prev.propertyType }))}
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm"
            >
              <option value="hotel">Hotel</option>
              <option value="resort">Resort</option>
              <option value="homestay">Homestay</option>
              <option value="hostel">Hostel</option>
            </select>
            <textarea
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm min-h-28"
              placeholder="Detailed description (location, nearby places, room comfort, etc.)"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                value={form.city}
                onChange={(e) => setForm((prev) => ({ ...prev, city: e.target.value }))}
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm"
                placeholder="City"
              />
              <input
                value={form.address}
                onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))}
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm"
                placeholder="Address"
              />
            </div>
            <input
              value={form.amenities}
              onChange={(e) => setForm((prev) => ({ ...prev, amenities: e.target.value }))}
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm"
              placeholder="Amenities (comma separated): wifi, parking, breakfast, ac"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                value={form.roomCount}
                onChange={(e) => setForm((prev) => ({ ...prev, roomCount: e.target.value }))}
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm"
                placeholder="Total rooms"
                type="number"
                min={1}
              />
              <input
                value={form.availableRooms}
                onChange={(e) => setForm((prev) => ({ ...prev, availableRooms: e.target.value }))}
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm"
                placeholder="Available rooms"
                type="number"
                min={0}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                value={form.checkInTime}
                onChange={(e) => setForm((prev) => ({ ...prev, checkInTime: e.target.value }))}
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm"
                placeholder="Check-in time"
                type="time"
              />
              <input
                value={form.checkOutTime}
                onChange={(e) => setForm((prev) => ({ ...prev, checkOutTime: e.target.value }))}
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm"
                placeholder="Check-out time"
                type="time"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                value={form.contactPhone}
                onChange={(e) => setForm((prev) => ({ ...prev, contactPhone: e.target.value }))}
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm"
                placeholder="Contact phone"
                type="tel"
              />
              <input
                value={form.contactEmail}
                onChange={(e) => setForm((prev) => ({ ...prev, contactEmail: e.target.value }))}
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm"
                placeholder="Contact email"
                type="email"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                value={form.pricePerNight}
                onChange={(e) => setForm((prev) => ({ ...prev, pricePerNight: e.target.value }))}
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm"
                placeholder="Price per night"
                type="number"
                min={1}
              />
              <input
                value={form.imageUrl}
                onChange={(e) => setForm((prev) => ({ ...prev, imageUrl: e.target.value }))}
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm"
                placeholder="Image URL (optional)"
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}
            {message && <p className="text-sm text-emerald-600">{message}</p>}

            <button
              disabled={loading}
              className="rounded-lg bg-primary text-primary-foreground px-4 py-2.5 text-sm font-semibold disabled:opacity-60"
            >
              {loading ? "Submitting..." : "Submit Property"}
            </button>
          </form>

          <section className="rounded-2xl border border-border bg-card p-5">
            <h2 className="text-xl font-semibold text-foreground flex items-center gap-2 mb-4">
              <Building2 className="h-5 w-5 text-secondary" />
              My Listings
            </h2>
            <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
              {properties.length === 0 && <p className="text-sm text-muted-foreground">No properties yet.</p>}
              {properties.map((property) => (
                <article key={property.id} className="rounded-xl border border-border p-3">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-semibold text-foreground">{property.title}</h3>
                    <span
                      className={`text-xs rounded-full px-2 py-1 ${
                        property.isApproved
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {property.isApproved ? "Approved" : "Pending"}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 uppercase">{property.propertyType}</p>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{property.description}</p>
                  <p className="text-sm mt-2">
                    Rs {property.pricePerNight}/night | {property.availableRooms}/{property.roomCount} rooms
                  </p>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default VendorPanelPage;
