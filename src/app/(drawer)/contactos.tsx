import { FontAwesome } from "@expo/vector-icons";
import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { COLORS, globalStyles } from "../../styles/theme";

export default function ContactosScreen() {
  // Funciones para abrir enlaces externos desde el celular o navegador
  const abrirWhatsApp = () => {
    const mensaje = encodeURIComponent(
      "Hola KSM Artesanías, vi una prenda en su catálogo y me gustaría consultar disponibilidad.",
    );
    Linking.openURL(`https://wa.me/51987654321?text=${mensaje}`);
  };

  const abrirMapa = () => {
    const consulta = encodeURIComponent(
      "Av. Próceres de la Independencia 1845, San Juan de Lurigancho, Lima",
    );
    Linking.openURL(
      `https://www.google.com/maps/search/?api=1&query=${consulta}`,
    );
  };

  const llamarTienda = () => {
    Linking.openURL("tel:+51987654321");
  };

  const enviarCorreo = () => {
    Linking.openURL("mailto:ksm.artesanias@gmail.com");
  };

  return (
    <ScrollView
      style={globalStyles.screenContainer}
      contentContainerStyle={{ paddingBottom: 30 }}
      showsVerticalScrollIndicator={false}
    >
      <Text style={globalStyles.sectionTitle}>Contáctanos</Text>
      <Text style={globalStyles.sectionSubtitle}>
        Visítanos en nuestra tienda física o escríbenos con la captura de la
        prenda que deseas adquirir.
      </Text>

      {/* Tarjeta 1: Ubicacion fisica y horario */}
      <View style={globalStyles.card}>
        <View style={styles.cardHeader}>
          <FontAwesome name="map-marker" size={20} color={COLORS.primary} />
          <Text style={styles.cardHeading}>Tienda Física - SJL</Text>
        </View>

        <Text style={styles.infoMain}>
          Av. Próceres de la Independencia 1845, San Juan de Lurigancho - Lima
        </Text>
        <Text style={globalStyles.cardText}>
          Referencia: A dos cuadras de la estación Los Postes del Tren.
        </Text>

        <View style={styles.scheduleRow}>
          <FontAwesome name="clock-o" size={15} color={COLORS.textMuted} />
          <Text style={styles.scheduleText}>
            Lunes a Sábado: 10:00 a.m. - 8:00 p.m.
          </Text>
        </View>

        <TouchableOpacity
          style={globalStyles.buttonPrimary}
          onPress={abrirMapa}
        >
          <FontAwesome name="map-marker" size={16} color={COLORS.text} />
          <Text style={globalStyles.buttonText}>Ver ubicación en Maps</Text>
        </TouchableOpacity>
      </View>

      {/* Tarjeta 2: Canales de atencion directa */}
      <View style={globalStyles.card}>
        <Text style={[styles.cardHeading, { marginBottom: 12 }]}>
          Atención Directa
        </Text>

        {/* Boton WhatsApp */}
        <TouchableOpacity
          style={[styles.contactButton, { backgroundColor: COLORS.success }]}
          onPress={abrirWhatsApp}
        >
          <FontAwesome name="whatsapp" size={20} color={COLORS.text} />
          <View style={styles.contactTextBox}>
            <Text style={styles.contactTitle}>WhatsApp Pedidos</Text>
            <Text style={styles.contactSub}>+51 987 654 321</Text>
          </View>
        </TouchableOpacity>

        {/* Boton Llamada */}
        <TouchableOpacity style={styles.contactButton} onPress={llamarTienda}>
          <FontAwesome name="phone" size={19} color={COLORS.primary} />
          <View style={styles.contactTextBox}>
            <Text style={styles.contactTitle}>Llamada Telefónica</Text>
            <Text style={styles.contactSub}>
              (01) 458-9210 / +51 987 654 321
            </Text>
          </View>
        </TouchableOpacity>

        {/* Boton Correo */}
        <TouchableOpacity
          style={[styles.contactButton, { marginBottom: 0 }]}
          onPress={enviarCorreo}
        >
          <FontAwesome name="envelope" size={18} color={COLORS.primary} />
          <View style={styles.contactTextBox}>
            <Text style={styles.contactTitle}>Correo Electrónico</Text>
            <Text style={styles.contactSub}>ksm.artesanias@gmail.com</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Tarjeta 3: Redes sociales */}
      <View style={globalStyles.card}>
        <Text style={[styles.cardHeading, { marginBottom: 10 }]}>
          Redes Sociales
        </Text>
        <View style={styles.socialRow}>
          <FontAwesome name="instagram" size={18} color={COLORS.primary} />
          <Text style={globalStyles.cardText}>@ksm.artesanias.pe</Text>
        </View>
        <View style={[styles.socialRow, { marginBottom: 0 }]}>
          <FontAwesome
            name="facebook-square"
            size={18}
            color={COLORS.primary}
          />
          <Text style={globalStyles.cardText}>KSM Artesanías Perú</Text>
        </View>
      </View>
    </ScrollView>
  );
}

// Estilos propios de la pantalla Contactos
const styles = StyleSheet.create({
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },
  cardHeading: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: "bold",
  },
  infoMain: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 4,
    lineHeight: 21,
  },
  scheduleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 10,
    marginBottom: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  scheduleText: {
    color: COLORS.textMuted,
    fontSize: 13,
  },
  contactButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: 13,
    marginBottom: 10,
  },
  contactTextBox: {
    flex: 1,
  },
  contactTitle: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: "bold",
  },
  contactSub: {
    color: "#E5E7EB",
    fontSize: 13,
    marginTop: 2,
  },
  socialRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },
});
