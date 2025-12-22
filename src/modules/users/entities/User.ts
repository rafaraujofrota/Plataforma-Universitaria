import { OneToMany, JoinColumn, OneToOne } from "typeorm"
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { VerificationToken } from './VerificationToken';

import { Profile } from "./Profile";
import { Post } from "../../posts/entities/Post";
import { Comment } from "../../posts/entities/Comment";
import { Like } from "../../posts/entities/Likes";

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

    // Relações

    @OneToOne(() => Profile, (profile) => profile.user, { cascade: true, onDelete: "CASCADE" })
    @JoinColumn() 
    profile!: Profile;

    @OneToMany(() => VerificationToken, token => token.user)
    tokens!: VerificationToken[];

    @OneToMany(() => Post, (post) => post.user)
    posts!: Post[];

    @OneToMany(() => Comment, (comment) => comment.author)
    comments!: Comment[];

    @OneToMany(() => Like, (like) => like.user)
    likes!: Like[];
}