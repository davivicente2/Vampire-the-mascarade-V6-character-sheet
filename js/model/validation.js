import { powerIssues } from "./eligibility.js";
import { ratingLimit, disciplineChoices, sireDisciplines } from "./selection-limits.js";
import { ATTRIBUTE_GROUPS } from "../../data/attributes.js";
import { getMerit } from "../../data/merits.js";
import { tierRules, creationRules } from "../../data/tiers.js";
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

    if (character.identity.sireDiscipline && !sireDisciplines(character).includes(character.identity.sireDiscipline)) {
        warnings.push(
            "A Disciplina escolhida para o Sire não está entre as opções concedidas por esse tipo de Sire."
        );
    }
    if (sire?.mode === "custom-clan" && !getClanByName(character.identity.sireClan)) warnings.push("Defina o Clã relacionado ao Sire para conferir a Disciplina concedida.");

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
    if (tierRule && character.mode === "creation") {
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

    // Traits and Merits may be entered manually. Catalog prerequisites are reference only;
    // validation intentionally avoids treating them as authoritative table rules.
    if (character.mode === "creation" && character.advancementClanTraits.some(Boolean)) warnings.push("Traços adquiridos em jogo foram preservados; eles não contam nos espaços iniciais da criação.");
    if (character.mode === "play") {
        for (const [key, skill] of Object.entries(character.skills)) if (skill.dots > 5) warnings.push("Habilidade " + key + ": máximo de 5 em jogo; valor salvo preservado.");
    }

    character.disciplines.forEach((discipline) => {
        if (discipline.name && !disciplineChoices(character, discipline).includes(discipline.name)) warnings.push(discipline.name + ": Disciplina indisponível ou repetida nas escolhas atuais; valor salvo preservado.");
        const limit = ratingLimit(character, "disciplines", discipline);
        if (discipline.dots > limit) warnings.push(discipline.name + ": " + discipline.dots + " pontos; limite " + limit + " no modo " + (character.mode === "play" ? "Em jogo" : "Criação") + ".");
        (discipline.powers || []).forEach((power, index) => {
            const name = typeof power === "string" ? power : power?.name;
            if (!name) return;

            const sourcePower = getPower(discipline.name, name);
            if (!sourcePower) {
                warnings.push(name + " não foi encontrado na base de " + discipline.name + ".");
                return;
            }

            for (const issue of powerIssues(character, discipline, sourcePower, index)) warnings.push(name + ": " + issue);
        });
    });

    return warnings;
}
