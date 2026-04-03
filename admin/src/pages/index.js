import React, { useEffect, useState } from 'react';
import { getStats } from '../utils/api';

export default function Dashboard() {
  const [stats, setStats] = useState({ users: 0, matches: 0, tournaments: 0 });

  useEffect(() => {
    getStats().then(res => setStats(res.data.data)).catch(err => console.error(err));
  }, []);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Users" value={stats.users} change="+12%" />
        <StatCard title="Live Matches" value={stats.matches} change="+5" />
        <StatCard title="Tournaments" value={stats.tournaments} change="+2" />
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
        <h2 className="text-xl font-semibold mb-4">Recent Registrations</h2>
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="pb-3">Name</th>
              <th className="pb-3">Phone</th>
              <th className="pb-3">City</th>
              <th className="pb-3">Status</th>
            </tr>
          </thead>
          <tbody>
            <UserRow name="Virat Kohli" phone="+91 9876543210" city="Delhi" status="Active" />
            <UserRow name="Rohit Sharma" phone="+91 8888888888" city="Mumbai" status="Active" />
            <UserRow name="MS Dhoni" phone="+91 7777777777" city="Ranchi" status="Active" />
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatCard({ title, value, change }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <p className="text-gray-500 text-sm">{title}</p>
      <div className="flex items-baseline gap-4">
        <h3 className="text-2xl font-bold">{value}</h3>
        <span className="text-green-500 text-xs font-medium">{change}</span>
      </div>
    </div>
  );
}

function UserRow({ name, phone, city, status }) {
  return (
    <tr className="border-b last:border-0 hover:bg-gray-50">
      <td className="py-4 font-medium">{name}</td>
      <td className="py-4 text-gray-600">{phone}</td>
      <td className="py-4 text-gray-600">{city}</td>
      <td className="py-4">
        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">{status}</span>
      </td>
    </tr>
  );
}
