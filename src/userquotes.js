////////// Send to Mock Server

function fetchToMock(quote) {
  return fetch("http://localhost:3000/db", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      Quotes: 1,
    }),
  });
}

///////////// Add to list
function fetchFromMock() {
  return fetch("http://localhost:3000/db")
    .then((resp) => resp.json())
    .then((data) => {
      console.log(data);
      data.forEach((e) => {
        const list = document.createElement("tr");
        list.innerHTML = `<td>${data}<td>`;
      });
    });
}
