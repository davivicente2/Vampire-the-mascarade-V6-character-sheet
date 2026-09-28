const HELP = {
    'character-name': 'Nome pelo qual seu personagem é conhecido. As alterações são salvas neste navegador.',
    clan: 'Define as Disciplinas, a Maldição e os Traços disponíveis. Trocar o Clã limpa os Traços selecionados; Disciplinas já preenchidas são preservadas.',
    'age-apparent': 'Idade que seu corpo aparenta, normalmente a idade do Abraço.',
    'age-actual': 'Idade total do personagem, incluindo seus anos como vampiro.',
    'embrace-date': 'Quando o personagem foi transformado em vampiro.',
    'nostalgic-decade': 'Época com a qual seu personagem mantém uma ligação emocional.',
    generation: 'Posição na linhagem vampírica. Neonatos: 11ª–13ª; Ancillae: 9ª–10ª; Elders: 6ª–8ª. O modificador é preenchido separadamente.',
    'generation-modifier': 'Neonato: 1; Ancilla: 2; Elder: 3. Reduz dano comum em Vitae (mínimo de 1 dano) e entra em várias dificuldades e efeitos. Não reduz Dano Nefasto.',
    'play-level': 'Tier da campanha. A ficha usa esse valor nos avisos de criação e requisitos de Traços. Não distribui pontos automaticamente.',
    archetype: 'Conceito geral do personagem, como investigador, artista ou sobrevivente.',
    sire: 'Quem criou ou ensinou seu personagem. A seleção define as opções de Disciplina do Sire.',
    'sire-discipline': 'Disciplina concedida pelo tipo de Sire. Escolhê-la inclui a Disciplina na ficha; distribua seu ponto manualmente.',
    'clan-special-discipline': 'Escolha entre as alternativas de Disciplina oferecidas pelo seu Clã.',
    curse: 'Maldição preenchida pelo Clã escolhido. A descrição aparece no painel do Clã.',
    'nefarious-damage': 'Bloqueia caixas de Vitae da direita para a esquerda e reduz o máximo efetivo. Todas bloqueadas: Morte Final. Cura: 5 Vitae + 1 Vontade, uma vez por noite, a partir da noite seguinte ao dano.',
    'effective-vitae': 'Máximo de Vitae disponível após subtrair o Dano Nefasto.',
    'hunger-state': '11+ Vitae: Satisfeito; 6–10: Sedento; 1–5: Faminto; 0: Torpor. Dano Nefasto em todas as caixas significa Morte Final.',
    'vitae-tracker': 'Máximo: 10 + Vigor. Clique para ajustar a Vitae atual; clicar no último ponto preenchido reduz 1. Caixas com × estão bloqueadas por Dano Nefasto. Chegar a 0 zera Quickening.',
    'willpower-tracker': 'Máximo: 5 + Autocontrole + Determinação. Clique para ajustar. Ao chegar a 0, resista ao frenesi de fúria ou aceite-o. Gastos e recuperações são registrados manualmente.',
    quickening: 'Recurso de 0 a 5. Antes de rolar: 1 por dado extra, 3 por sucesso básico com Habilidade treinada ou 5 sem treinamento. Torpor zera e impede ganhos. Excesso deve ser marcado manualmente em Besta ou Natureza.',
    'quickening-minus': 'Retira 1 Quickening. Use para registrar um gasto; não adiciona dados automaticamente à calculadora.',
    'quickening-plus': 'Adiciona 1 Quickening, até 5. Se já estiver no máximo, marque o ganho excedente em Besta ou Natureza, à sua escolha. Não pode ganhar em torpor.',
    beast: 'Impulsos do lado monstruoso, ligados ao Clã. A descrição orienta a interpretação e o Frenesi da Besta.',
    nature: 'Convicções e valores aos quais o personagem se apega. Orientam a interpretação e a Explosão da Natureza.',
    'beast-points': 'Marca a agitação da Besta, de 0 a 5. Cinco marcas exigem Autocontrole, dificuldade 3 + modificador de geração. Marcar pontos não move a escala nem recupera Vontade automaticamente.',
    'nature-points': 'Marca a agitação da Natureza, de 0 a 5. Cinco marcas exigem resistência à Explosão. Marcar pontos não move a escala nem recupera Vontade automaticamente.',
    'humanity-scale': 'Clique em um círculo disponível para corrigir a posição manualmente. Isso não resolve episódios nem altera círculos perdidos. Concluir Frenesi/Explosão aplica o passo pelas regras.',
    'humanity-losses': 'Ultrapassar o estágio 3 remove um círculo do lado oposto. Para recuperar, alcance o último círculo restante desse lado e cumpra uma nova condição de avanço; o círculo volta sem mover a posição.',
    'frenzy-trigger': 'Anote o que costuma provocar o Frenesi da Besta do seu personagem e como ele se manifesta.',
    'outburst-trigger': 'Anote os gatilhos e comportamentos da Explosão ligada à sua Natureza.',
    'clan-trait-1': 'Primeiro dos dois Traços de Clã. Confira os pré-requisitos na descrição abaixo.',
    'clan-trait-2': 'Escolha um Traço diferente do primeiro. Traços de Ancilla geram aviso se o tier for Neonate.',
    merit: 'Escolha seu Mérito. A descrição abaixo apresenta requisitos, benefícios e ativação. Usar a ativação o deixa inativo até a próxima noite; registre esse uso na mesa.',
    flaw: 'Anote sua Falha e como ela complica a vida do personagem.',
    items: 'Equipamento, objetos pessoais e outras anotações de inventário.',
    'add-resource': 'Adiciona uma linha para um Recurso, seu nível e os detalhes de quem ou do que ele representa.',
    'add-discipline': 'Adiciona uma Disciplina. Defina os pontos e escolha os poderes; os pontos não são distribuídos automaticamente.',
    'calculator-attribute': 'Primeira parte da parada de um teste comum. O valor vem dos pontos do Atributo escolhido.',
    'calculator-skill': 'Soma os pontos da Habilidade ao Atributo. Foco relevante concede +1 dado na mesa; não é somado automaticamente.',
    'calculator-difficulty': 'Quantidade de dados subtraídos da parada. O resultado mínimo é 0.',
    'calculator-result': 'Atributo + Habilidade − Dificuldade. Focos, Quickening e modificadores situacionais devem ser considerados à parte. Esta calculadora não rola dados.',
    'export-button': 'Baixa um backup JSON da ficha, incluindo focos, círculos perdidos e episódios em curso.',
    'import-file': 'Carrega um JSON de ficha e substitui o salvamento local após validar o arquivo. Exporte antes se quiser guardar a ficha atual.',
    'print-button': 'Abre a impressão do navegador; escolha salvar como PDF se quiser uma cópia digital.',
    'reset-button': 'Após confirmação, substitui a ficha local por uma nova: Atributos em 1 e demais valores iniciais. Exporte antes para guardar o personagem atual.'
};

