var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');
var Web3 = require('web3');
var Tx = require('ethereumjs-tx');



if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
}else {
    web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/v3/d558fcfaeb3d4582898c0f3d136e469e"));
}
//("https://kovan.infura.io/v3/d558fcfaeb3d4582898c0f3d136e469e"));




var ContractABI = web3.eth.contract(
[
		{
			"constant": false,
			"inputs": [
				{
					"internalType": "address",
					"name": "_payer",
					"type": "address"
				},
				{
					"internalType": "uint256",
					"name": "_quantity",
					"type": "uint256"
				}
			],
			"name": "addBal",
			"outputs": [],
			"payable": false,
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"constant": false,
			"inputs": [
				{
					"internalType": "uint256",
					"name": "_qid",
					"type": "uint256"
				},
				{
					"internalType": "string",
					"name": "_contenthash",
					"type": "string"
				},
				{
					"internalType": "uint256",
					"name": "_vote_price",
					"type": "uint256"
				}
			],
			"name": "createquestionInteger",
			"outputs": [],
			"payable": false,
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"constant": false,
			"inputs": [
				{
					"internalType": "uint256",
					"name": "_qid",
					"type": "uint256"
				},
				{
					"internalType": "string",
					"name": "_contenthash",
					"type": "string"
				},
				{
					"internalType": "uint256",
					"name": "_vote_price",
					"type": "uint256"
				},
				{
					"internalType": "bytes32[]",
					"name": "_options",
					"type": "bytes32[]"
				}
			],
			"name": "createquestionMCQ",
			"outputs": [],
			"payable": false,
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"constant": false,
			"inputs": [
				{
					"internalType": "uint256",
					"name": "_qid",
					"type": "uint256"
				}
			],
			"name": "distributewin",
			"outputs": [],
			"payable": false,
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"constant": false,
			"inputs": [
				{
					"internalType": "address",
					"name": "rewardee",
					"type": "address"
				}
			],
			"name": "getWinnings",
			"outputs": [],
			"payable": false,
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"constant": false,
			"inputs": [
				{
					"internalType": "uint256",
					"name": "_qid",
					"type": "uint256"
				}
			],
			"name": "stopVoting",
			"outputs": [],
			"payable": false,
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"constant": false,
			"inputs": [
				{
					"internalType": "uint256",
					"name": "_qid",
					"type": "uint256"
				},
				{
					"internalType": "uint256",
					"name": "ansid",
					"type": "uint256"
				}
			],
			"name": "submitSolution",
			"outputs": [],
			"payable": false,
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"constant": false,
			"inputs": [
				{
					"internalType": "uint256",
					"name": "_qid",
					"type": "uint256"
				},
				{
					"internalType": "uint256",
					"name": "ansid",
					"type": "uint256"
				},
				{
					"internalType": "uint256",
					"name": "_amount",
					"type": "uint256"
				}
			],
			"name": "vote",
			"outputs": [],
			"payable": true,
			"stateMutability": "payable",
			"type": "function"
		},
		{
			"inputs": [],
			"payable": false,
			"stateMutability": "nonpayable",
			"type": "constructor"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": false,
					"internalType": "address",
					"name": "backer",
					"type": "address"
				},
				{
					"indexed": false,
					"internalType": "uint256",
					"name": "amount",
					"type": "uint256"
				},
				{
					"indexed": false,
					"internalType": "bool",
					"name": "isContribution",
					"type": "bool"
				}
			],
			"name": "FundTransfer",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": false,
					"internalType": "address",
					"name": "backer",
					"type": "address"
				},
				{
					"indexed": false,
					"internalType": "uint256",
					"name": "qid",
					"type": "uint256"
				},
				{
					"indexed": false,
					"internalType": "uint256",
					"name": "_type",
					"type": "uint256"
				}
			],
			"name": "QuestionCreation",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": false,
					"internalType": "address",
					"name": "backer",
					"type": "address"
				},
				{
					"indexed": false,
					"internalType": "uint256",
					"name": "qid",
					"type": "uint256"
				},
				{
					"indexed": false,
					"internalType": "uint256",
					"name": "_type",
					"type": "uint256"
				}
			],
			"name": "FantasyCreation",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": false,
					"internalType": "address",
					"name": "backer",
					"type": "address"
				},
				{
					"indexed": false,
					"internalType": "uint256",
					"name": "qid",
					"type": "uint256"
				},
				{
					"indexed": false,
					"internalType": "uint256",
					"name": "power",
					"type": "uint256"
				}
			],
			"name": "VotingDone",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": false,
					"internalType": "address",
					"name": "backer",
					"type": "address"
				},
				{
					"indexed": false,
					"internalType": "uint256",
					"name": "qid",
					"type": "uint256"
				}
			],
			"name": "FantasyParticipation",
			"type": "event"
		},
		{
			"constant": true,
			"inputs": [
				{
					"internalType": "address",
					"name": "",
					"type": "address"
				}
			],
			"name": "balanceOf",
			"outputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"payable": false,
			"stateMutability": "view",
			"type": "function"
		},
		{
			"constant": true,
			"inputs": [],
			"name": "chairperson",
			"outputs": [
				{
					"internalType": "address",
					"name": "",
					"type": "address"
				}
			],
			"payable": false,
			"stateMutability": "view",
			"type": "function"
		},
		{
			"constant": true,
			"inputs": [
				{
					"internalType": "address",
					"name": "from",
					"type": "address"
				}
			],
			"name": "getBalance",
			"outputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"payable": false,
			"stateMutability": "view",
			"type": "function"
		},
		{
			"constant": true,
			"inputs": [
				{
					"internalType": "uint256",
					"name": "_qid",
					"type": "uint256"
				}
			],
			"name": "getRate",
			"outputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"payable": false,
			"stateMutability": "view",
			"type": "function"
		},
		{
			"constant": true,
			"inputs": [
				{
					"internalType": "uint256",
					"name": "_qid",
					"type": "uint256"
				}
			],
			"name": "getWinners",
			"outputs": [
				{
					"internalType": "address[]",
					"name": "",
					"type": "address[]"
				}
			],
			"payable": false,
			"stateMutability": "view",
			"type": "function"
		}
	]
	);

