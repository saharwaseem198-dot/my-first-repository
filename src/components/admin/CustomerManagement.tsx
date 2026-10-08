import React, { useState } from 'react';
import { Search, Users, Crown, Phone, Mail, MapPin, Calendar, ShoppingBag } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const CustomerManagement: React.FC = () => {
  const { customers, orders } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredCustomers = customers.filter((cust) => {
    const matchesSearch =
      cust.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cust.phone.includes(searchTerm) ||
      cust.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cust.city.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'All' || cust.accountStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalSpending = customers.reduce((acc, c) => acc + c.totalSpending, 0);
  const vipCount = customers.filter((c) => c.accountStatus === 'VIP').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-800 gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold tracking-wide text-neutral-100 uppercase">
            Client & Customer Management
          </h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Registered patrons, luxury pret buyers & VIP couture portfolio
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div>
            <span className="text-neutral-500">Total Clients: </span>
            <span className="text-white font-semibold">{customers.length}</span>
          </div>
          <div>
            <span className="text-neutral-500">VIP Patrons: </span>
            <span className="text-amber-300 font-semibold">{vipCount}</span>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 bg-neutral-900/90 border border-neutral-800 rounded-2xl flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-neutral-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search client by name, phone, email, or Pakistani city..."
            className="w-full pl-9 pr-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-200 focus:outline-none focus:border-amber-400"
          />
        </div>

        <div className="sm:w-48">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-200 focus:outline-none focus:border-amber-400"
          >
            <option value="All">All Client Statuses</option>
            <option value="VIP">VIP Patrons</option>
            <option value="Active">Active</option>
            <option value="Blocked">Blocked</option>
          </select>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-neutral-800 bg-neutral-950/70 text-neutral-400 uppercase tracking-wider font-mono text-[11px]">
                <th className="py-3.5 px-4 font-medium">Client Name</th>
                <th className="py-3.5 px-3 font-medium">Contact Details</th>
                <th className="py-3.5 px-3 font-medium">City</th>
                <th className="py-3.5 px-3 font-medium">Registered Date</th>
                <th className="py-3.5 px-3 font-medium text-center">Orders Count</th>
                <th className="py-3.5 px-3 font-medium text-right">Total Spending (PKR)</th>
                <th className="py-3.5 px-4 text-right font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-neutral-500 text-xs">
                    No customers match your search criteria.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-neutral-800/30 transition-colors">
                    {/* Name */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-xs font-serif font-bold text-amber-300 shrink-0">
                          {cust.name.slice(0, 1)}
                        </div>
                        <div>
                          <p className="font-semibold text-neutral-100 flex items-center gap-1.5">
                            <span>{cust.name}</span>
                            {cust.accountStatus === 'VIP' && (
                              <Crown className="w-3.5 h-3.5 text-amber-400" />
                            )}
                          </p>
                          <span className="text-[10px] text-neutral-500 font-mono">{cust.id}</span>
                        </div>
                      </div>
                    </td>

                    {/* Contact Details */}
                    <td className="py-3.5 px-3">
                      <p className="font-mono text-neutral-300">{cust.phone}</p>
                      <p className="text-[11px] text-neutral-500">{cust.email}</p>
                    </td>

                    {/* City */}
                    <td className="py-3.5 px-3">
                      <span className="text-neutral-300 font-medium">{cust.city}</span>
                    </td>

                    {/* Registration Date */}
                    <td className="py-3.5 px-3 font-mono text-neutral-400">
                      {cust.registrationDate}
                    </td>

                    {/* Orders Count */}
                    <td className="py-3.5 px-3 text-center font-mono tabular-nums text-white">
                      {cust.ordersCount}
                    </td>

                    {/* Total Spending */}
                    <td className="py-3.5 px-3 text-right font-mono tabular-nums">
                      <span className="font-semibold text-amber-300">
                        Rs. {cust.totalSpending.toLocaleString()}
                      </span>
                    </td>

                    {/* Account Status */}
                    <td className="py-3.5 px-4 text-right">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                          cust.accountStatus === 'VIP'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : cust.accountStatus === 'Blocked'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        {cust.accountStatus}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
