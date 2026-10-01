import express from 'express';
import dotenv from 'dotenv';
import { processarPedido } from './pedidos.service';

dotenv.config();

const app = express();
app.use(express.json());

// Rota POST exigida para criar pedidos
app.post('/pedidos', async (req, res) => {
    const { produtoId, quantidade } = req.body;

    try {
        const pedido = await processarPedido(produtoId, quantidade);
        // Retorna 201 se a operação for válida
        return res.status(201).json(pedido); 
    } catch (error: any) {
        const status = error.status || 500;
        return res.status(status).json({ erro: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Pedidos rodando na porta ${PORT}`);
});