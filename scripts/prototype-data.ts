/**
 * Hand-transcribed, verbatim copy of the mock data embedded in
 * reference/manara.html's inline <script> (LEARN, RESULTS, DOC_RESULTS,
 * MOODS, POSTS). This is the only place these identifiers should exist —
 * app/ and components/ must query Supabase instead. Diff against the
 * prototype before editing to avoid drifting from the original Arabic text.
 */

export const LEARN = [
  {
    type: "a",
    icon: "👶",
    badge: "0-2 سنة",
    tag: "حديثي الولادة",
    title: "أول 90 يوم: كيف بناء رضيعك",
    desc: "دليل عملي مبني على أبحاث النمو العصبي يفكك رموز أنواع البكاء المختلفة والاستجابة لها بثقة.",
    meta: "10 دقائق قراءة",
    author: "د. سارة المحطاني",
    channel: "نشرة حضانة",
  },
  {
    type: "b",
    icon: "🎥",
    badge: "3-6 سنوات",
    tag: "الطفولة المبكرة",
    title: "الحزم بلا صراخ: أسلوب عملي",
    desc: "خطوات مجربة لوضع حدود واضحة لطفلك مع الحفاظ على الدفء والاتصال العاطفي بينكما.",
    meta: "18 دقيقة فيديو",
    author: "نورة العتيبي",
    channel: "بودكاست أمهات بثقة",
  },
  {
    type: "c",
    icon: "📱",
    badge: "كل الأعمار",
    tag: "الطفولة المبكرة",
    title: "متى تقلقين فعلاً بشأن الشاشات؟",
    desc: "مراجعة لأحدث الدراسات حول وقت الشاشة، مع معايير علمية بدل الأرقام المخيفة العامة.",
    meta: "12 دقيقة قراءة",
    author: "ليند الدوسري",
    channel: "نشرة حضانة",
  },
  {
    type: "a",
    icon: "🧠",
    badge: "7-12 سنة",
    tag: "المدرسة",
    title: "محادثات صعبة تحتاجها هذه المرحلة",
    desc: "كيف تبدأين حوارًا هادئًا حول الصداقات، الضغط الدراسي، أو التغيرات الجسدية دون توتر.",
    meta: "22 دقيقة بودكاست",
    author: "د. سارة المحطاني",
    channel: "بودكاست أمهات بثقة",
  },
  {
    type: "b",
    icon: "🌱",
    badge: "مراهقة",
    tag: "المراهقة",
    title: "حين يبتعد عنك، ماذا تفعلين؟",
    desc: "فهم استقلالية المراهق كخطوة نمو طبيعية، لا رفض لكِ، مع أمثلة من أمهات حقيقيات.",
    meta: "15 دقيقة قراءة",
    author: "ريم الشهري",
    channel: "نشرة حضانة",
  },
  {
    type: "c",
    icon: "🧭",
    badge: "هويتك",
    tag: "هويتك",
    title: "كيف أنتِ غير أمّك أصلاً",
    desc: "حلقة عن استعادة قطعة منك ضاعت وسط الحفاضات والجدول اليومي، من غير ذنب.",
    meta: "20 دقيقة بودكاست",
    author: "هند الزهراني",
    channel: "بودكاست غير أمي",
  },
  {
    type: "b",
    icon: "💛",
    badge: "علاقتك",
    tag: "علاقتك",
    title: "زواجكم تغيّر، وهذا طبيعي",
    desc: "نقش تحسّنين إليه بعدتما بعد الأطفال، وشلون ترجعين لبعض بخطوات بسيطة وواقعية.",
    meta: "14 دقيقة قراءة",
    author: "نورة الحربي",
    channel: "نشرة إنك",
  },
  {
    type: "a",
    icon: "💼",
    badge: "شغلك",
    tag: "شغلك",
    title: "رجعتِ الشغل؟ سيبي تأنيب الضمير",
    desc: "كيف توازنين بين طموحك المهني وحضورك كأم، بدون ما تحسين إنك مقصّرة في الاثنين.",
    meta: "11 دقيقة قراءة",
    author: "د. نجد العنزي",
    channel: "مصدر مطّلع",
  },
  {
    type: "c",
    icon: "🫀",
    badge: "جسمك وصحتك",
    tag: "جسمك وصحتك",
    title: "جسمك بعد الولادة: كلام بصراحة",
    desc: "حوار مباشر عن التغيرات الجسدية بعد الحمل، بدون فلاتر أو مقارنات مع أحد.",
    meta: "16 دقيقة فيديو",
    author: "د. ريم المريّم",
    channel: "بودكاست غير أمي",
  },
] as const;

