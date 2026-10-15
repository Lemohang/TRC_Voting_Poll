
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Election } from './elections.entity';
import { Candidate } from '../candidates/candidate.entity';

@Entity({ name: 'election_positions' })
@Index(
  'UQ_election_positions_election_name',
  ['electionId', 'name'],
  { unique: true },
)
export class ElectionPosition {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  electionId!: string;

  @ManyToOne(() => Election, (election) => election.positions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'electionId' })
  election!: Election;

  @Column({ type: 'varchar', length: 150 })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ type: 'integer', default: 1 })
  seatsAvailable!: number;

  @OneToMany(() => Candidate, (candidate) => candidate.position)
  candidates!: Candidate[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}
