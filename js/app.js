import { EMPTY_CHARACTER } from "../data/characters/empty.js";
import { normalizeCharacter } from "./model/character.js";
import { loadCharacter } from "./storage.js";
import { mountSheet } from "./sheet.js";

let loadError = null;
const saved = loadCharacter((error) => { loadError = error; });
const character = normalizeCharacter(saved || EMPTY_CHARACTER);
mountSheet(character);

if (loadError) {
    document.getElementById("save-status").textContent = "Não foi possível carregar a ficha salva.";
    document.getElementById("save-detail").textContent = "Uma ficha vazia está sendo exibida. Importar um backup permite recuperar seus dados; editar esta ficha substituirá o salvamento anterior.";
}
