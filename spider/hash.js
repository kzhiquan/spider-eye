

/* module export  to out */
exports = module.exports = Hash;



/* constructor */
function Hash(options){
    this.hashMap = [];
    this.hashsize = options.hashsize;
};



/* calculate Hash Code */
Hash.prototype.calculateHashCode = function(path){
    var length = path.length;
    var hashCode = 0;
    for(var i = 0; i < length; i++){
        hashCode += path.charCodeAt(i);
    }

    hashCode = hashCode % this.hashsize;

    return hashCode;
};




/* set hashCode */
Hash.prototype.setHashCode = function(hashCode){
    this.hashMap[hashCode] = 1;
};

/* is the hashCode has set */
Hash.prototype.isHashCodeSet = function(hashCode){
    return this.hashMap[hashCode] == 1 ? true : false;
};

