document.addEventListener("DOMContentLoaded", () => {
    const btnEncontrar = document.getElementById("btn-encontrar");
    const mensagemLoading = document.getElementById("mensagem-loading");
    const pokemonInfo = document.getElementById("pokemon-info");
    const pokemonImagem = document.getElementById("pokemon-imagem");
    const pokemonNome = document.getElementById("pokemon-nome");
    const pokemonDescricao = document.getElementById("pokemon-descricao");
    const btnCapturar = document.getElementById("btn-capturar");
    const btnRecusar = document.getElementById("btn-recusar");
    const listaCapturados = document.getElementById("lista-capturados");
    const btnsNavegacao = document.querySelector(".btns-navegacao");
    const btnLimpar = document.getElementById("btn-pokedex");
    const pokemonTipo = document.getElementById("pokemon-tipo");

    let pokemonAtual = null;
    let capturados = [];

    const dadosSalvos = localStorage.getItem("capturados");
    
    if (dadosSalvos) {
        capturados = JSON.parse(dadosSalvos);
    }

    atualizarLista();

    btnEncontrar.addEventListener("click", async () => {
        pokemonInfo.classList.add("hidden");
        btnsNavegacao.classList.add("hidden");
        mensagemLoading.classList.remove("hidden");

        const id = Math.floor(Math.random() * 649) + 1;

        try {
            const resposta = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
            const dados = await resposta.json();

            const nivel = Math.floor(Math.random() * 50) + 1;
            await new Promise(resolve => setTimeout(resolve, 800));

            const imagemAnimada = dados.sprites?.versions?.["generation-v"]?.["black-white"]?.animated?.front_default;
            const tiposArray = dados.types.map(t => t.type.name);

            mostrarTipo(tiposArray);

            const peso = dados.weight / 10;
            const altura = dados.height / 10;

            pokemonAtual = {
                nome: dados.name,
                imagem: imagemAnimada || dados.sprites.front_default
            };

            pokemonImagem.onload = () => {
                pokemonInfo.classList.remove("hidden");
                btnsNavegacao.classList.remove("hidden");
                mensagemLoading.classList.add("hidden");
                
                pokemonInfo.classList.remove("animar"); // reset
                void pokemonInfo.offsetWidth; // força reinício da animação
                pokemonInfo.classList.add("animar");

            };

            pokemonImagem.src = pokemonAtual.imagem;


            pokemonNome.textContent =
                `${pokemonAtual.nome.charAt(0).toUpperCase() + pokemonAtual.nome.slice(1)} Lv${nivel}`;

            pokemonDescricao.textContent =
                `Peso: ${peso}kg | Altura: ${altura}m`;

        } catch (erro) {
            mensagemLoading.classList.add("hidden");
            alert("Erro ao buscar pokemon");
        }
    });

    function mostrarTipo(tiposArray) {
        pokemonTipo.innerHTML = "";

        tiposArray.forEach(tipo => {
            const span = document.createElement("span");
            span.textContent = tipo.toUpperCase();
            span.classList.add("tipo", tipo);
            pokemonTipo.appendChild(span);
        });
    }

 btnCapturar.addEventListener("click", () =>{
        if(!pokemonAtual) return;

        capturados.push(pokemonAtual);
        localStorage.setItem("capturados", JSON.stringify(capturados));
        atualizarLista();
        limparTela();

    });

    btnRecusar.addEventListener("click", () => {
        limparTela();
    });

    function atualizarLista() {
        listaCapturados.innerHTML = "";

        capturados.forEach(pokemon => {
            const li = document.createElement("li");

            li.textContent = pokemon.nome.charAt(0).toUpperCase() + pokemon.nome.slice(1);

            listaCapturados.appendChild(li);
        });
    }
    

    btnLimpar.addEventListener("click", () => {
        capturados = [];
        localStorage.removeItem("capturados");
        atualizarLista();
    });

     function limparTela() {
        pokemonInfo.classList.add("hidden");
        btnsNavegacao.classList.add("hidden");
        pokemonAtual = null;
    }

});
