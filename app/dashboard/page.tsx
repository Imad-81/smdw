"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import {
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  UtensilsCrossed,
  TrendingUp,
  Package,
} from "lucide-react";

const STATUS_LABELS: Record<string, string> = {
  submitted: "Submitted",
  pending_review: "Pending Review",
  approved: "Approved",
  rejected: "Rejected",
  preparing: "Preparing",
  dispatched: "Dispatched",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const SLOT_LABELS: Record<string, string> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
};

export default function DashboardPage() {
  const { user } = useUser();
  const student = useQuery(
    api.students.getByClerkId,
    user ? { clerkId: user.id } : "skip"
  );
  const orders = useQuery(
    api.orders.getByStudent,
    student ? { studentId: student._id } : "skip"
  );

  const seedMenu = useMutation(api.menuItems.seed);

  // Seed menu on first load
  const menuItems = useQuery(api.menuItems.getAll);

  if (!student || orders === undefined) {
    return (
      <div>
        <div className="skeleton" style={{ height: 32, width: 200, marginBottom: 24 }} />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 16,
          }}
        >
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton" style={{ height: 100 }} />
          ))}
        </div>
      </div>
    );
  }

  const activeOrders =
    orders?.filter(
      (o) =>
        o.orderStatus !== "delivered" &&
        o.orderStatus !== "cancelled" &&
        o.orderStatus !== "rejected"
    ) || [];

  const recentOrders = orders?.slice(0, 5) || [];

  const stats = {
    total: orders?.length || 0,
    active: activeOrders.length,
    delivered: orders?.filter((o) => o.orderStatus === "delivered").length || 0,
    pending:
      orders?.filter((o) => o.orderStatus === "pending_review").length || 0,
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 28,
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "var(--warm-gray-800)",
              marginBottom: 4,
            }}
          >
            Welcome back, {user?.firstName || "Student"} 👋
          </h1>
          <p style={{ color: "var(--warm-gray-400)", fontSize: "0.9rem" }}>
            {activeOrders.length > 0
              ? `You have ${activeOrders.length} active order${activeOrders.length > 1 ? "s" : ""}`
              : "No active orders — hope you're feeling better!"}
          </p>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          {menuItems && menuItems.length === 0 && (
            <button
              className="btn-secondary"
              onClick={() => seedMenu({})}
              style={{ fontSize: "0.85rem" }}
            >
              <UtensilsCrossed size={16} />
              Seed Menu
            </button>
          )}
          <Link href="/dashboard/new-order" style={{ textDecoration: "none" }}>
            <button className="btn-primary">
              <PlusCircle size={16} />
              New Order
            </button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 16,
          marginBottom: 28,
        }}
      >
        {[
          {
            icon: <Package size={20} />,
            label: "Total Orders",
            value: stats.total,
            color: "var(--sky-light)",
            iconColor: "#3a5a8b",
          },
          {
            icon: <Clock size={20} />,
            label: "Active",
            value: stats.active,
            color: "var(--amber-light)",
            iconColor: "#8b6a3a",
          },
          {
            icon: <CheckCircle2 size={20} />,
            label: "Delivered",
            value: stats.delivered,
            color: "var(--green-100)",
            iconColor: "var(--green-700)",
          },
          {
            icon: <AlertCircle size={20} />,
            label: "Pending Review",
            value: stats.pending,
            color: "var(--peach-light)",
            iconColor: "#8b5a3a",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="card"
            style={{ padding: 20, display: "flex", alignItems: "center", gap: 14 }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "var(--radius-md)",
                background: stat.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: stat.iconColor,
                flexShrink: 0,
              }}
            >
              {stat.icon}
            </div>
            <div>
              <div
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  color: "var(--warm-gray-800)",
                  lineHeight: 1,
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: "0.78rem",
                  color: "var(--warm-gray-400)",
                  marginTop: 2,
                }}
              >
                {stat.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Active orders */}
      {activeOrders.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <h2
            style={{
              fontSize: "1.1rem",
              fontWeight: 600,
              color: "var(--warm-gray-800)",
              marginBottom: 14,
            }}
          >
            Active Orders
          </h2>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {activeOrders.map((order) => (
              <div
                key={order._id}
                className="card"
                style={{
                  padding: 16,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 16,
                  flexWrap: "wrap",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "var(--radius-sm)",
                      background: "var(--green-50)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <UtensilsCrossed size={18} color="var(--green-600)" />
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "0.9rem",
                        fontWeight: 600,
                        color: "var(--warm-gray-800)",
                      }}
                    >
                      {order.orderId}
                    </div>
                    <div
                      style={{
                        fontSize: "0.78rem",
                        color: "var(--warm-gray-400)",
                      }}
                    >
                      {SLOT_LABELS[order.deliverySlot]} ·{" "}
                      {order.selectedItemNames.slice(0, 2).join(", ")}
                      {order.selectedItemNames.length > 2 && " ..."}
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span
                    className={`badge status-${order.orderStatus}`}
                    style={{ fontSize: "0.75rem" }}
                  >
                    {STATUS_LABELS[order.orderStatus]}
                  </span>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--warm-gray-400)",
                    }}
                  >
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Orders */}
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 14,
          }}
        >
          <h2
            style={{
              fontSize: "1.1rem",
              fontWeight: 600,
              color: "var(--warm-gray-800)",
            }}
          >
            Recent Orders
          </h2>
          {orders && orders.length > 5 && (
            <Link
              href="/dashboard/my-orders"
              style={{
                fontSize: "0.85rem",
                color: "var(--green-500)",
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              View all →
            </Link>
          )}
        </div>

        {recentOrders.length === 0 ? (
          <div
            className="card"
            style={{
              padding: 40,
              textAlign: "center",
            }}
          >
            <TrendingUp
              size={36}
              color="var(--warm-gray-300)"
              style={{ marginBottom: 12 }}
            />
            <p
              style={{
                color: "var(--warm-gray-500)",
                fontSize: "0.9rem",
                marginBottom: 16,
              }}
            >
              No orders yet. Submit your first meal request!
            </p>
            <Link href="/dashboard/new-order" style={{ textDecoration: "none" }}>
              <button className="btn-primary">
                <PlusCircle size={16} /> New Order
              </button>
            </Link>
          </div>
        ) : (
          <div className="card" style={{ overflow: "hidden" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "0.85rem",
              }}
            >
              <thead>
                <tr
                  style={{
                    background: "var(--warm-gray-50)",
                    borderBottom: "1px solid var(--warm-gray-100)",
                  }}
                >
                  <th
                    style={{
                      padding: "10px 16px",
                      textAlign: "left",
                      fontWeight: 600,
                      color: "var(--warm-gray-600)",
                    }}
                  >
                    Order ID
                  </th>
                  <th
                    style={{
                      padding: "10px 16px",
                      textAlign: "left",
                      fontWeight: 600,
                      color: "var(--warm-gray-600)",
                    }}
                  >
                    Slot
                  </th>
                  <th
                    style={{
                      padding: "10px 16px",
                      textAlign: "left",
                      fontWeight: 600,
                      color: "var(--warm-gray-600)",
                    }}
                  >
                    Items
                  </th>
                  <th
                    style={{
                      padding: "10px 16px",
                      textAlign: "left",
                      fontWeight: 600,
                      color: "var(--warm-gray-600)",
                    }}
                  >
                    Status
                  </th>
                  <th
                    style={{
                      padding: "10px 16px",
                      textAlign: "left",
                      fontWeight: 600,
                      color: "var(--warm-gray-600)",
                    }}
                  >
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr
                    key={order._id}
                    style={{
                      borderBottom: "1px solid var(--warm-gray-100)",
                    }}
                  >
                    <td
                      style={{
                        padding: "12px 16px",
                        fontWeight: 500,
                        color: "var(--warm-gray-700)",
                      }}
                    >
                      {order.orderId}
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        color: "var(--warm-gray-600)",
                      }}
                    >
                      {SLOT_LABELS[order.deliverySlot]}
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        color: "var(--warm-gray-500)",
                        maxWidth: 200,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {order.selectedItemNames.join(", ")}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span className={`badge status-${order.orderStatus}`}>
                        {STATUS_LABELS[order.orderStatus]}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        color: "var(--warm-gray-400)",
                      }}
                    >
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Profile completion hint */}
      {(!student.hostel || !student.roomNumber) && (
        <div
          className="card"
          style={{
            marginTop: 24,
            padding: 20,
            background: "var(--amber-light)",
            border: "1px solid var(--amber)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <AlertCircle size={18} color="#8b6a3a" />
            <div>
              <div
                style={{
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  color: "#8b6a3a",
                  marginBottom: 2,
                }}
              >
                Complete your profile
              </div>
              <div style={{ fontSize: "0.8rem", color: "#8b6a3a" }}>
                Please add your hostel and room number to submit orders.{" "}
                <Link
                  href="/dashboard/profile"
                  style={{ color: "#8b6a3a", fontWeight: 600 }}
                >
                  Update Profile →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
