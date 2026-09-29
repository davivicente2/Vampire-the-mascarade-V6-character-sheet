const noteFields = [
    ["backstory", "Backstory — história do personagem", "Vida mortal, Abraço e noites que definiram o personagem."],
    ["appearance", "Aparência e interpretação", "Descrição, gestos, voz e hábitos."],
    ["relationships", "Relações e vínculos", "Coterie, Sire, aliados, rivais e pessoas importantes."],
    ["chronicle", "Crônica e sessões", "Acontecimentos, pistas, promessas e planos."],
    ["general", "Outras anotações", "Informações livres para consultar durante a sessão."]
];

export function refreshNotePanel(panel) {
    const summary = panel.querySelector(":scope > summary");
    let status = summary.querySelector(".note-status");
    if (!status) { status = document.createElement("small"); status.className = "note-status"; summary.append(status); }
    const filled = [...panel.querySelectorAll("input, textarea")].some((field) => field.value.trim());
    status.textContent = filled ? " · preenchido" : "";
}

export function notePanel(label, content) {
    const panel = document.createElement("details");
    panel.className = "note-panel";
    const summary = document.createElement("summary");
    summary.textContent = label;
    panel.append(summary, content);
    refreshNotePanel(panel);
    return panel;
}

export function installNotes({ character, saveNow }) {
    const dialog = document.getElementById("notes-dialog");
    const root = document.getElementById("character-notes");
    const print = document.getElementById("notes-print");
    function renderPrint() {
        print.replaceChildren();
        for (const [key, title] of noteFields) {
            if (!character.notes[key].trim()) continue;
            const heading = document.createElement("h3"); heading.textContent = title;
            const text = document.createElement("p"); text.textContent = character.notes[key];
            print.append(heading, text);
        }
        print.hidden = !print.childElementCount;
    }
    for (const [key, title, help] of noteFields) {
        const label = document.createElement("label");
        const caption = document.createElement("span"); caption.textContent = title;
        const field = document.createElement("textarea");
        field.id = "notes-" + key;
        field.rows = 6;
        field.value = character.notes[key];
        field.dataset.help = help + " Salvo automaticamente; fechar a janela não apaga o texto.";
        label.append(caption, field);
        const panel = notePanel(title, label);
        if (key === "backstory") panel.open = true;
        field.addEventListener("input", () => {
            character.notes[key] = field.value;
            renderPrint();
            saveNow("Anotações salvas.");
        });
        root.append(panel);
    }
    document.getElementById("notes-button").addEventListener("click", () => dialog.showModal());
    document.getElementById("notes-close").addEventListener("click", () => dialog.close());
    document.querySelectorAll(".note-panel").forEach(refreshNotePanel);
    document.addEventListener("input", (event) => {
        const panel = event.target.closest(".note-panel");
        if (panel) refreshNotePanel(panel);
    });
    // Print filled collapsible notes without changing their normal open state.
    const printStates = new Map();
    window.addEventListener("beforeprint", () => {
        document.querySelectorAll(".note-panel").forEach((panel) => {
            printStates.set(panel, panel.open);
            if ([...panel.querySelectorAll("input,textarea")].some((field) => field.value.trim())) panel.open = true;
        });
    });
    window.addEventListener("afterprint", () => { for (const [panel, open] of printStates) panel.open = open; printStates.clear(); });
    renderPrint();
}
