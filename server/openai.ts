import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: 
            "You are a nutrition expert specialized in analyzing food images. " +
            "When shown a food image, identify all food items, estimate their portion sizes, and provide detailed nutritional information. " +
            "Respond with JSON in this format exactly: { " +
            "'name': String (overall meal name), " +
            "'calories': Number (total calories), " +
            "'protein': Number (total protein in grams), " +
            "'carbs': Number (total carbs in grams), " +
            "'fat': Number (total fat in grams), " +
            "'items': Array of { 'name': String, 'amount': String, 'calories': Number } " +
            "}"
        },
        {
          role: "user",
          content: [
            { type: "text", text: "What food is in this image? Provide nutritional details in JSON format." },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ],
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 800,
    });

    // Safely parse the response content, ensuring it's not null
    const content = response.choices[0].message.content || '{}';
    const resultJson = JSON.parse(content);
    
    // Ensure we have all the required fields with proper formatting
    const result: FoodAnalysisResult = {
      name: resultJson.name || "Unknown Food",
      calories: Number(resultJson.calories) || 0,
      protein: Number(resultJson.protein) || 0,
      carbs: Number(resultJson.carbs) || 0,
      fat: Number(resultJson.fat) || 0,
      items: Array.isArray(resultJson.items) 
        ? resultJson.items.map((item: any) => ({
            name: item.name || "Unknown Item",
            amount: item.amount || "Unknown Amount",
            calories: Number(item.calories) || 0
          }))
        : []
    };
    
    return result;
  } catch (error) {
    console.error("Error analyzing food image with OpenAI:", error);
    throw new Error("Failed to analyze food image");
  }
}