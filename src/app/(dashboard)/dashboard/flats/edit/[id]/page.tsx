import EditFlatMainView from "@/mainViews/dashboard/editFlatMainView/EditFlatMainView";

export const metadata = {
  title: "Edit Flat Unit - Real Nest",
  description: "Modify existing flat unit details",
};

export default async function EditFlatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = (await params) || {};
  return <EditFlatMainView flatId={resolvedParams.id} />;
}
