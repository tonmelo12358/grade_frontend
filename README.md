## Front end Correlation

Este projeto faz parte da Disciplina **Arquitetura de Software** da Pós-Graduação em Engenharia de Software da PUC-RIO.

O objetivo é criar uma aplicação que se comunique com componentes de mercado e desenvolvidos internamente.

A aplicação escolhida para este projeto é a Grade de Programação. Uma ferramenta útil para criação de grades de programação de canais de TV.

Grandes empresas de Mídia e Entretenimento (M&E) possuem necessidade de gerenciar a programação dos seus canais, sejam eles distribuídos por meio terreste (Over The Air - OTA) ou pela internet (Over The Top - OTT). Para fazer a gestão e gerar playlist de todos os conteúdos que irão passar em um canal é necessário ter uma ferramenta que crie a ordenação destes itens, como é o caso do **Grade** . Uma vez feita esta programação podemos consultar a base e buscar o planejamento dos itens para cada dia da semana.

O site da grade criado para este MVP se comunica com uma API de mercado que possui um database de conteúdos audiovisuais. O nome do serviço é [Open Media Data Base - OMDB](https://www.omdbapi.com/) , que possui um vasto catálogo de filmes. Ele aceita requisições para busca de filmes baseado no título (todos os nomes estão em inglês) ou no ID do IMDB, base famosa de filmes (pertence a Amazon) utilizada pela maioria das empresas de M&E no mercado mundial. Através da busca do título podemos pesquisar uma lista de resultados (com informações básicas do título) ou então podemos buscar a correspondência exata, que trará  informações mais completas sobre o título pesquisado. São 2 endpoints diferentes. No projeto da Grade estou utilizando as 2 rotas para prover uma experiência melhor para decisão sobre qual filme programar.


## Como executar
Basta fazer o download do projeto e abrir o arquivo index.html no seu browser.

## Como executar através do Docker

Certifique-se de ter o **Docker** instalado e em execução em sua máquina.

Navegue até o diretório que contém o Dockerfile no terminal e seus arquivos de aplicação e Execute como administrador o seguinte comando para construir a imagem Docker:

> $ docker build -t grade-frontend .

Uma vez criada a imagem, para executar o container basta executar, como administrador, seguinte o comando:

> $ docker run -d -p 80:80 --name meu-frontend-container grade-frontend

Uma vez executando, para acessar o front-end, basta abrir o http://localhost/ no navegador.

## Como funciona o Front

A página da Grade apresenta 3 partes:

#### 1 - Pesquisar um filme: 
Você pode buscar filmes na página. Basta preencher o campo título **(nomes em inglês. Por exemplo, se quiser buscar "De Volta para o Futuro" digite Back to the Future )** **OU** o ID do IMDB (você pode pesquisar o id de um filme na internet). Não é necessário escrever o nome exato de um filme. Se quiser pode escrever uma ou 2 palavras e você terá como resultado uma lista com os itens que possuem estas palavras.
Quando encontrar o filme que quer, clique em selecionar para ver mais detalhes. Quando ver os detalhes você poderá fechar o card de detalhes ou selecionar o filme. Quando voc6e seleciona, o nome do filme e a informação sobre a duração serão enviadas para a próxima parte do site.


#### 2 - Adicionar um Item à Grade: 
Este formulário é utilizado para criar um novo item que será planejado para exibição no canal.
Nesta parte você precisa preencher (campos obrigatórios):

- Título (autocompletado pela busca de filmes ou você pode acrescentar manualmente - imagine que você irá programar propagandas também);

- Data de quando o item será exibido;

- Hora de início da exibição;

- Duração (apenas número - minutos);

- Hora do fim da exibição (autocompletado após inserir as 2 informações acima);

Para a criação de um novo item na grade foram estabelecidas 2 regras de negócio:

- Você não pode criar um item de grade para uma data ou horário anterior ao horário do momento da adição;

- Não podemos ter 2 filmes ocupando uma mesma faixa de horário no mesmo dia. Um filme/propaganda só pode iniciar quando o outro terminar.

Uma vez que estas regras foram observadas e os campos foram preenchidos, clique em adicionar e o novo item será cadastrado na base do sistema.

#### 3 - Acompanhamento de Programação por Data
Você poderá visualizar uma tabela contendo todos os itens cadastrados no site.
Selecione uma data e clique em carregar dados, e todos os itens cadastrados para a data selecionada irão aparecer em formato de tabela.
Você pode excluir um item programado. Escolha o item e clique em excluir.

