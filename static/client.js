const previewButton = document.getElementById('preview');
const modifyButton = document.getElementById('modify');
const form = document.getElementById('mainForm');
const addText = document.getElementById('addTextField');

previewButton.addEventListener('click', (e) => {
  form.action = '/preview';
  e.preventDefault();
  //ajax request to /preview
  const data = new FormData(document.querySelector('#mainForm'));
  console.log(data);
  const xhr = new XMLHttpRequest();
  xhr.open('POST', '/preview', true);
  xhr.onreadystatechange = function () { 
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      console.log(xhr.response);
      document.getElementById('show-preview').innerHTML = xhr.response;
    }
  }
  xhr.send(data);


});
modifyButton.addEventListener('click', (e) => {
  form.action = '/modify';
  form.submit();
});

addText.addEventListener('click', (e) => {

});

// add an ifrome to preview the website without refreshing the page. 

/* only the first text input is default
 - have an add and remove button for each text input up to three rows
 - when the add button is clicked a new element is created and the correct classes are added
 - grid is updated and elements below the newly inserted text field are moved down in the grid
 - remove button will delete the neewly created txt input and move the elements above upwards 
    in the grid structure

*/

{/* <span class="textField2">Text field 2</span>
<input id="textField2" name="text_2" type="text">
<select id="selectField2" name="class_2">
  <option value="class1">Style 1</option>
  <option value="class2">Style 2</option>
  <option value="class3">Style 3</option>
  <option value="header">Header</option>
</select> */}