for (const side of ['beast', 'nature']) {
    Object.assign(HELP, {
        [side + '-success']: 'Registre um teste de resistência bem-sucedido: apaga 1 das 5 marcas, sem mover a escala. Role e considere bônus na mesa antes de clicar.',
        [side + '-failure']: 'Registre uma falha: limpa as marcas e inicia o episódio. A escala só se move ao concluir o Frenesi ou a Explosão.',
        [side + '-painful']: 'Como falhar, mas também concede 1 Drama ao Narrador e exige resolver a Escolha sua Dor na mesa.',
        [side + '-accepted']: 'Aceita o impulso sem resistir: limpa as marcas e inicia o episódio. Ao concluir, recupera 2 Vontade e aplica um passo na escala.',
        [side + '-finish']: 'Use quando o episódio terminar. Aplica um passo para este lado, incluindo perda ou recuperação de círculos. Se aceitou o impulso, recupera 2 Vontade. Só funciona com episódio em curso.'
    });
}

function helpTarget(element) {
    if (!(element instanceof Element)) return null;
    const explicit = element.closest('[data-help]');
    if (explicit) return { element: explicit, text: explicit.dataset.help };
    const control = element.closest('input, select, textarea, button');
    if (!control) return null;
    const row = control.closest('.skill-row');
    if (row) return { element: control, text: control.matches('input')
        ? 'Especialização desta Habilidade: +1 dado quando for relevante ao teste. Foco 1 é liberado em 1 ponto, Foco 2 em 3 e Foco 3 em 5. Diminuir os pontos preserva os focos ocultos.'
        : 'Ajuste os pontos da Habilidade. Em 1, 3 e 5 pontos, um novo campo de Foco aparece. Clique no último ponto preenchido para reduzir 1.' };
    if (control.closest('#attributes')) return { element: control, text: 'Ajuste este Atributo, com mínimo de 1. Vigor altera o máximo de Vitae; Autocontrole e Determinação alteram o máximo de Vontade.' };
    if (control.closest('#resources')) return { element: control, text: control.title || (control.matches('button')
        ? 'Ajuste o nível deste Recurso; clicar no último ponto preenchido reduz 1.'
        : 'Descreva o Recurso ou seus detalhes: nome do contato, localização do refúgio, identidade da máscara etc.') };
    if (control.closest('#disciplines')) return { element: control, text: control.title || (control.matches('select')
        ? 'Escolha a Disciplina ou um poder disponível nos pontos atuais. Escolher um poder preenche o custo e o lembrete; o gasto é manual.'
        : control.matches('input') ? 'Custo ou lembrete do poder. Pode editar para registrar condições ou detalhes da campanha.'
        : control.textContent === '+ Poder' ? 'Adiciona outro poder à Disciplina, para escolher entre os disponíveis no nível atual.'
        : 'Ajuste os pontos da Disciplina. Poderes já escolhidos são preservados; requisitos não atendidos aparecem nos avisos.') };
    if (control.closest('#lifepaths')) return { element: control, text: 'Registre o Caminho de Vida e os benefícios escolhidos. Pontos de Habilidade, focos e Recursos devem ser preenchidos na ficha.' };
    return null;
}

