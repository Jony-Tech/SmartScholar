import { connectDB, DB, connectGroupsDB, groupDB } from "../functions.js";
import  {UI} from "../prototypes.js";

(function(){
    const ui = new UI();
    const studentsList = document.querySelector('#students-list');
    
    document.addEventListener('DOMContentLoaded', () => {
        connectDB();
        connectGroupsDB();

        if(window.indexedDB.open('students', 1)){
            ui.printAssingStudent();
        }
    });

    UI.prototype.printAssingStudent = function(){
        const openConexion = window.indexedDB.open('students', 1);

        openConexion.onerror = () => console.log('something went wrong');

        openConexion.onsuccess = function(){

            const objectStore = DB.transaction('students').objectStore('students');

            objectStore.openCursor().onsuccess = function(e){
                const cursor = e.target.result;

                if(cursor){
                    const {name, lastName, group, id} = cursor.value;
                    let currentGroup = group;

                    if(!group){
                        currentGroup = "no group"
                    }

                    studentsList.innerHTML += `
                        <tr>
                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                                <p class="text-sm leading-5 font-medium text-gray-700 text-lg  font-bold"> ${name} </p>
                            </td>
                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 ">
                                <p class="text-gray-700">${lastName}</p>
                            </td>
                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200  leading-5 text-gray-700">    
                                <p class="text-gray-600">${currentGroup}</p>
                            </td>
                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 flex justify-center">
                                <a href="chooseGroup.html?id=${id}" class="bg-blue-600 shadow-md rounded p-2 text-white font-bold">Assing</a>
                            </td>
                        </tr>`;

                    cursor.continue();
                            
                }
                     
            }
            
        }
    }

})();