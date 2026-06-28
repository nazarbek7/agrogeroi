import { CategoryMenu, Hero, Incentives, IntroducingSection, HowToOrder, NurserySection } from "@/components";
import ProductsSection from "@/components/ProductsSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agrogeroi — Питомник растений в Кыргызстане",
  description: "Розы, хвойные, плодовые деревья, кустарники и многолетние цветы. Покупайте растения с доставкой по Кыргызстану.",
};

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
