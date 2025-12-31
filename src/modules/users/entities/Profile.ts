import { Entity, PrimaryGeneratedColumn, Column, OneToOne, UpdateDateColumn } from "typeorm";
import { User } from "./User";

export const profileTypes = ["student", "employee", "teacher", "admin"] as const

type pTypes = typeof profileTypes[number];

@Entity("profiles")
export class Profile {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ nullable: true })
    avatar?: string;

    @Column({ nullable: true })
    bio?: string;

    @Column({ nullable: true })
    organization?: string;

    @Column({ nullable: true })
    registration?: string;

    @Column({ nullable: true })
    course?: string;

    @Column({
        default: profileTypes[0],
        type: "enum",
        enum: profileTypes
    })
    type!: pTypes;

    @OneToOne(() => User, (user) => user.profile)
    user!: User;

    @UpdateDateColumn()
    updated_at!: Date;
}