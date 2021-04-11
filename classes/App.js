import { apptData, newAppoinment } from '../funciones.js'
import {
    clienteInput,
    bikeBrand,
    bikeModel,
    phoneNumber,
    serviceNotes,
    form
} from '../selectores.js'

class App {

    constructor() {
        this.initApp();
    }

    initApp() {
        clienteInput.addEventListener('input', apptData);
        bikeBrand.addEventListener('input', apptData);
        bikeModel.addEventListener('input', apptData);
        phoneNumber.addEventListener('input', apptData);
        serviceNotes.addEventListener('input', apptData);
        // Formulario listener
        form.addEventListener('submit', newAppoinment);
    }
}

export default App