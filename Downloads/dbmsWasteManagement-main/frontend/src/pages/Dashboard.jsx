import React, { useEffect, useState } from 'react';
import { TrendingUp, Users, Trash2, DollarSign } from 'lucide-react';
import { Card } from '../components/UI';
import { billsAPI, wasteAPI, citizensAPI, binsAPI, crewAPI } from '../services/api';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export const Dashboard = () => {
  const [stats, setStats] = useState({
    citizens: [],
    waste: [],
    bills: [],
    bins: [],
    crew: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [citizensRes, wasteRes, billsRes, binsRes, crewRes] = await Promise.all([
          citizensAPI.getAll().catch(err => ({ data: { data: [] } })),
          wasteAPI.getAll().catch(err => ({ data: { data: [] } })),
          billsAPI.getAll().catch(err => ({ data: { data: [] } })),
          binsAPI.getAll().catch(err => ({ data: { data: [] } })),
          crewAPI.getAll().catch(err => ({ data: { data: [] } })),
        ]);

        setStats({
          citizens: citizensRes.data.data || citizensRes.data || [],
          waste: wasteRes.data.data || wasteRes.data || [],
          bills: billsRes.data.data || billsRes.data || [],
          bins: binsRes.data.data || binsRes.data || [],
          crew: crewRes.data.data || crewRes.data || [],
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        setStats({
          citizens: [],
          waste: [],
          bills: [],
          bins: [],
          crew: [],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const colorStyles = {
    blue: { bg: 'rgba(219, 234, 254, 0.6)', border: '#3b82f6', icon: '#3b82f6' },
    yellow: { bg: 'rgba(254, 243, 199, 0.6)', border: '#f59e0b', icon: '#f59e0b' },
    green: { bg: 'rgba(220, 252, 231, 0.6)', border: '#10b981', icon: '#10b981' },
  };

  const StatCard = ({ icon: Icon, label, value, color }) => {
    const style = colorStyles[color] || colorStyles.blue;
    return (
      <Card style={{ 
        background: `linear-gradient(135deg, ${style.bg} 0%, rgba(255, 255, 255, 0.8) 100%)`,
        borderLeft: `4px solid ${style.border}`
      }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium">{label}</p>
            <p className="text-3xl font-bold text-gray-800 mt-2">{value || '0'}</p>
          </div>
          <Icon size={48} style={{ color: style.icon, opacity: 0.2 }} />
        </div>
      </Card>
    );
  };

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

  // Calculate statistics
  const totalCitizens = stats.citizens.length;
  const totalWasteCollected = stats.waste.reduce((sum, w) => sum + parseFloat(w.quantity || 0), 0);
  const totalWasteRecycled = stats.waste.filter((w) => w.status === 'Recycled').reduce((sum, w) => sum + parseFloat(w.quantity || 0), 0);
  const totalBillsPaid = stats.bills.filter((b) => b.status === 'Paid').reduce((sum, b) => sum + parseFloat(b.amount || 0), 0);

  // Waste by type chart data
  const wasteByTypeData = stats.waste.reduce((acc, waste) => {
    const existing = acc.find((w) => w.type === waste.waste_type);
    if (existing) {
      existing.quantity += parseFloat(waste.quantity || 0);
      existing.count += 1;
    } else {
      acc.push({ type: waste.waste_type, quantity: parseFloat(waste.quantity || 0), count: 1 });
    }
    return acc;
  }, []);

  // Waste by status chart data with fallback
  let wasteByStatusData = stats.waste.reduce((acc, waste) => {
    const existing = acc.find((w) => w.status === waste.status);
    if (existing) {
      existing.count += 1;
      existing.quantity += parseFloat(waste.quantity || 0);
    } else {
      acc.push({ status: waste.status, count: 1, quantity: parseFloat(waste.quantity || 0) });
    }
    return acc;
  }, []);
  
  // Add default statuses if no data exists
  if (wasteByStatusData.length === 0) {
    wasteByStatusData = [
      { status: 'Collected', count: 0, quantity: 0 },
      { status: 'Recycled', count: 0, quantity: 0 },
      { status: 'Disposed', count: 0, quantity: 0 },
      { status: 'Pending', count: 0, quantity: 0 },
    ];
  }

  // Bills by status chart data with fallback
  let billsByStatusData = stats.bills.reduce((acc, bill) => {
    const existing = acc.find((b) => b.status === bill.status);
    if (existing) {
      existing.count += 1;
      existing.amount += parseFloat(bill.amount || 0);
    } else {
      acc.push({ status: bill.status, count: 1, amount: parseFloat(bill.amount || 0) });
    }
    return acc;
  }, []);
  
  // Add default statuses if no data exists
  if (billsByStatusData.length === 0) {
    billsByStatusData = [
      { status: 'Paid', count: 0, amount: 0 },
      { status: 'Pending', count: 0, amount: 0 },
      { status: 'Overdue', count: 0, amount: 0 },
    ];
  }

  // Enhanced color palette for better visibility
  const WASTE_STATUS_COLORS = {
    'Collected': '#3b82f6',
    'Recycled': '#10b981',
    'Disposed': '#8b5cf6',
    'Pending': '#f59e0b',
  };

  const BILL_STATUS_COLORS = {
    'Paid': '#10b981',
    'Pending': '#f59e0b',
    'Overdue': '#ef4444',
  };

  // Custom label rendering for charts
  const renderCustomLabel = ({ status, count, cx, cy, midAngle, innerRadius, outerRadius }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="font-bold text-sm"
      >
        {count}
      </text>
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Citizens" value={totalCitizens} color="blue" />
        <StatCard icon={Trash2} label="Waste Collected (kg)" value={totalWasteCollected.toFixed(2)} color="yellow" />
        <StatCard icon={TrendingUp} label="Waste Recycled (kg)" value={totalWasteRecycled.toFixed(2)} color="green" />
        <StatCard icon={DollarSign} label="Total Bills Paid ($)" value={totalBillsPaid.toFixed(2)} color="green" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Waste Status Distribution - Enhanced Donut Chart */}
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50">
          <h3 className="text-lg font-bold mb-4 text-gray-800 flex items-center gap-2">
            <Trash2 size={24} className="text-blue-600" />
            Waste Status Distribution
          </h3>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={wasteByStatusData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={130}
                paddingAngle={2}
                dataKey="count"
                label={({ status, count, percent }) => `${status}: ${count} (${(percent * 100).toFixed(0)}%)`}
                labelLine={true}
              >
                {wasteByStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={WASTE_STATUS_COLORS[entry.status] || COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`${value} records`, 'Count']}
                contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '2px solid #3b82f6', borderRadius: '8px', color: '#1f2937', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {wasteByStatusData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: WASTE_STATUS_COLORS[item.status] || COLORS[idx % COLORS.length] }}
                />
                <span className="text-gray-700">{item.status}: {item.count}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Bill Status Distribution - Enhanced Donut Chart */}
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50">
          <h3 className="text-lg font-bold mb-4 text-gray-800 flex items-center gap-2">
            <DollarSign size={24} className="text-green-600" />
            Bill Status Distribution
          </h3>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={billsByStatusData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={130}
                paddingAngle={2}
                dataKey="count"
                label={({ status, count, percent }) => `${status}: ${count} (${(percent * 100).toFixed(0)}%)`}
                labelLine={true}
              >
                {billsByStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={BILL_STATUS_COLORS[entry.status] || COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`${value} bills`, 'Count']}
                contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '2px solid #10b981', borderRadius: '8px', color: '#1f2937', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {billsByStatusData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: BILL_STATUS_COLORS[item.status] || COLORS[idx % COLORS.length] }}
                />
                <span className="text-gray-700">{item.status}: {item.count}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Waste by Type Chart */}
      {wasteByTypeData.length > 0 && (
        <Card>
          <h3 className="text-lg font-bold mb-4">Waste Collection by Type</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={wasteByTypeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="quantity" fill="#f59e0b" name="Total Quantity (kg)" />
              <Bar yAxisId="right" dataKey="count" fill="#3b82f6" name="Number of Records" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Bills by Status Amount Chart */}
      {billsByStatusData.length > 0 && (
        <Card>
          <h3 className="text-lg font-bold mb-4">Bills Amount by Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={billsByStatusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="amount" fill="#10b981" name="Amount ($)" />
              <Bar yAxisId="right" dataKey="count" fill="#ef4444" name="Number of Bills" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}
    </div>
  );
};
