// frontend/src/components/MusicPlayer.jsx
import React, { useState, useEffect, useRef } from 'react';
import './MusicPlayer.css';

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3); // 30% volumen por defecto
  const [currentSong, setCurrentSong] = useState(0);
  const audioRef = useRef(null);

  // Lista de canciones (relativas desde public/music/)
  const songs = [
    '/music/All The Way Up.mp3',
    '/music/Queens Of The Stone Age - In My Head.mp3',
    '/music/Daft Punk - Get Lucky (Official Audio) ft. Pharrell Williams, Nile Rodgers.mp3',
    '/music/Modjo - Lady (Hear Me Tonight) (Official Video).mp3'
  ];

  // Al cargar, seleccionar canción aleatoria
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * songs.length);
    setCurrentSong(randomIndex);
    
    // Configurar audio
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.loop = false; // No loop, para que pase a siguiente
    }
  }, []);

  // Cuando termina una canción, pasar a la siguiente
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      const nextIndex = (currentSong + 1) % songs.length;
      setCurrentSong(nextIndex);
      if (isPlaying) {
        setTimeout(() => audio.play(), 500);
      }
    };

    audio.addEventListener('ended', handleEnded);
    return () => audio.removeEventListener('ended', handleEnded);
  }, [currentSong, isPlaying]);

  // Controlar play/pause
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => {
          console.log("Autoplay prevented:", e);
          // Si autoplay está bloqueado, pedir interacción
          alert("Haz click en cualquier parte de la página para activar la música");
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Cambiar canción
  const changeSong = (index) => {
    setCurrentSong(index);
    if (isPlaying) {
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.play();
        }
      }, 100);
    }
  };

  // Cambiar volumen
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  // Canción aleatoria
  const playRandomSong = () => {
    const availableSongs = songs.filter((_, index) => index !== currentSong);
    const randomIndex = Math.floor(Math.random() * availableSongs.length);
    changeSong(randomIndex);
  };

  return (
    <div className="music-player">
      {/* Audio element oculto */}
      <audio 
        ref={audioRef}
        src={songs[currentSong]}
        preload="auto"
      />
      
      {/* Botón principal flotante */}
      <button 
        className={`music-toggle ${isPlaying ? 'playing' : ''}`}
        onClick={togglePlay}
        title={isPlaying ? "Pausar música" : "Reproducir música"}
      >
        {isPlaying ? '⏸️' : '🎵'}
      </button>

      {/* Panel expandible (opcional) */}
      <div className="music-panel">
        <div className="song-info">
          Canción {currentSong + 1} de {songs.length}
        </div>
        
        <div className="volume-control">
          <span>🔊</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={handleVolumeChange}
            className="volume-slider"
          />
          <span className="volume-percent">{Math.round(volume * 100)}%</span>
        </div>

        <div className="song-buttons">
          <button 
            className="song-btn"
            onClick={() => changeSong((currentSong - 1 + songs.length) % songs.length)}
            title="Canción anterior"
          >
            ⏮
          </button>
          <button 
            className="song-btn"
            onClick={playRandomSong}
            title="Canción aleatoria"
          >
            🔀
          </button>
          <button 
            className="song-btn"
            onClick={() => changeSong((currentSong + 1) % songs.length)}
            title="Siguiente canción"
          >
            ⏭
          </button>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
