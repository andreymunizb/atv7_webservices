import express from 'express';
import dotenv from 'dotenv';
import { buscarProduto } from './produtos.service';

dotenv.config();

const app = express();
app.use(express.json());

app.get('/produtos/:id', (req, res) => {
    const produto = buscarProduto(Number(req.params.id));
    
    if (!produto) {
        return res.status(404).json({ mensagem: "Produto não encontrado" });
    }
    
    return res.status(200).json(produto);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Catálogo rodando na porta ${PORT}`);
});