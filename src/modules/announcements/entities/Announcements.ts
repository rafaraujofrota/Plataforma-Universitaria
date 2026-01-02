import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { CreateDateColumn, UpdateDateColumn } from "typeorm";
import { User } from "../../users/entities/User";

export const announcementsTypes = ["news", "survey", "invite"] as const

type aTypes = typeof announcementsTypes[number];

@Entity("announcements")
export class Announcements {
    @PrimaryGeneratedColumn("uuid")
    id!: string;
    
    @Column()
    name!: string;

    @Column()
    description!: string;

    @Column({
        type: "enum",
        enum: announcementsTypes
    })
    type!: aTypes;

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
    
    @ManyToOne(() => User, user => user.announcements, { onDelete: "CASCADE" })
    user!: User;
}