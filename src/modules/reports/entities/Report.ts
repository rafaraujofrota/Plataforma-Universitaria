import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { CreateDateColumn, UpdateDateColumn } from "typeorm";
import { User } from "../../users/entities/User";

export const reportTypes = ["news", "survey", "invite"] as const

type rTypes = typeof reportTypes[number];

@Entity("reports")
export class Report {
    @PrimaryGeneratedColumn("uuid")
    id!: string;
    
    @Column()
    name!: string;

    @Column()
    description!: string;

    @Column({
        type: "enum",
        enum: reportTypes
    })
    type!: rTypes;

    @Column({ nullable: true })
    link?: string;

    @Column({ type: "timestamp", nullable: true })
    start?: Date;

    @Column({ type: "timestamp", nullable: true })
    end?: Date;

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;
    
    @ManyToOne(() => User, user => user.reports, { onDelete: "CASCADE" })
    user!: User;
}