import {HINDRANCES_SWADE} from "./hindrancesSwade";
import {HINDRANCES_SL} from "./hindrancesSL";

export const HINDRANCES = [...HINDRANCES_SWADE, ...HINDRANCES_SL].sort((a, b) =>
  a.name.localeCompare(b.name),
);
