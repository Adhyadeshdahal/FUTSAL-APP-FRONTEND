const { error } = require('console');
const fs = require('fs');
const path = require('path');

function makeTimingUnavailable(futsalid, date, time) {
    // Construct the path to the timing file
    const timingFilePath = path.join(__dirname,'Timings', `${futsalid}.json`);

    // Read the timing file
    let timingData;
    try {
        timingData = JSON.parse(fs.readFileSync(timingFilePath, 'utf8'));
    } catch (error) {
        console.error('Error reading timing file:', error);
        return false;
    }

    // Ensure that the date exists in the timingData object
    if (!timingData[date]) {
        console.error('Date not found in timing data:', date);
        throw new Error('Date not found in timing data');
        return false;
    }

    // Update the timing data to make the specified time unavailable
    timingData[date][time] = false;

    // Write the updated timing data back to the file
    fs.writeFileSync(timingFilePath, JSON.stringify(timingData, null, 2));

    // Check if there are any available timings left for the date
    const isAnyTimingAvailable = Object.values(timingData[date]).some(value => value === true);

    // If no timings are available, remove the date from the futsal's dates array
    if (!isAnyTimingAvailable) {
        // Load futsal data from the futsal file
        const futsalFilePath = 'futsalfile.json';
        let futsalData;
        try {
            futsalData = JSON.parse(fs.readFileSync(futsalFilePath, 'utf8'));
        } catch (error) {
            console.error('Error reading futsal file:', error);
            return false;
        }

        // Find the futsal in the futsal data
        const futsalIndex = futsalData.findIndex(futsal => futsal.id === futsalid);

        // Remove the date from the futsal's dates array
        if (futsalIndex !== -1) {
            futsalData[futsalIndex].dates = futsalData[futsalIndex].dates.filter(d => d !== date);
        }

        // Write the updated futsal data back to the file
        fs.writeFileSync(futsalFilePath, JSON.stringify(futsalData, null, 2));
    }

    return true;
}



function makeTimingAvailable(futsalid, date, time) {
    // Construct the path to the timing file
    const timingFilePath = path.join(__dirname,'Timings', `${futsalid}.json`);

    // Read the timing file
    let timingData;
    try {
        timingData = JSON.parse(fs.readFileSync(timingFilePath, 'utf8'));
    } catch (error) {
        console.error('Error reading timing file:', error);
        return false;
    }

    // Update the timing data to make the specified time available
    timingData[date][time] = true;

    // Write the updated timing data back to the file
    fs.writeFileSync(timingFilePath, JSON.stringify(timingData, null, 2));

    // Load futsal data from the futsal file
    const futsalFilePath = 'futsalfile.json';
    let futsalData;
    try {
        futsalData = JSON.parse(fs.readFileSync(futsalFilePath, 'utf8'));
    } catch (error) {
        console.error('Error reading futsal file:', error);
        return false;
    }

    // Find the futsal in the futsal data
    const futsalIndex = futsalData.findIndex(futsal => futsal.id === futsalid);

    // If the futsal exists, check if the date was previously deleted
    if (futsalIndex !== -1) {
        const futsal = futsalData[futsalIndex];
        const dateIndex = futsal.dates.indexOf(date);
        if (dateIndex === -1) {
            // Add the date back to the futsal's dates array
            futsal.dates.push(date);

            // Write the updated futsal data back to the file
            fs.writeFileSync(futsalFilePath, JSON.stringify(futsalData, null, 2));
        }
    }

    return true;
}

// Example usage
makeTimingUnavailable('0', '2024-03-30', '10:00');


module.exports={makeTimingUnavailable,makeTimingAvailable};
// Example usage

