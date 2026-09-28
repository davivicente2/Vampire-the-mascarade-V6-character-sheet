// Chapter 4: Rules of the Night — material fornecido pelo usuário.
export const humanityStages = {
    '-3': {
        name: 'Monstruoso 3',
        effects: '−3 dados para influência positiva e +3 para intimidar, assustar ou comandar; agora também contra vampiros. Influência positiva sobre mortais falha automaticamente. As exceções de Presença Predatória continuam valendo: não afeta seus ghouls, mortais ligados a você nem testes de Poder. +1 dado em Poderes de Disciplinas do Clã. Não pode resistir a frenesi de fome, medo ou fúria; +2 dados para resistir à Explosão da Natureza.',
        appearance: 'Sua condição de morto-vivo é evidente. Com Blush of Life, a pele continua fria e não há batimento; comida ou bebida provoca vômito imediato e −1 dado por náusea pelo resto da cena e a seguinte. Sexo exige 1 Vitae extra, sem prazer.'
    },
    '-2': {
        name: 'Monstruoso 2',
        effects: '−2 dados para influência positiva sobre mortais e +2 para intimidar, assustar ou comandá-los. Não afeta seus ghouls, mortais ligados a você nem testes de Poder. Separadamente, +1 dado em testes de Poder de Disciplinas do Clã.',
        appearance: 'Você parece um cadáver ambulante. Com Blush of Life, comida ou bebida provoca vômito em poucos turnos e −1 dado por náusea pelo resto da cena e a seguinte. Sexo exige 1 Vitae extra, sem prazer.'
    },
    '-1': {
        name: 'Monstruoso 1',
        effects: '−1 dado para influência positiva sobre mortais e +1 para intimidar, assustar ou comandá-los. Não afeta seus ghouls, mortais ligados a você nem testes de Poder.',
        appearance: 'Sua presença sugere um predador. Mesmo com Blush of Life, comida ou bebida provoca vômito no início da próxima cena e −1 dado em todos os testes durante aquela cena.'
    },
    '0': {
        name: 'Neutro', effects: 'Nenhum modificador de estágio.',
        appearance: 'Pele pálida, aparência de alguém recém-falecido. Blush of Life custa 1 Vitae e uma ação menor, dura a noite e permite calor corporal, batimento fraco, telas sensíveis ao toque, sexo e pequenas porções de comida ou bebida (que devem ser expelidas antes do fim da noite).'
    },
    '1': {
        name: 'Mortal 1',
        effects: '+1 dado para influência positiva sobre humanos e −1 para intimidar, assustar ou comandá-los. Não afeta seus ghouls, mortais ligados a você nem testes de Poder.',
        appearance: 'Você parece humano, com leve palidez. Com Blush of Life, pode consumir uma refeição por noite sem mal-estar; ela não nutre e deve ser expelida antes do fim da noite.'
    },
    '2': {
        name: 'Mortal 2',
        effects: '+2 dados para influência positiva sobre humanos e −2 para intimidar, assustar ou comandá-los. Não afeta seus ghouls, mortais ligados a você nem testes de Poder. O bônus de +2 também vale para influenciar ou comandar animais, inclusive com Disciplinas. +1 dado para resistir a qualquer frenesi, mas não a uma Explosão.',
        appearance: 'Apenas exame médico revela sua condição. Blush of Life não custa Vitae; permite uma refeição, batimento lento e respiração voluntária. A comida deve ser expelida antes do fim da noite.'
    },
    '3': {
        name: 'Mortal 3',
        effects: '+3 dados para influência positiva sobre humanos e −3 para intimidar, assustar ou comandá-los; mesmas exceções de Mortal 2. +3 para influenciar ou comandar animais, inclusive com Disciplinas. −1 dado em testes de Poder das suas Disciplinas. +2 para resistir a frenesis; não pode resistir à Explosão da Natureza. Dano Nefasto solar ocorre em turnos alternados; dano de fogo cai uma categoria, nunca abaixo de 1.',
        appearance: 'Você parece vivo, com leve batimento. Blush of Life não custa Vitae, permite batimento normal e duas refeições por noite; expulse a comida antes do fim da noite.'
    }
};

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
