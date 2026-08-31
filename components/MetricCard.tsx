import type { LucideIcon } from "lucide-react";

type Props = {
  label: string;
  value: string;
  unit?: string;
  icon: LucideIcon;
  tone?: "gold" | "green" | "blue" | "red" | "violet";
};

export default function MetricCard({ label, value, unit, icon: Icon, tone = "gold" }: Props) {
  return (
    <article className={`metric-card tone-${tone}`}>
      <div className="metric-icon">
        <Icon size={18} />
      </div>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
        {unit ? <small> {unit}</small> : null}
      </div>
    </article>
  );
}
