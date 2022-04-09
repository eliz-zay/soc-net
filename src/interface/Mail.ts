export interface Mail {
    destinationAddresses: string[];
    sourseAddress: string;
    senderName: string;
    subject: string;
    html?: string;
    text?: string;
}
