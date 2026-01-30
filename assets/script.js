const buttonData = [
   
    { id: 'onoff', label: 'ON/OFF', type: 'special' },
    { id: 'shift', label: 'SHIFT', type: 'special' },
    { id: 'history', label: 'HISTORY', type: 'special' },

    
    { id: 'square', label: 'x²', shiftLabel: '!', type: 'operation' },
    { id: 'divide', label: '÷', shiftLabel: 'x³', type: 'operation' },
    { id: 'multiply', label: '×', shiftLabel: 'log', type: 'operation' },
    { id: 'subtract', label: '−', shiftLabel: '√x', type: 'operation' },
    { id: 'add', label: '+', shiftLabel: '³√x', type: 'operation' },

    
    { id: 'seven', type: 'number', value: '7' },
    { id: 'eight', type: 'number', value: '8' },
    { id: 'nine', type: 'number', value: '9' },
    { id: 'four', type: 'number', value: '4' },
    { id: 'five', type: 'number', value: '5' },
    { id: 'six', type: 'number', value: '6' },
    { id: 'one', type: 'number', value: '1' },
    { id: 'two', type: 'number', value: '2' },
    { id: 'three', type: 'number', value: '3' },
    { id: 'zero', type: 'number', value: '0' },

   
    { id: 'equals', label: '=', type: 'action' },
    { id: 'clear', label: 'C', type: 'action' }
];


const buttonsContainer = document.querySelector('.buttons');


function generateButtons() {
    buttonsContainer.innerHTML = ''; 

    buttonData.forEach(btnData => {
        const button = document.createElement('div');
        button.className = 'button';
        button.id = btnData.id;      

        if (btnData.type === 'number') {
            button.textContent = btnData.value;
        } else {
            button.textContent = btnData.label;
        }
         

        buttonsContainer.appendChild(button);
    });
}
generateButtons();