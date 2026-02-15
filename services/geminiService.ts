
import { GoogleGenAI, Type } from "@google/genai";
import { LoanEntry } from "../types.ts";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateSmartComments = async (entry: Partial<LoanEntry>) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a brief professional inspection comment in Bengali for the following MFI loan entry. 
      Borrower Info: ${entry.borrowerInfo}
      Loan Amount: ${entry.loanAmount}
      Loan Sector: ${entry.loanSector}
      Purpose: Verify if used for correct purpose and policy compliance.
      Output ONLY the comment in Bengali.`,
    });
    return response.text?.trim() || "কোন মন্তব্য পাওয়া যায়নি।";
  } catch (error) {
    console.error("Error generating comments:", error);
    return "স্বয়ংক্রিয় মন্তব্য তৈরিতে সমস্যা হয়েছে।";
  }
};

export const summarizeReport = async (entries: LoanEntry[]) => {
    if (entries.length === 0) return "কোন ডাটা নেই।";
    
    const summaryData = entries.map(e => ({
        amount: e.loanAmount,
        sector: e.loanSector,
        comment: e.inspectionComments
    }));

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `Summarize this MFI loan inspection data in Bengali. Focus on total volume, trends in loan sectors, and general compliance based on comments. 
            Data: ${JSON.stringify(summaryData)}`,
        });
        return response.text?.trim();
    } catch (error) {
        return "সারসংক্ষেপ তৈরি করা সম্ভব হয়নি।";
    }
};

export const validateEntries = async (entries: LoanEntry[]) => {
  if (entries.length === 0) return "যাচাই করার জন্য কোন ডাটা নেই।";

  const validationPrompt = `You are a professional MFI Auditor. Analyze the following loan entries for:
  1. Interest calculation inconsistencies (check if Total Interest seems reasonable for the Loan Amount).
  2. Policy compliance issues mentioned in comments.
  3. Unusual outliers (e.g., extremely high amounts for a specific sector).
  4. Missing or incomplete critical information.

  Loan Data: ${JSON.stringify(entries.map(e => ({
    id: e.id,
    borrower: e.borrowerInfo,
    amount: e.loanAmount,
    interest: e.totalInterest,
    sector: e.loanSector,
    comment: e.inspectionComments
  })))}

  Provide your findings in Bengali as a concise list of observations. If everything looks correct, state that the data appears consistent.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: validationPrompt,
      config: {
        thinkingConfig: { thinkingBudget: 4000 }
      }
    });
    return response.text?.trim();
  } catch (error) {
    console.error("Validation error:", error);
    return "ডাটা যাচাই করা সম্ভব হয়নি। অনুগ্রহ করে পরে চেষ্টা করুন।";
  }
};
