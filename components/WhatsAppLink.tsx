export default function WhatsAppLink({
  href,
  label = "واتساب",
}: {
  href: string | null;
  label?: string;
}) {
  if (!href) return null;
  return (
    <a className="primary-button compact-button" href={href} target="_blank" rel="noreferrer">
      {label}
    </a>
  );
}
