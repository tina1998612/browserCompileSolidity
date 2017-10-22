var exampleSource = "pragma solidity ^0.4.2;\n\ncontract mortal {\n    /* Define variable owner of the type address*/\n    address owner;\n\n    /* this function is executed at initialization and sets the owner of the contract */\n    function mortal() { owner = msg.sender; }\n\n    /* Function to recover the funds on the contract */\n    // function kill() { if (msg.sender == owner) selfdestruct(owner); }\n}\n\ncontract greeter is mortal {\n    /* define variable greeting of the type string */\n    string greeting;\n\n    /* this runs when the contract is executed */\n    function greeter(string _greeting) public {\n        greeting = _greeting;\n    }\n\n    /* main function */\n    function greet() constant returns (string) {\n        return greeting;\n    }\n}";
var optimize = 1;
var bytecode;
var abi;
var gasEstimate;

window.onload = function () {
    // check if the library is loaded successfully 
    if (typeof BrowserSolc == 'undefined') {
        console.log("You have to load browser-solc.js in the page.  We recommend using a <script> tag.");
        throw new Error();
    }
}

function compile(_callback) {
    BrowserSolc.loadVersion('soljson-v0.4.5+commit.b318366e.js', function (compiler) {

        // print compiler version
        console.log("Solc Version Loaded: " + 'soljson-v0.4.5+commit.b318366e.js');

        // load input code
        var codeToBeCompiled = $("textarea").val();
        if (codeToBeCompiled == '') {
            codeToBeCompiled = exampleSource;
            console.log('using example code');
        }

        // compile to get bytecode and abi
        var result = compiler.compile(codeToBeCompiled, optimize);
        var contract = result.contracts.greeter;
        bytecode = '0x' + contract.bytecode; // bytecode need to add 0x and abi has to be an array instead of string
        abi = JSON.parse(contract.interface); // if the err is filter is not defined, then there is some problem with your array (filter is array's built-in function)
        //gasEstimate = contract.gasEstimates.creation[1]; // estimated gas to create the smart contract
        web3.eth.estimateGas({ data: bytecode }, function (err, result) {
            gasEstimate = result;

            // print result 
            console.log('bytecode:', bytecode);
            console.log('abi:', abi);
            console.log('gasEstimate:', gasEstimate);

            _callback(); // execute the next function 
        });


    });

}

function deploy() {

    if (typeof web3 !== 'undefined') {
        web3 = new Web3(web3.currentProvider);
    } else {
        // set the provider you want from Web3.providers
        web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    }

    // if not all the needed values for deploying are defined, compile the code first
    if (!(bytecode && abi && gasEstimate)) compile(function () { // wait for the first function to complete
        var contractToDeploy = web3.eth.contract(abi);
        var myContractReturned = contractToDeploy.new({
            from: web3.eth.accounts[0],
            data: bytecode,
            gas: gasEstimate
        }, function (err, myContract) {
            if (!err) {
                if (!myContract.address) {
                    console.log(myContract.transactionHash) // The hash of the transaction, which deploys the contract
                } else {
                    console.log(myContract.address) // the contract address
                }
            }
        });

    });
}

