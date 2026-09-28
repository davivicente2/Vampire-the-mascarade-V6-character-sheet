import { ratingTrackMaximum } from "../../model/creation.js";
import { ATTRIBUTE_GROUPS } from "../../../data/attributes.js";
import { clampCoreResources } from "../../model/resources.js";
import { createDots } from "../controls.js";

export function createAttributes({ character, saveNow, renderCoreResources, renderCalculator }) {
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
                row.append(name, createDots(character.attributes[key], ratingTrackMaximum(character, character.attributes[key]), (next) => {
                    character.attributes[key] = Math.max(1, next);
                    clampCoreResources(character);
                    renderAttributes();
                    renderCoreResources();
                    renderCalculator();
                    saveNow("Atributo salvo.");
                }, label));
                group.appendChild(row);
            }

            root.appendChild(group);
        }
    }

    return { renderAttributes };
}
