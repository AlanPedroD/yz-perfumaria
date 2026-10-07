/* ====== CONFIGURAÇÃO — preencha com os seus dados ====== */
const CONFIG={
 firebase:{
  apiKey:"AIzaSyBDte44k6wRIW5DyeWbFD3sbpiK9VMLb7w",
  authDomain:"yz-perfumaria.firebaseapp.com",
  projectId:"yz-perfumaria",
  appId:"1:196756915333:web:1805f52adebaa1ac8955ec"
 },
 cloudinary:{cloudName:"ddojjqwky",uploadPreset:"yz_perfumaria"},
 whatsapp:"5581986953009"
};
/* ======================================================= */
const DEMO=!CONFIG.firebase.apiKey;
const $=s=>document.querySelector(s);
const brl=n=>Number(n).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const CATS=['Perfumes','Cabelos','Maquiagem','Pele'];
let products=[],cat='Todos',cart=JSON.parse(localStorage.getItem('cart')||'{}'),db,auth,fb={};

/* Relógio e contatos */
const tick=()=>{const n=new Date();$('#cd').textContent=n.toLocaleDateString('pt-BR');$('#ch').textContent=n.toLocaleTimeString('pt-BR');};
tick();setInterval(tick,1000);$('#yr').textContent=new Date().getFullYear();
const wl='https://wa.me/'+CONFIG.whatsapp;$('#wa').href=wl+'?text='+encodeURIComponent('Olá! Gostaria de mais informações.');$('#wa2').href=wl;

/* Dados: Firebase (ou demonstração local sem configuração) */
async function init(){
 if(DEMO){
  products=[
   {id:'1',name:'Eau de Parfum Néroli',desc:'Notas de flor de laranjeira e musgo branco.',price:289.9,badge:'Novo',cat:'Perfumes',img:''},
   {id:'2',name:'Perfume Âmbar Noturno',desc:'Fragrância amadeirada de longa fixação.',price:199.9,oldPrice:259.9,badge:'Promoção',cat:'Perfumes',img:''},
   {id:'3',name:'Máscara Reparadora',desc:'Hidratação profunda para fios macios.',price:79.9,badge:'Mais vendido',cat:'Cabelos',img:''},
   {id:'4',name:'Batom Cremoso Rosé',desc:'Cor intensa com acabamento acetinado.',price:49.9,badge:'',cat:'Maquiagem',img:''},
   {id:'5',name:'Sérum Facial Vitamina C',desc:'Luminosidade e uniformidade para a pele.',price:129.9,badge:'Mais vendido',cat:'Pele',img:''}];
  render();return;
 }
 const A=await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js');
 const F=await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js');
 const U=await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js');
 const app=A.initializeApp(CONFIG.firebase);db=F.getFirestore(app);auth=U.getAuth(app);fb={...F,...U};
 fb.onSnapshot(fb.collection(db,'products'),s=>{
  products=s.docs.map(d=>({id:d.id,...d.data()}));
  const gone=Object.keys(cart).filter(id=>!products.some(p=>p.id===id));
  if(gone.length){gone.forEach(id=>delete cart[id]);save();toast('Itens indisponíveis foram removidos do carrinho.');}
  render();
 });
}

/* Catálogo */
$('#cats').innerHTML=['Todos',...CATS].map(c=>`<li><button data-c="${c}">${c}</button></li>`).join('');
$('#cats').onclick=e=>{const c=e.target.dataset.c;if(!c)return;cat=c;setMenu(false);render();};
const setMenu=o=>{$('#navwrap').classList.toggle('open',o);$('#burger').classList.toggle('open',o);$('#burger').setAttribute('aria-expanded',o);$('#burger').setAttribute('aria-label',o?'Fechar menu':'Abrir menu');};
$('#burger').onclick=()=>setMenu(!$('#navwrap').classList.contains('open'));
function render(){
 document.querySelectorAll('#cats button').forEach(b=>b.classList.toggle('on',b.dataset.c===cat));
 const list=cat==='Todos'?products:products.filter(p=>p.cat===cat);
 $('#grid').innerHTML=list.length?list.map(p=>`<article class="card">
  ${p.badge?`<span class="badge ${esc(p.badge)}">${esc(p.badge)}</span>`:''}
  <div class="im">${p.img?`<img src="${esc(p.img)}" alt="${esc(p.name)}" loading="lazy">`:'✦'}</div>
  <div class="b"><h3>${esc(p.name)}</h3><p>${esc(p.desc)}</p>
  <div class="pr">${p.badge==='Promoção'&&p.oldPrice?`<s>${brl(p.oldPrice)}</s>`:''}<b class="${p.badge==='Promoção'?'promo':''}">${brl(p.price)}</b></div>
  <button class="add" data-id="${p.id}">Adicionar</button></div></article>`).join(''):'<p class="empty">Nenhum produto nesta categoria ainda.</p>';
 renderCart();renderAdminList();
}
$('#grid').onclick=e=>{const id=e.target.dataset.id;if(!id)return;cart[id]=(cart[id]||0)+1;saveCart();toast('Produto adicionado ao carrinho!');};

