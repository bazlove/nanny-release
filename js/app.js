/* ===== Legacy stubs ===== */
window.initSlots        = window.initSlots        || function(){ /* no-op: slots стартуют сами */ };
window.initHeroSlider   = window.initHeroSlider   || function(){ /* no-op: слайдер убрали */ };
window.initQuoteRotator = window.initQuoteRotator || function(){ /* no-op: ротатор работает IIFE */ };

// helpers
const $  = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
const safe = fn => { try { fn && fn(); } catch (e) { console.error(`${fn.name||'init'} failed:`, e); } };

// запуск после готовности DOM — и каждая инициализация в try/catch
window.addEventListener('DOMContentLoaded', () => {
  safe(window.initSlots);
  safe(window.initAvailabilityBadge);
});

function isWhitelistTarget(target) {
  return !!target.closest('input, textarea, [contenteditable="true"], .allow-select, .allow-copy');
}

document.addEventListener('contextmenu', function (e) {
  if (!isWhitelistTarget(e.target)) e.preventDefault();
}, { capture: true });

document.addEventListener('selectstart', function (e) {
  if (!isWhitelistTarget(e.target)) e.preventDefault();
}, { capture: true });

document.addEventListener('dragstart', function (e) {
  if (!isWhitelistTarget(e.target)) e.preventDefault();
}, { capture: true });

document.addEventListener('keydown', function (e) {
  const k = e.key.toLowerCase();
  if ((e.ctrlKey || e.metaKey) && ['c','x','a','p','s'].includes(k) && !isWhitelistTarget(e.target)) {
    e.preventDefault();
  }
}, { capture: true });

document.addEventListener('copy', function (e) {
  if (isWhitelistTarget(e.target)) return;
  e.preventDefault();
  const text = '© ' + location.hostname + ' — копирование запрещено.';
  if (e.clipboardData) {
    e.clipboardData.setData('text/plain', text);
  } else if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).catch(()=>{});
  }
}, { capture: true });

// Console banner
(function(){try{console.log('%cLanding (split files)','background:#16324a;color:#fff;padding:2px 8px;border-radius:6px')}catch(e){}})();
  
// Mobile animation
(function advOnScrollMobileOnly(){
  const mq = window.matchMedia('(max-width: 640px) and (pointer: coarse)');
  if (!mq.matches) return; // только смартфоны

  const targets = document.querySelectorAll('[data-anim="adv"]');
  if (!targets.length) return;

  const io = new IntersectionObserver((entries, obs) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add('play');
        obs.unobserve(e.target);
      }
    }
  }, { threshold: 0.25 });

  targets.forEach(t => io.observe(t));
})();

