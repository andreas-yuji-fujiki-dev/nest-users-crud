# TERMOS IMPORTANTES

## Dependência
Dependência = qualquer coisa que seu código precisa pra funcionar
Exemplo: `import axios from 'axios'` -> Isso é uma dependência
Outro exemplo: Uma classe UserService, que no `constructor` define que ela inicia um módulo externo por exemplo o `PrismaService`, pois nesse caso, essa classe DEPENDE do PrismaService, então se o Prisma muda, seu service quebra, e se trocar o banco, seu service quebra.
Então, quanto mais importante o código, menos ele deve depender de fatores externos.


```ts
class Pessoa {
  constructor( private readonly nome, private readonly idade, private readonly profissao ){}
}
```

## Entity
É o "objeto de negócio", não é banco, não é prisma, é o CONCEITO.
Por exemplo:
```ts
class User {
  constructor(
    public user_name!: string,
    public email!: string
  )
}
```
Isso acima representa um usuário NA LÓGICA, não no banco.

## Service
É onde fica a regra de negócio

## Utils
São funções reutilizáveis para qualquer propósito, por exemplo, normalizar um email:
```ts
export function normalizeEmail(email: string) {
  return email.toLowerCase().trim();
}
```

## Inversão de dependência
No Nest, já fazemos isso talvez 'sem perceber', por exemplo em cada service:
```ts
constructor( private readonly prisma: PrismaService) {}
```
Então não criamos o Prisma, o Nest injeta para nós

## Use Case (use-case)
É uma ação do sistema, por exemplo: criar um usuário, atualizar um usuário, deletar um usuário -> Tudo isso, são USE CASES

## Interface
É um CONTRATO, tipo uma promessa (promisse), por exemplo:
```ts
interface UserRepository {
  create(data): Promise<User>
}
```
Esse código acima diz: "qualquer coisa que implemente isso, precisa ter esse método"

## Port
É o mesmo que interface, só muda o nome dependendo da arquitetura, no caso você chama Interface de `Port` na arquitetura hexagonal.
Port = forma de entrar/sair do sistema, ou seja, formato de entrada e saída, ou melhor: PORT é como você define o formato do que entra, e do que sai.

## Adapter
É quem IMPLEMENTA a PORT, por exemplo:
```ts
class PrismaAdapter implements UserRepositoryPort {
  create(data) {
    return prisma.user.create( { data } )
  }
}
```
Aqui, estamos ADAPTANDO o mundo externo (Prisma) pro sistema (port), então é como se PORT fosse o MODELO, mas não define a execução, apenas o formato de entrada e saída, enquanto que o ADAPTER é o que realmente lida com dados e faz alterações, daí, então, temos PORTS como um MODELO, e ADAPTER como a EXECUÇÃO, e, você pode ver também como: PORT = Blueprint, ADAPTER = Construção.

## Implements
Ligado a INTERFACES, é algo muito essencial, exemplo:
```ts
import UserRepository from "x/y/z";

class PrismaUserRepository implements UserRepository {
  create(data) {
    return prisma.user.create({ data })
  }
}
```
Esse `implements` significa: "ESSA CLASSE SEGUE O CONTRATO DA INTERFACE", então, na INTERFACE você tipou que, qualquer classe que EXTENDA a INTERFACE, DEVE retornar uma PROMISE com a tipagem de USUÁRIO, daí você tem um modelo de como as coisas devem ser feitas/rodar.

## Infra
Infraestrutura = coisas externas
Exemplos: Prisma, database, API externa, filesystem, VPS (servidor), etc.
Então por exemplo quando você define um service `PrismaService`, esse serviço se aproxima mais da camada mais externa da arquitetura.




# ARQUITETURAS
Antes de tudo, é bom saber que todas essas arquiteturas são variações da mesma coisa, que é: SEPARAR A REGRA DE NEGÓCIO DO RESTO
(framework, banco, etc.) Então, seriam básicamente formas diferentes de fazer isso aqui: controller -> lógica/regra de negócio -> banco

## Clean Architecture
A ideia é que o núcleo da aplicação não dependa de nada externo, seguindo uma estrutura mental como:
Controller -> Use Case -> Entity -> Interface -> Infra (prisma, http, etc.)

## Hexagonal Architecture (Ports & Adapters)
A ideia é que o sistema é um NÚCLEO com portas de entrada e saída.
Visualmente, seria: Controller (entrada) -> CORE -> Database (saída)

## Onion Architecture
É tipo Clean, mas em camadas concêntricas:
- CORE (regra de negócio pura)
- DOMAIN
- APPLICATION
- INFRASTRUCTURE
Quanto mais pra dentro das camadas, menos dependências

## Arquitetura distribuída
É você ter diferentes sistemas separados, por exemplo:
- API de usuários
- API de pagamentos
- API de notificações

## Microserviços
É um tipo de arquitetura distribuída, onde, ao invés de um backend grande, você tem vários pequenos.
Por exemplo:
- users-service
- orders-service
- auth-service