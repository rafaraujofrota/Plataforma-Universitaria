import { CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { User } from "../../users/entities/User";
import { Comment } from "./Comment";
import { Post } from "./Post";

@Entity("likes")
@Unique(["user", "post"])     
@Unique(["user", "comment"])
export class Like {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne(() => User, user => user.likes, { onDelete: "CASCADE" })
    user!: User;

    @ManyToOne(() => Post, post => post.likes, {
        nullable: true,
        onDelete: "CASCADE"
    })
    post?: Post;

    @ManyToOne(() => Comment, comment => comment.likes, {
        nullable: true,
        onDelete: "CASCADE"
    })
    comment?: Comment;

    @CreateDateColumn()
    created_at!: Date;
}