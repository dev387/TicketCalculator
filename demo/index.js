import BetslipCalculator from '../BetslipCalculator.js';

const betslipCalc = new BetslipCalculator();

const bets = [{
    banker: false,
    oddValue: 1.85
  },
  {
    banker: false,
    oddValue: 2.00
  },
  {
    banker: true,
    oddValue: 1.40
  },
  {
    banker: false,
    oddValue: 2.10
  },
  {
    banker: true,
    oddValue: 1.65
  }
];

betslipCalc.setBets(bets);

betslipCalc.toggleSystem(1);
betslipCalc.toggleSystem(2);
betslipCalc.toggleSystem(3);
// betslipCalc.toggleSystem(4);
// betslipCalc.toggleSystem(5);
console.log('System Winnings => ', betslipCalc.calculateSystemWinnings().toFixed(2));
console.log('Single Winnings => ', betslipCalc.calculateSingleWinnings().toFixed(2));
console.log('Combo Winnings => ', betslipCalc.calculateComboWinnings().toFixed(2));
