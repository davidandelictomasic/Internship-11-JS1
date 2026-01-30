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
const display = document.querySelector(".display");
const buttonsContainer = document.querySelector(".buttons");
const opFilter = document.querySelector("#history-op-filter");
const toggleBtn = document.querySelector("#toggle-history-btn");
const historyPanel = document.querySelector("#history-panel");

let currentInput = "0";
let operator = null;
let previousInput = "";
let actionSelected = false;
let isCalculatorOn = true;
let isShiftMode = false;
let history = [];
let isHistoryVisible = false;

function generateButtons() {
  buttonsContainer.innerHTML = "";

  buttonData.forEach((btnData) => {
    const button = document.createElement("div");
    button.className = "button";
    button.id = btnData.id;

    if (isShiftMode && btnData.shiftLabel) {
      button.textContent = btnData.shiftLabel;
    } else if (btnData.type === "number") {
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
      isShiftMode = !isShiftMode;
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
function handleNumber(value) {
  if (actionSelected) {
    currentInput = value;
    actionSelected = false;
  } else {
    currentInput = currentInput === "0" ? value : currentInput + value;
  }
  updateDisplay();
}

function handleOperation(operation) {
  if (isShiftMode) {
    handleShiftOperation(operation);
  } else {
    handleNormalOperation(operation);
  }
}

function handleNormalOperation(operation) {
  switch (operation) {
    case "square":
      const num = parseFloat(currentInput);
      currentInput = (num ** 2).toString();
      actionSelected = true;
      addToHistory(num, "x²", null, currentInput);
      break;
    case "divide":
    case "multiply":
    case "add":
    case "subtract":
      previousInput = currentInput;
      operator = operation;
      actionSelected = true;
      break;
  }
  updateDisplay();
}

function handleShiftOperation(operation) {
  const num = parseFloat(currentInput);
  let result;
  let opSymbol;

  switch (operation) {
    case "square":
      result = factorial(num);
      opSymbol = "!";
      break;
    case "divide":
      result = num ** 3;
      opSymbol = "x³";
      break;
    case "multiply":
      result = num > 0 ? Math.log10(num) : "Error";
      opSymbol = "log";
      break;
    case "subtract":
      result = num >= 0 ? Math.sqrt(num) : "Error";
      opSymbol = "√x";
      break;
    case "add":
      result = Math.cbrt(num);
      opSymbol = "³√x";
      break;
  }

  currentInput = result.toString();
  actionSelected = true;
  addToHistory(num, opSymbol, null, currentInput);
  updateDisplay();
}

function handleAction(action) {
  switch (action) {
    case "clear":
      currentInput = "0";
      actionSelected = false;
      operator = null;
      previousInput = "";
      updateDisplay();
      break;
    case "equals":
      if (operator && previousInput) {
        const result = calculate();
        addToHistory(
          parseFloat(previousInput),
          getOperatorSymbol(operator),
          parseFloat(currentInput),
          result,
        );
        currentInput = result;
        operator = null;
        previousInput = "";
        actionSelected = true;
        updateDisplay();
      }
      break;
  }
}

function addToHistory(input1, operation, input2, result) {
  if (!isCalculatorOn) return;
  const entry = {
    input1,
    operation,
    input2,
    result,
    timestamp: new Date().toLocaleString(),
  };
  history.push(entry);
}

function getOperatorSymbol(op) {
  const symbols = {
    add: "+",
    subtract: "−",
    multiply: "×",
    divide: "÷",
  };
  return symbols[op] || op;
}

function toggleHistory() {
  isHistoryVisible = !isHistoryVisible;
  historyPanel.style.display = isHistoryVisible ? "block" : "none";
  if (isHistoryVisible) {
    renderHistoryList();
  }
}

opFilter.addEventListener("change", renderHistoryList);

toggleBtn.addEventListener("click", () => {
  if (!isCalculatorOn) return;
  const isVisible = historyPanel.style.display === "block";
  historyPanel.style.display = isVisible ? "none" : "block";
  toggleBtn.textContent = isVisible ? "Show History" : "Hide History";
  if (!isVisible) renderHistoryList();
});

function renderHistoryList() {
  const opValue = opFilter ? opFilter.value : "";
  let filtered = history;
  if (opValue) {
    filtered = filtered.filter((h) => h.operation === opValue);
  }
  const list = document.getElementById("history-list");
  if (!filtered.length) {
    list.innerHTML = "<em>No history found.</em>";
    return;
  }
  list.innerHTML = filtered
    .map(
      (h) =>
        `<div class="history-list-entry">
      <span class="timestamp">${h.timestamp}</span><br>
      <strong>${h.input1 !== null && h.input1 !== undefined ? h.input1 : ""} ${h.operation} ${h.input2 !== null && h.input2 !== undefined ? h.input2 : ""}</strong> = <span class="result">${h.result}</span>
    </div>`,
    )
    .join("");
}
function calculate() {
  const prev = parseFloat(previousInput);
  const current = parseFloat(currentInput);

  switch (operator) {
    case "add":
      return (prev + current).toString();
    case "subtract":
      return (prev - current).toString();
    case "multiply":
      return (prev * current).toString();
    case "divide":
      return current !== 0 ? (prev / current).toString() : "Error";
    default:
      return currentInput;
  }
}
function factorial(n) {
  if (n < 0) return "Error";
  if (n === 0 || n === 1) return 1;
  if (n > 170) return "Error";
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

function updateDisplay() {
  display.textContent = currentInput || "0";
}

function toggleCalculator() {
  isCalculatorOn = !isCalculatorOn;

  if (!isCalculatorOn) {
    currentInput = "";
    previousInput = "";
    operator = null;
    actionSelected = false;

    history = [];
    historyPanel.style.display = "none";
    const list = document.getElementById("history-list");
    list.innerHTML = "";
    toggleBtn.textContent = "Show History";
    isHistoryVisible = false;
    opFilter.disabled = true;
    toggleBtn.disabled = true;

    display.textContent = "";    

    document.querySelectorAll(".button").forEach((btn) => {
      if (btn.id !== "onoff") {
        btn.style.opacity = "0.3";
      }
    });
  } else {
    currentInput = "0";
    updateDisplay();
    opFilter.disabled = false;
    toggleBtn.disabled = false;

    document.querySelectorAll(".button").forEach((btn) => {
      btn.style.opacity = "1";
    });
  }
}

generateButtons();
updateDisplay();
