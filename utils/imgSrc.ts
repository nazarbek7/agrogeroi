export const imgSrc = (src: string | null | undefined, fallback = "/product_placeholder.jpg"): string => {
  if (!src) return fallback;
  if (src.startsWith("http")) return src;
  return `/${src}`;
};
