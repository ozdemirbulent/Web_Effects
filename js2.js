// SAYFA GÖVDESİNDE YAĞMUR EFEKTİ

function startRain() {
  // Yağmur container'ı oluştur
  const rainContainer = document.createElement("div");
  rainContainer.id = "rainContainer";
  rainContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        pointer-events: none;
        z-index: 9999;
        overflow: hidden;
    `;
  document.body.appendChild(rainContainer);

  const drops = [];
  const dropCount = 150;

  // Yağmur damlası oluştur
  function createDrop() {
    const drop = document.createElement("div");
    drop.style.cssText = `
            position: absolute;
            width: 2px;
            background: linear-gradient(transparent, #4fc3f7, #29b6f6);
            border-radius: 0 0 6px 6px;
            animation: none;
            opacity: 0.8;
        `;

    // Rastgele özellikler
    const x = Math.random() * window.innerWidth;
    const speed = Math.random() * 3 + 2;
    const length = Math.random() * 20 + 10;
    const opacity = Math.random() * 0.6 + 0.4;

    drop.style.left = x + "px";
    drop.style.top = "-50px";
    drop.style.height = length + "px";
    drop.style.opacity = opacity;

    rainContainer.appendChild(drop);

    return {
      element: drop,
      x: x,
      y: -50,
      speed: speed,
      length: length,
    };
  }

  // Damlaları oluştur
  for (let i = 0; i < dropCount; i++) {
    drops.push(createDrop());
  }

  // Animasyon fonksiyonu
  function animate() {
    drops.forEach((drop) => {
      drop.y += drop.speed;
      drop.element.style.top = drop.y + "px";

      // Ekranın altına çıktığında tekrar başlat
      if (drop.y > window.innerHeight) {
        drop.y = -drop.length;
        drop.x = Math.random() * window.innerWidth;
        drop.element.style.left = drop.x + "px";
      }
    });

    requestAnimationFrame(animate);
  }

  animate();

  console.log("🌧️ Yağmur başladı! stopRain() ile durdurun.");
}

// Yağmuru durdur
function stopRain() {
  const container = document.getElementById("rainContainer");
  if (container) {
    container.remove();
    console.log("🌈 Yağmur durdu!");
  }
}

// GELİŞMİŞ YAĞMUR EFEKTİ
function advancedRain() {
  // Eski yağmuru temizle
  stopRain();

  // Ana container
  const rainContainer = document.createElement("div");
  rainContainer.id = "rainContainer";
  rainContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        pointer-events: none;
        z-index: 9999;
        overflow: hidden;
        background: rgba(0, 20, 40, 0.1);
    `;
  document.body.appendChild(rainContainer);

  const drops = [];
  const splashes = [];

  class RainDrop {
    constructor() {
      this.reset();
      this.createElement();
    }

    reset() {
      this.x = Math.random() * window.innerWidth;
      this.y = -Math.random() * 100 - 50;
      this.speed = Math.random() * 4 + 3;
      this.length = Math.random() * 25 + 15;
      this.opacity = Math.random() * 0.6 + 0.4;
      this.wind = Math.random() * 2 - 1;
    }

    createElement() {
      this.element = document.createElement("div");
      this.updateElement();
      rainContainer.appendChild(this.element);
    }

    updateElement() {
      this.element.style.cssText = `
                position: absolute;
                width: 2px;
                height: ${this.length}px;
                background: linear-gradient(transparent, rgba(135, 206, 235, ${
                  this.opacity
                }), rgba(100, 150, 255, ${this.opacity}));
                border-radius: 0 0 6px 6px;
                left: ${this.x}px;
                top: ${this.y}px;
                transform: rotate(${this.wind * 2}deg);
            `;
    }

    update() {
      this.y += this.speed;
      this.x += this.wind * 0.5;

      this.updateElement();

      if (this.y > window.innerHeight - 5) {
        this.createSplash();
        this.reset();
      }

      if (this.x < -10 || this.x > window.innerWidth + 10) {
        this.reset();
      }
    }

    createSplash() {
      const splash = new Splash(this.x, window.innerHeight - 10);
      splashes.push(splash);
    }

    remove() {
      if (this.element) {
        this.element.remove();
      }
    }
  }

  class Splash {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.particles = [];
      this.life = 20;
      this.createElement();
    }

    createElement() {
      const particleCount = Math.floor(Math.random() * 3) + 3;

      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement("div");
        particle.style.cssText = `
                    position: absolute;
                    width: 3px;
                    height: 3px;
                    background: rgba(135, 206, 235, 0.8);
                    border-radius: 50%;
                    left: ${this.x}px;
                    top: ${this.y}px;
                `;

        rainContainer.appendChild(particle);

        this.particles.push({
          element: particle,
          vx: (Math.random() - 0.5) * 6,
          vy: Math.random() * -3 - 1,
          gravity: 0.2,
        });
      }
    }

    update() {
      this.life--;

      this.particles.forEach((particle) => {
        particle.vy += particle.gravity;

        const currentLeft = parseFloat(particle.element.style.left);
        const currentTop = parseFloat(particle.element.style.top);

        particle.element.style.left = currentLeft + particle.vx + "px";
        particle.element.style.top = currentTop + particle.vy + "px";
        particle.element.style.opacity = this.life / 20;
      });

      return this.life > 0;
    }

    remove() {
      this.particles.forEach((particle) => {
        particle.element.remove();
      });
    }
  }

  // Damlaları oluştur
  for (let i = 0; i < 200; i++) {
    drops.push(new RainDrop());
  }

  // Ana animasyon döngüsü
  function animate() {
    // Damlaları güncelle
    drops.forEach((drop) => drop.update());

    // Sıçramaları güncelle
    for (let i = splashes.length - 1; i >= 0; i--) {
      if (!splashes[i].update()) {
        splashes[i].remove();
        splashes.splice(i, 1);
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}

// EMOJI YAĞMURU
function emojiRain() {
  stopRain();

  const rainContainer = document.createElement("div");
  rainContainer.id = "rainContainer";
  rainContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        pointer-events: none;
        z-index: 9999;
        overflow: hidden;
    `;
  document.body.appendChild(rainContainer);

  const emojis = ["💧", "💦", "🌧️", "☔", "⛈️", "🌊", "💙", "🔵"];
  const drops = [];

  function createEmojiDrop() {
    const drop = document.createElement("div");
    drop.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    drop.style.cssText = `
            position: absolute;
            font-size: ${Math.random() * 25 + 15}px;
            left: ${Math.random() * window.innerWidth}px;
            top: -50px;
            user-select: none;
            animation: none;
        `;

    rainContainer.appendChild(drop);

    return {
      element: drop,
      speed: Math.random() * 3 + 2,
      rotation: 0,
      rotationSpeed: (Math.random() - 0.5) * 5,
    };
  }

  for (let i = 0; i < 50; i++) {
    drops.push(createEmojiDrop());
  }

  function animate() {
    drops.forEach((drop) => {
      const currentTop = parseFloat(drop.element.style.top);
      const newTop = currentTop + drop.speed;

      drop.rotation += drop.rotationSpeed;

      drop.element.style.top = newTop + "px";
      drop.element.style.transform = `rotate(${drop.rotation}deg)`;

      if (newTop > window.innerHeight + 50) {
        drop.element.style.top = "-50px";
        drop.element.style.left = Math.random() * window.innerWidth + "px";
        drop.element.textContent =
          emojis[Math.floor(Math.random() * emojis.length)];
      }
    });

    requestAnimationFrame(animate);
  }

  animate();
}

// METİN YAĞMURU
function textRain(text = "JAVASCRIPT") {
  stopRain();

  const rainContainer = document.createElement("div");
  rainContainer.id = "rainContainer";
  rainContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        pointer-events: none;
        z-index: 9999;
        overflow: hidden;
    `;
  document.body.appendChild(rainContainer);

  const drops = [];

  function createTextDrop() {
    const drop = document.createElement("div");
    drop.textContent = text[Math.floor(Math.random() * text.length)];
    drop.style.cssText = `
            position: absolute;
            font-size: ${Math.random() * 20 + 15}px;
            font-weight: bold;
            color: hsl(${Math.random() * 60 + 200}, 70%, 60%);
            text-shadow: 0 0 10px currentColor;
            left: ${Math.random() * window.innerWidth}px;
            top: -50px;
            user-select: none;
        `;

    rainContainer.appendChild(drop);

    return {
      element: drop,
      speed: Math.random() * 4 + 2,
    };
  }

  for (let i = 0; i < 80; i++) {
    drops.push(createTextDrop());
  }

  function animate() {
    drops.forEach((drop) => {
      const currentTop = parseFloat(drop.element.style.top);
      const newTop = currentTop + drop.speed;

      drop.element.style.top = newTop + "px";

      if (newTop > window.innerHeight + 50) {
        drop.element.style.top = "-50px";
        drop.element.style.left = Math.random() * window.innerWidth + "px";
        drop.element.textContent =
          text[Math.floor(Math.random() * text.length)];
        drop.element.style.color = `hsl(${Math.random() * 60 + 200}, 70%, 60%)`;
      }
    });

    requestAnimationFrame(animate);
  }

  animate();
}
startRain();
//advancedRain();
//emojiRain();
//textRain("CODE");
