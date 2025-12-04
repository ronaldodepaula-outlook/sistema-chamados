
# Sistema de Chamados — Frontend

Este repositório contém o frontend do "Sistema de Chamados" — um sistema de helpdesk/gestão de chamados implementado com React, Vite e TailwindCSS. O frontend espera um backend que exponha a API (há uma coleção do Postman incluída) com autenticação, usuários, clientes, chamados e logs.

Os documentos completos de desenvolvedor e guias de uso estão em /docs.

## Links rápidos (documentação)
- `/docs/DEVELOPER_GUIDE.md` — Documentação técnica e arquitetura
- `/docs/API.md` — Endpoints, exemplos de requisições e formatos de resposta
- `/docs/USER_GUIDE.md` — Guia operacional para usuários finais
- `/docs/BUSINESS_RULES.md` — Regras de negócio e permissões
- `/docs/CONTRIBUTING.md` — Como contribuir e configurar o ambiente de dev
- `/docs/GITHUB_IMPORT.md` — Como importar / configurar no GitHub
---

## Inicialização rápida (desenvolvimento)

1. Instale as dependências

```powershell
npm install
```

2. Inicie o servidor de desenvolvimento (ligue em todas as interfaces para acessar de outro dispositivo na rede)

```powershell
npm run dev -- --host
```

3. Abra no navegador

Local: http://localhost:3000

Na rede: http://<ip-da-maquina-de-dev>:3000

Por padrão o frontend espera a API backend em `http://localhost:8000/api`. Você pode alterar usando a variável de ambiente `VITE_API_BASE_URL`.

- `src/components` — UI components
- `src/pages` — route pages
- `src/contexts` — auth & app contexts
- `src/services` — api wrappers for chamados, usuarios, logs etc.
## Locais importantes no código
- `src/components` — componentes reutilizáveis de UI
- `src/pages` — páginas e rotas
- `src/contexts` — providers e contextos (ex.: AuthContext)
- `src/services` — clientes de API para chamados, usuários, logs, etc.
- `src/components` — UI components
- `src/pages` — route pages
- `src/contexts` — auth & app contexts
- `src/services` — api wrappers for chamados, usuarios, logs etc.

---

Se importou o repositório no GitHub, veja `/docs/GITHUB_IMPORT.md` para recomendações de configuração, CI e publicação de documentação.
