//JUST NOTES
//insertBefore() – inserts a node immediately before another
//nextElementSibling – reference to the next immediate sibling of the referenced node
//previousElementSibling – reference to the previous immediate sibling of the referenced node
//parentNode – reference to the parent node of the referenced node



//Grabbing elements from the form
const cardBack = document.querySelector('main img');
const newCard = document.querySelector('.newCard');
const row = document.querySelector('.row');
const form = document.querySelector('img');

//Elements required for genereating pile of random cards
const cardsNames = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'A', 'J', 'K', 'Q'];
const cardsTypes = ['C', 'D', 'H', 'S'];
let usedCards = [];
let arr = new Array();
let passedCardsArray = [];
for (let i = 0; i < 7; i++) {
    passedCardsArray.push(arr);
}
let newCardMade;

//Grabbing img name onclick event
let imgName = '';
let dragImg;
let grabedImg;
let draggingImage;
let topPreviousImage;

//Counting for open new card from the pile
let openNewCardCount = 0;
let zIndex = -24;
let block1index = -15;
let block2index = -15;
let block3index = -15;
let block4index = -15;
let newImageId;
let oldImageIndex = 0;
let oldImage;
let oldImages = [];

//Elements required for generating cards images on the screen
let img = document.createElement("img");

class block {
    constructor(type) {
        this.elm = document.createElement(type);
        this.elm.setAttribute('class', 'block');
    }
}
let newBlock = new block("div");



//Window onload generate UI and arrays of cards
window.onload = function () {
    for (i = -1; i < 7; i++) {
        row.appendChild(newBlock.elm.cloneNode(true));
        newBlock = new block("div");
        for (j = -2; j < i; j++) {
            if (j != i - 1) {
                img.setAttribute('style', "margin-top:" + j * 15 + "px;");
                img.setAttribute("src", 'img/blue_back.png');
                img.setAttribute("onclick", "openCard(this)");
                newBlock.elm.appendChild(img.cloneNode(true));
            } else {
                newCardMade = generateNewCard();
                passedCardsArray[i + 1].push(newCardMade);
                img.setAttribute('style', "margin-top:" + j * 15 + "px;");
                img.setAttribute("src", 'img/PNG/' + passedCardsArray[i + 1][j + 2] + '.png');
                img.setAttribute('id', passedCardsArray[i + 1][j + 2])
                img.setAttribute('draggable', 'true');
                img.setAttribute('ondragstart', "dragStart(this)");
                img.setAttribute('ondrop', 'drop(event, this)');
                img.setAttribute('ondragover', 'allowDrop(event)');
                newBlock.elm.appendChild(img.cloneNode(true));
            };
        };
    };
};



//Generate a random card on 'click' event
cardBack.addEventListener('click', (e) => {
    e.preventDefault();
    img.setAttribute('style', 'margin-top:0; position:absolute;');
    if (openNewCardCount < 24) {
        //Changing atributes of previous image in order to make them stack on top of each other
        if (openNewCardCount >= 1) {
            oldImage = document.getElementById(newImageId);
            // console.log(oldImages[oldImageIndex]);
            if (oldImageIndex > 0) {
                oldImage.setAttribute('style', "margin-top:0; position:absolute; z-index:" + zIndex + ";");
            }
            // console.log(oldImageIndex);

            oldImages[oldImageIndex] = oldImage;
            // console.log(oldImages[oldImageIndex].id);
            // console.log(oldImages);
            // console.log(oldImageIndex);
            zIndex++;
        }
        //generating new card and inserting it after img in form
        newCardMade = generateNewCard();
        img.setAttribute('src', 'img/PNG/' + newCardMade + '.png');
        img.setAttribute('draggable', 'true');
        img.setAttribute('id', newCardMade);
        img.setAttribute('ondragstart', "dragStart(this)");
        img.setAttribute('ondragover', 'allowDrop(event)');
        img.setAttribute('ondrop', 'drop(event, this)');
        form.after(img.cloneNode(true));
        if (oldImageIndex == 0) {            
            oldImages[oldImageIndex] = img;
        }
        oldImageIndex++;
        newImageId = img.id;
        openNewCardCount++;

    } else {
        cardBack.setAttribute('style', 'display:hidden;');
    }
    console.log(oldImages);
    console.log(oldImageIndex);
})

