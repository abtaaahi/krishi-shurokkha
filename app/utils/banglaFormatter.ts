export function toBanglaNumber(num?: number | null) {
  if (num === undefined || num === null) return "-"; // Safe placeholder

  const banglaDigits = ["০","১","২","৩","৪","৫","৬","৭","৮","৯"];
  return num
    .toString()
    .split("")
    .map(d => (/\d/.test(d) ? banglaDigits[parseInt(d)] : d))
    .join("");
}
