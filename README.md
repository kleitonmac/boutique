<<<<<<< HEAD
# Alana Boutique - E-commerce de Moda

Um e-commerce completo de moda feminina com funcionalidades avançadas de carrinho, favoritos, checkout e notificações por email.

## 🚀 Funcionalidades

### Frontend (React + Vite)
- ✅ Header responsivo com menu lateral no mobile
- ✅ Tema escuro/claro
- ✅ Busca avançada de produtos
- ✅ Filtros por categoria, preço, tamanho e cor
- ✅ Carrinho de compras funcional
- ✅ Sistema de favoritos
- ✅ Modal de detalhes do produto
- ✅ Checkout completo com formulário de pagamento
- ✅ Notificações em tempo real
- ✅ Design responsivo para mobile, tablet e desktop

### Backend (Node.js + Express + Prisma)
- ✅ API RESTful completa
- ✅ Banco de dados PostgreSQL com Prisma ORM
- ✅ Sistema de autenticação
- ✅ Gerenciamento de produtos
- ✅ Sistema de carrinho
- ✅ Sistema de favoritos
- ✅ Processamento de pedidos
- ✅ Envio de emails de confirmação
- ✅ Busca avançada de produtos

## 📋 Pré-requisitos

- Node.js (versão 16 ou superior)
- PostgreSQL
- npm ou yarn

## 🛠️ Instalação

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd alana-boutique
```

### 2. Instale as dependências
```bash
npm run install-all
```

### 3. Configure o banco de dados

Crie um arquivo `.env` na raiz do projeto:
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/alana_boutique"

# Email Configuration
EMAIL_USER="seu-email@gmail.com"
EMAIL_PASS="sua-senha-app"

# Server
PORT=3001

# Environment
NODE_ENV=development
```

### 4. Configure o banco de dados
```bash
# Gere o cliente Prisma
npm run db:generate

# Execute as migrações
npm run db:migrate

# Ou use db:push para desenvolvimento
npm run db:push
```

### 5. Configure o email (opcional)
Para enviar emails de confirmação:
1. Ative a verificação em duas etapas no Gmail
2. Gere uma senha de app
3. Configure as variáveis EMAIL_USER e EMAIL_PASS no .env

## 🚀 Executando o projeto

### Desenvolvimento
```bash
# Executa frontend e backend simultaneamente
npm run dev

# Ou execute separadamente:
npm run server    # Backend na porta 3001
npm run client    # Frontend na porta 5173
```

### Produção
```bash
# Build do frontend
npm run build

# Executar apenas o servidor
npm run server
```

## 📱 Funcionalidades Mobile

### Header Responsivo
- Menu lateral esquerdo no mobile
- Botões de tema e carrinho no lado direito
- Navegação suave entre seções

### Carrinho Mobile
- Layout otimizado para touch
- Controles de quantidade adaptados
- Checkout responsivo

### Busca e Filtros
- Busca por nome, categoria, descrição
- Filtros por tamanho e cor funcionais
- Interface adaptada para mobile

## 🔧 Estrutura do Projeto

```
alana-boutique/
├── front/core/                 # Frontend React
│   ├── src/
│   │   ├── _components/       # Componentes React
│   │   ├── data/              # Dados mockados
│   │   └── App.jsx           # Componente principal
│   └── package.json
├── server/                    # Backend Node.js
│   └── server.js             # Servidor Express
├── prisma/                   # Configuração do banco
│   └── schema.prisma         # Schema do Prisma
├── package.json              # Dependências do backend
└── README.md
```

## 📊 Rotas da API

### Produtos
- `GET /api/products` - Listar todos os produtos
- `GET /api/products/:id` - Buscar produto por ID
- `GET /api/products/category/:category` - Produtos por categoria
- `GET /api/products/search/:term` - Busca de produtos

### Carrinho
- `GET /api/cart/:userId` - Buscar carrinho do usuário
- `POST /api/cart` - Adicionar produto ao carrinho
- `PUT /api/cart/:id` - Atualizar quantidade
- `DELETE /api/cart/:id` - Remover item do carrinho

### Favoritos
- `GET /api/favorites/:userId` - Buscar favoritos
- `POST /api/favorites` - Adicionar/remover favorito

### Pedidos
- `POST /api/orders` - Criar pedido
- `GET /api/orders/:userId` - Buscar pedidos do usuário

### Email
- `POST /api/send-email` - Enviar email de confirmação

## 🎨 Design System

### Cores
- Primary: #d3ad7f (Dourado)
- Secondary: #b28b5e (Dourado escuro)
- Accent: #8b4513 (Marrom)

### Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🔒 Segurança

- Validação de dados no backend
- Sanitização de inputs
- CORS configurado
- Variáveis de ambiente protegidas

## 📧 Email

O sistema envia emails de confirmação automáticos quando:
- Pedido é finalizado com sucesso
- Status do pedido é atualizado

## 🚀 Deploy

### Frontend (Vercel/Netlify)
```bash
npm run build
```

### Backend (Heroku/Railway)
```bash
npm run server
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

Para suporte, envie um email para contato@alanaboutique.com

---

Desenvolvido com ❤️ pela equipe Alana Boutique
=======
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
>>>>>>> 233903abed43a62d3ad9f9157a897bf72959bfd0
