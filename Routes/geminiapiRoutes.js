const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize with configuration
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// List of models to try in order of preference
const AVAILABLE_MODELS = [
  "gemini-1.5-pro-latest",
  "gemini-1.0-pro",
  "models/gemini-pro"  // Some versions require this prefix
];

router.post('/enhance', async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt?.trim()) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    let lastError = null;
    let successfulResponse = null;

    // Try each model until one works
    for (const modelName of AVAILABLE_MODELS) {
      try {
        const model = genAI.getGenerativeModel({
          model: 'gemini-1.5-flash',
          generationConfig: {
            temperature: 0.7,
            topP: 0.9,
            maxOutputTokens: 2048,
          }
        });

        const result = await model.generateContent({
          contents: [{
            role: "user",
            parts: [{ 
              text: `Improve and enhance this text while maintaining its original meaning. 
              Make it more professional, engaging and suitable for event sponsorship proposals: 
              ${prompt}` 
            }]
          }]
        });
        
        const response = await result.response;
        successfulResponse = {
          success: true,
          enhancedText: response.text(),
          modelUsed: modelName
        };
        break; // Exit loop if successful
      } catch (error) {
        console.log(`Attempt with model ${modelName} failed:`, error.message);
        lastError = error;
        continue; // Try next model
      }
    }

    if (!successfulResponse) {
      throw lastError || new Error('All model attempts failed');
    }

    return res.json(successfulResponse);

  } catch (error) {
    console.error('Final Gemini Error:', error);
    
    // Get available models for debugging
    let availableModels = [];
    try {
      const models = await genAI.listModels();
      availableModels = models.map(m => m.name);
    } catch (e) {
      console.error('Could not fetch available models:', e);
    }

    res.status(500).json({
      success: false,
      error: 'AI enhancement failed',
      details: error.message,
      suggestion: 'Please try again with different wording',
      availableModels, // Send available models to client
      apiVersion: 'v1beta' // Show which API version was used
    });
  }
});

module.exports = router;