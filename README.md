# pass-in

O pass-in é uma aplicação de gestão de participantes em eventos pesenciais.
A ferramenta permite que o organizar cadastre um evento e abara uma página pública de inscrição.

Os participantes inscriotsp odem emitir uma credencial para check-in no dia do evento, e o sistema fará um scan da credencial do participante para permitir ou não sua entrada no evento.

## Requisitos

### Requisitos funcionais

- [x] O organizar deve poder cadatrar um novo evento;
- [x] O organizar deve poder visualizar dados de um evento;
- [x] O organizar deve poder visualizar a lista de participantes do evento;
- [x] O participante deve poder se inscrever em um evento;
- [x] O participante deve poder visualizar seu cracha de inscrição;
- [x] O participante deve poder realizar check-in no evento;

### Regras de negócio

- [x] O participante só pode se inscrever em um evento uma única vez;
- [x] O participante só pode se inscrever em eventos com vagas disponíveis;
- [x] O participante só pode realizar check-in em um evento uma única vez;

### Requisitos não-funcionais

- [x] O check-in no evento será realizado através de um QRCode;

## Tecnologias

- Typescript
- Fastify
- Zod
- SQLite
- PrismaORM
- Swagger

## Documentação da API

Para ter acesso a documentação da API acesse http://localhost:3333/docs

> Nota: URL MUDARÁ CASO O PROJETO SEJA HOSPEADO EM ALGUM SERVIÇO

## Redes sociais e contato

- [Instagram](https://www.instagram.com/antonioalmeida2003/)
- [Linkedin](https://www.linkedin.com/in/antonio-mauricio-4645832b3/)
- antonioimportant@gmail.com