export default function PlaceholderPhoto({
  src,
  alt,
  caption,
  isPlaceholder = true,
  hero = false,
}: {
  src: string;
  alt: string;
  caption?: string | null;
  isPlaceholder?: boolean;
  hero?: boolean;
}) {
  return (
    <figure className={hero ? "photo-hero" : "photo-card"}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} />
      <figcaption>
        {caption || alt}
        {isPlaceholder ? <small>صورة عامة مؤقتة</small> : null}
      </figcaption>
    </figure>
  );
}
