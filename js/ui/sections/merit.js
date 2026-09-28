import { merits, getMerit, meritHelp } from "../../../data/merits.js";
import { creationFor } from "../../../data/tiers.js";
import { visibleSlotCount } from "../../model/creation.js";
import { rulePreview } from "../disclosure.js";
import { populateSelect } from "../controls.js";
import { createChoiceField } from "../choice-field.js";
import { HELP } from "../help-text.js";

export function createMerit({ character, saveNow }) {
    function renderMerits() {
        const root = document.getElementById("merits");
        root.replaceChildren();
        const normalCount = creationFor(character.identity.playLevel).merits;
        const count = visibleSlotCount(character.merits, normalCount);
        for (let index = 0; index < count; index++) {
            const field = createChoiceField(index === 0 ? "merit" : "merit-" + (index + 1), "Mérito " + (index + 1), "Descrição e ativação");
            const saved = character.merits[index] || "";
            const selected = getMerit(saved);
            const options = merits.map((merit) => ({value:merit.name, label:merit.name}));
            if (saved && !selected) options.push({value:saved, label:saved.split(" — ")[0] + " (salvo)"});
            populateSelect(field.select, options, selected?.name || saved, "Selecione um Mérito");
            field.select.dataset.help = HELP.merit;
            const render = () => {
                const merit = getMerit(field.select.value);
                const separator = field.select.value.indexOf(" — ");
                field.rule.textContent = meritHelp(merit) || (separator >= 0 ? field.select.value.slice(separator + 3) : field.select.value);
                const excess = index >= normalCount && field.select.value ? "⚠ Mérito excedente para este tier; preservado. " : "";
                field.help.textContent = excess + (merit
                    ? [merit.prerequisites, rulePreview(merit.description)].filter(Boolean).join(" — ")
                    : rulePreview(field.rule.textContent));
                field.details.hidden = !field.select.value;
            };
            field.select.addEventListener("change", () => {
                character.merits[index] = field.select.value;
                if (index === 0) character.merit = field.select.value;
                render();
                saveNow("Mérito salvo.");
            });
            render();
            root.append(field.root);
        }
    }
    return { renderMerits };
}
