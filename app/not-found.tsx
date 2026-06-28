import Link from "next/link";
import { FaLeaf } from "react-icons/fa6";

export default function NotFound() {
  return (
    <main className="min-h-[70vh] flex items-center justify-center bg-[#f4f9f0] px-6 py-20">
      <div className="text-center max-w-md">
        {/* Icon */}
        <div className="flex items-center justify-center mb-6">
          <div className="w-20 h-20 rounded-2xl bg-brand/10 flex items-center justify-center">
            <FaLeaf className="text-brand text-4xl" />
          </div>
        </div>

        {/* Badge */}
        <span className="inline-block bg-brand/10 text-brand text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
          Ошибка 404
        </span>

        <h1 className="text-4xl font-extrabold text-gray-900 mb-3">
          Страница не найдена
        </h1>
        <p className="text-gray-500 text-base leading-relaxed mb-8">
          Извините, запрашиваемая страница не существует.<br />
          Возможно, она была удалена или вы перешли по неверной ссылке.
        </p>

        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Link
            href="/"
            className="bg-brand text-white font-bold px-7 py-3 rounded-xl hover:bg-brand-dark transition-colors shadow-sm"
          >
            На главную
          </Link>
          <Link
            href="/contacts"
            className="border border-gray-200 text-gray-700 font-semibold px-7 py-3 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Поддержка →
          </Link>
        </div>
      </div>
    </main>
  );
}
