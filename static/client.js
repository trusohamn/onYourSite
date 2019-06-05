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

document.getElementById('addNew').addEventListener('click', e => {
  e.preventDefault();
  const li = document.createElement('li');
  const next_id = document.getElementById('addNew').value++;
  li.innerHTML = `<span class="textField${next_id}">Text</span>
  <input id="textField${next_id}" name="text_${next_id}" type="text"/>
  <select id="selectField${next_id}" name="class_${next_id}">
    <option value="class1">Normal</option>
    <option value="class2">Large</option>
    <option value="class3">Italic</option>
    <option value="header">Gray</option>
  </select>` ;
  document.getElementById('inputList').appendChild(li);



  


});