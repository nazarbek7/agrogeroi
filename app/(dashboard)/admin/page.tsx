import { DashboardSidebar } from "@/components";
import prisma from "@/utils/db";
import { FaBoxOpen, FaShoppingCart, FaUsers, FaLeaf } from "react-icons/fa";

const AdminDashboardPage = async () => {
  const [productCount, orderCount, userCount, categoryCount] = await Promise.all([
    prisma.product.count(),
    prisma.customer_order.count(),
    prisma.user.count(),
    prisma.category.count(),
  ]);

  const stats = [
    { label: "Товаров", value: productCount, icon: <FaBoxOpen className="text-3xl" />, color: "bg-brand" },
    { label: "Заказов", value: orderCount, icon: <FaShoppingCart className="text-3xl" />, color: "bg-brand" },
    { label: "Пользователей", value: userCount, icon: <FaUsers className="text-3xl" />, color: "bg-brand" },
    { label: "Категорий", value: categoryCount, icon: <FaLeaf className="text-3xl" />, color: "bg-brand" },
  ];

  return (
    <div className="bg-white flex justify-start max-w-screen-2xl mx-auto max-xl:flex-col">
      <DashboardSidebar />
      <div className="flex flex-col gap-y-6 w-full p-6 max-xl:px-2 max-xl:mt-5">
        <h1 className="text-2xl font-bold text-gray-800">Панель управления</h1>

        <div className="grid grid-cols-4 gap-4 max-xl:grid-cols-2 max-sm:grid-cols-1">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-brand text-white rounded-xl p-6 flex flex-col items-center gap-y-2 shadow"
            >
              {stat.icon}
              <p className="text-4xl font-bold">{stat.value}</p>
              <p className="text-lg text-gray-200">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Быстрые действия</h2>
          <div className="flex flex-wrap gap-3">
            <a href="/admin/products/new" className="bg-brand text-white px-5 py-2 rounded-lg hover:bg-brand-dark font-semibold">
              + Добавить товар
            </a>
            <a href="/admin/merchant/new" className="bg-brand text-white px-5 py-2 rounded-lg hover:bg-brand-dark font-semibold">
              + Добавить продавца
            </a>
            <a href="/admin/categories/new" className="bg-brand text-white px-5 py-2 rounded-lg hover:bg-brand-dark font-semibold">
              + Добавить категорию
            </a>
            <a href="/admin/orders" className="bg-gray-600 text-white px-5 py-2 rounded-lg hover:bg-gray-700 font-semibold">
              Просмотреть заказы
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
