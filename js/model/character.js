import { EMPTY_CHARACTER } from "../../data/characters/empty.js";
import { SKILL_LABELS } from "../../data/skills.js";
import { getPower } from "../../data/disciplines.js";
import { normalizeSkillFocuses } from "./skills.js";
import { humanityBounds } from "./humanity.js";

export function clone(value) {
    return JSON.parse(JSON.stringify(value));
}

export function normalizePower(power) {
    if (typeof power === "string") {
        return {name: power, cost: "", reminder: ""};
    }
    return {
        name: power?.name || "",
        cost: power?.cost || "",
        reminder: power?.reminder || ""
    };
}

export function normalizeCharacter(value) {
    const base = clone(EMPTY_CHARACTER);
    const incoming = value && typeof value === "object" ? value : {};

    base.version = 2;
    base.identity = {...base.identity, ...(incoming.identity || {})};
    base.attributes = {...base.attributes, ...(incoming.attributes || {})};

    for (const key of Object.keys(SKILL_LABELS)) {
        base.skills[key] = {
            ...base.skills[key],
            ...(incoming.skills?.[key] || {})
        };
        base.skills[key].focuses = normalizeSkillFocuses(base.skills[key]);
    }

    if (Array.isArray(incoming.resources)) {
        base.resources = incoming.resources.map((resource) => ({
            name: resource?.name || "",
            dots: Number(resource?.dots || 0),
            details: resource?.details || ""
        }));
    }

    if (Array.isArray(incoming.disciplines)) {
        base.disciplines = incoming.disciplines.map((discipline) => ({
            name: discipline?.name || "",
            dots: Number(discipline?.dots || 0),
            powers: Array.isArray(discipline?.powers)
                ? discipline.powers.map(normalizePower)
                : [{name:"", cost:"", reminder:""}]
        }));
    }

    base.disciplines.forEach((discipline) => {
        discipline.powers.forEach((power) => {
            const sourcePower = getPower(discipline.name, power.name);
            if (!sourcePower) return;
            if (!power.cost) power.cost = sourcePower.cost || "";
        });
    });

    if (Array.isArray(incoming.lifepaths)) base.lifepaths = incoming.lifepaths.slice(0, 2);
    while (base.lifepaths.length < 2) base.lifepaths.push("");

    if (Array.isArray(incoming.lifepathAllocations)) {
        base.lifepathAllocations = incoming.lifepathAllocations.slice(0, 2).map((allocation) => ({
            skills: Array.isArray(allocation?.skills) ? allocation.skills.slice(0, 5).map((value) => String(value || "")) : [],
            resources: Array.isArray(allocation?.resources) ? allocation.resources.slice(0, 3).map((value) => String(value || "")) : []
        }));
    }
    while (base.lifepathAllocations.length < 2) base.lifepathAllocations.push({skills:[], resources:[]});
    base.lifepathAllocations = base.lifepathAllocations.map((allocation) => ({
        skills: [...allocation.skills, "", "", "", "", ""].slice(0, 5),
        resources: [...allocation.resources, "", "", ""].slice(0, 3)
    }));

    if (Array.isArray(incoming.clanTraits)) base.clanTraits = incoming.clanTraits.slice(0, 2);
    while (base.clanTraits.length < 2) base.clanTraits.push("");

    for (const key of [
        "merit","flaw","nature","beast","items",
        "currentVitae","currentWillpower","quickening","nefariousDamage",
        "beastPoints","naturePoints","humanityPosition","frenzyTrigger","outburstTrigger",
        "lostBeastCircles","lostNatureCircles","beastEpisode","natureEpisode","humanityFate"
    ]) {
        if (incoming[key] !== undefined) base[key] = incoming[key];
    }

    const bounded = (value, max, min = 0) => Math.max(min, Math.min(max, Math.trunc(Number(value) || 0)));
    for (const key of Object.keys(base.attributes)) base.attributes[key] = bounded(base.attributes[key], 5, 1);
    for (const skill of Object.values(base.skills)) skill.dots = bounded(skill.dots, 5);
    for (const item of [...base.resources, ...base.disciplines]) item.dots = bounded(item.dots, 5);
    for (const key of ["currentVitae", "currentWillpower", "quickening", "nefariousDamage"]) {
        base[key] = bounded(base[key], Number.MAX_SAFE_INTEGER);
    }
    for (const key of ["beastPoints", "naturePoints"]) base[key] = bounded(base[key], 5);
    base.quickening = bounded(base.quickening, 5);
    base.lostBeastCircles = bounded(base.lostBeastCircles, 3);
    base.lostNatureCircles = bounded(base.lostNatureCircles, 3);
    for (const key of ["beastEpisode", "natureEpisode"]) {
        if (!["", "failure", "painful", "accepted"].includes(base[key])) base[key] = "";
    }
    if (!["", "wight", "departure"].includes(base.humanityFate)) base.humanityFate = "";
    const bounds = humanityBounds(base);
    base.humanityPosition = bounded(base.humanityPosition, bounds.max, bounds.min);
    return base;
}
