import { Plant } from '../types';

export const PLANTS_DATA: Plant[] = [
  {
    id: "neem",
    name: "Neem",
    scientific_name: "Azadirachta indica",
    family: "Meliaceae",
    sanskrit_name: "Nimba / Arishta",
    common_names: ["Indian Lilac", "Margosa Tree", "Neem"],
    short_description: "A revered evergreen tree in Indian traditional medicine celebrated for its bitter bioactive triterpenoids and wide-spectrum antimicrobial, antifungal, and insecticidal properties.",
    botanical_characteristics: "Compound pinnate leaves with serrated (toothed) margins, curved leaflets, alternate arrangement, dark green upper surface and lighter underside.",
    parts_traditionally_used: [
      "Leaves (fresh and dried powder)",
      "Bark (twigs for oral hygiene)",
      "Seeds and Seed Oil",
      "Flowers"
    ],
    traditional_uses: [
      "Traditional topical application for skin disorders, acne, and minor cutaneous abrasions.",
      "Ethnomedicinal use of tender twigs as natural chew sticks ('Datun') for oral antimicrobial care and dental hygiene.",
      "Boiled leaf decoctions historically used for bathing to soothe seasonal rashes and insect bites.",
      "Traditional agricultural grain preservation and organic pest deterrence using dried foliage."
    ],
    traditional_preparations: [
      "Leaf Paste: Crushed fresh leaves applied topically to external skin blemishes.",
      "Herbal Decoction (Kashaya): Leaves simmered in water, cooled and strained for external wash.",
      "Neem Oil Infusion: Seed oil blended in carrier oil (coconut or sesame) for targeted scalp care."
    ],
    precautions: [
      "Internal ingestion of concentrated neem oil or strong extracts is contraindicated in infants and young children due to risk of toxic encephalopathy.",
      "May interact with oral hypoglycemic medications; individuals with diabetes should exercise caution.",
      "Traditional sources advise against high dosage internal consumption during pregnancy or preconception planning."
    ],
    key_phytochemicals: [
      "Azadirachtin",
      "Nimbin",
      "Nimbidol",
      "Quercetin",
      "Salannin"
    ],
    image_url: "/src/assets/images/plant_neem_1791811532944.jpg"
  },
  {
    id: "tulsi",
    name: "Tulsi",
    scientific_name: "Ocimum tenuiflorum",
    family: "Lamiaceae",
    sanskrit_name: "Tulasi / Vrinda",
    common_names: ["Holy Basil", "Queen of Herbs", "Tulsi"],
    short_description: "An aromatic perennial shrub held sacred across the Indian subcontinent, extensively used in Ayurveda as an adaptogenic tonic for respiratory health and stress mitigation.",
    botanical_characteristics: "Opposite decussate leaves, ovate with slightly dentate margins, prominent glandular trichomes secreting essential aromatic oils, purple or green stems.",
    parts_traditionally_used: [
      "Fresh and dried leaves",
      "Purple-tinged terminal inflorescences (flowering tops)",
      "Seeds (mucilaginous when soaked)",
      "Stems and root bark"
    ],
    traditional_uses: [
      "Traditional herbal teas (Kashayam) brewed with black pepper and ginger for seasonal cough, cold, and sore throat relief.",
      "Ethnomedicinal adaptogen traditionally consumed daily in the morning to foster mental clarity and vitality.",
      "Topical application of fresh crushed leaf juice for minor insect stings and ringworm.",
      "Chewing raw leaves traditionally practiced for freshening breath and maintaining oral freshness."
    ],
    traditional_preparations: [
      "Tulsi Chai: 5–8 fresh leaves infused in hot boiling water with honey or ginger.",
      "Fresh Leaf Swarasa: Freshly expressed leaf juice taken in modest quantities with honey.",
      "Poultice: Freshly bruised leaves applied directly onto insect bites."
    ],
    precautions: [
      "Tulsi possesses mild anti-platelet and blood-thinning properties; discontinue before planned surgical procedures.",
      "May enhance the effects of anti-coagulants and blood-sugar lowering agents.",
      "Excessive continuous intake without periodic breaks is not recommended in classical texts."
    ],
    key_phytochemicals: [
      "Eugenol",
      "Rosmarinic Acid",
      "Ursolic Acid",
      "Caryophyllene",
      "Linalool"
    ],
    image_url: "/src/assets/images/plant_tulsi_1791811543098.jpg"
  },
  {
    id: "aloe-vera",
    name: "Aloe Vera",
    scientific_name: "Aloe vera",
    family: "Asphodelaceae",
    sanskrit_name: "Ghritakumari",
    common_names: ["True Aloe", "Burn Plant", "Ghrita Kumari"],
    short_description: "A stemless or short-stemmed xerophytic succulent containing a dense inner mucilaginous gel renowned worldwide for dermatological soothing and tissue hydration.",
    botanical_characteristics: "Thick, fleshy, lanceolate leaves arranged in dense rosettes, serrated margins with firm whitish spines, transverse section reveals a clear inner parenchymal hydrogel.",
    parts_traditionally_used: [
      "Inner leaf parenchyma gel (aloe gel)",
      "Outer leaf exudate / yellow latex (aloe aloin - used with extreme caution)",
      "Whole leaf pulp"
    ],
    traditional_uses: [
      "Topical application of fresh mucilage to soothe superficial sun exposure, thermal irritation, and dry skin.",
      "Hair and scalp conditioning to relieve dry scalp flakes and maintain hair moisture.",
      "Ethnomedicinal cooling preparation in tropical heat when blended in diluted curd or fruit juice.",
      "Traditional wound surface hydration to maintain a moist tissue environment."
    ],
    traditional_preparations: [
      "Fresh Hydrogel: Cut leaf vertically, discard yellow latex rinse thoroughly, scoop clear gel for direct application.",
      "Hair Pack: Blended fresh gel mixed with coconut or castor oil applied 30 minutes before washing.",
      "Kumari Asava: Classical Ayurvedic fermented formulation incorporating Aloe vera juice."
    ],
    precautions: [
      "The yellow exudate (aloin/latex) contains potent anthraquinone laxatives that can cause severe abdominal cramping and electrolyte imbalance.",
      "Topical patch test is recommended before extensive facial use to rule out contact dermatitis.",
      "Unpurified latex is contraindicated during pregnancy due to uterine stimulating risks."
    ],
    key_phytochemicals: [
      "Acemannan",
      "Aloin (in latex)",
      "Barbaloin",
      "Gibberellins",
      "Bradykinase"
    ],
    image_url: "/src/assets/images/plant_aloe_1791811555544.jpg"
  },
  {
    id: "moringa",
    name: "Moringa",
    scientific_name: "Moringa oleifera",
    family: "Moringaceae",
    sanskrit_name: "Shigru / Shobhanjana",
    common_names: ["Drumstick Tree", "Horseradish Tree", "Miracle Tree"],
    short_description: "A fast-growing, drought-resistant tree widely acknowledged as a nutrient-dense botanical powerhouse loaded with vitamins, minerals, essential amino acids, and polyphenols.",
    botanical_characteristics: "Tripinnate compound leaves with tiny obovate or elliptic leaflets (1–2 cm), tender green, delicate petiolules, easily detached upon drying.",
    parts_traditionally_used: [
      "Tender compound leaves",
      "Immature seed pods ('drumsticks')",
      "Seeds (and seed oil / Ben oil)",
      "Root bark and flowers"
    ],
    traditional_uses: [
      "Culinary and dietary incorporation in Indian lentils (dal/sambar) for maternal and postpartum nutritional reinforcement.",
      "Ethnomedicinal tonic for joint stiffness and traditional support for healthy joint mobility.",
      "Warm leaf poultice applied traditionally to swelling and inflammatory joint discomfort.",
      "Dried powdered leaves taken as an energizing daily micronutrient supplement."
    ],
    traditional_preparations: [
      "Moringa Leaf Stir-fry: Tender leaves lightly sautéed with garlic, cumin, and grated coconut.",
      "Dried Leaf Powder: Shade-dried leaves ground into fine powder and stirred into warm water or buttermilk.",
      "Seed Clarification: Traditional crushed seeds historically utilized to clarify turbid pond water."
    ],
    precautions: [
      "High amounts of root bark contain spirochin alkaloid which has neuro-paralytic properties; consume leaves/pods only.",
      "May lower blood pressure and blood sugar; monitor parameters if taking prescription antihypertensives.",
      "Overconsumption of raw leaves may produce mild gastrointestinal laxation."
    ],
    key_phytochemicals: [
      "Moringine",
      "Quercetin-3-glucoside",
      "Chlorogenic Acid",
      "Isothiocyanates",
      "Beta-carotene"
    ],
    image_url: "/src/assets/images/plant_moringa_1791811566918.jpg"
  },
  {
    id: "guava",
    name: "Guava",
    scientific_name: "Psidium guajava",
    family: "Myrtaceae",
    sanskrit_name: "Amrud / Peruka",
    common_names: ["Guava", "Apple Guava", "Amrood"],
    short_description: "A tropical fruit tree whose aromatic leaves are rich in astringent tannins, triterpenes, and flavonoids traditionally utilized for gastrointestinal comfort and oral rinse.",
    botanical_characteristics: "Opposite, elliptic to oblong leaves with prominent pinnate venation raised on the underside, aromatic when crushed, short petioles.",
    parts_traditionally_used: [
      "Tender young leaves and leaf buds",
      "Unripe and ripe fruit",
      "Stem bark"
    ],
    traditional_uses: [
      "Ethnomedicinal decoction of tender young leaves traditionally drunk for acute watery diarrhea and digestive cramping.",
      "Chewing fresh tender leaf buds as a traditional remedy for toothache and bleeding gingival tissues.",
      "Astringent mouthwash prepared by boiling leaves to relieve aphthous ulcers (canker sores).",
      "Traditional topical skin wash for cleansing superficial abrasions."
    ],
    traditional_preparations: [
      "Guava Leaf Decoction: 5–6 fresh tender leaves boiled in 2 cups of water until reduced by half, strained, and sipped warm.",
      "Oral Gargle: Leaf water with a pinch of rock salt used 3 times daily for sore throat or gum sensitivity.",
      "Crushed Bud Poultice: Soft tender buds macerated and placed against tooth cavities."
    ],
    precautions: [
      "High tannin content may cause constipation if consumed continuously in large amounts.",
      "May cause mild stomach upset in individuals with sensitive gastric mucosa if consumed on an empty stomach.",
      "Should not substitute for oral rehydration salts (ORS) in severe pediatric dehydration."
    ],
    key_phytochemicals: [
      "Guajaverin",
      "Quercetin",
      "Ellagic Acid",
      "Caryophyllene",
      "Avicularin"
    ],
    image_url: "/src/assets/images/plant_guava_1791962831668.jpg"
  },
  {
    id: "curry-leaf",
    name: "Curry Leaf",
    scientific_name: "Murraya koenigii",
    family: "Rutaceae",
    sanskrit_name: "Kaidarya / Surabhinimba",
    common_names: ["Sweet Neem", "Kadi Patta", "Karivepaku"],
    short_description: "An indispensable aromatic culinary herb native to the Indian subcontinent containing unique carbazole alkaloids praised for digestive stimulation, hair health, and lipid balance.",
    botanical_characteristics: "Pinnate leaves with 11–21 ovate-lanceolate leaflets, oblique (asymmetrical) base, finely serrulate margins, highly aromatic with pungent citrusy undertones.",
    parts_traditionally_used: [
      "Fresh glossy green leaves",
      "Tender stalks",
      "Stem bark and roots (classical ethnomedicine)"
    ],
    traditional_uses: [
      "Culinary tempering (tadka) in hot ghee or oil to enhance digestive fire (Deepana/Pachana) and food bioavailability.",
      "Traditional hair tonic: leaves simmered in virgin coconut oil to prevent premature graying and fortify hair follicles.",
      "Morning intake of fresh leaves chewed raw to aid healthy glucose metabolism and lipid digestion.",
      "Traditional home remedy for morning nausea, dysentery, and indigestion."
    ],
    traditional_preparations: [
      "Curry Leaf Hair Oil: Handful of leaves boiled in coconut oil until blackened, strained, and massaged into scalp weekly.",
      "Buttermilk Blend: 8–10 leaves crushed into fresh spiced buttermilk (Chaas/Majjiga) with cumin and ginger.",
      "Podi / Chutney: Roasted curry leaves ground with lentils and spices as an everyday functional culinary condiment."
    ],
    precautions: [
      "Extremely safe in dietary quantities; avoid excessive whole raw seed ingestion.",
      "Ensure leaves are thoroughly washed to eliminate pesticide residues common on commercially farmed produce.",
      "Rare contact allergic reaction reported among highly sensitive individuals handling raw essential oils."
    ],
    key_phytochemicals: [
      "Koenimbine",
      "Mahanimbine",
      "Girimbine",
      "Alpha-pinene",
      "Beta-caryophyllene"
    ],
    image_url: "/src/assets/images/plant_curry_1791962870587.jpg"
  },
  {
    id: "mint",
    name: "Mint",
    scientific_name: "Mentha",
    family: "Lamiaceae",
    sanskrit_name: "Pudina",
    common_names: ["Peppermint", "Spearmint", "Pudina"],
    short_description: "A refreshingly aromatic perennial herb enriched with natural menthol that exerts cooling carminative, antispasmodic, and olfactory clarifying effects on the human body.",
    botanical_characteristics: "Opposite pairing leaves, ovate-lanceolate with sharply serrated margins, square square-shaped stem (quadrangular), intense volatile cooling aroma upon tactile rubbing.",
    parts_traditionally_used: [
      "Fresh leaves and tender shoot stems",
      "Dried leaf flakes",
      "Distilled volatile essential oil (menthol extract)"
    ],
    traditional_uses: [
      "Traditional digestive carminative for bloating, flatulence, and post-prandial heaviness.",
      "Ethnomedicinal hot tea consumed for relief of seasonal nasal congestion, tension headache, and throat scratchiness.",
      "Crushed leaf paste applied to temples for a cooling, soothing distraction from tension headaches.",
      "Traditional culinary cooling chutney consumed in hot summer seasons to reduce body heat."
    ],
    traditional_preparations: [
      "Pudina Chutney: Fresh mint and coriander leaves blended with green chili, lemon juice, and roasted cumin.",
      "Mint Infusion Tea: 8–10 bruised leaves steeped in freshly boiled water for 6 minutes, enjoyed warm.",
      "Steam Inhalation: Handful of fresh leaves added to hot water bowl for inhaling clearing vapors."
    ],
    precautions: [
      "May relax the lower esophageal sphincter and exacerbate symptoms of gastroesophageal reflux disease (GERD) or heartburn.",
      "Pure concentrated menthol oil should never be applied near the nostrils or face of infants due to risk of laryngospasm.",
      "Persons with symptomatic gallstones should consult their physician before therapeutic doses."
    ],
    key_phytochemicals: [
      "Menthol",
      "Menthone",
      "Limonene",
      "Menthofuran",
      "Rosmarinic Acid"
    ],
    image_url: "/src/assets/images/plant_mint_1791962910921.jpg"
  },
  {
    id: "hibiscus",
    name: "Hibiscus",
    scientific_name: "Hibiscus rosa-sinensis",
    family: "Malvaceae",
    sanskrit_name: "Japa Pushpa",
    common_names: ["China Rose", "Shoeblack Plant", "Gudhal"],
    short_description: "A radiant tropical flowering shrub celebrated in traditional systems for mucilaginous conditioning of hair, soothing mucosal membranes, and antioxidant polyphenols.",
    botanical_characteristics: "Alternate ovate leaves with coarsely serrate margins, glossy deep green surface, prominent large solitary flowers with a distinctive elongated staminal column.",
    parts_traditionally_used: [
      "Fresh and dried flower petals",
      "Glossy leaves (mucilage rich)",
      "Root bark (classical preparations)"
    ],
    traditional_uses: [
      "Traditional hair cleanser and conditioner: leaves crushed with water yield natural saponin-rich lather.",
      "Herbal flower tea enjoyed chilled or warm to support natural cardiovascular balance and urinary tract health.",
      "Infused floral hair oils applied to foster scalp cooling and preserve natural deep hair color.",
      "Folk remedy poultices applied to soothe superficial boils and swelling."
    ],
    traditional_preparations: [
      "Hibiscus Shampoo Gel: Fresh leaves and 2 flowers ground with little water into a thick mucilaginous paste for hair wash.",
      "Japa Taila: Red hibiscus flowers simmered slowly in virgin coconut oil until dehydrated, strained for scalp use.",
      "Flower Tisane: Dried petals infused in boiling water with a cinnamon stick and lemon slice."
    ],
    precautions: [
      "Large therapeutic doses of hibiscus flowers may exert emmenagogue effects; avoid medicinal concentrations during pregnancy.",
      "Can interact with antihypertensive medications and diuretics due to mild hypotensive actions.",
      "Always confirm absence of pesticide sprays if harvesting urban ornamental garden bushes."
    ],
    key_phytochemicals: [
      "Anthocyanins (Cyanidin-3-glucoside)",
      "Hibiscic Acid",
      "Quercetin",
      "Pectin / Mucilages",
      "Ascorbic Acid"
    ],
    image_url: "/src/assets/images/plant_hibiscus_1791962959473.jpg"
  },
  {
    id: "eucalyptus",
    name: "Eucalyptus",
    scientific_name: "Eucalyptus",
    family: "Myrtaceae",
    sanskrit_name: "Nilgiri / Tailapatra",
    common_names: ["Nilgiri", "Tasmanian Blue Gum", "Eucalyptus"],
    short_description: "A towering aromatic evergreen tree yielding potent cineole-rich volatile oils traditionally utilized across global ethnobotany for bronchodilation and topical muscle relief.",
    botanical_characteristics: "Dimorphic foliage: juvenile leaves opposite and rounded, mature adult leaves alternate, falcate (sickle-shaped), leathery, with visible translucent oil glands.",
    parts_traditionally_used: [
      "Mature sickle-shaped leaves",
      "Steam-distilled essential oil (Nilgiri oil)",
      "Tree bark"
    ],
    traditional_uses: [
      "Steam inhalation with bruised leaves or oil drops for clearing blocked paranasal sinuses and bronchial pathways.",
      "Diluted oil rubs traditionally massaged into temples, neck, and chest for soothing tension and easing chest tightness.",
      "Traditional topical liniment for sore joints, sprains, and back stiffness.",
      "Natural insect and mosquito repellent room fumigant."
    ],
    traditional_preparations: [
      "Steam Bath: 3–4 mature leaves boiled in water, towel draped over head while breathing steam for 5 minutes.",
      "Chest Rub: 2–3 drops of eucalyptus oil blended with 1 tablespoon of warm mustard or sesame oil.",
      "Vapor Inhaler: Crushed dry leaf pouch kept near bedside during seasonal flu episodes."
    ],
    precautions: [
      "Pure undiluted eucalyptus essential oil is TOXIC if swallowed; keep strictly out of reach of children.",
      "Never apply directly to the nostrils, face, or chest of infants and toddlers due to risk of airway spasm.",
      "May trigger bronchospasm in individuals with severe unstable asthma if inhaled at strong concentrations."
    ],
    key_phytochemicals: [
      "1,8-Cineole (Eucalyptol)",
      "Alpha-terpineol",
      "Globulol",
      "Pinene",
      "Limonene"
    ],
    image_url: "/src/assets/images/plant_eucalyptus_1791962774353.jpg"
  },
  {
    id: "ashoka",
    name: "Ashoka",
    scientific_name: "Saraca asoca",
    family: "Fabaceae",
    sanskrit_name: "Ashoka ('Sorrow-less')",
    common_names: ["Sita Ashok", "Ashoka Tree", "Sacred Ashoka"],
    short_description: "A revered sacred rainforest tree in Indian ethnobotany and classical Ayurveda, whose bark and foliage are traditionally documented for women's reproductive health and tissue harmony.",
    botanical_characteristics: "Paripinnate compound leaves with 4–6 pairs of oblong-lanceolate leaflets, drooping flaccid copper-pink when young turning deep green, dense corymbose orange-red flowers.",
    parts_traditionally_used: [
      "Stem bark (primary therapeutic part in classical texts)",
      "Dried flowers",
      "Leaves and seeds"
    ],
    traditional_uses: [
      "Cornerstone herb of classical Ayurvedic gynecology (Ashokarishta) for balancing menstrual rhythm and uterine tone.",
      "Traditional astringent and anti-inflammatory support for uterine mucosal harmony.",
      "Decoctions utilized in traditional dermatology for complex skin blemishes and soothing inflammatory sensations.",
      "Ethnomedicinal use of flowers for cooling internal body heat and digestive dysentery."
    ],
    traditional_preparations: [
      "Ashokarishta: Renowned fermented Ayurvedic formulation prepared with Ashoka bark, jaggery, and supportive herbs.",
      "Bark Kshirapaka: Bark simmered slowly in milk and water until water evaporates, strained and taken according to classical advice.",
      "Herbal Decoction (Kashaya): Crushed dried bark boiled in water, reduced to one quarter, strained and cooled."
    ],
    precautions: [
      "Commercial adulteration is prevalent: true Saraca asoca is frequently substituted with Polyalthia longifolia (False Ashoka/Mast tree) which lacks the identical therapeutic profile.",
      "Use under certified Ayurvedic physician guidance, especially in conditions requiring hormonal monitoring.",
      "Contraindicated during active pregnancy unless specifically prescribed by an authorized practitioner."
    ],
    key_phytochemicals: [
      "Saracin",
      "Epicatechin",
      "Catechin",
      "Tannins",
      "Beta-sitosterol"
    ],
    image_url: "/src/assets/images/plant_ashoka_1791962801495.jpg"
  }
];

