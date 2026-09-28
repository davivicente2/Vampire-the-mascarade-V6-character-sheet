import { ATTRIBUTE_GROUPS } from "../../data/attributes.js";
import { getMerit } from "../../data/merits.js";
import { normalizeTraitSelection } from "./identity.js";
import { tierRules, tierLevels, creationRules } from "../../data/tiers.js";
import { getLifepath, lifepathRequirement } from "../../data/lifepaths.js";
import { getClanByName } from "../../data/clans.js";
import { getSireByName } from "../../data/sires.js";
import { getPower } from "../../data/disciplines.js";

export function validateCharacter(character) {
    const warnings = [];

    if (!character.identity.name.trim()) {
        warnings.push("O personagem ainda não tem nome.");
    }

    const clan = getClanByName(character.identity.clan);
    const sire = getSireByName(character.identity.sire);

    if (character.identity.clan && !clan) {
        warnings.push("O Clã salvo não está entre os sete Clãs disponíveis nesta campanha.");
    }

    if (sire?.disciplines?.length &&
        character.identity.sireDiscipline &&
        !sire.disciplines.includes(character.identity.sireDiscipline)) {
        warnings.push(
            "A Disciplina escolhida para o Sire não está entre as opções concedidas por esse tipo de Sire."
        );
    }

    if (sire && character.identity.sireDiscipline) {
        const sireDiscipline = character.disciplines.find(
            (discipline) => discipline.name === character.identity.sireDiscipline
        );
        if (!sireDiscipline || Number(sireDiscipline.dots || 0) < 1) {
            warnings.push(
                "A Disciplina do Sire (" + character.identity.sireDiscipline +
                ") está sem o ponto adicional concedido pelo Sire."
            );
        }
    }

    const tierRule = tierRules[character.identity.playLevel];
    if (tierRule) {
        const generation = Number(character.identity.generation || 0);
        const generationModifier = Number(character.identity.generationModifier || 0);
        if (generation < tierRule.minGeneration || generation > tierRule.maxGeneration) {
            warnings.push(
                tierRule.label + " normalmente pertence às gerações " +
                tierRule.minGeneration + "ª–" + tierRule.maxGeneration + "ª."
            );
        }
        if (generationModifier !== tierRule.generationModifier) {
            warnings.push(
                tierRule.label + " usa modificador de geração " +
                tierRule.generationModifier + " nas categorias do playtest."
            );
        }
    }

    for (const value of character.lifepaths) {
        const path = getLifepath(value);
        const requirement = lifepathRequirement(path, character.identity.playLevel);
        if (requirement) warnings.push(path.name + ": " + requirement);
    }
    const filled = (values) => values.filter((value) => value?.trim());
    const count = (values) => filled(values).length;
    if (tierRule) {
        const rules = tierRule.creation;
        const paths = count(character.lifepaths);
        const totals = (items) => items.reduce((sum, item) => sum + Number(item.dots || 0), 0);
        const checkTotal = (actual, expected, label) => {
            if (actual !== expected) warnings.push(label + ": " + actual + "; criação " + tierRule.label + ": " + expected + ".");
        };
        if (paths !== rules.lifepaths) {
            warnings.push("Caminhos de Vida: " + paths + "; " + tierRule.label + " normalmente usa " + rules.lifepaths +
                (paths === 1 ? ". A exceção de personagem jovem depende do Narrador; bônus opcionais não são aplicados." : ". Escolhas existentes foram preservadas."));
        }
        const pools = Object.values(ATTRIBUTE_GROUPS).map((group) => group.reduce((sum, [key]) => sum + Number(character.attributes[key]) - 1, 0)).sort((a,b) => a-b);
        if (pools.join(",") !== [...rules.attributePools].sort((a,b) => a-b).join(",")) {
            warnings.push("A distribuição de Atributos não corresponde aos grupos " + rules.attributePools.join(" / ") + " de " + tierRule.label + ".");
        }
        checkTotal(totals(character.disciplines), rules.disciplineDots + rules.sireDots, "Pontos de Disciplina (incluindo Sire)");
        checkTotal(character.disciplines.flatMap((discipline) => discipline.powers).filter((power) => power.name?.trim()).length, rules.powers, "Poderes de Disciplina");
        checkTotal(count(character.merits), rules.merits, "Méritos");
        checkTotal(count(character.clanTraits), rules.clanTraits, "Traços de Clã");
        // Young-character compensation is optional and requires an explicit table decision.
        if (paths === rules.lifepaths) {
            checkTotal(totals(Object.values(character.skills)), paths * creationRules.lifepathSkillDots + rules.extraSkillDots, "Pontos de Habilidade");
            checkTotal(totals(character.resources), paths * creationRules.lifepathResourceDots + rules.extraResourceDots, "Pontos de Recursos");
        } else {
            warnings.push("Totais de Habilidades e Recursos aguardam a definição dos Caminhos de Vida ou da exceção autorizada pelo Narrador.");
        }
        for (const key of ["lifepaths", "merits", "clanTraits"]) {
            if (character[key].slice(rules[key]).some((value) => value?.trim())) warnings.push("Escolhas em " + key + " acima dos slots de " + tierRule.label + " foram preservadas.");
        }
        for (const [key, value] of Object.entries(character.attributes)) {
            if (value > rules.maxDots) warnings.push("Atributo " + key + ": " + value + " pontos excedem o limite de criação " + rules.maxDots + "; valor preservado.");
        }
        for (const item of [...character.resources, ...character.disciplines]) {
            if (item.dots > rules.maxDots) warnings.push(item.name + ": " + item.dots + " pontos excedem o limite de criação " + rules.maxDots + "; valor preservado.");
        }
        for (const [key, skill] of Object.entries(character.skills)) {
            if (skill.dots > creationRules.maxSkillDots) warnings.push("Habilidade " + key + ": criação limitada a " + creationRules.maxSkillDots + "; pontos de jogo preservados.");
        }
    }
    const chosenMerits = filled(character.merits).map((value) => getMerit(value)?.name || value);
    if (new Set(chosenMerits).size !== chosenMerits.length) warnings.push("Méritos repetidos: confirme a escolha com o Narrador.");

    if (clan) {
        const selectedTraits = character.clanTraits.filter(Boolean).map((value) => normalizeTraitSelection(value, clan) || value);

        if (new Set(selectedTraits).size !== selectedTraits.length) {
            warnings.push("Os Traços de Clã devem ser escolhas diferentes.");
        }

        selectedTraits.forEach((traitName) => {
            const trait = clan.traits.find((item) => item.name === traitName);
            if (!trait) {
                warnings.push(traitName + " não pertence ao Clã " + clan.name + ".");
                return;
            }

            if (tierLevels[trait.tier] > (tierRule?.level || 0)) {
                warnings.push(
                    trait.name + " requer " + (tierRules[trait.tier]?.label || trait.tier) + " ou mais forte. Mantenha apenas se o Narrador autorizou uma exceção."
                );
            }
        });
    }

    character.disciplines.forEach((discipline) => {
        (discipline.powers || []).forEach((power) => {
            const name = typeof power === "string" ? power : power?.name;
            if (!name) return;

            const sourcePower = getPower(discipline.name, name);
            if (!sourcePower) {
                warnings.push(name + " não foi encontrado na base de " + discipline.name + ".");
                return;
            }

            if (sourcePower.rank > Number(discipline.dots || 0)) {
                warnings.push(
                    name + " requer " + sourcePower.rank + " dots em " + discipline.name +
                    ", mas a ficha tem " + Number(discipline.dots || 0) + "."
                );
            }
        });
    });

    return warnings;
}
