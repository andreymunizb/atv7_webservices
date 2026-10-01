export const produtos = [
    { id: 1, nome: "Teclado", preco: 150, estoque: 5 },
    { id: 2, nome: "Mouse", preco: 80, estoque: 10 }
];

export function buscarProduto(id: number) {
    return produtos.find(p => p.id === id);
}