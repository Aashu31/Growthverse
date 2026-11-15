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
    <div className="card-premium p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${accent}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
      <h3 className="text-sm font-medium text-secondary-text dark:text-gray-400">{label}</h3>
      <p className="text-2xl font-bold text-primary-text dark:text-white mt-1">{value}</p>
      {hint && <p className="text-xs text-secondary-text dark:text-gray-500 mt-1">{hint}</p>}
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
        label: "Total customers",
        value: Number(data.totalCustomers || 0).toLocaleString(),
        hint: "Registered customer records",
        icon: Users,
        accent: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
      },
      {
        label: "Enquiries",
        value: Number(data.totalEnquiries || 0).toLocaleString(),
        hint: `${Number(data.newEnquiries || 0)} awaiting first contact`,
        icon: Mail,
        accent: "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
      },
      {
        label: "Orders",
        value: Number(data.totalOrders || 0).toLocaleString(),
        hint: `${Number(data.pendingOrders || 0)} pending`,
        icon: ShoppingBag,
        accent: "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400",
      },
      {
        label: "Completed revenue",
        value: `₹${Number(data.revenue || 0).toLocaleString("en-IN")}`,
        hint: `${Number(data.completedProjects || 0)} published projects`,
        icon: IndianRupee,
        accent: "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400",
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
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-h2 text-primary-text dark:text-white">
            Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}
          </h2>
          <p className="text-secondary-text dark:text-gray-300 mt-1">
            Live overview for {roleLabel(user?.role)} access.
          </p>
        </div>
        <div className="flex gap-3">
          <Link to="/dashboard/orders" className="px-4 py-2 rounded-xl border border-border dark:border-gray-700 bg-white dark:bg-dark-secondary text-primary-text dark:text-white text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors inline-flex items-center gap-2">
            Orders <ArrowUpRight className="h-4 w-4" />
          </Link>
          <Link to="/dashboard/contacts" className="btn-primary text-sm px-4 py-2 inline-flex items-center gap-2">
            Enquiries <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {isInitialLoading ? (
        <div className="py-20">
          <Loader size="lg" text="Loading dashboard..." />
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white dark:bg-dark-secondary rounded-3xl border border-border dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-semibold text-primary-text dark:text-white">Recent orders</h3>
                <Link to="/dashboard/orders" className="text-sm text-forest-dark dark:text-forest-light font-medium hover:underline">
                  View all
                </Link>
              </div>
              {recentOrders.length === 0 ? (
                <div className="py-10 text-center">
                  <Briefcase className="h-10 w-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-sm text-secondary-text dark:text-gray-400">No orders have been created yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-border dark:border-gray-700 text-secondary-text dark:text-gray-400">
                        <th className="pb-3 font-medium">Order</th>
                        <th className="pb-3 font-medium">Customer</th>
                        <th className="pb-3 font-medium">Amount</th>
                        <th className="pb-3 font-medium">Created</th>
                        <th className="pb-3 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order) => (
                        <tr key={order.id} className="border-b border-border dark:border-gray-700 last:border-0">
                          <td className="py-3">
                            <p className="font-medium text-primary-text dark:text-white">{order.orderNumber}</p>
                            <p className="text-xs text-secondary-text dark:text-gray-500">{order.projectTitle}</p>
                          </td>
                          <td className="py-3 text-secondary-text dark:text-gray-300">{order.customerName || "—"}</td>
                          <td className="py-3 text-primary-text dark:text-white font-medium">
                            {order.currency || "INR"} {Number(order.amount || 0).toLocaleString()}
                          </td>
                          <td className="py-3 text-secondary-text dark:text-gray-400">{formatDate(order.createdAt)}</td>
                          <td className="py-3"><StatusBadge value={order.status} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="bg-white dark:bg-dark-secondary rounded-3xl border border-border dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-primary-text dark:text-white mb-4">Order status</h3>
                {Object.keys(statusCounts).length === 0 ? (
                  <p className="text-sm text-secondary-text dark:text-gray-400">No order data yet.</p>
                ) : (
                  <div className="space-y-3">
                    {Object.entries(statusCounts).map(([status, count]) => (
                      <div key={status}>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="capitalize text-secondary-text dark:text-gray-300">{status.replace(/_/g, " ")}</span>
                          <span className="font-medium text-primary-text dark:text-white">{count}</span>
                        </div>
                        <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-forest"
                            style={{ width: `${Math.max(6, (count / Math.max(1, orders.length)) * 100)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-forest text-white rounded-3xl p-6">
                <CheckCircle2 className="h-8 w-8 mb-4 text-forest-light" />
                <h3 className="text-lg font-semibold mb-1">Service health</h3>
                <p className="text-sm text-forest-light">
                  {Number(dashboard?.activeServices || 0)} active services are published on the website.
                </p>
                <Link to="/dashboard/services" className="inline-flex items-center gap-1 mt-4 text-sm font-medium text-white underline">
                  Manage services <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
