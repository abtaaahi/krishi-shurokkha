export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FFF8E1] text-[#3E2723] flex items-center justify-center">
      {children}
    </div>
  );
}
