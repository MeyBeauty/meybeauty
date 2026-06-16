import SEO from '../components/SEO.jsx';

export default function PrivacyPage() {
  return (
    <>
      <SEO
        title="Politique de Confidentialité"
        description="Politique de confidentialité de Mey Beauty Paris. RGPD, protection des données personnelles, cookies et vos droits."
        keywords="politique confidentialité, RGPD, protection données, cookies, Mey Beauty"
        noindex={true}
      />
      <main className="legal-page">
      <section className="page-hero-banner" aria-label="Politique de confidentialité">
        <h1>Politique de confidentialité</h1>
        <div className="breadcrumb">
          <a href="#home">Accueil</a>
          <span>/</span>
          <span>Confidentialité</span>
        </div>
      </section>

      <section className="legal-content">
        <div className="legal-block">
          <h2>1. Objet et périmètre</h2>
          <p>
            La présente politique de confidentialité décrit la manière dont <strong>Mey Beauty</strong> (ci‑après « nous »)
            collecte et traite des données à caractère personnel lorsque vous utilisez notre site internet et/ou
            lorsque vous nous contactez pour une demande d’information ou de rendez‑vous.
            <br />Nous nous engageons à traiter vos données conformément au Règlement (UE) 2016/679 du 27 avril 2016
            (« RGPD ») et à la loi n°78‑17 du 6 janvier 1978 modifiée (« Informatique et Libertés »).
          </p>
        </div>

        <div className="legal-block">
          <h2>2. Responsable de traitement et DPO</h2>
          <p>
            Le responsable de traitement est <strong>Mey Beauty</strong>, représentée par son gérant(e).
            <br />Adresse : 6 Place des Martyrs de Châteaubriant, 91170 Viry‑Châtillon, France.
            <br />Téléphone : +33 7 49 22 68 01.
            <br />E‑mail : contact@meybeauty.fr.
            <br />E‑mail dédié données : privacy@meybeauty.fr.
            <br />
            <br />Un Délégué à la Protection des Données (DPO) a été désigné. Pour toute question relative à la
            protection des données ou pour exercer vos droits, vous pouvez nous écrire à l'adresse privacy@meybeauty.fr.
            Nous répondons dans un délai maximum d'un mois à compter de la réception de votre demande.
          </p>
        </div>

        <div className="legal-block">
          <h2>3. Données collectées et catégories</h2>
          <p>
            <strong>3.1 Données d'identification et de contact</strong>
            <br />Nom, prénom, adresse e-mail, numéro de téléphone, adresse postale (pour les livraisons).
            <br />
            <br /><strong>3.2 Données de connexion et navigation</strong>
            <br />Adresse IP, données de connexion, type et version de navigateur, système d'exploitation,
            résolution d'écran, fuseau horaire, données de localisation approximative, parcours de navigation,
            temps passé sur les pages, interactions avec le site.
            <br />
            <br /><strong>3.3 Données de transaction et paiement</strong>
            <br />Historique des commandes, montants, produits achetés, panier sauvegardé. Les données de carte bancaire
            sont collectées et traitées directement par nos prestataires de paiement sécurisés (Stripe et PayPal)
            selon les normes PCI-DSS. Nous ne stockons jamais les numéros complets de carte bancaire sur nos serveurs.
            <br />
            <br /><strong>3.4 Données de communication</strong>
            <br />Messages envoyés via le formulaire de contact, demandes de rendez-vous, correspondances par e-mail
            ou téléphone, avis et commentaires laissés sur les produits ou services.
            <br />
            <br /><strong>3.5 Données de préférences</strong>
            <br />Type de peau, préférences de produits, historique de soins, allergies ou contre-indications
            communiquées (traitées comme données de santé avec consentement explicite).
            <br />
            <br /><strong>3.6 Données relatives aux réseaux sociaux</strong>
            <br />Si vous vous connectez via un réseau social ou interagissez avec nos pages sur ces plateformes,
            nous pouvons recevoir certaines informations de votre profil public selon vos paramètres de confidentialité.
          </p>
        </div>

        <div className="legal-block">
          <h2>4. Finalités détaillées et bases légales</h2>
          <p>
            <strong>4.1 Gestion de la relation client (Base légale : Exécution du contrat / Mesures précontractuelles)</strong>
            <br />- Traitement des demandes de contact et rendez-vous
            <br />- Gestion des comptes clients et authentification
            <br />- Suivi des commandes et livraisons
            <br />- Service après-vente et gestion des réclamations
            <br />
            <br /><strong>4.2 E-commerce et transactions (Base légale : Exécution du contrat / Obligation légale)</strong>
            <br />- Traitement des commandes et paiements
            <br />- Gestion du panier et sauvegarde des articles
            <br />- Facturation et tenue comptable (obligation légale 10 ans)
            <br />- Gestion des retours et remboursements
            <br />- Lutte contre la fraude aux paiements
            <br />
            <br /><strong>4.3 Marketing et personnalisation (Base légale : Consentement / Intérêt légitime)</strong>
            <br />- Envoi de newsletters (avec consentement explicite)
            <br />- Offres personnalisées et promotions ciblées
            <br />- Programmes de fidélité
            <br />- Retargeting publicitaire (avec consentement)
            <br />
            <br /><strong>4.4 Amélioration des services (Base légale : Intérêt légitime)</strong>
            <br />- Analyse statistique et mesure d'audience
            <br />- Tests A/B et optimisation de l'expérience utilisateur
            <br />- Développement de nouveaux produits et services
            <br />
            <br /><strong>4.5 Sécurité et conformité (Base légale : Intérêt légitime / Obligation légale)</strong>
            <br />- Prévention et détection des fraudes
            <br />- Sécurisation des transactions et des accès
            <br />- Respect des obligations légales (fiscales, comptables)
            <br />- Gestion des litiges et contentieux
          </p>
        </div>

        <div className="legal-block">
          <h2>5. Destinataires et sous-traitants</h2>
          <p>
            <strong>5.1 Destinataires internes</strong>
            <br />Vos données sont accessibles uniquement aux personnes habilitées de Mey Beauty :
            personnel administratif, commerciaux, techniques et direction, dans la limite de leurs attributions.
            <br />
            <br /><strong>5.2 Sous-traitants et prestataires</strong>
            <br />Nous faisons appel à des prestataires techniques qualifiés agissant en tant que sous-traitants :
            <br />- <strong>Hébergement :</strong> Firebase (Google Cloud) - USA (garanties RGPD via clauses contractuelles)
            <br />- <strong>Paiement :</strong> Stripe et PayPal - USA/UE (certifiés PCI-DSS niveau 1)
            <br />- <strong>Newsletter :</strong> [À préciser] - pour l'envoi d'emails marketing
            <br />- <strong>Analyse :</strong> [À préciser] - pour la mesure d'audience (si applicable)
            <br />- <strong>Support client :</strong> [À préciser] - pour la gestion des tickets
            <br />
            <br /><strong>5.3 Transferts internationaux</strong>
            <br />Certains prestataires (Firebase, Stripe, PayPal) peuvent traiter des données en dehors de l'UE.
            Ces transferts sont encadrés par des mécanismes conformes au RGPD :
            Clauses Contractuelles Types (CCT) de la Commission Européenne, certifications adequacy (Privacy Shield successor),
            et garanties supplémentaires techniques et contractuelles.
            <br />
            <br /><strong>5.4 Autres destinataires</strong>
            <br />Nous ne vendons ni ne louons vos données. Elles ne sont communiquées à des tiers que :
            <br />- Si la loi l'exige (réquisition judiciaire, autorité administrative)
            <br />- En cas de fusion, acquisition ou cession d'actifs (vous serez informé)
            <br />- Avec votre consentement explicite pour des partenariats spécifiques
          </p>
        </div>

        <div className="legal-block">
          <h2>6. Durées de conservation détaillées</h2>
          <p>
            Nous appliquons des durées de conservation proportionnées et limitées :
            <br />
            <br /><strong>6.1 Données clients actifs</strong>
            <br />- Données de compte : durée de la relation contractuelle + 3 ans (délai de prescription civile)
            <br />- Historique des commandes : 10 ans (obligation comptable et fiscale)
            <br />- Données de paiement (hors CB) : 5 ans (obligation légale anti-blanchiment)
            <br />
            <br /><strong>6.2 Données de prospection</strong>
            <br />- Prospects non clients : 3 ans à compter du dernier contact
            <br />- Consentements marketing : 5 ans ou jusqu'au retrait du consentement
            <br />
            <br /><strong>6.3 Données techniques et de sécurité</strong>
            <br />- Logs de connexion : 1 an (sécurité informatique)
            <br />- Cookies de session : durée de la session
            <br />- Cookies de préférences : 13 mois maximum
            <br />- Cookies analytiques : 25 mois maximum ou durée de vie configurée
            <br />
            <br /><strong>6.4 Données spéciales</strong>
            <br />- Données de santé (allergies) : durée nécessaire au soin + 5 ans
            <br />- Données de mineurs : supprimées dès que le client atteint la majorité (sauf obligation légale)
            <br />
            <br />À l'expiration de ces délais, les données sont supprimées ou anonymisées de manière irréversible.
          </p>
        </div>

        <div className="legal-block">
          <h2>7. Cookies et traceurs - Gestion détaillée</h2>
          <p>
            <strong>7.1 Qu'est-ce qu'un cookie ?</strong>
            <br />Un cookie est un petit fichier texte déposé sur votre terminal lors de la visite d'un site.
            Il permet de mémoriser des informations utiles pour votre navigation.
            <br />
            <br /><strong>7.2 Catégories de cookies utilisés</strong>
            <br />
            <br /><em>Cookies strictement nécessaires (exemptés de consentement)</em>
            <br />- Cookies de session : maintien de la connexion, panier d'achat
            <br />- Cookies de sécurité : protection CSRF, authentification
            <br />- Cookies de préférences : langue, devise, paramètres d'affichage
            <br />Durée : session à 13 mois
            <br />
            <br /><em>Cookies de fonctionnalité (sur consentement)</em>
            <br />- Personnalisation de l'expérience
            <br />- Mémorisation des choix de produits
            <br />
            <br /><em>Cookies analytiques / audience (sur consentement)</em>
            <br />- Statistiques de visite (Google Analytics ou équivalent)
            <br />- Performance du site et détection d'erreurs
            <br />
            <br /><em>Cookies marketing / publicitaires (sur consentement)</em>
            <br />- Retargeting et personnalisation publicitaire
            <br />- Mesure d'efficacité des campagnes
            <br />
            <br /><strong>7.3 Comment gérer vos préférences ?</strong>
            <br />Lors de votre première visite, un bandeau vous permet de choisir les cookies acceptés.
            Vous pouvez modifier vos choix à tout moment via notre [gestionnaire de cookies / lien à ajouter]
            ou les paramètres de votre navigateur :
            <br />- Chrome : Paramètres → Confidentialité et sécurité → Cookies
            <br />- Firefox : Paramètres → Vie privée → Cookies et données de sites
            <br />- Safari : Préférences → Confidentialité → Cookies
            <br />- Edge : Paramètres → Cookies et autorisations de site
          </p>
        </div>

        <div className="legal-block">
          <h2>8. Sécurité des données</h2>
          <p>
            <strong>8.1 Mesures techniques</strong>
            <br />- Chiffrement SSL/TLS de toutes les connexions (HTTPS)
            <br />- Hachage des mots de passe (bcrypt/argon2)
            <br />- Authentification forte pour l'administration
            <br />- Pare-feu et systèmes de détection d'intrusion
            <br />- Sauvegardes chiffrées et régulières
            <br />- Anonymisation des données de test
            <br />
            <br /><strong>8.2 Mesures organisationnelles</strong>
            <br />- Politique de sécurité du personnel
            <br />- Principes du moindre privilège et need-to-know
            <br />- Formation à la protection des données
            <br />- Journalisation des accès aux données sensibles
            <br />- Audits réguliers de sécurité
            <br />
            <br /><strong>8.3 Sécurité des paiements</strong>
            <br />Les transactions sont sécurisées par nos prestataires Stripe et PayPal, certifiés PCI-DSS niveau 1.
            Les données de carte bancaire ne transitent jamais par nos serveurs.
            <br />
            <br /><strong>8.4 Limites de la sécurité</strong>
            <br />Malgré nos efforts, aucune transmission sur internet n'est totalement infaillible.
            Vous reconnaissez utiliser le site à vos risques et périls. En cas de faille de sécurité affectant
            vos données, nous vous en informerons dans les meilleurs délais conformément à la réglementation.
          </p>
        </div>

        <div className="legal-block">
          <h2>9. Vos droits détaillés (RGPD)</h2>
          <p>
            Conformément au RGPD et à la loi Informatique et Libertés, vous disposez des droits suivants :
            <br />
            <br /><strong>9.1 Droit d'accès (art. 15 RGPD)</strong>
            <br />Vous pouvez obtenir la confirmation que des données vous concernant sont traitées,
            ainsi qu'une copie de ces données et des informations sur les traitements.
            <br />
            <br /><strong>9.2 Droit de rectification (art. 16 RGPD)</strong>
            <br />Vous pouvez demander la correction des données inexactes ou l'actualisation de données obsolètes.
            <br />
            <br /><strong>9.3 Droit à l'effacement / "droit à l'oubli" (art. 17 RGPD)</strong>
            <br />Vous pouvez demander la suppression de vos données, sauf si des obligations légales
            (comptabilité, fiscalité) ou des intérêts légitimes impérieux nous obligent à les conserver.
            <br />
            <br /><strong>9.4 Droit à la limitation du traitement (art. 18 RGPD)</strong>
            <br />Vous pouvez demander le "gel" temporaire de l'utilisation de vos données dans certains cas
            (contestation de l'exactitude, traitement illicite, etc.).
            <br />
            <br /><strong>9.5 Droit à la portabilité (art. 20 RGPD)</strong>
            <br />Vous pouvez recevoir vos données dans un format structuré et couramment utilisé,
            et les transmettre à un autre responsable de traitement.
            <br />
            <br /><strong>9.6 Droit d'opposition (art. 21 RGPD)</strong>
            <br />Vous pouvez vous opposer à tout moment au traitement de vos données à des fins de prospection,
            y compris au profiling lié à cette prospection. Pour les autres traitements fondés sur l'intérêt légitime,
            nous cesserons le traitement sauf si des motifs légitimes et impérieux prévalent.
            <br />
            <br /><strong>9.7 Droit de ne pas faire l'objet d'une décision automatisée (art. 22 RGPD)</strong>
            <br />Vous pouvez demander l'intervention humaine si une décision vous concernant est prise
            uniquement sur la base d'un traitement automatisé (profilage) produisant des effets juridiques.
            <br />
            <br /><strong>9.8 Droit de retirer le consentement</strong>
            <br />Pour les traitements fondés sur le consentement (marketing, cookies optionnels),
            vous pouvez retirer votre consentement à tout moment sans affecter la licéité du traitement antérieur.
            <br />
            <br /><strong>9.9 Exercice des droits et réclamation</strong>
            <br />Pour exercer vos droits : privacy@meybeauty.fr ou courrier à l'adresse de Mey Beauty.
            Délai de réponse : 1 mois maximum (prolongeable à 3 mois pour demandes complexes).
            <br />Pièce d'identité : nous pouvons vous demander une copie de votre carte d'identité ou passeport
            (tâchée du numéro de sécurité sociale et de la photo pour les demandes par email) afin de vérifier votre identité.
            <br />
            <br />Réclamation : vous avez le droit d'introduire une réclamation auprès de la CNIL :
            <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">www.cnil.fr</a>
            ou 3 Place de Fontenoy, TSA 80715, 75334 Paris Cedex 07.
          </p>
        </div>

        <div className="legal-block">
          <h2>10. Informations complémentaires</h2>
          <p>
            <strong>10.1 Données des mineurs</strong>
            <br />Nos services ne s'adressent pas aux enfants de moins de 16 ans sans autorisation parentale.
            Si nous découvrons que nous avons collecté des données d'un mineur sans consentement valable,
            nous les supprimerons dans les meilleurs délais.
            <br />
            <br /><strong>10.2 Liens vers des tiers</strong>
            <br />Notre site peut contenir des liens vers d'autres sites. Nous n'avons pas de contrôle sur ces sites
            et leurs politiques de confidentialité. Nous vous encourageons à consulter leurs politiques avant de
            leur communiquer des données personnelles.
            <br />
            <br /><strong>10.3 Réseaux sociaux</strong>
            <br />Les boutons sociaux présents sur notre site peuvent permettre aux réseaux sociaux de suivre votre navigation.
            Consultez leurs politiques de confidentialité respectives.
          </p>
        </div>

        <div className="legal-block">
          <h2>11. Mise à jour et contact</h2>
          <p>
            Dernière mise à jour : 7 mai 2026
            <br />Version : 2.0
            <br />
            <br />Nous pouvons modifier cette politique à tout moment pour refléter des évolutions légales,
            techniques ou commerciales. Les modifications importantes vous seront notifiées par email
            ou bandeau sur le site.
            <br />
            <br />Pour toute question concernant cette politique : privacy@meybeauty.fr
            <br />Pour les réclamations : vous pouvez contacter la CNIL (www.cnil.fr)
          </p>
        </div>

        <div className="legal-actions">
          <a className="btn-cta" href="#home">Retour à l'accueil</a>
          <a className="btn-outline" href="#legal">Mentions légales</a>
        </div>
      </section>
    </main>
    </>
  );
}
