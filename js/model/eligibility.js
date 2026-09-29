import { tierLevels, tierLabels } from "../../data/tiers.js";
import { getClanByName } from "../../data/clans.js";
import { getMerit } from "../../data/merits.js";
import { normalizeTraitSelection } from "./identity.js";
import { disciplineChoices, ratingLimit } from "./selection-limits.js";

export function disciplineDots(character, name) {
    // Duplicate imported rows must not combine into a fictitious Discipline rank.
    return Math.max(0, ...character.disciplines.filter((item) => item.name === name).map((item) => item.dots));
}

function requirementLabel(requirement) {
    if (requirement.any) return requirement.any.map(requirementLabel).join(" ou ");
    if (requirement.discipline) return requirement.discipline + " " + requirement.dots + "+";
    if (requirement.attribute) return (requirement.attribute === "stamina" ? "Vigor" : requirement.attribute) + " " + requirement.dots + "+";
    return "Modificador de geração " + requirement.generationModifier + "+";
}

export function meetsRequirement(character, requirement) {
    if (requirement.any) return requirement.any.some((option) => meetsRequirement(character, option));
    if (requirement.discipline) return disciplineDots(character, requirement.discipline) >= requirement.dots;
    if (requirement.attribute) return character.attributes[requirement.attribute] >= requirement.dots;
    if (requirement.generationModifier) return character.identity.generationModifier >= requirement.generationModifier;
    return false;
}

export function missingRequirements(character, item) {
    const missing = [];
    if (item.tier && item.tier !== "mortal" && (tierLevels[character.identity.playLevel] || 0) < tierLevels[item.tier]) {
        missing.push("Requer " + tierLabels[item.tier] + " ou superior.");
    }
    for (const requirement of item.requirements || []) {
        if (!meetsRequirement(character, requirement)) missing.push("Requer " + requirementLabel(requirement) + ".");
    }
    return missing;
}

export function traitIssues(character, trait, list = "clanTraits", index = -1) {
    const clan = getClanByName(character.identity.clan);
    const issues = missingRequirements(character, trait);
    if (!clan?.traits.includes(trait)) issues.push("Não pertence ao Clã selecionado.");
    const duplicate = ["clanTraits", "advancementClanTraits"].some((key) => (character[key] || []).some((value, position) =>
        !(key === list && position === index) && normalizeTraitSelection(value, clan) === trait.name));
    if (duplicate) issues.push("Traço já escolhido em outro espaço.");
    return issues;
}

export function meritIssues(character, merit, index = -1) {
    const issues = missingRequirements(character, merit);
    if (character.merits.some((value, position) => position !== index && getMerit(value)?.name === merit.name)) {
        issues.push("Mérito já escolhido em outro espaço.");
    }
    return issues;
}

export function powerIssues(character, discipline, power, index = -1) {
    const issues = missingRequirements(character, power);
    if (!disciplineChoices(character, discipline).includes(discipline.name)) issues.push("Disciplina indisponível nas escolhas atuais.");
    if (power.rank > discipline.dots) issues.push("Requer " + discipline.name + " " + power.rank + "+.");
    if (power.rank > ratingLimit(character, "disciplines", discipline)) issues.push("Rank acima do limite de Disciplina neste modo e tier.");
    if (character.disciplines.some((other) => other.name === discipline.name && other.powers.some((choice, position) =>
        !(other === discipline && position === index) && choice.name === power.name))) issues.push("Poder já escolhido nesta Disciplina.");
    return issues;
}
