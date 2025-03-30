import LlamaAI from 'llamaai';


const apiToken = process.env.REACT_APP_LLAMA_API_KEY;
const llamaAPI = new LlamaAI(apiToken);

export default function generateEmail(recruiter, userInfo, callback) {
  // Just as an example, you could collect relevant details from `recruiter` here
  // and inject them into your prompt. For now, we'll demonstrate a direct prompt:
  const apiRequestJson = {
    "model": "llama3.1-70b",
    "messages": [
      {
        "role": "user",
        "content": `
        Write a concise, semi-formal, high-quality cold email introducing myself to recruiter ${recruiter.name} at ${recruiter.company}, 
        in first person. Each sentence should be under 10 to 15 words. Use the recruiter's bio and current hiring needs 
        to personalize the email. Show genuine curiosity about the recruiter and their company, but avoid a direct job pitch. 
        Instead, express friendly openness to opportunities and highlight alignment with one position they're hiring for. 
        Relevant recruiter info: ${recruiter.bio}, current roles: ${JSON.stringify(recruiter.hiring)}, current history: ${JSON.stringify(recruiter.history)}.
        Relevant info about myself (the applicant): ${userInfo.bio}, name: ${userInfo.name}, current school: ${userInfo.school}, current major: ${userInfo.major}, current interests: ${userInfo.interests}
        Think about matching myself to a current role that the recruiter has available if my profile fits the description, otherwise, do not. 
        Feel free to disclude any information given it is irrelevant.

        Dont overhype the recruiter(you are not impressed or intrigued by their work) so not talk about it
        Start with an brief introduction
        
        Format your response exactly as follows:
        SUBJECT: [Create an engaging, concise subject line]
        
        [Your email body here]`
      }
    ],
    // You can also include other parameters like temperature, max_tokens, etc.
    // "temperature": 0.7,
    // "max_tokens": 500
  };

  llamaAPI.run(apiRequestJson)
    .then(response => {
      console.log("Cold Email Response:", response);
      if (callback && typeof callback === 'function') {
        const fullContent = response.choices[0].message.content;
        // Parse out the subject and body
        const subjectMatch = fullContent.match(/SUBJECT: (.*?)(?:\n\n|\n)([\s\S]*)/);
        if (subjectMatch && subjectMatch.length >= 3) {
          const subject = subjectMatch[1].trim();
          const content = subjectMatch[2].trim();
          callback({ subject, content });
        } else {
          // Fallback in case the format doesn't match
          callback({ 
            subject: `Introduction - ${userInfo.name || 'Prospective Candidate'}`, 
            content: fullContent 
          });
        }
      }
    })
    .catch(error => {
      console.error("Error generating cold email:", error);
      if (callback && typeof callback === 'function') {
        callback({ 
          subject: "Error generating email", 
          content: "Error generating email: " + error.message 
        });
      }
    });
}