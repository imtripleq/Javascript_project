// Used to toggle the menu on small screens when clicking on the menu button
("use strict");

const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");
const btnScrollTo = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector("#section--1");
const nav = document.querySelector(".nav");
const tabs = document.querySelectorAll(".operations__tab");
const tabsContainer = document.querySelector(".operations__tab-container");
const tabsContent = document.querySelectorAll(".operations__content");

///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

btnsOpenModal.forEach((btn) => btn.addEventListener("click", openModal));

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

///////////////////////////////////////
// Button scrolling
btnScrollTo.addEventListener("click", function (e) {
  const s1coords = section1.getBoundingClientRect();
  // console.log(s1coords);

  // console.log(e.target.getBoundingClientRect());

  // console.log("Current scroll (X/Y)", window.pageXOffset, window.pageYOffset);

  // console.log(
  //   "height/width viewport",
  //   document.documentElement.clientHeight,
  //   document.documentElement.clientWidth
  // );

  // Scrolling

  section1.scrollIntoView({ behavior: "smooth" });
});

///////////////////////////////////////
// Page navigation

// 1. Add event listener to common parent element
// 2. Determine what element originated the event

document.querySelector(".nav__links").addEventListener("click", function (e) {
  e.preventDefault();

  // Matching strategy
  if (e.target.classList.contains("nav__link")) {
    const id = e.target.getAttribute("href");
    document.querySelector(id).scrollIntoView({ behavior: "smooth" });
  }
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

// Lazy loading images
const imgTargets = document.querySelectorAll("img[data-src]");

const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  // Replace src with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener("load", function () {
    entry.target.classList.remove("lazy-img");
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: "200px",
});

imgTargets.forEach((img) => imgObserver.observe(img));

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

// const quotePrint2 = (data) => {
//   const quote2 = data.data[0];
//   document.getElementById("operations_quote2").innerText = quote2.quoteText;
//   document.getElementById("operations_author2").innerHTML = quote2.quoteAuthor;
//   document.getElementById("operations_genre2").innerHTML =
//     quote2.quoteGenre.charAt(0).toUpperCase() + quote2.quoteGenre.slice(1);
// };

// const quotePrint3 = (data) => {
//   const quote3 = data.data[0];
//   document.getElementById("operations_quote3").innerText = quote3.quoteText;
//   document.getElementById("operations_author3").innerHTML = quote3.quoteAuthor;
//   document.getElementById("operations_genre3").innerHTML =
//     quote3.quoteGenre.charAt(0).toUpperCase() + quote3.quoteGenre.slice(1);
// };

// let quoteNum1 = Math.floor(Math.random() * 30);
// let quoteNum2 = Math.floor(Math.random() * 30);
// let quoteNum3 = Math.floor(Math.random() * 30);
// let pageNum = Math.floor(Math.random() * 300);
// console.log(quoteNum1);
// console.log(quoteNum2);
// console.log(quoteNum3);
// console.log(pageNum);
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
      // quotePrint2(data);
      // quotePrint3(data);
      console.log(data);
      // for (let i = 0; i < data.data.length; i++)
      // console.log(data.data[i].quoteText);
    });
};

const refreshBtn = document.getElementById("refresh--btn");

refreshBtn.addEventListener("click", () => {
  fetch1(1);
  fetch1(2);
  fetch1(3);
});

fetch1(1);
fetch1(2);
fetch1(3);

///////////////////// Auth0
let auth0 = null;
const fetchAuthConfig = () => fetch("/auth_config.json");

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
};
