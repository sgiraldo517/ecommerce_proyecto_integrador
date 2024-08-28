class CurrentDTO {
    constructor(userSession) {
        this.first_name =  userSession.first_name;
        this.last_name = userSession.last_name;
        this.email = userSession.email;
        this.age = userSession.age;
        this.role = userSession.role
    }
}

export default CurrentDTO