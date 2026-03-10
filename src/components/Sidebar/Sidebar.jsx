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
    background: "linear-gradient(180deg, #0f172a 0%, #1e1b4b 100%)",
    "@media print": {
      display: "none",
    },
  },
}));

const SidebarHeader = styled(Box)(({theme}) => ({
  padding: "20px",
  borderBottom: `1px solid ${theme.palette.primary.dark}`,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",

  "& h2": {
    margin: 0,
    fontSize: "1.3rem",
    color: theme.palette.primary.light,
  },
}));

const SectionTitle = styled(ListItemText)(({theme}) => ({
  "& .MuiListItemText-primary": {
    fontWeight: 700,
    color: theme.palette.primary.main,
    fontSize: "0.95rem",
  },
}));

const NavItem = styled(ListItem)(({theme}) => ({
  paddingLeft: "20px",
  color: theme.palette.text.secondary,
  fontSize: "0.95rem",
  cursor: "pointer",
  transition: "all 0.2s ease",

  "&:hover": {
    backgroundColor: "rgba(41, 182, 246, 0.1)",
    color: theme.palette.primary.light,
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
