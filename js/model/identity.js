import { getClanByName, resolveClanDisciplines } from "../../data/clans.js";

export function normalizeTraitSelection(savedValue, clan) {
    const raw = String(savedValue || "").trim();
    if (!raw || !clan) return "";
    const exact = clan.traits.find((trait) => trait.name === raw);
    if (exact) return exact.name;

    const normalized = raw.toLowerCase();
    return clan.traits.find((trait) =>
        normalized === trait.name.toLowerCase() ||
        normalized.startsWith(trait.name.toLowerCase() + " ")
    )?.name || "";
}

export function syncDisciplinesToIdentity(character, {resetExtras = true} = {}) {
    const clan = getClanByName(character.identity.clan);
    if (!clan) return;

    const desired = resolveClanDisciplines(clan, character.identity.clanDisciplineChoice);
    const sireDiscipline = character.identity.sireDiscipline;
    if (sireDiscipline && !desired.includes(sireDiscipline)) {
        desired.push(sireDiscipline);
    }

    const existing = character.disciplines || [];
    const next = desired.map((name) => {
        const old = existing.find((discipline) => discipline.name === name);
        return old || {name, dots: 0, powers: [{name:"", cost:"", reminder:""}]};
    });

    if (!resetExtras) {
        existing.forEach((discipline) => {
            if (discipline.name && !next.some((item) => item.name === discipline.name)) {
                next.push(discipline);
            }
        });
    }

    character.disciplines = next;
}
