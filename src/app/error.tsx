"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: Props) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <EmptyState
      title="Something went wrong"
      description="We could not load this page. Please try again."
      action={<Button onClick={reset}>Try again</Button>}
    />
  );
}
