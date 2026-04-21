import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Card } from '../components/ui/Card';
import DataTable, { Column } from '../components/ui/DataTable';
import Modal from '../components/ui/Modal';
import { Input, Select } from '../components/ui/FormInput';
import { manpowerApi, levelsApi, stationsApi } from '../api/services';

interface ManpowerReq { id: number; station: string; level: string; required: number; date: string }
interface Opt { id: number; name: string }
const emptyForm = { station: '', level: '', required: '', date: new Date().toISOString().split('T')[0] };

export default function ManpowerRequirement() {
  const [data, setData] = useState<ManpowerReq[]>([]);
  const [levels, setLevels] = useState<Opt[]>([]);
  const [stations, setStations] = useState<Opt[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [filter, setFilter] = useState('');

  const load = async () => {
    setLoading(true);
    const [d, l, s] = await Promise.all([manpowerApi.list(), levelsApi.list(), stationsApi.list()]);
    setData(d as ManpowerReq[]); setLevels(l as Opt[]); setStations(s as Opt[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    await manpowerApi.create({ ...form, required: Number(form.required) }).catch(() => {});
    setModal(false); load();
  };

  const handleDelete = async (id: number) => {
    await manpowerApi.remove(id).catch(() => {});
    setData((p) => p.filter((r) => r.id !== id));
  };

  const filtered = data.filter((r) =>
    r.station.toLowerCase().includes(filter.toLowerCase()) || r.level.toLowerCase().includes(filter.toLowerCase())
  );

  const columns: Column<Record<string, unknown>>[] = [
    { key: 'station', header: 'Station' },
    { key: 'level', header: 'Level' },
    { key: 'required', header: 'Required Count' },
    { key: 'date', header: 'Date' },
    {
      key: 'actions', header: '', render: (r) => (
        <button onClick={() => handleDelete(r.id as number)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition"><Trash2 size={14} /></button>
      )
    },
  ];

  return (
    <div className="space-y-4">
      <Card action={
        <div className="flex gap-3">
          <input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Filter..." className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <button onClick={() => { setForm(emptyForm); setModal(true); }} className="flex items-center gap-1.5 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-blue-700 transition">
            <Plus size={15} /> Add
          </button>
        </div>
      } title="Manpower Requirements">
        <DataTable columns={columns} data={filtered as Record<string, unknown>[]} loading={loading} />
      </Card>

      <Modal open={modal} onClose={() => setModal(false)} title="Add Manpower Requirement" size="sm">
        <div className="space-y-4">
          <Select label="Station" value={form.station} onChange={(e) => setForm({ ...form, station: e.target.value })}
            options={stations.map((s) => ({ value: s.name, label: s.name }))} />
          <Select label="Level" value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })}
            options={levels.map((l) => ({ value: l.name, label: l.name }))} />
          <Input label="Required Count" type="number" value={form.required} onChange={(e) => setForm({ ...form, required: e.target.value })} min={1} />
          <Input label="Date" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setModal(false)} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition">Cancel</button>
            <button onClick={handleSave} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Save</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
