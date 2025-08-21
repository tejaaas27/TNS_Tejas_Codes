 
    // Updated playlist with local audio files
    // Replace these paths with your actual song files
    const playlist = [
      {
        title: "Kabhi Jo Badal Barse",
        artist: "Arijit Singh",
        src: "assets/music/Kabhi Jo Badal Barse.mp3",
        albumArt: "assets/icons/music.svg"
      },
      {
        title: "Channa Mereya",
        artist: "Arijit Singh",
        src: "assets/music/ChannaMereya.mp3",
        albumArt: "assets/icons/music.svg"
      },
    ];

    let currentSong = 0;
    let recentlyPlayed = JSON.parse(localStorage.getItem('recentlyPlayed') || '[]');
    let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    let isPlaying = false;

    const audio = document.getElementById('audio-player');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const playIcon = playPauseBtn.querySelector('.play-icon');
    const pauseIcon = playPauseBtn.querySelector('.pause-icon');
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const seekBar = document.getElementById('seek-bar');
    const volumeBar = document.getElementById('volume-bar');
    const songTitle = document.getElementById('song-title');
    const songArtist = document.getElementById('song-artist');
    const albumArt = document.getElementById('album-art');
    const albumArtContainer = document.getElementById('album-art-container');
    const defaultMusicLogo = document.getElementById('default-music-logo');
    const currentTimeEl = document.getElementById('current-time');
    const totalDurationEl = document.getElementById('total-duration');
    const playlistEl = document.getElementById('playlist');
    const favoritesEl = document.getElementById('favorites-list');
    const recentEl = document.getElementById('recent-list');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');

    // Debounce function for search input
    function debounce(func, delay) {
      let timeout;
      return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
      };
    }

    function updatePlayPauseIcon() {
      if (isPlaying) {
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';
      } else {
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
      }
    }

    function showAlbumArt(src) {
      albumArt.src = src;
      albumArt.style.display = 'block';
      defaultMusicLogo.style.display = 'none';
    }

    function showDefaultLogo() {
      albumArt.style.display = 'none';
      defaultMusicLogo.style.display = 'block';
    }

    function renderPlaylist(list = playlist) {
      playlistEl.innerHTML = '';
      list.forEach((song, i) => {
        const li = document.createElement('li');
        li.innerHTML = `<img src="${song.albumArt}" alt="" style="width:32px;height:32px;border-radius:6px;" onerror="this.src='assets/images/default-album.jpg'">${song.title} - ${song.artist}`;
        li.onclick = () => { 
          currentSong = playlist.indexOf(song); 
          loadSong(currentSong); 
          updatePlaylistHighlight();
        };
        if (playlist.indexOf(song) === currentSong) {
          li.classList.add('active');
        }
        playlistEl.appendChild(li);
      });
    }

    function updatePlaylistHighlight() {
      const items = playlistEl.querySelectorAll('li');
      items.forEach((item, index) => {
        item.classList.toggle('active', index === currentSong);
      });
    }

    function renderFavorites() {
      favoritesEl.innerHTML = '';
      if (favorites.length === 0) {
        favoritesEl.innerHTML = '<li style="opacity:0.6;">No favorites yet</li>';
        return;
      }
      favorites.forEach(idx => {
        const song = playlist[idx];
        if (song) {
          const li = document.createElement('li');
          li.textContent = `${song.title} - ${song.artist}`;
          li.onclick = () => { 
            currentSong = idx; 
            loadSong(currentSong); 
            updatePlaylistHighlight();
          };
          favoritesEl.appendChild(li);
        }
      });
    }

    function renderRecentlyPlayed() {
      recentEl.innerHTML = '';
      if (recentlyPlayed.length === 0) {
        recentEl.innerHTML = '<li style="opacity:0.6;">No recent plays</li>';
        return;
      }
      recentlyPlayed.slice(-10).reverse().forEach(idx => {
        const song = playlist[idx];
        if (song) {
          const li = document.createElement('li');
          li.textContent = `${song.title} - ${song.artist}`;
          li.onclick = () => { 
            currentSong = idx; 
            loadSong(currentSong); 
            updatePlaylistHighlight();
          };
          recentEl.appendChild(li);
        }
      });
    }

    function loadSong(index) {
      const song = playlist[index];
      if (!song) return;
      
      // Load the actual audio file
      audio.src = song.src;
      songTitle.textContent = song.title;
      songArtist.textContent = song.artist;
      
      // Show album art or default logo
      if (song.albumArt && song.albumArt !== 'assets/images/default-album.jpg') {
        showAlbumArt(song.albumArt);
      } else {
        showDefaultLogo();
      }
      
      updateFavoriteIcon();
      addToRecentlyPlayed(index);
    }

    function playSong() {
      const song = playlist[currentSong];
      if (!song || !song.src) {
        alert('No audio file found for this song!');
        return;
      }

      audio.play().then(() => {
        isPlaying = true;
        updatePlayPauseIcon();
      }).catch(error => {
        console.log("Playback failed:", error);
        alert('Could not play this song. Please check if the file exists.');
      });
    }

    function pauseSong() {
      audio.pause();
      isPlaying = false;
      updatePlayPauseIcon();
    }

    playPauseBtn.onclick = () => {
      if (isPlaying) {
        pauseSong();
      } else {
        playSong();
      }
    };

    nextBtn.onclick = () => {
      currentSong = (currentSong + 1) % playlist.length;
      loadSong(currentSong);
      updatePlaylistHighlight();
      if (isPlaying) playSong();
    };

    prevBtn.onclick = () => {
      currentSong = (currentSong - 1 + playlist.length) % playlist.length;
      loadSong(currentSong);
      updatePlaylistHighlight();
      if (isPlaying) playSong();
    };

    audio.ontimeupdate = () => {
      if (audio.duration) {
        seekBar.value = audio.currentTime / audio.duration;
        currentTimeEl.textContent = formatTime(audio.currentTime);
      }
    };

    audio.onloadedmetadata = () => {
      seekBar.value = 0;
      totalDurationEl.textContent = formatTime(audio.duration);
    };

    audio.onerror = () => {
      alert('Error loading audio file. Please check if the file exists and is in a supported format.');
    };

    seekBar.oninput = () => {
      if (audio.duration) {
        audio.currentTime = seekBar.value * audio.duration;
      }
    };

    volumeBar.oninput = () => {
      audio.volume = volumeBar.value;
    };

    audio.onended = () => {
      nextBtn.onclick();
    };

    function formatTime(sec) {
      if (isNaN(sec)) return "0:00";
      const m = Math.floor(sec / 60);
      const s = Math.floor(sec % 60).toString().padStart(2, '0');
      return `${m}:${s}`;
    }

    // Favorites - click on album art or default logo
    albumArtContainer.onclick = () => {
      toggleFavorite(currentSong);
      updateFavoriteIcon();
      renderFavorites();
    };

    function toggleFavorite(idx) {
      if (favorites.includes(idx)) {
        favorites = favorites.filter(i => i !== idx);
      } else {
        favorites.push(idx);
      }
      localStorage.setItem('favorites', JSON.stringify(favorites));
    }

    function updateFavoriteIcon() {
      const glowEffect = favorites.includes(currentSong)
        ? '0 0 16px 4px #ff7300'
        : '0 4px 8px rgba(255, 115, 0, 0.15)';
      
      if (albumArt.style.display !== 'none') {
        albumArt.style.boxShadow = glowEffect;
      } else {
        defaultMusicLogo.style.boxShadow = glowEffect;
      }
    }

    // Recently Played
    function addToRecentlyPlayed(idx) {
      recentlyPlayed = recentlyPlayed.filter(i => i !== idx);
      recentlyPlayed.push(idx);
      if (recentlyPlayed.length > 20) recentlyPlayed.shift();
      localStorage.setItem('recentlyPlayed', JSON.stringify(recentlyPlayed));
      renderRecentlyPlayed();
    }

    // Search
    searchInput.oninput = debounce(() => {
      const q = searchInput.value.toLowerCase();
      const filteredPlaylist = playlist.filter(song =>
        song.title.toLowerCase().includes(q) ||
        song.artist.toLowerCase().includes(q)
      );
      renderPlaylist(filteredPlaylist);
    }, 300);

    searchBtn.onclick = () => {
      searchInput.focus();
    };

    // Initial load
    renderPlaylist();
    loadSong(currentSong);
    renderFavorites();
    renderRecentlyPlayed();
    audio.volume = volumeBar.value;
    updatePlaylistHighlight();
    updatePlayPauseIcon();

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT') return;
      
      switch(e.code) {
        case 'Space':
          e.preventDefault();
          playPauseBtn.onclick();
          break;
        case 'ArrowRight':
          nextBtn.onclick();
          break;
        case 'ArrowLeft':
          prevBtn.onclick();
          break;
      }
    });