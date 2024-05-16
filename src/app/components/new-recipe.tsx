export const NewRecipeForm = ({
  action,
}: {
  action: (formData: FormData) => void;
}) => {
  return (
    <form className="flex flex-col gap-4" action={action}>
      <input
        type="text"
        name="title"
        placeholder="Title"
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
      <button type="submit" className="rounded bg-blue-500 p-2 text-white">
        Add Recipe
      </button>
    </form>
  );
};
