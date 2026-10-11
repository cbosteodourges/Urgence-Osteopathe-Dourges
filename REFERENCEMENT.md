# Référencement — état au 11 octobre 2026

Le site publié comporte vingt pages canoniques : quatre pages principales, quatorze pages de villes (dont les deux cabinets), la page du week-end et des jours fériés et le guide d'accès. Les douze pages de provenance ont à nouveau un contenu propre ; elles figurent dans le sitemap depuis le 8 octobre. La description des redirections ci-dessous est une archive de septembre, pas l'état actuel.

## Intervention du 11 octobre

- Titres des douze pages de provenance : « Ostéopathe près de [ville] | Christophe Bonnet » (près d’Arras).
- Titres des deux cabinets : « Ostéopathe à [ville] | Christophe Bonnet ».
- Cohérence entre title, og:title, twitter:title et le nom de WebPage dans le JSON-LD.
- Douze liens directs ajoutés depuis chaque itinéraire du guide vers la page correspondante ; libellés explicites pour les deux liens vers les cabinets.
- Les titres du guide et de la page du week-end sont déjà descriptifs et sont conservés.
- Descriptions distinctes, canoniques propres, robots et sitemap à vingt URL vérifiés et conservés.
- Vérificateur actualisé pour la structure publiée, les liens vers toutes les villes et la cohérence des titres.

Les quatre pages principales, les photographies et les feuilles de style sont conservées. Les titres et résumés des pages locales sont harmonisés dans le complément ci-dessous. Les consultations ont lieu uniquement à Hénin-Beaumont et Dourges. Aucun cabinet n'est présenté dans les douze autres villes.

## Complément : titres visibles et ressources locales

Après validation de l’utilisateur, les quatorze grands titres visibles deviennent « Ostéopathe » suivi de la relation réelle à la ville :

- « à » pour Hénin-Beaumont et Dourges, où se trouvent les cabinets ;
- « près de » pour Carvin, Courrières, Douai, Lens, Libercourt, Liévin et Noyelles-Godault ;
- « pour les patients de » (d’Arras) pour Arras, Béthune, Lille, Valenciennes et Villeneuve-d’Ascq.

Pour ces cinq dernières villes, title, og:title, twitter:title et WebPage.name sont également harmonisés. Les douze résumés sous le titre précisent les consultations aux deux cabinets sur rendez-vous et conservent la mention de l’absence de cabinet dans la ville d’origine.

Lille et Villeneuve-d’Ascq disposent désormais aussi d’un lien vers le plan officiel TER Hauts-de-France et d’une courte indication pour vérifier leurs correspondances. Le lien SNCF Connect de Béthune est remplacé par la fiche officielle TER de la gare. Le premier lien répond HTTP 403 au client de contrôle ; cela ne prouve pas une panne pour les visiteurs. La fiche de remplacement a été lue dans la recherche publique puis vérifiée HTTP 200 avec le client de contrôle. Les dix autres ressources officielles distinctes répondaient HTTP 200 lors du contrôle. Aucun trajet direct, durée ou disponibilité de consultation n’est inventé.

## Informations publiques des cabinets : points à vérifier hors du site

La page professionnelle Oostéo de Hénin-Beaumont, lue directement le 11 octobre, annonce encore 9 h–20 h du lundi au vendredi, contre les horaires validés de 9 h–19 h du site. Une copie d’annuaire indique les horaires 9 h–19 h en semaine et un lien de site vers Oostéo. Ses chiffres d’avis ne sont pas une mesure actuelle certifiée de Google Maps.

Les annuaires utilisent l’orthographe « rue Léon Pruvot », alors que le site emploie « rue Léon Pruvost ». La Base Adresse Nationale confirme « 288 Rue Leon Pruvot 62110 Hénin-Beaumont », identifiant 62427_0700_00288. Une correction séparée est préparée pour remplacer Pruvost par Pruvot dans les vingt pages du site, y compris leurs données structurées et itinéraires. Elle attend validation car elle touche aussi les quatre pages principales à préserver. Les adresses ne sont pas modifiées lors de cette publication des titres.

Le lien d’avis Google trouvé sur la copie d’annuaire contient le place ID `ChIJLxCDMD0z3UcRV0yrU88DQa0`, associé par cet annuaire au cabinet de Hénin-Beaumont. L’outil de recherche n’a pas pu lire directement la fiche Google Maps correspondante. L’audit public n’a pas permis de confirmer une fiche distincte pour Dourges. Aucun accès d’administration à Google Business Profile ou Oostéo n’a été utilisé et aucune fiche externe n’a été modifiée.

Pour la fiche Google de chaque cabinet réel, vérifier la catégorie d’ostéopathe, les adresses et horaires propres au lieu, les exceptions pour les jours fériés, le lien vers la page du cabinet et son calendrier Doctolib. Pour Hénin-Beaumont, contrôler si le lien de site mène encore à Oostéo. Pour Dourges, vérifier la fiche existante avant d’envisager toute création, afin d’éviter un doublon.

Sources publiques :
- https://api-adresse.data.gouv.fr/search/?q=288+rue+L%C3%A9on+Pruvot+H%C3%A9nin-Beaumont&limit=1
- https://oosteo.com/osteopathe-henin-beaumont-62110-honoraires-863
- https://osteopathe.autour-de-moi.com/christophe-bonnet-2755179.html
- https://www.ter.sncf.com/hauts-de-france/se-deplacer/gares/bethune-87342006
- https://www.ter.sncf.com/hauts-de-france/se-deplacer/plan-des-lignes-ter

