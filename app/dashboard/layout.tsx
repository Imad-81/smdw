"use client";

import { useUser, UserButton } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Leaf,
  LayoutDashboard,
  PlusCircle,
  ClipboardList,
  Settings,
  Shield,
  ChefHat,
  Users,
  Menu,
  X,
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoaded } = useUser();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const getOrCreate = useMutation(api.students.getOrCreateStudent);
  const student = useQuery(
    api.students.getByClerkId,
    user ? { clerkId: user.id } : "skip"
  );

  useEffect(() => {
    if (isLoaded && user) {
      getOrCreate({
        clerkId: user.id,
        name: user.fullName || user.firstName || "Student",
        email: user.primaryEmailAddress?.emailAddress || "",
      });
    }
  }, [isLoaded, user, getOrCreate]);

  if (!isLoaded || !user) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          background: "var(--cream)",
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            border: "3px solid var(--green-200)",
            borderTopColor: "var(--green-400)",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const role = student?.role || "student";

  const navItems = [
    {
      href: "/dashboard",
      icon: <LayoutDashboard size={18} />,
      label: "Dashboard",
      roles: ["student", "warden", "mess_staff", "admin"],
    },
    {
      href: "/dashboard/new-order",
      icon: <PlusCircle size={18} />,
      label: "New Order",
      roles: ["student"],
    },
    {
      href: "/dashboard/my-orders",
      icon: <ClipboardList size={18} />,
      label: "My Orders",
      roles: ["student"],
    },
    {
      href: "/dashboard/warden",
      icon: <Shield size={18} />,
      label: "Warden Panel",
      roles: ["warden", "admin"],
    },
    {
      href: "/dashboard/mess-staff",
      icon: <ChefHat size={18} />,
      label: "Mess Staff",
      roles: ["mess_staff", "admin"],
    },
    {
      href: "/dashboard/admin",
      icon: <Users size={18} />,
      label: "Admin",
      roles: ["admin"],
    },
    {
      href: "/dashboard/profile",
      icon: <Settings size={18} />,
      label: "Profile",
      roles: ["student", "warden", "mess_staff", "admin"],
    },
  ];

  const visibleNav = navItems.filter((item) => item.roles.includes(role));

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--cream)" }}>
      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        style={{
          position: "fixed",
          top: 16,
          left: 16,
          zIndex: 50,
          width: 40,
          height: 40,
          borderRadius: "var(--radius-md)",
          background: "white",
          border: "1px solid var(--warm-gray-200)",
          display: "none",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: "var(--shadow-md)",
        }}
        className="mobile-menu-btn"
      >
        {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.3)",
            zIndex: 30,
            display: "none",
          }}
          className="mobile-overlay"
        />
      )}

      {/* Sidebar */}
      <aside
        style={{
          width: 240,
          background: "white",
          borderRight: "1px solid var(--warm-gray-100)",
          padding: "20px 12px",
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          top: 0,
          left: sidebarOpen ? 0 : undefined,
          bottom: 0,
          zIndex: 40,
          transition: "transform 0.3s ease",
        }}
        className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}
      >
        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "4px 14px 20px",
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "var(--radius-sm)",
              background: "var(--green-100)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Leaf size={18} color="var(--green-600)" />
          </div>
          <span
            style={{
              fontSize: "1.1rem",
              fontWeight: 700,
              color: "var(--warm-gray-800)",
            }}
          >
            MealCare
          </span>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
          {visibleNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-link ${pathname === item.href ? "active" : ""}`}
              onClick={() => setSidebarOpen(false)}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        {/* User */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "12px 14px",
            borderTop: "1px solid var(--warm-gray-100)",
            marginTop: 8,
          }}
        >
          <UserButton />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: "0.85rem",
                fontWeight: 600,
                color: "var(--warm-gray-700)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {user.fullName || user.firstName}
            </div>
            <div
              style={{
                fontSize: "0.72rem",
                color: "var(--warm-gray-400)",
                textTransform: "capitalize",
              }}
            >
              {role.replace("_", " ")}
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main
        style={{
          flex: 1,
          marginLeft: 240,
          padding: "24px 32px",
          minHeight: "100vh",
          maxWidth: "calc(100vw - 240px)",
        }}
        className="main-content"
      >
        {children}
      </main>

      <style>{`
        @media (max-width: 768px) {
          .mobile-menu-btn { display: flex !important; }
          .mobile-overlay { display: block !important; }
          .sidebar { 
            transform: ${sidebarOpen ? "translateX(0)" : "translateX(-100%)"};
          }
          .main-content { 
            margin-left: 0 !important; 
            max-width: 100vw !important;
            padding: 24px 16px !important;
            padding-top: 64px !important;
          }
        }
      `}</style>
    </div>
  );
}
