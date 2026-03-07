/**
 * Sidebar Component
 * Sumário do livro e navegação
 */

"use client";

import React from "react";
import {styled} from "@mui/material/styles";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Box,
} from "@mui/material";
import {Close as CloseIcon} from "@mui/icons-material";
import manualSections from "@/data/manualSections";

const DrawerStyled = styled(Drawer)(({theme}) => ({
  "& .MuiDrawer-paper": {
    width: "280px",
    background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
  },
}));

const SidebarHeader = styled(Box)(({theme}) => ({
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

const SectionTitle = styled(ListItemText)(({theme}) => ({
  "& .MuiListItemText-primary": {
    fontWeight: 700,
    color: "#667eea",
    fontSize: "0.95rem",
  },
}));

const NavItem = styled(ListItem)(({theme}) => ({
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

function Sidebar({open, onClose}) {
  const handleNavigation = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({behavior: "smooth"});
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
    </DrawerStyled>
  );
}

export default Sidebar;
