import { deleteAppoin, loadEditMode } from '../funciones.js';
import { appoinments } from '../selectores.js'

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

    // Tambien se puede aplicar destructuramiento dentro del parentesis donde se pasan los argumentos a la funcion
    printDates({ appoin }) {

        this.clearHTML();

        appoin.forEach(cita => {
            const { client, brand, model, phone, notes, id, date } = cita
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

        })
    }
    clearHTML() {
        while (appoinments.firstChild) {
            appoinments.removeChild(appoinments.firstChild)
        }
    }
}

export default UI;