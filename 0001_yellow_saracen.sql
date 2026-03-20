CREATE TABLE `clientes` (
	`id` varchar(36) NOT NULL,
	`userId` int NOT NULL,
	`nome` varchar(255) NOT NULL,
	`cpf` varchar(14),
	`rg` varchar(20),
	`telefone` varchar(20),
	`email` varchar(255),
	`endereco` varchar(255),
	`bairro` varchar(100),
	`cidade` varchar(100),
	`dataNascimento` varchar(10),
	`observacoes` longtext,
	`criadoEm` timestamp NOT NULL DEFAULT (now()),
	`atualizadoEm` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `clientes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `evolucoes` (
	`id` varchar(36) NOT NULL,
	`clienteId` varchar(36) NOT NULL,
	`data` varchar(10) NOT NULL,
	`procedimento` varchar(255) NOT NULL,
	`observacoes` longtext,
	`profissional` varchar(255),
	`criadoEm` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `evolucoes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `fichas` (
	`id` varchar(36) NOT NULL,
	`clienteId` varchar(36) NOT NULL,
	`tipo` enum('avaliacao-corporal','avaliacao-facial','anamnese-gluteos') NOT NULL,
	`dados` json NOT NULL,
	`criadoPor` varchar(255),
	`criadoEm` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `fichas_id` PRIMARY KEY(`id`)
);
