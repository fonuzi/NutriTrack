import OpenAI from 'openai';

// In a production app, this would be retrieved from a secure source like environment variables
// or a configuration service. For this prototype, we'll leave it empty.
const OPENAI_API_KEY = '';

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

export interface FoodItem {
  name: string;
  amount: string;
  calories: number;
}

export interface FoodAnalysisResult {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  items: FoodItem[];
}

export async function analyzeFoodImage(base64Image: string): Promise<FoodAnalysisResult> {
  try {
    // The system message instructs the model how to analyze the food image
    const systemMessage = `
You are a professional nutritionist specializing in food analysis from images.
Analyze the food image and return a detailed nutritional breakdown with the following JSON format:
{
  "name": "Brief name of the dish/meal",
  "calories": total calories (number),
  "protein": protein in grams (number),
  "carbs": carbohydrates in grams (number),
  "fat": fat in grams (number),
  "items": [
    {
      "name": "Name of food item",
      "amount": "Estimated amount (e.g., '1 cup', '2 oz')",
      "calories": estimated calories for this item (number)
    }
  ]
}
Make sure all numeric values are numbers, not strings. Provide your best estimate based on the visible foods.
`;

    // Call the OpenAI API with the image
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024
      messages: [
        {
          role: "system",
          content: systemMessage,
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Please analyze this food image and provide nutritional information.",
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`,
              },
            },
          ],
        },
      ],
      response_format: { type: "json_object" },
      max_tokens: 800,
    });

    // Parse the response
    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content in OpenAI response");
    }

    // Parse the JSON response
    const data = JSON.parse(content);

    // Validate the result has the expected format
    if (!data.name || typeof data.calories !== 'number') {
      throw new Error("Invalid response format from OpenAI");
    }

    const result: FoodAnalysisResult = {
      name: data.name,
      calories: data.calories,
      protein: data.protein || 0,
      carbs: data.carbs || 0, 
      fat: data.fat || 0,
      items: Array.isArray(data.items) ? data.items : [],
    };

    return result;
  } catch (error) {
    console.error("Error analyzing food image:", error);
    throw error;
  }
}