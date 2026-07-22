/* Chitechma University Institute — Student Marketplace
   app.js | DB · Auth · Utils · UI */
'use strict';

const DB = {
  K:{users:'cm_u',products:'cm_p',team:'cm_t',messages:'cm_m',session:'cm_s',transactions:'cm_tx',activity:'cm_act',settings:'cm_cfg'},
  _g(k){try{return JSON.parse(localStorage.getItem(k))||[];}catch(e){return[];}},
  _s(k,v){localStorage.setItem(k,JSON.stringify(v));},

  /* Users */
  getUsers(){return this._g(this.K.users);},
  saveUsers(u){this._s(this.K.users,u);},
  getUserById(id){return this.getUsers().find(u=>u.id===id)||null;},
  getUserByEmail(e){return this.getUsers().find(u=>u.email===e)||null;},
  updateUser(id,d){const u=this.getUsers(),i=u.findIndex(x=>x.id===id);if(i!==-1){u[i]={...u[i],...d};this.saveUsers(u);}return i!==-1;},
  deleteUser(id){this.saveUsers(this.getUsers().filter(u=>u.id!==id));this.saveProducts(this.getProducts().filter(p=>p.sellerId!==id));},

  /* Products */
  getProducts(){return this._g(this.K.products);},
  saveProducts(p){this._s(this.K.products,p);},
  getProductById(id){return this.getProducts().find(p=>p.id===id)||null;},
  getApproved(){return this.getProducts().filter(p=>p.status==='live');},
  addProduct(p){const l=this.getProducts();l.push(p);this.saveProducts(l);},
  deleteProduct(id){this.saveProducts(this.getProducts().filter(p=>p.id!==id));},
  updateProduct(id,d){const l=this.getProducts(),i=l.findIndex(p=>p.id===id);if(i!==-1){l[i]={...l[i],...d};this.saveProducts(l);}return i!==-1;},

  /* Team */
  getTeam(){return this._g(this.K.team);},
  saveTeam(t){this._s(this.K.team,t);},
  addTeamMember(m){const t=this.getTeam();t.push(m);this.saveTeam(t);},
  deleteTeamMember(id){this.saveTeam(this.getTeam().filter(m=>m.id!==id));},
  updateTeamMember(id,d){const t=this.getTeam(),i=t.findIndex(m=>m.id===id);if(i!==-1){t[i]={...t[i],...d};this.saveTeam(t);}},

  /* Messages */
  getMessages(){return this._g(this.K.messages);},
  saveMessages(m){this._s(this.K.messages,m);},
  addMessage(msg){const m=this.getMessages();m.push(msg);this.saveMessages(m);},
  getInbox(uid){return this.getMessages().filter(m=>m.toId===uid);},
  markRead(id){const m=this.getMessages(),i=m.findIndex(x=>x.id===id);if(i!==-1){m[i].read=true;this.saveMessages(m);}},
  countUnread(uid){return this.getMessages().filter(m=>m.toId===uid&&!m.read).length;},
  deleteMessage(id){this.saveMessages(this.getMessages().filter(m=>m.id!==id));},

  /* Transactions */
  getTransactions(){return this._g(this.K.transactions);},
  saveTransactions(t){this._s(this.K.transactions,t);},
  addTransaction(t){const l=this.getTransactions();l.push(t);this.saveTransactions(l);},
  updateTransaction(id,d){const l=this.getTransactions(),i=l.findIndex(t=>t.id===id);if(i!==-1){l[i]={...l[i],...d};this.saveTransactions(l);}},
  deleteTransaction(id){this.saveTransactions(this.getTransactions().filter(t=>t.id!==id));},

  /* Activity log */
  getActivity(){return this._g(this.K.activity);},
  logActivity(action,detail,type){
    const l=this.getActivity();
    l.unshift({id:uid(),action,detail,type:type||'info',date:new Date().toISOString()});
    this._s(this.K.activity,l.slice(0,100)); // keep last 100
  },

  /* Settings */
  getSettings(){try{return JSON.parse(localStorage.getItem(this.K.settings))||{};}catch(e){return{};}},
  saveSetting(k,v){const s=this.getSettings();s[k]=v;this._s(this.K.settings,s);},

  /* Session */
  getSession(){try{return JSON.parse(localStorage.getItem(this.K.session));}catch(e){return null;}},
  setSession(u){localStorage.setItem(this.K.session,JSON.stringify(u));},
  clearSession(){localStorage.removeItem(this.K.session);},

  init(){
    if(!this.getUsers().length){
      this.saveUsers([
        {id:1,name:'Administrator',email:'admin@chitechma.cm',password:'admin123',role:'admin',matricule:'ADMIN',phone:'+237 677 000 001',profileImage:null,status:'active',verified:true,joinDate:new Date().toISOString()},
        {id:2,name:'Jean Mballa',email:'jean@chitechma.cm',password:'student123',role:'student',matricule:'CHI/2023/001',phone:'677 123 456',profileImage:null,status:'active',verified:true,joinDate:new Date().toISOString()},
        {id:3,name:'Amina Fomban',email:'amina@chitechma.cm',password:'student123',role:'student',matricule:'CHI/2023/002',phone:'699 234 567',profileImage:null,status:'active',verified:false,joinDate:new Date().toISOString()},
        {id:4,name:'Grace Ewane',email:'grace@chitechma.cm',password:'student123',role:'student',matricule:'CHI/2022/015',phone:'650 456 789',profileImage:null,status:'active',verified:true,joinDate:new Date().toISOString()}
      ]);
    }
    if(!this.getProducts().length){
      this.saveProducts([
        {id:1001,name:'Nike Running Shoes (Size 42)',category:'clothing',price:5000,condition:'good',description:'Nike running shoes worn for 3 months. Very comfortable.',sellerName:'Jean Mballa',sellerPhone:'677 123 456',sellerEmail:'jean@chitechma.cm',sellerId:2,image:null,emoji:'👟',color:'#33A344',date:new Date().toISOString(),status:'live'},
        {id:1002,name:'HP Laptop 15" Core i5',category:'electronics',price:180000,condition:'good',description:'HP laptop 8GB RAM 500GB HDD. Works perfectly.',sellerName:'Amina Fomban',sellerPhone:'699 234 567',sellerEmail:'amina@chitechma.cm',sellerId:3,image:null,emoji:'💻',color:'#2E86AB',date:new Date().toISOString(),status:'pending'},
        {id:1003,name:'Engineering Maths Textbook',category:'books',price:3500,condition:'fair',description:'Level 2 Engineering Mathematics. Some notes inside.',sellerName:'Grace Ewane',sellerPhone:'650 456 789',sellerEmail:'grace@chitechma.cm',sellerId:4,image:null,emoji:'📚',color:'#7B5EA7',date:new Date().toISOString(),status:'live'},
        {id:1004,name:'School Backpack Black',category:'clothing',price:8000,condition:'very-good',description:'Large black backpack, fits 15" laptop.',sellerName:'Jean Mballa',sellerPhone:'677 123 456',sellerEmail:'jean@chitechma.cm',sellerId:2,image:null,emoji:'🎒',color:'#E07B39',date:new Date().toISOString(),status:'live'}
      ]);
    }
    if(!this.getTeam().length){
      this.saveTeam([
        {id:1,name:'NJOMUWEH MILTON',role:'Home Page, Navigation, About & Contact',photo:null},
        {id:2,name:'OBI PERPETUA',role:'Login Page & Dashboard',photo:null},
        {id:3,name:'STAREN SOBA',role:'Products Page & Sell Form',photo:null},
        {id:4,name:'EBAKO RUTH',role:'CSS Styling & Branding',photo:null}
      ]);
    }
    if(!this.getTransactions().length){
      this.saveTransactions([
        {id:'TXN001',productId:1001,productName:'Nike Running Shoes',buyerName:'Grace Ewane',buyerId:4,sellerName:'Jean Mballa',sellerId:2,amount:5000,status:'confirmed',date:new Date(Date.now()-86400000*2).toISOString(),note:''},
        {id:'TXN002',productId:1003,productName:'Engineering Maths Textbook',buyerName:'Amina Fomban',buyerId:3,sellerName:'Grace Ewane',sellerId:4,amount:3500,status:'pending',date:new Date(Date.now()-86400000).toISOString(),note:''},
        {id:'TXN003',productId:1004,productName:'School Backpack',buyerName:'Jean Mballa',buyerId:2,sellerName:'Jean Mballa',sellerId:2,amount:8000,status:'disputed',date:new Date().toISOString(),note:'Buyer says item not as described'}
      ]);
    }
    if(!this.getActivity().length){
      this.logActivity('Platform launched','Chitechma Marketplace went live','success');
      this.logActivity('New listing','HP Laptop listed by Amina Fomban — pending approval','warn');
      this.logActivity('Transaction','Nike Shoes deal confirmed between Jean and Grace','success');
    }
  }
};

