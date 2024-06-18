const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const heading = $("header h2");
const audio = $("#audio");
const cdThumb = $(".cd-thumb");
const cd = $(".cd");
const playBtn = $(".btn-toggle-play");
const player = $(".player");
const progress = $("#progress");
const prevBtn = $(".btn-prev");
const nextBtn = $(".btn-next");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playList = $(".playlist");
const darkModeBtn = $(".darkmode-btn");

const app = {
  isPlaying: false,
  currentIndex: 0,
  isRandom: false,
  isRepeat: false,
  songs: [
    {
      name: "Limo",
      singer: "Thắng",
      path: "./music/Limo.mp3",
      image: "./pic/limo.jpg",
    },
    {
      name: "Mất thời gian",
      singer: "Thắng",
      path: "./music/Mat thoi gian.mp3",
      image: "./pic/mat_thoi_gian.jpg",
    },
    {
      name: "Trước khi em tồn tại",
      singer: "Thắng",
      path: "./music/Truoc Khi Em Ton Tai.mp3",
      image: "./pic/truoc_khi_em_ton_tai.jpg",
    },
    {
      name: "Badtrip",
      singer: "MCK Prod. Phongkhin",
      path: "./music/badtrip.mp3",
      image: "./pic/badtrip.jpg",
    },
    {
      name: "Mở mắt",
      singer: "Lil Wuyn ft. Đen",
      path: "./music/mo_mat.mp3",
      image: "./pic/mo_mat.jpg",
    },
    {
      name: "Không thích",
      singer: "Low G",
      path: "./music/khong_thich.mp3",
      image: "./pic/khong_thich.jpg",
    },
    {
      name: "Sài Gòn ơi",
      singer: "Obito",
      path: "./music/sai_gon_oi.m4a",
      image: "./pic/sai_gon_oi.jpg",
    },
    {
      name: "Chưa phải là yêu",
      singer: "HURRYKNG (feat. REX)",
      path: "./music/chua_phai_la_yeu.m4a",
      image: "./pic/chua_phai_la_yeu.jpg",
    },
    {
      name: "Exit sign",
      singer: "HIEUTHUHAI (feat. marzuz)",
      path: "./music/exit_sign.m4a",
      image: "./pic/exit_sign.jpg",
    },
  ],
  //method
  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },

  render: function () {
    const htmls = this.songs.map((song, index) => {
      return `
            <div class="song ${
              index === this.currentIndex ? "active" : ""
            }" data-index=${index}>
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
            `;
    });
    playList.innerHTML = htmls.join("");
  },

  handlEvents: function () {
    const _this = this;
    const cdWidth = cd.offsetWidth;

    //Xử lý cd quay/dừng
    const cdThumbAnimate = cdThumb.animate(
      [
        {
          transform: "rotate(360deg)",
        },
      ],
      {
        duration: 10000, //10secon
        iterations: Infinity,
      }
    );
    cdThumbAnimate.pause();
    //Xử lý phóng ta thu nhỏ cd
    document.onscroll = function () {
      const scroll = window.scrollY;
      const newCdWidth = cdWidth - scroll;
      cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
      cd.style.opacity = newCdWidth / cdWidth;
    };
    //Xử lí khi click nút play
    playBtn.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };
    //Khi song được playing
    audio.onplay = function () {
      _this.isPlaying = true;
      player.classList.add("playing");
      cdThumbAnimate.play();
    };
    //Khi song tắt playing
    audio.onpause = function () {
      cdThumbAnimate.pause();
      _this.isPlaying = false;
      player.classList.remove("playing");
    };
    //Khi thanh tiến độ progress thay đổi
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const currentPercent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        progress.value = currentPercent;
      }
    };
    //Xử lí khi tua song
    progress.onchange = function (e) {
      const seekTime = (audio.duration / 100) * e.target.value;
      audio.currentTime = seekTime;
    };

    //Khi next song
    nextBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.nextSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    };
    //Khi quay trở lại song
    prevBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.prevSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    };
    //Random song
    randomBtn.onclick = function () {
      _this.isRandom = !_this.isRandom;
      randomBtn.classList.toggle("active", _this.isRandom);
    };

    //Xử lí repeat song
    repeatBtn.onclick = function () {
      _this.isRepeat = !_this.isRepeat;
      repeatBtn.classList.toggle("active", _this.repeatBtn);
    };
    //XỬ lí next song khi audio ended
    audio.onended = function () {
      if (_this.isRepeat) {
        audio.play();
      } else {
        nextBtn.click();
      }
    };
    //Lắng nghe hành vi click vào playlist
    playList.onclick = function (e) {
      if (
        e.target.closest(".song:not(.active)") ||
        e.target.closest(".option")
      ) {
        //Xử lí khi click vào song
        if (e.target.closest(".song:not(.active)")) {
          _this.currentIndex = Number(
            e.target.closest(".song:not(.active)").dataset.index
          );
          _this.loadCurrentSong();
          audio.play();
          _this.render();
        }
      }
    };
  },

  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
  },

  nextSong: function () {
    this.currentIndex++;

    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },
  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },
  playRandomSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex == this.currentIndex);
    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },
  //Chuyển focus đến bài hát đang phát
  scrollToActiveSong: function () {
    setTimeout(() => {
      $(".song.active").scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 300);
  },

  //Darkmode
  handleDarkMode: function () {
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
        if (currentTheme === 'dark') {
            darkModeBtn.checked = true;
        }
    }

    darkModeBtn.onchange = function (e) {
      if (e.target.checked) {
        document.documentElement.setAttribute("data-theme", "dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.setAttribute("data-theme", "light");
        localStorage.setItem("theme", "light");
      }
    };
  },

  //start
  start: function () {
    //Định nghĩa các thuộc tính cho obj
    this.defineProperties();

    //Lắng nghe các sự kiện
    this.handlEvents();

    //Tải bài đầu tiên
    this.loadCurrentSong();

    //render playlist
    this.render();

    //darkMode
    this.handleDarkMode();
  },
};

app.start();
