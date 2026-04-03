import React from 'react';

export default function UserManagement() {
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">User Management</h1>
        <div className="flex gap-4">
          <input type="text" placeholder="Search users..." className="border rounded px-4 py-2" />
          <button className="bg-blue-600 text-white px-4 py-2 rounded">Export Users</button>
        </div>
      </div>

      <div className="bg-white rounded shadow">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr className="text-left">
              <th className="p-4">User</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Joined</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="p-4">John Doe</td>
              <td className="p-4">+91 9876543210</td>
              <td className="p-4">Oct 24, 2024</td>
              <td className="p-4 flex gap-2">
                <button className="text-blue-600 hover:underline">View</button>
                <button className="text-red-600 hover:underline">Ban</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
