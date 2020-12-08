App = {
    web3Provider: null,
    contracts: {},
    account: '',
    loading: false,
    tokenPrice: '',
    tokensSold: '',
    tokensAvailable: '500000',

    init: function() {
        console.log("app initialized")
        return App.initWeb3()
    },

    initWeb3: function() {
        if(typeof web3 !== 'undefined') {
            App.web3Provider = web3.currentProvider;
            web3 = new Web3(web3.currentProvider);
            window.ethereum.enable();
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
            });
        }).done(function() {
                $.getJSON("UlaToken.json", function(ulaToken) {
                    App.contracts.UlaToken = TruffleContract(ulaToken)
                    App.contracts.UlaToken.setProvider(App.web3Provider)
                    App.contracts.UlaToken.deployed().then(function(ulaToken){
                        console.log("Ula Token Address: ", ulaToken.address)
                    }); 
                    App.listenForEvents();
                    return App.render();
                }); 
            })
    },

    listenForEvents: function() {
        App.contracts.UlaTokenSale.deployed().then(function(instance) {
            instance.Sell({
            filter: {buyer: App.account}
        }, 
        {
            fromBlock: 0,
            toBlock: 'latest',
        }).watch(function(err, event) {
            console.log("event triggered: ", event)
            App.render()
        })
        })
    },

    render: function() {
        if(App.loading) {
            return
        };

        App.loading = true;
        var loader = $('#loader');
        var content = $('#content');

        loader.show();
        content.hide();

        web3.eth.getCoinbase(function(err, account){
            if(err === null) {
                console.log("account: ", account);
                App.account = account;
                $('#accountAddress').html("Your account: " + account)
            }
        })

        App.contracts.UlaTokenSale.deployed().then(function(instance) {
            ulaTokenSaleInstance = instance;
            return ulaTokenSaleInstance.tokenPrice()
        }).then(function(tokenPrice) {
            App.tokenPrice = tokenPrice;
            $('.token-price').html(web3.fromWei(App.tokenPrice, "ether").toNumber())
            return ulaTokenSaleInstance.tokensSold();
        }).then(function(tokensSold) {
            App.tokensSold = tokensSold.toNumber();
            $('.tokens-sold').html(App.tokensSold)
            $('.tokens-available').html(App.tokensAvailable)

            var progressPercent = (App.tokensSold) / App.tokensAvailable * 100;
            $('#progress').css('width', progressPercent + '%');

            App.contracts.UlaToken.deployed().then(function(instance) {
                ulaTokenInstance = instance;
                return ulaTokenInstance.balanceOf(App.account)
            }).then(function(balance) {
                $('.dapp-balance').html(balance.toNumber())

                App.loading = false;
                loader.hide();
                content.show();
            })
        }); 
    },

    buyTokens: function() {
        $('#loader').show;
        $('#content').hide;

        var numberOfTokens = $('#numberOfTokens').val();

        App.contracts.UlaTokenSale.deployed().then(function(instance) {
            instance.buyTokens(numberOfTokens, {from: App.account, value: numberOfTokens * App.tokenPrice})
        }).then(function(result) {
            console.log("Tokens bought");
            $('form').trigger('reset')
        })
    }
        
}

$(function() {
    $(window).load(function() {
        App.init();
    })
})