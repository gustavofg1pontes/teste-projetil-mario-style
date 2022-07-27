var canvas = document.querySelector("canvas")
var c = canvas.getContext("2d")

canvas.width = 1366
canvas.height = 600

c.font = "25px Impact"


let gravidade = 0.6
let gameframe = 0


let teclas = {
    a:{
        pressed : false
    },
    d:{
        pressed : false
    },
    w:{
        pressed : false
    },
}


let prog = 0

//jogador
class jogador{
    constructor({position, veloci}){
        this.position = position
        this.veloci = veloci
        this.width = 70
        this.height = 140
        this.atira = false

        this.estado = "parado"
        this.frame = 1
        this.maxframe = 2
        this.imagem = new Image()
        this.imagem.src = "./img/pers" + this.estado + this.frame + ".png"
    }

    draw(){
        c.drawImage(this.imagem, this.position.x, this.position.y, this.width, this.height)
    }

    gravi(){
        this.draw()

        this.position.y += this.veloci.y
        this.position.x += this.veloci.x

        this.veloci.y += gravidade
    }

    upd(){
        this.gravi()

//controle de tela e movimentacao
        if(teclas.a.pressed && this.position.x > 120){
            this.veloci.x = -7
        }
        else if(teclas.d.pressed && this.position.x < 400){
            this.veloci.x = 7
        }
        else{
            this.veloci.x = 0

            if(teclas.d.pressed){
                prog += 5
                plataformas.forEach(plat => {
                    plat.position.x -= 7
                })
                itens.forEach(item =>{
                    item.position.x -= 7
                })
            }
            else if(teclas.a.pressed && prog != 0){
                prog -= 5
                plataformas.forEach(plat => {
                    plat.position.x += 7
                })  
                itens.forEach(item =>{
                    item.position.x +=7
                })
            }
        }

        //pulo único
        if(teclas.w.pressed && this.veloci.y == gravidade){
            this.veloci.y = -15
        }

        
        //perde tiro/morte
        if(this.position.y + this.height > canvas.height && this.atira){
            this.veloci.y = -20
            this.maxframe = 1
            this.frame=1
            this.estado = "morrendo"
            setTimeout(() => {
                this.atira = false
            }, 100);
            setTimeout(() => {
                this.estado = "parado"
                this.maxframe = 2
                this.frame=1
            }, 700);
        }
        else if(this.position.y + this.height > canvas.height && !this.atira){
            morreu()
        }
    

        if(gameframe % 10 == 0){
            this.frame == this.maxframe ? this.frame = 1:this.frame++
            this.imagem.src = "./img/pers" + this.estado + this.frame + ".png"
        }
    }
}

let jog = new jogador({
    position:{
        x: 140,
        y: 300
    },
    veloci:{
        x: 0,
        y: 0
    }
})
//fim do jogador

//item
class coletar{
    constructor({position}){
        this.position = position
        this.width = 40
        this.height = 40
        this.frame = 1
        this.imagem = new Image()
        this.imagem.src = "./img/fogo" + this.frame + ".png"
    }

    draw(){
        c.drawImage(this.imagem, this.position.x, this.position.y, this.width, this.height)
    }

    func(){
        //coleta do tiro
        if(!jog.atira){
        this.draw()

            if(this.position.x + this.width >= jog.position.x && 
                this.position.x <= jog.position.x + jog.width &&
                this.position.y <= jog.position.y + jog.height &&
                this.position.y + this.height >= jog.position.y
                ){
                    jog.atira = true
                }

        }else c.drawImage(this.imagem, 20, 20, this.width, this.height)

        //sprite animacao
        if(gameframe % 10 == 0){
            this.frame == 4 ? this.frame = 1:this.frame++
            this.imagem.src = "./img/fogo" + this.frame + ".png"
        }
    }
}

let itens = [new coletar({position:{x:1160, y:340}})]

//tiro
class tiro{
    constructor({position, veloci}){
        this.position = position
        this.veloci = veloci
        this.width = 40
        this.height = 30
        this.frame = 1
        this.imagem = new Image()
        this.imagem.src = "./img/tiro" + this.frame + ".png"
    }

    draw(){
        c.drawImage(this.imagem, this.position.x, this.position.y, this.width, this.height)
    }

