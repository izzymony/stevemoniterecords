
import React , {useEffect, useState,useRef} from "react"

type Props = {
  play: boolean;
}


const BackgroundMusic = ({play}: Props) => {

  const audioRef = useRef<HTMLAudioElement | null>(null)

  const handleVideoPlay = () => {
    if (audioRef.current) {
      audioRef.current.pause()
    }
  }
  useEffect(()=>{
    if(!audioRef.current) return;
    if(play){
      audioRef.current.volume = 0;
      audioRef.current.play()

      let volume = 0
      const fade = setInterval(()=>{
        volume += 0.05;

        if(audioRef.current){
          audioRef.current.volume = volume;
        }
         if (volume >= 0.5) {
          clearInterval(fade);
        }
      }, 200)
    }

  },[play])

  useEffect(()=>{
    const handlePauseSignal = () => audioRef.current?.pause();
    const handlePlaySignal = () => audioRef.current?.play().catch(()=>{});
    window.addEventListener('pauseBackgroundMusic', handlePauseSignal);
    window.addEventListener('playBackgroundMusic', handlePlaySignal);
    return () => {
      window.removeEventListener('pauseBackgroundMusic', handlePauseSignal);
      window.removeEventListener('playBackgroundMusic', handlePlaySignal);
    }

    
  },[])

  
  return (
    <audio ref={audioRef} loop preload="auto">
      <source src="/audio/onlyyou.wav" type="audio/mpeg" />
       <video/>
    </audio>

   
  )
}

export default BackgroundMusic