// i18n DICT (RU/SR)
(function(){
  const LOCALES = { ru: 'ru-RU', sr: 'sr-RS' };

  const I18N = {
    ru: {
      /* GLOBAL/LINKS */
      link_back_top: 'Наверх',

      /* NAV + HEADER */
      nav_services:'Услуги', nav_reviews:'Отзывы', nav_price:'Цена', nav_faq:'FAQ', nav_contact:'Контакты',
      city:'Нови-Сад',
      hdr_skip_link:'Пропустить меню и перейти к содержанию',
      hdr_badge_checking:'Проверяю свободные слоты…',
      tz_btn_aria:'Время слотов',
      // в HTML: «зима/лето»
      tz_tip:'Время слотов по Белграду (UTC+1 зима, UTC+2 лето)',

      /* HERO */
      hero_title:'Няня в Нови-Саде — забота, безопасность и бережное развитие',
      hero_sub:'Освободите время для личных дел, спокойно работайте из дома[br] или проведите вечер в тишине - без тревоги, отвлечения и стресса.',
      hero_tag_age:'31 год', hero_tag_teacher:'Воспитатель', hero_tag_mom:'Мама', hero_tag_coach:'Детский тренер',
      hero_tag_ontime:'Вовремя', hero_tag_report:'Заметки/фото', hero_tag_slots:'Слоты 2-4ч', hero_tag_no_screens:'Без гаджетов',
      btn_slots:'Проверить свободные слоты',
      hero_calc:'Рассчитать цену за 1 минуту',
      hero_read_reviews:'Читать отзывы родителей',

      /* SERVICES */
      services_title:'Услуги',
      services_hint:'Дополнительные услуги учитываются в калькуляторе через чекбокс.',
      services_filter_all:'Все', services_filter_basic:'Базовые', services_filter_addon:'Дополнительные',
      svc_badge_extra:'по договорённости',
      svc_base1_t:'Распорядок дня',      svc_base1_d:'Спокойное бодрствование, присмотр, быт, гигиена, сон.',
      svc_base2_t:'Занятия и игры',      svc_base2_d:'Рисование, лепка, творчество, активности, моторика, логика.',
      svc_base3_t:'Прогулки',            svc_base3_d:'Подвижные игры на свежем воздухе в парке/дворе.',
      svc_base4_t:'Сопровождение',       svc_base4_d:'Отвезти/забрать с кружка, секции, детсада, школы.',
      svc_extra1_t:'Питание',            svc_extra1_d:'Простой перекус для ребёнка по вашему меню.',
      svc_extra2_t:'Уборка',             svc_extra2_d:'Небольшая уборка в детской комнате.',
      svc_extra3_t:'Тренировка',         svc_extra3_d:'Персональное фитнес-занятие/гимнастика на 30 минут.',

      /* WHY */
      why_title:'Почему я',
      why1_t:'Безопасность',           why1_d:'Сертификаты CPR/First Aid, учёт аллергий, чек-лист на случай ЧП.',
      why2_t:'Эмпатия и границы',      why2_d:'Спокойная адаптация и дисциплина, уважение к личности ребёнка.',
      why3_t:'Игры без экранов',       why3_d:'Занятия по возрасту: моторика, творчество, прогулки - без гаджетов.',
      why4_t:'Режим семьи',            why4_d:'Поддержание вашего распорядка, правил и ценностей семьи.',

      /* EXPERIENCE */
      xp_title:'Мой опыт',
      xp_list_aria:'Лента опыта по годам',
      // заголовок как в HTML (множественное число прилагательных)
      xp1_h:'Частные и государственные детсады',
      xp1_p:'Воспитатель детского сада: поддержание распорядка дня, организация развивающих занятий и досуга, развитие речи, постановка и автоматизация звуков, наблюдение и фиксация прогресса, взаимодействие с родителями.',
      xp2_h:'ВлГУ им. Столетовых',
      xp2_p:'Высшее педагогическое образование по направлению дефектология.',
      xp3_h:'World Class, фитнес-клуб',
      xp3_p:'Фитнес-инструктор: коррекционные, общеразвивающие и силовые занятия; персональные тренировки (2-16 лет); организация детских праздников и творческих мастер-классов.',

      /* REVIEWS */
      reviews_title:'Отзывы родителей',
      reviews_tabs_aria:'Категории отзывов',
      reviews_filter_all:'Все',
      // как в чипах HTML:
      reviews_filter_two:'2 детей',
      reviews_filter_toddlers:'Малыши',
      reviews_filter_preschool:'3–7 лет',
      reviews_region_label:'Карусель отзывов',

      /* SLOTS */
      slots_title:'Свободные слоты на неделю',
      slots_badge_next:'Ближайший слот: {date} | {t1}–{t2}',
      slots_badge_none:'Свободно: по запросу',
      slots_btn_request:'Запросить',

      /* CALC */
      calc_title:'Калькулятор стоимости (Нови-Сад)',
      calc_hours_label:'Часы (кол-во за визит)',
      calc_hours_hint:'Минимум от 2-х часов',
      calc_hours_err:'Минимум 2 часа за визит',
      calc_optA:'Сделать лёгкий перекус для ребёнка', calc_optA_add:'+300',
      calc_kids_label:'Дети', calc_kids_hint:'2 детей: +25% • если один < 2 лет: +50%',
      calc_k1:'1 ребёнок', calc_k2:'2 ребёнка', calc_k2inf:'2 ребёнка (если один младше 2-х лет)',
      calc_optB:'Сделать уборку в детской комнате',   calc_optB_add:'+300',
      calc_day_label:'День недели', calc_day_hint:'Выходной/праздник: +25%',
      calc_day_weekday:'Будни', calc_day_weekend:'Выходной/праздник',
      calc_optC:'Провести фитнес-занятие на 30 мин',  calc_optC_add:'+600', // как в HTML
      calc_presets_aria:'Быстрый выбор', p2h:'2 ч', p3h:'3 ч', p4h:'4 ч', p5h:'5 ч', pWeekday:'Будни', pWeekend:'Выходной', pKids2:'Два ребёнка',
      calc_notice:'Минимальный расчёт ведётся от 2 часов.',
      calc_total:'Итог: {sum} дин',
      calc_share:'Поделиться',
      calc_eur_toggle:'Показать результат в евро (курс {rate} дин/€)',
      calc_cta:'Уточнить стоимость',

      /* FAQ */
      faq_title:'Ответы на частые вопросы',
      faq_updated_prefix:'Обновлено: {when}',
      faq_q_meet:'Как происходит знакомство?',
      faq_a_meet_1:'Проводим короткий созвон на 10–15 минут.',
      faq_a_meet_2:'По возможности делаем совместную встречу-знакомство на 30–40 минут.',
      faq_a_meet_3:'Дополнительно обсуждаем ваш режим, договорённости, особенности ребёнка, цели и нюансы.',
      faq_q_price:'Сколько стоит услуга?',
      // как в HTML: от 900 дин/час
      faq_a_price_1:'Базовая ставка в Нови-Саде: от 900 дин/час днём. Не работаю поздно вечером и ночью.',
      faq_a_price_2:'Если двое детей: +25–50% к ставке в зависимости от их возраста.',
      faq_a_price_3:'В выходные/праздники и при срочных вызовах действует повышающий коэффициент - условия обсуждаем индивидуально.',
      faq_q_docs:'Какие документы вы предоставляете?',
      faq_a_docs_intro:'По запросу на первой встрече показываю оригиналы:',
      faq_a_docs_1:'Паспорт/личная карта (ID)',
      faq_a_docs_2:'Справка об отсутствии судимости',
      faq_a_docs_3:'Электронные сертификаты или диплом об образовании',
      faq_a_docs_4:'Разрешение на проживание/работу (если требуется)',
      faq_a_docs_5:'Медицинская справка о состоянии здоровья (если требуется)',
      faq_a_docs_6:'Рекомендации (контакты семей по согласованию)',
      faq_a_docs_7:'По вашему желанию подписываю соглашение о конфиденциальности (NDA)',
      faq_q_delay:'Что если родитель задерживается?',
      faq_a_delay_1:'До 15 минут — без доплаты, вхожу в положение родителя.',
      faq_a_delay_2:'Более 15 минут — прошу оплатить половину часовой ставки.',
      faq_a_delay_3:'Более 30 минут — прошу оплатить полную ставку за час.',
      faq_q_pets:'Как вы относитесь к домашним животным?',
      faq_a_pets:'Хорошо отношусь к домашним животным. Если ваши питомцы не рады гостям - для комфорта всем лучше, чтобы они были в отдельной комнате/зоне.',
      faq_q_terms:'Какие условия для сотрудничества?',
      faq_a_terms:'Я не сижу с заболевшим ребёнком (температура, признаки ОРВИ, сыпь, тошнота/рвота). О любых травмах или болезнях прошу сообщать заранее. При отсутствии достоверной информации оставляю за собой право прекратить сотрудничество.',
      faq_q_taxi:'Какие условия компенсации проезда?',
      faq_a_taxi:'Если заказ начинается до 9:00 или заканчивается после 21:00, а также если дорога занимает более 30 минут, то прошу компенсировать расходы на такси от/до дома.',
      faq_q_cancel:'Какие условия отмены?',
      faq_a_cancel_1:'Отмена менее чем за 3 часа до начала - оплата 1 часа работы.',
      faq_a_cancel_2:'Отмена менее чем за 1 час - полная стоимость от предполагаемого времени заказа.',
      faq_a_cancel_3:'Если по инициативе родителей заказ заканчивается раньше - стоимость заказа не уменьшается.',
      faq_copy_link_title:'Скопировать ссылку на вопрос',

      /* CONTACT */
      contact_title:'Свяжитесь со мной',
      // в HTML это две отдельные строки
      contact_hours:'Режим работы: 09:00 - 21:00',
      contact_lang:'RU / SRB',
      contact_tz_tip:'Время по Белграду (UTC+1 зима, UTC+2 лето)',
      contact_actions:'Контакты', contact_tg:'Telegram', contact_vb:'Viber', contact_phone:'+381 XX XXX XX XX',
      form_name:'Ваше имя', form_name_err:'Пожалуйста, укажите имя.',
      form_contact:'Телефон/мессенджер', form_contact_err:'Пожалуйста, укажите телефон или username.',
      form_time:'Желаемая дата/время', form_time_ph:'напр.: пн, 01.12 · 10:00',
      form_msg:'Сообщение', form_msg_ph:'Коротко опишите запрос',
      form_consent:'Даю согласие на обработку данных согласно политике.',
      form_submit:'Отправить запрос',

      /* FOOTER */
      foot_open_gmaps:'Открыть в Google Maps',
      // как в HTML — короткая форма
      foot_privacy:'Конфиденциальность',
      // отдельная ссылка в футере
      foot_cookie:'Настройки cookie',

      /* COOKIES (баннер/настройки) */
      ck_title:'Файлы cookie',
      ck_desc:'Мы используем строго необходимые cookie для работы сайта и по вашему согласию - аналитические cookie (Google Analytics 4) для оценки посещаемости. Рекламных cookie нет. Согласие можно отозвать в любой момент в «Настройки cookie». Подробнее — в Политике конфиденциальности.',
      ck_decline:'Отклонить', ck_accept:'Принять аналитику', ck_manage:'Настройки cookie'
    },

    sr: {
      /* GLOBAL/LINKS */
      link_back_top:'Na vrh',

      /* NAV + HEADER */
      nav_services:'Usluge', nav_reviews:'Utisci', nav_price:'Cena', nav_faq:'FAQ', nav_contact:'Kontakt',
      city:'Novi Sad',
      hdr_skip_link:'Preskoči meni i pređi na sadržaj',
      hdr_badge_checking:'Proveravam slobodne termine…',
      tz_btn_aria:'Vreme termina',
      tz_tip:'Vreme termina po Beogradu (UTC+1 zima, UTC+2 leto)',

      /* HERO */
      hero_title:'Dadilja u Novi Sad - briga, bezbednost i pažljiv razvoj',
      hero_sub:'Oslobodite vreme za lične stvari, radite od kuće mirno[br] ili provedite veče u tišini - bez brige, ometanja i stresa.',
      hero_tag_age:'31 godina', hero_tag_teacher:'Vaspitač', hero_tag_mom:'Mama', hero_tag_coach:'Dečiji trener',
      hero_tag_ontime:'Tačno na vreme', hero_tag_report:'Beleške/foto', hero_tag_slots:'Termini 2-4h', hero_tag_no_screens:'Bez ekrana',
      btn_slots:'Proverite slobodne termine',
      hero_calc:'Izračunajte cenu za 1 minut',
      hero_read_reviews:'Pročitajte utiske roditelja',

      /* SERVICES */
      services_title:'Usluge',
      services_hint:'Dodatne usluge ulaze u kalkulator preko ček-boksa.',
      services_filter_all:'Sve', services_filter_basic:'Osnovne', services_filter_addon:'Dodatne',
      svc_badge_extra:'po dogovoru',
      svc_base1_t:'Raspored dana',     svc_base1_d:'Miran boravak, briga, higijena, san.',
      svc_base2_t:'Aktivnosti i igre',  svc_base2_d:'Crtanje, plastelin, kreativnost, motorika, logika.',
      svc_base3_t:'Šetnje',             svc_base3_d:'Igre na otvorenom u parku/dvorištu.',
      svc_base4_t:'Pratnja',            svc_base4_d:'Odvoz/dovoz na sekcije, vrtić, školu.',
      svc_extra1_t:'Ishrana',           svc_extra1_d:'Jednostavna užina za dete po vašem meniju.',
      svc_extra2_t:'Čišćenje',          svc_extra2_d:'Malo čišćenje u dečijoj sobi.',
      svc_extra3_t:'Trening',           svc_extra3_d:'Personalni fitnes/gimnastika 30 minuta.',

      /* WHY */
      why_title:'Zašto ja',
      why1_t:'Bezbednost',           why1_d:'Sertifikati CPR/Prva pomoć, alergije, ček-lista za vanredne situacije.',
      why2_t:'Empatija i granice',   why2_d:'Meka adaptacija i disciplina, poštovanje ličnosti deteta.',
      why3_t:'Igre bez ekrana',      why3_d:'Aktivnosti po uzrastu: motorika, kreativnost, šetnje — bez ekrana.',
      why4_t:'Režim porodice',       why4_d:'Održavanje vaše rutine, pravila i porodičnih vrednosti.',

      /* EXPERIENCE */
      xp_title:'Moje iskustvo',
      xp_list_aria:'Traka iskustva po godinama',
      xp1_h:'Privatni i državni vrtići',
      xp1_p:'Vaspitač: održavanje dnevne rutine, organizacija razvojnih aktivnosti i odmora, razvoj govora, korekcija izgovora.',
      xp2_h:'Vladimir državni univerzitet (VlGU)',
      xp2_p:'Visoko pedagoško obrazovanje - defektologija.',
      xp3_h:'World Class, fitnes klub',
      xp3_p:'Fitnes instruktor: korektivni, opšti i snaga; personalni treninzi (2–16 god); organizacija dečijih proslava i kreativnih radionica.',

      /* REVIEWS */
      reviews_title:'Utisci roditelja',
      reviews_tabs_aria:'Kategorije utisaka',
      reviews_filter_all:'Svi',
      reviews_filter_two:'2 dece',
      reviews_filter_toddlers:'Mališani',
      reviews_filter_preschool:'3–7',
      reviews_region_label:'Karusel utisaka',

      /* SLOTS */
      slots_title:'Slobodni termini za nedelju',
      slots_badge_next:'Najbliži termin: {date} | {t1}–{t2}',
      slots_badge_none:'Slobodno: na upit',
      slots_btn_request:'Zatraži',

      /* CALC */
      calc_title:'Kalkulator cene (Novi Sad)',
      calc_hours_label:'Sati (po poseti)',   calc_hours_hint:'Minimum 2 sata', calc_hours_err:'Minimum 2 sata po poseti',
      calc_optA:'Pripremiti laganu užinu za dete', calc_optA_add:'+300',
      calc_kids_label:'Deca', calc_kids_hint:'2 dece: +25% • ako je jedno < 2 god: +50%',
      calc_k1:'1 dete', calc_k2:'2 deteta', calc_k2inf:'2 deteta (ako je jedno mlađe od 2 god)',
      calc_optB:'Očistiti dečiju sobu', calc_optB_add:'+300',
      calc_day_label:'Dan u nedelji', calc_day_hint:'Vikend/praznik: +25%',
      calc_day_weekday:'Radni dan', calc_day_weekend:'Vikend/praznik',
      calc_optC:'Održati fitnes-trening 30 min', calc_optC_add:'+600',
      calc_presets_aria:'Brzi izbor', p2h:'2 č', p3h:'3 č', p4h:'4 č', p5h:'5 č', pWeekday:'Radni dan', pWeekend:'Vikend', pKids2:'Dvoje dece',
      calc_notice:'Minimalni obračun od 2 sata.',
      calc_total:'Ukupno: {sum} RSD',
      calc_share:'Podeli',
      calc_eur_toggle:'Prikaz u evrima (kurs {rate} RSD/€)',
      calc_cta:'Precizirati cenu',

      /* FAQ */
      faq_title:'Odgovori na česta pitanja',
      faq_updated_prefix:'Ažurirano: {when}',
      faq_q_meet:'Kako izgleda upoznavanje?',
      faq_a_meet_1:'Kratak poziv 10–15 minuta.',
      faq_a_meet_2:'Po mogućnosti zajednički susret-upoznavanje 30-40 minuta.',
      faq_a_meet_3:'Dodatno prolazimo vašu rutinu, dogovore, osobine deteta, ciljeve i nijanse.',
      faq_q_price:'Koliko košta usluga?',
      faq_a_price_1:'Osnovna cena u Novom Sadu: od 900 RSD/sat preko dana. Ne radim kasno uveče i noću.',
      faq_a_price_2:'Ako su dvoje dece: +25-50% u zavisnosti od uzrasta.',
      faq_a_price_3:'Vikendom/praznikom i kod hitnih poziva primenjuje se koeficijent - uslove dogovaramo.',
      faq_q_docs:'Koja dokumenta pružate?',
      faq_a_docs_intro:'Na zahtev na prvom sastanku pokazujem originale:',
      faq_a_docs_1:'Pasoš/lična karta (ID)',
      faq_a_docs_2:'Uverenje o nekažnjavanju',
      faq_a_docs_3:'Elektronski sertifikati ili diploma',
      faq_a_docs_4:'Dozvola za boravak/rad (ako je potrebno)',
      faq_a_docs_5:'Medicinsko uverenje o zdravlju (ako je potrebno)',
      faq_a_docs_6:'Preporuke (kontakti porodica po dogovoru)',
      faq_a_docs_7:'Po želji potpisujem NDA (sporazum o poverljivosti)',
      faq_q_delay:'Šta ako se roditelj zadrži?',
      faq_a_delay_1:'Do 15 minuta — bez doplate.',
      faq_a_delay_2:'Više od 15 min — molim 50% jednog sata.',
      faq_a_delay_3:'Više od 30 min — pun sat.',
      faq_q_pets:'Kako se odnosite prema kućnim ljubimcima?',
      faq_a_pets:'Dobro. Ako ljubimci ne vole goste - bolje da budu u zasebnoj prostoriji/zoni radi komfora svima.',
      faq_q_terms:'Koji su uslovi saradnje?',
      faq_a_terms:'Ne čuvam bolesno dete (temperatura, znaci prehlade, osip, mučnina/povraćanje). O povredama/bolestima javite unapred. Ako nema verodostojnih informacija, zadržavam pravo da prekinem saradnju.',
      faq_q_taxi:'Koji su uslovi nadoknade prevoza?',
      faq_a_taxi:'Ako narudžbina počinje pre 9:00 ili završava posle 21:00, kao i ako put traje duže od 30 minuta - molim za nadoknadu taksija od/do kuće.',
      faq_q_cancel:'Koji su uslovi otkazivanja?',
      faq_a_cancel_1:'Otkaz manje od 3 sata ranije — naplata 1 sata rada.',
      faq_a_cancel_2:'Otkaz manje od 1 sata — puna cena planiranog termina.',
      faq_a_cancel_3:'Ako po inicijativi roditelja narudžbina se završi ranije - cena se ne umanjuje.',
      faq_copy_link_title:'Kopirati link na pitanje',

      /* CONTACT */
      contact_title:'Kontaktirajte me',
      contact_hours:'Radno vreme: 09:00 - 21:00',
      contact_lang:'RU / SRB',
      contact_tz_tip:'Vreme po Beogradu (UTC+1 zima, UTC+2 leto)',
      contact_actions:'Kontakti', contact_tg:'Telegram', contact_vb:'Viber', contact_phone:'+381 XX XXX XX XX',
      form_name:'Vaše ime', form_name_err:'Molim unesite ime.',
      form_contact:'Telefon/mesežer', form_contact_err:'Molim unesite telefon ili username.',
      form_time:'Željeni datum/vreme', form_time_ph:'npr.: pon, 01.12 · 10:00',
      form_msg:'Poruka', form_msg_ph:'Ukratko opišite zahtev',
      form_consent:'Dajem saglasnost za obradu podataka prema politici.',
      form_submit:'Pošalji zahtev',

      /* FOOTER */
      foot_open_gmaps:'Otvoriti u Google Maps',
      foot_privacy:'Privatnost',
      foot_cookie:'Podešavanja kolačića',

      /* COOKIES */
      ck_title:'Kolačići',
      ck_desc:'Koristimo isključivo neophodne kolačiće za rad sajta i, uz vašu saglasnost, analitičke kolačiće (Google Analytics 4) za merenje posećenosti. Reklamnih kolačića nema. Saglasnost možete povući u bilo kom trenutku u „Podešavanja kolačića“. Više u Politici privatnosti.',
      ck_decline:'Odbij', ck_accept:'Prihvati analitiku', ck_manage:'Podešavanja kolačića'
    }
  };

  window.I18N = I18N;
  window.LOCALES = LOCALES;
})();

