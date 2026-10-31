export const metricEN={
 jisdor:['Rupiah per US dollar · JISDOR','A higher number means more rupiah are needed for one US dollar. Import costs may rise, while dollar earners may benefit. This reference is not a bank’s customer exchange rate.'],
 inflation:['National inflation · year on year','Average consumer-price change against the same month a year earlier. Positive inflation means prices are still rising on average. Your household basket may behave differently.'],
 rate:['BI-Rate','The policy rate influences funding costs. Your deposit and loan rates do not necessarily change immediately; contracts and bank decisions matter.'],
 fxreserves:['Foreign-exchange reserves · monthly','Foreign reserves help meet external payments and manage currency pressures. A decline alone does not establish a crisis: financing needs, imports and stabilisation policy matter.'],
 indonia:['INDONIA · overnight interbank rate','The price of unsecured overnight rupiah borrowing between banks. It is neither a deposit offer nor a household loan rate.'],
 srbiflow:['SRBI · non-resident net transactions','Positive means non-residents bought SRBI on a net basis during the stated transaction window. This covers SRBI only, not all foreign flows or the stock of holdings.'],
 confidence:['Consumer Confidence Index · IKK','Above 100 indicates optimistic survey sentiment under BI’s methodology. Sentiment is not proof that every household’s income has increased.'],
 manufacturing:['PMI-BI · manufacturing activity','Above 50 indicates expansion under BI’s survey methodology. This is an activity index, not a GDP growth rate or another provider’s PMI.'],
 gdp:['Real GDP growth','The change in inflation-adjusted economic production from the previous year. National growth need not be shared equally across sectors or households.'],
 income:['GDP per capita · current US dollars','Average production value per person, not the salary or money each person receives. Exchange rates, prices and income distribution affect interpretation.'],
 unemployment:['Unemployment · modelled ILO estimate','The share of the labour force unemployed in the ILO modelled series. This is not BPS’s TPT series and does not describe wages, informality or job quality.'],
 currentaccount:['Current-account balance','Trade in goods and services plus primary and secondary income. A deficit is not automatically a crisis; financing and external resilience matter.'],
 fdi:['Foreign direct investment · net inflows','Direct investment may support productive capacity. This annual FDI measure is not portfolio flows in shares, government bonds or SRBI.'],
 reserves:['Foreign reserves · import cover','Import coverage in this annual series. It does not represent the latest monthly reserve balance or all external financing requirements.'],
 trade:['Trade in goods and services','Exports plus imports relative to GDP: an openness measure, not the trade surplus or the country’s profit.'],
 annualinflation:['Consumer inflation · annual series','World Bank’s annual inflation series. Its period definition differs from a particular month’s year-on-year inflation. Do not splice them into one series.']
};
export const unitEN={'Rp / USD':'IDR / USD','% / tahun':'% a year','USD / orang':'USD per person','% angkatan kerja':'% of labour force','% PDB':'% of GDP','bulan impor':'months of imports','USD miliar':'USD billion','Rp triliun':'IDR trillion','indeks':'index','indeks (%)':'index (%)'};
export const coverage=[
 ['JISDOR, inflasi, BI-Rate','JISDOR, inflation, BI-Rate','Angka dan riwayat tabel resmi BI.','Figures and history from official BI tables.','Aktif','Active'],
 ['Cadangan devisa, INDONIA, SRBI','Reserves, INDONIA, SRBI','Posisi devisa bulanan, bunga semalam, dan arus transaksi SRBI untuk rentang sumber.','Monthly reserves, overnight rate and SRBI net transactions for the source window.','Aktif','Active'],
 ['IKK & PMI-BI','Consumer confidence & PMI-BI','IKK dari PDF survei; PMI-BI aktual dan perkiraan resmi dari rilis BI.','Confidence from the survey PDF; actual and forward-looking PMI-BI from BI’s release.','Aktif','Active'],
 ['APBN Kita','APBN Kita','Pendapatan, belanja, saldo dan defisit/PDB dari ringkasan PDF; kumulatif. Template harus lolos rekonsiliasi.','Revenue, expenditure, balance and deficit/GDP from the cumulative PDF summary. Template extraction must reconcile.','Aktif bersyarat','Conditional'],
 ['Deposito BCA & Mandiri','BCA & Mandiri deposits','Tarif reguler Rupiah per tenor dan nominal; belum mencakup semua bank, promo atau kanal.','Regular IDR rates by term and amount; not all banks, promotions or channels.','Sebagian bank','Selected banks'],
 ['Batas bunga penjaminan','Coverage interest ceiling','Dibaca dari pengungkapan resmi Bank Mandiri. Bukan verifikasi langsung regulator atau seluruh syarat 3T.','Read from Bank Mandiri’s official disclosure. Not direct regulator verification or a full eligibility assessment.','Sumber bank','Bank disclosure'],
 ['8 seri tahunan World Bank','8 annual World Bank series','Data struktural; tidak berubah setiap hari dan bukan pengganti rilis BPS terkini.','Structural context; not daily observations or a substitute for current BPS releases.','Aktif','Active'],
 ['Berita BI','BI releases','Judul, tautan dan tanggal publikasi dari halaman artikel bila terbaca; bukan isi berita lengkap.','Headlines, links and publication dates from article pages when readable; not full article reproduction.','Aktif','Active'],
 ['IHSG, asing saham & SBN','IHSG, foreign equity & bond flows','Belum tersambung ke sumber tampilan yang sesuai. SRBI tersedia terpisah; jangan menganggapnya total arus asing.','Not connected to an appropriate display source. SRBI is available separately and is not total foreign flow.','Belum','Not connected'],
 ['Rasio bank & data daerah','Bank ratios & local indicators','Belum ada konektor laporan bank/daerah yang lolos uji. Tidak membuat skor kesehatan atau angka pengganti.','No tested bank-report or local-data connectors. No fabricated health ratings or substitute values.','Belum','Not connected']
];
