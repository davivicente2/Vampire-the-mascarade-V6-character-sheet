import { rulesReference } from "../../../data/rules.js";

export function renderRulesReference() {
    const root = document.getElementById("rules-reference");
    for (const [title, paragraphs] of rulesReference) {
        const section = document.createElement("details");
        const summary = document.createElement("summary");
        summary.textContent = title;
        section.appendChild(summary);
        for (const text of paragraphs) {
            const p = document.createElement("p");
            p.textContent = text;
            section.appendChild(p);
        }
        root.appendChild(section);
    }
}
