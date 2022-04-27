export async function storageLocalGet(keys){return new Promise(((resolve,reject)=>{try{chrome.storage.local.get(keys,(function(result){resolve(result)}))}catch(error){reject(error)}}))}export async function windowsGet(windowId){return new Promise(((resolve,reject)=>{try{chrome.windows.get(windowId,(window=>{resolve(window)}))}catch(error){reject(error)}}))}export async function windowsGetCurrent(){return new Promise(((resolve,reject)=>{try{chrome.windows.getCurrent((window=>{resolve(window)}))}catch(error){reject(error)}}))}export async function windowsGetAll(){return new Promise(((resolve,reject)=>{try{chrome.windows.getAll((windows=>{resolve(windows)}))}catch(error){reject(error)}}))}export async function windowsCreate(createData){return new Promise(((resolve,reject)=>{try{chrome.windows.create(createData,(window=>{resolve(window)}))}catch(error){reject(error)}}))}export async function windowsUpdate(windowId,updateInfo){return new Promise(((resolve,reject)=>{try{chrome.windows.update(windowId,updateInfo,(window=>{resolve(window)}))}catch(error){reject(error)}}))}export async function tabsQuery(queryInfo){return new Promise(((resolve,reject)=>{try{chrome.tabs.query(queryInfo,(tabs=>{resolve(tabs)}))}catch(error){reject(error)}}))}export async function tabsMove(tabIds,moveProperties){return new Promise(((resolve,reject)=>{try{chrome.tabs.move(tabIds,moveProperties,(tabs=>{resolve(tabs)}))}catch(error){reject(error)}}))}export async function tabsUpdate(tabId,updateProperties){return new Promise(((resolve,reject)=>{try{chrome.tabs.update(tabId,updateProperties,(tab=>{resolve(tab)}))}catch(error){reject(error)}}))}export async function systemDisplayGetInfo(){return new Promise(((resolve,reject)=>{try{chrome.system.display.getInfo((displays=>{resolve(displays)}))}catch(error){reject(error)}}))}