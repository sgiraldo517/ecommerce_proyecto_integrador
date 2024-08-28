import { createHash } from "../../utils.js";

class UsersDTO {
    constructor(user) {
        if (user.full_name) {
            const names = user.full_name.split(" ");
            this.first_name = names[0];
            this.last_name = names.slice(1).join(" ");
        } else {
            this.first_name = user.first_name;
            this.last_name = user.last_name;
        }
        this.email = user.email;
        this.age = user.age || null;
        this.password = user.password ? createHash(user.password) : null;
        this.role = "user"
    }
}

export default UsersDTO