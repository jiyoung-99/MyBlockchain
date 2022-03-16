const crypto = require("crypto"), SHA256 = message => crypto.createHash("sha256").update(message).digest("hex");


class Block {
    constructor(timestamp = "", data=[] ) {
        this.index = 0;
        this.previousHash = "";
        this.hash = this.getHash();
        this.timestamp = timestamp;
        this.data = data;
        this.nonce = 0;
    }

    getHash() {
        return SHA256(JSON.stringify(this.data) + this.timestamp + this.previousHash + this.nonce)
    }

    mine(difficulty) {
        while(!this.hash.startsWith(Array(difficulty + 1).join("0"))) {
            this.nonce++;
            this.hash = this.getHash();
            // console.log("this.hash" , this.hash)
        }
    }
}

class Blockchain {
    //genesis block
    constructor() {
        this.chain = [new Block(Date.now().toString(), ["genesis block"])];
        this.difficulty = 1;
        this.blockTime = 3000;
    }

    getLastBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(block) {
        block.index = this.getLastBlock().index + 1;
        block.previousHash = this.getLastBlock().hash;
        block.hash = block.getHash();

        block.mine(this.difficulty);

        this.chain.push(block);

        this.difficulty += Date.now() - parseInt(this.getLastBlock().timestamp) < this.blockTime ? 1 : -1;

    }

    isValid(blockchain = this) {
        for(let i = 1; i < blockchain.chain.length; i ++) {
            const currentBlock = blockchain.chain[i];
            const prevBlock = blockchain.chain[i - 1];
            // console.log("currentBlock", currentBlock);
            // console.log("prevBlock", prevBlock);
            if (currentBlock.hash !== currentBlock.getHash() || currentBlock.previousHash !== prevBlock.hash) {
                return false;
            }
        }
        return true;
    }
}

const JiyoungChain = new Blockchain();
JiyoungChain.addBlock(new Block(Date.now().toString(), ["Hello", "World"]));
JiyoungChain.addBlock(new Block(Date.now().toString(), ["Hello", "Coin"]));
JiyoungChain.addBlock(new Block(Date.now().toString(), ["Hello", "Crypto"]));

console.log(JiyoungChain)
// console.log(JiyoungChain.isValid());
// difficulty = 1;
// "03sldfkjslekfj3irws9df"  // difficulty = 1
// "0-3sldfkjslekfj3irws9df" // difficulty = 2