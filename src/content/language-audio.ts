import type { AudioPhrase, LanguageId, ListeningItem } from "@/lib/types";

type LangPack = {
  foundations: AudioPhrase[];
  developing: AudioPhrase[];
  senior: AudioPhrase[];
  listeningFoundations: ListeningItem[];
  listeningDeveloping: ListeningItem[];
  listeningSenior: ListeningItem[];
};

export const LANGUAGE_AUDIO: Record<LanguageId, LangPack> = {
  spanish: {
    foundations: [
      {
        id: "es-f1",
        text: "Hola",
        meaning: "Hello / Hi",
        note: "Informal everyday greeting",
      },
      {
        id: "es-f2",
        text: "Buenos días",
        meaning: "Good morning",
      },
      {
        id: "es-f3",
        text: "¿Cómo te llamas?",
        meaning: "What is your name? (informal)",
      },
      {
        id: "es-f4",
        text: "Me llamo Ana",
        meaning: "My name is Ana",
      },
      {
        id: "es-f5",
        text: "Mucho gusto",
        meaning: "Nice to meet you",
      },
      {
        id: "es-f6",
        text: "Por favor · Gracias · De nada",
        meaning: "Please · Thank you · You’re welcome",
      },
      {
        id: "es-f7",
        text: "mañana",
        meaning: "tomorrow / morning",
        note: "Listen for ñ — like “ny” in canyon",
      },
    ],
    developing: [
      {
        id: "es-d1",
        text: "Estudio español cada día",
        meaning: "I study Spanish every day",
      },
      {
        id: "es-d2",
        text: "¿Dónde está la biblioteca?",
        meaning: "Where is the library?",
      },
      {
        id: "es-d3",
        text: "Me gusta la música",
        meaning: "I like music",
      },
      {
        id: "es-d4",
        text: "Voy al colegio a las ocho",
        meaning: "I go to school at eight",
      },
      {
        id: "es-d5",
        text: "Hablo con mis amigos",
        meaning: "I talk with my friends",
      },
    ],
    senior: [
      {
        id: "es-s1",
        text: "Ayer fui al cine con mis amigos",
        meaning: "Yesterday I went to the cinema with my friends (preterite)",
      },
      {
        id: "es-s2",
        text: "Cuando era niño, jugaba en el parque",
        meaning: "When I was a child, I used to play in the park (imperfect)",
      },
      {
        id: "es-s3",
        text: "Creo que es importante porque afecta a todos",
        meaning: "I think it is important because it affects everyone",
      },
      {
        id: "es-s4",
        text: "En mi opinión, deberíamos cuidar el medio ambiente",
        meaning: "In my opinion, we should look after the environment",
      },
    ],
    listeningFoundations: [
      {
        id: "es-lf1",
        audioText: "Hola, ¿cómo estás?",
        prompt: "What did you hear?",
        options: [
          "Hello, how are you?",
          "Good night",
          "Where is the station?",
          "I don’t understand",
        ],
        correctIndex: 0,
        explanation: "Hola = hello; ¿cómo estás? = how are you?",
      },
      {
        id: "es-lf2",
        audioText: "Me llamo Carlos",
        prompt: "The speaker is…",
        options: [
          "Asking your age",
          "Saying their name is Carlos",
          "Ordering food",
          "Saying goodbye",
        ],
        correctIndex: 1,
        explanation: "Me llamo… = My name is…",
      },
      {
        id: "es-lf3",
        audioText: "Gracias",
        prompt: "This word means:",
        options: ["Please", "Sorry", "Thank you", "Help"],
        correctIndex: 2,
        explanation: "Gracias = thank you",
      },
      {
        id: "es-lf4",
        audioText: "Buenas noches",
        prompt: "Best translation:",
        options: ["Good morning", "Good afternoon", "Good evening / night", "See you later"],
        correctIndex: 2,
        explanation: "Buenas noches is used in the evening/night.",
      },
    ],
    listeningDeveloping: [
      {
        id: "es-ld1",
        audioText: "Estudio matemáticas en la escuela",
        prompt: "What is being studied?",
        options: ["History", "Mathematics", "Music", "Spanish only"],
        correctIndex: 1,
        explanation: "matemáticas = mathematics",
      },
      {
        id: "es-ld2",
        audioText: "¿A qué hora sales de casa?",
        prompt: "The question asks about:",
        options: [
          "What you eat",
          "What time you leave home",
          "Where you live",
          "Who your teacher is",
        ],
        correctIndex: 1,
        explanation: "A qué hora = at what time; sales de casa = leave home",
      },
      {
        id: "es-ld3",
        audioText: "No me gusta madrugar",
        prompt: "The speaker…",
        options: [
          "Loves getting up early",
          "Does not like getting up early",
          "Is always late",
          "Works at night only",
        ],
        correctIndex: 1,
        explanation: "No me gusta = I don’t like; madrugar = get up early",
      },
    ],
    listeningSenior: [
      {
        id: "es-ls1",
        audioText: "Si hubiera sabido, te habría llamado",
        prompt: "This sentence is mainly about:",
        options: [
          "A future plan only",
          "A past hypothetical (if I had known…)",
          "Ordering in a café",
          "Counting numbers",
        ],
        correctIndex: 1,
        explanation: "Conditional perfect + past perfect subjunctive = counterfactual past.",
      },
      {
        id: "es-ls2",
        audioText: "Hay que tomar medidas urgentes contra el cambio climático",
        prompt: "The speaker argues we must:",
        options: [
          "Ignore the weather",
          "Take urgent measures against climate change",
          "Cancel school",
          "Travel more by plane",
        ],
        correctIndex: 1,
        explanation: "tomar medidas urgentes = take urgent measures",
      },
    ],
  },

  russian: {
    foundations: [
      { id: "ru-f1", text: "Привет", romanization: "Privet", meaning: "Hi (informal)" },
      { id: "ru-f2", text: "Здравствуйте", romanization: "Zdravstvuyte", meaning: "Hello (formal)" },
      { id: "ru-f3", text: "Меня зовут Иван", romanization: "Menya zovut Ivan", meaning: "My name is Ivan" },
      { id: "ru-f4", text: "Как дела?", romanization: "Kak dela?", meaning: "How are things?" },
      { id: "ru-f5", text: "Спасибо", romanization: "Spasibo", meaning: "Thank you" },
      { id: "ru-f6", text: "Пожалуйста", romanization: "Pozhaluysta", meaning: "Please / You’re welcome" },
    ],
    developing: [
      { id: "ru-d1", text: "Я читаю книгу", romanization: "Ya chitayu knigu", meaning: "I am reading a book (accusative)" },
      { id: "ru-d2", text: "Где школа?", romanization: "Gde shkola?", meaning: "Where is the school?" },
      { id: "ru-d3", text: "Мне нравится музыка", romanization: "Mne nravitsya muzyka", meaning: "I like music" },
      { id: "ru-d4", text: "Я иду домой", romanization: "Ya idu domoy", meaning: "I am going home" },
    ],
    senior: [
      { id: "ru-s1", text: "Я прочитал книгу вчера", romanization: "Ya prochital knigu vchera", meaning: "I read (finished) the book yesterday — perfective" },
      { id: "ru-s2", text: "Я читал книгу весь вечер", romanization: "Ya chital knigu ves' vecher", meaning: "I was reading the book all evening — imperfective" },
      { id: "ru-s3", text: "Я считаю, что это важно", romanization: "Ya schitayu, chto eto vazhno", meaning: "I believe that this is important" },
    ],
    listeningFoundations: [
      {
        id: "ru-lf1",
        audioText: "Привет",
        prompt: "You heard a greeting that is:",
        options: ["Very formal", "Informal hi", "Goodbye only", "A number"],
        correctIndex: 1,
        explanation: "Привет is casual hello.",
      },
      {
        id: "ru-lf2",
        audioText: "Спасибо",
        prompt: "Meaning:",
        options: ["Please", "Thank you", "Sorry", "Yes"],
        correctIndex: 1,
        explanation: "Спасибо = thank you",
      },
      {
        id: "ru-lf3",
        audioText: "Меня зовут Мария",
        prompt: "The speaker is:",
        options: ["Asking the time", "Introducing their name as Maria", "Saying no", "Counting"],
        correctIndex: 1,
        explanation: "Меня зовут… = My name is…",
      },
    ],
    listeningDeveloping: [
      {
        id: "ru-ld1",
        audioText: "Я вижу машину",
        prompt: "What do they see?",
        options: ["A house", "A car", "A book", "A dog"],
        correctIndex: 1,
        explanation: "машину = car (accusative)",
      },
      {
        id: "ru-ld2",
        audioText: "Сколько это стоит?",
        prompt: "This question asks:",
        options: ["How much does it cost?", "Where is the exit?", "What time is it?", "Who is that?"],
        correctIndex: 0,
        explanation: "Сколько это стоит? = How much does it cost?",
      },
    ],
    listeningSenior: [
      {
        id: "ru-ls1",
        audioText: "Если бы я знал, я бы пришёл раньше",
        prompt: "This expresses:",
        options: ["A simple present habit", "A past counterfactual wish/condition", "Only a future plan", "A shopping list"],
        correctIndex: 1,
        explanation: "Conditional construction: if I had known, I would have come earlier.",
      },
    ],
  },

  chinese: {
    foundations: [
      { id: "zh-f1", text: "你好", romanization: "nǐ hǎo", meaning: "Hello", note: "3rd tone + 3rd → 2nd + 3rd in connected speech" },
      { id: "zh-f2", text: "谢谢", romanization: "xièxie", meaning: "Thank you" },
      { id: "zh-f3", text: "我叫李明", romanization: "wǒ jiào Lǐ Míng", meaning: "My name is Li Ming" },
      { id: "zh-f4", text: "再见", romanization: "zàijiàn", meaning: "Goodbye" },
      { id: "zh-f5", text: "妈 · 麻 · 马 · 骂", romanization: "mā má mǎ mà", meaning: "Four tones on ma (demo)", note: "Listen carefully — tone changes meaning" },
      { id: "zh-f6", text: "不客气", romanization: "bú kèqi", meaning: "You’re welcome" },
    ],
    developing: [
      { id: "zh-d1", text: "我有三本书", romanization: "wǒ yǒu sān běn shū", meaning: "I have three books (measure word 本)" },
      { id: "zh-d2", text: "你几点上学？", romanization: "nǐ jǐ diǎn shàngxué?", meaning: "What time do you go to school?" },
      { id: "zh-d3", text: "我喜欢听音乐", romanization: "wǒ xǐhuan tīng yīnyuè", meaning: "I like listening to music" },
      { id: "zh-d4", text: "图书馆在哪儿？", romanization: "túshūguǎn zài nǎr?", meaning: "Where is the library?" },
    ],
    senior: [
      { id: "zh-s1", text: "因为天气不好，所以我们待在家里", romanization: "yīnwèi… suǒyǐ…", meaning: "Because the weather is bad, we stay at home" },
      { id: "zh-s2", text: "虽然很难，但是我想试试", romanization: "suīrán… dànshì…", meaning: "Although it is hard, I want to try" },
      { id: "zh-s3", text: "科技改变了我们的生活", romanization: "kējì gǎibiàn le wǒmen de shēnghuó", meaning: "Technology has changed our lives" },
    ],
    listeningFoundations: [
      {
        id: "zh-lf1",
        audioText: "你好",
        prompt: "You heard:",
        options: ["Thank you", "Hello", "Sorry", "Goodbye"],
        correctIndex: 1,
        explanation: "你好 nǐ hǎo = hello",
      },
      {
        id: "zh-lf2",
        audioText: "谢谢",
        prompt: "Meaning:",
        options: ["Please", "Thank you", "No", "Water"],
        correctIndex: 1,
        explanation: "谢谢 = thank you",
      },
      {
        id: "zh-lf3",
        audioText: "再见",
        prompt: "This is used when:",
        options: ["Meeting for the first time only", "Saying goodbye", "Ordering food", "Apologising"],
        correctIndex: 1,
        explanation: "再见 = goodbye",
      },
    ],
    listeningDeveloping: [
      {
        id: "zh-ld1",
        audioText: "我有两只猫",
        prompt: "How many cats?",
        options: ["One", "Two", "Three", "None"],
        correctIndex: 1,
        explanation: "两 = two (with measure words); 只 measure for animals",
      },
      {
        id: "zh-ld2",
        audioText: "现在几点？",
        prompt: "The question asks:",
        options: ["What day is it?", "What time is it?", "Where are we?", "Who is that?"],
        correctIndex: 1,
        explanation: "现在几点？= What time is it now?",
      },
    ],
    listeningSenior: [
      {
        id: "zh-ls1",
        audioText: "保护环境是我们的责任",
        prompt: "Main idea:",
        options: [
          "Shopping is fun",
          "Protecting the environment is our responsibility",
          "School starts early",
          "I like sport",
        ],
        correctIndex: 1,
        explanation: "保护环境 = protect environment; 责任 = responsibility",
      },
    ],
  },

  german: {
    foundations: [
      { id: "de-f1", text: "Hallo", meaning: "Hello / Hi" },
      { id: "de-f2", text: "Guten Tag", meaning: "Good day (formal daytime)" },
      { id: "de-f3", text: "Ich heiße Lena", meaning: "My name is Lena" },
      { id: "de-f4", text: "Wie geht’s?", meaning: "How’s it going? (informal)" },
      { id: "de-f5", text: "Danke schön", meaning: "Thank you very much" },
      { id: "de-f6", text: "Bitte", meaning: "Please / You’re welcome" },
      { id: "de-f7", text: "der Tisch · die Lampe · das Buch", meaning: "the table · the lamp · the book (genders)" },
    ],
    developing: [
      { id: "de-d1", text: "Ich muss heute lernen", meaning: "I must study today" },
      { id: "de-d2", text: "Kannst du mir helfen?", meaning: "Can you help me?" },
      { id: "de-d3", text: "Ich gehe oft ins Kino", meaning: "I often go to the cinema" },
      { id: "de-d4", text: "Wo wohnst du?", meaning: "Where do you live?" },
    ],
    senior: [
      { id: "de-s1", text: "Ich glaube, dass das wichtig ist", meaning: "I believe that that is important (verb-final clause)" },
      { id: "de-s2", text: "Weil es regnet, bleibe ich zu Hause", meaning: "Because it is raining, I stay at home" },
      { id: "de-s3", text: "Man sollte mehr öffentliche Verkehrsmittel benutzen", meaning: "One should use more public transport" },
    ],
    listeningFoundations: [
      {
        id: "de-lf1",
        audioText: "Guten Morgen",
        prompt: "You heard:",
        options: ["Good evening", "Good morning", "Goodbye", "Please"],
        correctIndex: 1,
        explanation: "Guten Morgen = good morning",
      },
      {
        id: "de-lf2",
        audioText: "Ich heiße Tom",
        prompt: "The speaker is:",
        options: ["Asking the time", "Giving their name as Tom", "Ordering coffee", "Saying thanks"],
        correctIndex: 1,
        explanation: "Ich heiße… = My name is…",
      },
      {
        id: "de-lf3",
        audioText: "Danke",
        prompt: "Meaning:",
        options: ["Yes", "No", "Thank you", "Help"],
        correctIndex: 2,
        explanation: "Danke = thank you",
      },
    ],
    listeningDeveloping: [
      {
        id: "de-ld1",
        audioText: "Ich will Fußball spielen",
        prompt: "They want to:",
        options: ["Sleep", "Play football", "Cook", "Drive"],
        correctIndex: 1,
        explanation: "will = want to; Fußball spielen = play football",
      },
      {
        id: "de-ld2",
        audioText: "Wir müssen jetzt gehen",
        prompt: "They must:",
        options: ["Stay", "Go now", "Eat more", "Sing"],
        correctIndex: 1,
        explanation: "müssen… gehen = must go",
      },
    ],
    listeningSenior: [
      {
        id: "de-ls1",
        audioText: "Es ist wichtig, dass wir die Umwelt schützen",
        prompt: "Core message:",
        options: [
          "We should ignore the environment",
          "It is important that we protect the environment",
          "Only grammar matters",
          "School is cancelled",
        ],
        correctIndex: 1,
        explanation: "die Umwelt schützen = protect the environment",
      },
    ],
  },

  japanese: {
    foundations: [
      { id: "ja-f1", text: "こんにちは", romanization: "konnichiwa", meaning: "Hello (daytime)" },
      { id: "ja-f2", text: "おはようございます", romanization: "ohayō gozaimasu", meaning: "Good morning (polite)" },
      { id: "ja-f3", text: "わたしはケンです", romanization: "watashi wa Ken desu", meaning: "I am Ken" },
      { id: "ja-f4", text: "ありがとう", romanization: "arigatō", meaning: "Thank you" },
      { id: "ja-f5", text: "すみません", romanization: "sumimasen", meaning: "Excuse me / sorry" },
      { id: "ja-f6", text: "さようなら", romanization: "sayōnara", meaning: "Goodbye" },
    ],
    developing: [
      { id: "ja-d1", text: "本を読みます", romanization: "hon o yomimasu", meaning: "I read a book" },
      { id: "ja-d2", text: "学校に行きます", romanization: "gakkō ni ikimasu", meaning: "I go to school" },
      { id: "ja-d3", text: "これはおいしいです", romanization: "kore wa oishii desu", meaning: "This is delicious" },
      { id: "ja-d4", text: "何をしますか", romanization: "nani o shimasu ka", meaning: "What will you do?" },
    ],
    senior: [
      { id: "ja-s1", text: "雨が降ったら、うちにいます", romanization: "ame ga futtara, uchi ni imasu", meaning: "If it rains, I’ll stay home" },
      { id: "ja-s2", text: "日本語が話せるようになりたいです", romanization: "nihongo ga hanaseru yō ni naritai desu", meaning: "I want to become able to speak Japanese" },
      { id: "ja-s3", text: "環境問題についてどう思いますか", romanization: "kankyō mondai ni tsuite dō omoimasu ka", meaning: "What do you think about environmental issues?" },
    ],
    listeningFoundations: [
      {
        id: "ja-lf1",
        audioText: "こんにちは",
        prompt: "You heard:",
        options: ["Good night", "Hello", "Thank you", "I’m sorry"],
        correctIndex: 1,
        explanation: "こんにちは = hello",
      },
      {
        id: "ja-lf2",
        audioText: "ありがとう",
        prompt: "Meaning:",
        options: ["Please", "Thank you", "Yes", "No"],
        correctIndex: 1,
        explanation: "ありがとう = thank you",
      },
      {
        id: "ja-lf3",
        audioText: "わたしはみきです",
        prompt: "The speaker is:",
        options: ["Asking directions", "Saying they are Miki", "Counting", "Ordering tea"],
        correctIndex: 1,
        explanation: "わたしは…です = I am…",
      },
    ],
    listeningDeveloping: [
      {
        id: "ja-ld1",
        audioText: "水をください",
        prompt: "They are asking for:",
        options: ["Bread", "Water", "A ticket", "A book"],
        correctIndex: 1,
        explanation: "水 = water; ください = please give me",
      },
      {
        id: "ja-ld2",
        audioText: "電車で行きます",
        prompt: "How are they going?",
        options: ["By car", "By train", "On foot only", "By plane"],
        correctIndex: 1,
        explanation: "電車で = by train",
      },
    ],
    listeningSenior: [
      {
        id: "ja-ls1",
        audioText: "もっと練習したほうがいいと思います",
        prompt: "The opinion is that you should:",
        options: ["Give up", "Practise more", "Sleep all day", "Only read English"],
        correctIndex: 1,
        explanation: "もっと練習したほうがいい = it would be better to practise more",
      },
    ],
  },

  khmer: {
    foundations: [
      { id: "km-f1", text: "សួស្តី", romanization: "suostei", meaning: "Hello" },
      { id: "km-f2", text: "អរគុណ", romanization: "orkun", meaning: "Thank you" },
      { id: "km-f3", text: "ខ្ញុំឈ្មោះសុខា", romanization: "knhom chhmous Sokha", meaning: "My name is Sokha" },
      { id: "km-f4", text: "សូមទោស", romanization: "som toah", meaning: "Excuse me / sorry" },
      { id: "km-f5", text: "លាហើយ", romanization: "lea haey", meaning: "Goodbye" },
      { id: "km-f6", text: "សូម", romanization: "som", meaning: "Please (polite particle)" },
    ],
    developing: [
      { id: "km-d1", text: "តើថ្លៃប៉ុន្មាន?", romanization: "tae thlai ponmaan?", meaning: "How much does it cost?" },
      { id: "km-d2", text: "ខ្ញុំចង់ទិញបាយ", romanization: "knhom chang tinh bay", meaning: "I want to buy rice" },
      { id: "km-d3", text: "គ្រួសាររបស់ខ្ញុំ", romanization: "kruosaa robos knhom", meaning: "My family" },
      { id: "km-d4", text: "ថ្ងៃនេះអ្នកសុខសប្បាយទេ?", romanization: "thngai nih neak sok sabbay te?", meaning: "Are you well today?" },
    ],
    senior: [
      { id: "km-s1", text: "ខ្ញុំចង់និយាយអំពីវប្បធម៌ខ្មែរ", romanization: "…niyeay ompii vappathoa khmer", meaning: "I want to talk about Khmer culture" },
      { id: "km-s2", text: "បុណ្យចូលឆ្នាំខ្មែរ", romanization: "bon chol chhnam khmer", meaning: "Khmer New Year" },
      { id: "km-s3", text: "សហគមន៍ខ្មែរនៅអូស្ត្រាលី", romanization: "sahakom khmer nov australia", meaning: "The Khmer community in Australia" },
    ],
    listeningFoundations: [
      {
        id: "km-lf1",
        audioText: "សួស្តី",
        prompt: "You heard a word that means:",
        options: ["Thank you", "Hello", "Water", "School"],
        correctIndex: 1,
        explanation: "សួស្តី = hello",
      },
      {
        id: "km-lf2",
        audioText: "អរគុណ",
        prompt: "Meaning:",
        options: ["Sorry", "Thank you", "Yes", "No"],
        correctIndex: 1,
        explanation: "អរគុណ = thank you",
      },
      {
        id: "km-lf3",
        audioText: "លាហើយ",
        prompt: "Used when:",
        options: ["Greeting at noon", "Saying goodbye", "Asking price", "Counting"],
        correctIndex: 1,
        explanation: "លាហើយ = goodbye",
      },
    ],
    listeningDeveloping: [
      {
        id: "km-ld1",
        audioText: "តើថ្លៃប៉ុន្មាន?",
        prompt: "This question is about:",
        options: ["Time", "Price", "Weather", "Colour"],
        correctIndex: 1,
        explanation: "Asking how much something costs",
      },
      {
        id: "km-ld2",
        audioText: "ខ្ញុំចង់ទិញទឹក",
        prompt: "They want to buy:",
        options: ["Rice", "Water", "A phone", "Clothes"],
        correctIndex: 1,
        explanation: "ទឹក = water",
      },
    ],
    listeningSenior: [
      {
        id: "km-ls1",
        audioText: "បុណ្យចូលឆ្នាំខ្មែរជាពិធីសំខាន់",
        prompt: "Topic is mainly:",
        options: ["Maths homework", "Khmer New Year as an important ceremony", "Football scores", "Computer code"],
        correctIndex: 1,
        explanation: "Khmer New Year is an important festival/ceremony",
      },
    ],
  },

  italian: {
    foundations: [
      { id: "it-f1", text: "Ciao", meaning: "Hi / Bye (informal)" },
      { id: "it-f2", text: "Buongiorno", meaning: "Good morning / good day" },
      { id: "it-f3", text: "Mi chiamo Luca", meaning: "My name is Luca" },
      { id: "it-f4", text: "Piacere", meaning: "Pleased to meet you" },
      { id: "it-f5", text: "Grazie mille", meaning: "Thanks a lot" },
      { id: "it-f6", text: "Prego", meaning: "You’re welcome / please go ahead" },
      { id: "it-f7", text: "Come stai?", meaning: "How are you? (informal)" },
    ],
    developing: [
      { id: "it-d1", text: "Mi piace la pizza", meaning: "I like pizza" },
      { id: "it-d2", text: "Parlo italiano e inglese", meaning: "I speak Italian and English" },
      { id: "it-d3", text: "Vado a scuola in autobus", meaning: "I go to school by bus" },
      { id: "it-d4", text: "Cosa fai nel tempo libero?", meaning: "What do you do in your free time?" },
    ],
    senior: [
      { id: "it-s1", text: "Ieri ho visto un bel film", meaning: "Yesterday I saw a good film (passato prossimo)" },
      { id: "it-s2", text: "Da bambino giocavo sempre fuori", meaning: "As a child I always played outside (imperfetto)" },
      { id: "it-s3", text: "Secondo me dovremmo riciclare di più", meaning: "In my opinion we should recycle more" },
    ],
    listeningFoundations: [
      {
        id: "it-lf1",
        audioText: "Buongiorno",
        prompt: "You heard:",
        options: ["Good night", "Good day / morning", "Sorry", "Help"],
        correctIndex: 1,
        explanation: "Buongiorno = good morning/day",
      },
      {
        id: "it-lf2",
        audioText: "Grazie",
        prompt: "Meaning:",
        options: ["Please", "Thank you", "No", "Maybe"],
        correctIndex: 1,
        explanation: "Grazie = thank you",
      },
      {
        id: "it-lf3",
        audioText: "Mi chiamo Giulia",
        prompt: "The speaker is:",
        options: ["Ordering coffee", "Saying their name is Giulia", "Asking the time", "Saying goodbye"],
        correctIndex: 1,
        explanation: "Mi chiamo… = My name is…",
      },
    ],
    listeningDeveloping: [
      {
        id: "it-ld1",
        audioText: "Mi piacciono i gatti",
        prompt: "They like:",
        options: ["Dogs only", "Cats", "Nothing", "School"],
        correctIndex: 1,
        explanation: "Mi piacciono (plural) i gatti = I like cats",
      },
      {
        id: "it-ld2",
        audioText: "Domani vado al mare",
        prompt: "When / where?",
        options: ["Yesterday at home", "Tomorrow to the sea", "Now to school", "Never outside"],
        correctIndex: 1,
        explanation: "Domani = tomorrow; al mare = to the sea",
      },
    ],
    listeningSenior: [
      {
        id: "it-ls1",
        audioText: "Se avessi tempo, viaggerei di più",
        prompt: "This is mainly a:",
        options: [
          "Shopping list",
          "Hypothetical (if I had time, I’d travel more)",
          "Past completed shopping trip only",
          "Command to sit down",
        ],
        correctIndex: 1,
        explanation: "Imperfect subjunctive + conditional = hypothetical",
      },
    ],
  },
};

