/**
 * LoreTab Component
 * Editor de Lore do Cenário - Seções do Manual
 * Editor visual sem necessidade de saber HTML
 */

"use client";

import React, {useState, useEffect, useRef} from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  FormatBold as BoldIcon,
  FormatItalic as ItalicIcon,
  FormatListBulleted as ListIcon,
  FormatListNumbered as ListNumberedIcon,
  Title as TitleIcon,
  Visibility as PreviewIcon,
  Edit as EditIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  CheckCircle as TipIcon,
  DragIndicator as DragIcon,
} from "@mui/icons-material";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";

const DEFAULT_LORE_SECTIONS = [
  {
    id: "introducao-como-usar",
    title: "Introdução & Como Usar",
    content: `Visão geral acessível, mesmo para quem nunca ouviu falar de Solo Leveling.

Este guia apresenta um novo estilo de aventura medieval inspirado no universo de Solo Leveling — mas não é necessário conhecer a obra original para jogar. Aqui, você encontrará um conjunto completo de regras e opções para campanhas onde Portais Mágicos passam a surgir pelo mundo, revelando Dungeons perigosas repletas de monstros, tesouros e energia arcana chamada Mana.

Nesse cenário, algumas pessoas despertam habilidades extraordinárias e são conhecidas como Caçadores. Cabe a elas entrar nesses Portais, enfrentar as criaturas que vivem dentro das Dungeons e impedir que escapem para o mundo exterior.

O objetivo deste guia é servir como um manual completo do jogador para esta ambientação. Ele inclui:
- Arquétipos adaptados para um mundo movido a Mana
- Habilidades rúnicas e poderes únicos
- Especializações temáticas baseadas em progressão
- Itens rúnicos (épicos, lendários e únicos)
- Monstros exclusivos com estatísticas próprias
- Regras avançadas de Portais e Dungeons
- Lore sobre o surgimento dos Portais e o papel dos Caçadores

O conteúdo deste guia pode ser usado para campanhas completas, aventuras rápidas ou integrado ao cenário que você já utiliza. Todas as regras foram pensadas para funcionar dentro do sistema Savage Worlds Adventure Edition (SWADE), mantendo sua jogabilidade rápida e cinematográfica, mas introduzindo progressão acelerada de poder e combates de alto impacto.`,
  },
  {
    id: "o-despertar",
    title: "O Despertar",
    content: `O coração do cenário — explicação clara, mecânica passo a passo e tabelas para jogadores iniciantes.

DESCRIÇÃO NARRATIVA

O Despertar é o momento em que uma pessoa comum entra em contato com a Mana presente nos Portais e nas Dungeons. Essa energia arcana é tão intensa que altera não apenas o corpo, mas também a mente e o espírito do indivíduo.

Ao despertar, a pessoa percebe o mundo de forma diferente: sons ficam mais claros, a respiração ganha ritmo, o corpo reage como se tivesse encontrado seu verdadeiro propósito. Alguns têm visões, outros sentem dor ou êxtase, e alguns recebem marcas físicas ou ecos de memórias que não deveriam existir.

A partir desse momento, o indivíduo deixa de ser apenas um aldeão, guerreiro ou mago comum. Ele se torna um Caçador — alguém capaz de manipular Mana, enfrentar Dungeons e sobreviver ao que antes seria impossível.

REGRA IMPORTANTE: O Despertar só pode ocorrer uma vez por personagem. Qualquer tentativa adicional gera Corrupção automática.

MECÂNICA — PASSO A PASSO

O Despertar pode acontecer em qualquer momento da história, geralmente após contato intenso com Mana:
- Quando ocorre: ao tocar um Portal, sobreviver a uma explosão de Mana, passar por quase-morte.
- Role a Origem: use 1d6 para definir como o Despertar começou.
- Role a Sensação: use 1d8 para descrever a experiência física.
- Role a Reação da Mana: use 1d10 para determinar a afinidade inicial.
- Role a Marca: use 1d12 para definir uma marca arcana.
- Escolha de Caminho: a afinidade da Mana orienta a escolha do Arquétipo inicial.
- Recursos de Mana: personagens Despertados passam a utilizar Pontos de Poder (PP).`,
  },
  {
    id: "poder-unico-despertar",
    title: "Poder Único do Despertar",
    content: `Ao atravessar o Despertar, cada Caçador manifesta um Poder Único — uma habilidade singular que define sua existência dentro do sistema de Portais.

Esse poder não é uma Vantagem comum, não pode ser escolhido novamente e não pode ser copiado por outros personagens. Ele nasce da interação entre Mana, trauma, sobrevivência e destino.

PRINCÍPIO FUNDAMENTAL: Em Solo Leveling, dois Despertos nunca são iguais.

REGRAS GERAIS
- Todo personagem recebe 1 Poder Único ao Despertar
- Não ocupa slot de Vantagem
- Não custa XP
- Evolui automaticamente conforme o Rank
- Só pode ser obtido no Despertar inicial ou por evento narrativo extremo

ESTRUTURA DO PODER ÚNICO
Todo Poder Único é construído a partir da combinação de três pilares: Fonte + Expressão + Gatilho`,
  },
  {
    id: "evolucao-poder-unico",
    title: "Evolução do Poder Único",
    content: `O Poder Único do Despertar não é estático. Assim como no universo de Solo Leveling, ele evolui conforme o Caçador sobrevive, enfrenta Dungeons mais perigosas e aprofunda sua conexão com a Mana.

Em Savage Worlds Adventure Edition, essa evolução ocorre de forma estruturada a cada Rank do personagem.

ESCALONAMENTO POR RANK
- Novato: Efeito base
- Experiente: +1 modificador ou bônus
- Veterano: Efeito secundário adicional
- Heroico: Redução de custo ou limitação
- Lendário: Quebra de regra narrativa`,
  },
  {
    id: "corrupcao-por-mana",
    title: "Corrupção por Mana",
    content: `A Mana é uma energia poderosa, mas perigosa. Seu uso excessivo ou inadequado pode levar à Corrupção — uma deterioração gradual da alma e do corpo do Caçador.

O QUE CAUSA CORRUPÇÃO?
- Usar Mana demais em poco tempo
- Despertar forçado
- Usar habilidades sombrias
- Sobrevivência extrema em Dungeons

EFEITOS DA CORRUPÇÃO
- Leve (1-3): -1 em testes de Mana, visões ocasionais
- Moderada (4-6): -1 em Resistência, mutações físicas
- Grave (7+): -2 em tudo, perda de controle`,
  },
  {
    id: "arquetipos-cacadores",
    title: "Arquétipos dos Caçadores",
    content: `Os Caçadores se especializam em diferentes funções dentro das Dungeons:

GUERREIROS DE FRENTE
Combatentes que lideram o grupo, absorvendo golpes.

ATIRADORES
Especialistas em combate à distância.

CONJURADORES
Mestres da Mana, magias ofensivas e de controle.

CURANDEIROS
Especialistas em cura e suporte.

SLAYERS
Caçadores especializados contra monstros específicos.

FURTIVOS
Especialistas em infiltração e emboscadas.`,
  },
  {
    id: "vantagens-avancadas",
    title: "Vantagens Avançadas",
    content: `Além das vantagens padrão do SWADE, o cenário oferece vantagens específicas:

VANTAGENS DE MANA
- Fluxo Rúnico: +5 Mana máxima
- Conduíte de Mana: Reduz custo de magias

VANTAGENS DE SOMBRA
- Invocador: Pode invocar sombras
- Passo das Sombras: Teleporte curto
- Manto Sombrio: +2 em Furtividade

VANTAGENS DE COMBATE
- Golpe Critique: +2 em ataques críticos
- Instinto de Caça: +2 em Iniciativa`,
  },
  {
    id: "itens-runicos",
    title: "Itens Rúnicos",
    content: `Itens rúnicos são equipamentos infusionados com Mana.

RARIDADE
- Comum: +1 a stat
- Épico: +2
- Lendário: +3
- Único: Efeito especial

TIPOS
- Armas: +dano, +alcance
- Armaduras: +defesa
- Acessórios: +Mana`,
  },
  {
    id: "tabelas-loot-progressao",
    title: "Tabelas de Loot e Progressão",
    content: `Derrotar monstros concede recompensas:

LOOT DE MONSTRO
- Essências: Energia de monstros
- Materiais: Parts para crafting
- Itens: Equipamentos

PROGRESSÃO DE RANK
- Rank E: Monstros fracos
- Rank D: Monstros moderados
- Rank C: Monstros fortes
- Rank B: Monstros poderosos
- Rank A: Monstros de elite
- Rank S: Monstros lendários`,
  },
  {
    id: "regras-avancadas-dungeons",
    title: "Regras Avançadas de Dungeons",
    content: `Dungeons são ambientes hostis e mutáveis.

ARMADILHAS RÚNICAS
- Runa Explosiva: 2d8 de dano de fogo
- Garganta de Pedra: 1d10 de dano ao cair
- Pilar Esmagador: 3d10 de dano

MODO DE CORRUPÇÃO
- 1 hora: -1 na recuperação de Mana
- 2 horas: -1 em testes físicos
- 3+ horas: 1 nível de Fadiga

SCRIPT DE CHEFE
- Fase 1: Padrões simples
- Gatilho: Mudança ambiental
- Fase Final: Ataque letal`,
  },
  {
    id: "origem-dos-portais",
    title: "Origem dos Portais",
    content: `Os Portais são cicatrizes na realidade.

A GRANDE RUPTURA DO VÉU
Aproximadamente duzentos anos atrás, algo rompeu o Véu — a barreira invisível que separava o mundo material de outros planos. Esse evento ficou conhecido como A Grande Ruptura.

Quando o Véu se fragilizou, um fluxo massivo de Mana vazou para o mundo, formando os primeiros Portais.

TIPOS DE PORTAIS
- Fendas Menores (Rank E/D): Instáveis
- Templos Antigos (Rank C): Estruturas reativadas
- Fortalezas Corrompidas (Ranks B/A): Complexos extensos
- Portais Monárquicos (Rank S): Eventos catastróficos`,
  },
  {
    id: "guia-de-guildas",
    title: "Guia de Guildas",
    content: `As Guildas organizam Caçadores e distribuem contratos.

FUNÇÕES DAS GUILDAS
- Gerenciamento de contratos
- Treinamento de Caçadores
- Pesquisa de Essências
- Proteção de territórios

PROGRESSÃO INTERNA
- Novato: Recém-ingresso
- Operador: Ativo
- Veterano: Experiente
- Capitão: Líder de esquadrões
- Líder: Comando máximo`,
  },
];

