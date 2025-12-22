import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { CreateDateColumn, OneToMany } from "typeorm";
import { User } from "../../users/entities/User";
import { Comment } from "./Comment";
import { Like } from "./Likes";

@Entity("posts")
export class Post {
    @PrimaryGeneratedColumn("uuid")
    id!: string;
    
    @Column()
    content!: string;

    @Column({ nullable: true })
    media?: string;

    @Column("text", { array: true , default: [] })
    tags!: string[];

    @CreateDateColumn()
    created_at!: Date;
    
    @ManyToOne(() => User, user => user.tokens, { onDelete: "CASCADE" })
    user!: User;
    
    @OneToMany(() => Like, like => like.post)
    likes!: Like[];

    @OneToMany(() => Comment, (comment) => comment.post)
    comments!: Comment[];
}