import { ATTRIBUTE_GROUPS } from "../../../data/attributes.js";
import { SKILL_LABELS } from "../../../data/skills.js";

export function createCalculator({ character }) {
    function renderCalculator() {
        const attributeSelect = document.getElementById("calculator-attribute");
        const skillSelect = document.getElementById("calculator-skill");

        if (!attributeSelect.dataset.ready) {
            attributeSelect.innerHTML = '<option value="">—</option>';
            for (const attributes of Object.values(ATTRIBUTE_GROUPS)) {
                for (const [key,label] of attributes) {
                    const option=document.createElement("option");
                    option.value=key; option.textContent=label;
                    attributeSelect.appendChild(option);
                }
            }

            skillSelect.innerHTML = '<option value="">—</option>';
            for (const [key,label] of Object.entries(SKILL_LABELS)) {
                const option=document.createElement("option");
                option.value=key; option.textContent=label;
                skillSelect.appendChild(option);
            }

            attributeSelect.dataset.ready="1";
            skillSelect.dataset.ready="1";
        }

        const attrKey=attributeSelect.value;
        const skillKey=skillSelect.value;
        const difficulty=Math.max(0, Number(document.getElementById("calculator-difficulty").value || 0));
        const attr=attrKey ? Number(character.attributes[attrKey] || 0) : 0;
        const skill=skillKey ? Number(character.skills[skillKey]?.dots || 0) : 0;
        const result=Math.max(0, attr + skill - difficulty);

        document.getElementById("calculator-result").textContent = result + (result===1 ? " dado" : " dados");
        document.getElementById("calculator-breakdown").textContent = attr + " + " + skill + " − " + difficulty;
    }

    return { renderCalculator };
}
