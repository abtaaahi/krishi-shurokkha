
export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background font-sans">
      <main className="flex min-h-screen w-full flex-col items-center justify-center py-16 px-8 bg-white rounded-lg shadow-md">
        <div className="flex flex-col items-center gap-4 mt-8 text-center">
          <h1 className="text-3xl font-bold text-text">
            স্বাগতম to Krishi Shurokkha
          </h1>
          <p className="text-lg text-text/70 max-w-md">
            Bangladesh এর কৃষক এবং ফসল রক্ষা করার জন্য আমাদের টুল ব্যবহার করুন। শুরু করতে নিচের বাটনটি চাপুন।
          </p>
        </div>
      </main>
    </div>
  );
}
