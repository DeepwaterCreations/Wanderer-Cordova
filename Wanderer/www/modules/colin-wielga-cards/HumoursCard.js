ColinWielgaCards.HumoursCard = function (guid, name, first_humour, second_humour, inDefault) {
    this.guid = guid;
    this.name = name;
    this.first_humour = first_humour;
    this.second_humour = second_humour; //Null for single-humoured card
    this.inDefault = inDefault || true;

    this.getHtml = function(){
        return "modules/colin-wielga-cards/HumoursCard.html";
    }
};

//This big, gangling object describes the ratios of the different card types in the deck.
//I recursively descend through the tree a couple of times to generate the deck.
var panel_number_ratios = {
    n: 1,
    ratio: 1,
    inner_ratios: [
        {
            //Singles
            ratio: 1,
            inner_ratios: [
                { ratio: 1, humours: ["YELLOWBILE", null] },
                { ratio: 1, humours: ["BLACKBILE", null] },
                { ratio: 1, humours: ["PHLEGM", null] },
            ]
        },
        {
            //Doubles
            ratio: 1,
            inner_ratios: [
                {
                    //Same
                    ratio: 1,
                    inner_ratios: [
                        { ratio: 1, humours: ["YELLOWBILE", "YELLOWBILE"] },
                        { ratio: 1, humours: ["BLACKBILE", "BLACKBILE"] },
                        { ratio: 1, humours: ["PHLEGM", "PHLEGM"] },
                    ]
                },
                {
                    //Different
                    ratio: 1,
                    inner_ratios: [
                        { ratio: 1, humours: ["YELLOWBILE", "BLACKBILE"] },
                        { ratio: 1, humours: ["YELLOWBILE", "PHLEGM"] },
                        { ratio: 1, humours: ["BLACKBILE", "PHLEGM"] },
                    ]
                } 
            ]
        }
    ]
}

var cardList = [];

var addCard = function(){
    var id = 0;
    return function(humourpair){
        var guid = id++;
        var first_humour = humourpair[0];
        var second_humour = humourpair[1]; 
        var name = first_humour;
        if(second_humour){
            name += "_" + second_humour;
        }
        cardList.push(new ColinWielgaCards.HumoursCard(guid, name, first_humour, second_humour));
    }
}();

//This function will recursively calculate size and n for each node
//and add those properties to the node objects.
//
//n is the number of "sets" needed for a given node to preserve ratios
//between its siblings. A "set" is all the cards in a node's subtree, given
//that each child node's own set appears child.n times. Size is the number
//of cards in a set.
//
//Uses these formulas:
//child.n = child.ratio * the product of all other childrens' sizes.
//node.size = the sum of (child.size * child.n) over all children.
var calcNAndSize = function(node){
    console.log("calcNAndSize");
    console.log(node);
    if(node.hasOwnProperty("humours")){
        node.size = 1;
        return;
    }
    if(node.hasOwnProperty("inner_ratios")){
        var total_product = 1;
        node.size = 0;
        //First make sure the children have sizes,
        //and keep track of their product so we can 
        //use division to get the product of the other childrens' 
        //sizes for each child without needing to iterate over them again.
        node.inner_ratios.forEach(function(child){
            calcNAndSize(child);
            total_product *= child.size;
        });
        //Now calculate n for each child and figure out its contribution
        //to this node's size.
        node.inner_ratios.forEach(function(child){
            child.n = (child.ratio * (total_product/child.size)); 
            node.size += (child.n * child.size);
        });
        return;
    }
}

var recurseDeckbuild = function(node){
    console.log("recurseDeckbuild: " + node);
    for(var i = 0; i < node.n; i++){
        if(node.hasOwnProperty("humours")){
            addCard(node.humours);
        }
        if(node.hasOwnProperty("inner_ratios")){
            node.inner_ratios.forEach(recurseDeckbuild);
        }
    }
}

calcNAndSize(panel_number_ratios);
recurseDeckbuild(panel_number_ratios);

//And now put the deck into the decklist
//My 'guid' is just a label that should uniquely identify the deck. Hopefully that's okay.
ColinWielgaCards.HumoursDeck = new ColinWielgaCards.Deck("dc-humours-deck", "Humours Deck", cardList);
ColinWielgaCards.decklist.push(ColinWielgaCards.HumoursDeck);
