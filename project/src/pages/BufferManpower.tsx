import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Card } from '../components/ui/Card';
import DataTable, { Column } from '../components/ui/DataTable';
import Modal from '../components/ui/Modal';
import { Input, Select } from '../components/ui/FormInput';
import { bufferApi, levelsApi } from '../api/services';

interface Buffer { id: number; level: string; required: number; available: number; date: string }
interface Level { id: number; name: string }
const emptyForm = { level: '', required: '', available: '', date: new Date().toISOString().split('T')[0] };

export default function BufferManpower() {
  const [data, setData] = useState<Buffer[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const load = async () => {
    setLoading(true);
    const [d, l] = await Promise.all([bufferApi.list(), levelsApi.list()]);
    setData(d as Buffer[]); setLevels(l as Level[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    await bufferApi.create({ ...form, required: Number(form.required), available: Number(form.available) }).catch(() => {});
    setModal(false); load();
  };

  const handleDelete = async (id: number) => {
    await bufferApi.remove(id).catch(() => {});
    setData((p) => p.filter((r) => r.id !== id));
  };

  const columns: Column<Record<string, unknown>>[] = [
    { key: 'level', header: 'Level' },
    { key: 'required', header: 'Required' },
    { key: 'available', header: 'Available' },
    {
      key: 'gap', header: 'Gap', render: (r) => {
        const gap = (r.available as number) - (r.required as number);
        return <span className={gap < 0 ? 'text-red-600 font-semibold' : 'text-green-600 font-semibold'}>{gap > 0 ? `+${gap}` : gap}</span>;
      }
    },
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
        <button onClick={() => { setForm(emptyForm); setModal(true); }} className="flex items-center gap-1.5 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-blue-700 transition">
          <Plus size={15} /> Add Entry
        </button>
      } title="Buffer Manpower">
        <DataTable columns={columns} data={data as Record<string, unknown>[]} loading={loading} />
      </Card>

      <Modal open={modal} onClose={() => setModal(false)} title="Add Buffer Entry" size="sm">
        <div className="space-y-4">
          <Select label="Level" value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })}
            options={levels.map((l) => ({ value: l.name, label: l.name }))} />
          <Input label="Required" type="number" value={form.required} onChange={(e) => setForm({ ...form, required: e.target.value })} min={0} />
          <Input label="Available" type="number" value={form.available} onChange={(e) => setForm({ ...form, available: e.target.value })} min={0} />
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
