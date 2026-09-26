import { FormField } from "@/components/ui/FormField";
import { Select } from "@/components/ui/FormControls";
import type { SortDirection, SortField } from "../../query";

type SortOption = { sort: SortField; dir: SortDirection; label: string };

const SORT_OPTIONS: readonly SortOption[] = [
  { sort: "name", dir: "asc", label: "Name: A → Z" },
  { sort: "name", dir: "desc", label: "Name: Z → A" },
  { sort: "price", dir: "asc", label: "Price: low → high" },
  { sort: "price", dir: "desc", label: "Price: high → low" },
  { sort: "rating", dir: "desc", label: "Rating: high → low" },
  { sort: "rating", dir: "asc", label: "Rating: low → high" },
];

const toValue = (sort: SortField, dir: SortDirection) => `${sort}-${dir}`;

type Props = {
  sort: SortField;
  dir: SortDirection;
  onChange: (sort: SortField, dir: SortDirection) => void;
};

export function SortSelect({ sort, dir, onChange }: Props) {
  function handleChange(value: string) {
    const option = SORT_OPTIONS.find((candidate) => toValue(candidate.sort, candidate.dir) === value);
    if (option) onChange(option.sort, option.dir);
  }

  return (
    <FormField label="Sort by">
      {(control) => (
        <Select {...control} value={toValue(sort, dir)} onChange={(event) => handleChange(event.target.value)}>
          {SORT_OPTIONS.map((option) => (
            <option key={toValue(option.sort, option.dir)} value={toValue(option.sort, option.dir)}>
              {option.label}
            </option>
          ))}
        </Select>
      )}
    </FormField>
  );
}
