/**
 * UserMenu Component
 * Exibe avatar do usuário e menu de ações
 */

"use client";

import {useState, useEffect, useRef} from "react";
// CORREÇÃO: Importando do lugar certo (hooks)
import {useAuth} from "@/hooks";
import {useUIStore} from "@/stores/characterStore";
import {
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  ListItemText,
  Typography,
  Badge,
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  Box,
  CircularProgress,
  DialogContent,
  useMediaQuery,
  useTheme,
  ListItemIcon,
} from "@mui/material";
import {
  Logout,
  TableRestaurant,
  Description as SheetIcon,
  Close as CloseIcon,
  Message as MessageIcon,
} from "@mui/icons-material";
import APIService from "@/lib/api";
import SheetManager from "@/components/SheetView/SheetManager";

export default function UserMenu() {
  // CORREÇÃO: Usando os nomes corretos retornados pelo hook useAuth
  const {user, logoutUser} = useAuth();
  const {
    toggleTableListModal,
    tablesUpdated,
    setSelectedTable,
    selectedTable,
    notifyTablesUpdated,
    toggleMessagesDashboard,
    notifications,
    showNotification,
  } = useUIStore();
  const [imgError, setImgError] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [pendingInvites, setPendingInvites] = useState(0);
  const [sheetManagerOpen, setSheetManagerOpen] = useState(false);

  const isGM = selectedTable && selectedTable.gmId === user?.uid;

  const prevInvitesRef = useRef(0);
  const prevUnreadRef = useRef(0);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const unreadCount = notifications?.length || 0;

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
  };

  const handleOpenTables = () => {
    handleClose();
    toggleTableListModal();
  };

  const handleOpenSheets = () => {
    handleClose();
    setSheetManagerOpen(true);
  };

  const handleOpenChat = () => {
    handleClose();
    toggleMessagesDashboard();
  };

  // Permite que outros componentes abram o gerenciador de fichas
  useEffect(() => {
    const handleOpen = () => setSheetManagerOpen(true);
    window.addEventListener("open-sheet-manager", handleOpen);
    return () => {
      window.removeEventListener("open-sheet-manager", handleOpen);
    };
  }, []);

  // Monitora novas notificações e mensagens
  useEffect(() => {
    if (unreadCount > prevUnreadRef.current && prevUnreadRef.current !== 0) {
      // Dispara o alerta indicando a nova notificação.
      // Dica: Se quiser que ele fique fixo até ser clicado, você pode precisar ajustar o UIStore para aceitar uma prop como `duration: null` ou `persistent: true`.
      showNotification(
        "Nova notificação recebida! Clique aqui para ver.",
        "info",
      );
    }
    prevUnreadRef.current = unreadCount;
  }, [unreadCount, showNotification]);

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

          if (count > prevInvitesRef.current && prevInvitesRef.current !== 0) {
            showNotification(
              `Você recebeu um novo convite de mesa! Acesse 'Minhas Mesas' para confirmar presença.`,
              "info",
            );
          }
          prevInvitesRef.current = count;
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
    <Box sx={{display: "flex", alignItems: "center", gap: 1}}>
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
          badgeContent={pendingInvites + unreadCount}
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
          <Typography variant="body2" color="black">
            {displayName}
          </Typography>
        </MenuItem>

        <MenuItem onClick={handleOpenChat}>
          <ListItemIcon>
            <Badge badgeContent={unreadCount} color="error">
              <MessageIcon fontSize="small" />
            </Badge>
          </ListItemIcon>
          <ListItemText>Mensagens</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleOpenSheets}>
          <ListItemIcon>
            <SheetIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Minhas Fichas</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleOpenTables}>
          <ListItemIcon>
            <Badge badgeContent={pendingInvites} color="error">
              <TableRestaurant fontSize="small" />
            </Badge>
          </ListItemIcon>
          <ListItemText>Minhas Mesas</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          <ListItemText>Sair</ListItemText>
        </MenuItem>
      </Menu>

      {/* Modal de Gerenciamento de Fichas */}
      <Dialog
        open={sheetManagerOpen}
        onClose={() => setSheetManagerOpen(false)}
        fullWidth
        maxWidth="sm"
        fullScreen
        sx={{zIndex: 99999}} // Garante que a ficha sobreponha a mesa de jogo
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
    </Box>
  );
}
