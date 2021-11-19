////////// Send to Mock Server

function fetchToMock(quote) {
  return fetch("http://localhost:4000/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(quote),
  });
}

///////////// Add to list
// function fetchFromMock() {
//   fetch("http://localhost:4000/users")
//     .then((resp) => resp.json())
//     .then((data) => {
//       console.log(data);
//       // data.forEach((e) => {
//       //   const list = document.createElement("tr");
//       //   list.innerHTML = `<td>${data}<td>`;
//       // });
//     });
// }

////// Add Quotes
// const addQuotes = (ori, key, value) => {
//   ori[key] = value;

//   return ori;
// };

function updateToMock(quote) {
  return fetch("http://localhost:4000/users", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(quote),
  });
}
const mockUser = {
  id: "abc",
  array: ["test Quote 1"],
};

updateToMock(mockUser);
