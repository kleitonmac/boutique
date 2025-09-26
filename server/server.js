import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Configuração do email
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'seu-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'sua-senha-app'
  }
});

// ====================== ROTAS DE AUTENTICAÇÃO ======================

// Cadastro de usuário
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Preencha todos os campos' });
    }
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'Email já cadastrado' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: { name, email, password: hashedPassword }
    });
    res.status(201).json({ message: 'Usuário cadastrado com sucesso' });
  } catch (error) {
    console.error('Erro no cadastro:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Login de usuário
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Preencha todos os campos' });
    }
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Usuário ou senha inválidos' });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Usuário ou senha inválidos' });
    }
    // Gerar token JWT
    const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET || 'segredo', { expiresIn: '2h' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// ====================== ROTAS DE PRODUTOS ======================

// Buscar todos os produtos
app.get('/api/products', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        sizes: true,
        colors: true,
        category: true
      }
    });
    res.json(products);
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Buscar produto por ID
app.get('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: {
        sizes: true,
        colors: true,
        category: true
      }
    });
    
    if (!product) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }
    
    res.json(product);
  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Buscar produtos por categoria
app.get('/api/products/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const products = await prisma.product.findMany({
      where: {
        category: {
          name: category
        }
      },
      include: {
        sizes: true,
        colors: true,
        category: true
      }
    });
    res.json(products);
  } catch (error) {
    console.error('Erro ao buscar produtos por categoria:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Buscar produtos por termo de busca
app.get('/api/products/search/:term', async (req, res) => {
  try {
    const { term } = req.params;
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: term, mode: 'insensitive' } },
          { description: { contains: term, mode: 'insensitive' } },
          { category: { name: { contains: term, mode: 'insensitive' } } }
        ]
      },
      include: {
        sizes: true,
        colors: true,
        category: true
      }
    });
    res.json(products);
  } catch (error) {
    console.error('Erro na busca:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// ====================== ROTAS DE CARRINHO ======================

// Buscar carrinho do usuário
app.get('/api/cart/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const cart = await prisma.cart.findMany({
      where: { userId: parseInt(userId) },
      include: {
        product: {
          include: {
            sizes: true,
            colors: true
          }
        }
      }
    });
    res.json(cart);
  } catch (error) {
    console.error('Erro ao buscar carrinho:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Adicionar produto ao carrinho
app.post('/api/cart', async (req, res) => {
  try {
    const { userId, productId, quantity, size, color } = req.body;
    
    const existingItem = await prisma.cart.findFirst({
      where: {
        userId: parseInt(userId),
        productId: parseInt(productId),
        size,
        color
      }
    });

    if (existingItem) {
      const updatedItem = await prisma.cart.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity }
      });
      res.json(updatedItem);
    } else {
      const newItem = await prisma.cart.create({
        data: {
          userId: parseInt(userId),
          productId: parseInt(productId),
          quantity,
          size,
          color
        }
      });
      res.json(newItem);
    }
  } catch (error) {
    console.error('Erro ao adicionar ao carrinho:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Atualizar quantidade no carrinho
app.put('/api/cart/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    
    if (quantity <= 0) {
      await prisma.cart.delete({ where: { id: parseInt(id) } });
      res.json({ message: 'Item removido do carrinho' });
    } else {
      const updatedItem = await prisma.cart.update({
        where: { id: parseInt(id) },
        data: { quantity }
      });
      res.json(updatedItem);
    }
  } catch (error) {
    console.error('Erro ao atualizar carrinho:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Remover item do carrinho
app.delete('/api/cart/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.cart.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Item removido do carrinho' });
  } catch (error) {
    console.error('Erro ao remover do carrinho:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Limpar carrinho
app.delete('/api/cart/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    await prisma.cart.deleteMany({ where: { userId: parseInt(userId) } });
    res.json({ message: 'Carrinho limpo' });
  } catch (error) {
    console.error('Erro ao limpar carrinho:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// ====================== ROTAS DE FAVORITOS ======================

// Buscar favoritos do usuário
app.get('/api/favorites/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const favorites = await prisma.favorite.findMany({
      where: { userId: parseInt(userId) },
      include: {
        product: {
          include: {
            sizes: true,
            colors: true
          }
        }
      }
    });
    res.json(favorites);
  } catch (error) {
    console.error('Erro ao buscar favoritos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Adicionar/remover favorito
app.post('/api/favorites', async (req, res) => {
  try {
    const { userId, productId } = req.body;
    
    const existingFavorite = await prisma.favorite.findFirst({
      where: {
        userId: parseInt(userId),
        productId: parseInt(productId)
      }
    });

    if (existingFavorite) {
      await prisma.favorite.delete({ where: { id: existingFavorite.id } });
      res.json({ message: 'Produto removido dos favoritos' });
    } else {
      const newFavorite = await prisma.favorite.create({
        data: {
          userId: parseInt(userId),
          productId: parseInt(productId)
        }
      });
      res.json(newFavorite);
    }
  } catch (error) {
    console.error('Erro ao gerenciar favoritos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// ====================== ROTAS DE PEDIDOS ======================

// Criar pedido
app.post('/api/orders', async (req, res) => {
  try {
    const { userId, items, total, shippingAddress, paymentMethod } = req.body;
    
    const order = await prisma.order.create({
      data: {
        userId: parseInt(userId),
        total,
        shippingAddress,
        paymentMethod,
        status: 'PENDING',
        items: {
          create: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            size: item.size,
            color: item.color
          }))
        }
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    // Limpar carrinho após criar pedido
    await prisma.cart.deleteMany({ where: { userId: parseInt(userId) } });

    res.json(order);
  } catch (error) {
    console.error('Erro ao criar pedido:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Buscar pedidos do usuário
app.get('/api/orders/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await prisma.order.findMany({
      where: { userId: parseInt(userId) },
      include: {
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(orders);
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// ====================== ROTA DE EMAIL ======================

// Enviar email de confirmação
app.post('/api/send-email', async (req, res) => {
  try {
    const { email, orderDetails, total } = req.body;
    
    const mailOptions = {
      from: process.env.EMAIL_USER || 'seu-email@gmail.com',
      to: email,
      subject: 'Confirmação de Pedido - Alana Boutique',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #d3ad7f;">Alana Boutique</h2>
          <h3>Pedido Confirmado!</h3>
          <p>Obrigado por sua compra! Seu pedido foi processado com sucesso.</p>
          
          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h4>Detalhes do Pedido:</h4>
            ${orderDetails.map(item => `
              <div style="margin: 10px 0; padding: 10px; border-bottom: 1px solid #eee;">
                <strong>${item.name}</strong><br>
                Quantidade: ${item.quantity}<br>
                Preço: R$ ${item.price.toFixed(2)}<br>
                ${item.size ? `Tamanho: ${item.size}<br>` : ''}
                ${item.color ? `Cor: ${item.color}<br>` : ''}
              </div>
            `).join('')}
            <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #d3ad7f;">
              <strong>Total: R$ ${total.toFixed(2)}</strong>
            </div>
          </div>
          
          <p>Você receberá atualizações sobre o status do seu pedido por email.</p>
          <p>Agradecemos sua preferência!</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: 'Email enviado com sucesso' });
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    res.status(500).json({ error: 'Erro ao enviar email' });
  }
});

// ====================== ROTAS DE CATEGORIAS ======================

// Buscar todas as categorias
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// ====================== ROTA DE SAÚDE ======================

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Servidor funcionando corretamente' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = app;
