const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const cd = $('.cd');
const playBtn = $('.btn-toggle-play');
const player = $('.player');
const progress = $('#progress')

const app = {
    isPlaying: false,
    currentIndex: 0,
    songs: [
        {
            name: 'Limo',
            singer: 'Thắng',
            path: './music/Limo.mp3',
            image: './pic/truoc_khi_em_ton_tai.jpg'
        },
        {
            name: 'Mất thời gian',
            singer: 'Thắng',
            path: './music/Mat thoi gian.mp3',
            image: './pic/truoc_khi_em_ton_tai.jpg'
        },
        {
            name: 'Trước khi em tồn tại',
            singer: 'Thắng',
            path: './music/Truoc Khi Em Ton Tai.mp3',
            image: './pic/truoc_khi_em_ton_tai.jpg'
        },
        {
            name: 'Limo',
            singer: 'Thắng',
            path: './music/Limo.mp3',
            image: './pic/truoc_khi_em_ton_tai.jpg'
        },

        {
            name: '2h',
            singer: 'MCK',
            path: './music/2h.mp3',
            image: './pic/2h.jpg"'
        }
    ],
    //method
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex]
            }
        })
    },
    render: function () {
        const htmls = this.songs.map(song => {
            return `
            <div class="song">
            <div class="thumb" style="background-image: url('${song.image}')">
            </div>
            <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
            </div>
            <div class="option">
                <i class="fas fa-ellipsis-h"></i>
            </div>
        </div>
            `
        })
        $('.playlist').innerHTML = htmls.join('');
    },

    handlEvents: function () {
        const _this = this;
        const cdWidth = cd.offsetWidth;
        //Xử lý phóng ta thu nhỏ cd
        document.onscroll = function () {
            const scrol = window.scrollY;
            const newCdWidth = cdWidth - scrol
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
        }
        //Xử lí khi click nút play
        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        }
        //Khi song được playing
        audio.onplay = function () {
            _this.isPlaying = true;
            player.classList.add('playing')
        }
        //Khi song tắt playing
        audio.onpause = function () {
            _this.isPlaying = false;
            player.classList.remove('playing')
        }
        //Khi thanh tiến độ progress thay đổi  
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const currentPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = currentPercent;
            }
        }
        //Xử lí khi tua song
        progress.onchange = function (e) {
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime
        }

    },

    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },

    //start
    start: function () {

        //Định nghĩa các thuộc tính cho obj
        this.defineProperties();

        //Lắng nghe các sự kiện
        this.handlEvents();

        //Tải bài đầu tiên
        this.loadCurrentSong()

        //render playlist
        this.render();
    }
}

app.start();