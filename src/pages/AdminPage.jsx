import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  Plus,
  Search,
  X,
  LayoutDashboard,
  ShoppingBag,
  ReceiptText,
  FileText,
  User,
  Eye,
  Pencil,
  Trash2,
  Sun,
  Moon,
  LogOut,
  Menu,
  Tag,
  RefreshCw,
  Database,
  Power,
} from 'lucide-react';
import AdminPromotions from '../components/AdminPromotions.jsx';
import AdminOrders from '../components/AdminOrders.jsx';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { products as catalogProducts, formatPriceEUR } from '../data/products.js';
import { auth } from '../firebase/firebase.js';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { isAdminEmail } from '../firebase/adminAllowlist.js';
import { uploadImageToCloudinary } from '../cloudinary.js';
import { generateSlug } from '../utils/slug.js';
import {
  deletePost,
  deleteProduct,
  listenPosts,
  listenProducts,
  listenOrders,
  seedPostsIfEmpty,
  seedProductsIfEmpty,
  seedPostsMerge,
  syncAllProducts,
  upsertPost,
  upsertProduct,
  migratePostsWithSlugs,
} from '../firebase/collections.js';

function readJson(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

function uid(prefix) {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

const LS_PRODUCTS = 'mey_admin_products_v1';
const LS_POSTS = 'mey_admin_posts_v1';
const LS_THEME = 'mey_admin_theme_v1';

function seedAdminProducts() {
  return catalogProducts.map((p) => ({
    id: p.id,
    name: p.name,
    sku: p.id,
    category: p.category || '-',
    priceCents: p.priceCents || 0,
    stock: 50,
    status: 'active',
    image: p.images?.[0] || '',
    description: p.description || '',
  }));
}

function seedAdminPosts() {
  const img = (p) => encodeURI(p);
  return [
    {
      id: 'post-7',
      title: 'Vajacial : Le soin intime tendance pour une peau saine et sans imperfections',
      author: 'Mey Beauty',
      category: 'Soins intimes',
      status: 'published',
      date: '2026-07-01',
      excerpt:
        'Le vajacial, contraction de "vagin" et "facial", est le soin esthétique entièrement dédié à la zone du maillot. Découvrez ses bienfaits et son déroulement.',
      image: img('/soin%20spa%20(1).JPG'),
      contentHtml: `
<h1 class="blog-article-h2">Vajacial : Le soin intime tendance pour une peau saine et sans imperfections</h1>
<p class="blog-article-p">Le bien-être et la beauté ne s'arrêtent plus au soin du visage. Depuis quelques saisons, un nouveau rituel fait fureur dans les instituts de beauté spécialisés : le vajacial. Contraction de "vagin" et "facial", ce soin esthétique entièrement dédié à la zone du maillot s'impose comme le secret incontournable pour prendre soin de son intimité. Mais qu’est-ce que le vajacial exactement ? Quels sont ses réels bienfaits pour la peau et comment se déroule une séance professionnelle ? Découvrez tout ce qu’il faut savoir sur ce soin intime révolutionnaire.</p>
<h2 class="blog-article-h2">Qu'est-ce qu'un Vajacial et à qui s'adresse-t-il ?</h2>
<p class="blog-article-p">Contrairement aux idées reçues, le vajacial n’est pas un soin interne. Il s’agit exclusivement d’un traitement dermo-esthétique topique, prodigué sur le pubis, les grandes lèvres et le haut des cuisses. Son objectif principal est de traiter la peau de la zone vulvaire externe, souvent malmenée par les frottements des vêtements, la transpiration, les variations hormonales et les méthodes d'épilation agressives.</p>
<p class="blog-article-p">Ce soin s'adresse à toutes les femmes qui font face à des désagréments cutanés localisés :</p>
<ul class="blog-article-list">
<li>Poils incarnés douloureux et récurrents.</li>
<li>Boutons, rougeurs et irritations post-épilation.</li>
<li>Hyperpigmentation et taches sombres au niveau de l'entrejambe.</li>
<li>Peau sèche ou déshydratée sur la zone du maillot.</li>
</ul>
<p class="blog-article-p">En éliminant les cellules mortes et en purifiant les pores en profondeur, le vajacial redonne à la peau de votre intimité toute sa douceur et sa clarté.</p>
<h2 class="blog-article-h2">Les incroyables bienfaits du Vajacial pour la zone intime</h2>
<p class="blog-article-p">Intégrer le vajacial dans sa routine de soin corporelle offre des résultats visibles dès la première séance. Les esthéticiennes professionnelles le recommandent pour ses multiples vertus thérapeutiques et esthétiques.</p>
<h3 class="blog-article-h2">1. Élimination et prévention des poils incarnés</h3>
<p class="blog-article-p">Le rasage et l’épilation brisent parfois le poil sous la peau, provoquant des inflammations appelées folliculites. Le vajacial intègre une exfoliation ciblée qui libère les poils bloqués sous l'épiderme et affine le grain de peau pour faciliter la repousse future.</p>
<h3 class="blog-article-h2">2. Réduction des taches d'hyperpigmentation</h3>
<p class="blog-article-p">Le frottement continu des sous-vêtements ou l'utilisation répétée du rasoir peuvent stimuler la production de mélanine, créant des zones plus sombres au niveau du maillot. Grâce à des actifs éclaircissants doux et naturels (comme la vitamine C ou l'acide kojique), le vajacial aide à uniformiser le teint de la peau.</p>
<h3 class="blog-article-h2">3. Hydratation intense et apaisement cutané</h3>
<p class="blog-article-p">La peau de la zone intime est fine et sensible. L'application de masques hydroplastiques spécifiques permet de calmer instantanément le feu du rasoir, d'atténuer les rougeurs et de restaurer le film hydrolipidique de la peau.</p>
<h2 class="blog-article-h2">Comment se déroule une séance de Vajacial en institut ?</h2>
<p class="blog-article-p">Une séance de vajacial dure généralement entre 45 et 60 minutes. Elle se déroule dans une ambiance relaxante et respecte un protocole strict pour garantir une hygiène irréprochable et un confort absolu.</p>
<h3 class="blog-article-h2">Étape 1 : Le nettoyage purifiant</h3>
<p class="blog-article-p">L'esthéticienne commence par nettoyer la zone à l'aide d'un gel nettoyant doux, antibactérien et au pH équilibré pour éliminer les impuretés sans agresser les muqueuses.</p>
<h3 class="blog-article-h2">Étape 2 : L'exfoliation et la vapeur</h3>
<p class="blog-article-p">Un gommage enzymatique doux est appliqué pour éliminer les cellules mortes. L'utilisation d'un bain de vapeur (Vapozone) permet d'ouvrir les pores de la peau, de l'assouplir et de préparer l'étape suivante.</p>
<h3 class="blog-article-h2">Étape 3 : L'extraction des comédons et poils incarnés</h3>
<p class="blog-article-p">Une fois les pores dilatés, la praticienne procède à l’extraction délicate des points noirs, des comédons et des poils incarnés à l'aide d'une pince à épiler stérilisée. Cette étape se fait avec minutie pour ne pas créer de cicatrices.</p>
<h3 class="blog-article-h2">Étape 4 : La haute fréquence (désinfection)</h3>
<p class="blog-article-p">Pour refermer les pores et éliminer les bactéries responsables des boutons, on utilise souvent un appareil à haute fréquence. Le passage de l'électrode génère de l'ozone, ce qui offre une action antibactérienne et cicatrisante immédiate.</p>
<h3 class="blog-article-h2">Étape 5 : La pose du masque hydrojelly</h3>
<p class="blog-article-p">C'est le moment le plus relaxant du soin. Un masque hydrogel (souvent enrichi en aloe vera, camomille ou or) est appliqué sur l'ensemble du maillot. Il apporte une sensation de fraîcheur intense, décongestionne et hydrate la peau en profondeur.</p>
<h3 class="blog-article-h2">Étape 6 : L'hydratation finale</h3>
<p class="blog-article-p">Le soin se termine par l'application d'un sérum ciblé ou d'une crème apaisante et nourrissante pour protéger la peau.</p>
<h2 class="blog-article-h2">Quand faire un soin Vajacial ?</h2>
<p class="blog-article-p">Pour maximiser les effets du soin, le timing est essentiel. Il est fortement conseillé de réaliser un vajacial <strong>7 à 10 jours après une épilation à la cire</strong> ou un rasage. À ce moment précis, la peau a eu le temps de cicatriser, et les nouveaux poils s'apprêtent à pointer sous la peau : c'est le moment idéal pour les guider correctement et éviter qu'ils ne s'incarnent.</p>
<p class="blog-article-p">*Note : Le vajacial ne peut pas être réalisé immédiatement après une épilation, car la peau est trop sensibilisée. Il est également déconseillé pendant la période des menstruations pour des raisons évidentes de confort et d'hygiène.*</p>
<h2 class="blog-article-h2">Nos conseils d'expertes pour entretenir votre maillot à la maison</h2>
<p class="blog-article-p">Pour prolonger les bienfaits de votre soin en institut, adoptez de bonnes habitudes au quotidien :</p>
<ul class="blog-article-list">
<li><strong>Exfoliez en douceur</strong> : Utilisez un gommage adapté une à deux fois par semaine, à distance des jours d'épilation.</li>
<li><strong>Hydratez quotidiennement</strong> : Appliquez une huile sèche naturelle (comme l'huile de jojoba) ou une crème hydratante sans parfum.</li>
<li><strong>Portez du coton</strong> : Privilégiez les sous-vêtements en fibres naturelles pour limiter la transpiration et les frottements irritants.</li>
</ul>
      `,
    },
    {
      id: 'post-8',
      title: 'Le guide complet du Drainage Lymphatique : Silhouette, santé et vitalité',
      author: 'Mey Beauty',
      category: 'Massage',
      status: 'published',
      date: '2026-07-01',
      excerpt:
        'Se sentir légère, éliminer les toxines et sculpter son corps naturellement : voilà la promesse du drainage lymphatique.',
      image: img('/massage-corps%20(2).jpg'),
      contentHtml: `
<h1 class="blog-article-h2">Le guide complet du Drainage Lymphatique : Silhouette, santé et vitalité</h1>
<p class="blog-article-p">Se sentir légère, éliminer les toxines et sculpter son corps naturellement : voilà la promesse du drainage lymphatique. Cette technique de massage thérapeutique et esthétique connaît un succès grandissant en institut de beauté. Utilisé aussi bien pour réduire la cellulite que pour améliorer le bien-être général, le drainage lymphatique agit directement sur le système circulatoire le plus secret de notre corps : la lymphe. Qu’est-ce que la lymphe ? Pourquoi son blocage fatigue-t-il l’organisme et comment le drainage manuel peut-il transformer votre silhouette ? En route pour une détox globale.</p>
<h2 class="blog-article-h2">Comprendre le système lymphatique : Le filtre de notre organisme</h2>
<p class="blog-article-p">Pour comprendre l’efficacité du drainage lymphatique, il faut d’abord comprendre le rôle de la lymphe. La lymphe est un liquide incolore qui circule dans tout le corps via un réseau de vaisseaux parallèles aux veines. Contrairement au sang, qui est propulsé par le cœur, la lymphe ne possède pas de pompe naturelle. Sa circulation dépend uniquement des mouvements musculaires et de la respiration.</p>
<p class="blog-article-p">Le rôle de la lymphe est capital :</p>
<ul class="blog-article-list">
<li>Elle transporte les déchets cellulaires, les toxines et les excès de liquides.</li>
<li>Elle filtre ces éléments à travers les ganglions lymphatiques pour les éliminer.</li>
<li>Elle joue un rôle majeur dans le système immunitaire en transportant les globules blancs.</li>
</ul>
<p class="blog-article-p">Lorsque la circulation lymphatique est paresseuse (à cause de la sédentarité, d'une mauvaise alimentation ou du stress), les toxines s'accumulent. C'est là qu'apparaissent les sensations de jambes lourdes, la rétention d'eau et la cellulite aqueuse.</p>
<h2 class="blog-article-h2">Les différents bienfaits du Drainage Lymphatique Manuel</h2>
<p class="blog-article-p">Le drainage lymphatique est bien plus qu'un simple massage bien-être. C'est une cure de jouvence pour le corps, aux bénéfices multiples et scientifiquement prouvés.</p>
<h3 class="blog-article-h2">1. Action anti-rétention d'eau et jambes légères</h3>
<p class="blog-article-p">Si vous souffrez de gonflements au niveau des chevilles, des mollets ou des mains, le drainage lymphatique est la solution idéale. En stimulant les ganglions, le massage relance l'évacuation des liquides stockés en excès dans les tissus. Dès la fin de la séance, la sensation de légèreté est immédiate.</p>
<h3 class="blog-article-h2">2. Réduction de la cellulite et remodelage de la silhouette</h3>
<p class="blog-article-p">La cellulite aqueuse est directement liée à une mauvaise circulation de la lymphe et à un engorgement des cellules graisseuses. Le drainage manuel permet de désinfiltrer les tissus, de lisser la peau d'orange et de redessiner les contours de la silhouette, notamment au niveau des cuisses, des hanches et du ventre.</p>
<h3 class="blog-article-h2">3. Détoxification et renforcement immunitaire</h3>
<p class="blog-article-p">En accélérant l'élimination des déchets et des toxines, le drainage lymphatique purifie l'organisme de l'intérieur. Il donne un coup de boost remarquable au système immunitaire et améliore visiblement la qualité de la peau, qui devient plus lumineuse et moins sujette aux imperfections.</p>
<h3 class="blog-article-h2">4. Récupération musculaire et post-opératoire</h3>
<p class="blog-article-p">Très prisé par les athlètes, ce massage élimine l'acide lactique et réduit les courbatures. Il est également recommandé par le corps médical après certaines interventions de chirurgie esthétique (comme une liposuccion) pour réduire les œdèmes et accélérer la cicatrisation.</p>
<h2 class="blog-article-h2">Les deux grandes méthodes : Vodder vs Renata França</h2>
<p class="blog-article-p">Il existe deux manières principales de pratiquer le drainage lymphatique en institut, chacune répondant à des besoins spécifiques.</p>
<h3 class="blog-article-h2">La méthode classique (Méthode Vodder)</h3>
<p class="blog-article-p">Créée dans les années 1930 par le Dr Emil Vodder, cette méthode repose sur des mouvements extrêmement doux, lents et rythmés, effectuant des pressions circulaires en forme de vagues. Très relaxante, elle respecte scrupuleusement la physiologie du corps et est idéale pour les personnes très sensibles, les femmes enceintes ou en post-chirurgie.</p>
<h3 class="blog-article-h2">La méthode moderne (Style Renata França)</h3>
<p class="blog-article-p">Révolutionnée par la célèbre praticienne brésilienne Renata França, cette technique se distingue par un rythme beaucoup plus rapide et des pressions fermes. Elle combine le drainage lymphatique traditionnel à des mouvements de modelage exclusifs. Le résultat est spectaculaire : un effet "lifting" et une silhouette immédiatement galbée et affinée dès la première séance.</p>
<h2 class="blog-article-h2">Comment se déroule une séance en institut ?</h2>
<p class="blog-article-p">Une séance de drainage lymphatique dure entre 1h et 1h30. Installée confortablement sur une table de massage, la cliente reçoit le soin directement sur la peau, généralement sans huile (ou avec une quantité très limitée) pour permettre une bonne adhérence des doigts de la praticienne.</p>
<p class="blog-article-p">Le massage commence toujours par l'<strong>évacuation des ganglions principaux</strong> (situés au niveau du cou, des aisselles, du nombril et de l'aine) par de légères pressions répétées. Ensuite, le praticien effectue des mouvements de pompage et de lissage en partant des extrémités (pieds, mains) vers les centres ganglionnaires pour faire remonter le flux lymphatique.</p>
<p class="blog-article-p">Après la séance, il est fréquent de ressentir une envie pressante d'uriner : c'est le signe indéniable que votre corps commence déjà à éliminer les toxines accumulées !</p>
<h2 class="blog-article-h2">À quelle fréquence faut-il planifier ses séances ?</h2>
<p class="blog-article-p">Pour obtenir des résultats durables sur la silhouette et la cellulite, la régularité est la clé de la réussite. </p>
<ul class="blog-article-list">
<li><strong>En cure d'attaque</strong> : Il est conseillé de réaliser 5 à 10 séances, à raison d'une à deux fois par semaine.</li>
<li><strong>En entretien</strong> : Une séance mensuelle suffit ensuite pour maintenir les bénéfices et garder un corps tonique et léger toute l'année.</li>
</ul>
<p class="blog-article-p">*Contre-indications importantes : Le drainage lymphatique est déconseillé en cas d'infections aiguës, de fièvre, de phlébite déclarée ou de tumeurs malignes sans avis médical préalable.*</p>
      `,
    },
    {
      id: 'post-9',
      title: 'Épilation à la cire vs Épilation définitive : Quelle méthode choisir pour une peau douce ?',
      author: 'Mey Beauty',
      category: 'Épilation',
      status: 'published',
      date: '2026-07-01',
      excerpt:
        'Avantages, inconvénients, budget et douleur : ce guide comparatif complet vous aide à choisir la méthode idéale pour votre profil.',
      image: img('/beaut%C3%A9%20regard%20(2).jpg'),
      contentHtml: `
<h1 class="blog-article-h2">Épilation à la cire vs Épilation définitive : Quelle méthode choisir pour une peau douce ?</h1>
<p class="blog-article-p">Avoir une peau parfaitement lisse, nette et sans poils tout au long de l'année est un objectif partagé par de nombreuses personnes. Pour y parvenir, deux grandes philosophies s'affrontent dans le monde de la beauté : l'épilation traditionnelle à la cire et les technologies d'épilation définitive (laser et lumière pulsée). Si l'une séduit par son accessibilité immédiate, l'autre révolutionne le quotidien par sa promesse de liberté à long terme. Avantages, inconvénients, budget et douleur : ce guide comparatif complet vous aide à choisir la méthode idéale pour votre profil.</p>
<h2 class="blog-article-h2">L'Épilation à la cire : Le classique indémodable de l'institut</h2>
<p class="blog-article-p">L'épilation à la cire reste la prestation reine en institut de beauté. Elle consiste à arracher le poil avec sa racine, ce qui ralentit considérablement la repousse par rapport au rasage.</p>
<h3 class="blog-article-h2">Les différents types de cire professionnels</h3>
<ul class="blog-article-list">
<li><strong>La cire chaude (sans bandes)</strong> : Idéale pour les zones sensibles et délicates comme le maillot, les aisselles ou le visage. La chaleur dilate les pores, ce qui rend l'arrachage moins douloureux et capture parfaitement les poils courts et drus.</li>
<li><strong>La cire tiède (avec bandes)</strong> : Utilisée pour les grandes zones comme les jambes ou les bras. Appliquée en couche ultra-fine à l'aide d'un roll-on ou d'une spatule, elle s'enlève d'un geste vif à l'aide d'une bande de tissu.</li>
</ul>
<h3 class="blog-article-h2">Les avantages de la cire</h3>
<ul class="blog-article-list">
<li><strong>Résultat immédiat</strong> : Vous ressortez de l’institut avec une peau douce pour 3 à 4 semaines.</li>
<li><strong>Affinement du poil</strong> : Au fil des séances, la racine s'affaiblit. Le poil repousse plus fin, plus clair et moins nombreux.</li>
<li><strong>Exfoliation naturelle</strong> : En se retirant, la cire élimine les cellules mortes en surface, rendant la peau douce.</li>
</ul>
<h2 class="blog-article-h2">L'Épilation définitive : La révolution technologique au service de votre temps</h2>
<p class="blog-article-p">L'épilation définitive regroupe des techniques qui détruisent la racine du poil par la chaleur pour empêcher définitivement sa repousse. En institut ou centre spécialisé, on distingue principalement deux technologies : le Laser et la Lumière Pulsée (IPL).</p>
<h3 class="blog-article-h2">Épilation Laser vs Lumière Pulsée (IPL) : Quelle différence ?</h3>
<ul class="blog-article-list">
<li><strong>Le Laser</strong> émet un faisceau lumineux unique et ultra-concentré. C'est une méthode médicale ou dermo-esthétique de haute précision, extrêmement puissante, qui cible directement la mélanine du poil. Elle est très efficace sur presque tous les types de peau.</li>
<li><strong>La Lumière Pulsée (IPL)</strong> utilise un spectre lumineux plus large. Elle est idéale pour les poils foncés sur peaux claires et offre d'excellents résultats en un nombre de séances légèrement supérieur.</li>
</ul>
<h3 class="blog-article-h2">Les avantages de l'épilation définitive</h3>
<ul class="blog-article-list">
<li><strong>Une liberté totale</strong> : Après un protocole complet, plus de 85% des poils sont définitivement éliminés. Quelques séances de retouche annuelles suffisent.</li>
<li><strong>Finis les poils incarnés</strong> : En détruisant le follicule pileux, cette méthode supprime radicalement les problèmes de boutons et de poils incarnés douloureux au maillot ou aux jambes.</li>
<li><strong>Économie à long terme</strong> : Bien que l'investissement initial soit élevé, il est rentabilisé en quelques années par rapport au coût cumulé d'une vie d'épilation à la cire.</li>
</ul>
<h2 class="blog-article-h2">Tableau comparatif : Faire le bon choix en un coup d'œil</h2>
<p class="blog-article-p">Pour vous guider, voici un récapitulatif des critères essentiels pour faire votre choix :</p>
<p class="blog-article-p">| Critères | Épilation à la Cire | Épilation Définitive (Laser / IPL) |</p>
<p class="blog-article-p">| :--- | :--- | :--- |</p>
<p class="blog-article-p">| <strong>Durée des résultats</strong> | 3 à 4 semaines | Permanente (à plus de 85%) |</p>
<p class="blog-article-p">| <strong>Nombre de séances</strong> | À répéter toute la vie | 6 à 10 séances selon la zone |</p>
<p class="blog-article-p">| <strong>Niveau de douleur</strong> | Vive mais instantanée | Sensation de picotement ou coup d'élastique |</p>
<p class="blog-article-p">| <strong>Type de poil / peau</strong> | Tous types de peaux et poils | Idéal sur poils foncés (limité sur poils blancs/roux) |</p>
<p class="blog-article-p">| <strong>Saison recommandée</strong> | Toute l'année | Automne / Hiver (éviter l'exposition au soleil) |</p>
<h2 class="blog-article-h2">Comment préparer sa peau avant et après votre séance ?</h2>
<p class="blog-article-p">Quelle que soit la méthode choisie, le secret d'une épilation réussie réside dans la préparation de la peau.</p>
<h3 class="blog-article-h2">Pour l'épilation à la cire :</h3>
<ul class="blog-article-list">
<li><strong>Avant</strong> : Faites un gommage 24 heures avant pour libérer les poils sous peau. N'appliquez pas d'huile ou de crème corporelle le jour J.</li>
<li><strong>Après</strong> : Appliquez une lotion apaisante à l'aloe vera. Évitez le soleil et le chlore de la piscine pendant 24 heures.</li>
</ul>
<h3 class="blog-article-h2">Pour l'épilation définitive :</h3>
<ul class="blog-article-list">
<li><strong>Avant</strong> : Rasez la zone de traitement la veille de la séance (ne surtout pas arracher le poil à la cire, car le laser a besoin de la racine pour détruire le bulbe). Zéro exposition solaire ou autobronzant durant les 4 semaines précédentes.</li>
<li><strong>Après</strong> : Hydratez généreusement avec une crème réparatrice et appliquez impérativement un écran solaire SPF 50 sur les zones exposées.</li>
</ul>
<h2 class="blog-article-h2">Conclusion : Quelle méthode adopter ?</h2>
<p class="blog-article-p">Optez pour la <strong>cire</strong> si vous cherchez une solution économique à court terme, si vos poils sont très clairs (blonds, roux, blancs) ou si vous aimez votre rendez-vous mensuel en institut. Choisissez l'<strong>épilation définitive</strong> si vous souhaitez vous débarrasser définitivement de la corvée des poils, si vous souffrez de poils incarnés et si vous êtes prête à investir dans votre confort quotidien.</p>
      `,
    },
    {
      id: 'post-10',
      title: 'Manucure Japonaise : Le soin détox révolutionnaire pour des ongles sains et brillants',
      author: 'Mey Beauty',
      category: 'Ongles',
      status: 'published',
      date: '2026-07-01',
      excerpt:
        'La manucure japonaise, rituel ancestral venu d’Asie, soigne l’ongle en profondeur pour lui redonner son éclat naturel.',
      image: img('/mey-beauty%20(3).jpeg'),
      contentHtml: `
<h1 class="blog-article-h2">Manucure Japonaise : Le soin détox révolutionnaire pour des ongles sains et brillants</h1>
<p class="blog-article-p">À l'ère des vernis semi-permanents, des extensions en gel et des poses de faux ongles à répétition, nos ongles finissent souvent par saturer. Fragilisés, dédoublés, mous ou jaunis, ils réclament une pause. C’est précisément ici qu’intervient un rituel ancestral tout droit venu d'Asie : la manucure japonaise. Véritable cure de détoxication esthétique, ce soin unique ne dissimule pas les imperfections sous des couches de vernis, mais soigne l'ongle en profondeur pour lui redonner son éclat naturel. Zoom sur la manucure japonaise, le secret ultime pour des ongles forts et naturellement brillants.</p>
<h2 class="blog-article-h2">Qu'est-ce que la Manucure Japonaise ?</h2>
<p class="blog-article-p">La manucure japonaise est un soin de beauté des mains holistique, vieux de plusieurs siècles, qui était autrefois le secret des aristocrates japonaises pour afficher des mains parfaites. Contrairement aux manucures traditionnelles, elle n'utilise aucun vernis, aucune base chimique, ni aucune lampe UV.</p>
<p class="blog-article-p">Son concept repose sur l'<strong>inoculation d'actifs nutritifs directement dans la plaque cornée de l'ongle</strong> grâce à un polissage minutieux à base de pâtes et de poudres naturelles. C'est l'équivalent d'un masque de soin ultra-nourrissant pour le visage, mais appliqué exclusivement à l'ongle. Après une séance, les ongles affichent une brillance miroir spectaculaire, si nette qu'on dirait qu'une couche de top coat transparent vient d'être posée.</p>
<h2 class="blog-article-h2">La composition magique des produits utilisés</h2>
<p class="blog-article-p">Le succès de la manucure japonaise réside dans la formulation ultra-clean et naturelle des produits professionnels utilisés au cours du soin. On y retrouve des ingrédients précieux issus de la pharmacopée traditionnelle :</p>
<ul class="blog-article-list">
<li><strong>La cire d'abeille</strong> : Nourrit intensément l'ongle, comble les stries de surface et crée une barrière protectrice naturelle.</li>
<li><strong>La terre de diatomée (ou silice)</strong> : Reconnue pour ses propriétés reminéralisantes extraordinaires, elle fortifie la structure de l'ongle.</li>
<li><strong>Le squalane et l'huile de jojoba</strong> : Hydratent l'ongle et assouplissent les cuticules.</li>
<li><strong>La poudre de perle d'eau douce</strong> : Riche en acides aminés, elle blanchit naturellement l'ongle et booste son éclat.</li>
</ul>
<h2 class="blog-article-h2">Les étapes clés d'un soin détox en institut</h2>
<p class="blog-article-p">Réalisée par une prothésiste ongulaire qualifiée, une séance de manucure japonaise dure environ 45 minutes et suit un protocole relaxant et précis.</p>
<h3 class="blog-article-h2">Étape 1 : La préparation de l'ongle</h3>
<p class="blog-article-p">L'esthéticienne nettoie et désinfecte les mains. Les ongles sont limés selon la forme souhaitée (arrondis, carrés). Les cuticules sont ensuite repoussées avec délicatesse après l'application d'une huile émolliente.</p>
<h3 class="blog-article-h2">Étape 2 : L'ouverture des écailles</h3>
<p class="blog-article-p">À l'aide d'une lime polissoir au grain très fin, la praticienne vient polir légèrement la surface de l'ongle. Cette étape permet de lisser les reliefs incommodes, mais surtout d'ouvrir les écailles de kératine pour que les soins pénètrent de façon optimale.</p>
<h3 class="blog-article-h2">Étape 3 : L'application de la pâte nutritive</h3>
<p class="blog-article-p">C'est le cœur du traitement. À l'aide d'un bloc polissoir en peau de chamois véritable, l'esthéticienne fait pénétrer une pâte verte et dense, riche en cire d'abeille et nutriments. Le mouvement de va-et-vient active la microcirculation sanguine de l'ongle et fait infuser les actifs.</p>
<h3 class="blog-article-h2">Étape 4 : La fixation et la brillance (La poudre)</h3>
<p class="blog-article-p">Pour sceller les nutriments et apporter cette brillance miroir iconique, on applique ensuite une poudre fine à base de perles. Polie à nouveau avec un polissoir propre en peau de daim, elle vient fixer la cire et imperméabiliser l'ongle, le protégeant des agressions extérieures (eau, produits ménagers).</p>
<h3 class="blog-article-h2">Étape 5 : Le massage final</h3>
<p class="blog-article-p">Le soin se clôture par un massage relaxant des mains et des cuticules à l'aide d'une crème nourrissante ou d'une huile végétale précieuse.</p>
<h2 class="blog-article-h2">Pourquoi adopter la Manucure Japonaise ? (Les bienfaits)</h2>
<p class="blog-article-p">Ce traitement de soin présente de nombreux bénéfices :</p>
<ul class="blog-article-list">
<li><strong>Fortification immédiate</strong> : Les ongles mous et cassants retrouvent instantanément de la rigidité et de la force. Ils cessent de se dédoubler.</li>
<li><strong>Brillance longue durée</strong> : La brillance obtenue n'est pas éphémère. Elle résiste à l'eau et reste visible entre <strong>2 et 3 semaines</strong>.</li>
<li><strong>Stimulation de la croissance</strong> : Le massage répété de la matrice stimule la pousse de l'ongle, qui grandit plus vite et en meilleure santé.</li>
<li><strong>Une pause saine</strong> : Idéale pour détoxifier vos mains entre deux poses de gel ou de résine, afin d'éviter le jaunissement et l'amincissement de l'ongle.</li>
</ul>
<h2 class="blog-article-h2">À quelle fréquence faire ce soin ?</h2>
<p class="blog-article-p">La manucure japonaise peut être pratiquée de deux façons :</p>
<ul class="blog-article-list">
<li><strong>En traitement de secours</strong> : Une séance unique dès que vos ongles fatiguent ou après la dépose de faux ongles pour réparer les dégâts.</li>
<li><strong>En cure intensive</strong> : Pour les ongles extrêmement abîmés, planifiez 3 séances espacées de deux semaines pour régénérer complètement la plaque de l'ongle.</li>
</ul>
<p class="blog-article-p">Si vous cherchez une alternative saine, élégante et naturelle pour sublimer vos mains sans utiliser de produits chimiques, la manucure japonaise est le rituel beauté indispensable à tester sans attendre.</p>
      `,
    },
    {
      id: 'post-11',
      title: 'Tatouage semi-permanent : Le secret d\'une mise en beauté durable et naturelle',
      author: 'Mey Beauty',
      category: 'Maquillage',
      status: 'published',
      date: '2026-07-01',
      excerpt:
        'Se réveiller chaque matin avec des sourcils parfaitement dessinés ou des lèvres subtilement teintées : découvrez le maquillage semi-permanent.',
      image: img('/mey-beauty%20(2).jpeg'),
      contentHtml: `
<h1 class="blog-article-h2">Tatouage semi-permanent : Le secret d'une mise en beauté durable et naturelle</h1>
<p class="blog-article-p">Se réveiller chaque matin avec des sourcils parfaitement dessinés, un regard ténébreux ou des lèvres subtilement teintées sans passer par la case maquillage : c'est le rêve de beaucoup d'entre nous. Grâce aux avancées incroyables du tatouage semi-permanent, ce rêve est désormais à portée de main. Loin des techniques de dermopigmentation d'autrefois qui viraient de couleur, le maquillage semi-permanent moderne offre des résultats d'une finesse et d'un naturel bluffants. Découvrez les techniques phares du moment, le déroulement d'une séance en institut et nos astuces pour faire durer votre mise en beauté.</p>
<h2 class="blog-article-h2">Qu'est-ce que le Tatouage Semi-Permanent ou Maquillage Permanent ?</h2>
<p class="blog-article-p">Le tatouage semi-permanent (aussi appelé dermopigmentation) consiste à implanter des pigments biosourcés dans les couches superficielles de l'épiderme, juste au-dessus du derme. À la différence d'un tatouage artistique corporel traditionnel qui est définitif, le maquillage semi-permanent s'estompe naturellement avec les années à cause du renouvellement cellulaire de la peau du visage.</p>
<p class="blog-article-p">Sa durée de vie varie généralement entre <strong>1 et 3 ans</strong>, ce qui permet de réajuster le tracé et l'intensité de la couleur en fonction du vieillissement naturel des traits du visage et des tendances de beauté.</p>
<h2 class="blog-article-h2">Les 3 prestations stars du Tatouage Semi-Permanent en institut</h2>
<p class="blog-article-p">La dermopigmentation moderne se décline sur plusieurs zones du visage pour corriger une asymétrie, densifier un manque ou apporter de la couleur.</p>
<h3 class="blog-article-h2">1. La dermo-pigmentation des sourcils : Microblading vs Microshading</h3>
<p class="blog-article-p">Les sourcils structurent l'ensemble de l'expression du visage. Deux techniques phares dominent le marché :</p>
<ul class="blog-article-list">
<li><strong>Le Microblading</strong> : Idéal pour un effet ultra-naturel. À l'aide d'une lame fine, la technicienne dessine les poils un à un pour imiter la chevelure naturelle. C'est parfait pour combler des sourcils clairsemés.</li>
<li><strong>Le Microshading</strong> : Offre un effet poudré, semblable à l'application d'un fard à sourcils ou d'un crayon. Réalisé par de petits points d'ombrage, il apporte de l'intensité et de la profondeur, idéal pour les peaux mixtes à grasses.</li>
</ul>
<h3 class="blog-article-h2">2. Le Candy Lips (Dermopigmentation des lèvres)</h3>
<p class="blog-article-p">Le Candy Lips permet de redessiner le contour des lèvres parfois flou, de corriger une légère asymétrie et de redonner de la couleur à des lèvres trop pâles. Le résultat donne un effet "lèvres mordues" ou baume teinté ultra-frais et lumineux. Plus besoin de rouge à lèvres au quotidien !</p>
<h3 class="blog-article-h2">3. Le Liner permanent ou Ras-de-cils</h3>
<p class="blog-article-p">Pour intensifier le regard sans avoir à tracer son trait d'eyeliner tous les matins, la dermopigmentation des yeux est magique. Le <strong>ras-de-cils</strong> consiste à insérer des points pigmentés noirs ou bruns foncés à la racine des cils pour donner l'illusion de cils plus denses et d'un regard instantanément plus réveillé.</p>
<h2 class="blog-article-h2">Le déroulement d'une séance : Un protocole sur-mesure et sécurisé</h2>
<p class="blog-article-p">Une séance de tatouage semi-permanent dure entre 1h30 et 2h30. Elle requiert une écoute attentive et une hygiène médicale stricte.</p>
<h3 class="blog-article-h2">Étape 1 : La consultation et le dessin préparatoire</h3>
<p class="blog-article-p">La dermo-praticienne commence par étudier la morphologie de votre visage et le ton de votre peau. Elle réalise un tracé précis au crayon de la future forme. Cette étape est cruciale : le tatouage ne commence que lorsque la cliente a validé à 100% le dessin prévisionnel.</p>
<h3 class="blog-article-h2">Étape 2 : Le choix de la couleur</h3>
<p class="blog-article-p">Grâce à une large palette de pigments minéraux ou organiques certifiés et stériles, l'experte crée une nuance sur-mesure qui s'harmonisera parfaitement avec la couleur naturelle de vos cheveux et de votre carnation.</p>
<h3 class="blog-article-h2">Étape 3 : La pigmentation</h3>
<p class="blog-article-p">À l'aide d'un dermographe électrique muni d'une aiguille stérile à usage unique (ou d'un stylet manuel pour le microblading), les pigments sont insérés en douceur dans l'épiderme. La sensation s'apparente à de légers picotements ou des gratouilles, mais reste tout à fait supportable.</p>
<h3 class="blog-article-h2">Étape 4 : La séance de retouche (Obligatoire)</h3>
<p class="blog-article-p">Après la première séance, la peau rejette naturellement une partie des pigments (environ 30 à 50% de l'intensité s'estompe en quelques jours). Une séance de retouche fixatrice, planifiée <strong>4 à 6 semaines plus tard</strong>, est indispensable pour finaliser le travail, combler les petits manques et sceller la couleur.</p>
<h2 class="blog-article-h2">Le processus de cicatrisation : Ce qu'il faut savoir</h2>
<p class="blog-article-p">La semaine suivant la séance de pigmentation demande de la rigueur :</p>
<ul class="blog-article-list">
<li><strong>Ne touchez pas aux petites croûtes</strong> : Des petites pellicules de peau vont se former, c'est tout à fait normal. Laissez-les tomber d'elles-mêmes sous peine de retirer le pigment.</li>
<li><strong>Hydratez intensément</strong> : Appliquez de la vaseline ou une crème cicatrisante recommandée par votre technicienne plusieurs fois par jour.</li>
<li><strong>Évitez l'eau et la chaleur</strong> : Pas de piscine, de sauna, de hammam ou de séances de sport intensives entraînant de la sudation pendant 7 à 10 jours.</li>
<li><strong>Protection solaire</strong> : Pas d'exposition au soleil directe durant un mois, et appliquez toujours un stick SPF 50 pour protéger les pigments des UV.</li>
</ul>
<h2 class="blog-article-h2">Un maquillage semi-permanent réussi commence par le choix de votre institut</h2>
<p class="blog-article-p">Le maquillage semi-permanent est un acte de précision. Pour garantir votre sécurité esthétique et sanitaire, veillez à choisir un institut certifié, affichant son attestation de formation "Hygiène et Salubrité", et utilisant du matériel jetable à usage unique. Offrez-vous le confort d'un visage sublimé à chaque instant, sans effort !</p>
      `,
    },
    {
      id: 'post-1',
      title: 'Beauté & Spa : rituels bien‑être à adopter',
      author: 'Mey Beauty',
      category: 'Bien‑être',
      status: 'published',
      date: '2024-10-27',
      excerpt:
        'Les gestes simples qui changent tout : vapeur, massage, hydratation, et une routine spa à reproduire à la maison pour une peau lumineuse.',
      image: img('/soin visage (2).PNG'),
      contentHtml: `
        <p class="blog-article-p">Entre le rythme du quotidien et le stress, notre peau et notre esprit ont besoin de pauses. Le spa, ce n’est pas seulement une “parenthèse plaisir” : c’est un vrai rituel d’équilibre. Bonne nouvelle : tu peux recréer une expérience proche du spa à la maison, avec les bons gestes.</p>

        <h2 class="blog-article-h2">Les 3 piliers d’un rituel spa efficace</h2>
        <p class="blog-article-p">Un rituel qui fonctionne, c’est une combinaison de chaleur (pour détendre), de soins (pour nourrir) et de massage (pour stimuler). L’objectif : relancer la micro‑circulation, apaiser les tensions et redonner de l’éclat.</p>

        <div class="blog-article-img-row">
          <img src="${img('/soin spa (1).JPG')}" alt="Rituel spa" />
          <img src="${img('/massage-corps (2).jpg')}" alt="Massage" />
        </div>

        <h2 class="blog-article-h2">Checklist spa à la maison</h2>
        <ul class="blog-article-list">
          <li>Nettoyage doux (sans agresser)</li>
          <li>Vapeur tiède 3 à 5 minutes</li>
          <li>Masque adapté (hydratant ou purifiant)</li>
          <li>Massage du visage 2 minutes</li>
          <li>Sérum + crème pour sceller l’hydratation</li>
          <li>Infusion + respiration 4‑7‑8</li>
        </ul>

        <div class="blog-article-quote">
          <p>“Une routine simple, répétée régulièrement, fait plus de différence qu’un soin occasionnel.”</p>
          <cite>- Mey Beauty</cite>
        </div>

        <p class="blog-article-p">Astuce : fais ce rituel 1 fois par semaine. Entre‑temps, garde un mini‑rituel quotidien (nettoyage + hydratation + SPF le matin).</p>
      `,
    },
    {
      id: 'post-2',
      title: 'Soin visage : éclat, hydratation et confort',
      author: 'Mey Beauty',
      category: 'Soin Visage',
      status: 'published',
      date: '2024-10-28',
      excerpt:
        'Peau terne, tiraillements, manque d’éclat ? Voici une routine et des techniques simples pour hydrater et illuminer le visage durablement.',
      image: img('/soin visage (2).PNG'),
      contentHtml: `
        <p class="blog-article-p">L’éclat ne se résume pas à un “effet glow” immédiat. Une peau lumineuse est une peau équilibrée : bien hydratée, protégée, et soutenue par une barrière cutanée forte. On te guide pas à pas.</p>

        <h2 class="blog-article-h2">Hydrater vs nourrir : la différence</h2>
        <p class="blog-article-p">Hydrater = apporter de l’eau (humectants). Nourrir = apporter des lipides (huiles, beurres). Les deux sont complémentaires, surtout si la peau tiraille.</p>

        <h2 class="blog-article-h2">Routine éclat (matin/soir)</h2>
        <ul class="blog-article-list">
          <li>Nettoyant doux (matin & soir)</li>
          <li>Sérum hydratant (acide hyaluronique)</li>
          <li>Crème barrière (céramides / beurre léger)</li>
          <li>SPF 50 tous les matins</li>
          <li>Gommage doux 1x/semaine (pas plus)</li>
          <li>Masque hydratant 1x/semaine</li>
        </ul>

        <div class="blog-article-img-row">
          <img src="${img('/soin visage (1).PNG')}" alt="Soin visage" />
          <img src="${img('/beauté regard (3).PNG')}" alt="Regard" />
        </div>

        <div class="blog-article-quote">
          <p>“La constance vaut mieux que la perfection : 10 minutes chaque jour, c’est déjà énorme.”</p>
          <cite>- Mey Beauty</cite>
        </div>

        <p class="blog-article-p">Si ta peau réagit facilement : simplifie (moins de produits), évite les actifs trop forts, et privilégie une routine barrière.</p>
      `,
    },
    {
      id: 'post-3',
      title: 'Beauté du regard : astuces pro pour sublimer',
      author: 'Mey Beauty',
      category: 'Regard',
      status: 'published',
      date: '2024-10-29',
      excerpt:
        'Cils, sourcils, contour de l’œil : les bons réflexes pour un regard frais et structuré, même sans maquillage.',
      image: img('/beauté regard (3).PNG'),
      contentHtml: `
        <p class="blog-article-p">Un regard reposé peut transformer tout le visage. La zone du contour de l’œil est fine et fragile : elle a besoin de douceur, de drainage, et d’une routine ciblée.</p>

        <h2 class="blog-article-h2">Le combo gagnant : froid + drainage</h2>
        <p class="blog-article-p">Le froid aide à décongestionner. Le drainage relance la circulation. Ensemble, ils réduisent l’apparence des poches et réveillent le regard.</p>

        <div class="blog-article-img-row">
          <img src="${img('/Beauty regard.JPG')}" alt="Contour des yeux" />
          <img src="${img('/beauté regard (2).jpg')}" alt="Sourcils" />
        </div>

        <h2 class="blog-article-h2">Routine express (2 minutes)</h2>
        <ul class="blog-article-list">
          <li>Tapotements du coin interne vers l’externe</li>
          <li>Pressions légères sous l’œil (jamais frotter)</li>
          <li>Massage sourcil (lisser vers les tempes)</li>
          <li>Crème contour des yeux (petite quantité)</li>
        </ul>

        <div class="blog-article-quote">
          <p>“Le secret : des gestes légers. Sur le contour de l’œil, moins c’est plus.”</p>
          <cite>- Mey Beauty</cite>
        </div>

        <p class="blog-article-p">Astuce : dors avec la tête légèrement surélevée et hydrate-toi bien. Les poches sont souvent liées à la rétention d’eau et au manque de sommeil.</p>
      `,
    },
    {
      id: 'post-4',
      title: 'Massage du corps : anti‑stress, énergie et récupération',
      author: 'Mey Beauty',
      category: 'Massage',
      status: 'published',
      date: '2024-10-31',
      excerpt:
        'Tensions dans le dos, fatigue mentale, sommeil léger : le massage aide à relâcher et à recharger. Voici comment en tirer le maximum.',
      image: img('/massage-corps (2).jpg'),
      contentHtml: `
        <p class="blog-article-p">Le massage est un soin complet : il agit sur les muscles, le système nerveux et la qualité du sommeil. Que tu choisisses un massage relaxant ou plus tonique, le bénéfice est réel dès la première séance.</p>

        <h2 class="blog-article-h2">Pourquoi on se sent mieux après un massage ?</h2>
        <p class="blog-article-p">Le toucher stimule la relaxation, diminue la sensation de stress et aide le corps à “revenir au calme”. C’est aussi un excellent complément si tu fais du sport ou si tu es souvent assise.</p>

        <h2 class="blog-article-h2">Zones à cibler</h2>
        <ul class="blog-article-list">
          <li>Nuque et trapèzes (tensions écran)</li>
          <li>Bas du dos (posture)</li>
          <li>Jambes (circulation)</li>
          <li>Pieds (détente globale)</li>
        </ul>

        <div class="blog-article-img-row">
          <img src="${img('/massage-corps (1).jpg')}" alt="Massage relaxant" />
          <img src="${img('/soin visage (2).PNG')}" alt="Ambiance spa" />
        </div>

        <div class="blog-article-quote">
          <p>“Ton corps parle en tensions. Le massage, c’est lui répondre avec douceur.”</p>
          <cite>- Mey Beauty</cite>
        </div>

        <p class="blog-article-p">Conseil : après un massage, bois de l’eau et évite le sport intense le jour même. Ton corps a besoin d’intégrer le relâchement.</p>
      `,
    },
    {
      id: 'post-5',
      title: 'Soins minceur : drainage, légèreté et silhouette',
      author: 'Mey Beauty',
      category: 'Minceur',
      status: 'published',
      date: '2024-10-31',
      excerpt:
        'Ballonnements, jambes lourdes, rétention d’eau : le drainage et les soins minceur aident à se sentir plus légère et plus tonique.',
      image: img('/soin minceur (2).jpg'),
      contentHtml: `
        <p class="blog-article-p">Les soins minceur ne sont pas “magiques”, mais ils sont très efficaces pour la sensation de légèreté, la circulation et l’aspect de la peau. Ils fonctionnent encore mieux avec de bonnes habitudes (hydratation, mouvement, sommeil).</p>

        <h2 class="blog-article-h2">Drainage : pour qui ?</h2>
        <p class="blog-article-p">Si tu as les jambes lourdes, de la rétention d’eau ou une sensation de gonflement, le drainage est un excellent choix. Il vise à relancer les flux et améliorer le confort.</p>

        <div class="blog-article-img-row">
          <img src="${img('/soin minceur (1).jpg')}" alt="Soins minceur" />
          <img src="${img('/soin minceur (2).jpg')}" alt="Drainage" />
        </div>

        <h2 class="blog-article-h2">Habitudes qui boostent les résultats</h2>
        <ul class="blog-article-list">
          <li>Marcher 20 minutes par jour</li>
          <li>Boire régulièrement (pas tout d’un coup)</li>
          <li>Limiter le sel le soir</li>
          <li>Auto‑massage 2 minutes/jour</li>
        </ul>

        <div class="blog-article-quote">
          <p>“L’objectif : se sentir bien. La silhouette suit quand le corps retrouve son équilibre.”</p>
          <cite>- Mey Beauty</cite>
        </div>

        <p class="blog-article-p">Pour une vraie cure : 1 séance/semaine pendant 4 à 6 semaines, puis entretien selon ton rythme.</p>
      `,
    },
    {
      id: 'post-6',
      title: 'Routine bien‑être : sommeil, peau et sérénité',
      author: 'Mey Beauty',
      status: 'published',
      category: 'Lifestyle',
      date: '2024-11-01',
      excerpt:
        'Une peau plus belle commence souvent par une vie plus douce : sommeil, respiration, hydratation et micro‑rituels au quotidien.',
      image: img('/meybeauty.jpg'),
      contentHtml: `
        <p class="blog-article-p">On cherche parfois le produit parfait… alors que la base, c’est l’équilibre. Le stress chronique, le manque de sommeil et l’hydratation insuffisante se voient vite sur la peau : teint terne, boutons, sensibilités.</p>

        <h2 class="blog-article-h2">Le trio qui change tout</h2>
        <ul class="blog-article-list">
          <li>Sommeil : régularité + coucher plus tôt</li>
          <li>Hydratation : petites gorgées toute la journée</li>
          <li>Respiration : 2 minutes matin/soir</li>
        </ul>

        <h2 class="blog-article-h2">Rituel du soir (10 minutes)</h2>
        <p class="blog-article-p">Démaquillage doux, crème réconfort, lumière tamisée, et un mini scan corporel (relâcher la mâchoire, les épaules, le ventre). L’objectif : envoyer au cerveau le signal “tout va bien”.</p>

        <div class="blog-article-quote">
          <p>“Le bien‑être, ce n’est pas une destination. C’est une façon de se traiter chaque jour.”</p>
          <cite>- Mey Beauty</cite>
        </div>

        <p class="blog-article-p">Si tu veux un effet visible : choisis 1 micro‑habitude et tiens-la 14 jours. Ensuite, ajoute la suivante. C’est comme ça qu’on crée une vraie routine durable.</p>
      `,
    },
  ];
}

function usePersistentState(key, seedFn) {
  const [state, setState] = useState(() => {
    const existing = readJson(key, null);
    if (existing && Array.isArray(existing)) return existing;
    const seeded = seedFn();
    writeJson(key, seeded);
    return seeded;
  });

  useEffect(() => {
    writeJson(key, state);
  }, [key, state]);

  return [state, setState];
}

function AdminAuth({ onReady }) {
  const [mode, setMode] = useState('loading');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setMode('login');
        onReady(null);
        return;
      }
      const ok = isAdminEmail(user.email);
      if (!ok) {
        setMode('forbidden');
        onReady(null);
        return;
      }
      setMode('ok');
      onReady(user);
    });
    return () => unsub();
  }, [onReady]);

  const doLogin = async () => {
    setError('');
    const e = (email || '').trim();
    if (!e || !password) {
      setError('Email et mot de passe requis.');
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, e, password);
    } catch (err) {
      setError(err?.message || 'Connexion impossible');
    }
  };

  if (mode === 'loading') {
    return (
      <div className="admin-auth">
        <div className="admin-auth-card">
          <div className="admin-auth-title">Mey Beauty Admin</div>
          <div className="admin-auth-sub">Chargement…</div>
        </div>
      </div>
    );
  }

  if (mode === 'forbidden') {
    return (
      <div className="admin-auth">
        <div className="admin-auth-card">
          <div className="admin-auth-title">Accès refusé</div>
          <div className="admin-auth-sub">Ce compte n’est pas autorisé.</div>
          <button type="button" className="admin-btn admin-btn-secondary" onClick={() => signOut(auth)}>
            Se déconnecter
          </button>
        </div>
      </div>
    );
  }

  if (mode === 'ok') return null;

  return (
    <div className="admin-auth">
      <div className="admin-auth-card">
        <div className="admin-auth-title">Connexion Admin</div>
        <div className="admin-auth-sub">Email / mot de passe</div>

        <div className="admin-auth-form">
          <div className="admin-form-group admin-form-full">
            <label>Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          </div>
          <div className="admin-form-group admin-form-full">
            <label>Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              onKeyDown={(e) => {
                if (e.key === 'Enter') doLogin();
              }}
            />
          </div>
        </div>

        {error ? <div className="admin-auth-error">{error}</div> : null}

        <button type="button" className="admin-btn admin-btn-primary" onClick={doLogin}>
          Se connecter
        </button>
      </div>
    </div>
  );
}

