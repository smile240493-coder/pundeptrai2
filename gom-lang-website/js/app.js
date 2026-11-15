(()=>{
const LS=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}};
const SV=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}};
const $=(s,r=document)=>r.querySelector(s),vnd=n=>Number(n).toLocaleString('vi-VN')+' ₫';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const SEED=[
['Bình hoa men lam','Bình hoa',450000,'#1f3a5f','Men lam đậm, nung củi, cao 28 cm.'],
['Bình hoa men ngọc','Bình hoa',520000,'#4f8f84','Men ngọc xanh dịu, dáng thon.'],
['Bộ ấm trà Bát Tràng','Ấm chén',890000,'#8a6f4e','1 ấm, 6 chén, men nâu đất.'],
['Chén trà men rạn','Ấm chén',120000,'#7d8c93','Men rạn tự nhiên, cầm vừa tay.'],
['Đĩa sứ vẽ tay','Bát đĩa',260000,'#2f6d8f','Đường kính 24 cm, hoa văn vẽ tay.'],
['Bộ bát cơm 4 chiếc','Bát đĩa',340000,'#4f8f84','An toàn thực phẩm, dùng được lò vi sóng.'],
['Lọ hương gốm','Trang trí',180000,'#6b4f3a','Đốt hương nụ hoặc nhang vòng.'],
['Chậu cây men xanh','Trang trí',310000,'#1f3a5f','Có lỗ thoát nước, hợp sen đá.']
].map((a,i)=>({id:i+1,name:a[0],cat:a[1],price:a[2],color:a[3],desc:a[4],img:''}));
let P=LS('gl_p',null);if(!P){P=SEED;SV('gl_p',P)}
let C=LS('gl_c',[]);
const SHAPE={'Bình hoa':'<path d="M40 8h20v16c0 8 18 18 18 44 0 16-10 26-28 26S22 84 22 68c0-26 18-36 18-44z"/>','Ấm chén':'<path d="M18 32h52v22c0 20-10 32-26 32S18 74 18 54z"/><path d="M70 40h8a10 10 0 010 20h-9" fill="none" stroke="currentColor" stroke-width="6"/>','Bát đĩa':'<ellipse cx="50" cy="58" rx="42" ry="14"/><ellipse cx="50" cy="55" rx="28" ry="8" fill="#fff" opacity=".35"/>'};
const POT='<path d="M22 36h56l-8 50H30z"/><rect x="16" y="26" width="68" height="12" rx="4"/>';
const art=p=>`<div class="art" style="background:color-mix(in srgb,${esc(p.color)} 14%,#fff)">${p.img?`<img src="${esc(p.img)}" alt="${esc(p.name)}" loading="lazy" width="300" height="300">`:`<svg viewBox="0 0 100 100" role="img" aria-label="${esc(p.name)}" fill="${esc(p.color)}" style="color:${esc(p.color)}">${SHAPE[p.cat]||POT}</svg>`}</div>`;
const card=p=>`<article class="card">${art(p)}<div class="b"><h3>${esc(p.name)}</h3><p class="d">${esc(p.desc)}</p><span class="price">${vnd(p.price)}</span><button class="btn sm" data-add="${p.id}">Thêm vào giỏ</button></div></article>`;
const toast=m=>{let t=$('#toast');t.textContent=m;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1800)};
const count=()=>{$('#cc').textContent=C.reduce((s,i)=>s+i.q,0)};
const add=id=>{let i=C.find(x=>x.id==id);i?i.q++:C.push({id:+id,q:1});SV('gl_c',C);count();toast('Đã thêm vào giỏ hàng')};
document.addEventListener('click',e=>{const a=e.target.closest('[data-add]');if(a)add(a.dataset.add)});
$('#mb').onclick=()=>$('nav').classList.toggle('open');
count();
const pg=document.body.dataset.page,q=new URLSearchParams(location.search);
const pages={
home(){$('#feat').innerHTML=P.slice(0,4).map(card).join('')},
shop(){
 const cats=['Tất cả',...new Set(P.map(p=>p.cat))];let cat=q.get('cat')||'Tất cả',kw=(q.get('q')||'').toLowerCase(),sort='';
 $('#chips').innerHTML=cats.map(c=>`<button class="chip" data-c="${esc(c)}">${esc(c)}</button>`).join('');
 const s=$('#kw');s.value=q.get('q')||'';
 const draw=()=>{let l=P.filter(p=>(cat=='Tất cả'||p.cat==cat)&&(p.name+p.desc+p.cat).toLowerCase().includes(kw));
  if(sort=='a')l.sort((a,b)=>a.price-b.price);if(sort=='d')l.sort((a,b)=>b.price-a.price);
  document.querySelectorAll('.chip').forEach(b=>b.classList.toggle('on',b.dataset.c==cat));
  $('#list').innerHTML=l.length?l.map(card).join(''):'<p class="empty">Không tìm thấy sản phẩm phù hợp. Hãy thử từ khóa khác.</p>'};
 $('#chips').onclick=e=>{if(e.target.dataset.c){cat=e.target.dataset.c;draw()}};
 s.oninput=()=>{kw=s.value.toLowerCase();draw()};$('#sort').onchange=e=>{sort=e.target.value;draw()};draw()},
contact(){$('#cf').onsubmit=e=>{e.preventDefault();const m=LS('gl_m',[]);m.unshift({d:new Date().toLocaleString('vi-VN'),...Object.fromEntries(new FormData(e.target))});SV('gl_m',m);e.target.reset();toast('Đã gửi! Chúng tôi sẽ phản hồi sớm.')}},
cart(){
 const draw=()=>{C=C.filter(i=>P.some(p=>p.id==i.id));SV('gl_c',C);count();
  const rows=C.map(i=>({p:P.find(p=>p.id==i.id),q:i.q}));const t=rows.reduce((s,r)=>s+r.p.price*r.q,0);
  $('#items').innerHTML=rows.length?rows.map(r=>`<div class="row">${art(r.p)}<div class="g"><b>${esc(r.p.name)}</b><br><span class="muted">${vnd(r.p.price)}</span></div><div class="qty"><button data-q="${r.p.id}:-1" aria-label="Giảm">−</button>${r.q}<button data-q="${r.p.id}:1" aria-label="Tăng">+</button></div><button class="btn sm red" data-q="${r.p.id}:x">Xóa</button></div>`).join('')+`<p class="tot">Tổng cộng: ${vnd(t)}</p>`:'<p class="empty">Giỏ hàng đang trống. <a href="san-pham.html"><u>Xem sản phẩm</u></a></p>';
  $('#co').hidden=!rows.length;window.T=t};
 $('#items').onclick=e=>{const d=e.target.dataset.q;if(!d)return;const[id,v]=d.split(':'),i=C.find(x=>x.id==id);if(v=='x')C=C.filter(x=>x!=i);else{i.q+=+v;if(i.q<1)C=C.filter(x=>x!=i)}SV('gl_c',C);draw()};
 $('#co').onsubmit=e=>{e.preventDefault();const o=LS('gl_o',[]),f=Object.fromEntries(new FormData(e.target));
  o.unshift({id:'DH'+Date.now().toString().slice(-6),d:new Date().toLocaleString('vi-VN'),...f,total:window.T,items:C.map(i=>{const p=P.find(p=>p.id==i.id);return p.name+' x'+i.q}).join(', ')});
  SV('gl_o',o);C=[];SV('gl_c',C);draw();e.target.reset();$('#ok').hidden=false;$('#ok').textContent='Đặt hàng thành công! Mã đơn: '+o[0].id+'. Chúng tôi sẽ gọi xác nhận trong 24 giờ.'};draw()},
admin(){
 const root=$('#adm'),PASS='admin123';
 const login=()=>{root.innerHTML='<form class="box" id="lg" style="max-width:360px"><h2>Đăng nhập quản trị</h2><label for="pw">Mật khẩu</label><input id="pw" type="password" required><p style="margin-top:14px"><button class="btn">Đăng nhập</button></p></form>';
  $('#lg').onsubmit=e=>{e.preventDefault();if($('#pw').value==PASS){sessionStorage.ad=1;panel()}else toast('Sai mật khẩu')}};
 const panel=()=>{const O=LS('gl_o',[]),M=LS('gl_m',[]);
  root.innerHTML=`<div class="two"><form class="box" id="pf"><h2 id="ft">Thêm sản phẩm</h2><input type="hidden" name="id"><label>Tên sản phẩm</label><input name="name" required><label>Danh mục</label><input name="cat" list="cl" required><datalist id="cl">${[...new Set(P.map(p=>p.cat))].map(c=>`<option>${esc(c)}`).join('')}</datalist><label>Giá (₫)</label><input name="price" type="number" min="0" required><label>Màu chủ đạo</label><input name="color" type="color" value="#4f8f84"><label>Link ảnh (không bắt buộc)</label><input name="img" type="url" placeholder="https://..."><label>Mô tả</label><textarea name="desc" rows="3"></textarea><p style="margin-top:14px"><button class="btn">Lưu sản phẩm</button> <button type="button" class="btn alt" id="rs">Làm mới</button></p></form>
  <div class="box ov"><h2>Sản phẩm (${P.length})</h2><table><tr><th>Tên<th>Giá<th></tr>${P.map(p=>`<tr><td>${esc(p.name)}<td>${vnd(p.price)}<td><button class="btn sm" data-e="${p.id}">Sửa</button> <button class="btn sm red" data-x="${p.id}">Xóa</button></tr>`).join('')}</table></div></div>
  <div class="box ov" style="margin-top:24px"><h2>Đơn hàng (${O.length})</h2>${O.length?`<table><tr><th>Mã<th>Ngày<th>Khách<th>SĐT<th>Địa chỉ<th>Sản phẩm<th>Tổng</tr>${O.map(o=>`<tr><td>${o.id}<td>${esc(o.d)}<td>${esc(o.name)}<td>${esc(o.phone)}<td>${esc(o.address)}<td>${esc(o.items)}<td>${vnd(o.total)}</tr>`).join('')}</table>`:'<p class="muted">Chưa có đơn hàng.</p>'}</div>
  <div class="box ov" style="margin-top:24px"><h2>Tin nhắn liên hệ (${M.length})</h2>${M.map(m=>`<p><b>${esc(m.name)}</b> (${esc(m.email)}) - ${esc(m.d)}<br>${esc(m.msg)}</p><hr>`).join('')||'<p class="muted">Chưa có tin nhắn.</p>'}</div>
  <p style="margin-top:20px"><button class="btn alt" id="lo">Đăng xuất</button> <button class="btn alt" id="rd">Khôi phục dữ liệu mẫu</button></p>`;
  const f=$('#pf');
  f.onsubmit=e=>{e.preventDefault();const d=Object.fromEntries(new FormData(f));d.price=+d.price;
   if(d.id){P=P.map(p=>p.id==d.id?{...d,id:+d.id}:p)}else{d.id=Math.max(0,...P.map(p=>p.id))+1;P.push(d)}
   SV('gl_p',P);toast('Đã lưu sản phẩm');panel()};
  root.onclick=e=>{const t=e.target;
   if(t.dataset.e){const p=P.find(p=>p.id==t.dataset.e);for(const k in p)if(f[k])f[k].value=p[k];$('#ft').textContent='Sửa sản phẩm';f.scrollIntoView()}
   if(t.dataset.x&&confirm('Xóa sản phẩm này?')){P=P.filter(p=>p.id!=t.dataset.x);SV('gl_p',P);panel()}
   if(t.id=='rs')panel();if(t.id=='lo'){delete sessionStorage.ad;login()}
   if(t.id=='rd'&&confirm('Khôi phục sản phẩm mẫu?')){P=SEED;SV('gl_p',P);panel()}}};
 sessionStorage.ad?panel():login()}
};
pages[pg]&&pages[pg]();
})();
