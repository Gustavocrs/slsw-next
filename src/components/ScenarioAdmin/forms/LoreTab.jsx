/**
 * LoreTab Component
 * Editor de Lore do Cenário - Seções do Manual
 * Editor visual sem necessidade de saber HTML
 */

"use client";

import {
  closestCenter,
  DndContext,
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
import { CSS } from "@dnd-kit/utilities";
import {
  Add as AddIcon,
  FormatBold as BoldIcon,
  Delete as DeleteIcon,
  DragIndicator as DragIcon,
  Edit as EditIcon,
  Info as InfoIcon,
  FormatItalic as ItalicIcon,
  FormatListBulleted as ListIcon,
  FormatListNumbered as ListNumberedIcon,
  Visibility as PreviewIcon,
  Save as SaveIcon,
  CheckCircle as TipIcon,
  Title as TitleIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";
import {
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";

const DEFAULT_LORE_SECTIONS = [];

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

  const newValue =
    textarea.value.substring(0, start) +
    newText +
    textarea.value.substring(end);
  return { value: newValue, cursor: start + before.length + selected.length };
}

function SortableItem({ section, isSelected, onClick, onDelete }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <ListItem
      ref={setNodeRef}
      style={style}
      sx={{
        pl: isSelected ? 2 : 1,
        bgcolor: isSelected ? "action.selected" : "transparent",
      }}
    >
      <Box
        {...attributes}
        {...listeners}
        sx={{ cursor: "grab", display: "flex", alignItems: "center", mr: 1 }}
      >
        <DragIcon sx={{ color: "text.secondary", fontSize: 18 }} />
      </Box>
      <ListItemButton onClick={onClick} sx={{ pr: 6 }}>
        <ListItemText
          primary={section.title}
          primaryTypographyProps={{ variant: "body2" }}
        />
      </ListItemButton>
      <Box sx={{ position: "absolute", right: 8 }}>
        <IconButton size="small" color="error" onClick={onDelete}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Box>
    </ListItem>
  );
}

export default function LoreTab({ scenarioData, onUpdate, loading }) {
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
    }),
  );

  useEffect(() => {
    if (scenarioData?.loreSections && scenarioData.loreSections.length > 0) {
      setLoreSections(scenarioData.loreSections);
    } else {
      setLoreSections(DEFAULT_LORE_SECTIONS);
    }
  }, [scenarioData]);

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = loreSections.findIndex((i) => i.id === active.id);
      const newIndex = loreSections.findIndex((i) => i.id === over.id);
      const newItems = arrayMove(loreSections, oldIndex, newIndex);
      setLoreSections(newItems);
      setOrderModified(true);
      onUpdate("loreSections", newItems);
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
    const updatedSections = loreSections.map((s) =>
      s.id === selectedSection.id
        ? { ...s, content: editedContent, contentHtml }
        : s,
    );

    setLoreSections(updatedSections);
    setSelectedSection({
      ...selectedSection,
      content: editedContent,
      contentHtml,
    });
    onUpdate("loreSections", updatedSections);
    setIsDirty(false);
  };

  const handleAddSection = () => {
    const newId = `custom-${Date.now()}`;
    const newSection = {
      id: newId,
      title: "Nova Seção",
      content: "Novo conteúdo aqui...",
      contentHtml: "<p>Novo conteúdo aqui...</p>",
    };
    const updated = [...loreSections, newSection];
    setLoreSections(updated);
    onUpdate("loreSections", updated);
    handleSelectSection(newSection);
  };

  const handleDeleteSection = (sectionId) => {
    if (!window.confirm("Confirmar exclusão desta seção?")) return;
    const updated = loreSections.filter((s) => s.id !== sectionId);
    setLoreSections(updated);
    onUpdate("loreSections", updated);
    if (selectedSection?.id === sectionId) {
      setSelectedSection(null);
      setEditedContent("");
    }
  };

  const handleUpdateTitle = (sectionId, newTitle) => {
    const updated = loreSections.map((s) =>
      s.id === sectionId ? { ...s, title: newTitle } : s,
    );
    setLoreSections(updated);
    onUpdate("loreSections", updated);
    if (selectedSection?.id === sectionId) {
      setSelectedSection({ ...selectedSection, title: newTitle });
    }
  };

  const renderPreview = () => {
    const html = convertToHtml(editedContent);
    return (
      <Box
        sx={{
          "& p": { mb: 1.5, lineHeight: 1.6 },
          "& h3": {
            mt: 2,
            mb: 1,
            color: "#333",
            borderLeft: "3px solid #667eea",
            pl: 1,
          },
          "& ul, & ol": { pl: 3, mb: 1 },
          "& li": { mb: 0.5 },
          "& strong": { fontWeight: 600 },
          "& em": { fontStyle: "italic" },
          "& .rule-box": {
            p: 2,
            borderRadius: 1,
            mb: 2,
            borderLeft: "4px solid",
          },
          "& .rule-box.warning": {
            bgcolor: "#ffebee",
            borderColor: "#d32f2f",
            "& p": { mb: 0 },
          },
          "& .rule-box.info": {
            bgcolor: "#e3f2fd",
            borderColor: "#1976d2",
            "& p": { mb: 0 },
          },
          "& .rule-box.tip": {
            bgcolor: "#e8f5e9",
            borderColor: "#388e3c",
            "& p": { mb: 0 },
          },
        }}
        dangerouslySetInnerHTML={{ __html: html || "<em>Nenhum conteúdo</em>" }}
      />
    );
  };

  return (
    <Box sx={{ display: "flex", gap: 2, height: "calc(100vh - 300px)" }}>
      {/* Lista de Seções com Drag-and-Drop */}
      <Paper variant="outlined" sx={{ width: 280, overflow: "auto" }}>
        <Box
          sx={{
            p: 2,
            borderBottom: 1,
            borderColor: "divider",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="subtitle1" fontWeight="bold">
            Sumário
          </Typography>
          <Button
            size="small"
            startIcon={<AddIcon />}
            onClick={handleAddSection}
          >
            Add
          </Button>
        </Box>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={loreSections.map((s) => s.id)}
            strategy={verticalListSortingStrategy}
          >
            <List sx={{ p: 0 }}>
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
      <Paper
        variant="outlined"
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {selectedSection ? (
          <>
            <Box
              sx={{
                p: 2,
                borderBottom: 1,
                borderColor: "divider",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 1,
              }}
            >
              <TextField
                value={selectedSection.title}
                onChange={(e) =>
                  handleUpdateTitle(selectedSection.id, e.target.value)
                }
                size="small"
                label="Título"
                sx={{ minWidth: 200, flex: 1 }}
              />
              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <ToggleButtonGroup
                  size="small"
                  value={viewMode}
                  exclusive
                  onChange={(e, v) => v && setViewMode(v)}
                >
                  <ToggleButton value="edit">
                    <EditIcon fontSize="small" sx={{ mr: 0.5 }} />
                    Editar
                  </ToggleButton>
                  <ToggleButton value="preview">
                    <PreviewIcon fontSize="small" sx={{ mr: 0.5 }} />
                    Visualizar
                  </ToggleButton>
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
              <Box
                sx={{
                  px: 2,
                  py: 1,
                  borderBottom: 1,
                  borderColor: "divider",
                  display: "flex",
                  gap: 0.5,
                  flexWrap: "wrap",
                }}
              >
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => handleFormat("bold")}
                >
                  N
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => handleFormat("italic")}
                  sx={{ fontStyle: "italic" }}
                >
                  I
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => handleFormat("title")}
                >
                  Título
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => handleFormat("ul")}
                >
                  Lista
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => handleFormat("ol")}
                >
                  123
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => handleFormat("warning")}
                  sx={{ color: "#d32f2f", borderColor: "#d32f2f" }}
                >
                  Atenção
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => handleFormat("info")}
                  sx={{ color: "#1976d2", borderColor: "#1976d2" }}
                >
                  Info
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => handleFormat("tip")}
                  sx={{ color: "#388e3c", borderColor: "#388e3c" }}
                >
                  Dica
                </Button>
              </Box>
            )}

            <Box sx={{ flex: 1, p: 2, overflow: "auto" }}>
              {viewMode === "edit" ? (
                <TextField
                  inputRef={textareaRef}
                  value={editedContent}
                  onChange={(e) => handleContentChange(e.target.value)}
                  fullWidth
                  multiline
                  rows={18}
                  placeholder="Digite o conteúdo aqui..."
                  sx={{
                    "& .MuiInputBase-root": {
                      height: "100%",
                      alignItems: "flex-start",
                    },
                  }}
                />
              ) : (
                <Box
                  sx={{
                    p: 2,
                    bgcolor: "#fafafa",
                    borderRadius: 1,
                    minHeight: 300,
                  }}
                >
                  {renderPreview()}
                </Box>
              )}
            </Box>
          </>
        ) : (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              p: 4,
            }}
          >
            <Typography color="text.secondary" align="center">
              Selecione uma seção do sumário para editar
              <br />
              ou crie uma nova com o botão "Add"
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
}
