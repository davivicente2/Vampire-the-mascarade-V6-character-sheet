// Vampire creation (Chapter 2), distinct from advancement limits (Chapter 4).
export const creationRules = {
    lifepathSkillDots: 5,
    lifepathResourceDots: 3,
    maxSkillDots: 3,
    skillTrackDots: 5
};
export const tierRules = {
    neonate: {
        label: "Neonate", level: 1, minGeneration: 11, maxGeneration: 13, generationModifier: 1,
        creation: { lifepaths: 2, attributePools: [7, 5, 3], disciplineDots: 3, sireDots: 1,
            powers: 4, merits: 1, clanTraits: 2, extraSkillDots: 8, extraResourceDots: 3, maxDots: 5 },
        inPlay: { clanDisciplineMax: 5, nonClanDisciplineMax: 3 }
    },
    ancilla: {
        label: "Ancilla", level: 2, minGeneration: 9, maxGeneration: 10, generationModifier: 2,
        creation: { lifepaths: 3, attributePools: [8, 6, 4], disciplineDots: 5, sireDots: 1,
            powers: 6, merits: 2, clanTraits: 3, extraSkillDots: 8, extraResourceDots: 5, maxDots: 6 },
        inPlay: { clanDisciplineMax: 7, nonClanDisciplineMax: 5 }
    },
    elder: {
        label: "Elder", level: 3, minGeneration: 6, maxGeneration: 8, generationModifier: 3,
        creation: { lifepaths: 4, attributePools: [9, 7, 5], disciplineDots: 7, sireDots: 1,
            powers: 8, merits: 3, clanTraits: 4, extraSkillDots: 8, extraResourceDots: 7, maxDots: 8 },
        inPlay: { clanDisciplineMax: 8, nonClanDisciplineMax: 7 }
    }
};
export const tierLevels = Object.fromEntries(Object.entries(tierRules).map(([key, rule]) => [key, rule.level]));
export const tierLabels = Object.fromEntries(Object.entries(tierRules).map(([key, rule]) => [key, rule.label]));
export const highestCreationDots = Math.max(...Object.values(tierRules).map((rule) => rule.creation.maxDots));

// An unselected tier has Neonate-sized controls, but no assumed creation budget.
export function creationFor(tier) {
    return (tierRules[tier] || tierRules.neonate).creation;
}
