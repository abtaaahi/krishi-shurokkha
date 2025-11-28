export default function SolutionMetaphor() {
  const steps = [
    { icon: "📊", label: "ডেটা সংগ্রহ" },
    { icon: "⚠️", label: "সতর্কবার্তা" },
    { icon: "🛠️", label: "কর্তব্য/কার্যক্রম" },
    { icon: "🍚", label: "সংরক্ষিত খাদ্য" },
  ];

  return (
    <section className="px-6 py-16 bg-green-50 rounded-2xl mx-4 md:mx-16 mt-12">
      <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center text-green-900">
        কৃষি সুরক্ষা কিভাবে কাজ করে
      </h2>

      <div className="flex flex-col md:flex-row justify-between items-center md:space-x-6 space-y-8 md:space-y-0">
        {steps.map((step, idx) => (
          <div key={idx} className="flex flex-col items-center text-center relative">
            {/* Icon Circle */}
            <div className="text-5xl mb-3">{step.icon}</div>
            <span className="font-semibold text-gray-800">{step.label}</span>

            {/* Connector line for desktop */}
            {idx < steps.length - 1 && (
              <div className="hidden md:block absolute top-1/2 right-[-50%] w-full border-t-2 border-green-400 z-0"></div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <button className="bg-green-600 text-white px-8 py-3 rounded-xl shadow-lg hover:bg-green-700 transition duration-300 font-medium">
          এখন রেজিস্টার করুন
        </button>
      </div>
    </section>
  );
}
