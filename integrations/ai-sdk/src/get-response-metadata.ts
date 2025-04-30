export function getResponseMetadata({
  id,
  model,
  createdAt,
}: {
  id?: string | undefined | null;
  createdAt?: Date | undefined | null;
  model?: string | undefined | null;
}) {
  return {
    id: id ?? undefined,
    modelId: model ?? undefined,
    timestamp: createdAt ?? undefined,
  };
}