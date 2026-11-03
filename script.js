
const carrinho = [];

const listaCarrinho = document.querySelector("#itens-carrinho");
const totalElemento = document.querySelector("#total");

// Formata os valores como dinheiro brasileiro
function formatarPreco(valor) {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

// Atualiza o que aparece no carrinho
function atualizarCarrinho() {
    listaCarrinho.innerHTML = "";

    let total = 0;

    carrinho.forEach((item, indice) => {
        const li = document.createElement("li");

        li.textContent = `${item.nome} - ${item.quantidade} x ${formatarPreco(item.preco)}`;

        const botaoRemover = document.createElement("button");
        botaoRemover.textContent = "Remover";

        botaoRemover.addEventListener("click", () => {
            carrinho.splice(indice, 1);
            atualizarCarrinho();
        });

        li.appendChild(botaoRemover);
        listaCarrinho.appendChild(li);

        total += item.preco * item.quantidade;
    });

    totalElemento.textContent = formatarPreco(total);
}

// Adiciona um produto ao carrinho
function adicionarAoCarrinho(nome, preco) {
    const produtoExistente = carrinho.find(item => item.nome === nome);

    if (produtoExistente) {
        produtoExistente.quantidade++;
    } else {
        carrinho.push({
            nome: nome,
            preco: preco,
            quantidade: 1
        });
    }

    atualizarCarrinho();
}

// Cria um botão para cada produto da página
document.querySelectorAll(".produto").forEach(produto => {
    const nome = produto.querySelector("h3:not(.categoria)").textContent;

    const precoTexto = produto.querySelector("strong").textContent;

    const preco = Number(
        precoTexto.replace("R$", "").replace(",", ".").trim()
    );

    const botao = document.createElement("button");
    botao.textContent = "Adicionar ao carrinho";

    botao.addEventListener("click", () => {
        adicionarAoCarrinho(nome, preco);
    });

    produto.appendChild(botao);
});

// Finaliza o pedido pelo WhatsApp
const botaoFinalizar = document.querySelector("#finalizar-pedido");

botaoFinalizar.addEventListener("click", () => {

    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }

    let mensagem = "Olá! Gostaria de fazer este pedido:\n\n";

    carrinho.forEach(item => {
        mensagem += `${item.quantidade}x ${item.nome} - ${formatarPreco(item.preco * item.quantidade)}\n`;
    });

    mensagem += `\nTotal: ${formatarPreco(
        carrinho.reduce((soma, item) => soma + item.preco * item.quantidade, 0)
    )}`;

    const numeroWhatsApp = "32999999999";

    const link = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;

    window.open(link, "_blank");
});
