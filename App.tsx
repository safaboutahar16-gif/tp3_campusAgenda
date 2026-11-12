import React from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';

type Categorie = 'Atelier' | 'Conférence' | 'Rencontre';
type Evenement = {
  id: string;
  titre: string;
  categorie: Categorie;
  capacite: number;
  inscrits: number;
};
const evenements: Evenement[] = [
  { id: 'E01', titre: 'Atelier React', categorie: 'Atelier', capacite: 25, inscrits: 25 },
  { id: 'E02', titre: 'Conférence IA', categorie: 'Conférence', capacite: 70, inscrits: 52 },
  { id: 'E03', titre: 'Sécurité mobile', categorie: 'Atelier', capacite: 20, inscrits: 17 },
  { id: 'E04', titre: 'Design UI', categorie: 'Atelier', capacite: 18, inscrits: 9 },
  { id: 'E05', titre: 'Forum projets', categorie: 'Rencontre', capacite: 50, inscrits: 49 },
  { id: 'E06', titre: 'Découverte Git', categorie: 'Atelier', capacite: 24, inscrits: 24 },
];

const mode: Mode = 'ateliers' as Mode;

function placesRestantes(e: Evenement): number {
  return Math.max(0, e.capacite - e.inscrits);
}

function statutEvenement(e: Evenement): Statut {
  const r = placesRestantes(e);
  if (r === 0) return 'Complet';
  if (r <= 3) return 'Presque complet';
  return 'Ouvert';
}
const total = evenements.length;
const complets = evenements.filter((e) => placesRestantes(e) === 0).length;
const avecPlaces = evenements.filter((e) => placesRestantes(e) > 0).length;
const totalPlaces = evenements.reduce((somme, e) => somme + placesRestantes(e), 0);

const ateliersDisponibles = evenements.filter(
  (e) => e.categorie === 'Atelier' && placesRestantes(e) > 0
);

const donneesAffichees = mode === 'tous' ? evenements : ateliersDisponibles;
const titreMode =
  mode === 'tous' ? 'Tous les événements' : 'Ateliers disponibles';

  const COULEURS_STATUT: Record<Statut, { fond: string; texte: string }> = {
  Complet: { fond: '#FDE2E2', texte: '#B42318' },
  'Presque complet': { fond: '#FFEBD0', texte: '#B54708' },
  Ouvert: { fond: '#DCF5E3', texte: '#157F3D' },
};
type BadgeEtatProps = { statut: Statut };
function BadgeEtat({ statut }: BadgeEtatProps) {
  const c = COULEURS_STATUT[statut];
  return (
    <View style={[styles.badge, { backgroundColor: c.fond }]}>
    <Text style={[styles.badgeTexte, { color: c.texte }]}>{statut}</Text>
    </View>
  );
}

type CarteEvenementProps = { evenement: Evenement };

function CarteEvenement({ evenement }: CarteEvenementProps) {
  const r = placesRestantes(evenement);
  return (
    <View style={styles.carte}>
      <View style={styles.carteInfos}>
      <Text style={styles.carteTitre}>{evenement.titre}</Text>
      <Text style={styles.carteCategorie}>{evenement.categorie}</Text>
      <Text style={styles.cartePlaces}>
          {r === 0 ? 'Aucune place' : r === 1 ? '1 place restante' : `${r} places restantes`}
      </Text>
      </View>
      <BadgeEtat statut={statutEvenement(evenement)} />
    </View>
  );
}

type BlocStatistiqueProps = { libelle: string; valeur: number };

function BlocStatistique({ libelle, valeur }: BlocStatistiqueProps) {
  return (
    <View style={styles.bloc}>
      <Text style={styles.blocValeur}>{valeur}</Text>
      <Text style={styles.blocLibelle}>{libelle}</Text>
    </View>
  );
}
export default function App() {
  return (
    <View style={styles.ecran}>
    
      <FlatList
        data={donneesAffichees}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CarteEvenement evenement={item} />}
        contentContainerStyle={styles.liste}
        ListHeaderComponent={
          <View>
            <View style={styles.entete}>
              <Text style={styles.enteteTitre}>CampusAgenda</Text>
              <Text style={styles.enteteSousTitre}>Événements du campus</Text>
            </View>

            <View style={styles.rangeeStats}>
              <BlocStatistique libelle="Événements" valeur={total} />
              <BlocStatistique libelle="Complets" valeur={complets} />
              <BlocStatistique libelle="Avec places" valeur={avecPlaces} />
              <BlocStatistique libelle="Places restantes" valeur={totalPlaces} />
            </View>

            <Text style={styles.titreMode}>{titreMode}</Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.vide}>
            <Text style={styles.videTexte}>
              Aucun événement à afficher pour le moment.
            </Text>
          </View>
        }
      />
    </View>
  );
}
const styles = StyleSheet.create({
  ecran: { flex: 1, backgroundColor: '#F2F6FD' },
  liste: { padding: 16, paddingBottom: 32 },
  entete: {
    backgroundColor: '#003399',
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 14,
  },
  enteteTitre: { color: '#FFFFFF', fontSize: 24, fontWeight: '700' },
  enteteSousTitre: { color: '#C9D8FF', fontSize: 14, marginTop: 2 },
  rangeeStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  bloc: {
    flexGrow: 1,
    flexBasis: '45%',
    minWidth: 130,
    backgroundColor: '#E6EEFC',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    margin: 4,
  },
  blocValeur: { fontSize: 24, fontWeight: '700', color: '#0B2A66' },
  blocLibelle: { fontSize: 13, color: '#2B4A8C', marginTop: 2 },
  titreMode: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0B2A66',
    marginTop: 12,
    marginBottom: 10,
  },
  carte: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D3DDF0',
    padding: 14,
    marginBottom: 10,
  },
  carteInfos: { flex: 1, marginRight: 10 },
  carteTitre: { fontSize: 16, fontWeight: '700', color: '#0B2A66' },
  carteCategorie: { fontSize: 13, color: '#5B6475', marginTop: 2 },
  cartePlaces: { fontSize: 14, color: '#2B4A8C', marginTop: 4 },
  badge: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    flexShrink: 0,
  },
  badgeTexte: { fontSize: 12, fontWeight: '700' },
  vide: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D3DDF0',
  },
  videTexte: { fontSize: 15, color: '#5B6475', textAlign: 'center' },
});
