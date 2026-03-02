document.querySelector('.scroll-top-btn')?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

const videoEl = document.querySelector('#five video');
const playPauseBtn = document.querySelector('.play-pause-btn');
const seekBar = document.querySelector('.video-seek-bar');

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
