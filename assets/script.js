const buttonData = [
  { id: "onoff", label: "ON/OFF", type: "special" },
  { id: "shift", label: "SHIFT", type: "special" },
  { id: "history", label: "HISTORY", type: "special" },

  { id: "square", label: "x²", shiftLabel: "!", type: "operation" },
  { id: "divide", label: "÷", shiftLabel: "x³", type: "operation" },
  { id: "multiply", label: "×", shiftLabel: "log", type: "operation" },
  { id: "subtract", label: "−", shiftLabel: "√x", type: "operation" },
  { id: "add", label: "+", shiftLabel: "³√x", type: "operation" },

  { id: "seven", type: "number", value: "7" },
  { id: "eight", type: "number", value: "8" },
  { id: "nine", type: "number", value: "9" },
  { id: "four", type: "number", value: "4" },
  { id: "five", type: "number", value: "5" },
  { id: "six", type: "number", value: "6" },
  { id: "one", type: "number", value: "1" },
  { id: "two", type: "number", value: "2" },
  { id: "three", type: "number", value: "3" },
  { id: "zero", type: "number", value: "0" },

  { id: "equals", label: "=", type: "action" },
  { id: "clear", label: "C", type: "action" },
];

const buttonsContainer = document.querySelector(".buttons");

let currentInput = "0";
let operator = null;
let previousInput = "";
let isCalculatorOn = true;

function generateButtons() {
  buttonsContainer.innerHTML = "";

  buttonData.forEach((btnData) => {
    const button = document.createElement("div");
    button.className = "button";
    button.id = btnData.id;

    if (btnData.type === "number") {
      button.textContent = btnData.value;
    } else {
      button.textContent = btnData.label;
    }
    button.addEventListener("click", () => handleButtonClick(btnData));
    buttonsContainer.appendChild(button);
  });
}

function handleButtonClick(btnData) {
  if (!isCalculatorOn && btnData.id !== "onoff") {
    return;
  }

  switch (btnData.type) {
    case "number":
      handleNumber(btnData.value);
      break;
    case "operation":
      handleOperation(btnData.id);
      break;
    case "action":
      handleAction(btnData.id);
      break;
    case "special":
      handleSpecial(btnData.id);
      break;
  }
}

function handleSpecial(special) {
  switch (special) {
    case "shift":
      generateButtons();
      break;
    case "history":
      toggleHistory();
      break;
    case "onoff":
      toggleCalculator();
      break;
  }
}

function toggleCalculator() {
  isCalculatorOn = !isCalculatorOn;

  if (!isCalculatorOn) {
    currentInput = "";
    previousInput = "";
    operator = null;

    document.querySelectorAll(".button").forEach((btn) => {
      if (btn.id !== "onoff") {
        btn.style.opacity = "0.3";
      }
    });
  } else {
    currentInput = "0";

    document.querySelectorAll(".button").forEach((btn) => {
      btn.style.opacity = "1";
    });
  }
}

generateButtons();
