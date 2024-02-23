import { connectDB, DB } from "./functions.js";
import { Student, UI} from "./prototypes.js";
(function(){
    const inputName = document.querySelector('#name');
    const inputLastName = document.querySelector('#lastName');
    const inputAge = document.querySelector('#age');

    const form = document.querySelector('#form');

    const student = new Student();
    const ui = new UI();
    
    const urlParams = new URLSearchParams(window.location.search);
    const idStudents = urlParams.get('id');
    let subjectStudent;
    let averageStudent;
    let groupStudent;
    document.addEventListener('DOMContentLoaded', () => {
        connectDB();

        form.addEventListener('submit', student.updateStudent)
        
        if(idStudents){
            setTimeout(() => {
                getStudent(idStudents);
                
            }, 100);
        }
    });

    Student.prototype.updateStudent = function(e){
        e.preventDefault();
        
        if(inputName.value === '' || inputLastName.value === '' || inputAge.value === ''){
            ui.printMessage('All fields are required', 'error')
            return;
        }

        const editStudent = new Student(inputName.value, inputLastName.value, inputAge.value, idStudents);


        const updatedStudent = {
            name: editStudent.name,
            lastName: editStudent.lastName,
            age: editStudent.age,
            id: Number(editStudent.id),
            average: averageStudent,
            subjects: subjectStudent,
            group: groupStudent
        }
        
        // console.log(updatedStudent, editStudent);
        const transaction = DB.transaction(['students'], 'readwrite');

        const objectStore = transaction.objectStore('students');

        objectStore.put(updatedStudent);

        transaction.oncomplete = function(){
            ui.printMessage('The student has been updated correctly', 'success');
            setTimeout(() => {
                window.location.href = 'students.html';
            }, 2000);
        }

        transaction.onerror = () => ui.printMessage('Something went wrong', 'error')
    }

    function getStudent(id){
        const transaction = DB.transaction(['students'], 'readwrite');
        const objectStore = transaction.objectStore('students');

        const student = objectStore.openCursor();
        student.onsuccess = function(e){
            const cursor = e.target.result;

            if(cursor){
                if(cursor.value.id === Number(id)){
                    ui.fillOutForm(cursor.value);
                }
                cursor.continue();
            }
        }
    }
    UI.prototype.fillOutForm = function(studentData){
        const {name, lastName, age, subjects, average, group} = studentData;
        subjectStudent = subjects;
        averageStudent = average;
        groupStudent = group;
        inputName.value = name;
        inputLastName.value = lastName;
        inputAge.value = age;
    }
})();