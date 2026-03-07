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
} from "@mui/material";
import {Close as CloseIcon} from "@mui/icons-material";
import {useUIStore, useCharacterStore} from "@/stores/characterStore";
import SheetView from "@/components/SheetView";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function InspectSheetModal() {
  const {inspectModalOpen, toggleInspectModal} = useUIStore();
  const {inspectedCharacter} = useCharacterStore();
  const [localChar, setLocalChar] = useState(null);

  useEffect(() => {
    if (inspectedCharacter) {
      setLocalChar(inspectedCharacter);
    }
  }, [inspectedCharacter]);

  // Mock actions para permitir "edição local" (visual apenas) ou impedir erros
  const actions = {
    updateAttribute: (key, value) =>
      setLocalChar((prev) => ({...prev, [key]: value})),
    addItemToList: () => {}, // Read-only lists for now
    removeItemFromList: () => {},
    updateListItem: () => {},
    updateCharacter: () => {},
  };

  if (!localChar) return null;

  return (
    <Dialog
      fullScreen
      open={inspectModalOpen}
      onClose={toggleInspectModal}
      TransitionComponent={Transition}
    >
      <AppBar sx={{position: "relative", bgcolor: "#333"}}>
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
