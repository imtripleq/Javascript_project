("use strict");

const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnScrollTo = document.querySelector(".btn--scroll-to");
const section2 = document.querySelector("#section--2");
const nav = document.querySelector(".nav");
const tabs = document.querySelectorAll(".operations__tab");
const tabsContainer = document.querySelector(".operations__tab-container");
const tabsContent = document.querySelectorAll(".operations__content");

///////////////////////////////////////
// Button scrolling
btnScrollTo.addEventListener("click", function (e) {
  const s1coords = section2.getBoundingClientRect();
  // Scrolling

  section2.scrollIntoView({ behavior: "smooth" });
});

///////////////////////////////////////
// Tabbed component

tabsContainer.addEventListener("click", function (e) {
  const clicked = e.target.closest(".operations__tab");

  // Guard clause
  if (!clicked) return;

  // Remove active classes
  tabs.forEach((t) => t.classList.remove("operations__tab--active"));
  tabsContent.forEach((c) => c.classList.remove("operations__content--active"));

  // Activate tab
  clicked.classList.add("operations__tab--active");

  // Activate content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add("operations__content--active");
});

///////////////////////////////////////
// Menu fade animation
const handleHover = function (e) {
  if (e.target.classList.contains("nav__link")) {
    const link = e.target;
    const siblings = link.closest(".nav").querySelectorAll(".nav__link");
    const logo = link.closest(".nav").querySelector("img");

    siblings.forEach((el) => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

// Passing "argument" into handler
nav.addEventListener("mouseover", handleHover.bind(0.5));
nav.addEventListener("mouseout", handleHover.bind(1));

///////////////////////////////////////
// Sticky navigation: Intersection Observer API

const header = document.querySelector(".header");
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) nav.classList.add("sticky");
  else nav.classList.remove("sticky");
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

///////////////////////////////////////
// Reveal sections
const allSections = document.querySelectorAll(".section");

const revealSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.classList.remove("section--hidden");
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add("section--hidden");
});

///////////////////////////////////////

//////////////////// API SERVER

const quotePrint1 = (data, num) => {
  const quote = data.data[0];
  document.getElementById(
    `operations_quote${num}`
  ).innerText = `"${quote.quoteText}"`;
  document.getElementById(`operations_author${num}`).innerHTML =
    quote.quoteAuthor;
  document.getElementById(`operations_genre${num}`).innerHTML =
    quote.quoteGenre.charAt(0).toUpperCase() + quote.quoteGenre.slice(1);
};
let url = new URL("https://quote-garden.herokuapp.com/api/v3/quotes/random");
url.search = new URLSearchParams({
  // page: pageNum,
  // limit: 200,
  // message: "Random quotes",
});

const fetch1 = (a) => {
  fetch(url)
    .then((resp) => resp.json())
    .then((data) => {
      quotePrint1(data, a);
    });
};

const refreshBtn = document.getElementById("refresh--btn");

refreshBtn.addEventListener("click", () => {
  fetch1(1);
  fetch1(2);
  fetch1(3);
  document.getElementById("likeButton1").innerText = "Like ♡";
  document.getElementById("likeButton2").innerText = "Like ♡";
  document.getElementById("likeButton3").innerText = "Like ♡";
  document.getElementById("likeButton1").disabled = false;
  document.getElementById("likeButton2").disabled = false;
  document.getElementById("likeButton3").disabled = false;
});

fetch1(1);
fetch1(2);
fetch1(3);

///////// Auth0 Running
let auth0 = null;
const fetchAuthConfig = () => fetch("auth_config.json");

const configureClient = async () => {
  const response = await fetchAuthConfig();
  const config = await response.json();

  auth0 = await createAuth0Client({
    domain: config.domain,
    client_id: config.clientId,
  });
};

