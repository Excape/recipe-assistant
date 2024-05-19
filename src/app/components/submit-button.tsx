import { useFormStatus } from "react-dom";

export function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="rounded bg-blue-500 p-2 text-white disabled:bg-blue-100 disabled:text-gray-500"
      disabled={pending}
    >
      {label}
    </button>
  );
}
