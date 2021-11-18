class Users {
  constructor(id, email, array) {
    this.id = id;
    this.email = email;
    this.array = array;
  }

  showQuotes() {
    console.log(this.array);
  }
}

const storeUser = new Users("imtripleq", "abc@gmail.com", "love is wonderful");
const storeuUser = new Users("qqq", "abc@gmail.com", "love is wonderful");

console.log(storeUser);
