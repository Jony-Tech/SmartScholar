import { connectDB,DB } from "./functions.js";
import { UI, Student} from "./prototypes.js";

(function(){
    const subjectsLits = document.querySelector('#subjects-list');
    const btnAddSubject = document.querySelector('#add');
    const studentId = document.querySelector('#id');
    const nameSpan = document.querySelector('#name');
    const lastNameSpan = document.querySelector('#lastName');
    const averageSpan = document.querySelector('#averageSpan');
    const btnGetAverage = document.querySelector('#get-average');

    let subjectArray;
    let studentData;

    const urlParams = new URLSearchParams(window.location.search);
    const idStudents = Number(urlParams.get('id'));
    const ui = new UI();
    const student = new Student();
    btnAddSubject.addEventListener('click', addSubject);
    btnGetAverage.addEventListener('click', getAverage);
    document.addEventListener('DOMContentLoaded', () => {
        connectDB();

        if(idStudents){
            setTimeout(() => {
                getStudent(idStudents);
            }, 100);
        }
    })


    function getStudent(){
            const transaction = DB.transaction(['students'], 'readwrite');
            const objectStore = transaction.objectStore('students');

            objectStore.openCursor().onsuccess = function(e){
                const cursor = e.target.result;
                if(cursor){
                    if(cursor.value.id === idStudents ){
                        
                        ui.printStudent(cursor.value);
                    }
                    
                    cursor.continue();
                }
            }
    }

    function getAverage(e) {
        e.preventDefault();
        let grade = document.querySelectorAll('.grade');
        let grades = 0;
        let counter = 0
        grade.forEach(grade => {
            grades += Number(grade.value);
            counter++;
        });
        let calculate = grades / counter;
        studentData.average = Number(calculate.toFixed(2));
        student.updateStudent();
    }

    UI.prototype.printStudent = function(student){
        const {id, name, lastName , subjects, average} = student;
        subjectArray = subjects;
        studentData = student;

        averageSpan.textContent = average;
        studentId.textContent = id;
        nameSpan.textContent = name;
        lastNameSpan.textContent = lastName;

        subjects.forEach(sub => {
            subjectsLits.innerHTML += `
                <tr>
                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 ">
                                <p class="text-gray-700">${sub}</p>
                            </td>
                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                                <input class="border w-full appearance-none rounded p-1 focus:outline-none focus:border-green-600 leading-tight grade" type="number">
                            </td>
                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5">
                                <button data-student="${sub}" class="text-red-600 hover:text-red-900 delete">Delete</button>
                            </td>
                        </tr>
            `
        });
    }

    async function addSubject(e){
        e.preventDefault();
        const { value: subject } = await Swal.fire({
            title: "Enroll a subject",
            input: "text",
            inputPlaceholder: "Enter a subject"
        });
        let newSubject = subject.toLowerCase();
        if (!subjectArray.includes(newSubject)) {
            subjectArray.push(newSubject);
            student.updateStudent(subjectArray);
        }else{
            ui.printMessage("Already enrolled in this course", "error")
        }
    }

    Student.prototype.updateStudent = function(){
        const { name, lastName, age, group, average} = studentData


        const updatedStudent = {
            name,
            lastName,
            age,
            group,
            average,
            id: idStudents,
            subjects: subjectArray,
            
        }
        
        const transaction = DB.transaction(['students'], 'readwrite');

        const objectStore = transaction.objectStore('students');

        objectStore.put(updatedStudent);

        transaction.oncomplete = function(){
            ui.printMessage('The student has been updated correctly', 'success');
            setTimeout(() => {
                location.reload();
            }, 2000);
        }

        transaction.onerror = () => ui.printMessage('Something went wrong', 'error')
    }

    setTimeout(() => {
        const deleteBtns = document.querySelectorAll('.delete');
        deleteBtns.forEach(btn => {
            btn.addEventListener('click', deleteSubject)
        });
    }, 500);

    function deleteSubject(e){
        e.preventDefault();
        const subject = e.target.dataset.student;

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
                    subjectArray = studentData.subjects.filter(sub => sub !== subject);
                    student.updateStudent();

                    Swal.fire({
                    title: "Deleted!",
                    text: "This subject has been deleted.",
                    icon: "success"
                    });
                }
        });
    }

})();