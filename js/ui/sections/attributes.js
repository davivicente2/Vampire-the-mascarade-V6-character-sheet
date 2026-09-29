import { selectionTrackMaximum, canSetRating } from "../../model/selection-limits.js";
import { ATTRIBUTE_GROUPS } from "../../../data/attributes.js";
import { clampCoreResources } from "../../model/resources.js";
import { createDots } from "../controls.js";
import { ATTRIBUTE_HELP } from "../help-text.js";

export function createAttributes({ character, saveNow, renderCoreResources, renderCalculator, refreshEligibility }) {
    function renderAttributes() {
        const root = document.getElementById("attributes");
        root.replaceChildren();

        for (const [groupKey, attributes] of Object.entries(ATTRIBUTE_GROUPS)) {
            const group = document.createElement("div");
            group.className = "attribute-group";

            const title = document.createElement("h3");
            title.textContent = groupKey === "physical" ? "Físicos" : groupKey === "social" ? "Sociais" : "Mentais";
            group.appendChild(title);

            for (const [key, label] of attributes) {
                const row = document.createElement("div");
                row.className = "dot-row";
                const name = document.createElement("span");
                name.className = "dot-label";
                name.textContent = label;
                name.tabIndex = 0;
                name.dataset.help = ATTRIBUTE_HELP[key] + " Todos os Atributos começam em 1. Na criação, os grupos devem caber nos três orçamentos do tier.";
                row.append(name, createDots(character.attributes[key], selectionTrackMaximum(character, "attributes", character.attributes[key]), (next) => {
                    character.attributes[key] = Math.max(1, next);
                    clampCoreResources(character);
                    renderAttributes();
                    renderCoreResources();
                    renderCalculator();
                    refreshEligibility();
                    saveNow("Atributo salvo.");
                }, label, "dot", (next) => canSetRating(character, "attributes", key, next)));
                group.appendChild(row);
            }

            root.appendChild(group);
        }
    }

    return { renderAttributes };
}
