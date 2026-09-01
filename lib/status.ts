import type {
  AppointmentStatus,
  InvoiceStatus,
  PaymentMethod,
  PurchaseStatus,
  UserRole,
  WorkOrderStatus,
} from "@prisma/client";

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

export const purchaseStatusLabel: Record<PurchaseStatus, string> = {
  DRAFT: "مسودة",
  RECEIVED: "مستلمة",
  CANCELLED: "ملغاة",
};

export const purchaseStatusClass: Record<PurchaseStatus, string> = {
  DRAFT: "status-muted",
  RECEIVED: "status-green",
  CANCELLED: "status-red",
};

export const appointmentStatusLabel: Record<AppointmentStatus, string> = {
  SCHEDULED: "مجدولة",
  CONFIRMED: "مؤكدة",
  DONE: "منجزة",
  CANCELLED: "ملغاة",
  NO_SHOW: "لم يحضر",
};

export const appointmentStatusClass: Record<AppointmentStatus, string> = {
  SCHEDULED: "status-blue",
  CONFIRMED: "status-gold",
  DONE: "status-green",
  CANCELLED: "status-red",
  NO_SHOW: "status-muted",
};

export const roleLabel: Record<UserRole, string> = {
  ADMIN: "مدير",
  RECEPTION: "استقبال",
  ACCOUNTING: "حسابات",
  TECHNICIAN: "فني",
  STORE: "مخزن",
};

export const expenseCategories = ["إيجار", "رواتب", "كهرباء وماء", "مستهلكات", "صيانة معدات", "أخرى"];
