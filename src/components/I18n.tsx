import React, { createContext, useContext, useState, ReactNode } from "react";

// Localization strings for different languages
const localizedText = {
  en: {
    title: "WikiBrowse",
    placeholder: "Enter a search term",
    welcome: "Welcome to WikiBrowse!",
    description: "WikiBrowse is a browser based off of Wikipedia that helps you find information quickly.",
    exampleSearch: "Start by typing a search term or try one of these example search terms:",
    resultsTitle: "Results:",
    loading: "Loading...",
    errorMessage: "Something went wrong. Please try again.",
    noResults: "No results found.",
    noDescription: "No description available.",
  },
  es: {
    title: "WikiBrowse",
    placeholder: "Introduce un término de búsqueda",
    welcome: "¡Bienvenido a WikiBrowse!",
    description: "WikiBrowse es un navegador basado en Wikipedia que te ayuda a encontrar información rápidamente.",
    exampleSearch: "Comienza escribiendo un término de búsqueda o prueba uno de estos ejemplos de búsqueda:",
    resultsTitle: "Resultados:",
    loading: "Cargando...",
    errorMessage: "Algo salió mal. Por favor, inténtalo de nuevo.",
    noResults: "No se encontraron resultados.",
    noDescription: "No hay descripción disponible.",
  },
  zh: {
    title: "WikiBrowse",
    placeholder: "输入搜索词",
    welcome: "欢迎使用WikiBrowse！",
    description: "WikiBrowse是一个基于Wikipedia的浏览器，帮助你快速查找信息。",
    exampleSearch: "开始输入搜索词，或尝试以下示例搜索词：",
    resultsTitle: "结果：",
    loading: "加载中...",
    errorMessage: "出了点问题，请重试。",
    noResults: "没有找到结果。",
    noDescription: "没有描述。",
  },
  hi: {
    title: "WikiBrowse",
    placeholder: "एक खोज शब्द दर्ज करें",
    welcome: "WikiBrowse में आपका स्वागत है!",
    description: "WikiBrowse एक ब्राउज़र है जो Wikipedia पर आधारित है और आपको जल्दी से जानकारी खोजने में मदद करता है।",
    exampleSearch: "खोज शब्द टाइप करना शुरू करें या इनमें से कोई एक उदाहरण खोज शब्द आज़माएं:",
    resultsTitle: "परिणाम:",
    loading: "लोड हो रहा है...",
    errorMessage: "कुछ गलत हो गया। कृपया फिर से प्रयास करें।",
    noResults: "कोई परिणाम नहीं मिला।",
    noDescription: "कोई विवरण उपलब्ध नहीं है।",
  },
  ar: {
    title: "WikiBrowse",
    placeholder: "أدخل مصطلح البحث",
    welcome: "مرحبًا بك في WikiBrowse!",
    description: "WikiBrowse هو متصفح يعتمد على ويكيبيديا يساعدك في العثور على المعلومات بسرعة.",
    exampleSearch: "ابدأ بكتابة مصطلح البحث أو جرب أحد مصطلحات البحث التالية:",
    resultsTitle: "النتائج:",
    loading: "جاري التحميل...",
    errorMessage: "حدث خطأ ما. يرجى المحاولة مرة أخرى.",
    noResults: "لم يتم العثور على نتائج.",
    noDescription: "لا يوجد وصف متاح.",
  },
  pt: {
    title: "WikiBrowse",
    placeholder: "Digite um termo de pesquisa",
    welcome: "Bem-vindo ao WikiBrowse!",
    description: "O WikiBrowse é um navegador baseado na Wikipedia que ajuda você a encontrar informações rapidamente.",
    exampleSearch: "Comece digitando um termo de pesquisa ou experimente um dos seguintes exemplos de termos de pesquisa:",
    resultsTitle: "Resultados:",
    loading: "Carregando...",
    errorMessage: "Algo deu errado. Tente novamente.",
    noResults: "Nenhum resultado encontrado.",
    noDescription: "Nenhuma descrição disponível.",
  },
  bn: {
    title: "WikiBrowse",
    placeholder: "একটি অনুসন্ধান শব্দ লিখুন",
    welcome: "WikiBrowse-এ স্বাগতম!",
    description: "WikiBrowse একটি ব্রাউজার যা Wikipedia-তে ভিত্তি করে এবং আপনাকে দ্রুত তথ্য খুঁজে পেতে সহায়ক।",
    exampleSearch: "একটি অনুসন্ধান শব্দ লিখতে শুরু করুন অথবা এই উদাহরণ অনুসন্ধান শব্দগুলির মধ্যে একটি চেষ্টা করুন:",
    resultsTitle: "ফলাফল:",
    loading: "লোড হচ্ছে...",
    errorMessage: "কিছু ভুল হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।",
    noResults: "কোনো ফলাফল পাওয়া যায়নি।",
    noDescription: "কোনো বিবরণ পাওয়া যায়নি।",
  },
  ru: {
    title: "WikiBrowse",
    placeholder: "Введите поисковый запрос",
    welcome: "Добро пожаловать в WikiBrowse!",
    description: "WikiBrowse — это браузер, основанный на Википедии, который помогает быстро находить информацию.",
    exampleSearch: "Начните вводить поисковый запрос или попробуйте один из следующих примеров:",
    resultsTitle: "Результаты:",
    loading: "Загрузка...",
    errorMessage: "Что-то пошло не так. Пожалуйста, попробуйте снова.",
    noResults: "Результаты не найдены.",
    noDescription: "Описание недоступно.",
  },
  ja: {
    title: "WikiBrowse",
    placeholder: "検索語を入力",
    welcome: "WikiBrowseへようこそ！",
    description: "WikiBrowseはWikipediaに基づいたブラウザで、素早く情報を見つけるのに役立ちます。",
    exampleSearch: "検索語を入力して始めるか、次の例を試してください:",
    resultsTitle: "結果：",
    loading: "読み込み中...",
    errorMessage: "何かがうまくいきませんでした。もう一度お試しください。",
    noResults: "結果が見つかりませんでした。",
    noDescription: "説明はありません。",
  },
  de: {
    title: "WikiBrowse",
    placeholder: "Geben Sie einen Suchbegriff ein",
    welcome: "Willkommen bei WikiBrowse!",
    description: "WikiBrowse ist ein Browser, der auf Wikipedia basiert und Ihnen hilft, schnell Informationen zu finden.",
    exampleSearch: "Beginnen Sie mit der Eingabe eines Suchbegriffs oder probieren Sie einen der folgenden Beispielbegriffe:",
    resultsTitle: "Ergebnisse:",
    loading: "Wird geladen...",
    errorMessage: "Etwas ist schief gelaufen. Bitte versuchen Sie es erneut.",
    noResults: "Keine Ergebnisse gefunden.",
    noDescription: "Keine Beschreibung verfügbar.",
  },
  ko: {
    title: "WikiBrowse",
    placeholder: "검색어를 입력하세요",
    welcome: "WikiBrowse에 오신 것을 환영합니다!",
    description: "WikiBrowse는 Wikipedia를 기반으로 한 브라우저로, 정보를 빠르게 찾는 데 도움이 됩니다.",
    exampleSearch: "검색어를 입력하거나 다음 예시 검색어를 시도하세요:",
    resultsTitle: "결과:",
    loading: "로딩 중...",
    errorMessage: "문제가 발생했습니다. 다시 시도해 주세요.",
    noResults: "결과가 없습니다.",
    noDescription: "설명 없음.",
  },
  fr: {
    title: "WikiBrowse",
    placeholder: "Entrez un terme de recherche",
    welcome: "Bienvenue sur WikiBrowse !",
    description: "WikiBrowse est un navigateur basé sur Wikipédia qui vous aide à trouver des informations rapidement.",
    exampleSearch: "Commencez à taper un terme de recherche ou essayez l'un des exemples suivants :",
    resultsTitle: "Résultats :",
    loading: "Chargement...",
    errorMessage: "Quelque chose s'est mal passé. Veuillez réessayer.",
    noResults: "Aucun résultat trouvé.",
    noDescription: "Aucune description disponible.",
  },
  it: {
    title: "WikiBrowse",
    placeholder: "Inserisci un termine di ricerca",
    welcome: "Benvenuto su WikiBrowse!",
    description: "WikiBrowse è un browser basato su Wikipedia che ti aiuta a trovare informazioni rapidamente.",
    exampleSearch: "Inizia a digitare un termine di ricerca o prova uno dei seguenti esempi:",
    resultsTitle: "Risultati:",
    loading: "Caricamento in corso...",
    errorMessage: "Qualcosa è andato storto. Riprova.",
    noResults: "Nessun risultato trovato.",
    noDescription: "Nessuna descrizione disponibile.",
  },
  pl: {
    title: "WikiBrowse",
    placeholder: "Wprowadź termin wyszukiwania",
    welcome: "Witaj w WikiBrowse!",
    description: "WikiBrowse to przeglądarka oparta na Wikipedii, która pomaga szybko znaleźć informacje.",
    exampleSearch: "Zacznij wpisywać termin wyszukiwania lub wypróbuj jeden z poniższych przykładów:",
    resultsTitle: "Wyniki:",
    loading: "Ładowanie...",
    errorMessage: "Coś poszło nie tak. Spróbuj ponownie.",
    noResults: "Brak wyników.",
    noDescription: "Brak opisu.",
  },
  uk: {
    title: "WikiBrowse",
    placeholder: "Введіть пошуковий запит",
    welcome: "Ласкаво просимо до WikiBrowse!",
    description: "WikiBrowse — це браузер, заснований на Wikipedia, який допомагає швидко знаходити інформацію.",
    exampleSearch: "Почніть вводити пошуковий запит або спробуйте один з наступних прикладів:",
    resultsTitle: "Результати:",
    loading: "Завантаження...",
    errorMessage: "Щось пішло не так. Спробуйте ще раз.",
    noResults: "Результати не знайдено.",
    noDescription: "Опис недоступний.",
  },
  ro: {
    title: "WikiBrowse",
    placeholder: "Introduceți un termen de căutare",
    welcome: "Bine ați venit pe WikiBrowse!",
    description: "WikiBrowse este un browser bazat pe Wikipedia care vă ajută să găsiți rapid informații.",
    exampleSearch: "Începeți să tastați un termen de căutare sau încercați unul dintre următoarele exemple:",
    resultsTitle: "Rezultate:",
    loading: "Se încarcă...",
    errorMessage: "Ceva a mers greșit. Vă rugăm să încercați din nou.",
    noResults: "Nu au fost găsite rezultate.",
    noDescription: "Nu există descriere.",
  },
  tr: {
    title: "WikiBrowse",
    placeholder: "Bir arama terimi girin",
    welcome: "WikiBrowse'a hoş geldiniz!",
    description: "WikiBrowse, Wikipedia'ya dayalı bir tarayıcıdır ve hızlı bir şekilde bilgi bulmanıza yardımcı olur.",
    exampleSearch: "Bir arama terimi yazmaya başlayın veya aşağıdaki örnek arama terimlerinden birini deneyin:",
    resultsTitle: "Sonuçlar:",
    loading: "Yükleniyor...",
    errorMessage: "Bir şeyler ters gitti. Lütfen tekrar deneyin.",
    noResults: "Sonuç bulunamadı.",
    noDescription: "Açıklama yok.",
  },
  fa: {
    title: "WikiBrowse",
    placeholder: "یک عبارت جستجو وارد کنید",
    welcome: "به WikiBrowse خوش آمدید!",
    description: "WikiBrowse یک مرورگر مبتنی بر Wikipedia است که به شما کمک می‌کند سریعاً اطلاعات پیدا کنید.",
    exampleSearch: "با وارد کردن یک عبارت جستجو شروع کنید یا یکی از این مثال‌های جستجو را امتحان کنید:",
    resultsTitle: "نتایج:",
    loading: "در حال بارگذاری...",
    errorMessage: "چیزی اشتباه پیش رفت. لطفاً دوباره تلاش کنید.",
    noResults: "هیچ نتیجه‌ای یافت نشد.",
    noDescription: "توضیحی موجود نیست.",
  },
  sv: {
    title: "WikiBrowse",
    placeholder: "Ange en sökterm",
    welcome: "Välkommen till WikiBrowse!",
    description: "WikiBrowse är en webbläsare baserad på Wikipedia som hjälper dig att hitta information snabbt.",
    exampleSearch: "Börja skriva en sökterm eller prova en av de här exempeltermerna:",
    resultsTitle: "Resultat:",
    loading: "Laddar...",
    errorMessage: "Något gick fel. Vänligen försök igen.",
    noResults: "Inga resultat hittades.",
    noDescription: "Ingen beskrivning tillgänglig.",
  },
  fi: {
    title: "WikiBrowse",
    placeholder: "Syötä hakusana",
    welcome: "Tervetuloa WikiBrowseen!",
    description: "WikiBrowse on Wikipediaan perustuva selain, joka auttaa sinua löytämään tietoa nopeasti.",
    exampleSearch: "Aloita kirjoittamalla hakusana tai kokeile yhtä seuraavista esimerkeistä:",
    resultsTitle: "Tulokset:",
    loading: "Ladataan...",
    errorMessage: "Jokin meni pieleen. Yritä uudelleen.",
    noResults: "Ei tuloksia.",
    noDescription: "Ei kuvausta.",
  },
  ga: {
    title: "WikiBrowse",
    placeholder: "Cuir isteach téarma cuardaigh",
    welcome: "Fáilte chuig WikiBrowse!",
    description: "Is brabhsálaí é WikiBrowse atá bunaithe ar Wikipedia agus cabhraíonn sé leat faisnéis a fháil go tapa.",
    exampleSearch: "Tosaigh trí théarma cuardaigh a chlóscríobh nó triail a bhaint as ceann de na téarmaí cuardaigh samplacha seo:",
    resultsTitle: "Torthaí:",
    loading: "Á luchtú...",
    errorMessage: "Rinneadh botún. Le do thoil, triail a bhaint as arís.",
    noResults: "Ní raibh aon torthaí le fáil.",
    noDescription: "Níl aon cur síos ar fáil.",
  }
};

interface LocalizationContextType {
  language: string;
  setLanguage: React.Dispatch<React.SetStateAction<string>>;
  localizedText: typeof localizedText;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

export const useLocalization = () => {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error("useLocalization must be used within a LocalizationProvider");
  }
  return context;
};

// Localization Provider component
interface LocalizationProviderProps {
  children: ReactNode;
}

export const LocalizationProvider: React.FC<LocalizationProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<string>("en");

  return (
    <LocalizationContext.Provider value={{ language, setLanguage, localizedText }}>
      {children}
    </LocalizationContext.Provider>
  );
};