function formatDateShort(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('fr-FR', { year: 'numeric', month: 'short', day: '2-digit' });
  } catch {
    return iso;
  }
}

function StatusBadge({ value }) {
  const cls = value === 'published' || value === 'completed' ? 'published' : value === 'draft' ? 'draft' : 'active';
  const label =
    value === 'published'
      ? 'Publié'
      : value === 'draft'
        ? 'Brouillon'
        : value === 'archived'
          ? 'Archivé'
          : value === 'active'
            ? 'Actif'
            : value === 'completed'
              ? 'Terminée'
              : value === 'processing'
                ? 'En cours'
                : value === 'cancelled'
                  ? 'Annulée'
                  : String(value || '');
  return <span className={`admin-status-badge ${cls}`}>{label}</span>;
}

function Drawer({ title, open, onClose, children, footer }) {
  if (!open) return null;
  return (
    <div className="admin-drawer-overlay" onClick={(e) => (e.target === e.currentTarget ? onClose() : null)}>
      <div className="admin-drawer" role="dialog" aria-label={title}>
        <div className="admin-drawer-header">
          <div className="admin-drawer-title">{title}</div>
          <button type="button" className="admin-drawer-close" onClick={onClose} aria-label="Fermer">
            <X size={18} />
          </button>
        </div>
        <div className="admin-drawer-body">{children}</div>
        {footer ? <div className="admin-drawer-footer">{footer}</div> : null}
      </div>
    </div>
  );
}

