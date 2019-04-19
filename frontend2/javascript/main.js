const base_url='https://stormy-bastion-21788.herokuapp.com/api/v1/'

const imageBoard=document.getElementById('images')
const bigUL=document.querySelector('.list-group')
const displayModal=document.getElementById('displayModal')

const title=document.getElementById("title")
const mainNav=document.querySelector(".navbar-nav")

let mainPage=true;
let lastQuery=""

//when you scroll to bottom of window
$(window).scroll(function() {
     if(($(window).scrollTop() == $(document).height() - $(window).height()) && mainPage){
         loadMore(lastQuery)
     }
 });

home()

//checks if last query was a color OR just homepage and renders 100 more images upon end of page scroll
function loadMore(lq){
     if (lq.length!==1)
          fetch(lq)
          .then(response=>response.json())
          .then(json=>{
               json.map(renderArt)
          })
     else{
          filterByColor(lastQuery)
     }
}

//append event listener to title
title.addEventListener('click', (e)=>{
     home()
})

//append event listeners to all navbar colors (and lands)
for (let i=0;i<7;i++){
     let color=mainNav.children[i]
     color.addEventListener('click', (e)=>{
          clearAll();
          //actual id on the list item (color abbrev)
          filterByColor(color.id)
     })
}
//artists in nav bar
const artists=mainNav.children[7]
artists.addEventListener('click', (e)=>{
     getRenderList('artist')    
})

//sets in nav bar
const sets=mainNav.children[8]
sets.addEventListener('click', (e)=>{
     getRenderList('card_set')
})

//reset to "home-page" and render 100 random cards
function home(){
     clearAll()
     fetch(base_url+'cards')
     .then(response=>response.json())
     .then(json=>{
          json.map(renderArt)
     })
     lastQuery=(base_url+'cards')
     mainPage=true
}

//clears any parent of it's children
function clearParent(parent){
     while(parent.firstChild){
          parent.firstChild.remove()
     }
}

//clears board/list and also hides modal
function clearAll(){
     clearParent(imageBoard)
     clearParent(bigUL)
     $('#displayModal').modal('hide');
}

//renders a card for display on 'image board'
function renderArt(card){
     let currCard = new MTGCard(card)
     let fig=currCard.figRender()
     fig.querySelector('.forModal').addEventListener('click', ()=>{
          renderModal(currCard)   
     })
     fig.querySelector('.artist-span').addEventListener('click', (e)=>{
          filterBy(e.target.textContent, 'artist') 
     })
     imageBoard.append(fig)
}

//send color abbrev to colors controller and then render response
function filterByColor(abbrev){
     let config={
          method: 'post',
          headers: {
               "Content-Type": "application/json",
               "Accept": "application/json"
          },
          body: JSON.stringify({
              "abbreviation": abbrev
          })
     }
     mainPage=true;
     lastQuery=abbrev
     fetch(base_url+'colorfilter', config)
     .then(response=>response.json())
     .then(json=>json.map(renderArt))
}

//helper and sets main page to false(as artist/set don't need infinite scroll
function getRenderList(type){
     clearAll()
     let query=base_url+type+'s'
     fetch(query)
     .then(response=>response.json())
     .then(json=>json.forEach((ele)=>{
          renderNames(ele,type)  
     }))
     mainPage=false;
}

//renders list of either class/set
function renderNames(n, type){
     let li=document.createElement('li')
     li.classList.add('list-group-item', 'list-group-item-dark', 'clickable')
     li.textContent=`${n.name}`    
     li.addEventListener('click', (e)=>{
          filterBy(n.name, type)
     })
     bigUL.append(li)
}

//queries db for actual cards that belong to color/set
function filterBy(name, type){
     clearAll();
     let config={
          method: 'post',
          headers: {
               "Content-Type": "application/json",
               "Accept": "application/json"
          },
          body: JSON.stringify({
               "name": name
          })
     }
     mainPage=false
     lastQuery=base_url+type+'filter'
     fetch(base_url+type+'filter', config)
     .then(response=>response.json())
     .then(json=>json.map(renderArt))   
}

//get to modal-content erase it- and redo it for specific card 
function renderModal(currCard){
     let display=displayModal.querySelector('.modal-content')
     display.innerHTML=""
     display.innerHTML+=currCard.modalRender()
     displayModal.querySelector('.like-btn').addEventListener('click',(e)=>{
          addLikes(e, currCard)
     })
     displayModal.querySelector('.modal-artist').addEventListener('click',(e)=>{
          filterBy(currCard.artistName, 'artist')
     })
     displayModal.querySelector('.modal-set').addEventListener('click',(e)=>{
          filterBy(currCard.setName, 'card_set')
     })
     $('#displayModal').modal('show'); 
}

//using a card class object
function addLikes(e, card){
     let likes=card.likes+1
     let config={
       method: 'PATCH',
       headers: {
         "Content-Type": "application/json",
         "Accept": "application/json"
       },
       body: JSON.stringify({
           "name": card.name,
           "artist_id": card.artistID,
           "art": card.art,
           "flavor_text": card.flavorText,
           "type_line": card.type,
           "card_set_id": card.setID,
           "artist_name": card.artistName,
           "set_name": card.setName,
           "likes": likes
       })
     }
     fetch(base_url+'cards'+'/'+card.id, config)
     .then(e.target.innerText=`Likes (${likes})`)
}
