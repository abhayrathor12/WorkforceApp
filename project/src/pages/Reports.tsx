import { useState } from 'react';
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Card } from '../components/ui/Card';
import DataTable, { Column } from '../components/ui/DataTable';
import { dummyManpowerTrend, dummyAttritionTrend, dummyAbsenteeism, dummyManpowerReq, dummyAttrition, dummyAttendance } from '../data/dummy';

const tabs = ['Manpower Report', 'Attendance Report', 'Attrition Report'];

const manpowerCols: Column<Record<string, unknown>>[] = [
  { key: 'station', header: 'Station' },
  { key: 'level', header: 'Level' },
  { key: 'required', header: 'Required' },
  { key: 'date', header: 'Date' },
];

const attendanceCols: Column<Record<string, unknown>>[] = [
  { key: 'employee', header: 'Employee' },
  { key: 'date', header: 'Date' },
  { key: 'status', header: 'Status' },
];

const attritionCols: Column<Record<string, unknown>>[] = [
  { key: 'employee', header: 'Employee' },
  { key: 'exit_date', header: 'Exit Date' },
  { key: 'reason', header: 'Reason' },
];

export default function Reports() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="space-y-6">
      <div className="flex gap-2 border-b border-gray-200">
        {tabs.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition -mb-px
              ${activeTab === i ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 0 && (
        <div className="space-y-6">
          <Card title="Manpower Trend">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={dummyManpowerTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="required" fill="#3b82f6" name="Required" radius={[4, 4, 0, 0]} />
                <Bar dataKey="available" fill="#10b981" name="Available" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
          <Card title="Detailed Records">
            <DataTable columns={manpowerCols} data={dummyManpowerReq as Record<string, unknown>[]} />
          </Card>
        </div>
      )}

      {activeTab === 1 && (
        <div className="space-y-6">
          <Card title="Absenteeism Trend">
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={dummyAbsenteeism}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Area type="monotone" dataKey="rate" stroke="#f59e0b" fill="#fef3c7" strokeWidth={2} name="Absenteeism %" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
          <Card title="Attendance Records">
            <DataTable columns={attendanceCols} data={dummyAttendance as Record<string, unknown>[]} />
          </Card>
        </div>
      )}

      {activeTab === 2 && (
        <div className="space-y-6">
          <Card title="Attrition Trend">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={dummyAttritionTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="rate" stroke="#ef4444" strokeWidth={2} name="Attrition %" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
          <Card title="Attrition Records">
            <DataTable columns={attritionCols} data={dummyAttrition as Record<string, unknown>[]} />
          </Card>
        </div>
      )}
    </div>
  );
}
