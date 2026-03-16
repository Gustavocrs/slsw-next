/**
 * Base de dados para o Gerador de Aventuras
 * Foco: Fantasia Urbana (Mundo Moderno) vs Dungeons Medievais (Fantasia Sombria)
 */

export const adventureData = {
  themes: {
    "Caçada / Eliminação": {
      hooks: [
        "Um Portal Rank D se abriu no estacionamento subterrâneo de um shopping lotado.",
        "Uma Guilda rival terceirizou a limpeza de um Portal ilegalmente para não sujar sua imagem.",
        "Um Portal surgiu bem no meio de uma rodovia movimentada, causando um engavetamento massivo.",
        "Um influenciador Caçador pagou o grupo para fazer a 'limpeza' do Portal e filmar para a internet.",
        "Um Portal abriu no campo de um estádio de futebol minutos antes de uma partida importante.",
        "O grupo recebe um contrato de emergência via app do Governo no meio da madrugada.",
        "Uma construtora achou um Portal nas fundações de um arranha-céu e quer limpá-lo sem avisar a prefeitura.",
        "O Portal surgiu no quintal de um orfanato, os Caçadores são os únicos próximos o suficiente para ajudar a tempo.",
      ],
      objectives: [
        "Fechar o Portal antes do tempo limite estourar e a mídia chegar (Dungeon Break).",
        "Competir contra uma Guilda rival que entrou pelo mesmo Portal para ver quem mata o Boss primeiro.",
        "Impedir que monstros escavem os alicerces do prédio comercial que sustenta a entrada do Portal.",
        "Derrotar o Boss sem usar magias de fogo, pois a Dungeon contém gases inflamáveis do mundo real.",
        "Matar exatamente 100 lacaios antes da sala do Boss se revelar.",
        "Rastrear e abater um Caçador renegado que usa a Dungeon para matar civis e culpar monstros.",
        "Derrotar o Boss em silêncio, pois altos ruídos causam desmoronamento.",
        "Interrogar o Boss (usando itens de idioma) para entender de onde as criaturas estão vindo.",
      ],
      twists: [
        "O Boss está usando o relógio de pulso moderno do filho do contratante; ele já foi morto.",
        "O contratante pagou para a equipe NÃO voltar, e plantou explosivos na saída do Portal.",
        "O Boss fala o idioma moderno perfeitamente antes de desmoronar em cinzas.",
        "O verdadeiro Boss era o lacaio minúsculo que se escondia no teto o tempo todo.",
        "A Associação mentiu: eles já sabiam dessa Dungeon e mandaram o grupo como cobaias.",
        "Uma Guilda Internacional poderosa invade a Dungeon no meio da luta e rouba a 'Kill'.",
        "O monstro maior morre com um golpe, pois estava ferido por algo ainda maior que espreita lá.",
        "Ao cair, o Boss dissolve revelando um avatar virtual de IA controlando as criaturas.",
      ],
    },
    "Resgate / Escolta": {
      hooks: [
        "Catadores ilegais de cristais ('Scavengers') invadiram um Portal num armazém e estão presos lá dentro.",
        "A polícia isolou uma estação de metrô após passageiros serem puxados para dentro de uma fenda azul.",
        "Um figurão corporativo perdeu seu filho adolescente que entrou em um Portal por um desafio do TikTok.",
        "Uma celebridade oferece uma fortuna para recuperar sua 'mascote mágica' que fugiu para dentro de uma Dungeon.",
        "A Associação perdeu contato com a equipe de elite de Rank A que entrou nesse Portal de Rank C há dois dias.",
        "A fenda apareceu dentro de um presídio de segurança máxima, causando pânico entre guardas e detentos.",
        "Animais do zoológico local estão enlouquecendo porque um Portal se formou na jaula dos leões.",
      ],
      objectives: [
        "Encontrar os trabalhadores sugados pelo Portal e escoltá-los em segurança.",
        "Domar ou capturar vivo uma criatura mágica específica sem matá-la.",
        "Escoltar um burocrata engravatado da Associação de Caçadores para que ele faça uma auditoria.",
        "Proteger os casulos de ovos dos monstros de catadores ilegais que estão destruindo o ecossistema local.",
        "Encontrar um outro Caçador que desertou da Associação e está vivendo dentro desta Dungeon.",
        "Acompanhar uma equipe de pesquisadores do Círculo Arcanum para estudo de parasitas mágicos.",
      ],
      twists: [
        "A 'vítima' que deveriam resgatar é na verdade o necromante controlando o local.",
        "A pessoa salva recusa-se a voltar, pois a Dungeon a curou de uma doença terminal.",
        "O grupo não foi o primeiro a chegar lá; há um esquadrão tático militar chacinado.",
        "O monstro não mata humanos, ele os congela em cristal para exibi-los como obras de arte.",
        "Os escudos dos cavaleiros inimigos mostram a mesma heráldica da família de um jogador.",
        "Os monstros estão lutando uma guerra civil e pedem aliança temporária com os Caçadores.",
        "O Boss se rende, entrega a chave do Portal e se senta, esperando a morte pacificamente.",
      ],
    },
    "Coleta / Exploração": {
      hooks: [
        "Relatório de batedores sugere que esse Portal é rico em um minério raro exigido pela indústria de celulares.",
        "Um mercado negro de itens rúnicos está usando um Portal não-registrado como esconderijo.",
        "Um Portal apareceu dentro de uma reserva ambiental protegida, guardas florestais pedem sigilo.",
        "O servidor da Associação foi hackeado, e o contrato desse Portal foi enviado para o grupo por um anônimo.",
        "O Portal surgiu no topo de uma antena de TV; a entrada requer escalada antes mesmo da Dungeon começar.",
        "Um colecionador bilionário tem as chaves de um Portal selado há 10 anos e quer abri-lo agora.",
        "O núcleo de energia de uma represa está reagindo à abertura de um Portal submerso.",
      ],
      objectives: [
        "Extrair o núcleo de Mana do monstro Alpha, encomendado por uma indústria bélica.",
        "Coletar uma erva que só cresce nessa Dungeon para tratar um VIP envenenado por Mana.",
        "Mapear a arquitetura da masmorra para um projeto governamental de bases seguras.",
        "Recuperar a câmera e o cartão de memória de um Caçador morto que contém provas de um crime.",
        "Recuperar uma relíquia medieval encomendada por um museu de história de Nova York.",
        "Recolher minérios de Mana suficientes para pagar a fiança de um membro do grupo.",
        "Localizar a nascente de água mágica dentro do templo e trazer uma amostra.",
        "Recuperar um drone de segurança militar caríssimo que foi derrubado na entrada.",
      ],
      twists: [
        "Ruínas da Dungeon revelam tecnologia da Terra de milhares de anos atrás.",
        "A fenda não era um Portal para Dungeon, mas uma rota para a base secreta de outra Guilda.",
        "O cristal principal não é Mana pura, mas um ovo prestes a eclodir no mundo real.",
        "Uma Runa encontrada fala telepaticamente na mente de um personagem prometendo poder total.",
        "A relíquia procurada reage apenas ao sangue de um dos membros específicos do grupo.",
        "Ao invés de cristais, os baús estão recheados de ouro medieval falsificado.",
        "Câmeras escondidas modernas são achadas gravando toda a masmorra em pontos ocultos.",
      ],
    },
    "Sobrevivência / Anomalia": {
      hooks: [
        "A Associação detectou flutuação de Mana: um Portal está prestes a transbordar em um hospital municipal.",
        "Um Portal vermelho (que não permite saída antes do Boss morrer) engoliu o vagão de trem onde o grupo estava.",
        "O governo oferece perdão de dívidas para quem fechar um Portal que está corrompendo a água da cidade.",
        "Uma anomalia temporal abriu um Portal no mesmo local exato de um acidente de avião recente.",
        "Um Portal está drenando a eletricidade de um bairro inteiro, causando blecautes contínuos.",
        "O grupo estava de folga num bar quando um Portal E se abriu na adega, transformando a bebida em poções instáveis.",
        "Um grupo extremista anti-Caçadores abriu um Portal artificialmente no centro financeiro.",
        "A energia desse Portal está curando doenças das pessoas próximas no mundo real; seitas se formaram ao redor dele.",
      ],
      objectives: [
        "Testar um novo equipamento de supressão de Mana criado por uma startup de tecnologia.",
        "Sobreviver por 24 horas até que a porta do Portal Vermelho se abra de novo.",
        "Destruir altares profanos lá dentro que estão envenenando a água da cidade.",
        "Desarmar explosivos mágicos deixados por terroristas que querem acelerar o Dungeon Break.",
        "Encontrar a fonte de transmissão de rádio que inexplicavelmente está saindo de dentro da Dungeon.",
        "Provar que a Associação mediu o Rank do Portal errado e solicitar a reclassificação.",
        "Impedir que as fendas internas da Dungeon se conectem a outros Portais ao redor do globo.",
        "Consertar o selo antigo que mantém um Demônio Maior preso na base da Dungeon.",
      ],
      twists: [
        "Os monstros lá dentro estão aterrorizados, minerando cristais para consertar algo e não atacar.",
        "Derrotar o Boss inicia uma contagem regressiva para auto-destruição termonuclear arcana.",
        "A Dungeon é ilusória; os monstros mortos eram na verdade Caçadores de outra dimensão.",
        "A saída do Portal se move. O grupo sai em outro país ou continente.",
        "Ao olhar reflexos na água da Dungeon, os personagens veem suas versões corrompidas.",
        "Ao sair, descobre-se que o tempo passou diferente: 1 hora lá dentro foram 3 dias fora.",
        "O ar tóxico sumiu assim que entraram; o ambiente era apenas ilusão visual do lado de fora.",
        "A energia sugada serviu para despertar poderes em civis fracos acidentalmente ao redor do globo.",
      ],
    },
  },
  locations: [
    "Um gigantesco castelo gótico em ruínas, com um céu vermelho e uma lua estilhaçada.",
    "Uma masmorra de tortura medieval com celas de ferro enferrujado e sangue coagulado.",
    "Uma densa e silenciosa floresta élfica petrificada onde o som não reverbera.",
    "Ruínas de uma vila camponesa sob neve eterna, com estátuas de gelo que parecem assustadas.",
    "Catacumbas esculpidas em mármore dourado, repletas de altares para deuses esquecidos.",
    "Uma arena de gladiadores rústica construída dentro da cratera de um vulcão dormente.",
    "Um pântano de águas negras onde árvores mortas assumem formas de gárgulas observadoras.",
    "Um navio corsário gigante encalhado dentro de uma caverna seca com corais arcanos.",
    "Salões de uma antiga biblioteca mágica com livros flutuantes e corredores que mudam de lugar.",
    "Uma torre de vigia vertical interminável, com buracos onde o abismo assobia.",
    "Um labirinto de cristal espelhado que reflete os traumas passados dos Caçadores.",
    "Uma cidade anã abandonada nas profundezas, iluminada apenas por minérios pulsantes.",
    "Templos suspensos no céu por correntes místicas, interligados por pontes de madeira podre.",
    "Campos de trigo dourado gigantesco onde espreitam feras colossais.",
    "O interior de uma fortaleza orc, cheia de engrenagens rudimentares e totens xamânicos.",
    "Um deserto de obsidiana negra e tempestades de vidro cortante.",
    "Jardins apodrecidos de um palácio abandonado com chafarizes vazando Mana líquida.",
    "Aquedutos colossais onde a água tem gravidade reversa e corre pelo teto.",
    "Um abatedouro infernal com correntes penduradas e ganchos gigantes balançando.",
    "Cavernas de fungos bioluminescentes que reagem ao calor corporal.",
    "O campo de batalha congelado no tempo entre dois exércitos medievais espectrais.",
    "Criptas submersas onde os Caçadores precisam encontrar bolsões de ar mágico para respirar.",
    "Uma forja divina abandonada com rios de magma correndo por canais de ouro.",
    "Uma pradaria onde chove cinzas quentes e o chão é forrado de ossos antigos.",
    "O covil de uma rainha insetoide composto de resina e casulos pegajosos.",
    "Paredes e corredores feitos inteiramente de carne viva e olhos que acompanham o grupo.",
    "Um acampamento militar abandonado por cavaleiros sagrados corrompidos pela escuridão.",
    "Uma ponte infinita sobre um fosso sem fundo envolta em neblina espessa.",
    "Jazida de cristal bruto onde toda magia disparada ricocheteia descontroladamente.",
    "Ruínas circulares em um platô montanhoso com constantes relâmpagos mágicos.",
  ],
  antagonists: [
    {
      name: "Rei Goblin Cego",
      description:
        "Astuto, luta usando audição perfeita e comanda centenas de lacaios fanáticos.",
      stats:
        "Agi d10, Esp d8, For d8, Int d10, Vig d8 | Aparar: 8, Defesa: 6, Resistência: 7(1)",
      rank: "Novato",
    },
    {
      name: "Sombra Duplicada",
      description:
        "O Boss toma a forma e as habilidades do membro mais forte do grupo.",
      stats:
        "Agi d10, Esp d10, For d10, Int d10, Vig d10 | Aparar: Cópia, Defesa: Cópia, Resistência: Cópia",
      rank: "Novato",
    },
    {
      name: "Sereia das Trevas",
      description:
        "Usa canto hipnótico para voltar os membros do grupo uns contra os outros.",
      stats:
        "Agi d8, Esp d12, For d6, Int d8, Vig d8 | Aparar: 6, Defesa: 5, Resistência: 6",
      rank: "Novato",
    },
    {
      name: "Matilha Cérbera",
      description:
        "Três cães infernais que só morrem se forem abatidos no mesmo turno.",
      stats:
        "Agi d10, Esp d8, For d10, Int d6, Vig d10 | Aparar: 7, Defesa: 5, Resistência: 10(3)",
      rank: "Novato",
    },
    {
      name: "Besta-Espinho",
      description:
        "Cria escudos de espinhos que causam dano reativo a ataques corpo a corpo.",
      stats:
        "Agi d8, Esp d6, For d10, Int d4, Vig d12 | Aparar: 6, Defesa: 5, Resistência: 12(4)",
      rank: "Novato",
    },
    {
      name: "Aracnídeo Devorador de Mana",
      description: "Suas teias silenciam magos e drenam a energia do grupo.",
      stats:
        "Agi d10, Esp d8, For d8, Int d6, Vig d10 | Aparar: 7, Defesa: 5, Resistência: 11(4)",
      rank: "Novato",
    },
    {
      name: "O Cavaleiro Corrompido",
      description:
        "Um morto-vivo em armadura de placas montado em um cavalo fantasma.",
      stats:
        "Agi d8, Esp d8, For d12, Int d6, Vig d10 | Aparar: 7, Defesa: 5, Resistência: 12(4)",
      rank: "Experiente",
    },
    {
      name: "Sacerdote do Abismo",
      description:
        "Manipula gravidade e causa ataques que testam a sanidade (Espírito) do grupo.",
      stats:
        "Agi d6, Esp d12, For d6, Int d10, Vig d8 | Aparar: 5, Defesa: 5, Resistência: 8(2)",
      rank: "Experiente",
    },
    {
      name: "Senhora dos Enxames",
      description:
        "Uma centopeia mágica que cria barreiras de veneno e põe ovos explosivos.",
      stats:
        "Agi d10, Esp d8, For d10, Int d6, Vig d10 | Aparar: 7, Defesa: 5, Resistência: 11(4)",
      rank: "Experiente",
    },
    {
      name: "Caçador Renegado Rank B",
      description:
        "Usa táticas modernas, granadas e rifles encantados contra o grupo.",
      stats:
        "Agi d10, Esp d8, For d8, Int d8, Vig d8 | Aparar: 7, Defesa: 6, Resistência: 10(4)",
      rank: "Experiente",
    },
    {
      name: "Observador Oculto",
      description:
        "Um olho gigante flutuante com telecinesia que atira pedregulhos.",
      stats:
        "Agi d8, Esp d12, For d6, Int d12, Vig d8 | Aparar: 6, Defesa: 5, Resistência: 8(2)",
      rank: "Experiente",
    },
    {
      name: "Bruxa das Tempestades",
      description: "Controla raios, forçando os Caçadores a evitar água.",
      stats:
        "Agi d8, Esp d12, For d6, Int d10, Vig d8 | Aparar: 6, Defesa: 5, Resistência: 8(2)",
      rank: "Experiente",
    },
    {
      name: "Assassino Rúnico Elfo Negro",
      description: "Ágil, usa venenos paralisantes e desaparece nas sombras.",
      stats:
        "Agi d12, Esp d8, For d8, Int d8, Vig d8 | Aparar: 8, Defesa: 6, Resistência: 8(2)",
      rank: "Veterano",
    },
    {
      name: "Espectro da Forja",
      description:
        "Uma armadura oca preenchida de chamas que derrete armas não-mágicas.",
      stats:
        "Agi d8, Esp d10, For d10, Int d6, Vig d10 | Aparar: 6, Defesa: 5, Resistência: 9",
      rank: "Veterano",
    },
    {
      name: "Elemental de Sangue",
      description: "Divide-se em vários menores toda vez que leva dano físico.",
      stats:
        "Agi d8, Esp d8, For d10, Int d4, Vig d10 | Aparar: 6, Defesa: 5, Resistência: 9(2)",
      rank: "Veterano",
    },
    {
      name: "Xamã Orc Superior",
      description:
        "Evoca totens que dão invulnerabilidade temporária aos inimigos.",
      stats:
        "Agi d6, Esp d10, For d8, Int d8, Vig d10 | Aparar: 6, Defesa: 5, Resistência: 10(3)",
      rank: "Veterano",
    },
    {
      name: "Centauro Encouraçado",
      description:
        "Ataca em investidas de altíssima velocidade difíceis de esquivar.",
      stats:
        "Agi d10, Esp d8, For d12, Int d6, Vig d10 | Aparar: 7, Defesa: 5, Resistência: 12(5)",
      rank: "Veterano",
    },
    {
      name: "Monge Herege Múmia",
      description: "Luta artes marciais ignorando armadura; golpes atordoam.",
      stats:
        "Agi d10, Esp d10, For d10, Int d8, Vig d10 | Aparar: 8, Defesa: 6, Resistência: 9(2)",
      rank: "Veterano",
    },
    {
      name: "Besta de Cerco Quimérica",
      description:
        "Escamas refletem balas, requerendo impacto bruto ou ataques mágicos internos.",
      stats:
        "Agi d6, Esp d6, For d12+2, Int d4, Vig d12 | Aparar: 6, Defesa: 5, Resistência: 14(6)",
      rank: "Heroico",
    },
    {
      name: "Dragoa Menor Wyvern",
      description:
        "Cobre áreas imensas com fogo que não pode ser apagado por meios modernos.",
      stats:
        "Agi d8, Esp d8, For d12+1, Int d6, Vig d10 | Aparar: 6, Defesa: 5, Resistência: 13(4)",
      rank: "Heroico",
    },
    {
      name: "Carcereiro de Ferro",
      description:
        "Gigante com machado acorrentado; empurra e puxa jogadores pelo cenário.",
      stats:
        "Agi d6, Esp d6, For d12, Int d4, Vig d12 | Aparar: 6, Defesa: 5, Resistência: 12(4)",
      rank: "Heroico",
    },
    {
      name: "Behemoth Glacial",
      description:
        "Urso gigante que congela o ar ao redor, diminuindo a agilidade dos Caçadores.",
      stats:
        "Agi d6, Esp d8, For d12+2, Int d4, Vig d12 | Aparar: 6, Defesa: 5, Resistência: 14(4)",
      rank: "Heroico",
    },
    {
      name: "Guardião Gárgula de Quartzo",
      description:
        "Imune a dano de corte e perfuração, vulnerável apenas a concussão.",
      stats:
        "Agi d6, Esp d6, For d12, Int d4, Vig d12 | Aparar: 6, Defesa: 5, Resistência: 14(6)",
      rank: "Heroico",
    },
    {
      name: "Golem de Lixo Moderno e Magia",
      description: "Construído com carros e postes engolidos pelo Portal.",
      stats:
        "Agi d4, Esp d6, For d12+2, Int d4, Vig d12 | Aparar: 5, Defesa: 5, Resistência: 14(6)",
      rank: "Heroico",
    },
    {
      name: "Lich Arquivista",
      description:
        "Conjura magias em área e revive os próprios civis modernos mortos como zumbis.",
      stats:
        "Agi d6, Esp d12, For d4, Int d12, Vig d10 | Aparar: 5, Defesa: 5, Resistência: 10(3)",
      rank: "Lendário",
    },
    {
      name: "Paladino Caído",
      description:
        "Luta usando poderes de cura corrompida e escudos de Mana inquebráveis.",
      stats:
        "Agi d8, Esp d10, For d10, Int d8, Vig d10 | Aparar: 8, Defesa: 6, Resistência: 12(5)",
      rank: "Lendário",
    },
    {
      name: "A Entidade Cristalina",
      description:
        "Um cubo flutuante que atira raios a laser como um mecanismo de defesa.",
      stats:
        "Agi d4, Esp d12, For d4, Int d12, Vig d12 | Aparar: 4, Defesa: 5, Resistência: 12(4)",
      rank: "Lendário",
    },
    {
      name: "Lorde Vampiro",
      description:
        "Não ataca fisicamente, mas drena vida contínua de todo o ambiente.",
      stats:
        "Agi d12, Esp d10, For d10, Int d10, Vig d10 | Aparar: 8, Defesa: 6, Resistência: 9(2)",
      rank: "Lendário",
    },
    {
      name: "Ente de Espinhos Murchos",
      description: "Uma árvore colossal que chicoteia com raízes subterrâneas.",
      stats:
        "Agi d4, Esp d8, For d12+3, Int d6, Vig d12 | Aparar: 5, Defesa: 5, Resistência: 16(6)",
      rank: "Lendário",
    },
    {
      name: "O Rei Sem Trono",
      description:
        "Uma figura deprimida e imortal que só morre se sua coroa for destruída primeiro.",
      stats:
        "Agi d8, Esp d12, For d12, Int d10, Vig d12 | Aparar: 8, Defesa: 6, Resistência: 12(4)",
      rank: "Lendário",
    },
  ],
  complications: [
    "Sinais de rádio/GPS caem e todos os relógios digitais travam na hora de entrada.",
    "A Guilda subestimou o perigo: o medidor de Mana quebrou e o Rank é muito mais alto.",
    "Uma equipe de jornalismo amadora se infiltrou para buscar furos e precisa ser salva.",
    "A energia local descarrega baterias e inutiliza todas as lanternas e miras a laser.",
    "Um gás misterioso requer testes de Vigor regulares ou causa níveis de Fadiga acumulativa.",
    "O grupo percebe que os monstros lá dentro ignoram magia; apenas dano físico puro funciona.",
    "As leis do espaço são distorcidas: portas teletransportam para partes aleatórias da masmorra.",
    "O Boss entra na luta logo na primeira sala e foge constantemente, desgastando o grupo.",
    "A porta de saída se fechou e só abrirá em duas horas; eles precisam sobreviver.",
    "Armadilhas disparam ao detectar o som de tiros e explosões modernas, atraindo hordas.",
    "Um NPC importante para a missão sofre um colapso nervoso e se recusa a andar.",
    "A gravidade inverte a cada 5 rodadas durante o combate contra hordas.",
    "Há civis feridos no meio da área da batalha principal e fogo em área pode matá-los.",
    "A Dungeon proíbe armas cortantes (espadas ricocheteiam magicamente) forçando improviso.",
    "Monstros estão usando itens deixados por grupos de Caçadores caídos (escudos, fuzis).",
    "O chão é feito de gelo mágico escorregadio; exige testes de Agilidade para se mover rápido.",
    "As poções de cura compradas no mundo exterior estavam sabotadas e curam apenas metade.",
    "Um artefato amaldiçoado gruda no braço de um Caçador, causando dor mas dando poderes.",
    "Espólios valiosos despencam por fendas abissais e requerem resgates arriscados.",
    "A temperatura cai rapidamente a níveis abaixo de zero, causando letargia.",
    "Um membro do grupo tem alucinações ligadas ao seu próprio Despertar.",
    "As criaturas imitam as vozes de entes queridos pedindo socorro.",
    "Cada vez que uma magia é conjurada, um lacaio extra surge no ambiente.",
    "A masmorra começa a desmoronar; eles têm tempo limitado para acabar a luta.",
    "A água local drena Pontos de Poder instantaneamente se tocada.",
    "Nuvens de esporos ocultam o Boss, impondo pesadas penalidades de visão.",
    "A Associação exige que a masmorra seja capturada intacta, com mínimo de danos estruturais.",
    "As feridas abertas não coagulam magicamente, causando dano de sangramento em todo o grupo.",
    "O grupo ativa um mecanismo de julgamento medieval e precisa resolver um enigma em combate.",
    "Gás do riso enche o salão; falhar em testes de Espírito impede ações agressivas.",
  ],
  twists: [
    "O Boss está usando o relógio de pulso moderno do filho do contratante; ele já foi morto.",
    "O contratante pagou para a equipe NÃO voltar, e plantou explosivos na saída do Portal.",
    "Os monstros lá dentro estão aterrorizados, minerando cristais para consertar algo e não atacar.",
    "Ruínas da Dungeon revelam tecnologia da Terra de milhares de anos atrás.",
    "O Boss fala o idioma moderno perfeitamente antes de desmoronar em cinzas.",
    "A 'vítima' que deveriam resgatar é na verdade o necromante controlando o local.",
    "A fenda não era um Portal para Dungeon, mas uma rota para a base secreta de outra Guilda.",
    "O cristal principal não é Mana pura, mas um ovo prestes a eclodir no mundo real.",
    "Derrotar o Boss inicia uma contagem regressiva para auto-destruição termonuclear arcana.",
    "O verdadeiro Boss era o lacaio minúsculo que se escondia no teto o tempo todo.",
    "A Associação mentiu: eles já sabiam dessa Dungeon e mandaram o grupo como cobaias.",
    "Os monstros estão lutando uma guerra civil e pedem aliança temporária com os Caçadores.",
    "A Dungeon é ilusória; os monstros mortos eram na verdade Caçadores de outra dimensão.",
    "Uma Runa encontrada fala telepaticamente na mente de um personagem prometendo poder total.",
    "A pessoa salva recusa-se a voltar, pois a Dungeon a curou de uma doença terminal.",
    "A saída do Portal se move. O grupo sai em outro país ou continente.",
    "O grupo não foi o primeiro a chegar lá; há um esquadrão tático militar chacinado.",
    "A relíquia procurada reage apenas ao sangue de um dos membros específicos do grupo.",
    "O monstro não mata humanos, ele os congela em cristal para exibi-los como obras de arte.",
    "O Boss se rende, entrega a chave do Portal e se senta, esperando a morte pacificamente.",
    "Ao olhar reflexos na água da Dungeon, os personagens veem suas versões corrompidas.",
    "Ao sair, descobre-se que o tempo passou diferente: 1 hora lá dentro foram 3 dias fora.",
    "Ao invés de cristais, os baús estão recheados de ouro medieval falsificado.",
    "Uma Guilda Internacional poderosa invade a Dungeon no meio da luta e rouba a 'Kill'.",
    "Os escudos dos cavaleiros inimigos mostram a mesma heráldica da família de um jogador.",
    "O ar tóxico sumiu assim que entraram; o ambiente era apenas ilusão visual do lado de fora.",
    "O monstro maior morre com um golpe, pois estava ferido por algo ainda maior que espreita lá.",
    "A energia sugada serviu para despertar poderes em civis fracos acidentalmente ao redor do globo.",
    "Câmeras escondidas modernas são achadas gravando toda a masmorra em pontos ocultos.",
    "Ao cair, o Boss dissolve revelando um avatar virtual de IA controlando as criaturas.",
  ],
  rewards: [
    "Cristais puros em quantidade massiva que rendem um prêmio em dinheiro astronômico.",
    "Contrato de publicidade e patrocínio oficial com uma marca esportiva global.",
    "Arma medieval Lendária que magicamente se disfarça como um item moderno comum.",
    "Reconhecimento oficial e aumento imediato de Rank de acesso na Associação de Caçadores.",
    "O resgatado revela ser herdeiro de uma mega corporação e se torna um benfeitor leal.",
    "Uma 'Gema do Despertar': item raro que pode aumentar os atributos vitais de um Caçador.",
    "A Runa do próprio Boss, que concede uma habilidade única da Dungeon para quem a assimilar.",
    "Acesso VIP e irrestrito ao banco de dados secreto do Governo sobre os Portais Monárquicos.",
    "Um familiar mágico sobrevivente da Dungeon que adota um jogador como mestre.",
    "Escritura de propriedade do terreno onde a Dungeon abriu (e sua respectiva mina residual de Mana).",
    "Perdão criminal e isenção de impostos pelo próximo ano.",
    "Ovo petrificado que, após chocado no mundo real, gera uma montaria arcana controlável.",
    "Contrato de exclusividade vitalício com os melhores ferreiros e curandeiros do país.",
    "Cristais da Memória, que permitem rever conhecimentos táticos antigos e ganhar XP extra.",
    "Um veículo SUV blindado, presente de agradecimento da Polícia Militar local.",
    "Armadura biológica feita do exoesqueleto da criatura, imune a detectores de metal modernos.",
    "Direito a saque em uma reserva confiscada da Associação cheia de itens estrangeiros.",
    "Fama imediata; o grupo vira as celebridades mais faladas das redes sociais na semana.",
    "Uma poção de cura absoluta que recupera Lesões Permanentes e Ferimentos graves.",
    "Mapas de pele de dragão apontando a rota para Dungeons seguras cheias de loot esquecido.",
    "Convite direto para a cúpula de uma das top 5 Guildas Maiores do país.",
    "Uma pulseira rúnica que funciona como comunicador imune à interferência de Mana.",
    "Um cofre contendo barras de ouro e artefatos de colecionador resgatados antes de afundarem.",
    "Informação de um espião revelando a fraqueza do líder da guilda inimiga.",
    "A poeira mágica do chefe cura imediatamente toda a fadiga e corrupção leve da equipe.",
    "Passes diretos e chaves rúnicas que dão atalho e imunidade a Portais Rank D e E.",
    "Um contrato valioso do Governo Federal que transforma o grupo numa agência governamental autônoma.",
    "A 'Lágrima da Sereia', um anel que permite respirar sob a água em incursões futuras.",
    "Uma relíquia bélica secreta esquecida lá, um canhão de plasma com núcleo de arcano.",
    "Respeito absoluto. Inimigos mortais recuam apenas por ouvir o feito narrado pelas notícias.",
  ],
  monsters: [
    {
      name: "Goblin Rastejante",
      type: "Extra",
      rank: "Novato",
      stats:
        "Agi d8, Esp d6, For d6, Int d4, Vig d6 | Aparar: 5, Defesa: 5, Resistência: 5 | Lutar d6, Furtividade d8",
    },
    {
      name: "Esqueleto Arcano",
      type: "Extra",
      rank: "Novato",
      stats:
        "Agi d6, Esp d4, For d6, Int d4, Vig d6 | Aparar: 5, Defesa: 5, Resistência: 7 | Lutar d6, Atirar d6 (Arco)",
    },
    {
      name: "Lobo das Sombras",
      type: "Extra",
      rank: "Novato",
      stats:
        "Agi d8, Esp d6, For d6, Int d4, Vig d6 | Aparar: 6, Defesa: 5, Resistência: 5 | Lutar d8, Perceber d8",
    },
    {
      name: "Lodo Ácido",
      type: "Extra",
      rank: "Novato",
      stats:
        "Agi d4, Esp d4, For d6, Int d4, Vig d8 | Aparar: 4, Defesa: 5, Resistência: 6 | Lutar d6 (Corrosão)",
    },
    {
      name: "Orc Corrompido",
      type: "Extra",
      rank: "Experiente",
      stats:
        "Agi d6, Esp d6, For d8, Int d4, Vig d8 | Aparar: 6, Defesa: 5, Resistência: 7(1) | Lutar d8, Intimidar d6",
    },
    {
      name: "Cultista Sombrio",
      type: "Extra",
      rank: "Experiente",
      stats:
        "Agi d6, Esp d8, For d6, Int d6, Vig d6 | Aparar: 5, Defesa: 5, Resistência: 5 | Lutar d6, Conjuração d8",
    },
    {
      name: "Caçador Zumbi",
      type: "Carta Selvagem",
      rank: "Experiente",
      stats:
        "Agi d6, Esp d8, For d8, Int d6, Vig d8 | Aparar: 6, Defesa: 5, Resistência: 8(2) | Lutar d8, Atirar d8, Furtividade d6",
    },
    {
      name: "Aranha Gigante Gigante",
      type: "Extra",
      rank: "Experiente",
      stats:
        "Agi d8, Esp d6, For d8, Int d4, Vig d6 | Aparar: 6, Defesa: 5, Resistência: 6(1) | Lutar d8, Escalar d10",
    },
    {
      name: "Gárgula Sentinela",
      type: "Extra",
      rank: "Veterano",
      stats:
        "Agi d6, Esp d6, For d8, Int d4, Vig d8 | Aparar: 6, Defesa: 5, Resistência: 10(4) | Lutar d8, Voar",
    },
    {
      name: "Espectro Devorador",
      type: "Carta Selvagem",
      rank: "Veterano",
      stats:
        "Agi d8, Esp d8, For d6, Int d6, Vig d6 | Aparar: 6, Defesa: 5, Resistência: 5 (Imaterial) | Lutar d8, Furtividade d10",
    },
    {
      name: "Golem de Pedra Menor",
      type: "Extra",
      rank: "Veterano",
      stats:
        "Agi d4, Esp d4, For d10, Int d4, Vig d10 | Aparar: 5, Defesa: 5, Resistência: 11(4) | Lutar d6",
    },
    {
      name: "Constructo de Aço",
      type: "Carta Selvagem",
      rank: "Heroico",
      stats:
        "Agi d4, Esp d6, For d12, Int d4, Vig d12 | Aparar: 5, Defesa: 5, Resistência: 14(6) | Lutar d8",
    },
    {
      name: "Cavaleiro da Morte",
      type: "Carta Selvagem",
      rank: "Lendário",
      stats:
        "Agi d8, Esp d10, For d12+2, Int d8, Vig d12 | Aparar: 8, Defesa: 6, Resistência: 16(6) | Lutar d12, Imune a Dor",
    },
  ],
  trapsAndPuzzles: [
    {
      text: "Armadilha Rúnica de Fogo: Uma placa de pressão aciona uma explosão 2d6 de dano de fogo (Cone). Teste de Agilidade -2 para metade do dano.",
      rank: "Novato",
    },
    {
      text: "Sala do Gás Venenoso: Ao entrar, as portas se fecham. Gás causa 1 Fadiga a cada rodada se falhar em Vigor. Um painel requer Consertar/Ladinagem com -2 para abrir.",
      rank: "Experiente",
    },
    {
      text: "Enigma dos Elementos: Quatro pedestais com símbolos de Fogo, Água, Terra e Ar. É preciso interagir na ordem correta (dicas nas paredes). Errar causa dano mágico.",
      rank: "Novato",
    },
    {
      text: "Fosso de Espinhos Ilusório: O chão parece sólido, mas é uma ilusão. Teste de Perceber -2 nota a falha. Cair causa 2d6 de dano perfurante.",
      rank: "Novato",
    },
    {
      text: "Guardiões de Pedra: Duas estátuas pedem uma 'oferenda de sangue'. Sacrificar 1 PV abre a porta; recusar as anima para combate.",
      rank: "Experiente",
    },
    {
      text: "Labirinto de Espelhos: Confusão mágica. Falhar em Astúcia faz o personagem atacar a própria imagem (sofre o próprio dano).",
      rank: "Veterano",
    },
    {
      text: "Garras do Teto: Vinhas ou correntes caem repentinamente. Teste de Agilidade -2 ou fica Enredado/Paralisado.",
      rank: "Novato",
    },
    {
      text: "Charada do Monarca: Uma esfinge espectral faz uma pergunta cuja resposta é o medo mais profundo de um dos jogadores.",
      rank: "Veterano",
    },
    {
      text: "Salão de Gravidade Invertida: Cada passo requer teste de Atletismo. Falhar causa queda no teto (1d6 dano de impacto).",
      rank: "Experiente",
    },
    {
      text: "Runa de Silenciamento: A sala absorve som. Nenhuma magia verbal pode ser conjurada, e Furtividade ganha +4 automático.",
      rank: "Veterano",
    },
    {
      text: "Prisão Temporal: Uma área onde o tempo flui rápido. O grupo envelhece 1 ano a cada minuto lá dentro até desativar o cristal central.",
      rank: "Heroico",
    },
    {
      text: "Vácuo Arcano: A sala drena 1d4 Bennes de quem entrar se não passar em Espírito -4.",
      rank: "Lendário",
    },
  ],
  monsterLoot: [
    "Essência Menor (1d4)",
    "Poeira de Mana (Vende por 50g)",
    "Fragmento de Cristal Azul",
    "Arma de baixa qualidade (-1 Dano se usada)",
    "Runa Quebrada (Uso único, efeito menor)",
    "Moedas Antigas (1d10x10g)",
    "Ingrediente Alquímico (Erva Sombria)",
    "Nenhum espólio útil",
    "Pedaço de armadura recuperável (Vende por 20g)",
    "Poção de Cura Menor (Restaura 1 Ferimento)",
  ],
  bossLoot: [
    "Essência Maior (1)",
    "Núcleo de Mana Brilhante (Alto valor - 1000g)",
    "Item Rúnico Incomum",
    "Arma Exclusiva do Boss (Dano +1d6 elemental)",
    "Runa de Aprimoramento Permanente (+1 em atributo)",
    "Grimório ou Diário com segredos antigos",
    "Gema do Despertar (Material para Evolução)",
    "Armadura Completa Rúnica (+3 Resistência)",
    "Selo de Invocação (Permite invocar a sombra do boss 1x)",
    "Joia de Regressão de Dano (Anula um ataque letal passivamente)",
  ],
};
