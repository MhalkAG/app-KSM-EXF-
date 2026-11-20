import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";
import { COLORS } from "../styles/theme";

export default function SplashScreen() {
  const router = useRouter();

  // Temporizador de 5 segundos antes de pasar al menu principal
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/inicio");
    }, 5000);

    // Limpia el temporizador al salir de la pantalla
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      {/* Logo oficial de KSM */}
      <Image
        source={require("../../assets/images/logo-ksm.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Nuestra marca registrada */}
      <Text style={styles.title}>KSM ARTESANÍAS ®</Text>
      <Text style={styles.subtitle}>
        Prendas artesanales con identidad peruana
      </Text>

      {/* Indicador visual de carga */}
      <ActivityIndicator
        size="large"
        color={COLORS.primary}
        style={styles.loader}
      />

      {/* Nuestros derechos reservados en la parte de abajo */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2026 KSM Artesanías ®</Text>
        <Text style={styles.footerSubtext}>Todos los derechos reservados</Text>
      </View>
    </View>
  );
}

// Estilosde pantalla de bienvenida
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 20,
  },
  title: {
    color: COLORS.text,
    fontSize: 25,
    fontWeight: "bold",
    letterSpacing: 1.5,
  },
  subtitle: {
    color: COLORS.textMuted,
    fontSize: 14,
    marginTop: 6,
    marginBottom: 32,
  },
  loader: {
    marginTop: 10,
  },
  footer: {
    position: "absolute",
    bottom: 32,
    alignItems: "center",
  },
  footerText: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: "600",
  },
  footerSubtext: {
    color: "#6B7280",
    fontSize: 11,
    marginTop: 2,
  },
});
