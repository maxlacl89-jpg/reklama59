export interface ImageItem {
  id: string
  url: string | null
  caption: string
}

export interface ListItem {
  id: string
  title: string
  text: string
}

export interface StatItem {
  id: string
  value: string
  label: string
}

type BlockBase = { id: string; nav?: string }

export type Block = BlockBase &
  (
    | { type: 'hero'; title: string; subtitle: string; cta: string }
    | { type: 'text'; heading: string; body: string }
    | { type: 'list'; heading: string; items: ListItem[] }
    | { type: 'stats'; heading: string; items: StatItem[] }
    | { type: 'gallery'; heading: string; images: ImageItem[] }
    | { type: 'quote'; text: string; author: string }
    | { type: 'form'; heading: string; note: string; button: string }
    | {
        type: 'contacts'
        heading: string
        phone: string
        email: string
        address: string
        note: string
      }
  )

export interface SiteData {
  title: string
  blocks: Block[]
}

export const BLOCK_TYPE_LABELS: Record<Block['type'], string> = {
  hero: 'Первый экран',
  text: 'Текст',
  list: 'Направления / список',
  stats: 'Цифры / статистика',
  gallery: 'Галерея',
  quote: 'Цитата',
  form: 'Форма заявки',
  contacts: 'Контакты',
}

export function createId(): string {
  return Math.random().toString(36).slice(2, 10)
}

export function createBlock(type: Block['type']): Block {
  const id = createId()
  switch (type) {
    case 'hero':
      return { id, type, title: 'Заголовок первого экрана', subtitle: 'Короткое описание — кто вы и что предлагаете.', cta: 'Связаться' }
    case 'text':
      return { id, type, heading: 'Заголовок раздела', body: 'Нажмите на этот текст, чтобы изменить его. Расскажите о себе, своей команде или подходе к работе.' }
    case 'list':
      return {
        id, type, heading: 'Направления',
        items: [
          { id: createId(), title: 'Направление или услуга', text: 'Короткое описание: что входит и для кого.' },
          { id: createId(), title: 'Второй пункт', text: 'Нажмите, чтобы отредактировать текст.' },
          { id: createId(), title: 'Третий пункт', text: 'Пункты можно перемещать и удалять.' },
        ],
      }
    case 'stats':
      return {
        id, type, heading: 'В цифрах',
        items: [
          { id: createId(), value: '16', label: 'лет на рынке' },
          { id: createId(), value: '77 820', label: 'реализованных проектов' },
          { id: createId(), value: '16 100', label: 'оклеенных единиц транспорта' },
        ],
      }
    case 'gallery':
      return {
        id, type, heading: 'Проекты',
        images: [1, 2, 3, 4].map((n) => ({ id: createId(), url: null, caption: `Проект ${n}` })),
      }
    case 'quote':
      return { id, type, text: 'Фраза, которая задаёт тон всему сайту.', author: '— подпись' }
    case 'form':
      return { id, type, heading: 'Оставить заявку', note: 'Оставьте контакты — перезвоним, посчитаем стоимость и сроки.', button: 'Отправить заявку' }
    case 'contacts':
      return { id, type, heading: 'Контакты', phone: '+7 (999) 123-45-67', email: 'hello@example.com', address: 'Город, онлайн по всему миру', note: 'Напишите — ответим в течение дня.' }
  }
}

