/**
 * BookView Component
 * Visualização do livro/manual
 */

"use client";

import React from "react";
import styled from "styled-components";
import {Paper, IconButton} from "@mui/material";
import {Menu as MenuIcon} from "@mui/icons-material";
import manualSections from "@/data/manualSections";

const BookContainer = styled(Paper)`
  && {
    padding: 40px;
    padding-bottom: 100px;
    max-width: 900px;
    margin: 0 auto;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

    @media (max-width: 900px) {
      padding: 20px;
      padding-bottom: 100px;
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

function BookView({onOpenSidebar}) {
  return (
    <>
      <MenuButton onClick={onOpenSidebar}>
        <MenuIcon />
      </MenuButton>

      <BookContainer>
        {/* SEÇÕES DO LIVRO - Carregadas do manualSections */}
        {manualSections.map((section) => (
          <section key={section.id} id={section.id}>
            <SectionTitle>{section.title}</SectionTitle>
            <SectionContent
              dangerouslySetInnerHTML={{__html: section.content}}
            />
          </section>
        ))}
      </BookContainer>
    </>
  );
}

export default BookView;