var ContractAddress=  '0x57a974e962302ef9dd17326c128cba01a61cb5ac';

var ContractInstance= ContractABI.at(ContractAddress);


app.use(cors());
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get('/', function(req, res){
    console.log("dsd");

   res.send("Hello world!");
});

//https://secret-gorge-82351.herokuapp.com/createINT/222/0x616c696365000000000000000000000000000000000000000000000000000000/1/0x7479C195d9ae3a2C2DdACBfF50640AF5E483bBd7/7BEF384275B8FE0392C484E2D7CF3E57264F8DE27C0CD8214CD547CD8CCA4B34
app.get('/createINT/:_qid/:_contenthash/:_vote_price/:public/:private',function(req,res){
    console.log(req.params);

	var gasPrice = web3.eth.gasPrice;
	var gasPriceHex = web3.toHex(gasPrice);
	var gasLimitHex = web3.toHex(300000);
	var nonce =  web3.eth.getTransactionCount(req.params.public) ;


    var rawTransaction = {
        "from": req.params.public,
        "nonce": web3.toHex(nonce),
        "gasLimit": gasLimitHex,
        "gasPrice": gasPriceHex,
        "to": ContractAddress,
        "value": "0x0",
        "data": ContractInstance.createquestionInteger.getData(req.params._qid,req.params._contenthash,req.params._vote_price),
        "chainId": 0x03
    };

    var tx = new Tx(rawTransaction);
    tx.sign(new Buffer.from(req.params.private, 'hex'));

    //tx.sign(new Buffer(private, 'hex'));

    var serializedTx = tx.serialize();

    web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), function (err, result) {
        
		if(!err){
			console.log('Transaction hash: ' + result.toString());
			res.send('https://ropsten.etherscan.io/tx/'+result.toString());
		}
		else{
			console.log(err);
		}
	})	
    
});

app.get('/createMCQ/:_qid/:_contenthash/:_vote_price/:_proposalNames/:public/:private',function(req,res){
    console.log(req.params);
	
	var gasPrice = web3.eth.gasPrice;
	var gasPriceHex = web3.toHex(gasPrice);
	var gasLimitHex = web3.toHex(300000);
	var nonce =  web3.eth.getTransactionCount(req.params.public) ;

	var array = req.params._proposalNames.split(",");

    var rawTransaction = {
        "from": req.params.public,
        "nonce": web3.toHex(nonce),
        "gasLimit": gasLimitHex,
        "gasPrice": gasPriceHex,
        "to": ContractAddress,
        "value": "0x0",
        "data": ContractInstance.createquestionMCQ.getData(req.params._qid,req.params._contenthash,req.params._vote_price, array),
        "chainId": 0x03
    };

    var tx = new Tx(rawTransaction);
    tx.sign(new Buffer.from(req.params.private, 'hex'));

    //tx.sign(new Buffer(private, 'hex'));

    var serializedTx = tx.serialize();

    web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), function (err, result) {
        
		if(!err){
			console.log('Transaction hash: ' + result.toString());		
			res.send('https://ropsten.etherscan.io/tx/'+result.toString());
		}
		else{
			console.log(err);
		}
	})	

});


