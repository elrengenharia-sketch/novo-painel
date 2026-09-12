// Roteiro Europa — 8 a 22 de abril de 2027
window.TRIP = {
  meta: {
    start: "08", end: "22", month: "abril", year: "2027",
    countries: 12, stops: 16, days: 15,
    dedication: "O melhor destino é aquele que a gente vive junto."
  },
  chapters: [
    {
      id: "paris", n: "01", city: "Paris", country: "França", cc: "fr",
      accent: "#3F7BA8",
      days: "DIA 01", dates: "8 de abril",
      intro: "Porta de entrada e primeiro contato com a viagem: arquitetura monumental, margens do Sena e bairros que funcionam melhor percorridos a pé, sem pressa.",
      transit: "RER B desde CDG, mochilas guardadas e o dia concentrado no eixo central. Amanhã, Eurostar cedo para Bruxelas.",
      scenes: [
        { name: "Île de la Cité", time: "2h", note: "Notre-Dame, Sainte-Chapelle e as pontes mais antigas. Comece aqui para entender a formação da cidade.", art: { kind: "river-towers", sky: "morning", water: true } },
        { name: "Louvre e Tuileries", time: "2h30", note: "Mesmo sem entrar no museu, o eixo do palácio até a Place de la Concorde entrega a caminhada mais marcante do centro.", art: { kind: "colonnade", sky: "noon", water: false } },
        { name: "Trocadéro e Torre Eiffel", time: "fim de tarde", note: "O Trocadéro entrega a vista frontal clássica; depois desça pelos jardins e atravesse o Sena até os pés da torre.", art: { kind: "tower", sky: "gold", water: true } }
      ]
    },
    {
      id: "brussels", n: "02", city: "Bruxelas", country: "Bélgica", cc: "be",
      accent: "#B5773F",
      days: "DIA 02", dates: "9 de abril",
      intro: "Escala compacta e saborosa: fachadas barrocas, galerias elegantes, cervejas trapistas e chocolate num centro que cabe em poucas horas.",
      transit: "Bagagem em Bruxelles-Midi, trem local até Central, e volta para seguir de Eurostar a Amsterdam.",
      scenes: [
        { name: "Grand-Place", time: "45 min", note: "A praça central, cercada pelas antigas casas das guildas e pela prefeitura gótica — o conjunto mais importante da cidade.", art: { kind: "guild-square", sky: "morning", water: false } },
        { name: "Galeries Royales", time: "45 min", note: "Galerias cobertas do século XIX: vitrines históricas, chocolate belga e abrigo garantido em caso de chuva.", art: { kind: "arcade", sky: "interior", water: false } },
        { name: "Mont des Arts", time: "30 min", note: "Jardins em níveis entre a cidade alta e baixa, com uma das melhores vistas urbanas e acesso rápido à Central.", art: { kind: "terrace", sky: "dusk", water: false } }
      ]
    },
    {
      id: "amsterdam", n: "03", city: "Amsterdam", country: "Países Baixos", cc: "nl",
      accent: "#3E8891",
      days: "DIAS 02–03", dates: "9 e 10 de abril",
      intro: "A melhor versão da cidade está no ritmo dos canais. O centro é compacto, mas cada anel muda a paisagem — das casas estreitas do Jordaan aos museus do Museumplein.",
      transit: "Tram e metrô resolvem os trechos longos. No fim da tarde, ICE ou conexão rápida em Utrecht rumo a Colônia.",
      scenes: [
        { name: "Canais e Jordaan", time: "1h30", note: "Brouwersgracht e Prinsengracht: pontes, casas inclinadas e pátios tranquilos fora do fluxo principal.", art: { kind: "canal-houses", sky: "morning", water: true } },
        { name: "Cruzeiro pelos canais", time: "1h", note: "A água mostra a lógica urbana do século XVII e deixa descansar sem perder a leitura da cidade. Reserve perto do entardecer.", art: { kind: "canal-boat", sky: "gold", water: true } },
        { name: "Museumplein", time: "1h30", note: "Rijksmuseum, Van Gogh e o grande gramado formam o polo cultural. Escolha um só museu para não comprimir o dia.", art: { kind: "museum", sky: "noon", water: false } }
      ]
    },
    {
      id: "cologne", n: "04", city: "Colônia", country: "Alemanha", cc: "de",
      accent: "#A8433F",
      days: "DIA 03", dates: "10 de abril",
      intro: "Tudo gira em torno da catedral monumental e do Reno. Parada eficiente: a atração principal já aparece ao sair da estação e o centro antigo fica ao lado.",
      transit: "Hospedagem perto da Hauptbahnhof reduz deslocamentos. A saída combina regionais até Luxemburgo e depois Strasbourg.",
      scenes: [
        { name: "Catedral de Colônia", time: "1h15", note: "Patrimônio gótico iniciado no século XIII, abriga o relicário dos Três Reis. A nave impressiona; a torre exige disposição.", art: { kind: "spires", sky: "morning", water: false } },
        { name: "Altstadt", time: "50 min", note: "Ruelas reconstruídas, praças históricas e cervejarias de Kölsch entre a catedral e o rio.", art: { kind: "roofline", sky: "dusk", water: false } },
        { name: "Ponte Hohenzollern", time: "45 min", note: "A travessia ferroviária e pedonal entrega a vista mais completa da catedral recortada contra o skyline.", art: { kind: "rail-bridge", sky: "night", water: true } }
      ]
    },
    {
      id: "luxembourg", n: "05", city: "Luxemburgo", country: "Luxemburgo", cc: "lu",
      accent: "#6B8A54",
      days: "DIA 04", dates: "11 de abril",
      intro: "Capital construída em camadas sobre vales profundos. Em poucas horas o percurso alterna mirantes, fortalezas e bairros baixos com aparência de vila.",
      transit: "Guarda-volumes na estação e transporte público gratuito no país inteiro. Volte à Gare para a conexão a Strasbourg.",
      scenes: [
        { name: "Chemin de la Corniche", time: "45 min", note: "A varanda mais bonita da Europa acompanha as antigas muralhas, com vista ampla sobre o vale do Alzette e o Grund.", art: { kind: "cliff-valley", sky: "morning", water: false } },
        { name: "Casemates du Bock", time: "1h", note: "Galerias defensivas escavadas na rocha mostram por que a fortaleza foi considerada uma das mais poderosas do continente.", art: { kind: "casemate", sky: "interior", water: false } },
        { name: "Grund", time: "1h", note: "O bairro baixo reúne casas históricas, pontes e o rio Alzette. A descida a pé se compensa com elevadores públicos gratuitos.", art: { kind: "low-village", sky: "gold", water: true } }
      ]
    },
    {
      id: "strasbourg", n: "06", city: "Strasbourg", country: "França", cc: "fr",
      accent: "#C2603A",
      days: "DIAS 04–05", dates: "11 e 12 de abril",
      intro: "França e Alemanha misturadas na arquitetura, na comida e no idioma. O centro histórico insular concentra catedral, canais e casas enxaimel.",
      transit: "Tram serve os trechos externos, mas o centro é pedonal. Partida cedo via Basel para aproveitar a tarde em Lucerna.",
      scenes: [
        { name: "Catedral Notre-Dame", time: "1h", note: "Fachada em arenito rosado e relógio astronômico fazem dela o grande marco da Alsácia. A praça merece uma volta completa.", art: { kind: "spires", sky: "gold", water: false } },
        { name: "Petite France", time: "1h30", note: "Antigo bairro de curtidores: canais, pontes cobertas e as fachadas enxaimel mais fotografadas da cidade.", art: { kind: "half-timber", sky: "morning", water: true } },
        { name: "Barragem Vauban", time: "45 min", note: "A cobertura panorâmica mostra as Ponts Couverts, a torre da catedral e a organização defensiva da cidade.", art: { kind: "covered-bridge", sky: "dusk", water: true } }
      ]
    },
    {
      id: "lucerne", n: "07", city: "Lucerna", sub: "+ Titlis", country: "Suíça", cc: "ch",
      accent: "#4E8CB4",
      days: "DIAS 05–07", dates: "12 a 14 de abril",
      intro: "A base alpina da viagem: lago, centro medieval e montanhas já visíveis das pontes. O dia seguinte sobe até a neve permanente do Titlis.",
      transit: "Compre a subida ao Titlis com margem para o clima. Na manhã seguinte, atravesse o Gotthard por Bellinzona e Lugano até Milão.",
      scenes: [
        { name: "Centro e Kapellbrücke", time: "1h30", note: "A ponte de madeira coberta atravessa o Reuss e preserva pinturas triangulares históricas. Siga pelas praças do centro antigo.", art: { kind: "wood-bridge", sky: "morning", water: true } },
        { name: "Monte Titlis", time: "dia inteiro", note: "Trem até Engelberg, teleféricos e cabine giratória acima de 3.000 metros: neve, ponte suspensa e panoramas glaciais.", art: { kind: "snow-peak", sky: "alpine", water: false } },
        { name: "Margem do lago", time: "1h", note: "O passeio entre a estação e o Museu dos Transportes abre vistas dos Alpes num ritmo mais leve, depois da descida.", art: { kind: "lake-alps", sky: "gold", water: true } }
      ]
    },
    {
      id: "italy", n: "08", city: "Milão", sub: "+ Veneza", country: "Itália", cc: "it",
      accent: "#B5613F",
      days: "DIAS 07–08", dates: "14 e 15 de abril",
      intro: "Duas cidades completamente diferentes conectadas pela alta velocidade: o mármore vertical de Milão e a água horizontal de Veneza, no mesmo par de dias.",
      transit: "Frecciarossa entre as duas. Em Veneza, San Marco antes de embarcar no Nightjet para Viena.",
      scenes: [
        { name: "Duomo e terraços", time: "2h", note: "A catedral de mármore com suas agulhas e estátuas; os terraços permitem caminhar entre os pináculos com a cidade aos pés.", art: { kind: "duomo", sky: "noon", water: false } },
        { name: "Galleria Vittorio Emanuele", time: "45 min", note: "A galeria de ferro e vidro do século XIX liga o Duomo ao Scala e é o salão de visitas da cidade.", art: { kind: "glass-arcade", sky: "interior", water: false } },
        { name: "Rialto e Grande Canal", time: "2h30", note: "A curva do canal, os palácios na água e a ponte de pedra. Em Veneza, o transporte é a própria atração.", art: { kind: "venice-canal", sky: "gold", water: true } }
      ]
    },
    {
      id: "vienna", n: "09", city: "Viena", country: "Áustria", cc: "at",
      accent: "#A66B47",
      days: "DIAS 09, 14 E 15", dates: "16, 21 e 22 de abril",
      intro: "Aparece em três momentos e funciona como eixo logístico do leste europeu. Palácios imperiais, cafés e transporte exemplar permitem dividir a cidade sem repetição.",
      transit: "Metrô e tram. Na primeira passagem, Railjet a Budapeste; na última, durma com acesso simples à linha do aeroporto.",
      scenes: [
        { name: "Innere Stadt", time: "1h30", note: "O coração imperial reúne a Catedral de Santo Estêvão, Graben, Hofburg e edifícios monumentais dentro do antigo anel de muralhas.", art: { kind: "spires", sky: "night", water: false } },
        { name: "Schönbrunn", time: "2h30", note: "Residência de verão dos Habsburgo, com salões de aparato e jardins extensos. Priorize o palácio ou os jardins conforme o horário.", art: { kind: "baroque-palace", sky: "morning", water: false } },
        { name: "Belvedere", time: "2h", note: "Dois palácios barrocos ligados por jardins abrigam a coleção de Klimt, incluindo O Beijo, e uma bela perspectiva urbana.", art: { kind: "baroque-garden", sky: "noon", water: false } }
      ]
    },
    {
      id: "budapest", n: "10", city: "Budapeste", country: "Hungria", cc: "hu",
      accent: "#B8903B",
      days: "DIAS 09–11", dates: "16 a 18 de abril",
      intro: "Pede um dia inteiro porque são duas cidades complementares: Buda sobe pelas colinas históricas; Pest concentra avenidas, cafés e o Parlamento à margem do Danúbio.",
      transit: "O metrô conecta os extremos; o tram 2 acompanha o Danúbio. Na saída, trem direto para Bratislava com bagagem pronta para o EuroNight.",
      scenes: [
        { name: "Colina do Castelo", time: "2h30", note: "Bastião dos Pescadores, Igreja de Matias e mirantes sobre Pest formam o conjunto mais cenográfico. Suba cedo.", art: { kind: "hill-castle", sky: "morning", water: true } },
        { name: "Parlamento e memorial", time: "2h", note: "O edifício neogótico domina o rio. Combine a visita com o memorial Sapatos às Margens do Danúbio.", art: { kind: "parliament", sky: "dusk", water: true } },
        { name: "Termas ou cruzeiro", time: "noite", note: "Escolha entre a experiência termal de Széchenyi e um cruzeiro para ver Parlamento, pontes e castelo iluminados.", art: { kind: "night-water", sky: "night", water: true } }
      ]
    },
    {
      id: "bratislava", n: "11", city: "Bratislava", country: "Eslováquia", cc: "sk",
      accent: "#6B8398",
      days: "DIA 11", dates: "18 de abril",
      intro: "Capital pequena e legível, perfeita para uma escala a pé. O centro medieval fica entre a estação, o castelo e o Danúbio.",
      transit: "Guarda-volumes e roteiro compacto. Depois do jantar, embarque no trem noturno em direção à Cracóvia.",
      scenes: [
        { name: "Centro histórico", time: "1h15", note: "O Portão de São Miguel conduz a ruas pedonais, praças e palácios compactos, pontuados pelas conhecidas esculturas urbanas.", art: { kind: "gate-tower", sky: "morning", water: false } },
        { name: "Castelo de Bratislava", time: "1h15", note: "A fortaleza branca domina o Danúbio e abre vistas para a Áustria e a Hungria. A subida é curta, porém inclinada.", art: { kind: "white-fortress", sky: "noon", water: true } },
        { name: "Margem do Danúbio", time: "45 min", note: "O passeio ribeirinho conecta o centro à ponte SNP e ao bairro contemporâneo, mostrando outra escala da cidade.", art: { kind: "modern-bridge", sky: "dusk", water: true } }
      ]
    },
    {
      id: "krakow", n: "12", city: "Cracóvia", sub: "+ Wieliczka", country: "Polônia", cc: "pl",
      accent: "#9A5762",
      days: "DIA 12", dates: "19 de abril",
      intro: "Uma das praças medievais mais preservadas da Europa, somada a Wieliczka — uma cidade subterrânea esculpida por séculos de mineração de sal.",
      transit: "Reserve Wieliczka com antecedência e conte o traslado desde o centro. À noite, embarque rumo a Praga para ganhar um dia.",
      scenes: [
        { name: "Rynek Główny", time: "1h30", note: "A grande praça reúne o Mercado dos Tecidos, a Basílica de Santa Maria e cafés históricos. O trompete marca cada hora.", art: { kind: "cloth-hall", sky: "morning", water: false } },
        { name: "Wawel", time: "1h30", note: "O castelo e a catedral acima do Vístula condensam a história dos reis poloneses e fecham a caminhada pela Via Real.", art: { kind: "hill-castle", sky: "gold", water: true } },
        { name: "Mina de Wieliczka", time: "3h", note: "O percurso guiado desce por câmaras, lagos e capelas talhadas em sal, com destaque para a Capela de Santa Kinga.", art: { kind: "salt-cave", sky: "underground", water: true } }
      ]
    },
    {
      id: "prague", n: "13", city: "Praga", country: "Tchéquia", cc: "cz",
      accent: "#B3603C",
      days: "DIAS 13–14", dates: "20 e 21 de abril",
      intro: "Fecha o roteiro com forte impacto visual: torres, cúpulas e telhados atravessados pelo Vltava. Começar cedo transforma completamente a experiência.",
      transit: "Tram para vencer a subida ao castelo e volta a pé. No dia 21, Railjet via Brno retorna a Viena para a última noite.",
      scenes: [
        { name: "Ponte Carlos", time: "1h", note: "Ao amanhecer, a ponte do século XIV revela estátuas, torres e perspectivas sem o fluxo intenso que ocupa o local durante o dia.", art: { kind: "statue-bridge", sky: "dawn", water: true } },
        { name: "Castelo e Malá Strana", time: "2h30", note: "O maior complexo fortificado da cidade reúne a Catedral de São Vito, palácios, vielas e mirantes sobre os telhados.", art: { kind: "castle-panorama", sky: "noon", water: true } },
        { name: "Cidade Velha", time: "2h", note: "Praça, Relógio Astronômico e ruelas formam o núcleo mais movimentado. Suba a uma torre para entender o desenho medieval.", art: { kind: "clock-square", sky: "dusk", water: false } }
      ]
    }
  ],
  calendar: [
    { d: "08", place: "Paris", detail: "Chegada em CDG às 07:05, guarda-volumes e primeiro passeio.", route: "CDG · Paris" },
    { d: "09", place: "Bruxelas → Amsterdam", detail: "Eurostar cedo, centro de Bruxelas em escala, noite em Amsterdam.", route: "Paris · Bruxelas · Amsterdam" },
    { d: "10", place: "Amsterdam → Colônia", detail: "Canais e Museumplein pela manhã; trem no fim da tarde.", route: "Amsterdam · Colônia" },
    { d: "11", place: "Luxemburgo → Strasbourg", detail: "Regionais pela manhã, Corniche e Casemates, noite na Alsácia.", route: "Colônia · Luxemburgo · Strasbourg" },
    { d: "12", place: "Strasbourg → Lucerna", detail: "Petite France cedo; via Basel para chegar a tempo do lago.", route: "Strasbourg · Basel · Lucerna" },
    { d: "13", place: "Monte Titlis", detail: "Dia inteiro na montanha: Engelberg, teleféricos, neve a 3.041 m.", route: "Lucerna · Engelberg · Titlis" },
    { d: "14", place: "Lucerna → Milão", detail: "Travessia do Gotthard por Bellinzona e Lugano; Duomo à tarde.", route: "Lucerna · Milão" },
    { d: "15", place: "Veneza → Viena", detail: "Rialto e San Marco; Nightjet noturno para a Áustria.", route: "Milão · Veneza · Viena" },
    { d: "16", place: "Viena → Budapeste", detail: "Innere Stadt na chegada, Railjet à tarde, noite em Pest.", route: "Viena · Budapeste" },
    { d: "17", place: "Budapeste", detail: "Colina do Castelo, Parlamento e a noite nas termas ou no rio.", route: "Buda · Pest" },
    { d: "18", place: "Bratislava → noturno", detail: "Escala a pé na capital eslovaca; EuroNight rumo à Polônia.", route: "Budapeste · Bratislava · EuroNight" },
    { d: "19", place: "Cracóvia + Wieliczka", detail: "Rynek e Wawel de dia, mina de sal à tarde, noturno para Praga.", route: "Cracóvia · Wieliczka · EuroNight" },
    { d: "20", place: "Praga", detail: "Ponte Carlos ao amanhecer, castelo e Malá Strana no resto do dia.", route: "Praga" },
    { d: "21", place: "Praga → Viena", detail: "Cidade Velha pela manhã; Railjet via Brno para a última noite.", route: "Praga · Brno · Viena" },
    { d: "22", place: "Viena → casa", detail: "Café final, linha do aeroporto e voo de volta.", route: "Viena · VIE" }
  ],
  logistics: [
    { t: "Duas mochilas", d: "Guarda-volumes nas escalas e lavanderia automática no meio da rota." },
    { t: "Três noites em trem", d: "Veneza–Viena, Bratislava–Cracóvia e Cracóvia–Praga." },
    { t: "Reservas estratégicas", d: "Eurostar, trechos internacionais e atrações com horário marcado." }
  ]
};
