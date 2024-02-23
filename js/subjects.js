import  {UI} from "./prototypes.js";
import { connectDB, DB } from "./functions.js";

(function(){
    const ui = new UI();
    const studentsList = document.querySelector('#students-list');
    
    document.addEventListener('DOMContentLoaded', () => {
        connectDB();
        setTimeout(() => {
            if(window.indexedDB.open('students', 1)){
                ui.printStudent();
            }
        }, 100);
        
    });

    UI.prototype.printStudent = function(){
            const objectStore = DB.transaction('students').objectStore('students');

            objectStore.openCursor().onsuccess = function(e){
                const cursor = e.target.result;

                if(cursor){
                    const {name, lastName, id} = cursor.value;

                    studentsList.innerHTML += `
                        <tr>
                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 ">
                                <p class="text-gray-700">${id}</p>
                            </td>
                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                                <p class="text-sm leading-5 font-medium text-gray-700 text-lg  font-bold"> ${name} </p>
                            </td>
                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 ">
                                <p class="text-gray-700">${lastName}</p>
                            </td>
                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5">
                                <a href="subjects.html?id=${id}" class="text-teal-600 hover:text-teal-900 mr-5">Add</a>
                            </td>
                        </tr>`;

                    cursor.continue();
                            
                }
                    
                    
            }
    }

})();