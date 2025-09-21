const title = document.getElementById("title");
const wordInput = document.getElementById("word");
const button = document.getElementById("translateBtn");
const translatedDiv = document.getElementById("translatedDiv");
const meaning = document.getElementById("meaning");
const audio = document.getElementById("audio");
const themeToggle = document.getElementById("toggletheme");

function toggleTheme() {
  document.body.classList.toggle("dark-theme");
  document.body.classList.toggle("light-theme");
  if (document.body.classList.contains("dark-theme")) {
    themeToggle.textContent = "🌞";
  } else {
    themeToggle.textContent = "🌜";
  }
  
}
themeToggle.addEventListener("click", toggleTheme);

// Uyarı mesajı göstermek için fonksiyon
function showWarning(msg) {
  const warning = document.getElementById("warning");
  warning.textContent = msg;
  warning.style.display = "block";
  setTimeout(() => {
    warning.style.display = "none";
  }, 2000);
}

button.addEventListener("click", function () {
  const word = wordInput.value.trim();
  if (!word || /[^a-zA-Z]/.test(word)) {
    showWarning("Geçersiz kelime girdiniz!");
    return;
  }
  fetchApi(word);
});

async function fetchApi(word) {
  translatedDiv.style.display = "none";
  const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
  const result = await fetch(url).then((res) => res.json());
  if (result.title) {
    showWarning(
      "Yanlış kelime girdiniz, böyle bir kelime literatürde bulunmuyor."
    );
  } else {
    translatedDiv.style.display = "block";
    title.textContent = result[0].word;
    meaning.textContent = result[0].meanings[0].definitions[0].definition;
    audio.src = result[0].phonetics[0].audio;
  
  }
}
