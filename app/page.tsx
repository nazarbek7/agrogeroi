import { CategoryMenu, Hero, Incentives, IntroducingSection, HowToOrder, NurserySection } from "@/components";
import ProductsSection from "@/components/ProductsSection";

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