// RUNTIME (final)
(function () {
  const I18N    = window.I18N    || {};
  const LOCALES = window.LOCALES || { ru: 'ru-RU', sr: 'sr-RS' };

  // "Текст {x}" + {x:'…'}
  function fmt(str, params){
    if (!params) return String(str ?? '');
    return String(str ?? '').replace(/\{(\w+)\}/g, (_, k) => (params[k] ?? ''));
  }

  // Форматтеры дат/времени по локали
  function makeFormatters(lang){
    const loc = LOCALES[lang] || LOCALES.ru || 'ru-RU';
    return {
      dayLabel: (ymd)=>{
        if (!ymd) return '';
        const [y,m,d] = String(ymd).split('-').map(Number);
        const dt = new Date(y, m-1, d);
        return new Intl.DateTimeFormat(loc, { weekday:'short', day:'numeric', month:'long' }).format(dt);
      },
      timeHM: (ts)=> new Intl.DateTimeFormat(loc, { hour:'2-digit', minute:'2-digit' }).format(new Date(ts))
    };
  }

  function applyLang(lang){
    const dict = I18N[lang] || I18N.ru || {};
    const loc  = LOCALES[lang] || LOCALES.ru || 'ru-RU';

    document.documentElement.setAttribute('lang', lang === 'sr' ? 'sr' : 'ru');

    // Текстовые ноды: .i18n[data-key]
    document.querySelectorAll('.i18n').forEach(el => {
      const k = el.getAttribute('data-key');
      if (!k) return;
      const v = dict[k];
      if (v == null) return;

      // Разрешаем HTML и [br] => <br>
      if (el.hasAttribute('data-i18n-html')) {
        el.innerHTML = String(v).replace(/\[br\]/g, '<br>');
      } else {
        el.textContent = v;
      }
    });

    // Атрибуты: .i18n-attr или [data-i18n-attr]
    document.querySelectorAll('.i18n-attr,[data-i18n-attr]').forEach(el => {
      const k = el.getAttribute('data-key');
      if (!k) return;
      const attr = el.getAttribute('data-attr') || el.getAttribute('data-i18n-attr') || 'placeholder';
      const v = dict[k];
      if (v != null) el.setAttribute(attr, v);
    });

    // Кнопки RU/SR
    document.querySelectorAll('.lang-btn').forEach(b=>{
      const on = b.getAttribute('data-lang') === lang;
      b.classList.toggle('active', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });

    // Экспорт хелперов
    const f = makeFormatters(lang);
    window.i18n = {
      lang, dict, locale: loc,
      t: (key, params)=> fmt(dict[key] ?? key, params),
      fmtDay:  f.dayLabel,
      fmtTime: f.timeHM
    };
    window.i18nSetLang = applyLang; // удобный алиас

    try { localStorage.setItem('lang', lang); } catch(_){}

    // ВАЖНО: событие смены языка — внутри applyLang
    window.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
  }

  function init(){
    // Определяем язык: ?lang=…, localStorage, системный
    const q = new URLSearchParams(location.search);
    const qp = (q.get('lang') || '').toLowerCase();
    let stored; try { stored = localStorage.getItem('lang'); } catch(_){}
    const sys = (navigator.language || 'ru').toLowerCase().startsWith('sr') ? 'sr' : 'ru';
    const lang = (qp === 'sr' || qp === 'ru') ? qp : (stored || sys);

    applyLang(lang);

    // Сообщаем модулям, что i18n готов (однократно после первого applyLang)
    window.dispatchEvent(new Event('i18nready'));

    // Переключение по клику на .lang-btn
    document.addEventListener('click', e=>{
      const btn = e.target.closest?.('.lang-btn');
      if (!btn) return;
      e.preventDefault();
      applyLang(btn.getAttribute('data-lang'));
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

// ===== Slots + Badge (i18n, final)
(function(){
  const API_SLOTS_URL =
    'https://script.google.com/macros/s/AKfycbx-IkXY39sBerBkSAjTtv-SRbzX7tkg4spCk_QB2eGzSFpz2999WuFtXt0QKWZy9x8C/exec';

  /* ---------- i18n utils ---------- */
  const t = (key, params)=>{
    const dict = (window.i18n && window.i18n.dict) || (window.I18N && window.I18N.ru) || {};
    const s = dict[key] ?? key;
    return String(s).replace(/\{(\w+)\}/g, (_,k)=> (params && params[k] != null ? params[k] : ''));
  };
  const getLocale = ()=> (window.i18n && window.i18n.locale) || 'ru-RU';
  const fmtDay = (ymd)=>{
    if (window.i18n && window.i18n.fmtDay) return window.i18n.fmtDay(ymd);
    if (!ymd) return '';
    const [y,m,d] = ymd.split('-').map(Number);
    return new Intl.DateTimeFormat(getLocale(), { weekday:'short', day:'numeric', month:'long' })
      .format(new Date(y, m-1, d));
  };

  /* ---------- time helpers ---------- */
  const hhmm = d => new Intl.DateTimeFormat(getLocale(), {hour:'2-digit', minute:'2-digit'}).format(d);
  function safeStart(s){
    if (s.startLabel) return s.startLabel;
    const d = s.startISO ? new Date(s.startISO) : new Date(s.startTs || 0);
    return Number.isFinite(d.getTime()) ? hhmm(d) : '';
  }
  function safeEnd(s){
    if (s.endLabel) return s.endLabel;
    const d = s.endISO ? new Date(s.endISO) : new Date(s.endTs || 0);
    return Number.isFinite(d.getTime()) ? hhmm(d) : '';
  }
  const getStartTs = s => s.startTs ?? Date.parse(s.startISO || 0);
  const timeLabel  = s => `${safeStart(s)}–${safeEnd(s)}`;
  const pad2 = n => String(n).padStart(2,'0');
  const ymdLocal = d => `${d.getFullYear()}-${pad2(d.getMonth()+1)}-${pad2(d.getDate())}`;

  /* ---------- badge helpers ---------- */
  const BADGE_SHORT_BP = '(max-width: 420px)';
  function normalizeBadgeText(fullText){
    if (!window.matchMedia(BADGE_SHORT_BP).matches) return fullText;
    return String(fullText)
      .replace(/^Ближайший слот:/, 'Слот:')
      .replace(/^Najbliži termin:/, 'Termin:');
  }
  function rerenderBadgeShort(){
    const t = document.querySelector('#headerFreeBadge .avail-text');
    if (t?.dataset.full) t.textContent = normalizeBadgeText(t.dataset.full);
  }
  function setBadge(text, classes = []){
    const badge = document.querySelector('#headerFreeBadge');
    const badgeText = badge?.querySelector('.avail-text');
    if (!badge || !badgeText) return;
    ['is-today','is-tomorrow','is-next','is-none','is-live'].forEach(c=> badge.classList.remove(c));
    classes.forEach(c => badge.classList.add(c));
    badgeText.dataset.full = text;
    badgeText.textContent  = normalizeBadgeText(text);
    badge.style.display = 'inline-flex';
  }
  // Экспорт для совместимости со старым кодом
  window.setBadge = setBadge;

  /* ---------- slots render ---------- */
  const wrap = document.querySelector('#slotsList');
  if (wrap) wrap.classList.add('slots-grid');

  function groupByDate(slots){
    const m = new Map();
    for (const s of slots) {
      let key = s.date;
      if (!key) {
        const dt = s.startTs ? new Date(s.startTs) : (s.startISO ? new Date(s.startISO) : null);
        if (dt) key = ymdLocal(dt);
      }
      if (!key) continue;
      if (!m.has(key)) m.set(key, []);
      m.get(key).push(s);
    }
    for (const arr of m.values()) arr.sort((a,b)=> getStartTs(a)-getStartTs(b));
    return [...m.entries()].map(([date, items])=>({date, items}))
                           .sort((a,b)=> a.date.localeCompare(b.date));
  }

  const makeTimesLine = items => items.map(s => `${safeStart(s)}–${safeEnd(s)}`).join(', ');
  const cardHTML = (date, items)=> `
    <article class="slot-card">
      <div class="slot-date">${fmtDay(date)}</div>
      <div class="slot-time">${makeTimesLine(items)}</div>
      <a class="btn btn-outline btn-lg slot-cta" href="#contact">${t('slots_btn_request')}</a>
    </article>
  `;

  function renderGrid(list){
    if (!wrap) return;
    if (!list.length){
      wrap.innerHTML = `<p class="muted">${t('slots_badge_none')}</p>`;
      return;
    }
    const groups = groupByDate(list);
    wrap.innerHTML = groups.map(g => cardHTML(g.date, g.items)).join('');
  }

  function renderBadge(list){
    const badge = document.querySelector('#headerFreeBadge');
    if (!badge) return;

    const now = Date.now();
    const todayYMD    = new Date().toISOString().slice(0,10);
    const tomorrowYMD = new Date(now + 86400000).toISOString().slice(0,10);

    const byStart = arr => arr.slice().sort((a,b)=> getStartTs(a)-getStartTs(b));

    const today = byStart(list.filter(s => (s.date || (s.startISO||'').slice(0,10)) === todayYMD))[0];
    if (today){
      setBadge(t('slots_badge_next', { date: fmtDay(today.date || todayYMD), t1: safeStart(today), t2: safeEnd(today) }),
               ['is-today','is-live']);
      return;
    }
    const tomorrow = byStart(list.filter(s => (s.date || (s.startISO||'').slice(0,10)) === tomorrowYMD))[0];
    if (tomorrow){
      setBadge(t('slots_badge_next', { date: fmtDay(tomorrow.date || tomorrowYMD), t1: safeStart(tomorrow), t2: safeEnd(tomorrow) }),
               ['is-tomorrow','is-live']);
      return;
    }
    const next = byStart(list.filter(s => getStartTs(s) > now))[0] || byStart(list)[0];
    if (next){
      const ymd = next.date || (next.startISO ? next.startISO.slice(0,10) : '');
      setBadge(t('slots_badge_next', { date: fmtDay(ymd), t1: safeStart(next), t2: safeEnd(next) }),
               ['is-next','is-live']);
      return;
    }
    setBadge(t('slots_badge_none'), ['is-none']);
  }

  // Для обратной совместимости — старые вызовы window.updateBadge(raw)
  window.updateBadge = renderBadge;

  /* ---------- fetch ---------- */
  function fetchAndRender(){
    const badge = document.querySelector('#headerFreeBadge');
    const badgeText = badge?.querySelector('.avail-text');
    if (badge && badgeText) setBadge(t('hdr_badge_checking'), ['is-live']);

    fetch(API_SLOTS_URL + '?t=' + Date.now(), { cache:'no-store', mode:'cors' })
      .then(r => r.json())
      .then(data => {
        const list = Array.isArray(data?.slots) ? data.slots :
                     Array.isArray(data) ? data : [];
        window.__freeSlots = list;
        renderBadge(list);
        renderGrid(list);
      })
      .catch(err => {
        console.warn('Slots API error:', err);
        if (wrap) wrap.innerHTML = `<p class="error">Слоты временно недоступны. Напишите мне.</p>`;
        setBadge(t('slots_badge_none'), ['is-none']);
      });
  }

  /* ---------- react to i18n and resize ---------- */
  window.addEventListener('i18nready', ()=>{
    rerenderBadgeShort();
    if (window.__freeSlots){ renderBadge(window.__freeSlots); renderGrid(window.__freeSlots); }
  });
  window.addEventListener('langchange', ()=>{
    rerenderBadgeShort();
    if (window.__freeSlots){ renderBadge(window.__freeSlots); renderGrid(window.__freeSlots); }
  });
  window.addEventListener('resize', rerenderBadgeShort);

  /* ---------- boot ---------- */
  if (document.readyState === 'loading')
    document.addEventListener('DOMContentLoaded', fetchAndRender);
  else
    fetchAndRender();
})();

// ===== Calculator — clean URL + #calc anchor + state sharing =====
(function(){
  const EUR_RATE=117, BASE=900, WEEKEND=1.25, TWO=1.25, INFANT=1.5, OPT=300, OPT_FIT=600, MIN=2, HOURS_MAX=10;
  const $ = id => document.getElementById(id);
  const money = v => { try { return v.toLocaleString('ru-RS'); } catch(_) { return String(v); } };

  // ---------- helpers ----------
  function normalizeHours(commit){
    const h=$('hours'), err=$('hoursErr');
    let v=parseInt(h?.value,10);
    const emptyOrNaN = !Number.isFinite(v) || (h?.value==='');
    if (emptyOrNaN) v = MIN;
    v = Math.max(MIN, Math.min(HOURS_MAX, v)); // 2..10
    if (commit && h) h.value = String(v);
    if (h)   h.classList.toggle('error', v < MIN);
    if (err) err.style.display = (v < MIN) ? 'block' : 'none';
    return v;
  }

  function hourlyRate(){
    let r=BASE;
    const day=$('dayType')?.value, kids=$('kids')?.value;
    if(day==='weekend') r*=WEEKEND;
    if(kids==='2_infant') r*=INFANT; else if(kids==='2') r*=TWO;
    return Math.round(r/10)*10;
  }

  function collectParams(){
    const sp = new URLSearchParams();
    sp.set('h',   $('hours')?.value || '');
    sp.set('k',   $('kids')?.value  || '');
    sp.set('d',   $('dayType')?.value || '');
    sp.set('a',   $('optA')?.checked ? '1' : '0');
    sp.set('b',   $('optB')?.checked ? '1' : '0');
    sp.set('c',   $('optC')?.checked ? '1' : '0');
    sp.set('eur', $('eurToggle')?.checked ? '1' : '0');
    return sp;
  }

  function applyParams(sp){
    try{
      if (sp.has('h')   && $('hours'))   $('hours').value   = sp.get('h');
      if (sp.has('k')   && $('kids'))    $('kids').value    = sp.get('k');
      if (sp.has('d')   && $('dayType')) $('dayType').value = sp.get('d');
      [['a','optA'],['b','optB'],['c','optC'],['eur','eurToggle']].forEach(([k,id])=>{
        if (sp.has(k)){ const el=$(id); if(el) el.checked = (sp.get(k)==='1' || sp.get(k)==='true'); }
      });
    }catch(_){}
  }

  const scrollToCalc = (smooth=true)=>{
    const el = $('calc');
    if (!el) return;
    el.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
  };

  // ---------- render/animate ----------
  let last=0;
  const render = (sum)=>{
    const eur = $('eurToggle')?.checked;
    let s = `Итог: ${money(sum)} дин`;
    if (eur) s += ` <span class="eur">(≈ €${Math.round(sum/EUR_RATE)})</span>`;
    const el = $('result'); if (el) el.innerHTML = s;
  };

  const animate = (to)=>{
    const from=last; if(from===to){ render(to); return; }
    const start=performance.now(), dur=180, diff=to-from;
    const step=(t)=>{ const p=Math.min(1,(t-start)/dur); render(Math.round(from+diff*p)); if(p<1) requestAnimationFrame(step); else last=to; };
    requestAnimationFrame(step);
  };

  // ---------- core calc ----------
  function recalc(commit=true){
    const h = normalizeHours(commit);
    const rate=hourlyRate();
    const add=( $('optA')?.checked?OPT:0 )+( $('optB')?.checked?OPT:0 )+( $('optC')?.checked?OPT_FIT:0 );
    const total=rate*h+add; animate(total);

    const br=$('breakdown');
    if(br) br.textContent=`Ставка: ${rate} дин/ч × ${h} ч${add?` | Дополнительно: +${add} дин`:''}`;

    const badges=$('badges');
    if(badges){
      const b=[]; const kids=$('kids')?.value, day=$('dayType')?.value;
      if(kids==='2') b.push('+25% двое детей');
      if(kids==='2_infant') b.push('+50% малыш <2 лет');
      if(day==='weekend') b.push('+25% выходной день');
      if($('eurToggle')?.checked) b.push('€');
      badges.innerHTML=b.map(t=>`<span class="badge">${t}</span>`).join('');
    }
    // адресную строку не трогаем (никаких ?query)
  }

  // ---------- sharing ----------
  async function shareCalcState(){
    const url = new URL(location.href);
    url.search = "";
    url.hash   = 'calc?' + collectParams().toString(); // якорь + параметры
    const link = url.toString();
    try { if (navigator.share){ await navigator.share({ url: link }); return; } } catch(_){}
    try {
      await navigator.clipboard.writeText(link);
      $('shareLink')?.classList.add('copied');
      setTimeout(()=>$('shareLink')?.classList.remove('copied'),1200);
    } catch(_){}
  }

  // ---------- URL state ----------
  function parseParamsFromLocation(){
    let raw = '';
    const h = location.hash || '';
    if (h.startsWith('#calc')) {
      const qPos = h.indexOf('?');
      raw = (qPos !== -1) ? h.slice(qPos + 1) : ''; // #calc?… → взять после '?', #calc → пусто
    } else if (h.startsWith('#') && h.includes('=')) {
      raw = h.slice(1); // обратная совместимость: #h=…&k=…
    } else if (location.search.startsWith('?')) {
      raw = location.search.slice(1); // запасной вариант
    }
    return new URLSearchParams(raw);
  }

  function initCalcURLState(){
    const sp = parseParamsFromLocation();
    const hasHashCalcOnly = (location.hash === '#calc');
    if (sp.size > 0) {
      applyParams(sp);
      requestAnimationFrame(()=> scrollToCalc(true));
    } else if (hasHashCalcOnly) {
      requestAnimationFrame(()=> scrollToCalc(true));
    }

    // чистим ?query, если был
    if (location.search) {
      try { history.replaceState(null, "", location.pathname + location.hash); } catch(_){}
    }
  }

  window.addEventListener('hashchange', ()=>{
    const h = location.hash || '';
    if (h.startsWith('#calc')) {
      const sp = parseParamsFromLocation();
      if (sp.size > 0) applyParams(sp);
      scrollToCalc(true);
      recalc(true);
    }
  });

  // ---------- bindings ----------
  function bind(){
    const hoursEl = $('hours');
    if (hoursEl) {
      hoursEl.addEventListener('input', () => { normalizeHours(false); recalc(false); });
      ['change','blur'].forEach(ev => hoursEl.addEventListener(ev, () => { normalizeHours(true); recalc(true); }));
    }

    ['kids','dayType','optA','optB','optC','eurToggle'].forEach(id=>{
      const el=$(id); if(!el) return;
      ['input','change'].forEach(e=> el.addEventListener(e,recalc));
    });

    const setH=n=>{ const h=$('hours'); if(h){ h.value=String(n); h.focus(); recalc(true); }};
    [['p2h',2],['p3h',3],['p4h',4],['p5h',5]].forEach(([id,val])=>{
      const b=$(id); if(b) b.addEventListener('click',()=>setH(val));
    });
    $('pWeekday')?.addEventListener('click', ()=>{ const d=$('dayType'); if(d){ d.value='weekday'; recalc(); }});
    $('pWeekend')?.addEventListener('click',()=>{ const d=$('dayType'); if(d){ d.value='weekend'; recalc(); }});
    $('pKids2')?.addEventListener('click',()=>{ const k=$('kids'); if(k){ k.value='2'; recalc(); }});

    // делегирование на чипы
    document.addEventListener('click',(ev)=>{
      const chip=ev.target.closest?.('.tag'); if(!chip) return;
      const txt=(chip.textContent||'').toLowerCase();
      if(txt.includes('2 ч')) return setH(2);
      if(txt.includes('3 ч')) return setH(3);
      if(txt.includes('4 ч')) return setH(4);
      if(txt.includes('выходной')){ const d=$('dayType'); if(d){ d.value='weekend'; recalc(); } return; }
      if(txt.includes('два ребёнка')||txt.includes('два ребенка')){ const k=$('kids'); if(k){ k.value='2'; recalc(); } return; }
    }, true);

    // share
    $('shareLink')?.addEventListener('click', (e)=>{ e.preventDefault(); shareCalcState(); });

    window.calcRecompute = () => recalc(true);
  }

  // ---------- boot ----------
  const boot = ()=>{ bind(); initCalcURLState(); recalc(true); };
  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();



// Footer year

(function(){var y=document.getElementById('yCopy'); if(y) y.textContent=new Date().getFullYear();})();


/* ===== FAQ ===== */
(function () {
  const list = document.querySelector('.faq-list');
  if (!list) return;

  const HEADER_OFFSET = 80; // ваш фикс-хедер (px). при необходимости поправьте

  function openItem(item, withScroll) {
    const btn   = item.querySelector('.faq-q');
    const panel = item.querySelector('.faq-a');
    if (!btn || !panel) return;

    // закрыть остальные
    list.querySelectorAll('.faq-item.is-open').forEach(it => {
      if (it !== item) closeItem(it);
    });

    item.classList.add('is-open');
    btn.setAttribute('aria-expanded', 'true');

    // ставим явную высоту = контент
    const inner = panel.firstElementChild;
    const target = inner ? inner.scrollHeight : panel.scrollHeight;
    panel.style.height = target + 'px';

    // скроллим так, чтобы шапка вопроса была под фикс-хедером
    if (withScroll) {
      const y = item.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET - 6;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }

  function closeItem(item) {
    const btn   = item.querySelector('.faq-q');
    const panel = item.querySelector('.faq-a');
    if (!btn || !panel) return;

    item.classList.remove('is-open');
    btn.setAttribute('aria-expanded', 'false');
    panel.style.height = '0px';
  }

  // пересчитать высоту открытых при ресайзе
  function recalcOpenHeights() {
    list.querySelectorAll('.faq-item.is-open .faq-a').forEach(panel => {
      const inner = panel.firstElementChild;
      const target = inner ? inner.scrollHeight : panel.scrollHeight;
      panel.style.height = target + 'px';
    });
  }
  window.addEventListener('resize', recalcOpenHeights);

  // обработчики по элементам
  list.querySelectorAll('.faq-item').forEach(item => {
    const btn   = item.querySelector('.faq-q');
    const copy  = item.querySelector('.faq-q__copy');

    // клик по вопросу
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');
      if (isOpen) closeItem(item);
      else openItem(item, true);

      // обновляем hash для deep-link
      if (btn.id) history.replaceState(null, '', '#' + btn.id);
    });

    // клавиатура (Space / Enter)
    btn.addEventListener('keydown', e => {
      if (e.key === ' ' || e.key === 'Spacebar' || e.key === 'Enter') {
        e.preventDefault();
        btn.click();
      }
    });

    // копирование ссылки
    copy?.addEventListener('click', e => {
      e.stopPropagation();
      const hash = btn.id || item.id || '';
      const url  = location.origin + location.pathname + (hash ? '#' + hash : '');
      navigator.clipboard.writeText(url).then(() => {
        copy.classList.add('copied');
        setTimeout(() => copy.classList.remove('copied'), 1200);
      });
    });
  });

  // открыть по хэшу (если пришли по ссылке)
  function openFromHash() {
    const id = decodeURIComponent(location.hash.replace('#', ''));
    if (!id) return;
    const el = document.getElementById(id);
    const item = el ? el.closest('.faq-item') : null;
    if (item) openItem(item, true);
  }
  window.addEventListener('hashchange', openFromHash);
  openFromHash();
})();


// Active menu on scroll
(function(){
  const links = Array.from(document.querySelectorAll('.header-nav a[href^="#"]'));
  const map = new Map();
  links.forEach(a => {
    const id = a.getAttribute('href').slice(1);
    const sec = document.getElementById(id);
    if (sec) map.set(sec, a);
  });
  if (!map.size) return;

  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      const link = map.get(e.target);
      if (!link) return;
      if (e.isIntersecting) {
        links.forEach(l => l.classList.remove('is-active'));
        link.classList.add('is-active');
      }
    });
  }, { rootMargin: `-${parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h'))||64}px 0px -65% 0px`, threshold: 0.01 });

  map.forEach((_, sec) => io.observe(sec));
})();


/* ===== Reviews: фильтр по чипам + пересборка дорожки ===== */
(function initReviewsFilter(){
  const sec   = document.getElementById('reviews');
  const list  = sec?.querySelector('.rv-chips');
  const mq    = sec?.querySelector('.rv-marquee');
  const track = mq?.querySelector('.rv-track');
  if (!sec || !list || !track) return;

  // 1) Сохраняем оригинальные карточки (до любых дублей маркизы)
  //    Берём первые уникальные по src/img — этого достаточно, чтобы отсечь клоны.
  const firstRun = [];
  const seen = new Set();
  track.querySelectorAll('.rv-item').forEach(card => {
    const key = card.querySelector('img')?.getAttribute('src') || card.outerHTML;
    if (seen.has(key)) return;
    seen.add(key);
    firstRun.push(card.cloneNode(true));
  });

  // 2) Сервис: собрать дорожку из базового набора + довести ширину (как в маркизе)
  const cloneChildrenOnce = (t) => {
    const frag = document.createDocumentFragment();
    Array.from(t.children).forEach(n => frag.appendChild(n.cloneNode(true)));
    t.appendChild(frag);
  };
  const fillToWidth = (mqEl, trackEl) => {
    let safety = 0;
    while (trackEl.scrollWidth < mqEl.clientWidth * 2 && safety < 3){
      cloneChildrenOnce(trackEl);
      safety++;
    }
  };

  // 3) Применить фильтр и пересобрать дорожку
  function applyFilter(filter){
    // База
    const base = firstRun.filter(el => {
      if (filter === 'all') return true;
      const cats = (el.dataset.cat || '').split(/\s+/);
      return cats.includes(filter);
    });
    const items = base.length ? base : firstRun;

    // Пересборка дорожки
    track.innerHTML = '';
    items.forEach(el => track.appendChild(el.cloneNode(true)));
    fillToWidth(mq, track);
  }

  // 4) Чипы: переключение состояний и вызов applyFilter
  list.addEventListener('click', (e) => {
    const btn = e.target.closest('.rv-chip[role="tab"]');
    if (!btn) return;
    const filter = btn.getAttribute('data-filter') || 'all';

    list.querySelectorAll('.rv-chip').forEach(c => {
      c.classList.toggle('is-active', c === btn);
      c.setAttribute('aria-selected', c === btn ? 'true' : 'false');
    });

    applyFilter(filter);
  });

  // Инициализация
  applyFilter('all');
})();



// ====== CONTACT ======
(function contactInit(){
  const tg   = document.getElementById('ctaTg');
  const vb   = document.getElementById('ctaViber');
  const tel  = document.getElementById('ctaTel');

  // ——— ВПИШИ свой номер (без плюса), а также TG-юзернейм/линк ———
  const phoneDigits = '381XXXXXXXXX';         // пример: 381641234567
  if (tg)  tg.href  = 'https://t.me/yourusername';
  if (vb)  vb.href  = `viber://chat?number=%2B${phoneDigits}`;
  if (tel) tel.href = `tel:+${phoneDigits}`;

  // ——— форма ———
  const form   = document.getElementById('contactForm');
  if (!form) return;

  const note   = document.getElementById('contactNotice');
  const name   = document.getElementById('cname');
  const cont   = document.getElementById('ccontact');
  const time   = document.getElementById('ctime');      // уйдёт в FormData
  const msg    = document.getElementById('cmsg');
  const agree  = document.getElementById('cagree');
  const eName  = document.getElementById('err-name');
  const eCont  = document.getElementById('err-contact');
  const submitBtn = document.getElementById('contactSubmit');

  let t0 = Date.now();

  // подсветка чекбокса при изменении
  agree?.addEventListener('change', () => agree.classList.remove('is-error'));

  // утилиты
  const setErr = (el, small, on) => {
    if (!el) return;
    el.classList.toggle('invalid', on);
    el.setAttribute('aria-invalid', on ? 'true' : 'false');
    if (small) small.hidden = !on;
  };
  [name, cont].forEach(i => i?.addEventListener('input', ()=> setErr(i, i===name?eName:eCont, !i.value.trim())));

  form.addEventListener('submit', async (e)=>{
    e.preventDefault();

    // 1) согласие обязательно
    if (!agree?.checked) {
      agree?.classList.add('is-error');
      agree?.focus();
      return;
    }

    // 2) honeypot + таймер
    const hp = form.querySelector('[name="website"]');
    if (hp && hp.value) return;
    if (Date.now() - t0 < 2500) return;

    // 3) валидация полей
    const badName = !name?.value.trim() || name.value.trim().length < 3;
    const badCont = !cont?.value.trim();
    setErr(name, eName, badName);
    setErr(cont, eCont, badCont);
    if (badName || badCont) {
      (badName ? name : cont)?.focus();
      return;
    }

    // 4) UI: блокируем кнопку и ставим aria-busy
    const oldLabel = submitBtn?.textContent;
    if (submitBtn) {
      submitBtn.setAttribute('disabled', 'true');
      submitBtn.textContent = 'Отправляю…';
    }
    form.setAttribute('aria-busy', 'true');

    // 5) отправка (Google Apps Script Web App)
    const fd = new FormData(form);
    try{
      const res = await fetch('https://script.google.com/macros/s/AKfycbyUhl5Vc9r_kDgzYpx96iuvGLXPql9Y4XtKyPrtMtePRw2Tlsrhvp6x_-ktyr1uiE12/exec', {
        method:'POST',
        body: fd
      });
      if (!res.ok) throw new Error('bad_status');

      if (note) note.textContent = 'Спасибо! Ваш запрос отправлен. Я отвечу в ближайшее время.';
      form.reset();
      t0 = Date.now();
      window.gtag?.('event','contact_form_submit',{success:true});
    } catch (err) {
      if (note) note.textContent = 'Не получилось отправить запрос... Пожалуйста, напишите мне в Telegram.';
      window.gtag?.('event','contact_form_submit',{success:false});
    } finally {
      // 6) вернуть UI в норму
      form.removeAttribute('aria-busy');
      if (submitBtn) {
        submitBtn.removeAttribute('disabled');
        submitBtn.textContent = oldLabel || 'Отправить запрос';
      }
    }
  });
})();


// [removed duplicate cookie banner module]




/* === PHONE MASK & AUTOFILL NEAREST SLOT ============= */
(function contactEnhance(){
  const phoneInput = document.getElementById('ccontact');
  const timeInput  = document.getElementById('ctime');

  /* ---------- 1) Маска телефона (Сербия) ---------- */
  function formatSerbiaPhone(raw){
    // оставляем только цифры
    let d = String(raw).replace(/\D+/g, '');
    // если ввели 00... → считаем как международный
    if (d.startsWith('00')) d = d.slice(2);
    // если ввели 8... (часто так копируют), не трогаем — пользователь мог писать не номер
    // маску включаем только когда явно идём в сторону +381
    if (!d.startsWith('381')) {
      // если просто печатают цифры (начинает с 3/38), дадим возможность дойти до 381
      if (d.length < 3) return '+' + d;
      // иначе не навязываем маску
      return raw;
    }
    // убираем сам код страны
    d = d.slice(3);
    const p1 = d.slice(0,2);
    const p2 = d.slice(2,5);
    const p3 = d.slice(5,7);
    const p4 = d.slice(7,9);

    let out = '+381';
    if (p1) out += ' ' + p1;
    if (p2) out += ' ' + p2;
    if (p3) out += ' ' + p3;
    if (p4) out += ' ' + p4;
    return out;
  }

  function maybeMaskPhone(e){
    if (!phoneInput) return;
    const v = phoneInput.value.trim();
    // Маску применяем, когда пользователь печатает цифры/плюс (а не, например, @username)
    if (/^[+\d][\d\s()-]*$/.test(v)) {
      const caretEnd = phoneInput.selectionEnd;
      phoneInput.value = formatSerbiaPhone(v);
      // упрощённо: ставим курсор в конец (хватает для большинства кейсов)
      phoneInput.setSelectionRange(phoneInput.value.length, phoneInput.value.length);
    }
  }

  phoneInput?.addEventListener('input', maybeMaskPhone);
  phoneInput?.addEventListener('blur',  maybeMaskPhone);

  /* ---------- 2) Автозаполнение «Желаемой даты/времени» ближайшим слотом ---------- */
  function formatDayRU(date){
    // пн, 14.10
    return date.toLocaleDateString('ru-RU', { weekday:'short', day:'2-digit', month:'2-digit' });
  }
  function getNearestSlotFromGlobal(){
    // если на странице уже есть модуль слотов и он положил слоты глобально
    const arr = Array.isArray(window.__freeSlots) ? window.__freeSlots : null;
    if (!arr || !arr.length) return null;
    const now = Date.now();
    const getTs = s => s.startTs ?? Date.parse(s.startISO || 0);
    const sorted = arr
      .filter(s => getTs(s) > now)
      .sort((a,b)=> getTs(a) - getTs(b));
    const s = sorted[0];
    if (!s) return null;

    const labelDay  = formatDayRU(new Date(getTs(s)));
    const startText = s.startLabel || (s.startISO ? new Date(s.startISO).toTimeString().slice(0,5) : '');
    const endText   = s.endLabel   || (s.endISO   ? new Date(s.endISO).toTimeString().slice(0,5)   : '');
    return `${labelDay} · ${startText}–${endText}`;
  }

  function getNearestSlotFromBadge(){
    const b = document.querySelector('#headerFreeBadge');
    if (!b) return null;
    const t = b.textContent.toLowerCase().trim();
    // варианты:
    // «Свободно сегодня 09:00–16:00»
    // «Свободно завтра 09:00–16:00»
    // «Ближайший слот: вт, 14.10 • 09:00–16:00»
    const timeRange = (t.match(/\b(\d{2}:\d{2}–\d{2}:\d{2})\b/)||[])[1];

    if (t.includes('сегодня') && timeRange){
      const d = new Date();
      return `${formatDayRU(d)} · ${timeRange}`;
    }
    if (t.includes('завтра') && timeRange){
      const d = new Date(Date.now() + 86400000);
      return `${formatDayRU(d)} · ${timeRange}`;
    }
    // «вт, 14.10 • 09:00–16:00»
    const day = (t.match(/([а-я]{2},?\s*\d{1,2}\.\d{1,2})/)||[])[1];
    if (day && timeRange){
      // приводим «вт, 14.10» → «вт, 14.10»
      return `${day.replace(/\s+/g,' ')} · ${timeRange}`;
    }
    return null;
  }

  function autofillPreferredTime(){
    if (!timeInput || timeInput.value.trim()) return; // уже заполнено вручную
    let label = getNearestSlotFromGlobal();
    if (!label) label = getNearestSlotFromBadge();
    if (label) timeInput.value = label;
  }

  // пробуем сразу и после макро-тика (на случай, если модуль слотов подложит данные асинхронно)
  autofillPreferredTime();
  setTimeout(autofillPreferredTime, 600);
})();

// === Клик по "Запросить" в карточке слота → заполнить форму и проскроллить к ней
(function attachSlotPrefill(){
  document.addEventListener('click', (ev) => {
    const btn = ev.target.closest('.slot-cta');
    if (!btn) return;

    const card = btn.closest('.slot-card');
    if (!card) return;

    // Текст из карточки
    const dateTxt = (card.querySelector('.slot-date')?.textContent || '').trim();
    const timeTxt = (card.querySelector('.slot-time')?.textContent || '').trim();
    if (!dateTxt && !timeTxt) return;

    // Строка для поля
    const wishValue = [dateTxt, timeTxt].filter(Boolean).join(' • ');

    // Находим поле «Желаемая дата/время»
    const wishInput =
      document.querySelector('#ctime') ||                                             // ← ваш id
      document.querySelector('#contact input[name="preferred_time"]') ||              // ← ваше name
      document.querySelector('#contact input[name="wish"]') ||
      document.querySelector('#contact input#wish') ||
      document.querySelector('#contact input#contact-wish') ||
      document.querySelector('#contact input#wishTime') ||
      Array.from(document.querySelectorAll('#contact input[type="text"]'))
        .find(i => (i.placeholder || '').toLowerCase().startsWith('напр'));

    if (wishInput) {
      ev.preventDefault();                      // теперь можно — слушатель не passive
      wishInput.value = wishValue;
      wishInput.dispatchEvent(new Event('input', { bubbles: true }));
    }

    // Плавный скролл к форме + фокус
    const formBlock = document.getElementById('contact');
    if (formBlock) {
      formBlock.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => wishInput?.focus(), 350);
    }
  }); // ← без { passive:true }
})();


// === In-field error helper ===

(function inFieldErrors() {
  const form = document.querySelector('#contactForm');
  if (!form) return;

  // какие поля валидируем таким способом
  const fields = [
    { sel: '#cname',    err: '#err-name',    msg: 'Укажите ваше имя', minLen: 3 },
    { sel: '#ccontact', err: '#err-contact', msg: 'Укажите ваш телефон или @username' }
  ];

  const setInFieldError = (fld, msg) => {
    const wrap = fld.closest('.fld');
    if (!wrap) return;
    if (!fld.dataset.oldPh) fld.dataset.oldPh = fld.placeholder || '';
    wrap.classList.add('infield-err');
    fld.value = '';
    fld.placeholder = msg;
    fld.setAttribute('aria-invalid', 'true');
  };

  const clearInFieldError = (fld) => {
    const wrap = fld.closest('.fld');
    if (!wrap) return;
    wrap.classList.remove('infield-err');
    fld.placeholder = fld.dataset.oldPh || '';
    fld.removeAttribute('aria-invalid');
  };

  // при отправке — если поле пустое/слишком короткое, показываем «ошибку в поле»
  form.addEventListener('submit', (e) => {
    let bad = false;
    fields.forEach((f) => {
      const input = form.querySelector(f.sel);
      const hint  = form.querySelector(f.err);
      if (!input) return;

      const v = input.value.trim();
      const tooShort = f.minLen ? v.length < f.minLen : false;

      if (!v || tooShort) {
        e.preventDefault();
        setInFieldError(input, f.msg);
        if (hint) hint.hidden = true;
        if (!bad) input.focus();
        bad = true;
      }
    });
  });

  // при вводе/блюре — сброс/повтор ошибки
  fields.forEach((f) => {
    const input = form.querySelector(f.sel);
    const hint  = form.querySelector(f.err);
    if (!input) return;

    input.addEventListener('input', () => {
      clearInFieldError(input);
      if (hint) hint.hidden = true;
    });

    input.addEventListener('blur', () => {
      const v = input.value.trim();
      const tooShort = f.minLen ? v.length < f.minLen : false;
      if (!v || tooShort) {
        setInFieldError(input, f.msg);
        if (hint) hint.hidden = true;
      }
    });
  });
})();

// Фильтр "Все / Базовые / Дополнительные"
(() => {
  const root = document.querySelector('#services');
  if (!root) return;

  const chips = root.querySelectorAll('.svc-chip');
  const cards = root.querySelectorAll('.svc-card');

  chips.forEach(ch => ch.addEventListener('click', () => {
    chips.forEach(c => c.classList.remove('is-active'));
    ch.classList.add('is-active');

    const f = ch.dataset.filter;
    cards.forEach(card => {
      const tier = card.dataset.tier; // "base" | "extra"
      card.style.display =
        f === 'all' ? '' :
        (f === tier ? '' : 'none');
    });
  }));
})();



// ===== Hero: ротатор без рефлоу (двухслойный кросс-фейд) =====

(function normalizeHeroQuote(){
  const r = document.getElementById('quoteRotator');
  if (!r) return;
  r.innerHTML = r.innerHTML.replace(/\s*<br\s*\/?>\s*/gi, ' ');
})();

(function initQuoteRotator(){
  const el = document.getElementById('quoteRotator');
  if (!el) return;

  const quotes = [
    '«всегда вовремя, ребёнок спокоен»',
    '«без экранов, безопасность и дисциплина»',
    '«всегда на связи, фото после визита»',
    '«мягкая адаптация, поддержание распорядка»'
  ];

  // Гарантируем обёртку фиксированной высоты
  let wrap = el.closest('.quote-wrap');
  if (!wrap) {
    wrap = document.createElement('span');
    wrap.className = 'quote-wrap';
    el.replaceWith(wrap);
    wrap.appendChild(el);
  }

  // Два слоя: видимый + скрытый
  const a = el;
  a.classList.add('quote', 'is-active');
  a.textContent = quotes[0];

  const b = a.cloneNode(true);
  b.removeAttribute('id');
  b.classList.remove('is-active');
  b.setAttribute('aria-hidden','true');
  wrap.appendChild(b);

  let i = 0, visible = a, hidden = b;
  setInterval(() => {
    i = (i + 1) % quotes.length;
    hidden.textContent = quotes[i];
    visible.classList.remove('is-active');
    hidden.classList.add('is-active');
    [visible, hidden] = [hidden, visible];
  }, 7000);
})();

(function fixHeroSocialSep(){
  const social = document.querySelector('#top .hero-visual .hero-social');
  if (!social) return;
  const wrap = social.querySelector('.quote-wrap');
  const sep  = social.querySelector('.sep');
  if (!sep) return;
  const hidden = !wrap || getComputedStyle(wrap).display === 'none';
  if (hidden) sep.style.display = 'none';
})();


// === WHY: анимация карточек при скролле (смартфоны) ===
(function whyAnimateMobile(){
  const ready = (fn) =>
    (document.readyState === 'loading'
      ? document.addEventListener('DOMContentLoaded', fn)
      : fn());

  ready(function () {
    // смартфон: небольшая ширина + есть «грубый» указатель (палец)
    const isSmall = window.matchMedia('(max-width: 767px)').matches;
    const isTouch = window.matchMedia('(any-pointer: coarse)').matches || ('ontouchstart' in window);
    if (!(isSmall && isTouch)) return;

    const cards = document.querySelectorAll('#why .why-card');
    if (!cards.length) return;

    // фолбэк для старых браузеров
    if (!('IntersectionObserver' in window)) {
      cards.forEach(c => c.classList.add('play'));
      return;
    }

    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('play');
          obs.unobserve(e.target); // анимируем один раз
        }
      });
    }, {
      threshold: 0.18,
      root: null,
      rootMargin: '0px 0px -10% 0px' // чуть раньше «включаем»
    });

    cards.forEach(c => io.observe(c));
  });
})();