export const SAMPLE_TEST_LEAVES = [
  {
    name: "Neem Specimen",
    plant: "Neem",
    fileUrl: "/src/assets/images/plant_neem_1791811532944.jpg",
    scientific: "Azadirachta indica",
    hint: "Serrated compound leaf"
  },
  {
    name: "Tulsi Specimen",
    plant: "Tulsi",
    fileUrl: "/src/assets/images/plant_tulsi_1791811543098.jpg",
    scientific: "Ocimum tenuiflorum",
    hint: "Aromatic holy basil foliage"
  },
  {
    name: "Aloe Vera Specimen",
    plant: "Aloe Vera",
    fileUrl: "/src/assets/images/plant_aloe_1791811555544.jpg",
    scientific: "Aloe vera",
    hint: "Succulent gel cross-section"
  },
  {
    name: "Moringa Specimen",
    plant: "Moringa",
    fileUrl: "/src/assets/images/plant_moringa_1791811566918.jpg",
    scientific: "Moringa oleifera",
    hint: "Tripinnate leaflet structure"
  },
  {
    name: "Guava Specimen",
    plant: "Guava",
    fileUrl: "/src/assets/images/plant_guava_1791962831668.jpg",
    scientific: "Psidium guajava",
    hint: "Prominent pinnate veins"
  },
  {
    name: "Curry Leaf Specimen",
    plant: "Curry Leaf",
    fileUrl: "/src/assets/images/plant_curry_1791962870587.jpg",
    scientific: "Murraya koenigii",
    hint: "Asymmetric aromatic foliage"
  },
  {
    name: "Mint Specimen",
    plant: "Mint",
    fileUrl: "/src/assets/images/plant_mint_1791962910921.jpg",
    scientific: "Mentha",
    hint: "Serrated aromatic menthol leaf"
  },
  {
    name: "Hibiscus Specimen",
    plant: "Hibiscus",
    fileUrl: "/src/assets/images/plant_hibiscus_1791962959473.jpg",
    scientific: "Hibiscus rosa-sinensis",
    hint: "Ovate serrated leaf & flower"
  },
  {
    name: "Eucalyptus Specimen",
    plant: "Eucalyptus",
    fileUrl: "/src/assets/images/plant_eucalyptus_1791962774353.jpg",
    scientific: "Eucalyptus",
    hint: "Falcate sickle-shaped leaf"
  },
  {
    name: "Ashoka Specimen",
    plant: "Ashoka",
    fileUrl: "/src/assets/images/plant_ashoka_1791962801495.jpg",
    scientific: "Saraca asoca",
    hint: "Paripinnate compound foliage"
  }
];
