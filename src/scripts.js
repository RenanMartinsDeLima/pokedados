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
    const btnApagarTudo = document.getElementById("btn-limpar-tudo");
    const btnApagarFiltrados = document.getElementById("btn-limpar-filtrados");
    const pokemonTipo = document.getElementById("pokemon-tipo");
    const pokemonLevel = document.getElementById("pokemon-level");
    const pokemonPeso = document.getElementById("pokemon-peso");
    const pokemonAltura = document.getElementById("pokemon-altura");   
    const btnToggle = document.getElementById("btn-toggle");
    const subBotoes = document.getElementById("sub-botoes");
    const input = document.getElementById("input-busca");
    const btnNome = document.getElementById("btn-nome");
    const btnTipo = document.getElementById("btn-tipo");
    const btnLevel = document.getElementById("btn-level");
    const btnId = document.getElementById("btn-id");
    const painelPokemon = document.querySelector(".lado-esquerdo");
    const btnApagarPokemon = document.getElementById("apagar-pokemon")
    
    let pokemonAtual = null;    
    let capturados = [];
    let pokeonSelecionado = null;

    const dadosSalvos = localStorage.getItem("capturados");
    try {
        capturados = dadosSalvos ? JSON.parse(dadosSalvos) : [];
    } catch {
        capturados = [];
    }

    atualizarLista();
    // BOTÃO PROCURAR
    if (btnEncontrar) {
        btnEncontrar.addEventListener("click", async () => {
            pokemonInfo.classList.add("hidden");
            btnsNavegacao.classList.add("hidden");
            mensagemLoading.classList.remove("hidden");

            const id = Math.floor(Math.random() * 649) + 1;

            try {
                const resposta = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
                const dados = await resposta.json();

                const nivel = Math.floor(Math.random() * 100) + 1;
                await new Promise(resolve => setTimeout(resolve, 800));

                const imagemAnimada = dados.sprites?.versions?.["generation-v"]?.["black-white"]?.animated?.front_default;
                const tiposArray = dados.types.map(t => t.type.name);

                mostrarTipo(tiposArray);

                const peso = dados.weight / 10;
                const altura = dados.height / 10;

                pokemonAtual = {
                    id: id,
                    nome: dados.name,
                    imagemAnimada: imagemAnimada || dados.sprites.front_default,
                    imagem: dados.sprites.front_default,
                    tipos: tiposArray,
                    nivel: nivel,
                    peso: dados.weight / 10,
                    altura: dados.height / 10
                };

                pokemonImagem.onload = () => {
                    pokemonInfo.classList.remove("hidden");
                    btnsNavegacao.classList.remove("hidden");
                    mensagemLoading.classList.add("hidden");

                    pokemonInfo.classList.remove("animar");
                    void pokemonInfo.offsetWidth;
                    pokemonInfo.classList.add("animar");
                };

                pokemonImagem.src = pokemonAtual.imagemAnimada;

                pokemonNome.textContent =
                    `${pokemonAtual.nome.charAt(0).toUpperCase() + pokemonAtual.nome.slice(1)} Lv${nivel}`;

                pokemonDescricao.textContent =
                    `Peso: ${peso}kg | Altura: ${altura}m`;

            } catch (erro) {
                mensagemLoading.classList.add("hidden");
                alert("Erro ao buscar pokemon");
            }
        });
    }

    // TIPOS
    function mostrarTipo(tiposArray) {
        pokemonTipo.innerHTML = "";

        tiposArray.forEach(tipo => {
            const span = document.createElement("span");
            span.textContent = tipo.toUpperCase();
            span.classList.add("tipo", tipo);
            pokemonTipo.appendChild(span);
        });
    }

    // CAPTURAR
    if (btnCapturar) {
        btnCapturar.addEventListener("click", async () => {
            if (!pokemonAtual) return;

            capturados.push(pokemonAtual);
            localStorage.setItem("capturados", JSON.stringify(capturados));
            await fetch('http://localhost:3000/pokemon', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(pokemonAtual)})
            atualizarLista();
            limparTela();
        });
    }

    //RECUSAR
    if (btnRecusar) {
        btnRecusar.addEventListener("click", () => {
            limparTela();
        });
    }

    //LISTA
    function atualizarLista() {

        if (!listaCapturados) return;

        listaCapturados.innerHTML = "";

        if (!capturados || !Array.isArray(capturados)) return;

        capturados.forEach((pokemon, index) => {
            if (!pokemon || !pokemon.imagem || !pokemon.nome) return;

            const li = document.createElement("li");
            li.dataset.nome = pokemon.nome;
            const img = document.createElement("img");
            img.src = pokemon.imagem;
            img.style.width = "75px";

            li.appendChild(img);
            pokemonImagem.classList.add("hidden");
            li.addEventListener("click", () =>{
                pokemonImagem.classList.remove("hidden");
                mostrarPokemon(pokemon);
            })
                pokemonAtual = null;

            listaCapturados.appendChild(li);
        });
    }

    //MOSTRAR POKEMON
    function mostrarPokemon(pokemon) {
        if (pokemonInfo) {
            pokemonInfo.classList.remove("hidden");
        }

        if (btnsNavegacao) {
            btnsNavegacao.classList.remove("hidden");
        }

        pokeonSelecionado = pokemon;
        abrirPainel();
        pokemonNome.textContent = pokemon.nome.charAt(0).toUpperCase()+pokemon.nome.slice(1);
        pokemonImagem.src = pokemon.imagemAnimada;
        pokemonLevel.textContent =  `Lv. ${pokemon.nivel || 1}`;
        
        const tipoDiv = document.getElementById("pokemon-tipo");
        tipoDiv.innerHTML = "";

        if (pokemon.tipos) {
            pokemon.tipos.forEach(tipo => {
                const span = document.createElement("span");
                span.textContent = tipo.toUpperCase();
                span.classList.add(tipo);
                tipoDiv.appendChild(span);
            });
        }
        pokemonPeso.textContent = `Peso: ${pokemon.peso}kg`;
        pokemonAltura.textContent = `Altura: ${pokemon.altura}m`;
    }

    // BUSCAR POKEMON
    // input.addEventListener("input", () => {
    //     const valor = input.value.toLowerCase();

    //     const filtrados = capturados.filter(pokemon =>
    //         pokemon.nome.toLowerCase().includes(valor)
    //     );

    //     mostrarLista(filtrados);
    // });

    btnNome.addEventListener("click", async () => {
        const valor = input.value.toLowerCase();
    
        const filtrados = capturados.filter(pokemon =>
            pokemon.nome.toLowerCase().includes(valor)
        );

        mostrarLista(filtrados);
        await fetch(`http://localhost:3000/pokemon/nome/${valor}`, {method: 'GET', headers: {'Content-Type': 'application/json'}});
    });

    btnTipo.addEventListener("click", async () => {
        const valor = input.value.toLowerCase();

        const filtrados = capturados.filter(pokemon =>
            pokemon.tipos.some(tipo => tipo.toLowerCase().includes(valor))
        );

        mostrarLista(filtrados);
        await fetch(`http://localhost:3000/pokemon/tipo/${valor}`, {method: 'GET', headers: {'Content-Type': 'application/json'}});
    });


    btnId.addEventListener("click", async () => {
        const valor = parseInt(input.value) || Infinity;
        if (isNaN(valor)) {
            alert("Digite um nómero válido");
            return;
        }
        const filtrados = capturados.filter(pokemon =>
            pokemon.id === valor
        );
        filtrados.sort((a, b) => a.nivel - b.nivel);
        mostrarLista(filtrados);
        await fetch(`http://localhost:3000/pokemon/id/${valor}`, {method: 'GET', headers: {'Content-Type': 'application/json'}});
    });


    btnLevel.addEventListener("click", async () => {
        const valor = parseInt(input.value) || Infinity;
        if (isNaN(valor)) {
            alert("Digite um nómero válido");
            return;
        }
        const filtrados = capturados.filter(pokemon =>
            pokemon.nivel === valor
        );
        filtrados.sort((a, b) => a.nivel - b.nivel);
        mostrarLista(filtrados);
        await fetch(`http://localhost:3000/pokemon/nivel/${valor}`, {method: 'GET', headers: {'Content-Type': 'application/json'}});
    });

    function mostrarLista(lista) {
        listaCapturados.innerHTML = "";

        lista.forEach((pokemon) => {
            if (!pokemon || !pokemon.imagem || !pokemon.nome) return;

            const li = document.createElement("li");
            li.dataset.nome = pokemon.nome;
            const img = document.createElement("img");
            img.src = pokemon.imagem;
            img.style.width = "75px";

            li.appendChild(img);
            pokemonImagem.classList.add("hidden");
            li.addEventListener("click", () =>{
                pokemonImagem.classList.remove("hidden");
                mostrarPokemon(pokemon);
            })

            listaCapturados.appendChild(li);
        });
    }

    // LIMPAR / POKEDEX
    if (btnApagarTudo) {
        btnApagarTudo.addEventListener("click", async () => {
            capturados = [];
            localStorage.removeItem("capturados");
            mostrarLista([]);
            fecharPainel();
            await fetch('http://localhost:3000/pokemon', {method: 'DELETE', headers: {'Content-Type': 'application/json'}})
        });
    }

    if (btnApagarFiltrados) {
        btnApagarFiltrados.addEventListener("click", () => {
            const itensNaTela = Array.from(listaCapturados.children);
            const nomesVisiveis = itensNaTela.map(li =>
                li.dataset.nome
            );

            capturados = capturados.filter(pokemon =>
                !nomesVisiveis.includes(pokemon.nome)
            );

            localStorage.setItem("capturados", JSON.stringify(capturados));
            mostrarLista(capturados);
            fecharPainel();
        });
    }

    if (btnApagarPokemon) {
        btnApagarPokemon.addEventListener("click", async ()=>{
            capturados = capturados.filter(p =>
                p.nome !== pokeonSelecionado.nome
            );

            localStorage.setItem("capturados", JSON.stringify(capturados));
            mostrarLista(capturados);
            fecharPainel();
            await fetch(`http://localhost:3000/pokemon/${pokeonSelecionado.id}`, {method: 'DELETE', headers: {'Content-Type': 'application/json'}})
        });
    }

    // LIMPAR TELA
    function limparTela() {
        pokemonInfo.classList.add("hidden");
        btnsNavegacao.classList.add("hidden");
        pokemonAtual = null;
    }

    function abrirPainel() {
        painelPokemon.classList.remove("hidden");
        painelPokemon.classList.remove("animar-abrir");
        void painelPokemon.offsetWidth;
        painelPokemon.classList.add("animar-abrir");
    }

    function fecharPainel() {
        painelPokemon.classList.remove("animar-abrir");
        painelPokemon.classList.add("animar-fechar");
        setTimeout(() => {
            painelPokemon.classList.add("hidden");
            painelPokemon.classList.remove("animar-fechar");
        }, 300);
    }

    // BOTOES FILTRAR
    btnToggle.addEventListener("click", () => {
        if (subBotoes.style.display === "none" || subBotoes.style.display === "") {
            subBotoes.style.display = "flex";
        } else {
            subBotoes.style.display = "none";
        }
    });

});