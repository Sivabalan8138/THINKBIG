export declare const sendRegistrationEmail: (email: string, teamName: string, teamId: string, qrPassUrl: string, hallTicketUrl: string) => Promise<void>;
export declare const sendSubmissionEmail: (email: string, teamName: string) => Promise<void>;
export declare const sendResultEmail: (email: string, teamName: string, rank: number, domainRank: number, score: number) => Promise<void>;
export declare const sendCertificateEmail: (email: string, teamName: string, certificatePath: string) => Promise<void>;
//# sourceMappingURL=emailService.d.ts.map