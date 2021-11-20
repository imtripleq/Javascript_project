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
fetch("http://localhost:4000/users/flamework89@gmail.com")
  .then((resp) => resp.json())
  .then((data) => console.log(data.Quotes));
