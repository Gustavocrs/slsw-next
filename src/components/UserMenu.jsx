/**
 * UserMenu Component
 * Exibe avatar do usuário e menu de logout
 */

"use client";

import {useState, useEffect} from "react";
// CORREÇÃO: Importando do lugar certo (hooks)
import {useAuth} from "@/hooks";
import {useUIStore} from "@/stores/characterStore";
import {IconButton, Menu, MenuItem, Avatar, Typography} from "@mui/material";
import {Logout, TableRestaurant} from "@mui/icons-material";

export default function UserMenu() {
  // CORREÇÃO: Usando os nomes corretos retornados pelo hook useAuth
  const {user, logoutUser} = useAuth();
  const {toggleTableListModal} = useUIStore();
  const [imgError, setImgError] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleClose();
    await logoutUser();
    window.location.reload();
  };

  const handleOpenTables = () => {
    handleClose();
    toggleTableListModal();
  };

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
        <Avatar
          src={avatarSrc}
          alt={displayName}
          imgProps={{
            onError: () => setImgError(true),
            referrerPolicy: "no-referrer",
          }}
          sx={{width: 32, height: 32, border: "1px solid white"}}
        />
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
          <TableRestaurant fontSize="small" sx={{mr: 1}} />
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
