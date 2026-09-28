import { powers as animalismPowers } from "./powers/animalism.js";
import { powers as auspexPowers } from "./powers/auspex.js";
import { powers as celerityPowers } from "./powers/celerity.js";
import { powers as corruptionPowers } from "./powers/corruption.js";
import { powers as dominatePowers } from "./powers/dominate.js";
import { powers as fortitudePowers } from "./powers/fortitude.js";
import { powers as obfuscatePowers } from "./powers/obfuscate.js";
import { powers as oblivionPowers } from "./powers/oblivion.js";
import { powers as potencePowers } from "./powers/potence.js";
import { powers as presencePowers } from "./powers/presence.js";

// Discipline metadata and lookup API; power entries live in data/powers/.
export const disciplines = {
    "Animalism": { id: "animalism", name: "Animalism", powers: animalismPowers },
    "Auspex": { id: "auspex", name: "Auspex", powers: auspexPowers },
    "Celerity": { id: "celerity", name: "Celerity", powers: celerityPowers },
    "Corruption": { id: "corruption", name: "Corruption", powers: corruptionPowers },
    "Dominate": { id: "dominate", name: "Dominate", powers: dominatePowers },
    "Fortitude": { id: "fortitude", name: "Fortitude", powers: fortitudePowers },
    "Obfuscate": { id: "obfuscate", name: "Obfuscate", powers: obfuscatePowers },
    "Oblivion": { id: "oblivion", name: "Oblivion", powers: oblivionPowers },
    "Potence": { id: "potence", name: "Potence", powers: potencePowers },
    "Presence": { id: "presence", name: "Presence", powers: presencePowers }
};


export function getDiscipline(name) {
    const key = String(name || "").trim();
    return Object.hasOwn(disciplines, key) ? disciplines[key] : null;
}

export function getAvailablePowers(name, dots) {
    const discipline = getDiscipline(name);
    if (!discipline) return [];
    const maximumRank = Math.max(0, Number(dots || 0));
    return discipline.powers.filter((power) => power.rank <= maximumRank);
}

export function getPower(name, powerName) {
    const discipline = getDiscipline(name);
    if (!discipline) return null;
    const target = String(powerName || "").trim().toLowerCase().replace(/[’‘]/g, "'");
    return discipline.powers.find((power) =>
        power.name.toLowerCase().replace(/[’‘]/g, "'") === target
    ) || null;
}
