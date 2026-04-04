/**
 * BookView Component
 * Visualização do livro/manual
 */

"use client";

import { Menu as MenuIcon, Search as SearchIcon } from "@mui/icons-material";
import {
  Box,
  Divider,
  Fab,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import styled from "styled-components";
import { getEdges, RANKS } from "@/lib/rpgEngine";

const BookContainer = styled(Paper)`
  && {
    padding: 0;
    max-width: ${(props) => (props.$twoPage ? "100%" : "900px")};
    margin: 0 auto;
    background: white;
    border-radius: ${(props) => (props.$twoPage ? "0" : "12px")};
    box-shadow: ${(props) =>
      props.$twoPage ? "none" : "0 4px 12px rgba(0, 0, 0, 0.1)"};
    height: ${(props) => (props.$twoPage ? "100%" : "auto")};

    ${(props) =>
      props.$twoPage &&
      `
      overflow-x: hidden;
      overflow-y: auto;
      scroll-behavior: smooth;
    `}

    @media (max-width: 900px) {
      padding: 20px;
      padding-top: ${(props) => (props.$twoPage ? "20px" : "80px")};
      padding-bottom: ${(props) => (props.$twoPage ? "20px" : "100px")};
      width: 100%;
      border-radius: 0;
      box-shadow: none;
    }
  }
`;

const MenuButton = styled(IconButton)`
  && {
    position: fixed;
    top: 20px;
    left: 20px;
    background: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    z-index: 100;

    &:hover {
      background: #f3f4f6;
    }
  }
`;

const SectionTitle = styled.h2`
  color: #333;
  font-size: 2rem;
  margin-top: 40px;
  margin-bottom: 20px;
  border-left: 4px solid #667eea;
  padding-left: 20px;
`;

const SectionContent = styled.div`
  line-height: 1.8;
  color: #555;
  font-size: 1rem;

  p {
    margin-bottom: 15px;
  }

  strong {
    color: #333;
  }

  h3 {
    color: #333;
    font-size: 1.3rem;
    margin-top: 25px;
    margin-bottom: 15px;
  }

  h4 {
    color: #555;
    font-size: 1.1rem;
    margin-top: 20px;
    margin-bottom: 10px;
  }

  ul,
  ol {
    margin-bottom: 15px;
    margin-left: 20px;
  }

  li {
    margin-bottom: 8px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
    display: block;
    overflow-x: auto;
  }

  table th,
  table td {
    border: 1px solid #ddd;
    padding: 10px;
    text-align: left;
  }

  table th {
    background: #f0f0f0;
    font-weight: bold;
  }

  .rule-box {
    background: #f9f3cd;
    border-left: 4px solid #ffc107;
    padding: 15px;
    margin: 20px 0;
    border-radius: 4px;
  }

  .box {
    background: #e8f4f8;
    border-left: 4px solid #00bcd4;
    padding: 15px;
    margin: 20px 0;
    border-radius: 4px;
  }

  .muted {
    color: #999;
    font-style: italic;
  }

  img {
    max-width: 100%;
    height: auto;
  }
`;

const highlight = (text, term) => {
  if (!term || !term.trim() || !text) {
    return text;
  }
  const escapedTerm = term.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
  const regex = new RegExp(`(${escapedTerm})`, "gi");
  return text.replace(
    regex,
    `<mark style="background-color: #fff59d;">$1</mark>`,
  );
};

const safeHighlightHtml = (html, term) => {
  if (!term || !term.trim() || !html) {
    return html;
  }
  const escapedTerm = term.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
  const regex = new RegExp(`(${escapedTerm})`, "gi");
  const parts = html.split(/(<[^>]*>)/g);

  return parts
    .map((part) => {
      return /<[^>]*>/.test(part)
        ? part
        : part.replace(
            regex,
            `<mark style="background-color: #fff59d;">$1</mark>`,
          );
    })
    .join("");
};

function BookView({ onOpenSidebar, twoPageMode = false, loreSections = [] }) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const scrollContainerRef = React.useRef(null);
  const sections = loreSections;

  const handleScroll = (e) => {
    const _scrollTop = e.target?.scrollTop ?? window.scrollY;
  };

  React.useEffect(() => {
    if (!twoPageMode) {
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [twoPageMode]);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Mostrar mensagem quando não há conteúdo do livro configurado
  if (sections.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          height: twoPageMode ? "100%" : "auto",
          position: "relative",
          width: "100%",
        }}
      >
        {!twoPageMode && (
          <MenuButton onClick={onOpenSidebar}>
            <MenuIcon />
          </MenuButton>
        )}
        {twoPageMode && (
          <Box
            sx={{
              width: 260,
              flexShrink: 0,
              borderRight: "1px solid #e0e0e0",
              bgcolor: "#fafafa",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              "&::-webkit-scrollbar": { width: "6px" },
              "&::-webkit-scrollbar-track": { background: "transparent" },
              "&::-webkit-scrollbar-thumb": {
                background: "#bdbdbd",
                borderRadius: "3px",
              },
            }}
          >
            <List component="nav" dense disablePadding>
              <ListItem
                id="sumario-header"
                sx={{
                  py: 2,
                  bgcolor: "#fff",
                  borderBottom: "1px solid #e0e0e0",
                  position: "sticky",
                  top: 0,
                  zIndex: 2,
                  height: 60,
                }}
              >
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  color="primary"
                >
                  Sumário
                </Typography>
              </ListItem>
            </List>
          </Box>
        )}
        <BookContainer
          id="livro-container"
          $twoPage={twoPageMode}
          ref={twoPageMode ? scrollContainerRef : null}
          onScroll={twoPageMode ? handleScroll : undefined}
          sx={{
            flex: 1,
            position: "relative",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            id="livro-header"
            sx={{
              flexShrink: 0,
              py: 1,
              px: 2,
              bgcolor: "#fff",
              borderBottom: "1px solid #e0e0e0",
              height: 60,
              display: "flex",
              alignItems: "center",
            }}
          >
            <TextField
              fullWidth
              size="small"
              placeholder="Pesquisar no manual..."
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "6px",
                  bgcolor: "#f9f9f9",
                },
              }}
            />
          </Box>
          <Box sx={{ flex: 1, overflow: "auto", p: 3 }}>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ textAlign: "center", mt: 4 }}
            >
              Este cenário não tem um Livro configurado.
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textAlign: "center", mt: 2 }}
            >
              Configure as seções na aba Lore do Admin de Cenários.
            </Typography>
          </Box>
        </BookContainer>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        height: twoPageMode ? "100%" : "auto",
        position: "relative",
        width: "100%",
      }}
    >
      {!twoPageMode && (
        <MenuButton onClick={onOpenSidebar}>
          <MenuIcon />
        </MenuButton>
      )}
      {/* Sumário / Sidebar lateral (Apenas na View do Painel de Jogo) */}
      {twoPageMode && (
        <Box
          sx={{
            width: 260,
            flexShrink: 0,
            borderRight: "1px solid #e0e0e0",
            bgcolor: "#fafafa",
            overflowY: "auto",
            display: { xs: "none", md: "block" },
            height: "100%",
            "&::-webkit-scrollbar": { width: "6px" },
            "&::-webkit-scrollbar-track": { background: "transparent" },
            "&::-webkit-scrollbar-thumb": {
              background: "#bdbdbd",
              borderRadius: "3px",
            },
          }}
        >
          <List component="nav" dense disablePadding>
            <ListItem
              id="sumario-header"
              sx={{
                py: 2,
                bgcolor: "#fff",
                borderBottom: "1px solid #e0e0e0",
                position: "sticky",
                top: 0,
                zIndex: 2,
                height: 60,
              }}
            >
              <Typography variant="subtitle1" fontWeight="bold" color="primary">
                Sumário
              </Typography>
            </ListItem>
            {sections.map((section) => (
              <React.Fragment key={section.id}>
                <ListItem
                  button
                  onClick={() => scrollToSection(section.id)}
                  sx={{ "&:hover": { bgcolor: "#e3f2fd" }, py: 1 }}
                >
                  <ListItemText
                    primary={section.title.replace(/<\/?[^>]+(>|$)/g, "")}
                    primaryTypographyProps={{
                      fontSize: "0.85rem",
                      color: "#333",
                    }}
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        </Box>
      )}
      <BookContainer
        id="livro-container"
        $twoPage={twoPageMode}
        ref={twoPageMode ? scrollContainerRef : null}
        onScroll={twoPageMode ? handleScroll : undefined}
        sx={{
          flex: 1,
          position: "relative",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          id="livro-header"
          sx={{
            flexShrink: 0,
            py: 1,
            px: 2,
            bgcolor: "#fff",
            borderBottom: "1px solid #e0e0e0",
            height: 60,
            display: "flex",
            alignItems: "center",
          }}
        >
          <TextField
            fullWidth
            size="small"
            placeholder="Pesquisar no manual..."
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "6px",
                bgcolor: "#f9f9f9",
              },
            }}
          />
        </Box>
        <Box sx={{ flex: 1, overflow: "auto", p: 3 }}>
          {/* SEÇÕES DO LIVRO - Carregadas do loreSections ou manualSections */}
          {sections.map((section) => {
            const lowerTerm = searchTerm.toLowerCase();

            // Sobrescreve a seção de Vantagens Avançadas para usar dados dinâmicos do rpgEngine em Tabela
            if (section.id === "vantagens-avancadas") {
              const allEdges = getEdges();
              const initialEdges = allEdges
                .filter((e) => e.source === "SL")
                .sort((a, b) => {
                  const rankDiff =
                    RANKS.indexOf(a.rank) - RANKS.indexOf(b.rank);
                  if (rankDiff !== 0) return rankDiff;
                  return a.name.localeCompare(b.name);
                });
              let slEdges = initialEdges;

              // Filtro dinâmico para as vantagens
              if (searchTerm) {
                slEdges = initialEdges.filter(
                  (e) =>
                    e.name?.toLowerCase().includes(lowerTerm) ||
                    e.description?.toLowerCase().includes(lowerTerm) ||
                    e.rank?.toLowerCase().includes(lowerTerm),
                );

                if (
                  slEdges.length === 0 &&
                  !section.title?.toLowerCase().includes(lowerTerm)
                ) {
                  return null;
                }
              }

              const edgesHtml = `
              ${safeHighlightHtml(section.content, searchTerm)}
              
              <div style="overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse; margin-top: 20px; min-width: 600px;">
                  <thead>
                    <tr style="background-color: #f5f5f5; border-bottom: 2px solid #ddd;">
                      <th style="padding: 12px; text-align: left; color: #333;">Nome</th>
                      <th style="padding: 12px; text-align: left; color: #333; width: 120px;">Rank</th>
                      <th style="padding: 12px; text-align: left; color: #333;">Descrição</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${slEdges
                      .map(
                        (edge) => `
                      <tr style="border-bottom: 1px solid #eee;">
                        <td style="padding: 10px; color: #333;">${highlight(edge.name, searchTerm)}</td>
                        <td style="padding: 10px;">
                          <span style="font-size: 0.75em; background: #e0f7fa; padding: 2px 8px; border-radius: 12px; color: #006064; text-transform: uppercase; font-weight: bold; white-space: nowrap;">
                            ${highlight(edge.rank, searchTerm)}
                          </span>
                        </td>
                        <td style="padding: 10px; font-size: 0.95rem; color: #555;">${highlight(edge.description, searchTerm)}</td>
                      </tr>
                    `,
                      )
                      .join("")}
                  </tbody>
                </table>
              </div>
            `;

              return (
                <section key={section.id} id={section.id}>
                  <SectionTitle
                    dangerouslySetInnerHTML={{
                      __html: highlight(section.title, searchTerm),
                    }}
                  />
                  <SectionContent
                    dangerouslySetInnerHTML={{ __html: edgesHtml }}
                  />
                </section>
              );
            }

            // Filtro padrão para seções de texto
            if (searchTerm) {
              const titleMatch = section.title
                ?.toLowerCase()
                .includes(lowerTerm);
              // Usar contentHtml se disponível, senão content
              const contentText = section.contentHtml || section.content || "";
              const contentMatch = contentText
                .toLowerCase()
                .includes(lowerTerm);

              if (!titleMatch && !contentMatch) {
                return null;
              }
            }

            const finalTitle = highlight(section.title, searchTerm);
            // Usar contentHtml se disponível, senão content
            const contentRaw = section.contentHtml || section.content || "";
            const finalContent = safeHighlightHtml(contentRaw, searchTerm);

            return (
              <section key={section.id} id={section.id}>
                <SectionTitle
                  dangerouslySetInnerHTML={{ __html: finalTitle }}
                />
                <SectionContent
                  dangerouslySetInnerHTML={{ __html: finalContent }}
                />
              </section>
            );
          })}
        </Box>
      </BookContainer>
    </Box>
  );
}

export default BookView;
