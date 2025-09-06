import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler
);

const StatCard = ({
  title,
  value,
  change,
  changeType = "neutral",
  suffix = "",
  color = "blue",
  chartData,
}) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    green: "bg-green-50 text-green-700 border-green-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    red: "bg-red-50 text-red-700 border-red-200",
  };

  const getChangeIcon = () => {
    if (changeType === "increase")
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (changeType === "decrease")
      return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-gray-400" />;
  };

  const getChangeColor = () => {
    if (changeType === "increase") return "text-green-600";
    if (changeType === "decrease") return "text-red-600";
    return "text-gray-500";
  };

  return (
    <div
      className={`rounded-xl border p-4 sm:p-5 md:p-6 shadow-sm hover:shadow-lg transition-all ${colorClasses[color]}`}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs sm:text-sm font-medium opacity-75">{title}</p>
          <p className="text-xl sm:text-2xl md:text-3xl font-bold mt-1">
            {value}
            {suffix}
          </p>
          {change !== undefined && (
            <div className="flex items-center mt-2 space-x-1">
              {getChangeIcon()}
              <span
                className={`text-xs sm:text-sm font-medium ${getChangeColor()}`}
              >
                {Math.abs(change)}%
              </span>
              <span className="text-xs sm:text-sm text-gray-500">
                vs tháng trước
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Biểu đồ nhỏ */}
      {chartData && (
        <div className="mt-3 sm:mt-4 h-16 sm:h-20 md:h-24">
          <Line
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: false } },
              elements: { point: { radius: 0 } },
              scales: { x: { display: false }, y: { display: false } },
            }}
          />
        </div>
      )}
    </div>
  );
};

const DashboardStats = () => {
  const sampleChartData = {
    labels: Array(7).fill(""),
    datasets: [
      {
        data: [10, 20, 15, 25, 20, 30, 28],
        borderColor: "rgba(59, 130, 246, 1)", // Tailwind blue-500
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mb-8">
      <StatCard
        title="Tổng MFC hoạt động"
        value={4}
        change={12.5}
        changeType="increase"
        color="blue"
        chartData={sampleChartData}
      />
      <StatCard
        title="Đơn hàng hôm nay"
        value={238}
        change={8.2}
        changeType="increase"
        color="green"
        chartData={{
          ...sampleChartData,
          datasets: [
            {
              ...sampleChartData.datasets[0],
              borderColor: "rgba(16, 185, 129, 1)",
              backgroundColor: "rgba(16, 185, 129, 0.2)",
            },
          ],
        }}
      />
      <StatCard
        title="Tỷ lệ giao hàng thành công"
        value={96.8}
        suffix="%"
        change={2.1}
        changeType="increase"
        color="green"
        chartData={{
          ...sampleChartData,
          datasets: [
            {
              ...sampleChartData.datasets[0],
              borderColor: "rgba(5, 150, 105, 1)",
              backgroundColor: "rgba(5, 150, 105, 0.2)",
            },
          ],
        }}
      />
      <StatCard
        title="Thời gian giao hàng TB"
        value={28}
        suffix=" phút"
        change={-5.3}
        changeType="decrease"
        color="amber"
        chartData={{
          ...sampleChartData,
          datasets: [
            {
              ...sampleChartData.datasets[0],
              borderColor: "rgba(251, 191, 36, 1)",
              backgroundColor: "rgba(254, 240, 138, 0.2)",
            },
          ],
        }}
      />
    </div>
  );
};

export default DashboardStats;
