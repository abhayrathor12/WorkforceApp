import { useEffect, useState } from 'react';
import { Plus, CreditCard as Edit2, Trash2 } from 'lucide-react';
import { Card } from '../components/ui/Card';
import DataTable, { Column } from '../components/ui/DataTable';
import Modal from '../components/ui/Modal';
import { Input } from '../components/ui/FormInput';
import { levelsApi } from '../api/services';

interface Level { id: number; name: string; description: string }
const emptyForm = { name: '', description: '' };

export default function Levels() {
  const [data, setData] = useState<Level[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Level | null>(null);
  const [form, setForm] = useState(emptyForm);

  const load = async () => { setLoading(true); setData(await levelsApi.list() as Level[]); setLoading(false); };
  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm(emptyForm); setModal(true); };
  const openEdit = (r: Level) => { setEditing(r); setForm({ name: r.name, description: r.description }); setModal(true); };
  const handleDelete = async (id: number) => { await levelsApi.remove(id).catch(() => {}); setData((p) => p.filter((l) => l.id !== id)); };
  const handleSave = async () => {
    if (editing) await levelsApi.update(editing.id, form).catch(() => {});
    else await levelsApi.create(form).catch(() => {});
    setModal(false); load();
  };

  const columns: Column<Record<string, unknown>>[] = [
    { key: 'name', header: 'Level Name' },
    { key: 'description', header: 'Description' },
    {
      key: 'actions', header: 'Actions', render: (r) => (
        <div className="flex gap-2">
          <button onClick={() => openEdit(r as unknown as Level)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"><Edit2 size={14} /></button>
          <button onClick={() => handleDelete(r.id as number)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition"><Trash2 size={14} /></button>
        </div>
      )
    },
  ];

  return (
    <div className="space-y-4">
      <Card action={
        <button onClick={openAdd} className="flex items-center gap-1.5 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-blue-700 transition">
          <Plus size={15} /> Add Level
        </button>
      }>
        <DataTable columns={columns} data={data as Record<string, unknown>[]} loading={loading} />
      </Card>
      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit Level' : 'Add Level'} size="sm">
        <div className="space-y-4">
          <Input label="Level Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. L1" />
          <Input label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="e.g. Entry Level Operator" />
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setModal(false)} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition">Cancel</button>
            <button onClick={handleSave} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Save</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