function setAdminHash(params) {
  const sp = new URLSearchParams();
  Object.entries(params || {}).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    const s = String(v).trim();
    if (!s) return;
    sp.set(k, s);
  });
  window.location.hash = `#admin?${sp.toString()}`;
}

function AdminProductDetail({ product, onBack, onEdit }) {
  if (!product) {
    return (
      <div className="admin-page-view">
        <div className="admin-detail-header">
          <button type="button" className="admin-btn" onClick={onBack}>
            ← Retour
          </button>
        </div>
        <div className="admin-section">
          <div className="admin-empty">Produit introuvable.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page-view">
      <div className="admin-detail-header">
        <button type="button" className="admin-btn" onClick={onBack}>
          ← Retour
        </button>
        <div className="admin-detail-actions">
          <button type="button" className="admin-btn admin-btn-primary" onClick={onEdit}>
            <Pencil size={16} />
            Modifier
          </button>
        </div>
      </div>

      <div className="admin-detail-grid">
        <div className="admin-detail-card">
          <div className="admin-detail-hero">
            <img src={product.image || product.images?.[0] || ''} alt={product.name} />
          </div>
          <div className="admin-detail-title">{product.name}</div>
          <div className="admin-detail-sub">Référence : {product.sku}</div>
          <div className="admin-detail-meta">
            <div>
              <div className="admin-detail-label">Catégorie</div>
              <div className="admin-detail-value">{product.category || '-'}</div>
            </div>
            <div>
              <div className="admin-detail-label">Prix</div>
              <div className="admin-detail-value">{formatPriceEUR(product.priceCents || 0)}</div>
            </div>
            <div>
              <div className="admin-detail-label">Stock</div>
              <div className="admin-detail-value">{product.stock ?? '-'}</div>
            </div>
            <div>
              <div className="admin-detail-label">Statut</div>
              <div className="admin-detail-value"><StatusBadge value={product.status || 'active'} /></div>
            </div>
          </div>
        </div>

        <div className="admin-detail-card">
          <div className="admin-detail-label">Description</div>
          <div className="admin-detail-long">{product.description || '-'}</div>
          <div className="admin-detail-label" style={{ marginTop: 16 }}>Image URL</div>
          <div className="admin-detail-mono">{product.image || '-'}</div>
        </div>
      </div>
    </div>
  );
}

function AdminPostDetail({ post, onBack, onEdit }) {
  if (!post) {
    return (
      <div className="admin-page-view">
        <div className="admin-detail-header">
          <button type="button" className="admin-btn" onClick={onBack}>
            ← Retour
          </button>
        </div>
        <div className="admin-section">
          <div className="admin-empty">Article introuvable.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page-view">
      <div className="admin-detail-header">
        <button type="button" className="admin-btn" onClick={onBack}>
          ← Retour
        </button>
        <div className="admin-detail-actions">
          <button type="button" className="admin-btn admin-btn-primary" onClick={onEdit}>
            <Pencil size={16} />
            Modifier
          </button>
        </div>
      </div>

      <div className="admin-detail-grid">
        <div className="admin-detail-card">
          <div className="admin-detail-hero">
            <img src={post.image || ''} alt={post.title} />
          </div>
          <div className="admin-detail-title">{post.title}</div>
          <div className="admin-detail-sub">{post.author || 'Mey Beauty'} · {formatDateShort(post.date || '')}</div>
          <div className="admin-detail-meta">
            <div>
              <div className="admin-detail-label">Catégorie</div>
              <div className="admin-detail-value">{post.category || '-'}</div>
            </div>
            <div>
              <div className="admin-detail-label">Statut</div>
              <div className="admin-detail-value"><StatusBadge value={post.status || 'draft'} /></div>
            </div>
          </div>
          <div className="admin-detail-label" style={{ marginTop: 16 }}>Extrait</div>
          <div className="admin-detail-long">{post.excerpt || '-'}</div>
        </div>

        <div className="admin-detail-card">
          <div className="admin-detail-label">Contenu HTML</div>
          <div className="admin-detail-code">{post.contentHtml || '-'}</div>
        </div>
      </div>
    </div>
  );
}

function AdminProducts({ products, setProducts, onOpenDetail, editIdFromNav, clearEditIdFromNav }) {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState('');
  const [imageBusy, setImageBusy] = useState(false);
  const productFileRef = useRef(null);

  const editing = useMemo(() => products.find((p) => p.id === editingId) || null, [products, editingId]);

  const [form, setForm] = useState({
    brand: '',
    name: '',
    reference: '',
    category: '',
    priceEuros: '',
    stock: 0,
    status: 'active',
    image: '',
    description: '',
    details: '',
    delivery: '',
    netQuantity: '',
    skinType: '',
    specsText: '',
  });

  useEffect(() => {
    if (!modalOpen) return;
    if (editing) {
      setForm({
        brand: editing.brand || '',
        name: editing.name || '',
        reference: editing.reference || editing.id || '',
        category: editing.category || '',
        priceEuros: ((Number(editing.priceCents) || 0) / 100).toFixed(2),
        stock: editing.stock || 0,
        status: editing.status || 'active',
        image: editing.image || '',
        description: editing.description || '',
        details: editing.details || '',
        delivery: editing.delivery || '',
        netQuantity: editing.netQuantity || '',
        skinType: editing.skinType || '',
        specsText: Array.isArray(editing.specs) && editing.specs.length
          ? editing.specs.map((s) => `${s?.label || ''}:${s?.value || ''}`).join('\n')
          : [
              editing.brand ? `Marque: ${editing.brand}` : '',
              editing.category ? `Catégorie: ${editing.category}` : '',
              editing.netQuantity ? `Quantité nette: ${editing.netQuantity}` : '',
              editing.skinType ? `Type de peau: ${editing.skinType}` : '',
            ].filter(Boolean).join('\n'),
      });
    } else {
      setForm({
        brand: '',
        name: '',
        reference: '',
        category: '',
        priceEuros: '',
        stock: 0,
        status: 'active',
        image: '',
        description: '',
        details: '',
        delivery: '',
        netQuantity: '',
        skinType: '',
        specsText: '',
      });
    }
  }, [modalOpen, editing]);

  useEffect(() => {
    const id = String(editIdFromNav || '').trim();
    if (!id) return;
    openEdit(id);
    if (typeof clearEditIdFromNav === 'function') clearEditIdFromNav();
  }, [editIdFromNav]);

  const filtered = useMemo(() => {
    if (!query.trim()) return products;
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      const hay = [p.name, p.sku, p.category, p.status].filter(Boolean).join(' ').toLowerCase();
      return hay.includes(q);
    });
  }, [products, query]);

  useEffect(() => {
    setPage(1);
  }, [query, products.length]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const paged = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, safePage]);

  const openCreate = () => {
    setEditingId('');
    setModalOpen(true);
  };

  const openEdit = (id) => {
    setEditingId(id);
    setModalOpen(true);
  };

  const openDetail = (id) => {
    if (typeof onOpenDetail === 'function') onOpenDetail(id);
  };

  const save = () => {
    const parseEurosToCents = (v) => {
      const raw = String(v ?? '').trim().replace(',', '.');
      const n = Number(raw);
      if (!Number.isFinite(n)) return 0;
      return Math.max(0, Math.round(n * 100));
    };

    const parseSpecs = (s) => {
      const lines = String(s || '')
        .split('\n')
        .map((x) => x.trim())
        .filter(Boolean);
      return lines
        .map((line) => {
          const idx = line.indexOf(':');
          if (idx < 0) return null;
          const label = line.slice(0, idx).trim();
          const value = line.slice(idx + 1).trim();
          if (!label || !value) return null;
          return { label, value };
        })
        .filter(Boolean);
    };

    const payload = {
      id: editingId || uid('prod'),
      brand: form.brand.trim() || 'Mey Beauty',
      name: form.name.trim() || 'Produit',
      reference: form.reference.trim() || editingId || uid('prod'),
      category: form.category.trim() || '-',
      priceCents: parseEurosToCents(form.priceEuros),
      stock: Math.max(0, Number(form.stock) || 0),
      status: form.status,
      image: form.image.trim(),
      images: form.image.trim() ? [form.image.trim()] : [],
      description: form.description,
      details: form.details,
      delivery: form.delivery,
      netQuantity: form.netQuantity,
      skinType: form.skinType,
      specs: parseSpecs(form.specsText),
    };

    setProducts((prev) => {
      const exists = prev.some((p) => p.id === payload.id);
      if (exists) return prev.map((p) => (p.id === payload.id ? payload : p));
      return [payload, ...prev];
    });

    upsertProduct(payload).catch(() => {
      // ignore
    });

    setModalOpen(false);
  };

  const remove = (id) => {
    if (!window.confirm('Supprimer ce produit ?')) return;
    setProducts((prev) => prev.filter((p) => p.id !== id));
    deleteProduct(id).catch(() => {
      // ignore
    });
  };

  const toggleStatus = (id) => {
    const target = products.find((p) => p.id === id);
    if (!target) return;
    const nextStatus = target.status === 'active' ? 'archived' : 'active';
    const payload = { ...target, status: nextStatus };
    setProducts((prev) => prev.map((p) => (p.id === id ? payload : p)));
    upsertProduct(payload).catch((e) => {
      console.error('[Admin] toggleStatus error:', e);
      window.alert('Erreur Firebase : le statut n\'a pas été sauvegardé.\n\n' + (e?.message || 'Erreur inconnue'));
    });
  };

  return (
    <div className="admin-page-view">
      <div className="admin-section">
        <div className="admin-section-header">
          <div className="admin-section-title">Produits</div>
          <div className="admin-section-actions">
            <div className="admin-search">
              <Search size={16} />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher…" />
            </div>
            <button type="button" className="admin-btn admin-btn-primary" onClick={openCreate}>
              <Plus size={16} />
              Ajouter
            </button>
          </div>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Produit</th>
                <th>Catégorie</th>
                <th>Prix</th>
                <th>Stock</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((p) => (
                <tr key={p.id}>
                  <td>
                    <button type="button" className="admin-row-link" onClick={() => openDetail(p.id)}>
                      <div className="admin-product-cell">
                        <img className="admin-product-img" src={p.image || p.images?.[0] || '/produits/produit (1).webp'} alt={p.name} />
                        <div>
                          <div className="admin-product-name">{p.name}</div>
                          <div className="admin-product-sku">Réf : {p.reference || p.id}</div>
                        </div>
                      </div>
                    </button>
                  </td>
                  <td>{p.category}</td>
                  <td>{formatPriceEUR(p.priceCents)}</td>
                  <td>{p.stock}</td>
                  <td>
                    <StatusBadge value={p.status} />
                  </td>
                  <td>
                    <div className="admin-actions">
                      <button type="button" className="admin-action-btn" title="Voir" onClick={() => openDetail(p.id)}>
                        <Eye size={14} />
                      </button>
                      <button type="button" className="admin-action-btn" title="Modifier" onClick={() => openEdit(p.id)}>
                        <Pencil size={14} />
                      </button>
                      <button
                        type="button"
                        className={`admin-action-btn${p.status === 'active' ? ' active' : ' inactive'}`}
                        title={p.status === 'active' ? 'Désactiver' : 'Activer'}
                        onClick={() => toggleStatus(p.id)}
                      >
                        <Power size={14} />
                      </button>
                      <button type="button" className="admin-action-btn" title="Supprimer" onClick={() => remove(p.id)}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 ? (
            <div className="admin-empty">Aucun résultat.</div>
          ) : null}

          {filtered.length > pageSize ? (
            <div className="admin-pagination">
              <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setPage(1)} disabled={safePage === 1}>
                «
              </button>
              <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={safePage === 1}>
                ‹
              </button>
              <div className="admin-page-indicator">
                Page {safePage} / {totalPages}
              </div>
              <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={safePage === totalPages}>
                ›
              </button>
              <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setPage(totalPages)} disabled={safePage === totalPages}>
                »
              </button>
            </div>
          ) : null}
        </div>
      </div>

      <Drawer
        title={editing ? 'Modifier le produit' : 'Ajouter un produit'}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        footer={
          <>
            <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setModalOpen(false)}>
              Annuler
            </button>
            <button type="button" className="admin-btn admin-btn-primary" onClick={save}>
              Enregistrer
            </button>
          </>
        }
      >
        <div className="admin-form-grid">
          <div className="admin-form-group">
            <label>Marque</label>
            <input value={form.brand} onChange={(e) => setForm((s) => ({ ...s, brand: e.target.value }))} />
          </div>
          <div className="admin-form-group admin-form-full">
            <label>Nom</label>
            <input value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} />
          </div>
          <div className="admin-form-group">
            <label>Référence</label>
            <input value={form.reference} onChange={(e) => setForm((s) => ({ ...s, reference: e.target.value }))} />
          </div>
          <div className="admin-form-group">
            <label>Catégorie</label>
            <input value={form.category} onChange={(e) => setForm((s) => ({ ...s, category: e.target.value }))} />
          </div>
          <div className="admin-form-group">
            <label>Prix (€)</label>
            <input
              type="number"
              step="0.01"
              inputMode="decimal"
              value={form.priceEuros}
              onChange={(e) => setForm((s) => ({ ...s, priceEuros: e.target.value }))}
            />
          </div>
          <div className="admin-form-group">
            <label>Stock</label>
            <input type="number" value={form.stock} onChange={(e) => setForm((s) => ({ ...s, stock: e.target.value }))} />
          </div>
          <div className="admin-form-group">
            <label>Statut</label>
            <select value={form.status} onChange={(e) => setForm((s) => ({ ...s, status: e.target.value }))}>
              <option value="active">Actif</option>
              <option value="draft">Brouillon</option>
              <option value="archived">Archivé</option>
            </select>
          </div>
          <div className="admin-form-group admin-form-full">
            <label>Image (URL)</label>
            <input value={form.image} onChange={(e) => setForm((s) => ({ ...s, image: e.target.value }))} />
          </div>
          <div className="admin-form-group admin-form-full">
            <button
              type="button"
              className="admin-btn admin-btn-secondary"
              onClick={() => (productFileRef.current ? productFileRef.current.click() : null)}
              disabled={imageBusy}
            >
              {imageBusy ? 'Upload…' : 'Uploader une image'}
            </button>
            <input
              ref={productFileRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={async (e) => {
                const file = e?.target?.files?.[0];
                if (!file) return;
                try {
                  setImageBusy(true);
                  const url = await uploadImageToCloudinary(file);
                  setForm((s) => ({ ...s, image: url }));
                } catch {
                  // ignore
                } finally {
                  setImageBusy(false);
                  if (productFileRef.current) productFileRef.current.value = '';
                }
              }}
            />
          </div>
          <div className="admin-form-group admin-form-full">
            <label>Description</label>
            <textarea value={form.description} onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))} rows={4} />
          </div>

          <div className="admin-form-group admin-form-full">
            <label>Détails complémentaires</label>
            <textarea value={form.details} onChange={(e) => setForm((s) => ({ ...s, details: e.target.value }))} rows={3} />
          </div>

          <div className="admin-form-group admin-form-full">
            <label>Livraison & retours</label>
            <textarea value={form.delivery} onChange={(e) => setForm((s) => ({ ...s, delivery: e.target.value }))} rows={3} />
          </div>

          <div className="admin-form-group">
            <label>Quantité nette</label>
            <input
              value={form.netQuantity}
              onChange={(e) => setForm((s) => ({ ...s, netQuantity: e.target.value }))}
              placeholder="ex: 200ml"
            />
          </div>

          <div className="admin-form-group">
            <label>Type de peau</label>
            <input
              value={form.skinType}
              onChange={(e) => setForm((s) => ({ ...s, skinType: e.target.value }))}
              placeholder="ex: Tout type de peau"
            />
          </div>

          <div className="admin-form-group admin-form-full">
            <label>Spécifications (1 par ligne: label: valeur)</label>
            <textarea
              value={form.specsText}
              onChange={(e) => setForm((s) => ({ ...s, specsText: e.target.value }))}
              rows={5}
              placeholder={'Marque: Botan\nCatégorie: Autobronzants & solaires'}
            />
          </div>
        </div>
      </Drawer>
    </div>
  );
}

