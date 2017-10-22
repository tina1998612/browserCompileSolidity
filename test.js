var exampleSource = "pragma solidity ^0.4.2;\n\ncontract mortal {\n    /* Define variable owner of the type address*/\n    address owner;\n\n    /* this function is executed at initialization and sets the owner of the contract */\n    function mortal() { owner = msg.sender; }\n\n    /* Function to recover the funds on the contract */\n    // function kill() { if (msg.sender == owner) selfdestruct(owner); }\n}\n\ncontract greeter is mortal {\n    /* define variable greeting of the type string */\n    string greeting;\n\n    /* this runs when the contract is executed */\n    function greeter(string _greeting) public {\n        greeting = _greeting;\n    }\n\n    /* main function */\n    function greet() constant returns (string) {\n        return greeting;\n    }\n}";
var optimize = 1;

window.onload = function () {
    // check if the library is loaded successfully 
    if (typeof BrowserSolc == 'undefined') {
        console.log("You have to load browser-solc.js in the page.  We recommend using a <script> tag.");
        throw new Error();
    }
}

function compile() {
    BrowserSolc.loadVersion('soljson-v0.4.5+commit.b318366e.js', function (compiler) {

        // print compiler version
        console.log("Solc Version Loaded: " + 'soljson-v0.4.5+commit.b318366e.js');

        // load input code
        var codeToBeCompiled = $("textarea").val();
        if (codeToBeCompiled == '') {
            codeToBeCompiled = exampleSource;
            console.log('using example code');
        }
        console.log(codeToBeCompiled);

        // compile to get bytecode and abi
        var result = compiler.compile(codeToBeCompiled, optimize);
        var bytecode = result.contracts.greeter.bytecode;
        var abi = result.contracts.greeter.interface

        // print result 
        console.log('bytecode:', bytecode);
        console.log('abi:', abi);
    });

};
