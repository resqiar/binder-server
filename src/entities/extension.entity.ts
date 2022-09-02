import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Extension {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column({ nullable: true })
  title: string;

  @Column('text', { nullable: true })
  description: string;

  @Column({ nullable: true })
  image_id: string;

  @Column({ nullable: true })
  image_url: string;

  @Column({ nullable: true })
  youtube_url: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
