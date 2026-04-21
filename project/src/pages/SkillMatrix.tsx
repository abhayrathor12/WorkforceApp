import { useEffect, useState } from 'react';
import { Plus, Search, Trash2 } from 'lucide-react';
import { Card } from '../components/ui/Card';
import DataTable, { Column } from '../components/ui/DataTable';
import Modal from '../components/ui/Modal';
import Badge from '../components/ui/Badge';
import { Input, Select } from '../components/ui/FormInput';
import { skillMatrixApi, employeesApi } from '../api/services';

interface SkillRecord { id: number; employee: string; skill: string; level: number }
interface Employee { id: number; name: string }
const emptyForm = { employee: '', skill: '', level: '3' };

const levelColors: Record<number, string> = { 1: 'red', 2: 'yellow', 3: 'blue', 4: 'emerald', 5: 'emerald' };
const levelLabels: Record<number, string> = { 1: 'Novice', 2: 'Beginner', 3: 'Intermediate', 4: 'Advanced', 5: 'Expert' };

export default function SkillMatrix() {
  const [data, setData] = useState<SkillRecord[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const load = async () => {
    setLoading(true);
    const [d, e] = await Promise.all([skillMatrixApi.list(), employeesApi.list()]);
    setData(d as SkillRecord[]);
    setEmployees(e as Employee[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = data.filter((r) =>
    r.employee.toLowerCase().includes(search.toLowerCase()) ||
    r.skill.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async () => {
    await skillMatrixApi.create({ ...form, level: Number(form.level) }).catch(() => {});
    setModal(false); load();
  };

  const handleDelete = async (id: number) => {
    await skillMatrixApi.remove(id).catch(() => {});
    setData((p) => p.filter((r) => r.id !== id));
  };

  const columns: Column<Record<string, unknown>>[] = [
    { key: 'employee', header: 'Employee' },
    { key: 'skill', header: 'Skill' },
    {
      key: 'level', header: 'Level', render: (r) => {
        const lvl = r.level as number;
        return <Badge label={`${lvl} - ${levelLabels[lvl]}`} variant={levelColors[lvl] as 'red' | 'yellow' | 'blue' | 'green'} />;
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
      <Card
        action={
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <button onClick={() => { setForm(emptyForm); setModal(true); }} className="flex items-center gap-1.5 bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-emerald-700 transition">
              <Plus size={15} /> Add Skill
            </button>
          </div>
        }
      >
        <DataTable columns={columns} data={filtered as Record<string, unknown>[]} loading={loading} />
      </Card>

      <Modal open={modal} onClose={() => setModal(false)} title="Add Skill" size="sm">
        <div className="space-y-4">
          <Select label="Employee" value={form.employee} onChange={(e) => setForm({ ...form, employee: e.target.value })}
            options={employees.map((e) => ({ value: e.name, label: e.name }))} />
          <Input label="Skill" value={form.skill} onChange={(e) => setForm({ ...form, skill: e.target.value })} placeholder="e.g. Assembly" />
          <Select label="Level (1-5)" value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })}
            options={[1, 2, 3, 4, 5].map((l) => ({ value: String(l), label: `${l} - ${levelLabels[l]}` }))} />
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setModal(false)} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition">Cancel</button>
            <button onClick={handleSave} className="px-4 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition">Save</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
