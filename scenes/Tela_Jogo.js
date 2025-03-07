class TelaJogo extends Phaser.Scene {
    constructor() {
        super({ key: 'TelaJogo' });
        this.pulos = 0;
        this.pulando = false;
        this.score = 0; // Inicializando a pontuação
        this.gameOver = false; // Adicionando a variável gameOver
    }

    preload() {
        this.load.image('sertao', 'assets/bg.png');
        this.load.image('cacto', 'assets/cacto.png');
        this.load.spritesheet('player', 'assets/run.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('jump', 'assets/jump.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('doubleJump', 'assets/double_jump.png', { frameWidth: 32, frameHeight: 32 });
        this.load.image('plataforma', 'assets/plataforma.png');
        this.load.image('star', 'assets/star.png'); // Adicionando a imagem da estrela
    }

    create() {
        let sertao = this.add.image(0, 0, 'sertao').setOrigin(0, 0);
        sertao.setDisplaySize(this.scale.width, this.scale.height);

        this.scale.on('resize', (gameSize) => {
            sertao.setDisplaySize(gameSize.width, gameSize.height);
        });

        // Criando estrelas
        this.stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 }
        });

        this.stars.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });

        // Criando cactos
        this.cacto = this.physics.add.group({
            key: 'cacto',
            repeat: 3,
            setXY: {x: 20, y: 0, stepX: 50 },
        });

        // Criando plataformas
        this.plataformas = this.physics.add.staticGroup();
        const plataformasData = [
            { x: 500, y: 850 },
            { x: 300, y: 570 },
            { x: 790, y: 570 },
            { x: 160, y: 350 },
            { x: 1500, y: 870 },
            { x: 1250, y: 620 },
            { x: 1700, y: 370 },
            { x: 1150, y: 380 }
        ];
        plataformasData.forEach(pos => {
            let plat = this.plataformas.create(pos.x, pos.y, 'plataforma');
            plat.setFrame(0);
        });

        this.chao = this.physics.add.staticGroup();
        this.chao.create(0, this.scale.height, 'plataforma').setOrigin(0, 1).setDisplaySize(this.scale.width, 10);

        // Criando o personagem
        this.player = this.physics.add.sprite(100, 300, 'player');
        this.player.setCollideWorldBounds(true);
        this.player.setDragX(600);
        this.player.setMaxVelocity(200, 400);
        this.player.setScale(3);

        // Configurando colisões
        this.physics.add.collider(this.player, this.plataformas);
        this.physics.add.collider(this.stars, this.player, this.collectStar, null, this); // Colisão para coletar estrelas
        this.physics.add.collider(this.stars, this.plataformas); // Colisão para coletar estrelas
        this.physics.add.collider(this.cacto, this.plataformas);
        this.physics.add.collider(this.cacto, this.player, this.hitCacto, null, this); // Colisão para as bombas
        this.physics.add.collider(this.plataformas, this.stars);

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

        // Animação de "morte"
        this.anims.create({
            key: 'turn',
            frames: [{ key: 'player', frame: 0 }],
            frameRate: 20
        });

        // Texto de pontuação
        this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#fff' });

        this.player.on('animationcomplete', (anim) => {
            if (anim.key === 'double_jump') {
                this.player.anims.play('pulo', true);
                this.pulando = false;
            }
        });
    }

    update() {
        if (this.gameOver) {
            this.add.text(300, 300, 'Game Over', { fontSize: '64px', fill: '#fff' });
            return;
        }

        let noAr = !this.player.body.blocked.down;

        // Movimentação do personagem
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

        // Pulo com a tecla W
        if (Phaser.Input.Keyboard.JustDown(this.tecladoUp)) {
            if (this.pulos === 0 || (this.pulos === 1 && noAr)) {
                this.player.setVelocityY(-250);
                this.player.anims.play(this.pulos === 0 ? 'pulo' : 'double_jump', true);
                this.pulos += 1;
            }
        }

        // Resetando os pulos ao tocar o chão
        if (this.player.body.blocked.down) {
            this.pulos = 0;
        }
    }

    // Função para coletar a estrela
    collectStar(player, star) {
        star.disableBody(true, true);

        // Atualizando a pontuação
        this.score += 10;
        this.scoreText.setText('Score: ' + this.score);

        // Se todas as estrelas forem coletadas
        if (this.stars.countActive(true) === 0) {
            this.stars.children.iterate(function (child) {
                child.enableBody(true, child.x, 0, true, true);
            });

            var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

            var newCacto = this.cacto.create(x, 16, 'cacto');
            newCacto.setBounce(0.6);  // Ajuste o valor de rebote (quanto maior, mais alto o cacto quica)
            newCacto.setCollideWorldBounds(true);  // Mantém o cacto dentro dos limites do mundo
            newCacto.setVelocity(Phaser.Math.Between(-200, 200), 20);  // Ajuste a velocidade para movimento
            newCacto.allowGravity = true;  // Certifique-se de que a gravidade esteja ativada

            // Definindo a física do cacto para permitir o quique
            newCacto.body.setGravityY(300);  // Aplicando gravidade para o efeito de quique

            // Adicionando colisão com o chão
            this.physics.add.collider(newCacto, this.chao);

            // Adicionando colisão com as plataformas, se necessário
            this.physics.add.collider(newCacto, this.plataformas);
        }
    }

    // Função quando o jogador é atingido pela bomba
    hitCacto(player, cacto) {
        this.physics.pause();
        player.setTint(0xff0000); // Muda a cor do jogador para vermelho
        this.player.anims.play('turn'); // Adicionando animação de "morte"
        this.gameOver = true;
    }
}
