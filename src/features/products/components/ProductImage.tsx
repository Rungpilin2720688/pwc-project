import Image from "next/image";
import { cn } from "@/lib/cn";
import styles from "./ProductImage.module.css";

type Props = {
  name: string;
  category: string;
  imageUrl: string | null;
  size?: "card" | "hero";
};

function hueFor(text: string): number {
  let hash = 0;
  for (const char of text) hash = (hash * 31 + char.charCodeAt(0)) % 360;
  return hash;
}

export function ProductImage({ name, category, imageUrl, size = "card" }: Props) {
  const className = cn(styles.image, styles[size]);

  if (imageUrl) {
    return <Image className={className} src={imageUrl} alt={name} width={480} height={360} unoptimized />;
  }

  const hue = hueFor(category);
  return (
    <div
      className={cn(className, styles.placeholder)}
      role="img"
      aria-label={`${name} placeholder image`}
      style={{ background: `linear-gradient(135deg, hsl(${hue} 70% 90%), hsl(${(hue + 40) % 360} 65% 75%))` }}
    >
      <span>{category.charAt(0)}</span>
    </div>
  );
}
