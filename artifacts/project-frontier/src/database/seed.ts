import { getGatheringDefinitions } from "../content/gathering";

const definitions = getGatheringDefinitions();
console.info(
  `Validated ${definitions.length} activity definitions; player state is provisioned only from authenticated Clerk identities.`,
);
