const fs = require('fs');

// Load futsal data from JSON file
const futsalData = JSON.parse(fs.readFileSync('futsalfile.json', 'utf8'));

// Convert price from string to integer
for (const futsal of futsalData) {
    futsal.price = parseInt(futsal.price.replace('$', '').replace(' per hour', ''));
}

// Define B-tree node structure
class Node {
    constructor(keys = [], children = []) {
        this.keys = keys || [];
        this.children = children || [];
    }
}

// Define B-tree class
class BTree {
    constructor(t) {
        this.root = new Node();
        this.t = t;
    }

    insert(price, futsal) {
        if (this.root.keys.length === (2 * this.t) - 1) {
            const newRoot = new Node();
            newRoot.children.push(this.root);
            this.splitChild(newRoot, 0);
            this.root = newRoot;
        }
        this.insertNonFull(this.root, price, futsal);
    }

    insertNonFull(x, price, futsal) {
        let i = x.keys.length - 1;
        if (!x.children) {
            x.keys.push(null);
            x.children.push(null);
        }
        while (i >= 0 && price < x.keys[i]) {
            i--;
        }
        i++;
        if (!x.children[i]) {
            x.keys.splice(i, 0, price);
            x.children.splice(i, 0, futsal);
        } else {
            if (x.children[i].keys.length === (2 * this.t) - 1) {
                this.splitChild(x, i);
                if (price > x.keys[i]) {
                    i++;
                }
            }
            this.insertNonFull(x.children[i], price, futsal);
        }
    }

    splitChild(x, i) {
        const z = new Node();
        const y = x.children[i];
        x.children.splice(i + 1, 0, z);
        x.keys.splice(i, 0, y.keys[this.t - 1]);
        z.keys = y.keys.slice(this.t, (2 * this.t) - 1);
        y.keys = y.keys.slice(0, this.t - 1);
        if (y.children) {
            z.children = y.children.slice(this.t, 2 * this.t);
            y.children = y.children.slice(0, this.t);
        }
    }
}

// Function to search futsal centers within a given price range
function searchFutsalInRange(bTree, minPrice, maxPrice) {
    const results = [];
    let currentNode = bTree.root;
    while (currentNode) {
        let i = 0;
        while (i < currentNode.keys.length && currentNode.keys[i] < minPrice) {
            i++;
        }
        if (i < currentNode.keys.length) {
            if (minPrice <= currentNode.keys[i] && currentNode.keys[i] <= maxPrice) {
                results.push(...currentNode.children[i]);
            }
            currentNode = currentNode.children[i];
        } else {
            currentNode = null;
        }
    }
    return results;
}

// Create B-tree and insert futsal centers
const bTree = new BTree(5);
for (const futsal of futsalData) {
    bTree.insert(futsal.price, futsal);
}

function searchFutsal(request) {
    if (request.method === 'POST') {
        const data = JSON.parse(request.body);
        const minPrice = data.minPrice;
        const maxPrice = data.maxPrice;

        if (minPrice === undefined || maxPrice === undefined) {
            return { error: 'Please provide both minPrice and maxPrice' };
        }

        if (isNaN(minPrice) || isNaN(maxPrice)) {
            return { error: 'Invalid price format' };
        }

        const searchResults = searchFutsalInRange(bTree, minPrice, maxPrice);
        const sortedResults = searchResults.sort((a, b) => a.price - b.price);

        return { futsalCenters: sortedResults };
    } else {
        return { error: 'Only POST requests are supported' };
    }
}
