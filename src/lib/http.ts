import { NextResponse } from "next/server";

export type FieldErrors = Partial<Record<string, string[]>>;

export type ApiErrorBody = {
  error: string;
  fieldErrors?: FieldErrors;
};

export function jsonError(status: number, error: string, fieldErrors?: FieldErrors) {
  return NextResponse.json<ApiErrorBody>({ error, fieldErrors }, { status });
}
