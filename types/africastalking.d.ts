declare module 'africastalking' {
  interface Credentials {
    apiKey: string;
    username: string;
  }

  interface SMSOptions {
    to: string | string[];
    message: string;
    senderId?: string;
    enqueue?: boolean;
  }

  interface SMSResponse {
    SMSMessageData: {
      Recipients: Array<{
        number: string;
        status: string;
        statusCode: number;
        cost: string;
      }>;
    };
  }

  interface SMSService {
    send(options: SMSOptions): Promise<SMSResponse>;
  }

  interface AfricasTalkingInstance {
    SMS: SMSService;
  }

  function AfricasTalking(credentials: Credentials): AfricasTalkingInstance;
  export = AfricasTalking;
}
