
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Election } from '../elections/elections.entity';
import { JoinColumn, ManyToOne } from 'typeorm';

@Entity({ name: 'ballots' })
@Index('UQ_ballots_election_receipt', ['electionId', 'receiptCode'], {
  unique: true,
})

export class Ballot {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  electionId!: string;

  @ManyToOne(() => Election, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'electionId' })
  election!: Election;

  @Column({ type: 'uuid', unique: true })
  receiptCode!: string;

  @CreateDateColumn({ type: 'timestamptz' })
  submittedAt!: Date;
}
