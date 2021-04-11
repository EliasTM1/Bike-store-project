import Dates from './classes/Citas.js';
import UI from './classes/UI.js';
import { clienteInput, bikeBrand, bikeModel, phoneNumber, serviceNotes, form } from './selectores.js'

// This class is to create and manage errors or succes, 
const ui = new UI();
const manageDates = new Dates()



let editing;
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
export function apptData(e) {
    dateObj[e.target.name] = e.target.value;
    console.log(dateObj);
}



// Validate fields and add date to the date class
export function newAppoinment(e) {
    e.preventDefault()
        // Get the data from the date object 
    const { client, brand, model, phone, notes } = dateObj;

    if (client === '' || brand === '' || model === '' || phone === '' || notes === '') {
        ui.printWarn('All Fields are requiered to book', 'error')
        return
    }

    if (editing) {
        ui.printWarn('Editado correctamente.')
            // Pass the object from the date to the editing
        manageDates.editAppoin({...dateObj })

        // Pass the object of the date to edition mode 
        form.querySelector('button[type="submit"]').textContent = 'Crear Cita'
            // Quit editor mode
        editing = false;
    } else {
        // Generate an unique ID for the date object
        // Crete a new property and at the same time we asign that to Date.now 
        // that is the amount of milliseconds since Jan 1 1970
        dateObj.id = Date.now()

        // Create a new Appoinment.
        manageDates.addDates({...dateObj });
        // added succesfully message
        ui.printWarn('Se agrego correctamente')
    }

    // Reinitialize the the object validation 

    resetOBJ()

    // Reinitialize the form
    form.reset();

    // Mostrar en el HTML
    ui.printDates(manageDates)
}

export function resetOBJ() {
    dateObj.cliente = '';
    dateObj.brand = '';
    dateObj.model = '';
    dateObj.phone = '';
    dateObj.notes = '';
    dateObj.date = new Date;
}

export function deleteAppoin(id) {
    // Delete the appoinment 
    manageDates.deleteAppoin(id);
    // Eliminar la cita.
    ui.printWarn('La cita se elimino correctamente.');
    // Refresh the appoinments.
    ui.printDates(manageDates);
}
// Load data and editor mode
export function loadEditMode(cita) {

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