# Guia do Desenvolvedor — Sistema de Chamados (Frontend)

Este documento explica a estrutura do frontend, como rodar o projeto localmente e as decisões principais de arquitetura e organização do código.

## Objetivos
- Aplicação frontend leve e próxima a produção, construída com React + Vite + Tailwind CSS
- Separação clara entre páginas, componentes, serviços e contexts
- UI sensível a permissões por papel/role e proteção de rotas (admin / tecnico / cliente)

## Estrutura do projeto (resumo)

- src/
  - components/ — componentes reutilizáveis agrupados por domínio
    - Layout/ — Header, Sidebar e wrapper Layout
    - Chamados/ — componentes relativos a chamados (cards, detalhes, formulários)
    - Clientes/, Usuarios/, Logs/ — componentes por funcionalidade
  - pages/ — componentes de rota (Dashboard, Login, Chamados, Profile, Usuarios, Logs, etc.)
  - contexts/ — providers (por exemplo AuthContext)
  - hooks/ — hooks customizados como useAuth
  - services/ — wrappers para endpoints da API (instância axios e funções por recurso)
  - utils/ — constantes e helpers

## Arquivos importantes
- `src/contexts/AuthContext.jsx` — lógica de autenticação: login, logout, refresh e atualização de perfil
- `src/services/api.js` — instância axios que adiciona Authorization e trata 401
- `src/pages/Dashboard.jsx` — roteador do dashboard que direciona para dashboards por papel (admin/tecnico/cliente)

## Convenções
- Normalização de respostas: o backend pode retornar campos em PT-BR (`usuario`, `atualizado_em`) ou formatos diferentes; os serviços normalizam as respostas para uma forma consistente.
- Roles são normalizados para `admin`, `tecnico`, `cliente`.
- O token de autenticação é guardado em `localStorage` como `token`.

## Executando localmente (desenvolvedor)
1. Instale dependências

```bash
npm install
```

2. Inicie o servidor de desenvolvimento

```bash
npm run dev -- --host
```

3. Build para produção

```bash
npm run build
```

4. Pré-visualizar build

```bash
npm run preview
```

## Variáveis de ambiente
- `VITE_API_BASE_URL` — URL base da API (padrão: `http://localhost:8000/api`)
- `VITE_PORT` — sobrescrever porta, se necessário

## Notas sobre o cliente de API
- `src/services/api.js` adiciona o header `Authorization: Bearer <token>` quando existe token em localStorage.
- O interceptor de resposta trata 401 removendo o token e redirecionando para `/login`.

## Adicionando novos endpoints
1. Crie um arquivo de serviço em `src/services` ou estenda um existente.
2. Normalize as respostas (retornar arrays quando apropriado) e lide com respostas 204.
3. Crie hooks ou consuma o serviço diretamente nas páginas.

## Lint e formatação
- ESLint está configurado. Execute:

```bash
npm run lint
```

## Testes
- O projeto não inclui testes por padrão — recomendamos adicionar Jest/RTL para unit tests e Playwright/Cypress para e2e.

## Deploy
- Gere o build com `npm run build` e sirva os assets estáticos. Para Netlify/Vercel/GitHub Pages, use os adaptadores apropriados.

## Dicas e resolução de problemas
- Para acessar o servidor dev a partir de outro dispositivo, start com `--host` e abra a porta no firewall.
- Se o HMR não funcionar em dispositivos da LAN, ajuste `server.hmr.host` no `vite.config.js` para o IP do desenvolvedor.

---

Para mais detalhes técnicos e exemplos de chamadas, veja `/docs/API.md` e o diretório `src/services`.
