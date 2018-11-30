var vbridge = (function ($, undefined) {
    var _bridgeConstructor = undefined;
    var _validationEvents = undefined;
    var _containerSelector = undefined;

    //Simple object to hold validation information
    function GenericRuleConfig(ruleName) {
        var _this = this;

        this.ruleName = ruleName;
        this.parameters = {};
    }

    function setBridge(bridgeConstructor, containerSelector, validationEvents) {
        //Remove any old event listeners
        if (_validationEvents !== undefined) {
            $("body").off(_validationEvents);
        }

        //Set the variables
        _bridgeConstructor = bridgeConstructor;
        _validationEvents = validationEvents;
        _containerSelector = containerSelector;

        $(function () {
            initializeValidation();
        });

        if (_validationEvents !== undefined) {
            $("body").on(_validationEvents, function (event) {
                initializeValidation($(event.target));
            });
        }
    }

    function initializeValidation(container) {
        if (container === undefined) {
            container = $("body");
        }

        $(_containerSelector, container).each(function () {
            parseValidationRules($(this));
        });
    }

    function parseValidationRules(containerElement) {
        //Based on https://stackoverflow.com/a/8843181
        var bridgeInstance = new (_bridgeConstructor.bind.apply(_bridgeConstructor))();

        //If there's a pre configuration stage run it
        if (bridgeInstance.preConfiguration !== undefined) {
            bridgeInstance.preConfiguration.call(bridgeInstance, containerElement);
        }

        $(":input[data-val='true']", containerElement).each(function () {
            var inputElement = $(this);
            var ruleConfigurations = parseValidationRulesForElement(inputElement[0]);

            //Call the bridge to configure validation for the current element
            bridgeInstance.configureElement.call(bridgeInstance, containerElement, inputElement, ruleConfigurations);
        });

        //If there's a post configuration stage run it
        if (bridgeInstance.postConfiguration !== undefined) {
            bridgeInstance.postConfiguration.call(bridgeInstance, containerElement);
        }
    }

    /**
     * Goes through each attribute and builds up a generic interm config
     * This is done because the attributes may be out of order so if we see a parameter first we still want to be able to parse it
     * Once we have the generic config we use that to build the actual rules
     * @param {any} element The element to parse rules for
     * @returns {Array<GenericRuleConfig>} A list of generic rule configurations
     */
    function parseValidationRulesForElement(element) {
        var rules = {};

        for (var i = 0; i < element.attributes.length; i++) {
            var attribute = element.attributes[i];

            if (attribute.specified === true) {
                var match;
                var ruleName;

                if ((match = attribute.name.match(MESSAGE_ATTRIBUTE_PATTERN)) !== null) {
                    ruleName = match[1];

                    //Create the rule if it doesn't exist yet
                    if (rules[ruleName] === undefined) {
                        rules[ruleName] = new GenericRuleConfig(ruleName);
                    }

                    //Set the message
                    rules[ruleName].parameters["message"] = attribute.value;
                } else if ((match = attribute.name.match(PARAMETER_ATTRIBUTE_PATTERN)) !== null) {
                    ruleName = match[1];
                    var parameterName = parseParameterName(match[2]);

                    //Create the rule if it doesn't exist yet
                    if (rules[ruleName] === undefined) {
                        rules[ruleName] = new GenericRuleConfig(ruleName);
                    }

                    rules[ruleName].parameters[parameterName] = attribute.value;
                }
            }
        }

        //Return just the values as we don't need the keys anymore
        return Object.values(rules);
    }

    function parseParameterName(rawParameterName) {
        var parts = rawParameterName.split("-");

        //Capitalize the first letter of each part except the first
        for (var i = 1; i < parts.length; i++) {
            var part = parts[i];

            parts[i] = part.charAt(0).toUpperCase() + part.slice(1);
        }

        //Join the array to create the camel case parameter name
        return parts.join("");
    }

    /*
     * Matches the data validation attribute that defines the message/name
     * Group 1: Validation rule name
     */
    var MESSAGE_ATTRIBUTE_PATTERN = "data-val-([a-zA-Z0-9]+)$";
    /*
     * Matches a parameter for a validation attribute
     * Group 1: Validation rule name
     * Group 2: Validation rule parameter name
     */
    var PARAMETER_ATTRIBUTE_PATTERN = "data-val-([a-zA-Z0-9]+)-((?:[a-zA-Z0-9]+)(?:-(?:[a-zA-Z0-9]+))*)$";

    function BaseBridge(containerSelector, validationEvents) {
        this.containerSelector = containerSelector;
        this.validationEvents = validationEvents;
    }

    BaseBridge.prototype.preConfiguration = function (containerElement) { };
    BaseBridge.prototype.postConfiguration = function (containerElement) { };
    BaseBridge.prototype.configureElement = function (containerElement, inputElement, ruleConfigurations) { };

    return {
        BaseBridge,
        setBridge,
        initializeValidation
    };
})(jQuery);