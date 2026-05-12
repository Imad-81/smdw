"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Users, Shield } from "lucide-react";

const ROLES = [
  { value: "student" as const, label: "Student" },
  { value: "warden" as const, label: "Warden" },
  { value: "mess_staff" as const, label: "Mess Staff" },
  { value: "admin" as const, label: "Admin" },
];

export default function AdminPage() {
  const { user } = useUser();
  const student = useQuery(api.students.getByClerkId, user ? { clerkId: user.id } : "skip");
  const allStudents = useQuery(api.students.listAll);
  const updateRole = useMutation(api.students.updateRole);
  const seedMenu = useMutation(api.menuItems.seed);

  if (!student || student.role !== "admin") {
    return (
      <div className="card" style={{ padding: 40, textAlign: "center", maxWidth: 400, margin: "60px auto" }}>
        <Shield size={36} color="var(--warm-gray-300)" style={{ marginBottom: 12 }} />
        <h2 style={{ fontSize: "1.1rem", color: "var(--warm-gray-700)", marginBottom: 4 }}>Admin Access Required</h2>
        <p style={{ fontSize: "0.85rem", color: "var(--warm-gray-400)" }}>You need admin privileges.</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <h1 style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--warm-gray-800)" }}>Admin Panel</h1>
        <button className="btn-secondary" onClick={() => seedMenu({})}>Seed Menu Data</button>
      </div>

      <div className="card" style={{ overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--warm-gray-100)", display: "flex", alignItems: "center", gap: 8 }}>
          <Users size={18} color="var(--warm-gray-500)" />
          <h2 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--warm-gray-700)" }}>User Management ({allStudents?.length || 0})</h2>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
          <thead>
            <tr style={{ background: "var(--warm-gray-50)", borderBottom: "1px solid var(--warm-gray-100)" }}>
              {["Name", "Email", "Hostel", "Room", "Role", "Actions"].map(h => (
                <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontWeight: 600, color: "var(--warm-gray-600)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {allStudents?.map((s) => (
              <tr key={s._id} style={{ borderBottom: "1px solid var(--warm-gray-100)" }}>
                <td style={{ padding: "10px 16px", fontWeight: 500 }}>{s.name}</td>
                <td style={{ padding: "10px 16px", color: "var(--warm-gray-500)" }}>{s.email}</td>
                <td style={{ padding: "10px 16px", color: "var(--warm-gray-500)" }}>{s.hostel || "–"}</td>
                <td style={{ padding: "10px 16px", color: "var(--warm-gray-500)" }}>{s.roomNumber || "–"}</td>
                <td style={{ padding: "10px 16px" }}><span className={`badge ${s.role === "admin" ? "badge-lavender" : s.role === "warden" ? "badge-amber" : s.role === "mess_staff" ? "badge-peach" : "badge-green"}`} style={{ textTransform: "capitalize" }}>{s.role.replace("_", " ")}</span></td>
                <td style={{ padding: "10px 16px" }}>
                  <select className="select-field" value={s.role} onChange={(e) => updateRole({ studentId: s._id, role: e.target.value as any })}
                    style={{ padding: "4px 8px", fontSize: "0.8rem", width: "auto", minWidth: 120 }}>
                    {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
