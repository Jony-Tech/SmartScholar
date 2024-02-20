import { connectGroupsDB, groupDB } from "../functions.js";
import { GROUP, UI } from "../prototypes.js";

(function(){
    const inputGroupName = document.querySelector('#groupName');
    const inputNote = document.querySelector('#note');

    const form = document.querySelector('#form');

    const ui = new UI();
    const group = new GROUP();

    const urlParams = new URLSearchParams(window.location.search);
    const idGroup = urlParams.get('id');

    document.addEventListener('DOMContentLoaded', () => {
        connectGroupsDB();

        form.addEventListener('submit', group.updateGroup)

        if(idGroup){
            setTimeout(() => {
                getGroup(idGroup);
            }, 100);
        }
    });

    GROUP.prototype.updateGroup = function(e){
        e.preventDefault();
        if(inputGroupName.value === '' || inputNote.value === ''){
            ui.printMessage('All fields are required', 'error')
            return;
        }

        const editGroup = new GROUP(inputGroupName.value, inputNote.value, idGroup);

        const group = {
            groupName: editGroup.groupName,
            note: editGroup.note,
            id: Number(editGroup.id)
        }

        const transaction = groupDB.transaction(['groups'], 'readwrite');

        const objectStore = transaction.objectStore('groups');

        objectStore.put(group);

        transaction.oncomplete = function(){
            ui.printMessage('The student has been updated correctly', 'success');
            // setTimeout(() => {
            //     window.location.href = 'students.html';
            // }, 2000);
        }

        transaction.onerror = () => ui.printMessage('Something went wrong', 'error')
    }

    function getGroup(id){
        const transaction = groupDB.transaction(['groups'], 'readwrite');
        const objectStore = transaction.objectStore('groups');

        const group = objectStore.openCursor();
        group.onsuccess = function(e){
            const cursor = e.target.result;

            if(cursor){
                if(cursor.value.id === Number(id)){
                    ui.fillOutFormGroup(cursor.value)
                }
                cursor.continue();
            }
        }
    }

    UI.prototype.fillOutFormGroup = function(groupData){
        const {groupName, note} = groupData;

        inputGroupName.value = groupName;
        inputNote.value = note
    }
})();