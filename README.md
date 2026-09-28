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
