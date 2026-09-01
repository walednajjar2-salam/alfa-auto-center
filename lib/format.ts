export function money(value: number) {
  return new Intl.NumberFormat("en-JO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function moneyLabel(value: number) {
  return `${money(value)} د.أ`;
}

export function todayLabel() {
  return new Intl.DateTimeFormat("ar-JO", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date());
}

export function formatDate(value: Date | string) {
  return new Intl.DateTimeFormat("ar-JO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function formatDateTime(value: Date | string) {
  return new Intl.DateTimeFormat("ar-JO", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function toDateTimeLocal(value: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}T${pad(value.getHours())}:${pad(value.getMinutes())}`;
}

export function vehicleTitle(vehicle: { make: string; model: string; year: number | null; plateNumber: string }) {
  const year = vehicle.year ? ` ${vehicle.year}` : "";
  return `${vehicle.make} ${vehicle.model}${year} · ${vehicle.plateNumber}`;
}

export function lineTotal(quantity: number, unitPrice: number) {
  return Math.round(quantity * unitPrice * 1000) / 1000;
}
