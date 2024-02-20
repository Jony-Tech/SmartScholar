import { UI } from "../prototypes.js";

(function(){
    let DB;
    const ui = new UI();
    const groupsList = document.querySelector('#groups-list')
    document.addEventListener('DOMContentLoaded', () => {
        createDB();

        if(window.indexedDB.open('groups', 1)){
            ui.printGroup();
        }
    });

    function createDB(){
        const createDB = window.indexedDB.open('groups', 1);

        createDB.onerror = () => console.log('Something went wrong');

        createDB.onsuccess = () => DB = createDB.result;

        createDB.onupgradeneeded = function(e){
            const db = e.target.result;

            const objectStore = db.createObjectStore('groups', {keyPath: 'id', autoIncrement: true});

            objectStore.createIndex('groupName', 'groupName', { unique: true});
            objectStore.createIndex('note', 'note', { unique: false});
            objectStore.createIndex('students', 'students', { unique: true});
            objectStore.createIndex('id', 'id', { unique: true});

            console.log('DB created');
        }
    }

    UI.prototype.printGroup = function(){
        const openConexion = window.indexedDB.open('groups', 1);

        openConexion.onerror = () => console.log('Something went wrong');;

        openConexion.onsuccess = function(){
            DB = openConexion.result;
            
            const objectStore = DB.transaction('groups').objectStore('groups');

            objectStore.openCursor().onsuccess = function(e){
                const cursor = e.target.result;

                if(cursor){
                    const {groupName, note, id} = cursor.value;

                    groupsList.innerHTML += `
                        <tr>
                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                                <p class="text-sm leading-5 font-medium text-gray-700 text-lg  font-bold"> ${groupName} </p>
                            </td>
                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 ">
                                <p class="text-gray-700">${note}</p>
                            </td>
                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5">
                                <a href="editGroup.html?id=${id}" class="text-teal-600 hover:text-teal-900 mr-5">Edit</a>
                                <button data-student="${id}" class="text-red-600 hover:text-red-900 delete">Delete</button>
                            </td>
                        </tr>`;

                    cursor.continue();
                }
            }
        }

    }
})();