app.get('/distributewin/:_qid',function(req,res){
    console.log(req.params);

	var gasPrice = web3.eth.gasPrice;
	var gasPriceHex = web3.toHex(gasPrice);
	var gasLimitHex = web3.toHex(300000);
	var nonce =  web3.eth.getTransactionCount('0x6dE5Bae1a115b00d2E4955135e30ae17089a7F89') ;


    var rawTransaction = {
        "from": '0x6dE5Bae1a115b00d2E4955135e30ae17089a7F89',
        "nonce": web3.toHex(nonce),
        "gasLimit": gasLimitHex,
        "gasPrice": gasPriceHex,
        "to": ContractAddress,
        "value": "0x0",
        "data": ContractInstance.distributewin.getData(req.params._qid),
        "chainId": 0x03
    };

    var tx = new Tx(rawTransaction);
    tx.sign(new Buffer.from('DDD7E66F6329920FDEF9F849CFC966977EFD3DC8FFDD24987A6E9993F614D347', 'hex'));

    //tx.sign(new Buffer(private, 'hex'));

    var serializedTx = tx.serialize();

    web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), function (err, result) {
        
		if(!err){
			console.log('Transaction hash: ' + result.toString());
			res.send('https://ropsten.etherscan.io/tx/'+result.toString());

		}
		else{
			console.log(err);
		}
	})    
});


// app.get('/transferDAI/:private',function(req,res){
//     console.log(req.params);
//   	//  getWinnings(req.params.public,req.params.private);
// 	// tranfer DAI from chairman to rewardee




// 			(async()=>{

// 				//console.log('priceService');
				
// 			const maker = await Maker.create('http', {
// 				privateKey: req.params.private,//'0x7bef384275b8fe0392c484e2d7cf3e57264f8de27c0cd8214cd547cd8cca4b34',//'0xddd7e66f6329920fdef9f849cfc966977efd3dc8ffdd24987a6e9993f614d347',
// 				url: 'https://kovan.infura.io/v3/d558fcfaeb3d4582898c0f3d136e469e'
// 			});
// 			// console.log('priceService');
// 			const {
// 				MKR,
// 				DAI,
// 				ETH,
// 				WETH,
// 				PETH,
// 				USD_ETH,
// 				USD_MKR,
// 				USD_DAI
// 			} = Maker;
			
// 			await maker.authenticate();
// 			//console.log('priceService');
			
// 			//console.log(priceService);
// 			const tokenService = maker.service('token');
// 			const dai = tokenService.getToken(DAI);
			
// 			// const balanceOf =  await dai.balanceOf('0x7479C195d9ae3a2C2DdACBfF50640AF5E483bBd7');
// 			// console.log(balanceOf._amount);
// 			// // res.send((balanceOf._amount).toString());
// 			return await dai.transfer('0x7479C195d9ae3a2C2DdACBfF50640AF5E483bBd7', DAI('0.001'));
			
			
// 			})().then(function (success){
// 				//resetBalance(req.params.public,req.params.private);
			
// 				console.log(success);
// 				//res.send(balanceOf.toString);
			
// 				return success;
// 			}).catch(function (e1) {
// 			console.error(e1);
// 			process.exit(1);
// 			});    
		


// 	})
	  





// app.get('/getWinnings/:public/:private',function(req,res){
//     console.log(req.params);
//   	//  getWinnings(req.params.public,req.params.private);
// 	// tranfer DAI from chairman to rewardee

// 	ContractInstance.getBalance(req.params.public, function(err,result){
//     	return result.toString();
//     })().then(function (quantity){
// 		console.log((quantity));



// 			(async()=>{

// 				//console.log('priceService');
				
