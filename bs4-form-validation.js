/*
Author:     colmeye
Purpose:    Allow simple responsive input validation options in Bootstrap 4.

Usage:
        1. Add form-control class to all inputs.

        2. Paste this code near bottom of page:
                <script type="text/javascript" src="<?php echo $BASE_URL;?>csb-themes/default/js/input-validation.js"></script>
                <script type="text/javascript">
                    // Create object
                    let OBJNAME = new Validation("FORM NAME", "SUBMIT BUTTON NAME");
                    // Validation Functions
                    OBJNAME.requireText(inputName, minLength, maxLength, illegalCharArray, necessaryCharArray);
                </script>

        3. Use the following function to check for string issues:
                OBJNAME.checkString(inputName, minLength, maxLength, illegalCharArray, necessaryCharArray)

        4. Note: This script uses the NAMES of the inputs, NOT the ids.
*/



class Validation
{
    constructor(formName, submitButtonName)
    {
        // Form globals
        this.form = $('form[name ="' + formName + '"]');
        this.submitButton = $('input[name ="' + submitButtonName + '"]');
        this.submitButtonText = this.submitButton.val(); 
        // Global input array
        this.inputLog = [];       
        // Basic css classes
        this.validC = "is-valid";
        this.invalidC = "is-invalid";

        // Enables submit listener
        this.checkAll();
    }



      ////////////////////
     // Main Functions //
    ////////////////////
    /*
        The functions in this category are called by developers to add a responsive layer of form validation
    */


    /*
        Make a general text input required for form submission.
    */
    requireText(inputName, minLength, maxLength, illegalCharArray, necessaryCharArray)
    {
        let input = $('input[name ="' + inputName + '"]');
        let invalidString = "";

        // Create requried *
        this.createAsterisk(input);

        // Add this input to the input log, for easy check alls
        this.inputLog.push(["requireText", inputName, minLength, maxLength, illegalCharArray, necessaryCharArray]);
            
        // Check string for issues while editing
        $(input).on('input focus', input, () =>
        {
            // Append any invalid issues to string when editing
            invalidString = "";
            invalidString += this.lengthFlag(input, minLength, maxLength);
            invalidString += this.illegalCharFlag(input, illegalCharArray);
            this.showWarning(input, inputName, invalidString);
        });

        // Enable submit again on an input change
        $(input).on('input', input, () =>
        {
            this.submitDisabled(false, this.submitButtonText);
        });

        // Check string for issues after editing
        $(input).on('focusout', input, () =>
        {
            invalidString += this.necessaryCharFlag(input, necessaryCharArray);
            this.showWarning(input, inputName, invalidString);
            // Remove green border
            this.removeValid(input);
        });

        return invalidString;
    }



    /*
        Used for registering passwords. Almost the same as the requireText() function. This function requires at least
        one special character and number in the password. It is also possible to assign a confirmation input using passConfirmName.
    */
    registerPassword(inputName, minLength, maxLength, illegalCharArray, necessaryCharArray, passConfirmName)
    {
        let input = $('input[name ="' + inputName + '"]');
        let passConfirm = $('input[name ="' + passConfirmName + '"]');
        let invalidString = "";

        // Create requried *
        this.createAsterisk(input);
        this.createAsterisk(passConfirm);

        // Add this input to the input log, for easy check alls
        this.inputLog.push(["registerPassword", inputName, minLength, maxLength, illegalCharArray, necessaryCharArray, passConfirmName]);
        
        // Check string for issues while editing
        $(input).on('input focus', input, () =>
        {
            // Append any invalid issues to string when editing
            invalidString = "";
            invalidString += this.lengthFlag(input, minLength, maxLength);
            invalidString += this.illegalCharFlag(input, illegalCharArray);
            this.showWarning(input, inputName, invalidString);
        });

        // Enable submit again on an input change
        $(input).on('input', input, () =>
        {
            this.submitDisabled(false, this.submitButtonText);
        });

        // Check string for issues after editing
        $(input).on('focusout', input, () =>
        {
            invalidString += this.necessaryCharFlag(input, necessaryCharArray);
            invalidString += this.numberFlag(input);
            invalidString += this.specialCharFlag(input);
            this.showWarning(input, inputName, invalidString);
            // Remove green border
            this.removeValid(input);
        });

        // Check if confirmation input matches the password input
        $(passConfirm).on('input focus', passConfirm, () =>
        {
            this.showWarning(passConfirm, passConfirmName, this.passwordMatchFlag(input, passConfirm));
        });

        $(passConfirm).on('focusout', passConfirm, () =>
        {
            this.showWarning(passConfirm, passConfirmName, this.passwordMatchFlag(input, passConfirm));
            // Remove green border
            this.removeValid(passConfirm);
        });

        return invalidString;
    }