function AdminBlog({ posts, setPosts, onOpenDetail }) {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const filtered = useMemo(() => {
    if (!query.trim()) return posts;
    const q = query.trim().toLowerCase();
    return posts.filter((p) => [p.title, p.author, p.category, p.status].join(' ').toLowerCase().includes(q));
  }, [posts, query]);

  useEffect(() => {
    setPage(1);
  }, [query, posts.length]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const paged = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, safePage]);

  const openCreate = () => {
    window.location.hash = '#admin?view=post-edit&id=new';
  };

  const openEdit = (id) => {
    window.location.hash = `#admin?view=post-edit&id=${encodeURIComponent(id)}`;
  };

  const openDetail = (id) => {
    if (typeof onOpenDetail === 'function') onOpenDetail(id);
  };

  const remove = (id) => {
    if (!window.confirm('Supprimer cet article ?')) return;
    setPosts((prev) => prev.filter((p) => p.id !== id));
    deletePost(id).catch(() => {
      // ignore
    });
  };

  return (
    <div className="admin-page-view">
      <div className="admin-section">
        <div className="admin-section-header">
          <div className="admin-section-title">Articles</div>
          <div className="admin-section-actions">
            <div className="admin-search">
              <Search size={16} />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher…" />
            </div>
            <button type="button" className="admin-btn admin-btn-primary" onClick={openCreate}>
              <Plus size={16} />
              Nouveau
            </button>
          </div>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Titre</th>
                <th>Auteur</th>
                <th>Catégorie</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((p) => (
                <tr key={p.id}>
                  <td>
                    <button type="button" className="admin-row-link" onClick={() => openDetail(p.id)}>
                      <div className="admin-post-title">{p.title}</div>
                      <div className="admin-post-excerpt">{p.excerpt}</div>
                    </button>
                  </td>
                  <td>{p.author}</td>
                  <td>{p.category}</td>
                  <td>{formatDateShort(p.date)}</td>
                  <td>
                    <StatusBadge value={p.status} />
                  </td>
                  <td>
                    <div className="admin-actions">
                      <button type="button" className="admin-action-btn" title="Voir" onClick={() => openDetail(p.id)}>
                        <Eye size={14} />
                      </button>
                      <button type="button" className="admin-action-btn" title="Modifier" onClick={() => openEdit(p.id)}>
                        <Pencil size={14} />
                      </button>
                      <button type="button" className="admin-action-btn" title="Supprimer" onClick={() => remove(p.id)}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length > pageSize ? (
            <div className="admin-pagination">
              <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setPage(1)} disabled={safePage === 1}>
                «
              </button>
              <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={safePage === 1}>
                ‹
              </button>
              <div className="admin-page-indicator">
                Page {safePage} / {totalPages}
              </div>
              <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={safePage === totalPages}>
                ›
              </button>
              <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setPage(totalPages)} disabled={safePage === totalPages}>
                »
              </button>
            </div>
          ) : null}
        </div>
      </div>

    </div>
  );
}

