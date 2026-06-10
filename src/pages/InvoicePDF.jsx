import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer"

const ENTREPRISE = {
  nom: "Mon Entreprise",
  adresse: "1 rue de la République, 75001 Paris",
  email: "contact@monentreprise.fr",
  siret: "000 000 000 00000"
}

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 12, fontFamily: "Helvetica" },
  header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 30 },
  company: { fontSize: 14, fontWeight: "bold" },
  title: { fontSize: 24, color: "#2196f3", fontWeight: "bold" },
  section: { marginBottom: 15 },
  sectionTitle: { fontSize: 13, fontWeight: "bold", marginBottom: 5 },
  row: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 4, borderBottom: "1px solid #eee" },
  total: { fontSize: 14, fontWeight: "bold", textAlign: "right", marginTop: 10 },
  status: { marginTop: 20, fontSize: 11, color: "#666" }
})

export default function InvoicePDF({ facture }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>

        <View style={styles.header}>
          <View>
            <Text style={styles.company}>{ENTREPRISE.nom}</Text>
            <Text>{ENTREPRISE.adresse}</Text>
            <Text>{ENTREPRISE.email}</Text>
            <Text>SIRET : {ENTREPRISE.siret}</Text>
          </View>
          <View>
            <Text style={styles.title}>FACTURE</Text>
            <Text>N° {facture.numero}</Text>
            <Text>Date : {facture.date}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Client</Text>
          <Text>{facture.nom}</Text>
          <Text>{facture.email}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Produits</Text>
          {facture.items?.map((item, i) => (
            <View key={i} style={styles.row}>
              <Text>{item.ref} – {item.name}</Text>
              <Text>{item.quantity} x {item.price}€ = {item.subtotal}€</Text>
            </View>
          ))}
        </View>

        <Text style={styles.total}>Total : {facture.total}€</Text>
        <Text style={styles.status}>Statut : {facture.status}</Text>

      </Page>
    </Document>
  )
}