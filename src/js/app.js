App = {
    web3Provider: null,
    contracts: {},

    init: function() {
        console.log("app initialized")
        return App.initWeb3()
    },

    initWeb3: function() {
        if(typeof web3 !== 'undefined') {
            App.web3Provider = web3.currentProvider;
            web3 = new Web3(web3.currentProvider);
        } else {
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
            web3 = new Web3(App.web3Provider);
        }

        return App.initContracts()
    },

    initContracts: function() {
        $.getJSON("UlaTokenSale.json", function(ulaTokenSale) {
            App.contracts.UlaTokenSale = TruffleContract(ulaTokenSale)
            App.contracts.UlaTokenSale.setProvider(App.web3Provider)
            App.contracts.UlaTokenSale.deployed().then(function(ulaTokenSale){
                console.log("Ula Token Sale Address: ", ulaTokenSale.address)
            }).done(function() {
                $.getJSON("UlaToken.json", function(ulaToken) {
                    App.contracts.UlaToken = TruffleContract(ulaToken)
                    App.contracts.UlaToken.setProvider(App.web3Provider)
                    App.contracts.UlaToken.deployed().then(function(ulaToken){
                        console.log("Ula Token Address: ", ulaToken.address)
                    }); 
            }); 
        });
    })
}
}

$(function() {
    $(window).load(function() {
        App.init();
    })
})