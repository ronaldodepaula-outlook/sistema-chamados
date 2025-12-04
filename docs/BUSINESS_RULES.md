# Business Rules — Sistema de Chamados

This document captures the business rules and permissions used by the frontend.

## Roles and their privileges
- Admin
  - Full system access: manage users, view all clients, view logs, access reports, create/assign/close chamados
- Técnico
  - Access to tickets (chamados) assigned to them and those they are allowed to view, update status, comment, mark solutions
- Cliente
  - Access only to tickets relating to their client registration (one or multiple clients may be linked to a single user)

## Important rules
- Only authenticated users can access the main app (ProtectedRoute controls). If not authenticated -> redirect to /login.
- Role checks are performed case-insensitively and common synonyms are supported (e.g., administrator/administrador → admin; technician/technician/tech → tecnico).
- Only users with an appropriate role may access pages or actions: e.g., `clientes` page is for admin + tecnico, `usuarios` and `logs` only for admin.

## Chamado lifecycle
- Statuses: `aberto`, `andamento`, `fechado`.
- A ticket starts as `aberto` when created.
- Technicians (or admins) can move tickets to `andamento` and finally `fechado` (closed).
- When a ticket is set to `fechado`, it becomes part of resolution metrics.

## Comments
- Users can add comments; some comments may be marked as "Solução" by technicians or admins.
- Frontend removes duplicate comments rendering by deduplication logic but duplicates should be prevented at backend.

## Profile and user updates
- Profile updates use `PUT /api/usuarios/:id` to modify name/email.
- The frontend will update its auth context with the new profile to keep UI consistent.

## Security & session
- Token based: stored in localStorage and sent as "Authorization: Bearer <token>"
- 401 responses lead the frontend to clear token and redirect to /login

## Edge cases & operations
- Backend may sometimes return 204 No Content on OPTIONS or specific calls; frontend handles this gracefully.
- Multiple date/time formats may be returned (`criado_em`, `updated_at`, `atualizado_em`) — services map them to normalized fields.

---

If you'd like, we can convert these rules into a formal policy file for governance or include them in your internal SOPs.
