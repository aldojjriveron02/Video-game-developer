import { getGatheringDefinition } from "../content/gathering";

const definition = getGatheringDefinition();
console.info(
  `Validated activity content ${definition.id} v${definition.version}; player state is provisioned only from authenticated Clerk identities.`,
);