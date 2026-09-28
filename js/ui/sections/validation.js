import { validateCharacter } from "../../model/validation.js";

export function createValidation({ character }) {
    function renderValidation() {
        const warnings = validateCharacter(character);
        const summary = document.getElementById("validation-summary");
        const root = document.getElementById("validation-list");
        root.replaceChildren();

        if (!warnings.length) {
            summary.innerHTML='<span class="validation-ok">Sem avisos de criação.</span>';
            const p=document.createElement("p");
            p.className="validation-ok";
            p.textContent="A validação automática não encontrou pendências nas regras atualmente verificadas.";
            root.appendChild(p);
            return;
        }

        summary.innerHTML='<span class="validation-count">' + warnings.length + ' aviso(s)</span>';
        const ul=document.createElement("ul");
        ul.className="validation-list";
        for (const warning of warnings) {
            const li=document.createElement("li");
            li.className="validation-warning";
            li.textContent=warning;
            ul.appendChild(li);
        }
        root.appendChild(ul);
    }

    return { renderValidation };
}