// 			const maker = await Maker.create('http', {
// 				privateKey: '0x7bef384275b8fe0392c484e2d7cf3e57264f8de27c0cd8214cd547cd8cca4b34',//'0xddd7e66f6329920fdef9f849cfc966977efd3dc8ffdd24987a6e9993f614d347',
// 				url: 'https://kovan.infura.io/v3/d558fcfaeb3d4582898c0f3d136e469e'
// 			});
// 			// console.log('priceService');
// 			const {
// 				MKR,
// 				DAI,
// 				ETH,
// 				WETH,
// 				PETH,
// 				USD_ETH,
// 				USD_MKR,
// 				USD_DAI
// 			} = Maker;
			
// 			await maker.authenticate();
// 			//console.log('priceService');
			
// 			//console.log(priceService);
// 			const tokenService = maker.service('token');
// 			const dai = tokenService.getToken(DAI);
			
// 			const balanceOf =  await dai.balanceOf('0x7479C195d9ae3a2C2DdACBfF50640AF5E483bBd7');
// 			console.log(balanceOf._amount);
// 			// res.send((balanceOf._amount).toString());
// 			return await dai.transfer(req.params.public, DAI(quantity));
			
			
// 			})().then(function (success){
// 				resetBalance(req.params.public,req.params.private);
			
// 				console.log(success);
// 				//res.send(balanceOf.toString);
			
// 				//return balanceOf;
// 			}).catch(function (e1) {
// 			console.error(e1);
// 			process.exit(1);
// 			});    
		


// 	}).catch(function (e2) {
// 	  console.error(e2);
// 	  process.exit(1);
// 	  })
// 	;    
	  


// });

app.get('/stopvoting/:_qid/:public/:private',function(req,res){
    console.log(req.params);
   
	var gasPrice = web3.eth.gasPrice;
	var gasPriceHex = web3.toHex(gasPrice);
	var gasLimitHex = web3.toHex(300000);
	var nonce =  web3.eth.getTransactionCount(req.params.public) ;


    var rawTransaction = {
        "from": req.params.public,
        "nonce": web3.toHex(nonce),
        "gasLimit": gasLimitHex,
        "gasPrice": gasPriceHex,
        "to": ContractAddress,
        "value": "0x0",
        "data": ContractInstance.stopVoting.getData(req.params._qid),
        "chainId": 0x03
    };

    var tx = new Tx(rawTransaction);
    tx.sign(new Buffer.from(req.params.private, 'hex'));

    //tx.sign(new Buffer(private, 'hex'));

    var serializedTx = tx.serialize();

    web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), function (err, result) {
        
		if(!err){
			console.log('Transaction hash: ' + result.toString());
			res.send('https://ropsten.etherscan.io/tx/'+result.toString());

		}
		else{
			console.log(err);
		}
	})	
 
});

app.get('/submitsolution/:_qid/:ansid',function(req,res){
    console.log(req.params);
	var gasPrice = web3.eth.gasPrice;
	var gasPriceHex = web3.toHex(gasPrice);
	var gasLimitHex = web3.toHex(300000);
	var nonce =  web3.eth.getTransactionCount('0x6dE5Bae1a115b00d2E4955135e30ae17089a7F89') ;


    var rawTransaction = {
        "from": '0x6dE5Bae1a115b00d2E4955135e30ae17089a7F89',
        "nonce": web3.toHex(nonce),
        "gasLimit": gasLimitHex,
        "gasPrice": gasPriceHex,
        "to": ContractAddress,
        "value": "0x0",
        "data": ContractInstance.submitSolution.getData(req.params._qid,req.params.ansid),
        "chainId": 0x03
    };

    var tx = new Tx(rawTransaction);
    tx.sign(new Buffer.from('DDD7E66F6329920FDEF9F849CFC966977EFD3DC8FFDD24987A6E9993F614D347', 'hex'));

    //tx.sign(new Buffer(private, 'hex'));

    var serializedTx = tx.serialize();

    web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), function (err, result) {
        
		if(!err){
			console.log('Transaction hash: ' + result.toString());
			res.send('https://ropsten.etherscan.io/tx/'+result.toString());

		}
		else{
			console.log(err);
		}
	})	
 
});

