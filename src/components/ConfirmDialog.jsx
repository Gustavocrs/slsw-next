import React from "react";

/**
 * Um componente de diálogo de confirmação reutilizável.
 *
 * @param {object} props
 * @param {boolean} props.isOpen - Controla se o diálogo está visível.
 * @param {function} props.onClose - Função para fechar o diálogo.
 * @param {function} props.onConfirm - Função a ser executada ao confirmar.
 * @param {string} props.title - O título do diálogo.
 * @param {React.ReactNode} props.children - O conteúdo/mensagem do diálogo.
 */
export function ConfirmDialog({isOpen, onClose, onConfirm, title, children}) {
  if (!isOpen) {
    return null;
  }

  // Impede o scroll da página ao fundo quando o modal está aberto
  React.useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.dialog} onClick={(e) => e.stopPropagation()}>
        <h2 style={styles.title}>{title}</h2>
        <div style={styles.content}>{children}</div>
        <div style={styles.actions}>
          <button
            onClick={onClose}
            style={{...styles.button, ...styles.buttonCancel}}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            style={{...styles.button, ...styles.buttonConfirm}}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}

// Estilos básicos para o componente.
// Para um projeto real, considere usar CSS Modules, TailwindCSS ou outra biblioteca de UI.
const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999, // Aumentado para garantir que fique acima dos modais do Material-UI
  },
  dialog: {
    backgroundColor: "#2d3748", // Um cinza escuro, bom para temas dark
    color: "#e2e8f0",
    padding: "24px",
    borderRadius: "8px",
    boxShadow:
      "0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.2)",
    maxWidth: "450px",
    width: "90%",
    border: "1px solid #4a5568",
  },
  title: {
    marginTop: 0,
    marginBottom: "16px",
    fontSize: "1.25rem",
    fontWeight: "bold",
  },
  content: {marginBottom: "24px", lineHeight: "1.6"},
  actions: {display: "flex", justifyContent: "flex-end", gap: "12px"},
  button: {
    padding: "10px 20px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "background-color 0.2s ease-in-out",
  },
  buttonCancel: {backgroundColor: "#4a5568", color: "#e2e8f0"},
  buttonConfirm: {backgroundColor: "#c53030", color: "white"}, // Vermelho para exclusão
};
