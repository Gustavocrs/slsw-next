/**
 * InspectSheetModal Component
 * Modal para visualizar a ficha de outro personagem (sem sobrescrever a do usuário)
 */

"use client";

import React, {useState, useEffect} from "react";
import {
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Slide,
  useMediaQuery,
  useTheme,
  Button,
} from "@mui/material";
import {Close as CloseIcon} from "@mui/icons-material";
import {useUIStore, useCharacterStore} from "@/stores/characterStore";
import SheetView from "@/components/SheetView";
import APIService from "@/lib/api";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function InspectSheetModal() {
  const {inspectModalOpen, toggleInspectModal} = useUIStore();
  const {inspectedCharacter} = useCharacterStore();
  const [localChar, setLocalChar] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (inspectedCharacter) {
      setLocalChar(inspectedCharacter);
    }
  }, [inspectedCharacter]);

  // Função de debounce para salvar alterações sem floodar a API
  const saveCharacterDebounced = React.useCallback((characterData) => {
    if (!characterData || !characterData._id) return;

    // Limpar timeout anterior se existir
    if (window._inspectSaveTimeout) clearTimeout(window._inspectSaveTimeout);

    window._inspectSaveTimeout = setTimeout(async () => {
      try {
        await APIService.saveCharacter(characterData.userId, characterData);
        console.log("Ficha inspecionada salva com sucesso.");
      } catch (error) {
        console.error("Erro ao salvar ficha inspecionada:", error);
      }
    }, 1000);
  }, []);

  const handleUpdate = (updater) => {
    setLocalChar((prev) => {
      const newState = updater(prev);
      saveCharacterDebounced(newState);
      return newState;
    });
  };

  const actions = {
    updateAttribute: (key, value) =>
      handleUpdate((prev) => ({...prev, [key]: value})),

    addItemToList: (listName, item) =>
      handleUpdate((prev) => ({
        ...prev,
        [listName]: [...(prev[listName] || []), item],
      })),

    removeItemFromList: (listName, index) =>
      handleUpdate((prev) => ({
        ...prev,
        [listName]: (prev[listName] || []).filter((_, i) => i !== index),
      })),

    updateListItem: (listName, index, item) =>
      handleUpdate((prev) => {
        const newList = [...(prev[listName] || [])];
        newList[index] = item;
        return {...prev, [listName]: newList};
      }),

    updateCharacter: (newData) => {
      setLocalChar(newData); // Atualizações diretas (sem debounce se vierem de fontes externas)
    },
  };

  if (!localChar) return null;

  return (
    <Dialog
      fullScreen
      fullWidth
      maxWidth="lg"
      open={inspectModalOpen}
      onClose={toggleInspectModal}
      TransitionComponent={Transition}
    >
      <AppBar
        sx={{
          position: "relative",
          bgcolor: "#333",
          "@media print": {display: "none"},
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={toggleInspectModal}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ml: 2, flex: 1}} variant="h6" component="div">
            Ficha de {localChar.nome || "Personagem"}
          </Typography>
        </Toolbar>
      </AppBar>
      <SheetView character={localChar} actions={actions} />
    </Dialog>
  );
}

export default InspectSheetModal;
