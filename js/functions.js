export let DB;
export let groupDB;

export function connectDB(){
    const openConexion = window.indexedDB.open('students', 1);

    openConexion.onerror = () => console.log('Something went wrong');

    openConexion.onsuccess = () => DB = openConexion.result;
}

export function connectGroupsDB(){
    const openConexion = window.indexedDB.open('groups', 1);

    openConexion.onerror = () => console.log('Something went wrong');

    openConexion.onsuccess = () => groupDB = openConexion.result;
}






