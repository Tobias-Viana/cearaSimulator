class TelaFinal extends Phaser.Scene {
    constructor() {
        super({ key: 'TelaFinal' });
    }

    preload() {
        this.load.image('bg', 'assets/bg.png');
    }

    create() {
        let largura = this.scale.width;
        let altura = this.scale.height;

        let bg = this.add.image(largura / 2, altura / 2, 'bg');
        bg.setDisplaySize(largura, altura);

        this.add.text(largura / 2, altura / 2, 'Fim de Jogo!', {
            fontSize: '100px', 
            fontStyle: 'bold', 
            fill: '#000' 
        }).setOrigin(0.5);

        this.scale.on('resize', (gameSize) => {
            let { width, height } = gameSize;
            bg.setPosition(width / 2, height / 2);
            bg.setDisplaySize(width, height);
        });
    }
}
