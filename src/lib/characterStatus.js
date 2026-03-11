export const STATUS_EFFECT_PRESETS = [
  {key: "envenenado", label: "Envenenado"},
  {key: "paralisado", label: "Paralisado"},
  {key: "congelado", label: "Congelado"},
];

const STATUS_LABEL_TO_KEY = STATUS_EFFECT_PRESETS.reduce((acc, effect) => {
  acc[effect.label] = effect.key;
  return acc;
}, {});

export function getCharacterStatusEffects(character) {
  const effects = Array.isArray(character?.status_efeitos)
    ? character.status_efeitos.filter(Boolean)
    : [];

  STATUS_EFFECT_PRESETS.forEach((effect) => {
    if (character?.[effect.key] && !effects.includes(effect.label)) {
      effects.push(effect.label);
    }
  });

  return [...new Set(effects)];
}

export function toggleCharacterStatusEffect(character, effectLabel) {
  const currentEffects = getCharacterStatusEffects(character);
  const isActive = currentEffects.includes(effectLabel);
  const nextEffects = isActive
    ? currentEffects.filter((effect) => effect !== effectLabel)
    : [...currentEffects, effectLabel];

  const updates = {status_efeitos: nextEffects};
  const legacyKey = STATUS_LABEL_TO_KEY[effectLabel];

  if (legacyKey) {
    updates[legacyKey] = !isActive;
  }

  return {
    updates,
    isActive: !isActive,
    nextEffects,
  };
}