export function defaultSite(): SiteData {
  return {
    title: 'Реклама59',
    blocks: [
      {
        id: createId(),
        type: 'hero',
        title: 'От концепции до реализации',
        subtitle: 'Рекламно-производственная компания полного цикла в Перми. Собственное производство: широкоформатная и УФ-печать, фрезеровка, лазерная резка. 16 лет делаем рекламу, которая работает.',
        cta: 'Заказать звонок',
      },
      {
        id: createId(),
        nav: 'Компания',
        type: 'text',
        heading: 'О компании',
        body: 'РПК «Реклама59» — семейная компания с 16-летним опытом в сфере производства рекламы и визуальной информации. Разрабатываем дизайн-концепции, изготавливаем, устанавливаем и размещаем рекламные и информационные конструкции под задачи разных сегментов рынка.\n\nУ нас собственное производство: печатные машины, фрезеровочные и лазерные станки, сборочный цех, дизайн-студия, коммерческий отдел и штатные монтажные бригады. Поэтому мы отвечаем за результат на каждом этапе — от макета до монтажа.\n\nПроводим бизнес-экскурсии по производству: покажем, как рождается реклама и как устроены наши процессы.',
      },
      {
        id: createId(),
        type: 'stats',
        heading: 'В цифрах',
        items: [
          { id: createId(), value: '16', label: 'лет успешной работы в рекламном бизнесе' },
          { id: createId(), value: '77 820', label: 'реализованных проектов' },
          { id: createId(), value: '16 100', label: 'оклеенных единиц транспорта' },
        ],
      },
      {
        id: createId(),
        nav: 'Направления',
        type: 'list',
        heading: 'Направления',
        items: [
          { id: createId(), title: 'Промышленным предприятиям', text: 'Комплексное рекламно-информационное оформление: навигация, стенды, таблички, таблички безопасности.' },
          { id: createId(), title: 'Государственным и муниципальным учреждениям', text: 'Информационное оформление объектов, указатели, стенды и навигация.' },
          { id: createId(), title: 'Торговым сетям', text: 'Оформление магазинов и точек продаж: вывески, внутренняя навигация, POS-материалы.' },
          { id: createId(), title: 'Застройщикам', text: 'Благоустройство территории, заборы, стеллы, колерные паспорта и оформление sales-офисов.' },
          { id: createId(), title: 'Студия дизайна', text: 'Графический дизайн, фирменный стиль, дизайн и проектирование архитектурной среды, колерный паспорт, моушн-дизайн и видео.' },
          { id: createId(), title: 'Печатное производство', text: 'УФ-печать, широкоформатная печать, интерьерная печать — на собственных машинах.' },
          { id: createId(), title: 'Брендирование транспорта и ТО', text: 'Оклейка автомобилей и автопарков, брендирование торгового оборудования.' },
          { id: createId(), title: 'Размещение рекламы', text: 'Мониторы в автобусах, МФЦ, лифты — реклама там, где есть ваша аудитория.' },
          { id: createId(), title: 'Сувенирное и наградное производство', text: 'Сувенирная и наградная продукция с нанесением логотипа.' },
          { id: createId(), title: 'Малому и среднему бизнесу', text: 'Комплексное рекламно-информационное оформление под ключ — быстро и без лишней бюрократии.' },
        ],
      },
      {
        id: createId(),
        nav: 'Продукция',
        type: 'text',
        heading: 'Продукция',
        body: 'Рекламно-информационное производство: вывески, световые короба, стеллы, указатели, таблички, информационные стенды, фотозоны, арт-объекты.\n\nМеталлопрокат: сортовой прокат и трубы из нержавеющей стали, сварочные материалы, просечно-вытяжные листы — оптом и в розницу для промышленных предприятий.',
      },
      {
        id: createId(),
        nav: 'Проекты',
        type: 'gallery',
        heading: 'Проекты',
        images: [
          { id: createId(), url: null, caption: 'Вывески и световые короба' },
          { id: createId(), url: null, caption: 'Стеллы и указатели' },
          { id: createId(), url: null, caption: 'Брендирование транспорта' },
          { id: createId(), url: null, caption: 'Фотозоны и пространства' },
          { id: createId(), url: null, caption: 'Стенды и выставки' },
          { id: createId(), url: null, caption: 'Заборы застройщиков' },
          { id: createId(), url: null, caption: 'Арт-объекты' },
          { id: createId(), url: null, caption: 'Благоустройство' },
        ],
      },
      {
        id: createId(),
        nav: 'Статьи',
        type: 'text',
        heading: 'Статьи',
        body: 'В этом разделе мы публикуем полезные материалы: разборы требований к вывескам в Перми, гайды по брендированию, новости производства и отраслевые заметки.\n\nРаздел наполняется — загляните чуть позже.',
      },
      {
        id: createId(),
        nav: 'Карьера',
        type: 'text',
        heading: 'Карьера',
        body: 'Мы растём и постоянно ищем людей: производство, монтажные бригады, дизайн-студия, коммерческий отдел.\n\nНапишите нам — расскажем об открытых вакансиях и пригласим на экскурсию по производству.',
      },
      {
        id: createId(),
        type: 'quote',
        text: 'Своё производство — это когда сроки и качество зависят от нас, а не от подрядчиков.',
        author: 'РПК «Реклама59»',
      },
      {
        id: createId(),
        type: 'form',
        heading: 'Заказать звонок',
        note: 'Перезвоним в течение 10 минут. Обсудим задачу, найдём оптимальное решение и запланируем работы.',
        button: 'Отправить',
      },
      {
        id: createId(),
        nav: 'Контакты',
        type: 'contacts',
        heading: 'Контакты',
        phone: '+7 (342) 214-82-00',
        email: 'zakaz@rpkreklama59.ru',
        address: '614010, г. Пермь, ул. Маршрутная, д. 15',
        note: 'Пн–Пт с 9:00 до 18:00. Бизнес-экскурсии по производству — по предварительной записи.',
      },
    ],
  }
}
