import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { auth } from "../../../config/firebase";
import { COLORS, globalStyles } from "../../styles/theme";

export default function LoginScreen() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Escucha si hay una sesion activa en Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  // Inicia sesion con correo y contraseña
  const handleLogin = async () => {
    setErrorMsg("");

    if (!email.trim() || !password.trim()) {
      setErrorMsg("Por favor, ingresa tu correo y contraseña.");
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      setEmail("");
      setPassword("");
      router.replace("/productos");
    } catch (error: any) {
      if (
        error.code === "auth/invalid-credential" ||
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password"
      ) {
        setErrorMsg("Correo o contraseña incorrectos.");
      } else if (error.code === "auth/invalid-email") {
        setErrorMsg("El formato del correo electrónico no es válido.");
      } else {
        setErrorMsg("No se pudo iniciar sesión. Inténtalo nuevamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Cierra la sesion actual
  const handleLogout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: COLORS.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={globalStyles.screenContainer}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          paddingBottom: 30,
        }}
        keyboardShouldPersistTaps="handled"
      >
        {user ? (
          /* Vista cuando el usuario ya inicio sesion */
          <View style={[globalStyles.card, styles.centerCard]}>
            <FontAwesome name="check-circle" size={48} color={COLORS.success} />
            <Text style={styles.title}>Sesión Activa</Text>
            <Text style={styles.subtitle}>Conectado como:</Text>
            <Text style={styles.userEmail}>{user.email}</Text>

            <TouchableOpacity
              style={[
                globalStyles.buttonPrimary,
                { width: "100%", marginTop: 18 },
              ]}
              onPress={() => router.push("/productos")}
            >
              <FontAwesome name="shopping-bag" size={16} color={COLORS.text} />
              <Text style={globalStyles.buttonText}>Ir al CRUD Productos</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
              disabled={loading}
            >
              <FontAwesome name="sign-out" size={16} color={COLORS.text} />
              <Text style={globalStyles.buttonText}>Cerrar Sesión</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* Formulario de inicio de sesion */
          <View style={globalStyles.card}>
            <View style={styles.iconBadge}>
              <FontAwesome name="lock" size={26} color={COLORS.primary} />
            </View>

            <Text style={styles.title}>Acceso Equipo KSM ®</Text>
            <Text style={styles.subtitle}>
              Ingresa tus credenciales para administrar el catálogo de prendas.
            </Text>

            {/* Aviso de error si fallan las credenciales */}
            {errorMsg ? (
              <View style={styles.errorBox}>
                <FontAwesome
                  name="exclamation-circle"
                  size={16}
                  color={COLORS.danger}
                />
                <Text style={styles.errorText}>{errorMsg}</Text>
              </View>
            ) : null}

            {/* Campo Correo */}
            <Text style={styles.label}>Correo electrónico</Text>
            <View style={styles.inputWrapper}>
              <FontAwesome name="envelope" size={15} color={COLORS.textMuted} />
              <TextInput
                style={styles.input}
                placeholder="admin@ksm.com"
                placeholderTextColor={COLORS.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            {/* Campo Contraseña */}
            <Text style={styles.label}>Contraseña</Text>
            <View style={styles.inputWrapper}>
              <FontAwesome name="key" size={15} color={COLORS.textMuted} />
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor={COLORS.textMuted}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <FontAwesome
                  name={showPassword ? "eye-slash" : "eye"}
                  size={17}
                  color={COLORS.textMuted}
                />
              </TouchableOpacity>
            </View>

            {/* Boton Entrar */}
            <TouchableOpacity
              style={[globalStyles.buttonPrimary, { marginTop: 10 }]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={COLORS.text} />
              ) : (
                <>
                  <FontAwesome name="sign-in" size={17} color={COLORS.text} />
                  <Text style={globalStyles.buttonText}>Iniciar Sesión</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Estilos propios de la pantalla Login
const styles = StyleSheet.create({
  centerCard: {
    alignItems: "center",
    paddingVertical: 28,
  },
  iconBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  title: {
    color: COLORS.text,
    fontSize: 21,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 6,
  },
  subtitle: {
    color: COLORS.textMuted,
    fontSize: 13,
    textAlign: "center",
    marginTop: 4,
    marginBottom: 18,
    lineHeight: 19,
  },
  userEmail: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: "bold",
    marginTop: 2,
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#2A1519",
    borderWidth: 1,
    borderColor: COLORS.danger,
    borderRadius: 8,
    padding: 10,
    marginBottom: 14,
  },
  errorText: {
    color: "#FCA5A5",
    fontSize: 13,
    flex: 1,
  },
  label: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 14,
  },
  input: {
    flex: 1,
    color: COLORS.text,
    fontSize: 15,
    paddingVertical: 12,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: COLORS.danger,
    paddingVertical: 13,
    borderRadius: 10,
    width: "100%",
    marginTop: 10,
  },
});
