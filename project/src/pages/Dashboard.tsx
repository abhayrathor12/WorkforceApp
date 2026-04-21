import { useEffect, useState } from 'react';
import { Users, Activity, Shield, Factory } from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { dashboardApi } from '../api/services';
import { dummyManpowerTrend, dummyLevelComparison } from '../data/dummy';

interface DashboardData {
  total_ctq_stations: number;
  operators_required: number;
  operators_available: number;
  buffer_required: number;
  buffer_available: number;
  l1_required: number;
  l1_available: number;
  l2_required: number;
  l2_available: number;
  l3_required: number;
  l3_available: number;
  l4_required: number;
  l4_available: number;
}

// ── Sub-components ────────────────────────────────────────────────────────────

interface KPICardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  iconBg: string;
  valueColor?: string;
}

function KPICard({ title, value, icon, iconBg, valueColor = 'text-gray-900' }: KPICardProps) {
  return (
    <div className="bg-white rounded-xl p-3 flex items-center justify-between shadow-sm border border-gray-100">
      <div>
        <p className="text-xs text-gray-500 font-medium mb-0.5">{title}</p>
        <p className={`text-2xl font-bold ${valueColor}`}>{value}</p>
      </div>
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${iconBg}`}>
        {icon}
      </div>
    </div>
  );
}

interface LevelBoxProps {
  label: string;
  value: string | number;
}

function LevelBox({ label, value }: LevelBoxProps) {
  return (
    <div className="flex flex-col items-center justify-center border border-gray-200 rounded-lg bg-white py-1.5 px-1">
      <span className="text-base font-bold text-gray-800">{value}</span>
      <span className="text-[10px] text-gray-500 text-center leading-tight">{label}</span>
    </div>
  );
}

interface SectionCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  headerExtra?: React.ReactNode;
}

function SectionCard({ title, subtitle, children, className = '', headerExtra }: SectionCardProps) {
  return (
    <div className={`bg-white rounded-xl p-3 shadow-sm border border-gray-100 ${className}`}>
      <div className="flex items-start justify-between mb-0.5">
        <div>
          <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
          {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
        </div>
        {headerExtra}
      </div>
      <div className="mt-1">{children}</div>
    </div>
  );
}

// ── Custom dot for charts ─────────────────────────────────────────────────────
const DotWithStroke = (props: any) => {
  const { cx, cy, stroke } = props;
  return <circle cx={cx} cy={cy} r={4} fill="white" stroke={stroke} strokeWidth={2} />;
};

// ── Dashboard ─────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [kpi, setKpi] = useState<DashboardData | null>(null);
  const [attrition, setAttrition] = useState<unknown[]>([]);
  const [absenteeism, setAbsenteeism] = useState<unknown[]>([]);

  useEffect(() => {
    dashboardApi.get().then(setKpi);
    // ── Using old page approach: pass empty array if no data (no dummy fallback)
    dashboardApi.attritionTrend().then((d) => setAttrition(Array.isArray(d) ? d : []));
    dashboardApi.absenteeism().then((d) => setAbsenteeism(Array.isArray(d) ? d : []));
  }, []);

  const levelBoxes = [
    { label: 'L1 Required',  value: kpi?.l1_required  ?? '25' },
    { label: 'L1 Available', value: kpi?.l1_available ?? '23' },
    { label: 'L2 Required',  value: kpi?.l2_required  ?? '25' },
    { label: 'L2 Available', value: kpi?.l2_available ?? '24' },
    { label: 'L3 Required',  value: kpi?.l3_required  ?? '25' },
    { label: 'L3 Available', value: kpi?.l3_available ?? '25' },
    { label: 'L4 Required',  value: kpi?.l4_required  ?? '25' },
    { label: 'L4 Available', value: kpi?.l4_available ?? '25' },
  ];

  const pctFormatter = (v: number) => `${v}%`;

  return (
    <div className="space-y-3 p-3 bg-gray-50 min-h-screen">

      {/* ── Row 1: 4 KPI cards ── */}
      <div className="grid grid-cols-4 gap-3">
        <KPICard
          title="CTQ Stations"
          value={kpi?.total_ctq_stations ?? '—'}
          icon={<Factory size={18} className="text-blue-500" />}
          iconBg="bg-blue-100"
        />
        <KPICard
          title="Operators Required"
          value={kpi?.operators_required ?? '—'}
          icon={<Users size={18} className="text-gray-500" />}
          iconBg="bg-gray-100"
        />
        <KPICard
          title="Operators Available"
          value={kpi?.operators_available ?? '—'}
          icon={<Activity size={18} className="text-teal-500" />}
          iconBg="bg-teal-50"
          valueColor="text-teal-500"
        />
        <KPICard
          title="Buffer Req. / Avail."
          value={kpi ? `${kpi.buffer_required} / ${kpi.buffer_available}` : '—'}
          icon={<Shield size={18} className="text-orange-500" />}
          iconBg="bg-orange-50"
          valueColor="text-orange-500"
        />
      </div>

      {/* ── Row 2: Manpower chart (left) + Level panel (right) ── */}
      <div className="grid grid-cols-5 gap-3 items-stretch">

        {/* Manpower Utilization Trend — 3/5 width */}
        <SectionCard
          className="col-span-3"
          title="Manpower Utilization Trend"
          subtitle="Comparing required vs. actual headcount over time"
          headerExtra={
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <span className="inline-block w-3 h-0.5 bg-blue-500 rounded" />
                Required
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block w-3 h-0.5 bg-green-500 rounded" />
                Available
              </span>
            </div>
          }
        >
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={dummyManpowerTrend} margin={{ top: 4, right: 8, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="gradRequired" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.03} />
                </linearGradient>
                <linearGradient id="gradAvailable" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.03} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} domain={[0, 120]} ticks={[0, 20, 40, 60, 80, 100, 120]} />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: 12 }}
                cursor={{ stroke: '#e5e7eb', strokeWidth: 1 }}
              />
              <Area type="monotone" dataKey="required" stroke="#3b82f6" strokeWidth={2} fill="url(#gradRequired)" dot={<DotWithStroke stroke="#3b82f6" />} activeDot={{ r: 5 }} name="Required" />
              <Area type="monotone" dataKey="available" stroke="#10b981" strokeWidth={2} fill="url(#gradAvailable)" dot={<DotWithStroke stroke="#10b981" />} activeDot={{ r: 5 }} name="Available" />
            </AreaChart>
          </ResponsiveContainer>
        </SectionCard>

        {/* Operators Required vs Available — 2/5 width */}
        <div className="col-span-2 bg-white rounded-xl p-3 shadow-sm border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-800 text-center mb-1.5">
            Operators Required vs Available
          </h3>
          <div className="grid grid-cols-2 gap-1.5">
            {levelBoxes.map(({ label, value }) => (
              <LevelBox key={label} label={label} value={value} />
            ))}
          </div>
        </div>

      </div>

      {/* ── Row 3: Attrition + Absenteeism + Level Breakdown ── */}
      <div className="grid grid-cols-3 gap-3">

        {/* Attrition Trend — real API data only, no dummy fallback */}
        <SectionCard title="Attrition Trend" subtitle="Monthly attrition rate (%)">
          <ResponsiveContainer width="100%" height={140}>
            <AreaChart data={attrition} margin={{ top: 4, right: 8, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="gradAttrition" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.03} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={pctFormatter} domain={[0, 5]} ticks={[0, 1, 2, 3, 4, 5]} />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: 11 }}
                formatter={(v: number) => [`${v}%`, 'Attrition']}
              />
              <Area type="monotone" dataKey="rate" stroke="#6366f1" strokeWidth={2} fill="url(#gradAttrition)" dot={<DotWithStroke stroke="#6366f1" />} activeDot={{ r: 4 }} name="Rate" />
            </AreaChart>
          </ResponsiveContainer>
        </SectionCard>

        {/* Absenteeism Trend — real API data only, no dummy fallback */}
        <SectionCard title="Absenteeism Trend" subtitle="Monthly absenteeism rate (%)">
          <ResponsiveContainer width="100%" height={140}>
            <AreaChart data={absenteeism} margin={{ top: 4, right: 8, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="gradAbsent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.03} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={pctFormatter} domain={[0, 10]} ticks={[0, 2, 4, 6, 8, 10]} />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: 11 }}
                formatter={(v: number) => [`${v}%`, 'Absenteeism']}
              />
              <Area type="monotone" dataKey="rate" stroke="#10b981" strokeWidth={2} fill="url(#gradAbsent)" dot={<DotWithStroke stroke="#10b981" />} activeDot={{ r: 4 }} name="Rate" />
            </AreaChart>
          </ResponsiveContainer>
        </SectionCard>

        {/* Level Breakdown — now uses dummyLevelComparison with both required + available bars */}
        <SectionCard title="Level Breakdown" subtitle="Distribution of operators by skill level">
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={dummyLevelComparison} margin={{ top: 16, right: 8, left: -10, bottom: 0 }} barSize={16}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="level" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} domain={[0, 40]} ticks={[0, 10, 20, 30, 40]} />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: 11 }}
              />
              <Bar dataKey="required" name="Required" fill="#93c5fd" radius={[4, 4, 0, 0]} />
              <Bar dataKey="available" name="Available" fill="#6ee7b7" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>

      </div>
    </div>
  );
}