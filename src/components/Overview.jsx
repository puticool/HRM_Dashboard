import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";
import PropTypes from "prop-types";
import { useTheme } from "@/hooks/use-theme";

const OverviewChart = ({ data, title = "Overview" }) => {
  const { theme } = useTheme();

  // Tùy chỉnh kiểu hiển thị chú thích
  const renderColorfulLegendText = (value, entry) => {
    const { color } = entry;
    
    return <span style={{ color }}>{value}</span>;
  };

  return (
    <div className="card">
      <div className="card-header">
        <p className="card-title">{title}</p>
      </div>
      <div className="card-body p-0">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={data}
            margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
          >
            <Tooltip cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }} formatter={(value, name) => [`${value}`, name]} />
            
            <XAxis
              dataKey="name"
              strokeWidth={0}
              stroke={theme === "light" ? "#475569" : "#94a3b8"}
              tickMargin={6}
            />
            
            <YAxis
              strokeWidth={0}
              stroke={theme === "light" ? "#475569" : "#94a3b8"}
              tickFormatter={(value) => `${value}`}
              tickMargin={9}
            />
            
            <Legend 
              formatter={renderColorfulLegendText} 
              iconType="circle"
              wrapperStyle={{ paddingTop: 10 }}
            />
            
            <Bar
              dataKey="users"
              name="Users"
              fill="#2563eb"
            />
            
            <Bar
              dataKey="words"
              name="Words"
              fill="#10b981"
            />
            
            <Bar
              dataKey="topics"
              name="Topics"
              fill="#f59e0b"
            />
            
            <Bar
              dataKey="levels"
              name="Levels"
              fill="#8b5cf6"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

OverviewChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  title: PropTypes.string
};

export default OverviewChart;