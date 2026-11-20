import { FontAwesome } from "@expo/vector-icons";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { Drawer } from "expo-router/drawer";
import { onAuthStateChanged, User } from "firebase/auth";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { auth } from "../../../config/firebase";
import { COLORS } from "../../styles/theme";

// Cabecera y lista personalizada dentro del menu lateral
function CustomDrawerContent(props: any) {
  const { state, descriptors, navigation } = props;

  return (
    <DrawerContentScrollView
      {...props}
      style={{ backgroundColor: COLORS.background }}
    >
      <View style={styles.drawerHeader}>
        <Image
          source={require("../../../assets/images/logo-ksm.png")}
          style={styles.drawerLogo}
          resizeMode="contain"
        />
        <Text style={styles.brandName}>KSM Artesanías ®</Text>
        <Text style={styles.brandSub}>Ropa Artesanal & Catálogo</Text>
      </View>

      {/* Opciones del menu lateral  */}
      <View style={styles.menuList}>
        {state.routes.map((route: any, index: number) => {
          const isFocused = state.index === index;
          const { options } = descriptors[route.key];
          const label = options.title ?? route.name;
          const color = isFocused ? COLORS.text : COLORS.textMuted;

          return (
            <TouchableOpacity
              key={route.key}
              onPress={() => navigation.navigate(route.name)}
              style={[styles.menuItem, isFocused && styles.menuItemActive]}
            >
              {options.drawerIcon && options.drawerIcon({ color, size: 20 })}
              <Text style={[styles.menuLabel, { color }]}>{label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </DrawerContentScrollView>
  );
}

export default function DrawerLayout() {
  const [user, setUser] = useState<User | null>(null);

  // Detecta si hay un usuario logueado en Firebase para cambiar la opcion del menu
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerStyle: { backgroundColor: COLORS.card },
          headerTintColor: COLORS.text,
          drawerStyle: { backgroundColor: COLORS.background, width: 270 },
        }}
      >
        {/* 1. Seccion Inicio */}
        <Drawer.Screen
          name="inicio"
          options={{
            title: "Inicio",
            drawerIcon: ({ color, size }) => (
              <FontAwesome name="home" size={size} color={color as string} />
            ),
          }}
        />

        {/* 2. Seccion Nosotros */}
        <Drawer.Screen
          name="nosotros"
          options={{
            title: "Nosotros",
            drawerIcon: ({ color, size }) => (
              <FontAwesome name="users" size={size} color={color as string} />
            ),
          }}
        />

        {/* 3. Seccion Contactos */}
        <Drawer.Screen
          name="contactos"
          options={{
            title: "Contactos",
            drawerIcon: ({ color, size }) => (
              <FontAwesome name="phone" size={size} color={color as string} />
            ),
          }}
        />

        {/* 4. Seccion Login / Cuenta */}
        <Drawer.Screen
          name="login"
          options={{
            title: user ? "Mi Cuenta / Salir" : "Login Equipo",
            drawerIcon: ({ color, size }) => (
              <FontAwesome
                name={user ? "sign-out" : "sign-in"}
                size={size}
                color={color as string}
              />
            ),
          }}
        />

        {/* 5. Seccion CRUD Productos */}
        <Drawer.Screen
          name="productos"
          options={{
            title: "CRUD Productos",
            drawerIcon: ({ color, size }) => (
              <FontAwesome
                name="shopping-bag"
                size={size}
                color={color as string}
              />
            ),
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}

// Estilos propios del menu lateral
const styles = StyleSheet.create({
  drawerHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    marginBottom: 12,
    alignItems: "center",
  },
  drawerLogo: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  brandName: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "bold",
  },
  brandSub: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  menuList: {
    paddingHorizontal: 12,
    gap: 6,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  menuItemActive: {
    backgroundColor: COLORS.primary,
  },
  menuLabel: {
    fontSize: 15,
    fontWeight: "600",
  },
});
