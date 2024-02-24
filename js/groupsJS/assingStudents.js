import { connectDB, DB, connectGroupsDB} from "../functions.js";
import  {UI} from "../prototypes.js";
import { searchStudent } from "../searcher.js";

(function(){
    const ui = new UI();
    const studentsList = document.querySelector('#students-list');
    const search = document.querySelector('#search');
    let studentData =[];
    search.addEventListener('submit', searchInfo)
    document.addEventListener('DOMContentLoaded', () => {
        connectDB();
        connectGroupsDB();

        if(window.indexedDB.open('students', 1)){
            getStudents();
        }
    });

    function searchInfo(e){
        e.preventDefault();
        searchStudent(studentData, studentsList)
    }
    
    function getStudents(){
        const openConexion = window.indexedDB.open('students', 1);
        openConexion.onerror = () => console.log('something went wrong');

        openConexion.onsuccess = function(){

            const objectStore = DB.transaction('students').objectStore('students');

            objectStore.openCursor().onsuccess = function(e){
                const cursor = e.target.result;

                if(cursor){
                   ui.printStudents(cursor.value)

                    cursor.continue();
                            
                }
                     
            }
            
        }
    }
    UI.prototype.printStudents = function(studentInfo){
        const {name, lastName, group, id} = studentInfo;
                    studentData.push(studentInfo);
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
                        
    }

})();