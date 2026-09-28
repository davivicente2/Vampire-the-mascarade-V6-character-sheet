import { tierRules } from "../../data/tiers.js";
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
    const twoLifepaths = character.lifepaths.filter((value) => value.trim()).length === 2;

    if (character.identity.playLevel === "neonate") {
        const attributePools = [
            character.attributes.strength + character.attributes.dexterity + character.attributes.stamina - 3,
            character.attributes.charisma + character.attributes.manipulation + character.attributes.composure - 3,
            character.attributes.intelligence + character.attributes.wits + character.attributes.resolve - 3
        ].sort((a, b) => a - b);

        if (attributePools.join(",") !== "3,5,7") {
            warnings.push(
                "A distribuição atual de Atributos não corresponde aos grupos 7 / 5 / 3 de um Neonate."
            );
        }

        const skillDots = Object.values(character.skills)
            .reduce((total, skill) => total + Number(skill.dots || 0), 0);

        if (twoLifepaths && skillDots !== 18) {
            warnings.push(
                "A ficha tem " + skillDots + " pontos de Habilidade. Com dois Caminhos de Vida, um Neonate normalmente totaliza 18."
            );
        }

        const disciplineDots = character.disciplines
            .reduce((total, discipline) => total + Number(discipline.dots || 0), 0);

        if (disciplineDots !== 4) {
            warnings.push(
                "A ficha tem " + disciplineDots + " pontos de Disciplina. Um Neonate recebe 3 pontos de clã + 1 ponto do Sire."
            );
        }

        const powers = character.disciplines
            .flatMap((discipline) => discipline.powers || [])
            .filter((power) => {
                const name = typeof power === "string" ? power : power?.name;
                return Boolean(name && name.trim().length > 0);
            });

        if (powers.length !== 4) {
            warnings.push(
                "A ficha tem " + powers.length + " Poderes de Disciplina preenchidos. Um Neonate escolhe 4."
            );
        }

        const resourceDots = character.resources
            .reduce((total, resource) => total + Number(resource.dots || 0), 0);

        if (twoLifepaths && resourceDots !== 9) {
            warnings.push(
                "A ficha tem " + resourceDots + " pontos de Recursos. Dois Caminhos de Vida + os 3 pontos de Neonate normalmente totalizam 9."
            );
        }
    }

    if (clan) {
        const selectedTraits = character.clanTraits.filter(Boolean);

        if (selectedTraits.length !== 2) {
            warnings.push("Selecione 2 Traços de Clã.");
        }

        if (new Set(selectedTraits).size !== selectedTraits.length) {
            warnings.push("Os dois Traços de Clã devem ser escolhas diferentes.");
        }

        selectedTraits.forEach((traitName) => {
            const trait = clan.traits.find((item) => item.name === traitName);
            if (!trait) {
                warnings.push(traitName + " não pertence ao Clã " + clan.name + ".");
                return;
            }

            if (character.identity.playLevel === "neonate" && trait.tier === "ancilla") {
                warnings.push(
                    trait.name + " requer Ancilla ou mais forte. Mantenha apenas se o Narrador autorizou uma exceção."
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