      /////////////////
     // Flag Checks //
    /////////////////
    /*
        Flag checks return nothing if there are no validation issues.
        If there is a validation issue, a string is returned that explains the issue.
        The main functions call these depending on their parameters.
    */

    // Checks if too long or short
    lengthFlag(input, minLength, maxLength)
    {
        if (input.val().length <= minLength)
        {
            return "Must be longer than " + minLength + " characters. ";
        }
        else if (input.val().length >= maxLength)
        {
            return "Must be shorter than " + maxLength + " characters. ";
        }
        else
        {
            return "";
        }
    }

    // Checks if contains unwanted text
    illegalCharFlag(input, illegalCharArray)
    {
        // Reset loop stringe
        let illegalsUsed = "";
        // loop through each illegal item to check for
        $(illegalCharArray).each(function()
        {
            if (input.val().indexOf(this) >= 0)
            {
                // Append illegal strings to var
                // check if char is a space
                if (!this.trim().length == 0)
                {
                    illegalsUsed += " " + this;   
                }
                else
                {
                    illegalsUsed += " spaces"
                }
            }
        });

        // Create output based on result of illegals concatination
        if (illegalsUsed === "")
        {
            return "";
        }
        else
        {
            return "Cannot use:" + illegalsUsed + ". ";
        }
    }

    // Check if doesnt contain needed text
    necessaryCharFlag(input, necessaryCharArray)
    {
        let notUsed = "";
        // loop through each illegal item to check for
        $(necessaryCharArray).each(function()
        {
            if (!(input.val().indexOf(this) >= 0))
            {
                notUsed += " " + this;
            }
        });

        // Create output based on result of illegals concatination
        if (notUsed === "")
        {
            return "";
        }
        else
        {
            return "Must contain:" + notUsed + ". ";
        }
    }

    // Ensure that input has at least one number
    numberFlag(input)
    {
        if (!input.val().match(/\d/))
        {
            return "Must contain a number. ";
        }
        else
        {
            return "";
        }
    }

    // Ensure there is at least one special character
    specialCharFlag(input)
    {
        if (!input.val().match(/\W|_/g))
        {
            return "Must contain a special character. ";
        }
        else
        {
            return "";
        }
    }

    // Check if passwords match
    passwordMatchFlag(input, passConfirm)
    {
        if (input.val() === passConfirm.val())
        {
            return "";
        }
        else
        {
            return "Passwords do not match. ";
        }
    }


      ////////////////
     // Check Alls //
    ////////////////
    /*
        These functions deal with form submission, checking all inputs before allowing submission
    */


    // Enable/Disable the submit button, and change its value
    submitDisabled(trueFalse, value)
    {
        $(this.submitButton).prop('disabled', trueFalse);
        $(this.submitButton).val(value);
    }


