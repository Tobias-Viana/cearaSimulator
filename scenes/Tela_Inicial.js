class TelaInicial extends Phaser.Scene {
    constructor() {
        super({ key: 'TelaInicial' });
    }

    preload() {
        this.load.image('bg', 'assets/bg.png');
        this.load.image('play', 'assets/play.png');
        this.load.image('tutorial')
    }

    create() {
        //Largura e altura da tela
        let largura = this.scale.width;
        let altura = this.scale.height;

        //Adiciona o fundo e ajusta para cobrir toda a tela
        let bg = this.add.image(largura / 2, altura / 2, 'bg');
        bg.setDisplaySize(largura, altura); // Ajusta o tamanho do fundo

        //Adiciona o botão de play no centro
        this.playBt = this.add.image(largura / 2, altura / 2, 'play').setScale(1);
        
        //Interação de clicar o botão play e mudar para a outra tela
        this.playBt.setInteractive();
        this.playBt.on('pointerdown', () => {
            console.log("Botão pressionado!"); // Verifica se o clique está funcionando
            this.scene.start('TelaJogo'); // Certifique-se de que o nome está certo
        });
        
        // Adiciona evento para redimensionar corretamente quando a tela mudar
        this.scale.on('resize', (gameSize) => {
            let { width, height } = gameSize;
            bg.setPosition(width / 2, height / 2);
            bg.setDisplaySize(width, height);
            this.playBt.setPosition(width / 2, height / 2);
        });
    }
}
