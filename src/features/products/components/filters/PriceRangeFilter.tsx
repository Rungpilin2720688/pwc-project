import { useId, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { FieldError, FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/FormControls";
import { parsePriceRange } from "../../query";
import styles from "./ProductFilters.module.css";

type Props = {
  minPrice: number | undefined;
  maxPrice: number | undefined;
  onApply: (range: { minPrice: number | undefined; maxPrice: number | undefined }) => void;
};

export function PriceRangeFilter({ minPrice, maxPrice, onApply }: Props) {
  const [min, setMin] = useState(minPrice?.toString() ?? "");
  const [max, setMax] = useState(maxPrice?.toString() ?? "");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = parsePriceRange(min, max);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setError(null);
    onApply({ minPrice: result.minPrice, maxPrice: result.maxPrice });
  }

  const errorId = useId();
  const invalidProps = error ? { "aria-invalid": true as const, "aria-describedby": errorId } : {};

  return (
    <form className={styles.priceRange} onSubmit={handleSubmit} noValidate>
      <FormField label="Min price" className={styles.priceField}>
        {(control) => (
          <Input
            {...control}
            {...invalidProps}
            type="number"
            inputMode="decimal"
            min={0}
            step="0.01"
            placeholder="0"
            value={min}
            onChange={(event) => setMin(event.target.value)}
          />
        )}
      </FormField>
      <FormField label="Max price" className={styles.priceField}>
        {(control) => (
          <Input
            {...control}
            {...invalidProps}
            type="number"
            inputMode="decimal"
            min={0}
            step="0.01"
            placeholder="Any"
            value={max}
            onChange={(event) => setMax(event.target.value)}
          />
        )}
      </FormField>
      <Button type="submit" variant="secondary">
        Apply
      </Button>
      {error && (
        <div className={styles.priceError} role="alert">
          <FieldError id={errorId}>{error}</FieldError>
        </div>
      )}
    </form>
  );
}
