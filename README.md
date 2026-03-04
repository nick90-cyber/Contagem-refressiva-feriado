# Contagem Regressiva para Feriados 📅

Um aplicativo web moderno e responsivo para acompanhar a contagem regressiva dos feriados nacionais brasileiros.

## ✨ Funcionalidades
- **Dados em Tempo Real**: Integração com a [BrasilAPI](https://brasilapi.com.br/) para buscar feriados nacionais atualizados.
- **Navegação por Anos**: Visualize feriados de 2024 a 2027 com um clique.
- **Design Moderno**: Interface elegante com tipografia refinada (Poppins/Roboto) e efeitos de glassmorphism.
- **Cálculo Preciso**: Contagem regressiva em tempo real para cada feriado.

## 🛠️ Padrões de Design e Arquitetura
O projeto foi refatorado utilizando boas práticas de desenvolvimento de software:
- **Padrão Repository**: A classe `HolidayService` centraliza o acesso aos dados da API, separando a infraestrutura da lógica de negócio.
- **Programação Orientada a Objetos (OOP)**: O aplicativo é estruturado em classes (`HolidayApp`), facilitando a manutenção e escalabilidade.
- **Cache de Dados**: Implementação de cache local para evitar requisições redundantes à API e melhorar a performance.
- **Design Modular**: CSS e JavaScript organizados em arquivos separados com responsabilidades bem definidas.

## 🚀 Como Executar
Basta abrir o arquivo `index.html` em qualquer navegador moderno. Não é necessário configurar um servidor ou instalar dependências, pois o projeto utiliza JavaScript vanilla.

## 🌐 Tecnologias Utilizadas
- **HTML5**: Estrutura semântica.
- **CSS3**: Estilização moderna e responsiva.
- **JavaScript (ES6+)**: Lógica da aplicação e consumo de API.
- **BrasilAPI**: Fonte de dados dos feriados.