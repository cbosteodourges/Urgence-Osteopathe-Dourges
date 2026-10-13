/* GA4: la balise Google reste bloquée jusqu'au consentement aux statistiques. */
(function () {
  'use strict';

  const MEASUREMENT_ID = 'G-LV04SF57XP';
  const CONSENT_KEY = 'cb_analytics_consent';
  const CONSENT_VERSION = 1;
  const SIX_MONTHS_SECONDS = 180 * 24 * 60 * 60;
  const DISABLE_KEY = 'ga-disable-' + MEASUREMENT_ID;
  let loaded = false;
  let choice = readChoice();

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  window[DISABLE_KEY] = true;
  window.gtag('consent', 'default', {
    analytics_storage: 'denied', ad_storage: 'denied',
    ad_user_data: 'denied', ad_personalization: 'denied'
  });

  function readChoice() {
    try {
      const record = JSON.parse(localStorage.getItem(CONSENT_KEY));
      if (record && record.version === CONSENT_VERSION &&
          typeof record.granted === 'boolean' &&
          Number.isFinite(record.expires) && record.expires > Date.now()) return record;
      localStorage.removeItem(CONSENT_KEY);
    } catch (_) { /* Le suivi reste désactivé si le stockage est indisponible. */ }
    return null;
  }

  function clearAnalyticsCookies() {
    const domains = ['', location.hostname, '.' + location.hostname];
    document.cookie.split(';').forEach(function (entry) {
      const name = entry.trim().split('=')[0];
      if (!/^_ga(?:_|$)/.test(name)) return;
      domains.forEach(function (domain) {
        document.cookie = name + '=; Max-Age=0; path=/' +
          (domain ? '; domain=' + domain : '') + '; SameSite=Lax';
      });
    });
  }

  // Ne conserver que le marquage Oostéo prévu, sans paramètres libres ni fragment.
  function cleanPageLocation() {
    const current = new URL(location.href);
    const clean = new URL(current.origin + current.pathname);
    const campaign = {
      utm_source: 'oosteo', utm_medium: 'referral',
      utm_campaign: 'fiche_henin_beaumont'
    };
    if (Object.entries(campaign).every(function (item) {
      return current.searchParams.get(item[0]) === item[1];
    })) Object.entries(campaign).forEach(function (item) {
      clean.searchParams.set(item[0], item[1]);
    });
    return clean.href;
  }

  function cleanReferrer() {
    try {
      const ref = new URL(document.referrer);
      return ref.origin === location.origin ? ref.origin + ref.pathname : ref.origin + '/';
    } catch (_) { return ''; }
  }

  function enableAnalytics() {
    if (loaded || !choice || !choice.granted) return;
    loaded = true;
    window[DISABLE_KEY] = false;
    window.gtag('consent', 'update', {
      analytics_storage: 'granted', ad_storage: 'denied',
      ad_user_data: 'denied', ad_personalization: 'denied'
    });
    window.gtag('set', {
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      page_location: cleanPageLocation(), page_referrer: cleanReferrer()
    });
    window.gtag('js', new Date());
    window.gtag('config', MEASUREMENT_ID, {
      cookie_domain: location.hostname,
      cookie_expires: SIX_MONTHS_SECONDS,
      cookie_update: false,
      cookie_flags: 'SameSite=Lax;Secure',
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      page_location: cleanPageLocation(), page_referrer: cleanReferrer()
    });
    const tag = document.createElement('script');
    tag.async = true;
    tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + MEASUREMENT_ID;
    document.head.appendChild(tag);
  }

  const banner = document.createElement('section');
  banner.className = 'cb-consent';
  banner.hidden = true;
  banner.setAttribute('aria-label', 'Choix des cookies statistiques');
  banner.innerHTML = '<div class="cb-consent-copy">' +
    '<h2>Cookies de statistiques</h2>' +
    '<p>Avec votre accord, Google Analytics mesure les visites et les clics sur les boutons de contact pour améliorer ce site. ' +
    'Votre choix est mémorisé six mois maximum et peut être modifié en bas de page.</p>' +
    '<button type="button" class="cb-consent-info">En savoir plus</button>' +
    '<p class="cb-consent-status" aria-live="polite"></p></div>' +
    '<div class="cb-consent-actions">' +
    '<button type="button" class="cb-consent-button" data-consent="deny">Refuser</button>' +
    '<button type="button" class="cb-consent-button" data-consent="grant">Accepter</button></div>';
  document.body.appendChild(banner);

  const info = document.createElement('dialog');
  info.className = 'cb-privacy-dialog';
  info.setAttribute('aria-labelledby', 'cb-privacy-title');
  info.innerHTML = '<div class="cb-privacy-content">' +
    '<h2 id="cb-privacy-title">Cookies et confidentialité</h2>' +
    '<p><strong>Responsable :</strong> Christophe Bonnet, ostéopathe D.O., ' +
    '288 rue Léon Pruvot, 62110 Hénin-Beaumont. Contact : ' +
    '<a href="contact.html">coordonnées du cabinet</a>.</p>' +
    '<h3>À quoi servent les statistiques ?</h3>' +
    '<p>Elles permettent de connaître les pages consultées, la provenance des visites ' +
    '(par exemple Oostéo), la durée d’engagement et les clics vers Doctolib, le téléphone ou les SMS. ' +
    'Un clic ne confirme ni une consultation réservée ni un appel abouti.</p>' +
    '<h3>Votre accord</h3>' +
    '<p>La base de ce suivi est votre consentement. Google Analytics est chargé uniquement après votre acceptation. ' +
    'Vous pouvez refuser ou retirer votre accord avec « Cookies et confidentialité » en bas de chaque page. ' +
    'Le site et les boutons de contact restent utilisables dans tous les cas.</p>' +
    '<h3>Données et prestataire</h3>' +
    '<p>Google Analytics traite des identifiants de cookies et des informations techniques de navigation ' +
    '(navigateur, appareil, pages, source de visite et interactions). Notre suivi de contact n’envoie ' +
    'aucun nom de patient, aucune coordonnée personnelle et aucun motif de consultation. ' +
    'La personnalisation publicitaire et les signaux Google sont désactivés dans la balise.</p>' +
    '<p>Le prestataire est Google Ireland Limited. Les traitements de Google peuvent impliquer des transferts ' +
    'hors de l’Espace économique européen. Consultez ' +
    '<a href="https://policies.google.com/privacy?hl=fr" target="_blank" rel="noopener noreferrer">' +
    'la politique de confidentialité de Google</a> et ' +
    '<a href="https://business.safety.google/adsprocessorterms/" target="_blank" rel="noopener noreferrer">' +
    'ses conditions de traitement des données</a>.</p>' +
    '<h3>Durées</h3>' +
    '<p>Votre choix est mémorisé six mois maximum sur cet appareil. Les cookies Analytics sont limités à 180 jours, ' +
    'sans prolongation automatique à chaque visite. Les données détaillées liées aux identifiants sont conservées ' +
    'au maximum quatorze mois dans cette propriété Analytics ; les rapports statistiques agrégés peuvent être ' +
    'conservés plus longtemps pour suivre la fréquentation du site.</p>' +
    '<h3>Vos droits</h3>' +
    '<p>Pour une demande relative à vos données (accès, rectification, effacement ou retrait du consentement), ' +
    'utilisez les coordonnées du cabinet sur la page Contact. Vous pouvez également adresser une réclamation à ' +
    '<a href="https://www.cnil.fr/fr/adresser-une-plainte" target="_blank" rel="noopener noreferrer">la CNIL</a>.</p>' +
    '<div class="cb-privacy-actions"><button type="button" class="cb-consent-button" data-privacy-choice>' +
    'Modifier mon choix</button><button type="button" class="cb-consent-button" data-privacy-close>Fermer</button></div></div>';
  document.body.appendChild(info);

  function showBanner(focus) {
    const status = banner.querySelector('.cb-consent-status');
    status.textContent = choice ? 'Votre choix actuel : statistiques ' +
      (choice.granted ? 'acceptées.' : 'refusées.') : '';
    banner.hidden = false;
    if (focus) banner.querySelector('[data-consent="deny"]').focus();
  }

  function saveChoice(granted) {
    choice = {version: CONSENT_VERSION, granted: granted, acceptedAt: Date.now(),
      expires: Date.now() + SIX_MONTHS_SECONDS * 1000};
    try { localStorage.setItem(CONSENT_KEY, JSON.stringify(choice)); } catch (_) { /* Choix valable pour cette page. */ }
    banner.hidden = true;
    if (granted) enableAnalytics();
    else {
      window[DISABLE_KEY] = true;
      clearAnalyticsCookies();
      // Recharger retire aussi les écouteurs de la bibliothèque Google déjà chargée.
      if (loaded) location.reload();
    }
  }

  banner.querySelector('[data-consent="deny"]').addEventListener('click', function () { saveChoice(false); });
  banner.querySelector('[data-consent="grant"]').addEventListener('click', function () { saveChoice(true); });
  banner.querySelector('.cb-consent-info').addEventListener('click', function () { info.showModal(); });
  info.querySelector('[data-privacy-close]').addEventListener('click', function () { info.close(); });
  info.querySelector('[data-privacy-choice]').addEventListener('click', function () {
    info.close(); showBanner(true);
  });
  document.querySelectorAll('[data-privacy-settings]').forEach(function (button) {
    button.addEventListener('click', function () { showBanner(true); });
  });

  document.addEventListener('click', function (event) {
    if (!choice || !choice.granted || !loaded || window[DISABLE_KEY]) return;
    const anchor = event.target.closest && event.target.closest('a[href]');
    if (!anchor) return;
    const href = anchor.getAttribute('href');
    let name, cabinet;
    if (/^tel:/i.test(href)) name = 'click_call';
    else if (/^sms:/i.test(href)) name = 'click_sms';
    else {
      let url;
      try { url = new URL(href, location.href); } catch (_) { return; }
      if (url.hostname !== 'www.doctolib.fr' && url.hostname !== 'doctolib.fr') return;
      name = 'click_doctolib';
      const practice = url.searchParams.get('placeId') || url.searchParams.get('pid');
      cabinet = practice === 'practice-732649' ? 'henin_beaumont' :
        practice === 'practice-733086' ? 'dourges' : 'choix_du_cabinet';
    }
    const parameters = {
      send_to: MEASUREMENT_ID, page_path: location.pathname,
      placement: anchor.closest('footer') ? 'footer' : 'contenu'
    };
    if (cabinet) parameters.cabinet = cabinet;
    // Aucun blocage du lien : les rendez-vous, appels et SMS s'ouvrent immédiatement.
    window.gtag('event', name, parameters);
  }, true);

  // Le refus dans un autre onglet bloque immédiatement ce document puis le recharge.
  window.addEventListener('storage', function (event) {
    if (event.key !== CONSENT_KEY) return;
    choice = readChoice();
    if (!choice || !choice.granted) {
      window[DISABLE_KEY] = true;
      clearAnalyticsCookies();
      if (loaded) location.reload();
      else if (!choice) showBanner(false);
      else banner.hidden = true;
    } else {
      banner.hidden = true;
      enableAnalytics();
    }
  });

  if (choice && choice.granted) enableAnalytics();
  else {
    clearAnalyticsCookies();
    if (!choice) showBanner(false);
  }
}());