function AdminPostEditor({ userEmail, posts, setPosts, postId, onBack }) {
  const existing = useMemo(() => posts.find((p) => p.id === postId) || null, [posts, postId]);
  const isNew = postId === 'new' || !postId;

  const [saving, setSaving] = useState(false);
  const [mediaBusy, setMediaBusy] = useState(false);
  const [form, setForm] = useState(() => ({
    title: existing?.title || '',
    author: existing?.author || 'Mey Beauty',
    category: existing?.category || 'Wellness',
    status: existing?.status || 'draft',
    excerpt: existing?.excerpt || '',
    image: existing?.image || '',
    contentHtml: existing?.contentHtml || '',
  }));

  const fileInputRef = useRef(null);
  const coverFileRef = useRef(null);
  const quillRef = useRef(null);
  const draftIdRef = useRef(isNew ? uid('post') : postId);

  const insertImageIntoEditor = (url) => {
    try {
      const editor = quillRef.current?.getEditor?.();
      if (!editor) return;
      const range = editor.getSelection(true);
      const index = typeof range?.index === 'number' ? range.index : editor.getLength();
      editor.insertEmbed(index, 'image', url, 'user');
      editor.setSelection(index + 1);
    } catch {
      // ignore
    }
  };

  const insertHtmlIntoEditor = (html) => {
    try {
      const editor = quillRef.current?.getEditor?.();
      if (!editor) return;
      const range = editor.getSelection(true);
      const index = typeof range?.index === 'number' ? range.index : editor.getLength();
      editor.clipboard.dangerouslyPasteHTML(index, html);
      editor.setSelection(index + 1);
    } catch {
      // ignore
    }
  };

  const quillModules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          ['bold', 'italic', 'underline'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['link', 'image'],
          ['clean'],
        ],
        handlers: {
          image: () => {
            const mode = window.prompt('Image: 1 = URL, 2 = Upload fichier', '1');
            if (mode === '2') {
              if (fileInputRef.current) fileInputRef.current.click();
              return;
            }
            const url = window.prompt('URL de l\'image (https://...)');
            if (!url) return;
            insertImageIntoEditor(String(url).trim());
          },
        },
      },
    }),
    []
  );

  const quillFormats = useMemo(
    () => ['header', 'bold', 'italic', 'underline', 'list', 'bullet', 'link', 'image'],
    []
  );

  useEffect(() => {
    setForm({
      title: existing?.title || '',
      author: existing?.author || 'Mey Beauty',
      category: existing?.category || 'Wellness',
      status: existing?.status || 'draft',
      excerpt: existing?.excerpt || '',
      image: existing?.image || '',
      contentHtml: existing?.contentHtml || '',
    });
  }, [existing?.id]);

  const onPickMediaFile = async (e) => {
    const file = e?.target?.files?.[0];
    if (!file) return;
    try {
      setMediaBusy(true);
      const url = await uploadImageToCloudinary(file);
      setForm((p) => ({
        ...p,
        image: p.image || url,
      }));
      insertImageIntoEditor(String(url).trim());
    } catch {
      // ignore
    } finally {
      setMediaBusy(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const onPickCoverFile = async (e) => {
    const file = e?.target?.files?.[0];
    if (!file) return;
    try {
      setMediaBusy(true);
      const url = await uploadImageToCloudinary(file);
      setForm((p) => ({
        ...p,
        image: String(url || '').trim(),
      }));
    } catch {
      // ignore
    } finally {
      setMediaBusy(false);
      if (coverFileRef.current) coverFileRef.current.value = '';
    }
  };

  const save = async () => {
    if (saving) return;
    setSaving(true);
    try {
      const title = (form.title || '').trim() || 'Article';
      const slug = generateSlug(title);
      const payload = {
        id: isNew ? draftIdRef.current : postId,
        title,
        slug,
        author: (form.author || '').trim() || 'Mey Beauty',
        category: (form.category || '').trim() || 'Wellness',
        status: form.status || 'draft',
        date: existing?.date || new Date().toISOString(),
        excerpt: form.excerpt || '',
        image: (form.image || '').trim(),
        contentHtml: form.contentHtml || '',
      };

      setPosts((prev) => {
        const exists = prev.some((p) => p.id === payload.id);
        if (exists) return prev.map((p) => (p.id === payload.id ? payload : p));
        return [payload, ...prev];
      });
      await upsertPost(payload);
      if (typeof onBack === 'function') onBack(payload.id);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-section admin-editor">
      <div className="admin-editor-top">
        <div>
          <div className="admin-section-title">{isNew ? 'Créer un article' : "Modifier l'article"}</div>
          <div className="admin-editor-sub">Melanie · Blog</div>
        </div>
        <div className="admin-editor-top-actions">
          <button type="button" className="admin-btn admin-btn-secondary" onClick={() => (typeof onBack === 'function' ? onBack() : null)}>
            Retour
          </button>
          <button type="button" className="admin-btn admin-btn-primary" onClick={save} disabled={saving}>
            {saving ? 'Enregistrement…' : 'Enregistrer'}
          </button>
        </div>
      </div>

      <div className="admin-editor-grid">
        <div className="admin-editor-main">
          <div className="admin-editor-box">
            <input
              className="admin-editor-title"
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              placeholder="Titre de l’article"
            />
          </div>

          <div className="admin-editor-box">
            <div className="admin-editor-toolbar">
              <button
                type="button"
                className="admin-editor-tool"
                aria-label="Médias"
                onClick={() => (fileInputRef.current ? fileInputRef.current.click() : null)}
                disabled={mediaBusy}
              >
                {mediaBusy ? 'Upload…' : '+Image'}
              </button>
              <div className="admin-editor-toolbar-blocks">
                <button type="button" className="admin-editor-tool" onClick={() => insertHtmlIntoEditor('<h2 class="blog-article-h2">Titre de section</h2>')}>
                  +H2
                </button>
                <button type="button" className="admin-editor-tool" onClick={() => insertHtmlIntoEditor('<p class="blog-article-p">Votre paragraphe…</p>')}>
                  +P
                </button>
                <button
                  type="button"
                  className="admin-editor-tool"
                  onClick={() =>
                    insertHtmlIntoEditor(
                      '<div class="blog-article-quote"><p>Votre citation inspirante…</p><cite>- Mey Beauty</cite></div>'
                    )
                  }
                >
                  +Citation
                </button>
                <button
                  type="button"
                  className="admin-editor-tool"
                  onClick={() =>
                    insertHtmlIntoEditor(
                      '<ul class="blog-article-list">' +
                        '<li>Point 1</li><li>Point 2</li><li>Point 3</li><li>Point 4</li>' +
                      '</ul>'
                    )
                  }
                >
                  +Liste
                </button>
                <button
                  type="button"
                  className="admin-editor-tool"
                  onClick={() =>
                    insertHtmlIntoEditor(
                      '<div class="blog-article-img-row">' +
                        '<img src="" alt="" />' +
                        '<img src="" alt="" />' +
                      '</div>'
                    )
                  }
                  
                >
                  +2 img
                </button>
              </div>
              <div className="admin-editor-toolbar-right">
                <span className="admin-editor-pill">Visuel</span>
              </div>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={onPickMediaFile} />
            <div className="admin-quill">
              <ReactQuill
                ref={quillRef}
                theme="snow"
                value={form.contentHtml}
                onChange={(val) => setForm((p) => ({ ...p, contentHtml: val }))}
                placeholder="Rédige ton article ici…"
                modules={quillModules}
                formats={quillFormats}
              />
            </div>
          </div>
        </div>

        <aside className="admin-editor-side">
          <div className="admin-editor-card">
            <div className="admin-editor-card-title">Publication</div>
            <div className="admin-form-grid">
              <div className="admin-form-group" style={{ gridColumn: '1 / -1' }}>
                <label>Statut</label>
                <select value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}>
                  <option value="draft">Brouillon</option>
                  <option value="published">Publié</option>
                </select>
              </div>
              <div className="admin-form-group" style={{ gridColumn: '1 / -1' }}>
                <label>Catégorie</label>
                <input value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} />
              </div>
              <div className="admin-form-group" style={{ gridColumn: '1 / -1' }}>
                <label>Auteur</label>
                <input value={form.author} onChange={(e) => setForm((p) => ({ ...p, author: e.target.value }))} />
              </div>
            </div>
          </div>

          <div className="admin-editor-card">
            <div className="admin-editor-card-title">Image</div>
            <div className="admin-form-group">
              <label>URL</label>
              <input value={form.image} onChange={(e) => setForm((p) => ({ ...p, image: e.target.value }))} placeholder="/image.jpg" />
            </div>
            <div className="admin-form-group">
              <button
                type="button"
                className="admin-btn admin-btn-secondary"
                onClick={() => (coverFileRef.current ? coverFileRef.current.click() : null)}
                disabled={mediaBusy}
              >
                {mediaBusy ? 'Upload…' : "Remplacer l'image"}
              </button>
              <input ref={coverFileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={onPickCoverFile} />
            </div>
            {form.image ? (
              <div className="admin-cover-preview">
                <img src={form.image} alt="Aperçu" />
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary"
                  onClick={() => setForm((p) => ({ ...p, image: '' }))}
                >
                  Supprimer
                </button>
              </div>
            ) : null}
          </div>

          <div className="admin-editor-card">
            <div className="admin-editor-card-title">Extrait</div>
            <div className="admin-form-group">
              <textarea
                value={form.excerpt}
                onChange={(e) => setForm((p) => ({ ...p, excerpt: e.target.value }))}
                rows={5}
                placeholder="Résumé…"
              />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function AdminDashboard({ products, posts, orders, userEmail, onGoProducts, onGoBlog }) {
  const stats = useMemo(() => {
    const totalRevenueCents = (orders || []).reduce((sum, o) => sum + (o.totalCents || 0), 0);
    const totalOrders = (orders || []).length;
    const activeProducts = products.length;
    const publishedPosts = posts.filter((p) => p.status === 'published').length;
    return {
      revenue: formatPriceEUR(totalRevenueCents),
      orders: totalOrders.toLocaleString('fr-FR'),
      products: activeProducts.toLocaleString('fr-FR'),
      posts: publishedPosts.toLocaleString('fr-FR'),
    };
  }, [products, posts, orders]);

  return (
    <div className="admin-page-view">
      <div className="admin-welcome-banner">
        <div className="admin-welcome-content">
          <div className="admin-welcome-title">Bienvenue, Melanie </div>
          <div className="admin-welcome-subtitle">
            Voici un aperçu de vos performances aujourd’hui.
          </div>
          <div className="admin-welcome-actions">
            <button type="button" className="admin-btn admin-btn-primary" onClick={onGoProducts}>
              <Plus size={16} />
              Nouveau Produit
            </button>
            <button type="button" className="admin-btn admin-btn-secondary" onClick={onGoBlog}>
              <FileText size={16} />
              Nouvel Article
            </button>
          </div>
        </div>
        <div
          className="admin-welcome-illustration"
          aria-hidden="true"
        />
      </div>

      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-label">Chiffre d’affaires</div>
          <div className="admin-stat-value">{stats.revenue}</div>
          <div className="admin-stat-sub">Ce mois‑ci</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-label">Commandes</div>
          <div className="admin-stat-value">{stats.orders}</div>
          <div className="admin-stat-sub">Ce mois‑ci</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-label">Produits</div>
          <div className="admin-stat-value">{stats.products}</div>
          <div className="admin-stat-sub">Catalogue actif</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-label">Articles publiés</div>
          <div className="admin-stat-value">{stats.posts}</div>
          <div className="admin-stat-sub">Blog</div>
        </div>
      </div>

      <div className="admin-section">
        <div className="admin-section-header">
          <div className="admin-section-title">Raccourcis</div>
        </div>
        <div className="admin-cards-row">
          <a
            className="admin-mini-card admin-mini-card-media"
            href="#admin?view=products"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200&q=80')",
            }}
          >
            <ShoppingBag size={18} />
            <div>
              <div className="admin-mini-card-title">Gérer les produits</div>
              <div className="admin-mini-card-sub">Ajouter / modifier</div>
            </div>
          </a>
          <a
            className="admin-mini-card admin-mini-card-media"
            href="#admin?view=orders"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=80')",
            }}
          >
            <ReceiptText size={18} />
            <div>
              <div className="admin-mini-card-title">Voir les commandes</div>
              <div className="admin-mini-card-sub">Suivi & statut</div>
            </div>
          </a>
          <a
            className="admin-mini-card admin-mini-card-media"
            href="#admin?view=blog"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&q=80')",
            }}
          >
            <FileText size={18} />
            <div>
              <div className="admin-mini-card-title">Blog</div>
              <div className="admin-mini-card-sub">Publier des articles</div>
            </div>
          </a>
        </div>
      </div>

      {import.meta.env.DEV && <AdminMaintenanceSection />}
    </div>
  );
}

