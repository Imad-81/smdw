import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "var(--cream)",
        padding: 24,
      }}
    >
      <SignIn
        appearance={{
          elements: {
            rootBox: {
              width: "100%",
              maxWidth: 440,
            },
          },
        }}
      />
    </div>
  );
}