function convertToHtml(text) {
  if (!text) return "";
  
  const lines = text.split("\n");
  let html = "";
  let inList = false;
  let listType = "";
  
  for (let line of lines) {
    line = line.trim();
    if (!line) continue;
    
    if (line.startsWith("- ") || line.startsWith("* ")) {
      if (!inList || listType !== "ul") {
        if (inList) html += listType === "ul" ? "</ul>" : "</ol>";
        html += "<ul>";
        inList = true;
        listType = "ul";
      }
      html += `<li>${line.substring(2)}</li>`;
    } else if (/^\d+\.\s/.test(line)) {
      if (!inList || listType !== "ol") {
        if (inList) html += listType === "ul" ? "</ul>" : "</ol>";
        html += "<ol>";
        inList = true;
        listType = "ol";
      }
      html += `<li>${line.replace(/^\d+\.\s/, "")}</li>`;
    } else {
      if (inList) {
        html += listType === "ul" ? "</ul>" : "</ol>";
        inList = false;
        listType = "";
      }
      
      if (line.startsWith("[ATENÇÃO]")) {
        html += `<div class="rule-box warning"><strong>Atenção</strong><p>${line.replace("[ATENÇÃO]", "").trim()}</p></div>`;
      } else if (line.startsWith("[INFO]")) {
        html += `<div class="rule-box info"><strong>Info</strong><p>${line.replace("[INFO]", "").trim()}</p></div>`;
      } else if (line.startsWith("[DICA]")) {
        html += `<div class="rule-box tip"><strong>Dica</strong><p>${line.replace("[DICA]", "").trim()}</p></div>`;
      } else if (line.match(/^[A-ZÇÀÁÉÍÓÚ\s]+$/)) {
        html += `<h3>${line}</h3>`;
      } else if (line.includes(":")) {
        const parts = line.split(":");
        html += `<p><strong>${parts[0]}:</strong>${parts.slice(1).join(":")}</p>`;
      } else {
        html += `<p>${line}</p>`;
      }
    }
  }
  
  if (inList) {
    html += listType === "ul" ? "</ul>" : "</ol>";
  }
  
  return html;
}

