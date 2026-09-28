# Revisão de UX — ficha V6

Base: `027207b0fe0db397cea7bf91bfcb6c59bc1b70e1`. Este documento registra a rodada de UX; mudanças posteriores de schema e criação estão em [Criação e migrações](creation-and-migrations.md).

## Auditoria e alterações

- A Maldição aparecia em um campo somente leitura e no painel do Clã. O painel mantém nome, trecho curto e descrição expansível; o campo repetido foi removido.
- O Frenesi tinha duas descrições completas. Agora o Clã oferece um trecho e um link que abre a referência única junto à Besta.
- Natureza mantém descrição curta e nome da Explosão; indulgência e efeito ficam recolhidos. As anotações pessoais continuam independentes.
- Traços mantêm os dois seletores, pré-requisitos e avisos de tier visíveis. Mérito mostra pré-requisitos e um trecho curto. A regra disponível fica em `details`.
- O Sire mostra escolha e Disciplina, com sua descrição disponível em painel recolhido.
- Poderes mantêm seleção, rank, custo e ativação visíveis. Efeito, demais parâmetros, anotações e edição do custo ficam recolhidos. Custos podem quebrar linha para não cortar a unidade.
- O texto de regras não é mais copiado para novos lembretes editáveis. Lembretes antigos que coincidam exatamente com o texto gerado ficam preservados no JSON, mas não aparecem como anotações pessoais. Textos personalizados continuam visíveis ao abrir o painel.
- Instruções gerais de Humanidade e aparência ficam recolhidas; escala, efeitos atuais, agitação e ações condicionais permanecem. A tabela genérica de regras repetidas foi removida; a consulta do capítulo 4 continua recolhida.
- O aviso de requisito de Lifepath deixa de ser repetido dentro da descrição. Ao trocar o Caminho, apenas alocações incompatíveis são apagadas. Valores finais de Habilidades e Recursos não são recalculados.
- Ao trocar Sire, a Disciplina anterior é mantida quando válida. Disciplinas e poderes já investidos continuam preservados.

## Arquitetura e compatibilidade

`js/ui/disclosure.js` apenas formata dados existentes; não contém novas regras. Trechos com reticências são recortes de apresentação, não novas interpretações. As descrições continuam em `data/`, sem duplicar uma base de regras na interface.

Não foram criados campos de personagem nem alterados o formato de exportação, a versão ou `assertCharacter`. Campos antigos, inclusive `identity.curse` e lembretes gerados, permanecem aceitos. Os módulos continuam relativos e sem build ou dependências novas, compatíveis com hospedagem em subdiretórios como GitHub Pages.

## Limitações de regra preservadas

Os textos disponíveis na base são resumos, não uma transcrição integral nem tradução oficial. Tooltips que explicam botões são instruções da interface. Anotações editáveis são do jogador.

- Resolvido na rodada de criação por tier: Boiling Passion é aplicado pelo modelo de Frenesi; Explosão da Natureza não recebe o modificador.
- O Chapter 5 completo não foi fornecido. Nenhum poder foi completado ou reinterpretado. Os detalhes mostram apenas os dados já catalogados; poderes personalizados indicam a ausência de catálogo.
- Esclarecido na rodada de criação por tier: os limites gerais de criação e os limites de Disciplinas durante o jogo são tratados separadamente.

## Verificação

As suítes `tests/humanity-browser.js` e `tests/disclosure-browser.js` exercitam regras existentes, painéis recolhidos, seletores dependentes, preservação de dados, contagem de gravações para detectar listeners duplicados, reload real e exportação/importação via os controles da ficha, incluindo JSON parcial antigo. Use um perfil temporário conforme o README.
