
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum UserRole {
  ADMIN = 'ADMIN',
  VOTER = 'VOTER',
}

export enum ProfessionalCategory {
  DOCTOR = 'DOCTOR',
  DENTIST = 'DENTIST',
  PHARMACIST = 'PHARMACIST',
}

@Entity({ name: 'users' })
@Index('UQ_users_email', ['email'], { unique: true })
@Index('UQ_users_registration_number', ['registrationNumber'], {
  unique: true,
})
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 150 })
  fullName!: string;

  @Column({ type: 'varchar', length: 254 })
  email!: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  registrationNumber!: string | null;

  @Column({
    type: 'enum',
    enum: UserRole,
    enumName: 'users_role_enum',
    default: UserRole.VOTER,
  })
  role!: UserRole;

  @Column({
    type: 'enum',
    enum: ProfessionalCategory,
    enumName: 'professional_category_enum',
    nullable: true,
  })
  professionalCategory!: ProfessionalCategory | null;

  @Column({
    type: 'varchar',
    length: 255,
    select: false,
    nullable: true,
  })
  passwordHash!: string | null;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @Column({ type: 'boolean', default: false })
  mustChangePassword!: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;

  @BeforeInsert()
  @BeforeUpdate()
  normalizeEmail(): void {
    if (this.email) {
      this.email = this.email.trim().toLowerCase();
    }

    if (this.registrationNumber) {
      this.registrationNumber = this.registrationNumber.trim();
    }
  }
}
