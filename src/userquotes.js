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
// fetch("http://localhost:4000/users/flamework89@gmail.com")
//   .then((resp) => resp.json())
//   .then((data) => console.log(data.Quotes));

// function fetchToMock(quote) {
//   return fetch("http://localhost:4000/users/anniewong_06@hotmail.com", {
//     method: "DELETE",
//     headers: {
//       "Content-Type": "application/json",
//       Accept: "application/json",
//     },
//     body: JSON.stringify(quote),
//   });
// }

// const tryDelete = {
//   Quotes:
//     "I tried to get a baseball movie made a couple of years ago and I don't think it didn't happen because I was a woman, but because sports movie don't sell internationally.",
// };

// fetchToMock(tryDelete);
