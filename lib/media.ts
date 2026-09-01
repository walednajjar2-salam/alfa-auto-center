export const PLACEHOLDERS = {
  car: "/images/placeholder-car.jpg",
  inspectBefore: "/images/placeholder-inspect-before.jpg",
  inspectAfter: "/images/placeholder-inspect-after.jpg",
  part: "/images/placeholder-part.jpg",
  login: "/images/login-bg.jpg",
  icon: "/icons/icon-192.png",
};

export function waLink(phone: string | null | undefined, text: string, countryCode = "962") {
  if (!phone) return null;
  let digits = phone.replace(/\D/g, "");
  if (!digits) return null;
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.startsWith("0")) digits = `${countryCode}${digits.slice(1)}`;
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}