/* AUTH */
const Auth={
  login(email,password){
    const u=DB.getUserByEmail(email.trim().toLowerCase());
    if(!u)return{success:false,msg:'No account found with this email.'};
    if(u.status==='suspended')return{success:false,msg:'Your account has been suspended. Contact admin.'};
    if(u.password===password){DB.setSession({id:u.id,name:u.name,role:u.role,email:u.email,profileImage:u.profileImage});return{success:true,user:u};}
    return{success:false,msg:'Incorrect password.'};
  },
  register(data){
    if(DB.getUserByEmail(data.email.trim().toLowerCase()))return{success:false,msg:'Email already registered.'};
    if(data.password.length<6)return{success:false,msg:'Password must be at least 6 characters.'};
    const u={...data,id:Date.now(),email:data.email.trim().toLowerCase(),role:'student',profileImage:null,status:'active',verified:false,joinDate:new Date().toISOString()};
    const users=DB.getUsers();users.push(u);DB.saveUsers(users);
    DB.logActivity('New registration',u.name+' registered as a student','info');
    return{success:true,user:u};
  },
  logout(){DB.clearSession();window.location.href='index.html';},
  getUser(){return DB.getSession();},
  isLoggedIn(){return DB.getSession()!==null;},
  isAdmin(){const s=DB.getSession();return s&&s.role==='admin';},
  requireLogin(){if(!this.isLoggedIn()){window.location.href='login.html';return false;}return true;},
  requireAdmin(){if(!this.isAdmin()){window.location.href='login.html';return false;}return true;}
};

