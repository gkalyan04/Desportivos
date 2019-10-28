pragma solidity >=0.4.22 <0.6.0;

/// @title Sportsmania 0% fees

contract SportsMania {

    // It will represent a single voter of each MCQ qid.
    struct Voter {
        address add; //address of voter
        uint power;  // how many votes to the selected option/answer. More the power, more winnings..
    }

    // It will represent a single voter of each Integer qid.
    struct IntegerVoter{
        address add; //address of voter
        uint submittedans; //ans submitted by each voter
    }

    // This is a type for a single MCQ Option.
    struct Option {
        bytes32 name;   // short name of mcq text
        uint voteCount; // number of accumulated votes
        Voter[] voters; // all voters who voted for particular option
    }


    struct Question {
        //uint qid; // question id
        uint _type; // 1=mcq, 2=integer type
        bytes32 contenthash; // sha256 content hash of questions
        uint vote_price; // price/rate for 1 vote in DAI
        uint correct_ans_id;
        bytes32 correct_answer; // after event has occured
        Option[6] options; // all options
        uint totalCount;
        address[] winners;
        uint8 active;
        uint8 declared_result;
        uint8 stopped;
    }

    address public chairperson;

    // 10^8 DAI
    mapping(address => uint256) public balanceOf;
    
    // for mcq questions
    mapping(uint => Question)  alloptions;
    
    // for integer questions
    mapping(uint => IntegerVoter[]) allsubmissions;


    // contribution/ditribution
    event FundTransfer(address backer, uint amount, bool isContribution);


    /// Create a new ballot to choose one of `proposalNames`.
    constructor() public {
        chairperson = msg.sender;
    }

 

//_type; // 1=mcq, 2=integer type
    function createquestionMCQ(uint _qid, bytes32 _contenthash,
                             uint _vote_price, bytes32[]  memory _proposalNames ) public{
        

        require(alloptions[_qid].active!=1,"Question id already exists");
        
        //bytes32[] memory a = new bytes32[](6);
        //bytes memory b = new bytes(len);
        //Option memory opt;

        for (uint i = 0; i < _proposalNames.length; i++) {
            alloptions[_qid].options[i].name=_proposalNames[i];
            alloptions[_qid].options[i].voteCount = 0;
        }
        
            alloptions[_qid]._type=1;
            alloptions[_qid].contenthash=_contenthash;
            alloptions[_qid].vote_price=_vote_price;
            alloptions[_qid].totalCount=0;
            alloptions[_qid].active=1;
            alloptions[_qid].declared_result=0;
            alloptions[_qid].stopped=0;
    
}


    function createquestionInteger(uint _qid, bytes32 _contenthash,
                             uint _vote_price) public{
        

        require(alloptions[_qid].active!=1,"Question id already exists");
        
            alloptions[_qid]._type=2;
            alloptions[_qid].contenthash=_contenthash;
            alloptions[_qid].vote_price=_vote_price;
            alloptions[_qid].totalCount=0;
            alloptions[_qid].active=1;
            alloptions[_qid].declared_result=0;
            alloptions[_qid].stopped=0;
    
}




function stopVoting(uint _qid) public{
    
        // based on live feed this should be updated
        require(
            msg.sender == chairperson,
            "Only chairperson can submit the solution"
        );
        
        require(alloptions[_qid].stopped!=1,"Voting process has been already stopped");

        
        // when result become deterministic
        alloptions[_qid].stopped=1;
   
}



// ans id in case of mcq and integer in case of integer type question

    function submitSolution(uint _qid, uint ansid) public{
        
        
        // based on live feed this should be updated
        require(
            msg.sender == chairperson,
            "Only chairperson can submit the solution"
        );
        
     require(alloptions[_qid].declared_result!=1,"Voting process has been already declared already");


        alloptions[_qid].correct_ans_id=ansid;
        alloptions[_qid].declared_result=1;
        alloptions[_qid].stopped=1;

        
        uint typeofQ = alloptions[_qid]._type;

        if(typeofQ==1)
            alloptions[_qid].correct_answer = alloptions[_qid].options[ansid].name;


    }
        
        
    function addBal(address _payer, uint _quantity) public{
        require(
            msg.sender == chairperson,
            "Only chairperson can update the DAI balance"
        );
        
        balanceOf[_payer]+=(_quantity);

        
        emit FundTransfer(_payer, _quantity, true);


    }
        
        

// ans id in case of mcq and integer in case of integer type question

    function vote(uint _qid, uint ansid, uint _amount) public payable{

// allowed 1 time only for particular acct

// not allowed after solution given
        require(alloptions[_qid].declared_result!=1,"Voting process has been declared");
        require(alloptions[_qid].stopped!=1,"Voting process has been stopped");


        uint typeofQ = alloptions[_qid]._type;
        
        balanceOf[msg.sender]-=_amount;

        uint _power= (_amount)/ (alloptions[_qid].vote_price);

        
        //if 1 => mcq
        if(typeofQ==1)
        {
        
            alloptions[_qid].options[ansid].voters.push(Voter({
    
             add:msg.sender,
             power:_power
            }));
            
    
            alloptions[_qid].options[ansid].voteCount +=_power;
            alloptions[_qid].totalCount +=_power;
        }
        
        //2=> integer type
        else if(typeofQ==2){
        
            require(_amount == alloptions[_qid].vote_price,"Participation fees couldnot be submitted");
            allsubmissions[_qid].push(IntegerVoter({
    
             add:msg.sender,
             submittedans:ansid
            }));
            
            alloptions[_qid].totalCount +=1;
   
        }

        
        
    }
    
    function distributewin(uint _qid) public{
        
        uint ansid=alloptions[_qid].correct_ans_id;
        uint totalCount= alloptions[_qid].totalCount;
        
        address[] memory rewardees= new address[](10);

        uint typeofQ = alloptions[_qid]._type;

        //if 1 => mcq
        if(typeofQ==1)
        {
        
            uint winningCount = alloptions[_qid].options[ansid].voteCount;
            uint part = (totalCount)/winningCount;
            
            for(uint i=0;i<alloptions[_qid].options[ansid].voters.length;i++){
                
                rewardees[i]= alloptions[_qid].options[ansid].voters[i].add;
                uint totalreward= part * (alloptions[_qid].options[ansid].voters[i].power) * (alloptions[_qid].vote_price);
                balanceOf[rewardees[i]]+=totalreward;
                
            }
        }
        
        // if 2=>integer
        else if(typeofQ==2){
    
            uint totalreward= totalCount*(alloptions[_qid].vote_price);
            uint nearest=allsubmissions[_qid][0].submittedans;
            uint nearest_diff;
            
            if(ansid<nearest)
                nearest_diff=nearest - ansid;
            else
                nearest_diff=ansid - nearest;

            
            // rewardees are there as more than 1 can commit same integer, dividing amongst them
            
            // finding most accurate commit
            for(uint i=1;i<allsubmissions[_qid].length;i++){
                
               uint current=allsubmissions[_qid][i].submittedans;
               
               uint current_diff;
               
               if(allsubmissions[_qid][i].submittedans > ansid)
                    current_diff=allsubmissions[_qid][i].submittedans - ansid;
                else
                    current_diff=ansid - allsubmissions[_qid][i].submittedans ;
                
                
               if( ( current_diff) < (nearest_diff)){
                   
                   nearest_diff =current_diff;
                   nearest=current;
               }
                
            }
            
            // finding all addresses with most accurate commit
            uint cnt=0;
            for(uint i=0;i<allsubmissions[_qid].length;i++){
                
               uint current=allsubmissions[_qid][i].submittedans;
                if(current == nearest){
                    //yaha
                    rewardees[cnt] = (allsubmissions[_qid][i].add);
                    cnt++;
                }
            }
            
            uint distributereward = totalreward/(cnt+1);
            
            // distributing the reward to addresses with most accurate commit
            for(uint i=0;i<=cnt;i++)
                balanceOf[rewardees[i]]+=distributereward;

        }
        
        alloptions[_qid].winners = rewardees;

    }

    
    function getWinnings(address rewardee) public{
        
       require(
            msg.sender == address(this),
            "Contract is only eligible to update winnings to 0"
        );
         
        uint amt = balanceOf[rewardee];
        //msg.sender.transfer(amt);

        balanceOf[msg.sender]=0;
        
        emit FundTransfer(msg.sender,amt,false);

    }    
    
    
    
    function getBalance(address from) public view returns(uint256){
        return balanceOf[from];
    }
    
    
    function getWinners(uint _qid) public view returns(address[] memory){
        return alloptions[_qid].winners;
    }
    
    
    function getRate(uint _qid) public view returns(uint){
        return alloptions[_qid].vote_price;
    }
    
}

// rate user & his questions as per response, shouldnot be clear and predictable easily 


// createquestion
// 1
// 1
// 0x77696c6c20766b206869742063656e7475727900000000000000000000000000
// 1
// ["0x616c696365000000000000000000000000000000000000000000000000000000","0x626f620000000000000000000000000000000000000000000000000000000000"]



