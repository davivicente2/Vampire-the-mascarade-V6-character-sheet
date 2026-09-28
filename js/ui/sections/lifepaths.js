import { lifepaths, getLifepath, lifepathRequirement } from "../../../data/lifepaths.js";
import { populateSelect } from "../controls.js";

export function createLifepaths({ character, saveNow }) {
    function emptyLifepathAllocation() {
        return {skills:["","","","",""], resources:["","",""]};
    }

    function renderLifepathPointGroup({title, className, options, values, count, onChange}) {
        const fieldset = document.createElement("fieldset");
        fieldset.className = "lifepath-point-group";
        const legend = document.createElement("legend");
        legend.textContent = title + " · " + count + " pontos";
        fieldset.appendChild(legend);
        const grid = document.createElement("div");
        grid.className = "lifepath-choice-grid";

        for (let point = 0; point < count; point += 1) {
            const label = document.createElement("label");
            const caption = document.createElement("span");
            caption.textContent = "Ponto " + (point + 1);
            const select = document.createElement("select");
            select.className = className;
            populateSelect(select, options.map((option) => ({value:option, label:option})), values[point] || "", "—");
            select.addEventListener("change", () => onChange(point, select.value));
            label.append(caption, select);
            grid.appendChild(label);
        }
        fieldset.appendChild(grid);
        return fieldset;
    }

    function renderLifepaths() {
        const root = document.getElementById("lifepaths");
        root.replaceChildren();
        while (character.lifepaths.length < 2) character.lifepaths.push("");
        while (character.lifepathAllocations.length < 2) character.lifepathAllocations.push(emptyLifepathAllocation());

        character.lifepaths.slice(0, 2).forEach((value, index) => {
            const card = document.createElement("div");
            card.className = "lifepath-card";
            const label = document.createElement("label");
            const caption = document.createElement("span");
            caption.textContent = "Caminho de Vida " + (index + 1);
            const select = document.createElement("select");
            select.id = "lifepath-" + index;
            const selected = getLifepath(value);
            const custom = Boolean(value && !selected);
            populateSelect(select, [
                ...lifepaths.map((path) => ({ value: path.name, label: path.name + " · " + ({ mortal: "Mortal", neonate: "Neonate+", ancilla: "Ancilla+" }[path.tier]) })),
                { value: "__custom__", label: "Personalizado" }
            ], custom ? "__custom__" : selected?.name || "", "Selecione um Caminho");
            label.append(caption, select);

            const help = document.createElement("small");
            help.id = "lifepath-help-" + index;
            help.className = "field-help lifepath-help";
            help.setAttribute("aria-live", "polite");
            select.setAttribute("aria-describedby", help.id);

            const notes = document.createElement("textarea");
            notes.rows = 3;
            notes.setAttribute("aria-label", "Caminho de Vida personalizado " + (index + 1));
            notes.placeholder = "Nome, história, cinco Habilidades e três Recursos";
            notes.value = custom ? value : "";

            const allocationRoot = document.createElement("div");
            allocationRoot.id = "lifepath-allocation-" + index;
            allocationRoot.className = "lifepath-allocations";

            const details = document.createElement("details");
            details.className = "lifepath-details";
            const detailsSummary = document.createElement("summary");
            detailsSummary.textContent = "Descrição e regras";
            details.appendChild(detailsSummary);

            const renderDetails = () => {
                allocationRoot.replaceChildren();
                details.replaceChildren(detailsSummary);
                const path = getLifepath(select.value);
                const isCustom = select.value === "__custom__";
                notes.hidden = !isCustom;
                allocationRoot.hidden = !path;
                details.hidden = !path;

                if (!path) {
                    help.textContent = isCustom ? "Caminho personalizado: descreva abaixo as opções combinadas com o Narrador." : "";
                    return;
                }

                const requirement = lifepathRequirement(path, character.identity.playLevel);
                help.textContent = requirement;

                const allocation = character.lifepathAllocations[index] || emptyLifepathAllocation();
                allocation.skills = allocation.skills.map((choice) => path.skills.includes(choice) ? choice : "");
                allocation.resources = allocation.resources.map((choice) => path.resources.includes(choice) ? choice : "");
                character.lifepathAllocations[index] = allocation;

                allocationRoot.append(
                    renderLifepathPointGroup({
                        title: "Habilidades", className: "lifepath-skill-choice",
                        options: path.skills, values: allocation.skills, count: 5,
                        onChange: (point, choice) => {
                            character.lifepathAllocations[index].skills[point] = choice;
                            saveNow("Distribuição de Habilidades do Caminho salva.");
                        }
                    }),
                    renderLifepathPointGroup({
                        title: "Recursos", className: "lifepath-resource-choice",
                        options: path.resources, values: allocation.resources, count: 3,
                        onChange: (point, choice) => {
                            character.lifepathAllocations[index].resources[point] = choice;
                            saveNow("Distribuição de Recursos do Caminho salva.");
                        }
                    })
                );

                const description = document.createElement("p");
                description.textContent = path.description;
                const rules = document.createElement("p");
                rules.className = "field-help";
                rules.textContent = "Repita uma opção para investir mais de 1 ponto nela. Focos fornecidos aparecem entre parênteses; na criação, uma Habilidade não pode ultrapassar 3.";
                details.append(description, rules);
            };

            select.addEventListener("change", () => {
                character.lifepaths[index] = select.value === "__custom__" ? notes.value : select.value;
                // renderDetails drops only allocations unavailable in the new path.
                if (!getLifepath(select.value)) character.lifepathAllocations[index] = emptyLifepathAllocation();
                renderDetails();
                saveNow("Caminho de Vida salvo.");
            });
            notes.addEventListener("input", () => {
                character.lifepaths[index] = notes.value;
                saveNow("Caminho personalizado salvo.");
            });

            renderDetails();
            card.append(label, help, allocationRoot, details, notes);
            root.appendChild(card);
        });
    }

    return { renderLifepaths };
}
