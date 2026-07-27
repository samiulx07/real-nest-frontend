import EditPropertyMainView from "@/mainViews/dashboard/editPropertyMainView/EditPropertyMainView";

export const metadata = {
  title: "Edit Property - Real Nest",
  description: "Modify existing property details",
};

export default async function EditPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = (await params) || {};
  return <EditPropertyMainView propertyId={resolvedParams.id} />;
}
