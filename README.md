# Validation Bridge

## What it is
Provides a simple, efficient, and clean bridge between ASP .NET's [Data Validation Attributes](https://docs.microsoft.com/en-us/aspnet/core/mvc/models/validation?view=aspnetcore-2.1) and your favorite client side validation. Validation Bridge, or vBridge for short, takes a modular approach so only the minimum number of references are needed to get up and running. vBridge it meant to be as unobtrusive as possible while remaining flexible and efficient.

ASP.NET provides the the [jQuery Unobtrusive Validation](https://github.com/aspnet/jquery-validation-unobtrusive) library that does a great job bridging jQuery Validation with Data Validation attributes but leaves a gap for any other validation framework. vBridge provides a solution to this issue, it's core library handles parsing forms and input elements for data attributes and building a generic configuration that can then passed to a provider. Each provider is built to parse the generic configuration into a format that the specific framework can understand.

vBridge takes care of all the setup automagically but allows for customization over when forms are parsed and even what elements are treated as a form giving you ultimate control over your validation.
Is your favorite framework not supported? Create an enhancement request or [create your own]()!

## What it is not

vBridge is not a validation framework, it does not do any input validation itself. It is meant to be the glue between ASP.NET and your favorite validation framework.

# Usage

## Basic

1. Include the core library and the bridge for your framework
    ```
    <script type="text/javascript" src="vbridge.js" />
    <script type="text/javascript" src="vbridge-{framework}.js" />
    ```
2. Setup the bridge
    ```
    <script type="text/javascript">
        vbridge.{framework}.register();
    </script>
    ```
3. ???
4. Profit!

## Advanced

vBridge and it's modules are designed to be flexible in what it validates and when it validates. To control which elements are validated and when validation setup occurs a jQuery selector and list of events passed into the register function is all it takes. The rest is taken care of behind the scenes. Assuming we have an event `my.event` that we want to run validation setup on we would do the following:

1. Include the core library and the bridge for your framework
    ```
    <script type="text/javascript" src="vbridge.js" />
    <script type="text/javascript" src="vbridge-{framework}.js" />
    ```
2. Setup the module with the custom event and selector
    ```
    <script type="text/javascript">
        vbridge.{framework}.register({
            validationEvents: "my.event,
            containerSelector: ".my-class"
        });
    </script>
    ```

Notes
 - All modules have their own default `validationEvents` and `containerSelector`
 - All modules will register for the document load event, this won't be overwritten by the `validationEvents` option
 - Changing the `containerSelector` will override the default, if you want to add additional selectors you will need to include the defaults as well
 - When an event in `validationEvents` is triggered, all elements in the `event.target` that match `containerSelector` will be parsed for validation rules

# Supported Frameworks

## Semantic UI

Attribute | Supported | Notes
----------|-----------|------
FileExtensionsAttribute | :x: | No direct support, will need to add custom validation
MaxLengthAttribute | :heavy_check_mark: |
MinLengthAttribute | :heavy_check_mark: |
RangeAttribute | :o: | Currently only supports integer values
RegularExpressionAttribute | :heavy_check_mark: |
RequiredAttribute | :heavy_check_mark: |
StringLengthAttribute | :heavy_check_mark: |
CompareAttribute | :heavy_check_mark: |
CreditCardAttribute | :heavy_check_mark: |
EmailAddressAttribute | :heavy_check_mark: | No direct support, uses Regex validation 
PhoneAttribute | :heavy_check_mark: | No direct support, uses Regex validation
UrlAttribute | :heavy_check_mark: | No direct support, uses Regex validation

## Legend

Symbol | Meaning
-------|--------
:heavy_check_mark: | Fully Supported
:o: | Partial Supported (See Notes)
:x: | Not Supported

# Tasks

- :white_check_mark: Create repository
- :white_check_mark: Setup basic build script
- :white_square_button: Semantic UI file validation rule
- :black_square_button: Provider documentation
- :black_square_button: "Creating a provider" documentation
- :black_square_button: Provider for [Foundation](https://foundation.zurb.com/sites/docs/abide.html)
- :black_square_button: Provider for [jQuery Form Validator](http://www.formvalidator.net)


## Legend

Symbol | Meaning
-------|--------
:white_check_mark: | Completed
:white_square_button: | In Progress
:black_square_button: | Not Started