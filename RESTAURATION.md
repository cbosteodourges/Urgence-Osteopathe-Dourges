# Version du site avant réorganisation

Référence intégrale : `f1fde68e76165bbcb51e248f0773f912545da988`.
Branche locale : `backup/site-une-page-2026-09-27`.
Le fichier index.html de cette référence est identique octet pour octet au site en ligne au moment de la préparation. Toutes les images et toutes les pages existantes sont conservées dans cet historique Git.

La version proposée est sur `codex/navigation-quatre-pages`. Aucun déploiement effectué.

Pour restaurer après une éventuelle publication : créer une branche depuis la branche publiée, puis restaurer le dossier docs depuis la référence sauvegardée :

```sh
git restore --source=f1fde68e76165bbcb51e248f0773f912545da988 --staged --worktree docs
git commit -m "Restore original single-page website"
```

Contrôler puis publier ce commit par le mécanisme habituel. Ne pas forcer l’historique.
