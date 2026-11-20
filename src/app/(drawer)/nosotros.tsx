import { FontAwesome } from "@expo/vector-icons";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { COLORS, globalStyles } from "../../styles/theme";

export default function NosotrosScreen() {
  return (
    <ScrollView
      style={globalStyles.screenContainer}
      contentContainerStyle={{ paddingBottom: 30 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Encabezado con identidad de marca KSM Artesanias */}
      <View style={styles.headerBox}>
        <Image
          source={require("../../../assets/images/logo-ksm.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.brandTitle}>KSM Artesanías ®</Text>
        <Text style={styles.brandSubtitle}>
          Tradición textil peruana desde San Juan de Lurigancho para todo el
          público.
        </Text>
      </View>

      {/* Foto referencial del local en San Juan de Lurigancho */}
      <View style={globalStyles.card}>
        <View style={styles.storeImageContainer}>
          <Image
            source={require("../../../assets/images/taller-tienda.jpg")}
            style={styles.storeImage}
            resizeMode="cover"
          />
        </View>
        <View style={styles.captionRow}>
          <FontAwesome name="map-marker" size={14} color={COLORS.primary} />
          <Text style={styles.captionText}>
            Nuestro espacio de atención y exhibición en San Juan de Lurigancho,
            Lima.
          </Text>
        </View>
      </View>

      {/* Tarjeta de Mision */}
      <View style={globalStyles.card}>
        <View style={styles.cardHeader}>
          <FontAwesome name="compass" size={18} color={COLORS.primary} />
          <Text style={globalStyles.cardTitle}>Nuestra Misión</Text>
        </View>
        <Text style={globalStyles.cardText}>
          Acercar prendas artesanales elaboradas con dedicación y respeto por
          nuestra cultura textil, ofreciendo una vitrina digital clara y una
          atención cercana en nuestra tienda física.
        </Text>
      </View>

      {/* Tarjeta de Vision */}
      <View style={globalStyles.card}>
        <View style={styles.cardHeader}>
          <FontAwesome name="eye" size={18} color={COLORS.primary} />
          <Text style={globalStyles.cardTitle}>Nuestra Visión</Text>
        </View>
        <Text style={globalStyles.cardText}>
          Consolidarnos como un emprendimiento peruano referente en ropa
          artesanal, creciendo paso a paso desde nuestro local en Lima hacia
          nuevos canales digitales sin perder nuestra esencia.
        </Text>
      </View>

      {/* Tarjeta de Compromiso Artesanal */}
      <View style={globalStyles.card}>
        <View style={styles.cardHeader}>
          <FontAwesome name="heart" size={18} color={COLORS.primary} />
          <Text style={globalStyles.cardTitle}>Compromiso Artesanal</Text>
        </View>
        <Text style={globalStyles.cardText}>
          Cada pieza exhibida en nuestro catálogo representa trabajo real,
          identidad local y trato directo con quienes visitan KSM Artesanías ®.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  headerBox: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    marginBottom: 14,
  },
  logo: {
    width: 78,
    height: 78,
    borderRadius: 16,
    marginBottom: 10,
  },
  brandTitle: {
    color: COLORS.text,
    fontSize: 21,
    fontWeight: "bold",
    marginBottom: 4,
  },
  brandSubtitle: {
    color: COLORS.textMuted,
    fontSize: 13,
    textAlign: "center",
    lineHeight: 19,
  },
  storeImageContainer: {
    width: "100%",
    height: 210,
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background,
    marginBottom: 10,
  },
  storeImage: {
    width: "100%",
    height: "100%",
  },
  captionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  captionText: {
    flex: 1,
    color: COLORS.textMuted,
    fontSize: 12,
    lineHeight: 17,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },
});
