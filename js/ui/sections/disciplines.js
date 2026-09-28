import { disciplines, getDiscipline, getAvailablePowers, getPower } from "../../../data/disciplines.js";
import { powerMechanics, legacyPowerReminder } from "../disclosure.js";
import { createDots, populateSelect } from "../controls.js";

export function createDisciplines({ character, saveNow }) {
    function renderDisciplines() {
        const root = document.getElementById("disciplines");
        root.replaceChildren();

        character.disciplines.forEach((discipline, disciplineIndex) => {
            const card = document.createElement("div");
            card.className = "discipline-card";

            const head = document.createElement("div");
            head.className = "discipline-head";

            const name = document.createElement("select");
            populateSelect(
                name,
                Object.keys(disciplines).map((disciplineName) => ({
                    value: disciplineName,
                    label: disciplineName
                })),
                discipline.name,
                "Disciplina"
            );

            if (discipline.name && !getDiscipline(discipline.name)) {
                const custom = document.createElement("option");
                custom.value = discipline.name;
                custom.textContent = discipline.name + " (personalizada)";
                custom.selected = true;
                name.appendChild(custom);
            }

            name.addEventListener("change", () => {
                discipline.name = name.value;
                discipline.powers = [{name:"", cost:"", reminder:""}];
                renderDisciplines();
                saveNow("Disciplina atualizada.");
            });

            const remove = document.createElement("button");
            remove.type = "button";
            remove.className = "icon-button no-print";
            remove.textContent = "×";
            remove.title = "Remover disciplina";
            remove.addEventListener("click", () => {
                character.disciplines.splice(disciplineIndex, 1);
                renderDisciplines();
                saveNow("Disciplina removida.");
            });

            const dots = createDots(discipline.dots, 5, (next) => {
                discipline.dots = next;
                renderDisciplines();
                saveNow("Nível da disciplina salvo.");
            }, discipline.name || "Disciplina");

            head.append(name, dots, remove);
            card.appendChild(head);

            const powers = document.createElement("div");
            powers.className = "power-list";

            discipline.powers.forEach((power, powerIndex) => {
                const row = document.createElement("div");
                row.className = "power-row";

                const powerName = document.createElement("select");
                const available = getAvailablePowers(discipline.name, discipline.dots);

                populateSelect(
                    powerName,
                    available.map((candidate) => ({
                        value: candidate.name,
                        label: "●".repeat(candidate.rank) + " " + candidate.name +
                            (candidate.maturing ? " (M)" : "")
                    })),
                    power.name,
                    "Selecione um Poder"
                );

                if (power.name && !available.some((candidate) => candidate.name === power.name)) {
                    const sourcePower = getPower(discipline.name, power.name);
                    const legacy = document.createElement("option");
                    legacy.value = power.name;
                    legacy.textContent = "⚠ " + power.name +
                        (sourcePower ? " — requer " + sourcePower.rank + " dots" : " — não catalogado");
                    legacy.selected = true;
                    powerName.appendChild(legacy);
                }

                powerName.addEventListener("change", () => {
                    power.name = powerName.value;
                    const sourcePower = getPower(discipline.name, power.name);
                    power.cost = sourcePower?.cost || "";
                    power.reminder = "";
                    renderDisciplines();
                    saveNow("Poder atualizado.");
                });

                const costReadout = document.createElement("small");
                costReadout.className = "power-cost";
                costReadout.textContent = power.cost || "Custo não informado";
                const cost = document.createElement("input");
                cost.value = power.cost || "";
                cost.placeholder = "Custo";
                cost.setAttribute("aria-label", "Custo de " + (power.name || "poder"));
                cost.addEventListener("input", () => {
                    power.cost = cost.value;
                    costReadout.textContent = power.cost || "Custo não informado";
                    saveNow("Custo salvo.");
                });

                const reminder = document.createElement("input");
                const sourcePower = getPower(discipline.name, power.name);
                // Preserve legacy serialized text, but do not present generated rules as personal notes.
                reminder.value = power.reminder === legacyPowerReminder(sourcePower) ? "" : power.reminder || "";
                reminder.placeholder = "Anotações pessoais do poder";
                reminder.setAttribute("aria-label", "Anotações de " + (power.name || "poder"));
                reminder.title = reminder.value;
                reminder.addEventListener("input", () => {
                    power.reminder = reminder.value;
                    reminder.title = reminder.value;
                    saveNow("Lembrete salvo.");
                });

                const removePower = document.createElement("button");
                removePower.type = "button";
                removePower.className = "icon-button no-print";
                removePower.textContent = "×";
                removePower.title = "Remover poder";
                removePower.addEventListener("click", () => {
                    discipline.powers.splice(powerIndex, 1);
                    renderDisciplines();
                    saveNow("Poder removido.");
                });

                const activation = document.createElement("small");
                activation.className = "power-activation";
                activation.textContent = sourcePower
                    ? "Rank " + sourcePower.rank + " · " + (sourcePower.activate || "Ativação não informada")
                    : power.name ? "⚠ Poder não catalogado" : "";
                row.append(powerName, costReadout, activation, removePower);
                const description = document.createElement("details");
                const summary = document.createElement("summary");
                summary.textContent = "Efeito e anotações";
                description.appendChild(summary);
                description.className = "power-description";
                description.id = "power-description-" + disciplineIndex + "-" + powerIndex;
                description.setAttribute("aria-live", "polite");
                powerName.setAttribute("aria-describedby", description.id);
                powerName.setAttribute("aria-label", "Poder de " + (discipline.name || "Disciplina"));

                const effect = document.createElement("p");
                const effectLabel = document.createElement("strong");
                effectLabel.textContent = "Efeito: ";
                effect.append(effectLabel, sourcePower?.description || sourcePower?.summary ||
                    (power.name ? "Este poder não tem descrição na base. Use o lembrete para anotar seu efeito."
                        : "Selecione um poder para ver o que ele faz."));
                description.appendChild(effect);

                if (sourcePower) {
                    const mechanics = document.createElement("p");
                    mechanics.className = "field-help";
                    mechanics.textContent = powerMechanics(sourcePower);
                    description.appendChild(mechanics);
                }
                const costLabel = document.createElement("label");
                const costCaption = document.createElement("span");
                costCaption.textContent = "Custo (editável)";
                costLabel.append(costCaption, cost);
                description.append(reminder, costLabel);
                row.appendChild(description);
                powers.appendChild(row);
            });

            const addPower = document.createElement("button");
            addPower.type = "button";
            addPower.className = "small-button no-print";
            addPower.textContent = "+ Poder";
            addPower.addEventListener("click", () => {
                discipline.powers.push({name:"", cost:"", reminder:""});
                renderDisciplines();
                saveNow("Novo poder criado.");
            });

            card.append(powers, addPower);
            root.appendChild(card);
        });
    }

    function addDiscipline() {
        character.disciplines.push({name:"", dots:0, powers:[{name:"",cost:"",reminder:""}]});
        renderDisciplines();
        saveNow("Nova disciplina criada.");
    }

    return { renderDisciplines, addDiscipline };
}