/* ===== CANON vFinal: Mobile menu ===== */
(function setupMobileMenu(){
  const burger = document.getElementById('burger');
  const mnav   = document.getElementById('mnav');
  const header = document.querySelector('.site-header');
  if (!burger || !mnav || !header) return;

  const TABLET_BP = 980;
  const TRANSITION_MS = 220;

  // Динамически задаём высоту шапки → меню начинается строго под шапкой
  function setHeaderHeightVar(){
    const h = header.getBoundingClientRect().height || 56;
    mnav.style.setProperty('--hdr-h', `${h}px`);
  }
  setHeaderHeightVar();

  // Обновляем при ресайзе/скролле/ориентации, чтобы offset был всегда точный
  ['resize','scroll','orientationchange'].forEach(evt =>
    window.addEventListener(evt, setHeaderHeightVar, {passive:true})
  );

  // Утилиты
  const firstFocusable = () =>
    mnav.querySelector('a,button,[tabindex]:not([tabindex="-1"])');
  const isOpen = () => mnav.classList.contains('is-open');

  function openMenu(){
    setHeaderHeightVar();              // на всякий случай перед открытием
    mnav.hidden = false;
    mnav.setAttribute('aria-hidden','false');
    mnav.classList.add('is-open');
    document.body.classList.add('nav-open');
    burger.classList.add('is-open');
    burger.setAttribute('aria-expanded','true');

    const f = firstFocusable();
    if (f) { try { f.focus({preventScroll:true}); } catch(_){} }
  }

  function closeMenu(){
    mnav.classList.remove('is-open');
    document.body.classList.remove('nav-open');
    burger.classList.remove('is-open');
    burger.setAttribute('aria-expanded','false');

    const tidy = () => {
      mnav.hidden = true;
      mnav.setAttribute('aria-hidden','true');
      mnav.removeEventListener('transitionend', tidy);
    };
    mnav.addEventListener('transitionend', tidy);
    setTimeout(tidy, TRANSITION_MS + 50); // fallback
  }

  const toggle = () => (isOpen() ? closeMenu() : openMenu());

  // Кнопка бургер
  burger.addEventListener('click', toggle);

  // Закрыть по клику на фон (клик по самой .mobile-nav, а не по панели)
  mnav.addEventListener('click', (e) => {
    if (e.target === mnav) closeMenu();
  });

  // Закрыть по ссылке внутри панели
  const links = mnav.querySelector('.nav-links');
  if (links) links.addEventListener('click', (e) => {
    if (e.target.closest('a')) closeMenu();
  });

  // ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen()) closeMenu();
  });

  // Автозакрытие при расширении экрана > tablet (возврат к десктоп-меню)
  let lastW = innerWidth;
  window.addEventListener('resize', () => {
    const w = innerWidth;
    if (w !== lastW){
      lastW = w;
      if (w > TABLET_BP && isOpen()) closeMenu();
      setHeaderHeightVar();
    }
  });

  // Делегирование переключателя языка (и в шапке, и в меню)
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.lang-btn');
    if (!btn) return;
    const lang = btn.getAttribute('data-lang');
    if (!lang) return;

    if (typeof window.i18nSetLang === 'function') {
      try { window.i18nSetLang(lang); } catch(_) {}
    }
    document.querySelectorAll('.lang-btn').forEach(b => {
      const on = b.getAttribute('data-lang') === lang;
      b.classList.toggle('active', on);
      b.setAttribute('aria-pressed', on ? 'true':'false');
    });
  });

  // Инициализация ARIA
  burger.setAttribute('aria-expanded','false');
  mnav.setAttribute('aria-hidden','true');
  mnav.hidden = true;
})();



