/**
 * Tabelas de Sorteio e Metadados do Despertar - Solo Leveling
 * @module data/solo-leveling/awakening
 */

export const AWAKENING_RULES = [
	{
		name: "Origem do Despertar",
		dice: 6,
		values: [
			{ d: 1, value: "Explosão de Mana ao abrir um Portal" },
			{ d: 2, value: "Toque de uma criatura rúnica morrendo" },
			{ d: 3, value: "Contato com artefato ou relíquia antiga" },
			{ d: 4, value: "Participação em ritual arcano instável" },
			{ d: 5, value: "Trauma físico extremo (quase-morte)" },
			{ d: 6, value: "Chamado de uma entidade desconhecida" },
		],
	},
	{
		name: "Sensação do Despertar",
		dice: 8,
		values: [
			{ d: 1, value: "Calor intenso no peito" },
			{ d: 2, value: "Clarão repentino e perda breve de sentidos" },
			{ d: 3, value: "Sensação de leveza, como flutuar" },
			{ d: 4, value: "Eco de uma voz ou memória estranha" },
			{ d: 5, value: "Veias brilhando por segundos" },
			{ d: 6, value: "Dor aguda seguida de calma profunda" },
			{ d: 7, value: "Sombra movendo-se por conta própria" },
			{ d: 8, value: "Percepção do tempo ficando lento" },
		],
	},
	{
		name: "Afinidade de Mana",
		dice: 10,
		values: [
			{ d: 1, value: "Fogosa - Força e impacto físico" },
			{ d: 2, value: "Sombria - Furtividade e sombras" },
			{ d: 3, value: "Luminosa - Cura e proteção" },
			{ d: 4, value: "Instável - Poder alto, risco alto" },
			{ d: 5, value: "Ancestral - Vínculo com Runas" },
			{ d: 6, value: "Elemental - Fogo, vento, terra, gelo" },
			{ d: 7, value: "Bestial - Força bruta e sentidos" },
			{ d: 8, value: "Sábia - Controle mágico refinado" },
			{ d: 9, value: "Pura - Interação com Portais" },
			{ d: 10, value: "Corrompida - Mutações e riscos" },
		],
	},
	{
		name: "Marca do Despertar",
		dice: 12,
		values: [
			{ d: 1, value: "Veias brilhantes - Bônus em controle de Mana 1x/sessão" },
			{ d: 2, value: "Olho alterado - Detecta magia fraca" },
			{ d: 3, value: "Sombra viva - Bônus em Furtividade" },
			{ d: 4, value: "Aura quente - Resistência temporária a frio" },
			{ d: 5, value: "Aura fria - Resistência temporária a fogo" },
			{ d: 6, value: "Runa no peito - Reduz dano mágico 1x/sessão" },
			{ d: 7, value: "Respiração pesada - Bônus permanente em Vigor" },
			{ d: 8, value: "Voz dupla - Bônus em Intimidação" },
			{ d: 9, value: "Cabelo que muda - Bônus social" },
			{ d: 10, value: "Cicatriz brilhante - Redução passiva de dano mágico" },
			{ d: 11, value: "Mãos frias - Revela ilusões ao toque" },
			{ d: 12, value: "Forma astral - Deslocamento curto 1x/sessão" },
		],
	},
];