    func(){
        this.draw()

        //mov do tiro
        this.position.x += this.veloci.x

        //sprite
        if(gameframe % 10 == 0){
            this.frame == 2 ? this.frame = 1:this.frame++
            this.imagem.src = "./img/tiro" + this.frame + ".png"
        }
    }
}
//array do tiro
let atirando=[]


//variavel que armazena ultima tecla lateral clicada para a dir do tiro
var ulttecl
//aperta tecla
window.addEventListener("keydown", (event)=>{
    switch(event.key){
        //wasd
        case "d":
            teclas.d.pressed = true
            ulttecl = "d"
            jog.estado = "andandodir"
            jog.maxframe = 4 
            break
        case "a":
            teclas.a.pressed = true
            ulttecl = "a"
            break  
        case "w":
            teclas.w.pressed = true
            break
        
        case " ":
            //se jogador possui tiro, atira
        if(jog.atira){
            atirando.push(
                new tiro({
                    position:{
                        x: ulttecl == "d" ? jog.position.x + jog.width : jog.position.x - 40,
                        y: jog.position.y + 100
                    },
                    veloci:{
                        x: ulttecl == "a" ? -10:10
                    }
                })
            )
        }
            break

        //setas    
        case "ArrowRight":
            teclas.d.pressed = true
            ulttecl = "d"
            jog.frame = 1
            jog.estado = "andandodir"
            jog.maxframe = 4 
            break
        case "ArrowLeft":
            teclas.a.pressed = true
            ulttecl = "a"
            break
        case "ArrowUp":
            teclas.w.pressed = true
            break
    }
})

//solta tecla
window.addEventListener("keyup", (event)=>{
    switch(event.key){
        //wasd
        case "d":
            teclas.d.pressed = false
            jog.frame = 1
            jog.estado = "parado"
            jog.maxframe = 2
            break
        case "a":
            teclas.a.pressed = false
            break 
        case "w":
            teclas.w.pressed = false
            break 
        
        //setas    
        case "ArrowRight":
            teclas.d.pressed = false
            jog.frame = 1
            jog.estado = "parado"
            jog.maxframe = 2
            break
        case "ArrowLeft":
            teclas.a.pressed = false
            break
        case "ArrowUp":
            teclas.w.pressed = false
            break    
    }
})


class plataforma{
    constructor({x, y, width, height}
        ){
        this.position = {
            x,
            y
        }
        this.width = width
        this.height = height
        this.imagemchao = new Image()
        this.imagemchao.src = "./img/chao.png"
    }

    draw(){
        c.drawImage(this.imagemchao, this.position.x, this.position.y, this.width, this.height)
    }

    col(){
        this.draw()

        //colisao das plataformas
        if(this.position.x + this.width >= jog.position.x && 
            this.position.x <= jog.position.x + jog.width &&
            this.position.y >= jog.position.y + jog.height && 
            this.position.y <= jog.position.y + jog.height + jog.veloci.y){
                jog.veloci.y = 0
            }
    }
}



let plataformas = [new plataforma({x: 0, y: canvas.height-50, width: 600, height:50}), 
    new plataforma({x: 900, y: canvas.height-100, width:800, height: 100}),
    new plataforma({x: 950, y: canvas.height-220, width:500, height: 120}),
    new plataforma({x: 1850, y: canvas.height-80, width: 750, height: 80})]



function animate(){
    requestAnimationFrame(animate)
    //info na tela/fundo
    c.fillStyle="black"
    c.fillRect(0, 0, canvas.width, canvas.height)

    plataformas.forEach(plat => {
        plat.col()
    })
    
    atirando.forEach((tiro)=>{
        tiro.func()
    })

    itens.forEach(item =>{
        item.func()
    })
    
    jog.upd()

    if(prog>=2000){
        console.log("vc venceu")
    }
    gameframe++
}

function morreu(){
    plataformas = [new plataforma({x: 0, y: canvas.height-50, width: 600, height:50}), 
        new plataforma({x: 900, y: canvas.height-100, width:800, height: 100}),
        new plataforma({x: 950, y: canvas.height-220, width:500, height: 120}),
        new plataforma({x: 1850, y: canvas.height-80, width: 750, height: 80})]

    itens = [new coletar({position:{x:1160, y:340}})]
    
    atirando=[]
    jog = new jogador({
        position:{
            x: 140,
            y: 300
        },
        veloci:{
            x: 0,
            y: 0
        }
    })
    prog = 0
}

animate()