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
export default Dates;