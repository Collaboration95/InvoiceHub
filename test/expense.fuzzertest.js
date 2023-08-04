const fetchData = require('../routes/expense')

const mysql = require('mysql2/promise');

function categorizeMonth(month) {
  switch (month) {
    case 'Jan': return 'January';
    case 'Feb': return 'February';
    case 'Mar': return 'March';
    case 'Apr': return 'April';
    case 'May': return 'May';
    case 'Jun': return 'June';
    case 'Jul': return 'July';
    case 'Aug': return 'August';
    case 'Sep': return 'September';
    case 'Oct': return 'October';
    case 'Nov': return 'November';
    case 'Dec': return 'December';
    default: return 'Unknown';
  }
}

// Generate random date within a specified range
function getRandomDate(startDate, endDate) {
  const diff = endDate.getTime() - startDate.getTime();
  const randomDiff = Math.random() * diff;
  const randomDate = new Date(startDate.getTime() + randomDiff);
  return randomDate;
}

function getRandomDecimal(min, max) {
  return (Math.random() * (max - min)) + min;
}

async function performFuzzerTest(iterations) {
  try {
    const fuzzedData = [];

    const startDate = new Date(2023, 0, 1);
    const endDate = new Date(); 

    const monthTotals = {};

    for (let i = 0; i < iterations; i++) {
      const setOutput = [];
      
      for (let j = 0; j < 10; j++) {
        const randomDate = getRandomDate(startDate, endDate);
        const randomTotalValue = getRandomDecimal(1, 20000);

        const month = categorizeMonth(randomDate.toLocaleString('default', { month: 'short' }));
        if (!monthTotals[month]) {
          monthTotals[month] = 0;
        }
        monthTotals[month] += randomTotalValue;

        setOutput.push(`${randomDate.toISOString().split('T')[0]}\t$S ${randomTotalValue.toFixed(2)}`);
        
        fuzzedData.push({
          input: { randomDate, randomTotalValue },
          month,
        });
      }

      console.log('Set', i + 1, 'Input Data:');
      console.log(setOutput.join('\n'));
      console.log('Month Totals for Set', i + 1, ':', monthTotals);
      console.log('\n');
    }

    console.log('Fuzz testing completed successfully!');
    console.log('Fuzzed data:', fuzzedData);
  } catch (error) {
    console.error('Fuzz testing error:', error);
  }
}


const numIterations = 5; 


performFuzzerTest(numIterations);
