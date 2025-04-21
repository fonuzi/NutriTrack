# OpenAI Integration Guide for PERFORMIZE

This guide explains how to set up and configure the OpenAI API integration for the PERFORMIZE app.

## What is it used for?

PERFORMIZE uses OpenAI's GPT-4o API to analyze food images and provide detailed nutritional information, including:
- Food identification
- Calorie counts
- Macronutrient breakdown (protein, carbs, fat)
- Portion size estimates

## Setting Up Your OpenAI API Key

### 1. Get an API Key

1. Go to [OpenAI's platform](https://platform.openai.com/signup)
2. Create an account or sign in
3. Navigate to the [API keys section](https://platform.openai.com/api-keys)
4. Click "Create new secret key"
5. Give it a name (e.g., "PERFORMIZE App")
6. Copy the generated key immediately (it won't be shown again)

### 2. Add the API Key to the App

#### Option A: Development Environment

1. Open the `.env` file in the root of the project
2. Replace the placeholder with your actual API key:
   ```
   OPENAI_API_KEY=your_actual_api_key_here
   ```
3. Save the file

#### Option B: For Production Builds

For security in production environments, we recommend using a more secure approach:

##### iOS Secure Storage (Keychain):

Add code to securely store and retrieve the API key using the iOS Keychain.

1. Open `src/api/openai.ts`
2. Find the line:
   ```typescript
   const OPENAI_API_KEY = '';
   ```
3. Replace this with code to retrieve the key from the Keychain

### 3. Usage and Rate Limits

- The OpenAI API is billed based on usage
- The GPT-4o model costs approximately $10 per 1000 image analysis requests
- Set user limits to avoid unexpected costs
- Monitor your usage in the [OpenAI dashboard](https://platform.openai.com/usage)

### 4. Testing the Integration

1. Run the app in development mode
2. Navigate to the Camera screen
3. Take a photo of a food item
4. The app should analyze the image and display nutritional information

If it doesn't work:
- Check that your API key is correct
- Verify network connectivity
- Ensure your OpenAI account has a valid payment method
- Check the OpenAI status page for service disruptions

### 5. Error Handling

The app includes built-in error handling for API issues. If the API fails:
- Users will see a friendly error message
- The app will prompt to try again or enter details manually
- Errors are logged for debugging

### 6. Privacy Considerations

When using the OpenAI API:
- User food images are sent to OpenAI's servers for processing
- OpenAI may retain data temporarily for service improvement
- Include this information in your privacy policy
- Allow users to opt out if needed

## Support

If you encounter issues with the OpenAI integration:
- Check OpenAI's [status page](https://status.openai.com/)
- Review the [API documentation](https://platform.openai.com/docs/guides/vision)
- Contact our support team for assistance