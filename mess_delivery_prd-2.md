# MealCare — Mess Food Delivery for Sick Students

**PRD v1.0 · Draft · Internal**  
**Last Updated:** May 2026  
**Prepared by:** Product Team

> Streamlining the manual, paper-based food delivery request process into a simple digital workflow for unwell students — from illness declaration to delivered meal, in under 3 minutes.

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement](#2-problem-statement)
3. [Goals & Success Metrics](#3-goals--success-metrics)
4. [Users & Roles](#4-users--roles)
5. [User Stories](#5-user-stories)
6. [User Flow — Student Journey](#6-user-flow--student-journey)
7. [Functional Requirements](#7-functional-requirements)
8. [Feature List & Priorities](#8-feature-list--priorities)
9. [Illness-to-Menu Mapping](#9-illness-to-menu-mapping)
10. [Non-Functional Requirements](#10-non-functional-requirements)
11. [Data Model](#11-data-model)
12. [Integrations](#12-integrations)
13. [Security & Privacy](#13-security--privacy)
14. [Risks & Mitigations](#14-risks--mitigations)
15. [Out of Scope (v1)](#15-out-of-scope-v1)
16. [Open Questions](#16-open-questions)
17. [Release Milestones](#17-release-milestones)
18. [Appendix](#18-appendix)

---

## 1. Executive Summary

MealCare is a web-based platform that replaces the current manual, form-heavy process for requesting sick meal delivery from the college mess. When a student falls ill, they should not have to navigate bureaucratic paperwork to get food. MealCare handles everything in one guided flow: identity verification, health declaration, prescription upload with OCR extraction, illness-aware meal selection, warden approval, and real-time delivery tracking.

The platform serves three user roles — sick students, wardens/admins, and mess staff — each with a purpose-built interface. The student-facing flow is optimised for someone lying in bed on their phone, targeting under 3 minutes end-to-end. The warden dashboard enables one-tap approve/reject with inline prescription preview. The mess staff view provides a clear, printable meal ticket queue.

---

## 2. Problem Statement

### Current State

When a student falls ill at college and needs in-room meal delivery from the mess, they must:

- Obtain a physical request form from the hostel office or warden
- Fill it out manually (name, roll number, room, illness, dietary needs)
- Submit it to the warden for approval — often requiring a physical visit or coordination via phone/WhatsApp
- Separately communicate any dietary restrictions to the mess
- Wait with no visibility on whether or when food is coming

### Pain Points by Role

**For students:**
- Filling forms is exhausting when unwell
- No way to specify dietary needs or illness-appropriate food
- No confirmation or tracking after submission
- Process assumes the student can physically move around

**For wardens / admins:**
- Requests arrive over WhatsApp, in-person, and via forms — no central view
- No standardised format makes review slow and error-prone
- No audit trail for flagging misuse
- Prescription verification is manual and ad-hoc

**For mess staff:**
- Handwritten or verbally communicated orders lead to errors
- No advance notice for special dietary requirements
- No way to batch or prioritise orders efficiently

### Impact

These friction points result in students skipping meals when sick (a welfare concern), dietary mismatch deliveries, duplicate or fraudulent requests, and administrative overload on wardens and mess supervisors.

---

## 3. Goals & Success Metrics

### Primary Goals

- Reduce time-to-submit a sick meal request to under 3 minutes
- Achieve over 90% first-try approval rate (complete, valid submissions)
- Eliminate dietary mismatch deliveries through illness-aware menus and OCR
- Give wardens a single dashboard with full audit trail
- Make mess staff workflow digital and printable

### Success Metrics

| Metric | Target | Measurement Method |
|---|---|---|
| Time to submit a request | < 3 min | Session analytics on form completion time |
| Orders approved first-try | > 90% | Approved / total orders ratio |
| Warden review SLA | < 15 min from submission | Timestamp delta: submitted → approved |
| Incorrect meal delivery rate | < 5% | Negative feedback flags + staff error reports |
| Student adoption rate | > 75% of eligible sick students in semester 1 | Active users / total students who visited health centre |
| Prescription re-upload rate | < 10% | OCR failure + manual correction events |

### Non-Goals

- MealCare is not a nutrition or diet management product for healthy students
- It does not replace the mess menu planning process
- It is not a general food ordering app open to all students at all times

---

## 4. Users & Roles

### 4.1 Sick Student (Primary User)

**Who they are:** Any enrolled student residing in college hostels who is unwell and unable to visit the dining hall.

**Context:** Likely in bed, possibly with fever or nausea, using a phone on hostel Wi-Fi. Wants the process to be as frictionless as possible. May not have a formal prescription if they haven't yet visited the health centre.

**Goals:**
- Submit a delivery request quickly without leaving the room
- Get food that suits their condition and dietary preferences
- Know when food is coming

**Pain points with current system:**
- Physical form, warden coordination, and no dietary personalisation

**Key permissions:** Submit and manage own orders; view own order history; upload prescriptions.

---

### 4.2 Warden / Admin

**Who they are:** Hostel wardens or designated student welfare officers responsible for approving meal delivery requests.

**Context:** Manages multiple students across a hostel block. Reviews requests on a laptop or tablet, typically during morning rounds and after dinner.

**Goals:**
- Quickly review and approve legitimate requests
- Flag or reject suspicious or incomplete submissions
- Have a full audit trail of who requested what and when

**Key permissions:** View all orders for assigned hostel; approve/reject/modify orders; view prescription documents; configure delivery windows; export reports.

---

### 4.3 Mess Staff / Supervisor

**Who they are:** Kitchen and delivery staff at the college mess responsible for preparing and dispatching sick meals.

**Context:** Works in a fast-paced kitchen environment. Needs clarity on what to prepare, any dietary restrictions, and where to deliver — without needing to interpret handwritten notes.

**Goals:**
- See a clean queue of approved orders with dietary flags clearly marked
- Mark orders as prepared and dispatched
- Print meal tickets if needed

**Key permissions:** View approved orders; update order status (prepared, dispatched, delivered); add internal kitchen notes; print meal tickets.

---

## 5. User Stories

### Student Stories

| ID | Story | Acceptance Criteria |
|---|---|---|
| US-01 | As a sick student, I want to log in with my college ID so I don't need to create a new account. | SSO login works; profile fields auto-populate from college directory. |
| US-02 | As a sick student, I want to describe my illness so the system can suggest appropriate food. | Illness type dropdown and optional free-text field present; selection updates menu filter. |
| US-03 | As a sick student, I want to upload my prescription so my request is verified without me having to visit anyone. | File upload accepts JPG/PNG/PDF up to 5 MB; OCR extracts dietary flags; manual override available. |
| US-04 | As a sick student, I want to see a menu filtered for my illness so I don't have to guess what I should eat. | Menu items tagged with illness suitability; unsuitable items greyed out with tooltip; recommended items highlighted. |
| US-05 | As a sick student, I want to choose a delivery time slot so I know when food is coming. | Breakfast/lunch/dinner slots shown with cut-off times; slot not available if cut-off passed. |
| US-06 | As a sick student, I want to track my order status in real time so I'm not left wondering. | Status tracker shows: Submitted → Verified → In Queue → Preparing → Dispatched → Delivered. |
| US-07 | As a sick student, I want to save a recurring order template for multi-day illness so I don't re-enter details daily. | "Save as template" option post-submission; templates accessible on next login. |
| US-08 | As a sick student, I want to cancel my order before it enters preparation so I'm not wasting mess resources. | Cancel button visible until status reaches "Preparing"; cancellation triggers notification to mess staff. |

### Warden / Admin Stories

| ID | Story | Acceptance Criteria |
|---|---|---|
| US-09 | As a warden, I want to see all pending orders in one view so I can process them efficiently. | Dashboard shows all pending orders grouped by status; filterable by hostel, slot, and dietary flag. |
| US-10 | As a warden, I want to preview the uploaded prescription inline so I don't have to open a separate tab. | Prescription image/PDF renders in a modal within the order card. |
| US-11 | As a warden, I want to approve or reject an order with one tap and optionally add a reason so the process is fast. | Approve/Reject buttons on order card; rejection requires a reason; student notified immediately. |
| US-12 | As an admin, I want to export order logs as CSV so I can report on usage and flag abuse patterns. | Export button on admin panel; CSV includes all fields excluding raw prescription files. |
| US-13 | As an admin, I want to configure the illness-to-menu mapping so the recommendations stay accurate. | Config panel to add/edit illness types and associated recommended/discouraged menu items. |

### Mess Staff Stories

| ID | Story | Acceptance Criteria |
|---|---|---|
| US-14 | As a mess staff member, I want to see approved orders with dietary flags clearly marked so I prepare the right meal. | Order card shows: student name, room, meal items, dietary restrictions, special notes, and delivery slot. |
| US-15 | As a mess staff member, I want to mark an order as dispatched so the student gets notified. | "Mark Dispatched" button on order card; triggers push/SMS notification to student with ETA. |
| US-16 | As a mess staff member, I want to print a meal ticket for each order so delivery staff have a physical reference. | Print button on each order generates a formatted, single-page PDF ticket. |

---

## 6. User Flow — Student Journey

### Step 1 — Identity & Room Verification
Student logs in via college ID / roll number using SSO. Profile fields — name, roll number, hostel, room number, meal plan status — are auto-filled from the college student directory. Student confirms or edits room details if they have temporarily shifted (e.g. staying in a friend's room). An alternate contact number can be added for the delivery.

### Step 2 — Health Declaration
Student selects their illness type from a predefined list:
- Fever / Flu
- Stomach infection / Nausea / Vomiting
- Throat infection / Cold
- Post-surgery / Post-procedure recovery
- Injury / Mobility restriction
- General weakness
- Other (free text, max 150 characters)

A severity level (Mild / Moderate / Severe) is also selected, which affects whether the order is auto-approved or flagged for mandatory warden review. An optional symptom description field is available. This health declaration is the primary driver of the smart menu filter in Step 4.

### Step 3 — Prescription Upload
Student uploads a photo or PDF of their doctor's prescription, campus health centre slip, or medical certificate. The system runs OCR to extract:
- Dietary restrictions mentioned (e.g. "avoid dairy", "bland food only", "no spicy food")
- Any specific food instructions from the doctor
- Date of the prescription (used for validity check)

Extracted flags are shown to the student for confirmation. A manual override field is always visible in case OCR misses or misreads content. If no prescription is available (e.g. student hasn't visited the health centre yet), they can self-certify using an acknowledgement checkbox — but self-certified orders are flagged as requiring mandatory warden review and cannot be auto-approved.

### Step 4 — Meal Selection
The mess menu is displayed with items filtered and ranked by suitability for the declared illness type and any dietary flags from the prescription. The menu is structured as:
- **Recommended** — clearly tagged, shown at top
- **Available** — not specifically recommended but not harmful
- **Not recommended** — greyed out with a tooltip explaining why (e.g. "Avoid fried food with fever"); student can override with an acknowledgement

Student selects their items and can:
- Add a special note to the mess (e.g. "less salt", "no onion/garlic", "extra curd")
- Choose their preferred delivery time slot (Breakfast 7–9 AM / Lunch 12–2 PM / Dinner 7–9 PM), subject to cut-off times
- See a summary of their selections before proceeding

### Step 5 — Request Submission
Student reviews a summary card showing all entered details: personal info, illness, prescription status, selected meal items, dietary flags, special notes, and delivery slot. On submission:
- An order ID is generated
- A confirmation notification is sent (in-app + email)
- The order enters the warden queue for review

If severity was marked as Mild and a valid prescription was uploaded, the system may auto-approve and route directly to mess staff queue (configurable by admin). Otherwise, manual warden review is required.

### Step 6 — Warden Approval
The warden receives a notification of a new pending order. In the dashboard, they can:
- View all order details and the prescription document inline
- Approve, modify (e.g. change a menu item), or reject with a mandatory reason
- Flag an order for follow-up without approving or rejecting

On approval, the order is pushed to the mess staff queue and the student receives a notification. On rejection, the student is notified with the warden's reason and given the option to resubmit with corrections.

### Step 7 — Delivery & Feedback
Once the mess staff marks an order as dispatched, the student receives a push/SMS notification with an estimated delivery time. After the order is marked as delivered:
- A short 3-question feedback form is shown to the student (rating, food suitability, any issues)
- The order is archived in the student's order history
- If the student submits feedback indicating a problem (wrong food, missing items, late delivery), the warden is notified for follow-up

Recurring orders: after any completed delivery, the student can save the order configuration as a named template (e.g. "Fever week") for one-tap reuse on subsequent days.

---

## 7. Functional Requirements

### 7.1 Authentication & Onboarding

- **FR-01:** The system must support SSO login using the college's existing identity provider (LDAP / OAuth2 / SAML). No separate account creation required.
- **FR-02:** On first login, student profile must be auto-populated from the college directory (name, roll number, hostel, room, active meal plan status).
- **FR-03:** Students must be able to update their room number and alternate contact on their profile at any time.
- **FR-04:** Session tokens must expire after 24 hours of inactivity. Re-authentication required for sensitive actions (prescription upload, order submission).

### 7.2 Order Submission

- **FR-05:** Students can have at most one active order per meal slot per day. A second submission for the same slot must show a warning and require cancellation of the existing order first.
- **FR-06:** All form steps must auto-save progress locally so a student can resume if they close the tab or lose connectivity.
- **FR-07:** The submission flow must be completable on a mobile browser in portrait orientation with one hand.
- **FR-08:** Each submitted order must receive a unique, human-readable order ID (e.g. MC-2026-04821).
- **FR-09:** Cut-off times for each meal slot must be configurable by admin and enforced server-side, not just client-side.

### 7.3 Prescription Upload & OCR

- **FR-10:** The upload component must accept JPG, PNG, and PDF files up to 5 MB.
- **FR-11:** Uploaded files must be scanned for malware before storage. Infected files must be rejected with a clear error.
- **FR-12:** OCR must attempt to extract: dietary restrictions, food-related instructions, and prescription date.
- **FR-13:** OCR-extracted flags must be presented to the student as editable chips before proceeding. Student can remove auto-extracted flags or add their own.
- **FR-14:** If the prescription date is older than the configurable validity window (default: 3 days), the system must warn the student and flag the order for warden review regardless of severity.
- **FR-15:** Self-certified orders (no prescription uploaded) must be visually distinguished in the warden dashboard with a "Self-certified" badge and cannot be auto-approved.

### 7.4 Illness-Aware Menu

- **FR-16:** Menu items must be taggable with: illness suitability (list of illness types for which this item is recommended), dietary categories (veg/non-veg/vegan/jain), allergens (gluten, dairy, nuts, eggs, soy), and spice level.
- **FR-17:** Menu shown during order submission must be dynamically filtered: recommended items sorted first, unsuitable items shown greyed with a tooltip, unavailable items hidden entirely.
- **FR-18:** A student who selects a "not recommended" item must acknowledge a warning before proceeding. This acknowledgement is logged on the order.
- **FR-19:** Menu items and illness mappings must be manageable by admin via a config panel without requiring a code deployment.

### 7.5 Warden Dashboard

- **FR-20:** Dashboard must show all orders for the warden's assigned hostel(s), grouped by status: Pending Review, Approved, Rejected, Delivered.
- **FR-21:** Each order card must display: student name, room, illness type, dietary flags, prescription status (uploaded / self-certified / OCR flags), meal items, delivery slot, and time since submission.
- **FR-22:** Prescription document must be previewable inline (image viewer or PDF renderer) without leaving the dashboard.
- **FR-23:** Approve and Reject actions must be available directly on the order card. Rejection requires a reason (free text, shown to student).
- **FR-24:** Warden must be able to edit meal items on an order before approving (e.g. swap an unsuitable item flagged by OCR).
- **FR-25:** Dashboard must support filtering by hostel block, meal slot, dietary flag, prescription status, and order date.
- **FR-26:** Admin must be able to export a filtered view as CSV. CSV must include all order metadata but not prescription file contents.

### 7.6 Mess Staff View

- **FR-27:** Mess staff view shows only Approved orders, sorted by delivery slot and submission time.
- **FR-28:** Each order card must prominently display dietary restriction flags and allergens in a colour-coded format.
- **FR-29:** Staff can update order status: Preparing → Dispatched → Delivered. Each status change must trigger the appropriate student notification.
- **FR-30:** A "Print Ticket" button on each order must generate a formatted single-page PDF with: order ID, student name, room number, meal items, dietary flags, special notes, and delivery slot.
- **FR-31:** Staff can add an internal kitchen note to an order (not visible to student or warden).

### 7.7 Notifications

- **FR-32:** Students must receive notifications at the following events: order confirmed, order approved, order rejected (with reason), meal dispatched (with ETA), meal delivered.
- **FR-33:** Notification channels: in-app (real-time), email, and SMS. Students can configure preferred channels in their profile.
- **FR-34:** Wardens must receive a notification when a new order enters their queue. A configurable digest option (e.g. one summary every 30 minutes) must be available.
- **FR-35:** If an order has been pending warden review for more than 15 minutes, an escalation notification must be sent to the warden and, optionally, a backup approver.

### 7.8 Recurring Order Templates

- **FR-36:** After a successful delivery, the student must be offered the option to save the order as a named template.
- **FR-37:** Templates store: illness type, meal items, dietary preferences, and special notes. They do not store the prescription document.
- **FR-38:** When using a template to resubmit, the student must still upload a fresh prescription (or self-certify). The template pre-fills all other fields.
- **FR-39:** Students can manage (rename, edit, delete) their saved templates from their profile.

---

## 8. Feature List & Priorities

| Feature | Description | Priority | Notes |
|---|---|---|---|
| Student auth via college ID | SSO with existing college portal; no new account creation | P1 | Requires SSO API access from IT |
| Prescription upload + OCR | Photo or PDF upload; auto-extract dietary flags from text | P1 | OCR accuracy target: >85% |
| Smart menu filter | Menu items filtered by illness type and parsed prescription | P1 | Needs initial illness-menu mapping from mess dietitian |
| Delivery time slot selection | Breakfast / lunch / dinner windows with cut-off times | P1 | Cut-off times configurable by admin |
| Warden approval dashboard | Queue with one-tap approve/reject; prescription preview inline | P1 | Must work on tablet |
| Real-time order status tracker | Step-by-step status visible to student post-submission | P1 | |
| Push + SMS notifications | Approval, dispatch, and ETA alerts to student's phone | P2 | SMS gateway integration required |
| Recurring order templates | Save a past order and reuse for multi-day illness | P2 | |
| Admin analytics dashboard | Volume, peak times, dietary breakdown, rejection rates | P2 | |
| Printable meal ticket (PDF) | One-click PDF ticket for mess delivery staff | P2 | |
| Prescription validity check | Warn if prescription date exceeds validity window | P2 | Validity window configurable |
| Escalation alerts for warden | Notify warden + backup if order pending > 15 min | P2 | |
| Multilingual support | Hindi + English at minimum | P3 | |
| PWA / offline support | Works on low-connectivity hostel networks | P3 | Form auto-saves locally |
| CSV export for admins | Export order logs with filters applied | P3 | |
| Feedback collection | Post-delivery 3-question form for students | P3 | Feeds analytics dashboard |

**P1** = must-have for launch  
**P2** = launch + 1 sprint (target: within 4 weeks of launch)  
**P3** = future roadmap

---

## 9. Illness-to-Menu Mapping

This mapping is the seed data for the smart menu filter. It must be editable by admins via the configuration panel without a code deployment. Initial values are informed by general dietary guidelines for common illnesses; the college dietitian or mess supervisor should review and adjust before launch.

| Illness Type | Recommended Foods | Discouraged Foods |
|---|---|---|
| Fever / Flu | Khichdi, plain dal, soft rice, clear vegetable soup, banana, warm milk, curd | Fried food (pakoda, puri), spicy curries, heavy desserts (halwa, gulab jamun), raw salads |
| Stomach infection / Nausea | Plain rice, curd rice, banana, plain toast, ORS, boiled potato | Dairy except curd (milk, paneer), oily/fatty food, raw vegetables, legumes, spicy food |
| Throat infection / Cold | Warm clear soup, soft khichdi, warm milk with turmeric, honey, steamed rice | Cold items (cold milk, ice cream, cold beverages), hard/crunchy food (roti without ghee), spicy food |
| Post-surgery / Recovery | High-protein dal, eggs (if non-veg), soft paneer, fruits (banana, apple), soft rice, boiled vegetables | Deep fried food, heavily spiced items, food requiring hard chewing |
| Injury / Mobility restriction | Balanced standard meal with reduced spice; easy-to-eat items preferred | No specific restrictions; spice tolerance noted from preferences |
| General weakness | Light khichdi, dal, fruit, warm milk, curd | Heavy or oily items |

### Notes on Mapping Implementation

- Each menu item in the database carries a `recommended_for[]` and `discouraged_for[]` array indexed to illness type IDs.
- A menu item can be recommended for one illness and discouraged for another (e.g. cold curd is recommended for stomach issues but discouraged for throat infections).
- The admin config panel must show a matrix view of items vs illness types for easy editing.

---

## 10. Non-Functional Requirements

### Performance

- Page load (initial): under 2 seconds on a 4G connection (tested at 10 Mbps)
- Form step transition: under 300 ms
- Order submission (server response): under 3 seconds end-to-end
- OCR processing: under 10 seconds; user sees a loading state and can proceed to next step while processing continues in background
- Dashboard load for warden with 50 pending orders: under 2 seconds

### Availability

- Target uptime: 99.5% monthly
- Scheduled maintenance only during 2–4 AM (low activity window)
- The student submission flow must degrade gracefully: if the OCR service is down, the manual input path must still work

### Security

- All data encrypted in transit (TLS 1.3)
- All data encrypted at rest (AES-256)
- Prescription files stored in a private S3-equivalent bucket with signed URL access (URLs expire after 1 hour)
- Role-based access control: students cannot access other students' data; mess staff cannot view prescriptions; wardens can only view their assigned hostels
- Rate limiting on order submission: max 3 submissions per student per hour (prevents rapid abuse)
- File upload malware scanning before storage (ClamAV or equivalent)

### Privacy

- Student health information (illness type, prescription content) must not appear in any external-facing analytics or logs
- Prescription documents must be auto-deleted 30 days after the order is delivered
- Students must be able to request deletion of their data via their profile settings
- Data handling must comply with the college's data protection policy and applicable Indian privacy norms (DPDP Act 2023)

### Accessibility

- WCAG 2.1 AA compliant
- All interactive elements must be reachable via keyboard
- Colour contrast ratio minimum 4.5:1
- Tap targets minimum 44×44px on mobile
- Error messages must be descriptive and not rely on colour alone

### Scalability

- System must support up to 500 concurrent active users
- Must handle peak load during exam seasons and monsoon (estimated 3× normal request volume)
- Database must support efficient querying on order status + hostel + date (indexed fields)

### Browser & Device Support

- Chrome, Firefox, Safari — last 2 major versions
- Mobile: iOS Safari 16+, Android Chrome 110+
- Minimum viewport: 375px wide (iPhone SE)
- No native app required for v1; responsive web is sufficient

---

## 11. Data Model

### Student

| Field | Type | Notes |
|---|---|---|
| `student_id` | UUID | Primary key |
| `college_roll_number` | String | From SSO; unique |
| `name` | String | |
| `email` | String | College email |
| `phone` | String | |
| `hostel` | String | |
| `room_number` | String | Editable |
| `dietary_preference` | Enum | Veg / Non-Veg / Vegan / Jain |
| `known_allergies` | String[] | Multi-select |
| `created_at` | Timestamp | |

### Order

| Field | Type | Notes |
|---|---|---|
| `order_id` | String | e.g. MC-2026-04821 |
| `student_id` | UUID | FK → Student |
| `created_at` | Timestamp | |
| `delivery_slot` | Enum | Breakfast / Lunch / Dinner |
| `illness_type` | Enum | From predefined list |
| `illness_severity` | Enum | Mild / Moderate / Severe |
| `illness_notes` | String | Optional free text |
| `selected_items` | UUID[] | FK → MenuItem |
| `special_instructions` | String | Note to mess |
| `prescription_url` | String | Signed URL; nullable |
| `prescription_status` | Enum | Pending / Verified / Flagged / Self-Certified |
| `ocr_flags` | String[] | Extracted dietary flags |
| `student_acknowledged_override` | Boolean | True if student selected discouraged items |
| `order_status` | Enum | Submitted / Pending Review / Approved / Rejected / Preparing / Dispatched / Delivered / Cancelled |
| `status_history` | JSON[] | Array of {status, timestamp, actor} |
| `warden_notes` | String | Internal; not shown to student |
| `rejection_reason` | String | Shown to student on rejection |
| `kitchen_notes` | String | Internal mess staff notes |

### MenuItem

| Field | Type | Notes |
|---|---|---|
| `item_id` | UUID | Primary key |
| `name` | String | |
| `description` | String | |
| `dietary_tags` | Enum[] | Veg / Non-Veg / Vegan / Jain |
| `allergens` | Enum[] | Gluten / Dairy / Nuts / Eggs / Soy |
| `spice_level` | Enum | None / Low / Medium / High |
| `recommended_for` | Enum[] | List of illness types |
| `discouraged_for` | Enum[] | List of illness types |
| `available_for_sick_delivery` | Boolean | Admin-controlled |
| `meal_slot` | Enum[] | Which slots this item is offered |

### OrderTemplate

| Field | Type | Notes |
|---|---|---|
| `template_id` | UUID | Primary key |
| `student_id` | UUID | FK → Student |
| `name` | String | Student-defined label |
| `illness_type` | Enum | |
| `selected_items` | UUID[] | |
| `special_instructions` | String | |
| `created_at` | Timestamp | |

---

## 12. Integrations

| System | Integration Type | Purpose | Owner |
|---|---|---|---|
| College SSO / LDAP | OAuth2 / SAML | Student authentication and profile auto-fill | College IT |
| College Student Directory | REST API or DB read | Room number, hostel, meal plan status | College IT |
| Email Gateway (e.g. SendGrid) | SMTP / API | Order status email notifications | Platform team |
| SMS Gateway (e.g. Twilio / MSG91) | REST API | Order status SMS alerts | Platform team |
| Secure File Storage (S3-compatible) | SDK | Prescription document storage with signed URLs | Platform team |
| OCR Service (e.g. Google Vision / Tesseract) | REST API | Extract dietary flags from prescription images | Platform team |
| Malware Scanner (ClamAV) | CLI / API | Scan uploaded files before storage | Platform team |
| Mess ERP (if available) | Optional REST API | Menu sync; marks items as available or unavailable | Mess supervisor |

---

## 13. Security & Privacy

### Access Control Matrix

| Action | Student (own) | Student (others) | Mess Staff | Warden | Admin |
|---|---|---|---|---|---|
| Submit order | ✅ | ❌ | ❌ | ❌ | ❌ |
| View own orders | ✅ | ❌ | ❌ | ❌ | ✅ |
| View all hostel orders | ❌ | ❌ | ❌ | ✅ | ✅ |
| View prescription | ❌ | ❌ | ❌ | ✅ | ✅ |
| Approve / reject order | ❌ | ❌ | ❌ | ✅ | ✅ |
| Update order status | ❌ | ❌ | ✅ | ❌ | ✅ |
| Edit menu / mapping config | ❌ | ❌ | ❌ | ❌ | ✅ |
| Export CSV | ❌ | ❌ | ❌ | ✅ (own hostel) | ✅ |

### Prescription Data Handling

Prescription documents are sensitive medical records. The following rules apply:

- Files stored in a private bucket; never publicly accessible
- Access via signed URLs with 1-hour expiry
- Only warden and admin roles can request a signed URL
- Audit log maintained for every prescription access event (who, when, which order)
- Auto-deletion 30 days after order delivery
- No prescription content or OCR text included in any analytics data or CSV exports

### Security Checklist for Launch

- [ ] Penetration test on file upload endpoint
- [ ] Rate limiting on all authenticated endpoints
- [ ] SQL injection and XSS protection verified
- [ ] Signed URL expiry verified in staging
- [ ] Role escalation attack tested (student attempting warden actions)
- [ ] HTTPS enforced; no HTTP fallback

---

## 14. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| **Prescription fraud** — Students submit fake, recycled, or borrowed prescriptions | Medium | High | Warden manual review is always the final gate; timestamp on prescription checked against order date; configurable validity window (default 3 days) |
| **OCR misread** — Allergy or restriction missed from prescription text | High | High | Manual override field always visible and editable; warden independently reviews dietary flags before approving; OCR output shown as editable chips, not silent auto-apply |
| **Hostel network outages** — Students can't submit during connectivity drops | Medium | Medium | Form auto-saves progress locally (localStorage); PWA caching allows offline form filling with submission queued for when connectivity returns |
| **Mess staff adoption** — Kitchen staff unfamiliar with digital tools | High | Medium | Printable meal ticket as a physical fallback; simple, icon-heavy UI on mess staff view; training session pre-launch; warden can print tickets on staff's behalf |
| **Over-ordering / abuse** — Students ordering when not genuinely sick | Low | Medium | Warden approval gate; limit of 1 active order per student per meal slot per day; admin can flag and suspend repeat abusers; order history visible to wardens |
| **Cut-off time confusion** — Students miss the slot and are frustrated | Medium | Low | Cut-off times prominently displayed on slot selection; slot greys out and shows "Closed" once cut-off passes; notification sent 30 minutes before cut-off if student has an in-progress draft |
| **Warden bottleneck** — Single warden overwhelmed during peak illness periods | Medium | High | Configurable backup approver; escalation alert after 15 minutes; auto-approval path for mild severity + valid prescription (admin-configurable) |
| **SSO dependency** — College SSO is down; students can't log in | Low | High | Fallback: email + OTP login using college email as identity; raises IT dependency risk — must be discussed with college IT team pre-launch |

---

## 15. Out of Scope (v1)

- **Payment integration** — All sick meals are charged to the student's existing mess account under college welfare policy. No payment gateway required.
- **Real-time GPS delivery tracking** — Delivery status is updated manually by mess staff ("Dispatched", "Delivered"). Live map tracking is not in scope.
- **Integration with college clinic database** — Prescription validation is manual (warden review) in v1. Automated validation against the health centre's patient records is a future consideration.
- **Multi-mess / multi-hostel support** — v1 targets a single mess unit. Multi-campus or multi-block routing is deferred.
- **Native mobile app** — v1 is a responsive web app. A React Native or Flutter app may be considered for v2 based on adoption data.
- **Dietary nutrition tracking** — MealCare recommends illness-appropriate food but does not calculate calories, macros, or track long-term nutrition.
- **Student-to-student proxy ordering** — A student ordering on behalf of another student (e.g. a roommate) is not supported in v1 due to verification complexity.

---

## 16. Open Questions

| # | Question | Why It Matters | Owner | Priority |
|---|---|---|---|---|
| OQ-01 | Who is the authoritative approver — warden, doctor, or mess manager? | Determines the approval workflow and notification routing | Admin / Principal | High |
| OQ-02 | What is the SLA for delivery after warden approval — fixed window or per-meal-slot? | Affects ETA shown to students and staffing planning | Mess Supervisor | High |
| OQ-03 | How long does a prescription remain valid for recurring orders — 1 day, 3 days, 1 week? | Drives the OCR validity check and re-upload prompt logic | Warden / Medical | High |
| OQ-04 | Is the college SSO API accessible for integration, or do we need to build standalone auth? | Determines auth architecture and onboarding effort | College IT | High |
| OQ-05 | Can the mess prepare custom sick meals, or is it a fixed subset of the standard menu? | Determines whether the menu is a filtered standard menu or a separate sick-meal menu | Mess Supervisor | High |
| OQ-06 | Should self-certified orders (no prescription) be allowed at all, or always require a document? | Affects rejection rates and student experience during off-hours | Warden / Admin | Medium |
| OQ-07 | Is there a cap on how many days per semester a student can use the delivery service? | Abuse prevention; affects limit enforcement logic | Admin | Medium |
| OQ-08 | Should wardens receive individual order notifications or a batched digest? | Affects notification design and warden preference settings | Warden | Medium |
| OQ-09 | Will mess staff have devices (tablets/phones) to use the digital queue, or do they need printed tickets only? | Determines whether the mess staff view needs to be a primary interface or a backup | Mess Supervisor | Low |

---

## 17. Release Milestones

### Milestone 1 — Alpha (Week 4)
Core submission flow end-to-end. Basic warden dashboard. No smart menu filtering or OCR.

**Includes:**
- SSO login + profile auto-fill
- Order submission flow (all 7 steps) with manual dietary input
- Basic warden dashboard: view orders, approve/reject
- Order status tracker for students
- Email notifications (confirmation + approval/rejection)

**Success criteria:** 10 test users complete a submission in under 5 minutes; warden approves/rejects without errors.

---

### Milestone 2 — Beta (Week 8)
Illness-aware intelligence layer + prescription OCR + SMS notifications.

**Includes:**
- OCR integration for prescription upload
- Illness-to-menu mapping + smart filter on meal selection
- Prescription validity check + self-certification flow
- SMS notifications via gateway
- Warden escalation alerts (> 15 min pending)
- Mess staff view with printable tickets

**Success criteria:** OCR extracts dietary flags with >80% accuracy on test set of 20 prescriptions; smart menu filter correctly ranks items for all 6 illness types.

---

### Milestone 3 — Launch (Week 12)
Production-ready. Full security hardening. Admin panel. Recurring templates.

**Includes:**
- Admin configuration panel (illness mapping, menu, cut-offs, approval policy)
- Recurring order templates
- Full security audit + penetration test
- WCAG 2.1 AA accessibility audit
- PWA + offline form caching
- CSV export for admins
- Load testing to 500 concurrent users

**Success criteria:** Load test passes; security audit clear; WCAG audit passes; end-to-end submission under 3 minutes on mid-range Android device on hostel Wi-Fi.

---

### Milestone 4 — Post-Launch (Week 16+)
Analytics, multilingual support, v2 planning.

**Includes:**
- Admin analytics dashboard (volume trends, peak times, dietary breakdown, rejection rates)
- Feedback collection + aggregation
- Hindi language support
- v2 scoping: native app, GPS tracking, clinic integration

---

## 18. Appendix

### A. Notification Templates

**Order Confirmed (student):**
> "Hi [Name], your meal request #[ID] for [Slot] has been received. We'll let you know once it's approved. Feel better soon 🍲"

**Order Approved (student):**
> "Your meal request #[ID] has been approved! The mess will start preparing it for your [Slot] delivery."

**Order Rejected (student):**
> "Your request #[ID] was not approved. Reason: [Warden reason]. Please resubmit or contact your warden for help."

**Meal Dispatched (student):**
> "Your meal is on the way to [Room Number]! Expected in about [X] minutes."

**New Order Pending (warden):**
> "New sick meal request from [Name], Room [X]. Please review: [dashboard link]"

**Escalation (warden):**
> "Reminder: Order #[ID] from [Name] has been pending review for 15 minutes. Please action it."

---

### B. File Upload Specifications

- Accepted formats: JPG, PNG, PDF
- Maximum file size: 5 MB per file, 1 file per order
- Minimum recommended image quality: 300 DPI for photos of prescriptions
- Rejected file types: .exe, .zip, .doc, .docx, and all non-image/PDF formats
- Storage retention: 30 days post-delivery, then auto-deleted

---

### C. Sample Illness-to-Meal Mapping (Seed Data)

| Illness | Breakfast | Lunch | Dinner |
|---|---|---|---|
| Fever / Flu | Upma, banana, warm milk | Khichdi, dal, curd | Soft rice, dal, warm soup |
| Stomach issues | Toast, banana, curd | Plain rice, curd rice | Khichdi, toast |
| Throat infection | Warm porridge, honey-milk | Warm soup, soft roti, dal | Khichdi, warm soup |
| Recovery / Injury | Eggs or paneer, toast, juice | Dal, rice, steamed sabzi | Protein dal, rice, soft salad |
| General weakness | Light upma, fruit, warm milk | Khichdi, dal, curd | Dal rice, fruit |

---

### D. Glossary

| Term | Definition |
|---|---|
| OCR | Optical Character Recognition — automated text extraction from uploaded prescription images |
| SSO | Single Sign-On — authentication using existing college credentials |
| Meal slot | One of three daily delivery windows: Breakfast (7–9 AM), Lunch (12–2 PM), Dinner (7–9 PM) |
| Self-certification | A student submitting an order without a prescription, using an acknowledgement checkbox |
| Signed URL | A time-limited secure URL for accessing a private file; expires after 1 hour |
| P1 / P2 / P3 | Feature priority tiers: must-have / near-term / future roadmap |
| Sick meal | A meal prepared by the mess specifically for a student on medical grounds, eligible for room delivery |

---

*End of Document — MealCare PRD v1.0*
