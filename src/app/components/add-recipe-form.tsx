"use client";

import { useFormState } from "react-dom";
import { SubmitButton } from "./submit-button";

interface FormState {
  message: string;
}
const initialState = { message: "" };

export function AddRecipeForm({
  formAction,
}: {
  formAction: (prevState: FormState, formData: FormData) => Promise<FormState>;
}) {
  const [state, action] = useFormState(formAction, initialState);
  return (
    <form className="flex flex-col gap-4" action={action}>
      <input
        type="text"
        name="title"
        placeholder="Title"
        required
        className="rounded border border-gray-400 p-2"
      />
      <label className="cursor-pointer rounded bg-green-500 p-2 text-white">
        <input
          name="picture"
          className="hidden"
          type="file"
          accept="image/*"
          capture="environment"
          required
        />
        <span className="cursor-pointer">Upload Photo</span>
      </label>
      <SubmitButton label="Add Recipe" />
      <p>{state.message}</p>
    </form>
  );
}
