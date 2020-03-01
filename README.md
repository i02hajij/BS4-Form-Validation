# BS4-Form-Validation
Responsive jQuery &amp; es6 form validation for Bootstrap 4. Will highlight inputs red, and stops form submissions before the post request.


# Setup

## Requirements

* Bootstrap 4
* jQuery

## Usage

1. Link the script into the head of the html file using:
```
<script type="text/javascript" src="PATH_TO_FILE/bs4-form-validation.js"></script>
```

2. Enter javascript tags before the last body tag. Create an object using the Validation class which will represent the entire form. The form's name should be the class parameter and a string. The submit button should be formatted as `<input type="submit">` to work properly.
```
<script>

// Create the object for the form
let myForm = new Validation("FORM_NAME");

</script>
```

3. Add functions to the object for each input you'd like checked.
```
<script>

// Create the object for the form
let myForm = new Validation("FORM_NAME");

// Inputs you would like to validate
myForm.requireText(inputName, minLength, maxLength, illegalCharArray, necessaryCharArray);
myForm.requireEmail(inputName, minLength, maxLength, illegalCharArray, necessaryCharArray);

</script>
```

4. Check out the documentation below for more info on how the functions work!

# Function Documentation

### requireText(inputName, minLength, maxLength, illegalCharArray, necessaryCharArray);

* inputName (String)
  * The name of the input
  * NOT the id

* minLength (Int)
  * Minimum allowable length of input value
  * -1 can be used if input can be empty

* maxLength (Int)
  * Maximum allowable length of input value

* illegalCharArray (Array)
  * An array containing strings of anything not allowed in the input
  * Ex: `requireText(inputName, minLength, maxLength, ["illegal", "/", " ", "@"], necessaryCharArray);`
  * ^ This code will not allow the strings "illegal", "/", spaces, or "@" in the input.

* necessaryCharArray (Array)
  * An array containing strings of anything needed in the input
  * All items in the array are necessary

### requireEmail(inputName, minLength, maxLength, illegalCharArray, necessaryCharArray);

* Operates exactly the same as requireText, but also ensures that the input matches the common email layout
* Arguments operate exactly the same as the requireText ones

### registerPassword(inputName, minLength, maxLength, illegalCharArray, necessaryCharArray, passConfirmName);
