import {economyModel} from './analysis-model.js';
import {freshness} from './source-policy.js';
import {esc,safeLink,presentation,lineChart,evidence} from './evidence.js';
// Registry is a coverage contract. A listed indicator is never evidence of an active feed.
const raw=`1|activity|Pertumbuhan ekonomi riil|Real GDP growth|g(PDB harga konstan)|Produksi bertambah belum memastikan penghasilan setiap keluarga meningkat.|More output does not ensure every family's income rises.|BPS|quarterly
2|activity|Konsumsi rumah tangga|Household consumption|g(konsumsi riil)|Menunjukkan apakah pembelian masyarakat menguat; baca bersama distribusi pengeluaran.|Shows whether household demand strengthens; read alongside its distribution.|BPS|quarterly
3|activity|Investasi / PMTB|Investment / fixed capital|g(PMTB riil); porsi = PMTB nominal / PDB nominal|Tambahan kapasitas dapat mendukung produksi; pertumbuhan investasi bukan porsi PDB.|New capacity may support output; investment growth is not a GDP share.|BPS|quarterly
4|activity|Kegiatan manufaktur / PMI-BI|Manufacturing / PMI-BI|Indeks resmi; titik pembanding 50|Ekspansi survei bukan kepastian pesanan atau lowongan baru.|Survey expansion does not guarantee orders or new jobs.|BI|quarterly
5|activity|Keyakinan konsumen|Consumer confidence|Indeks resmi; titik pembanding 100|Optimisme responden bukan bukti semua orang lebih sejahtera.|Respondent optimism does not prove universal prosperity.|BI|monthly
6|activity|Inflasi umum|Headline inflation|(IHK t / IHK pembanding − 1) × 100%|Harga rata-rata naik seberapa cepat; pengalaman setiap keranjang belanja berbeda.|How fast average prices rise; individual spending baskets differ.|BPS / BI|monthly
7|activity|Inflasi inti|Core inflation|(indeks inti t / indeks inti t−12 − 1) × 100%|Membaca tekanan harga persisten; tidak mengurangkan indeks VF/AP dari indeks total.|Tracks persistent price pressures; do not subtract VF/AP indices from the headline index.|BPS / BI|monthly
8|activity|Inflasi pangan bergejolak|Volatile-food inflation|Perubahan indeks VF resmi|Pangan dapat lebih membebani keluarga daripada angka inflasi nasional.|Food costs may burden families more than national headline inflation suggests.|BPS / BI|monthly
9|society|Upah nominal buruh|Nominal employee wages|Rata-rata upah resmi; g(upah)|Mengukur penghasilan buruh, bukan seluruh pekerja atau pendapatan median.|Measures employee pay, not all workers' income or median income.|BPS|semester
10|society|Pertumbuhan upah riil|Real wage growth|[(1+g upah)/(1+inflasi)−1] × 100%|Jika negatif, penghasilan buruh rata-rata belum mengejar harga pada periode yang sama.|When negative, average employee pay has not kept up with same-period prices.|BPS + BI|derived
11|society|Pengangguran terbuka|Open unemployment|penganggur / angkatan kerja × 100%|Pengangguran rendah belum menjelaskan kecukupan jam kerja dan gaji.|Low unemployment does not describe adequate hours or wages.|BPS|semester
12|society|Setengah pengangguran|Underemployment|setengah penganggur / seluruh pekerja × 100%|Bekerja kurang dari jam normal dan masih mencari/bersedia menerima pekerjaan.|Works below normal hours and still seeks or is available for more work.|BPS|semester
13|society|Pekerjaan informal|Informal employment|pekerja informal / seluruh pekerja × 100%|Membaca struktur dan perlindungan kerja; informal tidak otomatis berarti miskin.|Describes employment structure and protection; informal does not automatically mean poor.|BPS|semester
14|society|Kemiskinan|Poverty rate|penduduk di bawah garis kemiskinan / penduduk × 100%|Menunjukkan keterbatasan kebutuhan dasar; di atas garis pun masih bisa rentan.|Shows basic-needs deprivation; households above the line may remain vulnerable.|BPS|semester
15|society|Kedalaman kemiskinan / P1|Poverty gap / P1|(1/n) Σ [(z−yi)/z], untuk yi < z|Membaca seberapa jauh pengeluaran penduduk miskin dari kebutuhan dasarnya.|Measures how far poor people's expenditure falls below the basic-needs threshold.|BPS|semester
16|society|Ketimpangan pengeluaran / Gini|Expenditure inequality / Gini|1 − Σ[(Xi−Xi−1)(Yi+Yi−1)]|Rata-rata membaik bisa bersamaan dengan ketimpangan; bukan ukuran kekayaan.|An improving average can coexist with inequality; this is not wealth inequality.|BPS|semester
17|society|Pemuda NEET|Youth NEET|pemuda tidak bekerja/sekolah/pelatihan / pemuda × 100%|Menunjukkan keterputusan jalur kerja dan belajar; berbeda dari pengangguran muda.|Shows disconnection from work and learning; differs from youth unemployment.|BPS / ILOSTAT|annual
18|society|Konsumsi riil per kapita|Real consumption per capita|konsumsi riil / penduduk; g(hasil)|Melengkapi upah karena tidak semua orang menerima gaji; bukan belanja tiap keluarga.|Complements wages because not everyone earns a salary; not each family's spending.|BPS|quarterly
19|fiscal|Pendapatan negara|Government revenue|perpajakan + PNBP + hibah|Pemasukan mendukung layanan; bandingkan dengan periode sama dan target.|Receipts support services; compare like-for-like periods and targets.|Kemenkeu|monthly
20|fiscal|Penerimaan perpajakan|Tax receipts|pajak + kepabeanan dan cukai, sesuai cakupan|Bedakan bruto, neto, restitusi dan perubahan kebijakan sebelum menyimpulkan ekonomi melemah.|Separate gross/net receipts, refunds and policy changes before inferring economic weakness.|Kemenkeu|monthly
21|fiscal|Belanja negara|Government expenditure|belanja pusat + transfer ke daerah|Nilai belanja belum membuktikan layanan selesai atau manfaatnya diterima.|Spending does not establish completed services or benefits received.|Kemenkeu|monthly
22|fiscal|Bantuan sosial|Social assistance|realisasi / pagu × 100%; perubahan yoy|Menopang penerima; realisasi belum mengukur ketepatan sasaran atau kemiskinan yang berkurang.|Supports recipients; execution alone does not measure targeting or poverty reduced.|Kemenkeu|monthly
23|fiscal|Subsidi dan kompensasi|Subsidies and compensation|nilai menurut klasifikasi resmi; tanpa hitung ganda|Menahan sebagian biaya masyarakat sekaligus menggunakan ruang anggaran.|Cushions some household costs while using fiscal resources.|Kemenkeu|monthly
24|fiscal|Transfer ke daerah|Regional transfers|realisasi / pagu; perubahan yoy|Dana disalurkan belum sama dengan proyek atau layanan daerah selesai.|Transfers disbursed do not imply completed local projects or services.|Kemenkeu / DJPK|monthly
25|fiscal|Saldo APBN|Budget balance|pendapatan − belanja; saldo / PDB|Saldo negatif berarti kebutuhan pembiayaan, bukan otomatis negara kehabisan uang.|A negative balance implies financing needs, not automatic insolvency.|Kemenkeu|monthly
26|fiscal|Keseimbangan primer|Primary balance|pendapatan − (belanja − bunga)|Apakah pendapatan cukup untuk belanja sebelum bunga; bukan indikator tunggal ketahanan.|Whether revenue covers non-interest spending; not a standalone resilience measure.|Kemenkeu|monthly
27|fiscal|Beban bunga / pendapatan|Interest / revenue|bunga / pendapatan × 100%|Dari Rp100 pemasukan, berapa terserap bunga; bukan ramalan pemotongan bantuan.|How much of each IDR100 in revenue pays interest; not a forecast of benefit cuts.|Kemenkeu|derived
28|fiscal|Utang pemerintah / PDB|Government debt / GDP|posisi utang pemerintah / PDB nominal tahunan|Skala kewajiban perlu dibaca bersama biaya, mata uang dan jatuh temponya.|Read the scale of obligations with costs, currency and maturities.|DJPPR|monthly
29|fiscal|Profil jatuh tempo utang|Debt maturity profile|pokok jatuh tempo per tahun|Menunjukkan kapan pembiayaan ulang diperlukan; rasio utang saja tidak menunjukkan waktunya.|Shows when refinancing is needed; a debt ratio alone does not show timing.|DJPPR|periodic
30|external|Kurs rupiah / JISDOR|Rupiah / JISDOR|g(Rp per USD)|Angka naik berarti rupiah melemah; dampaknya berbeda bagi importir dan penerima dolar.|A rise means rupiah depreciation; importers and dollar earners face different effects.|BI|daily
31|external|Cadangan devisa|Foreign-exchange reserves|posisi resmi; perubahan bulanan|Bantalan pembayaran luar negeri, bukan saldo yang bebas dibelanjakan untuk APBN.|An external-payment buffer, not a freely spendable budget balance.|BI|monthly
32|external|Cakupan impor|Import coverage|cadangan / rata-rata impor bulanan|Sebutkan apakah cakupan impor saja atau termasuk pembayaran utang pemerintah.|Specify whether coverage includes only imports or also government debt payments.|BI|monthly
33|external|Transaksi berjalan|Current account|neto barang+jasa+pendapatan primer+sekunder; / PDB|Defisit perlu pembiayaan; tidak otomatis krisis jika pembiayaannya berkelanjutan.|A deficit needs financing; it is not automatically a crisis if financing is sustainable.|BI|quarterly
34|external|Neraca perdagangan barang|Goods trade balance|ekspor barang − impor barang|Surplus barang belum berarti surplus seluruh transaksi luar negeri.|A goods surplus is not a surplus across all external transactions.|BPS|monthly
35|external|Arus portofolio asing|Foreign portfolio flows|beli − jual per instrumen dan rentang yang sama|Saham, SBN dan SRBI harus dipisahkan; posisi kepemilikan bukan transaksi neto.|Separate equities, SBN and SRBI; holdings are not net transactions.|BEI / DJPPR / BI|mixed
36|external|Investasi langsung asing|Foreign direct investment|arus investasi langsung; atau / PDB|Berbeda dari dana portofolio; realisasi PMA dan neraca pembayaran juga berbeda cakupan.|Differs from portfolio funds; investment realisation and balance-of-payments FDI have different scopes.|BI|quarterly
37|finance|BI-Rate|BI policy rate|keputusan resmi; perubahan basis poin|Bunga cicilan dan deposito dapat mengikuti dengan jeda sesuai kontrak.|Loan and deposit rates may adjust with a lag under their own contracts.|BI|decision
38|finance|Pertumbuhan uang beredar / M2|Broad-money growth / M2|g(M2)|Pertambahan likuiditas bukan berarti setiap keluarga menerima uang tambahan.|More liquidity does not mean every household receives more money.|BI|monthly
39|finance|Pertumbuhan kredit|Credit growth|g(kredit); pecah menurut penggunaan dan debitur|Kredit bertambah untuk siapa dan untuk apa, bukan besar totalnya saja.|Who receives new lending and for what purpose matters, not just the total.|OJK / BI|monthly
40|finance|Modal bank / CAR|Bank capital / CAR|modal regulasi setelah penyesuaian / ATMR × 100%|Bantalan menyerap kerugian; bandingkan dengan persyaratan bank yang relevan.|A loss-absorption buffer; compare with the relevant bank-specific requirement.|OJK / bank|quarterly
41|finance|Kredit bermasalah / NPL|Non-performing loans / NPL|kredit bermasalah bruto / kredit × 100%|Lebih tinggi berarti bagian kredit bermasalah lebih besar; periksa tren dan pencadangan.|A higher value means a greater troubled-loan share; inspect trends and provisions.|OJK / bank|quarterly
42|finance|Kredit berisiko / LaR|Loans at risk / LaR|(NPL + perhatian khusus + restrukturisasi lancar) / kredit|Kategori tidak boleh bertumpuk agar satu kredit tidak dihitung dua kali.|Categories must not overlap or the same loan is counted twice.|OJK / bank|quarterly
43|finance|Cakupan pencadangan|Provision coverage|CKPN sesuai cakupan laporan / NPL bruto nominal|Pencadangan bukan uang kas; cakupan pembilang harus sama antarbank.|Provisions are not cash; numerator scope must be comparable across banks.|Bank|quarterly
44|finance|Likuiditas 30 hari / LCR|30-day liquidity / LCR|HQLA / net cash outflow stres 30 hari × 100%|Bantalan untuk skenario stres jangka pendek, bukan bukti bank tanpa risiko.|A short-term stress buffer, not proof a bank has no risk.|Bank / OJK|quarterly
45|finance|Pendanaan stabil / NSFR|Stable funding / NSFR|ASF / RSF × 100%, dengan bobot regulasi|Menilai dukungan pendanaan stabil terhadap kebutuhan aset.|Assesses stable funding against asset funding needs.|Bank / OJK|quarterly
46|finance|Bunga deposito|Deposit rates|tarif per nominal, tenor, kanal; hasil bersih setelah pajak/biaya|Bandingkan penawaran yang setara; bunga besar tidak otomatis bank bermasalah.|Compare equivalent offers; a high rate alone does not show a troubled bank.|Bank|product
47|finance|Selisih bunga terhadap LPS|Rate gap to LPS ceiling|bunga yang diperhitungkan − TBP sesuai periode|Memeriksa satu syarat penjaminan; bukan putusan seluruh simpanan dijamin.|Checks one guarantee condition, not whether the whole deposit is covered.|LPS / bank|decision
48|markets|IHSG|Jakarta Composite Index|(indeks t / indeks pembanding − 1) × 100%|Harga saham agregat bukan ukuran langsung kesejahteraan semua rakyat.|Aggregate share prices do not directly measure everyone's welfare.|BEI|daily
49|markets|Kurva yield SBN|Government yield curve|yield per tenor; 10 tahun − 2 tahun|Tambahan hasil untuk waktu lebih lama, sekaligus tambahan sensitivitas harga.|Extra yield for longer maturities also brings price sensitivity.|ADB / pasar resmi|daily
50|markets|Nilai wajar obligasi|Modelled bond value|PV = Σ CFt / (1+rt)^t; clean = dirty − accrued interest|Murah/mahal relatif terhadap asumsi diskonto; harga di bawah 100 belum tentu murah.|Cheap or expensive relative to discount assumptions; below par is not necessarily cheap.|Kuotasi + kurva + arus kas|model
51|advanced|ICOR|ICOR|investasi riil / perubahan output riil, dengan jeda yang dinyatakan|Pendekatan kebutuhan modal, bukan penilaian otomatis mutu tiap proyek.|A capital-requirement approximation, not an automatic project-quality score.|BPS|model
52|advanced|Pertumbuhan TFP|TFP growth|gA ≈ gY − αgK − (1−α)gL|Residual model mencakup keterbatasan pengukuran; bukan angka produktivitas murni.|The model residual includes measurement limits; not pure measured productivity.|BPS + model modal/tenaga kerja|model
53|advanced|DSR utang luar negeri|External debt-service ratio|pokok+bunga sesuai tier / penerimaan transaksi berjalan|Tekanan pembayaran luar negeri; Tier 1 dan Tier 2 berbeda cakupan.|External repayment pressure; Tier 1 and Tier 2 differ in scope.|BI / SULNI|quarterly
54|advanced|Cadangan penjaminan LPS|Deposit-insurance fund ratios|cadangan / total simpanan; cadangan / simpanan dijamin|Dua denominator berbeda; tidak menunjukkan kemampuan membayar semua bank sekaligus.|Two different denominators; not a measure of paying out all banks simultaneously.|LPS|periodic
55|advanced|Spread kredit obligasi|Bond credit spread|yield obligasi − acuan sebanding|Samakan mata uang, tenor/durasi dan fitur; SBN rupiah minus UST dolar bukan risiko kredit murni.|Match currency, maturity/duration and features; IDR SBN minus USD UST is not pure credit risk.|Harga + rating + kurva|model
56|advanced|Durasi dan konveksitas|Duration and convexity|ΔP/P ≈ −Dmod Δy + 0.5 C (Δy)^2|Memperkirakan perubahan harga jika yield bergeser; perubahan besar perlu valuasi ulang.|Approximates price response to yield shifts; large changes need full repricing.|Arus kas obligasi|model
57|advanced|Rasio cicilan pribadi|Personal debt-service ratio|seluruh cicilan / penghasilan bersih bulanan|Baca sisa uang untuk kebutuhan, bukan patuh pada satu ambang universal.|Assess money left for essentials, not compliance with a universal threshold.|Input pribadi|input
58|advanced|Stress test modal bank|Bank capital stress test|modal setelah skenario / ATMR setelah skenario|Simulasi bersyarat dengan data publik terbatas, bukan vonis bank akan gagal.|A conditional public-data simulation, not a prediction that a bank will fail.|Laporan bank + model|model
59|advanced|Partisipasi angkatan kerja|Labour-force participation|angkatan kerja / penduduk usia kerja × 100%|Pengangguran turun perlu diperiksa bersama orang yang masuk/keluar pasar kerja.|Read falling unemployment with labour-market entry and exit.|BPS|semester
60|advanced|Profitabilitas bank / ROA|Bank profitability / ROA|laba sesuai definisi / rata-rata aset × 100%|Melengkapi modal dan likuiditas; laba tinggi saja bukan jaminan aman.|Complements capital and liquidity; high profit alone is no safety guarantee.|OJK / bank|quarterly`;
export const INDICATORS=raw.split('\n').map(line=>{const [no,group,id,en,formula,meaning,meaningEn,source,frequency]=line.split('|');return {no:+no,group,id,en,formula,meaning,meaningEn,source,frequency};});
const formulasEn=`g(real GDP)
g(real household consumption)
g(real fixed investment); share = nominal fixed investment / nominal GDP
Official index; expansion reference = 50
Official index; optimism reference = 100
(CPI t / comparison CPI − 1) × 100%
(core CPI t / core CPI t−12 − 1) × 100%
Change in the official volatile-food index
Official average wages; g(wages)
[(1+wage growth)/(1+inflation)−1] × 100%
Unemployed / labour force × 100%
Underemployed / all employed people × 100%
Informal workers / all employed people × 100%
Population below the poverty line / total population × 100%
(1/n) Σ [(z−yi)/z], for yi < z
1 − Σ[(Xi−Xi−1)(Yi+Yi−1)]
Youth not in employment, education or training / youth population × 100%
Real consumption / population; g(result)
Tax revenue + non-tax revenue + grants
Taxes + customs and excise, with consistent scope
Central expenditure + regional transfers
Actual / budget × 100%; same-period annual change
Official subsidy and compensation categories, without double counting
Actual / budget; same-period annual change
Revenue − expenditure; balance / GDP
Revenue − (expenditure − interest)
Interest payments / revenue × 100%
Government debt stock / annual nominal GDP
Principal falling due, by year
g(IDR per USD)
Official reserve stock; monthly change
Reserves / average monthly imports
Net goods + services + primary and secondary income; / GDP
Goods exports − goods imports
Purchases − sales, for the same instrument and period
Direct-investment flows; or flows / GDP
Official decision; change in basis points
g(broad money, M2)
g(credit), by use and borrower group
Adjusted regulatory capital / risk-weighted assets × 100%
Gross non-performing loans / total loans × 100%
(NPL + special mention + performing restructured loans) / loans
Provisions with the disclosed scope / gross NPL amount
HQLA / stressed 30-day net cash outflows × 100%
Available stable funding / required stable funding × 100%
Rates by balance, term and channel; after-tax, after-fee proceeds
Applicable offered interest − applicable guarantee-rate ceiling
(Index t / comparison index − 1) × 100%
Yield by tenor; 10-year yield − 2-year yield
PV = Σ CFt / (1+rt)^t; clean = dirty − accrued interest
Real investment / change in real output, with specified lags
gA ≈ gY − αgK − (1−α)gL
Principal + interest under the selected tier / current-account receipts
Insurance reserves / total deposits; reserves / covered deposits
Bond yield − comparable reference yield
ΔP/P ≈ −Dmod Δy + 0.5 C (Δy)^2
All monthly debt payments / monthly net income
Post-scenario regulatory capital / post-scenario risk-weighted assets
Labour force / working-age population × 100%
Profit under the disclosed definition / average assets × 100%`.split('\n');
const frequencies={quarterly:['Triwulanan','Quarterly'],monthly:['Bulanan','Monthly'],semester:['Mengikuti rilis semesteran','Following semiannual releases'],annual:['Tahunan','Annual'],derived:['Dihitung dari input sebanding','Calculated from comparable inputs'],daily:['Hari kerja/bursa','Business/trading days'],periodic:['Sesuai publikasi','As published'],mixed:['Berbeda per instrumen','Varies by instrument'],decision:['Saat keputusan berubah','On policy changes'],product:['Saat tarif produk berubah','On product-rate changes'],model:['Mengikuti input dan asumsi','Follows inputs and assumptions'],input:['Saat input diubah','On input changes']};
const sourceLinks={BPS:'https://webapi.bps.go.id/developer/',BI:'https://www.bi.go.id/id/statistik/Default.aspx',fiscal:'https://www.kemenkeu.go.id/apbnkita',bank:'https://data.ojk.go.id/SJKPublic',market:'https://www.idx.id/id/produk/layanan-data-bei',bond:'https://asianbondsonline.adb.org/indonesia/'};
function latest(rows,id){return rows?.find(x=>x.id===id&&Number.isFinite(x.value));}
export function resolveIndicator(def,data){
 data??={};const e=economyModel(data),m=id=>latest(data.metrics,id),s=id=>latest(data.social,id),d=id=>latest(data.drivers,id),f=e.fiscal;
 const direct={1:e.gdp,2:d('household'),3:d('investment'),4:m('manufacturing'),5:m('confidence'),6:m('inflation'),9:s('bpsWage'),11:s('bpsJobs'),14:s('bpsPoverty'),17:latest(data.structural,'neet'),18:d('consumptionPerCapita'),30:m('jisdor'),31:m('fxreserves'),32:m('reserves'),33:m('currentaccount'),36:m('fdi'),37:m('rate'),59:s('labourParticipation')};
 let row=direct[def.no],basis=null;
 if(row&&[2,3,18].includes(def.no))basis=['Pertumbuhan riil tahunan WDI; bukan seri triwulanan BPS.','Annual WDI real growth; not the quarterly BPS series.'];
 if(row&&[32,33,36].includes(def.no))basis=['Konteks tahunan WDI; belum menggantikan seri BI berfrekuensi lebih tinggi.','Annual WDI context; not a replacement for higher-frequency BI data.'];
 if(row&&def.no===9)basis=['Rata-rata upah buruh, Rp juta/bulan.','Average employee wages, IDR million/month.'];
 if(def.no===7)row=m('coreInflation');if(def.no===8)row=m('foodInflation');if(def.no===38)row=m('m2Growth');
 if(def.no===10&&e.realWage)row={...e.wage,id:'realWage',value:e.realWage.real,unit:'%',history:[],basis:'derived'};
 if(f){const key={19:'revenue',21:'spending',25:'balance',26:'primary'}[def.no];if(key&&Number.isFinite(f[key]))row={...f,id:'fiscal',value:f[key],unit:'Rp T',history:(data.fiscalHistory||[]).filter(x=>Number.isFinite(x[key])).map(x=>({period:x.period,value:x[key]}))};if(def.no===27&&Number.isFinite(e.interestShare))row={...f,id:'fiscal',value:e.interestShare,unit:'%',history:[],basis:'derived'};
 const detail={22:'social',23:'subsidy',24:'transfers'}[def.no],part=f.details?.find(x=>x.id===detail);if(part)row={...f,...part,id:'fiscal',unit:'Rp T',history:[]};}
 if(def.no===16){const b=s('bpsGini');if(b)row=b;else if(d('gini')){row=d('gini');basis=['Gini WDI/PIP pada skala 0–100; bukan seri BPS 0–1.','WDI/PIP Gini on a 0–100 scale; not the BPS 0–1 series.'];}}
 if(def.no===35&&m('srbiflow')){row=m('srbiflow');basis=['Hanya transaksi SRBI pada jendela tertera; saham dan SBN belum digabung.','SRBI transactions for the stated window only; equities and SBN are not combined.'];}
 if(def.no===49&&data.bondMarket?.points?.length){const b=data.bondMarket,y=b.points.find(x=>x.tenor===10);if(y)row={...b,id:'bondMarket',value:y.yield,unit:'%',history:[]};basis=['Yield acuan 10 tahun; buka Obligasi untuk kurva dan harga per seri.','10-year reference yield; open Bonds for the curve and series quotes.'];}
 const multi={40:'car',41:'npl',42:'lar',43:'coverage',44:'lcr',45:'nsfr',60:'roa'}[def.no];
 const banks=multi?(data.bankHealth||[]).filter(x=>Number.isFinite(x.metrics?.[multi]?.value)):null;
 const count=def.no===46?(data.deposits||[]).filter(x=>x.tiers?.some(t=>Object.values(t.rates||{}).some(Number.isFinite))).length:def.no===50?data.bondQuotes?.rows?.length:banks?.length;
 const multiRoute=[46,47,50,55,56,57].includes(def.no)||!!multi;
 const available=!!row||!!count||(def.no===47&&!!data.lps);
 const state=row?freshness(row,row.id).state:available?'partial':'unavailable';
 return {def,row,basis,banks,count,available,state,route:multiRoute?(def.no===57?'#pilihan/tool/cash':def.no>=50?'#pilihan/bonds':'#pilihan/deposits'):null,url:row?.url||(def.group==='fiscal'?sourceLinks.fiscal:['finance','advanced'].includes(def.group)?sourceLinks.bank:def.group==='markets'?sourceLinks.market:def.source.startsWith('BI')?sourceLinks.BI:sourceLinks.BPS)};
}
const groups=[['activity','Ekonomi','Economy'],['society','Masyarakat','People'],['fiscal','Uang negara','Public finances'],['external','Dunia luar','External'],['finance','Bank & kredit','Banks & credit'],['markets','Pasar','Markets'],['advanced','Lanjutan','Advanced']];
export function catalogHTML(data,lang,date){const {t,n}=presentation(lang),resolved=INDICATORS.map(x=>resolveIndicator(x,data)),available=resolved.filter(x=>x.available).length;return `<section class="atlas" id="atlas"><div class="section-top"><div><p class="eyebrow">${t('BUKA DATANYA','EXPLORE THE EVIDENCE')}</p><h2>${t('Satu ekonomi.<br>Banyak sisi yang perlu dibaca.','One economy.<br>Many sides to understand.')}</h2></div><p>${t('50 indikator utama + 10 lanjutan.','50 core indicators + 10 advanced.')} <b>${available}/60</b> ${t('memiliki angka atau cakupan parsial dalam paket ini; bukan 60 feed aktif.','have values or partial coverage in this packet; these are not 60 active feeds.')}</p></div><label class="atlas-search">${t('Cari pertanyaan atau indikator','Find a question or indicator')}<input type="search" id="indicatorSearch" placeholder="${t('Misalnya: upah, utang, subsidi, likuiditas…','For example: wages, debt, subsidies, liquidity…')}"></label><div class="atlas-filters" role="group" aria-label="${t('Kelompok indikator','Indicator groups')}"><button data-indicator-group="all" aria-pressed="false">${t('Semua','All')}</button>${groups.map(([id,a,b])=>`<button data-indicator-group="${id}" aria-pressed="${id==='activity'}">${t(a,b)}</button>`).join('')}</div><p class="atlas-count" id="indicatorCount" aria-live="polite"></p><div class="atlas-list">${resolved.map(x=>{const a=x.def,label=t(a.id,a.en),f=x.row,quality=!x.available?t('Belum terhubung','Not connected'):x.state==='within-window'?t('Angka tersedia · lihat periode','Value available · see period'):t('Parsial / perlu peninjauan','Partial / needs review');return `<details class="atlas-item" data-indicator-group-item="${a.group}" data-indicator-search="${esc([a.id,a.en,a.meaning,a.meaningEn].join(' ').toLowerCase())}"><summary><span class="atlas-number">${String(a.no).padStart(2,'0')}</span><span><b>${label}</b><small>${quality}${f?' · '+esc(date(f.period)):''}</small></span><strong>${f?n(f.value)+(f.unit==='Rp T'?' T':a.no===9?' jt':a.no===31?' USD bn':a.no===32?t(' bulan',' months'):a.no===35?' Rp T':(a.no!==4&&f.unit?.includes('%'))||[1,2,3,6,10,11,14,27,33,36,37,49,59].includes(a.no)?'%':''):x.count?t('Lihat '+x.count+' data','View '+x.count+' records'):'—'}</strong><span class="atlas-plus">+</span></summary><div class="atlas-body"><p class="atlas-meaning">${esc(t(a.meaning,a.meaningEn))}</p>${x.basis?`<p class="scope-note">${t(...x.basis)}</p>`:''}<div class="atlas-meta"><div><b>${t('Cara menghitung / definisi','Calculation / definition')}</b><p>${esc(lang==='en'?formulasEn[a.no-1]:a.formula)}</p></div><div><b>${t('Sumber & frekuensi yang dituju','Intended source & frequency')}</b><p>${esc(a.source)} · ${esc(t(...(frequencies[a.frequency]||[a.frequency,a.frequency])))}</p></div></div>${f?evidence(f,lang,date):`<p class="scope-note">${t('Belum ada angka terverifikasi pada registri ini. Nama sumber adalah rute pengembangan, bukan bukti koneksi berhasil. Tidak dihitung dari proksi yang berbeda definisi.','No verified registry value. The named source is a development route, not proof of a working connection. No substitute with a different definition is used.')}</p>`}${f?.history?.length>1?lineChart(f,lang,{suffix:'',caption:t('Histori dalam seri yang sama','History within the same series')}):''}${x.route?`<a class="text-link" href="${x.route}">${t('Buka alat & rincian','Open tools & details')} ↗</a>`:''}<a class="text-link" href="${esc(safeLink(x.url))}">${t('Buka sumber','Open source')} ↗</a></div></details>`;}).join('')}</div></section>`;}
export function filterIndicators(){const query=(document.getElementById('indicatorSearch')?.value||'').toLowerCase(),group=document.querySelector('[data-indicator-group][aria-pressed="true"]')?.dataset.indicatorGroup||'all';let count=0;document.querySelectorAll('[data-indicator-group-item]').forEach(el=>{el.hidden=(group!=='all'&&el.dataset.indicatorGroupItem!==group)||!el.dataset.indicatorSearch.includes(query);if(!el.hidden)count++;});const out=document.getElementById('indicatorCount');if(out)out.textContent=document.documentElement.lang==='en'?`${count} indicators shown`:`${count} indikator ditampilkan`;}
