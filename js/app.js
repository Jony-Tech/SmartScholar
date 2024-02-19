import  {UI, Student} from "./prototypes.js";

(function(){
    let DB;
    const ui = new UI();
    const student = new Student();
    const studentsList = document.querySelector('#students-list');
    
    document.addEventListener('DOMContentLoaded', () => {
        createDB();

        if(window.indexedDB.open('students', 1)){
            ui.printStudent();
        }
    });

    function createDB(){
        const createDB = window.indexedDB.open('students', 1);

        createDB.onerror = () => console.log('Error');

        createDB.onsuccess = () => DB = createDB.result;

        createDB.onupgradeneeded = function(e){
            const db = e.target.result;

            const objectStore = db.createObjectStore('students', { keyPath: 'id', autoIncrement: true});
            
            objectStore.createIndex('name', 'name', { unique: false });
            objectStore.createIndex('lastName', 'lastName', { unique: false });
            objectStore.createIndex('age', 'age', { unique: false });
            objectStore.createIndex('subjects', 'subjects', { unique: false });
            objectStore.createIndex('group', 'group', { unique: false });
            objectStore.createIndex('grades', 'grades', { unique: false });
            objectStore.createIndex('id', 'id', { unique: true });
            
            console.log('DB created');

        }

        
        UI.prototype.printStudent = function(){
            const openConexion = window.indexedDB.open('students', 1);

            openConexion.onerror = () => console.log('something went wrong');

            openConexion.onsuccess = function(){
                DB = openConexion.result;

                const objectStore = DB.transaction('students').objectStore('students');

                objectStore.openCursor().onsuccess = function(e){
                    const cursor = e.target.result;

                    if(cursor){
                        const {name, lastName, age, id} = cursor.value;

                        studentsList.innerHTML += `
                            <tr>
                                <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                                    <p class="text-sm leading-5 font-medium text-gray-700 text-lg  font-bold"> ${name} </p>
                                </td>
                                <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 ">
                                    <p class="text-gray-700">${lastName}</p>
                                </td>
                                <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200  leading-5 text-gray-700">    
                                    <p class="text-gray-600">${age}</p>
                                </td>
                                <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5">
                                    <a href="editStudent.html?id=${id}" class="text-teal-600 hover:text-teal-900 mr-5">Edit</a>
                                    <button data-student="${id}" class="text-red-600 hover:text-red-900 delete">Delete</button>
                                </td>
                            </tr>`;

                            cursor.continue();
                            
                    }
                    
                    
                }
            }
        }

    }

    setTimeout(() => {
        const deleteBtns = document.querySelectorAll('.delete');
        deleteBtns.forEach(btn => {
            btn.addEventListener('click', student.deleteStudent)
        });
    }, 500);

    Student.prototype.deleteStudent = function(e){
        const idDelete = Number(e.target.dataset.student);

        

        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
            }).then((result) => {
                if (result.isConfirmed) {
                    const transaction = DB.transaction(['students'], 'readwrite');
                    const objectStore = transaction.objectStore('students');


                    objectStore.delete(idDelete);
                    transaction.oncomplete = function(){
                        e.target.parentElement.parentElement.remove();
                    }
                    transaction.onerror = ui.printMessage('Something went wrong', 'error')

                    Swal.fire({
                    title: "Deleted!",
                    text: "This student has been deleted.",
                    icon: "success"
                    });
                }
        });
    }
})();