"use strict";
const DEFAULT_WORD_SOURCE_NAME = "LibreOffice de_DE_frami (5 Buchstaben)";
const DEFAULT_WORD_SOURCE_NOTE = "Aus de_DE_frami.dic extrahierte 5-Buchstaben-Headwords; Umlaute und ß bleiben erhalten.";
const CUSTOM_WORD_SOURCE_NOTE = "Eigene Liste importiert; zugelassen sind nur Wörter mit genau 5 Zeichen aus a-zäöüß.";
const DEFAULT_WORDS = ["aalen", "aarau", "aaron", "aasee", "abart", "abbat", "abbau", "abbog", "abece", "abend", "abgab", "abgas", "abhat", "abhob", "abhol", "abhub", "abhör", "abkam", "ablag", "ablas", "ablud", "abmaß", "abort", "abruf", "absah", "absaß", "absud", "abtat", "abtei", "abtun", "abuja", "abweg", "abwog", "abzog", "abzug", "accra", "achat", "achim", "achse", "acker", "acryl", "adams", "adeln", "adels", "adept", "adieu", "adler", "adlig", "adobe", "adolf", "adria", "adult", "aerob", "afden", "affen", "affig", "affin", "affix", "after", "agave", "agens", "agent", "agger", "agnat", "agnes", "agora", "agrar", "aguti", "ahaus", "ahlen", "ahmen", "ahnen", "ahorn", "aires", "aisne", "akaba", "akkon", "akten", "aktie", "aktin", "aktiv", "aktor", "alaaf", "alant", "alarm", "alaun", "alban", "alben", "albis", "album", "alert", "algen", "alias", "alibi", "alice", "alien", "alina", "alkan", "alken", "alkyl", "allah", "allee", "allel", "allwo", "allyl", "allzu", "alois", "alona", "alpen", "alpha", "alpin", "altai", "altan", "altar", "alten", "alter", "altöl", "alzey", "ambig", "ambon", "amern", "amida", "amman", "ammen", "ammer", "ammon", "ampel", "amrum", "amsel", "amten", "amöbe", "anbau", "anbei", "anbot", "anden", "andre", "anett", "angab", "angel", "anger", "angst", "anhat", "anhob", "anika", "anion", "anita", "anjou", "ankam", "anker", "anlag", "anlas", "anlog", "anmut", "annam", "annan", "annie", "anode", "anruf", "anrät", "ansah", "antat", "antik", "antje", "anton", "antun", "anuli", "anwar", "anzog", "anzug", "aorta", "aosta", "apart", "apfel", "aphel", "apnoe", "apoll", "apple", "april", "apsis", "aquin", "arbon", "arbzg", "arche", "arcor", "arcus", "areal", "arena", "argon", "argus", "ariel", "arier", "arkus", "armee", "armen", "armin", "armut", "arndt", "arnim", "aroma", "arosa", "arras", "array", "arsch", "arsen", "arten", "artig", "artus", "aruba", "asche", "ascho", "ascii", "asiat", "asien", "asket", "aspik", "assad", "assam", "assel", "assur", "asten", "aster", "astro", "atair", "atari", "athen", "athos", "atlas", "atmen", "atoll", "atsch", "attac", "audio", "audit", "aufaß", "augen", "augst", "augur", "aulen", "aurar", "aurel", "auslg", "autor", "autun", "auxin", "außen", "außer", "aware", "axial", "axiom", "aznar", "azubi", "babel", "baden", "bader", "bafin", "bafög", "bahai", "bahra", "bahre", "balje", "balte", "balve", "bambi", "banal", "banat", "bande", "banjo", "bantu", "barak", "barbe", "barde", "baron", "barst", "barth", "baryt", "basal", "basar", "basel", "basic", "basis", "baske", "basra", "basta", "batik", "bator", "bauch", "bauen", "bauer", "bayer", "bazar", "bbesg", "beate", "bebel", "beben", "bebop", "bebra", "becks", "beeil", "beere", "begab", "begau", "behuf", "beide", "beige", "bekaa", "bekam", "belag", "beleg", "belga", "beltz", "belud", "bemaß", "benin", "benno", "beppo", "berge", "berme", "bernd", "berta", "berti", "beruf", "besah", "besaß", "besek", "besen", "betel", "beten", "beter", "beton", "betty", "betül", "beuel", "beuge", "beule", "beute", "beuys", "bevor", "bewog", "bezug", "bghst", "bibel", "biber", "bidet", "biene", "biese", "biest", "bihar", "biker", "bilch", "billy", "bimbo", "binde", "bingo", "binom", "binse", "binär", "biped", "birgt", "birke", "birma", "birne", "birst", "bisam", "bisky", "bison", "bitte", "biwak", "björn", "blair", "blank", "blase", "blass", "blatt", "blech", "blich", "blick", "blieb", "blies", "blimp", "blind", "blink", "blitz", "bloch", "block", "blond", "blues", "bluff", "blume", "bluse", "bläst", "blöße", "blüte", "board", "boden", "bogen", "bogig", "bogor", "bohle", "bohne", "bolte", "bombe", "bomst", "bongo", "bonus", "bonze", "boots", "boran", "borat", "borax", "borid", "boris", "borke", "borna", "borte", "bosch", "boson", "boten", "botox", "bovin", "bowie", "bowle", "boxen", "boxer", "bozen", "brach", "braga", "brahe", "brake", "brand", "braue", "braun", "braus", "braut", "bravo", "break", "brech", "breda", "breit", "brems", "brenn", "brenz", "brest", "brett", "brief", "brieg", "briet", "brigg", "brise", "brite", "britz", "bruch", "brugg", "brumm", "bruni", "bruno", "brust", "bryan", "brühe", "brühl", "brünn", "brüsk", "buben", "bucht", "bufdi", "buhen", "buhne", "buise", "bulle", "bulli", "bunak", "burda", "buren", "burka", "burma", "bursa", "burse", "busch", "busen", "butan", "butze", "bäche", "bäckt", "bäder", "bälde", "bälge", "bände", "bänke", "bären", "bärte", "bäumt", "böbig", "böcke", "böden", "bögen", "böhme", "bönen", "börde", "börne", "börse", "bügel", "bühne", "büken", "bülow", "bünde", "bürde", "büren", "büste", "büsum", "bütte", "büßen", "büßer", "cache", "cadiz", "calla", "calyx", "campe", "camus", "canna", "canon", "capri", "cargo", "carla", "carlo", "carol", "cathy", "cebit", "celan", "cella", "celle", "celli", "cello", "ceres", "ceuta", "chaco", "champ", "chaos", "chaot", "chart", "check", "chile", "chili", "china", "chlor", "choke", "chose", "chris", "chrom", "chöre", "cidre", "circa", "cisco", "civil", "clara", "claus", "clean", "clone", "clown", "cluny", "coach", "cobol", "codec", "codex", "codon", "comer", "comic", "conow", "corps", "corso", "costa", "cotta", "couch", "cover", "crack", "cranz", "crash", "crawl", "credo", "creme", "cuneo", "curie", "curry", "cyber", "cäsar", "cölln", "dabei", "dacca", "dachs", "dafür", "dahat", "daher", "dahin", "dahme", "dakar", "daker", "dalag", "dalai", "dalli", "dalum", "damen", "damit", "damme", "dampf", "dandy", "dante", "daran", "darob", "darre", "darts", "darum", "dasaß", "datei", "daten", "datex", "dativ", "datum", "daube", "dauer", "daune", "david", "davis", "davon", "davor", "davos", "ddatp", "ddctp", "ddgtp", "ddntp", "ddttp", "debil", "debit", "debüt", "degen", "deich", "deime", "dekan", "dekor", "delft", "delhi", "delle", "delos", "delta", "demut", "denar", "denis", "depot", "derby", "derer", "desto", "deutz", "devon", "devot", "dferl", "dgzrs", "dhabi", "dhaka", "dhünn", "diana", "diazo", "dicht", "diego", "diele", "dijon", "dildo", "dimer", "dinar", "diner", "dingo", "diode", "dione", "dipol", "dirne", "disco", "disko", "diven", "diwan", "dnase", "docht", "dogge", "dogma", "dohle", "dolby", "dolch", "dolde", "dolly", "donar", "donau", "donez", "donor", "donut", "dopen", "doris", "dosen", "dosis", "dosse", "dover", "draht", "drall", "drama", "drang", "drauf", "draus", "dreck", "dress", "drift", "drill", "drink", "dritt", "droge", "drohn", "drops", "drost", "druck", "drude", "druse", "dröge", "drüse", "dschg", "dsdna", "dubai", "dubio", "dudel", "duden", "duell", "duett", "dukat", "dumas", "dumen", "dummy", "dumpf", "dunja", "dunst", "duplo", "durch", "durst", "dusch", "dusel", "duzen", "dylan", "dämme", "dämon", "därme", "döner", "dösen", "dösig", "dübel", "düfte", "dünge", "dünkt", "düren", "dürer", "dürre", "düsen", "ebben", "ebene", "ebert", "ebnen", "ebola", "ebook", "echse", "ecken", "eckig", "ecolo", "edeka", "edgar", "edikt", "edith", "edukt", "edwin", "effet", "egart", "ehern", "ehest", "ehren", "eibau", "eiche", "eider", "eidum", "eiern", "eifel", "eifer", "eigen", "eiger", "eilat", "eilen", "eilig", "eimer", "einen", "einig", "einöd", "eisen", "eisig", "eitel", "eiter", "ekeln", "eklat", "eklig", "ektop", "ekzem", "elast", "elekt", "elena", "elend", "eleve", "elfen", "elfer", "elias", "elise", "elite", "eliza", "ellen", "eller", "elmar", "elmpt", "eloge", "elser", "elspe", "elten", "elvis", "email", "emden", "emder", "emesa", "empor", "emser", "emsig", "enden", "engel", "engen", "enger", "enkel", "enorm", "enten", "enzym", "eosin", "eozän", "eprom", "epson", "equin", "erbat", "erben", "erbin", "erbse", "erden", "erdig", "erdöl", "ergab", "erich", "erika", "erker", "erlag", "erlog", "erlös", "ermaß", "ernst", "ernte", "erpel", "ersti", "erwin", "erzog", "esche", "esens", "essay", "essen", "esser", "essex", "essig", "ester", "etage", "ethan", "ether", "ethik", "ethin", "ethos", "etsch", "ettal", "etzel", "etüde", "euböa", "eufor", "eugen", "eulen", "euler", "eupen", "euter", "eutin", "event", "evita", "ewald", "exakt", "excel", "exter", "extra", "eylau", "fabel", "faber", "facto", "faden", "fahne", "fahrt", "fakir", "falco", "falke", "falle", "falls", "falte", "famos", "fanal", "fango", "fanny", "fanta", "farad", "farbe", "farce", "farge", "farsi", "fasan", "faser", "fatah", "fatal", "fatum", "fatwa", "fauna", "faust", "faxen", "fazit", "fecht", "feder", "fegen", "feger", "fehde", "feien", "feier", "feile", "feind", "feist", "felge", "felix", "femur", "fermi", "ferse", "fesch", "fetal", "feuer", "feyen", "fiale", "fibel", "fidel", "fight", "figur", "filet", "filou", "final", "finca", "finit", "finne", "finte", "firma", "first", "fisch", "fitte", "fixen", "fixer", "fixum", "fjord", "fjärd", "flach", "flair", "flame", "flash", "flaum", "fleck", "fleiß", "flick", "fließ", "flink", "flirt", "flohe", "flora", "floss", "flott", "fluch", "flugs", "fluid", "fluke", "fluor", "fluse", "fluss", "flyer", "flöge", "flöhe", "flöte", "focht", "focus", "fokal", "fokus", "folge", "folie", "folio", "fonem", "foren", "forke", "forma", "forsa", "forst", "forte", "forum", "fossa", "fotze", "fovea", "foyer", "frack", "frage", "franc", "frank", "franz", "fratz", "freak", "frech", "fremd", "fress", "freud", "frick", "fried", "fries", "frist", "fritz", "fromm", "front", "frost", "frust", "fräße", "fröre", "fuchs", "fuder", "fugen", "fuhre", "fulda", "fundi", "funke", "furan", "furie", "furka", "fusel", "futon", "futur", "fußen", "fäden", "fädig", "fähig", "fähre", "fährt", "fäkal", "fängt", "färse", "fäule", "fäzes", "föhre", "fönen", "förde", "fötal", "föten", "fötus", "fügen", "fülle", "fünen", "fünft", "fürst", "fürth", "fürze", "gabel", "gabun", "gaden", "gaius", "galan", "galen", "galle", "gallo", "gamba", "gambe", "gamet", "gamma", "ganda", "garbe", "garbo", "garde", "garni", "gasse", "gassi", "gates", "gatte", "gaube", "gauck", "gauda", "gaudi", "gbits", "gbyte", "gebar", "geben", "geber", "gebet", "gebot", "gebär", "gecko", "geest", "gefäß", "gegen", "gehen", "geher", "gehre", "gehör", "geier", "geige", "geisa", "geist", "gelee", "gemen", "gemme", "gemäß", "gemüt", "genas", "genau", "genie", "genom", "genre", "genua", "genug", "genus", "georg", "gerda", "gerte", "gerti", "gerät", "geste", "gesät", "gesäß", "getan", "getto", "getue", "geäst", "geölt", "geübt", "ggmbh", "ghana", "gicht", "gilde", "ginge", "ginko", "gitta", "gitti", "gizeh", "glanz", "glatt", "gleis", "gleit", "glems", "glial", "glich", "glied", "glien", "glimm", "glitt", "glomm", "glonn", "gluck", "gluon", "glück", "gmünd", "gnade", "gneis", "godot", "gogol", "gojim", "golan", "golda", "golde", "golem", "gomel", "gomez", "goral", "gorki", "gortz", "gosen", "gosse", "gotha", "gotik", "gouda", "graal", "grace", "grade", "graft", "gramm", "grams", "grani", "graph", "grass", "graus", "greif", "greis", "greiz", "grell", "grenz", "greta", "grete", "grieß", "griff", "grill", "grimm", "grind", "grips", "groll", "grube", "gruft", "grund", "gräbt", "gräte", "gröde", "größe", "grübe", "grüna", "guave", "gucci", "guido", "gulag", "gully", "gummi", "gunst", "guppy", "gurke", "gusen", "gusto", "gyros", "gälte", "gämse", "gänse", "gänze", "gären", "gäste", "gäule", "gödel", "göran", "gösch", "gösse", "götze", "gülle", "güter", "gütig", "haben", "haber", "habit", "habun", "hader", "hades", "hafen", "hafer", "hagar", "hagel", "hagen", "hager", "hagia", "haida", "haifa", "haiti", "haken", "hakka", "halde", "halit", "hallo", "halma", "halse", "halte", "halys", "hamas", "hamed", "hanau", "handy", "hanna", "hanne", "hanno", "hanns", "hanoi", "hansa", "hanse", "happy", "hardy", "harem", "harfe", "harle", "harro", "harry", "hartz", "hasch", "hasel", "hasen", "hasso", "hatte", "haube", "hauch", "hauen", "hauer", "hauff", "haupt", "havel", "haydn", "hebel", "heben", "heber", "hecht", "hedda", "hegau", "hegel", "hegen", "heide", "heidi", "heike", "heiko", "heine", "heini", "heino", "heinz", "heißa", "helau", "helga", "helge", "helix", "hella", "helot", "hemer", "henna", "henne", "henri", "henry", "herab", "heran", "herat", "herme", "herne", "heroe", "heros", "herta", "hertz", "herum", "herzl", "herzu", "hesel", "hesse", "heuer", "heuss", "heute", "hexan", "hexen", "hexer", "hielt", "hilda", "hilde", "hilfe", "hilfs", "hilft", "hinab", "hinan", "hindi", "hindu", "hinte", "hinzu", "hippe", "hirse", "hirte", "hitze", "hoare", "hobby", "hobel", "hoden", "hofer", "holen", "holla", "holle", "homer", "honda", "honen", "honig", "hooge", "hopsa", "horaz", "horde", "horst", "horus", "hosea", "hosen", "hotel", "hovel", "huber", "hucke", "human", "humid", "humor", "humos", "humus", "humös", "hunan", "hunde", "hunne", "hupen", "huren", "hurra", "husar", "husch", "husky", "hussa", "husse", "husum", "hydra", "hymen", "hymne", "hyphe", "hyäne", "häfen", "häher", "hähne", "hälfe", "hälse", "hände", "hänge", "härte", "häsin", "hätte", "häute", "höhen", "höher", "höhle", "höhlt", "höker", "hölle", "hönir", "hönne", "hören", "hörer", "hörig", "hüben", "hüfte", "hügel", "hühne", "hülle", "hülse", "hümme", "hürde", "hürth", "hüten", "hüter", "hütte", "iambe", "ibiza", "ibsen", "idaho", "ideal", "ideen", "idiom", "idiot", "idyll", "igeln", "igitt", "ignaz", "ihlow", "ikone", "ileus", "ilias", "ilios", "iller", "ilona", "iltis", "image", "imker", "immer", "immun", "imola", "inbus", "indem", "inden", "inder", "indes", "index", "indik", "indio", "indiz", "indus", "inert", "infam", "infel", "inlay", "innen", "innig", "input", "insel", "intel", "intim", "intro", "intus", "inuit", "iodat", "iodid", "ionen", "irden", "irene", "irina", "irren", "irrig", "irsch", "isaac", "isaak", "ischl", "islam", "issos", "issum", "izmir", "jacht", "jacke", "jacob", "jaffa", "jagen", "jahwe", "jaina", "jakob", "jalta", "jambe", "james", "japan", "jason", "jause", "jeans", "jeher", "jemen", "jenni", "jenny", "jerez", "jerli", "jerry", "jeton", "jetzt", "jever", "jodat", "jodid", "jogin", "joint", "joker", "jolle", "jones", "joppe", "josef", "jotam", "joule", "juana", "jubel", "juden", "judäa", "juist", "julia", "jumbo", "junge", "jungs", "junta", "juras", "juror", "jurte", "jutta", "juwel", "juxte", "jäger", "jäten", "jüdin", "jümme", "kaaba", "kabel", "kabul", "kacke", "kader", "kafka", "kahla", "kairo", "kajak", "kakao", "kalbs", "kalif", "kalla", "kalle", "kamba", "kamee", "kamel", "kamen", "kamin", "kampf", "kanal", "kanin", "kanna", "kanne", "kanon", "kante", "kapok", "kappa", "kappe", "karat", "karde", "kargo", "karin", "karla", "karma", "karow", "karre", "karst", "karte", "kasel", "kaska", "kasko", "kassa", "kasse", "kaste", "kasus", "katar", "kater", "katia", "katja", "katta", "katyn", "kauen", "kauri", "kbaud", "kbyte", "kebab", "kefir", "kegel", "kehle", "kelch", "kelim", "kelle", "kelly", "kelte", "kemak", "kemal", "kenia", "kerze", "keton", "kette", "keule", "kevin", "khaki", "khmer", "kieme", "kiepe", "kindl", "kiosk", "kioto", "kiowa", "kippa", "kippe", "kirch", "kirow", "kirre", "kisch", "kiste", "klade", "klage", "klamm", "klang", "klapp", "klaps", "klara", "klaro", "klaus", "klebe", "kleid", "kleie", "klein", "klemm", "klett", "kleve", "klick", "kliff", "klima", "klimt", "klipp", "klomm", "klops", "klose", "klotz", "kluft", "klump", "klüse", "klütz", "knabe", "knack", "knall", "knapp", "knast", "knauf", "knaur", "knick", "knien", "kniff", "knopf", "knorr", "knuff", "knust", "koala", "kobra", "kodak", "kodex", "kogge", "kohle", "kokke", "kokon", "kokos", "kolik", "kombi", "komet", "komik", "komma", "kongo", "konto", "konus", "konya", "kopal", "kopie", "kopte", "koran", "korea", "korfu", "korps", "korse", "korso", "korst", "kosak", "kosen", "kotau", "koten", "kotte", "kpdsu", "kraal", "krach", "kraft", "krain", "krake", "krank", "kranz", "krapp", "krass", "kraul", "kraus", "kraut", "krebs", "kredo", "kreis", "kreme", "kreml", "krenz", "kreon", "krepp", "kreta", "kreuz", "krieg", "krill", "krimi", "kripo", "krise", "kroch", "kroki", "krone", "kropf", "kross", "kruke", "krume", "krumm", "krupp", "krähe", "krähl", "kräne", "kröte", "kuala", "kuban", "kuben", "kubus", "kugel", "kuhle", "kulak", "kumys", "kunde", "kunst", "kunze", "kupee", "kupon", "kuppe", "kurde", "kuren", "kurie", "kursk", "kurve", "kusch", "kusel", "kutan", "kutte", "kyoto", "kyrie", "kyros", "käfer", "käfig", "kähne", "kälte", "kämen", "kämme", "kämpe", "käppi", "käsen", "käser", "käsig", "käthe", "käuze", "köche", "köder", "köfte", "könig", "köpfe", "köpke", "körbe", "kösen", "köter", "kübel", "kübra", "küche", "küfer", "küken", "küren", "küste", "laach", "laage", "label", "laben", "labil", "labor", "lache", "lachs", "laden", "lader", "ladin", "laffe", "lagen", "lager", "lahar", "lahti", "laich", "laika", "lakai", "laken", "lamee", "lampe", "lande", "lanka", "lanke", "lanze", "laote", "larve", "lasch", "lasek", "laser", "lassa", "lasso", "lasur", "latex", "lativ", "latte", "laube", "lauch", "lauda", "laude", "lauer", "laugk", "laune", "laura", "laure", "lauta", "laven", "lbauo", "leben", "leber", "lecce", "leder", "ledig", "leffe", "lefze", "legal", "legat", "legau", "legen", "leger", "lehen", "lehne", "lehre", "leibt", "leica", "leier", "leine", "leipe", "leise", "leitz", "lemgo", "lemma", "lemur", "lenau", "lende", "lenin", "lenne", "lenya", "lepra", "lesbe", "lesen", "leser", "lesum", "letal", "lette", "letzt", "leuna", "leute", "leuth", "level", "lexem", "lexik", "lhasa", "liane", "licht", "liebe", "liede", "liege", "lienz", "liese", "liest", "lifau", "ligen", "likör", "lilie", "lille", "limbo", "limes", "limit", "linda", "linde", "lindt", "linie", "linke", "links", "linon", "linse", "linth", "linus", "linux", "lipid", "lipno", "lippe", "liszt", "liter", "litze", "livia", "lloyd", "lobby", "loben", "loden", "logik", "login", "logis", "lohse", "loipe", "loire", "lokal", "lorch", "losen", "loten", "lotos", "lotse", "lotte", "lotto", "lotus", "louis", "loyal", "lucca", "luchs", "lucia", "luder", "lugen", "luigi", "luise", "lukas", "lumen", "lunar", "lunch", "lunge", "lunte", "lurch", "luxor", "luxus", "luzid", "luzon", "lverf", "lyder", "lydia", "lymph", "lyrik", "lysin", "läden", "lägen", "länge", "längs", "lässt", "läuft", "läuse", "löbau", "löhne", "lösch", "lösen", "löten", "löwen", "lübke", "lücke", "lügen", "lünen", "lüste", "macao", "macho", "macht", "macke", "madig", "maedi", "mafia", "magda", "magen", "mager", "maggi", "magie", "magma", "magog", "magst", "mahdi", "maier", "maike", "mainz", "major", "makel", "makro", "malad", "malat", "malen", "maler", "malmö", "malta", "malus", "malve", "mambo", "mampf", "manau", "manch", "mandy", "manga", "mango", "manie", "manko", "manna", "maori", "mappe", "marbv", "marco", "maren", "marga", "marge", "maria", "marie", "marin", "mario", "mariä", "marko", "markt", "marne", "maske", "massa", "masse", "match", "mathe", "matte", "mauer", "maure", "mauve", "maxim", "mayen", "mayer", "mazda", "mbeki", "mbyte", "medan", "medea", "meder", "media", "meier", "meike", "meile", "meise", "meist", "mekka", "melde", "melle", "melos", "memel", "memme", "menge", "mensa", "mente", "meran", "merck", "messe", "meter", "metis", "metro", "metze", "meute", "meyer", "miami", "micha", "midas", "miene", "miere", "miete", "mieze", "mikro", "mikwe", "milan", "milbe", "milch", "milet", "miliz", "milka", "mille", "milos", "mimen", "mimik", "minen", "minna", "minne", "minsk", "minus", "minze", "mirko", "mirow", "misch", "mitaß", "mitra", "mitte", "mixen", "mixer", "mobil", "modal", "model", "modem", "moder", "modul", "modus", "moers", "mogul", "mohär", "mokka", "molar", "molch", "molke", "monat", "monet", "moped", "moral", "mores", "moron", "morph", "morse", "morus", "mosel", "moser", "moses", "motel", "motiv", "motor", "motte", "motto", "mount", "msdos", "mtdna", "muffe", "mufti", "muhen", "mukös", "mulch", "mulde", "mulga", "multi", "mumie", "mumps", "murau", "murin", "murks", "musik", "musil", "musst", "muten", "mutex", "mutig", "mutti", "myrre", "myrte", "mysql", "myzel", "myzet", "mäate", "mädel", "mägde", "mägen", "mähen", "mäher", "mähne", "mähre", "mäuse", "mäzen", "mäßig", "möbel", "mögen", "möhne", "möhra", "möhre", "mölln", "mönch", "möpse", "mücke", "mühen", "mühle", "münze", "mürbe", "müsli", "mütze", "müßig", "naarn", "nabel", "nacht", "nackt", "nadel", "nagel", "nagen", "nager", "nahen", "nahme", "namen", "namib", "namur", "nancy", "nandu", "naomi", "narbe", "narva", "nasal", "nasat", "nasen", "natal", "nativ", "natur", "nauen", "nauru", "naxos", "nazca", "nebel", "neben", "nebra", "nebst", "nedim", "neffe", "neger", "negev", "negro", "nehru", "neiße", "nelke", "nepal", "netto", "neuer", "neume", "neunt", "neuss", "newel", "nexus", "nicht", "nicki", "nicäa", "nidda", "niehl", "niels", "niere", "niers", "niete", "niger", "nigra", "nikon", "nilot", "nimes", "nimmt", "nivea", "nixon", "nizza", "nizäa", "nobel", "nocke", "nogat", "nokia", "nolde", "nomen", "nonne", "noppe", "norme", "norne", "noske", "notar", "noten", "notiz", "novum", "nsdap", "nudel", "nugat", "nulpe", "nutte", "nylon", "nägel", "nähen", "näher", "nähte", "nänie", "näpfe", "nässe", "nölen", "nötig", "obama", "obhut", "oblag", "ocker", "odeon", "odeur", "odium", "oelde", "oelsa", "offen", "oheim", "ohren", "oktan", "oktav", "oland", "oldie", "oleum", "olive", "olten", "olymp", "omaha", "ombai", "omega", "onkel", "opern", "opfer", "opium", "optik", "orang", "orbit", "orden", "order", "organ", "orgel", "orgie", "orion", "orkan", "orkus", "ornat", "orten", "osaka", "osama", "oscar", "oskar", "osmar", "osram", "ossär", "osten", "oster", "ostia", "otmar", "otter", "outen", "owler", "ozean", "pablo", "pacht", "padua", "pagan", "pagat", "paket", "palas", "palau", "palea", "palma", "palme", "palpe", "pamir", "pampa", "pampe", "panay", "panda", "panik", "panne", "paola", "paolo", "papen", "paper", "pappe", "papst", "papua", "parat", "paris", "parka", "parma", "parse", "party", "pasch", "passa", "pasta", "paste", "patch", "pater", "patio", "patre", "pauke", "paula", "pauli", "pause", "pavia", "pedal", "pedro", "peene", "pegel", "peggy", "peine", "penis", "pepsi", "perle", "perth", "pesto", "petal", "peter", "petra", "petri", "pfahl", "pfalz", "pfand", "pfarr", "pfeil", "pferd", "pfiff", "pflug", "pfote", "pfuhl", "pfund", "phase", "phatt", "phlox", "phnom", "photo", "phyla", "phyle", "phöbe", "piano", "pieck", "pieps", "pieta", "pieve", "piezo", "pikee", "piken", "pille", "pilot", "pilus", "pimpf", "pinie", "pinne", "piotr", "pippi", "pipra", "pirat", "pirna", "pirol", "piste", "pixel", "pizza", "plato", "platt", "platz", "plebs", "plena", "plump", "pluto", "pläne", "podex", "pogum", "pokal", "poker", "polar", "polen", "polig", "polio", "polis", "polit", "polka", "polle", "polyp", "popel", "poren", "porig", "porno", "porta", "porti", "porto", "porös", "posen", "posse", "power", "prado", "prall", "preis", "press", "priel", "priem", "prien", "pries", "prima", "prime", "prinz", "prior", "prise", "probe", "profi", "promi", "prosa", "prost", "protz", "proxy", "prunk", "pruth", "pruße", "prüde", "psalm", "pudel", "puder", "pulle", "pulli", "pulpe", "pumpe", "punkt", "puppe", "purim", "purin", "puter", "putin", "putte", "putto", "pylon", "pyren", "pyrit", "pyxis", "pöbel", "pötte", "püree", "quade", "qualm", "quant", "quark", "quart", "quarz", "quasi", "quast", "qubit", "queen", "quell", "quere", "quint", "quirl", "quito", "quitt", "quoll", "quota", "quote", "rabat", "rabbi", "rache", "radar", "radau", "radek", "radio", "radom", "radon", "ragen", "rahel", "rakel", "ralle", "rally", "ralph", "raman", "rambo", "rampe", "ranch", "randa", "rapid", "rappe", "rasch", "rasen", "raser", "rasse", "rasur", "raten", "ratio", "ratte", "rauch", "raudi", "rauen", "rauno", "raupe", "ravel", "raver", "rayon", "realo", "recht", "recto", "reden", "reede", "reell", "refus", "refüs", "regal", "regel", "regen", "regie", "regio", "rehau", "reich", "reihe", "reise", "reken", "rekto", "remis", "remus", "renal", "renke", "rente", "reset", "reuen", "reuig", "reuse", "reval", "revue", "rezat", "rheda", "rhede", "rhein", "rhema", "rhens", "rhode", "rhone", "richt", "ricke", "riege", "riehl", "rieke", "riesa", "riese", "riete", "rigid", "rilke", "rille", "rinde", "rings", "rinne", "rioja", "rippe", "rispe", "riten", "ritus", "robbe", "robin", "rodel", "roden", "rodeo", "rodin", "rogen", "roger", "rolex", "rolle", "rolli", "rollo", "roman", "romeo", "ronde", "rondo", "ronja", "rosen", "roses", "rosig", "rothe", "rotor", "rouge", "route", "rowdy", "rowno", "roxel", "royal", "rubel", "rubin", "rudau", "rudel", "ruden", "ruder", "rudow", "rufen", "rufer", "rugby", "ruhen", "ruhig", "ruhla", "rumba", "rumpf", "runde", "rupie", "rural", "russe", "ruwer", "rußen", "rußig", "rysum", "räder", "ränge", "ränke", "ränne", "räson", "räter", "rätst", "räude", "röcke", "röder", "röhre", "römer", "rösti", "röten", "röter", "rüber", "rügen", "rüpel", "rütli", "saale", "sache", "sachs", "sacht", "sadat", "sagan", "sagen", "sahel", "sahib", "sahne", "saint", "saite", "sakko", "salat", "salbe", "saldo", "salem", "salon", "salsa", "salto", "salut", "salve", "salär", "samba", "samen", "samoa", "samos", "sanaa", "sanft", "santa", "sanyo", "sarah", "sarde", "sarin", "satan", "satin", "satyr", "sauce", "saudi", "sauen", "sauer", "sauna", "sayda", "schad", "schaf", "schah", "schal", "scham", "schar", "schau", "scheu", "schia", "schmg", "schmu", "schob", "schog", "schon", "schor", "schoß", "schub", "schuf", "schuh", "schul", "schur", "schvg", "schön", "score", "seato", "sechs", "sedan", "seele", "segel", "segen", "segge", "sehen", "seher", "seide", "seife", "seiko", "seite", "selbe", "selen", "selig", "semit", "senat", "sende", "senil", "senne", "sense", "seoul", "serbe", "seren", "serie", "serin", "serom", "serum", "serös", "sesam", "setup", "sexte", "sexus", "shell", "shirt", "shoah", "sicht", "siech", "sieht", "siena", "sigel", "sigle", "sigma", "silan", "silbe", "silke", "silur", "simen", "simon", "sinai", "sinem", "sinti", "sinus", "sioux", "sippe", "sirup", "sisal", "sissi", "sitar", "sitin", "sitte", "sivas", "skala", "skalp", "skier", "skote", "skunk", "skype", "slawe", "smart", "snack", "snrna", "snrnp", "socke", "sodom", "soers", "soest", "sofia", "sogar", "sohle", "solar", "solch", "soldi", "solei", "solid", "solle", "solln", "solon", "somit", "somme", "sonar", "sonde", "sonja", "sonne", "sonor", "sonst", "sooft", "sorbe", "sorge", "sorte", "sotho", "sound", "sowie", "sozii", "soßen", "spalt", "spann", "spant", "sparc", "spatz", "speck", "speer", "spelz", "sperr", "spezi", "spiel", "spien", "spieß", "spike", "spind", "spion", "spitz", "split", "spore", "sporn", "sport", "spott", "spray", "spree", "spreu", "sprit", "spröd", "sprüh", "spule", "spund", "spurt", "spvgg", "späne", "späße", "squaw", "ssdna", "staat", "stabs", "stach", "stack", "stade", "stadt", "stahl", "stall", "stamm", "stand", "stank", "starb", "stark", "starr", "start", "stasi", "statt", "staub", "steak", "stech", "steck", "steif", "steig", "steil", "stein", "steiß", "stele", "stell", "stemm", "stent", "stern", "sterz", "stete", "stetl", "stets", "steve", "steyr", "stich", "stick", "stieg", "stiel", "stier", "stieß", "stift", "still", "stimm", "stirn", "stock", "stoff", "stola", "stolp", "stolz", "stoph", "stopp", "storm", "story", "straf", "straß", "streb", "streu", "strip", "stroh", "strom", "stube", "stuck", "studi", "stufe", "stuhl", "stuka", "stumm", "stunk", "stunt", "stupa", "stups", "stura", "sturm", "sturz", "stuss", "stute", "stvzo", "stäbe", "stöbe", "stößt", "stück", "stütz", "suade", "suche", "sucht", "sudan", "suebe", "suite", "sujet", "sulky", "sulla", "sumer", "summa", "summe", "sumpf", "super", "suppe", "surlv", "sushi", "svler", "swapo", "swing", "syene", "syker", "syrer", "szene", "säbel", "säcke", "säfte", "sägen", "sämig", "sänge", "sänke", "sänne", "särge", "sätze", "säuft", "säule", "säure", "söhne", "sören", "süden", "sühne", "sülze", "sünde", "süßen", "tabak", "tacho", "tadel", "tafel", "tagen", "tages", "taiga", "takel", "talar", "taler", "talon", "tamil", "tanga", "tango", "tanja", "tanne", "tante", "tapas", "tapet", "tapir", "tarif", "tarot", "tarse", "tasse", "taste", "tatar", "tatra", "tatze", "taube", "tauch", "tauen", "taufe", "taxen", "taxon", "taxus", "tbyte", "teddy", "teeny", "tegel", "teich", "teile", "teils", "teint", "telex", "tempo", "tenne", "tenor", "tesla", "tessa", "tetum", "teuer", "teufe", "texas", "texel", "thale", "thebe", "thein", "theke", "thema", "these", "theta", "thilo", "thing", "thiol", "thora", "thorn", "thron", "thule", "thurn", "tiara", "tiber", "tibet", "tieck", "tietz", "tiger", "tilde", "tilly", "timen", "times", "timor", "tinte", "tirol", "tisch", "titan", "titel", "titte", "titus", "toast", "tobak", "toben", "todes", "togen", "token", "tokio", "tommy", "tomsk", "tonal", "tondi", "tondo", "toner", "tonga", "tonig", "tonne", "tonno", "tonus", "topas", "topik", "topoi", "topos", "torso", "torte", "torus", "tosen", "toske", "total", "toten", "touch", "tough", "tower", "toxin", "trabi", "trafo", "trage", "trakl", "trakt", "trank", "traum", "traun", "traut", "trave", "treck", "treff", "treib", "trend", "trenn", "treue", "trias", "trick", "trieb", "trier", "trift", "trink", "trist", "tritt", "troia", "troja", "troll", "tropf", "tross", "trost", "trott", "trotz", "truhe", "trump", "trunk", "trupp", "trust", "träfe", "trägt", "träte", "tröge", "tubus", "tudor", "tuend", "tugba", "tukan", "tulpe", "tumba", "tumor", "tuner", "tunis", "tunte", "tupel", "turas", "turbo", "turin", "turku", "tusch", "tuten", "tutor", "tutsi", "tutti", "twist", "typen", "typhi", "typus", "tyrer", "tyros", "tyrus", "tzbfg", "täcks", "tägig", "täler", "tänze", "täsch", "täter", "tätig", "tönen", "tönis", "töpfe", "törin", "töten", "tücke", "türbe", "türke", "türme", "uartu", "ubier", "uchta", "udine", "udssr", "uedem", "ufern", "ufgau", "ulane", "ulken", "ulkig", "ulkus", "ulmer", "ulmet", "ultra", "umbau", "umbog", "umbra", "umgab", "umhat", "umher", "umhin", "umkam", "umlud", "umsah", "umtun", "umweg", "umzog", "umzug", "unart", "unfug", "ungar", "union", "unita", "unkel", "unken", "unmut", "unrat", "unruh", "unser", "unsre", "untat", "unten", "unter", "urahn", "uralt", "urban", "urbar", "urbau", "uriel", "urmel", "ursus", "urtyp", "uschi", "vaals", "vaasa", "vaduz", "valid", "valin", "varna", "varus", "vater", "vegan", "velar", "velen", "velin", "velum", "venen", "venlo", "venus", "venös", "verdi", "versa", "verve", "vespa", "vesuv", "vicht", "vichy", "video", "viert", "vigil", "vikar", "villa", "ville", "vinci", "vinyl", "viola", "viole", "viper", "viral", "viren", "viril", "virus", "vispa", "vista", "visum", "vital", "viten", "vitro", "vitus", "vlies", "vogel", "vogts", "voigt", "vokal", "volks", "volte", "volvo", "vorab", "voran", "vorig", "voten", "votum", "vulva", "vwvfg", "väter", "vögel", "vögte", "waadt", "waage", "wache", "wachs", "wacht", "waden", "wader", "waffe", "wagen", "wagon", "waise", "waldi", "walze", "walöl", "wanda", "wange", "wanne", "wanst", "wanze", "waran", "waren", "warft", "warna", "warte", "warum", "warze", "wasch", "wasen", "waten", "watte", "weben", "weber", "wedau", "wedel", "weder", "weert", "weeze", "wehen", "weich", "weide", "weihe", "weill", "weise", "weite", "weißt", "welch", "welle", "welpe", "wende", "wenig", "werbe", "werft", "werks", "werla", "werra", "werst", "werte", "wesel", "wesen", "weser", "wesir", "wespe", "weste", "wette", "weyer", "wicke", "wider", "wiehl", "wiese", "wieso", "wille", "willi", "willy", "wilna", "wilze", "wirbt", "wirft", "wirst", "wisch", "witwe", "wobei", "woche", "wodka", "wofür", "wogen", "woher", "wohin", "wolff", "wolfs", "wolga", "wolke", "wolle", "womit", "wonne", "woran", "worin", "worms", "worum", "wotan", "wovon", "wovor", "wrack", "wrang", "wuchs", "wucht", "wuhan", "wulff", "wulst", "wunde", "wurde", "wurst", "wusch", "wyker", "wägen", "wägte", "wände", "wären", "wäret", "wärme", "wölfe", "wörgl", "wörth", "wümme", "würde", "würfe", "würge", "wüste", "wüten", "xaver", "xenia", "xenie", "xenix", "xenon", "xerox", "xetra", "xhosa", "xylol", "yacht", "yahoo", "yogin", "ypern", "yucca", "yukon", "zacke", "zagen", "zaire", "zange", "zarge", "zarow", "zebra", "zeche", "zecke", "zeder", "zehnt", "zeige", "zeile", "zeiss", "zeitz", "zelle", "zelot", "zenit", "zeter", "zeven", "zewen", "zicke", "ziege", "ziest", "zilie", "zille", "zirbe", "zirka", "zitat", "zitze", "zivil", "zobel", "zonal", "zonen", "zorro", "zosse", "zotig", "zotte", "zubau", "zuber", "zucht", "zudem", "zugab", "zuger", "zugig", "zuhat", "zukam", "zumal", "zumaß", "zunft", "zunge", "zuruf", "zusah", "zutat", "zutun", "zuvor", "zuweg", "zuzog", "zuzug", "zwang", "zweck", "zweig", "zweit", "zwerg", "zwirn", "zwist", "zwölf", "zyste", "zähne", "zähre", "zäsur", "zäune", "zölle", "zölom", "zöpfe", "zügel", "zügig", "äcker", "äffen", "äffin", "ägide", "ägäis", "ähren", "älter", "ämter", "äneis", "äonen", "äpfel", "ärger", "ärmel", "ärmer", "ärzte", "äsche", "äther", "äthyl", "ätsch", "ätzen", "äugen", "öcher", "ödnis", "öfter", "özlem", "übach", "übrig", "üppig"];
const STORAGE_KEY = "wordle-cheat-de.custom-wordlist.v1";
const WORD_REGEX = /^[a-zäöüß]{5}$/u;
const FEEDBACK_LABELS = {
    unknown: "offen",
    absent: "grau",
    present: "gelb",
    correct: "grün",
};
const FEEDBACK_ORDER = ["unknown", "absent", "present", "correct"];
const KEYBOARD_ROWS = [
    ["q", "w", "e", "r", "t", "z", "u", "i", "o", "p", "ü"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l", "ö", "ä"],
    ["y", "x", "c", "v", "b", "n", "m", "ß"],
];
let activeWordList = [...DEFAULT_WORDS];
let activeWordListLabel = DEFAULT_WORD_SOURCE_NAME;
let activeWordListNote = DEFAULT_WORD_SOURCE_NOTE;
let customWordListActive = false;
let submittedGuesses = [];
let draftLetters = Array.from({ length: 5 }, () => "");
let draftFeedback = Array.from({ length: 5 }, () => "unknown");
let activeIndex = 0;
let nextGuessId = 1;
const app = document.querySelector("#app");
if (!app) {
    throw new Error("App root not found.");
}
app.innerHTML = `
  <div class="shell">
    <header class="hero">
      <div>
        <p class="eyebrow">Wordle-Helfer für Deutsch</p>
        <h1>5-Buchstaben-Cheat-Engine</h1>
        <p class="subtitle">Tippe ein Wort ein, markiere pro Feld grau/gelb/grün und lass dir sofort passende deutsche Kandidaten vorschlagen.</p>
      </div>
      <div class="hero-stats">
        <div class="hero-stat">
          <span class="hero-label">Geladene Wörter</span>
          <strong id="loaded-count">0</strong>
        </div>
        <div class="hero-stat">
          <span class="hero-label">Passende Kandidaten</span>
          <strong id="candidate-count">0</strong>
        </div>
      </div>
    </header>

    <section class="panel">
      <div class="panel-head">
        <h2>Wortliste</h2>
        <span class="badge" id="wordlist-badge">Standardliste</span>
      </div>
      <p class="muted" id="wordlist-meta"></p>
      <div class="wordlist-actions">
        <label class="file-button">
          <input id="wordlist-file" type="file" accept=".txt,.json,.dic" />
          Wortliste laden
        </label>
        <button id="restore-defaults" type="button" class="secondary">Standardliste wiederherstellen</button>
      </div>
      <p class="tiny">Akzeptiert JSON, Textdateien und Hunspell-<code>.dic</code>. Es bleiben nur Wörter mit exakt 5 Zeichen aus <code>a-z ä ö ü ß</code>.</p>
    </section>

    <section class="layout">
      <div class="column-main">
        <section class="panel">
          <div class="panel-head">
            <h2>Bereits gesetzte Tipps</h2>
          </div>
          <div id="submitted-rows" class="submitted-rows empty-state">Noch keine Tipps übernommen.</div>
        </section>

        <section class="panel">
          <div class="panel-head">
            <h2>Aktuelle Eingabe</h2>
            <span class="tiny">Wiederholte Buchstaben werden wie bei Wordle korrekt behandelt.</span>
          </div>
          <div id="editor-row" class="editor-row"></div>
          <div class="editor-actions">
            <button id="submit-guess" type="button">Tipp übernehmen</button>
            <button id="clear-row" type="button" class="secondary">Zeile leeren</button>
            <button id="undo-last" type="button" class="secondary">Letzten Tipp löschen</button>
            <button id="reset-all" type="button" class="secondary danger">Alles zurücksetzen</button>
          </div>
          <p id="hint" class="hint">Buchstaben per Tastatur oder Mausklick eingeben. Darunter pro Feld den Status auf grau, gelb oder grün setzen.</p>
        </section>

        <section class="panel">
          <div class="panel-head">
            <h2>Tastatur</h2>
            <span class="tiny">Enter übernimmt den Tipp, Backspace löscht.</span>
          </div>
          <div id="keyboard" class="keyboard"></div>
        </section>
      </div>

      <aside class="column-side">
        <section class="panel">
          <div class="panel-head">
            <h2>Beste Vorschläge</h2>
          </div>
          <ol id="suggestions" class="suggestions"></ol>
        </section>

        <section class="panel">
          <div class="panel-head">
            <h2>Kandidaten</h2>
            <span id="candidate-note" class="tiny"></span>
          </div>
          <div id="candidates" class="candidates"></div>
        </section>

        <section class="panel legend-panel">
          <div class="panel-head">
            <h2>Legende</h2>
          </div>
          <div class="legend-grid">
            <span class="legend-chip state-absent">grau</span>
            <p>Buchstabe kommt in der Lösung nicht vor.</p>
            <span class="legend-chip state-present">gelb</span>
            <p>Buchstabe kommt vor, aber an einer anderen Stelle.</p>
            <span class="legend-chip state-correct">grün</span>
            <p>Buchstabe steht an genau dieser Position.</p>
          </div>
        </section>
      </aside>
    </section>
  </div>
`;
const loadedCountEl = must("#loaded-count");
const candidateCountEl = must("#candidate-count");
const wordlistBadgeEl = must("#wordlist-badge");
const wordlistMetaEl = must("#wordlist-meta");
const fileInputEl = must("#wordlist-file");
const restoreDefaultsEl = must("#restore-defaults");
const submittedRowsEl = must("#submitted-rows");
const editorRowEl = must("#editor-row");
const submitGuessEl = must("#submit-guess");
const clearRowEl = must("#clear-row");
const undoLastEl = must("#undo-last");
const resetAllEl = must("#reset-all");
const hintEl = must("#hint");
const keyboardEl = must("#keyboard");
const suggestionsEl = must("#suggestions");
const candidatesEl = must("#candidates");
const candidateNoteEl = must("#candidate-note");
function must(selector) {
    const element = document.querySelector(selector);
    if (!element) {
        throw new Error(`Element not found: ${selector}`);
    }
    return element;
}
function normalizeLetter(input) {
    const letter = input.toLocaleLowerCase("de-DE");
    return /^[a-zäöüß]$/u.test(letter) ? letter : null;
}
function wordToLetters(word) {
    return Array.from(word);
}
function normalizeWord(raw) {
    const value = raw.trim().toLocaleLowerCase("de-DE");
    return WORD_REGEX.test(value) ? value : null;
}
function uniqueWords(words) {
    const unique = new Set();
    for (const raw of words) {
        const normalized = normalizeWord(raw);
        if (normalized) {
            unique.add(normalized);
        }
    }
    return Array.from(unique).sort((a, b) => a.localeCompare(b, "de"));
}
function extractWordsFromPlainText(text) {
    const words = [];
    for (const line of text.split(/\r?\n/u)) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) {
            continue;
        }
        if (/^\d+$/u.test(trimmed)) {
            continue;
        }
        const token = trimmed.split(/\s+/u)[0] ?? "";
        const cleaned = token.split("/")[0]?.split("\t")[0] ?? "";
        const normalized = normalizeWord(cleaned);
        if (normalized) {
            words.push(normalized);
        }
    }
    return words;
}
function parseImportedWordList(content) {
    const trimmed = content.trim();
    if (!trimmed) {
        return [];
    }
    if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
        try {
            const parsed = JSON.parse(trimmed);
            if (Array.isArray(parsed)) {
                return uniqueWords(parsed.filter((item) => typeof item === "string"));
            }
            if (parsed &&
                typeof parsed === "object" &&
                "words" in parsed &&
                Array.isArray(parsed.words)) {
                return uniqueWords(parsed.words.filter((item) => typeof item === "string"));
            }
        }
        catch {
            // Fall through to text parser.
        }
    }
    return uniqueWords(extractWordsFromPlainText(content));
}
function saveCustomWordList(words, label) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
            words,
            label,
            savedAt: new Date().toISOString(),
        }));
    }
    catch {
        // Ignore storage failures.
    }
}
function loadCustomWordList() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
            return;
        }
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed.words)) {
            return;
        }
        const cleaned = uniqueWords(parsed.words.filter((item) => typeof item === "string"));
        if (cleaned.length === 0) {
            return;
        }
        activeWordList = cleaned;
        activeWordListLabel = typeof parsed.label === "string" ? parsed.label : "Eigene Wortliste";
        activeWordListNote = CUSTOM_WORD_SOURCE_NOTE;
        customWordListActive = true;
    }
    catch {
        // Ignore malformed storage.
    }
}
function clearCustomWordList() {
    try {
        localStorage.removeItem(STORAGE_KEY);
    }
    catch {
        // Ignore storage failures.
    }
}
function cycleFeedback(current) {
    const index = FEEDBACK_ORDER.indexOf(current);
    return FEEDBACK_ORDER[(index + 1) % FEEDBACK_ORDER.length] ?? "unknown";
}
function feedbackRank(state) {
    switch (state) {
        case "correct":
            return 3;
        case "present":
            return 2;
        case "absent":
            return 1;
        default:
            return 0;
    }
}
function scoreGuess(guessLetters, answerLetters) {
    const result = Array.from({ length: 5 }, () => "absent");
    const remaining = new Map();
    for (let index = 0; index < 5; index += 1) {
        if (guessLetters[index] === answerLetters[index]) {
            result[index] = "correct";
        }
        else {
            const answerLetter = answerLetters[index] ?? "";
            remaining.set(answerLetter, (remaining.get(answerLetter) ?? 0) + 1);
        }
    }
    for (let index = 0; index < 5; index += 1) {
        if (result[index] === "correct") {
            continue;
        }
        const guessLetter = guessLetters[index] ?? "";
        const count = remaining.get(guessLetter) ?? 0;
        if (count > 0) {
            result[index] = "present";
            remaining.set(guessLetter, count - 1);
        }
    }
    return result;
}
function arraysEqual(left, right) {
    return left.length === right.length && left.every((item, index) => item === right[index]);
}
function getCandidates() {
    if (submittedGuesses.length === 0) {
        return [...activeWordList];
    }
    return activeWordList.filter((candidate) => {
        const answerLetters = wordToLetters(candidate);
        return submittedGuesses.every((entry) => arraysEqual(scoreGuess(entry.letters, answerLetters), entry.feedback));
    });
}
function rankCandidates(candidates) {
    const uniqueLetterFrequency = new Map();
    const positionFrequency = Array.from({ length: 5 }, () => new Map());
    for (const word of candidates) {
        const letters = wordToLetters(word);
        for (const letter of new Set(letters)) {
            uniqueLetterFrequency.set(letter, (uniqueLetterFrequency.get(letter) ?? 0) + 1);
        }
        letters.forEach((letter, index) => {
            const bucket = positionFrequency[index];
            bucket.set(letter, (bucket.get(letter) ?? 0) + 1);
        });
    }
    const diversityBonus = Math.max(1, Math.round(candidates.length / 40));
    return candidates
        .map((word) => {
        const letters = wordToLetters(word);
        const uniqueLetters = new Set(letters);
        let score = 0;
        uniqueLetters.forEach((letter) => {
            score += uniqueLetterFrequency.get(letter) ?? 0;
        });
        letters.forEach((letter, index) => {
            score += Math.round((positionFrequency[index].get(letter) ?? 0) * 0.35);
        });
        if (uniqueLetters.size === letters.length) {
            score += diversityBonus;
        }
        return { word, score };
    })
        .sort((left, right) => right.score - left.score || left.word.localeCompare(right.word, "de"));
}
function resetDraft() {
    draftLetters = Array.from({ length: 5 }, () => "");
    draftFeedback = Array.from({ length: 5 }, () => "unknown");
    activeIndex = 0;
}
function updateHint(message, tone = "default") {
    hintEl.textContent = message;
    hintEl.dataset.tone = tone;
}
function setLetter(letter) {
    const normalized = normalizeLetter(letter);
    if (!normalized) {
        return;
    }
    draftLetters[activeIndex] = normalized;
    if (draftFeedback[activeIndex] === "unknown") {
        draftFeedback[activeIndex] = "absent";
    }
    if (activeIndex < 4) {
        const nextEmpty = draftLetters.findIndex((entry, index) => index > activeIndex && entry === "");
        activeIndex = nextEmpty === -1 ? Math.min(activeIndex + 1, 4) : nextEmpty;
    }
    updateHint("Buchstabe gesetzt. Status darunter bei Bedarf auf grau, gelb oder grün umschalten.");
    render();
}
function backspace() {
    if (draftLetters[activeIndex]) {
        draftLetters[activeIndex] = "";
        draftFeedback[activeIndex] = "unknown";
        render();
        return;
    }
    const filledBefore = [...draftLetters.keys()].reverse().find((index) => index < activeIndex && draftLetters[index]);
    if (filledBefore !== undefined) {
        activeIndex = filledBefore;
        draftLetters[activeIndex] = "";
        draftFeedback[activeIndex] = "unknown";
        render();
    }
}
function setActiveIndex(index) {
    activeIndex = Math.max(0, Math.min(4, index));
    renderEditor();
}
function toggleFeedback(index) {
    if (!draftLetters[index]) {
        updateHint("Erst einen Buchstaben setzen, dann den Status markieren.", "warning");
        return;
    }
    draftFeedback[index] = cycleFeedback(draftFeedback[index]);
    render();
}
function removeGuess(id) {
    submittedGuesses = submittedGuesses.filter((entry) => entry.id !== id);
    render();
}
function undoLastGuess() {
    if (submittedGuesses.length === 0) {
        updateHint("Es gibt noch keinen übernommenen Tipp.", "warning");
        return;
    }
    submittedGuesses = submittedGuesses.slice(0, -1);
    updateHint("Der letzte Tipp wurde entfernt.", "success");
    render();
}
function canSubmitDraft() {
    return draftLetters.every(Boolean) && draftFeedback.every((state) => state !== "unknown");
}
function submitDraft() {
    if (!draftLetters.every(Boolean)) {
        updateHint("Bitte zuerst alle 5 Buchstaben setzen.", "warning");
        return;
    }
    if (draftFeedback.some((state) => state === "unknown")) {
        updateHint("Bitte für jedes Feld grau, gelb oder grün festlegen.", "warning");
        return;
    }
    const guess = draftLetters.join("");
    submittedGuesses = [
        ...submittedGuesses,
        {
            id: nextGuessId,
            guess,
            letters: [...draftLetters],
            feedback: [...draftFeedback],
        },
    ];
    nextGuessId += 1;
    resetDraft();
    updateHint(`Tipp „${guess}“ übernommen.`, "success");
    render();
}
async function readFileContents(file) {
    const buffer = await file.arrayBuffer();
    const isHunspell = file.name.toLocaleLowerCase("de-DE").endsWith(".dic");
    if (isHunspell) {
        return new TextDecoder("iso-8859-1").decode(buffer);
    }
    const utf8 = new TextDecoder("utf-8", { fatal: false }).decode(buffer);
    if (utf8.includes("�")) {
        return new TextDecoder("iso-8859-1").decode(buffer);
    }
    return utf8;
}
async function importWordList(file) {
    const content = await readFileContents(file);
    const cleaned = parseImportedWordList(content);
    if (cleaned.length === 0) {
        updateHint("In der Datei wurde keine gültige 5-Buchstaben-Liste gefunden.", "warning");
        return;
    }
    activeWordList = cleaned;
    activeWordListLabel = `${file.name} (${cleaned.length} Wörter)`;
    activeWordListNote = CUSTOM_WORD_SOURCE_NOTE;
    customWordListActive = true;
    submittedGuesses = [];
    resetDraft();
    saveCustomWordList(cleaned, activeWordListLabel);
    updateHint(`Eigene Wortliste geladen: ${cleaned.length} Wörter.`, "success");
    render();
}
function restoreDefaults() {
    activeWordList = [...DEFAULT_WORDS];
    activeWordListLabel = DEFAULT_WORD_SOURCE_NAME;
    activeWordListNote = DEFAULT_WORD_SOURCE_NOTE;
    customWordListActive = false;
    submittedGuesses = [];
    resetDraft();
    clearCustomWordList();
    updateHint("Standardliste wiederhergestellt.", "success");
    render();
}
function getKeyboardStates() {
    const states = new Map();
    for (const entry of submittedGuesses) {
        entry.letters.forEach((letter, index) => {
            const nextState = entry.feedback[index] ?? "unknown";
            const currentState = states.get(letter) ?? "unknown";
            if (feedbackRank(nextState) > feedbackRank(currentState)) {
                states.set(letter, nextState);
            }
        });
    }
    return states;
}
function renderSubmittedRows() {
    if (submittedGuesses.length === 0) {
        submittedRowsEl.className = "submitted-rows empty-state";
        submittedRowsEl.innerHTML = "Noch keine Tipps übernommen.";
        return;
    }
    submittedRowsEl.className = "submitted-rows";
    submittedRowsEl.innerHTML = submittedGuesses
        .map((entry) => `
        <div class="submitted-row" data-id="${entry.id}">
          <div class="submitted-tiles">
            ${entry.letters
        .map((letter, index) => `
                  <div class="tile tile-static state-${entry.feedback[index]}">
                    ${letter}
                  </div>`)
        .join("")}
          </div>
          <button type="button" class="icon-button remove-guess" data-remove-id="${entry.id}" aria-label="Tipp löschen">×</button>
        </div>
      `)
        .join("");
}
function renderEditor() {
    editorRowEl.innerHTML = draftLetters
        .map((letter, index) => {
        const feedback = draftFeedback[index];
        const tileClasses = ["tile", "tile-editable"];
        if (index === activeIndex)
            tileClasses.push("active");
        if (letter)
            tileClasses.push("filled");
        return `
        <div class="editor-cell">
          <button type="button" class="${tileClasses.join(" ")}" data-tile-index="${index}" aria-label="Feld ${index + 1}">
            ${letter || ""}
          </button>
          <button type="button" class="feedback-toggle state-${feedback}" data-feedback-index="${index}">
            ${FEEDBACK_LABELS[feedback]}
          </button>
        </div>
      `;
    })
        .join("");
    submitGuessEl.disabled = !canSubmitDraft();
    undoLastEl.disabled = submittedGuesses.length === 0;
}
function renderKeyboard() {
    const keyboardStates = getKeyboardStates();
    keyboardEl.innerHTML = KEYBOARD_ROWS.map((row) => {
        const keys = row
            .map((letter) => {
            const state = keyboardStates.get(letter) ?? "unknown";
            const isInDraft = draftLetters.includes(letter);
            const classes = ["key", `state-${state}`];
            if (isInDraft)
                classes.push("in-draft");
            return `<button type="button" class="${classes.join(" ")}" data-key="${letter}">${letter}</button>`;
        })
            .join("");
        return `<div class="key-row">${keys}</div>`;
    }).join("") + `
    <div class="key-row key-row-actions">
      <button type="button" class="key wide secondary" data-command="left">←</button>
      <button type="button" class="key wide secondary" data-command="backspace">⌫</button>
      <button type="button" class="key wide secondary" data-command="enter">Enter</button>
    </div>
  `;
}
function renderResults() {
    const candidates = getCandidates();
    const ranked = rankCandidates(candidates);
    loadedCountEl.textContent = String(activeWordList.length);
    candidateCountEl.textContent = String(candidates.length);
    wordlistBadgeEl.textContent = customWordListActive ? "Eigene Liste" : "Standardliste";
    wordlistMetaEl.textContent = `${activeWordListLabel}. ${activeWordListNote}`;
    suggestionsEl.innerHTML = ranked
        .slice(0, 20)
        .map((entry) => `<li><span>${entry.word}</span><strong>${entry.score}</strong></li>`)
        .join("");
    if (ranked.length === 0) {
        suggestionsEl.innerHTML = `<li class="empty-list">Keine Treffer. Entferne einen Tipp oder prüfe die gesetzten Farben.</li>`;
    }
    const shownCandidates = [...candidates].sort((a, b) => a.localeCompare(b, "de")).slice(0, 250);
    candidateNoteEl.textContent =
        candidates.length > shownCandidates.length ? `zeige ${shownCandidates.length} von ${candidates.length}` : `${candidates.length} insgesamt`;
    candidatesEl.innerHTML = shownCandidates.length
        ? shownCandidates.map((word) => `<span class="candidate-chip">${word}</span>`).join("")
        : `<p class="empty-list">Keine Kandidaten mehr übrig.</p>`;
}
function render() {
    renderSubmittedRows();
    renderEditor();
    renderKeyboard();
    renderResults();
}
fileInputEl.addEventListener("change", async (event) => {
    const target = event.currentTarget;
    const [file] = Array.from(target.files ?? []);
    if (!file) {
        return;
    }
    await importWordList(file);
    target.value = "";
});
restoreDefaultsEl.addEventListener("click", restoreDefaults);
submitGuessEl.addEventListener("click", submitDraft);
clearRowEl.addEventListener("click", () => {
    resetDraft();
    updateHint("Aktuelle Zeile geleert.", "success");
    render();
});
undoLastEl.addEventListener("click", undoLastGuess);
resetAllEl.addEventListener("click", () => {
    submittedGuesses = [];
    resetDraft();
    updateHint("Alle gesetzten Tipps wurden entfernt.", "success");
    render();
});
editorRowEl.addEventListener("click", (event) => {
    const target = event.target;
    const tileButton = target.closest("[data-tile-index]");
    if (tileButton) {
        setActiveIndex(Number(tileButton.dataset.tileIndex));
        return;
    }
    const feedbackButton = target.closest("[data-feedback-index]");
    if (feedbackButton) {
        toggleFeedback(Number(feedbackButton.dataset.feedbackIndex));
    }
});
submittedRowsEl.addEventListener("click", (event) => {
    const target = event.target;
    const removeButton = target.closest("[data-remove-id]");
    if (!removeButton) {
        return;
    }
    removeGuess(Number(removeButton.dataset.removeId));
});
keyboardEl.addEventListener("click", (event) => {
    const target = event.target;
    const keyButton = target.closest("[data-key]");
    if (keyButton) {
        const letter = keyButton.dataset.key;
        if (letter) {
            setLetter(letter);
        }
        return;
    }
    const commandButton = target.closest("[data-command]");
    const command = commandButton?.dataset.command;
    if (!command) {
        return;
    }
    if (command === "backspace") {
        backspace();
    }
    else if (command === "enter") {
        submitDraft();
    }
    else if (command === "left") {
        setActiveIndex(activeIndex === 0 ? 4 : activeIndex - 1);
    }
    render();
});
document.addEventListener("keydown", (event) => {
    if (event.metaKey || event.ctrlKey || event.altKey) {
        return;
    }
    const target = event.target;
    if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) {
        return;
    }
    if (event.key === "Backspace") {
        event.preventDefault();
        backspace();
        render();
        return;
    }
    if (event.key === "Enter") {
        event.preventDefault();
        submitDraft();
        return;
    }
    if (event.key === "ArrowLeft") {
        event.preventDefault();
        setActiveIndex(activeIndex === 0 ? 4 : activeIndex - 1);
        return;
    }
    if (event.key === "ArrowRight") {
        event.preventDefault();
        setActiveIndex(activeIndex === 4 ? 0 : activeIndex + 1);
        return;
    }
    if (event.key === "1" && draftLetters[activeIndex]) {
        draftFeedback[activeIndex] = "absent";
        render();
        return;
    }
    if (event.key === "2" && draftLetters[activeIndex]) {
        draftFeedback[activeIndex] = "present";
        render();
        return;
    }
    if (event.key === "3" && draftLetters[activeIndex]) {
        draftFeedback[activeIndex] = "correct";
        render();
        return;
    }
    const letter = normalizeLetter(event.key);
    if (letter) {
        event.preventDefault();
        setLetter(letter);
    }
});
loadCustomWordList();
updateHint("Standardliste geladen. Du kannst sofort loslegen oder eine eigene Liste importieren.");
render();
