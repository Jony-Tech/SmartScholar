export let DB;
export let transaction;
export let objectStore;

export function connectDB(){
    const openConexion = window.indexedDB.open('students', 1);

    openConexion.onerror = () => console.log('Something went wrong');

    openConexion.onsuccess = () => DB = openConexion.result;
}






