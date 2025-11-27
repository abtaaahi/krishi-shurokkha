"use client";



export default function HeroSection() {
  return (
    <section className="bg-gradient-to-b from-green-100 to-green-50 flex flex-col items-center justify-center text-center px-6 py-20 md:py-32">
      
      {/* Illustration */}
      <div className="w-44 h-44 mb-8 relative">
        <img
          src="https://file-rajshahi.portal.gov.bd/uploads/04c091f2-47bc-48c5-8954-7c555ecff297//668/516/6af/6685166af3e9e647218543.jpg"
          alt="কৃষক ইলাস্ট্রেশন"
          
          className="object-contain"
        />
      </div>

      {/* Main Title */}
      <h1 className="text-3xl md:text-5xl font-extrabold text-green-900 leading-tight">
        কৃষি সুরক্ষা
      </h1>

      {/* Subtitle */}
      <p className="mt-4 md:mt-6 text-gray-800 text-base md:text-lg max-w-2xl">
        বাংলাদেশে কৃষকদের ফসল নষ্ট কমাতে স্মার্ট সমাধান। আগেভাগেই সতর্ক করে সঞ্চয় নিশ্চিত করুন।
      </p>

      {/* CTA Buttons */}
      <div className="mt-8 flex flex-col md:flex-row gap-4">
        <button className="bg-green-600 text-white px-8 py-3 rounded-xl shadow-lg hover:bg-green-700 transition duration-300 font-medium">
          এখন শুরু করুন
        </button>
        <button className="bg-white border border-green-600 text-green-700 px-8 py-3 rounded-xl shadow hover:bg-green-50 transition duration-300 font-medium">
          আরও জানুন
        </button>
      </div>
    </section>
  );
}
