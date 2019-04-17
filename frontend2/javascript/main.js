const cards_url='http://localhost:3000/api/v1/cards'
const color_filter_url='http://localhost:3000/api/v1/colorfilter'
const artist_filter_url='http://localhost:3000/api/v1/artistfilter'
const set_filter_url='http://localhost:3000/api/v1/setfilter'
const artist_url='http://localhost:3000/api/v1/artists'
const set_url='http://localhost:3000/api/v1/card_sets'

const imageBoard=document.getElementById('images')
const bigUL=document.querySelector('.list-group')
const displayModal=document.getElementById('displayModal')

const title=document.getElementById("title")
const mainNav=document.querySelector(".navbar-nav")

//append event listener to title
title.addEventListener('click', (e)=>{
     home()
})

home()

//append event listeners to all navbar colors (and lands)
for (let i=0;i<7;i++){
     let color=mainNav.children[i]
     color.addEventListener('click', (e)=>{
          filterByColor(color.id)
     })
}
//artists in nav bar
const artists=mainNav.children[7]
artists.addEventListener('click', (e)=>{
     getArtists()

})
//sets in nav bar
const sets=mainNav.children[8]
sets.addEventListener('click', (e)=>{
     getSets()
})

function home(){
     clearAll()
     fetch(cards_url)
     .then(response=>response.json())
     .then(json=>{
          json.map(renderArt)
     })
}

function clearParent(parent){
     while(parent.firstChild){
          parent.firstChild.remove()
     }
}

function clearAll(){
     clearParent(imageBoard)
     clearParent(bigUL)
     $('#displayModal').modal('hide');
}

function renderArt(card){
     let currCard = new MTGCard(card)
     let fig=currCard.figRender()
     fig.querySelector('.forModal').addEventListener('click', ()=>{
          renderModal(currCard)   
     })
     imageBoard.append(fig)
}

//send color to colors controller and then render response
function filterByColor(abbrev){
     clearAll();
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
     fetch(color_filter_url, config)
     .then(response=>response.json())
     .then(json=>json.map(renderArt))
}

function getArtists(){
     clearAll()
     fetch(artist_url)
     .then(response=>response.json())
     .then(json=>{
          json.map(renderArtists)
     })
}

function renderArtists(artist){
     let li=document.createElement('li')
     li.classList.add('list-group-item', 'list-group-item-dark','clickable')
     li.textContent=`${artist.name}`    
     li.addEventListener('click', (e)=>{
          filterByArtist(artist.name)
     })
     bigUL.append(li)
}

function filterByArtist(name){
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
     fetch(artist_filter_url, config)
     .then(response=>response.json())
     .then(json=>json.map(renderArt))
     
}

function getSets(){
     clearAll()
     fetch(set_url)
     .then(response=>response.json())
     .then(json=>json.map(renderSets))        
}

function renderSets(set){
     let li=document.createElement('li')
     li.classList.add('list-group-item', 'list-group-item-dark', 'clickable')
     li.textContent=`${set.name}`    
     li.addEventListener('click', (e)=>{
          filterBySet(set.name)
     })
     bigUL.append(li)
}

function filterBySet(name){
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
     fetch(set_filter_url, config)
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
          filterByArtist(currCard.artistName)
     })
     displayModal.querySelector('.modal-set').addEventListener('click',(e)=>{
          filterBySet(currCard.setName)
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
     fetch(cards_url+'/'+card.id, config)
     .then(e.target.innerText=`Likes (${likes})`)
}
