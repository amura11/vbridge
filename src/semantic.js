(function (window, vbridge, $, undefined) {
    if (vbridge === undefined) {
        throw "vbridge needs to be referenced before this file";
    }

    function SemanticBridge() {
        //Call the base constructor
        vbridge.BaseBridge.call(this);
        var _this = this;

        this.configurationHandlers = {
            "maxlength": maxLengthConfigurationHandler,
            "minlength": minLengthConfigurationHandler,
            "range": rangeConfigurationHandler,
            "regex": regexConfigurationHandler,
            "required": requiredConfigurationHandler,
            "length": lengthConfigurationHandler,
            "equalto": equalToConfigurationHandler,
            "creditcard": creditCardConfigurationHandler,
            "email": emailConfigurationHandler,
            "phone": phoneConfigurationHandler,
            "url": urlConfigurationHandler
        };
    }

    SemanticBridge.prototype.preConfiguration = function (containerElement) {
        $(containerElement).form({ on: "blur", fields: {} });
    };

    SemanticBridge.prototype.configureElement = function (containerElement, inputElement, ruleConfigurations) {
        for (var i = 0; i < ruleConfigurations.length; i++) {
            var ruleConfiguration = ruleConfigurations[i];

            if (this.configurationHandlers[ruleConfiguration.ruleName] !== undefined) {
                this.configurationHandlers[ruleConfiguration.ruleName].call(null, containerElement, inputElement, ruleConfiguration.parameters);
            }
        }
    };

    function requiredConfigurationHandler(containerElement, inputElement, parameters) {
        containerElement.form("add rule", inputElement.attr("name"), { rules: [{ type: "empty", prompt: parameters.message }] });
    }

    function minLengthConfigurationHandler(containerElement, inputElement, parameters) {
        containerElement.form("add rule", inputElement.attr("name"), { rules: [{ type: "minLength", value: parameters.min, prompt: parameters.message }] });
    }

    function maxLengthConfigurationHandler(containerElement, inputElement, parameters) {
        containerElement.form("add rule", inputElement.attr("name"), { rules: [{ type: "maxLength", value: parameters.max, prompt: parameters.message }] });
    }

    function rangeConfigurationHandler(containerElement, inputElement, parameters) {
        var range = parameters.min + "..." + parameters.max;
        containerElement.form("add rule", inputElement.attr("name"), { rules: [{ type: "integer", value: range, prompt: parameters.message }] });
    }

    function lengthConfigurationHandler(containerElement, inputElement, parameters) {
        var rules = [];

        rules.push({ type: "minLength", value: parameters.min, prompt: parameters.message });

        if (parameters.max !== undefined) {
            rules.push({ type: "maxLength", value: parameters.max, prompt: parameters.message });
        }

        containerElement.form("add rule", inputElement.attr("name"), { rules: rules });
    }

    function equalToConfigurationHandler(containerElement, inputElement, parameters) {
        //For some reason the data validation generates "*.name", so we strip the "*."
        var fieldName = parameters.other.slice(2);

        containerElement.form("add rule", inputElement.attr("name"), { rules: [{ type: "match", value: fieldName, prompt: parameters.message }] });
    }

    function creditCardConfigurationHandler(containerElement, inputElement, parameters) {
        containerElement.form("add rule", inputElement.attr("name"), { rules: [{ type: "creditCard", prompt: parameters.message }] });
    }

    function regexConfigurationHandler(containerElement, inputElement, parameters) {
        addRegexRule(containerElement, inputElement, parameters.pattern, parameters.message);
    }

    function urlConfigurationHandler(containerElement, inputElement, parameters) {
        var urlPattern = "/^(?:(?:(?:https?|ftp):)?\\/\\/)(?:\\S+(?::\\S*)?@)?(?:(?!(?:10|127)(?:\\.\\d{1,3}){3})(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})).?)(?::\\d{2,5})?(?:[/?#]\\S*)?$/i";
        addRegexRule(containerElement, inputElement, urlPattern, parameters.message);
    }

    function emailConfigurationHandler(containerElement, inputElement, parameters) {
        var emailPattern = "/^[a-zA-Z0-9.!#$%&'*+\\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/";
        addRegexRule(containerElement, inputElement, emailPattern, parameters.message);
    }

    function phoneConfigurationHandler(containerElement, inputElement, parameters) {
        var phonePattern = "/^(\\+\\s?)?((\\+.*)\\(\\+?\\d+([\\s\\-\\.]?\\d+)?\\)|\\d+)([\\s\\-\\.]?(\\(\\d+([\\s\\-\\.]?\\d+)?\\)|\\d+))*(\\s?(x|ext\\.?)\\s?\\d+)?$/i";
        addRegexRule(containerElement, inputElement, phonePattern, parameters.message);
    }

    function addRegexRule(containerElement, inputElement, pattern, message) {
        containerElement.form("add rule", inputElement.attr("name"), { rules: [{ type: "regExp", value: pattern, prompt: message }] });
    }

    var defaultRegisterOptions = {
        validationEvents: undefined,
        containerSelector: ".ui.form"
    };

    function registerBridge(options) {
        var registerOptions = $.extend({}, defaultRegisterOptions, options);

        vbridge.setBridge(SemanticBridge, registerOptions.containerSelector, registerOptions.validationEvents);
    }

    vbridge.semantic = {
        register: registerBridge
    };
})(window, vbridge, jQuery);