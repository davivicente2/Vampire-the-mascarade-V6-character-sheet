export function skillFocusCount(dots) {
    return [1, 3, 5].filter((threshold) => Number(dots) >= threshold).length;
}

export function normalizeSkillFocuses(skill) {
    // Preserve even unavailable slots, so lowering a rating never erases notes.
    if (Array.isArray(skill.focuses)) return [...skill.focuses];
    return String(skill.focus || "").split(/[,;\n]/).map((focus) => focus.trim()).filter(Boolean);
}
