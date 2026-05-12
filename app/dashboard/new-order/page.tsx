"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import {
  Heart, Upload, UtensilsCrossed, Send, ChevronRight, ChevronLeft,
  CheckCircle2, AlertTriangle, X, Loader2, FileText, Star,
} from "lucide-react";

const ILLNESS_TYPES = [
  { value: "fever_flu", label: "Fever / Flu" },
  { value: "stomach_infection", label: "Stomach Infection / Nausea" },
  { value: "throat_infection", label: "Throat Infection / Cold" },
  { value: "recovery", label: "Post-Surgery / Recovery" },
  { value: "injury", label: "Injury / Mobility Restriction" },
  { value: "general_weakness", label: "General Weakness" },
  { value: "other", label: "Other" },
];

const SEVERITY_LEVELS = [
  { value: "mild" as const, label: "Mild", desc: "Can manage daily activities" },
  { value: "moderate" as const, label: "Moderate", desc: "Need rest, limited activity" },
  { value: "severe" as const, label: "Severe", desc: "Bedridden, need immediate care" },
];

const SLOT_OPTIONS = [
  { value: "breakfast" as const, label: "Breakfast", time: "7:00 – 9:00 AM" },
  { value: "lunch" as const, label: "Lunch", time: "12:00 – 2:00 PM" },
  { value: "dinner" as const, label: "Dinner", time: "7:00 – 9:00 PM" },
];

const STEPS = ["Health", "Prescription", "Menu", "Review"];

type MenuItem = {
  _id: Id<"menuItems">;
  name: string;
  description?: string;
  dietaryTags: string[];
  spiceLevel: string;
  recommendedFor: string[];
  discouragedFor: string[];
  mealSlot: string[];
  category?: string;
  allergens?: string[];
};

