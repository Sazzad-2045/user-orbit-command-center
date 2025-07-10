import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Dummy data for demonstration
const plans = ["Free", "Basic", "Premium", "Enterprise"];
const roles = ["Owner", "Admin", "Editor", "Viewer"];
const countries = ["Bangladesh", "USA", "UK", "India"];
const users = [
  { id: 1, name: "John Doe", email: "john.doe@example.com", plan: "Premium", role: "Owner", status: "Active", country: "Bangladesh" },
  { id: 2, name: "Jane Smith", email: "jane.smith@example.com", plan: "Basic", role: "Admin", status: "Active", country: "USA" },
  { id: 3, name: "Mike Johnson", email: "mike.johnson@example.com", plan: "Free", role: "Editor", status: "Inactive", country: "UK" },
  { id: 4, name: "Sarah Wilson", email: "sarah.wilson@example.com", plan: "Enterprise", role: "Viewer", status: "Active", country: "India" },
];
const qrStats = [
  { date: "2025-07-01", created: 10, scans: 50 },
  { date: "2025-07-02", created: 15, scans: 60 },
  { date: "2025-07-03", created: 8, scans: 40 },
  { date: "2025-07-04", created: 20, scans: 90 },
  { date: "2025-07-05", created: 12, scans: 55 },
];
const subscriptionTrends = [
  { date: "2025-07-01", upgrades: 2, downgrades: 1 },
  { date: "2025-07-02", upgrades: 1, downgrades: 0 },
  { date: "2025-07-03", upgrades: 3, downgrades: 2 },
  { date: "2025-07-04", upgrades: 0, downgrades: 1 },
  { date: "2025-07-05", upgrades: 2, downgrades: 0 },
];

