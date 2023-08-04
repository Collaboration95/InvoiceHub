const fetchData = require('../routes/overdue')

const mysql = require('mysql2/promise');


function categorizeData(dateDiff) {
  if (dateDiff < 30) return '<30 days';
  if (dateDiff < 60) return '30-60 days';
  if (dateDiff < 90) return '60-90 days';
  return '>90 days';
}


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

    const categoryTotals = {
      '<30 days': 0,
      '30-60 days': 0,
      '60-90 days': 0,
      '>90 days': 0,
    };

    for (let i = 0; i < iterations; i++) {
      const setOutput = [];
      
      for (let j = 0; j < 10; j++) {
        const randomDate = getRandomDate(startDate, endDate);
        const randomTotalValue = getRandomDecimal(1, 2000);
        
        const today = new Date();
        const dateDiff = Math.floor((today - randomDate) / (1000 * 60 * 60 * 24));
        
        const category = categorizeData(dateDiff);
        categoryTotals[category] += randomTotalValue;

        setOutput.push(`${randomDate.toISOString().split('T')[0]}\t$S ${randomTotalValue.toFixed(2)}`);
        
        fuzzedData.push({
          input: { randomDate, randomTotalValue },
          category,
        });
      }

      console.log('Set', i + 1, 'Input Data:');
      console.log(setOutput.join('\n'));
      console.log('Category Totals for Set', i + 1, ':', categoryTotals);
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
