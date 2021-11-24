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

fetch("https://imtripleq.github.io/Javascript_project/src/db.json")
  .then((resp) => resp.json())
  .then((data) => {
    console.log(data);
  });

fetch("http://localhost:4000/users")
  .then((resp) => resp.json())
  .then((data) => {
    console.log(data);
  });
