import { getClanByName } from "../../data/clans.js";

// Boiling Passion applies to every Frenzy, never to a Nature Outburst.
export function frenzyDifficulty(character, baseDifficulty) {
    const curse = getClanByName(character.identity.clan)?.id === "brujah"
        ? Number(character.identity.generationModifier || 0) : 0;
    return Number(baseDifficulty) + curse;
}
