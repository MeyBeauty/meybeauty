import SEO from '../components/SEO.jsx';

export default function LegalPage() {
  return (
    <>
      <SEO
        title="Mentions Légales"
        description="Mentions légales de Mey Beauty Paris. Éditeur du site, directeur de publication, hébergeur et propriété intellectuelle."
        keywords="mentions légales, Mey Beauty, conditions d'utilisation"
        noindex={true}
      />
      <main className="legal-page">
      <section className="page-hero-banner" aria-label="Mentions légales">
        <h1>Mentions légales</h1>
        <div className="breadcrumb">
          <a href="#home">Accueil</a>
          <span>/</span>
          <span>Mentions légales</span>
        </div>
      </section>

      <section className="legal-content">
        <div className="legal-block">
          <h2>1. Éditeur du site</h2>
          <p>
            Le présent site internet est édité par <strong>Mey Beauty</strong> (ci‑après « l’Éditeur »),
            exploitant un institut de beauté.
            <br />Adresse : 6 Place des Martyrs de Châteaubriand, 91170 Viry‑Châtillon, France.
            <br />Téléphone : +33 7 49 22 68 01.
            <br />E‑mail : contact@meybeauty.fr.
            <br />Toute correspondance relative au site (réclamation, demande d’information, exercice de droits)
            doit être adressée en priorité par e‑mail afin d’assurer un traitement rapide et traçable.
          </p>
        </div>

        <div className="legal-block">
          <h2>2. Directeur de la publication</h2>
          <p>
            Le directeur de la publication est l’Éditeur.
            <br />Le responsable de la rédaction et de la mise à jour des contenus est également l’Éditeur,
            sauf mention contraire.
          </p>
        </div>

        <div className="legal-block">
          <h2>3. Hébergement</h2>
          <p>
            Le site est hébergé par un prestataire tiers.
            <br />Conformément à l’article 6, I, 2° de la loi n° 2004‑575 du 21 juin 2004 pour la confiance
            dans l’économie numérique (LCEN), l’identité de l’hébergeur peut être communiquée sur demande
            légitime et dans la mesure permise par la réglementation.
          </p>
        </div>

        <div className="legal-block">
          <h2>4. Propriété intellectuelle</h2>
          <p>
            L’ensemble du site, sa structure générale, ainsi que les contenus (textes, images, photographies,
            vidéos, graphismes, logos, icônes, éléments sonores, bases de données, chartes et tout autre élément)
            sont protégés par le droit de la propriété intellectuelle et relèvent, selon les cas, de la propriété
            de l’Éditeur ou de tiers ayant autorisé l’Éditeur à les utiliser.
            <br />Toute reproduction, représentation, adaptation, modification, publication, transmission ou
            dénaturation, totale ou partielle, par quelque procédé que ce soit, sans l’autorisation écrite
            préalable de l’Éditeur est interdite, sauf exceptions légales.
            <br />Toute utilisation non autorisée est susceptible de constituer un acte de contrefaçon engageant
            la responsabilité civile et/ou pénale de son auteur.
          </p>
        </div>

        <div className="legal-block">
          <h2>5. Conditions d’accès et d’utilisation</h2>
          <p>
            L’accès au site est libre et gratuit, hors coûts d’accès à internet et de télécommunications.
            L’utilisateur s’engage à utiliser le site de manière loyale, à ne pas porter atteinte à son intégrité,
            à ne pas tenter d’accéder frauduleusement aux systèmes d’information et à ne pas perturber
            son fonctionnement.
            <br />L’Éditeur se réserve le droit de suspendre, limiter ou interrompre l’accès au site, notamment
            pour des opérations de maintenance, des mises à jour ou en cas d’événement hors contrôle.
          </p>
        </div>

        <div className="legal-block">
          <h2>6. Responsabilité</h2>
          <p>
            Les informations diffusées sur le site le sont à titre informatif et général. Malgré le soin apporté
            à leur mise à jour, l’Éditeur ne garantit pas l’exactitude, l’exhaustivité ou l’actualité permanente
            des contenus.
            <br />L’Éditeur ne saurait être tenu responsable des dommages directs ou indirects pouvant résulter
            de l’accès ou de l’utilisation du site, y compris en cas d’interruption, d’erreurs, d’indisponibilité,
            d’intrusion, de virus ou de tout autre problème technique.
            <br />Les conseils et contenus relatifs aux prestations (soins, bien‑être, beauté) ne remplacent pas un avis
            médical. En cas de doute, de pathologie, de grossesse, d’allergies ou de traitement, il convient de
            solliciter un professionnel de santé avant toute prestation.
          </p>
        </div>

        <div className="legal-block">
          <h2>7. Liens hypertextes</h2>
          <p>
            Le site peut contenir des liens vers des sites tiers. Ces liens sont fournis pour faciliter la navigation.
            L’Éditeur n’exerce aucun contrôle sur ces sites et ne peut être tenu responsable de leur contenu,
            de leurs pratiques ou de leur disponibilité.
            <br />La création de liens hypertextes vers le site est autorisée sous réserve qu’elle ne porte pas atteinte
            à l’image de l’Éditeur, qu’elle ne crée pas de confusion sur la source des contenus et qu’elle respecte
            la réglementation applicable.
          </p>
        </div>

        <div className="legal-block">
          <h2>8. Cookies et traceurs</h2>
          <p>
            Le site utilise des cookies et traceurs pour améliorer l'expérience utilisateur, analyser la fréquentation
            et assurer le fonctionnement des services (panier, authentification). L'utilisateur peut configurer son
            navigateur pour refuser les cookies, cependant certaines fonctionnalités pourraient alors être dégradées.
            <br />Pour plus d'informations, consultez notre Politique de confidentialité et notre gestionnaire de cookies.
          </p>
        </div>

        <div className="legal-block">
          <h2>9. Données personnelles et RGPD</h2>
          <p>
            Les données personnelles collectées sur ce site sont traitées conformément au Règlement Général sur la
            Protection des Données (RGPD) et à la loi Informatique et Libertés modifiée. Les utilisateurs disposent de
            droits d'accès, de rectification, d'effacement, de limitation, d'opposition et de portabilité de leurs
            données. Pour exercer ces droits ou pour toute question relative aux données personnelles, contactez-nous
            à l'adresse : privacy@meybeauty.fr ou par courrier à l'adresse de l'Éditeur.
            <br />Pour plus de détails, consultez notre Politique de confidentialité dédiée.
          </p>
        </div>

        <div className="legal-block">
          <h2>10. Conditions de vente et paiement</h2>
          <p>
            Les produits et services proposés sur le site sont soumis aux conditions générales de vente (CGV) disponibles
            sur simple demande. Les prix sont indiqués en euros TTC. Les paiements sont sécurisés via Stripe et PayPal,
            conformément aux standards PCI-DSS. L'Éditeur se réserve le droit de modifier ses prix à tout moment, les
            produits étant facturés sur la base des tarifs en vigueur au moment de la validation de la commande.
          </p>
        </div>

        <div className="legal-block">
          <h2>11. Livraison et rétractation</h2>
          <p>
            Les délais et modalités de livraison sont précisés lors de la commande. Conformément aux articles L.221-18
            et suivants du Code de la consommation, le client dispose d'un droit de rétractation de 14 jours à compter
            de la réception des produits pour les commandes en ligne. Ce droit ne s'applique pas aux produits descellés
            après livraison ni aux prestations de services déjà consommées.
          </p>
        </div>

        <div className="legal-block">
          <h2>12. Médiation et règlement des litiges</h2>
          <p>
            En cas de litige, le consommateur peut recourir gratuitement à un médiateur de la consommation. L'Éditeur
            adhère au code de médiation suivant : [Nom du médiateur à préciser]. À défaut d'accord amiable, le consommateur
            peut également soumettre son litige via la plateforme de règlement en ligne des litiges de l'UE (RLL) :
            <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer">https://ec.europa.eu/consumers/odr</a>.
          </p>
        </div>

        <div className="legal-block">
          <h2>13. Droit applicable et juridiction compétente</h2>
          <p>
            Les présentes mentions légales sont régies par le droit français.
            <br />En cas de litige, et à défaut de résolution amiable, les tribunaux français territorialement compétents
            seront seuls compétents, sous réserve des règles impératives applicables au consommateur (tribunal du domicile
            du consommateur en cas de litige avec un professionnel).
          </p>
        </div>

        <div className="legal-block">
          <h2>14. Mise à jour</h2>
          <p>
            Les présentes mentions légales ont été mises à jour le 7 mai 2026.
            <br />L'Éditeur se réserve le droit de les modifier à tout moment. Les utilisateurs sont invités à les consulter
            régulièrement pour prendre connaissance des éventuelles modifications.
          </p>
        </div>

        <div className="legal-actions">
          <a className="btn-cta" href="#home">Retour à l'accueil</a>
          <a className="btn-outline" href="#privacy">Politique de confidentialité</a>
        </div>
      </section>
    </main>
    </>
  );
}
