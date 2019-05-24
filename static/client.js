const previewButton = document.getElementById('preview');
const modifyButton = document.getElementById('modify');
const form = document.getElementById('mainForm');
const addText = document.getElementById('addTextField');
const removeText = document.getElementById('removeTextField');
const select_1 = document.getElementById('mainForm').querySelectorAll('select')[0];
const inputList = document.getElementsByTagName('input'); 




previewButton.addEventListener('click', (e) => {
  form.action = '/preview';
  form.submit();
});
modifyButton.addEventListener('click', (e) => {
  form.action = '/modify';
  form.submit();
});

const textFieldCheck = () => {
  if(inputList.textField2){
    return 3; 
  } else if (inputList.textField1){
    return 2; 
  }
}

addText.addEventListener('click', () => {
  const textFieldNode = document.getElementById('textField1');
  // let textNode = document.createElement('div');
  const x = textFieldCheck();

  const newTxtField = `<span class="textField${x}">Text field ${x}</span>`;
  const newInput = `<input id="textField${x}" name="text_${x}" type="text">`;
  const newSelect =
    `<select id="selectField${x}" name="class_${x}">
     <option value="class1">Style 1</option>
     <option value="class2">Style 2</option>
     <option value="class3">Style 3</option>
     <option value="header">Header</option>
     </select>`

  select_1.insertAdjacentHTML("afterend", newTxtField);
  select_1.insertAdjacentHTML("afterend", newInput);
  select_1.insertAdjacentHTML("afterend", newSelect);

});

removeText.addEventListener('click', () => {
  if(inputList.textField3){
    form.removeChild(inputList.textField3);
  } else if (inputList.textField2){
    form.removeChild(inputList.textField2);
  }
});


 


  // targetElement.insertAdjacentElement(position, element);




  // textFieldNode.after(textNode);



// targetElement.insertAdjacentElement(position, element);


/*
// Create a new element
var newNode = document.createElement('div');

// Get the reference node
var referenceNode = document.querySelector('#some-element');

// Insert the new node before the reference node
referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
*/


//#removeTextField
//#addTextField

// add an ifrome to preview the website without refreshing the page. 

/* only the first text input is default
 - have an add and remove button for each text input up to three rows
 - when the add button is clicked a new element is created and the correct classes are added
 - grid is updated and elements below the newly inserted text field are moved down in the grid
 - remove button will delete the neewly created txt input and move the elements above upwards 
    in the grid structure

*/


// let htmlStyles = window.getComputedStyle(document.querySelector("html"));
// let rowNum = parseInt(htmlStyles.getPropertyValue("--rowNum"));

// document.documentElement.style.setProperty("--rowNum", 6);
