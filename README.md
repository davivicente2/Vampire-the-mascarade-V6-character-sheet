# Vampire V6 — Ficha de personagem

Protótipo de ficha editável para o playtest de Vampire: The Masquerade V6, com salvamento no navegador, importação/exportação JSON e impressão.

## Executar localmente

Na pasta do projeto, execute:

```sh
python3 -m http.server 8000
```

Abra http://localhost:8000 no navegador. Também é possível usar a extensão Live Server do VS Code. Abrir `index.html` diretamente pelo gerenciador de arquivos impede o carregamento dos módulos JavaScript em navegadores comuns.

Não há etapa de compilação nem dependências de npm. Na primeira abertura, a ficha de exemplo é exibida; use **Nova ficha** para começar em branco.

## Dados da ficha

As alterações ficam no armazenamento local do navegador, associado ao endereço usado para abrir o projeto. Use **Exportar JSON** para fazer backups ou transferir a ficha entre navegadores e endereços. **Importar JSON** substitui a ficha salva após validar o arquivo. Se o navegador bloquear o armazenamento, exporte suas alterações antes de fechar a página.

Site publicado: https://davivicente2.github.io/Vampire-the-mascarade-V6-character-sheet/

## Regras da Noite e Humanidade

A ficha mostra os efeitos dos sete estágios de Humanidade. Marcar Besta/Natureza não move a escala. Com cinco marcas, registre o resultado do teste: sucesso apaga uma marca; falha, falha dolorosa ou aceitação inicia um episódio. Concluir o episódio move a escala uma vez; aceitar voluntariamente também recupera 2 Vontade ao final.

Concluir um episódio aplica o passo determinado pelas regras, inclusive perda/recuperação de círculos. Para corrigir a posição manualmente, clique em um círculo disponível da escala. A atividade alinhada continua dependendo das condições narrativas e do limite de uma vez por sessão, conferidos pelo jogador. Os efeitos exibidos são lembretes: não alteram automaticamente a calculadora de testes. Episódios em curso, círculos perdidos e encerramento da jornada acompanham o JSON da ficha.

A seção **Consulta — Regras da Noite** reúne resumos de testes, ações, dano, alimentação, Laço de Sangue, Blood Surge, condições e downtime. Custos, passagem de cenas/noites e excesso de Quickening continuam sob controle manual. Há uma divergência nos textos fornecidos sobre o limite de Disciplinas de Ancilla, indicada na consulta.

## Verificação no navegador

O arquivo `tests/humanity-browser.js` testa regras e interações da página, incluindo perda/recuperação de círculos, resolução de episódios, torpor e limites. Use um perfil temporário de navegador: o teste modifica a ficha local desse perfil.

Com o servidor local ativo, abra a ficha nesse perfil, limpe seu armazenamento local e recarregue a página. No console do navegador, execute:

```js
const { runTests } = await import('./tests/humanity-browser.js');
console.table(runTests());
```

Cada item retornado é uma verificação aprovada; qualquer falha interrompe a execução com um erro.

Para verificar também a interface compacta e o ciclo completo de importação/exportação, execute no mesmo perfil temporário:

```js
const ux = await import('./tests/disclosure-browser.js');
console.table(await ux.runTests());
```

Essa suíte usa uma ficha de teste em um iframe, recarrega a página e restaura o armazenamento anterior ao terminar. Consulte [a auditoria de UX](docs/ux-review.md) para as mudanças de apresentação e as limitações de regras preservadas.
