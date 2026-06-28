import { DashboardSidebar } from "@/components";
import prisma from "@/utils/db";
import Link from "next/link";
import { FaBoxOpen, FaCartShopping, FaUsers, FaLeaf, FaStore, FaPlus, FaArrowRight, FaUpload } from "react-icons/fa6";

const AdminDashboardPage = async () => {
  const [productCount, orderCount, userCount, categoryCount, merchantCount] = await Promise.all([
    prisma.product.count(),
    prisma.customer_order.count(),
    prisma.user.count(),
    prisma.category.count(),
    prisma.merchant.count(),
  ]);

  const stats = [
    { label: "Товаров",        value: productCount,  icon: FaBoxOpen,      href: "/admin/products",    color: "bg-violet-500" },
    { label: "Заказов",        value: orderCount,    icon: FaCartShopping, href: "/admin/orders",      color: "bg-blue-500"   },
    { label: "Пользователей",  value: userCount,     icon: FaUsers,        href: "/admin/users",       color: "bg-sky-500"    },
    { label: "Категорий",      value: categoryCount, icon: FaLeaf,         href: "/admin/categories",  color: "bg-brand"      },
    { label: "Продавцов",      value: merchantCount, icon: FaStore,        href: "/admin/merchant",    color: "bg-orange-500" },
  ];

  const quickActions = [
    { label: "Добавить товар",     href: "/admin/products/new",    icon: FaPlus    },
    { label: "Добавить категорию", href: "/admin/categories/new",  icon: FaPlus    },
    { label: "Добавить продавца",  href: "/admin/merchant/new",    icon: FaPlus    },
    { label: "Массовая загрузка",  href: "/admin/bulk-upload",     icon: FaUpload  },
    { label: "Все заказы",         href: "/admin/orders",          icon: FaArrowRight },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100 max-xl:flex-col">
      <DashboardSidebar />

      <main className="flex-1 p-6 max-xl:p-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Панель управления</h1>
          <p className="text-sm text-gray-500 mt-1">Добро пожаловать в Agrogeroi Admin</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-5 gap-4 mb-8 max-xl:grid-cols-3 max-sm:grid-cols-2">
          {stats.map(({ label, value, icon: Icon, href, color }) => (
            <Link
              key={label}
              href={href}
              className="bg-white rounded-2xl p-5 flex flex-col gap-3 shadow-sm border border-gray-100 hover:shadow-md transition-all group"
            >
              <div className={`${color} w-10 h-10 rounded-xl flex items-center justify-center text-white text-base`}>
                <Icon />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                <p className="text-sm text-gray-500 mt-0.5">{label}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Быстрые действия</h2>
          <div className="flex flex-wrap gap-3">
            {quickActions.map(({ label, href, icon: Icon }) => (
              <Link
                key={label}
                href={href}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-50 hover:bg-brand hover:text-white text-sm font-medium text-gray-700 border border-gray-200 hover:border-brand transition-all"
              >
                <Icon className="text-xs" />
                {label}
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboardPage;
