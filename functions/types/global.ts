import { AWSError } from "aws-sdk";
import { SearchFacesByImageResponse } from "aws-sdk/clients/rekognition";
import { PromiseResult } from "aws-sdk/lib/request";

export interface SendVoiceResponse {
  statusCode: number;
  headers: {
    "Content-Type": string;
  };
  body: string;
  isBase64Encoded: boolean;
}

export interface SendResponse {
  statusCode: number;
  headers: {
    "Content-Type": string;
  };
  body: string;
}
