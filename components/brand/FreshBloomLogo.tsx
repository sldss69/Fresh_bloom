import Image from "next/image";

import { cn } from "@/lib/utils";

type FreshBloomLogoProps = {
  className?: string;
  compact?: boolean;
  /**
   * "onLight"  → logo shown on a light/cream background (default).
   *              An inline SVG filter simultaneously:
   *              • Recolors the cream PNG logo → brand wine/copper (#C47A3D)
   *              • Makes the black background fully transparent (pixel-level,
   *                no blend-mode — works inside any stacking context).
   * "onDark"   → logo shown on a dark background.
   *              Renders the image directly, no processing.
   */
  variant?: "onLight" | "onDark";
};

export function FreshBloomLogo({
  className,
  compact = false,
  variant = "onLight",
}: FreshBloomLogoProps) {
  const imgSizes = compact ? "140px" : "220px";
  const imgClass = cn(
    "w-auto object-contain",
    compact ? "h-9 md:h-10" : "h-16 md:h-20",
  );

  if (variant === "onDark") {
    return (
      <div className={cn("flex items-center", className)}>
        <Image
          src="/images/logos/logo-blanco.png"
          alt="Fresh Bloom"
          width={560}
          height={320}
          priority
          sizes={imgSizes}
          className={imgClass}
        />
      </div>
    );
  }

  // onLight: inline SVG filter applied via CSS filter: url(#...)
  //
  // The 4×5 feColorMatrix does two things in one pass:
  //   Rows 1-3 — recolor cream logo → wine/copper (#C47A3D ≈ 0.769, 0.478, 0.239):
  //     cream input ≈ (0.91, 0.81, 0.76) → scale R×0.845, G×0.590, B×0.314
  //   Row 4 — set alpha from luminance (0.5R + 0.5G + 0.5B − 0.1):
  //     black → alpha ≤ 0 → transparent | cream → alpha ≈ 1.14 → opaque
  //
  // Pixel-level transparency — works regardless of stacking context or z-index.
  return (
    <div className={cn("flex items-center", className)}>
      {/* SVG filter definition — zero-size so it takes no space */}
      <svg
        aria-hidden="true"
        focusable="false"
        style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
      >
        <defs>
          <filter
            id="fb-logo-on-light"
            colorInterpolationFilters="sRGB"
            x="0%"
            y="0%"
            width="100%"
            height="100%"
          >
            <feColorMatrix
              type="matrix"
              values="0.845 0     0     0 0
                      0     0.590 0     0 0
                      0     0     0.314 0 0
                      0.5   0.5   0.5   0 -0.1"
            />
          </filter>
        </defs>
      </svg>
      <Image
        src="/images/logos/logo-blanco.png"
        alt="Fresh Bloom"
        width={560}
        height={320}
        priority
        sizes={imgSizes}
        style={{ filter: "url(#fb-logo-on-light)" }}
        className={imgClass}
      />
    </div>
  );
}
