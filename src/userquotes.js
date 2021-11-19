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
function fetchFromMock() {
  return fetch("http://localhost:4000/users")
    .then((resp) => resp.json())
    .then((data) => {
      console.log(data);
      data.forEach((e) => {
        const list = document.createElement("tr");
        list.innerHTML = `<td>${data}<td>`;
      });
    });
}

// fetchToMock("hahaha");
// console.log();
