/**
 * UserMenu Component
 * Exibe avatar do usuário e menu de logout
 */

"use client";

import {useState, useEffect} from "react";
// CORREÇÃO: Importando do lugar certo (hooks)
import {useAuth} from "@/hooks";
import {useUIStore} from "@/stores/characterStore";
import {
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Typography,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Logout,
  TableRestaurant,
  Description as SheetIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import APIService from "@/lib/api";
import SheetManager from "@/components/SheetView/SheetManager";

export default function UserMenu() {
  // CORREÇÃO: Usando os nomes corretos retornados pelo hook useAuth
  const {user, logoutUser} = useAuth();
  const {toggleTableListModal, tablesUpdated, setSelectedTable} = useUIStore();
  const [imgError, setImgError] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [pendingInvites, setPendingInvites] = useState(0);
  const [sheetManagerOpen, setSheetManagerOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleClose();
    setSelectedTable(null); // Limpa a mesa selecionada ao sair
    await logoutUser();
    window.location.reload();
  };

  const handleOpenTables = () => {
    handleClose();
    toggleTableListModal();
  };

  const handleOpenSheets = () => {
    handleClose();
    setSheetManagerOpen(true);
  };

  // Verifica convites pendentes
  useEffect(() => {
    const checkInvites = async () => {
      if (user?.email) {
        try {
          const tables = await APIService.getTables(user.email, user.uid);
          const count = tables.filter((t) =>
            t.invites?.some(
              (invite) => invite.toLowerCase() === user.email.toLowerCase(),
            ),
          ).length;
          setPendingInvites(count);
        } catch (e) {
          console.error("Erro ao verificar convites:", e);
        }
      }
    };
    checkInvites();
  }, [user, tablesUpdated]);

  // Tenta alterar levemente a URL (tamanho) para evitar cache de erro 429 do Google
  const photoURL = user?.photoURL;
  const safePhotoURL = photoURL?.includes("googleusercontent.com")
    ? photoURL.replace("=s96-c", "=s100-c")
    : photoURL;

  useEffect(() => setImgError(false), [safePhotoURL]);

  if (!user) return null;

  // Lógica de Avatar com Fallback
  const displayName = user.displayName || "Caçador";

  const avatarSrc =
    safePhotoURL && !imgError
      ? safePhotoURL
      : `https://ui-avatars.com/api/?name=${encodeURIComponent(
          displayName,
        )}&background=random`;

  return (
    <div>
      <IconButton
        size="small"
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleMenu}
        color="inherit"
        sx={{p: 0}}
      >
        <Badge
          badgeContent={pendingInvites}
          color="error"
          overlap="circular"
          anchorOrigin={{vertical: "bottom", horizontal: "right"}}
        >
          <Avatar
            src={avatarSrc}
            alt={displayName}
            imgProps={{
              onError: () => setImgError(true),
              referrerPolicy: "no-referrer",
            }}
            sx={{width: 32, height: 32, border: "1px solid white"}}
          />
        </Badge>
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem disabled>
          <Typography variant="body2" color="text.secondary">
            {displayName}
          </Typography>
        </MenuItem>
        <MenuItem onClick={handleOpenSheets}>
          <SheetIcon fontSize="small" sx={{mr: 1}} />
          Minhas Fichas
        </MenuItem>
        <MenuItem onClick={handleOpenTables}>
          <Badge
            badgeContent={pendingInvites}
            color="error"
            variant="dot"
            invisible={pendingInvites === 0}
            sx={{mr: 1}}
          >
            <TableRestaurant fontSize="small" />
          </Badge>
          Minhas Mesas
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <Logout fontSize="small" sx={{mr: 1}} />
          Sair
        </MenuItem>
      </Menu>

      {/* Modal de Gerenciamento de Fichas */}
      <Dialog
        open={sheetManagerOpen}
        onClose={() => setSheetManagerOpen(false)}
        fullWidth
        maxWidth="sm"
        fullScreen
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Gerenciar Fichas
          <IconButton onClick={() => setSheetManagerOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <SheetManager onClose={() => setSheetManagerOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
