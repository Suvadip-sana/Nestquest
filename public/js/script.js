// For flash message pop up (Bootstrap toasts)
document.addEventListener("DOMContentLoaded", function () {
  const toastTrigger = document.getElementById("liveToastBtn");
  const toastLiveExample = document.getElementById("liveToast");

  if (toastTrigger && toastLiveExample) {
    const toastBootstrap =
      bootstrap.Toast.getOrCreateInstance(toastLiveExample);
    toastTrigger.addEventListener("click", () => {
      toastBootstrap.show();
    });

    // Automatically trigger the toast if there's a success message
    if (toastTrigger.style.display === "none") {
      toastTrigger.click();
    }
  }
});



// form-validation.js
document.addEventListener("DOMContentLoaded", () => {
  // Constants
  const MAX_IMAGES = 3;
  const MIN_IMAGES = 1;
  const MAX_LENGTHS = {
    title: 50,
    description: 1000,
    price: 999999,
    location: 25,
    country: 25
  };

  // Initialize validation for all forms
  document.querySelectorAll(".needs-validation").forEach(form => {
    initFormValidation(form);
  });

  function initFormValidation(form) {
    const isEditForm = form.querySelector(".edit-preview-container") !== null;
    let existingImages = 0;
    let deleteCheckboxes = [];

    // Edit form specific setup
    if (isEditForm) {
      existingImages = form.querySelectorAll(".preview-image").length;
      deleteCheckboxes = Array.from(form.querySelectorAll(".imgDel"));
      
      // Add event listeners to delete checkboxes
      deleteCheckboxes.forEach(checkbox => {
        checkbox.addEventListener("change", () => validateImages(form, isEditForm, existingImages, deleteCheckboxes));
      });
    }

    // Setup field validations
    setupFieldValidation(form, "title");
    setupFieldValidation(form, "description");
    setupFieldValidation(form, "price");
    setupFieldValidation(form, "location");
    setupFieldValidation(form, "country");

    // Setup file input validation
    const fileInput = form.querySelector("#inputFile");
    if (fileInput) {
      fileInput.addEventListener("change", () => validateImages(form, isEditForm, existingImages, deleteCheckboxes));
    }

    // Form submit handler
    form.addEventListener("submit", function(event) {
      if (!validateForm(this, isEditForm, existingImages, deleteCheckboxes)) {
        event.preventDefault();
        event.stopPropagation();
      }
      this.classList.add("was-validated");
    });
  }

  function setupFieldValidation(form, fieldId) {
    const field = form.querySelector(`#${fieldId}`);
    if (!field) return;

    field.addEventListener("input", () => {
      const value = field.value.trim();
      const rawValue = field.value;
      const maxLength = MAX_LENGTHS[fieldId];

      // Special handling for price field
      if (fieldId === "price") {
        const numericValue = parseFloat(rawValue);
        
        if (rawValue === "") {
          setValidationState(field, false, "required");
        } else if (isNaN(numericValue)) {
          setValidationState(field, false, "invalid");
        } else if (numericValue > maxLength) {
          setValidationState(field, false, "length");
        } else {
          setValidationState(field, true);
        }
      } 
      // Handle other fields
      else {
        if (rawValue.length > maxLength) {
          field.value = rawValue.substring(0, maxLength);
          setValidationState(field, false, "length");
        } else if (value.length === 0) {
          setValidationState(field, false, "required");
        } else {
          setValidationState(field, true);
        }
      }

    });
  }

  function validateImages(form, isEditForm, existingImgCount, deleteBoxes) {
    const fileInput = form.querySelector("#inputFile");
    const fileError = form.querySelector("#fileError");
    const submitBtn = form.querySelector("#submitButton");
    let isValid = true;
    let errorMessage = "";

    if (isEditForm) {
      // Edit form validation
      const selectedToDelete = deleteBoxes.filter(cb => cb.checked).length;
      const remainingImages = existingImgCount - selectedToDelete;
      const newImages = fileInput.files.length;
      const totalImages = remainingImages + newImages;

      if (totalImages > MAX_IMAGES) {
        isValid = false;
        errorMessage = `Maximum total ${MAX_IMAGES} images allowed. Adjust total images accordingly!`;
      } else if (totalImages < MIN_IMAGES) {
        isValid = false;
        errorMessage = `At least ${MIN_IMAGES} image is required!`;
      }
    } else {
      // New form validation
      if (fileInput.files.length === 0) {
        isValid = false;
        errorMessage = "Please upload at least one image";
      } else if (fileInput.files.length > MAX_IMAGES) {
        isValid = false;
        errorMessage = `Maximum ${MAX_IMAGES} images allowed`;
      }
    }

    // Update UI
    if (fileError) {
      if (!isValid) {
        fileError.textContent = errorMessage;
        fileError.classList.remove("invisible");
        fileError.classList.add("visible");
      } else {
        fileError.classList.remove("visible");
        fileError.classList.add("invisible");
      }
    }

    if (submitBtn) {
      submitBtn.disabled = !isValid;
    }

    return isValid;
  }

  function validateForm(form, isEditForm, existingImgCount, deleteBoxes) {
    let isValid = true;

    // Validate fields
    isValid = validateField(form, "title") && isValid;
    isValid = validateField(form, "description") && isValid;
    isValid = validateField(form, "price") && isValid;
    isValid = validateField(form, "location") && isValid;
    isValid = validateField(form, "country") && isValid;

    // Validate images
    isValid = validateImages(form, isEditForm, existingImgCount, deleteBoxes) && isValid;

    return isValid;
  }

  function validateField(form, fieldId) {
    const field = form.querySelector(`#${fieldId}`);
    if (!field) return true;

    const value = field.value.trim();
    let isValid = true;

    if (value.length === 0) {
      setValidationState(field, false, "required");
      isValid = false;
    } else if (fieldId === "price") {
      const numericValue = parseFloat(value);
      if (isNaN(numericValue)) {
        setValidationState(field, false, "invalid");
        isValid = false;
      } else if (numericValue > MAX_LENGTHS.price) {
        setValidationState(field, false, "length");
        isValid = false;
      } else {
        setValidationState(field, true);
      }
    } else if (value.length > MAX_LENGTHS[fieldId]) {
      setValidationState(field, false, "length");
      isValid = false;
    } else {
      setValidationState(field, true);
    }

    return isValid;
  }

  function setValidationState(element, isValid, errorType) {
    const feedback = element.parentElement.querySelector(".invalid-feedback");
    if (!feedback) return;

    const lengthError = feedback.querySelector('[id^="error-"]');
    const requiredError = feedback.querySelector('[id^="invalid-"]');

    if (isValid) {
      element.classList.remove("is-invalid");
      element.classList.add("is-valid");
      if (lengthError) lengthError.classList.add("d-none");
      if (requiredError) requiredError.classList.add("d-none");
    } else {
      element.classList.remove("is-valid");
      element.classList.add("is-invalid");

      if (errorType === "length" && lengthError) {
        lengthError.classList.remove("d-none");
        if (requiredError) requiredError.classList.add("d-none");
      } else if (requiredError) {
        requiredError.classList.remove("d-none");
        if (lengthError) lengthError.classList.add("d-none");
      }
    }
  }
});
