document.querySelector('.scroll-top-btn')?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

const audioBtn = document.querySelector('.audio-toggle-btn');
const videoEl = document.querySelector('#one video');
const playPauseBtn = document.querySelector('.play-pause-btn');
const seekBar = document.querySelector('.video-seek-bar');

if (audioBtn && videoEl) {
    audioBtn.addEventListener('click', () => {
        videoEl.muted = !videoEl.muted;
        audioBtn.classList.toggle('muted', videoEl.muted);
    });
}

if (videoEl && playPauseBtn && seekBar) {
    videoEl.addEventListener('play', () => playPauseBtn.classList.remove('paused'));
    videoEl.addEventListener('pause', () => playPauseBtn.classList.add('paused'));

    playPauseBtn.addEventListener('click', () => {
        if (videoEl.paused) {
            videoEl.play();
        } else {
            videoEl.pause();
        }
    });

    videoEl.addEventListener('timeupdate', () => {
        if (videoEl.duration && !isNaN(videoEl.duration)) {
            seekBar.value = (videoEl.currentTime / videoEl.duration) * 100;
        }
    });

    const seekTo = () => {
        if (videoEl.duration && !isNaN(videoEl.duration)) {
            videoEl.currentTime = (seekBar.value / 100) * videoEl.duration;
        }
    };
    seekBar.addEventListener('input', seekTo);
    seekBar.addEventListener('change', seekTo);
}

if (typeof initProjectNav === 'function') initProjectNav();
