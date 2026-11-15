import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Briefcase,
  CheckCircle2,
  IndianRupee,
  Mail,
  ShoppingBag,
  Users,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import { StatusBadge } from "../../components/dashboard/StatusBadge";
import { Loader } from "../../components/common/Loader";
import { formatDate } from "../../utils/formatters";
import { roleLabel } from "../../utils/permissions";

function StatCard({ label, value, hint, icon: Icon, accent }) {
  return (
    <div className="p-6 rounded-3xl bg-deep-coffee/80 border border-champagne/20 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${accent}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <h3 className="text-xs font-bold uppercase tracking-wider text-warm-grey">{label}</h3>
      <p className="text-2xl font-serif font-bold text-light-text mt-1">{value}</p>
      {hint && <p className="text-[11px] text-warm-grey/70 mt-1">{hint}</p>}
    </div>
  );
}

export default function Overview() {
  const { user } = useAuth();
  const { dashboard, orders, loading } = useData();

  const stats = useMemo(() => {
    const data = dashboard || {};
    return [
      {
        label: "Total Customers",
        value: Number(data.totalCustomers || 0).toLocaleString(),
        hint: "Registered customer records",
        icon: Users,
        accent: "bg-champagne/15 border border-champagne/30 text-champagne",
      },
      {
        label: "Enquiries",
        value: Number(data.totalEnquiries || 0).toLocaleString(),
        hint: `${Number(data.newEnquiries || 0)} awaiting first contact`,
        icon: Mail,
        accent: "bg-caramel/20 border border-caramel/30 text-caramel",
      },
      {
        label: "Orders",
        value: Number(data.totalOrders || 0).toLocaleString(),
        hint: `${Number(data.pendingOrders || 0)} pending processing`,
        icon: ShoppingBag,
        accent: "bg-champagne/15 border border-champagne/30 text-champagne",
      },
      {
        label: "Completed Revenue",
        value: `₹${Number(data.revenue || 0).toLocaleString("en-IN")}`,
        hint: `${Number(data.completedProjects || 0)} delivered projects`,
        icon: IndianRupee,
        accent: "bg-green-500/15 border border-green-500/30 text-green-400",
      },
    ];
  }, [dashboard]);

  const statusCounts = useMemo(() => {
    const counts = {};
    for (const order of orders || []) {
      counts[order.status] = (counts[order.status] || 0) + 1;
    }
    return counts;
  }, [orders]);

  const recentOrders = (orders || []).slice(0, 6);
  const isInitialLoading = !dashboard && loading.dashboard;

  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-serif font-bold text-light-text">
            Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}
          </h2>
          <p className="text-xs sm:text-sm text-warm-grey mt-1">
            Live overview for <span className="text-champagne font-semibold">{roleLabel(user?.role)}</span> access.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/dashboard/orders"
            className="px-4 py-2 rounded-xl border border-champagne/30 bg-deep-coffee text-light-text text-xs font-semibold hover:border-champagne hover:text-champagne transition-colors inline-flex items-center gap-1.5"
          >
            <span>Orders</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            to="/dashboard/contacts"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-champagne to-caramel text-espresso text-xs font-bold shadow hover:shadow-glow-gold transition-all inline-flex items-center gap-1.5"
          >
            <span>Enquiries</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {isInitialLoading ? (
        <div className="py-20">
          <Loader size="lg" text="Loading dashboard metrics..." />
        </div>
      ) : (
        <>
          {/* Key Metric Cards */}
          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Recent Orders Table */}
            <div className="lg:col-span-2 bg-deep-coffee/80 backdrop-blur-xl rounded-3xl border border-champagne/20 p-6 md:p-8 shadow-xl">
              <div className="flex items-center justify-between mb-5 border-b border-white/10 pb-3">
                <h3 className="text-base font-serif font-bold text-light-text">Recent Orders</h3>
                <Link
                  to="/dashboard/orders"
                  className="text-xs text-champagne font-semibold hover:text-light-gold inline-flex items-center gap-1"
                >
                  <span>View All</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>

              {recentOrders.length === 0 ? (
                <div className="py-10 text-center">
                  <Briefcase className="w-10 h-10 text-warm-grey/40 mx-auto mb-3" />
                  <p className="text-xs text-warm-grey">No client orders recorded yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-white/10 text-warm-grey uppercase tracking-wider text-[10px]">
                        <th className="pb-3 font-semibold">Order</th>
                        <th className="pb-3 font-semibold">Customer</th>
                        <th className="pb-3 font-semibold">Amount</th>
                        <th className="pb-3 font-semibold">Created</th>
                        <th className="pb-3 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order) => (
                        <tr key={order.id} className="border-b border-white/5 last:border-0">
                          <td className="py-3">
                            <p className="font-semibold text-light-text">{order.orderNumber}</p>
                            <p className="text-[11px] text-warm-grey">{order.projectTitle}</p>
                          </td>
                          <td className="py-3 text-warm-grey">{order.customerName || "—"}</td>
                          <td className="py-3 font-serif font-bold text-champagne">
                            {order.currency || "INR"} {Number(order.amount || 0).toLocaleString()}
                          </td>
                          <td className="py-3 text-warm-grey">{formatDate(order.createdAt)}</td>
                          <td className="py-3"><StatusBadge value={order.status} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Status Breakdown & Health */}
            <div className="space-y-6">
              <div className="bg-deep-coffee/80 backdrop-blur-xl rounded-3xl border border-champagne/20 p-6 shadow-xl">
                <h3 className="text-base font-serif font-bold text-light-text mb-4 border-b border-white/10 pb-2">
                  Order Status Breakdown
                </h3>
                {Object.keys(statusCounts).length === 0 ? (
                  <p className="text-xs text-warm-grey">No order data available yet.</p>
                ) : (
                  <div className="space-y-3">
                    {Object.entries(statusCounts).map(([status, count]) => (
                      <div key={status}>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="capitalize text-warm-grey">{status.replace(/_/g, " ")}</span>
                          <span className="font-bold text-light-text">{count}</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-espresso overflow-hidden border border-white/5">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-champagne to-caramel"
                            style={{ width: `${Math.max(6, (count / Math.max(1, orders.length)) * 100)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-gradient-to-br from-[#2E1A11] to-[#1F120B] border border-champagne/30 text-light-text rounded-3xl p-6 shadow-xl">
                <CheckCircle2 className="w-8 h-8 mb-3 text-champagne" />
                <h3 className="text-base font-serif font-bold mb-1">Platform Service Health</h3>
                <p className="text-xs text-warm-grey leading-relaxed">
                  {Number(dashboard?.activeServices || 0)} live services currently active and public on GrowthVerse.
                </p>
                <Link
                  to="/dashboard/services"
                  className="inline-flex items-center gap-1 mt-4 text-xs font-bold text-champagne hover:text-light-gold"
                >
                  <span>Manage active catalog</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