/** Maps LEARN's Arabic `tag` string to the tags.slug seeded in 0002_content_model.sql */
export const LEARN_TAG_SLUG: Record<string, string> = {
  "حديثي الولادة": "age-newborn",
  "الطفولة المبكرة": "age-early-childhood",
  المدرسة: "age-school",
  المراهقة: "age-teen",
  هويتك: "about-identity",
  علاقتك: "about-partnership",
  شغلك: "about-work",
  "جسمك وصحتك": "about-body-health",
};

export const RESULTS = [
  {
    lang: "EN",
    orig: "Screen Time and Toddler Sleep Quality: A Longitudinal Review",
    title: "وقت الشاشة وجودة نوم الأطفال الصغار: مراجعة طولية المدى",
    summary:
      'تشير المراجعة إلى أن التوقيت أهم من المدة — الشاشات قبل النوم بساعة ترتبط بتأخر النوم أكثر من إجمالي الساعات اليومية. الخلاصة العملية: ركزي على "الساعة الذهبية" قبل النوم أكثر من عدد الدقائق.',
    src: "مجلة طب الأطفال التنموي (نموذج توضيحي)",
  },
  {
    lang: "FR",
    orig: "Le bilinguisme précoce et le développement cognitif de l'enfant",
    title: "ثنائية اللغة المبكرة والتطور المعرفي للطفل",
    summary:
      "الأطفال الذين يتعرضون للغتين قبل سن الخامسة يظهرون مرونة معرفية أعلى لاحقًا، دون تأخر ملحوظ في أي من اللغتين إذا استمر التعرض المنتظم لكلتيهما.",
    src: "أرشيف علم النفس التنموي (نموذج توضيحي)",
  },
  {
    lang: "DE",
    orig: "Elterliche Selbstfürsorge als Prädiktor für kindliches Wohlbefinden",
    title: "رعاية الوالد لنفسه كمؤشر رفاهية الطفل",
    summary:
      "رفاهية الوالد النفسية تتنبأ باستقرار الطفل العاطفي أكثر من أي أسلوب تربوي محدد — أي أن اعتناءك بنفسك ليس رفاهية، بل جزء من التربية.",
    src: "دورية الأسرة والصحة النفسية (نموذج توضيحي)",
  },
] as const;

export const DOC_RESULTS = [
  {
    lang: "EN",
    platform: "youtube" as const,
    channel: "Center on the Developing Child, Harvard",
    orig: "How Brain Architecture Is Built",
    dur: "٥ دقائق",
    title: "كيف يُبنى دماغ طفلك في السنوات الأولى",
    summary:
      "فيديو توضيحي من مركز أبحاث بجامعة هارفارد يشرح بصريًا كيف تشكّل التفاعلات اليومية البسيطة بنية دماغ الطفل قبل عمر الخامسة.",
  },
  {
    lang: "EN",
    platform: "netflix" as const,
    channel: "Netflix Originals",
    orig: "Babies",
    dur: "25 دقيقة/حلقة",
    title: "Babies",
    summary:
      "سلسلة وثائقية تتابع أطفالًا حديثي الولادة في خمس قارات في أول عام من حياتهم، توضح كيف تتشكل قدراتهم الأولى بغض النظر عن الثقافة أو البلد.",
  },
  {
    lang: "EN",
    platform: "bbc" as const,
    channel: "BBC Documentaries",
    orig: "Child of Our Time",
    dur: "٦٠ دقيقة/حلقة",
    title: "طفل زماننا",
    summary:
      "سلسلة بريطانية طويلة المدى تتابع نفس مجموعة الأطفال من الولادة حتى المراهقة، ترصد كيف تتشكل الطفل بين الجينات والتربية.",
  },
  {
    lang: "EN",
    platform: "independent" as const,
    channel: "أفلام سينمائية",
    orig: "The Business of Being Born",
    dur: "٨٥ دقيقة",
    title: "عن ولادة الحياة",
    summary:
      "فيلم يراجع كيف تحولت الولادة في الغرب إلى إجراء طبي بحت، ويطرح أسئلة عن خيارات الأم في غرفة الولادة.",
  },
  {
    lang: "FR",
    platform: "independent" as const,
    channel: "أفلام سينمائية فرنسية",
    orig: "Être et Avoir",
    dur: "١٠٤ دقائق",
    title: "أن تكون أو أن تكون",
    summary:
      "يوميات معلم في مدرسة ريفية فرنسية بصف واحد لكل الأعمار، تكشف كيف يتعلم الأطفال حين تُمنحهم مساحة وصبر حقيقيان.",
  },
] as const;

