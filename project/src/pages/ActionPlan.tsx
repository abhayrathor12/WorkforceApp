import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Card } from '../components/ui/Card';
import DataTable, { Column } from '../components/ui/DataTable';
import Modal from '../components/ui/Modal';
import Badge from '../components/ui/Badge';
import { Input, Select, Textarea } from '../components/ui/FormInput';
import { actionPlanApi, employeesApi } from '../api/services';

interface ActionPlan { id: number; title: string; description: string; type: string; priority: string; assigned_to: string; status: string; due_date: string }
interface Employee { id: number; name: string }

const emptyForm = { title: '', description: '', type: 'manpower', priority: 'medium', assigned_to: '', status: 'pending', due_date: '' };
const types = ['manpower', 'attrition', 'skill', 'buffer'];
const priorities = ['low', 'medium', 'high'];

const priorityColors: Record<string, 'red' | 'yellow' | 'green'> = { high: 'red', medium: 'yellow', low: 'green' };
const statusColors: Record<string, 'blue' | 'yellow' | 'green'> = { pending: 'blue', in_progress: 'yellow', completed: 'green' };

export default function ActionPlan() {
  const [data, setData] = useState<ActionPlan[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [form, setForm] = useState(emptyForm);

  const load = async () => {
    setLoading(true);
    const [d, e] = await Promise.all([actionPlanApi.list(), employeesApi.list()]);
    setData(d as ActionPlan[]);
    setEmployees(e as Employee[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = data.filter((r) =>
    (statusFilter === '' || r.status === statusFilter) &&
    (priorityFilter === '' || r.priority === priorityFilter)
  );

  const handleSave = async () => {
    await actionPlanApi.create(form).catch(() => {});
    setModal(false); load();
  };

  const handleDelete = async (id: number) => {
    await actionPlanApi.remove(id).catch(() => {});
    setData((p) => p.filter((r) => r.id !== id));
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    const item = data.find((r) => r.id === id);
    if (item) {
      await actionPlanApi.update(id, { ...item, status: newStatus }).catch(() => {});
      setData((p) => p.map((r) => r.id === id ? { ...r, status: newStatus } : r));
    }
  };

  const high = data.filter((r) => r.priority === 'high').length;
  const open = data.filter((r) => r.status !== 'completed').length;

  const columns: Column<Record<string, unknown>>[] = [
    { key: 'title', header: 'Title' },
    { key: 'type', header: 'Type' },
    {
      key: 'priority', header: 'Priority', render: (r) => (
        <Badge label={(r.priority as string).charAt(0).toUpperCase() + (r.priority as string).slice(1)} variant={priorityColors[r.priority as string]} />
      )
    },
    { key: 'assigned_to', header: 'Assigned To' },
    {
      key: 'status', header: 'Status', render: (r) => (
        <select
          value={r.status as string}
          onChange={(e) => handleStatusChange(r.id as number, e.target.value)}
          className="text-xs border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      )
    },
    { key: 'due_date', header: 'Due Date' },
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
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center shadow-sm">
          <p className="text-3xl font-bold text-red-600">{high}</p>
          <p className="text-gray-500 text-sm mt-1">High Priority</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center shadow-sm">
          <p className="text-3xl font-bold text-blue-600">{open}</p>
          <p className="text-gray-500 text-sm mt-1">Open Actions</p>
        </div>
      </div>

      <Card
        action={
          <div className="flex gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <button onClick={() => { setForm(emptyForm); setModal(true); }} className="flex items-center gap-1.5 bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-emerald-700 transition">
              <Plus size={15} /> New Action
            </button>
          </div>
        }
      >
        <DataTable columns={columns} data={filtered as Record<string, unknown>[]} loading={loading} />
      </Card>

      <Modal open={modal} onClose={() => setModal(false)} title="Create Action Plan">
        <div className="space-y-4">
          <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Action title" />
          <Textarea label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Detailed description" />
          <Select label="Type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
            options={types.map((t) => ({ value: t, label: t.charAt(0).toUpperCase() + t.slice(1) }))} />
          <Select label="Priority" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}
            options={priorities.map((p) => ({ value: p, label: p.charAt(0).toUpperCase() + p.slice(1) }))} />
          <Select label="Assigned To" value={form.assigned_to} onChange={(e) => setForm({ ...form, assigned_to: e.target.value })}
            options={employees.map((e) => ({ value: e.name, label: e.name }))} />
          <Input label="Due Date" type="date" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} />
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setModal(false)} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition">Cancel</button>
            <button onClick={handleSave} className="px-4 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition">Create</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
