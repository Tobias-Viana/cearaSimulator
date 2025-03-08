class TelaInicial extends Phaser.Scene {
    constructor() {
        super({ key: 'TelaInicial' });
    }

    preload() {
        //Adicionando as imagens
        this.load.image('bg', 'assets/bg.png');
        this.load.image('play', 'assets/play.png');
    }

    create() {
        //Largura e altura da tela
        let largura = this.scale.width;
        let altura = this.scale.height;

        //Adiciona o fundo e ajusta para cobrir toda a tela
        let bg = this.add.image(largura / 2, altura / 2, 'bg');
        bg.setDisplaySize(largura, altura); // Ajusta o tamanho do fundo

        this.add.text(largura / 2, altura / 3, 'Ceará Simulator', {
            fontSize: '100px', 
            fontStyle: 'bold', 
            fill: '#000' 
        }).setOrigin(0.5);

        //Adiciona o botão de play no centro
        this.playBt = this.add.image(largura / 2, altura / 2, 'play').setScale(1);
        
        //Interação de clicar o botão play e mudar para a outra tela
        this.playBt.setInteractive();
        this.playBt.on('pointerdown', () => {
            console.log("Botão pressionado!"); // Verifica se o clique está funcionando
            this.scene.start('Tutorial'); // Certifique-se de que o nome está certo
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