export default function Analytics() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    plan: "",
    role: "",
    status: "",
    country: "",
    dateFrom: "",
    dateTo: "",
  });
  const [reportType, setReportType] = useState("user");

  // Filtered user data
  const filteredUsers = users.filter(u =>
    (!filters.plan || u.plan === filters.plan) &&
    (!filters.role || u.role === filters.role) &&
    (!filters.status || u.status === filters.status) &&
    (!filters.country || u.country === filters.country)
  );

  // Dummy export handler
  const handleExport = (format) => {
    alert(`Exported as ${format}`);
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">
            View detailed analytics, generate reports, and track key performance indicators.
          </p>
        </div>
        <button className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition" onClick={() => navigate("/dashboard")}>Back to Dashboard</button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Plan</label>
          <select className="input border px-2 py-1 rounded" value={filters.plan} onChange={e => setFilters(f => ({ ...f, plan: e.target.value }))}>
            <option value="">All</option>
            {plans.map(p => <option key={p}>{p}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Role</label>
          <select className="input border px-2 py-1 rounded" value={filters.role} onChange={e => setFilters(f => ({ ...f, role: e.target.value }))}>
            <option value="">All</option>
            {roles.map(r => <option key={r}>{r}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Status</label>
          <select className="input border px-2 py-1 rounded" value={filters.status} onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}>
            <option value="">All</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Country</label>
          <select className="input border px-2 py-1 rounded" value={filters.country} onChange={e => setFilters(f => ({ ...f, country: e.target.value }))}>
            <option value="">All</option>
            {countries.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Date From</label>
          <input type="date" className="input border px-2 py-1 rounded" value={filters.dateFrom} onChange={e => setFilters(f => ({ ...f, dateFrom: e.target.value }))} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Date To</label>
          <input type="date" className="input border px-2 py-1 rounded" value={filters.dateTo} onChange={e => setFilters(f => ({ ...f, dateTo: e.target.value }))} />
        </div>
      </div>

      {/* Report Type Switcher */}
      <div className="mb-4 flex gap-2">
        <button className={`px-4 py-2 rounded ${reportType === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`} onClick={() => setReportType("user")}>User Activity</button>
        <button className={`px-4 py-2 rounded ${reportType === "qr" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`} onClick={() => setReportType("qr")}>QR Code Trends</button>
        <button className={`px-4 py-2 rounded ${reportType === "sub" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`} onClick={() => setReportType("sub")}>Subscription Trends</button>
        <button className={`px-4 py-2 rounded ${reportType === "custom" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`} onClick={() => setReportType("custom")}>Custom Report</button>
      </div>

      {/* User Activity Report */}
      {reportType === "user" && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-3">User Activity Report</h2>
          <table className="min-w-full table-auto border rounded mb-4">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Plan</th>
                <th className="px-4 py-2">Role</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Country</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(u => (
                <tr key={u.id} className="border-t border-gray-100">
                  <td className="px-4 py-2">{u.name}</td>
                  <td className="px-4 py-2">{u.email}</td>
                  <td className="px-4 py-2">{u.plan}</td>
                  <td className="px-4 py-2">{u.role}</td>
                  <td className="px-4 py-2">{u.status}</td>
                  <td className="px-4 py-2">{u.country}</td>
                  <td className="px-4 py-2">
                    <button className="px-3 py-1 rounded bg-blue-100 hover:bg-blue-200 text-blue-700 text-sm font-medium transition" onClick={() => navigate(`/user-profile/${u.id}`)}>View Profile</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded bg-green-100 hover:bg-green-200 text-green-700 font-medium" onClick={() => handleExport("CSV")}>Export CSV</button>
            <button className="px-4 py-2 rounded bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium" onClick={() => handleExport("XLSX")}>Export XLSX</button>
            <button className="px-4 py-2 rounded bg-red-100 hover:bg-red-200 text-red-700 font-medium" onClick={() => handleExport("PDF")}>Export PDF</button>
          </div>
        </div>
      )}

      {/* QR Code Trends */}
      {reportType === "qr" && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-3">QR Code Creation & Scan Trends</h2>
          {/* Dummy Bar Chart */}
          <div className="w-full h-64 bg-gray-50 border rounded flex items-end gap-2 p-4 mb-4">
            {qrStats.map((stat, i) => (
              <div key={stat.date} className="flex flex-col items-center flex-1">
                <div className="w-6 bg-blue-400" style={{ height: `${stat.created * 4}px` }} title={`Created: ${stat.created}`}></div>
                <div className="w-6 bg-green-400 mt-1" style={{ height: `${stat.scans * 2}px` }} title={`Scans: ${stat.scans}`}></div>
                <span className="text-xs mt-2">{stat.date.slice(5)}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <span className="inline-block w-4 h-4 bg-blue-400 rounded mr-1"></span> Created
            <span className="inline-block w-4 h-4 bg-green-400 rounded ml-4 mr-1"></span> Scans
          </div>
        </div>
      )}

      {/* Subscription Trends */}
      {reportType === "sub" && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Subscription Upgrades/Downgrades</h2>
          {/* Dummy Line Chart */}
          <div className="w-full h-64 bg-gray-50 border rounded flex items-end gap-2 p-4 mb-4">
            {subscriptionTrends.map((stat, i) => (
              <div key={stat.date} className="flex flex-col items-center flex-1">
                <div className="w-6 bg-indigo-400" style={{ height: `${stat.upgrades * 20}px` }} title={`Upgrades: ${stat.upgrades}`}></div>
                <div className="w-6 bg-red-400 mt-1" style={{ height: `${stat.downgrades * 20}px` }} title={`Downgrades: ${stat.downgrades}`}></div>
                <span className="text-xs mt-2">{stat.date.slice(5)}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <span className="inline-block w-4 h-4 bg-indigo-400 rounded mr-1"></span> Upgrades
            <span className="inline-block w-4 h-4 bg-red-400 rounded ml-4 mr-1"></span> Downgrades
          </div>
        </div>
      )}

      {/* Custom Report Builder */}
      {reportType === "custom" && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Custom Report Builder</h2>
          <div className="flex flex-wrap gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Date Range</label>
              <input type="date" className="input border px-2 py-1 rounded mr-2" />
              <input type="date" className="input border px-2 py-1 rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">User</label>
              <select className="input border px-2 py-1 rounded">
                <option value="">All</option>
                {users.map(u => <option key={u.id}>{u.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Plan</label>
              <select className="input border px-2 py-1 rounded">
                <option value="">All</option>
                {plans.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">QR Type</label>
              <select className="input border px-2 py-1 rounded">
                <option value="">All</option>
                <option value="Dynamic">Dynamic</option>
                <option value="Static">Static</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2 mb-4">
            <button className="px-4 py-2 rounded bg-green-100 hover:bg-green-200 text-green-700 font-medium" onClick={() => handleExport("CSV")}>Export CSV</button>
            <button className="px-4 py-2 rounded bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium" onClick={() => handleExport("XLSX")}>Export XLSX</button>
            <button className="px-4 py-2 rounded bg-red-100 hover:bg-red-200 text-red-700 font-medium" onClick={() => handleExport("PDF")}>Export PDF</button>
          </div>
          <div className="border border-dashed border-border rounded-lg p-8 text-center text-muted-foreground">
            Custom report preview will appear here.
          </div>
        </div>
      )}
    </div>
  );
}