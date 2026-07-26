import ProjectDetailsMainView from "@/mainViews/public/projectDetailsMainView/ProjectDetailsMainView";

export const metadata = {
  title: "Project Details - Real Nest",
  description: "View building specifications, location details, and available flats",
};

export default async function ProjectDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  return <ProjectDetailsMainView projectId={resolvedParams.id} />;
}
