import {
  Area,
  AreaChart,
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

const dynamicPieColors = {
  low: ["#2ecc71", "#a9dfbf", "#d5f5e3"],
  medium: ["#f1c40f", "#fdebd0", "#fcf3cf"],
  high: ["#e74c3c", "#fadbd8", "#f5b7b1"]
};

export default function WorkerStatusChart({ data, workerCount = 0, dangerLevel = "low" }) {
  const total = data.reduce((s, d) => s + (Number(d.value) || 0), 0);

  if (!workerCount && total === 0) {
    return (
      <div className="card dashboard-chart-card">
        <h3>Worker status</h3>
        <p className="chart-empty-hint">
          Add workers to see chart data.
        </p>
      </div>
    );
  }

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
    <div style={{ width: "100%", height: 260 }}>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
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

  {/* Pie Chart */}
  <div className="card dashboard-chart-card chart-block">
    <h4 className="chart-block-title">Pie chart</h4>
    <div style={{ width: "100%", height: 260 }}>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart margin={{ top:10,right:10,left:10,bottom:20}}>
          <Pie
            data={data}
            dataKey="value"
            innerRadius={50}
            outerRadius={70}
            paddingAngle={2}
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={dynamicPieColors[dangerLevel][index % 3]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend
          verticalAlign="bottom"
          align="center"
          height={36}
          wrapperStyle={{ fontSize: "12px", overflow:"hidden" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </div>
</div>
    </div>
  );
}