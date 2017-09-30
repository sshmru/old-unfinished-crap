var config = {
  root: {
    width: 315,
    height: 535,
    scaleX: 1,
    scaleY: 1,
    interactive: true
  },
  stage1: {
    bg:{
      imgUrl: 'screen1_bg.png'
    }
  },
  topBar:{
    y: 30
  },
  exit: {
    x: 300,
    button: {
      interactive: true,
      imgUrl: 'exit.png',
      centered: true,
    },
    cross: {
      imgUrl: 'exit_cross.png',
      centered: true
    }
  },
  lives: {
    x: 30,
    count: 3,
    offset: 30,
    life: {
      imgUrl: 'lives.png',
      centered: true
    }
  },
  player: {
    x: 165,
    y: 390,
    hitbox: {
      x: -40,
      y: -50,
      width: 80,
      height: 90
    },
    image: {
      imgUrl: 'screen1_player.png',
      centered: true
    },
    points: 0,
    maxPoints: 10,
    movementSpeed: 200
  },
  countdown: {
    x: 165,
    y: 275,
    centered: true,
    shadow: 10,
    font: '48px sans',
    color: 'white',
    alpha: 0
  },
  items: {
    imgUrl: 'screen1_item{n}.png',
    digits: 2,
    count: 9,
    catchAnim: {
      length: 500,
      endScale: 0.2
    },
    catchTime: 500,
    fallTime: 4500,
    fallFreqMax: 4000,
    fallFreqMin: 1000,
  },
  stage2: {
    bg:{
      imgUrl: 'screen2_bg_v.png'
    }
  },
  message: {
    x: 0,
    y: 60,
    img: {
      imgUrl: 'screen2_text2.png',
      x: 0,
      y: 50,
      scaleX: 0.66,
      scaleY: 0.66
    }
  },
  text: {
    imgUrl: 'screen2_text3.png',
    x: 205,
    y: 175,
    scaleX: 0.5,
    scaleY: 0.5,
    interactive: true
  },
  text2: {
    imgUrl: 'screen2_text4.png',
    x: 210,
    y: 170,
    interactive: true
  },
  openButton: {
    imgUrl: 'screen2_button.png',
    x: 127,
    y: 188,
    interactive: true
  }
};
