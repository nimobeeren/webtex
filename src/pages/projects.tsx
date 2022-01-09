import { Code, Spinner } from "@chakra-ui/react";
import { trpc } from "../utils/trpc";

function ProjectsPage() {
  const hello = trpc.useQuery(["hello", { text: "nimo" }]);
  if (!hello.data) {
    return <Spinner />;
  }
  return <Code>{JSON.stringify(hello.data, null, 2)}</Code>;
}

export default ProjectsPage;
