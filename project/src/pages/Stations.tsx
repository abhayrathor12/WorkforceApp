import { useEffect, useState } from 'react';
import { Plus, CreditCard as Edit2, Trash2 } from 'lucide-react';
import { Card } from '../components/ui/Card';
import DataTable, { Column } from '../components/ui/DataTable';
import Modal from '../components/ui/Modal';
import Badge from '../components/ui/Badge';
import { Input } from '../components/ui/FormInput';
import { stationsApi } from '../api/services';

interface Station { id: number; name: string; ctq: boolean }
const emptyForm = { name: '', ctq: false };

export default function Stations() {
  const [data, setData] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Station | null>(null);
  const [form, setForm] = useState(emptyForm);

  const load = async () => { setLoading(true); setData(await stationsApi.list() as Station[]); setLoading(false); };
  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm(emptyForm); setModal(true); };
  const openEdit = (r: Station) => { setEditing(r); setForm({ name: r.name, ctq: r.ctq }); setModal(true); };
  const handleDelete = async (id: number) => { await stationsApi.remove(id).catch(() => {}); setData((p) => p.filter((s) => s.id !== id)); };
  const handleSave = async () => {
    if (editing) await stationsApi.update(editing.id, form).catch(() => {});
    else await stationsApi.create(form).catch(() => {});
    setModal(false); load();
  };

  const columns: Column<Record<string, unknown>>[] = [
    { key: 'name', header: 'Station Name' },
    { key: 'ctq', header: 'CTQ', render: (r) => <Badge label={r.ctq ? 'CTQ' : 'Non-CTQ'} variant={r.ctq ? 'blue' : 'gray'} /> },
    {
      key: 'actions', header: 'Actions', render: (r) => (
        <div className="flex gap-2">
          <button onClick={() => openEdit(r as unknown as Station)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"><Edit2 size={14} /></button>
          <button onClick={() => handleDelete(r.id as number)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition"><Trash2 size={14} /></button>
        </div>
      )
    },
  ];

  return (
    <div className="space-y-4">
      <Card action={
        <button onClick={openAdd} className="flex items-center gap-1.5 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-blue-700 transition">
          <Plus size={15} /> Add Station
        </button>
      }>
        <DataTable columns={columns} data={data as Record<string, unknown>[]} loading={loading} />
      </Card>
      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit Station' : 'Add Station'} size="sm">
        <div className="space-y-4">
          <Input label="Station Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Assembly A" />
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.ctq}
              onChange={(e) => setForm({ ...form, ctq: e.target.checked })}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <span className="text-sm font-medium text-gray-700">CTQ Station (Critical to Quality)</span>
          </label>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setModal(false)} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition">Cancel</button>
            <button onClick={handleSave} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Save</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
