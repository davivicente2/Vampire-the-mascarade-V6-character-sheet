export const tierRules = {
    neonate: { label: "Neonate", level: 1, minGeneration: 11, maxGeneration: 13, generationModifier: 1 },
    ancilla: { label: "Ancilla", level: 2, minGeneration: 9, maxGeneration: 10, generationModifier: 2 },
    elder: { label: "Elder", level: 3, minGeneration: 6, maxGeneration: 8, generationModifier: 3 }
};

export const tierLevels = Object.fromEntries(Object.entries(tierRules).map(([key, rule]) => [key, rule.level]));
export const tierLabels = Object.fromEntries(Object.entries(tierRules).map(([key, rule]) => [key, rule.label]));