    // Check every input added to the object.
    checkAll()
    {
        $(this.form).submit( (e) =>
        {
            // Loop through every input added to object
            $(this.inputLog).each( (i) =>
            {
                let invalidString = "";
                

                // Check all requiredText inputs
                if (this.inputLog[i][0] === "requireText")
                {
                    // Make block scope elements to help understand which elements in the array are which
                    let input = $('input[name ="' + this.inputLog[i][1] + '"]');
                    let inputName = this.inputLog[i][1];
                    let minLength = this.inputLog[i][2];
                    let maxLength = this.inputLog[i][3];
                    let illegalCharArray = this.inputLog[i][4];
                    let necessaryCharArray = this.inputLog[i][5];

                    // Perform all the checks that requireText() does, but only apply negative restrictions
                    invalidString = "";
                    invalidString += this.lengthFlag(input, minLength, maxLength);
                    invalidString += this.illegalCharFlag(input, illegalCharArray);
                    invalidString += this.necessaryCharFlag(input, necessaryCharArray);
                    if (invalidString)
                    {
                        this.showWarning(input, inputName, invalidString);
                        this.submitDisabled(true, "Error, please check your form");
                        // Stop submission
                        e.preventDefault();
                    }
                }

                // Check all password registration
                if (this.inputLog[i][0] === "registerPassword")
                {
                    // Make block scope elements to help understand which elements in the array are which
                    let input = $('input[name ="' + this.inputLog[i][1] + '"]');
                    let inputName = this.inputLog[i][1];
                    let minLength = this.inputLog[i][2];
                    let maxLength = this.inputLog[i][3];
                    let illegalCharArray = this.inputLog[i][4];
                    let necessaryCharArray = this.inputLog[i][5];
                    let passConfirm = $('input[name ="' + this.inputLog[i][6] + '"]');

                    // Perform all the checks that requireText() does, but only apply negative restrictions
                    invalidString = "";
                    invalidString += this.lengthFlag(input, minLength, maxLength);
                    invalidString += this.illegalCharFlag(input, illegalCharArray);
                    invalidString += this.necessaryCharFlag(input, necessaryCharArray);
                    invalidString += this.numberFlag(input);
                    invalidString += this.specialCharFlag(input);
                    invalidString += this.passwordMatchFlag(input, passConfirm);
                    if (invalidString)
                    {
                        this.showWarning(input, inputName, invalidString);
                        this.submitDisabled(true, "Error, please check your form");
                        // Stop submission
                        e.preventDefault();
                    }
                }
            });
        });
    }



      ////////////////////
     // Class Updating //
    ////////////////////
    /*
        Simplifies redundant class code into a few functions
    */

    // Perform restrictions depending on the input
    showWarning(input, inputName, invalidString)
    {
        // Provide proper styling and feedback
        if (invalidString)
        {
            this.generateFeedback(input, inputName, "invalid-feedback", invalidString);
            this.makeInvalid(input);
        }
        else
        {
            this.makeValid(input);
        }
    }

    // Adds a valid class to element and removes invalid
    makeValid(element)
    {
        if (!element.hasClass(this.validC))
        {
            element.addClass(this.validC);
        }
        // Remove invalid class if it exists
        if (element.hasClass(this.invalidC))
        {
            element.removeClass(this.invalidC);
        }
    }

    // Adds a valid class to element and removes invalid
    removeValid(element)
    {
        // Remove invalid class if it exists
        if (element.hasClass(this.validC))
        {
            element.removeClass(this.validC);
        }
    }

    // adds invalid class to element and removes valid class
    makeInvalid(element)
    {
        if (!element.hasClass(this.invalidC))
        {
            element.addClass(this.invalidC);
        }
        // Remove valid class
        if (element.hasClass(this.validC))
        {
            element.removeClass(this.validC);
        }
    }


      /////////////////////
     // Text Generation //
    /////////////////////
    /*
        Visual output such as errors or *
    */

    // Create required asterisk after text
    createAsterisk(input)
    {
        $("<span class='text-danger'>*</span>").insertBefore(input)
    }

    // Creates responsive tiny text below inputs to inform user of issues
    generateFeedback(input, inputName, validityClass, prompt)
    {
    /*
    validity classes: valid-feedback or invalid-feedback
    */
        if ($('#' + inputName + '-feedback').length)
        {
            // Delete feedback if it already exists to make room for new content
            $('#' + inputName + '-feedback').remove();
            // Create new content
            $("<div id='" + inputName + "-feedback' class='" + validityClass + "'>" + prompt + "</h2>").insertAfter(input);
            
        }
        else
        {
            // Create feedback element if it does not exist
            $("<div id='" + inputName + "-feedback' class='" + validityClass + "'>" + prompt + "</h2>").insertAfter(input);
        }
    }






}












