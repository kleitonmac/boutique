# Configuração do Projeto

## 1. Configurar Banco de Dados MongoDB

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Database - MongoDB Atlas
DATABASE_URL="mongodb+srv://seu-usuario:suas-senha@seu-cluster.mongodb.net/alanaboutique?retryWrites=true&w=majority"

# JWT Secret
JWT_SECRET="seu-jwt-secret-super-seguro-aqui"

# Email (opcional)
EMAIL_USER="seu-email@gmail.com"
EMAIL_PASS="sua-senha-app"
```

## 2. Comandos para executar

```bash
# Instalar dependências
npm run install-all

# Gerar cliente Prisma
npm run db:generate

# Aplicar mudanças no banco
npm run db:push

# Iniciar servidor
npm run dev
```

## 3. URLs

- Frontend: http://localhost:5173
- Backend: http://localhost:3001
- Login: http://localhost:5173/login

## 4. Funcionalidades implementadas

- ✅ Sistema de autenticação (login/registro)
- ✅ Contexto de autenticação global
- ✅ Header mostra nome do usuário logado
- ✅ Logout funcional
- ✅ Roteamento para /login
- ✅ Integração com MongoDB
- ✅ Carrinho e favoritos (preparado para usuários logados)
