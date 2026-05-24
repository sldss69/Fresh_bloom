import Image from "next/image";

import { cn } from "@/lib/utils";

type FreshBloomLogoProps = {
  className?: string;
  compact?: boolean;
};

export function FreshBloomLogo({ className, compact = false }: FreshBloomLogoProps) {
  return (
    <div className={cn("flex items-center", className)}>
      <Image
        src="/images/fresh-bloom-logo-header.png"
        alt="Fresh Bloom"
        width={560}
        height={320}
        priority={compact}
        sizes={compact ? "160px" : "240px"}
        className={cn(
          "w-auto object-contain opacity-95",
          "[filter:brightness(0)_saturate(100%)_invert(28%)_sepia(14%)_saturate(685%)_hue-rotate(82deg)_brightness(88%)_contrast(88%)]",
          compact ? "h-12 md:h-14" : "h-24 md:h-28",
        )}
      />
    </div>
  );
}
