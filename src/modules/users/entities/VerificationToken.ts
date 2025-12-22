import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { User } from "./User";

// Lembrar de reusar essa classe no futuro caso outros tokens surjam ( Ex: Esqueci Senha )

@Entity("verification_tokens")
export class VerificationToken {
    @PrimaryGeneratedColumn("uuid")
    id!: number;
    
    @Column()
    token!: string;
    
    @Column()
    expires_at!: Date;
    
    @CreateDateColumn()
    created_at!: Date;
    
    @ManyToOne(() => User, user => user.tokens, { onDelete: "CASCADE" })
    user!: User;
}