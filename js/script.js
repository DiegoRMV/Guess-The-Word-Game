let words = [
	{
		word: "addition",
		hint: "The process of adding numbers",
	},
	{
		word: "meeting",
		hint: "Event in which people come together",
	},
	{
		word: "number",
		hint: "Math symbol used for counting",
	},
	{
		word: "exchange",
		hint: "The act of trading",
	},
	{
		word: "canvas",
		hint: "Piece of fabric for oil painting",
	},
	{
		word: "garden",
		hint: "Space for planting flower and plant",
	},
	{
		word: "position",
		hint: "Location of someone or something",
	},
	{
		word: "feather",
		hint: "Hair like outer covering of bird",
	},
	{
		word: "comfort",
		hint: "A pleasant feeling of relaxation",
	},
	{
		word: "tongue",
		hint: "The muscular organ of mouth",
	},
	{
		word: "expansion",
		hint: "The process of increase or grow",
	},
	{
		word: "country",
		hint: "A politically identified region",
	},
	{
		word: "group",
		hint: "A number of objects or persons",
	},
	{
		word: "taste",
		hint: "Ability of tongue to detect flavour",
	},
	{
		word: "store",
		hint: "Large shop where goods are traded",
	},
	{
		word: "field",
		hint: "Area of land for farming activities",
	},
	{
		word: "friend",
		hint: "Person other than a family member",
	},
	{
		word: "pocket",
		hint: "A bag for carrying small items",
	},
	{
		word: "needle",
		hint: "A thin and sharp metal pin",
	},
	{
		word: "expert",
		hint: "Person with extensive knowledge",
	},
	{
		word: "statement",
		hint: "A declaration of something",
	},
	{
		word: "second",
		hint: "One-sixtieth of a minute",
	},
	{
		word: "library",
		hint: "Place containing collection of books",
	},
];

const right = document.querySelector(".right span");
const wrong = document.querySelector(".wrong span");
const display = document.querySelector(".display");
const tries = document.querySelectorAll(".tries span");
const mistakes = document.querySelector(".mistakes span");
const input = document.querySelector("input");
const screen = document.querySelector(".screen");
const btnRandom = document.querySelector(".random");
const btnReset = document.querySelector(".reset");
const btnLanguage = document.getElementById("select-language");

const touchHtml = (id) =>
	`<input type="text" id={input-${id}} class="input-touch" disabled>`;
let word = "";
let incorrects = [];
let corrects = [];
let language = "english";
let wr = 0;
let rg = 0;
let url = `https://random-word-api.herokuapp.com/word`;

// https://random-word-api.herokuapp.com/word

const handleLanguage = () => {
	const indice = btnLanguage.selectedIndex;
	let option = btnLanguage.options[indice];
	language = option.value;

	if (language === "spanish") {
		url = `https://clientes.api.greenborn.com.ar/public-random-word`;
	} else {
		url = `https://random-word-api.herokuapp.com/word`;
	}
	reset();
	load();
};

const fetchWordRandom = async () => {
	try {
		const res = await fetch(url);
		const data = await res.json();
		return data[0];
	} catch (error) {
		console.log(error);
	}
};

const shuffle = (s) => {
	const newArray = Array.from(s);
	const arrayShuffle = newArray.sort(() => Math.random() - 0.5);
	return arrayShuffle.join("");
};

const load = async () => {
	input.disabled = false;
	wordKeys = [];
	screen.innerHTML = "";
	display.innerHTML = "";
	word = "";

	// let wordRandom = words[Math.floor(Math.random() * words.length)].word;
	let wordRandom = await fetchWordRandom();
	word = wordRandom;
	console.log(word);
	let wordShuffle = shuffle(wordRandom);

	display.innerText = wordShuffle;
	for (let i = 0; i < word.length; i++) {
		const screenDiv = document.createElement("div");
		const screenSpan = document.createElement("span");
		screenDiv.append(screenSpan);
		screen.append(screenDiv);
	}
};

const reset = () => {
	for (let i = 0; i < tries.length; i++) {
		tries[i].classList.remove("desactive");
	}
	right.innerHTML = "0";
	wrong.innerHTML = "0";
	wr = 0;
	rg = 0;
};

load();

let i = 0;
const initGame = (e) => {
	let key = e.target.value;

	if (key.match(/^[a-zA-Z]+$/)) {
		if (i < screen.childElementCount - 1) {
			screen.children[i].children[0].classList.remove("blink");
			screen.children[i].children[0].style.borderBottom = null;

			screen.children[i + 1].children[0].className = "blink";
			screen.children[i + 1].children[0].style.borderBottom = "2px solid white";
		} else {
			screen.children[i].children[0].classList.remove("blink");
			screen.children[i].children[0].style.borderBottom = null;
		}
		screen.querySelectorAll(".screen span")[i].innerText = key;
		wordKeys.push(key);
		i++;
	}

	input.value = "";

	if (wordKeys.length === word.length) {
		display.innerText = word;
		input.disabled = true;
		let strWordKeys = wordKeys.join("");
		let wordInput = strWordKeys
			.normalize("NFD")
			.replace(/[\u0300-\u036f]/g, "");
		let wordOrigin = word.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

		if (wordInput.toLowerCase() == wordOrigin) {
			display.classList.add("success");
			right.innerText = ++rg;
			i = 0;
			setTimeout(() => {
				load();
				display.classList.remove("success");
			}, 1700);
		} else {
			display.classList.add("error");
			wrong.innerText = ++wr;
			tries[5 - wr].classList.add("desactive");
			i = 0;
			setTimeout(() => {
				load();
				display.classList.remove("error");
			}, 1700);
		}
		wordKeys = [];
	}

	if (wr === 5) {
		setTimeout(() => {
			alert("Game Over");
			reset();
			display.classList.remove("error");
			i = 0;
		}, 1000);
	}
};

btnRandom.addEventListener("click", load);

btnReset.addEventListener("click", reset);

btnLanguage.addEventListener("change", handleLanguage);

input.addEventListener("input", initGame);

document.addEventListener("keydown", () => input.focus());

screen.addEventListener("click", () => {
	input.focus();
	screen.children[0].children[0].className = "blink";
	screen.children[0].children[0].style.borderBottom = "2px solid white";
});
