import { ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";

export default function NotFound() {
  return (
    <EmptyState
      title="Page not found"
      description="The page or product you are looking for does not exist."
      action={<ButtonLink href="/products">Back to products</ButtonLink>}
    />
  );
}