window.onload = async () => {
  await configureClient();
  updateUI();

  const isAuthenticated = await auth0.isAuthenticated();

  if (isAuthenticated) {
    // show the gated content
    return;
  }

  // NEW - check for the code and state parameters
  const query = window.location.search;
  if (query.includes("code=") && query.includes("state=")) {
    // Process the login state
    await auth0.handleRedirectCallback();

    updateUI();

    // Use replaceState to redirect the user away and remove the querystring parameters
    window.history.replaceState({}, document.title, "/");
  }
};
const logout = () => {
  auth0.logout({
    returnTo: window.location.origin,
  });
};

const login = async () => {
  await auth0.loginWithRedirect({
    redirect_uri: window.location.origin,
  });
};

////////////////////////////////////////////////////////
//////////// Mighty UpdateUI Starts Here ///////////////
////////////////////////////////////////////////////////

const updateUI = async () => {
  const isAuthenticated = await auth0.isAuthenticated();

  // document.getElementById("btn-logout").disabled = !isAuthenticated;
  document.getElementById("btn-login").disabled = isAuthenticated;
  user = await auth0.getUser();
  // NEW - add logic to show/hide gated content after authentication
  if (isAuthenticated) {
    user = await auth0.getUser();

    /////////// Remove Or Add hidden
    document.getElementById("refresh--btn").classList.remove("hidden");
    document.getElementById("navLogin").setAttribute("onclick", "logout()");
    document.getElementById("navLogin").innerText = "Log out";
    document.getElementById("account-only-header").innerHTML = "";
    document.getElementById("btn-login").classList.add("hidden");
    document.querySelector(".login-container").innerHTML = "";
    // document.getElementById("btn-logout").classList.remove("hidden");
    // document.getElementById("btn-fetch").classList.remove("hidden");
    document.getElementById("likeButton1").classList.remove("hidden");
    document.getElementById("likeButton2").classList.remove("hidden");
    document.getElementById("likeButton3").classList.remove("hidden");
    document.getElementById("table-wrapper").classList.remove("hidden");
    document.getElementById("gated-content").classList.remove("hidden");
    // document.getElementById("ipt-access-token").innerHTML =
    //   await auth0.getTokenSilently();

    ////// Loading Id Table Content
    async function fetchAndCheck(userID) {
      const resp = await fetch(`http://localhost:4000/users/${userID}`);
      const data = await resp.json();

      for (let i = 0; i < data.Quotes.length; i++) {
        const tbody = document.querySelector(".quotes-table");
        const tr = document.createElement("tr");
        tr.innerHTML = `
        <td>${i + 1}</td>
        <td>${data.Quotes[i]}</td>
        <td><button type="button" onclick="deleteQuote('${userID}',${i})" class="buton-28" id="deleteBtn${i}">Delete</button></td>`;
        // console.log(data.Quotes[i]);
        tbody.appendChild(tr);
      }
    }

    //////////////// Quotes Start

    ////////// Fetch the Users from database
    async function fetchFromMock(loggedId) {
      const resp = await fetch("http://localhost:4000/users");
      const data = await resp.json();
      //////////

      ////Check New or Old account after login ////
      ////////  Getting Database Email
      const dataEmail = [];
      for (let i = 0; i < data.length; i++) {
        dataEmail.push(data[i].email);
      }

      ////////// Match Database Email
      // console.log(dataEmail);
      const findEmail = dataEmail.indexOf(user.email) > -1;
      // console.log(findEmail);

      ///////// Creating new User
      if (findEmail) {
        fetchAndCheck(user.email);
        console.log(`User Existed`);
      } else if (!findEmail) {
        console.log(`Creating User...`);
        const testCreate = new Users(user.email, user.email, [], user.name);
        fetchToMock(testCreate);
      }

      //////// Add Liked Quote to array
      function likedQuote(q, id) {
        fetch("http://localhost:4000/users")
          .then((resp) => resp.json())
          .then((data) => {
            const selecting =
              data[data.map((selectUser) => selectUser.id).indexOf(id)];

            console.log(selecting);

            data[data.map((user_1) => user_1.id).indexOf(id)].Quotes.push(q);

            const copySelecting = { Quotes: [...selecting.Quotes] };

            console.log(copySelecting);

            updateToMock(copySelecting, loggedId.email);
          });
      }

      document.getElementById("likeButton1").addEventListener("click", () => {
        const likeButton1 = document.getElementById("likeButton1");
        likeButton1.innerText = "Liked ❤";
        const quote1 = document.getElementById("operations_quote1").innerHTML;
        likedQuote(quote1, loggedId.email);
        document.getElementById("likeButton1").disabled = true;
        (document.querySelector(".quotes-table").innerHTML = ""),
          setTimeout(() => fetchAndCheck(loggedId.email), 500);
        console.log("clicked1");
      });
      document.getElementById("likeButton2").addEventListener("click", () => {
        document.getElementById("likeButton2").innerText = "Liked ❤";
        const quote2 = document.getElementById("operations_quote2").innerHTML;
        likedQuote(quote2, loggedId.email);
        document.getElementById("likeButton2").disabled = true;
        (document.querySelector(".quotes-table").innerHTML = ""),
          setTimeout(() => fetchAndCheck(loggedId.email), 500);
        console.log("clicked2");
      });
      document.getElementById("likeButton3").addEventListener("click", () => {
        document.getElementById("likeButton3").innerText = "Liked ❤";
        const quote3 = document.getElementById("operations_quote3").innerHTML;
        likedQuote(quote3, loggedId.email);
        document.getElementById("likeButton3").disabled = true;
        (document.querySelector(".quotes-table").innerHTML = ""),
          setTimeout(() => fetchAndCheck(loggedId.email), 500);
        console.log("clicked3");
      });
    }
    fetchFromMock(user);

    //////////////// Quotes End
    ////////////////////Show Welcome back After logged in
    const userImg = document.createElement("img");
    userImg.setAttribute("src", `${user.picture}`);

    document.getElementById(
      "ipt-user-profile"
    ).innerHTML = `<span class="highlight">Welcome back</span> 
    ${user.name}!`;
    document.getElementById("ipt-user-profile").appendChild(userImg);
    // JSON.stringify(user);
  } else {
    document.getElementById("gated-content").classList.add("hidden");
  }

  ///////////////////////// Pushing Quote to Database
  function updateToMock(quote, id) {
    return fetch(`http://localhost:4000/users/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(quote),
    });
  }

  //////// Delete button
  deleteQuote = function (loggedId, num) {
    fetch("http://localhost:4000/users")
      .then((resp) => resp.json())
      .then((data) => {
        const selecting =
          data[data.map((selectUser) => selectUser.id).indexOf(loggedId)];
        data[data.map((user_1) => user_1.id).indexOf(loggedId)].Quotes.splice(
          num,
          1
        );
        const deleteSelecting = { Quotes: [...selecting.Quotes] };
        updateToMock(deleteSelecting, loggedId);

        // updateToMock(copySelecting, loggedId.email);

        ////// Loading Id Table Content
        async function fetchAndRefresh(userID) {
          const resp = await fetch(`http://localhost:4000/users/${userID}`);
          const data = await resp.json();

          for (let i = 0; i < data.Quotes.length; i++) {
            const tbody = document.querySelector(".quotes-table");
            const tr = document.createElement("tr");
            tr.innerHTML = `
        <td>${i + 1}</td>
        <td>${data.Quotes[i]}</td>
        <td><button type="button" onclick="deleteQuote('${userID}',${i})" class="buton-28" id="deleteBtn${i}">Delete</button></td>`;
            // console.log(data.Quotes[i]);
            tbody.appendChild(tr);
          }
        }
        (document.querySelector(".quotes-table").innerHTML = ""),
          setTimeout(() => fetchAndRefresh(loggedId), 500);
      });
  };

  // console.log(user);
  // deleteQuote(user);
};

////////////////////////////////////////////////////////
//////////// Mighty UpdateUI Starts Ends ///////////////
////////////////////////////////////////////////////////
