import { Injectable } from '@nestjs/common';
import { AIKey } from 'config';
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: AIKey,
  baseURL: 'https://api.together.xyz/v1',
});

@Injectable()
export class AIService {
  constructor() {}
  async generatePrediction(data: {
    conditions: any;
    characteristics: any;
    players: any;
  }) {
    const response = await client.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an expert travel guide.',
        },
        {
          role: 'user',
          content: 'Tell me fun things to do in San Francisco.',
        },
      ],
      model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
    });

    const output = response.choices[0].message.content;
    console.log(output);
    return output;
  }
}
