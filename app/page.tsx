import { CategoryMenu, Hero, Incentives, IntroducingSection, HowToOrder, NurserySection, ProductsSection } from "@/components";

export default function Home() {
  return (
    <>
      <Hero />
      <IntroducingSection />
      <Incentives />
      <CategoryMenu />
      <NurserySection />
      <HowToOrder />
      <ProductsSection />
    </>
  );
}
