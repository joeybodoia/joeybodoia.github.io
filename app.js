// Creating a class for the two fighters

class UserFighter {
    constructor(name, health=100, power=75, accuracy){
        this.name = name
        this.health = health
        this.power = power
        this.accuracy =accuracy
    }
    attack() {
        if (Math.random()*100 <= this.accuracy){
            return 'attack successful'
        } else {
            return 'attack missed'
        }
    }
    checkStats(){
        alert(`Name: ${this.name},Health:${this.health},Power:${this.power},Accuracy:${this.accuracy}`)
    }
    forfeit(){
        alert(`${this.name} has forfeited`)
    }

}


// AJAX
// generate character options:
$('#generate').on('click', (event) => {
    $('#drag').css({'display':'block'})
    $('.characterPics').empty()
    for (let i=1;i<9;i++) {
        event.preventDefault()
        randomID = Math.floor(Math.random()*400)
    
        $.ajax({
            url: `https://www.superheroapi.com/api.php/2668094310098995/${randomID}` 
        }).then(
            (data)=>{   
                // stretch goal:
                //  create is_hero_valid function that checks if powerstats and image are valid and returns true or false, if false skip over and try a different randomID
                $div = $("<div>")
          .html(
            `<img src="${data.image.url}" onerror=this.src="https://i.imgur.com/9E8YTrtb.jpg" id ='image' width="100px" height='150px'>`
          ).css({ 'border': "5px solid red", height: "150px", 'border-radius':'2px'})
          .addClass("drag")
          .attr("id", `${data.id}`)
          .draggable({helper: 'clone'});
                
                $div.append($('<div>').text(`${data.name}`).attr('id',`${data.id}`).css({'font-family': 'Bangers','font-size':'2vw', 'margin-top':'4px','text-align':'center','text-shadow': '1px 1px 1px white'}))
                $('.characterPics').append($div)
                // $(`#pic${i}`).html(`<img src="${data.image.url}" width="100px" height='150px'>`).css({"border":'2px solid red','height':'150px'})

                $(`${data.id}`).draggable()

            },
            ()=>{
                console.log('bad request')
            }
        )
    }
})

// function that handles the drop event:
$( function() {
    $('.players' ).droppable( 
        { 
            accept:".drag", 
            drop :function(event,ui) 
        { 
            // alert("I am dropped");
            $('.player').css({'display':'hidden'})
            $(this).append($(ui.draggable).css({width:'70%',height:'55%','margin-top':'-30%','max-width':'200px','align-self':'center','border':'4px solid rgb(255,235,0)'}))
            
        } 
        } ); 
        } );

