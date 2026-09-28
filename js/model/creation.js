import { creationFor, creationRules, highestCreationDots } from "../../data/tiers.js";

export function emptyLifepathAllocation() {
    return { skills: Array(creationRules.lifepathSkillDots).fill(""),
        resources: Array(creationRules.lifepathResourceDots).fill("") };
}

export function ensureCreationSlots(character) {
    const rules = creationFor(character.identity.playLevel);
    for (const key of ["lifepaths", "merits", "clanTraits"]) {
        while (character[key].length < rules[key]) character[key].push("");
    }
    const count = Math.max(character.lifepaths.length, character.lifepathAllocations.length);
    while (character.lifepaths.length < count) character.lifepaths.push("");
    while (character.lifepathAllocations.length < count) character.lifepathAllocations.push(emptyLifepathAllocation());
}

export function visibleSlotCount(values, normalCount) {
    return Math.max(normalCount, values.findLastIndex((value) => Boolean(value?.trim())) + 1);
}

export function ratingTrackMaximum(character, current) {
    // Preserve imported values; a temporary tier reduction never erases investments.
    // Unrecognized values beyond the supplied rules are retained and warned about,
    // without creating arbitrarily large DOM trackers from imported JSON.
    return Math.max(creationFor(character.identity.playLevel).maxDots, Math.min(current, highestCreationDots));
}
