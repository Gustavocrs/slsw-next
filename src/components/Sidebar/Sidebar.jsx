/**
 * Sidebar Component
 * Sumário do livro e navegação
 */

"use client";

import React from "react";
import styled from "styled-components";
import {Drawer, List, ListItem, ListItemText, IconButton, Box} from "@mui/material";
import {Close as CloseIcon} from "@mui/icons-material";
import manualSections from "@/data/manualSections";

const DrawerStyled = styled(Drawer)`
  .MuiDrawer-paper {
    width: 280px;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  }
`;

const SidebarHeader = styled(Box)`
  padding: 20px;
  border-bottom: 2px solid rgba(102, 126, 234, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;

  h2 {
    margin: 0;
    font-size: 1.3rem;
    color: #333;
  }
`;

const SectionTitle = styled(ListItemText)`
  && {
    .MuiListItemText-primary {
      font-weight: 700;
      color: #667eea;
      font-size: 0.95rem;
    }
  }
`;

const NavItem = styled(ListItem)`
  && {
    padding-left: 20px;
    color: #666;
    font-size: 0.95rem;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background-color: rgba(102, 126, 234, 0.15);
      color: #667eea;
      padding-left: 25px;
    }
  }
`;

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
