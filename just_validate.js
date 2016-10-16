(function ($) {
    $.fn.justValidate = function (callbackSuccess, callbackFail) {
        var form = this;
        var valid = true;
        var invalidElements = [];
        var pattern = "";
        var $dependency = null;

        callbackSuccess = (typeof (callbackSuccess) === "undefined") ? function () {} : callbackSuccess;
        callbackFail = (typeof (callbackFail) === "undefined") ? function () {} : callbackFail;

        // loop through all input elements
        $(form).find("input, select").each(function () {
            // get the field that the currently examined field depends to
            $dependency = null;
            if ($(this).data("depends-to")) {
                $dependency = $("#" + $(this).data("depends-to"));
            }

            // check if field is marked as required
            if (($(this).data("required") === true && $(this).val() === "")) {
                invalidElements.push({ reason: "required", element: $(this) });
            }

            // check if pattern is set and that it is honoured
            if ($(this).data("required") === true && $(this).data("pattern")) {
                pattern = new RegExp($(this).data("pattern"));

                if ($(this).val().match(pattern) === null) {
                    invalidElements.push({ reason: "pattern", element: $(this) });
                }
            }

            // check if the "not required" dependency of the field is filled (makes current field "required" too)
            if ($(this).data("required") === false && $(this).val() === "" && $dependency && $dependency.val() !== "") {
                invalidElements.push({ reason: "required", element: $(this) });
            }

            // check that dependecy is filled (if current field is filled, the dependecy has to be filled too)
            if ($(this).val() !== "" && $dependency && $dependency.val() === "") {
                invalidElements.push({ reason: "dependency", element: $(this) });
            }
        });

        valid = (invalidElements.length > 0) ? false : true;
        (valid) ? callbackSuccess() : callbackFail(invalidElements);

        return valid;
    };
} (jQuery));
