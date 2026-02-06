"use client";

import {ThemeProvider, createTheme} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import {StyleSheetManager} from "styled-components";

const theme = createTheme({
  palette: {
    primary: {
      main: "#667eea",
      light: "#8b9eee",
      dark: "#4c63d2",
    },
    secondary: {
      main: "#764ba2",
      light: "#9a6ba8",
      dark: "#5a3a7f",
    },
    background: {
      default: "#f3f4f6",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: '"Segoe UI", system-ui, sans-serif',
    h1: {fontWeight: 700},
    h2: {fontWeight: 700},
    h3: {fontWeight: 600},
    button: {textTransform: "none"},
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          transition: "all 0.3s ease",
        },
      },
    },
  },
});

export default function RootLayoutClient({children}) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <StyleSheetManager>{children}</StyleSheetManager>
    </ThemeProvider>
  );
}
