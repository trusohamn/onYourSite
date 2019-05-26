const previewButton = document.getElementById('preview');
// const modifyButton = document.getElementById('modify');
// const form = document.getElementById('mainForm');

previewButton.addEventListener('click', e => {
  e.preventDefault();
  //ajax request to /preview
  const formData = new FormData(document.querySelector('#mainForm'));
  let jsonObject = {};
  for (const [key, value] of formData.entries()) {
    jsonObject[key] = value;
  }
  var url = '/preview';
  var data = jsonObject;
  console.log(data);

  fetch(url, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(res => res.json())
    .then(res => {
      console.log(res.newHTML);
      document.getElementById('show-preview').srcdoc = res.newHTML;
    })
    .catch(error => console.error('Error:', error));
});

// modifyButton.addEventListener('click', (e) => {
//   form.action = '/modify';
//   form.submit();
// });

//jquery ajax flickr
$('#flickrForm').submit(e => {
  e.preventDefault();

  const tags = $('#flickrForm input').val();
  const flickrAPI =
    '//api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?';
  const flickrOptions = {
    tags: tags,
    format: 'json'
  };
  function replaceImgUrl(data) {
    const randomI = Math.floor(Math.random() * data.items.length);
    document.getElementById('imageUrlField').value =
      data.items[randomI].media.m;
    previewButton.click();
  }
  $.getJSON(flickrAPI, flickrOptions, replaceImgUrl);
});

// add an ifrome to preview the website without refreshing the page.

/* only the first text input is default
 - have an add and remove button for each text input up to three rows
 - when the add button is clicked a new element is created and the correct classes are added
 - grid is updated and elements below the newly inserted text field are moved down in the grid
 - remove button will delete the neewly created txt input and move the elements above upwards
    in the grid structure

*/

/* <span class='textField2'>Text field 2</span>
<input id='textField2' name='text_2' type='text'>
<select id='selectField2' name='class_2'>
  <option value='class1'>Style 1</option>
  <option value='class2'>Style 2</option>
  <option value='class3'>Style 3</option>
  <option value='header'>Header</option>
</select> */
