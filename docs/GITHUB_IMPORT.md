# Importação e configuração do repositório no GitHub

Este arquivo contém um checklist e recomendações para hospedar este projeto no GitHub e torná-lo colaborativo.

## Importação rápida
1. Crie um novo repositório no GitHub (público ou privado).
2. Empurre o código existente para a branch `main` (ou use a ferramenta de import do GitHub).

```bash
git init
git add .
git commit -m "Import inicial"
git branch -M main
git remote add origin git@github.com:<org-or-user>/<repo>.git
git push -u origin main
```

## Configurações recomendadas no GitHub
- Proteções de branch em `main`:
  - Exigir revisão de PRs antes de merge
  - Exigir status checks (lint/tests)
- Adicionar `CODEOWNERS` para times, se aplicável
- Adicionar templates de issue e pull request (opcional)

## Integração contínua (exemplo)
- Recomendado: adicionar GitHub Actions que executem `npm ci`, `npm run lint`, `npm run build` em PRs
- Pode adicionar um workflow de `deploy` para staging/produção

## Publicação de documentação
- GitHub Pages: use para publicar `/docs` ou um site gerado com ferramentas de docs
- Os arquivos `README.md` e os documentos dentro de `/docs` serão renderizados automaticamente no repositório

## Segredos e variáveis de ambiente
- Armazene segredos (chaves de API, tokens) em GitHub Secrets para workflows
- Nunca comite credenciais no repositório

## Extras úteis (opcional)
- Adicionar `.github/workflows/ci.yml` para CI
- Adicionar `CODEOWNERS` e ISSUE_TEMPLATEs para triagem

---

Posso também criar um `ci.yml` básico para executar lint e build em PRs e um `publish-docs.yml` para publicar a pasta `/docs` no GitHub Pages — quer que eu faça isso?
