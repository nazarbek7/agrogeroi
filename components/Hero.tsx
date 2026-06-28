import Image from "next/image";
import Link from "next/link";

const Hero = () => {
  return (
    <div className="w-full bg-brand relative overflow-hidden">
      {/* Subtle decorative circles */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/5 pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full bg-white/5 pointer-events-none" />

      <div className="relative grid grid-cols-3 items-center justify-items-center px-16 max-[1320px]:px-10 max-md:px-5 gap-x-10 max-w-screen-2xl mx-auto py-16 max-lg:grid-cols-1 max-lg:py-12 max-lg:gap-y-10">
        <div className="flex flex-col gap-y-6 max-lg:order-last col-span-2">
          <div className="inline-flex">
            <span className="bg-white/15 text-white text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
              Питомник в Кыргызстане
            </span>
          </div>
          <h1 className="text-6xl text-white font-extrabold leading-tight max-xl:text-5xl max-md:text-4xl max-sm:text-3xl">
            Ваши растения —<br className="max-md:hidden" /> наша забота
          </h1>
          <p className="text-white/80 text-lg leading-relaxed max-w-lg max-sm:text-base">
            Широкий выбор саженцев, деревьев и кустарников для вашего сада.
            Розы, хвойные, плодовые деревья — всё для красивого сада.
          </p>
          <div className="flex gap-3 max-sm:flex-col max-sm:max-w-xs">
            <Link
              href="/shop"
              className="bg-white text-brand font-bold px-8 py-3.5 rounded-xl text-center hover:bg-gray-100 transition-colors shadow-sm"
            >
              В каталог
            </Link>
            <Link
              href="/contacts"
              className="bg-transparent border-2 border-white/60 text-white font-bold px-8 py-3.5 rounded-xl text-center hover:bg-white/10 hover:border-white transition-colors"
            >
              Контакты
            </Link>
          </div>
        </div>

        <div className="relative w-[380px] h-[380px] max-md:w-[280px] max-md:h-[280px] max-sm:w-[240px] max-sm:h-[240px] rounded-3xl overflow-hidden shadow-2xl ring-4 ring-white/10">
          <Image
            src="/hero-plant.png"
            fill
            alt="Гортензия Agrogeroi"
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
