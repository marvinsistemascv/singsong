function checar_login(){
  var formData = new FormData();
  formData.append("email", document.querySelector('#email').value);
  formData.append("senha", document.querySelector('#senha').value);
  fetch('/checar_login', {
    method: 'POST',
    body: formData
  })
    .then(response => {
      if (response.ok){
           window.location.replace('/home');
      } else {
Swal.fire({
  title: "Login",
  text: "dados inválidos",
  icon: "error"
});
      }
    })
}