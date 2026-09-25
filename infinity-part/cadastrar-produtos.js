const API_URL = "http://localhost:5022/api";

const produtos = [
    {
        nome: "Adaptador USB WiFi TP-Link",
        codigo: "WIFI-TPLINK-001",
        descricao: "Adaptador USB WiFi TP-Link",
        preco: 89.90,
        quantidadeEstoque: 18,
        marcaId: 4,
        image: "assets/products/Adaptador USB WiFi TP-Link.png"
    },
    {
        nome: "AMD RX 7600 8GB",
        codigo: "GPU-RX7600-001",
        descricao: "Placa de vídeo AMD RX 7600 8GB",
        preco: 1919.99,
        quantidadeEstoque: 8,
        marcaId: 3,
        image: "assets/products/AMD RX 7600 8GB.png"
    },
    {
        nome: "AMD Ryzen 5 5600G",
        codigo: "CPU-R55600G-001",
        descricao: "Processador AMD Ryzen 5 5600G",
        preco: 1099.90,
        quantidadeEstoque: 12,
        marcaId: 3,
        image: "assets/products/AMD Ryzen 5 5600G.png"
    },
    {
        nome: "AOC 24G2 24 FHD 144Hz",
        codigo: "MON-AOC24G2-001",
        descricao: "Monitor AOC 24G2 Full HD 144Hz",
        preco: 1099.90,
        quantidadeEstoque: 7,
        marcaId: 5,
        image: "assets/products/AOC 24G2 24 FHD 144Hz.png"
    },
    {
        nome: "APC Back-UPS 600VA",
        codigo: "UPS-APC600-001",
        descricao: "Nobreak APC Back-UPS 600VA",
        preco: 449.90,
        quantidadeEstoque: 9,
        marcaId: 6,
        image: "assets/products/APC Back-UPS 600VA.png"
    },
    {
        nome: "Ar Comprimido 400ml",
        codigo: "LIMPEZA-AR400-001",
        descricao: "Ar comprimido para limpeza de equipamentos",
        preco: 29.90,
        quantidadeEstoque: 35,
        marcaId: 38,
        image: "assets/products/Ar Comprimido 400ml.png"
    },
    {
        nome: "ASUS PRIME B550M-A",
        codigo: "MB-B550MA-001",
        descricao: "Placa-mãe ASUS PRIME B550M-A",
        preco: 699.90,
        quantidadeEstoque: 8,
        marcaId: 7,
        image: "assets/products/ASUS PRIME B550M-A.png"
    },
    {
        nome: "AverMedia Live Gamer Mini",
        codigo: "CAP-AVERMEDIA-001",
        descricao: "Placa de captura AverMedia Live Gamer Mini",
        preco: 699.90,
        quantidadeEstoque: 5,
        marcaId: 8,
        image: "assets/products/AverMedia Live Gamer Mini.png"
    },
    {
        nome: "Cabo Adaptador",
        codigo: "CABO-ADAPT-001",
        descricao: "Cabo adaptador para equipamentos",
        preco: 39.90,
        quantidadeEstoque: 30,
        marcaId: 38,
        image: "assets/products/Cabo Adaptador.png"
    },
    {
        nome: "Cabo Sleeved RGB 24p",
        codigo: "CABO-RGB24-001",
        descricao: "Cabo Sleeved RGB 24 pinos",
        preco: 129.90,
        quantidadeEstoque: 15,
        marcaId: 38,
        image: "assets/products/Cabo Sleeved RGB 24p.png"
    },
    {
        nome: "Cooler Master Hyper 212 RGB",
        codigo: "COOL-H212RGB-001",
        descricao: "Cooler para processador Cooler Master Hyper 212 RGB",
        preco: 299.90,
        quantidadeEstoque: 10,
        marcaId: 9,
        image: "assets/products/Cooler Master Hyper 212 RGB.png"
    },
    {
        nome: "Cooler Master MWE 650 Bronze",
        codigo: "PSU-MWE650-001",
        descricao: "Fonte Cooler Master MWE 650W Bronze",
        preco: 399.90,
        quantidadeEstoque: 9,
        marcaId: 9,
        image: "assets/products/Cooler Master MWE 650 Bronze.png"
    },
    {
        nome: "Cooler Master StickleFlow 120",
        codigo: "FAN-STICKLE120-001",
        descricao: "Fan Cooler Master StickleFlow 120mm",
        preco: 99.90,
        quantidadeEstoque: 20,
        marcaId: 9,
        image: "assets/products/Cooler Master StickleFlow 120.png"
    },
    {
        nome: "Corsair 4000D Airflow",
        codigo: "CASE-COR4000D-001",
        descricao: "Gabinete Corsair 4000D Airflow",
        preco: 799.90,
        quantidadeEstoque: 6,
        marcaId: 10,
        image: "assets/products/Corsair 4000D Airflow.png"
    },
    {
        nome: "Corsair CV650 650W Bronze",
        codigo: "PSU-CV650-001",
        descricao: "Fonte Corsair CV650 650W Bronze",
        preco: 449.90,
        quantidadeEstoque: 10,
        marcaId: 10,
        image: "assets/products/Corsair CV650 650W Bronze.png"
    },
    {
        nome: "Corsair iCUE H100i 240mm",
        codigo: "COOL-H100I-001",
        descricao: "Water cooler Corsair iCUE H100i 240mm",
        preco: 699.90,
        quantidadeEstoque: 5,
        marcaId: 10,
        image: "assets/products/Corsair iCUE H100i 240mm.png"
    },
    {
        nome: "Corsair LL120 RGB Kit 3un",
        codigo: "FAN-LL120-001",
        descricao: "Kit com 3 fans Corsair LL120 RGB",
        preco: 499.90,
        quantidadeEstoque: 7,
        marcaId: 10,
        image: "assets/products/Corsair LL120 RGB Kit 3un.png"
    },
    {
        nome: "Corsair Vengeance Pro 16GB DDR4",
        codigo: "RAM-CORV16-001",
        descricao: "Memória RAM Corsair Vengeance Pro 16GB DDR4",
        preco: 399.90,
        quantidadeEstoque: 14,
        marcaId: 10,
        image: "assets/products/Corsair Vengeance Pro 16GB DDR4.png"
    },
    {
        nome: "Deepcool AG400",
        codigo: "COOL-AG400-001",
        descricao: "Cooler Deepcool AG400",
        preco: 179.90,
        quantidadeEstoque: 12,
        marcaId: 11,
        image: "assets/products/Deepcool AG400.png"
    },
    {
        nome: "DXRacer Formula Series",
        codigo: "CHAIR-DXRACER-001",
        descricao: "Cadeira gamer DXRacer Formula Series",
        preco: 1499.90,
        quantidadeEstoque: 4,
        marcaId: 12,
        image: "assets/products/DXRacer Formula Series.png"
    },
    {
        nome: "Elgato 4K60 Pro MK.2",
        codigo: "CAP-ELG4K60-001",
        descricao: "Placa de captura Elgato 4K60 Pro MK.2",
        preco: 1899.90,
        quantidadeEstoque: 3,
        marcaId: 13,
        image: "assets/products/Elgato 4K60 Pro MK.2.png"
    },
    {
        nome: "Elgato HD60 S+",
        codigo: "CAP-ELGHD60-001",
        descricao: "Placa de captura Elgato HD60 S+",
        preco: 1299.90,
        quantidadeEstoque: 4,
        marcaId: 13,
        image: "assets/products/Elgato HD60 S+.png"
    },
    {
        nome: "Gigabyte Z790 Gaming X",
        codigo: "MB-Z790GAMING-001",
        descricao: "Placa-mãe Gigabyte Z790 Gaming X",
        preco: 1499.90,
        quantidadeEstoque: 5,
        marcaId: 14,
        image: "assets/products/Gigabyte Z790 Gaming X.png"
    },
    {
        nome: "HD 2TB",
        codigo: "HD-2TB-001",
        descricao: "HD interno 2TB",
        preco: 449.90,
        quantidadeEstoque: 12,
        marcaId: 38,
        image: "assets/products/HD 2TB.png"
    },
    {
        nome: "HyperX Alloy Origins",
        codigo: "KEY-ALLOY-001",
        descricao: "Teclado mecânico HyperX Alloy Origins",
        preco: 499.90,
        quantidadeEstoque: 8,
        marcaId: 15,
        image: "assets/products/HyperX Alloy Origins.png"
    },
    {
        nome: "HyperX Cloud Stinger",
        codigo: "HEAD-STINGER-001",
        descricao: "Headset HyperX Cloud Stinger",
        preco: 249.90,
        quantidadeEstoque: 14,
        marcaId: 15,
        image: "assets/products/HyperX Cloud Stinger.png"
    },
    {
        nome: "HyperX Pulsefire Core",
        codigo: "MOUSE-PULSECORE-001",
        descricao: "Mouse gamer HyperX Pulsefire Core",
        preco: 149.90,
        quantidadeEstoque: 18,
        marcaId: 15,
        image: "assets/products/HyperX Pulsefire Core.png"
    },
    {
        nome: "HyperX SoloCast",
        codigo: "MIC-SOLOCAST-001",
        descricao: "Microfone HyperX SoloCast",
        preco: 399.90,
        quantidadeEstoque: 9,
        marcaId: 15,
        image: "assets/products/HyperX SoloCast.png"
    },
    {
        nome: "ID-Cooling SE-224",
        codigo: "COOL-SE224-001",
        descricao: "Cooler ID-Cooling SE-224",
        preco: 169.90,
        quantidadeEstoque: 12,
        marcaId: 16,
        image: "assets/products/ID-Cooling SE-224.png"
    },
    {
        nome: "Intel AX210",
        codigo: "WIFI-AX210-001",
        descricao: "Adaptador Wi-Fi Intel AX210",
        preco: 249.90,
        quantidadeEstoque: 10,
        marcaId: 17,
        image: "assets/products/Intel AX210.png"
    },
    {
        nome: "Intel Core i5-12400F",
        codigo: "CPU-I512400F-001",
        descricao: "Processador Intel Core i5-12400F",
        preco: 699.90,
        quantidadeEstoque: 10,
        marcaId: 17,
        image: "assets/products/Intel Core i5-12400F.png"
    },
    {
        nome: "Intel Core i7-13700K",
        codigo: "CPU-I713700K-001",
        descricao: "Processador Intel Core i7-13700K",
        preco: 1899.90,
        quantidadeEstoque: 5,
        marcaId: 17,
        image: "assets/products/Intel Core i7-13700K.png"
    },
    {
        nome: "Intelbras XNB 1200",
        codigo: "UPS-XNB1200-001",
        descricao: "Nobreak Intelbras XNB 1200",
        preco: 699.90,
        quantidadeEstoque: 6,
        marcaId: 18,
        image: "assets/products/Intelbras XNB 1200.png"
    },
    {
        nome: "Kingston Fury 16GB DDR4",
        codigo: "RAM-KFURY16-001",
        descricao: "Memória RAM Kingston Fury 16GB DDR4",
        preco: 349.90,
        quantidadeEstoque: 15,
        marcaId: 19,
        image: "assets/products/Kingston Fury 16GB DDR4.png"
    },
    {
        nome: "Kingston NV2 1TB NVMe",
        codigo: "SSD-KNV2-001",
        descricao: "SSD Kingston NV2 1TB NVMe",
        preco: 499.90,
        quantidadeEstoque: 12,
        marcaId: 19,
        image: "assets/products/Kingston NV2 1TB NVMe.png"
    },
    {
        nome: "Kit Limpeza 5 em 1",
        codigo: "LIMPEZA-KIT5-001",
        descricao: "Kit de limpeza 5 em 1 para computadores",
        preco: 59.90,
        quantidadeEstoque: 25,
        marcaId: 38,
        image: "assets/products/Kit Limpeza 5 em 1.png"
    },
    {
        nome: "LG UltraGear 24 FHD 144Hz",
        codigo: "MON-LG24UG-001",
        descricao: "Monitor LG UltraGear 24 Full HD 144Hz",
        preco: 1199.90,
        quantidadeEstoque: 7,
        marcaId: 20,
        image: "assets/products/LG UltraGear 24 FHD 144Hz.png"
    },
    {
        nome: "Lian Li Lancool 205",
        codigo: "CASE-LIAN205-001",
        descricao: "Gabinete Lian Li Lancool 205",
        preco: 599.90,
        quantidadeEstoque: 6,
        marcaId: 21,
        image: "assets/products/Lian Li Lancool 205.png"
    },
    {
        nome: "Logitech G29 Driving Force",
        codigo: "WHEEL-G29-001",
        descricao: "Volante Logitech G29 Driving Force",
        preco: 1899.90,
        quantidadeEstoque: 4,
        marcaId: 22,
        image: "assets/products/Logitech G29 Driving Force.png"
    },
    {
        nome: "Logitech G203 Lightsync",
        codigo: "MOUSE-G203-001",
        descricao: "Mouse gamer Logitech G203 Lightsync",
        preco: 179.90,
        quantidadeEstoque: 16,
        marcaId: 22,
        image: "assets/products/Logitech G203 Lightsync.png"
    },
    {
        nome: "Logitech G213 Prodigy",
        codigo: "KEY-G213-001",
        descricao: "Teclado Logitech G213 Prodigy",
        preco: 299.90,
        quantidadeEstoque: 12,
        marcaId: 22,
        image: "assets/products/Logitech G213 Prodigy.png"
    },
    {
        nome: "Logitech G435",
        codigo: "HEAD-G435-001",
        descricao: "Headset Logitech G435",
        preco: 499.90,
        quantidadeEstoque: 9,
        marcaId: 22,
        image: "assets/products/Logitech G435.png"
    },
    {
        nome: "Logitech Z633 2623",
        codigo: "SOUND-Z633-001",
        descricao: "Sistema de som Logitech Z633",
        preco: 899.90,
        quantidadeEstoque: 5,
        marcaId: 22,
        image: "assets/products/Logitech Z633 2623.png"
    },
    {
        nome: "Mercusys MA30E AC1200",
        codigo: "WIFI-MA30E-001",
        descricao: "Adaptador Wi-Fi Mercusys MA30E AC1200",
        preco: 119.90,
        quantidadeEstoque: 18,
        marcaId: 23,
        image: "assets/products/Mercusys MA30E AC1200.png"
    },
    {
        nome: "MSI B650 Gaming Plus WiFi",
        codigo: "MB-B650MSI-001",
        descricao: "Placa-mãe MSI B650 Gaming Plus WiFi",
        preco: 1299.90,
        quantidadeEstoque: 6,
        marcaId: 24,
        image: "assets/products/MSI B650 Gaming Plus WiFi.png"
    },
    {
        nome: "NVIDIA RTX 4060 8GB",
        codigo: "GPU-RTX4060-002",
        descricao: "Placa de vídeo NVIDIA RTX 4060 8GB",
        preco: 2099.90,
        quantidadeEstoque: 8,
        marcaId: 2,
        image: "assets/products/NVIDIA RTX 4060 8GB.png"
    },
    {
        nome: "NVIDIA RTX 4070 12GB",
        codigo: "GPU-RTX4070-001",
        descricao: "Placa de vídeo NVIDIA RTX 4070 12GB",
        preco: 3899.90,
        quantidadeEstoque: 4,
        marcaId: 2,
        image: "assets/products/NVIDIA RTX 4070 12GB.png"
    },
    {
        nome: "NZXT Aer RGB 2",
        codigo: "FAN-AERRGB2-001",
        descricao: "Fan NZXT Aer RGB 2",
        preco: 199.90,
        quantidadeEstoque: 12,
        marcaId: 25,
        image: "assets/products/NZXT Aer RGB 2.png"
    },
    {
        nome: "NZXT Kraken X53 240mm",
        codigo: "COOL-KRAKENX53-001",
        descricao: "Water cooler NZXT Kraken X53 240mm",
        preco: 799.90,
        quantidadeEstoque: 5,
        marcaId: 25,
        image: "assets/products/NZXT Kraken X53 240mm.png"
    },
    {
        nome: "Pasta Termica Arctic MX-4",
        codigo: "PASTA-MX4-001",
        descricao: "Pasta térmica Arctic MX-4",
        preco: 49.90,
        quantidadeEstoque: 30,
        marcaId: 26,
        image: "assets/products/Pasta Termica Arctic MX-4.png"
    },
    {
        nome: "Razer Kiyo Pro Webcam",
        codigo: "CAM-KIYOPRO-001",
        descricao: "Webcam Razer Kiyo Pro",
        preco: 799.90,
        quantidadeEstoque: 6,
        marcaId: 27,
        image: "assets/products/Razer Kiyo Pro Webcam.png"
    },
    {
        nome: "Redragon GC-601",
        codigo: "CASE-GC601-001",
        descricao: "Gabinete Redragon GC-601",
        preco: 299.90,
        quantidadeEstoque: 10,
        marcaId: 28,
        image: "assets/products/Redragon GC-601.png"
    },
    {
        nome: "Redragon Griffin",
        codigo: "MOUSE-GRIFFIN-001",
        descricao: "Mouse gamer Redragon Griffin",
        preco: 159.90,
        quantidadeEstoque: 16,
        marcaId: 28,
        image: "assets/products/Redragon Griffin.png"
    },
    {
        nome: "Redragon Kumara K552 RGB",
        codigo: "KEY-K552-001",
        descricao: "Teclado mecânico Redragon Kumara K552 RGB",
        preco: 249.90,
        quantidadeEstoque: 14,
        marcaId: 28,
        image: "assets/products/Redragon Kumara K552 RGB.png"
    },
    {
        nome: "Redragon RGPS 600W",
        codigo: "PSU-RGPS600-001",
        descricao: "Fonte Redragon RGPS 600W",
        preco: 299.90,
        quantidadeEstoque: 10,
        marcaId: 28,
        image: "assets/products/Redragon RGPS 600W.png"
    },
    {
        nome: "Redragon Stellar Preta",
        codigo: "CASE-STELLAR-001",
        descricao: "Gabinete Redragon Stellar Preto",
        preco: 199.90,
        quantidadeEstoque: 12,
        marcaId: 28,
        image: "assets/products/Redragon Stellar Preta.png"
    },
    {
        nome: "Redragon Zeus Pro Branco",
        codigo: "HEAD-ZEUSPRO-001",
        descricao: "Headset Redragon Zeus Pro Branco",
        preco: 399.90,
        quantidadeEstoque: 8,
        marcaId: 28,
        image: "assets/products/Redragon Zeus Pro Branco.png"
    },
    {
        nome: "Samsung 970 Evo 1TB NVMe",
        codigo: "SSD-970EVO-001",
        descricao: "SSD Samsung 970 Evo 1TB NVMe",
        preco: 699.90,
        quantidadeEstoque: 8,
        marcaId: 29,
        image: "assets/products/Samsung 970 Evo 1TB NVMe.png"
    },
    {
        nome: "Samsung Odyssey G5 27 QHD 165Hz",
        codigo: "MON-ODG5-001",
        descricao: "Monitor Samsung Odyssey G5 27 QHD 165Hz",
        preco: 1799.90,
        quantidadeEstoque: 5,
        marcaId: 29,
        image: "assets/products/Samsung Odyssey G5 27 QHD 165Hz.png"
    },
    {
        nome: "Samsung T7 1TB",
        codigo: "SSD-T7-001",
        descricao: "SSD externo Samsung T7 1TB",
        preco: 699.90,
        quantidadeEstoque: 8,
        marcaId: 29,
        image: "assets/products/Samsung T7 1TB.png"
    },
    {
        nome: "Seagate Barracuda 1TB",
        codigo: "HD-BARRACUDA1-001",
        descricao: "HD Seagate Barracuda 1TB",
        preco: 299.90,
        quantidadeEstoque: 15,
        marcaId: 30,
        image: "assets/products/Seagate Barracuda 1TB.png"
    },
    {
        nome: "Seagate Expansion 1TB",
        codigo: "HD-EXPANSION1-001",
        descricao: "HD externo Seagate Expansion 1TB",
        preco: 399.90,
        quantidadeEstoque: 10,
        marcaId: 30,
        image: "assets/products/Seagate Expansion 1TB.png"
    },
    {
        nome: "SMS Station II 1500VA",
        codigo: "UPS-SMS1500-001",
        descricao: "Nobreak SMS Station II 1500VA",
        preco: 999.90,
        quantidadeEstoque: 5,
        marcaId: 31,
        image: "assets/products/SMS Station II 1500VA.png"
    },
    {
        nome: "Sound BlasterX G6",
        codigo: "SOUND-G6-001",
        descricao: "Placa de som Sound BlasterX G6",
        preco: 799.90,
        quantidadeEstoque: 5,
        marcaId: 32,
        image: "assets/products/Sound BlasterX G6.png"
    },
    {
        nome: "ThermalTake UX200 ARGB",
        codigo: "COOL-UX200-001",
        descricao: "Cooler Thermaltake UX200 ARGB",
        preco: 199.90,
        quantidadeEstoque: 10,
        marcaId: 33,
        image: "assets/products/ThermalTake UX200 ARGB.png"
    },
    {
        nome: "Thrustmaster T248",
        codigo: "WHEEL-T248-001",
        descricao: "Volante Thrustmaster T248",
        preco: 2199.90,
        quantidadeEstoque: 3,
        marcaId: 34,
        image: "assets/products/Thrustmaster T248.png"
    },
    {
        nome: "ThunderX3 BC3 Preta",
        codigo: "CHAIR-BC3-001",
        descricao: "Cadeira gamer ThunderX3 BC3 Preta",
        preco: 1199.90,
        quantidadeEstoque: 5,
        marcaId: 35,
        image: "assets/products/ThunderX3 BC3 Preta.png"
    },
    {
        nome: "TP-Link Archer TSE AC1200",
        codigo: "WIFI-TSEAC1200-001",
        descricao: "Adaptador Wi-Fi TP-Link Archer TSE AC1200",
        preco: 149.90,
        quantidadeEstoque: 15,
        marcaId: 4,
        image: "assets/products/TP-Link Archer TSE AC1200.png"
    },
    {
        nome: "WD Blue 1TB",
        codigo: "HD-WDBLUE1-001",
        descricao: "HD Western Digital Blue 1TB",
        preco: 299.90,
        quantidadeEstoque: 14,
        marcaId: 37,
        image: "assets/products/WD Blue 1TB.png"
    },
    {
        nome: "WD Elements 2TB",
        codigo: "HD-WDELEMENTS2-001",
        descricao: "HD externo Western Digital Elements 2TB",
        preco: 499.90,
        quantidadeEstoque: 10,
        marcaId: 37,
        image: "assets/products/WD Elements 2TB.png"
    },
    {
        nome: "WD Green 480GB SATA",
        codigo: "SSD-WDGREEN480-001",
        descricao: "SSD Western Digital Green 480GB SATA",
        preco: 249.90,
        quantidadeEstoque: 15,
        marcaId: 37,
        image: "assets/products/WD Green 480GB SATA.png"
    },
    {
        nome: "XPG Spectrix 32GB DDR5",
        codigo: "RAM-XPG32DDR5-001",
        descricao: "Memória RAM XPG Spectrix 32GB DDR5",
        preco: 799.90,
        quantidadeEstoque: 8,
        marcaId: 36,
        image: "assets/products/XPG Spectrix 32GB DDR5.png"
    }
];

