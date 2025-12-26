import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, RelationId } from "typeorm";
import { CreateDateColumn, OneToMany } from "typeorm"
import { User } from "../../users/entities/User";
import { Post } from "./Post";
import { Like } from "./Likes";

@Entity("comments")
export class Comment {
    @PrimaryGeneratedColumn("uuid")
    id!: string;
    
    @Column()
    content!: string;

    @Column({ nullable: true })
    media?: string;
    
    @CreateDateColumn()
    created_at!: Date;

    @ManyToOne(() => Post, post => post.comments, { onDelete: "CASCADE" })
    post!: Post;

    @ManyToOne(() => User, user => user.comments, { onDelete: "CASCADE" })
    author!: User;

    @OneToMany(() => Like, like => like.comment)
    likes!: Like[];

    // Subcomentários

    @ManyToOne(() => Comment, comment => comment.children, { nullable: true, onDelete: "CASCADE" })
    parent?: Comment;

    @RelationId((comment: Comment) => comment.parent)
    parentId?: string | null;

    @OneToMany(() => Comment, comment => comment.parent)
    children!: Comment[];
}