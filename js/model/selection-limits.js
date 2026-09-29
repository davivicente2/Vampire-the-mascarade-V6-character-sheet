import { tierRules, creationFor, creationRules, highestCreationDots } from "../../data/tiers.js";
import { getClanByName, resolveClanDisciplines } from "../../data/clans.js";
import { ATTRIBUTE_GROUPS } from "../../data/attributes.js";
import { disciplines } from "../../data/disciplines.js";
import { getSireByName } from "../../data/sires.js";

export function clanDisciplines(character) {
    return resolveClanDisciplines(getClanByName(character.identity.clan), character.identity.clanDisciplineChoice);
}

export function sireDisciplines(character) {
    const sire = getSireByName(character.identity.sire);
    if (!sire) return [];
    if (sire.mode !== "custom-clan") return sire.disciplines;
    return [...new Set(getClanByName(character.identity.sireClan)?.disciplineSlots.flat() || [])];
}

function validSireDiscipline(character) {
    const name = character.identity.sireDiscipline;
    return sireDisciplines(character).includes(name) ? name : "";
}

export function disciplineChoices(character, current) {
    const permitted = character.mode === "play" ? Object.keys(disciplines)
        : [...new Set([...clanDisciplines(character), validSireDiscipline(character)].filter(Boolean))];
    return permitted.filter((name) => !character.disciplines.some((item) => item !== current && item.name === name));
}

export function ratingLimit(character, kind, item) {
    if (kind === "skills") return character.mode === "play" ? creationRules.skillTrackDots : creationRules.maxSkillDots;
    if (kind !== "disciplines") return creationFor(character.identity.playLevel).maxDots;
    const isClan = clanDisciplines(character).includes(item.name);
    if (character.mode === "play") {
        const rules = (tierRules[character.identity.playLevel] || tierRules.neonate).inPlay;
        return isClan ? rules.clanDisciplineMax : rules.nonClanDisciplineMax;
    }
    return isClan ? creationFor(character.identity.playLevel).maxDots : item.name && item.name === validSireDiscipline(character) ? 1 : 0;
}

export function selectionTrackMaximum(character, kind, current, item) {
    return Math.max(ratingLimit(character, kind, item), Math.min(current, highestCreationDots));
}

export function canSetRating(character, kind, key, next) {
    const item = character[kind][key];
    const current = kind === "attributes" ? item : item.dots;
    if (next <= current) return next >= (kind === "attributes" ? 1 : 0);
    if (next > ratingLimit(character, kind, item)) return false;
    if (character.mode === "play" || !tierRules[character.identity.playLevel]) return true;
    const rules = creationFor(character.identity.playLevel);
    if (kind === "attributes") {
        const pools = Object.values(ATTRIBUTE_GROUPS).map((group) => group.reduce((sum, [name]) => sum + (name === key ? next : character.attributes[name]) - 1, 0)).sort((a,b) => a-b);
        return pools.every((amount, index) => amount <= [...rules.attributePools].sort((a,b) => a-b)[index]);
    }
    const total = Object.values(character[kind]).reduce((sum, value) => sum + value.dots, 0) - current + next;
    const maximum = kind === "skills" ? rules.lifepaths * creationRules.lifepathSkillDots + rules.extraSkillDots
        : kind === "resources" ? rules.lifepaths * creationRules.lifepathResourceDots + rules.extraResourceDots
        : rules.disciplineDots + rules.sireDots;
    return total <= maximum;
}

export function hasPowerSpace(character, currentPower) {
    if (character.mode === "play" || currentPower?.name) return true;
    return character.disciplines.flatMap((item) => item.powers).filter((power) => power.name).length < creationFor(character.identity.playLevel).powers;
}
