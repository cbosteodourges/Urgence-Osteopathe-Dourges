# Référencement et images — 27 septembre 2026

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