// Context for admin data sharing
const AdminContext = createContext({ posts: [], products: [], orders: [] });

function AdminMaintenanceSection() {
  const { posts } = useContext(AdminContext);
  const [seedBusy, setSeedBusy] = useState(false);
  const [seedMsg, setSeedMsg] = useState('');

  const runMigrateSlugs = async () => {
    if (seedBusy) return;
    setSeedMsg('');
    setSeedBusy(true);
    try {
      const res = await migratePostsWithSlugs(posts);
      setSeedMsg(`Migration slugs: ${res.updated} mis à jour, ${res.skipped} déjà OK${res.errors.length > 0 ? ', ' + res.errors.length + ' erreurs' : ''}`);
    } catch (e) {
      setSeedMsg(e?.message || 'Migration impossible');
    } finally {
      setSeedBusy(false);
      setTimeout(() => setSeedMsg(''), 6000);
    }
  };

  const runSyncPosts = async () => {
    if (seedBusy) return;
    setSeedMsg('');
    setSeedBusy(true);
    try {
      const seedPosts = seedAdminPosts().map((p) => ({
        id: p.id,
        title: p.title,
        author: p.author || 'Mey Beauty',
        category: p.category || 'Wellness',
        status: 'published',
        date: p.date,
        excerpt: p.excerpt || '',
        image: p.image || '',
        contentHtml: p.contentHtml || '<p>Votre contenu ici…</p>',
      }));

      const res = await seedPostsMerge(seedPosts);
      setSeedMsg(`Synchronisation articles: ${res.count}`);
    } catch (e) {
      setSeedMsg(e?.message || 'Sync impossible');
    } finally {
      setSeedBusy(false);
      setTimeout(() => setSeedMsg(''), 4000);
    }
  };

  const runForceSyncProducts = async () => {
    if (seedBusy) return;
    setSeedMsg('');
    setSeedBusy(true);
    try {
      const seedProducts = catalogProducts.map((p) => ({
        id: p.id,
        reference: p.reference || p.id || '',
        brand: p.brand || 'LPG',
        category: p.category || '-',
        name: p.name,
        description: p.description || '',
        details: p.details || '',
        delivery: p.delivery || '',
        netQuantity: p.netQuantity || '',
        skinType: p.skinType || '',
        priceCents: p.priceCents || 0,
        currency: p.currency || 'EUR',
        images: Array.isArray(p.images) ? p.images : [],
        image: p.images?.[0] || '',
        status: 'active',
        tags: Array.isArray(p.tags) ? p.tags : [],
      }));

      const res = await syncAllProducts(seedProducts);
      setSeedMsg(`Synchronisation produits: ${res.count} produits`);
    } catch (e) {
      setSeedMsg(e?.message || 'Sync impossible');
    } finally {
      setSeedBusy(false);
      setTimeout(() => setSeedMsg(''), 4000);
    }
  };

  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <div className="admin-section-title">Maintenance</div>
      </div>
      <div className="admin-cards-row">
        <button
          type="button"
          className="admin-mini-card"
          onClick={runMigrateSlugs}
          disabled={seedBusy}
        >
          <Database size={18} />
          <div>
            <div className="admin-mini-card-title">Migrer les slugs</div>
            <div className="admin-mini-card-sub">Ajouter slugs SEO aux articles</div>
          </div>
        </button>
        <button
          type="button"
          className="admin-mini-card"
          onClick={runSyncPosts}
          disabled={seedBusy}
        >
          <RefreshCw size={18} />
          <div>
            <div className="admin-mini-card-title">Sync articles</div>
            <div className="admin-mini-card-sub">Synchroniser avec le seed</div>
          </div>
        </button>
        <button
          type="button"
          className="admin-mini-card"
          onClick={runForceSyncProducts}
          disabled={seedBusy}
        >
          <RefreshCw size={18} />
          <div>
            <div className="admin-mini-card-title">Sync produits</div>
            <div className="admin-mini-card-sub">Synchroniser le catalogue depuis le fichier seed</div>
          </div>
        </button>
      </div>
      {seedMsg && <div className="admin-seed-msg">{seedMsg}</div>}
    </div>
  );
}

