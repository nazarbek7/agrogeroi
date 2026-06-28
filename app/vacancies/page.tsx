import prisma from "@/utils/db";

export const metadata = { title: "Вакансии — Agrogeroi" };

export default async function VacanciesPage() {
  let vacancies: any[] = [];
  try {
    vacancies = await prisma.vacancy.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    vacancies = [];
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-brand py-12">
        <h1 className="text-center text-4xl font-bold text-white">Вакансии</h1>
      </div>
      <div className="max-w-4xl mx-auto px-6 py-16 flex flex-col gap-8">

        <p className="text-gray-700 text-lg">
          Мы — команда людей, влюблённых в растения и садоводство. Если вы разделяете нашу
          любовь к природе — приходите к нам!
        </p>

        {vacancies.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-5xl mb-4">🌱</p>
            <p className="text-xl text-gray-500">Сейчас открытых вакансий нет.</p>
            <p className="text-gray-400 mt-2">Следите за обновлениями или напишите нам напрямую.</p>
          </div>
        ) : (
          vacancies.map((v: any) => (
            <div key={v.id} className="rounded-xl border border-brand/10 overflow-hidden">
              <div className="bg-[#f4f9f0] px-6 py-4 flex items-center justify-between">
                <h3 className="font-bold text-gray-800 text-xl">{v.title}</h3>
                <span className="text-sm bg-brand/10 text-brand font-semibold px-3 py-1 rounded-full">
                  {v.type}
                </span>
              </div>
              <div className="px-6 py-5 flex flex-col gap-4">
                <p className="text-gray-600">{v.description}</p>
                {v.requirements?.length > 0 && (
                  <div>
                    <p className="font-semibold text-gray-700 mb-2">Требования:</p>
                    <ul className="space-y-1">
                      {v.requirements.map((r: string) => (
                        <li key={r} className="flex gap-2 text-gray-600">
                          <span className="text-brand">✓</span> {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))
        )}

        <div className="bg-[#f4f9f0] rounded-2xl p-8 border border-brand/10">
          <h2 className="text-xl font-bold text-brand mb-3">Как откликнуться?</h2>
          <p className="text-gray-600 mb-4">
            Напишите нам в WhatsApp или на почту с кратким описанием вашего опыта и на какую вакансию хотите.
          </p>
          <div className="flex gap-3 flex-wrap">
            <a href="https://wa.me/996708000008" className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition">WhatsApp</a>
            <a href="mailto:info@agrogeroi.com" className="bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition">info@agrogeroi.com</a>
          </div>
        </div>
      </div>
    </div>
  );
}
