import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      {/* Iconos de bateria y hora en blanco */}
      <StatusBar style="light" />

      {/* Flujo principal: primero carga index (Splash) y luego pasa al menu (drawer) */}
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(drawer)" />
      </Stack>
    </>
  );
}
