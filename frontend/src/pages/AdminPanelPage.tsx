import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { apiRequest } from "@/lib/api";
import { getAuthToken } from "@/lib/auth";
import { Shield, Users, Building2, Clock4 } from "lucide-react";

type DashboardTotals = {
  users: number;
  vendors: number;
  properties: number;
  pendingProperties: number;
};

type AdminUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "visitor" | "vendor" | "admin";
};

type AdminProperty = {
  id: string;
  title: string;
  city: string;
  isApproved: boolean;
  pricePerNight: number;
  vendorId: string;
};

const AdminPanelPage = () => {
  const token = getAuthToken();
  const [totals, setTotals] = useState<DashboardTotals | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [properties, setProperties] = useState<AdminProperty[]>([]);
  const [error, setError] = useState("");

  const loadData = async () => {
    if (!token) return;
    setError("");
    try {
      const [dashboard, usersData, propertiesData] = await Promise.all([
        apiRequest<{ totals: DashboardTotals }>("/api/admin/dashboard", { token }),
        apiRequest<{ users: AdminUser[] }>("/api/admin/users", { token }),
        apiRequest<{ properties: AdminProperty[] }>("/api/admin/properties", { token }),
      ]);

      setTotals(dashboard.totals);
      setUsers(usersData.users);
      setProperties(propertiesData.properties);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load admin data");
    }
  };

  useEffect(() => {
    void loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateUserRole = async (userId: string, role: AdminUser["role"]) => {
    if (!token) return;
    await apiRequest(`/api/admin/users/${userId}/role`, {
      method: "PATCH",
      token,
      body: { role },
    });
    await loadData();
  };

  const toggleApproval = async (propertyId: string, isApproved: boolean) => {
    if (!token) return;
    await apiRequest(`/api/admin/properties/${propertyId}/approval`, {
      method: "PATCH",
      token,
      body: { isApproved: !isApproved },
    });
    await loadData();
  };

  const deleteProperty = async (propertyId: string) => {
    if (!token) return;
    await apiRequest(`/api/admin/properties/${propertyId}`, {
      method: "DELETE",
      token,
    });
    await loadData();
  };

  const stats = totals
    ? [
        { label: "Users", value: totals.users, icon: Users },
        { label: "Vendors", value: totals.vendors, icon: Shield },
        { label: "Properties", value: totals.properties, icon: Building2 },
        { label: "Pending", value: totals.pendingProperties, icon: Clock4 },
      ]
    : [];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 sm:px-6 py-8 flex-1">
        <h1 className="text-3xl font-bold text-foreground">Admin Control Center</h1>
        <p className="text-muted-foreground mt-1">Manage users, approvals, and platform health.</p>

        {error && <p className="mt-3 text-sm text-destructive">{error}</p>}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <stat.icon className="h-4 w-4 text-primary" />
              </div>
              <p className="text-2xl font-bold mt-2">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
          <section className="rounded-2xl border border-border bg-card p-5">
            <h2 className="text-xl font-semibold mb-4">User Roles</h2>
            <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
              {users.map((user) => (
                <article key={user.id} className="border border-border rounded-xl p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold">{user.firstName} {user.lastName}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                    <select
                      value={user.role}
                      onChange={(e) => void updateUserRole(user.id, e.target.value as AdminUser["role"])}
                      className="rounded-lg border border-border bg-background px-2 py-1.5 text-sm"
                    >
                      <option value="visitor">visitor</option>
                      <option value="vendor">vendor</option>
                      <option value="admin">admin</option>
                    </select>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-5">
            <h2 className="text-xl font-semibold mb-4">Property Approvals</h2>
            <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
              {properties.map((property) => (
                <article key={property.id} className="border border-border rounded-xl p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{property.title}</p>
                      <p className="text-xs text-muted-foreground">{property.city} | Rs {property.pricePerNight}/night</p>
                    </div>
                    <button
                      onClick={() => void toggleApproval(property.id, property.isApproved)}
                      className={`text-xs rounded-full px-2.5 py-1.5 ${
                        property.isApproved
                          ? "bg-amber-100 text-amber-700"
                          : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {property.isApproved ? "Mark Pending" : "Approve"}
                    </button>
                    <button
                      onClick={() => void deleteProperty(property.id)}
                      className="text-xs rounded-full px-2.5 py-1.5 bg-rose-100 text-rose-700"
                    >
                      Delete
                    </button>
                  </div>
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

export default AdminPanelPage;