export const MOODS = {
  tired: {
    emoji: "😴",
    label: "متعبة",
    type: "rain",
    trackAr: "صوت مطر هادئ للاسترخاء",
    trackEn: "Soft Rain for Deep Rest",
    books: [
      {
        lang: "AR",
        title: "لأنك تتأنى: عن الأمومة وأشباحها",
        author: "إيمان مرسال",
        blurb: "كتابة صادقة تسمح لك بالإذن بأن تكوني أمًا مرهقة ومربكة، لا مثالية دائمًا.",
      },
      {
        lang: "EN",
        title: "Rest Is Resistance",
        author: "Tricia Hersey",
        blurb:
          "On reclaiming rest as your right, not something you earn once everyone else is taken care of.",
      },
    ],
  },
  sad: {
    emoji: "😔",
    label: "حزينة",
    type: "pad",
    trackAr: "لحظة بيانو دافئة",
    trackEn: "Warm Piano Comfort",
    books: [
      {
        lang: "AR",
        title: "لماذا لا أثق",
        author: "سارة النجار",
        blurb: "عن تصالحك مع ذاتك وتعاملك مع جرح قديمة، لا عن تربية أفضل.",
      },
      {
        lang: "EN",
        title: "Operating Instructions",
        author: "Anne Lamott",
        blurb:
          "A brutally honest, funny memoir of her own first year of motherhood — permission to not have it together.",
      },
    ],
  },
  neutral: {
    emoji: "😐",
    label: "عادية",
    type: "air",
    trackAr: "موسيقى هادئة للتركيز",
    trackEn: "Calm Focus Ambience",
    books: [
      {
        lang: "AR",
        title: "كأصبحتِ أما هادئة",
        author: "كديري ياسمين المرس",
        blurb: "عن استعادة هدوئك الداخلي أنتِ، لا عن ضبط سلوك أحد.",
      },
      {
        lang: "EN",
        title: "Matrescence",
        author: "Lucy Jones",
        blurb:
          "On the profound, under-discussed identity shift of becoming a mother — the change in you.",
      },
    ],
  },
  happy: {
    emoji: "😊",
    label: "مبسوطة",
    type: "arp",
    trackAr: "لحن بسيط ومنعش",
    trackEn: "Bright Little Melody",
    books: [
      {
        lang: "AR",
        title: "كأصبحتِ أما هادئة",
        author: "كديري ياسمين المرس",
        blurb: "فصل عن استمتاعك أنتِ برحلتك، احتفظي بهذا الشعور واحتفلي عليه.",
      },
      {
        lang: "EN",
        title: "Like a Mother",
        author: "Angela Garbes",
        blurb:
          "A celebration of what her body and mind actually went through — not the baby's milestones.",
      },
    ],
  },
  motivated: {
    emoji: "💪",
    label: "محفزة",
    type: "arp-fast",
    trackAr: "إيقاع نشيط وخفيف",
    trackEn: "Light Energetic Beat",
    books: [
      {
        lang: "AR",
        title: "لأنك تتأنى: عن الأمومة وأشباحها",
        author: "إيمان مرسال",
        blurb: "مجيلي طاقتك الحين نحن مصالحة صادقة مع نفسك، لا محو الأمان.",
      },
      {
        lang: "EN",
        title: "Untamed",
        author: "Glennon Doyle",
        blurb: "About reclaiming who she was before everyone needed something from her.",
      },
    ],
  },
} as const;

export const POSTS = [
  {
    text: "اليوم صرخت بوجه ابني وبعدها حسيت بذنب كبير. حابة بس أسمع إني من المجموعة اللي بتصير معها ولاش.",
    status: "approved" as const,
  },
  {
    text: "مرت سنة على طلاقي وأول مرة أحس إني رجعت لنفسي شوي. الطريق طويل بس ماشية فيه.",
    status: "pending" as const,
  },
] as const;