app.get('/vote/:_qid/:ansid/:_amount/:public/:private',function(req,res){
    console.log(req.params);


	var gasPrice = web3.eth.gasPrice;
	var gasPriceHex = web3.toHex(gasPrice);
	var gasLimitHex = web3.toHex(300000);
	var nonce =  web3.eth.getTransactionCount(req.params.public) ;

	//only chair can call

    var rawTransaction = {
        "from": '0x7479C195d9ae3a2C2DdACBfF50640AF5E483bBd7',//req.params.public,
        "nonce": web3.toHex(nonce),
        "gasLimit": gasLimitHex,
        "gasPrice": gasPriceHex,
        "to": ContractAddress,
        "value": "0x0",
        "data": ContractInstance.vote.getData(req.params._qid,req.params.ansid,req.params._amount),
        "chainId": 0x03
    };

    var tx = new Tx(rawTransaction);
    tx.sign(new Buffer.from('7bef384275b8fe0392c484e2d7cf3e57264f8de27c0cd8214cd547cd8cca4b34', 'hex'));

    //tx.sign(new Buffer(private, 'hex'));

    var serializedTx = tx.serialize();

    web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), function (err, result) {
        
		if(!err){
			console.log('Transaction hash: ' + result.toString());
			res.send('https://ropsten.etherscan.io/tx/'+result.toString());

		}
		else{
			console.log(err);
		}
	})	
    
});



// balance updated after transfer of DAI only
// app.get('/addbal/:_quantity/:public/:private',function(req,res){
// 	console.log(req.params);
	
// 	// transferdai transfers and updates
// 	(async()=>{

// 		console.log('priceService');
	
// 	const maker = await Maker.create('http', {
// 		privateKey: private,//'0xddd7e66f6329920fdef9f849cfc966977efd3dc8ffdd24987a6e9993f614d347',
// 		url: 'https://kovan.infura.io/v3/d558fcfaeb3d4582898c0f3d136e469e'
// 	  });
// 	 // console.log('priceService');
// 	 const {
// 		MKR,
// 		DAI,
// 		ETH,
// 		WETH,
// 		PETH,
// 		USD_ETH,
// 		USD_MKR,
// 		USD_DAI
// 	  } = Maker;
	  
// 	  await maker.authenticate();
// 	  //console.log('priceService');
	
// 	  //console.log(priceService);
// 	  const tokenService = maker.service('token');
// 	  const dai = tokenService.getToken(DAI);
	 
// 	  const balanceOf =  await dai.balanceOf(req.params.public.toString());
// 	  console.log(balanceOf._amount);
	
// 	//  return await dai.approveUnlimited('0x6dE5Bae1a115b00d2E4955135e30ae17089a7F89');
	
// 	  // transfer dai
// 	  return await dai.transfer(req.params.public, DAI(req.params._quantity));
	
	  
// 	 // return await dai.transferFrom('0x7479C195d9ae3a2C2DdACBfF50640AF5E483bBd7', '0x6dE5Bae1a115b00d2E4955135e30ae17089a7F89', DAI(0.003));
	
	
// 	})().then(function (balanceOf){
// 		addBal(req.params._quantity, '0x7479C195d9ae3a2C2DdACBfF50640AF5E483bBd7', '7bef384275b8fe0392c484e2d7cf3e57264f8de27c0cd8214cd547cd8cca4b34')

// 		console.log((balanceOf));
// 		//res.send(balanceOf.toString);
	
// 		//return balanceOf;
// 	  }).catch(function (e) {
// 	  console.error(e);
// 	  process.exit(1);
// 	  })
// 	;    


// });

app.get('/getContractBal/:public',function(req,res){

    ContractInstance.getBalance(req.params.public, function(err,result){
        if(!err)
            res.send(result);
        else
            console.log(err);
    })
});

app.get('/getRateQuest/:_qid',function(req,res){

    ContractInstance.getRate(req.params._qid, function(err,result){
        if(!err)
            res.send(result);
        else
            console.log(err);
    })
});


app.get('/getWinners/:_qid',function(req,res){

    ContractInstance.getWinners(req.params._qid, function(err,result){
        if(!err)
            res.send(result);
        else
            console.log(err);
    })
});



// get chairperson, contract deployer
app.get('/chair',function(req,res){

    ContractInstance.chairperson(function(err,result){
        if(!err)
            res.send(result);
        else
            console.log(err);
    })
});

// get eth balance
app.get('/getbalance/:public',function(req,res){
	
	web3.eth.getBalance(req.params.public.toString(),function(err,result){
		if(!err){
			res.send(result.toString());
		}
		else{
			console.log(err);
		}
	})	
});




