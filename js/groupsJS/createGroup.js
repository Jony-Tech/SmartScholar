import { connectGroupsDB, groupDB } from "../functions.js";
import { UI, GROUP } from "../prototypes.js";
(function(){
    
    const form = document.querySelector('#form');
    const ui = new UI();
    document.addEventListener('DOMContentLoaded', () => {
        connectGroupsDB();

        form.addEventListener('submit', validateGroup);
    });

    function validateGroup(e){
        e.preventDefault();

        const groupName = document.querySelector('#groupName').value;
        const note = document.querySelector('#note').value;

        if(groupName === '' || note === ''){
            ui.printMessage('All fields are required', 'error')
            return;
        }

        const id = Date.now();
        const newGroup = new GROUP(groupName, note, id);

        const group = {
            groupName: newGroup.groupName,
            note: newGroup.note,
            id: newGroup.id,
            students: []
        }

        createNewGroup(group);
    }

    function createNewGroup(group){
        const transaction = groupDB.transaction(['groups'], 'readwrite');

        const objectStore = transaction.objectStore('groups');

        objectStore.add(group);

        transaction.onerror = () => ui.printMessage('This group already exists', 'error');

        transaction.oncomplete = function(){
            ui.printMessage('Group created successfully')

            setTimeout(() => {
                window.location.href = 'groups.html'
            }, 2000);
        }
    }
    
})();