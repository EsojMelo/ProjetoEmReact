import express from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const app = express()
app.use(express.json())
app.use(cors())

app.post('/usuarios', async (req, res) => {
    try {
        const { name, email, password, age } = req.body;

        // Verifica se todos os campos foram preenchidos
        if (!name || !email || !password || !age) {
            return res.status(400).json({ error: "Todos os campos são obrigatórios!" });
        }

        // Verifica se o e-mail já existe no banco
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return res.status(400).json({ error: "E-mail já cadastrado!" });
        }

        // Criação do usuário
        const newUser = await prisma.user.create({
            data: { name, email, password, age }
        });

        res.status(201).json(newUser);
    } catch (error) {
        console.error("Erro ao cadastrar usuário:", error);
        res.status(500).json({ error: "Erro interno no servidor" });
    }
});

app.put('/usuarios/:id',  async (req, res) => {
    
    await prisma.user.update({
        where: {
            id: parseInt(req.params.id)
        },
        data: {
            address: req.body.address,
        }
    })

    res.status(201).json(req.body)
})

app.delete('/usuarios/:email',  async (req, res) => {
    
    let userinfo = [await prisma.user.findUnique({
        where: {
            email:  req.params.email
        }
    })]

    await prisma.user.delete({
        where: {
            email: req.params.email
        }
    })

    res.status(201).json({messege: "User: " + userinfo + "has been deleted"})
})

app.get('/usuarios', async (req,res) => {

    const users = await prisma.user.findMany()

    res.status(200).json(users)
})

app.listen(3001, '0.0.0.0', () => {
    console.log("Servidor rodando na porta 3001");
});


/*
    1) Tipo de Rota / Método HTTP
    2) Endereço
*/