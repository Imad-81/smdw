"use client";

import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";
import { ReactNode } from "react";

const convex = new ConvexReactClient(
  process.env.NEXT_PUBLIC_CONVEX_URL as string
);

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider
      afterSignOutUrl="/"
      appearance={{
        variables: {
          colorPrimary: "#7BC89C",
          colorTextOnPrimaryBackground: "#ffffff",
          borderRadius: "0.75rem",
          fontFamily: "'DM Sans', sans-serif",
        },
        elements: {
          formButtonPrimary: {
            backgroundColor: "#7BC89C",
            "&:hover": {
              backgroundColor: "#5fb882",
            },
          },
          card: {
            borderRadius: "1rem",
            boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
          },
        },
      }}
    >
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
