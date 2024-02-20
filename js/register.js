import { Student, UI } from "./prototypes.js";
import { connectDB, DB } from "./functions.js";
(function(){

    const form = document.querySelector('#form');
    const ui = new UI();
    document.addEventListener('DOMContentLoaded', () => {
        connectDB();

        form.addEventListener('submit', validateStudent );
    });

    

    function validateStudent(e){
        e.preventDefault();
        
        const name = document.querySelector('#name').value;
        const lastName = document.querySelector('#lastName').value;
        const age = document.querySelector('#age').value;

        if(name === '' || lastName === '' || age === ''){
            ui.printMessage('All fields are required', 'error')
            return;
        }
        const id = Date.now();
        const newStudent = new Student(name, lastName, age, id);


        const student = {
            name: newStudent.name,
            lastName: newStudent.lastName,
            age: newStudent.age,
            id: newStudent.id
        }
        createNewStudent(student);
    }

    function createNewStudent(student){

        const transaction = DB.transaction(['students'], 'readwrite');

        const objectStore = transaction.objectStore('students');

        objectStore.add(student);

        transaction.onerror = () => console.log('something went wrong');

        transaction.oncomplete = function(){
            ui.printMessage('Student added successfully');
            setTimeout(() => {
                window.location.href = 'students.html';
            }, 2000);
        }
    }

})();

