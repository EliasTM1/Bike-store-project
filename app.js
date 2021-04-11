let DB
    // Selectores de los campos de texto
const clienteInput = document.querySelector('#client');
const bikeBrand = document.querySelector('#brand');
const bikeModel = document.querySelector('#model');
const phoneNumber = document.querySelector('#phone');
const serviceNotes = document.querySelector('#notes');
// Selector del tag form
const form = document.querySelector('#form');
// Selector donde las citas se van a almacenar
const appoinments = document.querySelector('#appoinments');

let editing;

// UI
class Dates {
    constructor() {
        this.appoin = [];
    }

    addDates(cita) {
        this.appoin = [...this.appoin, cita];
    }

    deleteAppoin(id) {
        this.appoin = this.appoin.filter(cita => cita.id !== id)
    }

    editAppoin(citaActualizada) {
        this.appoin = this.appoin.map(cita => cita.id === citaActualizada.id ? citaActualizada : cita)
    }

}
// This class is to create and manage errors or succes, 
class UI {
    printWarn(message, type) {
        // Crear el div
        const messaageSection = document.createElement('div');
        messaageSection.classList.add('text-center', 'alert', 'd-block', 'col-12')

        // Add the class depending on the type of error

        if (type === 'error') {
            messaageSection.classList.add('alert-danger');
        } else {
            messaageSection.classList.add('alert-success')
        }
        // Mensaje de error
        messaageSection.textContent = message

        // Add to the DOM 

        document.querySelector('#content').insertBefore(messaageSection, document.querySelector('.newAppoinment'));

        // Remove the aler 

        setTimeout(() => {
            messaageSection.remove()
        }, 3000);
    }

    // Tambien se puede aplicar destructurinf desde la funcion
    printDates() {
        this.clearHTML();
        //Read the content of the Database
        const objectStore = DB.transaction('dates').objectStore('dates');
        objectStore.openCursor().onsuccess = function(e) {
            const cursor = e.target.result;

            if (cursor) {
                const { client, brand, model, phone, notes, id, date } = cursor.value;
                const appDiv = document.createElement('div');
                appDiv.classList.add('p-3');
                appDiv.dataset.id = id;
                // Scripting of the elements of the appoinment 
                const costumerParra = document.createElement('h2');
                costumerParra.classList.add('card-title', 'font-weight-bolder');
                costumerParra.textContent = client;

                const brandParra = document.createElement('p');
                brandParra.innerHTML = `<span class="font-weight-bolder">Brand: </span>${brand}
                `

                const modelParra = document.createElement('p');
                modelParra.innerHTML = `<span class="font-weight-bolder">Model: </span>${model}
                `

                const phoneParra = document.createElement('p');
                phoneParra.innerHTML = `<span class="font-weight-bolder">Phone: </span>${phone}
                `

                const notesParra = document.createElement('p');
                notesParra.innerHTML = `<span class="font-weight-bolder">Notes: </span>${notes}
                `

                const timeParra = document.createElement('p');
                timeParra.innerHTML = `<span class="font-weight-bolder">Time-stamp </span>${date}
                `

                // Agregar  el boton de Eliminar 
                const deleteBtn = document.createElement('button');
                deleteBtn.classList.add('btn', 'btn-danger', 'mr-2');
                deleteBtn.innerHTML = ` Eliminar`;
                deleteBtn.onclick = () => deleteAppoin(id);

                // Agregar el boton para editar.
                const editBtn = document.createElement('button');
                editBtn.classList.add('btn', 'btn-info');
                editBtn.innerHTML = 'Editar';
                const cita = cursor.value
                editBtn.onclick = () => loadEditMode(cita);


                // Add the p to the divCita
                appDiv.appendChild(costumerParra);
                appDiv.appendChild(brandParra);
                appDiv.appendChild(modelParra);
                appDiv.appendChild(phoneParra);
                appDiv.appendChild(notesParra);
                appDiv.appendChild(timeParra);
                appDiv.appendChild(deleteBtn);
                appDiv.appendChild(editBtn);

                // Add to the HTML
                appoinments.appendChild(appDiv)

                // Ve al siguiente Elemento
                cursor.continue();

            }
        }
    }





    clearHTML() {
        while (appoinments.firstChild) {
            appoinments.removeChild(appoinments.firstChild)
        }
    }
}

const ui = new UI();
const manageDates = new Dates()

window.onload = () => {
    eventListeners();

    createDB()
}

// Registrar eventos


function eventListeners() {
    clienteInput.addEventListener('input', apptData);
    bikeBrand.addEventListener('input', apptData);
    bikeModel.addEventListener('input', apptData);
    phoneNumber.addEventListener('input', apptData);
    serviceNotes.addEventListener('input', apptData);
    // Formulario listener
    form.addEventListener('submit', newAppoinment)
}