/* === iOS RU/SR lang toggle: синхронизация с i18n и десктоп-кнопками === */
(function(){
  const sw = document.getElementById('langIos');
  if (!sw) return;

  const getLang = () => {
    const l = (document.documentElement.getAttribute('lang') || '').toLowerCase();
    if (l.startsWith('sr')) return 'sr';
    if (l.startsWith('ru')) return 'ru';
    try { const s = localStorage.getItem('lang'); if (s) return s; } catch(_) {}
    return 'ru';
  };

  const setDesktopBtns = (lang) => {
    document.querySelectorAll('.lang-btn').forEach(b => {
      const on = b.getAttribute('data-lang') === lang;
      b.classList.toggle('active', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  };

  const applyLang = (lang) => {
    if (typeof window.i18nSetLang === 'function') {
      try { window.i18nSetLang(lang); } catch(_) {}
    } else {
      document.documentElement.setAttribute('lang', lang);
      try { localStorage.setItem('lang', lang); } catch(_) {}
    }
    setDesktopBtns(lang);
    sw.checked = (lang === 'sr');
    sw.setAttribute('aria-checked', sw.checked ? 'true' : 'false');
  };

  /* init */
  applyLang(getLang());

  /* переключение тумблера */
  sw.addEventListener('change', () => applyLang(sw.checked ? 'sr' : 'ru'));

  /* клики по десктопным .lang-btn — синхронизируем тумблер */
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.lang-btn');
    if (!btn) return;
    const lang = btn.getAttribute('data-lang');
    if (lang) applyLang(lang);
  });
})();





/* === HERO: tablet quote rotator v3 (rAF clock, precise 3.5s) === */
(function tabletQuoteRotatorV3() {
  const host = document.querySelector('#top .hero-visual .hero-social #quoteRotator');
  if (!host) return;

  const mq = window.matchMedia('(min-width: 641px) and (max-width: 1024px)');
  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const INTERVAL = REDUCED ? 7000 : 3500; // целевой интервал

  // 1) Собираем фразы
  function collect() {
    let list = Array.from(host.querySelectorAll('.quote,[data-quote]'))
      .map(el => el.textContent.trim()).filter(Boolean);
    if (list.length <= 1) {
      const backup = document.querySelectorAll('#top .hero-visual .hero-usp em, #top .hero-visual .hero-usp i');
      list = Array.from(backup).map(el => el.textContent.trim()).filter(Boolean);
    }
    return Array.from(new Set(list));
  }
  const phrases = collect();
  if (phrases.length <= 1) return;

  // 2) Перестраиваем контейнер под один слой
  host.textContent = '';
  const node = document.createElement('span');
  node.className = 'quote';
  host.appendChild(node);

  // срезаем любые унаследованные анимации
  host.style.animation = 'none';
  node.style.animation = 'none';
  Object.assign(node.style, {
    display: 'inline-block',
    opacity: '0',
    transition: 'opacity 240ms ease 0s'
  });

  // 3) Тик на rAF
  let idx = 0, raf = null, running = false, nextAt = 0;

  function render(i) {
    node.style.opacity = '0';
    void node.offsetWidth;              // рефлоу
    node.textContent = phrases[i];
    node.style.opacity = '1';
  }

  function tick(now) {
    if (!running) return;
    if (now >= nextAt) {
      idx = (idx + 1) % phrases.length;
      render(idx);
      nextAt += INTERVAL;
    }
    raf = requestAnimationFrame(tick);
  }

  function start() {
    if (running || !mq.matches) return;
    running = true;
    render(idx);
    nextAt = performance.now() + INTERVAL;
    raf = requestAnimationFrame(tick);
  }

  function stop() {
    running = false;
    if (raf) { cancelAnimationFrame(raf); raf = null; }
  }

  // Пауза вне экрана / при смене брейкпоинта / при скрытии вкладки
  const io = new IntersectionObserver(es => (es[0]?.isIntersecting ? start() : stop()), {threshold: 0.01});
  io.observe(host);
  document.addEventListener('visibilitychange', () => (document.visibilityState === 'visible' ? start() : stop()));
  mq.addEventListener('change', () => { stop(); start(); });

  // Нормализуем случайные <br> внутри цитат
  host.innerHTML = host.innerHTML.replace(/\s*<br\s*\/?>\s*/gi, ' ');
})();




/* ===== Cookie Banner logic (Consent Mode v2 ready) ===== */
(function(){
  const LS_KEY = 'cookieConsent:v1';
  const TTL_DAYS = 180;

  const $ = s => document.querySelector(s);
  const els = {
    banner: $('#ck-banner'),
    modal:  $('#ck-modal'),
    manage: $('#ck-manage'),
    btnSettings:  $('#ck-settings-link'),
    btnNecessary: $('#ck-necessary'),
    btnAccept:    $('#ck-accept'),
    btnClose:     $('#ck-close'),
    btnSave:      $('#ck-save'),
    btnSaveAll:   $('#ck-save-all'),
    btnSaveNec:   $('#ck-save-necessary'),
    ana: $('#ck-ana'),
    mkt: $('#ck-mkt')
  };

  const now = () => Date.now();
  const inDays = d => d*24*60*60*1000;

  function read(){
    try{
      const raw = localStorage.getItem(LS_KEY);
      if(!raw) return null;
      const obj = JSON.parse(raw);
      if(!obj.ts || (now()-obj.ts)>inDays(TTL_DAYS)) return null;
      return obj;
    }catch(_){ return null; }
  }

  function applyConsent(c){
    // дата-атрибуты для стилей/скриптов
    document.documentElement.setAttribute('data-consent-ana', c.analytics ? '1':'0');
    document.documentElement.setAttribute('data-consent-mkt', c.marketing ? '1':'0');

    // доисполнение отложенных скриптов (не GA)
    if (c.analytics || c.marketing){
      document.querySelectorAll('script[type="text/plain"][data-consent]').forEach(scr=>{
        const need = (scr.dataset.consent||'').split(',').map(s=>s.trim());
        if ((c.analytics && need.includes('analytics')) || (c.marketing && need.includes('marketing'))){
          const run = document.createElement('script');
          if (scr.src){ run.src = scr.src; run.async = scr.async; }
          run.text = scr.text || scr.innerHTML;
          scr.replaceWith(run);
        }
      });
    }

    // синхронизация с Google Consent Mode v2
    if (typeof window.gtag === 'function'){
      window.gtag('consent','update',{
        analytics_storage:  c.analytics ? 'granted' : 'denied',
        ad_storage:         c.marketing ? 'granted' : 'denied',
        ad_user_data:       c.marketing ? 'granted' : 'denied',
        ad_personalization: c.marketing ? 'granted' : 'denied'
      });
    }
  }

  function write(c){
    const val = { ...c, ts: now() };
    try{ localStorage.setItem(LS_KEY, JSON.stringify(val)); }catch(_){}
    applyConsent(val);
    document.dispatchEvent(new CustomEvent('cookie:change', { detail: val }));
  }

  // UI control
  function openModal(){
    els.modal.hidden = false;
    els.banner.hidden = true;
    const saved = read()||{};
    if (els.ana) els.ana.checked = !!saved.analytics;
    if (els.mkt) els.mkt.checked = !!saved.marketing;
  }
  function closeModal(){ els.modal.hidden = true; }

  function acceptAll(){
    write({ necessary:true, analytics:true, marketing:true });
    els.banner.hidden = true; els.manage.hidden = false;
  }
  function onlyNecessary(){
    write({ necessary:true, analytics:false, marketing:false });
    els.banner.hidden = true; els.manage.hidden = false;
  }
  function saveSelection(){
    write({ necessary:true, analytics: !!els.ana?.checked, marketing: !!els.mkt?.checked });
    closeModal(); els.banner.hidden = true; els.manage.hidden = false;
  }

  // Events
  els.btnSettings?.addEventListener('click', (e)=>{ e.preventDefault(); openModal(); });
  els.btnNecessary?.addEventListener('click', onlyNecessary);
  els.btnAccept?.addEventListener('click', acceptAll);

  els.btnClose?.addEventListener('click', closeModal);
  els.btnSave?.addEventListener('click', saveSelection);
  els.btnSaveAll?.addEventListener('click', acceptAll);
  els.btnSaveNec?.addEventListener('click', onlyNecessary);
  els.manage?.addEventListener('click', openModal);

  // Закрытие кликом по фону и по Esc
  els.modal?.addEventListener('click', (e)=>{
    if (e.target === els.modal) closeModal();
  });
  document.addEventListener('keydown', (e)=>{
    if (e.key === 'Escape' && !els.modal.hidden) closeModal();
  });

  // Первичная инициализация UI
  const saved = read();
  if (saved){ applyConsent(saved); els.banner.hidden = true; els.manage.hidden = false; }
  else { els.banner.hidden = false; }

  // --- Публичный API: можно вызвать из любого места
  window.cookieConsent = {
    open: openModal,
    setAll: acceptAll,
    setNecessary: onlyNecessary,
    get: () => read() || { necessary: true, analytics: false, marketing: false }
  };

  // --- Делегированный клик по ссылкам "Настройки cookie"
  // Работает и для <a class="js-cookie-open">...</a>, и для href="#cookie"
  document.addEventListener('click', (e) => {
    const a = e.target.closest('.js-cookie-open, a[href="#cookie"]');
    if (!a) return;
    e.preventDefault();
    openModal();
  });
})();    
