import { consultarCatalogo } from './catalogo.client';

export async function processarPedido(produtoId: number, quantidade: number) {
    // 1. Consulta o microsserviço de Catálogo
    const produto = await consultarCatalogo(produtoId);

    // 2. Regra de negócio: verifica estoque
    if (quantidade > produto.estoque) {
        throw { status: 409, message: "Estoque insuficiente" };
    }

    // 3. Calcula o total com o preço vindo do catálogo
    const total = produto.preco * quantidade;

    return {
        produtoId,
        quantidade,
        total,
        status: "Criado com sucesso"
    };
}