export const dummyDashboard = {
  total_ctq_stations: 24,
  operators_required: 180,
  operators_available: 162,
  buffer_required: 18,
  buffer_available: 14,
};

export const dummyManpowerTrend = [
  { month: 'Jan', required: 170, available: 160 },
  { month: 'Feb', required: 175, available: 165 },
  { month: 'Mar', required: 180, available: 162 },
  { month: 'Apr', required: 178, available: 170 },
  { month: 'May', required: 182, available: 175 },
  { month: 'Jun', required: 185, available: 178 },
];

export const dummyAttritionTrend = [
  { month: 'Jan', rate: 2.1 },
  { month: 'Feb', rate: 1.8 },
  { month: 'Mar', rate: 2.5 },
  { month: 'Apr', rate: 1.9 },
  { month: 'May', rate: 2.3 },
  { month: 'Jun', rate: 1.6 },
];

export const dummyAbsenteeism = [
  { month: 'Jan', rate: 4.2 },
  { month: 'Feb', rate: 3.8 },
  { month: 'Mar', rate: 5.1 },
  { month: 'Apr', rate: 4.5 },
  { month: 'May', rate: 3.9 },
  { month: 'Jun', rate: 4.7 },
];

export const dummyLevelComparison = [
  { level: 'L1', required: 60, available: 55 },
  { level: 'L2', required: 50, available: 48 },
  { level: 'L3', required: 40, available: 36 },
  { level: 'L4', required: 30, available: 23 },
];

export const dummyEmployees = [
  { id: 1, name: 'Amit Sharma', level: 'L1', station: 'Assembly A', status: 'Active' },
  { id: 2, name: 'Priya Singh', level: 'L2', station: 'QC Line', status: 'Active' },
  { id: 3, name: 'Rahul Verma', level: 'L3', station: 'Welding Bay', status: 'Inactive' },
  { id: 4, name: 'Sunita Patel', level: 'L1', station: 'Paint Shop', status: 'Active' },
  { id: 5, name: 'Deepak Kumar', level: 'L4', station: 'Final Assembly', status: 'Active' },
];

export const dummyLevels = [
  { id: 1, name: 'L1', description: 'Entry Level Operator' },
  { id: 2, name: 'L2', description: 'Skilled Operator' },
  { id: 3, name: 'L3', description: 'Senior Operator' },
  { id: 4, name: 'L4', description: 'Lead Operator' },
];

export const dummyStations = [
  { id: 1, name: 'Assembly A', ctq: true },
  { id: 2, name: 'QC Line', ctq: true },
  { id: 3, name: 'Welding Bay', ctq: false },
  { id: 4, name: 'Paint Shop', ctq: false },
  { id: 5, name: 'Final Assembly', ctq: true },
];

export const dummyAttendance = [
  { id: 1, employee: 'Amit Sharma', date: '2024-06-01', status: 'Present' },
  { id: 2, employee: 'Priya Singh', date: '2024-06-01', status: 'Absent' },
  { id: 3, employee: 'Rahul Verma', date: '2024-06-01', status: 'Present' },
  { id: 4, employee: 'Sunita Patel', date: '2024-06-01', status: 'Present' },
  { id: 5, employee: 'Deepak Kumar', date: '2024-06-01', status: 'Absent' },
];

export const dummyManpowerReq = [
  { id: 1, station: 'Assembly A', level: 'L1', required: 20, date: '2024-06-01' },
  { id: 2, station: 'QC Line', level: 'L2', required: 15, date: '2024-06-01' },
  { id: 3, station: 'Welding Bay', level: 'L3', required: 10, date: '2024-06-01' },
];

export const dummyBuffer = [
  { id: 1, level: 'L1', required: 8, available: 6, date: '2024-06-01' },
  { id: 2, level: 'L2', required: 5, available: 4, date: '2024-06-01' },
  { id: 3, level: 'L3', required: 3, available: 2, date: '2024-06-01' },
];

export const dummyAttrition = [
  { id: 1, employee: 'Rajesh Gupta', exit_date: '2024-05-15', reason: 'Better opportunity' },
  { id: 2, employee: 'Meena Joshi', exit_date: '2024-04-20', reason: 'Relocation' },
  { id: 3, employee: 'Vikram Nair', exit_date: '2024-03-10', reason: 'Personal reasons' },
];

export const dummySkillMatrix = [
  { id: 1, employee: 'Amit Sharma', skill: 'Assembly', level: 4 },
  { id: 2, employee: 'Amit Sharma', skill: 'Quality Control', level: 2 },
  { id: 3, employee: 'Priya Singh', skill: 'Welding', level: 5 },
  { id: 4, employee: 'Priya Singh', skill: 'Inspection', level: 4 },
  { id: 5, employee: 'Rahul Verma', skill: 'Assembly', level: 3 },
  { id: 6, employee: 'Rahul Verma', skill: 'Welding', level: 2 },
  { id: 7, employee: 'Sunita Patel', skill: 'Painting', level: 5 },
  { id: 8, employee: 'Sunita Patel', skill: 'Safety', level: 3 },
  { id: 9, employee: 'Deepak Kumar', skill: 'Final Assembly', level: 5 },
  { id: 10, employee: 'Deepak Kumar', skill: 'Training', level: 4 },
];

export const dummyTraining = [
  { id: 1, employee: 'Amit Sharma', training_name: 'Six Sigma Green Belt', process: 'Quality Management', status: 'Completed' },
  { id: 2, employee: 'Priya Singh', training_name: 'Advanced Welding Techniques', process: 'Production', status: 'Pending' },
  { id: 3, employee: 'Rahul Verma', training_name: 'Leadership Development', process: 'Management', status: 'Completed' },
  { id: 4, employee: 'Sunita Patel', training_name: 'Safety Certification', process: 'Health & Safety', status: 'In Progress' },
  { id: 5, employee: 'Deepak Kumar', training_name: 'Lean Manufacturing', process: 'Operations', status: 'Completed' },
];

export const dummyActionPlans = [
  { id: 1, title: 'Hire 5 L4 Operators', description: 'Address shortage in Level 4 operators', type: 'manpower', priority: 'high', assigned_to: 'HR Manager', status: 'in_progress', due_date: '2024-07-15' },
  { id: 2, title: 'Attrition Exit Interview Review', description: 'Conduct interviews to identify trends', type: 'attrition', priority: 'medium', assigned_to: 'Admin Lead', status: 'pending', due_date: '2024-06-30' },
  { id: 3, title: 'Skill Gap Analysis for L2', description: 'Identify training needs for Level 2 staff', type: 'skill', priority: 'high', assigned_to: 'Training Lead', status: 'pending', due_date: '2024-07-01' },
  { id: 4, title: 'Buffer Pool Creation', description: 'Build contingent workforce buffer', type: 'buffer', priority: 'medium', assigned_to: 'Operations Manager', status: 'in_progress', due_date: '2024-08-15' },
  { id: 5, title: 'Process Documentation', description: 'Complete DOJO process documentation', type: 'skill', priority: 'low', assigned_to: 'Training Lead', status: 'completed', due_date: '2024-05-20' },
];
