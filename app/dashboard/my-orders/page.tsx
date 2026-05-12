"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ClipboardList, XCircle } from "lucide-react";

const STATUS_LABELS: Record<string, string> = { submitted: "Submitted", pending_review: "Pending Review", approved: "Approved", rejected: "Rejected", preparing: "Preparing", dispatched: "Dispatched", delivered: "Delivered", cancelled: "Cancelled" };
const SLOT_LABELS: Record<string, string> = { breakfast: "Breakfast", lunch: "Lunch", dinner: "Dinner" };

export default function MyOrdersPage() {
  const { user } = useUser();
  const student = useQuery(api.students.getByClerkId, user ? { clerkId: user.id } : "skip");
  const orders = useQuery(api.orders.getByStudent, student ? { studentId: student._id } : "skip");
  const cancelOrder = useMutation(api.orders.cancel);

  if (!student || orders === undefined) {
    return <div><div className="skeleton" style={{ height: 32, width: 200, marginBottom: 16 }} />{[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 80, marginBottom: 8 }} />)}</div>;
  }

  const canCancel = (status: string) => !["preparing", "dispatched", "delivered", "cancelled", "rejected"].includes(status);

  return (
    <div className="animate-fade-in">
      <h1 style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--warm-gray-800)", marginBottom: 24 }}>My Orders</h1>
      {orders.length === 0 ? (
        <div className="card" style={{ padding: 40, textAlign: "center" }}>
          <ClipboardList size={36} color="var(--warm-gray-300)" style={{ marginBottom: 12 }} />
          <p style={{ color: "var(--warm-gray-500)" }}>No orders yet.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {orders.map((order) => (
            <div key={order._id} className="card" style={{ padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                    <span style={{ fontSize: "1rem", fontWeight: 600, color: "var(--warm-gray-800)" }}>{order.orderId}</span>
                    <span className={`badge status-${order.orderStatus}`}>{STATUS_LABELS[order.orderStatus]}</span>
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "var(--warm-gray-500)", marginBottom: 4 }}>{SLOT_LABELS[order.deliverySlot]} · {order.illnessType.replace(/_/g, " ")}</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--warm-gray-400)" }}>{order.selectedItemNames.join(", ")}</div>
                  {order.rejectionReason && (
                    <div style={{ marginTop: 8, padding: 8, background: "var(--rose-light)", borderRadius: "var(--radius-sm)", fontSize: "0.8rem", color: "#8b3a5a" }}>
                      Reason: {order.rejectionReason}
                    </div>
                  )}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: "0.78rem", color: "var(--warm-gray-400)" }}>{new Date(order.createdAt).toLocaleString()}</span>
                  {canCancel(order.orderStatus) && (
                    <button className="btn-danger" style={{ padding: "6px 12px", fontSize: "0.78rem" }}
                      onClick={() => cancelOrder({ orderId: order._id, actorName: student.name })}>
                      <XCircle size={14} /> Cancel
                    </button>
                  )}
                </div>
              </div>
              {/* Status timeline */}
              <div style={{ display: "flex", gap: 4, marginTop: 12, flexWrap: "wrap" }}>
                {order.statusHistory.map((sh, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <span className={`badge status-${sh.status}`} style={{ fontSize: "0.65rem" }}>{STATUS_LABELS[sh.status] || sh.status}</span>
                    {i < order.statusHistory.length - 1 && <span style={{ color: "var(--warm-gray-300)" }}>→</span>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