export default function NewOrderPage() {
  const { user } = useUser();
  const router = useRouter();
  const student = useQuery(api.students.getByClerkId, user ? { clerkId: user.id } : "skip");
  const menuItems = useQuery(api.menuItems.getAll);
  const createOrder = useMutation(api.orders.create);
  const generateUploadUrl = useMutation(api.orders.generateUploadUrl);
  const analyzePrescription = useAction(api.prescriptionAnalysis.analyzePrescription);

  const [step, setStep] = useState(0);
  const [illnessType, setIllnessType] = useState("");
  const [severity, setSeverity] = useState<"mild" | "moderate" | "severe">("mild");
  const [illnessNotes, setIllnessNotes] = useState("");
  const [deliverySlot, setDeliverySlot] = useState<"breakfast" | "lunch" | "dinner">("lunch");
  const [prescriptionFile, setPrescriptionFile] = useState<File | null>(null);
  const [prescriptionStorageId, setPrescriptionStorageId] = useState<Id<"_storage"> | null>(null);
  const [selfCertified, setSelfCertified] = useState(false);
  const [ocrFlags, setOcrFlags] = useState<string[]>([]);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrDone, setOcrDone] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Id<"menuItems">[]>([]);
  const [selectedItemNames, setSelectedItemNames] = useState<string[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [newOrderId, setNewOrderId] = useState("");

  const handleFileUpload = useCallback(async (file: File) => {
    setPrescriptionFile(file);
    try {
      const url = await generateUploadUrl({});
      const result = await fetch(url, { method: "POST", headers: { "Content-Type": file.type }, body: file });
      const { storageId } = await result.json();
      setPrescriptionStorageId(storageId);

      setOcrLoading(true);
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = (reader.result as string).split(",")[1];
        try {
          const analysis = await analyzePrescription({ base64Image: base64, mimeType: file.type });
          if (analysis.dietaryFlags && analysis.dietaryFlags.length > 0) {
            setOcrFlags(analysis.dietaryFlags);
          }
          setOcrDone(true);
        } catch { setOcrDone(true); }
        setOcrLoading(false);
      };
      reader.readAsDataURL(file);
    } catch (e) { console.error(e); setOcrLoading(false); }
  }, [generateUploadUrl, analyzePrescription]);

  const toggleItem = (item: MenuItem) => {
    if (selectedItems.includes(item._id)) {
      setSelectedItems((prev) => prev.filter((id) => id !== item._id));
      setSelectedItemNames((prev) => prev.filter((n) => n !== item.name));
    } else {
      setSelectedItems((prev) => [...prev, item._id]);
      setSelectedItemNames((prev) => [...prev, item.name]);
    }
  };

  const handleSubmit = async () => {
    if (!student) return;
    setSubmitting(true);
    try {
      const result = await createOrder({
        studentId: student._id,
        studentName: student.name,
        hostel: student.hostel,
        roomNumber: student.roomNumber,
        deliverySlot,
        illnessType,
        illnessSeverity: severity,
        illnessNotes: illnessNotes || undefined,
        selectedItems,
        selectedItemNames,
        specialInstructions: specialInstructions || undefined,
        prescriptionStorageId: prescriptionStorageId || undefined,
        prescriptionStatus: prescriptionStorageId ? "pending" : "self_certified",
        ocrFlags: ocrFlags.length > 0 ? ocrFlags : undefined,
      });
      setNewOrderId(result.orderId);
      setSubmitted(true);
    } catch (e) { console.error(e); }
    setSubmitting(false);
  };

  if (submitted) {
    return (
      <div className="animate-scale-in" style={{ maxWidth: 500, margin: "60px auto", textAlign: "center" }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--green-100)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
          <CheckCircle2 size={32} color="var(--green-600)" />
        </div>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--warm-gray-800)", marginBottom: 8 }}>Order Submitted!</h2>
        <p style={{ color: "var(--warm-gray-500)", marginBottom: 4 }}>Your order <strong>{newOrderId}</strong> has been submitted for review.</p>
        <p style={{ color: "var(--warm-gray-400)", fontSize: "0.85rem", marginBottom: 28 }}>You'll be notified once your warden approves it.</p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <button className="btn-primary" onClick={() => router.push("/dashboard")}>Go to Dashboard</button>
          <button className="btn-secondary" onClick={() => router.push("/dashboard/my-orders")}>View Orders</button>
        </div>
      </div>
    );
  }

  const filteredMenu = menuItems?.filter((item) => item.availableForSickDelivery && item.mealSlot.includes(deliverySlot)) || [];
  const recommended = filteredMenu.filter((item) => item.recommendedFor.includes(illnessType));
  const available = filteredMenu.filter((item) => !item.recommendedFor.includes(illnessType) && !item.discouragedFor.includes(illnessType));
  const discouraged = filteredMenu.filter((item) => item.discouragedFor.includes(illnessType));

  const canProceed = [
    illnessType !== "",
    prescriptionStorageId !== null || selfCertified,
    selectedItems.length > 0,
    true,
  ];

  return (
    <div className="animate-fade-in" style={{ maxWidth: 720, margin: "0 auto" }}>
      <h1 style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--warm-gray-800)", marginBottom: 24 }}>New Meal Request</h1>

      {/* Step Indicator */}
      <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 32, padding: "0 8px" }}>
        {STEPS.map((s, i) => (
          <div key={s} style={{ display: "flex", alignItems: "center", gap: 4, flex: i < STEPS.length - 1 ? 1 : undefined }}>
            <div className={`step-dot ${i === step ? "active" : i < step ? "completed" : "upcoming"}`}>{i < step ? "✓" : i + 1}</div>
            <span style={{ fontSize: "0.78rem", color: i === step ? "var(--green-600)" : "var(--warm-gray-400)", fontWeight: i === step ? 600 : 400, whiteSpace: "nowrap" }}>{s}</span>
            {i < STEPS.length - 1 && <div className={`step-line ${i < step ? "completed" : ""}`} />}
          </div>
        ))}
      </div>

      {/* Step 0: Health Declaration */}
      {step === 0 && (
        <div className="card animate-slide-up" style={{ padding: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <Heart size={20} color="var(--rose)" />
            <h2 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--warm-gray-800)" }}>Health Declaration</h2>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label className="label">Illness Type *</label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 8 }}>
              {ILLNESS_TYPES.map((type) => (
                <button key={type.value} onClick={() => setIllnessType(type.value)}
                  style={{ padding: "10px 14px", borderRadius: "var(--radius-md)", border: illnessType === type.value ? "2px solid var(--green-400)" : "1px solid var(--warm-gray-200)", background: illnessType === type.value ? "var(--green-50)" : "white", color: "var(--warm-gray-700)", fontSize: "0.85rem", fontWeight: 500, cursor: "pointer", textAlign: "left", transition: "all 0.2s" }}>
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label className="label">Severity *</label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {SEVERITY_LEVELS.map((s) => (
                <button key={s.value} onClick={() => setSeverity(s.value)}
                  style={{ flex: 1, minWidth: 140, padding: "10px 14px", borderRadius: "var(--radius-md)", border: severity === s.value ? "2px solid var(--green-400)" : "1px solid var(--warm-gray-200)", background: severity === s.value ? "var(--green-50)" : "white", cursor: "pointer", textAlign: "left" }}>
                  <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--warm-gray-700)" }}>{s.label}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--warm-gray-400)" }}>{s.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label className="label">Delivery Slot *</label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {SLOT_OPTIONS.map((s) => (
                <button key={s.value} onClick={() => setDeliverySlot(s.value)}
                  style={{ flex: 1, minWidth: 140, padding: "10px 14px", borderRadius: "var(--radius-md)", border: deliverySlot === s.value ? "2px solid var(--green-400)" : "1px solid var(--warm-gray-200)", background: deliverySlot === s.value ? "var(--green-50)" : "white", cursor: "pointer", textAlign: "left" }}>
                  <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--warm-gray-700)" }}>{s.label}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--warm-gray-400)" }}>{s.time}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="label">Additional Notes (optional)</label>
            <textarea className="textarea-field" placeholder="Describe your symptoms..." value={illnessNotes} onChange={(e) => setIllnessNotes(e.target.value)} rows={3} />
          </div>
        </div>
      )}

      {/* Step 1: Prescription */}
      {step === 1 && (
        <div className="card animate-slide-up" style={{ padding: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <Upload size={20} color="var(--sky)" />
            <h2 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--warm-gray-800)" }}>Prescription Upload</h2>
          </div>

          {!prescriptionFile ? (
            <label style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: 40, border: "2px dashed var(--warm-gray-200)", borderRadius: "var(--radius-lg)", cursor: "pointer", transition: "border-color 0.2s" }}
              onDragOver={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = "var(--green-400)"; }}
              onDragLeave={(e) => { e.currentTarget.style.borderColor = "var(--warm-gray-200)"; }}
              onDrop={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = "var(--warm-gray-200)"; if (e.dataTransfer.files[0]) handleFileUpload(e.dataTransfer.files[0]); }}>
              <FileText size={36} color="var(--warm-gray-300)" style={{ marginBottom: 12 }} />
              <p style={{ color: "var(--warm-gray-600)", fontWeight: 500, marginBottom: 4 }}>Drop your prescription here</p>
              <p style={{ color: "var(--warm-gray-400)", fontSize: "0.8rem" }}>JPG, PNG, or PDF up to 5MB</p>
              <input type="file" accept="image/*,.pdf" style={{ display: "none" }} onChange={(e) => { if (e.target.files?.[0]) handleFileUpload(e.target.files[0]); }} />
            </label>
          ) : (
            <div style={{ padding: 16, border: "1px solid var(--green-200)", borderRadius: "var(--radius-md)", background: "var(--green-50)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <CheckCircle2 size={18} color="var(--green-600)" />
                  <span style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--green-700)" }}>{prescriptionFile.name}</span>
                </div>
                <button onClick={() => { setPrescriptionFile(null); setPrescriptionStorageId(null); setOcrFlags([]); setOcrDone(false); }}
                  style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
                  <X size={16} color="var(--warm-gray-400)" />
                </button>
              </div>
              {ocrLoading && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12 }}>
                  <Loader2 size={14} color="var(--green-500)" style={{ animation: "spin 1s linear infinite" }} />
                  <span style={{ fontSize: "0.8rem", color: "var(--green-600)" }}>Analyzing prescription with AI...</span>
                </div>
              )}
              {ocrDone && ocrFlags.length > 0 && (
                <div style={{ marginTop: 12 }}>
                  <p style={{ fontSize: "0.8rem", color: "var(--green-700)", fontWeight: 500, marginBottom: 6 }}>Extracted dietary flags:</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {ocrFlags.map((flag, i) => (
                      <span key={i} className="badge badge-green" style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        {flag}
                        <button onClick={() => setOcrFlags((prev) => prev.filter((_, j) => j !== i))} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div style={{ marginTop: 20, padding: 16, border: "1px solid var(--warm-gray-200)", borderRadius: "var(--radius-md)" }}>
            <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
              <input type="checkbox" checked={selfCertified} onChange={(e) => setSelfCertified(e.target.checked)}
                style={{ marginTop: 3, accentColor: "var(--green-400)" }} />
              <div>
                <span style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--warm-gray-700)" }}>Self-certify without prescription</span>
                <p style={{ fontSize: "0.78rem", color: "var(--warm-gray-400)", marginTop: 2 }}>
                  Your order will require mandatory warden review and cannot be auto-approved.
                </p>
              </div>
            </label>
          </div>
        </div>
      )}

      {/* Step 2: Menu Selection */}
      {step === 2 && (
        <div className="card animate-slide-up" style={{ padding: 28 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <UtensilsCrossed size={20} color="var(--green-500)" />
              <h2 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--warm-gray-800)" }}>Select Your Meal</h2>
            </div>
            <span className="badge badge-green">{selectedItems.length} selected</span>
          </div>

          {recommended.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                <Star size={14} color="var(--green-500)" />
                <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--green-700)" }}>Recommended for you</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 8 }}>
                {recommended.map((item) => (
                  <button key={item._id} onClick={() => toggleItem(item as MenuItem)}
                    className={selectedItems.includes(item._id) ? "menu-item-selected" : "menu-item-recommended"}
                    style={{ padding: 12, borderRadius: "var(--radius-md)", cursor: "pointer", textAlign: "left", transition: "all 0.2s" }}>
                    <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--warm-gray-700)" }}>{item.name}</div>
                    {item.description && <div style={{ fontSize: "0.75rem", color: "var(--warm-gray-400)", marginTop: 2 }}>{item.description}</div>}
                    <div style={{ display: "flex", gap: 4, marginTop: 6, flexWrap: "wrap" }}>
                      {item.dietaryTags.map((tag) => <span key={tag} className="badge badge-green" style={{ fontSize: "0.65rem" }}>{tag}</span>)}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {available.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--warm-gray-600)", display: "block", marginBottom: 10 }}>Available</span>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 8 }}>
                {available.map((item) => (
                  <button key={item._id} onClick={() => toggleItem(item as MenuItem)}
                    className={selectedItems.includes(item._id) ? "menu-item-selected" : "menu-item-available"}
                    style={{ padding: 12, borderRadius: "var(--radius-md)", cursor: "pointer", textAlign: "left", background: "white", transition: "all 0.2s" }}>
                    <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--warm-gray-700)" }}>{item.name}</div>
                    {item.description && <div style={{ fontSize: "0.75rem", color: "var(--warm-gray-400)", marginTop: 2 }}>{item.description}</div>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {discouraged.length > 0 && (
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                <AlertTriangle size={14} color="var(--warning)" />
                <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--warm-gray-500)" }}>Not recommended</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 8 }}>
                {discouraged.map((item) => (
                  <button key={item._id} onClick={() => toggleItem(item as MenuItem)}
                    className={selectedItems.includes(item._id) ? "menu-item-selected" : "menu-item-discouraged"}
                    style={{ padding: 12, borderRadius: "var(--radius-md)", cursor: "pointer", textAlign: "left", background: "white", transition: "all 0.2s" }}>
                    <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--warm-gray-500)" }}>{item.name}</div>
                    {item.description && <div style={{ fontSize: "0.75rem", color: "var(--warm-gray-400)", marginTop: 2 }}>{item.description}</div>}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div style={{ marginTop: 20 }}>
            <label className="label">Special Instructions</label>
            <textarea className="textarea-field" placeholder="e.g., less salt, no onion, extra curd..." value={specialInstructions} onChange={(e) => setSpecialInstructions(e.target.value)} rows={2} />
          </div>
        </div>
      )}

      {/* Step 3: Review */}
      {step === 3 && (
        <div className="card animate-slide-up" style={{ padding: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <Send size={20} color="var(--lavender)" />
            <h2 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--warm-gray-800)" }}>Review & Submit</h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { label: "Student", value: student?.name },
              { label: "Hostel / Room", value: `${student?.hostel || "–"} / ${student?.roomNumber || "–"}` },
              { label: "Illness", value: ILLNESS_TYPES.find((t) => t.value === illnessType)?.label },
              { label: "Severity", value: severity.charAt(0).toUpperCase() + severity.slice(1) },
              { label: "Delivery Slot", value: SLOT_OPTIONS.find((s) => s.value === deliverySlot)?.label },
              { label: "Prescription", value: prescriptionFile ? prescriptionFile.name : selfCertified ? "Self-certified" : "None" },
              { label: "Selected Items", value: selectedItemNames.join(", ") },
              ...(specialInstructions ? [{ label: "Special Instructions", value: specialInstructions }] : []),
              ...(ocrFlags.length > 0 ? [{ label: "Dietary Flags", value: ocrFlags.join(", ") }] : []),
            ].map((row) => (
              <div key={row.label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--warm-gray-100)" }}>
                <span style={{ fontSize: "0.85rem", color: "var(--warm-gray-500)" }}>{row.label}</span>
                <span style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--warm-gray-700)", textAlign: "right", maxWidth: "60%" }}>{row.value}</span>
              </div>
            ))}
          </div>

          {selfCertified && !prescriptionFile && (
            <div style={{ marginTop: 16, padding: 12, background: "var(--amber-light)", borderRadius: "var(--radius-md)", display: "flex", gap: 8, alignItems: "center" }}>
              <AlertTriangle size={16} color="#8b6a3a" />
              <span style={{ fontSize: "0.8rem", color: "#8b6a3a" }}>Self-certified orders require mandatory warden review.</span>
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20 }}>
        <button className="btn-secondary" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} style={{ opacity: step === 0 ? 0.4 : 1 }}>
          <ChevronLeft size={16} /> Back
        </button>
        {step < 3 ? (
          <button className="btn-primary" onClick={() => setStep(step + 1)} disabled={!canProceed[step]}>
            Next <ChevronRight size={16} />
          </button>
        ) : (
          <button className="btn-primary" onClick={handleSubmit} disabled={submitting}>
            {submitting ? <><Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> Submitting...</> : <><Send size={16} /> Submit Order</>}
          </button>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
