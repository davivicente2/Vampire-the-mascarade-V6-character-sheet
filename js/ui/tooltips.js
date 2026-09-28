import { HELP } from "./help-text.js";

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
        ? 'Escolha a Disciplina ou um poder disponível nos pontos atuais. Escolher um poder preenche o custo; o gasto é manual. Abra “Efeito e anotações” para consultar os detalhes.'
        : control.matches('input') ? 'Custo ou lembrete do poder. Pode editar para registrar condições ou detalhes da campanha.'
        : control.textContent === '+ Poder' ? 'Adiciona outro poder à Disciplina, para escolher entre os disponíveis no nível atual.'
        : 'Ajuste os pontos da Disciplina. Poderes já escolhidos são preservados; requisitos não atendidos aparecem nos avisos.') };
    if (control.closest('#lifepaths')) return { element: control, text: 'Escolha um Caminho e confira abaixo suas Habilidades, focos e Recursos. Distribua manualmente 5 pontos de Habilidade e 3 de Recursos por Caminho. Personalizado preserva seu texto livre.' };
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
