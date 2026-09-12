// Europa em 15 dias — 8 a 22 de abril de 2027
// leg = como chegamos até aqui · via = cidades que só veremos pela janela
// sleep = onde dormimos naquela noite
window.TRIP = {
  meta: {
    start: "08", end: "22", month: "abril", year: "2027",
    countries: 12, stops: 14, days: 15, nightTrains: 3,
    eyebrow: "Uma viagem para nós dois",
    dedication: "O melhor destino é aquele que a gente vive junto."
  },
  chapters: [
    {
      id: "paris", n: "01", city: "Paris", country: "França", cc: "fr",
      accent: "#3F7BA8", days: "DIA 01", dates: "quinta, 8 de abril",
      leg: { mode: "voo", label: "Chegada em CDG", time: "07:05", dur: "", via: [] },
      sleep: "Paris",
      intro: "A viagem começa com a cidade inteira pela frente. Deixamos as mochilas e saímos a pé pelo eixo central — o primeiro café da Europa sai numa mesa de calçada, sem pressa nenhuma.",
      scenes: [
        { name: "Île de la Cité", time: "2h", note: "A ilha onde Paris nasceu. Notre-Dame, a Sainte-Chapelle e as pontes mais antigas da cidade, todas a poucos passos uma da outra.", art: { kind: "notredame", sky: "morning", water: true } },
        { name: "Louvre e Tuileries", time: "2h30", note: "A pirâmide de vidro no pátio do palácio, e dali o jardim se abre em linha reta até a Concorde. A caminhada mais bonita do centro, mesmo sem entrar no museu.", art: { kind: "louvre", sky: "noon", water: false } },
        { name: "Trocadéro e Torre Eiffel", time: "fim de tarde", note: "Guardamos a Eiffel para o fim do dia. Do Trocadéro vem a vista frontal que todo mundo conhece; depois descemos os jardins e atravessamos o Sena até ficar embaixo dela.", art: { kind: "eiffel", sky: "gold", water: true } }
      ]
    },
    {
      id: "brussels", n: "02", city: "Bruxelas", country: "Bélgica", cc: "be",
      accent: "#B5773F", days: "DIA 02", dates: "sexta, 9 de abril",
      leg: { mode: "Eurostar", label: "Paris → Bruxelas", time: "07:15 → 08:45", dur: "1h22", via: [] },
      sleep: "Amsterdam",
      intro: "Uma manhã inteira numa cidade que cabe em poucas horas — e que serve chocolate, waffle e cerveja trapista a cada esquina. Deixamos a bagagem na estação e andamos leves.",
      scenes: [
        { name: "Grand-Place", time: "45 min", note: "Uma praça fechada por casas de guilda douradas e pela prefeitura gótica, com a torre fora do eixo. Vale parar no meio e girar devagar.", art: { kind: "grandplace", sky: "morning", water: false } },
        { name: "Galeries Royales", time: "45 min", note: "Galeria coberta de 1847, vidro e ferro sobre vitrines antigas. É onde provamos o chocolate — e o abrigo perfeito se cair chuva.", art: { kind: "galleria", sky: "interior", water: false } },
        { name: "Mont des Arts", time: "30 min", note: "Jardins em terraços entre a cidade alta e a baixa, com a melhor vista do centro e a estação logo ali embaixo.", art: { kind: "terrace", sky: "noon", water: false } }
      ]
    },
    {
      id: "amsterdam", n: "03", city: "Amsterdam", country: "Países Baixos", cc: "nl",
      accent: "#3E8891", days: "DIAS 02–03", dates: "9 e 10 de abril",
      leg: { mode: "Eurostar", label: "Bruxelas → Amsterdam", time: "17:50 → 19:50", dur: "1h52", via: ["Antuérpia", "Roterdã", "Schiphol"] },
      sleep: "Amsterdam",
      intro: "Chegamos de noite e a cidade já está com as luzes na água. No dia seguinte é tudo no ritmo dos canais: cada anel muda a paisagem, e o centro se faz a pé.",
      scenes: [
        { name: "Canais e Jordaan", time: "1h30", note: "Casas estreitas e tortas, empenas de campânula, pontes e pátios silenciosos. Brouwersgracht e Prinsengracht são o melhor par de canais da cidade.", art: { kind: "canalhouses", sky: "morning", water: true } },
        { name: "Cruzeiro pelos canais", time: "1h", note: "A cidade foi desenhada para ser vista da água. Uma hora sentados, no fim da tarde, com a luz baixa entre as casas.", art: { kind: "canal-boat", sky: "gold", water: true } },
        { name: "Museumplein", time: "1h30", note: "Rijksmuseum, Van Gogh e um gramado enorme no meio. Escolhemos um museu só — dois comprimem o dia e cansam.", art: { kind: "museum", sky: "noon", water: false } }
      ]
    },
    {
      id: "cologne", n: "04", city: "Colônia", country: "Alemanha", cc: "de",
      accent: "#A8433F", days: "DIAS 03–04", dates: "10 e 11 de abril",
      leg: { mode: "ICE", label: "Amsterdam → Colônia", time: "21:01 → 23:45", dur: "2h44", via: ["Utrecht", "Arnhem", "Oberhausen", "Duisburg", "Düsseldorf"] },
      sleep: "Colônia",
      intro: "Trem da noite para não perder o dia em Amsterdam. A catedral aparece já na saída da estação — é literalmente a primeira coisa que se vê, e ela é enorme.",
      scenes: [
        { name: "Catedral de Colônia", time: "1h15", note: "Gótico começado no século XIII e terminado no XIX. As duas agulhas vazadas de 157 metros foram o edifício mais alto do mundo por quatro anos.", art: { kind: "koelnerdom", sky: "morning", water: false } },
        { name: "Altstadt", time: "50 min", note: "O centro antigo reconstruído, com cervejarias de Kölsch servindo em copos pequenos que o garçom vai trocando sem perguntar.", art: { kind: "roofline", sky: "noon", water: false } },
        { name: "Ponte Hohenzollern", time: "45 min", note: "A ponte ferroviária tem passarela de pedestres e os cadeados de todo mundo nas grades. De lá vem a vista completa da catedral contra o rio.", art: { kind: "rail-bridge", sky: "dusk", water: true } }
      ]
    },
    {
      id: "luxembourg", n: "05", city: "Luxemburgo", country: "Luxemburgo", cc: "lu",
      accent: "#6B8A54", days: "DIA 04", dates: "domingo, 11 de abril",
      leg: { mode: "trem", label: "Colônia → Luxemburgo", time: "07:54 → 12:40", dur: "4h46", via: ["Frankfurt Aeroporto", "Mannheim", "Kaiserslautern", "Saarbrücken"] },
      sleep: "Strasbourg",
      intro: "Cinco horas numa capital construída em camadas sobre dois vales profundos. O transporte público do país inteiro é gratuito, então circulamos sem pensar em bilhete.",
      scenes: [
        { name: "Chemin de la Corniche", time: "45 min", note: "Chamam de a varanda mais bonita da Europa, e não é exagero: o caminho corre sobre as muralhas antigas com o vale do Alzette aberto embaixo.", art: { kind: "corniche", sky: "noon", water: false } },
        { name: "Casemates du Bock", time: "1h", note: "Vinte e três quilômetros de galerias escavadas na rocha. Sobrou o suficiente para entender por que esta fortaleza era considerada a mais forte do continente.", art: { kind: "casemate", sky: "interior", water: false } },
        { name: "Grund", time: "1h", note: "O bairro baixo, junto ao rio, com cara de vila. Descemos a pé e voltamos pelo elevador público — que também é gratuito.", art: { kind: "low-village", sky: "gold", water: true } }
      ]
    },
    {
      id: "strasbourg", n: "06", city: "Strasbourg", country: "França", cc: "fr",
      accent: "#C2603A", days: "DIAS 04–05", dates: "11 e 12 de abril",
      leg: { mode: "trem", label: "Luxemburgo → Strasbourg", time: "18:46 → 21:12", dur: "2h26", via: ["Thionville", "Metz"] },
      sleep: "Strasbourg",
      intro: "França e Alemanha misturadas na arquitetura, na comida e até no dialeto. O centro histórico é uma ilha cercada de canais, e é todo caminhável.",
      scenes: [
        { name: "Catedral Notre-Dame", time: "1h", note: "Arenito rosa e uma única agulha de 142 metros — a outra torre nunca foi construída, e é essa assimetria que a torna inconfundível.", art: { kind: "strasbourgcath", sky: "gold", water: false } },
        { name: "Petite France", time: "1h30", note: "O antigo bairro dos curtidores: casas enxaimel debruçadas sobre os canais, pontes baixas e flores nas janelas.", art: { kind: "half-timber", sky: "morning", water: true } },
        { name: "Barragem Vauban", time: "45 min", note: "Sobe-se até a cobertura para ver as Ponts Couverts alinhadas, a agulha da catedral ao fundo e todo o desenho defensivo da cidade.", art: { kind: "covered-bridge", sky: "noon", water: true } }
      ]
    },
    {
      id: "lucerne", n: "07", city: "Lucerna", sub: "+ Titlis", country: "Suíça", cc: "ch",
      accent: "#4E8CB4", days: "DIAS 05–07", dates: "12 a 14 de abril",
      leg: { mode: "trem", label: "Strasbourg → Lucerna", time: "06:51 → 09:55", dur: "3h04", via: ["Sélestat", "Colmar", "Mulhouse", "Basel", "Olten"] },
      sleep: "Lucerna (duas noites)",
      intro: "Duas noites no mesmo lugar — o único respiro da viagem. Lago, centro medieval e os Alpes já visíveis da ponte. E um dia inteiro reservado para subir à neve.",
      scenes: [
        { name: "Centro e Kapellbrücke", time: "1h30", note: "A ponte coberta de madeira mais antiga da Europa atravessa o Reuss na diagonal, com pinturas triangulares no teto e a torre octogonal de pedra no meio.", art: { kind: "kapellbruecke", sky: "morning", water: true } },
        { name: "Monte Titlis", time: "dia inteiro", note: "Trem até Engelberg, depois teleféricos e a cabine giratória até 3.020 metros. Neve o ano todo, geleira, e a ponte suspensa mais alta dos Alpes a 3.041 m.", art: { kind: "titlis", sky: "alpine", water: false } },
        { name: "Margem do lago", time: "1h", note: "Depois de descer da montanha, o passeio plano à beira d'água com os Alpes do outro lado. O ritmo mais leve de toda a viagem.", art: { kind: "lake-alps", sky: "gold", water: true } }
      ]
    },
    {
      id: "milan", n: "08", city: "Milão", country: "Itália", cc: "it",
      accent: "#B5613F", days: "DIA 07", dates: "quarta, 14 de abril",
      leg: { mode: "trem", label: "Lucerna → Milão, pelo Gotthard", time: "06:18 → 09:17", dur: "2h59", via: ["Arth-Goldau", "Bellinzona", "Lugano", "Chiasso", "Como", "Monza"] },
      sleep: "Milão",
      intro: "A travessia dos Alpes pelo Gotthard é parte do passeio: entra-se na Suíça alemã e sai-se falando italiano, com os lagos aparecendo na janela. Chegamos com o dia todo pela frente.",
      scenes: [
        { name: "Duomo e terraços", time: "2h", note: "Mármore branco, 135 agulhas e a Madonnina dourada no ponto mais alto. Sobe-se aos terraços para caminhar entre os pináculos, com a cidade aos pés.", art: { kind: "duomomilano", sky: "noon", water: false } },
        { name: "Galleria Vittorio Emanuele II", time: "45 min", note: "Ferro e vidro de 1877 ligando o Duomo ao Scala. É o salão de visitas de Milão — e dá sorte girar o calcanhar no touro do mosaico.", art: { kind: "galleria", sky: "interior", water: false } },
        { name: "Navigli ao anoitecer", time: "2h", note: "Os canais projetados por Leonardo, hoje cheios de mesas na calçada. É onde Milão relaxa e faz o aperitivo antes do jantar.", art: { kind: "canal-boat", sky: "dusk", water: true } }
      ]
    },
    {
      id: "venice", n: "09", city: "Veneza", country: "Itália", cc: "it",
      accent: "#C07A4A", days: "DIA 08", dates: "quinta, 15 de abril",
      leg: { mode: "alta velocidade", label: "Milão → Veneza", time: "07:00 → 09:15", dur: "2h15", via: ["Brescia", "Verona", "Vicenza", "Pádua"] },
      sleep: "no trem, rumo a Viena",
      intro: "Um dia inteiro numa cidade sem carro nenhum, onde o transporte público é barco. À noite embarcamos no Nightjet — e acordamos na Áustria.",
      scenes: [
        { name: "Rialto e Grande Canal", time: "2h30", note: "A ponte de pedra sobre a curva do canal, os palácios com o pé na água e o mercado de peixe logo atrás. A cidade se entende daqui.", art: { kind: "venice", sky: "morning", water: true } },
        { name: "Praça San Marco", time: "2h", note: "A basílica dourada, o Palácio Ducal e o campanile de 98 metros. Chegamos cedo ou no fim do dia, quando a praça respira.", art: { kind: "venice", sky: "gold", water: true } },
        { name: "Canais menores", time: "1h30", note: "Sair da rota principal e se perder de propósito nas vielas: pontes de um vão, roupa no varal, gôndolas passando em silêncio.", art: { kind: "canal-boat", sky: "noon", water: true } }
      ]
    },
    {
      id: "vienna", n: "10", city: "Viena", country: "Áustria", cc: "at",
      accent: "#A66B47", days: "DIAS 09, 14 E 15", dates: "16, 21 e 22 de abril",
      leg: { mode: "Nightjet", label: "Veneza → Viena, dormindo a bordo", time: "21:05 → 08:00", dur: "11h", via: ["Treviso", "Pordenone", "Udine", "Villach"], night: true },
      sleep: "cabine privativa no trem",
      intro: "Viena aparece três vezes: na chegada do trem noturno, e depois no fim, para as duas últimas noites. Palácios imperiais, cafés com mármore e bolo, e o melhor transporte público da rota.",
      scenes: [
        { name: "Innere Stadt", time: "1h30", note: "O centro imperial dentro do anel das antigas muralhas: a catedral de Santo Estêvão com o telhado em losangos, a Hofburg e a Graben.", art: { kind: "stephansdom", sky: "morning", water: false } },
        { name: "Schönbrunn", time: "2h30", note: "A residência de verão dos Habsburgo, com 1.441 salas e um jardim que sobe até a Gloriette. Escolhemos o palácio ou o parque, conforme a hora.", art: { kind: "schoenbrunn", sky: "noon", water: false } },
        { name: "Belvedere", time: "2h", note: "Dois palácios barrocos ligados por jardins em terraço. Dentro está O Beijo, de Klimt — e é bem menor do que se imagina.", art: { kind: "baroque-garden", sky: "gold", water: false } }
      ]
    },
    {
      id: "budapest", n: "11", city: "Budapeste", country: "Hungria", cc: "hu",
      accent: "#B8903B", days: "DIAS 09–11", dates: "16 a 18 de abril",
      leg: { mode: "Railjet", label: "Viena → Budapeste", time: "19:00 → 21:40", dur: "2h40", via: ["Győr"] },
      sleep: "Budapeste (duas noites)",
      intro: "São duas cidades que o Danúbio separou: Buda sobe pelas colinas, Pest se espalha em avenidas. Temos um dia cheio sem deslocamento nenhum — o segundo respiro da viagem.",
      scenes: [
        { name: "Colina do Castelo", time: "2h30", note: "O Bastião dos Pescadores com suas torres cônicas, a Igreja de Matias e Pest inteira do outro lado do rio. Subimos cedo, antes do movimento.", art: { kind: "fishermans", sky: "morning", water: true } },
        { name: "Parlamento e memorial", time: "2h", note: "O terceiro maior parlamento do mundo, neogótico, com a cúpula a 96 metros. Ao lado, os Sapatos às Margens do Danúbio — sessenta pares de ferro, e é impossível passar batido.", art: { kind: "parliament", sky: "dusk", water: true } },
        { name: "Termas ou cruzeiro", time: "noite", note: "Escolhemos entre mergulhar nas piscinas neobarrocas do Széchenyi ou ver do rio o Parlamento, as pontes e o castelo todos iluminados.", art: { kind: "night-water", sky: "night", water: true } }
      ]
    },
    {
      id: "bratislava", n: "12", city: "Bratislava", country: "Eslováquia", cc: "sk",
      accent: "#6B8398", days: "DIA 11", dates: "domingo, 18 de abril",
      leg: { mode: "trem", label: "Budapeste → Bratislava", time: "07:10 → 09:40", dur: "2h30", via: ["Vác", "Szob", "Štúrovo", "Nové Zámky"] },
      sleep: "no trem, rumo à Cracóvia",
      intro: "Uma capital pequena e fácil, toda contida entre a estação, o castelo e o rio. Passamos o dia a pé e à noite embarcamos na cabine com duas camas.",
      scenes: [
        { name: "Centro histórico", time: "1h15", note: "Entra-se pelo Portão de São Miguel e o centro se abre em ruas de pedestres, com as esculturas de bronze espalhadas — o Čumil saindo do bueiro é a mais fotografada.", art: { kind: "gate-tower", sky: "morning", water: false } },
        { name: "Castelo de Bratislava", time: "1h15", note: "O bloco branco com quatro torres domina o Danúbio. Do terraço se vê a Áustria de um lado e a Hungria do outro, as duas a poucos quilômetros.", art: { kind: "bratislavacastle", sky: "noon", water: true } },
        { name: "Margem do Danúbio", time: "45 min", note: "O passeio ribeirinho até a ponte SNP, com o restaurante em forma de disco voador no alto do pilone. A Bratislava socialista aparece aqui.", art: { kind: "modern-bridge", sky: "dusk", water: true } }
      ]
    },
    {
      id: "krakow", n: "13", city: "Cracóvia", sub: "+ Wieliczka", country: "Polônia", cc: "pl",
      accent: "#9A5762", days: "DIA 12", dates: "segunda, 19 de abril",
      leg: { mode: "EuroNight", label: "Bratislava → Cracóvia, cabine com duas camas", time: "21:58 → 07:15", dur: "9h17", via: ["Břeclav", "Bohumín", "Ostrava"], night: true },
      sleep: "no trem, rumo a Praga",
      intro: "A maior praça medieval da Europa em cima, e uma cidade esculpida em sal embaixo. Cracóvia escapou da destruição da guerra, então o que se vê é original.",
      scenes: [
        { name: "Rynek Główny", time: "1h30", note: "Duzentos metros de lado, com o Mercado dos Tecidos no meio. A cada hora um trompetista toca da torre de Santa Maria e interrompe no meio — em memória do vigia flechado.", art: { kind: "clothhall", sky: "morning", water: false } },
        { name: "Wawel", time: "1h30", note: "O castelo e a catedral no alto, sobre o Vístula, onde os reis poloneses foram coroados e enterrados. Fecha a caminhada pela Via Real.", art: { kind: "hill-castle", sky: "gold", water: true } },
        { name: "Mina de Wieliczka", time: "3h", note: "Cento e trinta e cinco metros abaixo do chão, câmaras, lagos e capelas inteiras talhadas no sal. A Capela de Santa Kinga tem até os candelabros feitos de cristal de sal.", art: { kind: "saltchapel", sky: "underground", water: true } }
      ]
    },
    {
      id: "prague", n: "14", city: "Praga", country: "Tchéquia", cc: "cz",
      accent: "#B3603C", days: "DIAS 13–14", dates: "20 e 21 de abril",
      leg: { mode: "EuroNight", label: "Cracóvia → Praga, cabine privativa", time: "21:00 → 07:00", dur: "10h", via: ["Bohumín", "Ostrava", "Olomouc", "Pardubice"], night: true },
      sleep: "Praga",
      intro: "O fecho da viagem, e talvez o mais bonito: torres, cúpulas e telhados vermelhos cortados pelo Vltava. Chegamos de manhã cedo, que é exatamente a melhor hora.",
      scenes: [
        { name: "Ponte Carlos", time: "1h", note: "Ao amanhecer a ponte do século XIV fica quase vazia, e dá para ver as trinta estátuas e as torres sem ninguém na frente. Algumas horas depois é impossível.", art: { kind: "charlesbridge", sky: "dawn", water: true } },
        { name: "Castelo e Malá Strana", time: "2h30", note: "O maior complexo de castelo do mundo, com a Catedral de São Vito no meio e as vielas de Malá Strana descendo até o rio.", art: { kind: "praguecastle", sky: "noon", water: true } },
        { name: "Cidade Velha", time: "2h", note: "O Relógio Astronômico de 1410 ainda funcionando, com os apóstolos desfilando a cada hora, e as duas torres desiguais do Týn atrás da praça.", art: { kind: "astroclock", sky: "dusk", water: false } }
      ]
    }
  ],
  calendar: [
    { d: "08", wd: "qui", place: "Paris", detail: "Chegada em CDG às 07:05. Île de la Cité, Louvre e a Eiffel no fim da tarde.", route: "CDG · Paris", sleep: "Paris" },
    { d: "09", wd: "sex", place: "Paris → Bruxelas → Amsterdam", detail: "Eurostar cedo, manhã em Bruxelas, e à noite os canais de Amsterdam.", route: "Antuérpia · Roterdã · Schiphol", sleep: "Amsterdam" },
    { d: "10", wd: "sáb", place: "Amsterdam → Colônia", detail: "Canais e Museumplein de dia; ICE das 21:01 para a Alemanha.", route: "Utrecht · Arnhem · Duisburg · Düsseldorf", sleep: "Colônia" },
    { d: "11", wd: "dom", place: "Colônia → Luxemburgo → Strasbourg", detail: "Catedral pela manhã, cinco horas em Luxemburgo, noite na Alsácia.", route: "Mannheim · Saarbrücken · Metz", sleep: "Strasbourg" },
    { d: "12", wd: "seg", place: "Strasbourg → Lucerna", detail: "Petite France de manhã cedo, e à tarde já estamos no lago suíço.", route: "Colmar · Mulhouse · Basel · Olten", sleep: "Lucerna" },
    { d: "13", wd: "ter", place: "Monte Titlis", detail: "Dia inteiro na montanha: Engelberg, teleféricos e a neve a 3.020 m.", route: "Engelberg · Titlis", sleep: "Lucerna" },
    { d: "14", wd: "qua", place: "Lucerna → Milão", detail: "Travessia dos Alpes pelo Gotthard; Duomo e Navigli à tarde.", route: "Bellinzona · Lugano · Como", sleep: "Milão" },
    { d: "15", wd: "qui", place: "Milão → Veneza → trem noturno", detail: "Rialto e San Marco, e às 21:05 o Nightjet para a Áustria.", route: "Verona · Vicenza · Pádua", sleep: "cabine no trem", night: true },
    { d: "16", wd: "sex", place: "Viena → Budapeste", detail: "Acordamos em Viena, centro imperial de dia, Railjet à noite.", route: "Győr", sleep: "Budapeste" },
    { d: "17", wd: "sáb", place: "Budapeste", detail: "Sem trem nenhum: colina do castelo, Parlamento e termas à noite.", route: "Buda · Pest", sleep: "Budapeste" },
    { d: "18", wd: "dom", place: "Budapeste → Bratislava → trem noturno", detail: "Dia a pé na capital eslovaca; EuroNight das 21:58 para a Polônia.", route: "Štúrovo · Břeclav · Ostrava", sleep: "cabine no trem", night: true },
    { d: "19", wd: "seg", place: "Cracóvia + Wieliczka", detail: "Rynek e Wawel de manhã, mina de sal à tarde, noturno para Praga.", route: "Olomouc · Pardubice", sleep: "cabine no trem", night: true },
    { d: "20", wd: "ter", place: "Praga", detail: "Ponte Carlos ao amanhecer, castelo e Malá Strana o resto do dia.", route: "Praga", sleep: "Praga" },
    { d: "21", wd: "qua", place: "Praga → Viena", detail: "Cidade Velha e o relógio pela manhã; Railjet à tarde para a última noite.", route: "Brno · Břeclav", sleep: "Viena" },
    { d: "22", wd: "qui", place: "Viena → casa", detail: "Um último café vienense e o voo de volta às 09:25.", route: "Viena · VIE", sleep: "—" }
  ],
  countries: [
    ["fr", "França"], ["be", "Bélgica"], ["nl", "Países Baixos"], ["de", "Alemanha"],
    ["lu", "Luxemburgo"], ["ch", "Suíça"], ["it", "Itália"], ["at", "Áustria"],
    ["hu", "Hungria"], ["sk", "Eslováquia"], ["pl", "Polônia"], ["cz", "Tchéquia"]
  ],
  logistics: [
    { t: "Três noites sobre trilhos", d: "Veneza–Viena, Bratislava–Cracóvia e Cracóvia–Praga, sempre em cabine só nossa, com cama. O trem anda enquanto dormimos e o dia seguinte começa numa cidade nova." },
    { t: "Caminhar onde vale a pena", d: "Duas a três horas a pé dentro de cada região, conhecendo tudo com calma — e metrô, tram ou táxi para ir de uma região a outra. Nada de andar quilômetros só por economia." },
    { t: "Duas mochilas", d: "Guarda-volumes nas estações durante as escalas e uma lavanderia automática no meio do caminho. Viajamos leves do começo ao fim." }
  ]
};
