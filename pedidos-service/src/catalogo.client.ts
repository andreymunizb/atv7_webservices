import dotenv from 'dotenv';
dotenv.config();

export type ProdutoRemoto = {
    id: number;
    nome: string;
    preco: number;
    estoque: number;
};

export async function consultarCatalogo(id: number): Promise<ProdutoRemoto> {
    const url = `${process.env.CATALOGO_URL}/produtos/${id}`;
    
    try {
        const resposta = await fetch(url, {
            signal: AbortSignal.timeout(2000) // Timeout de 2 segundos exigido
        });

        if (resposta.status === 404) {
            throw { status: 404, message: "Produto inexistente" };
        }

        if (!resposta.ok) {
            throw { status: 502, message: "Falha no Catálogo" };
        }

        return await resposta.json();
    } catch (error: any) {
        if (error.status) throw error; // Repassa erros de domínio tratados (ex: 404)
        
        // Trata erro de tempo limite
        if (error.name === 'TimeoutError' || error.message.includes('timeout')) {
            throw { status: 504, message: "Tempo limite ao consultar serviço" };
        }
        
        // Trata erro genérico de conexão (Catálogo desligado)
        throw { status: 502, message: "Catálogo temporariamente indisponível" };
    }
}