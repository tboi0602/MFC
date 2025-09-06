import { formatCurrency } from "../../data/mockData";
import { Plus, Minus, ShoppingCart, Package } from "lucide-react";

const ProductSelector = ({ products, orderItems, onUpdateOrderItems }) => {
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      onUpdateOrderItems(
        orderItems.filter((item) => item.productId !== productId)
      );
    } else {
      const existingItem = orderItems.find(
        (item) => item.productId === productId
      );
      if (existingItem) {
        onUpdateOrderItems(
          orderItems.map((item) =>
            item.productId === productId
              ? { ...item, quantity: newQuantity }
              : item
          )
        );
      } else {
        onUpdateOrderItems([
          ...orderItems,
          { productId, quantity: newQuantity },
        ]);
      }
    }
  };

  const getQuantity = (productId) => {
    const item = orderItems.find((item) => item.productId === productId);
    return item ? item.quantity : 0;
  };

  return (
    <div className="glass-card rounded-xl p-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
          <ShoppingCart className="h-5 w-5 text-white" />
        </div>
        <h2 className="text-lg font-bold text-gray-900">Chọn sản phẩm</h2>
      </div>

      <div className="space-y-3 max-h-[400px] overflow-y-auto">
        {products.map((product) => {
          const quantity = getQuantity(product.id);

          return (
            <div
              key={product.id}
              className={`border rounded-lg p-3 transition-all duration-200 flex items-center justify-between ${
                quantity > 0
                  ? "border-blue-300 bg-blue-50 shadow-sm"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex-1 pr-2">
                <h3 className="font-semibold text-gray-900 text-sm mb-1">
                  {product.name}
                </h3>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Package className="h-3 w-3" />
                  <span>{product.weight}g</span>
                  <span className="ml-auto font-semibold text-gray-900">
                    {formatCurrency(product.price)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => updateQuantity(product.id, quantity - 1)}
                  disabled={quantity === 0}
                  className="w-7 h-7 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center disabled:opacity-50"
                >
                  <Minus className="h-3 w-3 text-gray-600" />
                </button>
                <span className="w-5 text-center text-sm font-bold">
                  {quantity}
                </span>
                <button
                  onClick={() => updateQuantity(product.id, quantity + 1)}
                  className="w-7 h-7 rounded bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white flex items-center justify-center"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductSelector;
