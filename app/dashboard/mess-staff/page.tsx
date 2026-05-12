"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ChefHat, Clock, Truck, CheckCircle2, AlertTriangle } from "lucide-react";

const STATUS_LABELS: Record<string, string> = { approved: "Ready to Prepare", preparing: "Preparing", dispatched: "Dispatched", delivered: "Delivered" };
const SLOT_LABELS: Record<string, string> = { breakfast: "Breakfast", lunch: "Lunch", dinner: "Dinner" };
const NEXT_STATUS: Record<string, "preparing" | "dispatched" | "delivered"> = { approved: "preparing", preparing: "dispatched", dispatched: "delivered" };
const STATUS_ICONS: Record<string, React.ReactNode> = { approved: <Clock size={16} />, preparing: <ChefHat size={16} />, dispatched: <Truck size={16} />, delivered: <CheckCircle2 size={16} /> };

export default function MessStaffPage() {
  const { user } = useUser();
  const student = useQuery(api.students.getByClerkId, user ? { clerkId: user.id } : "skip");
  const orders = useQuery(api.orders.getApproved);
  const updateStatus = useMutation(api.orders.updateStatus);

  if (!student || (student.role !== "mess_staff" && student.role !== "admin")) {
    return (
      <div className="card" style={{ padding: 40, textAlign: "center", maxWidth: 400, margin: "60px auto" }}>
        <ChefHat size={36} color="var(--warm-gray-300)" style={{ marginBottom: 12 }} />
        <h2 style={{ fontSize: "1.1rem", color: "var(--warm-gray-700)", marginBottom: 4 }}>Access Restricted</h2>
        <p style={{ fontSize: "0.85rem", color: "var(--warm-gray-400)" }}>Mess staff or admin access required.</p>
      </div>
    );
  }

  const grouped = { approved: orders?.filter(o => o.orderStatus === "approved") || [], preparing: orders?.filter(o => o.orderStatus === "preparing") || [], dispatched: orders?.filter(o => o.orderStatus === "dispatched") || [] };

  return (
    <div className="animate-fade-in">
      <h1 style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--warm-gray-800)", marginBottom: 24 }}>Mess Staff Queue</h1>

      {/* Summary stats */}
      <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
        {Object.entries(grouped).map(([status, items]) => (
          <div key={status} className="card" style={{ padding: "12px 20px", display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 140 }}>
            <div style={{ color: "var(--green-500)" }}>{STATUS_ICONS[status]}</div>
            <div>
              <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--warm-gray-800)" }}>{items.length}</div>
              <div style={{ fontSize: "0.75rem", color: "var(--warm-gray-400)" }}>{STATUS_LABELS[status]}</div>
            </div>
          </div>
        ))}
      </div>

      {orders?.length === 0 ? (
        <div className="card" style={{ padding: 40, textAlign: "center" }}>
          <ChefHat size={36} color="var(--warm-gray-300)" style={{ marginBottom: 12 }} />
          <p style={{ color: "var(--warm-gray-500)" }}>No orders in queue.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {orders?.map((order) => (
            <div key={order._id} className="card" style={{ padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 12 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: "1rem", fontWeight: 600, color: "var(--warm-gray-800)" }}>{order.orderId}</span>
                    <span className={`badge status-${order.orderStatus}`}>{STATUS_LABELS[order.orderStatus]}</span>
                    <span className="badge badge-sky">{SLOT_LABELS[order.deliverySlot]}</span>
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "var(--warm-gray-600)" }}>
                    {order.studentName} · Room {order.roomNumber || "–"} · {order.hostel || "–"}
                  </div>
                </div>
              </div>

              {/* Items with dietary flags */}
              <div style={{ marginBottom: 12 }}>
                <span className="label" style={{ fontSize: "0.75rem" }}>Meal Items</span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {order.selectedItemNames.map((name, i) => (
                    <span key={i} style={{ padding: "6px 12px", background: "var(--green-50)", border: "1px solid var(--green-200)", borderRadius: "var(--radius-sm)", fontSize: "0.85rem", fontWeight: 500, color: "var(--green-700)" }}>{name}</span>
                  ))}
                </div>
              </div>

              {order.ocrFlags && order.ocrFlags.length > 0 && (
                <div style={{ marginBottom: 12, padding: 10, background: "var(--amber-light)", borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <AlertTriangle size={14} color="#8b6a3a" />
                  <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#8b6a3a" }}>Dietary flags:</span>
                  {order.ocrFlags.map((f, i) => <span key={i} className="badge badge-amber">{f}</span>)}
                </div>
              )}

              {order.specialInstructions && (
                <div style={{ marginBottom: 12, fontSize: "0.85rem", color: "var(--warm-gray-600)", fontStyle: "italic" }}>📝 {order.specialInstructions}</div>
              )}

              {/* Action button */}
              {NEXT_STATUS[order.orderStatus] && (
                <button className="btn-primary" style={{ marginTop: 4 }}
                  onClick={() => updateStatus({ orderId: order._id, status: NEXT_STATUS[order.orderStatus], actorName: student.name })}>
                  {order.orderStatus === "approved" && <><ChefHat size={16} /> Start Preparing</>}
                  {order.orderStatus === "preparing" && <><Truck size={16} /> Mark Dispatched</>}
                  {order.orderStatus === "dispatched" && <><CheckCircle2 size={16} /> Mark Delivered</>}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
