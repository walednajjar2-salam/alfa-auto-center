import { redirect } from "next/navigation";

export default function ServicePage() {
  redirect("/work-orders?status=IN_SERVICE");
}
