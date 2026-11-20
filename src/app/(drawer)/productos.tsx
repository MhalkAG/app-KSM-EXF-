import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { onAuthStateChanged, User } from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ImageSourcePropType,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { auth, db } from "../../../config/firebase";
import { COLORS, globalStyles } from "../../styles/theme";

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
function resolverImagen(
  imagen?: string,
  codigo?: string,
  nombre?: string,
): {
  source: ImageSourcePropType;
  esFotoProducto: boolean;
} {
  const valor = imagen?.trim() || "";
  const codigoNormalizado = codigo?.trim().toUpperCase() || "";
  const nombreNormalizado = nombre?.toLowerCase() || "";

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

export default function ProductosScreen() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Estados de lista y formulario CRUD
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [saving, setSaving] = useState(false);

  const [codigo, setCodigo] = useState("");
  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState("");
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("");
  const [imagen, setImagen] = useState("");

  // Control de edicion y confirmacion de borrado
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{
    type: "ok" | "err";
    text: string;
  } | null>(null);

  // 1. Verifica si el usuario tiene sesion activa
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setCheckingAuth(false);
    });
    return unsubscribe;
  }, []);

  // 2. Lee los productos en tiempo real desde Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "productos"),
      (snapshot) => {
        const lista: Producto[] = snapshot.docs.map((item) => ({
          id: item.id,
          ...(item.data() as Omit<Producto, "id">),
        }));
        setProductos(lista);
        setLoadingList(false);
      },
      () => setLoadingList(false),
    );
    return () => unsubscribe();
  }, []);

  // Limpia los campos del formulario
  const limpiarFormulario = () => {
    setCodigo("");
    setNombre("");
    setCategoria("");
    setPrecio("");
    setStock("");
    setImagen("");
    setEditingId(null);
  };

  // Crear o actualizar prenda en Firebase
  const handleGuardar = async () => {
    setFeedback(null);

    if (
      !codigo.trim() ||
      !nombre.trim() ||
      !categoria.trim() ||
      !precio.trim() ||
      !stock.trim()
    ) {
      setFeedback({
        type: "err",
        text: "Completa todos los campos obligatorios.",
      });
      return;
    }

    const precioNum = parseFloat(precio);
    const stockNum = parseInt(stock, 10);

    if (isNaN(precioNum) || precioNum < 0 || isNaN(stockNum) || stockNum < 0) {
      setFeedback({
        type: "err",
        text: "Ingresa un precio y stock numéricos válidos.",
      });
      return;
    }

    setSaving(true);
    try {
      const datosProducto = {
        codigo: codigo.trim().toUpperCase(),
        nombre: nombre.trim(),
        categoria: categoria.trim(),
        precio: precioNum,
        stock: stockNum,
        imagen: imagen.trim(),
      };

      if (editingId) {
        await updateDoc(doc(db, "productos", editingId), datosProducto);
        setFeedback({ type: "ok", text: "Prenda actualizada correctamente." });
      } else {
        await addDoc(collection(db, "productos"), datosProducto);
        setFeedback({ type: "ok", text: "Prenda agregada al catálogo." });
      }

      limpiarFormulario();
    } catch (error) {
      setFeedback({
        type: "err",
        text: "Error al guardar en Firebase. Verifica tus permisos.",
      });
    } finally {
      setSaving(false);
    }
  };

  // Carga los datos de una prenda en el formulario para editarla
  const handleEditar = (item: Producto) => {
    setFeedback(null);
    setEditingId(item.id);
    setCodigo(item.codigo);
    setNombre(item.nombre);
    setCategoria(item.categoria);
    setPrecio(String(item.precio));
    setStock(String(item.stock));
    setImagen(item.imagen || "");
  };

  // Elimina la prenda de Firestore
  const handleEliminar = async (id: string) => {
    try {
      await deleteDoc(doc(db, "productos", id));
      if (editingId === id) limpiarFormulario();
      setConfirmDeleteId(null);
      setFeedback({ type: "ok", text: "Prenda eliminada del catálogo." });
    } catch (error) {
      setFeedback({ type: "err", text: "No se pudo eliminar la prenda." });
    }
  };

  if (checkingAuth) {
    return (
      <View style={[globalStyles.screenContainer, styles.centerBox]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  // Vista bloqueada si no ha iniciado sesion
  if (!user) {
    return (
      <View style={[globalStyles.screenContainer, styles.centerBox]}>
        <View
          style={[globalStyles.card, { alignItems: "center", width: "100%" }]}
        >
          <FontAwesome name="lock" size={42} color={COLORS.primary} />
          <Text style={styles.lockTitle}>Acceso Restringido</Text>
          <Text style={styles.lockSub}>
            Debes iniciar sesión con tu cuenta del equipo KSM ® para registrar,
            editar o eliminar prendas.
          </Text>
          <TouchableOpacity
            style={[
              globalStyles.buttonPrimary,
              { width: "100%", marginTop: 14 },
            ]}
            onPress={() => router.push("/login")}
          >
            <FontAwesome name="sign-in" size={16} color={COLORS.text} />
            <Text style={globalStyles.buttonText}>Ir a Login Equipo</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const vistaPrevia = resolverImagen(imagen, codigo, nombre);

  return (
    <ScrollView
      style={globalStyles.screenContainer}
      contentContainerStyle={{ paddingBottom: 35 }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={globalStyles.sectionTitle}>Gestión de Productos</Text>
      <Text style={globalStyles.sectionSubtitle}>
        Los cambios que realices aquí se reflejan en vivo en la pantalla Inicio.
      </Text>

      {/* Formulario Crear / Editar */}
      <View style={globalStyles.card}>
        <Text style={styles.formHeading}>
          {editingId ? "Editar Prenda" : "Nueva Prenda Artesanal"}
        </Text>

        {feedback ? (
          <View
            style={[
              styles.feedbackBox,
              feedback.type === "ok" ? styles.feedbackOk : styles.feedbackErr,
            ]}
          >
            <FontAwesome
              name={
                feedback.type === "ok" ? "check-circle" : "exclamation-circle"
              }
              size={15}
              color={feedback.type === "ok" ? COLORS.success : COLORS.danger}
            />
            <Text style={styles.feedbackText}>{feedback.text}</Text>
          </View>
        ) : null}

        <Text style={styles.label}>Código</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej. KSM-001"
          placeholderTextColor={COLORS.textMuted}
          autoCapitalize="characters"
          value={codigo}
          onChangeText={setCodigo}
        />

        <Text style={styles.label}>Nombre de la prenda</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej. Poncho Andino Tejido"
          placeholderTextColor={COLORS.textMuted}
          value={nombre}
          onChangeText={setNombre}
        />

        <Text style={styles.label}>Categoría</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej. Abrigos / Chullos / Polos"
          placeholderTextColor={COLORS.textMuted}
          value={categoria}
          onChangeText={setCategoria}
        />

        <View style={styles.rowInputs}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Precio (S/)</Text>
            <TextInput
              style={styles.input}
              placeholder="0.00"
              placeholderTextColor={COLORS.textMuted}
              keyboardType="decimal-pad"
              value={precio}
              onChangeText={setPrecio}
            />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Stock (und.)</Text>
            <TextInput
              style={styles.input}
              placeholder="0"
              placeholderTextColor={COLORS.textMuted}
              keyboardType="number-pad"
              value={stock}
              onChangeText={setStock}
            />
          </View>
        </View>

        <Text style={styles.label}>Imagen (archivo local o URL opcional)</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej. chompa-alpaca.jpg o https://..."
          placeholderTextColor={COLORS.textMuted}
          autoCapitalize="none"
          value={imagen}
          onChangeText={setImagen}
        />

        {/* Vista previa de imagen antes de guardar */}
        <View style={styles.previewBox}>
          <Image
            source={vistaPrevia.source}
            style={
              vistaPrevia.esFotoProducto
                ? styles.previewPhoto
                : styles.previewFallback
            }
            resizeMode={vistaPrevia.esFotoProducto ? "cover" : "contain"}
          />
          <Text style={styles.previewHint}>
            Vista previa de referencia en catálogo
          </Text>
        </View>

        <TouchableOpacity
          style={globalStyles.buttonPrimary}
          onPress={handleGuardar}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color={COLORS.text} />
          ) : (
            <>
              <FontAwesome
                name={editingId ? "save" : "plus-circle"}
                size={16}
                color={COLORS.text}
              />
              <Text style={globalStyles.buttonText}>
                {editingId ? "Guardar Cambios" : "Registrar Prenda"}
              </Text>
            </>
          )}
        </TouchableOpacity>

        {editingId ? (
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={limpiarFormulario}
          >
            <FontAwesome name="times" size={15} color={COLORS.textMuted} />
            <Text style={styles.cancelText}>Cancelar Edición</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Listado de productos registrados */}
      <Text style={[globalStyles.sectionTitle, { fontSize: 18, marginTop: 6 }]}>
        Inventario Actual ({productos.length})
      </Text>

      {loadingList ? (
        <ActivityIndicator
          size="large"
          color={COLORS.primary}
          style={{ marginTop: 20 }}
        />
      ) : productos.length === 0 ? (
        <View style={globalStyles.card}>
          <Text style={globalStyles.cardText}>
            No hay prendas registradas todavía. Usa el formulario de arriba para
            crear la primera.
          </Text>
        </View>
      ) : (
        productos.map((item) => {
          const fotoItem = resolverImagen(
            item.imagen,
            item.codigo,
            item.nombre,
          );

          return (
            <View key={item.id} style={globalStyles.card}>
              <View style={styles.itemTop}>
                <View style={styles.thumbBox}>
                  <Image
                    source={fotoItem.source}
                    style={
                      fotoItem.esFotoProducto
                        ? styles.thumbPhoto
                        : styles.thumbFallback
                    }
                    resizeMode={fotoItem.esFotoProducto ? "cover" : "contain"}
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={globalStyles.cardTitle}>{item.nombre}</Text>
                  <Text style={styles.itemMeta}>
                    {item.codigo} • {item.categoria}
                  </Text>
                  <Text style={styles.itemPrice}>
                    S/ {Number(item.precio).toFixed(2)}
                  </Text>
                </View>
              </View>

              <View style={styles.itemBottom}>
                <Text style={styles.itemStock}>Stock: {item.stock} und.</Text>

                {confirmDeleteId === item.id ? (
                  <View style={styles.actionGroup}>
                    <TouchableOpacity
                      style={[
                        styles.smallBtn,
                        { backgroundColor: COLORS.danger },
                      ]}
                      onPress={() => handleEliminar(item.id)}
                    >
                      <FontAwesome name="check" size={13} color={COLORS.text} />
                      <Text style={styles.smallBtnText}>Sí, borrar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.smallBtn,
                        { backgroundColor: COLORS.border },
                      ]}
                      onPress={() => setConfirmDeleteId(null)}
                    >
                      <Text style={styles.smallBtnText}>No</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.actionGroup}>
                    <TouchableOpacity
                      style={[
                        styles.smallBtn,
                        { backgroundColor: COLORS.primary },
                      ]}
                      onPress={() => handleEditar(item)}
                    >
                      <FontAwesome
                        name="pencil"
                        size={13}
                        color={COLORS.text}
                      />
                      <Text style={styles.smallBtnText}>Editar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.smallBtn,
                        { backgroundColor: COLORS.danger },
                      ]}
                      onPress={() => setConfirmDeleteId(item.id)}
                    >
                      <FontAwesome name="trash" size={13} color={COLORS.text} />
                      <Text style={styles.smallBtnText}>Eliminar</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          );
        })
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centerBox: {
    justifyContent: "center",
    alignItems: "center",
  },
  lockTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 12,
    marginBottom: 6,
  },
  lockSub: {
    color: COLORS.textMuted,
    fontSize: 13,
    textAlign: "center",
    lineHeight: 19,
  },
  formHeading: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 12,
  },
  feedbackBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  feedbackOk: {
    backgroundColor: "#0F291E",
    borderColor: COLORS.success,
  },
  feedbackErr: {
    backgroundColor: "#2A1519",
    borderColor: COLORS.danger,
  },
  feedbackText: {
    color: COLORS.text,
    fontSize: 13,
    flex: 1,
  },
  label: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 5,
  },
  input: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    color: COLORS.text,
    fontSize: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  rowInputs: {
    flexDirection: "row",
    gap: 10,
  },
  previewBox: {
    width: "100%",
    height: 150,
    backgroundColor: COLORS.background,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },
  previewPhoto: {
    width: "100%",
    height: "100%",
  },
  previewFallback: {
    width: 72,
    height: 72,
    opacity: 0.9,
  },
  previewHint: {
    position: "absolute",
    bottom: 8,
    backgroundColor: "rgba(15, 17, 23, 0.85)",
    color: COLORS.textMuted,
    fontSize: 11,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  cancelButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginTop: 10,
    paddingVertical: 8,
  },
  cancelText: {
    color: COLORS.textMuted,
    fontSize: 13,
    fontWeight: "600",
  },
  itemTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 10,
  },
  thumbBox: {
    width: 74,
    height: 74,
    borderRadius: 8,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  thumbPhoto: {
    width: "100%",
    height: "100%",
  },
  thumbFallback: {
    width: 44,
    height: 44,
  },
  itemMeta: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginTop: 2,
    marginBottom: 4,
  },
  itemPrice: {
    color: COLORS.success,
    fontSize: 15,
    fontWeight: "bold",
  },
  itemBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 10,
  },
  itemStock: {
    color: COLORS.textMuted,
    fontSize: 13,
  },
  actionGroup: {
    flexDirection: "row",
    gap: 8,
  },
  smallBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
  },
  smallBtnText: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: "600",
  },
});
