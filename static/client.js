const previewButton = document.getElementById('preview');
const form = document.getElementById('mainForm');

previewButton.addEventListener('click', (e) => {
    form.action = '/preview';
    form.submit();
})
