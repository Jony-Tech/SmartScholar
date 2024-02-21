import { connectDB, connectGroupsDB, groupDB, DB } from "../functions.js";
import { Student, UI,GROUP } from "../prototypes.js";

(function(){
    const groupList = document.querySelector('#group-list');
    const btn = document.querySelector('#btn');
    const studentId = document.querySelector('#id');
    const nameSpan = document.querySelector('#name');
    const lastNameSpan = document.querySelector('#lastName');

    const urlParams = new URLSearchParams(window.location.search);
    const idStudents = Number(urlParams.get('id'));
    const ui = new UI();
    btn.addEventListener('click', selectGroup)
    document.addEventListener('DOMContentLoaded', () => {
        connectGroupsDB();
        connectDB();
        getGroups();

        if(idStudents){
            setTimeout(() => {
                getStudent(idStudents);
            }, 100);
        }
    })


    function getGroups(){
        const openConexion = window.indexedDB.open('groups', 1);
        openConexion.onerror = () => console.log('Something went wrong');

        openConexion.onsuccess = function(){
            const objectStore = groupDB.transaction('groups').objectStore('groups');

            objectStore.openCursor().onsuccess = function(e){
                const cursor = e.target.result;
                if(cursor){
                    const {id, groupName} = cursor.value;
                    groupList.innerHTML += 
                    `
                    <input type="radio" id="${id}" name="chooseGroup" value="${groupName}">
                    <label for="${id}">${groupName}</label><br>
                    `
                    cursor.continue();
                }
            }
        }
    }

    function selectGroup(e){
        e.preventDefault();
        const radioButtons = document.querySelectorAll('input[name="chooseGroup"]');

        radioButtons.forEach( radioButton => {
            if(radioButton.checked){
                saveChanges( radioButton);
            }
        })
    }

    function saveChanges(groupData){
        
        const openConexion = window.indexedDB.open('students', 1);
        openConexion.onerror = () => console.log('Something went wrong');

        openConexion.onsuccess = function(){
            const transaction = DB.transaction(['students'], 'readwrite');
            const objectStore = transaction.objectStore('students');

            objectStore.openCursor().onsuccess = function(e){
                const cursor = e.target.result;
                if(cursor){
                    if(cursor.value.id === idStudents ){
                        const student = new Student(cursor.value.name, cursor.value.lastName, cursor.value.age, idStudents);
                        student.group = groupData.value;

                        const updatedStudent = {
                            name: student.name,
                            lastName: student.lastName,
                            age: student.age,
                            id: idStudents,
                            group: groupData.value
                        }

                        objectStore.put(updatedStudent);
                        saveStudents(cursor.value, groupData);
                    }
                    
                    cursor.continue();
                }
            }
            transaction.oncomplete = function(){
                ui.printMessage(`assigned to group ${groupData.value} correctly`, 'success');
                setTimeout(() => {
                window.location.href = 'assingStudents.html';
                }, 2000);
            }
        }

    }
    function saveStudents(student, groupid){
        const groupId = Number(groupid.id)
        const transaction = groupDB.transaction(['groups'], 'readwrite');
        const objectStore = transaction.objectStore('groups');

        objectStore.openCursor().onsuccess = function(e){
            const cursor = e.target.result;
            
            if(cursor){
                const group =cursor.value;
                if(group.id === groupId){
                    const arrayGroup = group.students;
                    const newGroup = new GROUP(group.groupName, group.note, groupId);

                    if(!arrayGroup.includes(student.id)){
                        arrayGroup.push(student.id);
                        const updatedGroup = {
                        groupName: newGroup.groupName,
                        note: newGroup.note,
                        id: groupId,
                        students: arrayGroup
                        }
                        objectStore.put(updatedGroup);
                    }
                }else{
                    const arrayGroup = group.students;

                    if(arrayGroup.includes(student.id)){
                        let newArrayGroup = arrayGroup.filter(studentID => studentID !== student.id);

                        const updatedGroup = {
                        groupName: group.groupName,
                        note: group.note,
                        id: Number(group.id),
                        students: newArrayGroup
                        }
                        objectStore.put(updatedGroup);
                    }
                }

                cursor.continue();
            }
        }
    }

    function getStudent(){
            const transaction = DB.transaction(['students'], 'readwrite');
            const objectStore = transaction.objectStore('students');

            objectStore.openCursor().onsuccess = function(e){
                const cursor = e.target.result;
                if(cursor){
                    if(cursor.value.id === idStudents ){
                        
                        ui.printStudentList(cursor.value);
                    }
                    
                    cursor.continue();
                }
            }
    }

    UI.prototype.printStudentList = function(student){
        const {id, name, lastName} = student;
        studentId.textContent = id;
        nameSpan.textContent = name;
        lastNameSpan.textContent = lastName;
    }
})();