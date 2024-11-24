// for Bootstrap form validation
(() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
  })()



// // For flash message pop up (Bootstrap toasts)

document.addEventListener('DOMContentLoaded', function () {
  const toastTrigger = document.getElementById('liveToastBtn');
  const toastLiveExample = document.getElementById('liveToast');

  if (toastTrigger && toastLiveExample) {
      const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
      toastTrigger.addEventListener('click', () => {
          toastBootstrap.show();
      });
      
      // Automatically trigger the toast if there's a success message
      if (toastTrigger.style.display === 'none') {
          toastTrigger.click();
      }
  }
});


// Track the description limit
let description = document.getElementById("description");
let desError = document.getElementById("error-des");
let maxChar = 1000;

description.addEventListener("input", () => {
  let currChar = description.value.length;

  if(currChar > maxChar){
    description.value = description.value.substring(0, maxChar);
    desError.textContent = `You have reached the ${maxChar} characters limit!`;
    desError.classList.remove("no-error");
    desError.classList.add("exceed-error");
  }
  else{
    desError.textContent = `Maximum ${maxChar} charecters!`;
    desError.classList.remove("exceed-error");
    desError.classList.add("no-error");
  }
})


// Track the title limit
let title = document.getElementById("title");
let titleError = document.getElementById("error-title");
let maxChars = 50;

title.addEventListener("input", () => {
  let currChar = title.value.length;

  if(currChar > maxChars){
    title.value = title.value.substring(0, maxChars);
    titleError.textContent = `You have reached the ${maxChars} characters limit!`;
    titleError.classList.remove("no-error");
    titleError.classList.add("exceed-error");
  }
  else{
    titleError.textContent = `Maximum ${maxChars} charecters!`;
    titleError.classList.remove("exceed-error");
    titleError.classList.add("no-error");
  }
})

