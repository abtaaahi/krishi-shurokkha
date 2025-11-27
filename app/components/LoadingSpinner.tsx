export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center mt-4">
      <div className="w-10 h-10 border-4 border-green-400 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}