// get dai balance
// app.get('/getDAIbalance/:public',function(req,res){
	
	
//   //console.log('priceService');
//   (async()=>{

//   //console.log(priceService);
//   	const maker = await Maker.create('http', {
// 	privateKey: '0x7bef384275b8fe0392c484e2d7cf3e57264f8de27c0cd8214cd547cd8cca4b34',//'0xddd7e66f6329920fdef9f849cfc966977efd3dc8ffdd24987a6e9993f614d347',
// 	url: 'https://kovan.infura.io/v3/d558fcfaeb3d4582898c0f3d136e469e'
//   });
//  // console.log('priceService');
//  const {
// 	MKR,
// 	DAI,
// 	ETH,
// 	WETH,
// 	PETH,
// 	USD_ETH,
// 	USD_MKR,
// 	USD_DAI
//   } = Maker;

//   await maker.authenticate();

//   const tokenService = maker.service('token');
//   const dai = tokenService.getToken(DAI);
 
//   const balanceOf =  await dai.balanceOf(req.params.public.toString());
//   console.log(balanceOf._amount);
//   res.send((balanceOf._amount).toString());

//   })().then(function (value){
//                 console.log((value));
//                 return value;
//               }).catch(function (e) {
//               console.error(e);
//               process.exit(1);
//               });      


     


// });






// add DAI balance in contract state, call by always chairman 
// can see as loading the wallet
function addBal(_quantity,public,private){


	var gasPrice = web3.eth.gasPrice;
	var gasPriceHex = web3.toHex(gasPrice);
	var gasLimitHex = web3.toHex(300000);
	var nonce =  web3.eth.getTransactionCount(public) ;


    var rawTransaction = {
        "from": public,
        "nonce": web3.toHex(nonce),
        "gasLimit": gasLimitHex,
        "gasPrice": gasPriceHex,
        "to": ContractAddress,
        "value": "0x0",
        "data": ContractInstance.addBal.getData(_payer,_quantity),
        "chainId": 0x03
    };

    var tx = new Tx(rawTransaction);
    tx.sign(new Buffer.from(private, 'hex'));

    //tx.sign(new Buffer(private, 'hex'));

    var serializedTx = tx.serialize();

    web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), function (err, result) {
        
		if(!err){
			console.log('Transaction hash: ' + result.toString());
		//	res.send('https://ropsten.etherscan.io/tx/'+result.toString());

		}
		else{
			console.log(err);
		}
	})	
}

function resetBalance(public,private){
	var gasPrice = web3.eth.gasPrice;
	var gasPriceHex = web3.toHex(gasPrice);
	var gasLimitHex = web3.toHex(300000);
	var nonce =  web3.eth.getTransactionCount(public) ;
  
  
	var rawTransaction = {
		"from": public,
		"nonce": web3.toHex(nonce),
		"gasLimit": gasLimitHex,
		"gasPrice": gasPriceHex,
		"to": ContractAddress,
		"value": "0x0",
		"data": ContractInstance.getWinnings.getData(public),
		"chainId": 0x03
	};
  
	var tx = new Tx(rawTransaction);
	tx.sign(new Buffer.from(private, 'hex'));
  
	//tx.sign(new Buffer(private, 'hex'));
  
	var serializedTx = tx.serialize();
  
	web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), function (err, result) {
		
		if(!err){
			console.log('Transaction hash: ' + result.toString());
			//res.send('https://ropsten.etherscan.io/tx/'+result.toString());
  
		//	res.send("ha");
		}
		else{
			console.log(err);
		}
	})	
  
}


// distributes win to all winners and updates balances in contract


// transfer DAI balance to winner, call by always chairman. 
// also reset balances of winner to 0 
//getWinnings(public,private)
////// tranfer DAI from chairman to rewardee


// stops voting in case question has become deterministic
// no need to test for now 
//stopVoting(_qid,public,private)



// submit the solution after the event/ deterministic 
//function submitSolution(_qid,ansid,public,private)



// vote requires DAI funds, addBal should be called before to update the DAI state
// amount is variable in case of MCQ question. For double the amount than participation fees, your voting power and reward becomes double.
// amount constant = participation fee in Integer Question

//function vote(_qid,ansid,_amount,public,private)


app.listen(process.env.PORT || 8080, () => console.log('my app listening on port 8080!'))
