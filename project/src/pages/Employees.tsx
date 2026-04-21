import { useEffect, useState } from 'react';
import { Plus, Search, CreditCard as Edit2, ToggleLeft, ToggleRight } from 'lucide-react';
import { Card } from '../components/ui/Card';
import DataTable, { Column } from '../components/ui/DataTable';
import Modal from '../components/ui/Modal';
import Badge from '../components/ui/Badge';
import { Input, Select } from '../components/ui/FormInput';
import { employeesApi, levelsApi, stationsApi } from '../api/services';

interface Employee { id: number; name: string; level: string; station: string; status: string }
interface Level { id: number; name: string }
interface Station { id: number; name: string }

const emptyForm = { name: '', level: '', station: '', status: 'Active' };

export default function Employees() {
  const [data, setData] = useState<Employee[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Employee | null>(null);
  const [form, setForm] = useState(emptyForm);

  const load = async () => {
    setLoading(true);
    const [emp, lvl, sta] = await Promise.all([employeesApi.list(), levelsApi.list(), stationsApi.list()]);
    setData(emp as Employee[]);
    setLevels(lvl as Level[]);
    setStations(sta as Station[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm(emptyForm); setModal(true); };
  const openEdit = (row: Employee) => { setEditing(row); setForm({ name: row.name, level: row.level, station: row.station, status: row.status }); setModal(true); };

  const handleSave = async () => {
    if (editing) await employeesApi.update(editing.id, form);
    else await employeesApi.create(form);
    setModal(false);
    load();
  };

  const handleToggle = async (row: Employee) => {
    try { await employeesApi.toggle(row.id); }
    catch { /* update locally */ }
    setData((prev) => prev.map((e) => e.id === row.id ? { ...e, status: e.status === 'Active' ? 'Inactive' : 'Active' } : e));
  };

  const filtered = data.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.level.toLowerCase().includes(search.toLowerCase()) ||
    e.station.toLowerCase().includes(search.toLowerCase())
  );

  const columns: Column<Record<string, unknown>>[] = [
    { key: 'name', header: 'Name' },
    { key: 'level', header: 'Level', render: (r) => <Badge label={String(r.level)} variant="blue" /> },
    { key: 'station', header: 'Station' },
    { key: 'status', header: 'Status', render: (r) => <Badge label={String(r.status)} variant={r.status === 'Active' ? 'green' : 'red'} /> },
    {
      key: 'actions', header: 'Actions', render: (r) => (
        <div className="flex items-center gap-2">
          <button onClick={() => openEdit(r as unknown as Employee)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition">
            <Edit2 size={14} />
          </button>
          <button onClick={() => handleToggle(r as unknown as Employee)} className="p-1.5 text-gray-500 hover:bg-gray-50 rounded-lg transition">
            {r.status === 'Active' ? <ToggleRight size={16} className="text-green-500" /> : <ToggleLeft size={16} />}
          </button>
        </div>
      )
    },
  ];

  return (
    <div className="space-y-4">
      <Card
        action={
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button onClick={openAdd} className="flex items-center gap-1.5 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-blue-700 transition">
              <Plus size={15} /> Add Employee
            </button>
          </div>
        }
      >
        <DataTable columns={columns} data={filtered as Record<string, unknown>[]} loading={loading} />
      </Card>

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit Employee' : 'Add Employee'}>
        <div className="space-y-4">
          <Input label="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Enter name" />
          <Select label="Level" value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })}
            options={levels.map((l) => ({ value: l.name, label: l.name }))} />
          <Select label="Station" value={form.station} onChange={(e) => setForm({ ...form, station: e.target.value })}
            options={stations.map((s) => ({ value: s.name, label: s.name }))} />
          <Select label="Status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
            options={[{ value: 'Active', label: 'Active' }, { value: 'Inactive', label: 'Inactive' }]} />
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setModal(false)} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition">Cancel</button>
            <button onClick={handleSave} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Save</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
