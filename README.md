## Just validate

Made this jQuery plugin a few years back to validate forms even on legacy browsers that didn't support
the ```pattern``` and ```required``` properties in the ```<input>``` tags.

Also, this plugin adds the ability for dependencies between fields.

### How to use it

Of course you have to include the script to your page:

```
<script src="public/js/just_validate.js"></script>
```

Define some restrictions to your form fields:

```
<!-- a required field with a pattern -->
<input type="text" id="phone" name="phone" data-required="true" data-pattern="[0-9]{10,12}">

<!-- a not required field, that is a dependency of another -->
<!-- if any of the fields is filled, the other one has to be filled too -->
<input type="text" id="street" name="street" data-required="false">
<input type="text" id="streetNumber" name="streetNumber" data-required="false" data-depends-to="street">
```

The most easy way to do the actual validation is to read the returning value of the plugin method:

```
$(document).ready(function () {
    // get the result and submit form if successful
    $("form").on("submit", function (e) {
        if ($(this).justValidate()) {
            return true;
        } else {
            $("#validation-msg").html("Something is wrong!");
            e.preventDefault();
            return false;
        }
    });
});
```

Another way is to pass callbacks to the plugin method for success and failure:

```
$(document).ready(function () {
    // give callbacks for success and failure
    $("form").on("submit", function (e) {
        $(this).justValidate(function () {
            // the form is going to be submitted
            $("#validation-msg").html("Everything is well!");
        }, function (elements) {
            // clear the validation output field
            $("#validation-msg").html("");
            for (var elementIdx = 0; elementIdx < elements.length; elementIdx++) {
                if (elements[elementIdx].reason === "required") {
                    $("#validation-msg").append("Please fill all fields.<br />");
                } else if (elements[elementIdx].reason === "pattern") {
                    $("#validation-msg").append("The values you filled-in are invalid.<br />");
                } else if (elements[elementIdx].reason === "dependency") {
                    $("#validation-msg").append("Please fill the dependent field.<br />");
                }
            };

            e.preventDefault();
            return false;
        });
    });
});
```
