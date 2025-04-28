import { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // Check if API key is available
  if (!DEEPSEEK_API_KEY) {
    console.error('Missing DeepSeek API key');
    return res.status(500).json({ error: 'API configuration error' });
  }

  try {
    console.log('Sending request to DeepSeek with text:', req.body.text.substring(0, 50) + '...');
    
    const response = await axios.post(
      'https://api.deepseek.com/v1/chat/completions',
      {
        model: "deepseek-chat",
        messages: [
          {
            role: "user",
            content: `Extract 7 relevant tags from the following text. ONLY return a comma-separated list, no explanations, no numbering, no extra text.\n\n${req.body.text}`
          }
        ],
        temperature: 0.2
      },
      {
        headers: {
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json',
        }
      }
    );

    console.log('DeepSeek API response:', JSON.stringify(response.data));

    // Extract and format the response
    const content = response.data.choices[0]?.message?.content || "";
    console.log('Extracted content:', content);
    
    // Split comma-separated tags and clean them up
    const tags = content.split(',')
      .map((tag: string) => tag.trim()) // Explicitly type 'tag' as string
      .filter((tag: string) => tag.length > 0); // Explicitly type 'tag' as string
    
    console.log('Processed tags:', tags);
    res.status(200).json({ tags });
  } catch (error: any) {
    console.error('DeepSeek API Error Details:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data
    });
    
    res.status(500).json({ 
      error: 'Failed to call DeepSeek API',
      details: error.response?.data || error.message
    });
  }
}