const array1 = [5,5,5,-3];

function positiveSum(arr) {
    return arr.reduce( (acc, curr) => curr > 0 ? curr + acc : acc, 0 
)}

positiveSum(array1);


const positiveSum = (arr) => arr.reduce((sum, n) => n > 0 ? sum + n : sum, 0);