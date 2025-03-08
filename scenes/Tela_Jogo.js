class TelaJogo extends Phaser.Scene {
    constructor() {
        super({ key: 'TelaJogo' });
        this.pulos = 0;
        this.pulando = false;
        this.score = 0;
        this.gameOver = false;
    }

    preload() {
        this.load.image('sertao', 'assets/bg.png');
        this.load.spritesheet('player', 'assets/run.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('jump', 'assets/jump.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('doubleJump', 'assets/double_jump.png', { frameWidth: 32, frameHeight: 32 });
        this.load.image('plataforma', 'assets/plataforma.png');
        this.load.image('star', 'assets/star.png');
    }

    create() {
        let sertao = this.add.image(0, 0, 'sertao').setOrigin(0, 0);
        sertao.setDisplaySize(this.scale.width, this.scale.height);

        this.scale.on('resize', (gameSize) => {
            sertao.setDisplaySize(gameSize.width, gameSize.height);
        });

        // Criando plataformas
        this.plataformas = this.physics.add.staticGroup();
        const plataformasData = [
            { x: 500, y: 850 }, { x: 300, y: 570 }, { x: 790, y: 570 },
            { x: 160, y: 350 }, { x: 1500, y: 870 }, { x: 1250, y: 620 },
            { x: 1700, y: 370 }, { x: 1150, y: 380 }
        ];
        plataformasData.forEach(pos => {
            this.plataformas.create(pos.x, pos.y, 'plataforma');
        });

        // Criando estrelas corretamente
        this.stars = this.physics.add.group({
            key: 'star',
            repeat: 16,
            setXY: { x: 90, y: 0, stepX: 135 }
        });

        this.stars.children.iterate((star) => {
            star.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
            star.setGravityY(300); // Ajustando a gravidade
        });

        // Criando o personagem
        this.player = this.physics.add.sprite(100, 300, 'player');
        this.player.setCollideWorldBounds(true);
        this.player.setDragX(600);
        this.player.setMaxVelocity(200, 400);
        this.player.setScale(3);

        // Configurando colisões
        this.physics.add.collider(this.player, this.plataformas, () => {
            this.pulos = 0;
            if (!this.tecladoLeft.isDown && !this.tecladoRight.isDown) {
                this.player.anims.play('andar', true);
            }
        });
        this.physics.add.collider(this.stars, this.plataformas);
        this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);

        // Configuração das teclas
        this.tecladoUp = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.tecladoLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.tecladoRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        // Criando animações
        this.anims.create({
            key: 'andar',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 11 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'pulo',
            frames: this.anims.generateFrameNumbers('jump', { start: 0, end: 1 }),
            frameRate: 10
        });

        this.anims.create({
            key: 'double_jump',
            frames: this.anims.generateFrameNumbers('doubleJump', { start: 0, end: 6 }),
            frameRate: 10
        });

        // Texto de pontuação
        this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#fff' });
    }

    update() {
        if (this.gameOver) return;

        let noAr = !this.player.body.blocked.down;

        if (this.tecladoLeft.isDown) {
            this.player.setVelocityX(-180);
            if (!noAr) this.player.anims.play('andar', true);
            this.player.flipX = true;
        } else if (this.tecladoRight.isDown) {
            this.player.setVelocityX(180);
            if (!noAr) this.player.anims.play('andar', true);
            this.player.flipX = false;
        } else {
            this.player.setVelocityX(0);
            if (!noAr) this.player.setFrame(0);
        }

        if (Phaser.Input.Keyboard.JustDown(this.tecladoUp)) {
            if (this.pulos === 0 || (this.pulos === 1 && noAr)) {
                this.player.setVelocityY(-250);
                this.player.anims.play(this.pulos === 0 ? 'pulo' : 'double_jump', true);
                this.pulos += 1;
            }
        }

        if (this.player.body.blocked.down && !this.tecladoLeft.isDown && !this.tecladoRight.isDown) {
            this.player.anims.play('andar', true);
        }

        if (this.score > 90) {
            this.scene.start('TelaFinal');
        }
    }

    collectStar(player, star) {
        star.disableBody(true, true);
        this.score += 10;
        this.scoreText.setText('Score: ' + this.score);

        if (this.stars.countActive(true) === 0) {
            this.stars.children.iterate(function (child) {
                child.enableBody(true, child.x, 0, true, true);
            });
        }
    }
}
