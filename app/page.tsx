"use client";

import { useUser, SignInButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  Heart,
  UtensilsCrossed,
  Clock,
  Shield,
  ChevronRight,
  Leaf,
  CheckCircle2,
} from "lucide-react";
import { useEffect } from "react";

export default function LandingPage() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push("/dashboard");
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded) {
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

  return (
    <div style={{ background: "var(--cream)", minHeight: "100vh" }}>
      {/* Navbar */}
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 32px",
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "var(--radius-md)",
              background: "var(--green-100)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Leaf size={20} color="var(--green-600)" />
          </div>
          <span
            style={{
              fontSize: "1.2rem",
              fontWeight: 700,
              color: "var(--warm-gray-800)",
              letterSpacing: "-0.02em",
            }}
          >
            MealCare
          </span>
        </div>

        <SignInButton mode="modal">
          <button className="btn-primary">
            Get Started <ChevronRight size={16} />
          </button>
        </SignInButton>
      </nav>

      {/* Hero */}
      <section
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "80px 32px 60px",
          textAlign: "center",
        }}
        className="animate-fade-in"
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: "var(--green-50)",
            border: "1px solid var(--green-200)",
            borderRadius: "var(--radius-full)",
            padding: "6px 14px",
            fontSize: "0.8rem",
            color: "var(--green-700)",
            fontWeight: 500,
            marginBottom: 24,
          }}
        >
          <Heart size={14} />
          Care when you need it most
        </div>

        <h1
          style={{
            fontSize: "clamp(2.2rem, 5vw, 3.5rem)",
            fontWeight: 700,
            color: "var(--warm-gray-800)",
            lineHeight: 1.15,
            maxWidth: 700,
            margin: "0 auto 20px",
            letterSpacing: "-0.03em",
          }}
        >
          Sick meal delivery,{" "}
          <span style={{ color: "var(--green-500)" }}>simplified</span>
        </h1>

        <p
          style={{
            fontSize: "1.1rem",
            color: "var(--warm-gray-500)",
            maxWidth: 540,
            margin: "0 auto 36px",
            lineHeight: 1.6,
          }}
        >
          When you're unwell, getting food shouldn't be hard. MealCare lets you
          request illness-appropriate meals from your college mess and get them
          delivered to your room.
        </p>

        <div
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <SignInButton mode="modal">
            <button
              className="btn-primary"
              style={{ padding: "14px 32px", fontSize: "1rem" }}
            >
              Request a Meal <ChevronRight size={18} />
            </button>
          </SignInButton>
          <a
            href="#features"
            className="btn-secondary"
            style={{
              padding: "14px 32px",
              fontSize: "1rem",
              textDecoration: "none",
            }}
          >
            Learn More
          </a>
        </div>
      </section>

      {/* Stats */}
      <section
        style={{
          maxWidth: 800,
          margin: "0 auto",
          padding: "0 32px 60px",
          display: "flex",
          justifyContent: "center",
          gap: 48,
          flexWrap: "wrap",
        }}
      >
        {[
          { value: "< 3 min", label: "To submit a request" },
          { value: "90%+", label: "First-try approval rate" },
          { value: "24/7", label: "Digital access" },
        ].map((stat) => (
          <div key={stat.label} style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: "1.8rem",
                fontWeight: 700,
                color: "var(--green-500)",
              }}
            >
              {stat.value}
            </div>
            <div
              style={{
                fontSize: "0.85rem",
                color: "var(--warm-gray-400)",
                marginTop: 4,
              }}
            >
              {stat.label}
            </div>
          </div>
        ))}
      </section>

      {/* Features */}
      <section
        id="features"
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "40px 32px 80px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2
            style={{
              fontSize: "1.8rem",
              fontWeight: 700,
              color: "var(--warm-gray-800)",
              marginBottom: 12,
            }}
          >
            How it works
          </h2>
          <p style={{ color: "var(--warm-gray-400)", fontSize: "1rem" }}>
            Three simple steps to get food delivered to your room
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 24,
          }}
        >
          {[
            {
              icon: <Heart size={24} />,
              title: "Declare your illness",
              desc: "Tell us what's wrong and upload your prescription. Our AI extracts dietary restrictions automatically.",
              color: "var(--rose-light)",
              iconColor: "#8b3a5a",
            },
            {
              icon: <UtensilsCrossed size={24} />,
              title: "Choose your meal",
              desc: "See a smart menu filtered for your condition. Recommended items shown first, unsuitable ones flagged.",
              color: "var(--green-50)",
              iconColor: "var(--green-600)",
            },
            {
              icon: <Clock size={24} />,
              title: "Track & receive",
              desc: "Get real-time status updates from submission to delivery. Know exactly when your meal is coming.",
              color: "var(--sky-light)",
              iconColor: "#3a5a8b",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="card"
              style={{ padding: 28 }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "var(--radius-md)",
                  background: feature.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: feature.iconColor,
                  marginBottom: 16,
                }}
              >
                {feature.icon}
              </div>
              <h3
                style={{
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  color: "var(--warm-gray-800)",
                  marginBottom: 8,
                }}
              >
                {feature.title}
              </h3>
              <p
                style={{
                  fontSize: "0.9rem",
                  color: "var(--warm-gray-500)",
                  lineHeight: 1.6,
                }}
              >
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section
        style={{
          background: "var(--green-50)",
          padding: "60px 32px",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 40,
              alignItems: "center",
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: "1.8rem",
                  fontWeight: 700,
                  color: "var(--warm-gray-800)",
                  marginBottom: 16,
                  lineHeight: 1.3,
                }}
              >
                Built for when you
                <br />
                can't leave your room
              </h2>
              <p
                style={{
                  fontSize: "0.95rem",
                  color: "var(--warm-gray-500)",
                  lineHeight: 1.7,
                  marginBottom: 24,
                }}
              >
                MealCare understands that sick students need a frictionless
                experience. Every feature is designed for one-handed phone use
                while lying in bed.
              </p>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                {[
                  "AI-powered prescription analysis",
                  "Illness-aware smart menu",
                  "Real-time order tracking",
                  "One-tap warden approval",
                  "Dietary restriction flags",
                ].map((benefit) => (
                  <div
                    key={benefit}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <CheckCircle2
                      size={18}
                      color="var(--green-500)"
                    />
                    <span
                      style={{
                        fontSize: "0.9rem",
                        color: "var(--warm-gray-700)",
                      }}
                    >
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
              }}
            >
              {[
                {
                  icon: <Shield size={22} />,
                  title: "Secure & Private",
                  desc: "Prescriptions encrypted, auto-deleted after 30 days",
                  bg: "var(--lavender-light)",
                  color: "#5a3a8b",
                },
                {
                  icon: <UtensilsCrossed size={22} />,
                  title: "Smart Menu",
                  desc: "Meals filtered for your specific condition",
                  bg: "var(--green-100)",
                  color: "var(--green-700)",
                },
                {
                  icon: <Clock size={22} />,
                  title: "Fast Delivery",
                  desc: "Submit in under 3 minutes, delivered on schedule",
                  bg: "var(--peach-light)",
                  color: "#8b5a3a",
                },
                {
                  icon: <Heart size={22} />,
                  title: "Wellness First",
                  desc: "Designed with care for when you need it most",
                  bg: "var(--rose-light)",
                  color: "#8b3a5a",
                },
              ].map((card) => (
                <div
                  key={card.title}
                  className="card"
                  style={{ padding: 20 }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "var(--radius-sm)",
                      background: card.bg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: card.color,
                      marginBottom: 12,
                    }}
                  >
                    {card.icon}
                  </div>
                  <h4
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      color: "var(--warm-gray-800)",
                      marginBottom: 4,
                    }}
                  >
                    {card.title}
                  </h4>
                  <p
                    style={{
                      fontSize: "0.78rem",
                      color: "var(--warm-gray-400)",
                      lineHeight: 1.5,
                    }}
                  >
                    {card.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          padding: "32px",
          textAlign: "center",
          color: "var(--warm-gray-400)",
          fontSize: "0.8rem",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            marginBottom: 8,
          }}
        >
          <Leaf size={16} color="var(--green-400)" />
          <span style={{ fontWeight: 600, color: "var(--warm-gray-600)" }}>
            MealCare
          </span>
        </div>
        <p>
          Made with care for student welfare · © {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}
