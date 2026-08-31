"use client";

import { useMemo, useState } from "react";
import { receiveVehicle } from "@/lib/actions/work-orders";

type VehicleOption = {
  id: string;
  plateNumber: string;
  make: string;
  model: string;
  year: number | null;
};

type CustomerOption = {
  id: string;
  name: string;
  phone: string;
  vehicles: VehicleOption[];
};

export default function ReceptionForm({ customers }: { customers: CustomerOption[] }) {
  const [customerId, setCustomerId] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const selected = useMemo(
    () => customers.find((c) => c.id === customerId) ?? null,
    [customers, customerId],
  );

  async function onSubmit(formData: FormData) {
    setError(null);
    setPending(true);
    try {
      await receiveVehicle(formData);
    } catch (err) {
      if (
        typeof err === "object" &&
        err !== null &&
        "digest" in err &&
        String((err as { digest: unknown }).digest).startsWith("NEXT_REDIRECT")
      ) {
        throw err;
      }
      setPending(false);
      setError(err instanceof Error ? err.message : "تعذر استقبال السيارة");
    }
  }

  return (
    <form action={onSubmit} className="stack-form">
      {error ? <p className="form-error">{error}</p> : null}

      <label className="field">
        <span>العميل</span>
        <select
          name="customerId"
          value={customerId}
          onChange={(e) => {
            setCustomerId(e.target.value);
            setVehicleId("");
          }}
        >
          <option value="">عميل جديد</option>
          {customers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} · {c.phone}
            </option>
          ))}
        </select>
      </label>

      {!customerId ? (
        <div className="form-grid">
          <label className="field">
            <span>اسم العميل</span>
            <input name="newCustomerName" placeholder="أحمد الخالدي" />
          </label>
          <label className="field">
            <span>الهاتف</span>
            <input name="newCustomerPhone" placeholder="07xxxxxxxx" />
          </label>
        </div>
      ) : null}

      <label className="field">
        <span>السيارة</span>
        <select
          name="vehicleId"
          value={vehicleId}
          onChange={(e) => setVehicleId(e.target.value)}
          disabled={!!customerId && (selected?.vehicles.length ?? 0) === 0}
        >
          <option value="">سيارة جديدة</option>
          {(selected?.vehicles ?? []).map((v) => (
            <option key={v.id} value={v.id}>
              {v.make} {v.model}
              {v.year ? ` ${v.year}` : ""} · {v.plateNumber}
            </option>
          ))}
        </select>
      </label>

      {!vehicleId ? (
        <div className="form-grid">
          <label className="field">
            <span>اللوحة</span>
            <input name="newPlateNumber" placeholder="12-34567" />
          </label>
          <label className="field">
            <span>الماركة</span>
            <input name="newMake" placeholder="Toyota" />
          </label>
          <label className="field">
            <span>الموديل</span>
            <input name="newModel" placeholder="Camry" />
          </label>
          <label className="field">
            <span>سنة الصنع</span>
            <input name="newYear" type="number" placeholder="2021" />
          </label>
        </div>
      ) : null}

      <label className="field">
        <span>العداد (كم)</span>
        <input name="mileage" type="number" placeholder="54000" />
      </label>
      <label className="field">
        <span>شكوى العميل / سبب الزيارة</span>
        <textarea name="complaint" rows={4} required placeholder="صوت، اهتزاز، صيانة دورية..." />
      </label>
      <label className="field">
        <span>ملاحظات</span>
        <textarea name="notes" rows={2} placeholder="اختياري" />
      </label>
      <button className="primary-button" type="submit" disabled={pending}>
        {pending ? "جاري الحفظ..." : "إنشاء أمر استقبال"}
      </button>
    </form>
  );
}
