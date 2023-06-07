/**Các bước
 * 1. Render songs (82-101)
 * 2. Scroll top (103-113)
 * 3. Play / pause / seek
 * 4. CD rotate
 * 5. Next / pre
 * 6. Random
 * 7. Next / Repeat when ended
 * 8. Active song
 * 9. Scroll active song into view
 * 10. Play song when click
 */

// Một số bài hát có thể bị lỗi do liên kết bị hỏng. Vui lòng thay thế liên kết khác để có thể phát
// Some songs may be faulty due to broken links. Please replace another link so that it can be played

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PlAYER_STORAGE_KEY = "F8_PLAYER";

const player = $('.player');
const cd = $('.cd');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const progress = $('#progress');
const prevBtn = $('.btn-prev');
const nextBtn = $('.btn-next');
const randomBtn = $('.btn-random');
const repeatBtn = $(".btn-repeat");
const playlist = $(".playlist");

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  // (1/2) Uncomment the line below to use localStorage
  // config: JSON.parse(localStorage.getItem(PlAYER_STORAGE_KEY)) || {},
  songs: [
    {
      name: "Mang tiền về cho mẹ",
      singer: "Đen Vâu",
      // path: "https://data.chiasenhac.com/down2/2215/0/2214701-52396a51/128/Mang%20Tien%20Ve%20Cho%20Me%20-%20Den_%20Nguyen%20Thao.mp3",
      path: "./assets/music/Mang Tien Ve Cho Me - Den_ Nguyen Thao.mp3",
      image: "./assets/img/song1.png"
    },
    {
      name: "Bài này chill phết",
      singer: "Đen ft. MIN",
      // path: "https://data.chiasenhac.com/down2/2179/0/2178590-1df95ef6/128/Bai%20Nay%20Chill%20Phet%20-%20Den_%20Min.mp3",
      path: "./assets/music/Bai Nay Chill Phet - Den_ Min.mp3",
      image:"./assets/img/song2.png"
    },
    {
      name: "Đi về nhà",
      singer: "Đen x JustaTee",
      // path: "https://data.chiasenhac.com/down2/2179/0/2178291-6e126457/128/Di%20Ve%20Nha%20-%20Den_%20JustaTee.mp3",
      path: "./assets/music/Di Ve Nha - Den_ JustaTee.mp3",
      image: "./assets/img/song3.png"
    },
    {
      name: "Trốn tìm",
      singer: "Đen ft. MTV band",
      // path: "https://data.chiasenhac.com/down2/2172/0/2171043-de949f5d/128/Tron%20Tim%20-%20Den_%20MTV%20Band.mp3",
      path: "./assets/music/Tron Tim - Den_ MTV Band.mp3",
      image:"./assets/img/song4.png"
    },
    {
      name: "Lối nhỏ",
      singer: "Đen ft. Phương Anh Đào",
      // path: "https://data.chiasenhac.com/down2/2211/0/2210420-cad860c9/128/Loi%20Nho%20-%20Den_%20Phuong%20Anh%20Dao.mp3",
      path: "./assets/music/Loi Nho - Den_ Phuong Anh Dao.mp3",
      image:"./assets/img/song5.png"
    }
  ],
  // setConfig: function(key, value){
  //   this.config[key] = value
  //   localStorage.setItem(PlAYER_STORAGE_KEY, this.config)
  // },
  // ver2
  // setConfig: function (key, value) {
  //   this.config[key] = value;
  //   // (2/2) Uncomment the line below to use localStorage
  //   localStorage.setItem(PlAYER_STORAGE_KEY, JSON.stringify(this.config));
  // },
  render: function(){
    // console.log(123);
    currentIndex = 0;
    isPlay = false;
    isRandom = false;
    const htmls = this.songs.map((song, index) => {
      return `
        <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index=${index}>
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
    playlist.innerHTML = htmls.join('')
  },
  defineProperties: function(){
    Object.defineProperty(this, 'currentSong', {
      get: function(){
        return this.songs[this.currentIndex];
      }
    })
  },
  handleEvents: function(){
    const _this = this
    const cdWidth = cd.offsetWidth

    // CD rotate
    // Xử lý CD quay / dừng
    const cdThumbAnimate = cdThumb.animate([
      {transform: 'rotate(360deg)'}
    ], {
      duration: 10000, //10s
      iterations: Infinity
    })
    cdThumbAnimate.pause()
    // console.log(cdThumbAnimate);
    // xử lý phóng to / thu nhỏ CD
    document.onscroll = function(){
      // lắng nghe sự kiện lăn chuột
      const scrolltop = window.scrollY || document.documentElement.scrollTop;
      // lăn bài hát thu nhỏ cd
      const newCdWidth = cdWidth - scrolltop;

      cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
      // tạo animation mờ dần khi cd nhỏ lại
      cd.style.opacity = newCdWidth / cdWidth;

      // Xử lý khi click play
      playBtn.onclick = function(){
        if(_this.isPlaying){
          audio.pause()
        }else{
          audio.play()
        }
      }
      // Khi song được play
      audio.onplay = function(){
        _this.isPlaying = true
        player.classList.add('playing')
        // khi start bài hát thì cd bắt đầu quay
        cdThumbAnimate.play()
      }
      // Khi song bị pause
      audio.onpause = function(){
        _this.isPlaying = false
        player.classList.remove('playing')
        // khi pause bài hát thì cd dừng
        cdThumbAnimate.pause() 
      }

      // Khi tiến độ bài hát thay đổi: chạy cái thanh dưới khi bài hát chạy
      audio.ontimeupdate = function(){
        if(audio.duration){
          const progressPercent = Math.floor(audio.currentTime / audio.duration*100)
          progress.value = progressPercent
        }
          // audio.currentTime / audio.duration*100;
      }

      // xử lý khi tua
      progress.onchange = function(e){
        const seekTime = audio.duration / 100 * e.target.value;
        audio.currentTime = seekTime
      }

      // Khi next song
      nextBtn.onclick = function(){
        if(_this.isRandom){
          _this.playRandomSong()
        }else{
          _this.nextSong()
        }
        audio.play()
        _this.render()
        _this.scrollToActiveSong()
      }
      // Khi prev song
      prevBtn.onclick = function(){
        if(_this.isRandom){
          _this.playRandomSong()
        }else{
          _this.prevSong()
        }
        audio.play()
        _this.render()
        _this.scrollToActiveSong()
      }

      // Xử lý bật / tắt random song
      randomBtn.onclick = function(e){
        // đảo ngược
        _this.isRandom = !_this.isRandom
        // _this.setConfig("isRandom", _this.isRandom)
        randomBtn.classList.toggle('active', _this.isRandom)
      }

      // Xử lý phát lại bài hát
      repeatBtn.onclick = function(){
        _this.isRepeat = !_this.isRepeat
        // _this.setConfig("isRepeat", _this.isRepeat);
        repeatBtn.classList.toggle('active', _this.isRepeat)
      }

      // Xử lý next song khi audio ended
      audio.onended = function(){
        if(_this.isRepeat){
          audio.play()
        }else{
          nextBtn.click()
        }
      }

      // Lắng nghe hành vi click vào playlist
      playlist.onclick = function(e){
        const songNode = e.target.closest('.song:not(.active)');
        if(songNode || e.target.closest('.option')){
          // console.log(e.target);
          // Xử lý khi click vào song
          if(songNode){
            // console.log(songNode.getAttribute('data-index'));
            // nếu dùng data-index thì dùng dataset
            // dùng Number convert lại do khi get từ element (VếPhải) là chuỗi
            _this.currentIndex = Number(songNode.dataset.index)
            _this.loadCurrentSong()
            audio.play()
            _this.render()
          }
          // Xử lý khi click vào song option
          if(e.target.closest('.option')){
            alert('Đang ngâm cứu thêm......')
          }
        }
      }
    }
  },
  scrollToActiveSong: function(){
    setTimeout(()=>{
      $('.song.active').scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      })
    }, 500)
  },
  loadCurrentSong: function(){
    heading.textContent = this.currentSong.name
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
    audio.src = this.currentSong.path

    // console.log(heading, cdThumb, audio);
  },
  // loadConfig: function () {
  //   this.isRandom = this.config.isRandom;
  //   this.isRepeat = this.config.isRepeat;
  // },
  nextSong: function(){
    this.currentIndex++;
    if(this.currentIndex >= this.songs.length){
      this.currentIndex = 0;
    }
    this.loadCurrentSong()
  },
  prevSong: function(){
    this.currentIndex--;
    if(this.currentIndex < 0){
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong()
  },
  playRandomSong: function(){
    let newIndex;
    do{
      newIndex = Math.floor(Math.random() * this.songs.length)
    }while(newIndex === this.currentIndex )
    // console.log(newIndex);
    this.currentIndex = newIndex;
    this.loadCurrentSong()
  },
  // bấm bắt đầu thì gọi hàm render() render ra list bài hát
  start: function(){
    // Gán cấu hình từ config vào ứng dụng
    // this.loadConfig();

    // Định nghĩa các thuộc tính cho obj
    this.defineProperties()

    // Lắng nghe và xử lý các sự kiện (DOM events)
    this.handleEvents()

    // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
    this.loadCurrentSong()

    // Render playlist
    this.render()

    // Hiển thị trạng thái ban đầu của button repeat & random
    // randomBtn.classList.toggle("active", this.isRandom);
    // repeatBtn.classList.toggle("active", this.isRepeat);
  }
}

app.start()