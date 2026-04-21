import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Card } from '../components/ui/Card';
import DataTable, { Column } from '../components/ui/DataTable';
import Modal from '../components/ui/Modal';
import Badge from '../components/ui/Badge';
import { Input, Select } from '../components/ui/FormInput';
import { trainingApi, employeesApi } from '../api/services';

interface Training { id: number; employee: string; training_name: string; process: string; status: string }
interface Employee { id: number; name: string }
const emptyForm = { employee: '', training_name: '', process: '', status: 'Pending' };

const processes = ['Quality Management', 'Production', 'Management', 'Health & Safety', 'Operations', 'Other'];

export default function Training() {
  const [data, setData] = useState<Training[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [filter, setFilter] = useState('');
  const [form, setForm] = useState(emptyForm);

  const load = async () => {
    setLoading(true);
    const [d, e] = await Promise.all([trainingApi.list(), employeesApi.list()]);
    setData(d as Training[]);
    setEmployees(e as Employee[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = data.filter((r) =>
    (filter === '' || r.status.toLowerCase() === filter.toLowerCase()) &&
    r.process.toLowerCase().includes(form.process === '' ? '' : form.process.toLowerCase())
  );

  const handleSave = async () => {
    await trainingApi.create(form).catch(() => {});
    setModal(false); load();
  };

  const handleDelete = async (id: number) => {
    await trainingApi.remove(id).catch(() => {});
    setData((p) => p.filter((r) => r.id !== id));
  };

  const completed = data.filter((r) => r.status === 'Completed').length;
  const pending = data.filter((r) => r.status === 'Pending').length;
  const inProgress = data.filter((r) => r.status === 'In Progress').length;

  const columns: Column<Record<string, unknown>>[] = [
    { key: 'employee', header: 'Employee' },
    { key: 'training_name', header: 'Training Name' },
    { key: 'process', header: 'Process' },
    {
      key: 'status', header: 'Status', render: (r) => {
        const s = r.status as string;
        const variant = s === 'Completed' ? 'green' : s === 'In Progress' ? 'blue' : 'yellow';
        return <Badge label={s} variant={variant} />;
      }
    },
    {
      key: 'actions', header: '', render: (r) => (
        <button onClick={() => handleDelete(r.id as number)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition">
          <Trash2 size={14} />
        </button>
      )
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center shadow-sm">
          <p className="text-3xl font-bold text-green-600">{completed}</p>
          <p className="text-gray-500 text-sm mt-1">Completed</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center shadow-sm">
          <p className="text-3xl font-bold text-blue-600">{inProgress}</p>
          <p className="text-gray-500 text-sm mt-1">In Progress</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center shadow-sm">
          <p className="text-3xl font-bold text-yellow-600">{pending}</p>
          <p className="text-gray-500 text-sm mt-1">Pending</p>
        </div>
      </div>

      <Card
        action={
          <div className="flex gap-3">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">All Status</option>
              <option value="Completed">Completed</option>
              <option value="In Progress">In Progress</option>
              <option value="Pending">Pending</option>
            </select>
            <button onClick={() => { setForm(emptyForm); setModal(true); }} className="flex items-center gap-1.5 bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-emerald-700 transition">
              <Plus size={15} /> Add Training
            </button>
          </div>
        }
      >
        <DataTable columns={columns} data={filtered as Record<string, unknown>[]} loading={loading} />
      </Card>

      <Modal open={modal} onClose={() => setModal(false)} title="Add Training" size="sm">
        <div className="space-y-4">
          <Select label="Employee" value={form.employee} onChange={(e) => setForm({ ...form, employee: e.target.value })}
            options={employees.map((e) => ({ value: e.name, label: e.name }))} />
          <Input label="Training Name" value={form.training_name} onChange={(e) => setForm({ ...form, training_name: e.target.value })} placeholder="e.g. Six Sigma" />
          <Select label="Process" value={form.process} onChange={(e) => setForm({ ...form, process: e.target.value })}
            options={processes.map((p) => ({ value: p, label: p }))} />
          <Select label="Status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
            options={[{ value: 'Pending', label: 'Pending' }, { value: 'In Progress', label: 'In Progress' }, { value: 'Completed', label: 'Completed' }]} />
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setModal(false)} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition">Cancel</button>
            <button onClick={handleSave} className="px-4 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition">Save</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
