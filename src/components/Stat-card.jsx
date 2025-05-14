import { TrendingUp } from "lucide-react";
import PropTypes from "prop-types";

const StatCard = ({ title, value, percentage, icon: Icon, iconColor = "blue" }) => {
  const getColorClasses = () => {
    switch(iconColor) {
      case "blue":
        return "bg-blue-500/20 text-blue-500 dark:bg-blue-600/20 dark:text-blue-600";
      case "green":
        return "bg-green-500/20 text-green-500 dark:bg-green-600/20 dark:text-green-600";
      case "amber":
        return "bg-amber-500/20 text-amber-500 dark:bg-amber-600/20 dark:text-amber-600";
      case "purple":
        return "bg-purple-500/20 text-purple-500 dark:bg-purple-600/20 dark:text-purple-600";
      default:
        return "bg-blue-500/20 text-blue-500 dark:bg-blue-600/20 dark:text-blue-600";
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className={`w-fit rounded-lg p-2 transition-colors ${getColorClasses()}`}>
          <Icon size={26} />
        </div>
        <p className="card-title">{title}</p>
      </div>
      <div className="card-body bg-slate-100 transition-colors dark:bg-slate-950">
        <p className="text-3xl font-bold text-slate-900 transition-colors dark:text-slate-50">
          {value}
        </p>
        <span className="flex w-fit items-center gap-x-2 rounded-full border border-blue-500 px-2 py-1 font-medium text-blue-500 dark:border-blue-600 dark:text-blue-600">
          <TrendingUp size={18} />
          {percentage}%
        </span>
      </div>
    </div>
  );
};

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  percentage: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.elementType.isRequired,
  iconColor: PropTypes.oneOf(["blue", "green", "amber", "purple"])
};

export default StatCard;