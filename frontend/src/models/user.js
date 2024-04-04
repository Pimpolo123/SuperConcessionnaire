export default class User {
    constructor(username, email, password, name, surname, phonenumber, birthdate, banned) {
      this.username = username;
      this.email = email;
      this.password = password;
      this.name = name;
      this.surname = surname;
      this.phonenumber = phonenumber;
      this.birthdate = birthdate;
      this.banned = banned;
    }
  }