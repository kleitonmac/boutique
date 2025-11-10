import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { ObjectId } from 'mongodb';
import connectDB from './db.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// Passport configuration
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const db = await connectDB();
      let user = await db.collection('users').findOne({ email: profile.emails[0].value });
      if (user) {
        if (!user.googleId) {
            await db.collection('users').updateOne({ email: profile.emails[0].value }, { $set: { googleId: profile.id } });
        }
        return done(null, user);
      } else {
        const newUser = {
            name: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        const result = await db.collection('users').insertOne(newUser);
        const insertedUser = await db.collection('users').findOne({_id: result.insertedId});
        return done(null, insertedUser);
      }
    } catch (error) {
      return done(error, null);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user._id.toString());
});

passport.deserializeUser(async (id, done) => {
  try {
    const db = await connectDB();
    const user = await db.collection('users').findOne({ _id: new ObjectId(id) });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Configuração do email
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'seu-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'sua-senha-app'
  }
});

// ====================== ROTAS DE AUTENTICAÇÃO ======================

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    const token = jwt.sign({ userId: req.user._id, email: req.user.email }, process.env.JWT_SECRET || 'segredo', { expiresIn: '2h' });
    res.redirect(`/?token=${token}`);
  });

// Cadastro de usuário
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Preencha todos os campos' });
    }
    const db = await connectDB();
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'Email já cadastrado' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.collection('users').insertOne({ name, email, password: hashedPassword, createdAt: new Date(), updatedAt: new Date() });
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
    const db = await connectDB();
    const user = await db.collection('users').findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Usuário ou senha inválidos' });
    }
    if(!user.password) {
        return res.status(401).json({ error: 'Use o login com Google.' });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Usuário ou senha inválidos' });
    }
    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET || 'segredo', { expiresIn: '2h' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// ====================== ROTAS DE CARTÃO DE CRÉDITO ======================

// Adicionar cartão de crédito
app.post('/api/credit-cards', async (req, res) => {
  try {
    const { userId, cardholderName, cardNumber, expirationDate, cvv } = req.body;
    const db = await connectDB();
    const newCard = {
      userId: new ObjectId(userId),
      cardholderName,
      cardNumber, // WARNING: Storing raw card numbers is not secure!
      expirationDate,
      cvv, // WARNING: Storing raw CVVs is not secure!
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const result = await db.collection('credit_cards').insertOne(newCard);
    const insertedCard = await db.collection('credit_cards').findOne({_id: result.insertedId});
    res.status(201).json(insertedCard);
  } catch (error) {
    console.error('Erro ao adicionar cartão de crédito:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Obter cartões de crédito de um usuário
app.get('/api/credit-cards/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const db = await connectDB();
    const creditCards = await db.collection('credit_cards').find({ userId: new ObjectId(userId) }).toArray();
    res.json(creditCards);
  } catch (error) {
    console.error('Erro ao obter cartões de crédito:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});


// ====================== ROTAS DE PRODUTOS ======================

app.get('/api/products/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const db = await connectDB();
    const products = await db.collection('products').find({ "category.name": category }).toArray();
    res.json(products);
  } catch (error) {
    console.error('Erro ao buscar produtos por categoria:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.get('/api/products/search/:term', async (req, res) => {
  try {
    const { term } = req.params;
    const db = await connectDB();
    const products = await db.collection('products').find({
      $or: [
        { name: { $regex: term, $options: 'i' } },
        { description: { $regex: term, $options: 'i' } },
        { "category.name": { $regex: term, $options: 'i' } },
      ],
    }).toArray();
    res.json(products);
  } catch (error) {
    console.error('Erro na busca:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// ====================== ROTAS DE CARRINHO ======================

app.get('/api/cart/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const db = await connectDB();
    const cart = await db.collection('cart').find({ userId: new ObjectId(userId) }).toArray();
    res.json(cart);
  } catch (error) {
    console.error('Erro ao buscar carrinho:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.post('/api/cart', async (req, res) => {
  try {
    const { userId, productId, quantity, size, color } = req.body;
    const db = await connectDB();
    const existingItem = await db.collection('cart').findOne({
      userId: new ObjectId(userId),
      productId: new ObjectId(productId),
      size,
      color,
    });

    if (existingItem) {
      await db.collection('cart').updateOne(
        { _id: existingItem._id },
        { $inc: { quantity: quantity } }
      );
      const updatedItem = await db.collection('cart').findOne({ _id: existingItem._id });
      res.json(updatedItem);
    } else {
      const newItem = {
        userId: new ObjectId(userId),
        productId: new ObjectId(productId),
        quantity,
        size,
        color,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const result = await db.collection('cart').insertOne(newItem);
      const insertedItem = await db.collection('cart').findOne({ _id: result.insertedId });
      res.json(insertedItem);
    }
  } catch (error) {
    console.error('Erro ao adicionar ao carrinho:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.put('/api/cart/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const db = await connectDB();

    if (quantity <= 0) {
      await db.collection('cart').deleteOne({ _id: new ObjectId(id) });
      res.json({ message: 'Item removido do carrinho' });
    } else {
      await db.collection('cart').updateOne({ _id: new ObjectId(id) }, { $set: { quantity } });
      const updatedItem = await db.collection('cart').findOne({ _id: new ObjectId(id) });
      res.json(updatedItem);
    }
  } catch (error) {
    console.error('Erro ao atualizar carrinho:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.delete('/api/cart/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db = await connectDB();
    await db.collection('cart').deleteOne({ _id: new ObjectId(id) });
    res.json({ message: 'Item removido do carrinho' });
  } catch (error) {
    console.error('Erro ao remover do carrinho:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.delete('/api/cart/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const db = await connectDB();
    await db.collection('cart').deleteMany({ userId: new ObjectId(userId) });
    res.json({ message: 'Carrinho limpo' });
  } catch (error) {
    console.error('Erro ao limpar carrinho:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});


// ====================== ROTAS DE FAVORITOS ======================

app.get('/api/favorites/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const db = await connectDB();
    const favorites = await db.collection('favorites').find({ userId: new ObjectId(userId) }).toArray();
    res.json(favorites);
  } catch (error) {
    console.error('Erro ao buscar favoritos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.post('/api/favorites', async (req, res) => {
  try {
    const { userId, productId } = req.body;
    const db = await connectDB();
    const existingFavorite = await db.collection('favorites').findOne({
      userId: new ObjectId(userId),
      productId: new ObjectId(productId),
    });

    if (existingFavorite) {
      await db.collection('favorites').deleteOne({ _id: existingFavorite._id });
      res.json({ message: 'Produto removido dos favoritos' });
    } else {
      const newFavorite = {
        userId: new ObjectId(userId),
        productId: new ObjectId(productId),
        createdAt: new Date(),
      };
      const result = await db.collection('favorites').insertOne(newFavorite);
      const insertedFavorite = await db.collection('favorites').findOne({ _id: result.insertedId });
      res.json(insertedFavorite);
    }
  } catch (error) {
    console.error('Erro ao gerenciar favoritos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// ====================== ROTAS DE PEDIDOS ======================

app.post('/api/orders', async (req, res) => {
  try {
    const { userId, items, total, shippingAddress, paymentMethod } = req.body;
    const db = await connectDB();
    const newOrder = {
      userId: new ObjectId(userId),
      items: items.map(item => ({ ...item, productId: new ObjectId(item.productId) })),
      total,
      shippingAddress,
      paymentMethod,
      status: 'PENDING',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('orders').insertOne(newOrder);
    const insertedOrder = await db.collection('orders').findOne({ _id: result.insertedId });

    // Limpar carrinho após criar pedido
    await db.collection('cart').deleteMany({ userId: new ObjectId(userId) });

    res.json(insertedOrder);
  } catch (error) {
    console.error('Erro ao criar pedido:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.get('/api/orders/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const db = await connectDB();
    const orders = await db.collection('orders').find({ userId: new ObjectId(userId) }).sort({ createdAt: -1 }).toArray();
    res.json(orders);
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});


// ====================== ROTA DE EMAIL ======================

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

app.get('/api/categories', async (req, res) => {
  try {
    const db = await connectDB();
    const categories = await db.collection('categories').find({}).toArray();
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
