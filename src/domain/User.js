"use strict";
module.exports = class {
  constructor({ firstname, lastName, email, username, password, image }) {
    this.firstname = firstname;
    this.lastName = lastName;
    this.email = email;
    this.username = username;
    this.password = password;
    this.image = image;
  }
};
