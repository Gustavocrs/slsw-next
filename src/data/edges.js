import {EDGES_SWADE} from "./edgesSwade";
import {EDGES_SL} from "./edgesSL";

export const EDGES = [...EDGES_SWADE, ...EDGES_SL].sort((a, b) =>
  a.name.localeCompare(b.name),
);
