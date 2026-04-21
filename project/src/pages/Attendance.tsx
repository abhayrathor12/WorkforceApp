import { useEffect, useState } from 'react';
import { Card } from '../components/ui/Card';
import DataTable, { Column } from '../components/ui/DataTable';
import Badge from '../components/ui/Badge';
import { Input } from '../components/ui/FormInput';
import { attendanceApi } from '../api/services';

interface AttendanceRecord { id: number; employee: string; date: string; status: string }

export default function Attendance() {
  const [data, setData] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const load = async (d: string) => {
    setLoading(true);
    setData(await attendanceApi.list(d) as AttendanceRecord[]);
    setLoading(false);
  };

  useEffect(() => { load(date); }, [date]);

  const toggleStatus = async (row: AttendanceRecord) => {
    const newStatus = row.status === 'Present' ? 'Absent' : 'Present';
    try {
      await attendanceApi.mark({ employee_id: row.id, date, status: newStatus });
    } catch { /* noop */ }
    setData((prev) => prev.map((r) => r.id === row.id ? { ...r, status: newStatus } : r));
  };

  const markAll = async (status: string) => {
    try { await attendanceApi.bulk({ date, status }); } catch { /* noop */ }
    setData((prev) => prev.map((r) => ({ ...r, status })));
  };

  const present = data.filter((r) => r.status === 'Present').length;
  const absent = data.length - present;

  const columns: Column<Record<string, unknown>>[] = [
    { key: 'employee', header: 'Employee' },
    { key: 'date', header: 'Date' },
    { key: 'status', header: 'Status', render: (r) => <Badge label={String(r.status)} variant={r.status === 'Present' ? 'green' : 'red'} /> },
    {
      key: 'action', header: 'Toggle', render: (r) => (
        <button
          onClick={() => toggleStatus(r as unknown as AttendanceRecord)}
          className={`px-3 py-1 rounded-full text-xs font-medium transition
            ${r.status === 'Present' ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-green-100 text-green-600 hover:bg-green-200'}`}
        >
          Mark {r.status === 'Present' ? 'Absent' : 'Present'}
        </button>
      )
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg text-sm font-medium">Present: {present}</div>
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm font-medium">Absent: {absent}</div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => markAll('Present')} className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition">Mark All Present</button>
          <button onClick={() => markAll('Absent')} className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition">Mark All Absent</button>
        </div>
      </div>

      <Card
        action={
          <Input label="" type="date" value={date} onChange={(e) => setDate(e.target.value)} className="text-sm" />
        }
        title="Attendance Register"
      >
        <DataTable columns={columns} data={data as Record<string, unknown>[]} loading={loading} />
      </Card>
    </div>
  );
}
