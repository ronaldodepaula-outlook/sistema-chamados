# Referência de API — Integração com o Frontend

Este documento resume os endpoints do backend que o frontend consome (implementados em `src/services/*`). A base padrão da API é `http://localhost:8000/api` — use `VITE_API_BASE_URL` para alterar.

> Observação: o backend pode retornar formatos diferentes (por exemplo `usuario` em PT-BR). Os serviços do frontend normalizam variações comuns.

## Autenticação

### POST /api/login
- Requisição: { email, senha }
- Possíveis respostas:
  - Retorna token e usuário
  ```json
  { "token": "24|...", "usuario": { "id": 1, "nome": "Admin", "email": "admin@example.com", "tipo": "admin" } }
  ```
  - Em alguns cenários o servidor pode responder com 204 No Content (sessão baseada em cookie). O frontend então tenta `GET /api/user`.

### GET /api/user
- Retorna o usuário atualmente autenticado
- Exemplo de resposta:
```json
{ "usuario": { "id": 4, "nome": "Admin", "email": "admin@admin.com", "tipo": "admin", "ativo": 1, "ultimo_login": "2025-12-01 18:37:00" } }
```

### POST /api/logout
- Invalida a sessão ou token

## Usuários

### GET /api/usuarios
- Retorna lista de usuários (pode ser array ou objeto). O frontend normaliza para array.

### GET /api/usuarios/{id}
- Retorna um usuário pelo id

### PUT /api/usuarios/{id}
- Atualiza campos de usuário. O frontend usa esse endpoint para atualizar o perfil do usuário autenticado: PUT /api/usuarios/:id
- Exemplo de requisição (curl):
```bash
curl -X PUT 'http://localhost:8000/api/usuarios/1' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer <token>' \
  -d '{"nome":"Administrador Sistema","email":"admin@empresa.com"}'
```
- Exemplo de resposta:
```json
{ "id":1, "nome":"Administrador Sistema", "email":"admin@empresa.com", "tipo":"admin" }
```

## Chamados (Tickets)

### GET /api/chamados
- Retorna todos os chamados ou lista paginada. O frontend lida com arrays e variantes de paginação.

### GET /api/chamados/{id}
- Retorna um chamado com detalhes e comentários.

### POST /api/chamados
- Cria um novo chamado — payload inclui titulo, descricao, cliente_id, tecnico_id (opcional), prioridade, tipo etc.

### PUT /api/chamados/{id}
- Atualiza campos ou status de um chamado.

### Comentários
- GET /api/chamados/{id}/comentarios — lista comentários do chamado (paginado)
- POST /api/chamados/{id}/comentarios — adiciona comentário

## Logs & Relatórios
- GET /api/logs — dados de logs/metricas para dashboards de admin

## Erros & autenticação
- 401 Unauthorized — o interceptor do frontend remove o token e redireciona para /login
- O backend pode retornar formatos variados (`usuario`, `user`, `data`), o frontend normaliza essas formas nos serviços.

## Notas para desenvolvedores frontend
- Todas as chamadas passam por `src/services/api.js`, que adiciona `Authorization: Bearer <token>` quando existe token no localStorage.
- Mantenha a assinatura dos métodos nos serviços estável e retorne dados normalizados. Verifique os serviços existentes (`chamados`, `usuarios`, `auth`) como referência.

---

Se precisar de um OpenAPI/Swagger do backend, adicione ou exporte a partir do backend e inclua em `/docs` ou gere um client a partir dele.
