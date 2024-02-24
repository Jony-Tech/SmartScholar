import { UI } from "./prototypes.js";

const ui = new UI()

export function searchStudent(studentData, studentsList){
        const inputSearch = document.querySelector('#inputSearch').value;
        let find = false;
        let print = true;
        studentData.forEach(student => {
            if(student.name == inputSearch || student.id === Number(inputSearch) || student.lastName == inputSearch){
                if(print){
                    studentsList.innerHTML = "";
                    print = false;
                }
                find = true
                ui.printStudents(student);
                
            }else if(inputSearch === ""){
                find= true;
                location.reload();
            }
        })
        if(!find){
            ui.printMessage(`${inputSearch} doesn't exist in this group`, 'error');
        }
    }