type Props = {
  label: string;
  className?: string;
};

export default function StatusBadge({ label, className }: Props) {
  return <span className={`status-badge ${className ?? ""}`}>{label}</span>;
}
