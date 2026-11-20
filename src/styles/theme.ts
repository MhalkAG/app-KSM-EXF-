import { StyleSheet } from "react-native";

// colores  de KSM Artesanías
export const COLORS = {
  background: "#0F1115", // Fondo oscuro principal
  card: "#181B20", // Fondo de tarjetas y barras
  border: "#262A33", // Bordes sutiles
  primary: "#2563EB", // Azul acento KSM
  danger: "#DC2626", // Rojo para eliminar
  success: "#16A34A", // Verde para confirmaciones
  text: "#FFFFFF", // Texto principal
  textMuted: "#9CA3AF", // Subtítulos y descripciones
};

// Estilos casi  en todas las pantallas
export const globalStyles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 16,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 6,
  },
  sectionSubtitle: {
    color: COLORS.textMuted,
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  cardTitle: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 4,
  },
  cardText: {
    color: COLORS.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
  input: {
    backgroundColor: COLORS.background,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    marginBottom: 12,
  },
  buttonPrimary: {
    backgroundColor: COLORS.primary,
    paddingVertical: 13,
    paddingHorizontal: 18,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  buttonText: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: "bold",
  },
});
