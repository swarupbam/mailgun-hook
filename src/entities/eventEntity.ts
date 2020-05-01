import { Column, CreatedAt, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({
    freezeTableName: true,
    timestamps: true,
    updatedAt: false,
    tableName: "event"
})
class EventEntity extends Model<EventEntity> {
    @PrimaryKey
    @Column({ allowNull: false, field: "message_id" })
    public messageId: string;

    @Column({
        allowNull: false,
        field: "recipient_domain"
    })
    public recipientDomain: string;

    @Column({ allowNull: false })
    public recipient: string;

    @Column({ allowNull: false })
    public type: string;

    @Column({ allowNull: false })
    public subject: string;

    @CreatedAt
    @Column({ allowNull: false })
    public createdAt: Date;
}
export default EventEntity;
