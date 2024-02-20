export function Student(name, lastName, age, id){
    this.name = name;
    this.lastName = lastName;
    this.age = age;
    this.id = id;
    this.subjects = [];
    this.group = null;
    this.grades = [];
}

export function UI(){};

export function GROUP(groupName, note, id){
    this.groupName = groupName;
    this.note = note;
    this.id = id;
    this.students = [];
}

UI.prototype.printMessage = function(message, type){
    if(type === 'error'){
        Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `${message}`,
        });
    }else{
        Swal.fire({
        icon: "success",
        title: "",
        text: `${message}`,
        showConfirmButton: false
        });
    }
}