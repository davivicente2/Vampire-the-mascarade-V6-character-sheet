import { populateSelect } from "./controls.js";

// Unavailable catalog options are omitted. An incompatible saved choice stays
// visible as a disabled option, so changing prerequisites never erases data.
export function populateEligibleSelect(select, options, saved, placeholder, savedIssue = "") {
    populateSelect(select, options, saved, placeholder);
    if (saved && !options.some((option) => option.value === saved)) {
        const legacy = document.createElement("option");
        legacy.value = saved;
        legacy.textContent = "⚠ " + saved + " — " + (savedIssue || "salvo; indisponível");
        legacy.disabled = true;
        legacy.selected = true;
        select.append(legacy);
    }
}
