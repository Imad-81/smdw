import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
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
      <SignUp
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