/* Carrinho */
const save=()=>localStorage.setItem('cart',JSON.stringify(cart));
function saveCart(){save();renderCart();}
const open=o=>{$('#drawer').classList.toggle('open',o);$('#ov').classList.toggle('open',o);};
$('#cartBtn').onclick=()=>open(true);$('#closeCart').onclick=$('#ov').onclick=()=>open(false);
function renderCart(){
 const ids=Object.keys(cart);let total=0,bad=false;
 $('#cnt').textContent=ids.reduce((s,i)=>s+cart[i],0);
 $('#items').innerHTML=ids.length?ids.map(id=>{
  const p=products.find(x=>x.id===id),q=cart[id];
  if(!p){bad=products.length>0||bad;return `<div class="it"><div class="t">⚠</div><div><b>Produto indisponível</b><small class="off">Não está mais no catálogo. Remova para continuar.</small></div><button data-d="${id}" aria-label="Remover">🗑</button></div>`;}
  total+=p.price*q;
  return `<div class="it"><div class="t">${p.img?`<img src="${esc(p.img)}" alt="">`:'✦'}</div>
  <div><b>${esc(p.name)}</b><small>${brl(p.price)} un.</small>
  <div class="q"><button data-m="${id}" aria-label="Diminuir" ${q<2?'disabled':''}>−</button>${q}<button data-p="${id}" aria-label="Aumentar">+</button></div></div>
  <div style="text-align:right"><b>${brl(p.price*q)}</b><br><button data-d="${id}" aria-label="Excluir">🗑</button></div></div>`;}).join(''):'<p class="empty">Seu carrinho está vazio.</p>';
 $('#total').textContent=brl(total);
 $('#checkout').disabled=!ids.length||bad;$('#checkout').style.opacity=$('#checkout').disabled?.4:1;
}
$('#items').onclick=e=>{const t=e.target.closest('button');if(!t||t.disabled)return;const d=t.dataset;
 if(d.p)cart[d.p]++;if(d.m&&cart[d.m]>1)cart[d.m]--;if(d.d)delete cart[d.d];saveCart();};
$('#checkout').onclick=()=>{
 const items=Object.keys(cart).map(id=>({p:products.find(x=>x.id===id),q:cart[id]}));
 if(!items.length||items.some(i=>!i.p))return toast('Remova os produtos indisponíveis.');
 const n=new Date();
 const data=n.toLocaleDateString('pt-BR')+' às '+n.toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'});
 const total=items.reduce((s,i)=>s+i.p.price*i.q,0);
 const linhas=items.map((i,k)=>`*${k+1}. ${i.p.name}*\n${i.q} un. × ${brl(i.p.price)} = *${brl(i.p.price*i.q)}*`).join('\n\n');
 const linha='━━━━━━━━━━━━━━━';
 const msg=`✨ *NOVO PEDIDO • Aurea Perfumaria* ✨\n📅 ${data}\n\n${linha}\n🛍️ *ITENS DO PEDIDO*\n${linha}\n\n${linhas}\n\n${linha}\n💰 *TOTAL: ${brl(total)}*\n${linha}\n\nOlá! Gostaria de finalizar este pedido. Poderia me informar as formas de pagamento e de entrega? 😊`;
  window.open(wl+'?text='+encodeURIComponent(msg),'_blank');
 cart={};saveCart();open(false);
 toast('Pedido enviado! Continue a conversa pelo WhatsApp.');
};
let tt;function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(tt);tt=setTimeout(()=>t.classList.remove('show'),2000);}

