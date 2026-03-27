import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

const PIE_COLORS = ["#7fd0ff", "#5ab8f0", "#2c98e9"];
const BAR_COLORS = ["#7fd0ff", "#5ab8f0", "#2c98e9"];

export default function WorkerStatusChart({ data, workerCount = 0 }) {
  const total = data.reduce((s, d) => s + (Number(d.value) || 0), 0);

  if (!workerCount && total === 0) {
    return (
      <div className="card dashboard-chart-card">
        <h3>Worker status</h3>
        <p className="chart-empty-hint">
          Add workers from the Workers page to see status distribution (Normal / Warning / Danger from
          alerts).
        </p>
      </div>
    );
  }

  return (
    <div className="card dashboard-chart-card">
      <h3>Worker status</h3>
      <p className="chart-subtitle">Distribution by latest alert type per worker</p>
      <div className="chart-grid">
        <div className="chart-block">
          <h4 className="chart-block-title">Bar chart</h4>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#c5e4f5" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: "#3d7196", fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fill: "#3d7196", fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  background: "#f0f9ff",
                  border: "1px solid #b8defb",
                  borderRadius: 8
                }}
              />
              <Bar dataKey="value" name="Workers" radius={[8, 8, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={entry.name} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-block">
          <h4 className="chart-block-title">Pie chart</h4>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={48}
                outerRadius={88}
                paddingAngle={2}
                label={({ name, value }) => `${name}: ${value}`}
              >
                {data.map((entry, index) => (
                  <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
