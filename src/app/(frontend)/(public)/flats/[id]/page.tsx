import FlatDetailsMainView from "@/mainViews/public/flatDetailsMainView/FlatDetailsMainView";

export const metadata = {
  title: "Flat Unit Details - Real Nest",
  description: "View flat unit specifications, pricing, features, and booking options",
};

export default async function FlatDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  return <FlatDetailsMainView flatId={resolvedParams.id} />;
}
