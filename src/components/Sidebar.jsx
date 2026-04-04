/**
 * Sidebar Component
 * Sumário do livro e navegação
 * Agora usa dados do Firestore via hook
 */

"use client";

import { Close as CloseIcon } from "@mui/icons-material";
import {
  Box,
  CircularProgress,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import { useScenario } from "@/hooks/useActiveScenario";

const DrawerStyled = styled(Drawer)(({ theme }) => ({
  "& .MuiDrawer-paper": {
    width: "280px",
    background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
    "@media print": {
      display: "none",
    },
  },
}));

const SidebarHeader = styled(Box)(({ theme }) => ({
  padding: "20px",
  borderBottom: "2px solid rgba(102, 126, 234, 0.1)",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",

  "& h2": {
    margin: 0,
    fontSize: "1.3rem",
    color: "#333",
  },
}));

const SectionTitle = styled(ListItemText)(({ theme }) => ({
  "& .MuiListItemText-primary": {
    fontWeight: 700,
    color: theme.palette.primary.main,
    fontSize: "0.95rem",
  },
}));

const NavItem = styled(ListItem)(({ theme }) => ({
  paddingLeft: "20px",
  color: "#666",
  fontSize: "0.95rem",
  cursor: "pointer",
  transition: "all 0.2s ease",

  "&:hover": {
    backgroundColor: "rgba(102, 126, 234, 0.15)",
    color: "#667eea",
    paddingLeft: "25px",
  },
}));

function Sidebar({ open, onClose }) {
  const { scenario, loading } = useScenario("solo-leveling");
  const manualSections = scenario?.loreSections || [];

  const handleNavigation = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    onClose?.();
  };

  return (
    <DrawerStyled anchor="left" open={open} onClose={onClose}>
      <SidebarHeader>
        <h2>📖 Sumário</h2>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </SidebarHeader>

      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            p: 3,
          }}
        >
          <CircularProgress size={24} />
        </Box>
      ) : (
        <List disablePadding>
          {manualSections.map((section) => (
            <NavItem
              key={section.id}
              button
              onClick={() => handleNavigation(section.id)}
            >
              <SectionTitle primary={section.title} />
            </NavItem>
          ))}
        </List>
      )}
    </DrawerStyled>
  );
}

export default Sidebar;
