import { OneToMany, JoinColumn, OneToOne } from "typeorm"
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { VerificationToken } from './VerificationToken';
import { Profile } from "./Profile";

@Entity('users') 
export class User {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    name!: string;

    @Column()
    email!: string;

    @CreateDateColumn()
    created_at!: Date;

    @Column({ default: false })
    verified!: boolean; 

    @Column()
    password!: string;

    @OneToOne(() => Profile, (profile) => profile.user, { cascade: true, onDelete: "CASCADE" })
    @JoinColumn() 
    profile!: Profile;

    @OneToMany(() => VerificationToken, token => token.user, { cascade: true })
    tokens!: VerificationToken[];
}