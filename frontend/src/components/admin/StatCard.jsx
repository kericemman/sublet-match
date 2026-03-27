const StatCard = ({ title, value, hint, icon, color, change, trend }) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    yellow: "bg-yellow-50 text-yellow-600",
    purple: "bg-purple-50 text-purple-600",
    red: "bg-red-50 text-red-600",
    indigo: "bg-indigo-50 text-indigo-600",
  };

  const iconColorClasses = {
    blue: "text-blue-600",
    green: "text-green-600",
    yellow: "text-yellow-600",
    purple: "text-purple-600",
    red: "text-red-600",
    indigo: "text-indigo-600",
  };

  const selectedColor = color || "blue";

  return (
    <div className="group bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between">
        {icon && (
          <div className={`w-12 h-12 rounded-lg ${colorClasses[selectedColor]} flex items-center justify-center transition-transform group-hover:scale-105`}>
            <div className={iconColorClasses[selectedColor]}>
              {icon}
            </div>
          </div>
        )}
        {change !== undefined && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
            change >= 0 
              ? 'bg-green-50 text-green-700' 
              : 'bg-red-50 text-red-700'
          }`}>
            {trend === 'up' ? (
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            ) : trend === 'down' ? (
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            ) : null}
            <span>{change >= 0 ? '+' : ''}{change}%</span>
          </div>
        )}
      </div>
      
      <p className="mt-3 text-sm text-gray-500">{title}</p>
      <h3 className="mt-1 text-2xl font-bold text-[#242B38]">{value}</h3>
      
      {hint && (
        <p className="mt-2 text-xs text-gray-400 flex items-center">
          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {hint}
        </p>
      )}
    </div>
  );
};

export default StatCard;