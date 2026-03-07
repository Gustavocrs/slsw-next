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
} from "@mui/material";
import {Logout, TableRestaurant} from "@mui/icons-material";
import APIService from "@/lib/api";

export default function UserMenu() {
  // CORREÇÃO: Usando os nomes corretos retornados pelo hook useAuth
  const {user, logoutUser} = useAuth();
  const {toggleTableListModal, tablesUpdated, setSelectedTable} = useUIStore();
  const [imgError, setImgError] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [pendingInvites, setPendingInvites] = useState(0);

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

  // Verifica convites pendentes
  useEffect(() => {
    const checkInvites = async () => {
      if (user?.email) {
        try {
          const tables = await APIService.getTables(user.email, user.uid);
          const count = tables.filter((t) =>
            t.invites?.includes(user.email),
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
    </div>
  );
}
