import Image from "next/image";
import Link from "next/link";

const Hero = () => {
  return (
    <div className="w-full bg-brand relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/5 pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full bg-white/5 pointer-events-none" />

      <div className="relative max-w-screen-2xl mx-auto px-16 max-[1320px]:px-10 max-md:px-5 py-16 max-lg:py-8">

        {/* Desktop: side-by-side | Mobile: stacked */}
        <div className="grid grid-cols-3 items-center gap-x-10 max-lg:flex max-lg:flex-col max-lg:gap-y-6">

          {/* Text block — first on both desktop and mobile */}
          <div className="flex flex-col gap-y-5 col-span-2 max-lg:w-full">
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
            <div className="flex gap-3 max-sm:flex-col max-sm:w-full">
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

          {/* Image block */}
          {/* Desktop: square card */}
          <div className="relative w-[380px] h-[380px] max-xl:w-[320px] max-xl:h-[320px] rounded-3xl overflow-hidden shadow-2xl ring-4 ring-white/10 max-lg:hidden">
            <Image
              src="/hero-plant.png"
              fill
              alt="Гортензия Agrogeroi"
              className="object-cover"
            />
          </div>

          {/* Mobile: wide banner */}
          <div className="hidden max-lg:block w-full h-52 max-sm:h-44 relative rounded-2xl overflow-hidden shadow-xl ring-2 ring-white/10">
            <Image
              src="/hero-plant.png"
              fill
              alt="Гортензия Agrogeroi"
              className="object-cover object-center"
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default Hero;
