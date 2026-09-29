import { lifepathSkillContributions, setSkillTotal } from "../../model/lifepath-skills.js";
import { creationRules } from "../../../data/tiers.js";
import { SKILL_LABELS } from "../../../data/skills.js";
import { skillFocusCount } from "../../model/skills.js";
import { createDots } from "../controls.js";

export function createSkills({ character, saveNow, renderCalculator, onSkillsChange }) {
    function renderSkills() {
        const root = document.getElementById("skills");
        root.replaceChildren();

        const contributions = lifepathSkillContributions(character);
        for (const [key, label] of Object.entries(SKILL_LABELS)) {
            const skill = character.skills[key];
            const row = document.createElement("div");
            row.className = "skill-row";

            const name = document.createElement("span");
            name.textContent = label;
            const origin = document.createElement("small");
            origin.className = "field-help skill-origin";
            origin.textContent = contributions[key] + " dos Caminhos + " + Math.max(0, skill.dots - contributions[key]) + " adicionais";
            name.append(origin);

            const focuses = document.createElement("div");
            focuses.className = "skill-focuses";
            const count = skillFocusCount(skill.dots);
            for (let index = 0; index < count; index += 1) {
                const field = document.createElement("label");
                const caption = document.createElement("span");
                caption.textContent = "Foco " + (index + 1);
                const focus = document.createElement("input");
                focus.type = "text";
                focus.className = "skill-focus";
                focus.placeholder = "Especialização";
                focus.setAttribute("aria-label", label + " — " + caption.textContent);
                focus.value = skill.focuses[index] || "";
                focus.addEventListener("input", () => {
                    while (skill.focuses.length <= index) skill.focuses.push("");
                    skill.focuses[index] = focus.value;
                    skill.focus = skill.focuses.filter(Boolean).join(", ");
                    saveNow("Foco salvo.");
                });
                field.append(caption, focus);
                focuses.appendChild(field);
            }
            if (skill.focuses.slice(count).some(Boolean)) {
                const note = document.createElement("small");
                note.className = "field-help";
                note.textContent = "Focos acima do nível atual foram preservados e reaparecem ao recuperar os pontos.";
                focuses.appendChild(note);
            }

            const dots = createDots(skill.dots, creationRules.skillTrackDots, (next) => {
                setSkillTotal(character, key, next);
                renderSkills();
                renderCalculator();
                onSkillsChange();
                saveNow("Pontos adicionais de Habilidade salvos.");
            }, label);
            [...dots.children].forEach((button, index) => {
                const next = index + 1 === skill.dots ? index : index + 1;
                button.disabled = next < contributions[key];
            });
            if (contributions[key]) origin.title = "Para retirar pontos vindos dos Caminhos, edite a distribuição do Caminho correspondente.";
            row.append(name, dots, focuses);

            root.appendChild(row);
        }
    }

    return { renderSkills };
}
