# Suivi du site et de la provenance Oostéo

Propriété GA4 : `558903193` — flux Web `16123315880` — identifiant `G-LV04SF57XP`.

## Installation

Les 20 pages chargent `docs/statistiques.js` et `docs/statistiques.css`. La bibliothèque Google est chargée seulement après l'accord aux statistiques. Accepter et refuser ont la même présentation. Le choix est mémorisé 180 jours, sans prolongation automatique. « Cookies et confidentialité », dans chaque pied de page, permet de changer de choix et de consulter les informations.

Le refus et le retrait bloquent Analytics. Le retrait supprime les cookies `_ga` du domaine ; un rechargement retire les écouteurs de la bibliothèque Google. Un retrait dans un autre onglet est répercuté. Si le stockage local est indisponible, le choix ne vaut que pour la page en cours et n'est pas présumé accepté lors de la prochaine visite.

Le mode Consentement de base garde les paramètres publicitaires refusés. La personnalisation publicitaire et les signaux Google sont désactivés dans la balise. Aucun script Google ni requête Analytics n'est envoyé avant acceptation. Le script local préparant le bandeau ne transmet aucune donnée.

Les cookies Analytics sont limités à 180 jours avec `cookie_update:false`. Les URL de pages envoyées excluent les fragments et paramètres libres ; seul le marquage Oostéo exact ci-dessous est conservé. Les référents externes sont limités à leur domaine, sans chemin ni paramètres. Le suivi de contact ne transmet ni numéro de téléphone, ni texte libre de formulaire, ni diagnostic, ni donnée de patient.

## Lien à transmettre à Oostéo

https://osteopathe-urgence-59-62.fr/urgence-osteopathe-henin-beaumont.html?utm_source=oosteo&utm_medium=referral&utm_campaign=fiche_henin_beaumont

Ce lien doit remplacer le bouton de la fiche actuelle dans l'annuaire Oostéo. Sa présence effective doit encore être vérifiée chez Oostéo. Les tags UTM identifient la provenance ; ils ne créent pas de statistiques seuls.

## Événements

| Nom | Mesure | Précision disponible |
| --- | --- | --- |
| `page_view` | Une page consultée après consentement | Page et source de trafic GA4 |
| `click_doctolib` | Un clic sur un lien vers Doctolib | `cabinet` : `henin_beaumont`, `dourges` ou `choix_du_cabinet` |
| `click_call` | Un clic sur un lien `tel:` | Page et emplacement |
| `click_sms` | Un clic sur un lien `sms:` | Page et emplacement |

Les événements personnalisés incluent `page_path` et `placement` (`footer` ou `contenu`). Le script laisse les liens s'ouvrir immédiatement et ne modifie pas leurs destinations. Les événements automatiques supplémentaires des mesures améliorées dépendent des réglages du flux dans Analytics.

## Où consulter les chiffres

Ouvrir https://analytics.google.com/analytics/web/#/p558903193/reports/reportinghub avec le compte Google qui a créé la propriété.

- **Temps réel** : confirmer la réception d'une visite de test ayant accepté les statistiques.
- **Rapports → Acquisition du trafic** : choisir la dimension **Source/Support de la session**, puis trouver `oosteo / referral`. Selon la collection affichée, ce rapport peut être rangé sous **Générer des leads** ou **Comprendre le trafic Web et/ou application**.
- **Rapports → Événements** : rechercher `click_doctolib`, `click_call` et `click_sms`. Le rapport peut être rangé sous **Voir l'engagement et la fidélisation des utilisateurs**. Utiliser une comparaison **Source de la session = oosteo** pour limiter le rapport aux visites provenant d'Oostéo. Si un rapport manque au menu, il peut être ajouté via **Rapports → Bibliothèque**.
- **Pages et écrans** : comparer les pages consultées et la durée d'engagement.

Les rapports standards peuvent nécessiter 24 à 48 heures de traitement. Ils commencent après l'installation ; aucun historique antérieur n'est reconstruit. Les événements personnalisés apparaissent seulement après un premier clic réellement enregistré.

## Réglages à vérifier dans le compte Analytics

Ces réglages du compte nécessitent son interface connectée ; leur modification n'est pas effectuée par le code du site :

1. Administration → Collecte et modification des données → Conservation des données : privilégier **2 mois**, avec la réinitialisation à chaque nouvelle activité désactivée. Les rapports standards agrégés restent disponibles au-delà de cette durée.
2. Dans les mesures améliorées du flux : conserver pages vues, défilements et clics sortants ; désactiver recherche sur site, formulaires, vidéos et téléchargements si inutiles pour ce site. Les statistiques de contact utiles sont explicitement envoyées par notre script.
3. Pour voir `cabinet` et `placement` dans les rapports : Administration → Affichage des données → Définitions personnalisées, créer deux dimensions de portée **Événement** correspondant à ces paramètres. Elles ne sont pas nécessaires au comptage des clics.

## Limites d'interprétation

- Les refus, bloqueurs, scripts désactivés et autres contraintes techniques réduisent les visites mesurées. Un consentement donné après plusieurs pages peut aussi perdre la provenance initiale.
- Un clic téléphonique ne prouve pas un appel connecté. Un clic Doctolib ne prouve pas une réservation.
- Les appels effectués en recopiant le numéro, ou directement depuis Oostéo, ne passent pas par ce suivi.
- Le même visiteur peut cliquer plusieurs fois. Distinguer **Nombre d'événements** et **Nombre total d'utilisateurs**.
- Ce suivi ne permet pas de certifier les chiffres historiques communiqués par Oostéo.

## Références

- Consentement : https://www.cnil.fr/fr/cookies-et-autres-traceurs/que-dit-la-loi
- Mode Consentement de base : https://developers.google.com/tag-platform/security/guides/consent?consentmode=basic
- Configuration GA4 : https://developers.google.com/analytics/devguides/collection/ga4/reference/config
- Conservation : https://support.google.com/analytics/answer/7667196?hl=fr

## Retour arrière

Retirer des 20 pages l'inclusion de `statistiques.css`, `statistiques.js` et le bouton de pied de page. Les photos, contenus existants, liens de réservation et métadonnées ne sont pas remplacés par cette installation.
