async function loadData(){

    // De esta manera esperamos a que se resuelvan las peticiones.
    // es una alternativa a usar fetch().then()
    const response = await fetch('/static/library.json');
    const biblioteca = await response.json();

    console.log(biblioteca);

    const template = document.querySelector("template").content;
  
    // Cada track de la biblioteca tendrá su propio reproductor diferente.
    // Los elementos estan asociados entre si con el atributo [data-target]

    biblioteca.forEach( (track,pos)=>{

      let divAudio = template.cloneNode(true);
    
      const audioPlayer = divAudio.querySelector("audio");

      // Cada reproductor tendrá un id diferente
      // synth1, synth2, synth3 ....
      audioPlayer.id="synth"+pos; 
      audioPlayer.src=track.url;

      audioPlayer.addEventListener("playing", (ev)=>{
        const target = ev.currentTarget;
        document.querySelector("div:has(>audio#"+target.id+")").classList.add("playing");
      });

      audioPlayer.addEventListener("pause", (ev)=>{
        const target = ev.currentTarget;
        document.querySelector("div:has(>audio#"+target.id+")").classList.remove("playing");
      });

      divAudio.querySelector("h3").textContent=track.title;

      // [data-target] apunta al audio que esta asociado
      divAudio.querySelector("button.play").dataset.target="#"+audioPlayer.id;
      divAudio.querySelector("button.stop").dataset.target="#"+audioPlayer.id;
      divAudio.querySelector("button.restart").dataset.target="#"+audioPlayer.id;
      divAudio.querySelector("input.volumen").dataset.target="#"+audioPlayer.id;


      // añado los listener a cada boton
      divAudio.querySelector("button.play").addEventListener("click", play);
      divAudio.querySelector("button.stop").addEventListener("click", stop);
      divAudio.querySelector("button.restart").addEventListener("click", restart);

      // tambien el listener para cambiar el volumen
      divAudio.querySelector(".volumen").addEventListener("change", volumen);


      document.querySelector("div.container").appendChild(divAudio);
    })
    
}

function play(ev){
    const boton = ev.currentTarget; // es el boton de play
    const target_audio = boton.dataset.target;
    const audio = document.querySelector(target_audio);
    audio.play()
    .then( ()=>{
      console.log("Empezando...")
    });
}

function stop(ev){
    const boton = ev.currentTarget;
    const target_audio = boton.dataset.target;
    const audio = document.querySelector(target_audio);
    audio.pause();
}
  
function restart(ev){
    const boton = ev.currentTarget;
    const target_audio = boton.dataset.target;
    const audio = document.querySelector(target_audio);
    audio.currentTime=0;
}

function volumen(ev){
    const el = ev.currentTarget;
    const target_audio = el.dataset.target;
    const audio = document.querySelector(target_audio);
    audio.volume = el.value/10;
}


// Inicio de la aplicación
loadData();
