// Resumos em português do trecho de criação enviado pelo usuário.
export const natures = [
    { name: 'Autocrat', description: 'Busca poder, controle e uma posição de comando.',
      indulging: 'Dê ordens, assuma a liderança, descarte sugestões ou decida pelos outros sem consultá-los.',
      outburst: 'Listen to Me', effect: 'Não pode usar poderes físicos de Disciplina. Escolha dois alvos visíveis, pelo menos um NPC, e diga o que cada um deve fazer no turno dele. Para cada alvo que agir de outro modo, sofra uma penalidade igual ao modificador de geração em todos os testes.' },
    { name: 'Bon Vivant', description: 'Busca prazer e diversão no presente, sabendo que a existência é passageira.',
      indulging: 'Busque sangue de pessoas intoxicadas, deixe obrigações por festas ou convença outros a participar de uma diversão frívola.',
      outburst: 'Seek Fun', effect: 'Não pode usar poderes mentais de Disciplina. Precisa combater o tédio: sofra −1 dado cumulativo cada vez que repetir uma ação ou teste já realizado nesta cena. Atacar conta como uma ação diferente quando o alvo é diferente a cada vez.' },
    { name: 'Bravo', description: 'Acredita no domínio dos fortes e procura ser o mais forte ao redor.',
      indulging: 'Use força e poderes para impor medo e obediência, explore os fracos ou desafie alguém para provar sua superioridade.',
      outburst: 'Rule of Might', effect: 'Não pode usar poderes sociais ou mentais de Disciplina. Deve impor obediência pela força. Receba um bônus igual ao modificador de geração em testes para subjugar, atacar, intimidar ou agir agressivamente contra o indivíduo mais forte que consegue ver. Todas as outras ações sofrem uma penalidade igual ao dobro desse modificador.' },
    { name: 'Gallant', description: 'Busca atenção, admiração e a oportunidade de ser a estrela do ambiente.',
      indulging: 'Atraia olhares, faça entradas marcantes e explique aos outros por que você é importante.',
      outburst: 'Showstopper', effect: 'Não pode usar poderes mentais de Disciplina. Deve chamar a atenção do maior número possível de criaturas. Não pode se esconder, desaparecer nas sombras ou falar abaixo de um grito. No início de cada turno, escolha um inimigo visível: até seu próximo turno, ele ganha um bônus igual ao dobro do seu modificador de geração em testes para notar, atacar ou interagir com você.' },
    { name: 'Perfectionist', description: 'Exige execução impecável, dedicação e atenção aos detalhes.',
      indulging: 'Dedique horas a aperfeiçoar uma tarefa, critique pequenos erros ou examine as próprias falhas para corrigi-las.',
      outburst: 'Perfectionism', effect: 'Não pode usar poderes sociais de Disciplina. Se falhou em um teste no turno anterior, deve repeti-lo. Caso contrário, tente corrigir um teste em que um aliado falhou no turno anterior dele; não repita simplesmente sua última ação. Se não houve falhas ou for impossível repeti-las, pode agir livremente, mas sofre uma penalidade igual ao modificador de geração em todos os testes.' },
    { name: 'Romantic', description: 'Encontra sentido em amar e ser amado, podendo idealizar romances.',
      indulging: 'Impressione alguém, crie vínculos, arrisque-se por um interesse romântico ou deixe obrigações para estar perto de quem ama.',
      outburst: 'Romantic Sacrifice', effect: 'Não pode usar poderes mentais de Disciplina. Deve proteger, impressionar ou beneficiar um interesse romântico. Receba um bônus igual ao modificador de geração para proteger ou beneficiar essa pessoa; dobre o bônus se a ação colocar você em perigo ou comprometer seu objetivo original. Testes sem relação com essas atividades sofrem uma penalidade igual ao dobro do modificador.' },
    { name: 'Scientist', description: 'Examina a existência como um quebra-cabeça, procurando padrões com rigor e método.',
      indulging: 'Observe e aponte padrões, interprete comportamentos e procure uma explicação coerente para a situação.',
      outburst: 'Critical Eye', effect: 'Não pode usar poderes sociais de Disciplina. Sofre uma penalidade igual ao modificador de geração em todos os testes, distraído pelos detalhes. Se rolar um 10 antes do fim da Explosão, perceberá um novo detalhe quando ela terminar; o Narrador decide qual.' },
    { name: 'Survivor', description: 'Recusa a derrota e luta para sobreviver e melhorar sua posição.',
      indulging: 'Prepare-se para ameaças, evite riscos desnecessários e ajude outros a escapar da ruína.',
      outburst: 'Survivor’s Instinct', effect: 'Não pode usar poderes sociais de Disciplina e deve priorizar sua defesa. Receba um bônus igual ao modificador de geração para defender-se, fugir do perigo ou esconder-se. Ataques, testes ofensivos e testes que atraiam atenção extra sofrem uma penalidade igual ao dobro desse modificador.' }
];

export function getNature(value) {
    const name = String(value || '').split(' — ')[0].trim().toLowerCase();
    return natures.find((nature) => nature.name.toLowerCase() === name) || null;
}
