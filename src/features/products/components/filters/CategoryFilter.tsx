import { FormField } from "@/components/ui/FormField";
import { Select } from "@/components/ui/FormControls";

type Props = {
  categories: string[];
  value: string | undefined;
  onChange: (category: string | undefined) => void;
};

export function CategoryFilter({ categories, value, onChange }: Props) {
  return (
    <FormField label="Category">
      {(control) => (
        <Select {...control} value={value ?? ""} onChange={(event) => onChange(event.target.value || undefined)}>
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </Select>
      )}
    </FormField>
  );
}
