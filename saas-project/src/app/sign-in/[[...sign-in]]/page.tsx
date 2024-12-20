import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted">
      <div className="w-full max-w-md mx-4">
        <div className="bg-card text-card-foreground p-6 md:p-8 rounded-lg shadow-sm border border-border">
          <SignUp />
        </div>
      </div>
    </div>
  );
}