// Object template
const dateObj = {
    client: '',
    brand: '',
    model: '',
    phone: '',
    notes: '',
    date: new Date
}


// Funciones
function apptData(e) {
    dateObj[e.target.name] = e.target.value;
    console.log(dateObj);
}

// Validate fields and add date to the date class
function newAppoinment(e) {
    e.preventDefault()
        // Get the data from the date object 
    const { client, brand, model, phone, notes } = dateObj;

    if (client === '' || brand === '' || model === '' || phone === '' || notes === '') {
        ui.printWarn('All Fields are requiered to book', 'error')
        return
    }

    if (editing) {
        // Pass the object from the date to the editing
        manageDates.editAppoin({...dateObj })

        // Edita en indexedDB

        const transaction = DB.transaction(['dates'], 'readwrite');
        const objectStore = transaction.objectStore('dates');

        objectStore.put(dateObj);

        transaction.oncomplete = () => {
            // Print succes on editing
            ui.printWarn('Editado correctamente.')
                // Pass the object of the date to edition mode 
            form.querySelector('button[type="submit"]').textContent = 'Crear Cita'
                // Quit editor mode
            editing = false;
        }

        transaction.onerror = () => {

        }
    } else {
        // Generate an unique ID for the date object
        // Crete a new property and at the same time we asign that to Date.now 
        // that is the amount of milliseconds since Jan 1 1970
        dateObj.id = Date.now()
            // Create a new Appoinment.
        manageDates.addDates({...dateObj });

        // Insert in Indexed DB

        const transaction = DB.transaction(['dates'], 'readwrite');
        // Habilitar el object Store
        const objectStore = transaction.objectStore('dates');
        // Agregar a la base de datos
        objectStore.add(dateObj);

        transaction.oncomplete = function() {
            console.log("cita Agragada ");
            ui.printWarn('Se agrego correctamente')
        }

        // added succesfully message
    }

    // Reinitialize the the object validation 

    resetOBJ()

    // Reinitialize the form
    form.reset();

    // Mostrar en el HTML
    ui.printDates()
}

function resetOBJ() {
    dateObj.cliente = '';
    dateObj.brand = '';
    dateObj.model = '';
    dateObj.phone = '';
    dateObj.notes = '';
    dateObj.date = new Date;
}

function deleteAppoin(id) {
    const transaction = DB.transaction(['dates'], 'readwrite');
    const objectStore = transaction.objectStore('dates');

    objectStore.delete(id)
    if (confirm('Are you sure? Once deleted the costumer will be notified')) {
        transaction.oncomplete = () => {
            ui.printWarn('La cita se elimino correctamente.');
            ui.printDates();
        }

    }

    transaction.onerror = () => {
        console.log('Hubo un error');
    }

    // Eliminar la cita.
    // Refresh the appoinments.

}
// Load data and editor mode
function loadEditMode(cita) {

    const { client, brand, model, phone, notes, id } = cita
    // Fill the values
    clienteInput.value = client
    bikeBrand.value = brand
    bikeModel.value = model
    phoneNumber.value = phone
    serviceNotes.value = notes

    //fill the object 

    dateObj.client = client;
    dateObj.brand = brand;
    dateObj.model = model;
    dateObj.phone = phone;
    dateObj.notes = notes;
    dateObj.id = id;


    form.querySelector('button[type="submit"]').textContent = 'Guardar Cambios'

    editing = true;
}


function createDB() {
    // Create the database version 1 
    // El indexed DB es una propiedad del objeto window y  open es un metodo que sirve para crear
    // la base de datos, toma como parametro el nombre de la base de datos y la version de esta
    const crearDB = window.indexedDB.open('citas', 1)

    // In case we have an error
    crearDB.onerror = () => {
            console.log("Hubo un error al crear la base de datos");
        }
        // On succes
    crearDB.onsuccess = () => {
            DB = crearDB.result;

            // Show the appoinments saved inside the local storage after we create the data base (When is ready)
            ui.printDates();
        }
        // Define the scheme 
    crearDB.onupgradeneeded = function(e) {
        const db = e.target.result;

        const objectStore = db.createObjectStore('dates', {
            keyPath: 'id',
            autoIncrement: true
        })

        // Define the columns 
        objectStore.createIndex('client', 'client', { unique: false });
        objectStore.createIndex('brand', 'brand', { unique: false });
        objectStore.createIndex('model', 'model', { unique: false });
        objectStore.createIndex('phone', 'phone', { unique: false });
        objectStore.createIndex('notes', 'notes', { unique: false });
        objectStore.createIndex('date', 'date', { unique: false });
        objectStore.createIndex('id', 'id', { unique: true });

    }

    // Difine the columns 


}