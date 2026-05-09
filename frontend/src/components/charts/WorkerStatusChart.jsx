import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

const barColors = {
  Gas: "#1aac57",
  Heat: "#f1c40f",
  Flame: "#e74c3c"
};

export default function WorkerStatusChart({ data,hazardTypeData, workerCount = 0, dangerLevel = "low" }) {
  const total = data.reduce((s, d) => s + (Number(d.value) || 0), 0);

  const isEmpty = data.every(d => d.value === 0);

  const safeHazardTypeData = (hazardTypeData || []).map(item => ({
  ...item,
  value: item.value === 0 ? 0.001 : item.value
}));

       
  const chartColors = {
  low: {
    stroke: "#27ae60",
    fill: "#a9dfbf"
  },
  medium: {
    stroke: "#f39c12",
    fill: "#fdebd0"
  },
  high: {
    stroke: "#e74c3c",
    fill: "#fadbd8"
  }
};

  return (
    <div className="card dashboard-chart-card">
      <h3>Worker status</h3>
      <p className="chart-subtitle">
        Distribution by latest alert type per worker
      </p>

      <div className="chart-grid">

  {/* Area Chart */}
  <div className="card dashboard-chart-card chart-block">
    <h4 className="chart-block-title">Area chart</h4>
    <div style={{ width: "100%", flex: 1, minHeight: 200}}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name"
          tickMargin={12}
           />
          <YAxis allowDecimals={false}
          tickMargin={8}
           />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="value"
            stroke={chartColors[dangerLevel].stroke}
            fill={chartColors[dangerLevel].fill}
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </div>

{/* Bar Chart */}
<div className="card dashboard-chart-card chart-block">
  <h4 className="chart-block-title">Hazard Types</h4>

  <div style={{ width: "100%", flex: 1, minHeight: 200 }}>
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={safeHazardTypeData} >

  <CartesianGrid strokeDasharray="3 3" vertical={false} />

  <XAxis dataKey="name" tickMargin={12} />
  <YAxis allowDecimals={false} domain={[0, 'auto']} />

  <Tooltip />

  <Bar dataKey="value" barSize={40} radius={[6, 6, 0, 0]}>
    {safeHazardTypeData.map((entry, index) => (
      <Cell
      key={index}
      fill={barColors[entry.name]}
      />
    ))}
  </Bar>

</BarChart>
    </ResponsiveContainer>
    </div>
    </div>
    </div>
    </div>
  );
}