class TicketsRepositories{
    constructor(dao) {
        this.dao = dao
    }

    createNewTicket = async ({ code, amount, purchaser }) => {
        let newTicket = ({ code, amount, purchaser }) 
        let result = await this.dao.addTicket(newTicket)
        return result
    }



}

export default TicketsRepositories