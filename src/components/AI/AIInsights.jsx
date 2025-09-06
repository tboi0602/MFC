import { Brain, TrendingUp, AlertCircle, Target } from "lucide-react";

const AIInsights = () => {
  const insights = [
    {
      id: 1,
      type: "forecast",
      title: "Dự báo nhu cầu cao",
      message:
        "Quần áo tại TP.HCM trong 3 tháng cuối năm 2025 sẽ tăng khoảng 25 - 35% so với trung bình các quý trước.",
      confidence: 92,
      action: "Tăng stock ngay",
      priority: "high",
    },
    {
      id: 2,
      type: "optimization",
      title: "Tối ưu lộ trình giao hàng",
      message:
        "Có thể tiết kiệm 15 phút khi giao quần áo bằng cách thay đổi tuyến đường vận chuyển.",
      confidence: 88,
      action: "Áp dụng gợi ý",
      priority: "medium",
    },
    {
      id: 3,
      type: "alert",
      title: "Cảnh báo tồn kho",
      message: "MFC Bình Thạnh sẽ hết hàng áo thun size M trong 2 giờ tới.",
      confidence: 95,
      action: "Chuyển hàng bổ sung",
      priority: "high",
    },
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-50 border-red-200";
      case "medium":
        return "text-amber-600 bg-amber-50 border-amber-200";
      case "low":
        return "text-green-600 bg-green-50 border-green-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "forecast":
        return <TrendingUp className="h-5 sm:h-6 w-5 sm:w-6 text-blue-500" />;
      case "optimization":
        return <Target className="h-5 sm:h-6 w-5 sm:w-6 text-green-500" />;
      case "alert":
        return <AlertCircle className="h-5 sm:h-6 w-5 sm:w-6 text-red-500" />;
      default:
        return <Brain className="h-5 sm:h-6 w-5 sm:w-6 text-gray-500" />;
    }
  };

  return (
    <div className="bg-white rounded-xl p-3 sm:p-4 md:p-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center space-x-2 mb-2 sm:mb-0">
          <Brain className="h-6 w-6 sm:h-7 sm:w-7 text-blue-600" />
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
            AI Insights
          </h3>
        </div>
        <button className="text-blue-600 hover:text-blue-700 text-xs sm:text-sm font-medium">
          Cấu hình AI
        </button>
      </div>

      {/* Insights List */}
      <div className="space-y-3 sm:space-y-4 md:space-y-5">
        {insights.map((insight) => (
          <div
            key={insight.id}
            className="border border-gray-200 rounded-xl p-3 sm:p-4 md:p-5 hover:shadow-md transition-shadow duration-300"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2">
              <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-0">
                {getTypeIcon(insight.type)}
                <h4 className="font-semibold text-gray-900 text-sm sm:text-base md:text-lg">
                  {insight.title}
                </h4>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs sm:text-sm text-gray-500">
                  {insight.confidence}%
                </span>
                <div className="w-16 h-2 sm:h-2.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-2 sm:h-2.5 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-500"
                    style={{ width: `${insight.confidence}%` }}
                  />
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-sm md:text-base text-gray-600 mb-2 sm:mb-3">
              {insight.message}
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-1 sm:space-y-0">
              <span
                className={`px-2 py-1 text-xs sm:text-sm font-medium rounded-full border ${getPriorityColor(
                  insight.priority
                )}`}
              >
                {insight.priority === "high"
                  ? "Ưu tiên cao"
                  : insight.priority === "medium"
                  ? "Ưu tiên vừa"
                  : "Ưu tiên thấp"}
              </span>
              <button className="text-blue-600 hover:text-blue-700 text-xs sm:text-sm font-medium">
                {insight.action}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200 text-center text-xs sm:text-sm text-gray-600">
        <p className="mb-1">
          AI đã phân tích <span className="font-semibold">2,847</span> dữ liệu
          hôm nay
        </p>
        <p className="text-xs sm:text-sm text-gray-500">
          Cập nhật lần cuối: 2 phút trước
        </p>
      </div>
    </div>
  );
};

export default AIInsights;
