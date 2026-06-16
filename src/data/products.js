// ============================================
// CATALOGUE LPG 2026 - 34 PRODUITS
// Categories: Corps, Visage, Compléments, Textile
// ============================================

export const categories = {
  corps: 'Corps',
  visage: 'Visage',
  complements: 'Compléments alimentaires',
  textile: 'Textile',
};

// Helper function to convert euros to cents
const eurosToCents = (euros) => Math.round(euros * 100);

export const products = [
  // ============================================
  // PRODUITS CORPS (6 produits)
  // ============================================
  {
    id: 'lpg-creme-micro-peeling',
    brand: 'LPG',
    category: categories.corps,
    name: 'Crème micro-peeling',
    description: "Crème fluide légère enrichie en AHAs pour une exfoliation douce, hydratation et renouvellement cellulaire. Grain de peau ultra-lisse, pénétration rapide.",
    priceCents: eurosToCents(57.00),
    currency: 'EUR',
    images: ['/produits/CRÈME MICRO-PEELING RESURFACING CREAM.webp'],
    tags: ['corps', 'exfoliation', 'AHAs', 'renouvellement cellulaire'],
  },
  {
    id: 'lpg-creme-anti-cellulite',
    brand: 'LPG',
    category: categories.corps,
    name: 'Crème anti-cellulite',
    description: "Gel-crème traitant tous les types de cellulite (adipeuse, aqueuse). Réduit les adipocytes, lutte contre la rétention d'eau. Silhouette plus lisse et tonique.",
    priceCents: eurosToCents(57.00),
    currency: 'EUR',
    images: ['/produits/gel crème anti cellulite.webp'],
    tags: ['corps', 'minceur', 'anti-cellulite', 'drainage'],
  },
  {
    id: 'lpg-creme-fermete-galbante',
    brand: 'LPG',
    category: categories.corps,
    name: 'Crème fermeté galbante',
    description: "Formule restructurante, liftante et hydratante pour une mise sous tension cutanée profonde. Lutte contre le relâchement et maintient la jeunesse du corps.",
    priceCents: eurosToCents(57.00),
    currency: 'EUR',
    images: ['/produits/CRÈME FERMETÉ GALBANTE FIRMING SHAPING CREAM.webp'],
    tags: ['corps', 'fermeté', 'lift', 'raffermissement'],
  },
  {
    id: 'lpg-creme-lipo-reductrice',
    brand: 'LPG',
    category: categories.corps,
    name: 'Crème lipo-réductrice',
    description: "Recommandée pour les rondeurs rebelles (hanches, ventre, bras). Texture soyeuse facilitant le massage. Silhouette galbée et redessinée.",
    priceCents: eurosToCents(57.00),
    currency: 'EUR',
    images: ['/produits/CRÈME LIPO-RÉDUCTRICE BODY SHAPING CREAM.webp'],
    tags: ['corps', 'minceur', 'massage', 'silhouette'],
  },
  {
    id: 'lpg-serum-intensif-anti-cellulite',
    brand: 'LPG',
    category: categories.corps,
    name: 'Sérum intensif anti-cellulite',
    description: "Sérum concentré haute efficacité, agit en synergie avec le gel-crème. Améliore l'élasticité, combat les cellules graisseuses et la rétention d'eau.",
    priceCents: eurosToCents(69.00),
    currency: 'EUR',
    images: ['/produits/SÉRUM INTENSIF ANTI-CELLULITE ANTI-CELLULITE INTENSIVE SERUM.webp'],
    tags: ['corps', 'minceur', 'sérum', 'cure'],
  },
  {
    id: 'lpg-huile-experte-vergetures',
    brand: 'LPG',
    category: categories.corps,
    name: "Huile experte vergetures",
    description: "100 % d'origine naturelle, riche en oméga 3-6-9. Triple action : prévention, correction et assouplissement. Idéale pendant la grossesse dès le 1er mois.",
    priceCents: eurosToCents(59.00),
    currency: 'EUR',
    images: ['/produits/HUILE EXPERTE VERGETURES EXPERT STRETCH MARK OIL.webp'],
    tags: ['corps', 'naturel', 'vergetures', 'grossesse'],
  },

  // ============================================
  // PRODUITS VISAGE (16 produits)
  // ============================================
  {
    id: 'lpg-eau-micellaire',
    brand: 'LPG',
    category: categories.visage,
    name: 'Eau micellaire',
    description: "Démaquillant doux tout-en-un pour le visage, le cou et les yeux. Enrichie en glycérine et sucres naturels, hydrate et apaise en un seul geste.",
    priceCents: eurosToCents(27.00),
    currency: 'EUR',
    images: ['/produits/EAU MICELLAIRE PREPARATRICE.webp'],
    tags: ['visage', 'démaquillant', 'nettoyage', 'tous types de peau'],
  },
  {
    id: 'lpg-baume-expert-demaquillant',
    brand: 'LPG',
    category: categories.visage,
    name: 'Baume expert démaquillant',
    description: "Triple texture (baume → huile → émulsion laiteuse) qui dissout le maquillage tenace et waterproof, active la microcirculation et préserve l'hydratation.",
    priceCents: eurosToCents(32.00),
    currency: 'EUR',
    images: ['/produits/BAUME EXPERT DÉMAQUILLANT EXPERT CLEANSING BALM.webp'],
    tags: ['visage', 'démaquillant', 'maquillage waterproof'],
  },
  {
    id: 'lpg-poudre-soyeuse-microexfoliante',
    brand: 'LPG',
    category: categories.visage,
    name: 'Poudre soyeuse microexfoliante',
    description: "Gommage enzymatique/chimique aux AHAs, acide succinique, papaye et ananas. Se transforme en mousse au contact de l'eau. Teint unifié et lumineux.",
    priceCents: eurosToCents(37.00),
    currency: 'EUR',
    images: ['/produits/POUDRE SOYEUSE MICRO-EXFOLIANTE.webp'],
    tags: ['visage', 'exfoliation', 'enzymatique', 'éclat'],
  },
  {
    id: 'lpg-creme-exfoliante',
    brand: 'LPG',
    category: categories.visage,
    name: 'Crème exfoliante',
    description: "Exfoliation douce pour éliminer les cellules mortes. Peau nette, apaisée, lumineuse et éclatante de santé.",
    priceCents: eurosToCents(35.00),
    currency: 'EUR',
    images: ['/produits/CRÈME EXFOLIANTE.webp'],
    tags: ['visage', 'exfoliation', 'douce', 'éclat'],
  },
  {
    id: 'lpg-essence-active-rehydratante',
    brand: 'LPG',
    category: categories.visage,
    name: 'Essence active réhydratante',
    description: "Pré-soin après nettoyage. Prépare la peau, élimine les peaux mortes, unifie le teint. Texture lactée ultra-légère à absorption rapide.",
    priceCents: eurosToCents(46.00),
    currency: 'EUR',
    images: ['/produits/ESSENCE ACTIVE RÉHYDRATANTE.webp'],
    tags: ['visage', 'hydratation', 'pré-soin', 'teint'],
  },
  {
    id: 'lpg-gel-creme-dynamisante',
    brand: 'LPG',
    category: categories.visage,
    name: 'Gel-crème dynamisante réhydratante',
    description: "Scelle l'hydratation, renforce la barrière cutanée. Texture rosée nacrée. Atténue tiraillements et rougeurs. Peau repulpée et lumineuse.",
    priceCents: eurosToCents(65.00),
    currency: 'EUR',
    images: ['/produits/GEL-CREME DYNAMISANT REHYDRATANT.webp'],
    tags: ['visage', 'hydratation', 'barrière cutanée', 'repulpant'],
  },
  {
    id: 'lpg-creme-riche-dynamisante',
    brand: 'LPG',
    category: categories.visage,
    name: 'Crème riche dynamisante réhydratante',
    description: "Concentrée en beurres, cire et squalane naturels. Renforce la barrière cutanée, régénère les lipides, hydratation longue durée. Pour peaux sèches.",
    priceCents: eurosToCents(65.00),
    currency: 'EUR',
    images: ['/produits/CREME RICHE DYNAMISANTE RÉHYDRATANTE.webp'],
    tags: ['visage', 'hydratation', 'riche', 'peaux sensibles'],
  },
  {
    id: 'lpg-baume-yeux',
    brand: 'LPG',
    category: categories.visage,
    name: 'Baume yeux',
    description: "Texture légèrement nacrée, effet embellisseur et anti-fatigue. Diminue les signes de fatigue pour un regard reposé et en pleine santé. Sans parfum.",
    priceCents: eurosToCents(48.00),
    currency: 'EUR',
    images: ['/produits/BAUME YEUX EYE BALM.webp'],
    tags: ['visage', 'contour des yeux', 'anti-fatigue', 'sans parfum'],
  },
  {
    id: 'lpg-serum-huile-en-eau',
    brand: 'LPG',
    category: categories.visage,
    name: 'Sérum huile-en-eau réhydratant',
    description: "Triple texture (huile + lotion + sérum). Stimule la production naturelle d'acide hyaluronique, renforce la barrière cutanée. Peau désaltérée et éclatante.",
    priceCents: eurosToCents(70.00),
    currency: 'EUR',
    images: ['/produits/SERUM HUILE-EN-EAU RÉHYDRATANT OIL-IN-WATER REPLENISHING SERUM.webp'],
    tags: ['visage', 'sérum', 'hydratation', 'acide hyaluronique'],
  },
  {
    id: 'lpg-creme-lift-raffermissante',
    brand: 'LPG',
    category: categories.visage,
    name: 'Crème lift raffermissante',
    description: "Formule avancée anti-relâchement. Maillage biomimétique liftant et repulpant. Restaure l'ovale du visage et diffuse ses actifs tout au long de la journée.",
    priceCents: eurosToCents(89.00),
    currency: 'EUR',
    images: ['/produits/CRÈME LIFT RAFFERMISSANTE FIRMING LIFT CREAM.webp'],
    tags: ['visage', 'lift', 'fermeté', 'anti-âge'],
  },
  {
    id: 'lpg-creme-yeux',
    brand: 'LPG',
    category: categories.visage,
    name: 'Crème yeux',
    description: "Triple action : défroisse, estompe les cernes, décongestionne les poches. Effet anti-rides visible, confort immédiat. Sans parfum.",
    priceCents: eurosToCents(62.00),
    currency: 'EUR',
    images: ['/produits/crème yeux.webp'],
    tags: ['visage', 'contour des yeux', 'cernes', 'poches'],
  },
  {
    id: 'lpg-fluide-uv-defense',
    brand: 'LPG',
    category: categories.visage,
    name: 'Fluide UV défense cellulaire',
    description: "SPF 50+ contre UVA/UVB et lumière bleue. Prévient et corrige rides et taches. Formule cliniquement testée contre le photovieillissement.",
    priceCents: eurosToCents(49.00),
    currency: 'EUR',
    images: ['/produits/FLUIDE UV+ DÉFENSE CELLULAIRE.webp'],
    tags: ['visage', 'solaire', 'SPF50', 'anti-âge'],
  },
  {
    id: 'lpg-serum-lift-raffermissant',
    brand: 'LPG',
    category: categories.visage,
    name: 'Sérum lift raffermissant',
    description: "Neutralise la glycation, stimule le collagène. Effet liftant visible, teint éclatant, élasticité et fermeté renforcées. Synergie idéale avec la crème lift.",
    priceCents: eurosToCents(94.00),
    currency: 'EUR',
    images: ['/produits/SÉRUM LIFT RAFFERMISSANT FIRMING LIFT SERUM.webp'],
    tags: ['visage', 'sérum', 'lift', 'collagène'],
  },
  {
    id: 'lpg-serum-lacte-lissant',
    brand: 'LPG',
    category: categories.visage,
    name: 'Sérum lacté lissant repulpant',
    description: "Texture fluide lactée. Stimule, booste et détoxifie les cellules jeunesse. Peau repulpée de l'intérieur, rides réduites.",
    priceCents: eurosToCents(85.00),
    currency: 'EUR',
    images: ['/produits/SÉRUM LACTÉ LISSANT REPULPANT.webp'],
    tags: ['visage', 'sérum', 'repulpant', 'lissant'],
  },
  {
    id: 'lpg-soin-anti-age-regeneration',
    brand: 'LPG',
    category: categories.visage,
    name: 'Soin anti-âge régénération cellulaire',
    description: "Crème nouvelle génération au complexe premium LPG. Correction anti-âge instantanée et durable. Peau incroyablement souple, douce et rebondie. Tous types de peau.",
    priceCents: eurosToCents(110.00),
    currency: 'EUR',
    images: ['/produits/SOIN ANTI-ÂGE RÉGÉNÉRATION CELLULAIRE ANTI-AGING RENEWAL CREAM.webp'],
    tags: ['visage', 'anti-âge', 'régénération', 'premium'],
  },
  {
    id: 'lpg-serum-anti-age-regeneration',
    brand: 'LPG',
    category: categories.visage,
    name: 'Sérum anti-âge régénération cellulaire',
    description: "Cocktail d'actifs haute technicité anti-âge LPG. Lutte de manière ciblée contre le vieillissement cellulaire. Hautement dosé. Tous types de peau.",
    priceCents: eurosToCents(130.00),
    currency: 'EUR',
    images: ['/produits/SÉRUM ANTI-AGE REGENERATION CELLULAIRE.webp'],
    tags: ['visage', 'sérum', 'anti-âge', 'régénération'],
  },

  // ============================================
  // COMPLÉMENTS ALIMENTAIRES (10 produits)
  // ============================================
  {
    id: 'lpg-acide-hyaluronique',
    brand: 'LPG',
    category: categories.complements,
    name: 'Acide hyaluronique',
    description: "Spectre complet de poids moléculaires (50–3 000 kDa). Hydratation cutanée, structure et stimulation du renouvellement cellulaire. Produit par biotechnologie.",
    priceCents: eurosToCents(41.50),
    currency: 'EUR',
    images: ['/produits/ACIDE HYALURONIQUE.webp'],
    tags: ['compléments', 'acide hyaluronique', 'hydratation', 'biotechnologie'],
  },
  {
    id: 'lpg-omega-3-6-9',
    brand: 'LPG',
    category: categories.complements,
    name: 'Oméga 3-6-9',
    description: "Mélange végétal issu de l'huile de Sacha Inchi, concentré à 93 % en oméga bénéfiques. Nourrit la peau, renforce la tonicité et forme les membranes cellulaires.",
    priceCents: eurosToCents(41.50),
    currency: 'EUR',
    images: ['/produits/OMÉGA.webp'],
    tags: ['compléments', 'oméga', 'nutrition', 'sacha inchi'],
  },
  {
    id: 'lpg-booster-vitalite',
    brand: 'LPG',
    category: categories.complements,
    name: 'Booster de vitalité',
    description: "Soutient le métabolisme énergétique, réduit la fatigue, renforce les capacités physiques et mentales et le système immunitaire.",
    priceCents: eurosToCents(41.50),
    currency: 'EUR',
    images: ['/produits/BOOSTER DE VITALITÉ VITALITY BOOSTER.webp'],
    tags: ['compléments', 'vitalité', 'énergie', 'immunité'],
  },
  {
    id: 'lpg-capteur-sos',
    brand: 'LPG',
    category: categories.complements,
    name: "Capteur SOS petits écarts",
    description: "Piège graisses et sucres grâce à deux superaliments neutralisants pour éviter leur stockage. Éliminé naturellement par l'organisme.",
    priceCents: eurosToCents(23.00),
    currency: 'EUR',
    images: ['/produits/CAPTEUR SOS PETITS ÉCARTS.webp'],
    tags: ['compléments', 'minceur', 'capteur', 'superaliments'],
  },
  {
    id: 'lpg-the-bio-minceur',
    brand: 'LPG',
    category: categories.complements,
    name: 'Thé bio minceur',
    description: "Assemblage de plantes bio pour brûler les graisses, perdre du poids et drainer le corps. Idéal en complément des soins endermologie.",
    priceCents: eurosToCents(26.00),
    currency: 'EUR',
    images: ['/produits/THE BIO MINCEUR EXPRESS J14 LPG.webp'],
    tags: ['compléments', 'thé', 'minceur', 'bio', 'drainage'],
  },
  {
    id: 'lpg-concentre-drainant',
    brand: 'LPG',
    category: categories.complements,
    name: 'Concentré drainant',
    description: "Goût cassis. Lutte contre la rétention d'eau et les tissus engorgés. Active les fonctions d'élimination, améliore la circulation, allège les jambes.",
    priceCents: eurosToCents(41.00),
    currency: 'EUR',
    images: ['/produits/CONCENTRE DRAINANT FLUID MOBILISING CONCENTRATE.webp'],
    tags: ['compléments', 'drainant', 'cassis', 'rétention eau'],
  },
  {
    id: 'lpg-stop-peau-orange',
    brand: 'LPG',
    category: categories.complements,
    name: "Stop peau d'orange",
    description: "Poudre goût pêche-melon en dose quotidienne. Lutte contre les capitons, action drainante, brûleur de graisses et soutien du métabolisme lipidique.",
    priceCents: eurosToCents(55.00),
    currency: 'EUR',
    images: ['/produits/STOP PEAU D\'ORANGE.webp'],
    tags: ['compléments', 'minceur', 'peau orange', 'métabolisme'],
  },
  {
    id: 'lpg-collagene',
    brand: 'LPG',
    category: categories.complements,
    name: 'Collagène',
    description: "Poudre chocolat-noisette, sans sucres ni matières grasses. Peptides de collagène de type I et élastine d'origine marine française. Effets anti-âge prouvés cliniquement.",
    priceCents: eurosToCents(46.00),
    currency: 'EUR',
    images: ['/produits/COLLAGÈNE COLLAGEN.webp'],
    tags: ['compléments', 'collagène', 'anti-âge', 'marin'],
  },
  {
    id: 'lpg-reducteur-appetit',
    brand: 'LPG',
    category: categories.complements,
    name: "Réducteur d'appétit",
    description: "Augmente les sensations de satiété, aide à la gestion du poids et à l'équilibre émotionnel. Optimise les résultats minceur en complément d'une cure endermologie.",
    priceCents: eurosToCents(55.00),
    currency: 'EUR',
    images: ['/produits/RÉDUCTEUR D\'APPÉTIT.webp'],
    tags: ['compléments', 'satété', 'minceur', 'endermologie'],
  },
  {
    id: 'lpg-concentre-brule-graisses',
    brand: 'LPG',
    category: categories.complements,
    name: 'Concentré brûle-graisses',
    description: "Enrichi en Coléus forskohlii. Synergie de plantes lipolytiques et d'oligo-éléments. Favorise le déstockage des graisses et le métabolisme normal des acides gras.",
    priceCents: eurosToCents(44.00),
    currency: 'EUR',
    images: ['/produits/CONCENTRÉ BRÛLE-GRAISSES.webp'],
    tags: ['compléments', 'brûleur', 'lipolyse', 'minceur'],
  },

  // ============================================
  // TEXTILE (2 produits)
  // ============================================
  {
    id: 'lpg-corsaire-sculptant',
    brand: 'LPG',
    category: categories.textile,
    name: 'Corsaire sculptant anticellulite',
    description: "Textile micromassant à port nocturne (20 nuits). Diffuse des actifs cosmétiques minceur et anticellulite pour lisser la peau et affiner durablement la silhouette.",
    priceCents: eurosToCents(49.99),
    currency: 'EUR',
    images: ['/produits/CORSAIRE SCULPTANT ANTI-CELLULITE ANTI-CELLULITE SHAPING SHORTS.png'],
    tags: ['textile', 'minceur', 'anticellulite', 'nuit'],
  },
  {
    id: 'lpg-panty-minceur',
    brand: 'LPG',
    category: categories.textile,
    name: 'Panty minceur ventre plat',
    description: "Panty gainant à diffusion d'actifs minceur. Résultats visibles dès 10 jours, silhouette redessinée instantanément en toute discrétion.",
    priceCents: eurosToCents(49.99),
    currency: 'EUR',
    images: ['/produits/PANTY MINCEUR ARTONO VENTRE PLAT SLIMMING FLAT STOMACH PANTY.png'],
    tags: ['textile', 'minceur', 'ventre plat', 'gainant'],
  },
];

// ============================================
// PRODUITS POPULAIRES (sélection actuelle)
// ============================================
export const popularProductIds = [
  'lpg-creme-micro-peeling',
  'lpg-creme-anti-cellulite',
  'lpg-creme-lift-raffermissante',
  'lpg-serum-anti-age-regeneration',
  'lpg-soin-anti-age-regeneration',
  'lpg-acide-hyaluronique',
  'lpg-collagene',
  'lpg-gel-creme-dynamisante',
];

// ============================================
// UTILITAIRES
// ============================================
export function formatPriceEUR(priceCents) {
  const value = priceCents / 100;
  return value.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
}

export function getProductById(id) {
  return products.find((p) => p.id === id) || null;
}

export function getPopularProducts() {
  return popularProductIds.map((id) => getProductById(id)).filter(Boolean);
}

export function getProductsByCategory(category) {
  return products.filter((p) => p.category === category);
}

export function getAllCategories() {
  return Object.values(categories);
}
