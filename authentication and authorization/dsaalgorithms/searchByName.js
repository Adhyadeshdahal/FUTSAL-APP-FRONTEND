const {Node,AVLTree} = require('./AVL');
const path = require('path');
const fs = require('fs');
const { forEach } = require('lodash');
const filePath1 = path.join(__dirname, 'futsalfile.json');
const futsalData = JSON.parse(fs.readFileSync(filePath1, 'utf8'));

class SearchByName extends AVLTree{
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
        } else if (newNode.data.name > node.data.name) {
            node.left = this.insertNode(node.left, newNode);
            node = this.balance(node);
        } else if (newNode.data.name < node.data.name) {
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

    searchByName(name) {
        let nodes = [];
        this.searchNodeByName(this.root, name.toLowerCase().replace(/\s/g, ""), nodes);
        return nodes;
    }

    searchNodeByName(node, name, nodes) {
        if (node === null) {
            return;
        }

        this.searchNodeByName(node.left, name, nodes);

        const includesName = node.data.name.toLowerCase().replace(/\s/g, "").includes(name);

        if (includesName) {
            nodes.push(node.data);
        }

        this.searchNodeByName(node.right, name, nodes);
    }
}
const futsalTree = new SearchByName();
for (let item of futsalData) {
    futsalTree.insert(item);
}
module.exports={SearchByName};

// let string = "futsal arena";
// let searchString = string.toLowerCase().replace(/\s/g, "");
// console.log(futsalTree.searchByName(searchString));