//generating arrays of random card for startup game
function generateNewCard() {
    let stop = false;
    do {
        let randomCardName = cardsNames[Math.floor(Math.random() * cardsNames.length)];
        let randomCardType = cardsTypes[Math.floor(Math.random() * cardsTypes.length)];
        newCardMade = randomCardName + randomCardType;
        if (usedCards.includes(newCardMade)) {
            stop = true;
        } else {
            stop = false;
        }

    } while (stop);
    usedCards.push(newCardMade);
    return newCardMade;
}


//Open new card
function openCard(img) {
    if (img.src.includes("blue_back")) {

        newCardMade = generateNewCard();
        img.setAttribute('src', 'img/PNG/' + newCardMade + '.png');
        img.setAttribute('id', newCardMade)

    }
    // console.log(usedCards);
}

//dragging functions
function dragStart(img) {
    draggingImage = img;
    event.dataTransfer.setData('text', draggingImage);
    // console.log(img.id);
}
function dragFromPile(img) {
    draggingImage = img;
    event.dataTransfer.setData('text', draggingImage);
    // draggingImage.setAttribute('class', '');
    // draggingImage.setAttribute('ondrop', 'drop(event, this)')
    // console.log(img.id);
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drop(ev, img) {
    ev.preventDefault();
    if (checkCardsWeights(img.id, draggingImage.id)) {
        ev.target.insertAdjacentElement('afterend', draggingImage);
        styles = img.currentStyle || window.getComputedStyle(img);
        let pixels = parseInt(styles.marginTop);
        pixels = pixels + 15;
        draggingImage.setAttribute('style', 'margin-top:' + pixels + 'px;');
        draggingImage.setAttribute('class', '');
        draggingImage.setAttribute('ondragstart', 'dragStart(this)');
        // console.log(oldImageIndex);
        // oldImageIndex--;
        // console.log(oldImages[oldImageIndex].id);
        // console.log(draggingImage.id);
        // console.log(oldImages);
        if (oldImageIndex > 0 && oldImages[0].id == draggingImage.id) {
            oldImageIndex--;
            if (oldImageIndex > 1) {
                oldImages[oldImageIndex].setAttribute('style', "margin-top:0; position:absolute;");                
            }
            for( var i = 0; i < oldImages.length; i++){ 
                if ( oldImages[i].id === draggingImage.id) {
                    oldImages.splice(i, 1); 
                }
            }
            newImageId = oldImages[oldImageIndex-1].id;
        }
        console.log(oldImageIndex);
        console.log(oldImages);
    }
}

//NEED TO CHANGE IMG ATTRIBUTE WHEN DROP HAPPENS
function dropPile(ev, img) {
    ev.preventDefault();

    let block;
    let zIndexTopCards;
    if (ev.target.classList.contains('block1')) {
        zIndexTopCards = block1index;
        block = 'block1';
    } else if (ev.target.classList.contains('block2')) {
        zIndexTopCards = block2index;
        block = 'block2';
    } else if (ev.target.classList.contains('block3')) {
        zIndexTopCards = block3index;
        block = 'block3';
    } else if (ev.target.classList.contains('block4')) {
        zIndexTopCards = block4index;
        block = 'block4';
    }
    // if (zIndexTopCards == -15 && draggingImage.id.includes('A')){   VERY IMPORTANT LINE!!!!!     
    if (zIndexTopCards == -15){        
        
        ev.target.insertAdjacentElement('afterend', draggingImage);
        img.setAttribute('style', 'z-Index:' + zIndexTopCards + '; position: absolute; border:none;')
        draggingImage.setAttribute('style', 'margin-top:0px; position:absolute; border: none;');
        draggingImage.setAttribute('ondrop', 'dropPile(event, this)');
        draggingImage.setAttribute('ondragstart', 'dragFromPile(this)');
        draggingImage.setAttribute('class', 'pile-card-block ' + block);
        console.log(oldImageIndex);
        console.log(oldImages[0].id);
        console.log(draggingImage.id);
        if (oldImageIndex > 0 && oldImages[0].id == draggingImage.id) {
            oldImageIndex--;
            if (oldImageIndex > 1) {
                oldImages[oldImageIndex].setAttribute('style', "margin-top:0; position:absolute;");
            }
            newImageId = oldImages[oldImageIndex].id;            
        }
        zIndexTopCards++;
        if (block == 'block1'){
            block1index = zIndexTopCards;
        }else if(block == 'block2'){
            block2index = zIndexTopCards;
        }else if(block == 'block3'){
            block3index = zIndexTopCards;            
        }else if(block == 'block4'){
            block4index = zIndexTopCards;            
        }
    }else if(checkCardsWeightsTopPile(img, draggingImage)) {
        // console.log(draggingImage);
        console.log(oldImages[oldImageIndex]);
        // console.log(ev.target.classList);
        ev.target.insertAdjacentElement('afterend', draggingImage);
        img.setAttribute('style', 'z-Index:' + zIndexTopCards + '; position: absolute; border:none;')
        draggingImage.setAttribute('style', 'margin-top:0px; position:absolute; border: none;');
        draggingImage.setAttribute('ondrop', 'dropPile(event, this)');
        draggingImage.setAttribute('ondragstart', 'dragFromPile(this)');
        draggingImage.setAttribute('class', 'pile-card-block ' + block);
        if (oldImageIndex > 0 && oldImages[0].id == draggingImage.id) {
            oldImageIndex--;
            if (oldImageIndex > 1) {
                oldImages[oldImageIndex].setAttribute('style', "margin-top:0; position:absolute;");
            }
            newImageId = oldImages[oldImageIndex].id;
        }
        zIndexTopCards--;
        if (block == 'block1'){
            block1index = zIndexTopCards;
        }else if(block == 'block2'){
            block2index = zIndexTopCards;
        }else if(block == 'block3'){
            block3index = zIndexTopCards;            
        }else if(block == 'block4'){
            block4index = zIndexTopCards;            
        }
    }
}



//check if image can be droped there
function checkCardsWeights(card1, card2) {
    //variables for cardsWeight function
    let img1Color;
    let img2Color;

    let card1Weight = 0;
    let card2Weight = 0;

    // console.log(card1);

    if (card1.includes('D') || card1.includes('H')) {
        img1Color = 'red';
    } else {
        img1Color = 'black'
    };

    if (card2.includes('D') || card2.includes('H')) {
        img2Color = 'red';
    } else {
        img2Color = 'black'
    };

    switch (card1.charAt(0)) {
        case 'A':
            card1Weight = 14;
            break;
        case 'K':
            card1Weight = 13;
            break;
        case 'Q':
            card1Weight = 12;
            break;
        case 'J':
            card1Weight = 11;
            break;
        case '1':
            card1Weight = 10;
            break;
        default:
            card1Weight = card1.charAt(0);
    }

    switch (card2.charAt(0)) {
        case 'A':
            card2Weight = 14;
            break;
        case 'K':
            card2Weight = 13;
            break;
        case 'Q':
            card2Weight = 12;
            break;
        case 'J':
            card2Weight = 11;
            break;
        case '1':
            card2Weight = 10;
            break;
        default:
            card2Weight = card2.charAt(0);
    }
    // console.log(card1Weight, card2Weight);
    if (card1Weight > card2Weight && img1Color != img2Color && card1Weight - card2Weight === 1) {
        return true;
    } else {
        return false;
    }
}

function checkCardsWeightsTopPile(card1, card2) {
    //variables for cardsWeight function
    let img1Type;
    let img2Type;

    let card1Weight = 0;
    let card2Weight = 0;

    console.log(card2);
    console.log(card1);

    if (card1.id.includes('D')) {
        img1Type = 'D';
    } else if(card1.id.includes('H')){
        img1Type = 'H'
    } else if(card1.id.includes('C')){
        img1Type = 'C'
    } else {
        img1Type = 'S'
    };

    if (card2.id.includes('D')) {
        img2Type = 'D';
    } else if(card2.id.includes('H')){
        img2Type = 'H'
    } else if(card2.id.includes('C')){
        img2Type = 'C'
    } else {
        img2Type = 'S'
    };

    switch (card1.id.charAt(0)) {
        case 'A':
            card1Weight = 1;
            break;
        case 'K':
            card1Weight = 13;
            break;
        case 'Q':
            card1Weight = 12;
            break;
        case 'J':
            card1Weight = 11;
            break;
        case '1':
            card1Weight = 10;
            break;
        default:
            card1Weight = card1.id.charAt(0);
    }

    switch (card2.id.charAt(0)) {
        case 'A':
            card2Weight = 1;
            break;
        case 'K':
            card2Weight = 13;
            break;
        case 'Q':
            card2Weight = 12;
            break;
        case 'J':
            card2Weight = 11;
            break;
        case '1':
            card2Weight = 10;
            break;
        default:
            card2Weight = card2.id.charAt(0);
    }
    // console.log(card1Weight, card2Weight);
    if (card1Weight < card2Weight && img1Type === img2Type && card2Weight - card1Weight === 1) {
        return true;
    } else {
        return false;
    }
}