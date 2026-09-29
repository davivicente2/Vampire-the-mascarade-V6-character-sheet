import { merits, getMerit, meritHelp } from "../../../data/merits.js";
import { creationFor } from "../../../data/tiers.js";
import { visibleSlotCount } from "../../model/creation.js";
import { rulePreview } from "../disclosure.js";
import { populateEligibleSelect } from "../eligible-select.js";
import { meritIssues } from "../../model/eligibility.js";
import { createChoiceField } from "../choice-field.js";
import { HELP } from "../help-text.js";

export function createMerit({ character, saveNow }) {
    function renderMerits() {
        const root = document.getElementById("merits");
        root.replaceChildren();
        const normalCount = creationFor(character.identity.playLevel).merits;
        const count = character.mode === "play" ? character.merits.length : visibleSlotCount(character.merits, normalCount);
        for (let index = 0; index < count; index++) {
            const field = createChoiceField(index === 0 ? "merit" : "merit-" + (index + 1), "Mérito " + (index + 1), "Descrição e ativação");
            const saved = character.merits[index] || "";
            const selected = getMerit(saved);
            const writable = character.mode === "play" || index < normalCount;
            const options = writable ? merits.filter((merit) => !meritIssues(character, merit, index).length).map((merit) => ({value:merit.name, label:merit.name})) : [];
            populateEligibleSelect(field.select, options, selected?.name || saved, "Selecione um Mérito", selected ? meritIssues(character, selected, index).join(" ") : "não catalogado");
            field.select.dataset.help = HELP.merit;
            const render = () => {
                const merit = getMerit(field.select.value);
                const separator = field.select.value.indexOf(" — ");
                field.rule.textContent = meritHelp(merit) || (separator >= 0 ? field.select.value.slice(separator + 3) : field.select.value);
                field.select.dataset.help = merit
                    ? merit.name + ": " + rulePreview(merit.description) + " Pré-requisitos: " + (merit.prerequisites || "Nenhum.") + (merit.activation ? " Ativação opcional: deixa o Mérito inativo até a próxima noite." : "")
                    : HELP.merit;
                const excess = character.mode === "creation" && index >= normalCount && field.select.value ? "⚠ Mérito excedente para este tier; preservado. " : "";
                const issues = merit ? meritIssues(character, merit, index) : [];
                field.help.textContent = excess + (issues.length ? "⚠ " + issues.join(" ") + " " : "") + (merit
                    ? [merit.prerequisites, rulePreview(merit.description)].filter(Boolean).join(" — ")
                    : rulePreview(field.rule.textContent));
                field.details.hidden = !field.select.value;
            };
            field.select.addEventListener("change", () => {
                const next = getMerit(field.select.value);
                if (field.select.value && (!writable || !next || meritIssues(character, next, index).length)) return;
                character.merits[index] = field.select.value;
                if (index === 0) character.merit = field.select.value;
                renderMerits();
                document.getElementById(field.select.id)?.focus();
                saveNow("Mérito salvo.");
            });
            render();
            root.append(field.root);
        }
        const add = document.getElementById("add-merit");
        add.hidden = character.mode !== "play";
        add.disabled = character.merits.includes("") || !merits.some((merit) => !meritIssues(character, merit).length);
    }
    function installMeritActions() {
        document.getElementById("add-merit").addEventListener("click", () => {
            if (character.mode !== "play" || character.merits.includes("") || !merits.some((merit) => !meritIssues(character, merit).length)) return;
            character.merits.push(""); renderMerits(); saveNow("Espaço para Mérito adquirido adicionado; registre 5 XP na mesa.");
        });
    }
    return { renderMerits, installMeritActions };
}