export function getAudioPack(
  language: LanguageId,
  tier: "foundations" | "developing" | "senior",
): { phrases: AudioPhrase[]; listening: ListeningItem[] } {
  const pack = LANGUAGE_AUDIO[language];
  if (tier === "foundations") {
    return {
      phrases: pack.foundations,
      listening: pack.listeningFoundations,
    };
  }
  if (tier === "developing") {
    return {
      phrases: pack.developing,
      listening: pack.listeningDeveloping,
    };
  }
  return {
    phrases: pack.senior,
    listening: pack.listeningSenior,
  };
}

export function tierFromLessonId(
  lessonId: string,
): "foundations" | "developing" | "senior" {
  // Fluency pathway ids: y7/y8 → foundations, y9/y10 → developing, y11/y12 → senior
  if (
    lessonId.includes("y7-") ||
    lessonId.includes("y8-") ||
    lessonId.includes("-foundations")
  ) {
    return "foundations";
  }
  if (
    lessonId.includes("y9-") ||
    lessonId.includes("y10-") ||
    lessonId.includes("-developing")
  ) {
    return "developing";
  }
  if (
    lessonId.includes("y11-") ||
    lessonId.includes("y12-") ||
    lessonId.includes("fluency-exit") ||
    lessonId.includes("-senior")
  ) {
    return "senior";
  }
  return "foundations";
}
