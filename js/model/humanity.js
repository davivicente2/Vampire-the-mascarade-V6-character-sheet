export function humanityBounds(character) {
    return { min: -3 + character.lostBeastCircles, max: 3 - character.lostNatureCircles };
}

// Only explicit shifts call this; marking tracker boxes never moves the scale.
export function shiftHumanity(character, direction) {
    if (character.humanityFate) return;
    const { min, max } = humanityBounds(character);
    const target = character.humanityPosition + direction;
    if (target >= min && target <= max) {
        character.humanityPosition = target;
        return;
    }
    const recovering = direction < 0 ? 'lostBeastCircles' : 'lostNatureCircles';
    if (character[recovering] > 0) {
        character[recovering] -= 1;
        return; // Recover the circle without moving into it.
    }
    const opposite = direction < 0 ? 'lostNatureCircles' : 'lostBeastCircles';
    if (character[opposite] < 3) character[opposite] += 1;
    else character.humanityFate = direction < 0 ? 'wight' : 'departure';
}

export function resistancePool(character, side) {
    const position = character.humanityPosition;
    const difficulty = 3 + Number(character.identity.generationModifier || 0);
    const bonus = (character.currentVitae >= 11 ? 1 : 0) +
        (side === 'beast' && position >= 2 ? position - 1 : 0) +
        (side === 'nature' && position === -3 ? 2 : 0);
    const canResist = !(side === 'nature' && position === 3);
    return { difficulty, bonus, canResist, dice: Math.max(0,
        Number(character.attributes.composure) + Number(character.attributes.resolve) + bonus - difficulty) };
}


export function humanityState(character) {
    const difficulty = 3 + Number(character.identity.generationModifier || 0);
    const states = [];
    if (character.beastEpisode) states.push("FRENESI DA BESTA EM CURSO");
    else if (character.beastPoints >= 5) states.push("⚠ FRENESI DA BESTA: Autocontrole + Determinação, dificuldade " + difficulty);
    else if (character.beastPoints >= 3) states.push("BESTA AGITADA");
    if (character.natureEpisode) states.push("EXPLOSÃO EM CURSO");
    else if (character.naturePoints >= 5) states.push("⚠ EXPLOSÃO: Autocontrole + Determinação, dificuldade " + difficulty);
    else if (character.naturePoints >= 3) states.push("NATUREZA AGITADA");
    return states.join(" · ") || "ESTÁVEL";
}
