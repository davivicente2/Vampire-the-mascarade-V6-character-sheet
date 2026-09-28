export function validateCharacter(character) {
    const warnings = [];

    if (!character.identity.name.trim()) {
        warnings.push("O personagem ainda não tem nome.");
    }

    if (character.identity.playLevel === "neonate") {
        const attributePools = [
            character.attributes.strength + character.attributes.dexterity + character.attributes.stamina - 3,
            character.attributes.charisma + character.attributes.manipulation + character.attributes.composure - 3,
            character.attributes.intelligence + character.attributes.wits + character.attributes.resolve - 3
        ].sort((a, b) => a - b);

        if (attributePools.join(",") !== "3,5,7") {
            warnings.push(
                "A distribuição atual de Atributos não corresponde aos grupos 7 / 5 / 3 de um Neonate."
            );
        }

        const skillDots = Object.values(character.skills)
            .reduce((total, skill) => total + Number(skill.dots || 0), 0);

        if (skillDots !== 18) {
            warnings.push(
                "A ficha tem " + skillDots + " pontos de Habilidade. Com dois Caminhos de Vida, um Neonate normalmente totaliza 18."
            );
        }

        const disciplineDots = character.disciplines
            .reduce((total, discipline) => total + Number(discipline.dots || 0), 0);

        if (disciplineDots !== 4) {
            warnings.push(
                "A ficha tem " + disciplineDots + " pontos de Disciplina. Um Neonate recebe 3 pontos de clã + 1 ponto do Sire."
            );
        }

        const powers = character.disciplines
            .flatMap((discipline) => discipline.powers || [])
            .filter((power) => {
                const name = typeof power === "string" ? power : power?.name;
                return Boolean(name && name.trim().length > 0);
            });

        if (powers.length !== 4) {
            warnings.push(
                "A ficha tem " + powers.length + " Poderes de Disciplina preenchidos. Um Neonate escolhe 4."
            );
        }

        const resourceDots = character.resources
            .reduce((total, resource) => total + Number(resource.dots || 0), 0);

        if (resourceDots !== 9) {
            warnings.push(
                "A ficha tem " + resourceDots + " pontos de Recursos. Dois Caminhos de Vida + os 3 pontos de Neonate normalmente totalizam 9."
            );
        }
    }

    const hasDivineImage = character.clanTraits.some((trait) =>
        trait.toLowerCase().includes("divine image")
    );

    if (hasDivineImage && character.identity.playLevel === "neonate") {
        warnings.push(
            "Divine Image pede Ancilla ou mais forte. Mantenha apenas se o Narrador autorizou uma exceção de playtest."
        );
    }

    return warnings;
}
