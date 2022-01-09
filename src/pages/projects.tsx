import { Code, Spinner } from "@chakra-ui/react";
import { trpc } from "../utils/trpc";

function ProjectsPage() {
  const projects = trpc.useQuery(["projects"]);
  if (!projects.data) {
    return <Spinner />;
  }
  return <Code>{JSON.stringify(projects.data, null, 2)}</Code>;
}

export default ProjectsPage;
