(() => {
  const queues = new Map();
  const supported = file => file.size > 0 && (/^audio\//.test(file.type) || /\.(mp3|m4a|m4b|ogg|wav|flac|aac|opus)$/i.test(file.name));
  const signature = file => JSON.stringify([file.name, file.size, file.lastModified || 0]);
  function open(name) {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(name, 1);
      request.onupgradeneeded = () => request.result.createObjectStore('files', {keyPath:'id'});
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
      request.onblocked = () => reject(new Error('Закрой другие окна приложения и повтори импорт.'));
    });
  }
  async function save(name, files) {
    const db = await open(name);
    try {
      return await new Promise((resolve, reject) => {
        const tx = db.transaction('files', 'readwrite');
        const store = tx.objectStore('files');
        const result = {added:[], duplicates:0, skipped:0};
        const request = store.getAll();
        request.onsuccess = () => {
          const known = new Set(request.result.map(item => item.signature || signature(item.blob)));
          for (const file of files) {
            if (!supported(file)) { result.skipped++; continue; }
            const key = signature(file);
            if (known.has(key)) { result.duplicates++; continue; }
            known.add(key);
            const item = {id:crypto.randomUUID(), name:file.name, blob:file, signature:key};
            store.put(item);
            result.added.push(item);
          }
        };
        tx.oncomplete = () => resolve(result);
        tx.onabort = () => reject(tx.error || new Error('Сохранение отменено'));
        tx.onerror = () => {};
      });
    } finally { db.close(); }
  }
  window.localLibrary = {
    import(name, input) {
      const files = Array.from(input);
      const current = (queues.get(name) || Promise.resolve()).catch(()=>{}).then(()=>save(name, files));
      queues.set(name, current);
      return current;
    }
  };
})();
