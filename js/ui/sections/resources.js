import { RESOURCE_PRESETS } from "../../../data/resources.js";
import { ratingTrackMaximum } from "../../model/creation.js";
import { createDots, populateSelect } from "../controls.js";

export function createResources({ character, saveNow }) {
    function renderResources() {
        const root = document.getElementById("resources");
        root.replaceChildren();

        character.resources.forEach((resource, index) => {
            const row = document.createElement("div");
            row.className = "resource-row resource-row-detailed";

            const nameField = document.createElement("div");
            const preset = document.createElement("select");
            preset.setAttribute("aria-label", "Tipo de Recurso " + (index + 1));
            const known = RESOURCE_PRESETS.some(([name]) => name === resource.name);
            populateSelect(preset, [...RESOURCE_PRESETS.map(([name]) => ({value:name, label:name})),
                {value:"__custom__", label:"Outro / personalizado"}], known ? resource.name : resource.name ? "__custom__" : "", "Selecione um Recurso");
            const name = document.createElement("input");
            name.value = resource.name;
            name.placeholder = "Nome do Recurso";
            name.setAttribute("aria-label", "Nome personalizado do Recurso " + (index + 1));
            name.hidden = preset.value !== "__custom__";
            name.addEventListener("input", () => {
                resource.name = name.value;
                saveNow("Recurso salvo.");
            });
            preset.addEventListener("change", () => {
                resource.name = preset.value === "__custom__" ? name.value : preset.value;
                name.hidden = preset.value !== "__custom__";
                details.placeholder = RESOURCE_PRESETS.find(([name]) => name === resource.name)?.[1] || "Detalhes";
                saveNow("Tipo de Recurso salvo; detalhes preservados.");
            });
            nameField.append(preset, name);

            const details = document.createElement("input");
            details.value = resource.details || "";
            details.placeholder = RESOURCE_PRESETS.find(([name]) => name === resource.name)?.[1] || "Detalhes";
            details.setAttribute("aria-label", "Detalhes do Recurso " + (index + 1));
            details.addEventListener("input", () => {
                resource.details = details.value;
                saveNow("Detalhes do recurso salvos.");
            });

            const dots = createDots(resource.dots, ratingTrackMaximum(character, resource.dots), (next) => {
                resource.dots = next;
                renderResources();
                saveNow("Nível do recurso salvo.");
            }, "Nível de " + (resource.name || "recurso"));

            const remove = document.createElement("button");
            remove.type = "button";
            remove.className = "icon-button no-print";
            remove.textContent = "×";
            remove.title = "Remover recurso";
            remove.addEventListener("click", () => {
                character.resources.splice(index, 1);
                renderResources();
                saveNow("Recurso removido.");
            });

            row.append(nameField, dots, details, remove);
            root.appendChild(row);
        });
    }

    function addResource() {
        character.resources.push({name:"", dots:0, details:""});
        renderResources();
        saveNow("Novo recurso criado.");
    }

    return { renderResources, addResource };
}