function parseAdminState(hash) {
  const idx = hash.indexOf('?');
  const query = idx >= 0 ? hash.slice(idx + 1) : '';
  const params = new URLSearchParams(query);
  return {
    view: params.get('view') || 'dashboard',
    id: params.get('id') || '',
    edit: params.get('edit') || '',
  };
}

export default function AdminPage() {
  const [state, setState] = useState(() => parseAdminState(window.location.hash || ''));
  const [products, setProducts] = usePersistentState(LS_PRODUCTS, seedAdminProducts);
  const [posts, setPosts] = usePersistentState(LS_POSTS, seedAdminPosts);
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    const saved = String(window.localStorage.getItem(LS_THEME) || '').trim().toLowerCase();
    return saved === 'dark' ? 'dark' : 'light';
  });

  useEffect(() => {
    const onHash = () => setState(parseAdminState(window.location.hash || ''));
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => {
    setMobileNavOpen(false);
  }, [state.view, state.id]);

  useEffect(() => {
    try {
      window.localStorage.setItem(LS_THEME, theme);
    } catch {
      // ignore
    }
  }, [theme]);

  useEffect(() => {
    if (!user) return;

    const unsubProducts = listenProducts(
      (list) => {
        if (Array.isArray(list)) setProducts(list);
      },
      () => {
        // ignore
      }
    );

    const unsubPosts = listenPosts(
      (list) => {
        if (Array.isArray(list)) setPosts(list);
      },
      () => {
        // ignore
      }
    );

    const unsubOrders = listenOrders(
      (list) => {
        if (Array.isArray(list)) setOrders(list);
      },
      () => {
        // ignore
      }
    );

    return () => {
      unsubProducts();
      unsubPosts();
      unsubOrders();
    };
  }, [user, setProducts, setPosts]);

  const view = state.view;
  const selectedId = state.id;
  const editIdFromNav = state.edit;
  const title =
    view === 'products'
      ? 'Produits'
      : view === 'product'
        ? 'Produit'
        : view === 'orders'
          ? 'Commandes'
          : view === 'blog'
            ? 'Blog'
            : view === 'post-edit'
              ? 'Éditeur'
            : view === 'post'
              ? 'Article'
              : 'Dashboard';

  const selectedProduct = useMemo(() => products.find((p) => p.id === selectedId) || null, [products, selectedId]);
  const selectedPost = useMemo(() => posts.find((p) => p.id === selectedId) || null, [posts, selectedId]);

  const [seedBusy, setSeedBusy] = useState(false);
  const [seedMsg, setSeedMsg] = useState('');

  const [topbarQuery, setTopbarQuery] = useState('');

  const effectiveTopbarQuery = String(topbarQuery || '').trim();

  const runSeedIfEmpty = async () => {
    if (seedBusy) return;
    setSeedMsg('');
    setSeedBusy(true);
    try {
      const seedProducts = (catalogProducts || []).map((p) => ({
        id: p.id,
        brand: p.brand || 'Mey Beauty',
        category: p.category || '-',
        name: p.name,
        description: p.description || '',
        priceCents: p.priceCents || 0,
        currency: p.currency || 'EUR',
        images: Array.isArray(p.images) ? p.images : [],
        image: p.images?.[0] || '',
        status: 'active',
      }));
      const seedPosts = seedAdminPosts().map((p) => ({
        id: p.id,
        title: p.title,
        author: p.author || 'Mey Beauty',
        category: p.category || 'Wellness',
        status: p.status || 'published',
        date: p.date || new Date().toISOString(),
        excerpt: p.excerpt || '',
        image: p.image || '',
        contentHtml: p.contentHtml || '<p>Votre contenu ici…</p>',
      }));

      const [prodRes, postRes] = await Promise.all([
        seedProductsIfEmpty(seedProducts),
        seedPostsIfEmpty(seedPosts),
      ]);
      setSeedMsg(
        `Seed terminé. Produits: ${prodRes.seeded ? prodRes.count : 0} | Articles: ${postRes.seeded ? postRes.count : 0}`
      );
    } catch (e) {
      setSeedMsg(e?.message || 'Seed impossible');
    } finally {
      setSeedBusy(false);
      setTimeout(() => setSeedMsg(''), 4000);
    }
  };

  const runSyncPosts = async () => {
    if (seedBusy) return;
    setSeedMsg('');
    setSeedBusy(true);
    try {
      const seedPosts = seedAdminPosts().map((p) => ({
        id: p.id,
        title: p.title,
        author: p.author || 'Mey Beauty',
        category: p.category || 'Wellness',
        status: p.status || 'published',
        date: p.date || new Date().toISOString(),
        excerpt: p.excerpt || '',
        image: p.image || '',
        contentHtml: p.contentHtml || '<p>Votre contenu ici…</p>',
      }));

      const res = await seedPostsMerge(seedPosts);
      setSeedMsg(`Synchronisation articles: ${res.count}`);
    } catch (e) {
      setSeedMsg(e?.message || 'Sync impossible');
    } finally {
      setSeedBusy(false);
      setTimeout(() => setSeedMsg(''), 4000);
    }
  };

  const runMigrateSlugs = async () => {
    if (seedBusy) return;
    setSeedMsg('');
    setSeedBusy(true);
    try {
      const res = await migratePostsWithSlugs(posts);
      setSeedMsg(`Migration slugs: ${res.updated} mis à jour, ${res.skipped} déjà OK${res.errors.length > 0 ? ', ' + res.errors.length + ' erreurs' : ''}`);
    } catch (e) {
      setSeedMsg(e?.message || 'Migration impossible');
    } finally {
      setSeedBusy(false);
      setTimeout(() => setSeedMsg(''), 6000);
    }
  };

  const navItems = [
    { key: 'dashboard', label: 'Tableau de bord', icon: <LayoutDashboard className="admin-nav-icon" /> },
    { key: 'products', label: 'Produits', icon: <ShoppingBag className="admin-nav-icon" /> },
    { key: 'promotions', label: 'Promotions', icon: <Tag className="admin-nav-icon" /> },
    { key: 'orders', label: 'Commandes', icon: <ReceiptText className="admin-nav-icon" /> },
    { key: 'blog', label: 'Blog', icon: <FileText className="admin-nav-icon" /> },
  ];

  return (
    <main className="admin-page" data-theme={theme}>
      <AdminAuth onReady={setUser} />
      {!user ? null : (
        <div className="admin-container">
          <div
            className={`admin-mobile-overlay${mobileNavOpen ? ' open' : ''}`}
            onClick={() => setMobileNavOpen(false)}
            aria-hidden="true"
          />
          <aside className={`admin-sidebar${mobileNavOpen ? ' open' : ''}`}>
            <div className="admin-sidebar-header">
              <div className="admin-logo">
                {theme === 'dark' ? (
                  <span className="admin-logo-text">Mey Beauty</span>
                ) : (
                  <img className="admin-logo-img" src="/mey-beauty.png" alt="Mey Beauty" loading="lazy" />
                )}
                <span className="admin-badge">ADMIN</span>
              </div>
            </div>

            <nav className="admin-sidebar-nav">
              <div className="admin-nav-section-title">E‑Commerce</div>
              {navItems.map((it) => (
                <a
                  key={it.key}
                  className={`admin-nav-link${view === it.key ? ' active' : ''}${it.disabled ? ' disabled' : ''}`}
                  href={it.disabled ? undefined : `#admin?view=${encodeURIComponent(it.key)}`}
                  onClick={(e) => {
                    if (it.disabled) {
                      e.preventDefault();
                      return;
                    }
                    e.preventDefault();
                    setMobileNavOpen(false);
                    setAdminHash({ view: it.key });
                  }}
                >
                  {it.icon}
                  <span>{it.label}</span>
                  {it.key === 'products' ? <span className="admin-nav-pill">{products.length}</span> : null}
                </a>
              ))}

              <div className="admin-nav-section-title">Site</div>
              <a
                className="admin-nav-link"
                href="#home"
                onClick={() => setMobileNavOpen(false)}
              >
                Retour au site
              </a>
            </nav>

            <div className="admin-sidebar-footer">
              <div className="admin-user-card">
                <button type="button" className="admin-user-logout" onClick={() => signOut(auth)}>
                  Déconnexion
                </button>
                <div className="admin-user-row">
                  <img
                    className="admin-user-avatar-img"
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80"
                    alt="Admin"
                    loading="lazy"
                  />
                  <div className="admin-user-info">
                    <div className="admin-user-name">Melanie</div>
                    <div className="admin-user-role">Administrateur</div>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <section className="admin-main">
            <div className="admin-topbar">
              <div className="admin-topbar-left">
                <button
                  type="button"
                  className="admin-icon-btn admin-mobile-menu-btn"
                  aria-label="Ouvrir le menu"
                  onClick={() => setMobileNavOpen(true)}
                >
                  <Menu size={18} />
                </button>
                <div className="admin-topbar-title">{title}</div>
                <div className="admin-topbar-breadcrumb">Accueil › <span>{title}</span></div>
              </div>
              <div className="admin-topbar-actions">
                <div className="admin-topbar-search">
                  <Search size={18} />
                  <input
                    placeholder="Rechercher..."
                    value={topbarQuery}
                    onChange={(e) => setTopbarQuery(e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  className="admin-icon-btn"
                  aria-label={theme === 'dark' ? 'Passer en thème clair' : 'Passer en thème sombre'}
                  onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
                >
                  {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                </button>
                <ProfileMenu userEmail={user?.email || ''} onLogout={() => signOut(auth)} />
              </div>
            </div>

          <div className="admin-content">
            {view === 'products' ? (
              <AdminProducts
                products={
                  effectiveTopbarQuery
                    ? products.filter((p) => {
                        const hay = [p.name, p.sku, p.category, p.status].filter(Boolean).join(' ').toLowerCase();
                        return hay.includes(effectiveTopbarQuery.toLowerCase());
                      })
                    : products
                }
                setProducts={setProducts}
                onOpenDetail={(id) => setAdminHash({ view: 'product', id })}
                editIdFromNav={editIdFromNav}
                clearEditIdFromNav={() => setAdminHash({ view: 'products' })}
              />
            ) : view === 'promotions' ? (
              <AdminPromotions products={products} externalQuery={effectiveTopbarQuery} />
            ) : view === 'product' ? (
              <AdminProductDetail
                product={selectedProduct}
                onBack={() => setAdminHash({ view: 'products' })}
                onEdit={() => setAdminHash({ view: 'products', edit: selectedId })}
              />
            ) : view === 'orders' ? (
              <AdminOrders />
            ) : view === 'blog' ? (
              <AdminBlog
                posts={
                  effectiveTopbarQuery
                    ? posts.filter((p) =>
                        [p.title, p.author, p.category, p.status]
                          .filter(Boolean)
                          .join(' ')
                          .toLowerCase()
                          .includes(effectiveTopbarQuery.toLowerCase())
                      )
                    : posts
                }
                setPosts={setPosts}
                onOpenDetail={(id) => setAdminHash({ view: 'post', id })}
              />
            ) : view === 'post-edit' ? (
              <AdminPostEditor
                userEmail={user?.email || ''}
                posts={posts}
                setPosts={setPosts}
                postId={selectedId}
                onBack={() => setAdminHash({ view: 'blog' })}
              />
            ) : view === 'post' ? (
              <AdminPostDetail
                post={selectedPost}
                onBack={() => setAdminHash({ view: 'blog' })}
                onEdit={() => setAdminHash({ view: 'post-edit', id: selectedId })}
              />
            ) : (
              <AdminContext.Provider value={{ posts, products, orders }}>
                <AdminDashboard
                  products={products}
                  posts={posts}
                  orders={orders}
                  userEmail={user?.email || ''}
                  onGoProducts={() => setAdminHash({ view: 'products' })}
                  onGoBlog={() => setAdminHash({ view: 'blog' })}
                />
              </AdminContext.Provider>
            )}
          </div>
        </section>
      </div>
      )}
    </main>
  );
}

function ProfileMenu({ userEmail, onLogout }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      const root = document.querySelector('[data-profile-menu-root="1"]');
      if (root && !root.contains(e.target)) setOpen(false);
    };
    const onEsc = (e) => (e.key === 'Escape' ? setOpen(false) : null);
    document.addEventListener('mousedown', onDoc);
    window.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      window.removeEventListener('keydown', onEsc);
    };
  }, [open]);

  return (
    <div className="admin-profile-menu" data-profile-menu-root="1">
      <button type="button" className="admin-icon-btn" aria-label="Profil" onClick={() => setOpen((v) => !v)}>
        <User size={18} />
      </button>
      {open ? (
        <div className="admin-profile-dropdown" role="menu">
              <div className="admin-profile-head">
                <div className="admin-profile-title">Admin</div>
                <div className="admin-profile-email">Melanie</div>
              </div>
          <button type="button" className="admin-profile-item" onClick={() => (typeof onLogout === 'function' ? onLogout() : null)}>
            <LogOut size={16} />
            Déconnexion
          </button>
        </div>
      ) : null}
    </div>
  );
}
