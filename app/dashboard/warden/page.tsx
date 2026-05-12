"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { Shield, CheckCircle2, XCircle, Clock, Eye, X } from "lucide-react";

const STATUS_LABELS: Record<string, string> = { submitted: "Submitted", pending_review: "Pending Review", approved: "Approved", rejected: "Rejected", preparing: "Preparing", dispatched: "Dispatched", delivered: "Delivered", cancelled: "Cancelled" };
const SLOT_LABELS: Record<string, string> = { breakfast: "Breakfast", lunch: "Lunch", dinner: "Dinner" };

export default function WardenPage() {
  const { user } = useUser();
  const student = useQuery(api.students.getByClerkId, user ? { clerkId: user.id } : "skip");
  const pendingOrders = useQuery(api.orders.getPending);
  const allOrders = useQuery(api.orders.getAll, {});
  const approveOrder = useMutation(api.orders.approve);
  const rejectOrder = useMutation(api.orders.reject);

  const [tab, setTab] = useState<"pending" | "all">("pending");
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [prescriptionModal, setPrescriptionModal] = useState<string | null>(null);

  if (!student || student.role === "student") {
    return (
      <div className="card" style={{ padding: 40, textAlign: "center", maxWidth: 400, margin: "60px auto" }}>
        <Shield size={36} color="var(--warm-gray-300)" style={{ marginBottom: 12 }} />
        <h2 style={{ fontSize: "1.1rem", color: "var(--warm-gray-700)", marginBottom: 4 }}>Access Restricted</h2>
        <p style={{ fontSize: "0.85rem", color: "var(--warm-gray-400)" }}>You need warden or admin privileges to access this page.</p>
      </div>
    );
  }

  const orders = tab === "pending" ? pendingOrders : allOrders;

  return (
    <div className="animate-fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <h1 style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--warm-gray-800)" }}>Warden Dashboard</h1>
        <div style={{ display: "flex", gap: 4, background: "var(--warm-gray-100)", borderRadius: "var(--radius-md)", padding: 3 }}>
          {(["pending", "all"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              style={{ padding: "6px 16px", borderRadius: "var(--radius-sm)", border: "none", background: tab === t ? "white" : "transparent", color: tab === t ? "var(--warm-gray-800)" : "var(--warm-gray-500)", fontWeight: 500, fontSize: "0.85rem", cursor: "pointer", boxShadow: tab === t ? "var(--shadow-sm)" : "none" }}>
              {t === "pending" ? `Pending (${pendingOrders?.length || 0})` : "All Orders"}
            </button>
          ))}
        </div>
      </div>

      {!orders || orders.length === 0 ? (
        <div className="card" style={{ padding: 40, textAlign: "center" }}>
          <Clock size={36} color="var(--warm-gray-300)" style={{ marginBottom: 12 }} />
          <p style={{ color: "var(--warm-gray-500)" }}>{tab === "pending" ? "No pending orders" : "No orders found"}</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {orders.map((order) => (
            <div key={order._id} className="card" style={{ padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 12 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: "1rem", fontWeight: 600, color: "var(--warm-gray-800)" }}>{order.orderId}</span>
                    <span className={`badge status-${order.orderStatus}`}>{STATUS_LABELS[order.orderStatus]}</span>
                    {order.prescriptionStatus === "self_certified" && <span className="badge badge-amber">Self-certified</span>}
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "var(--warm-gray-600)" }}>{order.studentName} · Room {order.roomNumber || "–"} · {order.hostel || "–"}</div>
                </div>
                <span style={{ fontSize: "0.78rem", color: "var(--warm-gray-400)" }}>
                  {Math.round((Date.now() - order.createdAt) / 60000)} min ago
                </span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginBottom: 12 }}>
                <div><span className="label" style={{ fontSize: "0.75rem" }}>Illness</span><div style={{ fontSize: "0.85rem", color: "var(--warm-gray-700)" }}>{order.illnessType.replace(/_/g, " ")}</div></div>
                <div><span className="label" style={{ fontSize: "0.75rem" }}>Severity</span><div style={{ fontSize: "0.85rem", color: "var(--warm-gray-700)", textTransform: "capitalize" }}>{order.illnessSeverity}</div></div>
                <div><span className="label" style={{ fontSize: "0.75rem" }}>Slot</span><div style={{ fontSize: "0.85rem", color: "var(--warm-gray-700)" }}>{SLOT_LABELS[order.deliverySlot]}</div></div>
              </div>

              <div style={{ marginBottom: 12 }}>
                <span className="label" style={{ fontSize: "0.75rem" }}>Items</span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {order.selectedItemNames.map((name, i) => <span key={i} className="badge badge-green">{name}</span>)}
                </div>
              </div>

              {order.ocrFlags && order.ocrFlags.length > 0 && (
                <div style={{ marginBottom: 12 }}>
                  <span className="label" style={{ fontSize: "0.75rem" }}>Dietary Flags (OCR)</span>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                    {order.ocrFlags.map((f, i) => <span key={i} className="badge badge-peach">{f}</span>)}
                  </div>
                </div>
              )}

              {order.specialInstructions && (
                <div style={{ marginBottom: 12 }}>
                  <span className="label" style={{ fontSize: "0.75rem" }}>Special Instructions</span>
                  <div style={{ fontSize: "0.85rem", color: "var(--warm-gray-600)" }}>{order.specialInstructions}</div>
                </div>
              )}

              {/* Actions */}
              {order.orderStatus === "pending_review" && (
                <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                  {order.prescriptionStorageId && (
                    <button className="btn-secondary" style={{ padding: "6px 12px", fontSize: "0.8rem" }}
                      onClick={() => setPrescriptionModal(order._id)}>
                      <Eye size={14} /> View Prescription
                    </button>
                  )}
                  <button className="btn-success" style={{ padding: "6px 12px", fontSize: "0.8rem" }}
                    onClick={() => approveOrder({ orderId: order._id, actorName: student.name })}>
                    <CheckCircle2 size={14} /> Approve
                  </button>
                  {rejectingId === order._id ? (
                    <div style={{ display: "flex", gap: 6, alignItems: "center", flex: 1 }}>
                      <input className="input-field" placeholder="Rejection reason..." value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} style={{ flex: 1, padding: "6px 10px", fontSize: "0.8rem" }} />
                      <button className="btn-danger" style={{ padding: "6px 10px", fontSize: "0.8rem" }}
                        onClick={() => { rejectOrder({ orderId: order._id, rejectionReason: rejectReason, actorName: student.name }); setRejectingId(null); setRejectReason(""); }}
                        disabled={!rejectReason}>Reject</button>
                      <button onClick={() => { setRejectingId(null); setRejectReason(""); }} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={16} /></button>
                    </div>
                  ) : (
                    <button className="btn-danger" style={{ padding: "6px 12px", fontSize: "0.8rem" }}
                      onClick={() => setRejectingId(order._id)}>
                      <XCircle size={14} /> Reject
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Prescription Modal */}
      {prescriptionModal && (
        <div onClick={() => setPrescriptionModal(null)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div onClick={(e) => e.stopPropagation()} className="card" style={{ maxWidth: 600, width: "100%", padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              <h3 style={{ fontSize: "1rem", fontWeight: 600 }}>Prescription Preview</h3>
              <button onClick={() => setPrescriptionModal(null)} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={18} /></button>
            </div>
            <PrescriptionPreview orderId={prescriptionModal} />
          </div>
        </div>
      )}
    </div>
  );
}

function PrescriptionPreview({ orderId }: { orderId: string }) {
  const order = useQuery(api.orders.getById, { orderId: orderId as any });
  const url = useQuery(api.orders.getPrescriptionUrl, order?.prescriptionStorageId ? { storageId: order.prescriptionStorageId } : "skip");

  if (!url) return <div className="skeleton" style={{ height: 300 }} />;
  return <img src={url} alt="Prescription" style={{ width: "100%", borderRadius: "var(--radius-md)", maxHeight: 500, objectFit: "contain" }} />;
}
