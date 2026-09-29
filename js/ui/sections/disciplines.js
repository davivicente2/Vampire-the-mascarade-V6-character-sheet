import { selectionTrackMaximum, canSetRating, disciplineChoices, hasPowerSpace } from "../../model/selection-limits.js";
import { powerIssues } from "../../model/eligibility.js";
import { populateEligibleSelect } from "../eligible-select.js";
import { notePanel } from "../notes.js";
import { getAvailablePowers, getPower } from "../../../data/disciplines.js";
import { powerMechanics, legacyPowerReminder } from "../disclosure.js";
import { createDots } from "../controls.js";

export function createDisciplines({ character, saveNow, refreshEligibility }) {
    function renderDisciplines() {
        const root = document.getElementById("disciplines");
        root.replaceChildren();

        character.disciplines.forEach((discipline, disciplineIndex) => {
            const card = document.createElement("div");
            card.className = "discipline-card";

            const head = document.createElement("div");
            head.className = "discipline-head";

            const name = document.createElement("select");
            populateEligibleSelect(
                name,
                disciplineChoices(character, discipline).map((disciplineName) => ({
                    value: disciplineName,
                    label: disciplineName
                })),
                discipline.name,
                "Disciplina"
            );

            name.setAttribute("aria-label", "Disciplina " + (disciplineIndex + 1));
            name.dataset.help = character.mode === "creation"
                ? "Na criação, distribua os pontos nas Disciplinas do Clã e o ponto concedido pelo Sire. As opções já usadas em outra linha são omitidas."
                : "Disciplinas fora do Clã exigem beber ao menos 1 Vitae fresca de alguém com 1+ ponto nela para avançar. Confirme esse aprendizado na mesa. Limites em jogo dependem do tier e do Clã.";

            name.addEventListener("change", () => {
                if (name.value && !disciplineChoices(character, discipline).includes(name.value)) return;
                discipline.name = name.value;
                discipline.powers = [{name:"", cost:"", reminder:""}];
                renderDisciplines();
                refreshEligibility();
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
                refreshEligibility();
                saveNow("Disciplina removida.");
            });

            const dots = createDots(discipline.dots, selectionTrackMaximum(character, "disciplines", discipline.dots, discipline), (next) => {
                discipline.dots = next;
                renderDisciplines();
                refreshEligibility();
                saveNow("Nível da disciplina salvo.");
            }, discipline.name || "Disciplina", "dot", (next) => canSetRating(character, "disciplines", disciplineIndex, next));

            head.append(name, dots, remove);
            card.appendChild(head);

            const powers = document.createElement("div");
            powers.className = "power-list";

            discipline.powers.forEach((power, powerIndex) => {
                const row = document.createElement("div");
                row.className = "power-row";

                const powerName = document.createElement("select");
                const sourcePower = getPower(discipline.name, power.name);
                if (sourcePower) powerName.dataset.help = (sourcePower.description || sourcePower.summary || "") + " " + powerMechanics(sourcePower) + " Consulte o efeito completo e as anotações abaixo.";
                const available = hasPowerSpace(character, power) ? getAvailablePowers(discipline.name, discipline.dots)
                    .filter((candidate) => !powerIssues(character, discipline, candidate, powerIndex).length) : [];

                populateEligibleSelect(
                    powerName,
                    available.map((candidate) => ({
                        value: candidate.name,
                        label: "●".repeat(candidate.rank) + " " + candidate.name +
                            (candidate.maturing ? " (M)" : "")
                    })),
                    power.name,
                    "Selecione um Poder",
                    sourcePower ? powerIssues(character, discipline, sourcePower, powerIndex).join(" ") : "não catalogado"
                );

                powerName.addEventListener("change", () => {
                    const next = getPower(discipline.name, powerName.value);
                    if (powerName.value && (!hasPowerSpace(character, power) || !next || powerIssues(character, discipline, next, powerIndex).length)) return;
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
                    ? "Rank " + sourcePower.rank + " · " + (sourcePower.activate || "Ativação não informada") +
                        (powerIssues(character, discipline, sourcePower, powerIndex).length ? " · ⚠ " + powerIssues(character, discipline, sourcePower, powerIndex).join(" ") : "")
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
                description.append(notePanel("Anotações pessoais", reminder), costLabel);
                row.appendChild(description);
                powers.appendChild(row);
            });

            const addPower = document.createElement("button");
            addPower.type = "button";
            addPower.className = "small-button no-print";
            addPower.textContent = "+ Poder";
            addPower.disabled = !hasPowerSpace(character) || !getAvailablePowers(discipline.name, discipline.dots).some((power) => !powerIssues(character, discipline, power).length);
            addPower.dataset.help = "Adiciona um espaço para escolher um poder permitido pelos pontos da Disciplina. Na criação há um orçamento total de poderes; em jogo, poderes extras custam rank × 2 XP.";
            addPower.addEventListener("click", () => {
                if (addPower.disabled) return;
                discipline.powers.push({name:"", cost:"", reminder:""});
                renderDisciplines();
                saveNow("Novo poder criado.");
            });

            card.append(powers, addPower);
            root.appendChild(card);
        });
        document.getElementById("add-discipline").disabled = !disciplineChoices(character).length;
    }

    function addDiscipline() {
        if (!disciplineChoices(character).length) return;
        character.disciplines.push({name:"", dots:0, powers:[{name:"",cost:"",reminder:""}]});
        renderDisciplines();
        saveNow("Nova disciplina criada.");
    }

    return { renderDisciplines, addDiscipline };
}
