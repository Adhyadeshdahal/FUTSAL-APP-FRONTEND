const fs = require('fs');

// Load futsal data from JSON file
const futsalData = JSON.parse(fs.readFileSync('futsalfile.json', 'utf8'));

// Convert price from string to integer
futsalData.forEach(futsal => {
    futsal.price = parseInt(futsal.price.replace('$', '').replace(' per hour', ''));
});

// Define IntervalNode for interval tree
class IntervalNode {
    constructor(start, end) {
        this.start = start;
        this.end = end;
        this.left = null;
        this.right = null;
        this.maxEnd = end;
    }
}

// Function to insert interval into the interval tree
function insert(root, start, end) {
    if (!root) {
        return new IntervalNode(start, end);
    }

    if (start < root.start) {
        root.left = insert(root.left, start, end);
    } else {
        root.right = insert(root.right, start, end);
    }

    if (root.maxEnd < end) {
        root.maxEnd = end;
    }

    return root;
}

// Function to search for available slots in the interval tree
function search(root, start, end) {
    if (!root) {
        return true;
    }

    if (root.start >= end || root.end <= start) {
        return true;
    }

    if (root.left && root.left.maxEnd > start) {
        return search(root.left, start, end);
    }

    return search(root.right, start, end);
}

// Initialize interval trees for each futsal center
const futsalIntervalTrees = {};
for (const futsal of futsalData) {
    futsalIntervalTrees[futsal.name] = null;
}

// Populate interval trees with available slots for each futsal center
for (const futsalName in futsalIntervalTrees) {
    let root = null;
    for (let i = 0; i < 17; i++) {  // Assuming 16 slots from 5 am to 9 pm
        root = insert(root, i, i + 1);
    }
    futsalIntervalTrees[futsalName] = root;
}

// Define slot to time mapping
const slotToTimeMapping = {
    0: '5 am - 6 am',
    1: '6 am - 7 am',
    2: '7 am - 8 am',
    3: '8 am - 9 am',
    4: '9 am - 10 am',
    5: '10 am - 11 am',
    6: '11 am - 12 pm',
    7: '12 pm - 1 pm',
    8: '1 pm - 2 pm',
    9: '2 pm - 3 pm',
    10: '3 pm - 4 pm',
    11: '4 pm - 5 pm',
    12: '5 pm - 6 pm',
    13: '6 pm - 7 pm',
    14: '7 pm - 8 pm',
    15: '8 pm - 9 pm',
};

function searchFutsalByName(requestBody) {
    const futsalName = requestBody.futsal_name;
    if (!futsalName) {
        return { error: 'Please provide a futsal_name' };
    }

    if (!(futsalName in futsalIntervalTrees)) {
        return { error: 'Futsal not found' };
    }

    return { available_slots: slotToTimeMapping };
}

function bookFutsalSlot(requestBody) {
    const futsalName = requestBody.futsal_name;
    const slot = parseInt(requestBody.slot);

    if (!futsalName || isNaN(slot)) {
        return { error: 'Please provide futsal_name and slot' };
    }

    if (!(futsalName in futsalIntervalTrees)) {
        return { error: 'Futsal not found' };
    }

    if (!(0 <= slot && slot <= 16)) {
        return { error: 'Invalid slot number. Slot should be between 0 and 16' };
    }

    if (search(futsalIntervalTrees[futsalName], slot, slot + 1)) {
        return { message: 'Slot booked successfully' };
    } else {
        return { error: 'Slot not available' };
    }
}

module.exports = {
    searchFutsalByName,
    bookFutsalSlot
};
