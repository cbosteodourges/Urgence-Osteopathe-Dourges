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

Les quatre pages principales, les textes visibles des pages de villes, les photographies et les feuilles de style sont inchangés. Les consultations ont lieu uniquement à Hénin-Beaumont et Dourges. Aucun cabinet n'est présenté dans les douze autres villes.

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
