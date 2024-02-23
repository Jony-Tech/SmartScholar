import { connectDB, connectGroupsDB, groupDB, DB } from "../functions.js";
import { Student, UI } from "../prototypes.js";
(function(){
    const studentsList = document.querySelector('#students-list');
    const groupTitle = document.querySelector('#groupTitle');
    const urlParams = new URLSearchParams(window.location.search);
    const idGroup = Number(urlParams.get('id'));
    const student = new Student();
    const ui = new UI();
    let groupData;
    document.addEventListener('DOMContentLoaded', () =>{
        connectGroupsDB();
        connectDB();

        setTimeout(() => {
            getGroup();
        }, 100);
    })

    function getGroup(){
        const transaction = groupDB.transaction(['groups'], 'readwrite');
        const objectStore = transaction.objectStore('groups');

        const group = objectStore.openCursor();
        group.onsuccess = function(e){
            const cursor = e.target.result;

            if(cursor){
                if(cursor.value.id === idGroup){
                    groupData = cursor.value;
                    groupTitle.textContent = groupData.groupName;
                    const arrayStudents = cursor.value.students;
                    arrayStudents.forEach(student => {
                        getStudent(student);
                    });
                }
                cursor.continue();
            }
        }
    }
    function getStudent(student){
        const transaction = DB.transaction(['students'], 'readwrite');
        const objectStore = transaction.objectStore('students');

        const group = objectStore.openCursor();
        group.onsuccess = function(e){
            const cursor = e.target.result;

            if(cursor){
                if(cursor.value.id === student){
                    const {name, lastName, id} = cursor.value;
                    studentsList.innerHTML += `
                        <tr>
                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                                <p class="text-sm leading-5 font-medium text-gray-700 text-lg "> ${id} </p>
                            </td>
                            <td class="px-6 py-4 whitespace-no-wrap font-bold border-b border-gray-200 ">
                                <p class="text-gray-700">${name}</p>
                            </td>
                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200  leading-5 text-gray-700">    
                                <p class="text-gray-600">${lastName}</p>
                            </td>
                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5">
                                <a href="chooseGroup.html?id=${id}" class="text-teal-600 hover:text-teal-900 mr-5">Change</a>
                                <button data-student="${id}" class="text-red-600 hover:text-red-900 delete">Delete</button>
                            </td>
                        </tr>`;
                }
                cursor.continue();
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
                    const transaction = groupDB.transaction(['groups'], 'readwrite');
                    const objectStore = transaction.objectStore('groups');
                    const arrayStudents = groupData.students;
                    let newArrayStudents = arrayStudents.filter(studentId => studentId !== idDelete);

                    const updatedStudents ={
                        groupName: groupData.groupName,
                        note: groupData.note,
                        id: idGroup,
                        students: newArrayStudents
                    }
                    objectStore.put(updatedStudents);
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