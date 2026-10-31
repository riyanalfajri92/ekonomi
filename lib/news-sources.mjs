import {text,dateID} from './parsers.mjs';
export const NEWS_SOURCES=[
 {id:'ojk-news',name:'OJK',url:'https://www.ojk.go.id/id/berita-dan-kegiatan/siaran-pers/Default.aspx',path:'/id/berita-dan-kegiatan/siaran-pers/Pages/'},
 {id:'kemendag-news',name:'Kementerian Perdagangan',url:'https://www.kemendag.go.id/berita/siaran-pers',path:'/berita/siaran-pers/'},
 {id:'bappebti-news',name:'Bappebti',url:'https://bappebti.go.id/siaran_pers',path:'/siaran_pers/detail/'}
];
export function parseAgencyNews(html,def){let out=[];for(const a of html.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)){let url;try{url=new URL(a[1].replace(/&amp;/g,'&'),def.url);}catch{continue;}const base=new URL(def.url);if(url.protocol!=='https:'||url.hostname!==base.hostname||!url.pathname.includes(def.path))continue;let title=text(a[2]);if(title.length<30||title.length>500||out.some(x=>x.url===url.href))continue;const nearby=text(html.slice(Math.max(0,a.index-350),a.index+1200));let d=nearby.match(/(\d{1,2})\s+(Januari|Februari|Maret|April|Mei|Juni|Juli|Agustus|September|Oktober|November|Desember)\s+(\d{4})/i);out.push({title,url:url.href,agency:def.name,publishedAt:null});if(out.length===5)break;}if(!out.length)throw Error('Daftar rilis '+def.name+' belum terbaca');return out;}

export function publicationDate(html){let m=html.match(/<meta[^>]*(?:property|name)=["'](?:article:published_time|datePublished|pubdate)["'][^>]*content=["']([^"']+)/i)||html.match(/<time[^>]*datetime=["']([^"']+)/i);if(!m)return null;const d=new Date(m[1]);return Number.isFinite(+d)?d.toISOString().slice(0,10):null;}
