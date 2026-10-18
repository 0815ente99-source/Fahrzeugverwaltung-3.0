const CACHE='fuhrpark-v39-hintergrundpruefung';
const ASSETS=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>e.respondWith(caches.match(e.request).then(cached=>cached||fetch(e.request).then(r=>{const copy=r.clone(); caches.open(CACHE).then(c=>c.put(e.request,copy)); return r;}).catch(()=>caches.match('./index.html')))));

self.addEventListener('notificationclick',event=>{event.notification.close();event.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(clients=>{for(const client of clients){if('focus' in client)return client.focus();}if(self.clients.openWindow)return self.clients.openWindow('./');}));});


// Best-effort background appointment check. The browser chooses when/if this runs.
const FUHRPARK_DB='fuhrpark_datenbank_v1';
const FUHRPARK_STORE='appdata';
function openFuhrparkDB(){return new Promise((resolve,reject)=>{const req=indexedDB.open(FUHRPARK_DB,1);req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);});}
async function readStored(key){const db=await openFuhrparkDB();return new Promise((resolve,reject)=>{const tx=db.transaction(FUHRPARK_STORE,'readonly');const req=tx.objectStore(FUHRPARK_STORE).get(key);req.onsuccess=()=>resolve(req.result||null);req.onerror=()=>reject(req.error);tx.oncomplete=()=>db.close();tx.onerror=()=>{db.close();reject(tx.error);};});}
async function writeStored(key,value){const db=await openFuhrparkDB();return new Promise((resolve,reject)=>{const tx=db.transaction(FUHRPARK_STORE,'readwrite');tx.objectStore(FUHRPARK_STORE).put(value,key);tx.oncomplete=()=>{db.close();resolve();};tx.onerror=()=>{db.close();reject(tx.error);};tx.onabort=()=>{db.close();reject(tx.error);};});}
function localDayKey(){const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
async function checkStoredAppointments(){
  if(self.Notification&&Notification.permission!=='granted')return;
  const db=await readStored('fuhrpark');if(!db||!Array.isArray(db.vehicles))return;
  const sent=await readStored('fuhrpark-background-notified')||{};
  const today=localDayKey();const todayMs=new Date(today+'T00:00:00').getTime();
  for(const vehicle of db.vehicles){
    for(const reminder of (vehicle.reminders||[])){
      if(reminder.done||!reminder.date||!/^\d{4}-\d{2}-\d{2}$/.test(reminder.date))continue;
      const dueMs=new Date(reminder.date+'T00:00:00').getTime();const days=Math.round((dueMs-todayMs)/86400000);
      const lead=Math.max(0,Math.min(30,Number(reminder.leadDays)||0));if(days<0||days>lead)continue;
      const key='fuhrpark-bg-v1-'+vehicle.id+'-'+reminder.date+'-'+(reminder.title||'Termin');if(sent[key])continue;
      const body=(vehicle.name||'Fahrzeug')+(vehicle.plate?' · '+vehicle.plate:'')+' — '+(days===0?'Heute fällig':days===1?'Morgen fällig':'in '+days+' Tagen fällig')+(reminder.note?' · '+reminder.note:'');
      await self.registration.showNotification('Fahrzeugtermin: '+(reminder.title||'Termin'),{body,icon:'./icon-192.png',tag:key,data:{url:'./'}});
      sent[key]=new Date().toISOString();await writeStored('fuhrpark-background-notified',sent);
    }
  }
}
self.addEventListener('periodicsync',event=>{if(event.tag==='fuhrpark-appointment-check')event.waitUntil(checkStoredAppointments().catch(err=>console.warn('Fuhrpark-Hintergrundprüfung fehlgeschlagen',err)));});
