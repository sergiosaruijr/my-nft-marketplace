export default function ImageBox({
  src,
  alt = "",
  className = "",
}: {
  src?: string | null;
  alt?: string;
  className?: string;
}) {
  return src ? (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className={`object-cover ${className}`}
    />
  ) : (
    <div aria-hidden className={`bg-[#F0E6CC] ${className}`} />
  );
}
