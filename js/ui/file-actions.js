import { exportCharacter, importCharacter, saveCharacter } from "../storage.js";
import { normalizeCharacter, clone } from "../model/character.js";
import { EMPTY_CHARACTER } from "../../data/characters/empty.js";

export function installFileActions(character) {
    document.getElementById("export-button").addEventListener("click",()=>exportCharacter(character));
    document.getElementById("print-button").addEventListener("click",()=>window.print());

    document.getElementById("import-file").addEventListener("change", async (event) => {
        const file=event.target.files?.[0];
        if (!file) return;
        try {
            const imported = normalizeCharacter(await importCharacter(file));
            saveCharacter(imported);
            location.reload();
        } catch (error) {
            alert(error.message);
        } finally {
            event.target.value="";
        }
    });

    document.getElementById("reset-button").addEventListener("click",()=>{
        if (!confirm("Limpar toda a ficha e começar um personagem novo? A ficha atual será substituída no salvamento local.")) return;
        try {
            saveCharacter(clone(EMPTY_CHARACTER));
            location.reload();
        } catch (error) {
            alert(error.message);
        }
    });
}