export function installTooltips() {
    const tooltip = document.createElement('div');
    tooltip.id = 'sheet-tooltip';
    tooltip.className = 'sheet-tooltip no-print';
    tooltip.setAttribute('role', 'tooltip');
    tooltip.hidden = true;
    document.body.appendChild(tooltip);
    for (const [id, text] of Object.entries(HELP)) {
        const target = document.getElementById(id);
        if (target) target.dataset.help = text;
    }
    const importLabel = document.querySelector('label[for="import-file"]');
    importLabel.dataset.help = HELP['import-file'];
    importLabel.tabIndex = 0;
    importLabel.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            document.getElementById('import-file').click();
        }
    });
    // Always-available help triggers also work when related action buttons are disabled.
    for (const [id, label] of [['vitae-tracker','Vitae'], ['willpower-tracker','Vontade'],
        ['quickening','Quickening'], ['beast-points','Besta'], ['nature-points','Natureza'], ['humanity-scale','Humanidade']]) {
        const target = document.getElementById(id);
        const parent = target.closest('article');
        const heading = parent.querySelector('.tracker-header, .field-label');
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'help-trigger no-print';
        button.textContent = '?';
        button.setAttribute('aria-label', 'Ajuda: ' + label);
        button.dataset.help = HELP[id];
        heading.appendChild(button);
    }
    let active = null;
    let previousDescription = null;
    function hide() {
        if (active) {
            if (previousDescription === null) active.removeAttribute('aria-describedby');
            else active.setAttribute('aria-describedby', previousDescription);
        }
        active = null;
        tooltip.hidden = true;
    }
    function show(target) {
        if (!target) { hide(); return; }
        if (active !== target.element) {
            hide();
            active = target.element;
            previousDescription = active.getAttribute('aria-describedby');
            active.setAttribute('aria-describedby', [previousDescription, tooltip.id].filter(Boolean).join(' '));
        }
        tooltip.textContent = target.text;
        tooltip.hidden = false;
        const rect = active.getBoundingClientRect();
        const width = tooltip.offsetWidth;
        const height = tooltip.offsetHeight;
        tooltip.style.left = Math.max(8, Math.min(rect.left, window.innerWidth - width - 8)) + 'px';
        const below = rect.bottom + 8;
        tooltip.style.top = Math.max(8, below + height <= window.innerHeight - 8 ? below : rect.top - height - 8) + 'px';
    }
    document.addEventListener('pointerover', (event) => {
        if (!tooltip.contains(event.target)) show(helpTarget(event.target));
    });
    document.addEventListener('pointerout', (event) => {
        if (active && !active.contains(event.relatedTarget) && !tooltip.contains(event.relatedTarget)) hide();
    });
    document.addEventListener('focusin', (event) => show(helpTarget(event.target)));
    document.addEventListener('focusout', hide);
    document.addEventListener('click', (event) => show(helpTarget(event.target)));
    document.addEventListener('keydown', (event) => { if (event.key === 'Escape') hide(); });
    window.addEventListener('resize', hide);
    window.addEventListener('scroll', hide, true);
}
