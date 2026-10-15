import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialVotingSchema1792020947941 implements MigrationInterface {
    name = 'InitialVotingSchema1792020947941'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('ADMIN', 'VOTER')`);
        await queryRunner.query(`CREATE TYPE "public"."professional_category_enum" AS ENUM('DOCTOR', 'DENTIST', 'PHARMACIST')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "fullName" character varying(150) NOT NULL, "email" character varying(254) NOT NULL, "registrationNumber" character varying(50), "role" "public"."users_role_enum" NOT NULL DEFAULT 'VOTER', "professionalCategory" "public"."professional_category_enum", "passwordHash" character varying(255), "isActive" boolean NOT NULL DEFAULT true, "mustChangePassword" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "UQ_users_registration_number" ON "users" ("registrationNumber") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "UQ_users_email" ON "users" ("email") `);
        await queryRunner.query(`CREATE TABLE "candidates" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "positionId" uuid NOT NULL, "electionId" uuid NOT NULL, "userId" uuid NOT NULL, "manifesto" text, "photoUrl" character varying(500), "isApproved" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_140681296bf033ab1eb95288abb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_candidates_position" ON "candidates" ("positionId") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "UQ_candidates_position_user" ON "candidates" ("positionId", "userId") `);
        await queryRunner.query(`CREATE TABLE "election_positions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "electionId" uuid NOT NULL, "name" character varying(150) NOT NULL, "description" text, "seatsAvailable" integer NOT NULL DEFAULT '1', "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_f7a7443d770280ed883c213327e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "UQ_election_positions_election_name" ON "election_positions" ("electionId", "name") `);
        await queryRunner.query(`CREATE TYPE "public"."elections_status_enum" AS ENUM('DRAFT', 'SCHEDULED', 'OPEN', 'CLOSED', 'CERTIFIED', 'CANCELLED')`);
        await queryRunner.query(`CREATE TABLE "elections" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(200) NOT NULL, "description" text, "status" "public"."elections_status_enum" NOT NULL DEFAULT 'DRAFT', "opensAt" TIMESTAMP WITH TIME ZONE, "closesAt" TIMESTAMP WITH TIME ZONE, "resultsPublished" boolean NOT NULL DEFAULT false, "createdBy" uuid, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "CHK_elections_valid_dates" CHECK ("closesAt" > "opensAt"), CONSTRAINT "PK_21abca6e4191b830d1eb8379cf0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_elections_status" ON "elections" ("status") `);
        await queryRunner.query(`CREATE TABLE "election_voters" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "electionId" uuid NOT NULL, "userId" uuid NOT NULL, "hasVoted" boolean NOT NULL DEFAULT false, "votedAt" TIMESTAMP WITH TIME ZONE, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_29c41a3390da3b6e22aae0872da" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_election_voters_election_voted" ON "election_voters" ("electionId", "hasVoted") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "UQ_election_voters_election_user" ON "election_voters" ("electionId", "userId") `);
        await queryRunner.query(`CREATE TABLE "ballots" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "electionId" uuid NOT NULL, "receiptCode" uuid NOT NULL, "submittedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_3585b67a65b2be733798adde2b7" UNIQUE ("receiptCode"), CONSTRAINT "CHK_ballots_receipt_not_empty" CHECK ("receiptCode" <> ''), CONSTRAINT "PK_1c29cf82a8045f839f8639634e9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "UQ_ballots_election_receipt" ON "ballots" ("electionId", "receiptCode") `);
        await queryRunner.query(`CREATE TABLE "votes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "ballotId" uuid NOT NULL, "positionId" uuid NOT NULL, "candidateId" uuid NOT NULL, "selections" integer NOT NULL DEFAULT '1', "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "CHK_votes_selections_positive" CHECK ("selections" > 0), CONSTRAINT "PK_f3d9fd4a0af865152c3f59db8ff" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "UQ_votes_ballot_position" ON "votes" ("ballotId", "positionId") `);
        await queryRunner.query(`CREATE INDEX "IDX_votes_position_candidate" ON "votes" ("positionId", "candidateId") `);
        await queryRunner.query(`CREATE INDEX "IDX_votes_ballot" ON "votes" ("ballotId") `);
        await queryRunner.query(`CREATE TYPE "public"."audit_action_enum" AS ENUM('USER_CREATED', 'USER_UPDATED', 'USER_DEACTIVATED', 'VOTER_REGISTER_IMPORTED', 'ELECTION_CREATED', 'ELECTION_UPDATED', 'ELECTION_OPENED', 'ELECTION_CLOSED', 'CANDIDATE_CREATED', 'CANDIDATE_APPROVED', 'RESULTS_PUBLISHED', 'ADMIN_LOGIN_SUCCESS', 'ADMIN_LOGIN_FAILED', 'SETTINGS_UPDATED')`);
        await queryRunner.query(`CREATE TABLE "audit_logs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "actorUserId" uuid, "action" "public"."audit_action_enum" NOT NULL, "entityType" character varying(100), "entityId" character varying(100), "metadata" jsonb, "ipAddress" character varying(45), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_1bb179d048bbc581caa3b013439" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_audit_logs_actor" ON "audit_logs" ("actorUserId") `);
        await queryRunner.query(`CREATE INDEX "IDX_audit_logs_created_at" ON "audit_logs" ("createdAt") `);
        await queryRunner.query(`CREATE INDEX "IDX_audit_logs_action" ON "audit_logs" ("action") `);
        await queryRunner.query(`ALTER TABLE "candidates" ADD CONSTRAINT "FK_43a4c8efc690d663b5ad815d8cf" FOREIGN KEY ("positionId") REFERENCES "election_positions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "candidates" ADD CONSTRAINT "FK_a5c9743cdb2b629ccc67fb860f1" FOREIGN KEY ("electionId") REFERENCES "elections"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "candidates" ADD CONSTRAINT "FK_10d0384a816526f8c7f6b1e67b3" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "election_positions" ADD CONSTRAINT "FK_feba140b43f30a04447ea8b3016" FOREIGN KEY ("electionId") REFERENCES "elections"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "election_voters" ADD CONSTRAINT "FK_3d4c0cb92359f5c28c1c1d9cbdf" FOREIGN KEY ("electionId") REFERENCES "elections"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "election_voters" ADD CONSTRAINT "FK_c841e721bc6c2d89d0c397a6e72" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ballots" ADD CONSTRAINT "FK_8300297eca22316e14587086954" FOREIGN KEY ("electionId") REFERENCES "elections"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "votes" ADD CONSTRAINT "FK_89940f932baaed473ae8fd68f54" FOREIGN KEY ("ballotId") REFERENCES "ballots"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "votes" ADD CONSTRAINT "FK_557eb5f5a69d6776c85a46357a4" FOREIGN KEY ("positionId") REFERENCES "election_positions"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "votes" ADD CONSTRAINT "FK_298bec07d3e3d5b91c79ff3e0fd" FOREIGN KEY ("candidateId") REFERENCES "candidates"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "votes" DROP CONSTRAINT "FK_298bec07d3e3d5b91c79ff3e0fd"`);
        await queryRunner.query(`ALTER TABLE "votes" DROP CONSTRAINT "FK_557eb5f5a69d6776c85a46357a4"`);
        await queryRunner.query(`ALTER TABLE "votes" DROP CONSTRAINT "FK_89940f932baaed473ae8fd68f54"`);
        await queryRunner.query(`ALTER TABLE "ballots" DROP CONSTRAINT "FK_8300297eca22316e14587086954"`);
        await queryRunner.query(`ALTER TABLE "election_voters" DROP CONSTRAINT "FK_c841e721bc6c2d89d0c397a6e72"`);
        await queryRunner.query(`ALTER TABLE "election_voters" DROP CONSTRAINT "FK_3d4c0cb92359f5c28c1c1d9cbdf"`);
        await queryRunner.query(`ALTER TABLE "election_positions" DROP CONSTRAINT "FK_feba140b43f30a04447ea8b3016"`);
        await queryRunner.query(`ALTER TABLE "candidates" DROP CONSTRAINT "FK_10d0384a816526f8c7f6b1e67b3"`);
        await queryRunner.query(`ALTER TABLE "candidates" DROP CONSTRAINT "FK_a5c9743cdb2b629ccc67fb860f1"`);
        await queryRunner.query(`ALTER TABLE "candidates" DROP CONSTRAINT "FK_43a4c8efc690d663b5ad815d8cf"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_audit_logs_action"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_audit_logs_created_at"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_audit_logs_actor"`);
        await queryRunner.query(`DROP TABLE "audit_logs"`);
        await queryRunner.query(`DROP TYPE "public"."audit_action_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_votes_ballot"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_votes_position_candidate"`);
        await queryRunner.query(`DROP INDEX "public"."UQ_votes_ballot_position"`);
        await queryRunner.query(`DROP TABLE "votes"`);
        await queryRunner.query(`DROP INDEX "public"."UQ_ballots_election_receipt"`);
        await queryRunner.query(`DROP TABLE "ballots"`);
        await queryRunner.query(`DROP INDEX "public"."UQ_election_voters_election_user"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_election_voters_election_voted"`);
        await queryRunner.query(`DROP TABLE "election_voters"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_elections_status"`);
        await queryRunner.query(`DROP TABLE "elections"`);
        await queryRunner.query(`DROP TYPE "public"."elections_status_enum"`);
        await queryRunner.query(`DROP INDEX "public"."UQ_election_positions_election_name"`);
        await queryRunner.query(`DROP TABLE "election_positions"`);
        await queryRunner.query(`DROP INDEX "public"."UQ_candidates_position_user"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_candidates_position"`);
        await queryRunner.query(`DROP TABLE "candidates"`);
        await queryRunner.query(`DROP INDEX "public"."UQ_users_email"`);
        await queryRunner.query(`DROP INDEX "public"."UQ_users_registration_number"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."professional_category_enum"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    }

}