async function buscarProdutos() {
    const resposta = await fetch(`${API_URL}/Produto`);

    if (!resposta.ok) {
        throw new Error(`Erro ao buscar produtos: HTTP ${resposta.status}`);
    }

    return await resposta.json();
}

async function cadastrarProduto(produto) {
    const resposta = await fetch(`${API_URL}/Produto`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(produto)
    });

    const texto = await resposta.text();

    let dados;

    try {
        dados = texto ? JSON.parse(texto) : null;
    } catch {
        dados = texto;
    }

    if (!resposta.ok) {
        throw new Error(
            `HTTP ${resposta.status} - ${typeof dados === "string" ? dados : JSON.stringify(dados)}`
        );
    }

    return dados;
}

async function iniciarCadastro() {
    console.log("========================================");
    console.log("   INFINITYPART - CADASTRO DE PRODUTOS");
    console.log("========================================");

    try {
        const produtosExistentes = await buscarProdutos();

        console.log(`Produtos atualmente na API: ${produtosExistentes.length}`);

        let cadastrados = 0;
        let ignorados = 0;
        let erros = 0;

        for (const produto of produtos) {
            const jaExiste = produtosExistentes.some(
                p => p.codigo?.toLowerCase() === produto.codigo.toLowerCase()
            );

            if (jaExiste) {
                console.log(`⏭️ Já existe: ${produto.nome} (${produto.codigo})`);
                ignorados++;
                continue;
            }

            try {
                const resultado = await cadastrarProduto(produto);

                console.log(`✅ Cadastrado: ${produto.nome}`);
                console.log("   ID:", resultado?.id ?? "não informado");

                cadastrados++;

            } catch (erro) {
                console.error(`❌ Erro: ${produto.nome}`);
                console.error(erro.message);

                erros++;
            }
        }

        console.log("");
        console.log("========================================");
        console.log("             RESULTADO FINAL");
        console.log("========================================");
        console.log(`✅ Cadastrados: ${cadastrados}`);
        console.log(`⏭️ Ignorados:   ${ignorados}`);
        console.log(`❌ Erros:       ${erros}`);
        console.log("========================================");

    } catch (erro) {
        console.error("❌ Não foi possível executar o cadastro.");
        console.error(erro);
    }
}

iniciarCadastro();