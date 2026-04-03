import React from 'react';

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-slate-900 text-white p-6">
        <div className="text-xl font-bold mb-8 text-blue-400">CricHeroes Admin</div>
        <nav className="space-y-4">
          <NavItem href="/" label="Dashboard" icon="📊" />
          <NavItem href="/users" label="Users" icon="👥" />
          <NavItem href="/matches" label="Matches" icon="🏏" />
          <NavItem href="/tournaments" label="Tournaments" icon="🏆" />
          <NavItem href="/moderation" label="Moderation" icon="🛡️" />
          <NavItem href="/notifications" label="Push Manager" icon="🔔" />
        </nav>
      </aside>
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}

function NavItem({ href, label, icon }) {
  return (
    <a href={href} className="flex items-center gap-3 p-2 hover:bg-slate-800 rounded transition-colors text-slate-300 hover:text-white">
      <span>{icon}</span>
      <span>{label}</span>
    </a>
  );
}
