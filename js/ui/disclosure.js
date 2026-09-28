// Presentation only: excerpts always come from the existing rule data.
// An ellipsis means the excerpt is incomplete; the full available text stays in details.
export function rulePreview(text = '', limit = 135) {
    if (text.length <= limit) return text;
    const end = text.lastIndexOf(' ', limit);
    return text.slice(0, end > 0 ? end : limit).trimEnd() + '…';
}

export function powerMechanics(power) {
    if (!power) return '';
    return [power.type, power.attribute ? 'Atributo: ' + power.attribute : '',
        power.difficulty ? 'Dificuldade: ' + power.difficulty : '',
        power.distance ? 'Distância: ' + power.distance : '',
        power.duration ? 'Duração: ' + power.duration : ''].filter(Boolean).join(' · ');
}

// Only used to recognize auto-generated reminders from older exports.
export function legacyPowerReminder(power) {
    return power ? [powerMechanics(power), power.summary].filter(Boolean).join(' — ') : '';
}
