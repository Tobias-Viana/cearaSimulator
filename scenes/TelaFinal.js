class TelaFinal extends Phaser.Scene {
    constructor() {
        super({ key: 'TelaFinal' });
    }

    preload() {
        //Adicionando as imagens
        this.load.image('bg', 'assets/bg.png');
    }

    create() {
        //Largura e altura da tela
        let largura = this.scale.width;
        let altura = this.scale.height;

        //Adiciona o fundo e ajusta para cobrir toda a tela
        let bg = this.add.image(largura / 2, altura / 2, 'bg');
        bg.setDisplaySize(largura, altura);

        //Adiciona o texto de fim de jogo
        this.add.text(largura / 2, altura / 2, 'Fim de Jogo!', {
            fontSize: '100px', 
            fontStyle: 'bold', 
            fill: '#000' 
        }).setOrigin(0.5);

        // Adiciona evento para redimensionar corretamente quando a tela mudar
        this.scale.on('resize', (gameSize) => {
            let { width, height } = gameSize;
            bg.setPosition(width / 2, height / 2);
            bg.setDisplaySize(width, height);
        });
    }
}
