const express = require("express");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const app = express();
app.use(express.json()); // para receber o corpo da requisição em json


// rota que o front-end irá acessar
// criar um usuário

// função assincrona que vai buscar dados fora da minha aplicacao no banco de dados
app.post('/usuarios', async (req, res) => {
    const { name, email, phone } = req.body

    const user = await prisma.user.create({
        data: {
            name,
            email,
            phone
        }
    })

    res.status(201).json(user) // retorna o usuário criado
})


//  Deletar um usuário
app.delete('/deletar/usuarios/:id', async (req, res) => {
    const id = req.params.id

    const userDeleted = await prisma.user.delete({
        where: { id }
    })

    return res.status(200).send({ message: "Usuário deletado com sucesso", userDeleted })
})

//  editar usuario
app.put('/editar/usuarios/:id', async (req, res) => {
    const id = req.params.id
    const { name, email, phone } = req.body

    const usuarioAtualizado = await prisma.user.update({
        where: { id },
        data: {
            name,
            email,
            phone
        }
    })

    return res.status(200).send({ message: "Usuário atualizado com sucesso", usuarioAtualizado })
})

// Buscar todos os usuários
app.get('/usuarios/', async(req, res) => {
    const users = await prisma.user.findMany()

    return res.status(200).send({message: "Lista de usuários", users})
})


//Buscar o usuário pelo ID
app.get('/buscar/usuarios/:id', async (req, res) => {
    const id = req.params.id

    const users= await prisma.user.findUnique({
        where: { id }
    })

    return res.status(200).send({ message: "Usuário encontrado", users }) 

})

// usado para subir o servidor
app.listen(3333, () => {
    console.log("Servidor rodando na porta 3333")
})
