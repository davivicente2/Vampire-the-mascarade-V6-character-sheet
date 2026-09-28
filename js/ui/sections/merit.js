import { merits, getMerit, meritHelp } from "../../../data/merits.js";
import { rulePreview } from "../disclosure.js";
import { populateSelect } from "../controls.js";

export function createMerit({ character, saveNow }) {
    function installMeritSelection() {
        const select = document.getElementById("merit");
        const description = document.getElementById("merit-description");
        const saved = character.merit;
        const selected = getMerit(saved);
        const options = merits.map((merit) => ({ value: merit.name, label: merit.name }));

        // Keep older free-text merits available without changing their stored text.
        if (saved && !selected) {
            options.push({ value: saved, label: saved.split(" — ")[0] + " (salvo)" });
        }
        populateSelect(select, options, selected?.name || saved, "Selecione um Mérito");

        const renderDescription = () => {
            const merit = getMerit(select.value);
            const separator = select.value.indexOf(" — ");
            const full = document.getElementById("merit-rule");
            full.textContent = meritHelp(merit) || (select.value
                ? (separator >= 0 ? select.value.slice(separator + 3) : select.value) : "");
            description.textContent = merit
                ? [merit.prerequisites, rulePreview(merit.description)].filter(Boolean).join(" — ")
                : rulePreview(full.textContent);
            full.closest("details").hidden = !select.value;
        };

        renderDescription();
        select.addEventListener("change", () => {
            character.merit = select.value;
            renderDescription();
            saveNow("Mérito salvo.");
        });
    }

    return { installMeritSelection };
}
