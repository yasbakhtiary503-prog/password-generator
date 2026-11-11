/* ===========================================
                DOM ELEMENTS
=========================================== */

const inputResultEl = document.querySelector(".password-form__result");
const inputNumberEl = document.querySelector(".password-options__input-number");

const inputLowercaseEl = document.getElementById("include-lowercase");
const inputUppercaseEl = document.getElementById("include-uppercase");
const inputNumbersEl = document.getElementById("include-numbers");
const inputSymbolsEl = document.getElementById("include-symbols");

const buttonCopyEl = document.querySelector(".password-form__copy-button");
const buttonGenerateEl = document.querySelector(
  ".password-form__generate-button",
);

/* ===========================================
                CHARACTER SETS
=========================================== */

const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const numberChars = "0123456789";
const symbolChars = "!@#$%^&*()_+-=[]{}|;:,.<>?";

/* ===========================================
                GENERATE PASSWORD
=========================================== */

const buildCharacterPool = () => {
  // -- Read current checkbox states

  const isLowercaseIncluded = inputLowercaseEl.checked;
  const isUppercaseIncluded = inputUppercaseEl.checked;
  const isNumbersIncluded = inputNumbersEl.checked;
  const isSymbolsIncluded = inputSymbolsEl.checked;

  // -- Build character pool

  let characterPool = "";

  if (isLowercaseIncluded) {
    characterPool += lowercaseChars;
  }

  if (isUppercaseIncluded) {
    characterPool += uppercaseChars;
  }

  if (isNumbersIncluded) {
    characterPool += numberChars;
  }

  if (isSymbolsIncluded) {
    characterPool += symbolChars;
  }

  // -- Validate options

  if (characterPool.length === 0) {
    inputResultEl.value = "";
    alert("Please select at least one character type!");
    return;
  }

  return characterPool;
};

const numberInputValidation = () => {
  // -- Read password length

  const passwordLength = Number(inputNumberEl.value);

  // -- Validate password length

  const isValidPasswordLength =
    !Number.isInteger(passwordLength) ||
    passwordLength < 6 ||
    passwordLength > 20;

  if (isValidPasswordLength) {
    alert("Password length must be between 6 and 20!");
    return false;
  }

  return passwordLength;
};

const generateRandomPassword = (characterPool, passwordLength) => {
  let password = "";

  const randomValues = new Uint32Array(passwordLength);

  crypto.getRandomValues(randomValues);

  for (let i = 0; i < passwordLength; i++) {
    const randomIndex = randomValues[i] % characterPool.length;
    password += characterPool[randomIndex];
  }

  return password;
};

const generatePassword = () => {
  // -- Build Character Pool

  const characterPool = buildCharacterPool();

  if (!characterPool) return;

  // -- Validate Password Length

  const passwordLength = numberInputValidation();

  if (passwordLength === false) return;

  // -- Generate secure random password

  const password = generateRandomPassword(characterPool, passwordLength);

  // -- Display generated password

  inputResultEl.value = password;
};

/* ===========================================
                  COPY PASSWORD
=========================================== */

const copyPassword = async () => {
  const password = inputResultEl.value;

  if (!password) {
    alert("Generate a password first!");
    return;
  }

  try {
    await navigator.clipboard.writeText(password);
  } catch (error) {
    console.error("Copy failed:", error);
    alert("Unable to copy password!");
  }
};

/* ===========================================
                  EVENT LISTENERS
=========================================== */

buttonGenerateEl.addEventListener("click", generatePassword);

buttonCopyEl.addEventListener("click", copyPassword);

//

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./service-worker.js")
      .then((registration) => {
        console.log("Service Worker registered:", registration);
      })
      .catch((error) => {
        console.error("Service Worker registration failed:", error);
      });
  });
}
