export function Student(name, lastName, age, id, subjects, group, grades){
    this.name = name;
    this.lastName = lastName;
    this.age = age;
    this.id = id;
    this.subjects = [];
    this.group = null;
    this.grades = [];
}

export function UI(){};

UI.prototype.printMessage = function(message, type){
    if(type === 'error'){
        Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `${message}`,
        });
    }else if(type === 'success'){
        Swal.fire({
        icon: "success",
        title: "",
        text: `${message}`,
        showConfirmButton: false
        });
    }
}