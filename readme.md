# YZ Perfumaria

Catálogo online de perfumaria e cosméticos, com carrinho de compras, painel administrativo e finalização de pedidos pelo WhatsApp.

O projeto foi pensado para pequenos negócios que querem vender sem a complexidade de uma loja virtual completa: o proprietário gerencia os produtos pelo próprio celular e o cliente conclui o pedido em uma conversa.

Abra o projeto no nageador
[Prévia do site](https://yz-perfumaria.vercel.app/)

## Destaques

- Interface elegante e responsiva, com foco em limpeza visual e bem-estar
- Catálogo filtrável por categoria: Perfumes, Cabelos, Maquiagem e Pele
- Badges de **Promoção**, **Novo** e **Mais vendido**, com preço anterior riscado nas promoções
- Carrinho com controle de quantidade, subtotal por item e total da compra
- Pedido enviado ao WhatsApp em mensagem organizada e pronta para atendimento
- Painel administrativo com login, para cadastrar, editar e excluir produtos e imagens
- Catálogo atualizado em tempo real, sem recarregar a página

## Tecnologias

| Camada | Tecnologia |
|---|---|
| Interface | HTML, CSS e JavaScript (ES Modules) |
| Banco de dados | Firebase Firestore |
| Autenticação | Firebase Authentication |
| Imagens | Cloudinary |

## Como funciona

```
Cliente ──► Site (HTML/CSS/JS) ──► Firestore (produtos, em tempo real)
                │
                └──► WhatsApp (pedido formatado)

Administrador ──► Login (Firebase Auth) ──► Painel ──► Firestore + Cloudinary (imagens)
```

O site é estático e usa serviços em nuvem no lugar de um servidor próprio. A escrita no banco é restrita ao administrador por regras de segurança do Firestore.

## Executando localmente

1. Clone o repositório:
   ```bash
   git clone https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git
   ```
2. Abra a pasta e inicie um servidor local (por exemplo, a extensão **Live Server** do VS Code).
3. Acesse o endereço indicado no navegador.

Sem credenciais configuradas, o site abre em **modo demonstração**, com produtos de exemplo, e é possível testar o catálogo, o carrinho e o painel.

Para conectar ao seu próprio Firebase e Cloudinary, edite o objeto `CONFIG` no início do arquivo JavaScript.

## Estrutura

```
├── index.html
├── style.css
├── script.js
└── README.md
```

## Próximos passos

- Remoção automática das imagens no Cloudinary ao excluir um produto
- Dados do cliente (nome e endereço) incluídos no pedido
- Busca de produtos
- Histórico de pedidos

## Autor

Desenvolvido por **Alan Dias** · [LinkedIn](https://www.linkedin.com/in/alanpedrodiasdesenvolvedor/?isSelfProfile=true) · [Portfólio](https://portfolio-alan-dias-liart.vercel.app/)