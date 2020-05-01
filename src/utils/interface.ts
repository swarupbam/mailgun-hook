// is transformer required to remove hyphens?

export interface EventPayload {
    readonly signature: Signature;
    readonly "event-data": EventData;
}
export interface Signature {
    readonly timestamp: string;
    readonly token: string;
    readonly signature: string;
}
export interface EventData {
    readonly "recipient-domain": string;
    readonly recipient: string;
    readonly event: string;
    readonly message: Message;
}
export interface Message {
    readonly headers: MessageHeader;
}
export interface MessageHeader {
    readonly subject: string;
    readonly "message-id": string;
    readonly to: string;
    readonly from: string;
}

export interface SnsMessage {
    messageId: string;
    subject: string;
    recipientDomain: string;
    recipinet: string;
    type: string;
}
export interface Response {
    statusCode: number;
    body: string;
}
