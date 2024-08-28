//! Import ticketsModel
import ticketsModel from '../database/models/ticket.model.js'

class Tickets {
    constructor() {

    }
    
    addTicket = async (ticket) => {
        const ticketCreado = await ticketsModel.create(ticket)
        return ticketCreado
    }


}

export default Tickets