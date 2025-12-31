import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { CreateDateColumn, UpdateDateColumn } from "typeorm";
import { User } from "../../users/entities/User";

@Entity("events")
export class Event {
    @PrimaryGeneratedColumn("uuid")
    id!: string;
    
    @Column()
    name!: string;

    @Column()
    description!: string;

    @Column()
    accountable!: string;

    @Column()
    location!: string;

    @Column({ type: "int" })
    duration_minutes!: number; 

    @Column({ type: "timestamp" })
    start!: Date;

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;
    
    @ManyToOne(() => User, user => user.events, { onDelete: "CASCADE" })
    user!: User;
}