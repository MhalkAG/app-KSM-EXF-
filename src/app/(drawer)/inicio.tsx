import { FontAwesome } from "@expo/vector-icons";
import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { db } from "../../../config/firebase";
import { COLORS, globalStyles } from "../../styles/theme";

// Estructura de datos de cada prenda en Firestore
interface Producto {
  id: string;
  codigo: string;
  nombre: string;
  categoria: string;
  precio: number;
  stock: number;
  imagen?: string;
}

// Catalogo estatico de imagenes locales en assets/images/
const LOCAL_IMAGES: Record<string, ImageSourcePropType> = {
  "poncho-andino.jpg": require("../../../assets/images/poncho-andino.jpg"),
  "chompa-alpaca.jpg": require("../../../assets/images/chompa-alpaca.jpg"),
};

// Resuelve foto por campo guardado, referencia de prenda o logo de respaldo
function resolverImagen(item: Producto): {
  source: ImageSourcePropType;
  esFotoProducto: boolean;
} {
  const valor = item.imagen?.trim() || "";
  const codigoNormalizado = item.codigo?.trim().toUpperCase() || "";
  const nombreNormalizado = item.nombre?.toLowerCase() || "";

  if (valor && LOCAL_IMAGES[valor]) {
    return { source: LOCAL_IMAGES[valor], esFotoProducto: true };
  }

  if (valor.startsWith("http://") || valor.startsWith("https://")) {
    return { source: { uri: valor }, esFotoProducto: true };
  }

  if (codigoNormalizado === "KSM-001" || nombreNormalizado.includes("poncho")) {
    return {
      source: LOCAL_IMAGES["poncho-andino.jpg"],
      esFotoProducto: true,
    };
  }

  if (
    codigoNormalizado === "KSM-002" ||
    nombreNormalizado.includes("alpaca") ||
    nombreNormalizado.includes("chompa")
  ) {
    return {
      source: LOCAL_IMAGES["chompa-alpaca.jpg"],
      esFotoProducto: true,
    };
  }

  return {
    source: require("../../../assets/images/logo-ksm.png"),
    esFotoProducto: false,
  };
}

export default function InicioScreen() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);

  // Escucha en tiempo real la coleccion "productos" de Firebase
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "productos"),
      (snapshot) => {
        const lista: Producto[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Producto, "id">),
        }));
        setProductos(lista);
        setLoading(false);
      },
      (error) => {
        console.error("Error al cargar productos:", error);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  // Diseno de cada tarjeta de prenda con imagen de referencia
  const renderProducto = ({ item }: { item: Producto }) => {
    const { source, esFotoProducto } = resolverImagen(item);

    return (
      <View style={globalStyles.card}>
        {/* Marco de imagen con etiqueta flotante del codigo */}
        <View style={styles.imageContainer}>
          <Image
            source={source}
            style={esFotoProducto ? styles.productImage : styles.fallbackImage}
            resizeMode={esFotoProducto ? "cover" : "contain"}
          />
          <View style={styles.badgeFloating}>
            <Text style={styles.badgeCode}>{item.codigo}</Text>
          </View>
        </View>

        <Text style={[globalStyles.cardTitle, { marginBottom: 6 }]}>
          {item.nombre}
        </Text>

        <View style={styles.categoryRow}>
          <FontAwesome name="tag" size={13} color={COLORS.primary} />
          <Text style={styles.categoryText}>{item.categoria}</Text>
        </View>

        <View style={styles.cardFooter}>
          <Text style={styles.price}>S/ {Number(item.precio).toFixed(2)}</Text>
          <Text style={styles.stock}>
            Stock: <Text style={styles.stockNumber}>{item.stock} und.</Text>
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={globalStyles.screenContainer}>
      {/* Banner de bienvenida centrado */}
      <View style={styles.heroCard}>
        <Text style={styles.heroTitle}>Bienvenido a KSM Artesanías ®</Text>
        <Text style={styles.heroSubtitle}>
          Somos un emprendimiento peruano en pleno crecimiento. Por ahora
          funcionamos como vitrina digital, ¡pero ya contamos con tienda física
          para atenderte!
        </Text>
      </View>

      <Text style={globalStyles.sectionTitle}>Catálogo de Prendas</Text>
      <Text style={globalStyles.sectionSubtitle}>
        ¿Te gustó alguna prenda? Tómale foto o captura y acércate con ella a
        nuestro local para adquirirla directamente.
      </Text>

      {/* Aviso de direccion fisica en San Juan de Lurigancho */}
      <View style={styles.storeNotice}>
        <FontAwesome name="map-marker" size={18} color={COLORS.primary} />
        <Text style={styles.storeNoticeText}>
          Tienda física:{" "}
          <Text style={styles.storeAddress}>
            Av. Próceres de la Independencia 1845, San Juan de Lurigancho - Lima
          </Text>
        </Text>
      </View>

      {/* Indicador de carga o lista de productos */}
      {loading ? (
        <ActivityIndicator
          size="large"
          color={COLORS.primary}
          style={{ marginTop: 30 }}
        />
      ) : productos.length === 0 ? (
        <View style={globalStyles.card}>
          <Text style={globalStyles.cardText}>
            Aún no hay prendas registradas en el catálogo.
          </Text>
        </View>
      ) : (
        <FlatList
          data={productos}
          keyExtractor={(item) => item.id}
          renderItem={renderProducto}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

// Estilos propios de la pantalla Inicio
const styles = StyleSheet.create({
  heroCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 20,
    marginBottom: 18,
    alignItems: "center",
  },
  heroTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 6,
  },
  heroSubtitle: {
    color: "#DBEAFE",
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
  },
  storeNotice: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  storeNoticeText: {
    flex: 1,
    color: COLORS.textMuted,
    fontSize: 13,
    lineHeight: 18,
  },
  storeAddress: {
    color: COLORS.text,
    fontWeight: "600",
  },
  imageContainer: {
    width: "100%",
    height: 220,
    backgroundColor: COLORS.background,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  fallbackImage: {
    width: 90,
    height: 90,
    opacity: 0.9,
  },
  badgeFloating: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(15, 17, 23, 0.85)",
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeCode: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: "bold",
  },
  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
  },
  categoryText: {
    color: COLORS.textMuted,
    fontSize: 13,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 10,
  },
  price: {
    color: COLORS.success,
    fontSize: 17,
    fontWeight: "bold",
  },
  stock: {
    color: COLORS.textMuted,
    fontSize: 13,
  },
  stockNumber: {
    color: COLORS.text,
    fontWeight: "bold",
  },
});
