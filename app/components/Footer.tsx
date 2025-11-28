import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#FFF8E1] text-[#3E2723] py-8 mt-10 border-t-2 border-[#4CAF50]">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: Project Name */}
        <div className="text-center md:text-left">
          <h2 className="text-lg font-semibold text-[#4CAF50]">কৃষি সুরক্ষা</h2>
          <p className="text-sm">Developed by ERROR 404! EDU HackFest Team</p>
        </div>

        {/* Right: GitHub Link */}
        <div className="text-center md:text-right">
          <p className="text-sm">
            <Link
              href="https://github.com/abtaaahi/krishi-shurokkha"
              className="inline-block px-3 py-1 bg-[#FFC107] text-[#3E2723] font-medium rounded hover:bg-[#FFB300] transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub Repo
            </Link>
          </p>
          <p className="mt-1 text-xs text-[#3E2723]">
            &copy; {new Date().getFullYear()} All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
