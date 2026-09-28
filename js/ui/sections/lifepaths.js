import { creationFor, creationRules } from "../../../data/tiers.js";
import { emptyLifepathAllocation, visibleSlotCount } from "../../model/creation.js";
import { lifepaths, getLifepath, lifepathRequirement } from "../../../data/lifepaths.js";
import { populateSelect } from "../controls.js";

export function createLifepaths({ character, saveNow }) {
    function renderLifepathPointGroup({title, kind, options, values, count}) {
        const fieldset = document.createElement("fieldset");
        fieldset.className = "lifepath-point-group";
        fieldset.dataset.kind = kind;
        const legend = document.createElement("legend");
        legend.textContent = title;
        const list = document.createElement("div");
        list.className = "lifepath-distribution";
        const total = document.createElement("small");
        total.className = "field-help allocation-total";
        total.setAttribute("aria-live", "polite");
        const controls = [];
        // Imported options not in the catalog remain visible until the user removes them.
        const choices = [...new Set([...options, ...values.filter(Boolean)])];
        for (const choice of choices) {
            const row = document.createElement("div");
            row.className = "allocation-row";
            row.dataset.choice = choice;
            const name = document.createElement("span");
            name.textContent = choice + (options.includes(choice) ? "" : " (salvo; fora das opções)");
            const amount = document.createElement("output");
            amount.setAttribute("aria-label", title + ": pontos em " + choice);
            const minus = document.createElement("button");
            const plus = document.createElement("button");
            for (const [button, action, text] of [[minus, "minus", "−"], [plus, "plus", "+"]]) {
                button.type = "button";
                button.className = "small-button";
                button.dataset.action = action;
                button.textContent = text;
                button.setAttribute("aria-label", (action === "plus" ? "Adicionar ponto: " : "Retirar ponto: ") + choice);
                button.addEventListener("click", () => {
                    if (action === "plus") {
                        if (values.filter(Boolean).length >= count || !options.includes(choice)) return;
                        const index = values.indexOf("");
                        if (index >= 0) values[index] = choice;
                        else values.push(choice);
                    } else {
                        const index = values.lastIndexOf(choice);
                        if (index < 0) return;
                        values[index] = "";
                    }
                    update();
                    saveNow("Distribuição do Caminho salva; valores finais não foram alterados.");
                });
            }
            row.append(name, minus, amount, plus);
            list.append(row);
            controls.push({choice, amount, minus, plus});
        }
        function update() {
            const spent = values.filter(Boolean).length;
            total.textContent = "Total: " + spent + "/" + count + (spent > count ? " — excesso preservado; confira a distribuição." : "");
            for (const control of controls) {
                const dots = values.filter((value) => value === control.choice).length;
                control.amount.textContent = dots;
                control.minus.disabled = dots === 0;
                control.plus.disabled = spent >= count || !options.includes(control.choice);
            }
        }
        update();
        fieldset.append(legend, list, total);
        return fieldset;
    }

    function renderLifepaths() {
        const root = document.getElementById("lifepaths");
        root.replaceChildren();
        const normalCount = creationFor(character.identity.playLevel).lifepaths;
        const count = Math.max(visibleSlotCount(character.lifepaths, normalCount),
            character.lifepathAllocations.findLastIndex((allocation) => [...allocation.skills, ...allocation.resources].some(Boolean)) + 1);
        character.lifepaths.slice(0, count).forEach((value, index) => {
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

                const requirement = [lifepathRequirement(path, character.identity.playLevel), index >= normalCount ? "⚠ Caminho excedente para este tier; preservado." : ""].filter(Boolean).join(" ");
                help.textContent = requirement;

                const allocation = character.lifepathAllocations[index] || emptyLifepathAllocation();
                character.lifepathAllocations[index] = allocation;

                allocationRoot.append(
                    renderLifepathPointGroup({title: "Habilidades", kind: "skills", options: path.skills,
                        values: allocation.skills, count: creationRules.lifepathSkillDots}),
                    renderLifepathPointGroup({title: "Recursos", kind: "resources", options: path.resources,
                        values: allocation.resources, count: creationRules.lifepathResourceDots})
                );

                const description = document.createElement("p");
                description.textContent = path.description;
                const rules = document.createElement("p");
                rules.className = "field-help";
                rules.textContent = "Use + e − para registrar a distribuição por opção. Focos fornecidos aparecem entre parênteses; na criação, uma Habilidade não pode ultrapassar 3.";
                details.append(description, rules);
            };

            select.addEventListener("change", () => {
                character.lifepaths[index] = select.value === "__custom__" ? notes.value : select.value;
                const path = getLifepath(select.value);
                if (!path) character.lifepathAllocations[index] = emptyLifepathAllocation();
                else for (const kind of ["skills", "resources"]) {
                    character.lifepathAllocations[index][kind] = character.lifepathAllocations[index][kind].map((choice) => path[kind].includes(choice) ? choice : "");
                }
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
