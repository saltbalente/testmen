"use server"

import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { deepseek } from "@ai-sdk/deepseek"

interface ClusterGroup {
  title: string
  keywords: string[]
}

interface ClusterResult {
  mainKeyword: string
  clusters: ClusterGroup[]
}

export async function generateKeywordClusters(
  keyword: string,
  model: "openai" | "deepseek",
  keywordTypes: string[] = [],
  clusterCount = 5,
  keywordsPerCluster = 5,
): Promise<ClusterResult> {
  // Create a description of keyword types for the prompt
  const keywordTypesDescription = getKeywordTypesDescription(keywordTypes)

  const prompt = `
Generate a comprehensive keyword cluster for "${keyword}". 
Create ${clusterCount} distinct category clusters related to the main keyword.
For each cluster:
1. Provide a clear category title
2. List ${keywordsPerCluster} specific keywords related to that category

${keywordTypesDescription ? `IMPORTANT: Focus on generating ${keywordTypesDescription} keywords.` : ""}

Format the response as a valid JSON object with this structure:
{
  "mainKeyword": "the main keyword",
  "clusters": [
    {
      "title": "Category Title 1",
      "keywords": ["keyword 1", "keyword 2", "keyword 3", "keyword 4", "keyword 5"]
    },
    {
      "title": "Category Title 2",
      "keywords": ["keyword 1", "keyword 2", "keyword 3", "keyword 4", "keyword 5"]
    }
  ]
}

Ensure all keywords are relevant to the main topic and each cluster represents a distinct aspect or subtopic.
`

  try {
    let response

    if (model === "openai") {
      response = await generateText({
        model: openai("gpt-4o"),
        prompt,
        temperature: 0.7,
        maxTokens: 2000,
      })
    } else {
      response = await generateText({
        model: deepseek("deepseek-chat"),
        prompt,
        temperature: 0.7,
        maxTokens: 2000,
      })
    }

    // Parse the JSON response
    try {
      const jsonStart = response.text.indexOf("{")
      const jsonEnd = response.text.lastIndexOf("}") + 1
      const jsonString = response.text.substring(jsonStart, jsonEnd)

      const parsedResponse = JSON.parse(jsonString) as ClusterResult
      return parsedResponse
    } catch (parseError) {
      console.error("Error parsing JSON response:", parseError)
      // Fallback to a basic structure if parsing fails
      return {
        mainKeyword: keyword,
        clusters: [
          {
            title: "Error en formato",
            keywords: ["No se pudo procesar la respuesta correctamente. Por favor intenta de nuevo."],
          },
        ],
      }
    }
  } catch (error) {
    console.error("Error generating keyword clusters:", error)
    throw new Error("Failed to generate keyword clusters")
  }
}

// Add this helper function
function getKeywordTypesDescription(types: string[]): string {
  if (types.length === 0) return ""

  const typeDescriptions: Record<string, string> = {
    commercial: "commercial (with purchase intent)",
    transactional: "transactional (focused on completing a specific action)",
    informational: "informational (seeking knowledge or answers)",
    navigational: "navigational (looking for specific websites or pages)",
    local: "local (related to specific geographic locations)",
    longtail: "long-tail (longer, more specific phrases)",
    branded: "branded (containing brand names)",
    competitor: "competitor (related to competing brands or products)",
  }

  const descriptions = types.map((type) => typeDescriptions[type] || type)

  if (descriptions.length === 1) {
    return descriptions[0]
  } else if (descriptions.length === 2) {
    return `${descriptions[0]} and ${descriptions[1]}`
  } else {
    const lastDescription = descriptions.pop()
    return `${descriptions.join(", ")}, and ${lastDescription}`
  }
}
