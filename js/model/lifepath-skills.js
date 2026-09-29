import { SKILL_LABELS } from "../../data/skills.js";
import { canSetRating } from "./selection-limits.js";

const normalizeLabel = (value) => String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase();
const skillKeys = new Map(Object.entries(SKILL_LABELS).map(([key, label]) => [normalizeLabel(label), key]));

export function skillForLifepathChoice(choice) {
    // Parentheses describe focus options; they never replace the player's focus text.
    return skillKeys.get(normalizeLabel(String(choice || "").replace(/\s*\([^)]*\)\s*$/, ""))) || null;
}

export function lifepathSkillContributions(character) {
    const totals = Object.fromEntries(Object.keys(SKILL_LABELS).map((key) => [key, 0]));
    for (const allocation of character.lifepathAllocations || []) {
        for (const choice of allocation.skills || []) {
            const key = skillForLifepathChoice(choice);
            if (key) totals[key]++;
        }
    }
    return totals;
}

export function reconcileLifepathSkills(character) {
    const totals = lifepathSkillContributions(character);
    for (const [key, contribution] of Object.entries(totals)) {
        // Old sheets may already include their allocations. Never add them twice,
        // and never lower an existing rating during load/import.
        character.skills[key].dots = Math.max(character.skills[key].dots, contribution);
    }
}

export function changeLifepathSkills(character, changeAllocation) {
    const before = lifepathSkillContributions(character);
    const extra = Object.fromEntries(Object.entries(character.skills).map(([key, skill]) => [key, Math.max(0, skill.dots - (before[key] || 0))]));
    changeAllocation();
    const after = lifepathSkillContributions(character);
    for (const key of Object.keys(SKILL_LABELS)) {
        character.skills[key].dots = extra[key] + after[key];
    }
}

export function canAddLifepathSkill(character, choice) {
    const key = skillForLifepathChoice(choice);
    return Boolean(key && canSetRating(character, "skills", key, character.skills[key].dots + 1));
}

export function setSkillTotal(character, key, dots) {
    character.skills[key].dots = Math.max(lifepathSkillContributions(character)[key] || 0, dots);
}
