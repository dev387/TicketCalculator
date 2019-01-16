class TicketType {
    constructor(type) {
      this.type = type;
      return this;
    }
    
    getType() {
      return this.type;
    }
  }
  
  class BetslipCalculator {
    
    constructor() {
      this.bets = [];
      this.systems = [];
      this.stake = 0.95;
      this.ticketType = new TicketType('SYSTEM').getType();
    }
    
    setBets(bets) {
      this.bets = bets;
      this.generateSystems();
    }
    
    getBankers() {
      return this.bets.filter(bet => bet.banker);
    }
    
    getNonBankers() {
      return this.bets.filter(bet => !bet.banker);
    }
    
    getBankersSum() {
      let sum = 1;
      this.getBankers().forEach(bet => sum *= bet.oddValue);
      return sum;
    }
    
    generateSystems() {
      var nonBankers = this.getNonBankers();
      this.systems = [];
      var ref = this;
      
      nonBankers.forEach(function(item, i){
        var system = {
          id: i + 1,
          of: nonBankers.length,
          active: false,
          stake: ref.stake,
          combinations: getNumberOfCombs(i + 1, nonBankers.length)
        };
        
        system.stakePerCombination = ref.stake / system.combinations;
        
        ref.systems.push(system);
      });
    }
    
    toggleSystem(id) {
      const index = this.systems.findIndex(system => system.id === id);
      this.systems[index].active = !this.systems[index].active;
    }
    
    setStake(stake) {
      this.stake = stake;
    }
    
    getSelectedSystems() {
      return this.systems.filter(system => system.active);
    }
  
    getStakePerSystem() {
      const selectedSystems = this.getSelectedSystems();
  
      let combinations = 0;
  
      selectedSystems.forEach(item => combinations += item.combinations);
  
      return this.stake / combinations;
    }
    
    calculateSystemWinnings() {
      const nonBankers = this.getNonBankers();
      const bankers = this.getBankers();
  
      const stakePerSystem = this.getStakePerSystem();
  
      let maxWinning = 0;
      
      let bankersSum = 1;
      
      bankers.forEach(item => bankersSum *= item.oddValue);
      
      let combsOdds = [];
      
      nonBankers.forEach(item => {
        combsOdds.push(item.oddValue);
      });
      
      const selectedSystems = this.getSelectedSystems();
      
      for (let i = 0; i < selectedSystems.length; i++) {
        let systemOddsSum = [];
        selectedSystems[i].maxWinning = 0;
        
        getSystemCombsOdds(combsOdds, selectedSystems[i].id, function (arrayComb) {
          let sum = 1;
          
          for (let j = 0; j < arrayComb.length; j++) {
            sum *= arrayComb[j];
          }
          
          systemOddsSum.push(sum);
          
        });
  
        console.log('stakePerSystem => ', stakePerSystem);
        for (let k = 0; k < systemOddsSum.length; k++) {
          selectedSystems[i].maxWinning += (systemOddsSum[k] * bankersSum * stakePerSystem);
        }
  
        console.log('winning per system => ', selectedSystems[i].maxWinning);
        maxWinning += selectedSystems[i].maxWinning;
      }
  
      console.log('maxWinning => ', maxWinning);
  
      console.log('==================== Calculate system winnings ====================');
    }
    
  }
  
  function getSystemCombsOdds(systemOdds, systemLoweNumber, callback) {
      var n = systemOdds.length;
      var c = [];
      var inner = function (start, choose_) {
          if (choose_ == 0) {
              callback(c);
          } else {
              for (var i = start; i <= n - choose_; ++i) {
                  c.push(systemOdds[i]);
                  inner(i + 1, choose_ - 1);
                  c.pop();
              }
          }
      };
      inner(0, systemLoweNumber);
  }
  
  const getNumberOfCombs = (num1, num2) => {
    const { lower, higher } = { lower: num1 > num2 ? num2 : num1, higher: num1 > num2 ? num1 : num2 };
  
    let x = 1;
    let y = 1;
  
    for (let i = higher; i > (higher - lower); i -= 1) {
      x *= i;
    }
  
    for (let i = lower; i > 0; i -= 1) {
      y *= i;
    }
  
    return parseFloat(x) / parseFloat(y);
  };
  
  const betslipCalc = new BetslipCalculator();
  
  const bets = [
    {
      banker: false,
      oddValue: 1.85
    },
    {
      banker: false,
      oddValue: 2.00
    },
    {
      banker: false,
      oddValue: 1.40
    },
    {
      banker: true,
      oddValue: 2.10
    },
    {
      banker: true,
      oddValue: 1.65
    }
  ];
  
  betslipCalc.setBets(bets);
  
  betslipCalc.toggleSystem(3);
  betslipCalc.toggleSystem(1);
  // betslipCalc.toggleSystem(5);
  betslipCalc.calculateSystemWinnings();