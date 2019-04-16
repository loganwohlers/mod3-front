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

//append event listeners to all navbar colors
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

function clearImageBoard(){
     while(imageBoard.firstChild){
          imageBoard.firstChild.remove()
     }
}

function clearUL(){
     while(bigUL.firstChild){
          bigUL.firstChild.remove()
     }
}

function clearAll(){
     clearImageBoard()
     clearUL()
     $('#displayModal').modal('hide');
}

function renderArt(card){
     let fig=document.createElement('figure')
     fig.classList.add('figCard')
     let img=document.createElement("img");
     img.src=`${card.art}`
     img.addEventListener("click", () => {
         renderModal(card)
     });

     let caption=document.createElement('figcaption')
     caption.classList.add('caption')
     caption.textContent=`${card.name} by ${card.artist.name}`
         
     fig.append(img, caption)
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
     // $('#displayModal').modal('hide');
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
     // $('#displayModal').modal('hide');
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
function renderModal(card){
     let display=displayModal.querySelector('.modal-content')
     let colors=card.colors[0].name
     if(card.colors.length>1){
          for(let i=1; i<card.colors.length;i++){
               colors += ` / ${card.colors[i].name} `
          }
     }
     let flavor=""
     if(card.flavor_text){
          flavor=card.flavor_text
     }
     display.innerHTML=""
     display.innerHTML+=`
     <div class="modal-header d-block">
          <h4class="modal-title text-center" id="exampleModalLabel">${card.name} by ${card.artist.name}</h4>
               <button type="button" class="close btn btn-info" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
               </button>
     </div>
     <div class="modal-body">
          <img class='modal-img' src=${card.art}>
          <br>
          <br>
          <button type="button" class="btn btn-outline-primary like-btn" >Like (${card.likes})</button>
          <br>
          <br>
          <div class="modal-artist clickable"> 
               <h4>Artist: ${card.artist.name} </h4>
          </div>
          <p> <h6>Colors: ${colors} </h6></p>
          <p>${flavor}</p>
          <div class="modal-set clickable"> 
               Set: ${card.card_set.name} 
          </div>
     </div>
          
     </div>
     <div class="modal-footer d-block">
          <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">Close</button>
     </div>
     `
     displayModal.querySelector('.like-btn').addEventListener('click',(e)=>{
          addLikes(e, card)
     })
     displayModal.querySelector('.modal-artist').addEventListener('click',(e)=>{
          filterByArtist(card.artist.name)
     })
     displayModal.querySelector('.modal-set').addEventListener('click',(e)=>{
          filterBySet(card.card_set.name)
     })
     $('#displayModal').modal('show'); 
}

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
           "artist_id": card.artist_id,
           "art": card.art,
           "flavor_text": card.flavor_text,
           "type_line": card.type_line,
           "card_set_id": card.set_id,
           "artist_name": card.artist_name,
           "set_name": card.set_name,
           "likes": likes
       })
     }
     fetch(cards_url+'/'+card.id, config)
     .then(e.target.innerText=`Likes (${likes})`)
}
