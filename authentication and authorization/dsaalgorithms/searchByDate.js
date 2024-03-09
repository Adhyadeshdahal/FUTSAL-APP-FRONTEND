const {Node,AVLTree} = require('./AVL');
const path = require('path');
const fs = require('fs');
const { forEach } = require('lodash');

const filePath1 = path.join(__dirname, 'futsalfile.json');
const futsalData = JSON.parse(fs.readFileSync(filePath1, 'utf8'));

class SearchByDate extends AVLTree{
    insert(data) {
        let newNode = new Node(data);
        if (this.root === null) {
            this.root = newNode;
        } else {
            this.root = this.insertNode(this.root, newNode);
        }
    }

    insertNode(node, newNode) {
        if (node === null) {
            node = newNode;
        } else if (newNode.data.dates > node.data.dates) {
            node.left = this.insertNode(node.left, newNode);
            node = this.balance(node);
        } else if (newNode.data.dates < node.data.dates) {
            node.right = this.insertNode(node.right, newNode);
            node = this.balance(node);
        } else {
            if (newNode.data.price > node.data.price) {
                node.left = this.insertNode(node.left, newNode);
                node = this.balance(node);
            } else {
                node.right = this.insertNode(node.right, newNode);
                node = this.balance(node);
            }
        }
        return node;
    }

    searchByDate(date) {
        let nodes = [];
        this.searchNodeByDate(this.root, date, nodes);
        return nodes;
    }

    searchNodeByDate(node, date, nodes) {
        if (node === null) {
            return;
        }

        this.searchNodeByDate(node.left, date, nodes);

        const includesDate = node.data.dates.some(item => item === date);

        if (includesDate) {
            nodes.push(node.data);
        }

        this.searchNodeByDate(node.right, date, nodes);
    }
}
// const futsalTree = new SearchByDate();
// for (let item of futsalData) {
//     futsalTree.insert(item);
// }
module.exports={SearchByDate};
// let searchString = "2024-04-06";
// console.log(futsalTree.searchByDate(searchString));