/* UTILS */
function formatPrice(n){return parseInt(n).toLocaleString('fr-CM')+' FCFA';}
function formatDate(d){return new Date(d).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'});}
function formatDateTime(d){return new Date(d).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'});}
function uid(){return 'ID'+Date.now()+Math.floor(Math.random()*9000);}
function getParam(n){return new URLSearchParams(window.location.search).get(n);}
function escHtml(s){if(!s)return'';return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}

function showAlert(msg,type,id){
  id=id||'alert-box';
  const el=document.getElementById(id);if(!el)return;
  const cls=type==='error'?'notice-red':type==='warn'?'notice-warn':'notice-green';
  const ico=type==='error'?'❌':type==='warn'?'⚠️':'✅';
  el.innerHTML=`<div class="notice ${cls}">${ico} ${msg}</div>`;
  setTimeout(()=>{if(el)el.innerHTML='';},5000);
}

function readImage(file,cb){
  if(!file){cb(null);return;}
  if(file.size>1.5*1024*1024){alert('Image too large. Max 1.5 MB.');cb(null);return;}
  const r=new FileReader();r.onload=e=>cb(e.target.result);r.readAsDataURL(file);
}

const CONDITIONS={'new':'Brand New','like-new':'Like New','very-good':'Very Good','good':'Good','fair':'Fair'};
const CAT_EMOJI={clothing:'👔',electronics:'💻',books:'📚',furniture:'🪑',sports:'⚽',other:'📦'};
const CAT_COLOR={clothing:'#33A344',electronics:'#2E86AB',books:'#7B5EA7',furniture:'#E07B39',sports:'#2A9D8F',other:'#888'};

function buildCard(p){
  const thumb=p.image
    ?`<div class="product-thumb"><img src="${p.image}" alt="${escHtml(p.name)}"></div>`
    :`<div class="product-thumb" style="background:${p.color||CAT_COLOR[p.category]||'#33A344'}">${p.emoji||CAT_EMOJI[p.category]||'📦'}</div>`;
  return`<div class="product-card">${thumb}<div class="product-body"><span class="product-badge">${CONDITIONS[p.condition]||p.condition}</span><div class="product-name">${escHtml(p.name)}</div><div class="product-price">${formatPrice(p.price)}</div><div class="product-meta">👤 ${escHtml(p.sellerName)}</div><div class="product-meta">📞 ${escHtml(p.sellerPhone)}</div><a href="product-contact.html?id=${p.id}" class="btn btn-ghost btn-sm btn-block">Contact Seller</a></div></div>`;
}

/* NAVBAR */
function updateNavbar(){
  const da=document.getElementById('nav-user-desktop');
  const ma=document.getElementById('nav-user-mobile');
  const u=Auth.getUser();
  if(u){
    const unread=DB.countUnread(u.id);
    const badge=unread>0?`<span class="unread-dot">${unread}</span>`:'';
    const href=u.role==='admin'?'admin.html':'dashboard.html';
    const initial=escHtml(u.name.charAt(0).toUpperCase());
    const uPhoto=u.profileImage?`<img src="${u.profileImage}" alt="">`:'';
    const uName=escHtml(u.name.split(' ')[0]);
    if(da)da.innerHTML=`<div class="topbar-user"><a href="${href}" class="user-pill"><div class="user-avatar">${uPhoto||initial}</div><span>${uName}${badge}</span></a><a href="#" class="btn-logout" onclick="Auth.logout();return false;">Logout</a></div>`;
    if(ma)ma.innerHTML=`<div class="mnp-user"><a href="${href}" class="mnp-user-pill"><div class="user-avatar">${uPhoto||initial}</div><div><div style="font-size:14px;font-weight:600;">${uName}${badge}</div><div style="font-size:11px;color:var(--t3)">${escHtml(u.email)}</div></div></a><a href="#" class="mnp-logout" onclick="Auth.logout();return false;">Logout</a></div>`;
  }else{
    if(da)da.innerHTML=`<div class="topbar-user"><a href="register.html" class="btn btn-ghost btn-sm">Register</a><a href="login.html" class="topbar-login">Login</a></div>`;
    if(ma)ma.innerHTML=`<div class="mnp-user"><a href="login.html" class="mnp-login">🔑 Login</a></div>`;
  }
}

/* MOBILE NAV */
function toggleMobileNav(){
  const panel=document.getElementById('mobile-nav-panel');
  const overlay=document.getElementById('nav-overlay');
  if(!panel)return;
  const isOpen=panel.classList.toggle('open');
  if(overlay)overlay.classList.toggle('show',isOpen);
  document.body.style.overflow=isOpen?'hidden':'';
}
function closeMobileNav(){
  const panel=document.getElementById('mobile-nav-panel');
  const overlay=document.getElementById('nav-overlay');
  if(panel)panel.classList.remove('open');
  if(overlay)overlay.classList.remove('show');
  document.body.style.overflow='';
}

/* ACTIVE NAV LINK */
function markActiveNav(){
  const p=window.location.pathname.split('/').pop()||'index.html';
  const map={'index.html':'home','products.html':'products','sell.html':'sell','dashboard.html':'dashboard','about.html':'about','contact.html':'contact','admin.html':'dashboard'};
  const key=map[p]||'home';
  const d=document.getElementById('nl-'+key);if(d)d.classList.add('active');
  const m=document.getElementById('ml-'+key);if(m)m.classList.add('active');
}

document.addEventListener('DOMContentLoaded',()=>{
  DB.init();
  updateNavbar();
  markActiveNav();
  document.querySelectorAll('.mnp-links a').forEach(a=>a.addEventListener('click',closeMobileNav));
});
