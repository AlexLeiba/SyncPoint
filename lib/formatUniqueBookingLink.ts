export function formatUniqueBookingLink({
  fullName,
  id,
}: {
  fullName: string | undefined | null;
  id: string | undefined | null;
}) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  if (!id || !fullName || !baseUrl) {
    return "";
  }
  return `${baseUrl}/book/${fullName
    ?.toLocaleLowerCase()
    ?.trim()
    .replace(" ", "-")}/${id}`;
}
