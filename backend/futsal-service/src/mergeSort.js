const path = require('path');
const fs = require('fs');

function mergeSort(arr, prop) {
    if (arr.length <= 1) {
        return arr;
    }

    const middle = Math.floor(arr.length / 2);
    const left = arr.slice(0, middle);
    const right = arr.slice(middle);

    return merge(
        mergeSort(left, prop),
        mergeSort(right, prop),
        prop
    );
}

function merge(left, right, prop) {
    let result = [];
    let leftIndex = 0;
    let rightIndex = 0;

    while (leftIndex < left.length && rightIndex < right.length) {
        if (left[leftIndex][prop] < right[rightIndex][prop]) {
            result.push(left[leftIndex]);
            leftIndex++;
        } else {
            result.push(right[rightIndex]);
            rightIndex++;
        }
    }

    return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
}

module.exports = {mergeSort,merge};
// Example usage

// const filePath1 = path.join(__dirname, 'futsalfile.json');
// const futsalData = JSON.parse(fs.readFileSync(filePath1, 'utf8'));


// const sortedArr = mergeSort(futsalData, 'name');
// console.log(sortedArr);