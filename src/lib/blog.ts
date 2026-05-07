export interface BlogPost {
  slug: string
  lang: 'en' | 'mr'
  title: string
  metaTitle: string
  metaDescription: string
  publishedAt: string
  updatedAt: string
  readingTime: string
  excerpt: string
  content: string
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'bhade-karar-namuna-maharashtra-2026',
    lang: 'mr',
    title: 'भाडे करार नमुना महाराष्ट्र २०२६ — संपूर्ण माहिती',
    metaTitle: 'भाडे करार नमुना महाराष्ट्र २०२६ | मुद्रांकसेवा',
    metaDescription: 'महाराष्ट्रात भाडे करार कसा करावा, कोणते मुद्दे असावेत, स्टँप ड्युटी किती लागते — सर्व माहिती मराठीत.',
    publishedAt: '2026-01-15',
    updatedAt: '2026-01-15',
    readingTime: '५ मिनिटे',
    excerpt: 'महाराष्ट्रात भाडे करार करताना कोणते मुद्दे असणे आवश्यक आहे, स्टँप ड्युटी किती लागते आणि नोंदणी कशी करावी याची संपूर्ण माहिती.',
    content: `
## भाडे करार म्हणजे काय?

भाडे करार (Leave and Licence Agreement) हा मालक आणि भाडेकरू यांच्यातील कायदेशीर करार आहे. महाराष्ट्रात हा करार महाराष्ट्र भाडे नियंत्रण अधिनियम, १९९९ अंतर्गत येतो.

## भाडे करारात कोणते मुद्दे असावेत?

एक चांगला भाडे करार खालील मुद्दे समाविष्ट करतो:

- **मालकाचे आणि भाडेकरूचे पूर्ण नाव व पत्ता**
- **मालमत्तेचा संपूर्ण पत्ता** — मजला, फ्लॅट नंबर, सोसायटीचे नाव
- **भाड्याची रक्कम** — मासिक भाडे आणि डिपॉझिट
- **कराराचा कालावधी** — सहसा ११ महिने
- **नोटीस कालावधी** — किती दिवस आधे नोटीस द्यायची
- **देखभाल खर्च** — कोण भरणार
- **पाळीव प्राणी, पार्किंग** यांबाबत अटी

## स्टँप ड्युटी किती लागते?

महाराष्ट्रात ११ महिन्यांच्या भाडे करारावर **₹१०० स्टँप ड्युटी** लागते. १२ महिने किंवा त्यापेक्षा जास्त कालावधीसाठी स्टँप ड्युटी वेगळ्या पद्धतीने मोजली जाते.

| कालावधी | स्टँप ड्युटी |
|---------|-------------|
| ११ महिने | ₹१०० |
| १२ ते ६० महिने | भाड्याच्या २% |
| ६० महिन्यांपेक्षा जास्त | भाड्याच्या ३% |

## नोंदणी आवश्यक आहे का?

११ महिन्यांपर्यंतच्या कराराची नोंदणी ऐच्छिक आहे, परंतु **नोंदणीकृत करार अधिक कायदेशीर संरक्षण देतो**. १२ महिने किंवा त्यापेक्षा जास्त कालावधीसाठी SRO मध्ये नोंदणी अनिवार्य आहे.

## ऑनलाइन भाडे करार कसा करावा?

मुद्रांकसेवावर भाडे करार करणे अत्यंत सोपे आहे:

१. वेबसाइटवर जा आणि तपशील भरा
२. AI-आधारित करार तयार होतो
३. ₹२९९ ऑनलाइन पेमेंट करा
४. PDF डाउनलोड करा

घरपोच नोंदणी सेवाही उपलब्ध आहे — आमचा प्रतिनिधी तुमच्या घरी येतो आणि बायोमेट्रिक नोंदणी पूर्ण करतो.
    `.trim(),
  },
  {
    slug: 'stamp-duty-maharashtra-2026',
    lang: 'mr',
    title: 'स्टँप ड्युटी महाराष्ट्र २०२६ — दर, गणना आणि सूट',
    metaTitle: 'स्टँप ड्युटी महाराष्ट्र २०२६ — संपूर्ण माहिती | मुद्रांकसेवा',
    metaDescription: 'महाराष्ट्रात मालमत्ता खरेदीवर स्टँप ड्युटी किती लागते, कशी मोजावी, महिलांना सूट आहे का — सर्व माहिती २०२६.',
    publishedAt: '2026-01-20',
    updatedAt: '2026-01-20',
    readingTime: '६ मिनिटे',
    excerpt: 'महाराष्ट्रात मालमत्ता खरेदी करताना स्टँप ड्युटी किती लागते, रेडी रेकनर दर काय आहे, आणि महिलांना किती सूट मिळते याची संपूर्ण माहिती.',
    content: `
## स्टँप ड्युटी म्हणजे काय?

स्टँप ड्युटी हा राज्य सरकारला दिला जाणारा कर आहे जो मालमत्ता हस्तांतरणाच्या वेळी भरावा लागतो. महाराष्ट्र मुद्रांक अधिनियमांतर्गत हा कर आकारला जातो.

## महाराष्ट्रात स्टँप ड्युटीचे दर २०२६

| मालमत्तेचा प्रकार | दर |
|----------------|-----|
| महानगरपालिका क्षेत्र | ५% |
| ग्रामीण क्षेत्र | ४% |
| महिलांच्या नावावर (शहरी) | ४% |
| महिलांच्या नावावर (ग्रामीण) | ३% |

याशिवाय **१% नोंदणी शुल्क** (कमाल ₹३०,०००) वेगळे भरावे लागते.

## रेडी रेकनर दर म्हणजे काय?

रेडी रेकनर दर (किंवा सर्कल रेट) हा महाराष्ट्र सरकारने प्रत्येक भागासाठी ठरवलेला किमान मूल्य आहे. स्टँप ड्युटी या दरापेक्षा कमी मूल्यावर मोजता येत नाही.

उदाहरण: पुण्यातील कोथरूडमध्ये रेडी रेकनर दर ₹८,५०० प्रति चौरस फूट आहे. जर तुम्ही ५०० चौरस फुटाचे घर ₹३५ लाखांना खरेदी केले, परंतु रेडी रेकनर मूल्य ₹४२.५ लाख असेल, तर स्टँप ड्युटी ₹४२.५ लाखांवर मोजली जाईल.

## स्टँप ड्युटी कशी मोजावी?

**उदाहरण:**
- मालमत्तेचे मूल्य: ₹५० लाख
- क्षेत्र: पुणे महानगरपालिका
- स्टँप ड्युटी दर: ५%
- **स्टँप ड्युटी: ₹२.५ लाख**
- नोंदणी शुल्क: ₹३०,००० (कमाल)
- **एकूण: ₹२.८ लाख**

मुद्रांकसेवाचा [स्टँप ड्युटी कॅल्क्युलेटर](/calculator) वापरून तुम्ही आपली अचूक स्टँप ड्युटी मोजू शकता.

## स्टँप ड्युटी कुठे भरावी?

स्टँप ड्युटी महाराष्ट्र सरकारच्या GRAS पोर्टलवर ऑनलाइन भरता येते. मुद्रांकसेवा नोंदणी प्रक्रियेत हे आपोआप हाताळते.
    `.trim(),
  },
  {
    slug: 'malmatat-nondani-kashi-karavi-maharashtra-2026',
    lang: 'mr',
    title: 'मालमत्ता नोंदणी कशी करावी महाराष्ट्र २०२६ — संपूर्ण प्रक्रिया',
    metaTitle: 'मालमत्ता नोंदणी कशी करावी महाराष्ट्र २०२६ | मुद्रांकसेवा',
    metaDescription: 'महाराष्ट्रात मालमत्ता नोंदणी कशी करावी, कोणती कागदपत्रे लागतात, किती खर्च येतो — संपूर्ण प्रक्रिया मराठीत.',
    publishedAt: '2026-02-01',
    updatedAt: '2026-02-01',
    readingTime: '७ मिनिटे',
    excerpt: 'महाराष्ट्रात मालमत्ता नोंदणी करण्यासाठी कोणती कागदपत्रे लागतात, SRO मध्ये काय प्रक्रिया आहे आणि घरबसल्या नोंदणी कशी करावी याची माहिती.',
    content: `
## मालमत्ता नोंदणी का आवश्यक आहे?

महाराष्ट्रात मालमत्ता नोंदणी नोंदणी अधिनियम, १९०८ अंतर्गत अनिवार्य आहे. नोंदणी न केल्यास मालमत्तेवर कायदेशीर हक्क सिद्ध करता येत नाही.

## नोंदणीसाठी आवश्यक कागदपत्रे

**विक्रेत्याची कागदपत्रे:**
- आधार कार्ड व PAN कार्ड
- मालमत्तेचे मागील खरेदी दस्तऐवज
- ७/१२ उतारा किंवा प्रॉपर्टी कार्ड
- सोसायटी NOC (लागू असल्यास)
- मालमत्ता कर पावती

**खरेदीदाराची कागदपत्रे:**
- आधार कार्ड व PAN कार्ड
- पासपोर्ट फोटो (२ प्रती)

## नोंदणी प्रक्रिया — टप्पेवार

**टप्पा १: दस्तऐवज तयार करणे**
विक्री करार (Sale Deed) तयार करणे. मुद्रांकसेवा हे AI-आधारित पद्धतीने करते.

**टप्पा २: स्टँप ड्युटी भरणे**
मालमत्तेच्या मूल्यानुसार स्टँप ड्युटी GRAS पोर्टलवर ऑनलाइन भरावी.

**टप्पा ३: SRO मध्ये भेट**
दोन्ही पक्षांनी Sub-Registrar Office (SRO) मध्ये उपस्थित राहून बायोमेट्रिक नोंदणी करावी.

**टप्पा ४: नोंदणी पूर्ण**
नोंदणी झाल्यावर नोंदणीकृत दस्तऐवज मिळतो जो मालमत्तेवरील हक्काचा पुरावा आहे.

## घरपोच नोंदणी सेवा

SRO ला भेट देणे शक्य नसल्यास मुद्रांकसेवाची [घरपोच नोंदणी सेवा](/doorstep-registration) वापरा. आमचा प्रतिनिधी तुमच्या घरी येतो, बायोमेट्रिक घेतो आणि नोंदणी पूर्ण करतो. सध्या पुणे व पिंपरी-चिंचवडमध्ये उपलब्ध.

## किती खर्च येतो?

- स्टँप ड्युटी: मालमत्ता मूल्याच्या ४–५%
- नोंदणी शुल्क: १% (कमाल ₹३०,०००)
- मुद्रांकसेवा सेवा शुल्क: सानुकूल

अचूक खर्च जाणून घेण्यासाठी आमचा [स्टँप ड्युटी कॅल्क्युलेटर](/calculator) वापरा.
    `.trim(),
  },
  {
    slug: 'rent-agreement-rules-maharashtra-2026',
    lang: 'en',
    title: 'Rent Agreement Rules in Maharashtra 2026 — Complete Guide',
    metaTitle: 'Rent Agreement Rules Maharashtra 2026 | Mudrankseva',
    metaDescription: 'Complete guide to rent agreement rules in Maharashtra 2026. Learn about Leave & License agreements, stamp duty, registration requirements and tenant rights.',
    publishedAt: '2026-02-10',
    updatedAt: '2026-02-10',
    readingTime: '5 minutes',
    excerpt: 'Everything you need to know about rent agreement rules in Maharashtra — from Leave & License provisions to stamp duty, registration, and landlord-tenant rights under the 1999 Act.',
    content: `
## What is a Rent Agreement in Maharashtra?

A rent agreement in Maharashtra is a legal contract between a property owner (licensor) and a tenant (licensee). Under Maharashtra law, this is formally called a Leave and License Agreement, governed by the Maharashtra Rent Control Act, 1999. Unlike a traditional tenancy, a Leave and License agreement grants only a license to occupy — it does not transfer any interest in the property to the tenant.

This distinction gives landlords significantly greater legal protection and is why nearly all rentals in Maharashtra use the Leave and License format.

## Key Rules Under the Maharashtra Rent Control Act 1999

The Act sets clear rules that both landlords and tenants must follow:

- Agreements for more than 12 months must be registered at the Sub-Registrar Office (SRO)
- Stamp duty for an 11-month agreement is a flat ₹100
- For agreements of 12 to 60 months, stamp duty is 0.25% of total rent plus deposit
- The landlord must give a written receipt for the security deposit
- Rent increases must be agreed upon in writing before the new rent takes effect

## Leave and License vs Traditional Rental Deed

Most landlords prefer a Leave and License agreement over a traditional rental deed for practical reasons. A traditional tenancy deed can create protected tenancy rights under the Rent Control Act that are very difficult to terminate, even after the agreement period expires. A Leave and License agreement avoids this because it merely grants permission to use the premises — the landlord can recover possession at the end of the term without lengthy court proceedings.

This is why even long-term arrangements in Maharashtra are structured as multiple back-to-back 11-month agreements rather than a single multi-year rental deed.

## Mandatory Clauses in a Valid Rent Agreement

A legally enforceable Maharashtra rent agreement must include:

- Full names, addresses and Aadhaar numbers of both parties
- Complete address of the licensed property, including floor, flat number and society name
- Monthly license fee and security deposit amount
- Agreement duration and start date
- Lock-in period and notice period for early termination
- Responsibilities for maintenance, electricity and water charges
- Permitted use (residential or commercial only)
- Conditions for security deposit refund

Missing any of these clauses weakens the agreement in court.

## Stamp Duty and Registration Requirements

For an 11-month agreement, stamp duty is ₹100. This is paid via e-stamping or franking at authorised banks. Registration is optional for 11-month agreements but strongly advisable — a registered agreement is admissible as evidence in court whereas an unregistered one has limited legal value.

For agreements of 12 months or more, registration at the SRO is mandatory under Section 17 of the Registration Act, 1908. Both parties must appear in person for biometric verification.

## Getting Your Agreement Online

The traditional process involves hiring a lawyer, paying stamp duty separately and visiting the SRO — typically 3 to 5 days and ₹1,000 or more in fees. Mudrankseva generates a court-compliant Maharashtra Leave and License Agreement in minutes. Pay ₹299, fill the form, download your PDF. For registered agreements, our doorstep service handles the SRO appointment and biometrics at your home.

## Common Mistakes That Invalidate Rent Agreements

- Using a verbal or WhatsApp-only agreement — courts do not recognise these
- Omitting the Aadhaar number of either party
- Not specifying who pays for maintenance and utilities
- Forgetting the notice period clause
- Writing an agreement on plain paper without proper stamp duty

A properly drafted rent agreement protects both landlord and tenant from future disputes. Whether you are in Pune, Mumbai, Thane or Nashik, Mudrankseva ensures your agreement meets every requirement under Maharashtra law.
    `.trim(),
  },
  {
    slug: 'sales-deed-registration-process-maharashtra',
    lang: 'en',
    title: 'Sales Deed Registration Process in Maharashtra — Step by Step',
    metaTitle: 'Sales Deed Registration Process Maharashtra 2026 | Mudrankseva',
    metaDescription: 'Complete step-by-step guide to sale deed registration in Maharashtra. Documents required, stamp duty rates, SRO process, and how to register online.',
    publishedAt: '2026-02-15',
    updatedAt: '2026-02-15',
    readingTime: '5 minutes',
    excerpt: 'A complete walkthrough of the sales deed registration process in Maharashtra — from document preparation and stamp duty payment to SRO registration and post-registration steps.',
    content: `
## What is a Sale Deed?

A sale deed is the primary legal document that transfers ownership of immovable property from the seller to the buyer. Without a registered sale deed, the transfer of property is not legally complete in the eyes of the law. In Maharashtra, sale deeds are governed by the Transfer of Property Act, 1882 and the Registration Act, 1908.

The sale deed must be registered at the Sub-Registrar Office (SRO) of the jurisdiction where the property is located. Failure to register makes the sale void against any subsequent buyer.

## Step 1 — Verify Title and Obtain Documents

Before drafting the sale deed, the buyer should verify clear title:

- Obtain the 7/12 extract (Satbara Utara) for agricultural land or property card for urban properties
- Verify there are no encumbrances using an Encumbrance Certificate from the SRO
- Check for any pending property tax dues at the local municipal corporation
- Obtain NOC from the housing society if it is an apartment

## Step 2 — Draft the Sale Deed

The sale deed must accurately describe the property with survey number or CTS number, area, boundaries and all encumbrances. It must include the consideration (sale price), mode of payment, possession date and warranties from the seller about clear title. Mudrankseva drafts court-compliant sale deeds with all mandatory clauses under the Registration Act.

## Step 3 — Calculate and Pay Stamp Duty

Stamp duty in Maharashtra is payable on the higher of the market value or the agreement value:

- Municipal Corporation area: 5% of property value
- Municipal Council or Cantonment: 4%
- Rural area: 4%
- Additional Metro Cess: 1% in applicable areas
- Registration fee: 1% (maximum ₹30,000)

Stamp duty is paid online via the Maharashtra government's GRAS portal before registration.

## Step 4 — Book SRO Appointment

Once stamp duty is paid, both buyer and seller must appear at the Sub-Registrar Office for registration. You will need:

- Original and two copies of the sale deed
- Stamp duty payment challan
- Aadhaar card and PAN card of both parties
- Two passport photographs each
- Property documents (7/12 / property card)
- Society NOC if applicable

## Step 5 — Biometric Registration at SRO

At the SRO, both parties give their thumb impression and photograph. The SRO officer verifies the documents and registers the deed. The registered document is typically available for collection within 2 to 7 working days.

## Doorstep Registration Service

For buyers and sellers who cannot attend the SRO, Mudrankseva's doorstep registration service sends a trained executive to collect biometrics at your location and coordinates the SRO appointment. Available in Pune and Pimpri-Chinchwad, expanding to Mumbai, Thane and Nashik.

## Post-Registration Steps

After registration, complete these steps to secure your ownership:

1. Collect the registered sale deed from the SRO
2. File for mutation (Ferfar) at the local tehsildar to update 7/12 records
3. Transfer property tax records to the buyer's name at the municipal corporation
4. Update the society share certificate if it is an apartment

A registered sale deed is the foundation of clear property title in Maharashtra. Start your sale deed with Mudrankseva and complete the entire process without leaving home.
    `.trim(),
  },
  {
    slug: 'gift-deed-vs-will-maharashtra',
    lang: 'en',
    title: 'Gift Deed vs Will — Which is Better for Property Transfer in Maharashtra?',
    metaTitle: 'Gift Deed vs Will for Property in Maharashtra | Mudrankseva',
    metaDescription: 'Gift deed vs will for property transfer in Maharashtra — compare stamp duty, legal validity, revocability and tax implications to choose the right option.',
    publishedAt: '2026-02-20',
    updatedAt: '2026-02-20',
    readingTime: '4 minutes',
    excerpt: 'Should you transfer property to family through a gift deed or a will? This guide compares both options on stamp duty, legal strength, revocability and practical implications in Maharashtra.',
    content: `
## Two Ways to Transfer Property to Family

When you want to pass property to a family member in Maharashtra, you broadly have two options: execute a gift deed during your lifetime or write a will that takes effect after your death. Both are legally valid but serve very different purposes, and the right choice depends on your specific situation.

## What is a Gift Deed?

A gift deed (Bheta Khata) is a legal document by which a property owner voluntarily and without any monetary consideration transfers ownership to another person — typically a family member. In Maharashtra, gift deeds are governed by the Transfer of Property Act, 1882. A gift deed must be registered at the Sub-Registrar Office to be legally valid for immovable property.

Key characteristics of a gift deed:
- Transfer takes effect immediately upon registration
- Irrevocable once registered (with very limited exceptions)
- Requires physical presence of both donor and donee at the SRO
- Stamp duty applies at the time of registration

## What is a Will?

A will is a legal document declaring how a person's assets should be distributed after their death. A will takes effect only upon the death of the testator and must go through probate proceedings if challenged. Wills in Maharashtra are governed by the Indian Succession Act, 1925 for Hindus (though Hindus can use it), and is mandatory for Christians and some other communities.

Key characteristics of a will:
- Takes effect only after death
- Can be changed or revoked at any time during the testator's lifetime
- Does not attract stamp duty
- Registration is optional but highly recommended
- May be challenged by heirs after death

## Stamp Duty Comparison

This is where gift deeds and wills differ significantly in cost:

- Gift deed to blood relative (spouse, child, sibling, parent): 2% of property value
- Gift deed to non-relative: 5% of property value
- Registration fee for gift deed: 1% (maximum ₹30,000)
- Will: No stamp duty. Registration fee is nominal (₹200-500)

For a property worth ₹1 crore, a gift deed to a child costs ₹2 lakh in stamp duty plus registration fee. A will costs virtually nothing.

## When to Choose a Gift Deed

A gift deed is better when:
- You want the transfer to happen during your lifetime
- You want to reduce future inheritance disputes
- The recipient needs the property now (for a loan, business or housing)
- You want certainty — a registered gift deed cannot be challenged easily
- The property is agricultural land (wills can be more complicated for agricultural land transfer)

## When to Choose a Will

A will is better when:
- You want to retain control of the property during your lifetime
- You may change your mind about who gets the property
- The stamp duty on a gift deed is prohibitive
- You want to distribute multiple assets to multiple heirs with specific conditions

## Can a Gift Deed be Cancelled?

A registered gift deed is generally irrevocable. It can only be cancelled in very limited circumstances: if the donee has committed fraud or undue influence, or by mutual consent of both parties through a registered cancellation deed. Courts rarely cancel gift deeds on grounds of regret or family disputes alone.

## Recommendation

If the primary goal is to avoid disputes and ensure the property reaches the intended person without any ambiguity, a registered gift deed is stronger. If cost is a concern and the transfer can wait until after your lifetime, a well-drafted registered will is a practical alternative. Mudrankseva can help you draft either document — a gift deed from ₹499, fully compliant with Maharashtra requirements.
    `.trim(),
  },
  {
    slug: 'power-of-attorney-nri-maharashtra',
    lang: 'en',
    title: 'Power of Attorney Guide for NRIs with Property in Maharashtra',
    metaTitle: 'Power of Attorney for NRI Property in Maharashtra | Mudrankseva',
    metaDescription: 'Complete guide for NRIs on how to create a Power of Attorney for property in Maharashtra. Apostille, registration, types of POA and how to manage property from abroad.',
    publishedAt: '2026-03-01',
    updatedAt: '2026-03-01',
    readingTime: '5 minutes',
    excerpt: 'NRIs owning property in Maharashtra need a valid Power of Attorney to manage transactions from abroad. This guide covers types of POA, how to execute it from your country, apostille requirements and registration.',
    content: `
## Why NRIs Need a Power of Attorney for Maharashtra Property

Managing property in Maharashtra from abroad is practically impossible without a trusted representative. Whether you need to sell a flat, collect rent, pay property tax, register a lease or deal with a housing society, you need someone in India who can act on your behalf legally. A Power of Attorney (POA) is the document that authorises this person to act as your agent.

Under the Power of Attorney Act, 1882 and the Registration Act, 1908, a POA for immovable property transactions must be registered in India to be legally effective.

## Types of Power of Attorney for NRIs

There are two main types relevant to NRI property owners:

General Power of Attorney (GPA): Grants broad authority to the agent to perform multiple acts — selling property, collecting rent, paying taxes, appearing before government offices, and managing all matters related to the specified property. Useful when you want a trusted family member to manage all your affairs.

Specific Power of Attorney (SPA): Limits authority to a single defined transaction — for example, the sale of a specific property at a specific address. Preferred by legal professionals and buyers because it limits the scope of the agent's authority and reduces risk.

For NRIs, a Specific POA is generally safer. It can be used to complete a single sale transaction and automatically becomes ineffective once that transaction is done.

## How to Execute a POA from Abroad

The process depends on your country of residence:

1. Draft the POA document with the property details, agent's name and authority granted
2. Sign it before an Indian Consulate or High Commission in your country, or get it notarised by a local notary and then Apostilled (for countries that are part of the Hague Apostille Convention)
3. Send the original notarised and apostilled document to India
4. The agent (the person receiving the POA) must then present it for adjudication and registration at the Sub-Registrar Office in Maharashtra

Mudrankseva can prepare the POA draft for you and guide your agent through the registration process in India.

## Apostille vs Consulate Attestation

If your country is a member of the Hague Apostille Convention (USA, UK, Australia, UAE are all members), you can get the document Apostilled by the competent authority in that country. This is faster and cheaper than consulate attestation.

If your country is not a Hague member, you must get the document attested by the Indian Consulate or High Commission.

## Stamp Duty and Registration for NRI POA

In Maharashtra, a POA for property transactions must be:

- Adjudicated by the Collector of Stamps to determine applicable stamp duty
- Registered at the Sub-Registrar Office

The stamp duty varies based on the type and scope of the POA. A General POA for property typically attracts stamp duty of ₹500 to ₹1,000. A Specific POA for a single sale may attract higher stamp duty calculated on the transaction value.

## Risks to Watch For

- Ensure the POA is specific in scope — a very broad POA can be misused
- Keep a copy of the registered POA for your records
- Include an expiry date or specific conditions under which the POA terminates
- A POA automatically terminates upon the death of the principal (the NRI)
- Revoke the POA immediately once its purpose is complete

## Revoking a POA

A POA can be revoked at any time by the principal. The revocation must be communicated to the agent and registered if the original POA was registered. The agent cannot act on behalf of the principal after receiving notice of revocation.

Mudrankseva helps NRIs draft Specific and General POAs for Maharashtra property, guided by legal professionals familiar with NRI requirements. Get your POA drafted for ₹499.
    `.trim(),
  },
  {
    slug: 'stamp-duty-exemption-women-maharashtra-2026',
    lang: 'en',
    title: 'Stamp Duty Exemption for Women Buyers in Maharashtra 2026',
    metaTitle: 'Stamp Duty Exemption for Women in Maharashtra 2026 | Mudrankseva',
    metaDescription: 'Women buyers in Maharashtra get a 1% stamp duty concession on property purchase. Learn eligibility, savings calculation, joint ownership rules and how to claim the exemption.',
    publishedAt: '2026-03-05',
    updatedAt: '2026-03-05',
    readingTime: '4 minutes',
    excerpt: 'Maharashtra offers a 1% stamp duty concession to women property buyers. Find out how much you can save, the eligibility criteria, how it applies to joint purchases, and how to claim it correctly.',
    content: `
## Maharashtra's Stamp Duty Concession for Women

To encourage women to own property, the Maharashtra government offers a concessional stamp duty rate for women buyers. As of 2026, women purchasing property in Maharashtra pay 4% stamp duty instead of the standard 5% in municipal corporation areas — a saving of 1 percentage point on the property's market value.

This concession applies to all women regardless of age, marital status or income, and is one of the most significant financial benefits available to women property buyers in the state.

## Current Stamp Duty Rates in Maharashtra 2026

| Buyer | Municipal Corporation | Rural Area |
|-------|----------------------|------------|
| Male or joint (male + female) | 5% | 4% |
| Female buyer (sole) | 4% | 3% |

Additionally, registration fee is 1% of the property value for all buyers, capped at ₹30,000. Metro Cess of 1% applies in Mumbai, Pune, Nagpur and other notified areas.

## How Much Can a Woman Buyer Save?

For a property worth ₹50 lakh in Pune Municipal Corporation area:

- Male buyer: 5% stamp duty = ₹2,50,000
- Female buyer: 4% stamp duty = ₹2,00,000
- Saving: ₹50,000

For a ₹1 crore property, the saving is ₹1,00,000. This is a direct financial benefit that makes property ownership significantly more affordable for women.

## Eligibility Conditions

To avail the concession:

- The property must be purchased solely in the woman's name, OR jointly where the first named buyer is a woman
- The concession applies to residential properties as well as commercial properties
- There is no upper limit on property value for the concession
- The buyer must be an individual woman (not a company or trust)

## Joint Ownership — Does the Concession Apply?

This is a common question. The answer depends on the order of names in the sale deed:

- Woman first, man second: The full concession applies — stamp duty is at the female rate
- Man first, woman second: Stamp duty is at the male rate (no concession)
- Two women: Concession applies to both shares

If you are buying with a spouse or family member, simply ensure the woman's name appears first in the sale deed to avail the concession.

## How to Claim the Concession

The concession is claimed at the time of stamp duty payment:

1. Ensure the sale deed clearly indicates the female buyer's name first
2. Select the female buyer option on the Maharashtra GRAS portal when paying stamp duty
3. The portal automatically calculates stamp duty at the concessional rate
4. No additional forms or declarations are required

Mudrankseva's stamp duty calculator at mudrankseva.in/calculator automatically applies the female buyer rate when you select the female buyer option — giving you an accurate estimate including Metro Cess and registration fee.

## Is the Concession Permanent?

The concession has been in place for several years and has been renewed consistently by successive Maharashtra governments as a policy measure to promote women's property ownership. As of the 2026-27 fiscal year, the rates are unchanged as per the government notification dated March 31, 2026.

## Practical Tips

- Always confirm the ready reckoner value of the property before calculating stamp duty — the government charges duty on the higher of market value or agreement value
- Keep the receipt of stamp duty payment as proof for the registrar
- Use Mudrankseva's calculator to get an accurate estimate before your SRO appointment

Maharashtra's stamp duty concession for women is a straightforward benefit that can save lakhs of rupees. Whether you are buying your first home in Pune, an investment flat in Mumbai or agricultural land in Nashik, make sure to claim it correctly.
    `.trim(),
  },
  {
    slug: 'bhade-karar-leave-licence-farak',
    lang: 'mr',
    title: 'भाडे करार आणि लीव्ह अँड लायसन्स करार — फरक काय?',
    metaTitle: 'भाडे करार आणि लीव्ह अँड लायसन्स फरक | मुद्रांकसेवा',
    metaDescription: 'भाडे करार आणि लीव्ह अँड लायसन्स करारात काय फरक आहे? कोणता करार मालकाला अधिक संरक्षण देतो, स्टँप ड्युटी किती — सर्व माहिती मराठीत.',
    publishedAt: '2026-02-12',
    updatedAt: '2026-02-12',
    readingTime: '५ मिनिटे',
    excerpt: 'महाराष्ट्रात मालमत्ता भाड्याने देताना भाडे करार आणि लीव्ह अँड लायसन्स करार यातील फरक समजून घेणे आवश्यक आहे. कोणता करार अधिक सुरक्षित आहे याची संपूर्ण माहिती.',
    content: `
## भाडे करार म्हणजे काय?

पारंपरिक भाडे करार (Tenancy Agreement) हा मालक आणि भाडेकरू यांच्यातील कायदेशीर करार आहे ज्यामध्ये भाडेकरूला मालमत्तेत राहण्याचा कायदेशीर अधिकार मिळतो. हा करार भाडेकरूला भाडेकरार कायद्यांतर्गत संरक्षण देतो — म्हणजेच मालकाला भाडेकरूला कायद्याशिवाय बाहेर काढता येत नाही.

## लीव्ह अँड लायसन्स करार म्हणजे काय?

लीव्ह अँड लायसन्स करार (Leave and License Agreement) हा मालमत्ता वापरण्याची परवानगी देणारा करार आहे. यात भाडेकरूला मालमत्तेत कायमस्वरूपी अधिकार मिळत नाही — केवळ ठराविक कालावधीसाठी राहण्याची परवानगी मिळते. महाराष्ट्र भाडे नियंत्रण अधिनियम, १९९९ अंतर्गत हाच करार महाराष्ट्रात सर्वाधिक वापरला जातो.

## दोन्हीतील मुख्य फरक

पारंपरिक भाडे करारात भाडेकरूला भाडेकरार कायद्यांतर्गत संरक्षण मिळते व मालक त्याला सहज बाहेर काढू शकत नाही. लीव्ह अँड लायसन्समध्ये भाडेकरूला असे संरक्षण नसते — करार संपल्यावर मालमत्ता परत मिळणे सोपे असते.

पारंपरिक भाडे कराराचा कालावधी एक वर्षापेक्षा जास्त असल्यास मालकाला नोंदणी बंधनकारक आहे व न्यायालयाशिवाय भाडेकरूला काढता येत नाही. लीव्ह अँड लायसन्स करार साधारणतः ११ महिन्यांचा असतो.

## मालकाने कोणता करार वापरावा?

महाराष्ट्रात जवळजवळ सर्व मालक लीव्ह अँड लायसन्स करार वापरतात. याची दोन मुख्य कारणे आहेत:

- करार संपल्यावर मालमत्ता परत मिळण्यास कायदेशीर अडचण येत नाही
- भाडेकरू भाडे थांबवल्यास किंवा मालमत्ता सोडण्यास नकार दिल्यास न्यायालयात जाणे तुलनेने सोपे असते

पारंपरिक भाडे करार केला आणि भाडेकरूने मालमत्ता सोडण्यास नकार दिला तर मालकाला न्यायालयात अनेक वर्षे लढावे लागू शकते.

## स्टँप ड्युटी तुलना

११ महिन्यांच्या लीव्ह अँड लायसन्स करारावर फक्त ₹१०० स्टँप ड्युटी लागते. १२ ते ६० महिन्यांसाठी मासिक भाडे आणि डिपॉझिटच्या एकूण रकमेच्या ०.२५% स्टँप ड्युटी लागते.

पारंपरिक भाडे कराराला जास्त स्टँप ड्युटी लागू शकते आणि नोंदणी बंधनकारक असते.

## ११ महिन्यांचा करार का?

महाराष्ट्रात ११ महिन्यांच्या लीव्ह अँड लायसन्स करारावर नोंदणी ऐच्छिक असते. बहुतेक मालक या कारणामुळे ११ महिन्यांचा करार करतात — नोंदणी नाही म्हणजे SRO ला जाण्याची गरज नाही आणि नोंदणी शुल्क वाचते. मात्र नोंदणीकृत करार न्यायालयात अधिक मजबूत पुरावा म्हणून स्वीकारला जातो.

## मुद्रांकसेवाची सेवा

मुद्रांकसेवावर महाराष्ट्र Leave and License करार ₹२९९ मध्ये तयार होतो. AI-आधारित मसुदा, महाराष्ट्र भाडे नियंत्रण अधिनियमानुसार सर्व आवश्यक कलमे, आणि प्रिंट-रेडी PDF — सर्व घरबसल्या. नोंदणीकृत करार हवा असल्यास आमची घरपोच सेवा वापरा.

## निष्कर्ष

महाराष्ट्रात मालमत्ता भाड्याने देण्यासाठी लीव्ह अँड लायसन्स करार हाच सर्वोत्तम पर्याय आहे. तो मालकाला अधिक कायदेशीर संरक्षण देतो, स्टँप ड्युटी कमी असते, आणि ११ महिन्यांसाठी नोंदणीही बंधनकारक नसते. भाडेकरूंनाही हा करार अधिक स्पष्ट असतो कारण सर्व अटी-शर्ती लेखी स्वरूपात असतात.
    `.trim(),
  },
  {
    slug: 'pune-malmatat-nondani-margdarshan',
    lang: 'mr',
    title: 'पुण्यात मालमत्ता नोंदणी कशी करावी — संपूर्ण मार्गदर्शन २०२६',
    metaTitle: 'पुण्यात मालमत्ता नोंदणी कशी करावी २०२६ | मुद्रांकसेवा',
    metaDescription: 'पुण्यात मालमत्ता नोंदणी करण्यासाठी कोणती कागदपत्रे लागतात, SRO कुठे आहे, स्टँप ड्युटी किती — संपूर्ण मार्गदर्शन मराठीत.',
    publishedAt: '2026-02-18',
    updatedAt: '2026-02-18',
    readingTime: '७ मिनिटे',
    excerpt: 'पुण्यात मालमत्ता नोंदणी कशी करावी — कागदपत्रांची यादी, स्टँप ड्युटी गणना, SRO ची माहिती, आणि घरबसल्या नोंदणी कशी होते याची संपूर्ण माहिती.',
    content: `
## पुण्यात मालमत्ता नोंदणी का आवश्यक आहे?

नोंदणी अधिनियम, १९०८ अंतर्गत महाराष्ट्रात १०० रुपयांपेक्षा जास्त मूल्याच्या मालमत्तेची विक्री किंवा हस्तांतरण नोंदणीशिवाय पूर्ण होत नाही. नोंदणी नसलेला विक्री करार कायदेशीरदृष्ट्या अपूर्ण मानला जातो आणि भविष्यात मालकी हक्क सिद्ध करणे कठीण होते.

पुण्यात मालमत्ता नोंदणीसाठी दुय्यम निबंधक कार्यालय (Sub-Registrar Office) ला भेट देणे बंधनकारक आहे.

## पुण्यातील प्रमुख SRO कार्यालये

पुणे जिल्ह्यात अनेक दुय्यम निबंधक कार्यालये आहेत. मालमत्तेच्या स्थानानुसार योग्य SRO निवडावे लागते:

- SRO पुणे-१ (कँप): कँप, पुणे ४११००१
- SRO पुणे-२ (शिवाजीनगर): FC रोड, शिवाजीनगर, पुणे ४११००५
- SRO पिंपरी: जुना मुंबई-पुणे महामार्ग, पिंपरी
- SRO चिंचवड: स्टेशन रोड, चिंचवड

कार्यालय वेळ: सोमवार ते शनिवार, सकाळी १० ते सायंकाळी ५ (२रा व ४था शनिवार बंद)

## नोंदणीसाठी आवश्यक कागदपत्रे

विक्रेत्याची कागदपत्रे:
- आधार कार्ड आणि PAN कार्ड
- मागील खरेदी दस्तऐवज (Title Chain)
- प्रॉपर्टी कार्ड किंवा ७/१२ उतारा
- सोसायटी NOC (अपार्टमेंट असल्यास)
- मालमत्ता कराची पावती

खरेदीदाराची कागदपत्रे:
- आधार कार्ड आणि PAN कार्ड
- पासपोर्ट फोटो (२ प्रती)

## स्टँप ड्युटी गणना — पुणे २०२६

पुणे महानगरपालिका क्षेत्रासाठी:
- स्टँप ड्युटी: मालमत्ता मूल्याच्या ५%
- मेट्रो सेस: १%
- नोंदणी शुल्क: १% (कमाल ₹३०,०००)
- एकूण खर्च: मालमत्ता मूल्याच्या सुमारे ७%

महिला खरेदीदार असल्यास स्टँप ड्युटी ४% आहे (१% सवलत). अचूक गणनेसाठी मुद्रांकसेवाचा स्टँप ड्युटी कॅल्क्युलेटर वापरा.

## टप्पेवार नोंदणी प्रक्रिया

पहिला टप्पा: विक्री करार (Sale Deed) तयार करणे. मुद्रांकसेवा नोंदणी अधिनियम, १९०८ आणि मालमत्ता हस्तांतरण अधिनियम, १८८२ अंतर्गत योग्य विक्री करार तयार करते.

दुसरा टप्पा: स्टँप ड्युटी भरणे. महाराष्ट्र सरकारच्या GRAS पोर्टलवर ऑनलाइन स्टँप ड्युटी भरता येते. रोख रक्कम स्वीकारली जात नाही.

तिसरा टप्पा: SRO मध्ये भेट. दोन्ही पक्षांनी (विक्रेता आणि खरेदीदार) SRO कार्यालयात प्रत्यक्ष हजर राहणे बंधनकारक आहे. तेथे बायोमेट्रिक (अंगठ्याचा ठसा) नोंदणी होते.

चौथा टप्पा: नोंदणीकृत दस्तऐवज मिळवणे. SRO नोंदणी पूर्ण झाल्यावर सुमारे २ ते ७ कार्यालयीन दिवसांत नोंदणीकृत विक्री करार मिळतो.

## नोंदणीनंतरचे महत्त्वाचे टप्पे

नोंदणीनंतर खालील कामे पूर्ण करा:

1. फेरफार (Mutation): तहसीलदार कार्यालयात ७/१२ उतार्‍यात नवीन मालकाचे नाव नोंदवणे
2. मालमत्ता कर हस्तांतरण: पुणे महानगरपालिकेत मालमत्ता कर नोंदणी नवीन मालकाच्या नावावर करणे
3. सोसायटी शेअर सर्टिफिकेट: अपार्टमेंट असल्यास सोसायटीचे शेअर सर्टिफिकेट नवीन मालकाच्या नावावर करणे

## घरपोच नोंदणी सेवा

SRO ला जाणे शक्य नसल्यास मुद्रांकसेवाची घरपोच नोंदणी सेवा वापरा. आमचा प्रतिनिधी तुमच्या पत्त्यावर येतो, बायोमेट्रिक घेतो आणि SRO नोंदणी पूर्ण करतो. सेवा पुणे आणि पिंपरी-चिंचवडमध्ये उपलब्ध आहे.
    `.trim(),
  },
  {
    slug: 'gift-deed-maharashtra-marathi',
    lang: 'mr',
    title: 'महाराष्ट्रात गिफ्ट डीड कसा करावा — संपूर्ण मार्गदर्शन',
    metaTitle: 'महाराष्ट्रात गिफ्ट डीड कसा करावा | मुद्रांकसेवा',
    metaDescription: 'महाराष्ट्रात गिफ्ट डीड (भेट खत) कसा करावा, कोणती कागदपत्रे लागतात, स्टँप ड्युटी किती, नातेवाईकांसाठी सवलत — सर्व माहिती मराठीत.',
    publishedAt: '2026-02-22',
    updatedAt: '2026-02-22',
    readingTime: '५ मिनिटे',
    excerpt: 'कुटुंबातील सदस्याला मालमत्ता भेट देण्यासाठी गिफ्ट डीड (भेट खत) आवश्यक आहे. महाराष्ट्रात भेट खत कसा करावा, स्टँप ड्युटी किती लागते आणि नोंदणी कशी होते याची माहिती.',
    content: `
## गिफ्ट डीड म्हणजे काय?

गिफ्ट डीड (भेट खत) हा एक कायदेशीर दस्तऐवज आहे ज्याद्वारे मालमत्तेचा मालक आपली मालमत्ता दुसऱ्या व्यक्तीला विनामूल्य भेट म्हणून देतो. यात कोणताही मोबदला (पैसे) दिला जात नाही. महाराष्ट्रात गिफ्ट डीड मालमत्ता हस्तांतरण अधिनियम, १८८२ अंतर्गत येतो.

स्थावर मालमत्तेसाठी (जमीन, घर, फ्लॅट) गिफ्ट डीड नोंदणी बंधनकारक आहे. नोंदणी केल्याशिवाय गिफ्ट डीड कायदेशीरदृष्ट्या अवैध मानला जातो.

## गिफ्ट डीड केव्हा करावा?

गिफ्ट डीड खालील परिस्थितीत उपयुक्त ठरतो:

- पालकांनी मुलांना मालमत्ता देणे
- पती-पत्नी यांच्यात मालमत्ता हस्तांतरण
- भाऊ-बहिणींमध्ये मालमत्ता विभागणी
- आजी-आजोबांनी नातवंडांना मालमत्ता देणे
- जिवंत असताना मालमत्ता हस्तांतरण करायची असल्यास (मृत्युपत्राऐवजी)

## महाराष्ट्रात गिफ्ट डीडवर स्टँप ड्युटी किती?

रक्त नातेवाईकांना (पती-पत्नी, मुले, पालक, भाऊ-बहीण) दिलेल्या गिफ्ट डीडवर:
- स्टँप ड्युटी: मालमत्ता मूल्याच्या २%
- नोंदणी शुल्क: १% (कमाल ₹३०,०००)

इतर व्यक्तींना (नातेवाईक नसलेल्यांना) दिलेल्या गिफ्ट डीडवर:
- स्टँप ड्युटी: मालमत्ता मूल्याच्या ५%
- नोंदणी शुल्क: १% (कमाल ₹३०,०००)

रक्त नातेवाईकांसाठीची सवलत आवर्जून वापरा — ₹५० लाख मूल्याच्या मालमत्तेवर हे ₹१.५ लाख वाचवते.

## आवश्यक कागदपत्रे

दाता (Donor) आणि घेणारा (Donee) दोघांचे:
- आधार कार्ड
- PAN कार्ड
- पासपोर्ट फोटो

मालमत्तेचे कागदपत्रे:
- प्रॉपर्टी कार्ड किंवा ७/१२ उतारा
- मागील खरेदी दस्तऐवज
- नातेसंबंधाचा पुरावा (रेशन कार्ड, जन्म दाखला)

## गिफ्ट डीड करण्याची प्रक्रिया

पहिला टप्पा: गिफ्ट डीडचा मसुदा तयार करणे. मुद्रांकसेवा मालमत्ता हस्तांतरण अधिनियमानुसार योग्य गिफ्ट डीड तयार करते.

दुसरा टप्पा: स्टँप ड्युटी GRAS पोर्टलवर भरणे.

तिसरा टप्पा: दुय्यम निबंधक कार्यालयात दाता आणि घेणारा दोघांनी हजर राहून बायोमेट्रिक नोंदणी करणे.

चौथा टप्पा: नोंदणीकृत गिफ्ट डीड घेणे. हा दस्तऐवज मालकी हक्काचा कायदेशीर पुरावा आहे.

## गिफ्ट डीड रद्द होऊ शकतो का?

नोंदणीकृत गिफ्ट डीड साधारणतः रद्द होत नाही. फसवणूक, जबरदस्ती किंवा अयोग्य प्रभाव सिद्ध झाल्यास न्यायालय रद्द करू शकते. दोन्ही पक्षांच्या संमतीने नोंदणीकृत रद्दीकरण दस्तऐवज करता येतो.

## मृत्युपत्राऐवजी गिफ्ट डीड?

जर तुम्हाला जिवंत असताना मालमत्ता हस्तांतरण करायची असेल तर गिफ्ट डीड चांगला पर्याय आहे. मृत्युपत्र मृत्यूनंतरच लागू होते आणि त्यावर वाद होण्याची शक्यता असते. गिफ्ट डीड तात्काळ प्रभावाने लागू होतो.

मुद्रांकसेवावर गिफ्ट डीड ₹४९९ मध्ये तयार होतो. AI-निर्मित, महाराष्ट्र कायद्यानुसार — घरबसल्या.
    `.trim(),
  },
  {
    slug: 'mumbai-bhade-karar-2026',
    lang: 'mr',
    title: 'मुंबईत भाडे करार — नियम, प्रक्रिया आणि महत्त्वाच्या गोष्टी २०२६',
    metaTitle: 'मुंबईत भाडे करार नियम आणि प्रक्रिया २०२६ | मुद्रांकसेवा',
    metaDescription: 'मुंबईत भाडे करार कसा करावा, Leave & License करार काय असतो, स्टँप ड्युटी किती, नोंदणी कशी होते — मराठीत संपूर्ण माहिती.',
    publishedAt: '2026-03-03',
    updatedAt: '2026-03-03',
    readingTime: '५ मिनिटे',
    excerpt: 'मुंबईत भाडे करार करताना कोणते नियम लागू होतात, SRO कुठे आहे, ऑनलाइन करार कसा मिळवावा — हे सर्व मराठीत सोप्या भाषेत.',
    content: `
## मुंबईत भाडे करारासाठी कोणता कायदा लागू होतो?

मुंबईत (आणि संपूर्ण महाराष्ट्रात) भाडे करार महाराष्ट्र भाडे नियंत्रण अधिनियम, १९९९ आणि नोंदणी अधिनियम, १९०८ अंतर्गत येतो. मुंबईत मालमत्तेची मागणी जास्त असल्याने Leave and License करार हाच सर्वाधिक प्रचलित आहे.

मुंबई शहर आणि उपनगरांमध्ये (बांद्रा, अंधेरी, बोरिवली, मालाड, चेंबूर, दादर, पवई) सर्वत्र हेच नियम लागू होतात.

## मुंबईत भाडे करारासाठी काय लागते?

मालकाची (Licensor) माहिती:
- पूर्ण नाव आणि पत्ता
- आधार कार्ड क्रमांक
- मालमत्तेचे कागदपत्रे (प्रॉपर्टी कार्ड किंवा सोसायटी NOC)

भाडेकरूची (Licensee) माहिती:
- पूर्ण नाव आणि कायमचा पत्ता
- आधार कार्ड क्रमांक
- पासपोर्ट फोटो

## मुंबईत स्टँप ड्युटी किती लागते?

११ महिन्यांच्या Leave and License करारावर फक्त ₹१०० स्टँप ड्युटी लागते. मुंबईत मेट्रो सेस अतिरिक्त लागत नाही भाडे कराराला. ११ महिन्यांपेक्षा जास्त कालावधीसाठी:

- वार्षिक भाडे + डिपॉझिट = एकूण रक्कम
- स्टँप ड्युटी = एकूण रकमेच्या ०.२५%

## मुंबईतील SRO कार्यालये

मुंबईत मालमत्तेच्या स्थानानुसार SRO निवडावे लागते:

- SRO वांद्रे: वांद्रे पश्चिम, मुंबई ४०००५०
- SRO अंधेरी: अंधेरी पूर्व, मुंबई ४०००६९
- SRO दादर: दादर पश्चिम, मुंबई ४०००२८
- SRO बोरिवली: बोरिवली पश्चिम, मुंबई ४०००९२

## मुंबईत ११ महिने करार का करतात?

११ महिन्यांच्या Leave and License करारासाठी SRO नोंदणी बंधनकारक नाही. यामुळे मालक आणि भाडेकरू दोघांचे वेळ आणि पैसे वाचतात. मात्र नोंदणीकृत करार न्यायालयात अधिक मजबूत असतो — वाद झाल्यास नोंदणी नसलेल्या करारावर अवलंबून राहणे धोकादायक ठरू शकते.

## मुंबईत ऑनलाइन भाडे करार कसा मिळवावा?

पूर्वी भाडे करार करण्यासाठी वकिलाकडे जाणे, स्टँप पेपर आणणे आणि SRO ला रांगेत उभे राहणे आवश्यक होते. आता मुद्रांकसेवाद्वारे ऑनलाइन करार मिळवणे सहज शक्य आहे:

1. वेबसाइटवर जा आणि मालक-भाडेकरू माहिती भरा
2. AI-आधारित Maharashtra Leave & License करार तयार होतो
3. ₹२९९ ऑनलाइन पेमेंट करा
4. प्रिंट-रेडी PDF डाउनलोड करा

## मुंबईत घरपोच नोंदणी सेवा

नोंदणीकृत करार हवा असल्यास मुद्रांकसेवाची घरपोच सेवा लवकरच मुंबईत सुरू होणार आहे. सध्या सेवा पुणे आणि पिंपरी-चिंचवडमध्ये उपलब्ध आहे. मुंबई, ठाणे आणि नाशिकसाठी WhatsApp वर संपर्क करा.

## महत्त्वाचे मुद्दे

- भाडे करार नेहमी लेखी स्वरूपात असणे आवश्यक आहे
- भाड्याची रक्कम, कालावधी आणि नोटीस कालावधी स्पष्टपणे नमूद करा
- डिपॉझिट परत करण्याच्या अटी करारात लिहून घ्या
- देखभाल खर्च, वीज आणि पाण्याचे बिल कोण भरणार हे स्पष्ट करा
    `.trim(),
  },
  {
    slug: 'stamp-duty-vachavnyache-5-marg',
    lang: 'mr',
    title: 'स्टँप ड्युटी वाचवण्याचे ५ कायदेशीर मार्ग — महाराष्ट्र २०२६',
    metaTitle: 'स्टँप ड्युटी वाचवण्याचे ५ कायदेशीर मार्ग महाराष्ट्र | मुद्रांकसेवा',
    metaDescription: 'महाराष्ट्रात मालमत्ता खरेदी करताना स्टँप ड्युटी कायदेशीरपणे कमी कशी करावी? महिला खरेदी, कृषी जमीन, गिफ्ट डीड सवलत — ५ प्रभावी मार्ग.',
    publishedAt: '2026-03-08',
    updatedAt: '2026-03-08',
    readingTime: '५ मिनिटे',
    excerpt: 'महाराष्ट्रात मालमत्ता खरेदी करताना लाखो रुपये स्टँप ड्युटी वाचवता येते — पूर्णपणे कायदेशीर मार्गांनी. हे ५ मार्ग अनेक खरेदीदारांना माहीत नाहीत.',
    content: `
## स्टँप ड्युटी वाचवणे शक्य आहे का?

होय — पण फक्त कायदेशीर मार्गांनी. स्टँप ड्युटी चुकवणे किंवा कमी दाखवणे हा गुन्हा आहे आणि त्यावर दंड आणि शिक्षा होऊ शकते. मात्र महाराष्ट्र सरकारने काही विशेष परिस्थितींसाठी कायदेशीर सवलती दिलेल्या आहेत. त्यांचा योग्य वापर करून तुम्ही लाखो रुपये वाचवू शकता.

## मार्ग १: महिलेच्या नावावर मालमत्ता खरेदी करा

महाराष्ट्रात महिला खरेदीदाराला स्टँप ड्युटीत १% सवलत मिळते. शहरी भागात पुरुषाला ५% स्टँप ड्युटी लागते, तर महिलेला फक्त ४%.

उदाहरण: ₹१ कोटी मूल्याच्या मालमत्तेवर — महिला खरेदीदाराची बचत: ₹१ लाख.

संयुक्त खरेदी असल्यास महिलेचे नाव प्रथम ठेवा — सवलत लागू होते.

## मार्ग २: रक्त नातेवाईकाला गिफ्ट डीडने मालमत्ता द्या

विक्री व्यवहाराऐवजी गिफ्ट डीड वापरल्यास स्टँप ड्युटी कमी होते:

- रक्त नातेवाईकांना (मुले, पालक, पती-पत्नी, भाऊ-बहीण): फक्त २% स्टँप ड्युटी
- सामान्य विक्रीत: ५% स्टँप ड्युटी

₹५० लाख मूल्याच्या मालमत्तेसाठी — गिफ्ट डीडने बचत: ₹१.५ लाख.

## मार्ग ३: सरकारी मान्यताप्राप्त गृहनिर्माण योजनेत खरेदी

काही सरकारी योजनांतर्गत (PMAY, म्हाडा, सिडको) खरेदी केल्यास कमी स्टँप ड्युटी लागू शकते. विशेषतः परवडणाऱ्या घरांसाठी (Affordable Housing) सरकार कधी-कधी स्टँप ड्युटी सवलत जाहीर करते.

खरेदी करण्यापूर्वी सध्याच्या सरकारी योजना तपासा आणि योग्य श्रेणीत नोंदणी करा.

## मार ४: ग्रामीण/ग्रामपंचायत क्षेत्रातील मालमत्ता

शहरी मालमत्तेवर ५% स्टँप ड्युटी लागते तर ग्रामीण/ग्रामपंचायत क्षेत्रातील मालमत्तेवर फक्त ४% लागते.

पुण्याच्या बाहेरच्या उपनगरांमध्ये (हवेली तालुका, मुळशी, खेड) अनेक भाग अजूनही ग्रामपंचायत क्षेत्रात येतात. खरेदीपूर्वी क्षेत्राचा प्रकार तपासा.

## मार्ग ५: योग्य रेडी रेकनर मूल्य वापरा

स्टँप ड्युटी मालमत्तेच्या बाजारमूल्य किंवा रेडी रेकनर मूल्य — यापैकी जे जास्त असेल त्यावर आकारली जाते. सरकारी रेडी रेकनर मूल्य काही भागांत बाजारमूल्यापेक्षा कमी असते.

अशा भागात बाजारमूल्यावर नाही तर रेडी रेकनर मूल्यावर स्टँप ड्युटी भरता येते — पूर्णपणे कायदेशीर. मुद्रांकसेवाचा कॅल्क्युलेटर रेडी रेकनर दरानुसार गणना करतो.

## महत्त्वाची सूचना

कमी मूल्य दाखवून स्टँप ड्युटी वाचवणे बेकायदेशीर आहे. मुद्रांक विभाग अशा व्यवहारांची तपासणी करतो आणि कमी मूल्यावर व्यवहार केल्यास मालमत्ता जप्त होऊ शकते, दंड होऊ शकतो. वरील ५ मार्ग पूर्णपणे कायदेशीर आहेत आणि सरकारने दिलेल्या सवलतींचा योग्य उपयोग करतात.

अचूक स्टँप ड्युटी मोजण्यासाठी मुद्रांकसेवाचा स्टँप ड्युटी कॅल्क्युलेटर वापरा. जिल्हानिहाय दर, महिला सवलत आणि क्षेत्र प्रकारानुसार अचूक गणना होते.
    `.trim(),
  },
]

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find(p => p.slug === slug)
}

export function getAllPosts(): BlogPost[] {
  return BLOG_POSTS.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
}
