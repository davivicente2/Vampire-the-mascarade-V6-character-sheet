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
        const count = character.mode === "play" ? character.merits.length : visibleSlotCount(character.merits, normalCount);

        for (let index = 0; index < count; index++) {
            const field = createChoiceField(
                index === 0 ? "merit" : "merit-" + (index + 1),
                "Mérito " + (index + 1),
                "Referência do material atual"
            );
            const saved = character.merits[index] || "";
            const selected = getMerit(saved);
            const manual = Boolean(saved && !selected);
            const writable = character.mode === "play" || index < normalCount;

            const options = writable
                ? [
                    ...merits.map((item) => ({value:item.name, label:item.name})),
                    {value:"__manual__", label:"Outro / manual"}
                ]
                : selected
                    ? [{value:selected.name, label:selected.name}]
                    : manual
                        ? [{value:"__manual__", label:"Outro / manual"}]
                        : [];

            populateSelect(field.select, options, manual ? "__manual__" : selected?.name || "", "Selecione um Mérito");
            field.select.disabled = !writable;
            field.select.dataset.help = HELP.merit;

            const manualInput = document.createElement("input");
            manualInput.type = "text";
            manualInput.className = "manual-choice-input";
            manualInput.placeholder = "Nome do Mérito / decisão da mesa";
            manualInput.setAttribute("aria-label", "Mérito manual " + (index + 1));
            manualInput.value = manual ? saved : "";
            manualInput.hidden = !manual;
            field.select.after(manualInput);

            const render = () => {
                const current = getMerit(character.merits[index]);
                const excess = character.mode === "creation" && index >= normalCount && character.merits[index]
                    ? "Escolha acima dos espaços iniciais deste tier; preservada. "
                    : "";
                field.help.textContent = excess + (current
                    ? "Entrada catalogada no material atual. " + rulePreview(current.description) +
                        " A descrição abaixo é apenas referência."
                    : character.merits[index]
                        ? "Entrada manual. A ficha não valida requisitos nem custo desta escolha."
                        : "Use uma opção catalogada como referência ou escolha Outro / manual.");
                field.rule.textContent = current
                    ? "Referência do material atual.\n\n" + meritHelp(current)
                    : "";
                field.details.hidden = !current;
                field.select.dataset.help = current
                    ? current.name + ": " + rulePreview(current.description) + " Consulte a referência e confirme a versão usada pela mesa."
                    : HELP.merit;
            };

            field.select.addEventListener("change", () => {
                if (!writable) return;
                if (field.select.value === "__manual__") {
                    character.merits[index] = manualInput.value.trim();
                    if (index === 0) character.merit = character.merits[index];
                    manualInput.hidden = false;
                    field.details.hidden = true;
                    manualInput.focus();
                    render();
                    saveNow("Modo manual de Mérito selecionado.");
                    return;
                }

                character.merits[index] = field.select.value;
                if (index === 0) character.merit = field.select.value;
                renderMerits();
                document.getElementById(field.select.id)?.focus();
                saveNow("Mérito salvo.");
            });

            manualInput.addEventListener("input", () => {
                if (!writable) return;
                character.merits[index] = manualInput.value;
                if (index === 0) character.merit = manualInput.value;
                render();
                saveNow("Mérito manual salvo.");
            });

            render();
            root.append(field.root);
        }

        const add = document.getElementById("add-merit");
        add.hidden = character.mode !== "play";
        add.disabled = character.merits.includes("");
    }

    function installMeritActions() {
        document.getElementById("add-merit").addEventListener("click", () => {
            if (character.mode !== "play" || character.merits.includes("")) return;
            character.merits.push("");
            renderMerits();
            saveNow("Espaço para Mérito adicionado.");
        });
    }

    return { renderMerits, installMeritActions };
}
