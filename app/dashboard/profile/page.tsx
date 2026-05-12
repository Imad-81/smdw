"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { Settings, Save, CheckCircle2 } from "lucide-react";

const HOSTELS = ["Hostel A", "Hostel B", "Hostel C", "Hostel D", "Hostel E"];
const DIETARY = [{ value: "veg" as const, label: "Vegetarian" }, { value: "non-veg" as const, label: "Non-Vegetarian" }, { value: "vegan" as const, label: "Vegan" }, { value: "jain" as const, label: "Jain" }];
const ALLERGIES = ["Gluten", "Dairy", "Nuts", "Eggs", "Soy", "Shellfish"];

export default function ProfilePage() {
  const { user } = useUser();
  const student = useQuery(api.students.getByClerkId, user ? { clerkId: user.id } : "skip");
  const updateProfile = useMutation(api.students.updateProfile);

  const [phone, setPhone] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [hostel, setHostel] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [dietaryPreference, setDietaryPreference] = useState<"veg" | "non-veg" | "vegan" | "jain">("veg");
  const [allergies, setAllergies] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (student && !loaded) {
    setPhone(student.phone || "");
    setRollNumber(student.rollNumber || "");
    setHostel(student.hostel || "");
    setRoomNumber(student.roomNumber || "");
    setDietaryPreference(student.dietaryPreference || "veg");
    setAllergies(student.knownAllergies || []);
    setLoaded(true);
  }

  if (!student) return <div><div className="skeleton" style={{ height: 400 }} /></div>;

  const handleSave = async () => {
    await updateProfile({
      studentId: student._id,
      phone: phone || undefined,
      rollNumber: rollNumber || undefined,
      hostel: hostel || undefined,
      roomNumber: roomNumber || undefined,
      dietaryPreference,
      knownAllergies: allergies,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: 600 }}>
      <h1 style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--warm-gray-800)", marginBottom: 24 }}>
        <Settings size={20} style={{ display: "inline", marginRight: 8, verticalAlign: "middle" }} />Profile
      </h1>

      <div className="card" style={{ padding: 28 }}>
        <div style={{ display: "grid", gap: 20 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div><label className="label">Name</label><input className="input-field" value={student.name} disabled style={{ opacity: 0.6 }} /></div>
            <div><label className="label">Email</label><input className="input-field" value={student.email} disabled style={{ opacity: 0.6 }} /></div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div><label className="label">Phone</label><input className="input-field" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Enter phone number" /></div>
            <div><label className="label">Roll Number</label><input className="input-field" value={rollNumber} onChange={(e) => setRollNumber(e.target.value)} placeholder="Enter roll number" /></div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label className="label">Hostel *</label>
              <select className="select-field" value={hostel} onChange={(e) => setHostel(e.target.value)}>
                <option value="">Select hostel</option>
                {HOSTELS.map((h) => <option key={h} value={h}>{h}</option>)}
              </select>
            </div>
            <div><label className="label">Room Number *</label><input className="input-field" value={roomNumber} onChange={(e) => setRoomNumber(e.target.value)} placeholder="e.g., 204" /></div>
          </div>

          <div>
            <label className="label">Dietary Preference</label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {DIETARY.map((d) => (
                <button key={d.value} onClick={() => setDietaryPreference(d.value)}
                  style={{ padding: "8px 16px", borderRadius: "var(--radius-md)", border: dietaryPreference === d.value ? "2px solid var(--green-400)" : "1px solid var(--warm-gray-200)", background: dietaryPreference === d.value ? "var(--green-50)" : "white", fontSize: "0.85rem", fontWeight: 500, cursor: "pointer", color: "var(--warm-gray-700)" }}>
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="label">Known Allergies</label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {ALLERGIES.map((a) => (
                <button key={a} onClick={() => setAllergies(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a])}
                  style={{ padding: "6px 14px", borderRadius: "var(--radius-full)", border: allergies.includes(a) ? "2px solid var(--rose)" : "1px solid var(--warm-gray-200)", background: allergies.includes(a) ? "var(--rose-light)" : "white", fontSize: "0.8rem", fontWeight: 500, cursor: "pointer", color: allergies.includes(a) ? "#8b3a5a" : "var(--warm-gray-600)" }}>
                  {a}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button className="btn-primary" onClick={handleSave}><Save size={16} /> Save Profile</button>
            {saved && <span style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--green-600)", fontSize: "0.85rem" }}><CheckCircle2 size={16} /> Saved!</span>}
          </div>

          <div style={{ paddingTop: 12, borderTop: "1px solid var(--warm-gray-100)" }}>
            <span className="label">Role</span>
            <span className="badge badge-green" style={{ textTransform: "capitalize" }}>{student.role.replace("_", " ")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
