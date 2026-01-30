export interface Awardee {
	id: string
	tier: string
	category: string
	awardee: string
	citation: string
	image?: string
	logo?: string
	type: 'individual' | 'institution' | 'country'
}

export const awardees: Awardee[] = [
	// TIER I – CONTINENTAL LEADERSHIP RECOGNITIONS
	{
		id: 'tier-i-1',
		tier: 'Tier I',
		category: 'Africa Trade Leader of the Year',
		awardee: 'Prof. Benedict Oramah (Former President of Afreximbank)',
		type: 'individual',
		image: '/assets/img/awardees/prof-benedict-oramah.jpg',
		citation: `Professor Benedict Oramah is recognised for his singular contribution to the quiet but consequential task of giving African trade a financial system capable of sustaining itself. His work did not seek to dramatise trade, but to make it dependable—less vulnerable to external withdrawal, and more firmly anchored in African institutions.

When he assumed leadership of the African Export–Import Bank, African trade finance remained exposed to forces beyond the continent's control. Liquidity was episodic, confidence uneven, and intra-African commerce more often discussed than executed. Over time, and with deliberate intent, Professor Oramah set about changing those conditions. He understood that trade matures not through declarations, but through institutions that endure pressure and reward execution.

Under his stewardship, Afreximbank evolved into such an institution. Its interventions during moments of global uncertainty were not acts of rescue, but of continuity—ensuring that goods moved, industries remained active, and African firms were not rendered idle by decisions taken elsewhere. Just as importantly, he directed attention inward, towards the structural obstacles that had long constrained trade between African economies themselves.

By advancing mechanisms that addressed settlement risk, liquidity constraints, and counterparty confidence, Professor Oramah helped make intra-African trade workable in practice rather than merely attractive in theory. His approach was marked by patience and restraint, favouring architecture over announcement and durability over display.

This award recognises a leader whose influence is best measured in resilience. Through steady institutional work, Professor Oramah helped establish the financial conditions under which African trade can continue, adapt, and grow—less dependent, more assured, and increasingly its own.`
	},
	{
		id: 'tier-i-2',
		tier: 'Tier I',
		category: 'Africa Trade Finance Architect of the Year',
		awardee: 'Afreximbank',
		type: 'institution',
		logo: '/assets/img/awardees/afreximbank.jpg',
		citation: `The African Export–Import Bank is recognised for its decisive role in reshaping the financial conditions under which African trade is conducted. Over the past decade, and with particular force during periods of global disruption, the Bank has moved trade finance in Africa from a position of fragility towards one of institutional strength.

Afreximbank's contribution lies not simply in the provision of capital, but in the manner in which that capital has been deployed. Its facilities were designed to absorb risk at moments when commercial appetite receded, allowing African trade to continue when confidence elsewhere faltered. In doing so, the Bank preserved the continuity of supply chains, protected industrial activity, and sustained the credibility of African counterparties in international and regional markets.

More fundamentally, Afreximbank addressed a long-standing constraint on African commerce: the difficulty of trading within the continent itself. By advancing settlement mechanisms, guarantees, and liquidity instruments aligned with the objectives of continental integration, the Bank helped reduce the practical barriers that had long separated African producers and markets. Trade between African firms became not merely desirable, but workable.

What distinguishes Afreximbank's role is the coherence of its approach. Finance was aligned with industrial development, policy ambition with execution, and short-term intervention with long-term institution-building. The result has been the emergence of a trade finance architecture capable of functioning under pressure and adapting to scale.

This award recognises Afreximbank as an institution that has quietly but decisively altered how African trade is financed—shifting it from dependence on external cycles towards systems rooted in African capacity, judgement, and resilience.`
	},
	// TIER II – INDUSTRY & STRATEGIC VALUE CHAIN RECOGNITIONS
	{
		id: 'tier-ii-1',
		tier: 'Tier II',
		category: 'Industrial Energy Project of the Year',
		awardee: 'Grand Ethiopian Renaissance Dam (GERD)',
		type: 'institution',
		logo: '/assets/img/awardees/grand-ethiopian-renaissance-dam.jpg',
		citation: `The Grand Ethiopian Renaissance Dam is recognised for its decisive contribution to the industrial foundations of the Horn of Africa and for altering, in durable ways, the relationship between energy supply and economic possibility in the region. Few projects on the continent have carried such far-reaching implications for production, trade, and long-term development.

At its core, the Dam addressed a constraint that has long limited industrial ambition: the absence of reliable, large-scale power. By delivering substantial baseload electricity, GERD has strengthened Ethiopia's capacity to support manufacturing, processing, and logistics at scale. Energy, in this context, is not an abstract public good but a practical enabler of industry, employment, and export activity.

The project's significance extends beyond national borders. By creating surplus generation potential, GERD has laid the groundwork for regional power trade, linking energy security to broader patterns of economic integration in East Africa. In doing so, it has repositioned electricity as a shared regional asset rather than a purely domestic concern.

Equally notable is the character of the undertaking itself. The Dam represents a long-term commitment to infrastructure whose benefits accrue gradually and whose value lies in consistency rather than immediacy. Its delivery required persistence, coordination, and confidence in the productive future it was designed to support.

This award recognises the Grand Ethiopian Renaissance Dam not as a symbol, but as a working asset—one that has materially strengthened the conditions under which industry can emerge, trade can expand, and regional economies can plan with greater certainty.`
	},
	{
		id: 'tier-ii-2',
		tier: 'Tier II',
		category: 'Advanced Manufacturing Excellence Award',
		awardee: 'Elsewedy Electric',
		type: 'institution',
		logo: '/assets/img/awardees/elsewedy-electric.jpg',
		citation: `Elsewedy Electric is recognised for establishing advanced manufacturing capacity in Africa that combines technical precision with scale, and for doing so in a manner that has quietly but materially strengthened the continent's industrial base. Its contribution lies not in experimentation or pilot activity, but in sustained production carried out to international standards across multiple jurisdictions.

Over time, Elsewedy Electric has built and operated manufacturing facilities producing cables, transformers, and electrical equipment essential to modern infrastructure and industry. These are products that demand consistency, engineering discipline, and rigorous quality control. By locating such manufacturing within Africa, the company has reduced reliance on imported industrial inputs while embedding technical capability in local economies.

What distinguishes Elsewedy's work is its integration into real industrial demand. Its factories supply power projects, industrial parks, transport systems, and export-oriented manufacturing zones across the continent. In this way, production is not abstracted from use; it is directly connected to the functioning of energy systems and trade corridors that underpin economic activity.

The company's operations reflect an understanding that advanced manufacturing depends as much on process as on machinery. Investment in skills, standards, and operational reliability has enabled its facilities to function as part of regional supply chains rather than isolated national assets.

This award recognises Elsewedy Electric for demonstrating that complex manufacturing can be designed, executed, and sustained within Africa at scale, contributing to industrial self-reliance and strengthening the foundations upon which trade and infrastructure depend.`
	},
	{
		id: 'tier-ii-3',
		tier: 'Tier II',
		category: 'Pharmaceutical & Health Manufacturing Excellence Award',
		awardee: 'Aspen Pharmacare',
		type: 'institution',
		logo: '/assets/img/awardees/aspen-pharmacare.jpg',
		citation: `Aspen Pharmacare is recognised for establishing and sustaining pharmaceutical manufacturing capacity in Africa at a level of technical depth and regulatory discipline rarely achieved on the continent. Its contribution lies not simply in the volume of medicines produced, but in the seriousness with which pharmaceutical manufacturing has been approached as an industrial and public responsibility.

Over time, Aspen has built facilities capable of producing complex formulations, including sterile injectables and essential medicines, under stringent international standards. These are operations that demand precision, compliance, and continuity. By situating such manufacturing within Africa, the company has strengthened regional supply resilience and reduced reliance on external sources for critical health products.

What distinguishes Aspen's work is its attention to the entire pharmaceutical ecosystem. Manufacturing has been aligned with quality assurance, regulatory engagement, and reliable distribution across multiple African markets. In doing so, Aspen has helped normalise the presence of advanced pharmaceutical production on the continent—not as an exception, but as a working standard.

The significance of this contribution became especially clear during periods of global supply disruption, when access to essential medicines could no longer be taken for granted. Aspen's facilities provided continuity where fragility might otherwise have prevailed, reinforcing the importance of domestic and regional manufacturing capacity in health systems.

This award recognises Aspen Pharmacare for demonstrating that Africa can host pharmaceutical manufacturing of the highest order, and for strengthening the industrial foundations upon which health security and regional trade increasingly depend.`
	},
	{
		id: 'tier-ii-4',
		tier: 'Tier II',
		category: 'Industrial Technology & Automation Award',
		awardee: 'Bakhresa Group',
		type: 'institution',
		logo: '/assets/img/awardees/bakhresa-group.jpg',
		citation: `Bakhresa Group is recognised for its disciplined application of industrial technology and automation across large-scale manufacturing operations in Africa. Its contribution lies not in technological novelty for its own sake, but in the practical deployment of systems that have improved consistency, efficiency, and scale within everyday production.

Across food and consumer goods manufacturing, Bakhresa has integrated automated processing, packaging, and quality-control systems into its operations, enabling reliable output across multiple facilities and countries. These are industries in which margins are narrow and standards exacting, and where the absence of process control quickly undermines competitiveness. By investing in automation as a tool of discipline rather than display, the Group has embedded industrial rigour within sectors often overlooked in discussions of advanced manufacturing.

What distinguishes Bakhresa's approach is its understanding that technology must serve production, not dominate it. Automation has been introduced to support throughput, reduce waste, and ensure consistency across regional supply chains, rather than to replace human capability. In doing so, the Group has strengthened its ability to serve regional markets reliably while maintaining cost control and product quality.

The cumulative effect of these systems has been the quiet normalisation of industrial standards across its operations, supporting cross-border distribution and contributing to regional trade in processed food and consumer products.

This award recognises Bakhresa Group for demonstrating how applied industrial technology, when thoughtfully implemented, can strengthen manufacturing performance and embed operational resilience within African industry.`
	},
	{
		id: 'tier-ii-5',
		tier: 'Tier II',
		category: 'Industrial Export Champion of the Year',
		awardee: 'OCP Group',
		type: 'institution',
		logo: '/assets/img/awardees/ocp-group.jpg',
		citation: `OCP Group is recognised for establishing one of Africa's most consequential industrial export platforms through the sustained production and global supply of phosphate rock, phosphoric acid, and phosphate-based fertilisers. Its work has repositioned Africa as a reliable industrial producer within global agricultural value chains, rather than solely a source of unprocessed mineral exports.

Over time, OCP has built a fully integrated value chain encompassing phosphate extraction, chemical processing, fertiliser manufacturing, and international distribution. This integration enabled the Group to move decisively beyond raw material exports into the large-scale supply of finished and semi-finished fertiliser products serving agricultural markets across Africa, Europe, the Americas, and Asia. In doing so, OCP established a consistent African presence in a sector central to global food security.

What distinguishes OCP's contribution is its long-term orientation. Investments in mining and processing capacity have been matched by investments in ports, logistics infrastructure, research, and product development. This has allowed the Group to maintain export reliability in markets where continuity of fertiliser supply is essential to agricultural planning and economic stability.

OCP's export leadership has also carried continental relevance. By expanding fertiliser production and distribution within African markets, the Group has supported soil health, crop productivity, and regional availability of critical agricultural inputs. Export success, in this context, has reinforced domestic and regional agricultural capacity rather than displacing it.

This award recognises OCP Group for demonstrating how African industry can compete globally through integrated production, disciplined execution, and sustained delivery of essential industrial products.`
	},
	// TIER III – MARKETS, CAPITAL & ENTERPRISE RECOGNITIONS
	{
		id: 'tier-iii-1',
		tier: 'Tier III',
		category: 'Trade Infrastructure & Logistics Excellence Award',
		awardee: 'Africa Global Logistics',
		type: 'institution',
		logo: '/assets/img/awardees/africa-global-logistics.jpg',
		citation: `Africa Global Logistics is recognised for its role in giving practical form to the movement of trade across the African continent. Its contribution lies in the operation of logistics systems that work consistently, across borders and corridors, and that translate infrastructure into usable commercial capacity.

Across ports, inland terminals, and transport corridors, Africa Global Logistics has built and operated integrated logistics platforms that reduce delay, fragmentation, and uncertainty in the movement of goods. These systems do not merely move cargo; they impose order on complex trade routes, enabling exporters, manufacturers, and importers to plan with greater confidence and reliability.

What distinguishes the company's work is its attention to continuity. Logistics, when poorly executed, becomes a source of cost and risk; when well executed, it disappears into the background of everyday commerce. Africa Global Logistics has focused on the latter—ensuring that trade flows function as a matter of routine rather than exception. Its operations link coastal gateways to inland markets, serving multiple economies and supporting both industrial and agricultural supply chains.

The company's footprint has also contributed to regional integration by aligning operational standards across jurisdictions, allowing goods to move through shared systems rather than fragmented national processes. In doing so, it has strengthened the physical foundations upon which intra-African trade depends.

This award recognises Africa Global Logistics for making trade movement dependable rather than aspirational, and for sustaining the quiet, essential work through which markets are connected and commerce becomes possible.`
	},
	{
		id: 'tier-iii-2',
		tier: 'Tier III',
		category: 'SME Trade Expansion Platform of the Year',
		awardee: 'Flutterwave',
		type: 'institution',
		logo: '/assets/img/awardees/flutterwave.jpg',
		citation: `Flutterwave is recognised for its role in making cross-border trade practicable for African small and medium-sized enterprises that had long been constrained by the mechanics of payment and settlement. Its contribution lies not in advocacy for inclusion, but in the construction of a platform through which inclusion could occur as a matter of routine business practice.

For many African enterprises, the principal obstacle to regional and international trade has not been the absence of markets, but the difficulty of receiving payment across borders with certainty, speed, and reasonable cost. Flutterwave addressed this constraint directly by building payment infrastructure that allows African businesses to transact across currencies and jurisdictions without recourse to complex intermediary arrangements.

What distinguishes Flutterwave's impact is its focus on execution rather than abstraction. By integrating payment acceptance, settlement, and reconciliation into a single platform, it enabled small enterprises, traders, and service providers to participate in regional and global commerce on terms previously available only to larger firms. In doing so, it lowered the threshold for export activity and cross-border service provision.

The platform's scale has also had systemic implications. As more enterprises transact through common payment rails, informal trade becomes formalised, records become auditable, and commercial relationships become easier to sustain. This, in turn, strengthens trust within markets and improves the conditions for further enterprise growth.

This award recognises Flutterwave for translating digital infrastructure into executed trade, and for expanding the practical reach of African enterprise by making payment—a basic but decisive function—work reliably across borders.`
	},
	{
		id: 'tier-iii-3',
		tier: 'Tier III',
		category: 'Intra-African Trade Systems Champion of the Year',
		awardee: 'Rwanda',
		type: 'country',
		logo: '/assets/img/awardees/rwanda.jpg',
		citation: `The Republic of Rwanda is recognised for demonstrating how national systems, when coherently designed and consistently executed, can materially improve the functioning of regional trade. Its contribution lies not in the scale of its economy, but in the seriousness with which trade facilitation has been treated as a matter of institutional practice rather than policy declaration.

Over time, Rwanda has developed an integrated trade execution framework that links customs efficiency, border management, standards enforcement, and private-sector enablement into a single operational logic. Measures such as the effective use of electronic single-window systems and the practical operation of one-stop border posts have reduced clearance times and improved predictability for traders moving goods across regional corridors.

What distinguishes Rwanda's approach is consistency. Reforms have been carried through to implementation, and coordination between agencies has been maintained beyond initial launch. As a result, regional traders experience Rwanda not as a point of friction, but as a dependable node within East and Central African trade routes.

The effects of these systems extend beyond national borders. By improving the reliability of transit and clearance, Rwanda has strengthened corridor performance for neighbouring economies and contributed to wider regional market integration. Trade facilitation, in this context, has functioned as shared infrastructure rather than isolated national reform.

This award recognises Rwanda for showing that intra-African trade advances not only through grand frameworks, but through the patient construction of systems that work daily, quietly, and with discipline.`
	},
	{
		id: 'tier-iii-4',
		tier: 'Tier III',
		category: 'Trade & Industrial Finance Institution of the Year',
		awardee: 'Trade & Development Bank',
		type: 'institution',
		logo: '/assets/img/awardees/trade-development-bank.jpg',
		citation: `The Trade and Development Bank is recognised for its sustained role in enabling trade and industrial activity across Eastern and Southern Africa through finance that is both patient and practical. Its contribution lies not in scale for its own sake, but in the consistency with which it has supported enterprises, corridors, and projects that require long-term commitment rather than episodic capital.

Operating in a region where cross-border trade is often shaped by infrastructure gaps and varying market conditions, TDB has focused on financing that connects rather than fragments. Its facilities have supported manufacturing, agriculture, energy, and trade corridors, allowing enterprises to operate across borders with greater continuity and predictability. In particular, the Bank's structured trade finance and project finance instruments have bridged the needs of land-linked economies and coastal gateways, strengthening regional market access.

What distinguishes TDB's work is its ability to operate at the intersection of public purpose and commercial discipline. By working with governments, private enterprises, and regional institutions, the Bank has mobilised capital in ways that align national priorities with regional integration. Risk has been managed with judgement rather than avoidance, enabling projects to proceed where purely commercial finance would hesitate.

The Bank's influence is cumulative. Each transaction strengthens confidence in regional markets, reinforces trade corridors, and contributes to a record of execution upon which further investment can build. Over time, this has deepened the financial underpinnings of intra-regional trade and industrial activity.

This award recognises the Trade and Development Bank for its quiet but consequential role in sustaining the financial conditions under which regional trade and industry can take root, expand, and endure.`
	},
	{
		id: 'tier-iii-5',
		tier: 'Tier III',
		category: 'Enterprise and Expansion Award',
		awardee: 'Ethiopian Airlines',
		type: 'institution',
		logo: '/assets/img/awardees/ethiopian-airlines.jpg',
		citation: `Ethiopian Airlines is recognised for building, with consistency and foresight, one of Africa's most consequential enterprises in trade connectivity and logistics. Its expansion over recent years has not been incidental growth, but the outcome of a disciplined strategy that treats aviation as economic infrastructure rather than as transport alone.

While much of global aviation contracted during periods of disruption, Ethiopian Airlines strengthened its cargo operations, logistics hubs, fleet capability, and route networks. In doing so, it assumed a role that extended beyond commercial aviation into the practical maintenance of supply chains—supporting the movement of medical supplies, industrial cargo, and time-sensitive goods across African markets and beyond.

What distinguishes the airline's expansion is its systemic character. Investment in aircraft was matched by investment in cargo terminals, maintenance capability, training, and digital logistics systems. These elements combined to create an enterprise capable of scaling under pressure and adapting to changing trade patterns, rather than retreating from them.

The airline's network has also contributed materially to intra-African trade by linking producers to markets that would otherwise remain distant or costly to reach. For land-linked economies in particular, Ethiopian Airlines has functioned as an export corridor in the air, reducing time, uncertainty, and logistical complexity.

This award recognises Ethiopian Airlines for demonstrating how an African enterprise, when governed with clarity and operational discipline, can expand into a platform that serves not only commercial objectives but the wider requirements of trade, resilience, and regional integration.`
	},
	{
		id: 'tier-iii-6',
		tier: 'Tier III',
		category: 'Women in Trade & Industry Leadership Award',
		awardee: 'Patricia Poku-Diaby',
		type: 'individual',
		image: '/assets/img/awardees/patricia-poku-diaby.jpg',
		citation: `Patricia Poku-Diaby is recognised for her leadership in advancing industrial value addition within African agriculture, and for doing so through enterprise rather than advocacy. Her work has demonstrated how executive authority, when exercised with clarity and discipline, can translate primary production into industrial output capable of serving regional and international markets.

As founder and chief executive of Plot Enterprise Group, she led the development of large-scale agro-processing operations in cocoa and food manufacturing—sectors long characterised by export of raw material and limited domestic transformation. Under her direction, processing capacity was expanded, supply chains professionalised, and African agricultural inputs repositioned as industrial products rather than commodities in transit.

What distinguishes her contribution is its commercial seriousness. Investments were directed toward infrastructure, quality control, logistics, and market access, ensuring that production met the standards required for sustained trade. In doing so, her enterprise strengthened regional supply chains and retained greater value within African economies, while creating employment and technical capacity at scale.

Her leadership has also carried broader significance. By occupying and exercising authority within capital-intensive, male-dominated industrial sectors, she has quietly widened the space for women's leadership in trade and manufacturing—not through symbolism, but through performance.

This award recognises Patricia Poku-Diaby for demonstrating how industrial leadership, grounded in execution and market relevance, can contribute materially to Africa's trade capacity and economic resilience.`
	},
	// TIER IV – TRADE POLICY, SYSTEMS & MARKET IMPACT
	{
		id: 'tier-iv-1',
		tier: 'Tier IV',
		category: 'Trade Infrastructure & Systems Impact Award',
		awardee: 'Pan-African Payment and Settlement System (PAPSS)',
		type: 'institution',
		logo: '/assets/img/awardees/papss.jpg',
		citation: `The Pan-African Payment and Settlement System is recognised for addressing one of the most persistent and least visible constraints on African trade: the difficulty of settling transactions between African countries without recourse to external currencies and correspondent banking systems. Its contribution lies in transforming payment from a structural obstacle into a functional enabler of intra-African commerce.

For decades, African firms trading with one another were compelled to route transactions through third-party currencies, incurring avoidable cost, delay, and risk. PAPSS altered this condition by enabling cross-border settlement in local currencies, allowing African businesses to transact directly and with greater certainty. In doing so, it reduced dependency on external financial systems and improved the practicality of regional trade.

What distinguishes PAPSS is not merely its technical design, but its systemic intent. The platform was conceived as shared trade infrastructure—one that serves banks, businesses, and payment systems across jurisdictions rather than privileging any single market. Its rollout has required coordination among central banks, financial institutions, and regulators, reflecting a seriousness of purpose often absent from payment reform.

The effects of PAPSS extend beyond efficiency. By lowering transaction costs and improving settlement predictability, it has strengthened trust between trading partners and widened participation in cross-border trade, particularly for smaller firms previously excluded by complexity.

This award recognises PAPSS for quietly re-engineering the financial plumbing of African trade, and for laying foundations upon which deeper market integration and commercial confidence can be built.`
	},
	// TIER V – DISTINGUISHED RECOGNITION
	{
		id: 'tier-v-1',
		tier: 'Tier V',
		category: 'Distinguished Recognition',
		awardee: 'Gervais Koffi Djondo',
		type: 'individual',
		image: '/assets/img/awardees/gervais-koffi-djondo.jpg',
		citation: `Gervais Koffi Djondo is recognised for a lifetime devoted to the patient construction of Africa's trade and private-sector institutions, and for a form of leadership whose influence is measured less by visibility than by durability. His work belongs to a generation of builders who understood that African commerce would only mature when supported by institutions capable of outlasting personalities and political cycles.

Over several decades, Mr Djondo played a formative role in creating platforms through which African enterprise could organise itself, engage governments, and participate with confidence in regional and international markets. As a co-founder of Ecobank, he helped establish a pan-African financial institution at a time when cross-border banking on the continent was more aspiration than practice. Later, as founder and chairman of ASKY Airlines, he contributed to restoring reliable regional air connectivity, addressing a practical constraint on trade, mobility, and integration that had long undermined economic cooperation.

What distinguishes his legacy is not any single enterprise, but a consistent commitment to structure. He worked to replace fragmentation with organisation, informality with process, and isolation with dialogue. Through chambers, networks, and commercial institutions, he helped normalise the presence of African private-sector voices within policy discourse, diplomacy, and international commerce.

His contribution reflects a long view of integration. Rather than pursuing immediate advantage, he invested in trust, institutional memory, and continuity—elements without which regional trade cannot be sustained. Many of today's trade initiatives and business platforms rest, in part, on foundations laid through such steady effort.

This award recognises Gervais Koffi Djondo for a legacy defined by institution-building rather than prominence, and for helping to establish the conditions under which African trade could develop with confidence, coherence, and purpose.`
	}
]
