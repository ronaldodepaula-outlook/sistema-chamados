# Guia do Usuário — Sistema de Chamados

Este guia destina-se a usuários finais não técnicos: administradores, técnicos e clientes. Aqui você encontrará os fluxos mais comuns e como usar a aplicação.

## Perfis e visão geral
- Administrador (Admin) — acesso total: gerencia usuários, clientes, visualiza logs e todos os chamados
- Técnico — acesso a chamados atribuídos / em andamento; pode atualizar status, comentar e resolver chamados
- Cliente — visualiza e abre chamados relacionados ao registro de cliente vinculado ao usuário

## Login / Sessão
1. Acesse a página de login.
2. Informe seu e-mail e senha.
3. O sistema mantém um token/sessão e carrega o dashboard apropriado ao seu perfil.
4. Se a sessão expirar, você será redirecionado para a tela de login ou deverá efetuar login novamente.

## Dashboards (por perfil)
- Admin: métricas do sistema (total de chamados, abertos, total de clientes, taxa de resolução), atalhos para usuários, logs e relatórios.
- Técnico: métricas e lista de chamados atribuídos ao técnico logado.
- Cliente: mostra apenas os chamados pertencentes ao registro de cliente relacionado ao usuário logado.

## Fluxos comuns

### Criar um chamado
1. Navegue até "Chamados" → "Novo Chamado".
2. Preencha título, descrição, selecione o cliente (se houver mais de um), opcionalmente atribua um técnico e defina a prioridade.
3. Envie — o chamado aparecerá na lista de Chamados.

### Comentar em um chamado
1. Abra um Chamado e adicione um comentário usando a caixa de comentários.
2. Você pode marcar um comentário como "Solução" quando ele resolver o problema (somente técnico/administrador).
3. Os comentários são exibidos em uma linha do tempo (timeline).

### Alterar status / resolver
- Técnicos e administradores podem mover um chamado pelos status: aberto → andamento → fechado.
- Fechar um chamado o marca como resolvido e este passa a contar nas métricas de resolução.

### Perfil — atualizar dados
1. Clique no avatar ou no nome do usuário no cabeçalho.
2. Clique em "Editar perfil" para alterar nome e e‑mail e, em seguida, salve.
3. A aplicação envia a requisição `PUT /api/usuarios/:id` ao backend para atualizar o perfil.

## Segurança
- Ao efetuar logout, o token/sessão é removido do dispositivo local.
- Mantenha sua senha em segurança e não a compartilhe.

## Solução de problemas
- Redirecionamento para `/not-authorized` após refresh: isso só deve ocorrer se a sessão expirou ou se o seu perfil não tem permissão para acessar a página. Se você estava logado e ocorrer inesperadamente, faça login novamente; se persistir, contate um administrador.

---

Se desejar, posso gerar materiais de treinamento com capturas de tela ou um PDF passo a passo a partir deste guia.
