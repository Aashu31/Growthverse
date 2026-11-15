import React, { useEffect } from "react";
import { LineChart, Line, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from "recharts";
import { DataProvider } from "../../context/DataContext";
import { useData } from "../../context/DataContext";
import { formatCurrency } from "../../utils/formatters";
import { DASHBOARD_STATS } from "../../data";

const COLORS = ["#3563FF", "#5B8CFF", "#8257F5", "#10B981", "#F59E0B"];

function RevenueChart() {
  const data = [
    { name: "Mon", revenue: 1200 },
    { name: "Tue", revenue: 1900 },
    { name: "Wed", revenue: 1500 },
    { name: "Thu", revenue: 2300 },
    { name: "Fri", revenue: 2100 },
    { name: "Sat", revenue: 2800 },
    { name: "Sun", revenue: 2400 },
  ];
  return (
    <div className="bg-white dark:bg-dark-secondary rounded-3xl border border-border dark:border-gray-700 p-6">
      <h3 className="text-sm font-semibold text-primary-text dark:text-white mb-6">Demo Revenue Overview</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3563FF" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3563FF" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <XAxis dataKey="name" stroke="#64748B" fontSize="11" />
            <YAxis stroke="#64748B" fontSize="11" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#3563FF"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, fill: "#3563FF" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-secondary-text dark:text-gray-400 mt-3 text-center">
        Sample demonstration data. Not actual revenue.
      </p>
    </div>
  );
}

function OrdersChart() {
  const data = [
    { name: "Jan", orders: 12 },
    { name: "Feb", orders: 19 },
    { name: "Mar", orders: 15 },
    { name: "Apr", orders: 23 },
    { name: "May", orders: 21 },
    { name: "Jun", orders: 28 },
  ];
  return (
    <div className="bg-white dark:bg-dark-secondary rounded-3xl border border-border dark:border-gray-700 p-6">
      <h3 className="text-sm font-semibold text-primary-text dark:text-white mb-6">Monthly Orders</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="name" stroke="#64748B" fontSize="11" />
            <YAxis stroke="#64748B" fontSize="11" />
            <Tooltip />
            <Bar dataKey="orders" fill="#5B8CFF" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-secondary-text dark:text-gray-400 mt-3 text-center">
        Sample demonstration data.
      </p>
    </div>
  );
}

function StatusDistribution() {
  const data = [
    { name: "Completed", value: 45, color: "#10B981" },
    { name: "In Progress", value: 25, color: "#3563FF" },
    { name: "Pending", value: 20, color: "#F59E0B" },
    { name: "Cancelled", value: 10, color: "#EF4444" },
  ];
  return (
    <div className="bg-white dark:bg-dark-secondary rounded-3xl border border-border dark:border-gray-700 p-6">
      <h3 className="text-sm font-semibold text-primary-text dark:text-white mb-6">Order Status Distribution</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={90}
              fill="#8884d8"
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-secondary-text dark:text-gray-400 mt-3 text-center">
        Sample demonstration data.
      </p>
    </div>
  );
}

function RecentOrdersTable({ orders }) {
  return (
    <div className="bg-white dark:bg-dark-secondary rounded-3xl border border-border dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-semibold text-primary-text dark:text-white">Recent Orders</h3>
        <a href="/dashboard/orders" className="text-sm text-blue-600 dark:text-electric-blue font-medium hover:underline">
          View All
        </a>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border dark:border-gray-700 text-secondary-text dark:text-gray-400">
              <th className="pb-3 font-medium text-primary-text dark:text-white">Order ID</th>
              <th className="pb-3 font-medium text-primary-text dark:text-white">Customer</th>
              <th className="pb-3 font-medium text-primary-text dark:text-white">Amount</th>
              <th className="pb-3 font-medium text-primary-text dark:text-white">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.slice(0, 5).map((order) => (
              <tr key={order.id} className="border-b border-border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <td className="py-3 text-primary-text dark:text-white font-medium">{order.id}</td>
                <td className="py-3 text-secondary-text dark:text-gray-300">{order.customer}</td>
                <td className="py-3 text-primary-text dark:text-white">{formatCurrency(order.amount)}</td>
                <td className="py-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${order.status === "Completed" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : order.status === "Pending" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"}`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function Overview() {
  const { demoData } = useData();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-h2 text-primary-text dark:text-white">Dashboard Overview</h2>
          <p className="text-secondary-text dark:text-gray-300">
            Welcome back to your business dashboard. All data shown is demonstration data.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 rounded-xl border border-border dark:border-gray-700 bg-white dark:bg-dark-secondary text-primary-text dark:text-white text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            Export Data
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {DASHBOARD_STATS.map((stat) => (
          <div key={stat.label} className="card-premium p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.iconColor} bg-opacity-10`}>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className={`text-xs font-medium ${stat.changeType === "positive" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-lg font-medium text-primary-text dark:text-white">{stat.label}</h3>
            <p className="text-h2 font-bold text-primary-text dark:text-white mt-1">{stat.value}</p>
            <p className="text-xs text-secondary-text dark:text-gray-400 mt-1">
              Sample demonstration data
            </p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <OrdersChart />
        <StatusDistribution />
      </div>

      <RecentOrdersTable orders={demoData.orders} />
    </div>
  );
}
