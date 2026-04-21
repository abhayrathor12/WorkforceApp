import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { Card } from '../components/ui/Card';
import DataTable, { Column } from '../components/ui/DataTable';
import Modal from '../components/ui/Modal';
import { Input, Select, Textarea } from '../components/ui/FormInput';
import { attritionApi, employeesApi } from '../api/services';

interface AttritionRecord { id: number; employee: string; exit_date: string; reason: string }
interface Employee { id: number; name: string }
const emptyForm = { employee: '', exit_date: new Date().toISOString().split('T')[0], reason: '' };

const reasons = [
  'Better opportunity',
  'Relocation',
  'Personal reasons',
  'Health issues',
  'Retirement',
  'Termination',
  'Other',
];

export default function Attrition() {
  const [data, setData] = useState<AttritionRecord[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const load = async () => {
    setLoading(true);
    const [d, e] = await Promise.all([attritionApi.list(), employeesApi.list()]);
    setData(d as AttritionRecord[]);
    setEmployees((e as Employee[]).filter((emp) => (emp as unknown as { status: string }).status === 'Active'));
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    await attritionApi.create(form).catch(() => {});
    setModal(false); load();
  };

  const columns: Column<Record<string, unknown>>[] = [
    { key: 'employee', header: 'Employee' },
    { key: 'exit_date', header: 'Exit Date' },
    { key: 'reason', header: 'Reason' },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center shadow-sm">
          <p className="text-3xl font-bold text-blue-600">{data.length}</p>
          <p className="text-gray-500 text-sm mt-1">Total Exits</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center shadow-sm">
          <p className="text-3xl font-bold text-orange-500">
            {data.filter((r) => new Date(r.exit_date).getMonth() === new Date().getMonth()).length}
          </p>
          <p className="text-gray-500 text-sm mt-1">This Month</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center shadow-sm">
          <p className="text-3xl font-bold text-red-500">
            {employees.length > 0 ? ((data.length / (employees.length + data.length)) * 100).toFixed(1) : '0.0'}%
          </p>
          <p className="text-gray-500 text-sm mt-1">Attrition Rate</p>
        </div>
      </div>

      <Card action={
        <button onClick={() => { setForm(emptyForm); setModal(true); }} className="flex items-center gap-1.5 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-blue-700 transition">
          <Plus size={15} /> Mark Exit
        </button>
      } title="Attrition History">
        <DataTable columns={columns} data={data as Record<string, unknown>[]} loading={loading} />
      </Card>

      <Modal open={modal} onClose={() => setModal(false)} title="Mark Employee Exit" size="sm">
        <div className="space-y-4">
          <Select label="Employee" value={form.employee} onChange={(e) => setForm({ ...form, employee: e.target.value })}
            options={employees.map((e) => ({ value: e.name, label: e.name }))} />
          <Input label="Exit Date" type="date" value={form.exit_date} onChange={(e) => setForm({ ...form, exit_date: e.target.value })} />
          <Select label="Reason" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })}
            options={reasons.map((r) => ({ value: r, label: r }))} />
          {form.reason === 'Other' && (
            <Textarea label="Additional Details" value={''} onChange={() => {}} placeholder="Provide more details..." />
          )}
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setModal(false)} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition">Cancel</button>
            <button onClick={handleSave} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Save</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
