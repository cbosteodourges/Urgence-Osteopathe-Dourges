# Version du site avant réorganisation

Référence intégrale : `f1fde68e76165bbcb51e248f0773f912545da988`.
Branche locale : `backup/site-une-page-2026-09-27`.
Le fichier index.html de cette référence est identique octet pour octet au site en ligne au moment de la préparation. Toutes les images et toutes les pages existantes sont conservées dans cet historique Git.

La navigation à quatre pages est publiée. La version juste avant l'optimisation du référencement et des images du 27 septembre 2026 est conservée sur la branche distante `backup/avant-optimisation-seo-2026-09-27`, au commit `5b1ac78f1500eace0d7392993278ef4798c694ad`.

Pour annuler uniquement cette optimisation, créer une branche depuis la version publiée puis exécuter :

```sh
git restore --source=5b1ac78f1500eace0d7392993278ef4798c694ad --staged --worktree docs
git commit -m "Restore website before SEO and image optimization"
```

Pour restaurer l'ancien site en une seule page : créer une branche depuis la branche publiée, puis restaurer le dossier docs depuis la référence sauvegardée :

```sh
git restore --source=f1fde68e76165bbcb51e248f0773f912545da988 --staged --worktree docs
git commit -m "Restore original single-page website"
```

Contrôler puis publier ce commit par le mécanisme habituel. Ne pas forcer l’historique.