function insertAtCursor(textarea, before, after) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selected = textarea.value.substring(start, end);
  const newText = before + selected + after;
  
  const newValue = textarea.value.substring(0, start) + newText + textarea.value.substring(end);
  return { value: newValue, cursor: start + before.length + selected.length };
}

function SortableItem({section, isSelected, onClick, onDelete}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({id: section.id});

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <ListItem
      ref={setNodeRef}
      style={style}
      sx={{pl: isSelected ? 2 : 1, bgcolor: isSelected ? "action.selected" : "transparent"}}
    >
      <Box
        {...attributes}
        {...listeners}
        sx={{cursor: "grab", display: "flex", alignItems: "center", mr: 1}}
      >
        <DragIcon sx={{color: "text.secondary", fontSize: 18}} />
      </Box>
      <ListItemButton onClick={onClick} sx={{pr: 6}}>
        <ListItemText 
          primary={section.title} 
          primaryTypographyProps={{variant: "body2"}}
        />
      </ListItemButton>
      <Box sx={{position: "absolute", right: 8}}>
        <IconButton size="small" color="error" onClick={onDelete}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Box>
    </ListItem>
  );
}

export default function LoreTab({scenarioData, onUpdate, loading}) {
  const [loreSections, setLoreSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);
  const [editedContent, setEditedContent] = useState("");
  const [isDirty, setIsDirty] = useState(false);
  const [viewMode, setViewMode] = useState("preview");
  const textareaRef = useRef(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (scenarioData?.loreSections && scenarioData.loreSections.length > 0) {
      setLoreSections(scenarioData.loreSections);
    } else {
      setLoreSections(DEFAULT_LORE_SECTIONS);
    }
  }, [scenarioData]);

  const handleDragEnd = (event) => {
    const {active, over} = event;
    
    if (active.id !== over?.id) {
      setLoreSections((items) => {
        const oldIndex = items.findIndex(i => i.id === active.id);
        const newIndex = items.findIndex(i => i.id === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);
        onUpdate("loreSections", newItems);
        return newItems;
      });
    }
  };

  const handleSelectSection = (section) => {
    if (isDirty && selectedSection) {
      handleSave();
    }
    setSelectedSection(section);
    setEditedContent(section.content || "");
    setIsDirty(false);
  };

  const handleContentChange = (content) => {
    setEditedContent(content);
    setIsDirty(true);
  };

  const handleFormat = (format) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    let result;
    switch (format) {
      case "bold":
        result = insertAtCursor(textarea, "**", "**");
        break;
      case "italic":
        result = insertAtCursor(textarea, "*", "*");
        break;
      case "title":
        result = insertAtCursor(textarea, "\n", "\n");
        break;
      case "ul":
        result = insertAtCursor(textarea, "\n- ", "");
        break;
      case "ol":
        result = insertAtCursor(textarea, "\n1. ", "");
        break;
      case "warning":
        result = insertAtCursor(textarea, "\n[ATENÇÃO] ", "");
        break;
      case "info":
        result = insertAtCursor(textarea, "\n[INFO] ", "");
        break;
      case "tip":
        result = insertAtCursor(textarea, "\n[DICA] ", "");
        break;
      default:
        return;
    }
    
    setEditedContent(result.value);
    setIsDirty(true);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(result.cursor, result.cursor);
    }, 0);
  };

  const handleSave = () => {
    if (!selectedSection) return;

    const contentHtml = convertToHtml(editedContent);
    const updatedSections = loreSections.map(s => 
      s.id === selectedSection.id ? {...s, content: editedContent, contentHtml} : s
    );
    
    setLoreSections(updatedSections);
    setSelectedSection({...selectedSection, content: editedContent, contentHtml});
    onUpdate("loreSections", updatedSections);
    setIsDirty(false);
  };

  const handleAddSection = () => {
    const newId = `custom-${Date.now()}`;
    const newSection = {
      id: newId,
      title: "Nova Seção",
      content: "Novo conteúdo aqui...",
      contentHtml: "<p>Novo conteúdo aqui...</p>"
    };
    const updated = [...loreSections, newSection];
    setLoreSections(updated);
    onUpdate("loreSections", updated);
    handleSelectSection(newSection);
  };

  const handleDeleteSection = (sectionId) => {
    if (!window.confirm("Confirmar exclusão desta seção?")) return;
    const updated = loreSections.filter(s => s.id !== sectionId);
    setLoreSections(updated);
    onUpdate("loreSections", updated);
    if (selectedSection?.id === sectionId) {
      setSelectedSection(null);
      setEditedContent("");
    }
  };

  const handleUpdateTitle = (sectionId, newTitle) => {
    const updated = loreSections.map(s =>
      s.id === sectionId ? {...s, title: newTitle} : s
    );
    setLoreSections(updated);
    onUpdate("loreSections", updated);
    if (selectedSection?.id === sectionId) {
      setSelectedSection({...selectedSection, title: newTitle});
    }
  };

  const renderPreview = () => {
    const html = convertToHtml(editedContent);
    return (
      <Box 
        sx={{
          "& p": {mb: 1.5, lineHeight: 1.6},
          "& h3": {mt: 2, mb: 1, color: "#333", borderLeft: "3px solid #667eea", pl: 1},
          "& ul, & ol": {pl: 3, mb: 1},
          "& li": {mb: 0.5},
          "& strong": {fontWeight: 600},
          "& em": {fontStyle: "italic"},
          "& .rule-box": {p: 2, borderRadius: 1, mb: 2, borderLeft: "4px solid"},
          "& .rule-box.warning": { bgcolor: "#ffebee", borderColor: "#d32f2f", "& p": {mb: 0}},
          "& .rule-box.info": { bgcolor: "#e3f2fd", borderColor: "#1976d2", "& p": {mb: 0}},
          "& .rule-box.tip": { bgcolor: "#e8f5e9", borderColor: "#388e3c", "& p": {mb: 0}}
        }}
        dangerouslySetInnerHTML={{__html: html || "<em>Nenhum conteúdo</em>"}}
      />
    );
  };

  return (
    <Box sx={{display: "flex", gap: 2, height: "calc(100vh - 300px)"}}>
      {/* Lista de Seções com Drag-and-Drop */}
      <Paper variant="outlined" sx={{width: 280, overflow: "auto"}}>
        <Box sx={{p: 2, borderBottom: 1, borderColor: "divider", display: "flex", justifyContent: "space-between", alignItems: "center"}}>
          <Typography variant="subtitle1" fontWeight="bold">Sumário</Typography>
          <Button size="small" startIcon={<AddIcon />} onClick={handleAddSection}>
            Add
          </Button>
        </Box>
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext 
            items={loreSections.map(s => s.id)}
            strategy={verticalListSortingStrategy}
          >
            <List sx={{p: 0}}>
              {loreSections.map((section, idx) => (
                <SortableItem
                  key={section.id}
                  id={section.id}
                  section={section}
                  isSelected={selectedSection?.id === section.id}
                  onClick={() => handleSelectSection(section)}
                  onDelete={() => handleDeleteSection(section.id)}
                />
              ))}
            </List>
          </SortableContext>
        </DndContext>
      </Paper>

      {/* Área de Edição */}
      <Paper variant="outlined" sx={{flex: 1, display: "flex", flexDirection: "column", overflow: "hidden"}}>
        {selectedSection ? (
          <>
            <Box sx={{p: 2, borderBottom: 1, borderColor: "divider", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 1}}>
              <TextField
                value={selectedSection.title}
                onChange={(e) => handleUpdateTitle(selectedSection.id, e.target.value)}
                size="small"
                label="Título"
                sx={{minWidth: 200, flex: 1}}
              />
              <Box sx={{display: "flex", gap: 1, alignItems: "center"}}>
                <ToggleButtonGroup size="small" value={viewMode} exclusive onChange={(e, v) => v && setViewMode(v)}>
                  <ToggleButton value="edit"><EditIcon fontSize="small" sx={{mr: 0.5}}/>Editar</ToggleButton>
                  <ToggleButton value="preview"><PreviewIcon fontSize="small" sx={{mr: 0.5}}/>Visualizar</ToggleButton>
                </ToggleButtonGroup>
                <Button 
                  variant="contained" 
                  startIcon={<SaveIcon />} 
                  onClick={handleSave}
                  disabled={!isDirty}
                  size="small"
                >
                  Salvar
                </Button>
              </Box>
            </Box>
            
            {viewMode === "edit" && (
              <Box sx={{px: 2, py: 1, borderBottom: 1, borderColor: "divider", display: "flex", gap: 0.5, flexWrap: "wrap"}}>
                <Button size="small" variant="outlined" onClick={() => handleFormat("bold")}>N</Button>
                <Button size="small" variant="outlined" onClick={() => handleFormat("italic")} sx={{fontStyle: "italic"}}>I</Button>
                <Button size="small" variant="outlined" onClick={() => handleFormat("title")}>Título</Button>
                <Button size="small" variant="outlined" onClick={() => handleFormat("ul")}>Lista</Button>
                <Button size="small" variant="outlined" onClick={() => handleFormat("ol")}>123</Button>
                <Button size="small" variant="outlined" onClick={() => handleFormat("warning")} sx={{color: "#d32f2f", borderColor: "#d32f2f"}}>Atenção</Button>
                <Button size="small" variant="outlined" onClick={() => handleFormat("info")} sx={{color: "#1976d2", borderColor: "#1976d2"}}>Info</Button>
                <Button size="small" variant="outlined" onClick={() => handleFormat("tip")} sx={{color: "#388e3c", borderColor: "#388e3c"}}>Dica</Button>
              </Box>
            )}

            <Box sx={{flex: 1, p: 2, overflow: "auto"}}>
              {viewMode === "edit" ? (
                <TextField
                  inputRef={textareaRef}
                  value={editedContent}
                  onChange={(e) => handleContentChange(e.target.value)}
                  fullWidth
                  multiline
                  rows={18}
                  placeholder="Digite o conteúdo aqui..."
                  sx={{"& .MuiInputBase-root": {height: "100%", alignItems: "flex-start"}}}
                />
              ) : (
                <Box sx={{p: 2, bgcolor: "#fafafa", borderRadius: 1, minHeight: 300}}>
                  {renderPreview()}
                </Box>
              )}
            </Box>
          </>
        ) : (
          <Box sx={{display: "flex", alignItems: "center", justifyContent: "center", height: "100%", p: 4}}>
            <Typography color="text.secondary" align="center">
              Selecione uma seção do sumário para editar<br/>ou crie uma nova com o botão "Add"
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
}