## Vérifications et suivi

Avant intervention, les vingt pages de contenu répondaient HTTP 200 et correspondaient au dépôt. Les quatorze pages locales avaient une canonique propre, robots=index, follow, aucune meta refresh et aucun en-tête X-Robots-Tag bloquant. robots.txt permet l'exploration et désigne le sitemap. Le test contrôle également les fichiers, les ancres, les images et les données structurées.

L'export Google Search Console du 11 octobre (9 juillet–8 octobre 2026) contient des impressions pour chacune des quatorze pages de villes. Cela prouve leur apparition historique dans Google, pas leur rang actuel sur une requête précise. Les tableaux Pages et Requêtes de l'export sont des agrégats séparés ; ils ne permettent pas d'attribuer chaque requête de ville à une page.

L'accès automatisé à Google a répondu HTTP 429. Les réponses Bing obtenues ne fournissent pas de classement exploitable dans cet environnement. Une absence dans un résultat public ou une recherche site: ne prouve pas une désindexation. Aucun accès authentifié à Bing Webmaster Tools n'a été utilisé.

Pour confirmer quelle URL répond à une ville : dans Search Console, filtrer une requête telle que « ostéopathe courrieres », puis ouvrir Pages. Pour confirmer l'indexation actuelle : Inspection de l'URL. Comparer ensuite les mêmes requêtes, pages et périodes après quelques semaines de collecte. Ces corrections ne garantissent pas une position.

Vérification : `python scripts/verify_site.py`.
Pour annuler cette intervention, rétablir ses quinze fichiers HTML depuis le parent du commit, en préservant toute modification ultérieure indépendante.

Références actuelles :
- https://developers.google.com/search/docs/appearance/title-link?hl=fr
- https://developers.google.com/search/docs/crawling-indexing/links-crawlable?hl=fr
- https://support.google.com/webmasters/answer/7576553?hl=fr

---

# Archive : référencement et images — 27 septembre 2026

## Structure

Les quatre pages principales conservent leurs textes et leurs photographies, avec des descriptions distinctes pour les moteurs et le partage social. Les horaires confirmés sont 9 h–19 h, sur rendez-vous.

Deux entités MedicalBusiness identifient les deux cabinets : Hénin-Beaumont en semaine hors jours fériés (60 €), Dourges le week-end et les jours fériés (80 €). Les adresses, horaires et liens Doctolib sont associés au bon établissement. La fermeture d'Hénin-Beaumont les jours fériés est codée par opens=closes=00:00 ; cela ne représente pas un horaire de consultation.

Les anciennes pages de Lille, Lens, Villeneuve-d'Ascq, Liévin, Douai, Valenciennes, Arras, Béthune, Carvin, Courrières, Noyelles-Godault et Libercourt étaient presque identiques. Elles sont regroupées dans `acces-cabinets.html`, avec des itinéraires depuis chaque ville vers les deux cabinets. Les durées de trajet non vérifiées sont retirées. Les pages des deux cabinets et celle du week-end ont un contenu propre et la navigation à quatre onglets.

Les douze anciennes URL restent accessibles et redirigent immédiatement vers le guide d'accès et l'ancre correspondant à la ville. GitHub Pages ne fournit pas de règles de redirection HTTP 301 : une meta refresh à délai zéro et une URL canonique sont utilisées. Google documente cette forme comme une redirection permanente ; le serveur répond néanmoins HTTP 200. Un lien reste présent si le navigateur désactive la redirection. Il n'y a ni blocage robots ni noindex empêchant la découverte du remplacement.

Le JSON-LD mal formé de Villeneuve-d'Ascq a disparu avec l'ancienne page répétitive ; les données utiles sont reprises dans les pages de destination et sérialisées comme JSON valide. Le sitemap contient les huit URL canoniques, pas les douze anciennes pages. Les liens internes pointent directement vers les destinations finales.

Cette intervention ne prouve pas l'existence d'une pénalité Google et ne garantit pas un classement. Une consolidation peut entraîner des fluctuations pendant le retraitement. Suivre les impressions, clics, URL canoniques et redirections dans Google Search Console et Bing Webmaster Tools ; aucun accès authentifié à ces statistiques n'a été utilisé ici.

## Images

Les originaux sont conservés. Les copies WebP utilisent plusieurs largeurs sans recadrage ni modification des photographies. Les versions du logo et de l'image de consultation utilisent une compression sans perte après dimensionnement ; les photographies utilisent une qualité WebP de 92. Le navigateur choisit la résolution via srcset/sizes. Les images plus bas dans la page utilisent le chargement différé ; celles d'accueil sont prioritaires. Les icônes 16/32/180/192 px remplacent le téléchargement du PNG de 1,46 Mo.

Régénération : `python scripts/optimize_images.py` (Pillow avec WebP requis).
Vérification : `python scripts/verify_site.py` (bibliothèque standard Python).
Retour arrière : voir `RESTAURATION.md`.

## Références

- https://developers.google.com/search/docs/appearance/snippet
- https://developers.google.com/search/docs/essentials/spam-policies#doorway-abuse
- https://developers.google.com/search/docs/crawling-indexing/301-redirects
- https://schema.org/PublicHolidays
