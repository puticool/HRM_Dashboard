import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend, CartesianGrid } from "recharts";
import PropTypes from "prop-types";
import { useTheme } from "@/hooks/use-theme";

const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(value);
};

// Tùy chỉnh kiểu hiển thị tooltip
const TooltipContent = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-4 border border-gray-200/50 dark:border-gray-700/50 rounded-xl shadow-lg min-w-[280px]">
        <p className="font-medium text-gray-600 dark:text-gray-300 border-b border-gray-200/50 dark:border-gray-700/50 pb-2 mb-3">
          {label}
        </p>
        <div className="space-y-2.5">
          {payload.map((entry, index) => (
            <p key={index} className="flex justify-between items-center text-sm group">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></span>
                <span className="text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                  {entry.name}:
                </span>
              </span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {entry.name === "Số nhân viên" 
                  ? `${entry.value} người`
                  : formatCurrency(entry.value)}
              </span>
            </p>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

TooltipContent.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.number,
      name: PropTypes.string,
      color: PropTypes.string,
      dataKey: PropTypes.string
    })
  ),
  label: PropTypes.string
};

const OverviewChart = ({ data, title = "Overview", isLoading = false }) => {
  const { theme } = useTheme();

  // Tùy chỉnh kiểu hiển thị chú thích
  const renderColorfulLegendText = (value, entry) => {
    const { color } = entry;
    return (
      <span className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors" 
            style={{ color }}>
        {value}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="card">
        <div className="card-header">
          <p className="card-title">{title}</p>
        </div>
        <div className="card-body flex items-center justify-center h-[350px]">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="card-header">
        <p className="card-title">{title}</p>
      </div>
      <div className="card-body p-0">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <defs>
              <linearGradient id="colorBaseSalary" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.4}/>
              </linearGradient>
              <linearGradient id="colorBonus" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0.4}/>
              </linearGradient>
              <linearGradient id="colorDeductions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.4}/>
              </linearGradient>
              <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.4}/>
              </linearGradient>
            </defs>

            <CartesianGrid 
              strokeDasharray="3 3" 
              vertical={false}
              stroke={theme === "light" ? "#e2e8f0" : "#334155"}
            />
            
            <Tooltip 
              content={<TooltipContent />}
              cursor={{ fill: theme === "light" ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.05)" }}
            />
            
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              stroke={theme === "light" ? "#64748b" : "#94a3b8"}
              fontSize={12}
              tickMargin={8}
            />
            
            <YAxis
              axisLine={false}
              tickLine={false}
              stroke={theme === "light" ? "#64748b" : "#94a3b8"}
              fontSize={12}
              tickFormatter={formatCurrency}
              tickMargin={8}
              tick={{ fill: theme === "light" ? "#111827" : "#f9fafb", fontWeight: 500 }}
            />
            
            <Legend 
              formatter={renderColorfulLegendText} 
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ 
                paddingTop: 20,
                fontSize: 12
              }}
            />
            
            <Bar
              dataKey="Lương cơ bản"
              name="Lương cơ bản"
              fill="url(#colorBaseSalary)"
              radius={[4, 4, 0, 0]}
              maxBarSize={50}
            />
            
            <Bar
              dataKey="Thưởng"
              name="Thưởng"
              fill="url(#colorBonus)"
              radius={[4, 4, 0, 0]}
              maxBarSize={50}
            />
            
            <Bar
              dataKey="Khấu trừ"
              name="Khấu trừ"
              fill="url(#colorDeductions)"
              radius={[4, 4, 0, 0]}
              maxBarSize={50}
            />
            
            <Bar
              dataKey="Thực lãnh"
              name="Thực lãnh"
              fill="url(#colorNet)"
              radius={[4, 4, 0, 0]}
              maxBarSize={50}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

OverviewChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    "Lương cơ bản": PropTypes.number.isRequired,
    "Thưởng": PropTypes.number.isRequired,
    "Khấu trừ": PropTypes.number.isRequired,
    "Thực lãnh": PropTypes.number.isRequired,
    employees: PropTypes.number.isRequired
  })).isRequired,
  title: PropTypes.string,
  isLoading: PropTypes.bool
};

export default OverviewChart;