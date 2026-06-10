import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

// Initialize the GenAI client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { image } = body; // base64 string

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    // Prepare the image part. The input image format should be data:image/jpeg;base64,...
    const base64Data = image.split(',')[1] || image;
    const mimeType = image.split(';')[0].split(':')[1] || 'image/jpeg';

    const systemPrompt = `You are an expert AI Food Nutritionist. Your task is to analyze food images (especially Indian foods like Biryani, Idli, Dosa, etc.) and accurately estimate their nutritional content.
Identify all distinct food items visible on the plate.
CRITICAL RULES:
- Group identical or very similar foods into a SINGLE item and sum their weights/macros (e.g. if there are 3 idlis, return ONE item named "Idli" with the total weight and macros).
- Do NOT return duplicate items.
- Always use standard, consistent, short singular names (e.g. "Idli" instead of "Idlis", "Chicken Biryani" instead of "Biryani, Chicken").

For each distinct item, estimate:
1. name: Specific food name (short, singular, consistent)
2. weight_grams: Estimated total weight in grams
3. calories: Total calories
4. protein: Protein in grams
5. carbs: Carbohydrates in grams
6. fat: Fat in grams
7. fiber: Fiber in grams
8. confidence: Confidence score (0-100) based on visibility and recognition
9. healthy_alternative: A healthier alternative to this food

Return ONLY a JSON array containing objects for each identified food item.
Format:
[
  {
    "name": "Chicken Biryani",
    "weight_grams": 250,
    "calories": 400,
    "protein": 18,
    "carbs": 45,
    "fat": 15,
    "fiber": 2,
    "confidence": 85,
    "healthy_alternative": "Quinoa Biryani or less oil"
  }
]
Do not include any other text, markdown formatting blocks, or explanations.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        { role: 'user', parts: [
            { text: systemPrompt },
            { inlineData: { data: base64Data, mimeType } }
          ] 
        }
      ],
      config: {
        responseMimeType: 'application/json',
        temperature: 0.0,
      }
    });

    let aiText = response.text || "[]";
    
    // Robust JSON extraction
    const match = aiText.match(/\[[\s\S]*\]/);
    if (match) {
      aiText = match[0];
    } else if (aiText.includes('{')) {
      // It might have returned a single object instead of an array
      const objMatch = aiText.match(/\{[\s\S]*\}/);
      if (objMatch) {
        aiText = `[${objMatch[0]}]`;
      } else {
        aiText = "[]";
      }
    } else {
      aiText = "[]";
    }

    const parsedData = JSON.parse(aiText);

    return NextResponse.json({ items: parsedData });

  } catch (error: any) {
    console.error('AI Food Recognition Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to process image' }, { status: 500 });
  }
}
