import type { InvoiceStatus, PaymentMethod, WorkOrderStatus } from "@prisma/client";

export const workOrderStatusLabel: Record<WorkOrderStatus, string> = {
  RECEIVED: "مستلمة",
  INSPECTION: "قيد الفحص",
  WAITING_APPROVAL: "بانتظار الموافقة",
  IN_SERVICE: "قيد الصيانة",
  READY: "جاهزة للتسليم",
  DELIVERED: "مسلّمة",
  CANCELLED: "ملغاة",
};

export const workOrderStatusClass: Record<WorkOrderStatus, string> = {
  RECEIVED: "status-gold",
  INSPECTION: "status-blue",
  WAITING_APPROVAL: "status-violet",
  IN_SERVICE: "status-gold",
  READY: "status-green",
  DELIVERED: "status-muted",
  CANCELLED: "status-red",
};

export const invoiceStatusLabel: Record<InvoiceStatus, string> = {
  DRAFT: "مسودة",
  ISSUED: "صادرة",
  PARTIAL: "مدفوعة جزئياً",
  PAID: "مدفوعة",
  VOID: "ملغاة",
};

export const invoiceStatusClass: Record<InvoiceStatus, string> = {
  DRAFT: "status-muted",
  ISSUED: "status-blue",
  PARTIAL: "status-gold",
  PAID: "status-green",
  VOID: "status-red",
};

export const paymentMethodLabel: Record<PaymentMethod, string> = {
  CASH: "نقداً",
  CARD: "بطاقة",
  TRANSFER: "تحويل",
  OTHER: "أخرى",
};

export const workOrderFlow: WorkOrderStatus[] = [
  "RECEIVED",
  "INSPECTION",
  "WAITING_APPROVAL",
  "IN_SERVICE",
  "READY",
  "DELIVERED",
];