// game logic:
const startGame = () => {
    $modal = $('#modal')
    $modal.css('display', 'block' )
    $('#close').on('click',()=>{
        $modal.css('display','none')
    })
    $('.modalImage1').prepend($('#player1').children().eq(1).css({'border':'3px solid black','margin-top':'5px'}))
    $('.modalImage2').prepend($('#player2').children().eq(1).css({'border':'3px solid black','margin-top':'5px'}))
    // console.log($('#player1').children().eq(1).attr('id'))
    // alert('Match starting')
    console.log($('.modalImage1').children().eq(0).attr('id'))
    console.log($('#p1').find($('.modalImage1').children().attr('id')))
    console.log($('.modalImage2').children().eq(0).attr('id'))
    const player1ID = $('.modalImage1').children().eq(0).attr('id')
    const player2ID = $('.modalImage2').children().eq(0).attr('id')
    const ajax1 = $.ajax({ 
        dataType: "json",
        url: `https://www.superheroapi.com/api.php/2668094310098995/${player1ID}`,
        async: true,
        success: function(result) {}                     
      });
      
      
      const ajax2 = $.ajax({ 
        dataType: "json",
        url:`https://www.superheroapi.com/api.php/2668094310098995/${player2ID}`,
        async: true,
        success: function(result) {}  
      });
      
      $.when( ajax1 , ajax2  ).done(function( player1, player2 ) {
        //  console.log(a1[0].name)
        //  console.log(a2[0].powerstats)
        
        if (player1[0].powerstats.power == 'null') {
            player1[0].powerstats.power = 69
        }
        if (player1[0].powerstats.combat == 'null') {
            player1[0].powerstats.combat = 69
        }
        if (player2[0].powerstats.power == 'null') {
            player2[0].powerstats.power = 69
        }
        if (player2[0].powerstats.combat == 'null') {
            player2[0].powerstats.combat = 69
        }
        
         const fighter1 = new UserFighter(`${player1[0].name}`,player1[0].health, player1[0].powerstats.power, player1[0].powerstats.combat)
        //  const fighter1 = new UserFighter(`${player1[0].name}`,player1[0].health, player1[0].powerstats.power, 100)
         console.log(fighter1)
         const fighter2 = new UserFighter(`${player2[0].name}`,player2[0].health, player2[0].powerstats.power, player2[0].powerstats.combat)
        //  const fighter2 = new UserFighter(`${player2[0].name}`,player2[0].health, player2[0].powerstats.power, 0)
        
         console.log(fighter2)
        //  alert(`Welcome to Superhero Showdown! Today's fight is between ${player1[0].name} and ${player2[0].name}`)
        //  console.log(fighter1.accuracy)
        //  console.log(fighter1.attack())
         const f1Attack = () => {
            fighter1.attack()
            console.log(fighter1.attack())
            //  alert('attack has been fired!')
             if (fighter1.attack() == 'attack successful') {
                fighter2.health -= fighter1.power/2
                $('.healthBar2').css({'width':`${fighter2.health}%`})
                // console.log(fighter2.health)
                // alert(`${fighter2.name} hit! ${fighter1.power/5} damage done!`)
                if (fighter2.health <= 0){
                    // alert(`${fighter2.name} has been defeated!`)
                    // alert('player defeated!')
                    $('#modal5').css('display','block')
                    $('#playerDefeated').html(`${fighter2.name} Defeated!`).css({'font-family': 'Bangers','font-size':'4vw','text-shadow': '1px 1px 1px rgb(255,235,0)'})
                    $('#winner').html(`${fighter1.name} wins!`).css({'font-family': 'Bangers','font-size':'4vw','text-shadow': '1px 1px 1px rgb(255,235,0)'})
                    $('#close5').on('click',()=>{
                        $('#modal5').css('display','none')
                    })
                    } else {
                        // alert(`${fighter2.name} has ${fighter2.health} health left`)
                    }
            }else {
                // alert('Attack missed!')
                $('#modal4').css('display','block')
                $('#attackMissed').html(`Attack Missed!`).css({'font-family': 'Bangers','font-size':'4vw','text-shadow': '1px 1px 1px rgb(255,235,0)'})
                $('#close4').on('click',()=>{
                    $('#modal4').css('display','none')
                })

            }
         }
         $('#attack1').on('click', f1Attack)
        
         const f2Attack = () => {
             fighter2.attack()
            //  alert('attack has been fired!')
             if (fighter2.attack() == 'attack successful') {
                fighter1.health -= fighter2.power/2
                $('.healthBar1').css({'width':`${fighter1.health}%`})
                // console.log(fighter1.health)
                // alert(`${fighter1.name} hit! ${fighter2.power/5} damage done!`)
                if (fighter1.health <= 0){
                    // alert(`${fighter1.name} has been defeated!`)
                    // alert(`${fighter2.name} is the winner`)
                    // alert('player defeated!')
                    $('#modal5').css('display','block')
                    $('#modal-textbox5').css({'background-color':'rgb(255,235,0)'} )
                    $('.modal-buttons5').css({'background-color':'rgb(247, 10, 10)'})
                    $('#playerDefeated').html(`${fighter1.name} Defeated!`).css({'font-family': 'Bangers','font-size':'4vw','text-shadow': '1px 1px 1px rgb(247, 10, 10)'})
                    $('#winner').html(`${fighter2.name} wins!`).css({'font-family': 'Bangers','font-size':'4vw','text-shadow': '1px 1px 1px rgb(247, 10, 10)'})
                    $('#close5').on('click',()=>{
                        $('#modal5').css('display','none')
                    })
                    } else {
                        // alert(`${fighter1.name} has ${fighter1.health} health left`)
                    }
            }else {
                // alert('Attack missed!')
                $('#modal4').css('display','block')
                $('#modal-textbox4').css({'background-color':'rgb(255,235,0)'} )
                $('.modal-buttons4').css({'background-color':'rgb(247, 10, 10)'})
                $('#attackMissed').html(`Attack Missed!`).css({'font-family': 'Bangers','font-size':'4vw','text-shadow': '1px 1px 1px rgb(247, 10, 10)'})
                $('#close4').on('click',()=>{
                    $('#modal4').css('display','none')
                })
            }
         }
         $('#attack2').on('click', f2Attack)

         const checkStats1 = () => {
            const $modal2 = $('#modal2')
            $modal2.css('display', 'block' )
            $('#stats1').html(`Stats: <br/><br/><br/>Name: ${fighter1.name} <br/> <br/> Health: ${fighter1.health} <br/> <br/> Power: ${fighter1.power} <br/><br/> Accuracy: ${fighter1.accuracy}`).css({'font-family': 'Bangers','font-size':'2vw','text-shadow': '1px 1px 1px rgb(255,235,0)'})

         }

         const checkStats2 = () => {
            const $modal2 = $('#modal2')
            $modal2.css('display', 'block' )
            $('#modal-textbox2').css({'background-color':'rgb(255,235,0)'} )
            $('.modal-buttons2').css({'background-color':'rgb(247, 10, 10)'})
            $('#stats1').html(`Stats: <br/><br/><br/>Name: ${fighter2.name} <br/> <br/> Health: ${fighter2.health} <br/> <br/> Power: ${fighter2.power} <br/><br/> Accuracy: ${fighter2.accuracy}`).css({'font-family': 'Bangers','font-size':'2vw','text-shadow': '1px 1px 1px rgb(247, 10, 10)'})

         }
         $('#checkStats1').on('click',checkStats1)
         $('#checkStats2').on('click',checkStats2)
         $('#close2').on('click',()=>{
             $('#modal2').css('display','none')
         })

         const forfeit1 = () => {
            const $modal3 = $('#modal3')
            $modal3.css('display', 'block' )
            $('#forfeit').html(`Game Over!`).css({'font-family': 'Bangers','font-size':'4vw','text-shadow': '1px 1px 1px rgb(255,235,0)'})
            $('#line2').html(`${fighter2.name} wins!`).css({'font-family': 'Bangers','font-size':'4vw','text-shadow': '1px 1px 1px rgb(255,235,0)'})
            
            

         }

         const forfeit2 = () => {
            const $modal3 = $('#modal3')
            $modal3.css('display', 'block' )
            $('#modal-textbox3').css({'background-color':'rgb(255,235,0)'} )
            $('.modal-buttons3').css({'background-color':'rgb(247, 10, 10)'})
            $('#forfeit').html(`Game Over!`).css({'font-family': 'Bangers','font-size':'4vw','text-shadow': '1px 1px 1px rgb(247, 10, 10)'})
            $('#line2').html(`${fighter1.name} wins!`).css({'font-family': 'Bangers','font-size':'4vw','text-shadow': '1px 1px 1px rgb(247, 10, 10)'})
           

         }
         $('#forfeit1').on('click',forfeit1)
         $('#forfeit2').on('click',forfeit2)
         $('#close3').on('click',()=>{
             $('#modal3').css('display','none')
         })


      })

    }

//run game logic:
$('#start').on('click', startGame)