/* Painel administrativo */
$('#adminLink').onclick=()=>{$('#admin').classList.add('open');const ok=DEMO||auth.currentUser;$('#login').style.display=ok?'none':'grid';$('#panel').style.display=ok?'block':'none';renderAdminList();};
$('#closeAdmin').onclick=()=>$('#admin').classList.remove('open');
$('#login').onsubmit=async e=>{e.preventDefault();try{await fb.signInWithEmailAndPassword(auth,$('#em').value,$('#pw').value);$('#login').style.display='none';$('#panel').style.display='block';}catch{toast('E-mail ou senha incorretos.');}};
$('#logout').onclick=async()=>{if(!DEMO)await fb.signOut(auth);$('#admin').classList.remove('open');};
function renderAdminList(){
 $('#alist').innerHTML=products.map(p=>`<div class="ar">${p.img?`<img src="${esc(p.img)}" alt="">`:'<div class="ph"></div>'}<div><b>${esc(p.name)}</b><br><small>${esc(p.cat)} · ${brl(p.price)} ${p.badge?'· '+esc(p.badge):''}</small></div><button class="lk" data-e="${p.id}">Editar</button><button class="lk" style="color:var(--red)" data-x="${p.id}">Excluir</button></div>`).join('');
}
async function upload(file){
 const c=CONFIG.cloudinary;if(!c.cloudName)return{url:URL.createObjectURL(file),pid:''};
 const fd=new FormData();fd.append('file',file);fd.append('upload_preset',c.uploadPreset);
 const r=await fetch(`https://api.cloudinary.com/v1_1/${c.cloudName}/image/upload`,{method:'POST',body:fd});
 if(!r.ok)throw new Error('upload');const j=await r.json();return{url:j.secure_url,pid:j.public_id};
}
$('#alist').onclick=async e=>{
 const d=e.target.dataset,p=products.find(x=>x.id===(d.e||d.x));if(!p)return;
 if(d.e){$('#pid').value=p.id;$('#pn').value=p.name;$('#pd').value=p.desc;$('#pc').value=p.cat;$('#pb').value=p.badge||'';$('#pp').value=p.price;$('#po').value=p.oldPrice||'';$('#imgst').textContent=p.img?'Imagem atual mantida, a menos que você escolha outra.':'';scrollTo(0,0);}
 if(d.x&&confirm(`Excluir "${p.name}"?`)){
  if(DEMO)products=products.filter(x=>x.id!==p.id);else await fb.deleteDoc(fb.doc(db,'products',p.id));
  // Remoção da imagem no Cloudinary exige API secret: faça via Cloud Function usando p.publicId
  render();toast('Produto excluído.');
 }
};
$('#pf').onsubmit=async e=>{
 e.preventDefault();const b=$('#save');b.disabled=true;b.textContent='Salvando...';
 try{
  const id=$('#pid').value,old=products.find(x=>x.id===id),f=$('#pf_img').files[0];
  let img=old?.img||'',publicId=old?.publicId||'';
  if(f){const u=await upload(f);img=u.url;publicId=u.pid;}
  const badge=$('#pb').value,data={name:$('#pn').value.trim(),desc:$('#pd').value.trim(),cat:$('#pc').value,badge,price:parseFloat($('#pp').value),oldPrice:badge==='Promoção'?parseFloat($('#po').value)||null:null,img,publicId};
  if(DEMO){if(id)Object.assign(old,data);else products.push({id:String(Date.now()),...data});render();}
  else if(id)await fb.setDoc(fb.doc(db,'products',id),data);else await fb.addDoc(fb.collection(db,'products'),data);
  $('#pf').reset();$('#pid').value='';$('#imgst').textContent='';toast('Produto salvo!');
 }catch{toast('Não foi possível salvar. Tente novamente.');}
 b.disabled=false;b.textContent='Salvar produto';
};
init();
