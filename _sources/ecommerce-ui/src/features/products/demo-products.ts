import type { Product } from "./product-types";

export const demoProducts: Product[] = [
  {
    id: -1, shopId: -1, name: "Əl işi taxta masa lampası", slug: "demo-oak-lamp",
    description: "Təbii palıd ağacından hazırlanmış sakit işıq verən masa lampası.",
    category: "Ev və yaşam", price: 79, currency: "AZN", conditionLabel: "Yeni",
    stockNote: "Nümunə elan", imageUrl: "/assets/products/oak-lamp-demo.png",
    deliveryNote: "Çatdırılma satıcı ilə razılaşdırılır", status: "PUBLISHED"
  },
  {
    id: -2, shopId: -1, name: "Zeytun rəngli kətan çanta", slug: "demo-canvas-tote",
    description: "Gündəlik istifadə üçün möhkəm kətan və dəri detallı əl işi çanta.",
    category: "Aksesuar", price: 48, currency: "AZN", conditionLabel: "Yeni",
    stockNote: "Nümunə elan", imageUrl: "/assets/products/canvas-tote-demo.png",
    deliveryNote: "Çatdırılma satıcı ilə razılaşdırılır", status: "PUBLISHED"
  },
  {
    id: -3, shopId: -1, name: "Mavi keramika fincan dəsti", slug: "demo-ceramic-cups",
    description: "Əllə formalaşdırılmış, təbii şirə fərqlərinə sahib iki keramika fincan.",
    category: "Mətbəx", price: 36, currency: "AZN", conditionLabel: "Yeni",
    stockNote: "Nümunə elan", imageUrl: "/assets/products/ceramic-cups-demo.png",
    deliveryNote: "Çatdırılma satıcı ilə razılaşdırılır", status: "PUBLISHED"
  }
];
