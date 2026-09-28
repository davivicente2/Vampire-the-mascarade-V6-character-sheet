import { createDots } from "../controls.js";

export function createResources({ character, saveNow }) {
    function renderResources() {
        const root = document.getElementById("resources");
        root.replaceChildren();

        character.resources.forEach((resource, index) => {
            const row = document.createElement("div");
            row.className = "resource-row resource-row-detailed";

            const name = document.createElement("input");
            name.value = resource.name;
            name.placeholder = "Recurso";
            name.addEventListener("input", () => {
                resource.name = name.value;
                saveNow("Recurso salvo.");
            });

            const details = document.createElement("input");
            details.value = resource.details || "";
            details.placeholder = "Detalhes";
            details.addEventListener("input", () => {
                resource.details = details.value;
                saveNow("Detalhes do recurso salvos.");
            });

            const dots = createDots(resource.dots, 5, (next) => {
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

            row.append(name, dots, details, remove);
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
